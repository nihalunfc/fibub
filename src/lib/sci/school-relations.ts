// School relations (Class 11 and 12 maths): a relation R on A = {1, ..., n} as an n × n table of yes/no;
// reflexive, symmetric, antisymmetric and transitive checks with a counterexample for each failure,
// equivalence classes, closures (Warshall for transitive), whether R is a function A → A (one-one, onto),
// and how many relations of each kind exist on n elements. Plain TypeScript, no DOM.

export type Rel = boolean[][];
export const empty = (n: number): Rel => Array.from({ length: n }, () => Array(n).fill(false));
export const copy = (R: Rel): Rel => R.map((r) => r.slice());
export const fromRule = (n: number, f: (a: number, b: number) => boolean): Rel => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => f(i + 1, j + 1)));
export const pairs = (R: Rel): [number, number][] => R.flatMap((r, i) => r.flatMap((v, j) => (v ? [[i + 1, j + 1] as [number, number]] : [])));

/** Read pairs like "(1,2), (2, 3) (3,3)" or "1 2; 2 3" on {1..n}. Throws a friendly message on a bad pair. */
export function parsePairs(s: string, n: number): Rel {
  const R = empty(n), nums = s.replace(/[(){}\[\],;]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (nums.length % 2) throw new Error('Pairs come in twos: one number is left over.');
  for (let k = 0; k < nums.length; k += 2) {
    const a = Number(nums[k]), b = Number(nums[k + 1]);
    if (![a, b].every((x) => Number.isInteger(x) && x >= 1 && x <= n)) throw new Error(`(${nums[k]}, ${nums[k + 1]}) is not a pair from {1, ..., ${n}}.`);
    R[a - 1][b - 1] = true;
  }
  return R;
}

export type Props = {
  reflexive: boolean; noLoop: number | null;
  symmetric: boolean; notSym: [number, number] | null;
  antisymmetric: boolean; notAnti: [number, number] | null;
  transitive: boolean; notTrans: [number, number, number] | null;
  equivalence: boolean; partialOrder: boolean;
};
export function props(R: Rel): Props {
  const n = R.length;
  let noLoop: number | null = null, notSym: [number, number] | null = null, notAnti: [number, number] | null = null, notTrans: [number, number, number] | null = null;
  for (let i = 0; i < n && noLoop === null; i++) if (!R[i][i]) noLoop = i + 1;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (R[i][j] && !R[j][i] && !notSym) notSym = [i + 1, j + 1];
    if (i !== j && R[i][j] && R[j][i] && !notAnti) notAnti = [i + 1, j + 1];
  }
  for (let i = 0; i < n && !notTrans; i++) for (let j = 0; j < n && !notTrans; j++) if (R[i][j]) for (let k = 0; k < n; k++) if (R[j][k] && !R[i][k]) { notTrans = [i + 1, j + 1, k + 1]; break; }
  const reflexive = noLoop === null, symmetric = !notSym, antisymmetric = !notAnti, transitive = !notTrans;
  return { reflexive, noLoop, symmetric, notSym, antisymmetric, notAnti, transitive, notTrans, equivalence: reflexive && symmetric && transitive, partialOrder: reflexive && antisymmetric && transitive };
}

/** Equivalence classes [a] = {b : a R b}, each listed once (only meaningful for an equivalence relation). */
export function classes(R: Rel): number[][] {
  const seen = new Set<string>(), out: number[][] = [];
  R.forEach((row) => { const c = row.flatMap((v, j) => (v ? [j + 1] : [])); const k = c.join(); if (c.length && !seen.has(k)) { seen.add(k); out.push(c); } });
  return out;
}

export const reflexiveClosure = (R: Rel): Rel => R.map((r, i) => r.map((v, j) => v || i === j));
export const symmetricClosure = (R: Rel): Rel => R.map((r, i) => r.map((v, j) => v || R[j][i]));
export function transitiveClosure(R: Rel): Rel {
  const T = copy(R), n = R.length;
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) if (T[i][k]) for (let j = 0; j < n; j++) if (T[k][j]) T[i][j] = true;
  return T;
}
/** Smallest equivalence relation containing R. */
export const equivalenceClosure = (R: Rel): Rel => transitiveClosure(symmetricClosure(reflexiveClosure(R)));

/** Is R a function A → A (every a has exactly one partner)? If so, is it one-one and onto? */
export function asFunction(R: Rel) {
  const n = R.length, outs = R.map((r) => r.filter(Boolean).length);
  const isFn = outs.every((c) => c === 1);
  const img = isFn ? R.map((r) => r.indexOf(true) + 1) : [];
  const oneOne = isFn && new Set(img).size === n;
  return { isFn, noImage: outs.findIndex((c) => c === 0) + 1 || null, twoImages: outs.findIndex((c) => c > 1) + 1 || null, img, oneOne, onto: oneOne };
}

/** Bell numbers: how many equivalence relations (partitions) a set of n elements has. */
export function bell(n: number): number {
  let row = [1];
  for (let i = 0; i < n; i++) { const next = [row[row.length - 1]]; for (const v of row) next.push(next[next.length - 1] + v); row = next; }
  return row[0];
}
/** Counts of relations on n elements: all 2^(n²), reflexive 2^(n² − n), symmetric 2^(n(n+1)/2), equivalence Bell(n). */
export const countAll = (n: number) => ({ all: 2 ** (n * n), reflexive: 2 ** (n * n - n), symmetric: 2 ** ((n * (n + 1)) / 2), equivalence: bell(n), functions: n ** n });
