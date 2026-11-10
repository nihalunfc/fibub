// #1410 Dia, para and ferro. Checked by hand (χ = −1.7e-4 at 1 T: H = 795774.7 A/m, M = −135.28 A/m,
// B = 0.99983 T), Curie's law (χ T constant), the Langevin function's limits (x/3 for small x, L(1) = 0.31304) and
// the Preisach model's symmetry: demagnetised start M = 0, saturation ±1, equal remanence and coercivity both ways.
import * as M from '../../src/lib/sci/magnetic-materials.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b);

export default async (check) => {
  const d = M.linear(-1.7e-4, 1);
  check('magnet: diamagnet by hand', near(d.H, 795774.7155645, 1e-9) && near(d.M, -135.2817016, 1e-7) && near(d.B, 0.99983, 1e-12) && near(d.mur, 0.99983, 1e-12));
  check('magnet: Curie law', near(M.curieChi(150) * 150, M.curieChi(600) * 600, 1e-12) && near(M.curieChi(300), 3e-4, 1e-12));
  check('magnet: Langevin', near(M.langevin(1), 0.3130352855, 1e-8) && near(M.langevin(1e-5), 1e-5 / 3, 1e-6) && near(M.langevin(50), 0.98, 1e-9) && near(M.langevin(-1), -0.3130352855, 1e-8));
  check('magnet: Curie temperature', M.msFraction(1043) === 0 && M.msFraction(1500) === 0 && near(M.msFraction(0), 1, 1e-12) && M.msFraction(300) > M.msFraction(900));
  const hs = M.makeHysterons(1e-3);
  check('magnet: demagnetised start', Math.abs(M.magnetisation(hs)) < 1e-12 && near(hs.reduce((t, h) => t + h.w, 0), 1, 1e-12));
  check('magnet: saturation', near(M.applyField(hs, 0.01), 1, 1e-12) && near(M.applyField(hs, -0.01), -1, 1e-12));
  const up = M.applyField(hs, 0.01) && M.applyField(hs, 0), down = (M.applyField(hs, -0.01), M.applyField(hs, 0));
  check('magnet: remanence the same both ways', near(up, -down, 1e-12) && up > 0.5);
  const ml = M.majorLoop(1e-3);
  check('magnet: coercivity near the hysteron mean', ml.coercive > 0.8e-3 && ml.coercive < 1.2e-3 && near(ml.remanence, up, 1e-12));
  const t = M.makeHysterons(1e-3); M.applyField(t, -0.01); M.applyField(t, 0.01); const neg = M.applyField(t, -ml.coercive);
  check('magnet: M crosses 0 at minus the coercivity (steps of one hysteron row)', Math.abs(neg) < 0.05 && M.applyField(t, -ml.coercive * 1.02) < 0);
  check('magnet: coercivity scales with hc', near(M.majorLoop(1e-2).coercive, 10 * ml.coercive, 1e-6));
  const m1 = M.makeHysterons(1e-3); M.applyField(m1, 0.01); M.applyField(m1, -0.5e-3); const mid = M.magnetisation(m1); M.applyField(m1, 0.3e-3); M.applyField(m1, -0.5e-3);
  check('magnet: minor loop returns to the same point (memory)', near(M.magnetisation(m1), mid, 1e-12));
  let ok = true;
  for (let s = 1; s <= 40; s++) for (const q of M.questions(seeded(s))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('magnet: 40 seeded question sets check out', ok);
};
