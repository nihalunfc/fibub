// #1308 Hormones and blood sugar feedback. Behaviour checks of the teaching model: steady at the set point with no
// events; a meal's absorption integrates to its set size (checked numerically); healthy peak near 129 mg/dL and back
// to 90; weak insulin peaks higher; no insulin stays high; a run dips and glucagon restores the level.
import { simulate, summary, mealRate, P, SET, GLANDS } from '../../src/lib/sci/glucose-loop.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const flat = summary(simulate([], 'healthy'));
  check('hormones: no events stays at 90', flat.peak === SET && flat.low === SET);
  let a = 0; for (let t = 0; t < 2000; t += 0.01) a += mealRate(t, 0) * 0.01;
  check('hormones: a meal adds its set size of glucose', near(a, P.meal, 1e-3) && mealRate(-5, 0) === 0);
  const ev = [{ kind: 'meal', at: 60 }, { kind: 'meal', at: 390 }, { kind: 'run', at: 600 }];
  const h = simulate(ev, 'healthy'), sh = summary(h), w = summary(simulate(ev, 'weak')), n = summary(simulate(ev, 'none'));
  check('hormones: healthy peak about 129 at 07:44, never above 140', near(sh.peak, 128.9, 0.1) && sh.peakAt === 104 && sh.minutesAbove140 === 0);
  check('hormones: healthy back to the set point by evening', near(sh.end, SET, 1) && near(h.g[360], SET, 1));
  check('hormones: run dips to about 80 and glucagon rises', near(sh.low, 79.6, 0.2) && h.glu[630] > 5 && h.ins[630] < 1);
  check('hormones: weak insulin peaks higher (about 156)', near(w.peak, 156.4, 0.2) && w.minutesAbove140 > 60);
  check('hormones: no insulin stays high (about 218, 9 h above 140)', near(n.peak, 218, 0.2) && n.minutesAbove140 > 480 && simulate(ev, 'none').ins.every((x) => x === 0));
  const half = simulate(ev, 'healthy', 720), full = simulate(ev, 'healthy', 1440);
  check('hormones: longer runs match the first 12 hours', half.g.every((g, i) => near(g, full.g[i], 1e-12)));
  check('hormones: eight glands with text', GLANDS.length === 8 && GLANDS.every((g) => g.t10 && g.t11 && g.hormone));
};
