// Shallow footing bearing capacity: Terzaghi, Meyerhof and Hansen bearing capacity factors from their formulas,
// shape and depth factors, the water table correction and the allowable bearing pressure and load.
// Plain maths, no DOM. Angles in degrees, lengths in m, unit weights in kN/m³, pressures in kPa.

const rad = (d: number) => (d * Math.PI) / 180;
export type Method = 'terzaghi' | 'meyerhof' | 'hansen';
export type Shape = 'strip' | 'square' | 'circle' | 'rectangle';
export type Factors = { Nc: number; Nq: number; Ng: number };

/** Terzaghi's factors. Nq and Nc are his closed forms; Nγ has no closed form in his work, so the common
 * approximation Nγ = 2(Nq + 1) tan φ / (1 + 0.4 sin 4φ) is used (Coduto). At φ = 0, Nc = 1.5π + 1. */
export function terzaghiN(phi: number): Factors {
  const t = Math.tan(rad(phi));
  const a = Math.exp((0.75 * Math.PI - rad(phi) / 2) * t);
  const Nq = (a * a) / (2 * Math.cos(rad(45 + phi / 2)) ** 2);
  const Nc = phi === 0 ? 1.5 * Math.PI + 1 : (Nq - 1) / t;
  const Ng = (2 * (Nq + 1) * t) / (1 + 0.4 * Math.sin(rad(4 * phi)));
  return { Nc, Nq, Ng };
}
/** Prandtl–Reissner Nq and Nc (Meyerhof and Hansen); Nc = π + 2 at φ = 0. */
function prandtl(phi: number) {
  const t = Math.tan(rad(phi));
  const Nq = Math.exp(Math.PI * t) * Math.tan(rad(45 + phi / 2)) ** 2;
  const Nc = phi === 0 ? Math.PI + 2 : (Nq - 1) / t;
  return { Nq, Nc, t };
}
/** Meyerhof (1963): Nγ = (Nq − 1) tan(1.4φ). */
export function meyerhofN(phi: number): Factors { const { Nq, Nc } = prandtl(phi); return { Nc, Nq, Ng: (Nq - 1) * Math.tan(rad(1.4 * phi)) }; }
/** Hansen (1970): Nγ = 1.5 (Nq − 1) tan φ. */
export function hansenN(phi: number): Factors { const { Nq, Nc, t } = prandtl(phi); return { Nc, Nq, Ng: 1.5 * (Nq - 1) * t }; }
export const factorsFor = (m: Method, phi: number) => (m === 'terzaghi' ? terzaghiN(phi) : m === 'meyerhof' ? meyerhofN(phi) : hansenN(phi));

export type Input = {
  method: Method; shape: Shape; B: number; L?: number; Df: number; c: number; phi: number;
  gamma: number; gammaSat?: number; Dw?: number; gammaW?: number; FS: number; local?: boolean; fsOn?: 'gross' | 'net';
};
export type Result = {
  method: Method; c: number; phi: number; N: Factors; s: [number, number, number]; d: [number, number, number];
  q: number; gEff: number; waterCase: 0 | 1 | 2 | 3; terms: [number, number, number]; qu: number; qnet: number; qa: number; qaNet: number;
  area: number; Q: number; perMetre: boolean; BL: number;
};

/** Footing area (m²): B × L, B², πB²/4, or 1 m length of a strip. */
export const footArea = (shape: Shape, B: number, L = B) => (shape === 'strip' ? B : shape === 'square' ? B * B : shape === 'circle' ? (Math.PI * B * B) / 4 : B * L);

/** Overburden at footing level and the unit weight for the Nγ term, with the water table at depth Dw below ground. */
export function water(Df: number, B: number, gamma: number, gammaSat: number, Dw: number | undefined, gw = 9.81): { q: number; gEff: number; kase: 0 | 1 | 2 | 3 } {
  const gb = gammaSat - gw;
  if (Dw == null || !Number.isFinite(Dw)) return { q: gamma * Df, gEff: gamma, kase: 0 };
  if (Dw <= Df) return { q: gamma * Dw + gb * (Df - Dw), gEff: gb, kase: 1 };
  if (Dw < Df + B) return { q: gamma * Df, gEff: gb + ((Dw - Df) / B) * (gamma - gb), kase: 2 };
  return { q: gamma * Df, gEff: gamma, kase: 3 };
}

