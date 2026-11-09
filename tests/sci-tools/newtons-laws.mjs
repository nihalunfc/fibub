// #1023 Newton's laws sandbox: the time-stepped trolley checked against the closed-form push-and-coast
// results (v = (F − μmg)t/m, coast distance v²/2μg), plus hand-worked third-law and impulse examples.
import { step, friction, pushAndCoast, pushApart, catchBall, questions } from '../../src/lib/sci/newton.ts';
export default async (check) => {
  const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const run = (F, m, T, mus, muk) => { let s = { x: 0, v: 0 }, t = 0, dt = 1 / 120, xLet = 0, vLet = 0, n = 0; for (; n < T * 120; n++) s = step(s, F, m, mus, muk, dt); vLet = s.v; xLet = s.x; for (let k = 0; k < 120 * 200 && (s.v !== 0); k++) { s = step(s, 0, m, mus, muk, dt); t += dt; } return { vLet, xLet, xEnd: s.x, t }; };
  { const r = run(10, 2, 2, 0, 0); check("newtons-laws: 10 N on 2 kg for 2 s, no friction: 10 m/s, 10 m", near(r.vLet, 10, 1e-9) && near(r.xLet, 10, 1e-9)); }
  { const s = step(step({ x: 0, v: 10 }, 0, 2, 0, 0, 1), 0, 2, 0, 0, 1); check("newtons-laws: no friction, no force: keeps going (first law)", s.v === 10 && s.x === 20); }
  { const c = pushAndCoast(20, 4, 2, 0.2, 0.2), r = run(20, 4, 2, 0.2, 0.2);
    check(`newtons-laws: 20 N, 4 kg, μ 0.2: a = 3.04 m/s², v 6.08 m/s after 2 s`, near(c.a, 3.04) && near(c.vEnd, 6.08) && near(r.vLet, 6.08, 1e-9));
    check(`newtons-laws: coasts v²/2μg = 9.4318 m (stepped ${r.xEnd - r.xLet})`, near(c.coastDist, 6.08 ** 2 / (2 * 0.2 * 9.8)) && near(r.xEnd - r.xLet, c.coastDist, 1e-9) && near(r.t, c.coastTime, 0.01)); }
  { const r = run(7, 4, 2, 0.2, 0.15); check('newtons-laws: 7 N is below μs·mg = 7.84 N: static friction, no motion', r.vLet === 0 && r.xLet === 0 && !pushAndCoast(7, 4, 2, 0.2, 0.15).moves && friction(7, 4, 0, 0.2, 0.15) === -7); }
  { const c = pushAndCoast(10, 4, 2, 0.2, 0.15), r = run(10, 4, 2, 0.2, 0.15); check('newtons-laws: above static limit, kinetic μ 0.15 takes over: a = 1.03 m/s²', near(c.a, (10 - 0.15 * 4 * 9.8) / 4) && near(r.vLet, c.vEnd, 1e-9) && near(r.xEnd - r.xLet, c.coastDist, 1e-9)); }
  { const p = pushApart(50, 25, 100, 0.5); check('newtons-laws: 50 kg and 25 kg push apart with 100 N for 0.5 s: −1 and +2 m/s, total momentum 0', near(p.v1, -1) && near(p.v2, 2) && near(p.total, 0) && near(p.p2, 50) && near(p.impulse, 50)); }
  { const c = catchBall(0.16, 25, 0.1), c2 = catchBall(0.16, 25, 0.4); check('newtons-laws: 0.16 kg at 25 m/s stopped in 0.1 s: 4 kg m/s, 40 N; in 0.4 s: 10 N', near(c.impulse, 4) && near(c.force, 40) && near(c2.force, 10)); }
  let seed = 5; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let ok = true; for (let i = 0; i < 300; i++) for (const lv of [8, 9, 11]) { const qs = questions(lv, r); if (qs.length !== (lv === 11 ? 5 : 4) || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('newtons-laws: questions have positive finite answers', ok);
};
