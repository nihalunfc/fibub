// Galaxy rotation curves: a Hernquist bulge, a thin exponential disc (Freeman 1970) and a dark halo
// (NFW or pseudo-isothermal), and a least-squares fit of them to measured circular speeds.
import { nelderMead, invert } from './rvfit.ts';

/** G in kpc (km/s)² per solar mass. */
export const G = 4.30091e-6;

// Modified Bessel functions I0, I1, K0, K1 (Abramowitz and Stegun 9.8.1–9.8.8, error below 2e-7 relative).
export function besselI0(x: number) {
  const ax = Math.abs(x);
  if (ax < 3.75) { const y = (x / 3.75) ** 2; return 1 + y * (3.5156229 + y * (3.0899424 + y * (1.2067492 + y * (0.2659732 + y * (0.0360768 + y * 0.0045813))))); }
  const y = 3.75 / ax;
  return (Math.exp(ax) / Math.sqrt(ax)) * (0.39894228 + y * (0.01328592 + y * (0.00225319 + y * (-0.00157565 + y * (0.00916281 + y * (-0.02057706 + y * (0.02635537 + y * (-0.01647633 + y * 0.00392377))))))));
}
export function besselI1(x: number) {
  const ax = Math.abs(x);
  let r: number;
  if (ax < 3.75) { const y = (x / 3.75) ** 2; r = ax * (0.5 + y * (0.87890594 + y * (0.51498869 + y * (0.15084934 + y * (0.02658733 + y * (0.00301532 + y * 0.00032411)))))); }
  else { const y = 3.75 / ax; r = (Math.exp(ax) / Math.sqrt(ax)) * (0.39894228 + y * (-0.03988024 + y * (-0.00362018 + y * (0.00163801 + y * (-0.01031555 + y * (0.02282967 + y * (-0.02895312 + y * (0.01787654 - y * 0.00420059)))))))); }
  return x < 0 ? -r : r;
}
export function besselK0(x: number) {
  if (x <= 2) { const y = (x * x) / 4; return -Math.log(x / 2) * besselI0(x) + (-0.57721566 + y * (0.4227842 + y * (0.23069756 + y * (0.0348859 + y * (0.00262698 + y * (0.0001075 + y * 0.0000074)))))); }
  const y = 2 / x;
  return (Math.exp(-x) / Math.sqrt(x)) * (1.25331414 + y * (-0.07832358 + y * (0.02189568 + y * (-0.01062446 + y * (0.00587872 + y * (-0.0025154 + y * 0.00053208))))));
}
export function besselK1(x: number) {
  if (x <= 2) { const y = (x * x) / 4; return Math.log(x / 2) * besselI1(x) + (1 / x) * (1 + y * (0.15443144 + y * (-0.67278579 + y * (-0.18156897 + y * (-0.01919402 + y * (-0.00110404 - y * 0.00004686)))))); }
  const y = 2 / x;
  return (Math.exp(-x) / Math.sqrt(x)) * (1.25331414 + y * (0.23498619 + y * (-0.0365562 + y * (0.01504268 + y * (-0.00780353 + y * (0.00325614 - y * 0.00068245))))));
}

/** Exponential disc of mass M (M☉) and scale length Rd (kpc): v (km/s) at radius R (kpc). */
export function vDisc(R: number, M: number, Rd: number) {
  if (R <= 0 || M <= 0) return 0;
  const y = R / (2 * Rd), s0 = M / (2 * Math.PI * Rd * Rd);
  // For large y the product of Bessel functions loses precision; use the point-mass limit beyond y = 30.
  if (y > 30) return Math.sqrt((G * M) / R);
  const v2 = 4 * Math.PI * G * s0 * Rd * y * y * (besselI0(y) * besselK0(y) - besselI1(y) * besselK1(y));
  return Math.sqrt(Math.max(0, v2));
}
/** Hernquist bulge of mass M and scale a. */
export const vBulge = (r: number, M: number, a: number) => (r <= 0 || M <= 0 ? 0 : Math.sqrt((G * M * r) / (r + a) ** 2));
/** NFW halo from its characteristic density ρs (M☉/kpc³) and scale radius rs (kpc). */
export function vNFW(r: number, rhos: number, rs: number) {
  if (r <= 0 || rhos <= 0) return 0; const x = r / rs;
  return Math.sqrt((4 * Math.PI * G * rhos * rs ** 3 * (Math.log(1 + x) - x / (1 + x))) / r);
}
/** Pseudo-isothermal halo with central density ρ0 and core radius rc: flat at large radius. */
export function vIso(r: number, rho0: number, rc: number) {
  if (r <= 0 || rho0 <= 0) return 0;
  return Math.sqrt(4 * Math.PI * G * rho0 * rc * rc * (1 - (rc / r) * Math.atan(r / rc)));
}

export type HaloKind = 'nfw' | 'iso';
export type Model = { Mb: number; ab: number; Md: number; Rd: number; rho: number; rh: number; halo: HaloKind };
export function components(r: number, m: Model) {
  const b = vBulge(r, m.Mb, m.ab), d = vDisc(r, m.Md, m.Rd), h = m.halo === 'nfw' ? vNFW(r, m.rho, m.rh) : vIso(r, m.rho, m.rh);
  return { bulge: b, disc: d, halo: h, total: Math.sqrt(b * b + d * d + h * h) };
}
/** Mass inside radius r from the total circular speed: M = v² r / G. */
export const enclosedMass = (r: number, v: number) => (v * v * r) / G;

