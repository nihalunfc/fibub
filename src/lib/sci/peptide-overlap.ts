// Overlapping peptide libraries for epitope mapping: cut a protein into peptides of a set length that overlap by a
// set number of residues (or start a set number of residues apart), give each its masses (from peptide.ts), flag
// peptides that are often hard to make or keep (many water-repelling residues, several cysteines, DP or NG motifs,
// an N-terminal Q or E, long length), lay them out in a matrix of pools (rows and columns, so every peptide sits in
// exactly two pools) and work back from the positive pools to the peptides that could explain them. No DOM.
import { peptideMass } from './peptide.ts';

export type Span = { start: number; end: number }; // 1-based, inclusive

/** Peptide spans along a protein of n residues: length `len`, each starting `step` residues after the last. With
 *  `coverEnd`, a last peptide ending at the C-terminus is added when the regular ones stop short of it. A protein
 *  shorter than `len` gives one peptide, the whole protein. */
export function tile(n: number, len: number, step: number, coverEnd = true): Span[] {
  if (!(n >= 1 && len >= 1 && step >= 1)) return [];
  if (n <= len) return [{ start: 1, end: n }];
  const out: Span[] = [];
  let s = 0;
  for (; s + len <= n; s += step) out.push({ start: s + 1, end: s + len });
  if (coverEnd && out[out.length - 1].end < n) out.push({ start: n - len + 1, end: n });
  return out;
}

/** The longest stretch L such that every stretch of L residues in the protein lies wholly inside at least one
 *  peptide (for a linear epitope of up to L residues, at least one peptide carries all of it). 0 if some residue is
 *  in no peptide. */
export function guaranteedSpan(n: number, spans: Span[]) {
  // reach[a] = furthest end of a peptide that starts at or before residue a (1-based)
  const reach = new Array<number>(n + 2).fill(0);
  for (const p of spans) reach[p.start] = Math.max(reach[p.start], p.end);
  for (let a = 1; a <= n; a++) reach[a] = Math.max(reach[a], reach[a - 1]);
  let best = n;
  for (let a = 1; a <= n; a++) {
    if (reach[a] < a) return 0;
    // A stretch starting at a can be at most reach[a] - a + 1 long; this limits L unless the protein ends first.
    if (reach[a] < n) best = Math.min(best, reach[a] - a + 1);
  }
  return best;
}

/** Things that often make a peptide hard to synthesise, purify, dissolve or keep. Rule-of-thumb settings, editable. */
export type Rules = { hydro: string; hydroMax: number; cysMax: number; motifs: string[]; nTerm: string; longLen: number };
export const RULES_DEFAULT: Rules = { hydro: 'AFILMVWY', hydroMax: 50, cysMax: 2, motifs: ['DP', 'NG'], nTerm: 'QE', longLen: 20 };

export type Flag = { code: 'hydro' | 'cys' | 'motif' | 'nterm' | 'long'; text: string };

export function hydroShare(seq: string, hydro = RULES_DEFAULT.hydro) {
  if (!seq.length) return 0;
  let k = 0;
  for (const ch of seq) if (hydro.includes(ch)) k++;
  return (100 * k) / seq.length;
}

/** Every start position (1-based within the peptide) of a motif, overlapping hits included. */
export function motifHits(seq: string, motif: string) {
  const out: number[] = [];
  if (!motif) return out;
  for (let i = seq.indexOf(motif); i >= 0; i = seq.indexOf(motif, i + 1)) out.push(i + 1);
  return out;
}

export function flags(seq: string, r: Rules = RULES_DEFAULT): Flag[] {
  const out: Flag[] = [];
  const h = hydroShare(seq, r.hydro);
  if (h > r.hydroMax) out.push({ code: 'hydro', text: `${Math.round(h)} % water-repelling` });
  const cys = [...seq].filter((c) => c === 'C').length;
  if (r.cysMax > 0 && cys >= r.cysMax) out.push({ code: 'cys', text: `${cys} Cys` });
  for (const m of r.motifs) { const n = motifHits(seq, m).length; if (n) out.push({ code: 'motif', text: n > 1 ? `${m} ×${n}` : m }); }
  if (seq && r.nTerm.includes(seq[0])) out.push({ code: 'nterm', text: `N-terminal ${seq[0]}` });
  if (seq.length > r.longLen) out.push({ code: 'long', text: `${seq.length} long` });
  return out;
}

