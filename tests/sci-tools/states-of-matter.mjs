// #1064 states-of-matter: Kelvin conversion, state at a temperature, and the particle cartoon stays sensible.
import { toKelvin, toCelsius, phaseOf, meanKE, rng, makeParticles, step, mixing, SUBSTANCES } from '../../src/lib/sci/learnstates.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('states: 25 °C = 298.15 K, 0 K = −273.15 °C', near(toKelvin(25), 298.15) && near(toCelsius(0), -273.15));
  const w = SUBSTANCES[0];
  check('states: water phases at −5, 0, 50, 100, 120 °C', ['solid', 'melting', 'liquid', 'boiling', 'gas'].every((p, i) => phaseOf([-5, 0, 50, 100, 120][i], w.mp, w.bp) === p));
  check('states: mean KE at 300 K = 6.2129e-21 J', near(meanKE(300), 6.2129205e-21, 1e-6));
  const rand = rng(7), ps = makeParticles(36, rand);
  for (let i = 0; i < 300; i++) step(ps, 1 / 60, 'solid', 1, rand);
  check('states: solid particles stay near their sites', ps.every((p) => Math.hypot(p.x - p.sx, p.y - p.sy) < 0.05));
  for (let i = 0; i < 600; i++) step(ps, 1 / 60, 'liquid', 0.5, rand);
  check('states: liquid stays in the lower part of the box', ps.every((p) => p.y < 0.75) && ps.every((p) => p.x > 0 && p.x < 1));
  for (let i = 0; i < 600; i++) step(ps, 1 / 60, 'gas', 0.5, rand);
  const spd = ps.map((p) => Math.hypot(p.vx, p.vy)), mean = spd.reduce((a, b) => a + b) / spd.length;
  check('states: gas fills the box and moves fast', ps.some((p) => p.y > 0.6) && mean > 0.3 && ps.every((p) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1));
  // Diffusion: with the divider in, colours stay apart; lifted, they mix.
  const r2 = rng(3), g = makeParticles(40, r2);
  g.forEach((p) => { p.x = p.c === 0 ? 0.1 + 0.3 * r2() : 0.6 + 0.3 * r2(); p.y = r2(); });
  for (let i = 0; i < 300; i++) step(g, 1 / 60, 'gas', 0.5, r2, 0, 0, 0.5);
  check('states: divider keeps them apart', mixing(g) === 0);
  for (let i = 0; i < 1500; i++) step(g, 1 / 60, 'gas', 0.5, r2);
  check('states: without the divider they mix', mixing(g) > 0.5);
};
