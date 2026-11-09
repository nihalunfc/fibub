// #755 Population pyramid: summary measures matched to an independent pandas/numpy calculation (scratch
// pyr_ref.py) on both made-up example years; the drawing is checked through the SVG painter.
import * as P from '../../src/lib/sci/pyramid.ts';
import { svgPainter } from '../../src/lib/sci/plot.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

const A = 'Age\tMale\tFemale\n0-4\t2410\t2290\n5-9\t2560\t2440\n10-14\t2690\t2570\n15-19\t2750\t2620\n20-24\t2900\t2810\n25-29\t3120\t3050\n30-34\t3260\t3190\n35-39\t3180\t3150\n40-44\t3010\t3000\n45-49\t2890\t2900\n50-54\t2800\t2840\n55-59\t2640\t2730\n60-64\t2380\t2520\n65-69\t2050\t2250\n70-74\t1660\t1900\n75-79\t1190\t1460\n80-84\t760\t1030\n85+\t470\t840';
const B = 'Age\tMale\tFemale\n0-4\t3150\t3000\n5-9\t3210\t3060\n10-14\t3190\t3040\n15-19\t3080\t2950\n20-24\t3020\t2930\n25-29\t2950\t2880\n30-34\t2810\t2760\n35-39\t2700\t2680\n40-44\t2560\t2570\n45-49\t2380\t2420\n50-54\t2170\t2230\n55-59\t1890\t1980\n60-64\t1600\t1730\n65-69\t1310\t1490\n70-74\t1000\t1210\n75-79\t690\t920\n80-84\t400\t590\n85+\t210\t380';

export default async (check) => {
  const near = (a, b) => Math.abs(a - b) < 1e-10;
  const a = P.parsePyramid(parseTable(A), '2025'), sa = P.pyramidStats(a);
  check('pyramid: parse', a.ages.length === 18 && a.ages[17] === 85 && a.widths[17] === Infinity && a.widths[0] === 5);
  check('pyramid: 2025 = pandas', sa.total === 86310 && near(sa.sexRatio, 98.0041293874742) && near(sa.dep.young, 25.909248354693453) && near(sa.dep.old, 23.57118115691029) && near(sa.dep.total, 49.48042951160374) && near(sa.oldShare, 15.768740586258835));
  check('pyramid: 2025 medians = pandas', near(sa.median.value, 38.55055292259084) && near(sa.medianMale.value, 37.625786163522015) && near(sa.medianFemale.value, 39.48412698412699));
  check('pyramid: old age from 60', near(P.pyramidStats(a, 60).dep.old, 35.03028009084027));
  const sb = P.pyramidStats(P.parsePyramid(parseTable(B)));
  check('pyramid: 2000 = pandas', sb.total === 77140 && near(sb.dep.total, 53.39033605090475) && near(sb.median.value, 31.89407540394973) && near(sb.sexRatio, 98.71200412158682));
  // Hand case: 10 people aged 0-9, 10 aged 10-19: median exactly 10.
  check('pyramid: grouped median by hand', P.groupedMedian([0, 10, 20], [10, 10, Infinity], [10, 10, 0]).value === 10 && P.groupedMedian([0, 10], [10, Infinity], [1, 5]).open);
  check('pyramid: oldest first is reversed', P.parsePyramid(parseTable('Age,M,F\n10+,1,1\n5-9,2,2\n0-4,3,3')).male.join() === '3,2,1');
  check('pyramid: groups not at 15 and 65', P.pyramidStats(P.parsePyramid(parseTable('Age,Male,Female\n0-9,5,5\n10-19,5,5\n20+,5,5'))).dep === null);
  const svg = svgPainter(600, 500);
  P.drawPyramid(svg, a, P.parsePyramid(parseTable(B), '2000'), { w: 600, h: 500, pct: true, ink: '#000', muted: '#555', grid: '#eee', bg: '#fff', male: '#0072B2', female: '#D55E00', over: '#000', title: 'T' });
  const s = svg.toString();
  check('pyramid: SVG has 36 bars and the overlay', (s.match(/<polygon/g) || []).length === 1 + 36 + 1 && /2000/.test(s) && /Female/.test(s));
  let bad = 0; for (const t of ['Age,Male\n0,1\n1,2', 'Age,Male,Female\n0-4,-1,2\n5+,1,1', 'Age,Male,Female\n0-4,1,2\n0-4,1,1']) { try { P.parsePyramid(parseTable(t)); } catch { bad++; } }
  check('pyramid: bad tables refused', bad === 3);
};
