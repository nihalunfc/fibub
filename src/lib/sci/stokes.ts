// A ball falling through a thick liquid for the school stokes-terminal-velocity tool: Stokes' drag 6πηrv, the
// terminal velocity 2r²(ρ − σ)g/9η, how the speed builds up to it, the Reynolds number that says whether Stokes'
// law holds, and the viscosity worked back from a timed fall. Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 9.8;
// Rounded densities (kg/m³) and viscosities (Pa s, near 20 °C): typical teaching values, not data for a sample.
export const BALLS = [
  { id: 'steel', name: 'Steel', rho: 7800 },
  { id: 'glass', name: 'Glass', rho: 2500 },
  { id: 'aluminium', name: 'Aluminium', rho: 2700 },
  { id: 'nylon', name: 'Nylon', rho: 1150 },
];
export const LIQUIDS = [
  { id: 'glycerine', name: 'Glycerine', rho: 1260, eta: 1.4 },
  { id: 'castor', name: 'Castor oil', rho: 960, eta: 1.0 },
  { id: 'honey', name: 'Honey', rho: 1420, eta: 10 },
  { id: 'water', name: 'Water', rho: 1000, eta: 0.001 },
];

/** Ball radius r (m), densities (kg/m³), viscosity eta (Pa s). Speeds in m/s, tau in s. */
export function fall(r: number, rhoBall: number, rhoLiq: number, eta: number) {
  const vt = (2 * r * r * (rhoBall - rhoLiq) * G) / (9 * eta), tau = (2 * rhoBall * r * r) / (9 * eta);
  const m = (4 / 3) * Math.PI * r ** 3 * rhoBall;
  return { vt, tau, re: (rhoLiq * Math.abs(vt) * 2 * r) / eta, weight: m * G, buoy: (4 / 3) * Math.PI * r ** 3 * rhoLiq * G, dragAtVt: 6 * Math.PI * eta * r * Math.abs(vt) };
}
/** Speed and distance fallen at time t from rest. */
export const speedAt = (vt: number, tau: number, t: number) => vt * (1 - Math.exp(-t / tau));
export const distanceAt = (vt: number, tau: number, t: number) => vt * (t - tau * (1 - Math.exp(-t / tau)));
/** Time to fall distance s from rest (bisection on distanceAt). */
export function timeToFall(vt: number, tau: number, s: number) {
  if (vt <= 0) return Infinity;
  let lo = 0, hi = s / vt + 10 * tau; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (distanceAt(vt, tau, mid) < s) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
/** Viscosity from a measured steady speed v. */
export const etaFromSpeed = (r: number, rhoBall: number, rhoLiq: number, v: number) => (2 * r * r * (rhoBall - rhoLiq) * G) / (9 * v);

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const r = one(rng, [1, 1.5, 2]), eta = one(rng, [0.8, 1, 1.4]), vt = (2 * (r / 1000) ** 2 * (7800 - 1260) * G) / (9 * eta) * 100;
    qs.push({ text: `A steel ball (7800 kg/m³) of radius ${r} mm falls through a liquid of density 1260 kg/m³ and viscosity ${eta} Pa s. What is its terminal velocity in cm/s? (g = 9.8 m/s²)`, ans: vt, unit: 'cm/s', work: `v = 2r²(ρ − σ)g ÷ 9η = 2 × (${r} × 10⁻³)² × ${7800 - 1260} × 9.8 ÷ (9 × ${eta}) = ${n(vt / 100, 5)} m/s = ${n(vt, 3)} cm/s.`, tol: Math.max(0.005, vt * 0.01) }); }
  { const k = one(rng, [2, 3, 4]);
    qs.push({ text: `The radius of a ball falling through oil is made ${k} times bigger. By what factor does its terminal velocity change?`, ans: k * k, unit: '×', work: `v ∝ r², so it goes up ${k}² = ${k * k} times.`, tol: 0.01 }); }
  { const d = pick(rng, 5, 20), t = pick(rng, 4, 20), v = d / t;
    qs.push({ text: `A ball falls steadily ${d} cm in ${t} s. What is its terminal velocity in cm/s?`, ans: v, unit: 'cm/s', work: `v = distance ÷ time = ${d} ÷ ${t} = ${n(v, 3)} cm/s.`, tol: 0.01 }); }
  { const eta = one(rng, [0.5, 1, 2]), r = one(rng, [1, 2]), v = pick(rng, 1, 5), f = 6 * Math.PI * eta * (r / 1000) * (v / 100) * 1000;
    qs.push({ text: `What is the drag force, in mN, on a ball of radius ${r} mm moving at ${v} cm/s through a liquid of viscosity ${eta} Pa s?`, ans: f, unit: 'mN', work: `Stokes: F = 6πηrv = 6π × ${eta} × ${r} × 10⁻³ × ${v} × 10⁻² = ${n(f / 1000, 6)} N = ${n(f, 3)} mN.`, tol: Math.max(0.001, f * 0.01) }); }
  return qs;
}
