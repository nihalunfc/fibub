// GenBank flat file reader and writer for plasmid maps: LOCUS, DEFINITION, FEATURES (locations with join, order,
// complement, < > partial ends and single bases) and ORIGIN. Positions are kept 0-based with an exclusive end, the
// same as Biopython's SeqIO, which the tests check against. Remote locations (another record's accession) are skipped.

export type Part = { start: number; end: number; strand: 1 | -1; lt?: boolean; gt?: boolean };
export type Feature = { type: string; parts: Part[]; quals: [string, string | null][] };
export type GbRecord = { name: string; definition: string; circular: boolean; seq: string; features: Feature[]; skipped: number; records: number };

export const strandOf = (f: Feature): 1 | -1 | 0 => (f.parts.every((p) => p.strand === 1) ? 1 : f.parts.every((p) => p.strand === -1) ? -1 : 0);
export const qual = (f: Feature, k: string) => f.quals.find((q) => q[0] === k)?.[1] ?? undefined;
export function labelOf(f: Feature) {
  for (const k of ['label', 'gene', 'product', 'locus_tag', 'note']) { const v = qual(f, k); if (v) return v.length > 40 ? v.slice(0, 38) + '…' : v; }
  return f.type;
}
/** Total length on the sequence, counting each part once. */
export const featureLength = (f: Feature) => f.parts.reduce((a, p) => a + p.end - p.start, 0);

/** Split at top-level commas. */
function splitArgs(s: string) {
  const out: string[] = []; let depth = 0, cur = '';
  for (const c of s) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur); return out;
}

/** Parse one location string. Returns null when it cannot be read or points into another record. */
export function parseLocation(raw: string): Part[] | null {
  const s = raw.replace(/\s+/g, '');
  const m = /^(complement|join|order)\((.*)\)$/.exec(s);
  if (m) {
    if (m[1] === 'complement') {
      const inner = parseLocation(m[2]); if (!inner) return null;
      return inner.reverse().map((p) => ({ ...p, strand: (p.strand === 1 ? -1 : 1) as 1 | -1, lt: p.gt, gt: p.lt }));
    }
    const parts: Part[] = [];
    for (const a of splitArgs(m[2])) { const r = parseLocation(a); if (!r) return null; parts.push(...r); }
    return parts.length ? parts : null;
  }
  if (s.includes(':')) return null;
  let r = /^(<)?(\d+)\.\.(>)?(\d+)$/.exec(s);
  if (r) {
    const a = +r[2], b = +r[4]; if (a < 1 || b < a) return null;
    return [{ start: a - 1, end: b, strand: 1, ...(r[1] ? { lt: true } : {}), ...(r[3] ? { gt: true } : {}) }];
  }
  r = /^(\d+)\^(\d+)$/.exec(s);
  if (r) return [{ start: +r[1], end: +r[1], strand: 1 }];
  r = /^([<>])?(\d+)$/.exec(s);
  if (r && +r[2] >= 1) return [{ start: +r[2] - 1, end: +r[2], strand: 1, ...(r[1] === '<' ? { lt: true } : r[1] === '>' ? { gt: true } : {}) }];
  return null;
}

function partText(p: Part) {
  if (p.end === p.start) return `${p.start}^${p.start + 1}`;
  if (p.end - p.start === 1 && !p.lt && !p.gt) return `${p.end}`;
  return `${p.lt ? '<' : ''}${p.start + 1}..${p.gt ? '>' : ''}${p.end}`;
}
/** Location string for a feature, in GenBank style. */
export function formatLocation(f: Feature) {
  const st = strandOf(f);
  if (st === -1) {
    const fwd = [...f.parts].reverse().map((p) => ({ ...p, lt: p.gt, gt: p.lt }));
    const inner = fwd.length > 1 ? `join(${fwd.map(partText).join(',')})` : partText(fwd[0]);
    return `complement(${inner})`;
  }
  const txt = f.parts.map((p) => (p.strand === -1 ? `complement(${partText({ ...p, lt: p.gt, gt: p.lt })})` : partText(p)));
  return txt.length > 1 ? `join(${txt.join(',')})` : txt[0];
}

