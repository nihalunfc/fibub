// #1337 river crossing: checked against hand-worked cases (4 m/s boat, 3 m/s river, 100 m: 25 s and 75 m drift;
// no drift at asin(3/4) taking 100/√7 s) and against a brute-force scan of headings for the least drift.
import { cross, best, questions } from '../../src/lib/sci/river-crossing.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const r = cross(100, 3, 4, 0);
  check('river-crossing: straight across: 25 s, 75 m downstream, ground speed 5 m/s', near(r.t, 25) && near(r.drift, 75) && near(r.speed, 5));
  const b = best(100, 3, 4);
  check('river-crossing: land opposite at asin(0.75) = 48.59° in 100/√7 = 37.80 s', near(b.theta, Math.asin(0.75) * 180 / Math.PI) && near(b.t, 100 / Math.sqrt(7)) && near(cross(100, 3, 4, b.theta).drift, 0, 1e-9));
  check('river-crossing: river speed does not change the time straight across', near(cross(100, 0, 4, 0).t, cross(100, 5, 4, 0).t));
  let bad = 0;
  for (const [vr, vb] of [[3, 1], [5, 2], [2, 1.9], [4, 0.5]]) {
    const o = best(80, vr, vb); let min = Infinity, at = 0;
    for (let th = -89; th <= 89; th += 0.001) { const c = cross(80, vr, vb, th); if (c.drift < min) { min = c.drift; at = th; } }
    if (!(o.can === false && Math.abs(o.least - min) < 1e-3 && Math.abs(o.leastTheta - at) < 0.01)) bad++;
  }
  check('river-crossing: when the river is faster, the least drift and its heading match a 0.001° scan', bad === 0);
  let seed = 19; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let ok = true;
  for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('river-crossing: questions have positive finite answers', ok);
};
