// Audiogram maths: reading thresholds, pure-tone averages, degree of hearing loss from an editable scheme,
// air-bone gaps, type of loss and interaural asymmetry. Symbols follow ASHA (1990) Guidelines for audiometric symbols.
import { num } from './num.ts';

export type Ear = 'R' | 'L';
export type Cond = 'air' | 'bone';
export type Threshold = { db: number; masked: boolean; nr: boolean };
export type Row = { freq: number; R: { air?: Threshold; bone?: Threshold }; L: { air?: Threshold; bone?: Threshold } };
export type Audiogram = { rows: Row[]; warnings: string[] };

const COLS: [Ear, Cond][] = [['R', 'air'], ['L', 'air'], ['R', 'bone'], ['L', 'bone']];

/** One cell: "35", "35m" (masked), "95NR" or "NR 95" (no response at that level), blank or "-" for not tested. */
export function parseCell(s: string): Threshold | null | Error {
  let t = (s ?? '').trim();
  if (!t || /^[-–—.]$/.test(t)) return null;
  let masked = false, nr = false;
  if (/nr|↓/i.test(t)) { nr = true; t = t.replace(/nr|↓/gi, ''); }
  if (/m$/i.test(t.trim())) { masked = true; t = t.trim().replace(/m$/i, ''); }
  t = t.replace(/db/i, '').trim();
  if (nr && !t) return new Error(`"${s.trim()}": give the highest level tested with no response, such as 95NR`);
  const db = num(t);
  if (!Number.isFinite(db)) return new Error(`"${s.trim()}" is not a threshold in dB HL`);
  if (db < -20 || db > 130) return new Error(`${s.trim()} dB HL is outside the audiometer range (−10 to 120)`);
  return { db, masked, nr };
}

/** Rows of: frequency (Hz or kHz), right air, left air, right bone, left bone. A header row is skipped. */
export function parseAudiogram(text: string): Audiogram {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const sep = lines.some((l) => l.includes('\t')) ? /\t/ : lines.some((l) => l.includes(';')) ? /;/ : lines.some((l) => l.includes(',')) ? /,/ : /\s+/;
  const rows: Row[] = [], warnings: string[] = [];
  lines.forEach((line, i) => {
    const c = line.split(sep).map((x) => x.trim());
    let f = num(c[0].replace(/\s*k?hz$/i, ''));
    if (!Number.isFinite(f)) { if (i === 0) return; throw new Error(`Line ${i + 1}: "${c[0]}" is not a frequency`); }
    if (/khz/i.test(c[0]) || f <= 16) f *= 1000;
    if (f < 125 || f > 16000) throw new Error(`Line ${i + 1}: ${f} Hz is outside 125 to 16,000 Hz`);
    if (rows.some((r) => r.freq === f)) throw new Error(`Line ${i + 1}: ${f} Hz is listed twice`);
    const row: Row = { freq: f, R: {}, L: {} };
    COLS.forEach(([ear, cond], j) => {
      const v = parseCell(c[j + 1] ?? '');
      if (v instanceof Error) throw new Error(`Line ${i + 1}, ${ear === 'R' ? 'right' : 'left'} ${cond}: ${v.message}`);
      if (v) { row[ear][cond] = v; if (v.db % 5 !== 0) warnings.push(`${f} Hz ${ear === 'R' ? 'right' : 'left'} ${cond} ${v.db} dB is not a 5 dB step`); }
    });
    rows.push(row);
  });
  rows.sort((a, b) => a.freq - b.freq);
  if (!rows.some((r) => r.R.air || r.L.air || r.R.bone || r.L.bone)) throw new Error('Type at least one threshold: a frequency, then right air, left air, right bone, left bone.');
  return { rows, warnings };
}

export const PTA3 = [500, 1000, 2000], PTA4 = [500, 1000, 2000, 4000];
/** Mean threshold over the given frequencies; null with the missing ones listed if any is not tested. */
export function pta(a: Audiogram, ear: Ear, cond: Cond, freqs: number[]): { value: number | null; missing: number[]; nr: boolean } {
  const v: number[] = [], missing: number[] = []; let nr = false;
  for (const f of freqs) { const t = a.rows.find((r) => r.freq === f)?.[ear][cond]; if (t) { v.push(t.db); nr ||= t.nr; } else missing.push(f); }
  return { value: missing.length ? null : v.reduce((s, x) => s + x, 0) / v.length, missing, nr };
}

