// #748 Likert chart: counts, percentages, % agree/disagree, median (numpy), mean and SD (pandas, ddof = 1) per
// item checked against pandas/numpy on the made-up staff survey in src/tools/likert-chart/example.csv; the
// diverging layout (neutral centred on 0) and the drawing through an SVG painter are checked by construction.
import { readFileSync } from 'node:fs';
import { summarise, countRaw, sortItems, segments, palette, drawLikert, chartHeight, DEFAULT_LABELS } from '../../src/lib/sci/likert.ts';
import { svgPainter } from '../../src/lib/sci/plot.ts';
import { readColumns } from '../../src/lib/sci/econometrics.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

const R = {"My manager listens to me":{"counts":[9,19,28,59,35],"n":150,"median":4,"mean":3.6133333333333333,"sd":1.1515187908701574,"agree":62.66666666666667,"dis":18.666666666666668},"I have the tools I need":{"counts":[15,37,22,51,24],"n":149,"median":4,"mean":3.214765100671141,"sd":1.2657855075826392,"agree":50.33557046979866,"dis":34.899328859060404},"Workload is manageable":{"counts":[26,41,34,37,12],"n":150,"median":3,"mean":2.7866666666666666,"sd":1.2238495031105672,"agree":32.666666666666664,"dis":44.666666666666664},"I would recommend working here":{"counts":[14,14,43,42,37],"n":150,"median":4,"mean":3.493333333333333,"sd":1.2247266051126242,"agree":52.666666666666664,"dis":18.666666666666668},"Pay is fair for my role":{"counts":[39,48,28,23,10],"n":148,"median":2,"mean":2.439189189189189,"sd":1.2246135103281564,"agree":22.2972972972973,"dis":58.78378378378378},"I see a future for myself here":{"counts":[17,26,41,47,19],"n":150,"median":3,"mean":3.1666666666666665,"sd":1.1951617602273006,"agree":44,"dis":28.666666666666668},"Meetings are a good use of time":{"counts":[30,39,51,17,13],"n":150,"median":3,"mean":2.6266666666666665,"sd":1.1789351734411582,"agree":20,"dis":46},"I feel part of a team":{"counts":[3,8,31,57,51],"n":150,"median":4,"mean":3.966666666666667,"sd":0.9722089058425418,"agree":72,"dis":7.333333333333333}};

