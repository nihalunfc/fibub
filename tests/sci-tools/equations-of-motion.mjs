// #1022 equations of motion: every choice of three known values (all 10) must give back the motion they came
// from (forward formulas v = u + at, s = ut + ½at² on 400 random motions), plus hand-worked examples.
import { solve, pathLength, stopping, questions } from '../../src/lib/sci/suvat.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  let seed = 3; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const keys = ['u', 'v', 'a', 's', 't'], trip = [];
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) for (let k = j + 1; k < 5; k++) trip.push([keys[i], keys[j], keys[k]]);
  check('equations-of-motion: ten ways to pick three knowns', trip.length === 10);
  let bad = 0, tot = 0;
  for (let n = 0; n < 400; n++) {
    const u = Math.round((r() * 40 - 15) * 4) / 4, a = Math.round((r() * 8 - 4) * 4) / 4 || 0.5, t = Math.round((0.5 + r() * 11.5) * 2) / 2;
    const full = { u, a, t, v: u + a * t, s: u * t + 0.5 * a * t * t };
    if (Math.abs(full.u + full.v) < 1e-9 || Math.abs(full.s) < 1e-9) continue;
    for (const tr of trip) {
      const k = Object.fromEntries(tr.map((x) => [x, full[x]])), res = solve(k); tot++;
      if (!res.ok || !res.sols.some((c) => keys.every((x) => near(c[x], full[x], 1e-7)))) bad++;
      if (res.ok) for (const c of res.sols) if (!(near(c.v, c.u + c.a * c.t, 1e-7) && near(c.s, c.u * c.t + 0.5 * c.a * c.t * c.t, 1e-7) && c.t >= 0)) bad++;
    }
  }
  check(`equations-of-motion: every triple gives back its motion (${tot} solves)`, bad === 0 && tot > 3000);
  { const x = solve({ u: 0, v: 20, s: 100 }); check('equations-of-motion: 0 → 20 m/s in 100 m: a = 2 m/s², t = 10 s', x.ok && near(x.sols[0].a, 2) && near(x.sols[0].t, 10)); }
  { const x = solve({ u: 20, a: -10, s: 15 }); check('equations-of-motion: thrown up at 20 m/s, 15 m high twice: t = 1 s and 3 s', x.ok && x.sols.length === 2 && near(x.sols[0].t, 1) && near(x.sols[1].t, 3) && near(x.sols[1].v, -10)); }
  { const x = solve({ u: 20, a: -10, s: 25 }); check('equations-of-motion: highest point 20 m (u²/2g) is reached once; 25 m never', x.ok === false && solve({ u: 20, a: -10, s: 20 }).ok && solve({ u: 20, a: -10, s: 20 }).sols.length === 1); }
  check('equations-of-motion: bad input messages', !solve({ u: 1, v: 2 }).ok && !solve({ u: 1, v: 2, a: 1, t: 1 }).ok && !solve({ u: 5, v: 5, a: 0 }).ok && !solve({ u: 0, v: 10, a: -2 }).ok && !solve({ u: 1, a: 1, t: -2 }).ok);
  check('equations-of-motion: path length with a turn: u 6, a −1, 12 s → 36 m', near(pathLength(6, -1, 12), 36) && near(pathLength(6, -1, 4), 16));
  const st = stopping(72, 1, 5);
  check('equations-of-motion: 72 km/h, 1 s reaction, 5 m/s²: 20 + 40 = 60 m', near(st.think, 20) && near(st.brake, 40) && near(st.total, 60) && near(st.tTotal, 5));
  check('equations-of-motion: double speed, four times the braking distance', near(stopping(108, 1, 7).brake / stopping(54, 1, 7).brake, 4));
  let okQ = true; for (let i = 0; i < 300; i++) for (const lv of [9, 11]) { const qs = questions(lv, r); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) okQ = false; }
  check('equations-of-motion: questions have positive finite answers', okQ);
};
