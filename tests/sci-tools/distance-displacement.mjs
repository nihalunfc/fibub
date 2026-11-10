// #1258 Distance and displacement: hand-worked walks and laps.
import { walk, lap, direction, bearing, questions } from '../../src/lib/sci/distance-displacement.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  { const w = walk([{ x: 0, y: 0 }, { x: 300, y: 0 }, { x: 300, y: 400 }]); check('distance-displacement: 300 E + 400 N: 700 m, 500 m, 53.1° north of east', near(w.dist, 700) && near(w.disp, 500) && w.dir === '53.1° north of east' && near(w.bearing, 36.86989764584402)); }
  { const w = walk([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }, { x: 0, y: 0 }]); check('distance-displacement: round a block: 400 m, 0 m', near(w.dist, 400) && w.disp === 0 && w.dir === 'none'); }
  check('distance-displacement: directions', direction(-1, 0) === 'west' && direction(0, -2) === 'south' && direction(-1, 1) === '45° north of west' && direction(1, -Math.sqrt(3)) === '60° south of east');
  check('distance-displacement: bearings N 0, E 90, S 180, W 270', near(bearing(0, 1), 0) && near(bearing(1, 0), 90) && near(bearing(0, -1), 180) && near(bearing(-1, 0), 270));
  { const T = lap(50, 5, 0).T, a = lap(50, 5, T / 4), b = lap(50, 5, T / 2), c = lap(50, 5, T);
    check('distance-displacement: r 50 m, 5 m/s: T = 62.83 s', near(T, 20 * Math.PI));
    check('distance-displacement: quarter lap 78.54 m, displacement 70.71 m', near(a.arc, 25 * Math.PI) && near(a.disp, 50 * Math.SQRT2, 1e-9));
    check('distance-displacement: half lap displacement = diameter 100 m', near(b.disp, 100, 1e-9) && near(b.arc, 50 * Math.PI));
    check('distance-displacement: full lap displacement 0', c.disp < 1e-9 && near(c.laps, 1));
    check('distance-displacement: speed constant, a = v²/r = 0.5', near(Math.hypot(a.vx, a.vy), 5) && near(Math.hypot(b.vx, b.vy), 5) && near(a.ac, 0.5) && near(a.omega, 0.1));
    check('distance-displacement: velocity at quarter lap points west', a.vdir === 'west' && b.vdir === 'south'); }
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let ok = true; for (let i = 0; i < 300; i++) for (const lv of [9, 11]) { const qs = questions(lv, r); if (qs.length !== (lv === 11 ? 5 : 4) || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('distance-displacement: questions have positive finite answers', ok);
};
