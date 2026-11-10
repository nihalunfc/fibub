// #1259 Solution, colloid or suspension: classification at the school size boundaries and hand-worked percentages.
import { classify, properties, beamGlow, SAMPLES, massPercent, massVolPercent, questions } from '../../src/lib/sci/tyndall-effect.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  check('tyndall-effect: 0.5 nm solution, 1 nm and 1000 nm colloid, 1001 nm suspension', classify(0.5) === 'solution' && classify(1) === 'colloid' && classify(1000) === 'colloid' && classify(1001) === 'suspension');
  { const s = properties(0.3), c = properties(400), u = properties(20000);
    check('tyndall-effect: solution homogeneous, no beam, passes filter, never settles', s.homogeneous && !s.beam && !s.filters && !s.settles);
    check('tyndall-effect: colloid shows beam, passes filter, does not settle', !c.homogeneous && c.beam && !c.filters && !c.settles);
    check('tyndall-effect: suspension settles and filters, particles visible', u.settles && u.filters && u.seen); }
  check('tyndall-effect: glow 0 for solution, more for bigger colloids', beamGlow(0.5) === 0 && beamGlow(10) > 0 && beamGlow(500) > beamGlow(10));
  const kind = Object.fromEntries(SAMPLES.map((s) => [s.id, classify(s.nm)]));
  check('tyndall-effect: sample kinds (salt, sugar, CuSO4 solutions; milk, starch, fog, soap colloids; chalk, mud suspensions)', kind.salt === 'solution' && kind.sugar === 'solution' && kind.cuso4 === 'solution' && ['milk', 'starch', 'fog', 'soap'].every((k) => kind[k] === 'colloid') && kind.chalk === 'suspension' && kind.mud === 'suspension');
  check('tyndall-effect: 20 g salt in 180 g water = 10 %', near(massPercent(20, 180), 10));
  check('tyndall-effect: 5 g in 250 mL = 2 % m/v', near(massVolPercent(5, 250), 2));
  let seed = 9; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(r); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('tyndall-effect: questions have positive finite answers', ok);
};
