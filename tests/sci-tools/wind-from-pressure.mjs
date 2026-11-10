// #1222 wind from pressure: air density against the known 1.292 kg/m³ at 0 °C; the isothermal pressure with
// height against a step-by-step integration of dp/dz = −ρg; the flow has no divergence; parcels move the right way.
import { density, pressureAloft, wind, strength, parcels, stepParcels, groundWind, questions, PRESETS, P0 } from '../../src/lib/sci/j3-wind.ts';
export default async (check) => {
  check('wind: dry air at 0 °C and 101,325 Pa is 1.2922 kg/m³; at 30 °C 1.1644', Math.abs(density(P0, 0) - 1.2922) < 1e-4 && Math.abs(density(P0, 30) - 1.1644) < 1e-4);
  let p = P0; const dz = 0.5; for (let z = 0; z < 1000; z += dz) p -= density(p, 25) * 9.81 * dz; // Euler, ρ from the current p
  check('wind: pressure 1 km up (25 °C column) matches a 0.5 m step integration within 2 Pa', Math.abs(pressureAloft(25, 1000) - p) < 2);
  check('wind: warmer column has higher pressure aloft (35 vs 25 °C: about 336 Pa at 1 km)', Math.abs(pressureAloft(35, 1000) - pressureAloft(25, 1000) - 336) < 5);
  // divergence by finite differences
  let maxDiv = 0; const e = 1e-5;
  for (let i = 1; i < 20; i++) for (let j = 1; j < 20; j++) { const x = i / 20, y = j / 20; const d = (wind(x + e, y, 0.3)[0] - wind(x - e, y, 0.3)[0]) / (2 * e) + (wind(x, y + e, 0.3)[1] - wind(x, y - e, 0.3)[1]) / (2 * e); maxDiv = Math.max(maxDiv, Math.abs(d)); }
  check('wind: the flow has no divergence (air is not made or lost)', maxDiv < 1e-6);
  check('wind: no flow through the box walls', [0.1, 0.5, 0.9].every((t) => Math.abs(wind(0, t, 0.3)[0]) < 1e-12 && Math.abs(wind(1, t, 0.3)[0]) < 1e-12 && Math.abs(wind(t, 0, 0.3)[1]) < 1e-12 && Math.abs(wind(t, 1, 0.3)[1]) < 1e-12));
  check('wind: land hotter: rises over land, sinks over sea, ground wind toward land', wind(0.1, 0.5, strength(34, 27))[1] > 0 && wind(0.9, 0.5, strength(34, 27))[1] < 0 && wind(0.5, 0.05, strength(34, 27))[0] < 0);
  check('wind: equal temperatures: no wind', strength(25, 25) === 0);
  let seed = 3; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const run = (l, s) => { const ps = parcels(200, rnd); for (let k = 0; k < 300; k++) stepParcels(ps, strength(l, s), 0.05, l, s, rnd); return ps; };
  const day = run(34, 27), night = run(21, 26);
  check('wind: day: parcels near the ground move toward the land; night: toward the sea', groundWind(day, strength(34, 27)) < 0 && groundWind(night, strength(21, 26)) > 0);
  check('wind: parcels stay in the box', [...day, ...night].every((q) => q.x > 0 && q.x < 1 && q.y > 0 && q.y < 1));
  const lowLand = day.filter((q) => q.y < 0.12 && q.x < 0.5);
  check('wind: by day, air touching the land is warm', lowLand.length > 0 && lowLand.reduce((a, q) => a + q.warm, 0) / lowLand.length > 0.6);
  check('wind: presets: day and summer land warmer, night and winter sea warmer', PRESETS.map((x) => Math.sign(x.land - x.sea)).join() === '1,-1,1,-1');
  let good = true; for (let i = 0; i < 300; i++) for (const l of ['8', '11']) for (const x of questions(l, rnd)) if (!(Number.isFinite(x.ans) && (x.choices ? x.ans >= 0 && x.ans < x.choices.length : x.ans > 0))) good = false;
  check('wind: questions valid', good);
};
