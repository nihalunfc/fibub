// #1279 Ferris wheel height. Checked against Python (math.cos): hub 12 m, radius 10 m gives 2, 7, 12, 22, 7 m at
// 0°, 60°, 90°, 180°, 300°; and against the turn count by hand (450° = 1 turn + 90°).
import { height, angleAt, turns, anglesAtHeight, shareAbove } from '../../src/lib/sci/ferris-school.ts';
export default async (check) => {
  const h = [0, 60, 90, 180, 300].map((a) => height(a, 10, 12));
  check('ferris: heights 2, 7, 12, 22, 7 m (Python)', [2, 7, 12, 22, 7].every((v, i) => Math.abs(h[i] - v) < 1e-9));
  check('ferris: angle after 15 s of a 60 s turn is 90°', angleAt(15, 60) === 90 && angleAt(90, 60) === 540);
  const t = turns(450), t2 = turns(720), t3 = turns(-90);
  check('ferris: 450° = 1 turn + 90°, 720° = 2 turns, −90° = −1 turn + 270°', t.turns === 1 && t.rest === 90 && t2.turns === 2 && t2.rest === 0 && t3.turns === -1 && t3.rest === 270);
  const a = anglesAtHeight(17, 10, 12);
  check('ferris: 17 m reached at 120° and 240°', a.length === 2 && Math.abs(a[0] - 120) < 1e-9 && Math.abs(a[1] - 240) < 1e-9);
  check('ferris: top only at 180°, bottom only at 0°, never above the top', anglesAtHeight(22, 10, 12).join() === '180' && anglesAtHeight(2, 10, 12).join() === '0' && anglesAtHeight(23, 10, 12).length === 0);
  check('ferris: above hub height half the time, above 17 m a third of the time', Math.abs(shareAbove(12, 10, 12) - 0.5) < 1e-12 && Math.abs(shareAbove(17, 10, 12) - 1 / 3) < 1e-12);
  let ok = true;
  for (let i = 0; i < 300; i++) { const r = 1 + Math.random() * 30, H = r + Math.random() * 5, d = Math.random() * 360; const hh = height(d, r, H); const back = anglesAtHeight(hh, r, H); if (!back.some((b) => Math.abs(b - d) < 1e-6 || Math.abs(Math.abs(b - d) - 360) < 1e-6)) ok = false; }
  check('ferris: 300 random seats: anglesAtHeight finds the angle again', ok);
};
