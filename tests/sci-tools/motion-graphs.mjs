// #1021 motion graphs: displacement and distance checked against a NumPy trapezium integration of v(t)
// on 2,000,001 points (and the hand values of the stories); drive step and match score by hand.
import { STORIES, at, displacement, distance, averageVelocity, driveStep, randomTarget, targetX, matchScore, questions, total } from '../../src/lib/sci/motion-graphs.ts';
export default async (check) => {
  const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e;
  const S = (k) => STORIES[k].story;
  check('motion-graphs: stories last 12 s', Object.values(STORIES).every((s) => total(s.story) === 12));
  check('motion-graphs: stop and go at 4 s: x 9 m, v 3 m/s, a 0', near(at(S('stopgo'), 4).x, 9) && near(at(S('stopgo'), 4).v, 3) && at(S('stopgo'), 4).a === 0);
  check('motion-graphs: stop and go distance 0-4 s = 9 m (NumPy 9.0)', near(distance(S('stopgo'), 0, 4), 9));
  check('motion-graphs: out and back at 10 s: displacement 10 m, distance 26 m (NumPy)', near(displacement(S('outback'), 0, 10), 10) && near(distance(S('outback'), 0, 10), 26));
  check('motion-graphs: out and back at 12 s: displacement 0, distance 36 m (NumPy)', near(displacement(S('outback'), 0, 12), 0) && near(distance(S('outback'), 0, 12), 36));
  check('motion-graphs: braking stops at 8 s after 24 m', near(at(S('braking'), 8).v, 0) && near(at(S('braking'), 12).x, 24) && at(S('braking'), 10).a === 0);
  const custom = { x0: 0, v0: 2, phases: [{ dur: 4, a: 0 }, { dur: 4, a: 0.5 }, { dur: 4, a: -1 }] };
  check('motion-graphs: three-part custom motion ends at 28 m, v 0 (NumPy 28.0)', near(at(custom, 12).x, 28) && near(at(custom, 12).v, 0) && near(distance(custom, 0, 12), 28));
  const mixed = { x0: 0, v0: -1.5, phases: [{ dur: 4, a: 1.25 }, { dur: 4, a: -2 }, { dur: 4, a: 1.75 }] };
  check('motion-graphs: two direction changes, 1.3-11.7 s: displacement −1.7775 m, distance 19.918929 m (NumPy)', near(displacement(mixed, 1.3, 11.7), -1.7775) && near(distance(mixed, 1.3, 11.7), 19.918929, 2e-6));
  check('motion-graphs: speeding up 7.3 s: ½at² = 13.3225 m, average velocity 1.825 m/s', near(at(S('speeding'), 7.3).x, 13.3225) && near(averageVelocity(S('speeding'), 0, 7.3), 1.825));
  check('motion-graphs: time past the end holds the last phase', near(at(S('steady'), 12).x, 18));
  // driving: 0 → 3 m/s at 2 m/s² takes 1.5 s and covers 2.25 m
  let st = { x: 0, v: 0, a: 0 }; for (let i = 0; i < 30; i++) st = driveStep(st, 3, 0.05);
  check('motion-graphs: drive reaches 3 m/s after 1.5 s, 2.25 m (v²/2a)', near(st.v, 3, 1e-9) && near(st.x, 2.25, 1e-9));
  st = driveStep(st, 3, 0.05); check('motion-graphs: drive holds speed with a = 0', st.a === 0 && near(st.x, 2.4, 1e-9));
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let okT = true; for (let k = 0; k < 200; k++) { const t = randomTarget(r); for (let i = 0; i <= 48; i++) { const x = targetX(t.x0, t.vs, i / 4); if (x < 0 || x > 20) okT = false; } if (t.vs[0] === t.vs[1] || t.vs[1] === t.vs[2]) okT = false; }
  check('motion-graphs: random targets stay on the 0-20 m road and change velocity', okT);
  check('motion-graphs: target x(t) piecewise: 5 + 2·4 − 1·2 = 11 m at 6 s', targetX(5, [2, -1, 0], 6) === 11 && targetX(5, [2, -1, 0], 12) === 9);
  const ts = [0, 4, 8, 12];
  check('motion-graphs: perfect drive scores 100, 2 m off scores 50', matchScore(5, [2, -1, 0], ts, ts.map((t) => targetX(5, [2, -1, 0], t))).score === 100 && matchScore(5, [2, -1, 0], ts, ts.map((t) => targetX(5, [2, -1, 0], t) + 2)).score === 50);
  let okQ = true;
  for (let k = 0; k < 300; k++) for (const lv of [9, 11]) { const qs = questions(lv, r); if (qs.length !== 4 || qs.some((q) => !Number.isFinite(q.ans) || !q.work)) okQ = false; }
  check('motion-graphs: questions always have 4 finite answers', okQ);
  { seed = 11; const qs = questions(11, r), q = qs[3]; const m = q.text.match(/at (\d+) m\/s and slows at (\d+) m\/s², then rolls back\. What distance does it travel in the first (\d+) s/); const [u, a, T] = m.slice(1).map(Number), ts2 = u / a;
    check('motion-graphs: roll-back question answer = u²/2a + ½a(T−u/a)²', near(q.ans, u * u / (2 * a) + 0.5 * a * (T - ts2) ** 2, 1e-9)); }
};
