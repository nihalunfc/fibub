// Kingman coalescent for teaching: genealogies of n sampled gene copies, neutral mutations dropped on the
// branches, and the textbook expectations. Time is in coalescent units of 2N generations (diploid), so with
// k lineages the next merger comes after an exponential wait with rate k(k − 1)/2, and a branch of length L
// carries Poisson(θL/2) mutations, θ = 4Nμ per locus. Seeded random numbers.
import { wfRng } from './wrightfisher.ts';

export type CNode = { id: number; time: number; children: number[]; parent: number; leaves: number; muts: number };
export type Genealogy = { nodes: CNode[]; root: number; n: number; tmrca: number; total: number; S: number; times: number[] };

export const harmonic = (n: number, pow = 1) => { let s = 0; for (let i = 1; i < n; i++) s += 1 / i ** pow; return s; };

/** Expected values and variances under the standard neutral coalescent. */
export function expected(n: number, theta: number) {
  const a = harmonic(n), b = harmonic(n, 2);
  let vT = 0; for (let k = 2; k <= n; k++) vT += (2 / (k * (k - 1))) ** 2;
  return { tmrca: 2 * (1 - 1 / n), varTmrca: vT, total: 2 * a, varTotal: 4 * b, S: theta * a, varS: theta * a + theta * theta * b, a, b };
}

export function poisson(mean: number, u: () => number): number {
  if (mean <= 0) return 0;
  if (mean > 30) { let k = 0, m = mean; while (m > 30) { k += poisson(30, u); m -= 30; } return k + poisson(m, u); }
  const L = Math.exp(-mean); let k = 0, p = u();
  while (p > L) { k++; p *= u(); }
  return k;
}

/** One genealogy of n tips, with mutations if theta > 0. */
export function genealogy(n: number, theta: number, u: () => number): Genealogy {
  const nodes: CNode[] = Array.from({ length: n }, (_, i) => ({ id: i, time: 0, children: [], parent: -1, leaves: 1, muts: 0 }));
  const live = nodes.map((d) => d.id), times: number[] = [];
  let t = 0;
  while (live.length > 1) {
    const k = live.length;
    t += -Math.log(u()) / ((k * (k - 1)) / 2);
    const i = Math.floor(u() * k); let j = Math.floor(u() * (k - 1)); if (j >= i) j++;
    const a = live[i], b = live[j], id = nodes.length;
    nodes.push({ id, time: t, children: [a, b], parent: -1, leaves: nodes[a].leaves + nodes[b].leaves, muts: 0 });
    nodes[a].parent = id; nodes[b].parent = id; times.push(t);
    live.splice(Math.max(i, j), 1); live.splice(Math.min(i, j), 1); live.push(id);
  }
  const root = live[0];
  let total = 0, S = 0;
  for (const d of nodes) if (d.parent >= 0) { const L = nodes[d.parent].time - d.time; total += L; if (theta > 0) { d.muts = poisson((theta * L) / 2, u); S += d.muts; } }
  return { nodes, root, n, tmrca: nodes[root].time, total, S, times };
}

/** Many genealogies: TMRCA, total branch length, segregating sites and Watterson's estimate for each. */
export function replicate(n: number, theta: number, reps: number, seed: number) {
  const u = wfRng(seed), a = harmonic(n);
  const tmrca = new Float64Array(reps), total = new Float64Array(reps), S = new Float64Array(reps), thetaW = new Float64Array(reps);
  for (let r = 0; r < reps; r++) { const g = genealogy(n, theta, u); tmrca[r] = g.tmrca; total[r] = g.total; S[r] = g.S; thetaW[r] = g.S / a; }
  return { tmrca, total, S, thetaW };
}

export const meanVar = (x: ArrayLike<number>) => {
  const n = x.length; let m = 0; for (let i = 0; i < n; i++) m += x[i]; m /= n;
  let v = 0; for (let i = 0; i < n; i++) v += (x[i] - m) ** 2;
  return { mean: m, var: n > 1 ? v / (n - 1) : NaN };
};

/** Newick text with branch lengths (in the given time scale), tips named by `name`. */
export function newick(g: Genealogy, scale = 1, name = (i: number) => `s${i + 1}`) {
  const f = (x: number) => String(+(x * scale).toPrecision(6));
  const rec = (id: number): string => {
    const d = g.nodes[id], len = d.parent >= 0 ? `:${f(g.nodes[d.parent].time - d.time)}` : '';
    return (d.children.length ? `(${d.children.map(rec).join(',')})` : name(id)) + len;
  };
  return rec(g.root) + ';';
}

/** Tip order for drawing (left to right, no crossing lines). */
export function tipOrder(g: Genealogy) {
  const out: number[] = [];
  const rec = (id: number) => { const d = g.nodes[id]; if (!d.children.length) out.push(id); else d.children.forEach(rec); };
  rec(g.root);
  return out;
}
