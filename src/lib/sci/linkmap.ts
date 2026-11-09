// Genetic linkage maps: mapping functions (Haldane 1919, Kosambi 1944), ordering loci from pairwise
// recombination frequencies (exhaustive search over orders for small sets, nearest neighbour + 2-opt beyond, scored
// by the sum of adjacent recombination frequencies, SARF, or of adjacent map distances), and three-point testcross
// analysis (gene order, recombination frequencies, coefficient of coincidence, interference). Plain TypeScript.

export type MapFn = 'haldane' | 'kosambi' | 'none';

/** Map distance in cM from a recombination frequency r (0 ≤ r < 0.5). */
export function rfToCm(r: number, f: MapFn): number {
  if (!(r >= 0 && r < 0.5)) return r === 0.5 && f === 'none' ? 50 : NaN;
  if (f === 'haldane') return -50 * Math.log(1 - 2 * r);
  if (f === 'kosambi') return 25 * Math.log((1 + 2 * r) / (1 - 2 * r));
  return 100 * r;
}
/** Recombination frequency from a map distance in cM (d ≥ 0). */
export function cmToRf(cm: number, f: MapFn): number {
  if (!(cm >= 0)) return NaN;
  const d = cm / 100;
  if (f === 'haldane') return 0.5 * (1 - Math.exp(-2 * d));
  if (f === 'kosambi') return 0.5 * Math.tanh(2 * d);
  return d <= 0.5 ? d : NaN;
}

export type Pair = { a: string; b: string; r: number };
export type Ordered = { order: string[]; score: number; exact: boolean; tried: number; ties: number; positions: number[]; gaps: number[]; missing: [string, string][] };

/** Best order of loci from pairwise recombination frequencies. Missing pairs count as unlinked (0.5) while
 *  ordering. criterion 'sarf' sums adjacent RFs; 'sad' sums adjacent map distances by `fn`. */
export function orderLoci(pairs: Pair[], criterion: 'sarf' | 'sad', fn: MapFn, exactMax = 9): Ordered {
  const names: string[] = [];
  for (const p of pairs) for (const x of [p.a, p.b]) if (!names.includes(x)) names.push(x);
  const n = names.length, R = Array.from({ length: n }, () => new Array(n).fill(0.5)), have = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const p of pairs) { const i = names.indexOf(p.a), j = names.indexOf(p.b); R[i][j] = R[j][i] = p.r; have[i][j] = have[j][i] = true; }
  // Cost between neighbours; an RF of 0.5 or more (unlinked) gets a large but finite map distance for ordering.
  const cost = R.map((row) => row.map((r) => (criterion === 'sarf' ? r : Number.isFinite(rfToCm(r, fn)) ? rfToCm(r, fn) : 1000)));
  const tour = (o: number[]) => { let s = 0; for (let k = 1; k < o.length; k++) s += cost[o[k - 1]][o[k]]; return s; };
  let best: number[] = [], bs = Infinity, tried = 0, ties = 0;
  const exact = n <= exactMax;
  if (exact) {
    // All orders with the first-listed end smaller than the last (each order and its mirror image counted once).
    const used = new Array(n).fill(false), cur: number[] = [];
    const go = (s: number) => {
      if (s > bs + 1e-12) return;
      if (cur.length === n) {
        if (cur[0] > cur[n - 1]) return;
        if (s < bs - 1e-12) { bs = s; best = cur.slice(); ties = 1; } else if (Math.abs(s - bs) <= 1e-12) ties++;
        return;
      }
      for (let i = 0; i < n; i++) {
        if (used[i]) continue;
        used[i] = true; cur.push(i);
        go(s + (cur.length > 1 ? cost[cur[cur.length - 2]][i] : 0));
        cur.pop(); used[i] = false;
      }
    };
    go(0);
    tried = n < 2 ? 1 : Array.from({ length: n }, (_, k) => k + 1).reduce((x, y) => x * y, 1) / 2;
  } else {
    for (let start = 0; start < n; start++) {
      const o = [start], left = new Set(names.map((_, i) => i)); left.delete(start);
      while (left.size) { const last = o[o.length - 1]; let bj = -1; for (const j of left) if (bj < 0 || cost[last][j] < cost[last][bj]) bj = j; o.push(bj); left.delete(bj); }
      // 2-opt: reverse any stretch that shortens the path.
      for (let improved = true; improved;) {
        improved = false;
        for (let i = 0; i < n - 1; i++) for (let j = i + 1; j < n; j++) {
          const c = [...o.slice(0, i), ...o.slice(i, j + 1).reverse(), ...o.slice(j + 1)];
          if (tour(c) < tour(o) - 1e-12) { o.splice(0, n, ...c); improved = true; }
        }
      }
      tried++;
      const s = tour(o);
      if (s < bs - 1e-12) { bs = s; best = o; }
    }
    if (best[0] > best[n - 1]) best.reverse();
    ties = 1;
  }
  const gaps: number[] = [], missing: [string, string][] = [];
  for (let k = 1; k < n; k++) { const i = best[k - 1], j = best[k]; if (!have[i][j]) missing.push([names[i], names[j]]); gaps.push(rfToCm(R[i][j], fn)); }
  const positions = [0]; for (const g of gaps) positions.push(positions[positions.length - 1] + g);
  return { order: best.map((i) => names[i]), score: bs, exact, tried, ties, positions, gaps, missing };
}

