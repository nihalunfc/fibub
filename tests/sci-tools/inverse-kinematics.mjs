// #637 inverse kinematics for 2- and 3-link planar arms. Checked by forward-kinematics round trips and against an
// independent SciPy solve written for these tests: scipy.optimize.least_squares from 60 random starts, keeping
// every distinct exact solution (it finds exactly the two elbow solutions in each case).
import * as K from '../../src/lib/sci/ik.ts';
const REF = [[[1.0987946406559148, -1.4706289056333368], [-0.17149942265430296, 1.4706289056333368]], [[0.11990233319498556, -2.094395102393195], [-1.9744927691982106, 2.0943951023931957]], [[2.7029230845123013, -1.4479878616092625], [1.8281461214708976, 1.4479878616092625]], [[1.1779924718257435, -1.9779109483411836, 1.3235172521137395], [-0.4652523920595679, 1.9779109483411839, -0.9890597806833168]], [[2.9432349468853705, -1.9868404323029276, 1.1380005878107537], [1.2337120008114937, 1.9868404323029285, -1.126157330721227]]];
export default async (check) => {
  const close = (a, b, t = 1e-9) => a.length === b.length && a.every((v, i) => Math.abs(K.wrap(v - b[i])) < t);
  const sets = [K.ik2(1, 0.8, 1.2, 0.6), K.ik2(0.5, 0.5, 0.3, -0.4), K.ik2(2, 1, -1.5, 1.8), K.ik3(1, 0.8, 0.3, 1.2, 0.5, Math.PI / 6).sols, K.ik3(0.6, 0.5, 0.2, -0.4, 0.7, (2 * Math.PI) / 3).sols];
  const names = ['2-link (1, 0.8) to (1.2, 0.6)', '2-link equal links below the base', '2-link (2, 1) up and left', '3-link with tool at 30°', '3-link with tool at 120°'];
  sets.forEach((s, i) => check(`ik: ${names[i]}: both solutions match SciPy least squares`, s.length === 2 && REF[i].every((r) => s.some((x) => close(x.q, r)))));
  const L2 = [1, 0.8], L3 = [1, 0.8, 0.3];
  let worst = 0, n = 0;
  for (let k = 0; k < 400; k++) {
    const a = (k * 0.61) % (2 * Math.PI) - Math.PI, rr = 0.25 + (k % 37) / 37 * 1.5, x = rr * Math.cos(a), y = rr * Math.sin(a), phi = ((k * 1.3) % (2 * Math.PI)) - Math.PI;
    for (const s of K.ik2(1, 0.8, x, y)) { const f = K.fk(L2, s.q).pts[2]; worst = Math.max(worst, Math.hypot(f[0] - x, f[1] - y)); n++; }
    for (const s of K.ik3(1, 0.8, 0.3, x, y, phi).sols) { const f = K.fk(L3, s.q); worst = Math.max(worst, Math.hypot(f.pts[3][0] - x, f.pts[3][1] - y), Math.abs(K.wrap(f.phi - phi))); n++; }
  }
  check(`ik: ${n} forward-kinematics round trips land on the target (worst ${worst.toExponential(1)})`, n > 500 && worst < 1e-12);
  check('ik: elbow up has a negative elbow angle, elbow down positive', K.ik2(1, 0.8, 1.2, 0.6)[0].elbow === 'up' && K.ik2(1, 0.8, 1.2, 0.6)[0].q[1] < 0 && K.ik2(1, 0.8, 1.2, 0.6)[1].q[1] > 0);
  check('ik: out of reach (too far and too close) gives no solution', K.ik2(1, 0.8, 1.9, 0).length === 0 && K.ik2(1, 0.8, 0.1, 0).length === 0);
  { const s = K.ik2(1, 0.8, 1.8, 0); check('ik: fully stretched gives one solution with θ2 = 0', s.length === 1 && Math.abs(s[0].q[0]) < 1e-12 && Math.abs(s[0].q[1]) < 1e-12); }
  { const s = K.ik2(1, 0.8, 0.2, 0); check('ik: fully folded gives one solution with θ2 = 180°', s.length === 1 && Math.abs(Math.abs(s[0].q[1]) - Math.PI) < 1e-9); }
  check('ik: reach annulus', JSON.stringify(K.reach2(1, 0.8)) === JSON.stringify({ rMin: 0.19999999999999996, rMax: 1.8 }));
  { const s = K.ik2(1, 0.8, 1.2, 0.6), lim = [[-Math.PI / 2, Math.PI], [-150 / 57.29577951308232, 0]];
    check('ik: joint limits keep elbow up and reject elbow down', K.limitBreaks(s[0].q, lim).length === 0 && JSON.stringify(K.limitBreaks(s[1].q, lim)) === '[1]'); }
  check('ik: angles wrap into (−180°, 180°]', K.wrap(3 * Math.PI) === Math.PI && Math.abs(K.wrap(-3.5 * Math.PI) - 0.5 * Math.PI) < 1e-12);
};
