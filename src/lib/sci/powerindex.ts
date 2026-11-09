// Power in weighted voting games [q; w1, ..., wn]: a coalition wins when its members' weights add up to at
// least the quota q. Shapley-Shubik and Banzhaf indices are worked out exactly by dynamic programming over
// generating functions (coalitions counted by size and total weight), so 50 or more players take well under a
// second. Deegan-Packel, Johnston and Holler (public good) indices need the minimal winning coalitions, so they
// are found by listing coalitions, for up to 20 players.

export type Game = { quota: number; weights: number[]; names: string[] };

/** Weights and quota as whole numbers: decimals are scaled by a power of 10 (exact for typed decimals). */
export function toIntegers(quota: number, weights: number[]) {
  const dec = (x: number) => { const s = String(x); if (/e/i.test(s)) return 6; const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  const d = Math.min(6, Math.max(dec(quota), ...weights.map(dec)));
  const f = 10 ** d;
  return { quota: Math.round(quota * f), weights: weights.map((w) => Math.round(w * f)), scale: f };
}

export type PowerResult = {
  n: number; total: number; quota: number;
  /** Swings: coalitions without i that lose, but win with i. */
  swings: number[];
  banzhaf: number[]; banzhafAbs: number[]; shapley: number[];
  /** Orderings in which each player is pivotal (exact, as decimal text), and n! as text. */
  pivots: string[]; orderings: string;
  winning: number;
  veto: boolean[]; dummy: boolean[];
  proper: boolean;
};

const LIMIT = 4e8;

export function power(g: { quota: number; weights: number[] }): PowerResult {
  const { quota: q, weights: w } = toIntegers(g.quota, g.weights);
  const n = w.length;
  if (n < 2) throw new Error('Enter at least two players.');
  if (w.some((x) => !(x >= 0) || !Number.isFinite(x))) throw new Error('Weights must be numbers of zero or more.');
  const T = w.reduce((s, x) => s + x, 0);
  if (!(q > 0)) throw new Error('The quota must be more than 0.');
  if (q > T) throw new Error(`The quota (${g.quota}) is more than all the weights together (${+g.weights.reduce((a, b) => a + b, 0).toFixed(6)}), so no coalition can win.`);
  if (n * n * (T + 1) > LIMIT) throw new Error(`Too large to count exactly here: ${n} players with a total weight of ${T.toLocaleString('en')} (after scaling decimals). Use smaller whole-number weights, or fewer decimal places.`);
  // f[s][x]: coalitions of size s and weight x (exact integers below 2^53 for n up to 53).
  const f = Array.from({ length: n + 1 }, () => new Float64Array(T + 1));
  f[0][0] = 1;
  let top = 0;
  for (let j = 0; j < n; j++) {
    const wj = w[j];
    top += wj;
    for (let s = j; s >= 0; s--) { const a = f[s], b = f[s + 1]; for (let x = top - wj; x >= 0; x--) if (a[x]) b[x + wj] += a[x]; }
  }
  let winning = 0;
  for (let s = 0; s <= n; s++) for (let x = q; x <= T; x++) winning += f[s][x];
  // Coefficients s!(n-1-s)!/n! = 1 / (n · C(n-1, s)).
  const binom: number[] = [1];
  for (let s = 1; s < n; s++) binom[s] = (binom[s - 1] * (n - s)) / s;
  const fact = (k: number) => { let r = 1n; for (let i = 2n; i <= BigInt(k); i++) r *= i; return r; };
  const facts = Array.from({ length: n }, (_, s) => fact(s));
  const swings: number[] = [], shapley: number[] = [], pivots: string[] = [];
  const g0 = Array.from({ length: n }, () => new Float64Array(Math.max(q, 1)));
  for (let i = 0; i < n; i++) {
    const wi = w[i];
    // Remove player i: g[s][x] = f[s][x] − g[s−1][x − wi], for x < q only.
    for (let s = 0; s < n; s++) {
      const gs = g0[s], fs = f[s], prev = s ? g0[s - 1] : null;
      for (let x = 0; x < q; x++) gs[x] = fs[x] - (prev && x >= wi ? prev[x - wi] : 0);
    }
    let sw = 0, sh = 0, piv = 0n;
    if (wi > 0) for (let s = 0; s < n; s++) {
      let c = 0;
      for (let x = Math.max(0, q - wi); x < q; x++) c += g0[s][x];
      sw += c; sh += c / (n * binom[s]);
      if (c) piv += BigInt(Math.round(c)) * facts[s] * facts[n - 1 - s];
    }
    swings.push(sw); shapley.push(sh); pivots.push(piv.toString());
  }
  const S = swings.reduce((a, b) => a + b, 0);
  return {
    n, total: T, quota: q, swings,
    banzhaf: swings.map((x) => (S ? x / S : 0)), banzhafAbs: swings.map((x) => x / 2 ** (n - 1)), shapley,
    pivots, orderings: fact(n).toString(), winning,
    veto: w.map((x) => T - x < q), dummy: swings.map((x) => x === 0),
    proper: 2 * q > T,
  };
}

/**
 * Indices built on minimal winning coalitions (every member is needed): Deegan-Packel, Holler (public good)
 * and Johnston (shares of winning coalitions among their critical members). Lists all 2^n coalitions.
 */
export function mwcIndices(g: { quota: number; weights: number[] }, maxN = 20) {
  const { quota: q, weights: w } = toIntegers(g.quota, g.weights);
  const n = w.length;
  if (n > maxN) return null;
  const N = 1 << n;
  const wt = new Float64Array(N);
  for (let m = 1; m < N; m++) { const low = m & -m, j = 31 - Math.clz32(low); wt[m] = wt[m ^ low] + w[j]; }
  const dp = new Array(n).fill(0), holler = new Array(n).fill(0), johnston = new Array(n).fill(0);
  let mwc = 0, vulnerable = 0;
  const list: number[][] = [];
  for (let m = 1; m < N; m++) {
    if (wt[m] < q) continue;
    const crit: number[] = [];
    for (let j = 0; j < n; j++) if (m & (1 << j) && wt[m] - w[j] < q) crit.push(j);
    if (!crit.length) continue;
    vulnerable++;
    for (const j of crit) johnston[j] += 1 / crit.length;
    const size = popcount(m);
    if (crit.length === size) {
      mwc++;
      if (list.length < 200) list.push(crit);
      for (const j of crit) { dp[j] += 1 / size; holler[j] += 1; }
    }
  }
  const H = holler.reduce((a, b) => a + b, 0);
  return { deeganPackel: dp.map((x) => x / mwc), holler: holler.map((x) => x / H), johnston: johnston.map((x) => x / vulnerable), mwc, vulnerable, list };
}
const popcount = (m: number) => { let c = 0; while (m) { m &= m - 1; c++; } return c; };

/** Players as text: "name weight" per line, or just weights separated by commas or spaces. */
export function parsePlayers(text: string): { names: string[]; weights: number[] } {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/#.*$/, '').trim()).filter(Boolean);
  const names: string[] = [], weights: number[] = [];
  const isNum = (s: string) => /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s);
  if (lines.length === 1 && lines[0].split(/[\s,;]+/).every(isNum)) {
    lines[0].split(/[\s,;]+/).forEach((s, i) => { names.push(`P${i + 1}`); weights.push(Number(s)); });
  } else lines.forEach((l, i) => {
    const m = l.match(/^(.*?)[\s,;:\t]+([-+]?[\d.]+(?:e[-+]?\d+)?)$/i);
    if (m && m[1]) { names.push(m[1].trim()); weights.push(Number(m[2])); }
    else if (isNum(l)) { names.push(`P${i + 1}`); weights.push(Number(l)); }
    else throw new Error(`Line ${i + 1}: write a name, then its weight, such as "North 12".`);
  });
  if (weights.some((x) => !Number.isFinite(x) || x < 0)) throw new Error('Weights must be numbers of zero or more.');
  return { names, weights };
}
