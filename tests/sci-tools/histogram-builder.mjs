// #1286 Histogram and frequency polygon builder. Checked against numpy.histogram, numpy.mean, statistics.median and
// statistics.multimode on 40 random data sets (histogram-builder.ref.json, made by a Python script), and the
// worked example in the guide (30 marks: frequencies 2, 4, 7, 9, 5, 2, 1; mean 61.6; grouped mean 62).
import { readFileSync } from 'node:fs';
import { parseData, group, polygon, mean, median, modes, groupedMean, modalClasses, niceStart, combinedMean } from '../../src/lib/sci/histo-l2.ts';

export default async (check) => {
  const d = parseData('47 62 55 71 38 66 59 84 52 73 45 68 77 61 49 90 57 64 70 35 58 81 63 54 67 42 75 60 69 56').data;
  const C = group(d, niceStart(d, 10), 10);
  check('histogram: example classes 30-100 with frequencies 2,4,7,9,5,2,1', C.length === 7 && C[0].lo === 30 && C.map((c) => c.f).join() === '2,4,7,9,5,2,1');
  check('histogram: example mean 61.6, median 61.5, no mode, grouped mean 62, modal class 60-70', Math.abs(mean(d) - 61.6) < 1e-9 && median(d) === 61.5 && modes(d).length === 0 && Math.abs(groupedMean(C) - 62) < 1e-9 && modalClasses(C)[0].lo === 60);
  const P = polygon(C);
  check('histogram: polygon closes at 25 and 105 with 0', P.length === 9 && P[0].x === 25 && P[0].y === 0 && P[8].x === 105 && P[1].y === 2);
  check('histogram: a value on a boundary goes up', group([10, 20, 20, 30], 10, 10).map((c) => c.f).join() === '1,2,1');
  check('histogram: parse rejects words, accepts commas and minus signs', parseData('1, 2 x').bad === 'x' && parseData('−3,4\n5').data.join() === '-3,4,5');
  check('combined mean: 30 × 62 and 20 × 70 → 65.2', Math.abs(combinedMean([{ n: 30, mean: 62 }, { n: 20, mean: 70 }]) - 65.2) < 1e-12);
  const ref = JSON.parse(readFileSync(new URL('./histogram-builder.ref.json', import.meta.url), 'utf8'));
  let ok = 0;
  for (const r of ref) {
    const g = group(r.d, r.s, r.w), m = modes(r.d);
    if (g.map((c) => c.f).join() === r.h.join() && Math.abs(mean(r.d) - r.mean) < 1e-9 && Math.abs(median(r.d) - r.med) < 1e-9 && m.join() === r.modes.join() && Math.abs(g[0].lo - r.s) < 1e-9) ok++;
  }
  check(`histogram: 40 random sets match numpy and Python statistics (${ok}/40)`, ok === ref.length);
};
