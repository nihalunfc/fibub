// Real gases with cubic equations of state: van der Waals, Redlich-Kwong, Soave-Redlich-Kwong and Peng-Robinson.
// Compressibility factor Z, molar volume, fugacity coefficient, saturation pressure (equal fugacity) and isotherms.
// No DOM. SI units inside: T in K, P in Pa, V in m³/mol.

export const R = 8.314462618; // J/(mol K), CODATA (exact since 2019)

export type Gas = { id: string; name: string; Tc: number; Pc: number; w: number; M: number };
/** Rounded critical temperatures (K), pressures (Pa), acentric factors and molar masses (g/mol) of common gases. Editable on the page. */
export const GASES: Gas[] = [
  { id: 'co2', name: 'Carbon dioxide (CO₂)', Tc: 304.1, Pc: 73.8e5, w: 0.225, M: 44.01 },
  { id: 'n2', name: 'Nitrogen (N₂)', Tc: 126.2, Pc: 33.9e5, w: 0.039, M: 28.01 },
  { id: 'o2', name: 'Oxygen (O₂)', Tc: 154.6, Pc: 50.4e5, w: 0.022, M: 32.0 },
  { id: 'ar', name: 'Argon (Ar)', Tc: 150.9, Pc: 48.7e5, w: 0, M: 39.95 },
  { id: 'ch4', name: 'Methane (CH₄)', Tc: 190.6, Pc: 46.0e5, w: 0.011, M: 16.04 },
  { id: 'c3h8', name: 'Propane (C₃H₈)', Tc: 369.8, Pc: 42.5e5, w: 0.152, M: 44.1 },
  { id: 'nh3', name: 'Ammonia (NH₃)', Tc: 405.4, Pc: 113.3e5, w: 0.253, M: 17.03 },
  { id: 'h2o', name: 'Water (H₂O)', Tc: 647.1, Pc: 220.6e5, w: 0.345, M: 18.02 },
  { id: 'h2', name: 'Hydrogen (H₂)', Tc: 33.2, Pc: 13.0e5, w: -0.216, M: 2.016 },
  { id: 'he', name: 'Helium (He)', Tc: 5.2, Pc: 2.27e5, w: -0.39, M: 4.003 },
];

export type Eos = 'ideal' | 'vdw' | 'rk' | 'srk' | 'pr';
export const EOS_NAMES: Record<Eos, string> = { ideal: 'Ideal gas', vdw: 'van der Waals', rk: 'Redlich-Kwong', srk: 'Soave-Redlich-Kwong', pr: 'Peng-Robinson' };
export const EOS_LIST: Eos[] = ['ideal', 'vdw', 'rk', 'srk', 'pr'];

/** Generic cubic P = RT/(V − b) − a α / ((V + ε b)(V + σ b)). */
const SHAPE: Record<Exclude<Eos, 'ideal'>, { oa: number; ob: number; eps: number; sig: number }> = {
  vdw: { oa: 27 / 64, ob: 1 / 8, eps: 0, sig: 0 },
  rk: { oa: 0.42748, ob: 0.08664, eps: 0, sig: 1 },
  srk: { oa: 0.42748, ob: 0.08664, eps: 0, sig: 1 },
  pr: { oa: 0.45724, ob: 0.0778, eps: 1 - Math.SQRT2, sig: 1 + Math.SQRT2 },
};

