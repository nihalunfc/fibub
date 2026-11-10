// #1303 Reflex arc and reaction time. Checked by hand and with Python math.sqrt: 15 cm → √(0.3/9.80665) = 0.174904 s;
// 1 m at 60 m/s = 16.667 ms; 1.6 m at 60 m/s + 2 × 0.5 ms = 27.667 ms; d = ½ g t² inverts t = √(2d/g).
import { travelMs, reflexMs, rulerTime, rulerCm, stats, G } from '../../src/lib/sci/reaction.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('reaction: ruler 15 cm → 0.174904 s', near(rulerTime(15), 0.17490422061613564, 1e-12) && rulerTime(0) === 0);
  check('reaction: ruler with g = 9.8, 20 cm → 0.2020 s', near(rulerTime(20, 9.8), 0.20203050891044214, 1e-12));
  check('reaction: d = ½ g t² inverts the ruler time', [1, 5, 12.5, 30].every((d) => near(rulerCm(rulerTime(d)), d, 1e-9)) && near(rulerCm(0.2, 9.8), 19.6, 1e-9));
  check('reaction: travel 1 m at 60 m/s = 16.67 ms', near(travelMs(1, 60), 16.666666666666668) && travelMs(1, 0) === Infinity);
  check('reaction: reflex 1.6 m, 2 synapses = 27.67 ms', near(reflexMs(1.6, 60, 2), 27.666666666666668, 1e-9) && near(reflexMs(1.6, 60, 0), 26.666666666666668, 1e-9));
  const s = stats([300, 200, 250, 400]);
  check('reaction: stats mean 287.5, median 275, best 200', s.n === 4 && s.mean === 287.5 && s.median === 275 && s.best === 200 && s.worst === 400 && stats([5, 1, 3]).median === 3 && Number.isNaN(stats([]).mean));
  check('reaction: standard gravity', G === 9.80665);
};
