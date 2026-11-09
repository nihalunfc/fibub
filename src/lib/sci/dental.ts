// Tooth numbering (FDI two-digit, Universal, Palmer), tooth names, surfaces, a chart of findings with CSV in and out,
// and the DMFT/dmft caries index. FDI: ISO 3950 two-digit system (quadrant 1–4 permanent, 5–8 primary, then the tooth
// from the midline). Universal: 1–32 from the upper right third molar round to the lower right third molar, and A–T
// for primary teeth. Palmer (Zsigmondy–Palmer): a quadrant mark and the tooth from the midline, 1–8 or A–E.
export type Quad = 'UR' | 'UL' | 'LL' | 'LR';
export type System = 'fdi' | 'universal' | 'palmer';
export const QUADS: Quad[] = ['UR', 'UL', 'LL', 'LR'];
const QUAD_NAME: Record<Quad, string> = { UR: 'upper right', UL: 'upper left', LL: 'lower left', LR: 'lower right' };
const PERM = ['central incisor', 'lateral incisor', 'canine', 'first premolar', 'second premolar', 'first molar', 'second molar', 'third molar'];
const PRIM = ['central incisor', 'lateral incisor', 'canine', 'first molar', 'second molar'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRST';

export const isPrimary = (fdi: number) => Math.floor(fdi / 10) >= 5;
export const valid = (fdi: number) => { const q = Math.floor(fdi / 10), t = fdi % 10; return Number.isInteger(fdi) && q >= 1 && q <= 8 && t >= 1 && t <= (q >= 5 ? 5 : 8); };
export const quadOf = (fdi: number): Quad => QUADS[(Math.floor(fdi / 10) - 1) % 4];
export const upper = (fdi: number) => { const q = quadOf(fdi); return q === 'UR' || q === 'UL'; };
/** Teeth in the patient's right half (drawn on the viewer's left): their mesial side faces right on the chart. */
export const patientRight = (fdi: number) => { const q = quadOf(fdi); return q === 'UR' || q === 'LR'; };
export const anterior = (fdi: number) => fdi % 10 <= 3;

export function universal(fdi: number): string {
  const q = Math.floor(fdi / 10), t = fdi % 10;
  if (q === 1) return String(9 - t);
  if (q === 2) return String(8 + t);
  if (q === 3) return String(25 - t);
  if (q === 4) return String(24 + t);
  if (q === 5) return LETTERS[5 - t];
  if (q === 6) return LETTERS[4 + t];
  if (q === 7) return LETTERS[15 - t];
  return LETTERS[14 + t];
}
const PALMER_SYM: Record<Quad, (m: string) => string> = { UR: (m) => `${m}┘`, UL: (m) => `└${m}`, LR: (m) => `${m}┐`, LL: (m) => `┌${m}` };
export function palmer(fdi: number): { quad: Quad; mark: string; text: string; symbol: string } {
  const quad = quadOf(fdi), t = fdi % 10, mark = isPrimary(fdi) ? LETTERS[t - 1] : String(t);
  return { quad, mark, text: `${quad}${mark}`, symbol: PALMER_SYM[quad](mark) };
}
export function toothName(fdi: number): string {
  const n = isPrimary(fdi) ? PRIM[(fdi % 10) - 1] : PERM[(fdi % 10) - 1];
  const s = `${QUAD_NAME[quadOf(fdi)]} ${n}${isPrimary(fdi) ? ' (primary)' : ''}`;
  return s[0].toUpperCase() + s.slice(1);
}

/** One typed tooth number in the given system, as an FDI number. Throws a plain message if it is not a tooth. */
export function parseTooth(raw: string, system: System): number {
  const s = raw.trim().replace(/^#/, '').replace(/^tooth\s*/i, '');
  if (!s) throw new Error('Type a tooth number');
  if (system === 'fdi') {
    const m = /^([1-8])\s*[.\-]?\s*([1-8])$/.exec(s);
    const f = m ? Number(m[1]) * 10 + Number(m[2]) : NaN;
    if (!valid(f)) throw new Error(`"${raw.trim()}" is not an FDI tooth (11–48 permanent, 51–85 primary)`);
    return f;
  }
  if (system === 'universal') {
    if (/^\d{1,2}$/.test(s)) {
      const n = Number(s);
      if (n < 1 || n > 32) throw new Error(`"${raw.trim()}" is not a Universal tooth (1–32 or A–T)`);
      for (const f of allTeeth(false)) if (universal(f) === String(n)) return f;
    }
    if (/^[a-t]$/i.test(s)) { for (const f of allTeeth(true)) if (universal(f) === s.toUpperCase()) return f; }
    throw new Error(`"${raw.trim()}" is not a Universal tooth (1–32 or A–T)`);
  }
  // Palmer: UR6, UL E, "6┘", "└6", "┌E", "E┐", also URA.
  let quad: Quad | null = null, mark = '';
  let m = /^(UR|UL|LL|LR)\s*([1-8a-e])$/i.exec(s);
  if (m) { quad = m[1].toUpperCase() as Quad; mark = m[2].toUpperCase(); }
  else if ((m = /^([1-8a-e])\s*([┘┐⏌⏋])$/i.exec(s))) { quad = /[┘⏌]/.test(m[2]) ? 'UR' : 'LR'; mark = m[1].toUpperCase(); }
  else if ((m = /^([└┌⎿⎾])\s*([1-8a-e])$/i.exec(s))) { quad = /[└⎿]/.test(m[1]) ? 'UL' : 'LL'; mark = m[2].toUpperCase(); }
  if (!quad) throw new Error(`"${raw.trim()}" is not a Palmer tooth (write UR6, UL E, LL3 or LR D)`);
  const prim = /[A-E]/.test(mark), t = prim ? LETTERS.indexOf(mark) + 1 : Number(mark);
  return (QUADS.indexOf(quad) + 1 + (prim ? 4 : 0)) * 10 + t;
}

/** Every tooth of a dentition in chart order: upper row from the patient's right to left, then the lower row. */
export function allTeeth(primary: boolean): number[] {
  const n = primary ? 5 : 8, o = primary ? 4 : 0, r: number[] = [];
  for (let t = n; t >= 1; t--) r.push((1 + o) * 10 + t);
  for (let t = 1; t <= n; t++) r.push((2 + o) * 10 + t);
  for (let t = n; t >= 1; t--) r.push((4 + o) * 10 + t);
  for (let t = 1; t <= n; t++) r.push((3 + o) * 10 + t);
  return r;
}

export type Surf = 'M' | 'D' | 'O' | 'B' | 'L';
export const SURFS: Surf[] = ['M', 'O', 'D', 'B', 'L'];
export function surfaceName(fdi: number, s: Surf): string {
  if (s === 'M') return 'mesial';
  if (s === 'D') return 'distal';
  if (s === 'O') return anterior(fdi) ? 'incisal' : 'occlusal';
  if (s === 'B') return anterior(fdi) ? 'labial' : 'buccal';
  return upper(fdi) ? 'palatal' : 'lingual';
}
export const surfaceLetter = (fdi: number, s: Surf) => (s === 'O' && anterior(fdi) ? 'I' : s === 'L' && upper(fdi) ? 'P' : s === 'B' && anterior(fdi) ? 'F' : s);

export type SurfCond = 'caries' | 'filled';
export type ToothCond = 'missing' | 'crown' | 'implant';
export type ToothRec = { tooth?: ToothCond; surfaces: Partial<Record<Surf, SurfCond>>; note: string };
export type Chart = Map<number, ToothRec>;
export const COND_NAMES: Record<SurfCond | ToothCond, string> = { caries: 'Caries', filled: 'Filled', missing: 'Missing', crown: 'Crown', implant: 'Implant' };

export function rec(c: Chart, fdi: number): ToothRec { let r = c.get(fdi); if (!r) { r = { surfaces: {}, note: '' }; c.set(fdi, r); } return r; }
export const empty = (r?: ToothRec) => !r || (!r.tooth && !Object.keys(r.surfaces).length && !r.note.trim());

/** Toggle a surface finding; a whole-tooth finding of missing or implant is cleared first. */
export function markSurface(c: Chart, fdi: number, s: Surf, cond: SurfCond) {
  const r = rec(c, fdi);
  if (r.tooth === 'missing' || r.tooth === 'implant') r.tooth = undefined;
  if (r.surfaces[s] === cond) delete r.surfaces[s]; else r.surfaces[s] = cond;
}
/** Toggle a whole-tooth finding. Missing and implant clear the surfaces. */
export function markTooth(c: Chart, fdi: number, cond: ToothCond) {
  const r = rec(c, fdi);
  r.tooth = r.tooth === cond ? undefined : cond;
  if (r.tooth === 'missing' || r.tooth === 'implant') r.surfaces = {};
}

export type Finding = { fdi: number; condition: string; surfaces: string; note: string };
/** The chart as findings, one per condition per tooth, in chart order. */
export function findings(c: Chart, primary: boolean | null = null): Finding[] {
  const order = [...allTeeth(false), ...allTeeth(true)].filter((f) => primary === null || isPrimary(f) === primary);
  const out: Finding[] = [];
  for (const f of order) {
    const r = c.get(f); if (empty(r)) continue;
    const note = r!.note.trim();
    let first = true;
    if (r!.tooth) { out.push({ fdi: f, condition: COND_NAMES[r!.tooth], surfaces: '', note }); first = false; }
    for (const cond of ['caries', 'filled'] as SurfCond[]) {
      const ss = SURFS.filter((s) => r!.surfaces[s] === cond);
      if (ss.length) { out.push({ fdi: f, condition: COND_NAMES[cond], surfaces: ss.map((s) => surfaceLetter(f, s)).join(''), note: first ? note : '' }); first = false; }
    }
    if (first) out.push({ fdi: f, condition: 'Note', surfaces: '', note });
  }
  return out;
}

const q = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
export const CSV_HEAD = ['fdi', 'universal', 'palmer', 'tooth', 'condition', 'surfaces', 'note'];
export function toCsv(c: Chart): string {
  return [CSV_HEAD.join(','), ...findings(c).map((x) => [String(x.fdi), universal(x.fdi), palmer(x.fdi).text, toothName(x.fdi), x.condition, x.surfaces, x.note].map(q).join(','))].join('\n') + '\n';
}
function splitCsv(line: string): string[] {
  const out: string[] = []; let cur = '', inq = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inq) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') inq = false; else cur += ch; }
    else if (ch === '"') inq = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur); return out;
}
/** Read a CSV made by toCsv (the fdi, condition, surfaces and note columns). Surfaces may use I, F and P. */
export function fromCsv(text: string): Chart {
  const lines = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n').filter((l) => l.trim());
  if (!lines.length) throw new Error('The file is empty.');
  const head = splitCsv(lines[0]).map((h) => h.trim().toLowerCase());
  const col = (n: string) => head.indexOf(n);
  if (col('fdi') < 0 || col('condition') < 0) throw new Error('This is not a dental chart CSV from this tool: it needs fdi and condition columns.');
  const c: Chart = new Map();
  const back: Record<string, Surf> = { M: 'M', D: 'D', O: 'O', I: 'O', B: 'B', F: 'B', L: 'L', P: 'L' };
  lines.slice(1).forEach((l, i) => {
    const r = splitCsv(l), f = Number(r[col('fdi')]), cond = (r[col('condition')] ?? '').trim().toLowerCase();
    if (!valid(f)) throw new Error(`Row ${i + 2}: "${r[col('fdi')]}" is not an FDI tooth number`);
    const t = rec(c, f), note = col('note') >= 0 ? (r[col('note')] ?? '').trim() : '';
    if (note) t.note = t.note ? `${t.note}; ${note}` : note;
    if (cond === 'missing' || cond === 'crown' || cond === 'implant') t.tooth = cond;
    else if (cond === 'caries' || cond === 'filled') {
      const ss = (col('surfaces') >= 0 ? r[col('surfaces')] ?? '' : '').toUpperCase().replace(/[^A-Z]/g, '');
      if (!ss) throw new Error(`Row ${i + 2}: ${cond} needs surfaces (M, O, D, B, L)`);
      for (const ch of ss) { const s = back[ch]; if (!s) throw new Error(`Row ${i + 2}: "${ch}" is not a surface (M, O, D, B, L, I, F, P)`); t.surfaces[s] = cond; }
    } else if (cond !== 'note' && cond !== '') throw new Error(`Row ${i + 2}: "${r[col('condition')]}" is not a condition (caries, filled, missing, crown, implant, note)`);
  });
  return c;
}

/**
 * DMFT (permanent) or dmft (primary) index, counting teeth: D = any caries, M = missing (assumed lost to caries),
 * F = filled or crowned with no caries. Implants count as missing teeth.
 */
export function dmft(c: Chart, primary: boolean): { d: number; m: number; f: number; total: number } {
  let d = 0, m = 0, f = 0;
  for (const t of allTeeth(primary)) {
    const r = c.get(t); if (!r) continue;
    if (r.tooth === 'missing' || r.tooth === 'implant') m++;
    else if (Object.values(r.surfaces).includes('caries')) d++;
    else if (r.tooth === 'crown' || Object.values(r.surfaces).includes('filled')) f++;
  }
  return { d, m, f, total: d + m + f };
}