export type Band = { label: string; op: '<' | '<=' | null; limit: number };
/** A scheme written as lines "Label < 20" or "Label ≤ 15"; the last line, without a number, is everything above. */
export function parseScheme(text: string): Band[] {
  const out: Band[] = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  lines.forEach((l, i) => {
    const m = /^(.*?)\s*(<=|≤|<)\s*(-?[\d.]+)\s*(db(\s*hl)?)?$/i.exec(l);
    if (m) {
      const limit = Number(m[3]);
      if (!m[1]) throw new Error(`Scheme line ${i + 1}: give a name before the cutoff`);
      if (out.length && limit < out[out.length - 1].limit) throw new Error(`Scheme line ${i + 1}: cutoffs must rise from top to bottom`);
      out.push({ label: m[1], op: m[2] === '<' ? '<' : '<=', limit });
    } else {
      if (i !== lines.length - 1) throw new Error(`Scheme line ${i + 1}: write "Name < 20" or "Name ≤ 15"; only the last line has no number`);
      out.push({ label: l, op: null, limit: Infinity });
    }
  });
  if (out.length < 2 || out[out.length - 1].op !== null) throw new Error('A scheme needs at least two lines, the last without a number (everything above).');
  return out;
}
export function grade(value: number, bands: Band[]): Band {
  return bands.find((b) => b.op === null || (b.op === '<' ? value < b.limit : value <= b.limit))!;
}

export type Gap = { freq: number; gap: number; flag: boolean };
/** Air minus bone at each frequency where both were measured. */
export function gaps(a: Audiogram, ear: Ear, limit: number): Gap[] {
  return a.rows.filter((r) => r[ear].air && r[ear].bone).map((r) => { const g = r[ear].air!.db - r[ear].bone!.db; return { freq: r.freq, gap: g, flag: g >= limit }; });
}
/**
 * Type of loss, a teaching rule: air PTA within normal → normal; else a mean air-bone gap (0.5 to 4 kHz) at or above
 * the gap limit is a conductive component; with bone thresholds within normal it is conductive, otherwise mixed;
 * no conductive component is sensorineural.
 */
export function lossType(a: Audiogram, ear: Ear, normal: number, gapLimit: number, freqs = PTA4): string {
  const air = pta(a, ear, 'air', freqs.filter((f) => a.rows.some((r) => r.freq === f && r[ear].air)));
  if (air.value === null || !Number.isFinite(air.value)) return 'not enough air thresholds';
  if (air.value <= normal && !a.rows.some((r) => freqs.includes(r.freq) && r[ear].air && r[ear].air!.db > normal)) return 'within normal limits';
  const g = gaps(a, ear, gapLimit).filter((x) => freqs.includes(x.freq));
  if (!g.length) return 'needs bone conduction to tell';
  const meanGap = g.reduce((s, x) => s + x.gap, 0) / g.length;
  const bone = g.map((x) => a.rows.find((r) => r.freq === x.freq)![ear].bone!.db);
  const boneNormal = bone.every((b) => b <= normal);
  if (meanGap >= gapLimit) return boneNormal ? 'conductive' : 'mixed';
  return 'sensorineural';
}

/** Interaural air-conduction differences, and whether ≥ diff dB is found at ≥ count adjacent tested frequencies. */
export function asymmetry(a: Audiogram, diff: number, count: number): { rows: { freq: number; d: number; worse: Ear | '' }[]; flag: boolean; run: number[] } {
  const rows = a.rows.filter((r) => r.R.air && r.L.air).map((r) => { const d = r.R.air!.db - r.L.air!.db; return { freq: r.freq, d: Math.abs(d), worse: (d > 0 ? 'R' : d < 0 ? 'L' : '') as Ear | '' }; });
  let best: number[] = [], cur: number[] = [], side: Ear | '' = '';
  for (const r of rows) {
    if (r.d >= diff && (cur.length === 0 || r.worse === side)) { cur.push(r.freq); side = r.worse; }
    else if (r.d >= diff) { cur = [r.freq]; side = r.worse; }
    else { cur = []; side = ''; }
    if (cur.length > best.length) best = [...cur];
  }
  return { rows, flag: best.length >= count, run: best };
}

export const SCHEMES: Record<string, { name: string; pta: 3 | 4; text: string; cite: string }> = {
  who2021: { name: 'WHO 2021 grades', pta: 4, cite: 'World Health Organization (2021) World report on hearing, Geneva; grades proposed by Humes LE (2019) Int J Audiol 58:12. Grades the better ear, 0.5–4 kHz average.', text: 'No hearing loss < 20\nMild < 35\nModerate < 50\nModerately severe < 65\nSevere < 80\nProfound < 95\nComplete or total' },
  clark1981: { name: 'Clark 1981', pta: 3, cite: 'Clark JG (1981) Uses and abuses of hearing loss classification, ASHA 23(7):493–500. 0.5, 1 and 2 kHz average.', text: 'Normal ≤ 15\nSlight ≤ 25\nMild ≤ 40\nModerate ≤ 55\nModerately severe ≤ 70\nSevere ≤ 90\nProfound' },
};
