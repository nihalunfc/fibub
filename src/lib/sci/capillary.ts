// Capillary rise for the school capillary-rise tool: Jurin's law h = 2T cos θ/(rρg), the meniscus radius, the
// pressure step across a curved surface 2T/R, and what happens in a tube shorter than h. Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 9.8;
// Rounded values near 20 °C (surface tension N/m, contact angle with clean glass in degrees, density kg/m³):
// typical teaching numbers, not data for any particular sample.
export const LIQUIDS = [
  { id: 'water', name: 'Water', T: 0.073, theta: 0, rho: 1000 },
  { id: 'soapy', name: 'Soapy water', T: 0.03, theta: 0, rho: 1000 },
  { id: 'ethanol', name: 'Alcohol (ethanol)', T: 0.022, theta: 0, rho: 790 },
  { id: 'mercury', name: 'Mercury', T: 0.48, theta: 140, rho: 13600 },
];
const rad = (d: number) => (d * Math.PI) / 180;

/** Height (m) the liquid rises (minus: falls) in a tube of radius r (m). */
export const rise = (T: number, thetaDeg: number, r: number, rho: number) => (2 * T * Math.cos(rad(thetaDeg))) / (r * rho * G);

/** Full picture for a tube of radius r sticking out L (m) above the liquid. */
export function tube(T: number, thetaDeg: number, r: number, rho: number, L: number) {
  const h = rise(T, thetaDeg, r, rho), R = r / Math.abs(Math.cos(rad(thetaDeg)) || 1e-12);
  const short = h > L;
  // in a short tube the column stops at the top and the meniscus flattens until 2T/R' = ρgL
  const hShown = short ? L : h, Rtop = short ? (2 * T) / (rho * G * L) : R;
  return { h, hShown, short, R, Rtop, dp: (2 * T) / R, weight: Math.PI * r * r * Math.abs(h) * rho * G, pull: 2 * Math.PI * r * T * Math.abs(Math.cos(rad(thetaDeg))) };
}

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const r = one(rng, [0.1, 0.2, 0.25, 0.5, 1]), h = rise(0.073, 0, r / 1000, 1000) * 100;
    qs.push({ text: `How high, in cm, does water (surface tension 0.073 N/m, contact angle 0°) rise in a glass tube of radius ${r} mm? (g = 9.8 m/s²)`, ans: h, unit: 'cm', work: `h = 2T cos θ ÷ (r ρ g) = 2 × 0.073 × 1 ÷ (${r} × 10⁻³ × 1000 × 9.8) = ${n(h / 100, 5)} m = ${n(h, 2)} cm.`, tol: Math.max(0.01, h * 0.01) }); }
  { const k = one(rng, [2, 3, 4, 5]), h = pick(rng, 2, 9);
    qs.push({ text: `Water rises ${h} cm in a capillary tube. How high does it rise, in cm, in a tube with ${k} times the radius?`, ans: h / k, unit: 'cm', work: `h × r stays the same (Jurin's law), so h = ${h} ÷ ${k} = ${n(h / k, 3)} cm.`, tol: 0.01 }); }
  { const r = one(rng, [0.5, 1, 2]), T = 0.073, R = r / 1000, dp = (2 * T) / R;
    qs.push({ text: `By how much, in Pa, is the pressure just under a curved water surface of radius ${r} mm lower than the air above it? (T = 0.073 N/m)`, ans: dp, unit: 'Pa', work: `Δp = 2T ÷ R = 2 × 0.073 ÷ ${r} × 10⁻³ = ${n(dp, 1)} Pa.`, tol: Math.max(0.5, dp * 0.01) }); }
  { const h = pick(rng, 2, 6), r = one(rng, [0.1, 0.2, 0.25]), T = (h / 100) * (r / 1000) * 1000 * G / 2;
    qs.push({ text: `A liquid of density 1000 kg/m³ that wets glass (contact angle 0°) rises ${h} cm in a tube of radius ${r} mm. What is its surface tension in N/m?`, ans: T, unit: 'N/m', work: `T = h r ρ g ÷ (2 cos θ) = ${h / 100} × ${r} × 10⁻³ × 1000 × 9.8 ÷ 2 = ${n(T, 4)} N/m.`, tol: Math.max(0.0005, T * 0.01) }); }
  return qs;
}
