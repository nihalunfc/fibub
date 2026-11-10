// #1257 Collision carts: checked against fibub's independent collide1D (phcollision.ts) and hand-worked examples.
import { collide, meetTime, recoil, questions } from '../../src/lib/sci/collision-carts.ts';
import { collide1D } from '../../src/lib/sci/phcollision.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  { const r = collide(1, 2, 1, 0, 1); check('collision-carts: equal masses, elastic: velocities swap', near(r.v1, 0) && near(r.v2, 2) && near(r.keAfter, 2)); }
  { const r = collide(1, 2, 1, 0, 0); check('collision-carts: equal masses, sticky: 1 m/s, half the KE lost', near(r.v1, 1) && near(r.v2, 1) && near(r.keAfter, 1)); }
  { const r = collide(2, 3, 1, 0, 0); check('collision-carts: 2 kg at 3 m/s sticks to 1 kg: 2 m/s', near(r.v1, 2) && near(r.pAfter, 6)); }
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let ok = true, okP = true;
  for (let i = 0; i < 500; i++) {
    const m1 = 0.5 + rnd() * 5, m2 = 0.5 + rnd() * 5, u1 = -3 + rnd() * 9, u2 = -6 + rnd() * 9, e = rnd();
    const a = collide(m1, u1, m2, u2, e), b = collide1D(m1, u1, m2, u2, e);
    const bv1 = b.v1 ?? b[0], bv2 = b.v2 ?? b[1];
    if (!near(a.v1, bv1, 1e-9) || !near(a.v2, bv2, 1e-9)) ok = false;
    if (!near(a.pBefore, a.pAfter, 1e-9) || a.keAfter > a.keBefore + 1e-9) okP = false;
    if (Math.abs(u1 - u2) > 0.1 && !near((a.v2 - a.v1) / (u1 - u2), e, 1e-9)) okP = false;
  }
  check('collision-carts: matches collide1D for 500 random cases', ok);
  check('collision-carts: momentum kept, KE never gained, separation over approach speed = e', okP);
  check('collision-carts: meet time 1.6 m gap at 2 m/s closing = 0.8 s; never if B is faster', near(meetTime(1, 2, 3, 0, 0.4), 0.8) && meetTime(1, 1, 3, 2, 0.4) === Infinity);
  { const r = recoil(5, 0.5, 20); check('collision-carts: 5 kg cannon, 0.5 kg ball at 20 m/s: −2 m/s, total 0', near(r.V, -2) && near(r.total, 0) && near(r.keShot, 100) && near(r.keBody, 10)); }
  { const r = recoil(4, 0.01, 400); check('collision-carts: 4 kg gun, 10 g bullet at 400 m/s: −1 m/s', near(r.V, -1)); }
  let okq = true; for (let i = 0; i < 300; i++) for (const lv of [9, 11]) { const qs = questions(lv, rnd); if (qs.length !== (lv === 11 ? 5 : 4) || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) okq = false; }
  check('collision-carts: questions have positive finite answers', okq);
};