export function bearing(x: Input): Result {
  const { method, shape, B, Df, FS } = x;
  if (!(B > 0)) throw new Error('The footing width B must be above zero.');
  if (shape === 'rectangle' && !(x.L! >= B)) throw new Error('For a rectangle, give a length L at least as big as the width B.');
  if (!(Df >= 0)) throw new Error('The footing depth Df must be 0 or more.');
  if (!(x.phi >= 0 && x.phi <= 50)) throw new Error('The friction angle φ must be between 0 and 50°.');
  if (!(x.c >= 0)) throw new Error('Cohesion c must be 0 or more.');
  if (!(x.gamma > 0)) throw new Error('The unit weight γ must be above zero.');
  if (!(FS >= 1)) throw new Error('The factor of safety must be 1 or more.');
  if (x.Dw != null && Number.isFinite(x.Dw) && !(x.Dw >= 0)) throw new Error('The water table depth must be 0 or more (or left blank for deep water).');
  const gw = x.gammaW ?? 9.81, gs = x.gammaSat ?? x.gamma;
  if (x.Dw != null && Number.isFinite(x.Dw) && !(gs > gw)) throw new Error('The saturated unit weight must be above the unit weight of water.');
  let c = x.c, phi = x.phi;
  if (method === 'terzaghi' && x.local) { c = (2 / 3) * c; phi = (Math.atan((2 / 3) * Math.tan(rad(phi))) * 180) / Math.PI; }
  const N = factorsFor(method, phi);
  const BL = shape === 'strip' ? 0 : shape === 'rectangle' ? B / x.L! : 1;
  let s: [number, number, number] = [1, 1, 1], d: [number, number, number] = [1, 1, 1];
  if (method === 'terzaghi') {
    if (shape === 'square') s = [1.3, 1, 0.8];
    else if (shape === 'circle') s = [1.3, 1, 0.6];
    else if (shape === 'rectangle') s = [1 + 0.3 * BL, 1, 1 - 0.2 * BL];
  } else if (method === 'meyerhof') {
    const Kp = Math.tan(rad(45 + phi / 2)) ** 2, big = phi > 10;
    s = [1 + 0.2 * Kp * BL, big ? 1 + 0.1 * Kp * BL : 1, big ? 1 + 0.1 * Kp * BL : 1];
    const r = Df / B;
    d = [1 + 0.2 * Math.sqrt(Kp) * r, big ? 1 + 0.1 * Math.sqrt(Kp) * r : 1, big ? 1 + 0.1 * Math.sqrt(Kp) * r : 1];
  } else {
    const sn = Math.sin(rad(phi)), t = Math.tan(rad(phi));
    s = [1 + (N.Nq / N.Nc) * BL, 1 + BL * sn, Math.max(0.6, 1 - 0.4 * BL)];
    const k = Df / B <= 1 ? Df / B : Math.atan(Df / B);
    d = [1 + 0.4 * k, 1 + 2 * t * (1 - sn) ** 2 * k, 1];
  }
  const w = water(Df, B, x.gamma, gs, x.Dw, gw);
  const terms: [number, number, number] = [c * N.Nc * s[0] * d[0], w.q * N.Nq * s[1] * d[1], 0.5 * w.gEff * B * N.Ng * s[2] * d[2]];
  const qu = terms[0] + terms[1] + terms[2], qnet = qu - w.q;
  const qa = qu / FS, qaNet = qnet / FS;
  const area = footArea(shape, B, x.L);
  const Q = (x.fsOn === 'net' ? qaNet : qa) * area;
  return { method, c, phi, N, s, d, q: w.q, gEff: w.gEff, waterCase: w.kase, terms, qu, qnet, qa, qaNet, area, Q, perMetre: shape === 'strip', BL };
}
