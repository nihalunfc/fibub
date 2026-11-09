// #1153 Trig ratio explorer. Ratios checked against Python math.sin/cos/tan (they are the same libm calls, so the
// real check is the exact-value table: each surd string evaluated and compared with the ratio), quadrant signs
// against the ASTC rule, and identities at 1° steps.
import { ratios, EXACT, exactValue, quadrant, POSITIVE, fromLegs, identities } from '../../src/lib/sci/trig-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => (Number.isNaN(b) ? Number.isNaN(a) : Math.abs(a - b) <= t * Math.max(1, Math.abs(b)));
  let ok = true;
  for (const d of [0, 30, 45, 60, 90]) { const r = ratios(d); for (const k of Object.keys(EXACT[d])) if (!near(r[k], exactValue(EXACT[d][k]), 1e-12)) ok = false; }
  check('exact values: all 30 table entries match the computed ratios', ok);
  check('ratios: sin 30 = 0.5, cos 60 = 0.5, tan 45 = 1', near(ratios(30).sin, 0.5, 1e-15) && near(ratios(60).cos, 0.5, 1e-15) && near(ratios(45).tan, 1, 1e-15));
  check('ratios: tan 90 and cot 0 undefined, cos 90 = 0', Number.isNaN(ratios(90).tan) && Number.isNaN(ratios(0).cot) && ratios(90).cos === 0);
  // Python: math.sin(math.radians(37)) = 0.6018150231520483, math.tan(math.radians(72)) = 3.0776835371752527
  check('ratios: sin 37°, tan 72° match Python', near(ratios(37).sin, 0.6018150231520483) && near(ratios(72).tan, 3.0776835371752527));
  check('complementary: sin(90° − θ) = cos θ for θ = 1..89', Array.from({ length: 89 }, (_, i) => i + 1).every((d) => near(ratios(90 - d).sin, ratios(d).cos, 1e-12) && near(ratios(90 - d).tan, ratios(d).cot, 1e-9)));
  let id = true;
  for (let d = 1; d < 360; d++) { const I = identities(d); if (d % 90 && (!near(I.sinCos, 1, 1e-12) || !near(I.secTan, 1, 1e-9) || !near(I.cosecCot, 1, 1e-9))) id = false; }
  check('identities: sin² + cos² = 1, sec² − tan² = 1, cosec² − cot² = 1 at every whole degree off the axes', id);
  check('quadrants and signs (ASTC)', quadrant(45) === 1 && quadrant(120) === 2 && quadrant(200) === 3 && quadrant(300) === 4 && quadrant(-30) === 4 && quadrant(90) === 0 && quadrant(390) === 1
    && ratios(120).sin > 0 && ratios(120).cos < 0 && ratios(200).tan > 0 && ratios(300).cos > 0 && ratios(300).sin < 0 && POSITIVE[3] === 'tan and cot');
  const L = fromLegs(3, 4);
  check('legs 3 and 4: hyp 5, sin 0.6, cos 0.8, angle 36.87°', L.hyp === 5 && near(L.sin, 0.6) && near(L.cos, 0.8) && Math.abs(L.angle - 36.8698976) < 1e-6);
};
