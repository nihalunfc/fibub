// #1331 vector adder: law of cosines and the R direction checked against an independent component sum on 1000
// random pairs; Lami's tensions checked against a direct horizontal/vertical force balance.
import { fromPolar, add, lami, between, questions } from '../../src/lib/sci/vector-adder.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const r = add(fromPolar(6, 0), fromPolar(4, 60));
  check('vector-adder: 6 at 0° + 4 at 60° = √76 = 8.718 at 23.41°', near(r.R, Math.sqrt(76)) && near(r.law, Math.sqrt(76)) && near(r.dir, Math.atan2(2 * Math.sqrt(3), 8) * 180 / Math.PI) && near(r.alpha, r.dir));
  check('vector-adder: 3 east + 4 north = 5', near(add({ x: 3, y: 0 }, { x: 0, y: 4 }).R, 5));
  check('vector-adder: opposite vectors give |A − B|', near(add(fromPolar(7, 30), fromPolar(3, 210)).R, 4) && near(between(fromPolar(7, 30), fromPolar(3, 210)), 180, 1e-6));
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 1000; i++) {
    const A = rnd() * 10, a = rnd() * 360, B = rnd() * 10, b = rnd() * 360, o = add(fromPolar(A, a), fromPolar(B, b));
    const x = A * Math.cos(a * Math.PI / 180) + B * Math.cos(b * Math.PI / 180), y = A * Math.sin(a * Math.PI / 180) + B * Math.sin(b * Math.PI / 180);
    if (!near(o.law, Math.hypot(x, y), 1e-7)) bad++;
    // R rotated from A by alpha (towards B) should match the component direction
    if (Math.hypot(x, y) > 1e-6 && A > 1e-6) { const cross = Math.cos(a * Math.PI / 180) * y - Math.sin(a * Math.PI / 180) * x, dot = Math.cos(a * Math.PI / 180) * x + Math.sin(a * Math.PI / 180) * y; if (!near(Math.abs(Math.atan2(cross, dot) * 180 / Math.PI), Math.abs(o.alpha), 1e-6)) bad++; }
  }
  check('vector-adder: law of cosines and angle from A agree with component sums on 1000 random pairs', bad === 0);
  const L = lami(100, 30, 60);
  check('vector-adder: Lami 100 N at 30° and 60°: T1 = 50 N, T2 = 86.60 N, strings 90° apart', near(L.T1, 50) && near(L.T2, 50 * Math.sqrt(3)) && near(L.aW, 90));
  bad = 0;
  for (let i = 0; i < 1000; i++) {
    const W = 1 + rnd() * 200, t1 = 1 + rnd() * 88, t2 = 1 + rnd() * 88, o = lami(W, t1, t2), R = Math.PI / 180;
    const fx = -o.T1 * Math.cos(t1 * R) + o.T2 * Math.cos(t2 * R), fy = o.T1 * Math.sin(t1 * R) + o.T2 * Math.sin(t2 * R) - W;
    if (!(Math.abs(fx) < 1e-9 * W && Math.abs(fy) < 1e-9 * W && o.T1 > 0 && o.T2 > 0)) bad++;
  }
  check('vector-adder: Lami tensions balance the weight across and up on 1000 random cases', bad === 0);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('vector-adder: questions have positive finite answers', ok);
};
