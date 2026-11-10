// #1332 projectile launcher: vacuum formulas checked against R = v² sin 2θ / g, H = v² sin²θ / 2g, T = 2v sin θ / g
// and the height formula; the drag stepper checked against the exact vertical-throw results with quadratic drag
// (top height ln(1 + k v²/g) / 2k, time to top atan(v √(k/g)) / √(gk)) and against its own vacuum limit.
import { vacuum, withDrag, dragK, bestAngle, questions } from '../../src/lib/sci/projectile-launcher.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const g = 9.8, r = vacuum(20, 30);
  check('projectile-launcher: 20 m/s at 30°: R 35.35 m, H 5.10 m, T 2.04 s', near(r.range, 400 * Math.sin(Math.PI / 3) / g) && near(r.hmax, 100 / (2 * g)) && near(r.tFlight, 20 / g));
  check('projectile-launcher: complementary angles 30° and 60° give the same range', near(vacuum(20, 60).range, r.range));
  const hh = vacuum(10, 0, 20);
  check('projectile-launcher: thrown flat at 10 m/s from 20 m lands 10√(40/9.8) = 20.20 m away', near(hh.range, 10 * Math.sqrt(40 / g)) && near(hh.vLand, Math.sqrt(100 + 2 * g * 20)));
  const h2 = vacuum(15, 40, 5), vy = 15 * Math.sin(40 * Math.PI / 180), tF = (vy + Math.sqrt(vy * vy + 2 * g * 5)) / g;
  check('projectile-launcher: from 5 m high: lands where h + vy t − ½gt² = 0', near(h2.tFlight, tF) && near(5 + vy * tF - 0.5 * g * tF * tF, 0, 1e-9));
  const k = 0.02, v = 30, up = withDrag(v, 90, 0, k);
  check(`projectile-launcher: vertical throw with drag reaches ln(1 + kv²/g)/2k = ${(Math.log(1 + k * v * v / g) / (2 * k)).toFixed(4)} m (${up.hmax.toFixed(4)})`, near(up.hmax, Math.log(1 + k * v * v / g) / (2 * k), 1e-5));
  check('projectile-launcher: time to top atan(v√(k/g))/√(gk)', near(up.tTop, Math.atan(v * Math.sqrt(k / g)) / Math.sqrt(g * k), 1e-4));
  const tiny = withDrag(20, 30, 0, 1e-9);
  check('projectile-launcher: drag stepper with almost no drag matches the vacuum range', near(tiny.range, r.range, 1e-4));
  const d = withDrag(20, 30, 0, dragK(0.16, 0.072));
  check('projectile-launcher: a cricket ball with drag falls short of the vacuum range', d.range < r.range && d.range > 0.8 * r.range);
  const ba = bestAngle(30, 0, 0.02);
  check(`projectile-launcher: with strong drag the best angle is below 45° (${ba.angle}°)`, ba.angle < 45 && ba.angle > 30);
  check('projectile-launcher: with no drag from the ground the best angle is 45°', Math.abs(bestAngle(20, 0, 0).angle - 45) <= 0.25);
  let seed = 3; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('projectile-launcher: questions have positive finite answers', ok);
};
