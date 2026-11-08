// Binary phase diagrams from the ideal-solution model: complete solid solubility (lens, e.g. Cu–Ni, Ge–Si) and
// a simple eutectic with no solid solubility (Schröder–van Laar), plus the lever rule for any tie line.

export const R = 8.314462618;

/** Ideal lens: liquid and solid compositions (mole fraction of B) at T between the two melting points. */
export function lens(TmA: number, HA: number, TmB: number, HB: number, T: number) {
  // k = x_solid / x_liquid = exp((ΔH/R)(1/T − 1/Tm)) for each component
  const kA = Math.exp((HA / R) * (1 / T - 1 / TmA)), kB = Math.exp((HB / R) * (1 / T - 1 / TmB));
  if (Math.abs(kB - kA) < 1e-14) return null;
  const xL = (1 - kA) / (kB - kA), xS = kB * xL;
  return xL >= -1e-12 && xL <= 1 + 1e-12 && xS >= -1e-12 && xS <= 1 + 1e-12 ? { xL: Math.min(Math.max(xL, 0), 1), xS: Math.min(Math.max(xS, 0), 1) } : null;
}
/** Temperature on a curve where f(T) = x, by bisection between lo and hi (f monotonic). */
function solveT(f: (T: number) => number, x: number, lo: number, hi: number) {
  let a = lo, b = hi, fa = f(a) - x;
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, fm = f(m) - x; if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m; }
  return (a + b) / 2;
}
/** Liquidus and solidus temperatures of the lens at overall composition x (mole fraction of B). */
export function lensTemps(TmA: number, HA: number, TmB: number, HB: number, x: number) {
  const lo = Math.min(TmA, TmB), hi = Math.max(TmA, TmB);
  if (x <= 0) return { liq: TmA, sol: TmA }; if (x >= 1) return { liq: TmB, sol: TmB };
  const e = 1e-9 * (hi - lo);
  return { liq: solveT((T) => lens(TmA, HA, TmB, HB, T)!.xL, x, lo + e, hi - e), sol: solveT((T) => lens(TmA, HA, TmB, HB, T)!.xS, x, lo + e, hi - e) };
}

/** Simple eutectic: liquid in equilibrium with pure A has x_B = 1 − exp(−HA/R(1/T − 1/TmA)); with pure B, x_B = exp(−HB/R(1/T − 1/TmB)). */
export const liqA = (TmA: number, HA: number, T: number) => 1 - Math.exp(-(HA / R) * (1 / T - 1 / TmA));
export const liqB = (TmB: number, HB: number, T: number) => Math.exp(-(HB / R) * (1 / T - 1 / TmB));
export function eutectic(TmA: number, HA: number, TmB: number, HB: number) {
  const f = (T: number) => liqB(TmB, HB, T) - liqA(TmA, HA, T); // negative at low T? find sign change
  let a = 1, b = Math.min(TmA, TmB);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2; if (Math.sign(f(m)) === Math.sign(f(a))) a = m; else b = m; }
  const T = (a + b) / 2; return { T, x: liqB(TmB, HB, T) };
}
/** State of a eutectic system at T for overall x (mole fraction of B). */
export function eutecticState(TmA: number, HA: number, TmB: number, HB: number, x: number, T: number) {
  const E = eutectic(TmA, HA, TmB, HB);
  const liqT = x <= E.x ? (x <= 0 ? TmA : solveT((t) => liqA(TmA, HA, t), x, E.T, TmA)) : (x >= 1 ? TmB : solveT((t) => liqB(TmB, HB, t), x, E.T, TmB));
  if (T >= liqT) return { E, liqT, phases: [{ name: 'liquid', x, f: 1 }] };
  if (T < E.T) return { E, liqT, phases: [{ name: 'solid A', x: 0, f: 1 - x }, { name: 'solid B', x: 1, f: x }] };
  if (x <= E.x) { const xl = liqA(TmA, HA, T); return { E, liqT, phases: [{ name: 'solid A', x: 0, f: 1 - x / xl }, { name: 'liquid', x: xl, f: x / xl }] }; }
  const xl = liqB(TmB, HB, T); return { E, liqT, phases: [{ name: 'liquid', x: xl, f: (1 - x) / (1 - xl) }, { name: 'solid B', x: 1, f: (x - xl) / (1 - xl) }] };
}
/** State of a lens system at T for overall x. */
export function lensState(TmA: number, HA: number, TmB: number, HB: number, x: number, T: number) {
  const t = lensTemps(TmA, HA, TmB, HB, x);
  if (T >= t.liq) return { ...t, phases: [{ name: 'liquid', x, f: 1 }] };
  if (T <= t.sol) return { ...t, phases: [{ name: 'solid', x, f: 1 }] };
  const c = lens(TmA, HA, TmB, HB, T)!, fS = lever(x, c.xL, c.xS);
  return { ...t, phases: [{ name: 'liquid', x: c.xL, f: 1 - fS }, { name: 'solid', x: c.xS, f: fS }] };
}

/** Lever rule: fraction of phase 2 for overall c0 between phase compositions c1 and c2. */
export const lever = (c0: number, c1: number, c2: number) => (c0 - c1) / (c2 - c1);
/** Mole fraction of B to mass fraction of B, and back. */
export const toMass = (x: number, MA: number, MB: number) => (x * MB) / (x * MB + (1 - x) * MA);
export const toMole = (w: number, MA: number, MB: number) => (w / MB) / (w / MB + (1 - w) / MA);

/** Melting points (K), enthalpies of fusion (J/mol) and molar masses (CRC). */
export const SYSTEMS = [
  { id: 'CuNi', type: 'lens', A: { n: 'Cu', Tm: 1357.77, H: 13260, M: 63.546 }, B: { n: 'Ni', Tm: 1728, H: 17480, M: 58.693 } },
  { id: 'GeSi', type: 'lens', A: { n: 'Ge', Tm: 1211.4, H: 36940, M: 72.63 }, B: { n: 'Si', Tm: 1687, H: 50210, M: 28.085 } },
  { id: 'BzNp', type: 'eutectic', A: { n: 'benzene', Tm: 278.68, H: 9870, M: 78.11 }, B: { n: 'naphthalene', Tm: 353.4, H: 19010, M: 128.17 } },
  { id: 'BiCd', type: 'eutectic', A: { n: 'Bi', Tm: 544.55, H: 11300, M: 208.98 }, B: { n: 'Cd', Tm: 594.22, H: 6210, M: 112.41 } },
];