export type Pep = Span & { name: string; seq: string; len: number; mono: number; avg: number; hydro: number; cys: number; flags: Flag[] };

export function design(seq: string, opts: { len: number; step: number; coverEnd?: boolean; prefix?: string; rules?: Rules }): Pep[] {
  const rules = opts.rules ?? RULES_DEFAULT, spans = tile(seq.length, opts.len, opts.step, opts.coverEnd ?? true);
  const width = Math.max(3, String(spans.length).length), pre = opts.prefix ?? 'P';
  return spans.map((s, i) => {
    const p = seq.slice(s.start - 1, s.end), m = peptideMass(p);
    return { ...s, name: pre + String(i + 1).padStart(width, '0'), seq: p, len: p.length, mono: m.mono, avg: m.avg, hydro: hydroShare(p, rules.hydro), cys: [...p].filter((c) => c === 'C').length, flags: flags(p, rules) };
  });
}

/** Matrix pools: n peptides fill a grid of `rows` rows, row by row (so neighbours along the protein share a row
 *  pool). Each peptide is in one row pool and one column pool. Rows default to a near-square grid. */
export function matrix(n: number, rows?: number) {
  const R = Math.max(1, Math.min(n, Math.round(rows && rows > 0 ? rows : Math.ceil(Math.sqrt(n)))));
  const C = Math.max(1, Math.ceil(n / R));
  // With more rows than needed (e.g. rows = n - 1 with few columns) some rows would be empty: use only the rows filled.
  const Ru = Math.ceil(n / C);
  const rowPools: number[][] = Array.from({ length: Ru }, () => []), colPools: number[][] = Array.from({ length: C }, () => []);
  const cell: [number, number][] = [];
  for (let i = 0; i < n; i++) { const r = Math.floor(i / C), c = i % C; rowPools[r].push(i); colPools[c].push(i); cell.push([r, c]); }
  return { rows: Ru, cols: C, rowPools, colPools, cell, pools: Ru + C, maxPool: Math.max(C, Ru) };
}

/** From the positive row and column pools, the peptides that could explain them (those at a crossing), and runs of
 *  neighbouring candidates with the stretch they share (where an epitope that lights up both would sit). */
export function deconvolve(peps: { seq: string; start: number; end: number }[], m: ReturnType<typeof matrix>, posRows: number[], posCols: number[]) {
  const R = new Set(posRows), C = new Set(posCols);
  const cand: number[] = [];
  for (let i = 0; i < peps.length; i++) if (R.has(m.cell[i][0]) && C.has(m.cell[i][1])) cand.push(i);
  // Pools that are positive but have no candidate in them hint at a mistake or a weak signal.
  const lonelyRows = [...R].filter((r) => !cand.some((i) => m.cell[i][0] === r)).sort((a, b) => a - b);
  const lonelyCols = [...C].filter((c) => !cand.some((i) => m.cell[i][1] === c)).sort((a, b) => a - b);
  const runs: { from: number; to: number; shared: string; start: number; end: number }[] = [];
  for (let k = 0; k < cand.length; ) {
    let j = k;
    while (j + 1 < cand.length && cand[j + 1] === cand[j] + 1 && peps[cand[j + 1]].start <= peps[cand[j]].end) j++;
    if (j > k) {
      const a = peps[cand[j]].start, b = peps[cand[k]].end; // shared by all peptides of the run
      const shared = b >= a ? peps[cand[k]].seq.slice(a - peps[cand[k]].start, b - peps[cand[k]].start + 1) : '';
      runs.push({ from: cand[k], to: cand[j], shared, start: a, end: b });
    }
    k = j + 1;
  }
  return { cand, unique: cand.length === 1, lonelyRows, lonelyCols, runs };
}

export const rowName = (r: number) => `R${r + 1}`;
export const colName = (c: number) => `C${c + 1}`;

/** A made-up example protein (not a real one), with a DP and an NG motif, cysteines and a water-repelling stretch. */
export const EXAMPLE_PROTEIN = `>Example antigen (made up for fibub, not a real protein)
MKTQLWAVSGEPLNDKFRCTCAYHENGVKPLDPSQTIRYGMEAKNLTVCSDWHGFLIVALLFAG
IVMSEKRDPTNGQHYSKCEVTWDLRANQSGKPEFYTHMDSKLRGVNEAQTPWSRK`;
