// dN/dS for two aligned coding sequences by the Nei-Gojobori (1986) method with the Jukes-Cantor correction,
// standard genetic code. Synonymous sites per codon count changes to a stop codon as nonsynonymous; codons that
// differ at 2 or 3 positions average over the mutational pathways, leaving out pathways through a stop codon.
// Variances after Nei and Kumar (2000). Plain TypeScript, no DOM.
import { normCdf } from './stats.ts';

const BASES = 'TCAG';
const AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
export const CODE: Record<string, string> = {};
for (let i = 0; i < 64; i++) CODE[BASES[i >> 4] + BASES[(i >> 2) & 3] + BASES[i & 3]] = AA[i];
const isStop = (c: string) => CODE[c] === '*';

/** Synonymous sites of one codon (0 to 3); nonsynonymous = 3 − s. */
export function synSites(codon: string): number {
  let s = 0;
  for (let p = 0; p < 3; p++) for (const b of 'ACGT') {
    if (b === codon[p]) continue;
    const m = codon.slice(0, p) + b + codon.slice(p + 1);
    if (!isStop(m) && CODE[m] === CODE[codon]) s += 1 / 3;
  }
  return s;
}

function perms(a: number[]): number[][] { return a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r])); }

/** Synonymous and nonsynonymous differences between two codons, averaged over pathways that avoid stop codons. */
export function codonDiff(c1: string, c2: string): { sd: number; nd: number; paths: number } {
  if (c1 === c2) return { sd: 0, nd: 0, paths: 1 };
  const pos = [0, 1, 2].filter((i) => c1[i] !== c2[i]);
  let sd = 0, nd = 0, paths = 0;
  for (const order of perms(pos)) {
    let cur = c1, s = 0, n = 0, ok = true;
    for (const i of order) {
      const nx = cur.slice(0, i) + c2[i] + cur.slice(i + 1);
      if (isStop(nx) && nx !== c2) { ok = false; break; }
      if (CODE[nx] === CODE[cur]) s++; else n++;
      cur = nx;
    }
    if (!ok) continue;
    sd += s; nd += n; paths++;
  }
  if (!paths) { // every pathway passes through a stop codon: count all changes as nonsynonymous
    return { sd: 0, nd: pos.length, paths: 0 };
  }
  return { sd: sd / paths, nd: nd / paths, paths };
}

const jc = (p: number) => { const x = 1 - (4 * p) / 3; return x > 0 ? -0.75 * Math.log(x) : NaN; };
const jcVar = (p: number, L: number) => { const x = 1 - (4 * p) / 3; return x > 0 ? (p * (1 - p)) / (L * x * x) : NaN; };

export type CodonRow = { i: number; c1: string; c2: string; a1: string; a2: string; sd: number; nd: number };
export type DnDs = {
  codons: number; skipped: number; S: number; N: number; Sd: number; Nd: number; pS: number; pN: number;
  dS: number; dN: number; seS: number; seN: number; omega: number; z: number; pZ: number; rows: CodonRow[];
};

/** Compare two in-frame aligned coding sequences (same length, a multiple of 3). Codons with a gap or any letter
 *  other than A, C, G, T in either sequence are skipped. Stop codons must already be removed (or be the last codon). */
export function ng86(a: string, b: string): DnDs {
  let S = 0, N = 0, Sd = 0, Nd = 0, codons = 0, skipped = 0;
  const rows: CodonRow[] = [];
  for (let i = 0; i + 3 <= Math.min(a.length, b.length); i += 3) {
    const c1 = a.slice(i, i + 3), c2 = b.slice(i, i + 3);
    if (!/^[ACGT]{3}$/.test(c1) || !/^[ACGT]{3}$/.test(c2)) { skipped++; continue; }
    if (isStop(c1) || isStop(c2)) { skipped++; continue; }
    codons++;
    const s1 = synSites(c1), s2 = synSites(c2);
    S += (s1 + s2) / 2; N += 3 - (s1 + s2) / 2;
    if (c1 !== c2) { const d = codonDiff(c1, c2); Sd += d.sd; Nd += d.nd; rows.push({ i: i / 3 + 1, c1, c2, a1: CODE[c1], a2: CODE[c2], sd: d.sd, nd: d.nd }); }
  }
  const pS = S > 0 ? Sd / S : NaN, pN = N > 0 ? Nd / N : NaN;
  const dS = jc(pS), dN = jc(pN), seS = Math.sqrt(jcVar(pS, S)), seN = Math.sqrt(jcVar(pN, N));
  const z = (dN - dS) / Math.sqrt(seS * seS + seN * seN);
  return { codons, skipped, S, N, Sd, Nd, pS, pN, dS, dN, seS, seN, omega: dN / dS, z, pZ: Number.isFinite(z) ? 2 * normCdf(-Math.abs(z)) : NaN, rows };
}

/** Find internal stop codons (1-based codon numbers), ignoring a stop in the last codon. */
export function internalStops(s: string): number[] {
  const out: number[] = [], n = Math.floor(s.length / 3);
  for (let k = 0; k < n - 1; k++) if (isStop(s.slice(3 * k, 3 * k + 3))) out.push(k + 1);
  return out;
}