export default async (check) => {
  const { head, cols } = readColumns(parseTable(readFileSync(new URL('../../src/tools/likert-chart/example.csv', import.meta.url), 'utf8')));
  const labels = DEFAULT_LABELS[5];
  const items = head.slice(1).map((h) => summarise(h, countRaw(h, cols[h], labels)));
  let ok = 0;
  for (const it of items) {
    const r = R[it.name];
    if (it.counts.join() === r.counts.join() && it.n === r.n && it.median === r.median && Math.abs(it.mean - r.mean) < 1e-12 && Math.abs(it.sd - r.sd) < 1e-12 && Math.abs(it.agree - r.agree) < 1e-9 && Math.abs(it.disagree - r.dis) < 1e-9) ok++;
  }
  check(`likert: counts, n, median, mean, SD, % agree and % disagree match pandas for ${ok}/8 items`, ok === 8);
  check('likert: blanks skipped (149 and 148 answers)', items[1].n === 149 && items[4].n === 148);
  const even = summarise('x', [1, 1, 1, 1]);
  check('likert: even n median is the mean of the two middle answers (2.5)', even.median === 2.5 && summarise('y', [0, 2, 0, 1]).median === 2);
  check('likert: labels and codes both accepted, any case', countRaw('q', ['agree', 'Strongly Agree', '1', '3', ''], labels).join() === '1,0,1,1,1');
  const e = (fn) => { try { fn(); return ''; } catch (x) { return x.message; } };
  check('likert: answer outside the scale explained', /"Q" has the answer "6"/.test(e(() => countRaw('Q', ['6'], labels))) && /"Q" has the answer "maybe"/.test(e(() => countRaw('Q', ['maybe'], labels))));
  check('likert: an item with no answers explained', /has no answers/.test(e(() => summarise('Q', [0, 0, 0, 0, 0]))));
  // Diverging layout: neutral straddles 0, segments touch, total width 100 %.
  const s = segments(items[0]);
  check('likert: segments are contiguous and span 100 %', s.every((x, i) => i === 0 || Math.abs(x[0] - s[i - 1][1]) < 1e-12) && Math.abs(s[4][1] - s[0][0] - 100) < 1e-9);
  check('likert: neutral centred on zero', Math.abs(s[2][0] + s[2][1]) < 1e-12 && Math.abs(-s[0][0] - (items[0].disagree + items[0].neutral / 2)) < 1e-12);
  const s4 = segments(summarise('four', [1, 2, 3, 4]));
  check('likert: 4-point scale splits at zero between disagree and agree', Math.abs(s4[1][1]) < 1e-12);
  const sorted = sortItems(items, 'agree');
  check(`likert: sort by agreement puts "${sorted[0].name}" first`, sorted[0].name === 'I feel part of a team' && sorted.every((x, i) => i === 0 || x.agree <= sorted[i - 1].agree + 1e-12));
  check('likert: sort by disagreement and by mean', sortItems(items, 'disagree')[0].disagree === Math.max(...items.map((i) => i.disagree)) && sortItems(items, 'mean')[0].mean === Math.max(...items.map((i) => i.mean)));
  check('likert: palettes for 4 to 7 points', [4, 5, 6, 7].every((k) => palette(k).length === k && new Set(palette(k)).size === k) && palette(5)[2] === '#c8c8c8');
  // Blog article lung-cancer-nutrition-kap-item-scores-from-response-counts: the 25 published items of
  // doi:10.3389/fnut.2026.1678612 (N = 598) must give back its three domain scores, and the item variances with
  // its printed total SDs must give Cronbach's alpha for the analysed sample.
  const KAP = [
    { k: [[32, 309, 257], [68, 273, 257], [84, 253, 261], [185, 268, 145], [87, 279, 232], [133, 282, 183], [97, 288, 213], [69, 273, 256], [88, 301, 209], [113, 305, 180]], sum: 22.068561872909697, sd: 4.69, alpha: 0.8744283921721205 },
    { k: [[12, 76, 113, 285, 112], [5, 21, 98, 267, 207], [5, 20, 89, 282, 202], [10, 26, 92, 285, 185], [3, 21, 111, 279, 184], [4, 31, 104, 278, 181], [7, 26, 132, 281, 152], [3, 21, 83, 299, 192], [1, 25, 126, 296, 150]], sum: 35.88795986622074, sd: 4.98, alpha: 0.8249894233762729 },
    { k: [[6, 37, 138, 248, 169], [9, 47, 160, 219, 163], [3, 32, 125, 226, 212], [1, 34, 123, 221, 219], [10, 63, 158, 206, 161], [3, 64, 154, 222, 155]], sum: 23.282608695652172, sd: 4.12, alpha: 0.8172722943469264 },
  ];
  let kapOk = 0;
  for (const d of KAP) {
    const its = d.k.map((c, i) => summarise(`i${i}`, c));
    const n = its.length, sv = its.reduce((s, x) => s + x.sd ** 2, 0);
    const alpha = (n / (n - 1)) * (1 - sv / d.sd ** 2);
    if (its.every((x) => x.n === 598) && Math.abs(its.reduce((s, x) => s + x.mean, 0) - d.sum) < 1e-12 && Math.abs(alpha - d.alpha) < 1e-12) kapOk++;
  }
  check('likert: three KAP domains give back 22.0686 / 35.8880 / 23.2826 and alphas 0.8744 / 0.8250 / 0.8173', kapOk === 3);
  const P = svgPainter(720, chartHeight(8, 5, 720));
  drawLikert(P, { w: 720, h: chartHeight(8, 5, 720), items, labels, ink: '#000', muted: '#555', grid: '#ddd' });
  const svg = P.toString();
  check('likert: SVG has 40 bars, item names and a legend', (svg.match(/<polygon/g) || []).length === 40 + 5 && svg.includes('I feel part of a team') && svg.includes('Neither agree nor disagree'));
};
