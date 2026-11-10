// #1221 liquid pressure: ρgh and Torricelli checked by hand examples, an energy balance and a step-by-step
// projectile integration (independent of the closed form 2√(hy)).
import { gauge, speed, reach, jets, furthest, drain, bestHoleHeight, questions, HOLES } from '../../src/lib/sci/j3-liquid.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  check('liquid-pressure: 10 m of water = 98 kPa; 25 cm = 2,450 Pa; mercury 76 cm ≈ 101.3 kPa', near(gauge(1000, 10), 98000) && near(gauge(1000, 0.25), 2450) && Math.abs(gauge(13600, 0.76) - 101293) < 1);
  check('liquid-pressure: Torricelli v = √(2gh): energy ρgh = ½ρv² for any ρ', [0.05, 0.2, 1, 3].every((h) => near(0.5 * speed(h) ** 2, 9.8 * h, 1e-12)));
  // independent: integrate the fall in tiny steps
  const sim = (v, y) => { let x = 0, yy = y, vy = 0; const dt = 1e-5; while (yy > 0) { x += v * dt; vy += 9.8 * dt; yy -= vy * dt; } return x; };
  check('liquid-pressure: landing distance matches a step-by-step fall (3 cases)', [[0.25, 0.05], [0.15, 0.75], [0.4, 1]].every(([d, y]) => Math.abs(sim(speed(d), y) - reach(d, y)) < 2e-4));
  check('liquid-pressure: closed form 2√(hy)', near(reach(0.25, 0.05), 2 * Math.sqrt(0.25 * 0.05), 1e-12));
  const j0 = jets(1000, 0.3, 0);
  check('liquid-pressure: full bottle on the floor: 22.4, 30, 22.4 cm; middle furthest', near(j0[0].x, 0.2236068, 1e-6) && near(j0[1].x, 0.3, 1e-12) && near(j0[2].x, j0[0].x, 1e-12) && furthest(j0) === 1);
  const j6 = jets(1000, 0.3, 0.6);
  check('liquid-pressure: on a 60 cm stand: 80.6, 67.1, 41.2 cm; bottom furthest', Math.abs(j6[0].x - 0.806) < 5e-4 && Math.abs(j6[1].x - 0.6708) < 5e-4 && Math.abs(j6[2].x - 0.4123) < 5e-4 && furthest(j6) === 0);
  check('liquid-pressure: best hole at half the surface height', bestHoleHeight(0.3) === 0.15);
  check('liquid-pressure: water at 10 cm: only the bottom hole flows', jets(1000, 0.1, 0).map((j) => j.flowing).join() === 'true,false,false' && furthest(jets(1000, 0.04, 0)) === -1);
  let L = 0.3, ok = true; for (let i = 0; i < 4000; i++) { const n = drain(L, 0.05); if (n > L + 1e-15 || n < HOLES[0] - 1e-9) ok = false; L = n; }
  check('liquid-pressure: draining only goes down and stops at the bottom hole', ok && Math.abs(L - HOLES[0]) < 2e-3);
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let good = true;
  for (let i = 0; i < 300; i++) for (const l of ['8', '11']) for (const x of questions(l, rnd)) if (!(Number.isFinite(x.ans) && (x.choices ? x.ans >= 0 && x.ans < x.choices.length : x.ans > 0))) good = false;
  check('liquid-pressure: questions valid', good);
};
