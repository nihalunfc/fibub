// Floating and sinking for the school buoyancy-lab tool: Archimedes' principle (the upthrust equals the weight of
// liquid pushed aside), the part of a floating block under the liquid, the push needed to sink it further, and the
// spring-balance reading of a block that sinks (apparent weight, relative density). Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

export const G = 9.8;
// Rounded, typical densities in kg/m³ (made-up teaching values; real samples vary).
export const OBJECTS = [
  { id: 'cork', name: 'Cork', rho: 240 },
  { id: 'wood', name: 'Wood (pine)', rho: 500 },
  { id: 'wax', name: 'Candle wax', rho: 900 },
  { id: 'ice', name: 'Ice', rho: 920 },
  { id: 'aluminium', name: 'Aluminium', rho: 2700 },
  { id: 'iron', name: 'Iron', rho: 7900 },
];
export const LIQUIDS = [
  { id: 'water', name: 'Fresh water', rho: 1000 },
  { id: 'sea', name: 'Sea water', rho: 1025 },
  { id: 'kerosene', name: 'Kerosene', rho: 800 },
  { id: 'glycerine', name: 'Glycerine', rho: 1260 },
  { id: 'mercury', name: 'Mercury', rho: 13600 },
];

/** A cube of side a (m) and density rho in a liquid of density sigma. pushFrac (0..1): how much of it you hold
 *  under (only used if it floats; at least its own floating depth). */
export function cube(a: number, rho: number, sigma: number, pushFrac = 0) {
  const V = a ** 3, weight = rho * V * G, floats = rho < sigma;
  const floatFrac = floats ? rho / sigma : 1;
  const under = floats ? Math.max(floatFrac, Math.min(1, pushFrac)) : 1;
  const upthrust = sigma * V * under * G;
  return {
    V, weight, floats, floatFrac, under, upthrust,
    push: floats ? Math.max(0, upthrust - weight) : 0,           // your extra push down to hold it there
    balance: floats ? 0 : weight - upthrust,                      // spring balance reading when it hangs fully under
    displacedMl: V * under * 1e6, displacedWeight: sigma * V * under * G,
    relDensity: rho / 1000,
  };
}
/** Relative density from spring-balance readings in air and fully in water. */
export const relativeDensity = (wAir: number, wWater: number) => wAir / (wAir - wWater);

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const rho = one(rng, [400, 500, 600, 750, 800, 900]), sigma = one(rng, [1000, 1000, 1250]);
    qs.push({ text: `A block of density ${rho} kg/m³ floats in a liquid of density ${sigma} kg/m³. What percentage of it is under the surface?`, ans: (rho / sigma) * 100, unit: '%', work: `Floating: weight = upthrust, ρV g = σ V_under g, so V_under/V = ρ/σ = ${rho}/${sigma} = ${n((rho / sigma) * 100, 2)} %.`, tol: 0.1 }); }
  { const m = pick(rng, 2, 9), V = pick(rng, 2, 8) * 100, up = 1000 * V * 1e-6 * G, app = m * G - up;
    qs.push({ text: `A ${m} kg stone of volume ${V} cm³ hangs from a spring balance, fully under water. What does the balance read, in N? (g = 9.8 m/s²)`, ans: app, unit: 'N', work: `Weight ${n(m * G, 2)} N; upthrust = weight of ${V} cm³ of water = ${n(up, 3)} N; reading = ${n(m * G, 2)} − ${n(up, 3)} = ${n(app, 3)} N.`, tol: 0.02 }); }
  { const wa = pick(rng, 20, 60), rd = one(rng, [2, 2.5, 4, 5, 8]), ww = wa - wa / rd;
    qs.push({ text: `An object weighs ${wa} N in air and ${n(ww, 2)} N when fully under water. What is its relative density?`, ans: rd, unit: '', work: `Loss of weight = ${wa} − ${n(ww, 2)} = ${n(wa - ww, 2)} N = weight of the same volume of water. RD = ${wa} ÷ ${n(wa - ww, 2)} = ${n(rd, 2)}.`, tol: 0.02 }); }
  { const a = one(rng, [10, 20]), rho = one(rng, [500, 600, 800]), push = 1000 * (a / 100) ** 3 * G - rho * (a / 100) ** 3 * G;
    qs.push({ text: `What extra force, in N, holds a ${a} cm wooden cube of density ${rho} kg/m³ just fully under fresh water? (g = 9.8 m/s²)`, ans: push, unit: 'N', work: `Fully under, upthrust = 1000 × ${n((a / 100) ** 3, 4)} × 9.8 = ${n(1000 * (a / 100) ** 3 * G, 2)} N; weight = ${n(rho * (a / 100) ** 3 * G, 2)} N; push = ${n(push, 2)} N.`, tol: Math.max(0.02, push * 0.01) }); }
  return qs;
}
