// Seismogram files: SAC binary (both byte orders; read and write) and miniSEED 2 (fixed header, blockettes 1000 and
// 1001, encodings INT16, INT32, FLOAT32, FLOAT64, Steim-1 and Steim-2). Written by fibub from the format
// descriptions (SAC user manual header layout; SEED 2.4 manual, chapter 8 and appendix B). Plain code, no DOM.

export type Trace = {
  net: string; sta: string; loc: string; cha: string;
  /** Start time in milliseconds since 1970 (UTC), with sub-millisecond precision kept as a fraction. */
  start: number;
  /** Samples per second. */
  fs: number;
  data: Float64Array;
  /** Where it came from and anything worth knowing. */
  notes: string[];
  /** SAC extras when present. */
  sac?: { b: number; picks: { name: string; t: number }[]; dist?: number; evdp?: number; mag?: number };
};

export const traceId = (t: Pick<Trace, 'net' | 'sta' | 'loc' | 'cha'>) => [t.net, t.sta, t.loc, t.cha].join('.');

const UNDEF = -12345;
const cleanStr = (b: Uint8Array) => new TextDecoder('latin1').decode(b).replace(/\0.*$/s, '').trim();
const isUndefStr = (s: string) => s === '-12345' || s === '';

/** Milliseconds since 1970 for a year, day of year, hour, minute, second and fraction (ms). */
export function yjToMs(year: number, jday: number, h: number, m: number, s: number, ms: number): number {
  return Date.UTC(year, 0, 1) + (jday - 1) * 86400000 + h * 3600000 + m * 60000 + s * 1000 + ms;
}

