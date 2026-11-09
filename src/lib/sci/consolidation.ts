// One-dimensional consolidation: primary settlement of layered clay (normally and over-consolidated, Cc, Cr and
// preconsolidation pressure), Terzaghi's average degree of consolidation U(Tv) by its Fourier series, the time
// to reach a given U, and cv from a lab t50 or t90. Plain maths, no DOM. Lengths in m, stresses in kPa.

export type Layer = { name: string; H: number; gamma: number; e0: number; Cc: number; Cr: number; sp: number };
export type LayerOut = Layer & { top: number; zMid: number; s0: number; ds: number; sf: number; spUsed: number; kind: 'NC' | 'OC' | 'OC to NC' | 'none' | 'under'; S: number };

/** Average degree of consolidation for a uniform initial excess pore pressure: U = 1 − Σ 2/M² e^(−M² Tv), M = π(2m + 1)/2. */
export function Uavg(Tv: number): number {
  if (!(Tv > 0)) return 0;
  if (Tv < 1e-8) return Math.sqrt((4 * Tv) / Math.PI);
  let s = 0;
  for (let m = 0; m < 200000; m++) {
    const M = (Math.PI * (2 * m + 1)) / 2, t = (2 / (M * M)) * Math.exp(-M * M * Tv);
    s += t;
    if (t < 1e-16 && M * M * Tv > 40) break;
  }
  return Math.min(1, Math.max(0, 1 - s));
}
/** Time factor Tv at which U is reached (0 < U < 1), by bisection on the series. */
export function TvFor(U: number): number {
  if (!(U > 0 && U < 1)) throw new Error('U must be between 0 and 1.');
  let lo = 0, hi = 1;
  while (Uavg(hi) < U) hi *= 2;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (Uavg(mid) < U) lo = mid; else hi = mid; if (hi - lo < 1e-15 * hi) break; }
  return (lo + hi) / 2;
}
/** Excess pore pressure ratio u/u0 at depth ratio Z = z/Hdr (0 at the drained face) and time factor Tv. */
export function isochrone(Z: number, Tv: number): number {
  if (!(Tv > 0)) return Z > 0 ? 1 : 0;
  let s = 0;
  for (let m = 0; m < 200000; m++) {
    const M = (Math.PI * (2 * m + 1)) / 2, e = Math.exp(-M * M * Tv), t = (2 / M) * Math.sin(M * Z) * e;
    s += t;
    if (e < 1e-16 && M * M * Tv > 40) break;
  }
  return s;
}

/** Stress increase at depth z below a B × L footing base by the 2:1 spread: q·B·L / ((B + z)(L + z)). For a strip use L = Infinity. */
export const spread21 = (q: number, B: number, L: number, z: number) => (z <= 0 ? q : Number.isFinite(L) ? (q * B * L) / ((B + z) * (L + z)) : (q * B) / (B + z));

export type Load = { kind: 'uniform'; q: number } | { kind: 'footing'; q: number; B: number; L: number; Df: number };

/** Primary consolidation settlement of each layer (split into n sublayers), with the water table at depth zw. */
export function settle(layers: Layer[], load: Load, zw: number, n = 1, gw = 9.81): { rows: LayerOut[]; S: number; compressibleH: number } {
  if (!layers.length) throw new Error('Give at least one layer.');
  if (!(n >= 1 && n <= 50)) throw new Error('Sublayers must be between 1 and 50.');
  for (const L of layers) {
    if (!(L.H > 0)) throw new Error(`Layer "${L.name}": thickness must be above zero.`);
    if (!(L.gamma > 0)) throw new Error(`Layer "${L.name}": unit weight must be above zero.`);
    if (!(L.e0 > 0)) throw new Error(`Layer "${L.name}": e0 must be above zero.`);
    if (!(L.Cc >= 0 && L.Cr >= 0 && L.sp >= 0)) throw new Error(`Layer "${L.name}": Cc, Cr and σ′p must be 0 or more.`);
  }
  if (!(load.q >= 0)) throw new Error('The load must be 0 or more.');
  // Effective vertical stress at depth z.
  const sv = (z: number) => {
    let s = 0, top = 0;
    for (const L of layers) {
      const bot = top + L.H, a = Math.min(z, bot);
      if (a > top) {
        const dry = Math.max(0, Math.min(a, zw) - top), wet = a - top - dry;
        s += L.gamma * dry + (L.gamma - gw) * wet;
      }
      top = bot;
      if (z <= top) break;
    }
    return s;
  };
  const rows: LayerOut[] = [];
  let top = 0, S = 0, compressibleH = 0;
  for (const L of layers) {
    let Sl = 0;
    const zMid = top + L.H / 2, compressible = L.Cc > 0 || L.Cr > 0;
    if (compressible) compressibleH += L.H;
    for (let i = 0; i < n; i++) {
      const h = L.H / n, z = top + h * (i + 0.5);
      const s0 = sv(z), ds = load.kind === 'uniform' ? load.q : z > load.Df ? spread21(load.q, load.B, load.L, z - load.Df) : 0;
      if (!(s0 > 0)) throw new Error(`Layer "${L.name}": the effective stress at mid-depth is zero or less; check unit weights and the water table.`);
      const sf = s0 + ds, f = h / (1 + L.e0);
      let k: LayerOut['kind'];
      if (!compressible) k = 'none';
      else if (L.sp <= 0 || Math.abs(L.sp - s0) < 1e-9 * s0) k = 'NC';
      else if (L.sp < s0) k = 'under';
      else k = sf <= L.sp ? 'OC' : 'OC to NC';
      if (k === 'NC' || k === 'under') Sl += L.Cc * f * Math.log10(sf / s0);
      else if (k === 'OC') Sl += L.Cr * f * Math.log10(sf / s0);
      else if (k === 'OC to NC') Sl += L.Cr * f * Math.log10(L.sp / s0) + L.Cc * f * Math.log10(sf / L.sp);
    }
    // The table reports the stresses at mid-layer; the settlement sums the sublayers.
    const s0m = sv(zMid), dsm = load.kind === 'uniform' ? load.q : zMid > load.Df ? spread21(load.q, load.B, load.L, zMid - load.Df) : 0;
    const sf = s0m + dsm, sp = L.sp;
    const kind: LayerOut['kind'] = !compressible ? 'none' : sp <= 0 || Math.abs(sp - s0m) < 1e-9 * s0m ? 'NC' : sp < s0m ? 'under' : sf <= sp ? 'OC' : 'OC to NC';
    rows.push({ ...L, top, zMid, s0: s0m, ds: dsm, sf, spUsed: sp > 0 ? sp : s0m, kind, S: Sl });
    S += Sl; top += L.H;
  }
  return { rows, S, compressibleH };
}

/** Time (same unit as cv's time) to reach U, for drainage path Hdr and coefficient cv. */
export const timeFor = (U: number, Hdr: number, cv: number) => (TvFor(U) * Hdr * Hdr) / cv;
/** cv from a lab test: Tv(U)·Hdr²/t; U = 0.5 for Casagrande's t50, 0.9 for Taylor's t90. */
export const cvFromLab = (U: number, Hdr: number, t: number) => (TvFor(U) * Hdr * Hdr) / t;
