// A simplified model of the CMB temperature power spectrum, shared by the 7.5 and 7.8 figures (no DOM, so it
// can be checked in Node). It is a teaching toy, not a Boltzmann code: the peak POSITIONS come from real
// physics (the sound horizon r_s, integrated with the baryon-loaded sound speed c/√(3(1+R)), divided into the
// transverse comoving distance to last scattering, with z* from the Hu-Sugiyama fit and the Doran-Lilley
// phase shift), while the peak HEIGHTS use a damped, baryon-shifted oscillator, (cos x + bR)² plus a Doppler
// term, boosted by radiation driving and cut by diffusion (Silk) damping, tuned to look like Planck's curve
// for the Planck 2018 recipe. Good enough to see which way each ingredient pushes the peaks.
const C_KM = 299792.458;               // km/s
const W_GAMMA = 2.473e-5;              // Ω_γ h² for T = 2.7255 K
const W_R = W_GAMMA * (1 + 0.2271 * 3.046); // photons + three neutrino species

export const BASE = { wb: 0.0224, wc: 0.120, h: 0.674, Ok: 0, ns: 0.965, As: 1 };

function simpson(f, a, b, n = 600) {
  const s = (b - a) / n; let t = f(a) + f(b);
  for (let i = 1; i < n; i++) t += f(a + i * s) * (i % 2 ? 4 : 2);
  return (t * s) / 3;
}

/** Redshift of last scattering from the Hu & Sugiyama (1996) fit. */
export function zStar(wb, wm) {
  const g1 = (0.0783 * wb ** -0.238) / (1 + 39.5 * wb ** 0.763), g2 = 0.56 / (1 + 21.1 * wb ** 1.81);
  return 1048 * (1 + 0.00124 * wb ** -0.738) * (1 + g1 * wm ** g2);
}

/** Geometry of last scattering: { zs, rs (Mpc), DM (Mpc), lA, l1, R, leq, theta (deg) }. */
export function geometry(p) {
  const q = { ...BASE, ...p }, wm = q.wb + q.wc, wk = q.Ok * q.h * q.h, wL = q.h * q.h - wm - W_R - wk;
  const H = (a) => 100 * Math.sqrt(W_R / a ** 4 + wm / a ** 3 + wk / a ** 2 + wL); // km/s/Mpc
  const zs = zStar(q.wb, wm), as = 1 / (1 + zs), R0 = (3 * q.wb) / (4 * W_GAMMA);
  // sound horizon: ∫ c_s da / (a² H), with u = √a to tame a → 0
  const rs = simpson((u) => { const a = u * u; if (!a) return 0; return (2 * u * C_KM / Math.sqrt(3 * (1 + R0 * a))) / (a * a * H(a)); }, 0, Math.sqrt(as), 800);
  const dc = simpson((a) => C_KM / (a * a * H(a)), as, 1, 4000);
  const dh = C_KM / (100 * q.h), k = Math.sqrt(Math.abs(q.Ok));
  const DM = Math.abs(q.Ok) < 1e-6 ? dc : q.Ok > 0 ? (dh / k) * Math.sinh((k * dc) / dh) : (dh / k) * Math.sin((k * dc) / dh);
  const lA = (Math.PI * DM) / rs, rr = (W_R * (1 + zs)) / wm, phi = 0.267 * (rr / 0.3) ** 0.1;
  const keq = Math.sqrt(2 * wm * wm / W_R) * 100 / C_KM; // a_eq H(a_eq)/c in 1/Mpc
  return { zs, rs, DM, lA, phi, l1: lA * (1 - phi), R: R0 * as, leq: keq * DM, theta: (rs / DM) * 180 / Math.PI, wm, wL, h: q.h };
}

/** D_ℓ = ℓ(ℓ+1)C_ℓ/2π in µK² at multipole l (simplified model). Pass a geometry g to save time. */
export function Dl(l, p, g = geometry(p)) {
  const q = { ...BASE, ...p };
  const x = Math.PI * (l / g.lA + g.phi);
  // baryons shift the oscillation's zero point (b), so compressions (odd peaks) beat rarefactions (even peaks)
  const b = 0.18 * g.R, d2 = 0.848 / (1 + g.R);
  const osc = (Math.cos(x) - b) ** 2 + d2 * Math.sin(x) ** 2;
  // radiation driving: waves that started before matter-radiation equality (high l) get a push
  // (measured in units of the peak spacing, so it depends only on the early universe, not on the distance)
  const xl = l / g.lA, xe = (0.467 * g.leq) / g.lA;
  // less matter means more radiation at last scattering, decaying wells and a stronger push (rough scaling)
  const drive = (1 + 3.12 * (xl * xl) / (xl * xl + xe * xe)) * (g.wm / 0.1424) ** -0.5;
  // diffusion (Silk) damping: more baryons, shorter photon steps, less blurring
  const lD = g.lA * 3.6 * (q.wb / 0.0224) ** 0.2 * (g.wm / 0.1424) ** -0.08;
  const damp = Math.exp(-((l / lD) ** 1.68));
  const ramp = (l * l) / (l * l + (0.124 * g.lA) ** 2);
  const eisw = 1 + 0.248 * Math.exp(-(((l - g.l1) / (0.312 * g.lA)) ** 2)); // early ISW lifts the first peak
  const sw = 1000 * (1 - ramp) * (1 + 0.5 / l); // Sachs-Wolfe plateau
  return q.As * (l / 220) ** (q.ns - 0.965) * (sw + 1035 * ramp * drive * osc * damp * eisw);
}

/** The curve as [[l, D]] from l = 2 to lmax. */
export function curve(p, lmax = 2000, step = 4) {
  const g = geometry(p), out = [];
  for (let l = 2; l <= lmax; l += l < 40 ? 1 : step) out.push([l, Dl(l, p, g)]);
  return out;
}

/** Peaks of a curve: [[l, D], ...] at local maxima above l = 100. */
export function peaks(cv) {
  const out = [];
  for (let i = 1; i < cv.length - 1; i++) if (cv[i][0] > 100 && cv[i][1] > cv[i - 1][1] && cv[i][1] >= cv[i + 1][1]) out.push(cv[i]);
  return out;
}