/** ISO text for a time in ms (to 0.0001 s). */
export function isoTime(ms: number): string {
  const whole = Math.floor(ms), d = new Date(whole), frac = ms - whole;
  const sec = d.getUTCSeconds() + (d.getUTCMilliseconds() + frac) / 1000;
  const p2 = (v: number) => String(v).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}T${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${sec.toFixed(4).padStart(7, '0')}Z`;
}

/** True when the bytes look like a SAC binary file (in either byte order). */
export function sniffSac(buf: Uint8Array): boolean {
  if (buf.length < 632) return false;
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  return [true, false].some((le) => { const v = dv.getInt32(304, le); return v === 6 || v === 7; });
}

/** Read a SAC binary file (evenly sampled time series). */
export function readSac(buf: Uint8Array): Trace {
  if (buf.length < 632) throw new Error('This file is too short to be a SAC file (the header alone is 632 bytes)');
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let le: boolean;
  if ([6, 7].includes(dv.getInt32(304, true))) le = true;
  else if ([6, 7].includes(dv.getInt32(304, false))) le = false;
  else throw new Error('Not a SAC binary file: the header version (NVHDR) is not 6 or 7. SAC alphanumeric (text) files are not read');
  const F = (i: number) => dv.getFloat32(i * 4, le), I = (i: number) => dv.getInt32(280 + i * 4, le);
  const K = (off: number, len = 8) => cleanStr(buf.subarray(440 + off, 440 + off + len));
  const npts = I(9), iftype = I(15), leven = I(35), delta = F(0);
  if (iftype !== 1 && iftype !== UNDEF) throw new Error('This SAC file holds a spectrum or x-y data, not a time series (IFTYPE is not ITIME)');
  if (leven === 0) throw new Error('This SAC file is unevenly sampled (LEVEN is false); only evenly sampled traces are read');
  if (!(npts > 0)) throw new Error('This SAC file has no samples (NPTS is 0)');
  if (!(delta > 0)) throw new Error('This SAC file has no valid sample interval (DELTA)');
  if (632 + npts * 4 > buf.length) throw new Error(`This SAC file is cut short: the header says ${npts} samples but only ${Math.floor((buf.length - 632) / 4)} are there`);
  const data = new Float64Array(npts);
  for (let i = 0; i < npts; i++) data[i] = dv.getFloat32(632 + i * 4, le);
  const yr = I(0), jd = I(1), b = F(5);
  const notes = [`SAC binary, ${le ? 'little' : 'big'}-endian, header version ${I(6)}`];
  let ref = 0;
  if (yr !== UNDEF && jd !== UNDEF) ref = yjToMs(yr, jd, Math.max(0, I(2)), Math.max(0, I(3)), Math.max(0, I(4)), Math.max(0, I(5)));
  else notes.push('No reference date in the header: times count from 1970-01-01');
  const bb = b === UNDEF ? 0 : b;
  // Delta is stored as 32-bit float: round the rate to a sensible value (e.g. 0.01 → 100 Hz exactly).
  const raw = 1 / delta, fs = Math.abs(raw - Math.round(raw * 1e4) / 1e4) < raw * 1e-6 ? Math.round(raw * 1e4) / 1e4 : raw;
  const picks: { name: string; t: number }[] = [];
  const named = (fi: number, ko: number, def: string) => { const v = F(fi); if (v !== UNDEF) { const k = K(ko); picks.push({ name: isUndefStr(k) ? def : k, t: v }); } };
  named(8, 40, 'A');
  for (let j = 0; j < 10; j++) named(10 + j, 48 + j * 8, `T${j}`);
  const opt = (v: number) => (v === UNDEF ? undefined : v);
  const s = (o: number, l = 8) => { const v = K(o, l); return isUndefStr(v) ? '' : v; };
  return { net: s(168), sta: s(0), loc: s(24), cha: s(160), start: ref + bb * 1000, fs, data, notes, sac: { b: bb, picks, dist: opt(F(50)), evdp: opt(F(38)), mag: opt(F(39)) } };
}

/** Write a SAC binary file (little-endian, header version 6). */
export function writeSac(t: Pick<Trace, 'net' | 'sta' | 'loc' | 'cha' | 'start' | 'fs' | 'data'>, picks: { name: string; t: number }[] = []): Uint8Array {
  const n = t.data.length, buf = new Uint8Array(632 + 4 * n), dv = new DataView(buf.buffer);
  for (let i = 0; i < 70; i++) dv.setFloat32(i * 4, UNDEF, true);
  for (let i = 0; i < 40; i++) dv.setInt32(280 + i * 4, UNDEF, true);
  const enc = new TextEncoder();
  for (let off = 0; off < 192; off += 8) buf.set(enc.encode('-12345  '), 440 + off);
  buf.set(enc.encode('-12345          '), 448);
  const K = (off: number, s: string, len = 8) => { const b = new Uint8Array(len).fill(32); b.set(enc.encode(s.slice(0, len))); buf.set(b, 440 + off); };
  // Reference time = first sample, rounded down to the millisecond; B holds the rest.
  const ms = Math.floor(t.start), d = new Date(ms), jday = Math.floor((ms - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000) + 1;
  let lo = Infinity, hi = -Infinity, sum = 0;
  for (const v of t.data) { lo = Math.min(lo, v); hi = Math.max(hi, v); sum += v; }
  const F = (i: number, v: number) => dv.setFloat32(i * 4, v, true), I = (i: number, v: number) => dv.setInt32(280 + i * 4, v, true);
  F(0, 1 / t.fs); F(1, lo); F(2, hi); F(3, 1); F(5, (t.start - ms) / 1000); F(6, (t.start - ms) / 1000 + (n - 1) / t.fs); F(56, sum / n);
  I(0, d.getUTCFullYear()); I(1, jday); I(2, d.getUTCHours()); I(3, d.getUTCMinutes()); I(4, d.getUTCSeconds()); I(5, d.getUTCMilliseconds());
  I(6, 6); I(9, n); I(15, 1); I(16, 5); I(17, 9); I(35, 1); I(36, 0); I(37, 1); I(38, 1);
  picks.slice(0, 10).forEach((p, j) => { F(10 + j, p.t); K(48 + j * 8, p.name); });
  K(0, t.sta || 'FIBUB'); K(24, t.loc || ''); K(160, t.cha || ''); K(168, t.net || '');
  for (let i = 0; i < n; i++) dv.setFloat32(632 + i * 4, t.data[i], true);
  return buf;
}

/** Steim-1 decompression of one record's data frames (big-endian words unless le). */
export function steim1(frames: Uint8Array, nsamp: number, le = false): { data: Float64Array; xn: number; check: boolean } {
  return steim(frames, nsamp, le, 1);
}
/** Steim-2 decompression. */
export function steim2(frames: Uint8Array, nsamp: number, le = false): { data: Float64Array; xn: number; check: boolean } {
  return steim(frames, nsamp, le, 2);
}

const sx = (v: number, bits: number) => (v << (32 - bits)) >> (32 - bits);

function steim(frames: Uint8Array, nsamp: number, le: boolean, level: 1 | 2) {
  const dv = new DataView(frames.buffer, frames.byteOffset, frames.byteLength);
  const nf = Math.floor(frames.length / 64), diffs: number[] = [];
  let x0 = 0, xn = 0;
  for (let f = 0; f < nf && diffs.length < nsamp; f++) {
    const base = f * 64, ctrl = dv.getUint32(base, le);
    for (let w = 1; w < 16; w++) {
      const code = (ctrl >>> (30 - 2 * w)) & 3, word = dv.getUint32(base + 4 * w, le) | 0;
      if (f === 0 && w === 1) { x0 = word; continue; }
      if (f === 0 && w === 2) { xn = word; continue; }
      if (code === 0) continue;
      // Byte differences are in stored order; 16-bit halves follow the word order (as libmseed reads them).
      if (code === 1) { for (let k = 0; k < 4; k++) diffs.push(dv.getInt8(base + 4 * w + k)); continue; }
      if (level === 1) {
        if (code === 2) { diffs.push(dv.getInt16(base + 4 * w, le), dv.getInt16(base + 4 * w + 2, le)); continue; }
        diffs.push(word); continue;
      }
      const dnib = (word >>> 30) & 3;
      if (code === 2) {
        if (dnib === 1) diffs.push(sx(word, 30));
        else if (dnib === 2) diffs.push(sx(word >>> 15, 15), sx(word, 15));
        else if (dnib === 3) diffs.push(sx(word >>> 20, 10), sx(word >>> 10, 10), sx(word, 10));
        else throw new Error('Steim-2: bad sub-code in a data word');
      } else {
        if (dnib === 0) for (let k = 0; k < 5; k++) diffs.push(sx(word >>> (24 - 6 * k), 6));
        else if (dnib === 1) for (let k = 0; k < 6; k++) diffs.push(sx(word >>> (25 - 5 * k), 5));
        else if (dnib === 2) for (let k = 0; k < 7; k++) diffs.push(sx(word >>> (24 - 4 * k), 4));
        else throw new Error('Steim-2: bad sub-code in a data word');
      }
    }
  }
  if (diffs.length < nsamp) throw new Error(`Steim-${level}: the record holds ${diffs.length} differences but says ${nsamp} samples`);
  const data = new Float64Array(nsamp);
  if (nsamp) data[0] = x0;
  for (let i = 1; i < nsamp; i++) data[i] = (data[i - 1] + diffs[i]) | 0;
  return { data, xn, check: nsamp === 0 || data[nsamp - 1] === xn };
}

export const ENCODINGS: Record<number, string> = { 0: 'ASCII text', 1: 'INT16', 2: 'INT24', 3: 'INT32', 4: 'FLOAT32', 5: 'FLOAT64', 10: 'Steim-1', 11: 'Steim-2', 19: 'Steim-3', 30: 'SRO', 32: 'DWWSSN', 33: 'RSTN' };

/** True when the bytes look like miniSEED 2 (a data record header). */
export function sniffMseed(buf: Uint8Array): boolean {
  if (buf.length < 48) return false;
  const q = String.fromCharCode(buf[6]);
  if (!'DRQM'.includes(q)) return false;
  if (!/^[0-9 ]{6}$/.test(String.fromCharCode(...buf.subarray(0, 6))) && !/^\d{0,6}\0*$/.test(String.fromCharCode(...buf.subarray(0, 6)))) return false;
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  return [false, true].some((le) => { const y = dv.getUint16(20, le), d = dv.getUint16(22, le); return y >= 1900 && y <= 2100 && d >= 1 && d <= 366; });
}

type Rec = { id: string; net: string; sta: string; loc: string; cha: string; start: number; fs: number; data: Float64Array; enc: number; check: boolean };

/** Read all data records of a miniSEED 2 file; join records of one channel into traces (a gap starts a new trace). */
export function readMseed(buf: Uint8Array): Trace[] {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength), recs: Rec[] = [];
  const encSeen = new Set<number>(), notes: string[] = [];
  let off = 0, badCheck = 0;
  while (off + 48 <= buf.length) {
    const q = String.fromCharCode(buf[off + 6]);
    if (!'DRQM'.includes(q)) {
      // Blank or non-data records (V, A, S, T blockettes or padding): skip by 256 bytes, the smallest length.
      off += 256; continue;
    }
    let le = false;
    { const y = dv.getUint16(off + 20, false), d = dv.getUint16(off + 22, false); if (!(y >= 1900 && y <= 2100 && d >= 1 && d <= 366)) le = true; }
    const year = dv.getUint16(off + 20, le), jday = dv.getUint16(off + 22, le), hh = buf[off + 24], mi = buf[off + 25], ss = buf[off + 26], tenth = dv.getUint16(off + 28, le);
    if (!(year >= 1900 && year <= 2100 && jday >= 1 && jday <= 366)) throw new Error(`Record at byte ${off}: the start time is not readable; this does not look like miniSEED`);
    const nsamp = dv.getUint16(off + 30, le), fac = dv.getInt16(off + 32, le), mul = dv.getInt16(off + 34, le);
    const act = buf[off + 36], nb = buf[off + 39], tcorr = dv.getInt32(off + 40, le), dataOff = dv.getUint16(off + 44, le);
    let bOff = dv.getUint16(off + 46, le), enc = -1, wo = 1, reclen = 0, usec = 0;
    for (let k = 0; k < Math.max(nb, 1) && bOff >= 48 && bOff + 4 <= 65536; k++) {
      const type = dv.getUint16(off + bOff, le), next = dv.getUint16(off + bOff + 2, le);
      if (type === 1000) { enc = buf[off + bOff + 4]; wo = buf[off + bOff + 5]; reclen = 2 ** buf[off + bOff + 6]; }
      else if (type === 1001) usec = dv.getInt8(off + bOff + 5);
      if (!next) break;
      bOff = next;
    }
    if (enc < 0) throw new Error(`Record at byte ${off} has no blockette 1000, so its encoding and length are unknown. Only miniSEED with blockette 1000 is read`);
    if (!(reclen >= 128 && off + reclen <= buf.length)) throw new Error(`Record at byte ${off}: record length ${reclen} runs past the end of the file`);
    const fs = fac > 0 ? (mul >= 0 ? fac * (mul || 1) : -fac / mul) : fac < 0 ? (mul >= 0 ? (mul || 1) / -fac : 1 / (fac * mul)) : 0;
    let startMs = yjToMs(year, jday, hh, mi, ss, tenth / 10) + usec / 1000;
    if (!(act & 2) && tcorr) startMs += tcorr / 10;
    const body = buf.subarray(off + dataOff, off + reclen), bdv = new DataView(body.buffer, body.byteOffset, body.byteLength), ble = wo === 0;
    let data: Float64Array, check = true;
    encSeen.add(enc);
    if (enc === 10 || enc === 11) { const r = enc === 10 ? steim1(body, nsamp, ble) : steim2(body, nsamp, ble); data = r.data; check = r.check; }
    else if (enc === 1 || enc === 3 || enc === 4 || enc === 5) {
      const size = enc === 1 ? 2 : enc === 5 ? 8 : 4;
      if (nsamp * size > body.length) throw new Error(`Record at byte ${off}: ${nsamp} samples do not fit in the record`);
      data = new Float64Array(nsamp);
      for (let i = 0; i < nsamp; i++) data[i] = enc === 1 ? bdv.getInt16(2 * i, ble) : enc === 3 ? bdv.getInt32(4 * i, ble) : enc === 4 ? bdv.getFloat32(4 * i, ble) : bdv.getFloat64(8 * i, ble);
    } else throw new Error(`This file uses the ${ENCODINGS[enc] ?? `code ${enc}`} encoding. Only INT16, INT32, FLOAT32, FLOAT64, Steim-1 and Steim-2 are read`);
    if (!check) badCheck++;
    const s = (a: number, l: number) => String.fromCharCode(...buf.subarray(off + a, off + a + l)).replace(/\0/g, '').trim();
    const net = s(18, 2), sta = s(8, 5), loc = s(13, 2), cha = s(15, 3);
    if (nsamp > 0 && fs > 0) recs.push({ id: [net, sta, loc, cha].join('.'), net, sta, loc, cha, start: startMs, fs, data, enc, check });
    off += reclen;
  }
  if (!recs.length) throw new Error('No data records with samples were found in this miniSEED file');
  if (badCheck) notes.push(`${badCheck} Steim record${badCheck > 1 ? 's' : ''} did not end on the stored last sample: the data may be damaged`);
  // Group by channel, sort by time, join where the next record starts one sample after the last.
  const out: Trace[] = [];
  const ids = [...new Set(recs.map((r) => r.id))];
  for (const id of ids) {
    const rs = recs.filter((r) => r.id === id).sort((a, b) => a.start - b.start);
    let cur: { r: Rec; parts: Float64Array[]; n: number } | null = null;
    const flush = () => { if (!cur) return; const d = new Float64Array(cur.n); let k = 0; for (const p of cur.parts) { d.set(p, k); k += p.length; } out.push({ net: cur.r.net, sta: cur.r.sta, loc: cur.r.loc, cha: cur.r.cha, start: cur.r.start, fs: cur.r.fs, data: d, notes: [`miniSEED, ${[...encSeen].map((e) => ENCODINGS[e]).join(', ')}`, ...notes] }); };
    for (const r of rs) {
      if (cur && r.fs === cur.r.fs && Math.abs(r.start - (cur.r.start + (cur.n * 1000) / cur.r.fs)) <= 500 / r.fs) { cur.parts.push(r.data); cur.n += r.data.length; }
      else { flush(); cur = { r, parts: [r.data], n: r.data.length }; }
    }
    flush();
  }
  // Mark split channels.
  const count = new Map<string, number>();
  for (const t of out) count.set(traceId(t), (count.get(traceId(t)) ?? 0) + 1);
  for (const t of out) if ((count.get(traceId(t)) ?? 0) > 1) t.notes.push('This channel has gaps or overlaps, so it is split into several traces');
  return out;
}