export type Tp = {
  genes: string[]; total: number; order: [number, number, number]; parental: string[][]; dco: string[][];
  rf: { ab: number; bc: number; ac: number }; // a, b, c are the genes in map order (b in the middle)
  counts: { region1: number; region2: number; dco: number; parental: number };
  expectedDco: number; coc: number; interference: number; cm: { ab: number; bc: number; ac: number };
};

/** Three-point testcross. classes: 8 rows of three allele symbols (one per gene, in the same gene order in every
 *  row) and a count. Wild-type alleles may be written "+". */
export function threePoint(classes: { alleles: string[]; n: number }[], geneNames?: string[]): Tp {
  if (classes.length !== 8) throw new Error(`A three-point testcross has 8 progeny classes; found ${classes.length}.`);
  for (const c of classes) if (c.alleles.length !== 3) throw new Error(`Each class needs three alleles, one per gene (found "${c.alleles.join(' ')}").`);
  const alle = [0, 1, 2].map((k) => [...new Set(classes.map((c) => c.alleles[k]))]);
  alle.forEach((s, k) => { if (s.length !== 2) throw new Error(`Gene ${k + 1} should have exactly two alleles across the 8 classes; found ${s.length} (${s.join(', ')}).`); });
  const keys = new Set(classes.map((c) => c.alleles.join(' ')));
  if (keys.size !== 8) throw new Error('Each of the 8 classes must be a different combination of alleles.');
  const genes = geneNames ?? alle.map((s, k) => s.find((x) => x !== '+') ?? `gene ${k + 1}`);
  const sorted = classes.slice().sort((x, y) => y.n - x.n);
  const P1 = sorted[0].alleles, total = classes.reduce((s, c) => s + c.n, 0);
  if (!(total > 0)) throw new Error('The counts add up to zero.');
  const P2 = P1.map((x, k) => alle[k].find((y) => y !== x)!);
  // A class is recombinant between genes i and j when it has P1's allele at one and P2's at the other.
  const rec = (c: string[], i: number, j: number) => (c[i] === P1[i]) !== (c[j] === P1[j]);
  const rf = (i: number, j: number) => classes.reduce((s, c) => s + (rec(c.alleles, i, j) ? c.n : 0), 0) / total;
  const r01 = rf(0, 1), r02 = rf(0, 2), r12 = rf(1, 2);
  // The outer pair is the one with the largest RF; the third gene is in the middle.
  // Entries: [RF of an outer pair, outer gene, outer gene, middle gene].
  const opts: [number, number, number, number][] = [[r01, 0, 1, 2], [r02, 0, 2, 1], [r12, 1, 2, 0]];
  opts.sort((x, y) => y[0] - x[0]);
  const [, A, C, B] = opts[0];
  const region1 = classes.filter((x) => rec(x.alleles, A, B) && !rec(x.alleles, B, C)).reduce((s, x) => s + x.n, 0);
  const region2 = classes.filter((x) => !rec(x.alleles, A, B) && rec(x.alleles, B, C)).reduce((s, x) => s + x.n, 0);
  const dcoCls = classes.filter((x) => rec(x.alleles, A, B) && rec(x.alleles, B, C));
  const dco = dcoCls.reduce((s, x) => s + x.n, 0);
  const parental = total - region1 - region2 - dco;
  const rab = rf(A, B), rbc = rf(B, C), rac = rf(A, C);
  const expectedDco = rab * rbc * total, coc = expectedDco > 0 ? dco / expectedDco : NaN;
  return {
    genes, total, order: [A, B, C], parental: [P1, P2], dco: dcoCls.map((x) => x.alleles),
    rf: { ab: rab, bc: rbc, ac: rac }, counts: { region1, region2, dco, parental },
    expectedDco, coc, interference: 1 - coc, cm: { ab: 100 * rab, bc: 100 * rbc, ac: 100 * (rab + rbc) },
  };
}