const KEYS = ['Mb', 'ab', 'Md', 'Rd', 'rho', 'rh'] as const;
export type Fit = { m: Model; err: Record<(typeof KEYS)[number], number>; chi2: number; dof: number; redChi2: number; free: string[] };

/** Fit the model to radii r (kpc), speeds v (km/s) and errors dv. Parameters are fitted as logarithms so they stay
 *  positive. With `noBulge`, the bulge is left out; `fixRd` holds the disc scale length (e.g. from photometry). */
export function fitRotation(r: number[], v: number[], dv: number[], opts: { halo: HaloKind; noBulge?: boolean; fixRd?: number; start?: Partial<Model> }): Fit {
  const n = r.length;
  if (n < 4) throw new Error('Give at least 4 points to fit a rotation curve.');
  const rmax = Math.max(...r), vmax = Math.max(...v);
  const s = opts.start ?? {};
  const base: Model = {
    Mb: s.Mb ?? (opts.noBulge ? 0 : 0.1 * enclosedMass(rmax, vmax) * 0.2), ab: s.ab ?? Math.max(0.1, rmax / 30),
    Md: s.Md ?? 0.4 * enclosedMass(rmax / 2, vmax), Rd: opts.fixRd ?? s.Rd ?? rmax / 6,
    rho: s.rho ?? (opts.halo === 'nfw' ? 1e7 : 3e7), rh: s.rh ?? rmax / 2, halo: opts.halo,
  };
  const free = KEYS.filter((k) => !(opts.noBulge && (k === 'Mb' || k === 'ab')) && !(opts.fixRd && k === 'Rd'));
  const toModel = (x: number[]) => { const m = { ...base }; free.forEach((k, i) => ((m as Record<string, number | string>)[k] = Math.exp(x[i]))); if (opts.noBulge) m.Mb = 0; return m; };
  const chi = (m: Model) => r.reduce((acc, ri, i) => acc + ((v[i] - components(ri, m).total) / dv[i]) ** 2, 0);
  // A few starting halo scales, then polish the best.
  let best: number[] | null = null, bc = Infinity;
  for (const rh of [rmax / 6, rmax / 2, rmax * 1.5]) for (const rho of opts.halo === 'nfw' ? [3e6, 3e7] : [1e7, 1e8]) {
    const x0 = free.map((k) => Math.log(k === 'rh' ? rh : k === 'rho' ? rho : (base[k] as number)));
    const x = nelderMead((x) => chi(toModel(x)), x0, free.map(() => 0.5), 800), c = chi(toModel(x));
    if (c < bc) { bc = c; best = x; }
  }
  let x = nelderMead((xx) => chi(toModel(xx)), best!, free.map(() => 0.1), 1500);
  x = nelderMead((xx) => chi(toModel(xx)), x, free.map(() => 0.02), 1500);
  const m = toModel(x), chi2 = chi(m), dof = Math.max(1, n - free.length);
  // Uncertainties from the Jacobian of the residuals in the log parameters, then scaled back.
  const res = (xx: number[]) => { const mm = toModel(xx); return r.map((ri, i) => (v[i] - components(ri, mm).total) / dv[i]); };
  const J = free.map((_, j) => { const h = 1e-4, up = [...x], dn = [...x]; up[j] += h; dn[j] -= h; const a = res(up), b = res(dn); return a.map((q, i) => (q - b[i]) / (2 * h)); });
  const cov = invert(free.map((_, i) => free.map((__, j) => J[i].reduce((acc, q, k) => acc + q * J[j][k], 0))));
  const err = { Mb: 0, ab: 0, Md: 0, Rd: 0, rho: 0, rh: 0 };
  if (cov) free.forEach((k, i) => (err[k] = (m[k] as number) * Math.sqrt(Math.max(0, cov[i][i]))));
  return { m, err, chi2, dof, redChi2: chi2 / dof, free: [...free] };
}

/** Virial radius r200 (kpc) and mass M200 (M☉) of an NFW halo, where the mean density is 200 × critical (H0 in km/s/Mpc). */
export function nfwVirial(rhos: number, rs: number, H0 = 70) {
  const rhoc = (3 * (H0 / 1000) ** 2) / (8 * Math.PI * G); // M☉/kpc³ with H in km/s/kpc
  const mass = (r: number) => 4 * Math.PI * rhos * rs ** 3 * (Math.log(1 + r / rs) - r / rs / (1 + r / rs));
  let lo = rs * 0.01, hi = rs * 1000;
  for (let k = 0; k < 200; k++) { const mid = Math.sqrt(lo * hi); if (mass(mid) / ((4 / 3) * Math.PI * mid ** 3) > 200 * rhoc) lo = mid; else hi = mid; }
  const r200 = Math.sqrt(lo * hi);
  return { r200, m200: mass(r200), c: r200 / rs, rhoc };
}
