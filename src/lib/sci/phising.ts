// 2D Ising model on an L × L square lattice with periodic edges: Metropolis Monte Carlo, observables with block
// errors, exact enumeration for tiny lattices, and Onsager's exact infinite-lattice results. Units: J = kB = 1. No DOM.

/** A small fast seeded random number generator (mulberry32), so runs can be repeated. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const TC = 2 / Math.log(1 + Math.SQRT2); // 2.269185...

export class Lattice {
  L: number; N: number; s: Int8Array; E = 0; M = 0; sweeps = 0;
  constructor(L: number, start: 'random' | 'up' = 'random', rand = rng(1)) {
    this.L = L; this.N = L * L; this.s = new Int8Array(this.N);
    for (let i = 0; i < this.N; i++) this.s[i] = start === 'up' || rand() < 0.5 ? 1 : -1;
    this.recount(0);
  }
  /** Total energy E = −Σ⟨ij⟩ s_i s_j − h Σ s_i, and magnetisation M = Σ s_i. */
  recount(h: number) {
    const { L, s } = this; let E = 0, M = 0;
    for (let y = 0; y < L; y++) for (let x = 0; x < L; x++) { const i = y * L + x, v = s[i]; M += v; E -= v * (s[y * L + ((x + 1) % L)] + s[((y + 1) % L) * L + x]); }
    this.E = E - h * M; this.M = M;
  }
  /** One Metropolis sweep (N attempted flips at random sites) at temperature T and field h. */
  sweep(T: number, h: number, rand: () => number, n = 1) {
    const { L, N, s } = this;
    // Acceptance for ΔE = 2 s (Σnn + h): index by s (±1) and the neighbour sum (−4..4 in steps of 2).
    const acc = new Float64Array(18);
    for (const sv of [-1, 1]) for (let nn = -4; nn <= 4; nn += 2) { const dE = 2 * sv * (nn + h); acc[(sv + 1) / 2 * 9 + nn + 4] = dE <= 0 ? 1 : Math.exp(-dE / T); }
    for (let k = 0; k < n; k++) {
      for (let t = 0; t < N; t++) {
        const i = (rand() * N) | 0, x = i % L, y = (i - x) / L;
        const nn = s[y * L + (x + 1 === L ? 0 : x + 1)] + s[y * L + (x === 0 ? L - 1 : x - 1)] + s[(y + 1 === L ? 0 : y + 1) * L + x] + s[(y === 0 ? L - 1 : y - 1) * L + x];
        const sv = s[i], a = acc[(sv + 1) / 2 * 9 + nn + 4];
        if (a >= 1 || rand() < a) { s[i] = -sv as -1 | 1; this.E += 2 * sv * (nn + h); this.M -= 2 * sv; }
      }
      this.sweeps++;
    }
  }
}

export type Stats = { T: number; m: number; mErr: number; e: number; c: number; cErr: number; chi: number; binder: number; n: number };

/** Measures averages over `meas` sweeps (after the lattice has been equilibrated) with errors from 10 blocks. */
export function measure(lat: Lattice, T: number, h: number, meas: number, rand: () => number): Stats {
  const N = lat.N, nb = 10, per = Math.max(1, Math.floor(meas / nb));
  const blocks: { m: number; e: number; e2: number; m2: number; m4: number }[] = [];
  for (let b = 0; b < nb; b++) {
    let sm = 0, se = 0, se2 = 0, sm2 = 0, sm4 = 0;
    for (let k = 0; k < per; k++) { lat.sweep(T, h, rand); const m = Math.abs(lat.M) / N, e = lat.E / N; sm += m; se += e; se2 += e * e; sm2 += m * m; sm4 += m ** 4; }
    blocks.push({ m: sm / per, e: se / per, e2: se2 / per, m2: sm2 / per, m4: sm4 / per });
  }
  const avg = (f: (x: (typeof blocks)[0]) => number) => blocks.reduce((s, b) => s + f(b), 0) / nb;
  const sem = (f: (x: (typeof blocks)[0]) => number) => { const a = avg(f); return Math.sqrt(blocks.reduce((s, b) => s + (f(b) - a) ** 2, 0) / (nb * (nb - 1))); };
  const cOf = (b: (typeof blocks)[0]) => (N * (b.e2 - b.e * b.e)) / (T * T);
  const m = avg((b) => b.m), e = avg((b) => b.e), e2 = avg((b) => b.e2), m2 = avg((b) => b.m2), m4 = avg((b) => b.m4);
  return { T, m, mErr: sem((b) => b.m), e, c: (N * (e2 - e * e)) / (T * T), cErr: sem(cOf), chi: (N * (m2 - m * m)) / T, binder: 1 - m4 / (3 * m2 * m2), n: per * nb };
}

/** Complete elliptic integral of the first kind K(k) (modulus k) by the arithmetic-geometric mean. */
export function ellipK(k: number) {
  let a = 1, b = Math.sqrt(1 - k * k);
  if (b === 0) return Infinity;
  for (let i = 0; i < 40 && Math.abs(a - b) > 1e-16 * a; i++) { const t = (a + b) / 2; b = Math.sqrt(a * b); a = t; }
  return Math.PI / (2 * a);
}

/** Onsager's exact results for the infinite square lattice (h = 0): spontaneous magnetisation, energy and heat capacity per spin. */
export const onsager = {
  m: (T: number) => (T >= TC ? 0 : Math.pow(1 - Math.pow(Math.sinh(2 / T), -4), 1 / 8)),
  u: (T: number) => {
    const b = 1 / T, k = (2 * Math.sinh(2 * b)) / Math.cosh(2 * b) ** 2, th = Math.tanh(2 * b);
    const f = 2 * th * th - 1;
    return -(1 / th) * (1 + (f === 0 ? 0 : (2 / Math.PI) * f * ellipK(Math.min(k, 1 - 1e-16))));
  },
  /** Heat capacity per spin by a central difference of the exact energy. */
  c: (T: number) => { const d = 1e-4 * T; return (onsager.u(T + d) - onsager.u(T - d)) / (2 * d); },
};

/** Exact averages for a tiny L × L periodic lattice (L ≤ 4) by summing over every one of the 2^(L²) states. */
export function exactSmall(L: number, T: number, h = 0) {
  const N = L * L, S = 1 << N;
  let Z = 0, sE = 0, sE2 = 0, sAM = 0, sM2 = 0;
  const lat = new Lattice(L, 'up');
  let E0 = Infinity;
  const Es = new Float64Array(S), Ms = new Float64Array(S);
  for (let c = 0; c < S; c++) { for (let i = 0; i < N; i++) lat.s[i] = (c >> i) & 1 ? 1 : -1; lat.recount(h); Es[c] = lat.E; Ms[c] = lat.M; if (lat.E < E0) E0 = lat.E; }
  for (let c = 0; c < S; c++) { const w = Math.exp(-(Es[c] - E0) / T); Z += w; sE += w * Es[c]; sE2 += w * Es[c] ** 2; sAM += w * Math.abs(Ms[c]); sM2 += w * Ms[c] ** 2; }
  const e = sE / Z, e2 = sE2 / Z;
  return { e: e / N, m: sAM / Z / N, c: (e2 - e * e) / (T * T) / N, m2: sM2 / Z / (N * N) };
}
