// #1024 friction ramp: checked against an independent 2-D vector sum of the forces (x-y components, not
// along/across the slope) on 500 random cases, and against hand-worked examples.
import { ramp, slideTime, questions } from '../../src/lib/sci/incline.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const r = ramp({ m: 10, angle: 30, mus: 0.5, muk: 0.3, push: 0 });
  check('friction-ramp: 10 kg on 30°: mg sinθ 49 N, N 84.87 N, holds 42.44 N', near(r.along, 49) && near(r.normal, 84.870489570875, 1e-12) && near(r.maxStatic, 42.4352447854375, 1e-12));
  check('friction-ramp: 49 > 42.44 so it slides down at g(sinθ − μk cosθ) = 2.3539 m/s²', r.state === 'down' && near(r.a, -9.8 * (0.5 - 0.3 * Math.cos(Math.PI / 6)), 1e-12));
  check('friction-ramp: angle of repose atan 0.5 = 26.565°', near(r.repose, 26.56505117707799, 1e-12));
  check('friction-ramp: push to hold it 6.565 N, to start it up 91.435 N', near(r.pushToHold, 49 - 42.4352447854375, 1e-12) && near(r.pushToStartUp, 91.4352447854375, 1e-12));
  const s = ramp({ m: 10, angle: 20, mus: 0.5, muk: 0.3, push: 0 });
  check('friction-ramp: below the angle of repose it stays, friction = mg sinθ', s.state === 'still' && near(s.friction, 98 * Math.sin(Math.PI / 9)) && s.a === 0);
  check('friction-ramp: push 90 N on 30° just under 91.44 N: still; 100 N: moves up', ramp({ m: 10, angle: 30, mus: 0.5, muk: 0.3, push: 90 }).state === 'still' && ramp({ m: 10, angle: 30, mus: 0.5, muk: 0.3, push: 100 }).state === 'up');
  check('friction-ramp: flat floor, 30 N push on 5 kg beats the 24.5 N limit: a = (30 − 19.6) ÷ 5', ramp({ m: 5, angle: 0, mus: 0.5, muk: 0.4, push: 30 }).state === 'up' && near(ramp({ m: 5, angle: 0, mus: 0.5, muk: 0.4, push: 30 }).a, (30 - 19.6) / 5));
  // independent check: x-y vector sum
  let seed = 9; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 500; i++) {
    const m = 0.5 + rnd() * 20, angle = rnd() * 80, mus = rnd(), muk = mus * rnd(), push = (rnd() - 0.4) * 300, o = ramp({ m, angle, mus, muk, push });
    const th = angle * Math.PI / 180, ux = Math.cos(th), uy = Math.sin(th); // unit vector up the slope
    const nx = -Math.sin(th), ny = Math.cos(th); // unit normal
    const W = [0, -m * 9.8], Nmag = -(W[0] * nx + W[1] * ny), Fx = W[0] + Nmag * nx + push * ux + o.friction * ux, Fy = W[1] + Nmag * ny + push * uy + o.friction * uy;
    const alongNet = Fx * ux + Fy * uy, perp = Fx * nx + Fy * ny;
    if (!(Math.abs(perp) < 1e-9 && near(alongNet / m, o.a, 1e-9) || o.state === 'still' && Math.abs(alongNet) < 1e-9)) bad++;
    if (o.state === 'still' && Math.abs(o.friction) > o.maxStatic + 1e-9) bad++;
    if (o.state !== 'still' && !near(Math.abs(o.friction), muk * Nmag, 1e-9)) bad++;
  }
  check('friction-ramp: 500 random cases agree with an x-y vector sum (no force across the slope, friction within limits)', bad === 0);
  check('friction-ramp: slide 2 m at 2 m/s² takes √2 s', near(slideTime(2, 2), Math.SQRT2));
  let ok = true; for (let i = 0; i < 300; i++) for (const lv of [8, 11]) { const qs = questions(lv, rnd); if (qs.length < 3 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('friction-ramp: questions have positive finite answers', ok);
};
