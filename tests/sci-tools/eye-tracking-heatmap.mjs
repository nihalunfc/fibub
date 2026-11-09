// #728 Eye-tracking heat map: fixation detection, heat map and AOI measures, checked against an independent
// NumPy implementation of I-VT, I-DT (Salvucci and Goldberg 2000) and the Gaussian heat map, on the made-up
// gaze recording in tests/fixtures/eye-tracking-heatmap.csv.
import { readFileSync } from 'node:fs';
import { ivt, idt, heat, aoiStats, velocities, dispersion, scanpath } from '../../src/lib/sci/gaze.ts';

export default async (check) => {
  const rows = readFileSync(new URL('../fixtures/eye-tracking-heatmap.csv', import.meta.url), 'utf8').trim().split('\n').slice(1).map((l) => l.split(',').map(Number));
  const s = rows.map(([t, x, y]) => ({ x, y, t }));
  const close = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const same = (got, want) => got.length === want.length && got.every((f, i) => close(f.x, want[i][0]) && close(f.y, want[i][1]) && close(f.start, want[i][2]) && close(f.dur, want[i][3]));
  check('gaze: fixture has 153 samples', s.length === 153);
  const A = ivt(s, 1000, 60);
  check('gaze: I-VT (1000 px/s, 60 ms) matches NumPy fixations', same(A, [[397.288235, 299.170588, 0.0, 266.7], [150.386957, 119.469565, 350.0, 366.7], [618.111765, 139.405882, 800.0, 266.7], [639.989286, 448.842857, 1150.0, 450.0], [199.4, 468.135294, 1733.3, 266.7], [408.933333, 310.133333, 2116.7, 133.3], [160.346154, 131.284615, 2333.3, 200.0]]));
  check('gaze: I-DT (40 px, 100 ms) matches NumPy fixations', same(idt(s, 40, 100), [[397.288235, 299.170588, 0.0, 266.7], [150.3875, 119.504167, 333.3, 383.4], [618.216667, 139.566667, 783.3, 283.4], [639.97931, 448.844828, 1133.3, 466.7], [199.509524, 468.77619, 1666.7, 333.3], [408.325, 309.283333, 2066.7, 183.3], [160.392857, 131.178571, 2316.7, 216.6]]));
  check('gaze: fastest sample speed matches NumPy', close(Math.max(...velocities(s)), 7233.344526841214));
  const G = heat(A, 80, 60, 10, 30, true);
  let mx = 0, at = 0; G.forEach((v, i) => { if (v > mx) { mx = v; at = i; } });
  check('gaze: heat map peak value and cell match NumPy', close(mx, 548.8616074834039, 1e-6) && Math.floor(at / 80) === 12 && at % 80 === 15);
  check('gaze: heat map at three cells matches NumPy', close(G[30 * 80 + 40], 383.44517207731167, 1e-6) && close(G[12 * 80 + 15], 548.8616074834039, 1e-6) && close(G[45 * 80 + 64], 434.51817278485026, 1e-6));
  const st = aoiStats(A, [{ name: 'Logo', x1: 100, y1: 80, x2: 220, y2: 180 }, { name: 'Photo', x1: 560, y1: 380, x2: 720, y2: 520 }], s[0].t);
  check('gaze: AOI Logo count, dwell, first fixation, visits', st[0].count === 2 && close(st[0].dwell, 566.7) && close(st[0].first, 350) && st[0].visits === 2);
  check('gaze: AOI Photo count, dwell, first fixation, visits', st[1].count === 1 && close(st[1].dwell, 450) && close(st[1].first, 1150) && st[1].visits === 1);
  check('gaze: AOI with no fixations gives NaN first time', Number.isNaN(aoiStats(A, [{ name: 'x', x1: 0, y1: 0, x2: 5, y2: 5 }], 0)[0].first));
  check('gaze: dispersion is x range + y range', dispersion([{ x: 0, y: 0, t: 0 }, { x: 3, y: 1, t: 1 }, { x: 1, y: 5, t: 2 }], 0, 2) === 8);
  const sp = scanpath([{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 3, y: 10 }]);
  check('gaze: scanpath length and mean amplitude', sp.length === 11 && sp.meanAmp === 5.5 && sp.saccades === 2);
  // A gap in the recording ends a fixation (blink or lost track).
  const gap = [0, 10, 20, 30, 300, 310, 320, 330].map((t) => ({ x: 100, y: 100, t }));
  check('gaze: a time gap over 100 ms splits an I-VT fixation', ivt(gap, 1000, 20).length === 2);
};