/** The equation's a (with its temperature function α included, Pa m⁶/mol²) and b (m³/mol) at temperature T. */
export function params(eos: Eos, g: Pick<Gas, 'Tc' | 'Pc' | 'w'>, T: number) {
  if (eos === 'ideal') return { a: 0, b: 0, eps: 0, sig: 0, alpha: 1 };
  const s = SHAPE[eos], Tr = T / g.Tc;
  let alpha = 1;
  if (eos === 'rk') alpha = 1 / Math.sqrt(Tr);
  if (eos === 'srk') { const m = 0.48 + 1.574 * g.w - 0.176 * g.w * g.w; alpha = (1 + m * (1 - Math.sqrt(Tr))) ** 2; }
  if (eos === 'pr') { const k = 0.37464 + 1.54226 * g.w - 0.26992 * g.w * g.w; alpha = (1 + k * (1 - Math.sqrt(Tr))) ** 2; }
  return { a: (s.oa * R * R * g.Tc * g.Tc / g.Pc) * alpha, b: (s.ob * R * g.Tc) / g.Pc, eps: s.eps, sig: s.sig, alpha };
}

/** Pressure (Pa) from temperature and molar volume. */
export function pressure(eos: Eos, g: Pick<Gas, 'Tc' | 'Pc' | 'w'>, T: number, V: number) {
  const p = params(eos, g, T);
  if (V <= p.b) return NaN;
  return (R * T) / (V - p.b) - p.a / ((V + p.eps * p.b) * (V + p.sig * p.b));
}

/** Real roots of x³ + c2 x² + c1 x + c0, ascending. */
export function cubicRoots(c2: number, c1: number, c0: number): number[] {
  const p = c1 - (c2 * c2) / 3, q = (2 * c2 * c2 * c2) / 27 - (c2 * c1) / 3 + c0, sh = -c2 / 3;
  const disc = (q * q) / 4 + (p * p * p) / 27;
  let r: number[];
  if (Math.abs(p) < 1e-300 && Math.abs(q) < 1e-300) r = [sh];
  else if (disc > 0) { const s = Math.sqrt(disc), u = Math.cbrt(-q / 2 + s), v = Math.cbrt(-q / 2 - s); r = [u + v + sh]; }
  else {
    const m = 2 * Math.sqrt(-p / 3), th = Math.acos(Math.max(-1, Math.min(1, ((3 * q) / (p * m)) ))) / 3;
    r = [0, 1, 2].map((k) => m * Math.cos(th - (2 * Math.PI * k) / 3) + sh);
  }
  // Polish with Newton steps (the closed forms lose digits near repeated roots).
  r = r.map((x) => { for (let i = 0; i < 6; i++) { const f = ((x + c2) * x + c1) * x + c0, d = (3 * x + 2 * c2) * x + c1; if (!d) break; const dx = f / d; x -= dx; if (Math.abs(dx) < 1e-15 * Math.max(1, Math.abs(x))) break; } return x; });
  return r.sort((a, b) => a - b);
}

/** ln φ (fugacity coefficient) for a root Z, with A = aP/(RT)², B = bP/RT. */
export function lnPhi(Z: number, A: number, B: number, eps: number, sig: number) {
  if (sig === eps) return Z - 1 - Math.log(Z - B) - (B ? A / Z : 0);
  return Z - 1 - Math.log(Z - B) - (A / (B * (sig - eps))) * Math.log((Z + sig * B) / (Z + eps * B));
}

export type State = { Z: number; V: number; phi: number; roots: number[]; phase: 'one root' | 'vapour-like' | 'liquid-like'; A: number; B: number };

/** All the compressibility roots at (T, P) and the stable one (lowest Gibbs energy, i.e. smallest φ). */
export function solveTP(eos: Eos, g: Pick<Gas, 'Tc' | 'Pc' | 'w'>, T: number, P: number): State {
  if (eos === 'ideal') return { Z: 1, V: (R * T) / P, phi: 1, roots: [1], phase: 'one root', A: 0, B: 0 };
  const p = params(eos, g, T), A = (p.a * P) / (R * T) ** 2, B = (p.b * P) / (R * T), u = p.eps + p.sig, w = p.eps * p.sig;
  const roots = cubicRoots(-(1 + B - u * B), A + w * B * B - u * B - u * B * B, -(A * B + w * B * B + w * B * B * B)).filter((z) => z > B && Number.isFinite(z));
  const uniq = roots.filter((z, i) => i === 0 || Math.abs(z - roots[i - 1]) > 1e-9);
  let Z = uniq[uniq.length - 1], phase: State['phase'] = 'one root';
  if (uniq.length > 1) {
    const lo = uniq[0], hi = uniq[uniq.length - 1];
    const fl = lnPhi(lo, A, B, p.eps, p.sig), fv = lnPhi(hi, A, B, p.eps, p.sig);
    if (fl < fv) { Z = lo; phase = 'liquid-like'; } else phase = 'vapour-like';
  }
  return { Z, V: (Z * R * T) / P, phi: Math.exp(lnPhi(Z, A, B, p.eps, p.sig)), roots: uniq, phase, A, B };
}

