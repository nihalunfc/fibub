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
  const P = svgPainter(720, chartHeight(8, 5, 720));
  drawLikert(P, { w: 720, h: chartHeight(8, 5, 720), items, labels, ink: '#000', muted: '#555', grid: '#ddd' });
  const svg = P.toString();
  check('likert: SVG has 40 bars, item names and a legend', (svg.match(/<polygon/g) || []).length === 40 + 5 && svg.includes('I feel part of a team') && svg.includes('Neither agree nor disagree'));
};
