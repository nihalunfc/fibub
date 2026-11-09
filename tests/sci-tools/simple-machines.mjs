// #1026 simple machines: checked against the principle of moments and the work principle
// (load × load distance = efficiency × effort × effort distance) on random machines, and hand-worked examples.
import { lever, leverClass, pulleys, incline, wheelAxle, questions } from '../../src/lib/sci/machines.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  { const m = lever(600, 0.25, 1.5); check('simple-machines: crowbar 600 N at 0.25 m, push at 1.5 m: effort 100 N, MA = VR = 6', near(m.effort, 100) && near(m.ma, 6) && near(m.vr, 6) && near(m.eff, 1)); }
  { const m = lever(200, 0.8, 0.2); check('simple-machines: third-class lever (tweezers-like): MA 0.25, effort 800 N', near(m.ma, 0.25) && near(m.effort, 800)); }
  check('simple-machines: lever classes from positions', leverClass(1, 0, 2) === 1 && leverClass(0, 1, 2) === 2 && leverClass(0, 2, 1) === 3 && leverClass(2, 1, 0) === 2);
  { const p = pulleys(400, 4); check('simple-machines: 4 strands, 400 N: effort 100 N, VR 4', near(p.effort, 100) && p.vr === 4 && near(p.eff, 1)); }
  { const p = pulleys(400, 1, 50, 0); check('simple-machines: single fixed pulley: MA 1, block weight not lifted', near(p.effort, 400) && near(p.ma, 1)); }
  { const p = pulleys(400, 2, 40, 0.1); check('simple-machines: 2 strands, 40 N block, 10 % friction: effort 244.4 N, efficiency 81.8 %', near(p.effort, 440 / 2 / 0.9) && near(p.eff, (400 / (440 / 1.8)) / 2)); }
  { const r = incline(1000, 5, 1); check('simple-machines: smooth 5 m ramp, 1 m high: effort 200 N, VR 5, 100 %', near(r.effort, 200) && r.vr === 5 && near(r.eff, 1)); }
  { const r = incline(1000, 5, 1, 0.2); check('simple-machines: with μ 0.2 effort 200 + 0.2 × 1000 × cosθ = 395.96 N', near(r.effort, 200 + 200 * Math.sqrt(24) / 5) && near(r.eff, 1000 / r.effort / 5)); }
  { const w = wheelAxle(300, 0.3, 0.05, 0.8); check('simple-machines: wheel 30 cm, axle 5 cm, 80 %: VR 6, effort 62.5 N', near(w.vr, 6) && near(w.effort, 62.5) && near(w.eff, 0.8)); }
  let seed = 2; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 500; i++) {
    const W = 10 + r() * 1000, e = 0.3 + r() * 0.7;
    const a = 0.05 + r(), b = 0.05 + r(), l = lever(W, a, b, e);
    // moments (ideal) and work principle (lift the load 1 cm: effort end moves b/a cm)
    if (!near(l.idealEffort * b, W * a, 1e-9) || !near(W * 0.01, e * l.effort * 0.01 * (b / a), 1e-9)) bad++;
    const n = 1 + Math.floor(r() * 4), p = pulleys(W, n, 0, 1 - e);
    if (!near(W * 1, e * p.effort * n, 1e-9)) bad++;
    const L = 1 + r() * 9, h = L * (0.05 + 0.9 * r()), mu = r() * 0.5, c = incline(W, L, h, mu);
    // work principle with friction: effort × L = W h + μ W cosθ L
    if (!near(c.effort * L, W * h + mu * W * Math.sqrt(1 - (h / L) ** 2) * L, 1e-9)) bad++;
  }
  check('simple-machines: 500 random machines obey moments and the work principle', bad === 0);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(r); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0) || qs[3].ans >= 100) ok = false; }
  check('simple-machines: questions have positive finite answers, efficiency under 100 %', ok);
};