/** Saturation (vapour) pressure in Pa predicted by the equation at T < Tc: where liquid and vapour roots have equal fugacity. NaN above Tc or for the ideal gas. */
export function psat(eos: Eos, g: Pick<Gas, 'Tc' | 'Pc' | 'w'>, T: number): { P: number; ZL: number; ZV: number } | null {
  if (eos === 'ideal' || T >= g.Tc) return null;
  const p = params(eos, g, T);
  const both = (P: number) => {
    const A = (p.a * P) / (R * T) ** 2, B = (p.b * P) / (R * T), u = p.eps + p.sig, w = p.eps * p.sig;
    const r = cubicRoots(-(1 + B - u * B), A + w * B * B - u * B - u * B * B, -(A * B + w * B * B + w * B * B * B)).filter((z) => z > B);
    if (r.length < 2) return null;
    const ZL = r[0], ZV = r[r.length - 1];
    return { ZL, ZV, d: lnPhi(ZL, A, B, p.eps, p.sig) - lnPhi(ZV, A, B, p.eps, p.sig) };
  };
  // Find the pressure range with three roots from the spinodal points of the isotherm, then bisect on ln φL − ln φV.
  const Vs: number[] = []; const Ps: number[] = [];
  for (let i = 0; i <= 4000; i++) { const V = p.b * (1.0005 + 1e4 * Math.pow(i / 4000, 3)); Vs.push(V); Ps.push(pressure(eos, g, T, V)); }
  let pmin = NaN, pmax = NaN;
  for (let i = 1; i < Ps.length - 1; i++) {
    if (Ps[i] < Ps[i - 1] && Ps[i] <= Ps[i + 1] && Number.isNaN(pmin)) pmin = Ps[i];
    if (Ps[i] > Ps[i - 1] && Ps[i] >= Ps[i + 1] && !Number.isNaN(pmin)) { pmax = Ps[i]; break; }
  }
  if (!(pmax > 0)) return null;
  let lo = Math.max(pmin, pmax * 1e-12) * (1 + 1e-9), hi = pmax * (1 - 1e-9);
  let flo = both(lo), fhi = both(hi);
  if (!flo || !fhi) return null;
  if (flo.d * fhi.d > 0) return null;
  for (let i = 0; i < 200 && hi - lo > 1e-12 * hi; i++) {
    const mid = Math.sqrt(lo * hi) > 0 && lo > 0 ? Math.sqrt(lo * hi) : (lo + hi) / 2, f = both(mid);
    if (!f) break;
    if (f.d * flo.d > 0) { lo = mid; flo = f; } else { hi = mid; fhi = f; }
  }
  const P = (lo + hi) / 2, f = both(P)!;
  return { P, ZL: f.ZL, ZV: f.ZV };
}

/** Z against pressure (Pa) at temperature T for one equation, stable root at each pressure. */
export function zCurve(eos: Eos, g: Pick<Gas, 'Tc' | 'Pc' | 'w'>, T: number, Pmax: number, n = 160) {
  const P: number[] = [], Z: number[] = [];
  for (let i = 1; i <= n; i++) { const p = (Pmax * i) / n; P.push(p); Z.push(solveTP(eos, g, T, p).Z); }
  return { P, Z };
}