/** Read the first record of a GenBank file. */
export function parseGenBank(text: string): GbRecord {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const records = lines.filter((l) => l.startsWith('LOCUS ')).length;
  let i = lines.findIndex((l) => l.startsWith('LOCUS '));
  if (i < 0) throw new Error('No LOCUS line: this does not look like a GenBank file.');
  const loc = lines[i].split(/\s+/);
  const rec: GbRecord = { name: loc[1] ?? 'record', definition: '', circular: /\bcircular\b/i.test(lines[i]), seq: '', features: [], skipped: 0, records };
  i++;
  let section = '';
  let cur: { type: string; loc: string[]; quals: [string, string[]][] } | null = null;
  const finish = () => {
    if (!cur) return;
    const parts = parseLocation(cur.loc.join(''));
    if (!parts) { rec.skipped++; cur = null; return; }
    const quals: [string, string | null][] = cur.quals.map(([k, v]) => {
      if (!v.length) return [k, null];
      let val = v.join(k === 'translation' ? '' : ' ');
      if (val.startsWith('"')) val = val.replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"');
      if (k === 'translation') val = val.replace(/\s+/g, '');
      return [k, val];
    });
    rec.features.push({ type: cur.type, parts, quals });
    cur = null;
  };
  let seq: string[] = [];
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('//')) break;
    if (/^[A-Z]/.test(l)) { finish(); section = l.split(/\s+/)[0]; if (section === 'DEFINITION') rec.definition = l.slice(12).trim(); continue; }
    if (section === 'DEFINITION' && l.startsWith('            ')) { rec.definition += ' ' + l.trim(); continue; }
    if (section === 'FEATURES') {
      if (/^ {5}\S/.test(l)) { finish(); const t = l.slice(5, 21).trim(); cur = { type: t, loc: [l.slice(21).trim()], quals: [] }; continue; }
      if (!cur || !/^ {21}/.test(l)) continue;
      const body = l.slice(21).trimEnd();
      const qm = /^\/([^=\s]+)(?:=(.*))?$/.exec(body);
      const inQuote = cur.quals.length > 0 && (() => { const v = cur!.quals[cur!.quals.length - 1][1]; if (!v.length || !v[0].startsWith('"')) return false; const all = v.join(' '); return ((all.match(/"/g) ?? []).length % 2) === 1; })();
      if (qm && !inQuote) cur.quals.push([qm[1], qm[2] === undefined ? [] : [qm[2]]]);
      else if (cur.quals.length) cur.quals[cur.quals.length - 1][1].push(body.trim());
      else cur.loc.push(body.trim());
      continue;
    }
    if (section === 'ORIGIN') seq.push(l.replace(/[^A-Za-z]/g, ''));
  }
  finish();
  rec.seq = seq.join('').toUpperCase();
  rec.definition = rec.definition.replace(/\.$/, '');
  return rec;
}

/** Wrap a qualifier or location onto 79-column lines with the 21-space indent. */
function wrap(text: string, breakAnywhere: boolean) {
  const W = 58, out: string[] = []; let s = text;
  while (s.length > W) {
    let cut = W;
    if (!breakAnywhere) { const sp = s.lastIndexOf(' ', W); const cm = s.lastIndexOf(',', W - 1); const b = Math.max(sp, cm >= 0 ? cm + 1 : -1); if (b > 0) cut = b; }
    out.push(s.slice(0, cut).trimEnd()); s = s.slice(cut).replace(/^ /, '');
  }
  out.push(s);
  return out.map((x) => ' '.repeat(21) + x).join('\n');
}

/** Write a record as a GenBank flat file. `date` is like 09-NOV-2026. */
export function writeGenBank(rec: { name: string; definition: string; circular: boolean; seq: string; features: Feature[] }, date: string) {
  const name = (rec.name.replace(/\s+/g, '_') || 'record').slice(0, 16);
  const out = [`LOCUS       ${name.padEnd(16)} ${String(rec.seq.length).padStart(11)} bp    DNA     ${(rec.circular ? 'circular' : 'linear').padEnd(8)} SYN ${date}`];
  out.push(`DEFINITION  ${(rec.definition || name).replace(/\.?$/, '.')}`);
  out.push('FEATURES             Location/Qualifiers');
  for (const f of rec.features) {
    const loc = wrap(formatLocation(f), false).slice(21);
    out.push(`     ${f.type.padEnd(16)}${loc}`);
    for (const [k, v] of f.quals) {
      if (v === null) { out.push(' '.repeat(21) + `/${k}`); continue; }
      const bare = /^\d+$/.test(v) && ['codon_start', 'transl_table'].includes(k);
      out.push(wrap(`/${k}=${bare ? v : `"${v.replace(/"/g, '""')}"`}`, k === 'translation'));
    }
  }
  out.push('ORIGIN');
  const s = rec.seq.toLowerCase();
  for (let i = 0; i < s.length; i += 60) {
    const groups: string[] = []; for (let j = i; j < Math.min(i + 60, s.length); j += 10) groups.push(s.slice(j, j + 10));
    out.push(`${String(i + 1).padStart(9)} ${groups.join(' ')}`);
  }
  out.push('//');
  return out.join('\n') + '\n';
}

/** Move the origin so that 0-based position `p` becomes base 1. Parts that cross the new origin are split, and
 *  neighbouring parts that become one stretch (a feature that used to cross the old origin) are joined again. */
export function rotate<T extends { seq: string; features: Feature[] }>(rec: T, p: number): T {
  const L = rec.seq.length; p = ((p % L) + L) % L;
  if (!p) return rec;
  const feats = rec.features.map((f) => {
    const parts: Part[] = [];
    for (const q of f.parts) {
      const s = q.start - p, e = q.end - p;
      const pieces: Part[] = s >= 0 ? [{ ...q, start: s, end: e }] : e <= 0 ? [{ ...q, start: s + L, end: e + L }] : [{ ...q, start: s + L, end: L, gt: false }, { ...q, start: 0, end: e, lt: false }];
      parts.push(...(q.strand === -1 ? pieces.reverse() : pieces));
    }
    const merged: Part[] = [];
    for (const q of parts) {
      const last = merged[merged.length - 1];
      if (last && last.strand === q.strand && q.strand === 1 && last.end === q.start) { last.end = q.end; last.gt = q.gt; }
      else if (last && last.strand === q.strand && q.strand === -1 && q.end === last.start) { last.start = q.start; last.lt = q.lt; }
      else merged.push({ ...q });
    }
    return { ...f, parts: merged };
  });
  return { ...rec, seq: rec.seq.slice(p) + rec.seq.slice(0, p), features: feats };
}

const COMP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N', R: 'Y', Y: 'R', S: 'S', W: 'W', K: 'M', M: 'K', B: 'V', V: 'B', D: 'H', H: 'D' };
/** The feature's own sequence, read 5' to 3' on its strand (parts in biological order). */
export function extract(seq: string, f: Feature) {
  return f.parts.map((p) => { const s = seq.slice(p.start, p.end); return p.strand === 1 ? s : [...s].reverse().map((c) => COMP[c] ?? 'N').join(''); }).join('');
}
