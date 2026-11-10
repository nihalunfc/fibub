// #1334 work as area: the exact polyline area checked against ½kx² for a spring, F·s for a steady force, a
// triangle, and an independent fine Riemann sum (midpoint rule, 200 000 strips) on 300 random shapes.
import { forceAt, work, preset, speedFrom, questions } from '../../src/lib/sci/force-work.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  check('variable-force-work: spring k = 4 N/m from 0 to 6 m: ½ × 4 × 36 = 72 J', near(work(preset('spring', 40), 0, 6).W, 72));
  check('variable-force-work: spring from 2 to 5 m: ½k(25 − 4) = 42 J', near(work(preset('spring', 40), 2, 5).W, 42));
  check('variable-force-work: steady 30 N over 4.5 m = 135 J', near(work(preset('const', 30), 1, 5.5).W, 135));
  check('variable-force-work: fading 40 N over 10 m = 200 J triangle', near(work(preset('ramp', 40), 0, 10).W, 200));
  const st = work(preset('step', 40), 0, 10);
  check('variable-force-work: push-ease-pull: positive and negative parts add to the total', near(st.pos + st.neg, st.W) && st.neg < 0 && st.pos > 0);
  check('variable-force-work: reversing the limits flips the sign', near(work(preset('step', 40), 10, 0).W, -st.W));
  check('variable-force-work: 72 J on 2 kg from rest gives √72 m/s', near(speedFrom(72, 2), Math.sqrt(72)) && Number.isNaN(speedFrom(-1, 2)));
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 300; i++) {
    const pts = Array.from({ length: 11 }, (_, x) => [x, Math.round((rnd() - 0.5) * 100)]), a = Math.round(rnd() * 20) / 2, b = Math.round(rnd() * 20) / 2;
    const lo = Math.min(a, b), hi = Math.max(a, b), N = 200000; let s = 0, ps = 0;
    for (let k = 0; k < N; k++) { const x = lo + (hi - lo) * (k + 0.5) / N, F = forceAt(pts, x); s += F; if (F > 0) ps += F; }
    s *= (hi - lo) / N; ps *= (hi - lo) / N;
    const o = work(pts, lo, hi); if (!(Math.abs(o.W - s) < 1e-3 && Math.abs(o.pos - ps) < 1e-3)) bad++;
  }
  check('variable-force-work: exact areas agree with a 200 000-strip midpoint sum on 300 random shapes', bad === 0);
  let ok = true; for (let i = 0; i < 300; i++) for (const lv of ['9', '11']) { const qs = questions(lv, rnd); if (qs.length !== (lv === '9' ? 3 : 4) || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('variable-force-work: questions have positive finite answers', ok);
};
