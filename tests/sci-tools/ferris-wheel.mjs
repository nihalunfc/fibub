// #1279 Ferris wheel height. Checked against Python (math.cos, numpy.arccos) for a 20 m wheel with its hub 22 m up
// and an 8-minute turn: heights every 30°, the times the seat is 32 m up (≈ 2.62 and 5.38 min) and the share of the
// turn spent above 32 m (≈ 0.2748 above 35 m), plus the textbook special angles.
import { heightAt, heightAtAngle, timesAtHeight, fractionAbove, anglesAtHeight, range, valid, table, angleAt, wrap } from '../../src/lib/sci/ferris-school.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  const w = { R: 20, H: 22, T: 8 };
  check('bottom, quarter, top, three quarters', near(heightAt(w, 0), 2) && near(heightAt(w, 2), 22) && near(heightAt(w, 4), 42) && near(heightAt(w, 6), 22) && near(heightAt(w, 8), 2));
  check('60° is H − R/2, 120° is H + R/2', near(heightAtAngle(w, 60), 12) && near(heightAtAngle(w, 120), 32));
  const PY = [2, 4.67949192, 12, 22, 32, 39.32050808, 42, 39.32050808, 32, 22, 12, 4.67949192, 2];
  check('table every 30° matches Python', table(w).every((r, i) => near(r.h, PY[i], 1e-8)));
  const ts = timesAtHeight(w, 32);
  check('times at 32 m: 2.6667 and 5.3333 min', ts.length === 2 && near(ts[0], 8 / 3) && near(ts[1], 16 / 3));
  // Python: (360 - 2*degrees(arccos((22-35)/20)))/360 = 0.274769...
  check('fraction above 35 m matches Python 0.274769', near(fractionAbove(w, 35), 0.2747688785, 1e-8));
  check('fraction above H is one half; below bottom 1; above top 0', near(fractionAbove(w, 22), 0.5) && fractionAbove(w, 1) === 1 && fractionAbove(w, 43) === 0);
  check('top and bottom touched once', anglesAtHeight(w, 42).length === 1 && anglesAtHeight(w, 2).length === 1 && anglesAtHeight(w, 50).length === 0);
  check('range', range(w).low === 2 && range(w).high === 42);
  check('start angle shifts the times', near(timesAtHeight({ ...w, start: 90 }, 42)[0], 2) && near(angleAt({ ...w, start: 90 }, 2), 180));
  check('valid', valid(w) && !valid({ R: 20, H: 10, T: 8 }) && !valid({ R: 0, H: 10, T: 8 }) && !valid({ R: 5, H: 10, T: 0 }));
  check('wrap', wrap(-30) === 330 && wrap(725) === 5);
  let ok = true;
  for (let i = 0; i < 200; i++) {
    const v = { R: 1 + Math.random() * 30, H: 0, T: 1 + Math.random() * 20, start: Math.random() * 360 }; v.H = v.R + Math.random() * 10;
    const h = v.H - v.R + Math.random() * 2 * v.R;
    for (const t of timesAtHeight(v, h)) if (!near(heightAt(v, t), h, 1e-7) || t < 0 || t >= v.T) ok = false;
  }
  check('200 random wheels: heightAt(timesAtHeight(h)) = h', ok);
};
