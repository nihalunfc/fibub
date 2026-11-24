// Figures and numbers for src/blog/discoveries/refugee-native-age-structure-dependency-ratios-aegean-1928.md,
// made with the maths of the Population pyramid tool (src/lib/sci/pyramid.ts).
// Run: node scripts/blog-figures/refugee-native-age-structure-dependency-ratios-aegean-1928.mjs
import fs from 'node:fs';
import * as P from '../../src/lib/sci/pyramid.ts';
import { svgPainter } from '../../src/lib/sci/plot.ts';
import { chart, figure, inject, watermark } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/refugee-native-age-structure-dependency-ratios-aegean-1928.md', import.meta.url);

// All inputs are printed values from Rontos, Antonoglou, Giavrimis, Baltas and Kontogiannis (2026),
// Genealogy 10(4): 114, doi:10.3390/genealogy10040114 (CC BY 4.0): Table 5 (populations), Tables 10-13 (age
// shares, dependency ratio, ageing index), Table 9 (sex ratio) and Table 8 (mean age), all for the 1928 census.
const ROWS = [
  { area: 'Lesvos', group: 'Total', pop: 161557, y: 30.7, w: 61.0, o: 8.4, dep: 64.1, aging: 27.2, sr: 89.8, mean: 30.2 },
  { area: 'Lesvos', group: 'Refugees', pop: 32643, y: 25.2, w: 67.1, o: 7.7, dep: 49.0, aging: 30.5, sr: 82.4, mean: 32.8 },
  { area: 'Lesvos', group: 'Native', pop: 128914, y: 32.1, w: 59.4, o: 8.5, dep: 68.4, aging: 26.6, sr: 91.8, mean: 29.8 },
  { area: 'Samos', group: 'Total', pop: 70497, y: 30.7, w: 61.3, o: 8.0, dep: 63.2, aging: 26.2, sr: 89.9, mean: 29.9 },
  { area: 'Samos', group: 'Refugees', pop: 6368, y: 24.6, w: 68.5, o: 7.0, dep: 46.0, aging: 28.4, sr: 77.6, mean: 30.9 },
  { area: 'Samos', group: 'Native', pop: 64129, y: 31.3, w: 60.6, o: 8.1, dep: 65.1, aging: 26.0, sr: 91.2, mean: 29.8 },
  { area: 'Chios', group: 'Total', pop: 75680, y: 31.3, w: 59.6, o: 9.1, dep: 67.7, aging: 29.1, sr: 86.2, mean: 30.4 },
  { area: 'Chios', group: 'Refugees', pop: 12854, y: 24.2, w: 64.7, o: 11.0, dep: 54.5, aging: 45.6, sr: 74.0, mean: 33.9 },
  { area: 'Chios', group: 'Native', pop: 62826, y: 32.7, w: 58.6, o: 8.7, dep: 70.7, aging: 26.7, sr: 88.9, mean: 29.7 },
  { area: 'Greece', group: 'Total', pop: 6204684, y: 32.2, w: 62.0, o: 5.9, dep: 61.4, aging: 18.2, sr: 98.3, mean: 28.0 },
  { area: 'Greece', group: 'Refugees', pop: 1069957, y: 27.3, w: 67.5, o: 5.2, dep: 48.1, aging: 18.9, sr: 91.0, mean: 29.0 },
  { area: 'Greece', group: 'Native', pop: 5134727, y: 33.2, w: 60.8, o: 6.0, dep: 64.4, aging: 18.1, sr: 99.9, mean: 27.8 },
];

// Counts per age group from the printed shares (normalised, because three rows print to 99.9 or 100.1), then
// split by sex with the group's own sex ratio applied to every age group: OUR assumption, needed only for the
// picture and the medians by sex. It cannot change a dependency ratio, which uses the totals.
function pyramidOf(r) {
  const S = r.y + r.w + r.o, c = [r.y, r.w, r.o].map((p) => (r.pop * p) / S);
  const m = c.map((v) => (v * r.sr) / (100 + r.sr)), f = c.map((v) => (v * 100) / (100 + r.sr));
  const rows = [['Age', 'Male', 'Female'], ['0-14', m[0], f[0]], ['15-64', m[1], f[1]], ['65+', m[2], f[2]]];
  return P.parsePyramid(rows.map((x) => x.map(String)), `${r.area} ${r.group.toLowerCase()}`);
}
// How far a ratio of shares can move when each share is only given to 0.1 %.
function slack(fn, r) {
  let lo = Infinity, hi = -Infinity;
  for (const dy of [-0.05, 0.05]) for (const dw of [-0.05, 0.05]) for (const dof of [-0.05, 0.05]) {
    const v = fn(r.y + dy, r.w + dw, r.o + dof); lo = Math.min(lo, v); hi = Math.max(hi, v);
  }
  return [lo, hi];
}
const R = ROWS.map((r) => {
  const p = pyramidOf(r), s = P.pyramidStats(p);
  const depRange = slack((y, w, o) => ((y + o) / w) * 100, r), agRange = slack((y, w, o) => (o / y) * 100, r);
  return {
    ...r, p, s, depTool: s.dep.total, youngDep: s.dep.young, oldDep: s.dep.old,
    agingTool: (r.o / r.y) * 100, medTool: s.median.value, srTool: s.sexRatio, oldShare: s.oldShare,
    depRange, agRange, depOk: r.dep >= depRange[0] - 5e-3 && r.dep <= depRange[1] + 5e-3,
    agOk: r.aging >= agRange[0] - 5e-3 && r.aging <= agRange[1] + 5e-3,
  };
});
const by = (area, group) => R.find((r) => r.area === area && r.group === group);

// Internal check: are the total-population shares the population-weighted mix of refugee and native shares?
const MIX = ['Lesvos', 'Samos', 'Chios', 'Greece'].map((area) => {
  const t = by(area, 'Total'), rf = by(area, 'Refugees'), na = by(area, 'Native');
  const mix = ['y', 'w', 'o'].map((k) => (rf.pop * rf[k] + na.pop * na[k]) / t.pop);
  return { area, refugeeShare: (rf.pop / t.pop) * 100, mix, printed: [t.y, t.w, t.o], depMix: ((mix[0] + mix[2]) / mix[1]) * 100, depPrinted: t.dep, sums: rf.pop + na.pop - t.pop };
});

// ---- Figure 1: the tool's own pyramid, drawn through the SVG painter it uses for downloads.
const W1 = 560, H1 = 300;
const sp = svgPainter(W1, H1, 'system-ui, sans-serif');
P.drawPyramid(sp, by('Lesvos', 'Refugees').p, by('Lesvos', 'Native').p, {
  w: W1, h: H1 - 16, pct: true, ink: 'var(--ink)', muted: 'var(--muted)', grid: 'var(--line)', bg: null,
  male: 'var(--c-blog)', female: 'var(--c-tools)', over: 'var(--ink)', font: 13,
  title: 'Lesvos 1928: refugees (bars) and natives (outline)',
});
const body = String(sp).replace(/^[\s\S]*?<svg[^>]*>\n?/, '').replace(/<\/svg>\s*$/, '');
const fig1 = [
  `<svg class="blog-fig" viewBox="0 0 ${W1} ${H1}" role="img" aria-label="Population pyramid of the 1928 refugee population of Lesvos in three broad age groups, with the native population as an outline. The refugee bars are narrower at the bottom: a quarter of refugees were under 15 against a third of natives." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif">`,
  '<title>Lesvos 1928: refugee and native age structure</title>', body, watermark(W1, H1, 4), '</svg>',
].join('');

// ---- Figure 2: the tool's grouped median age against the paper's mean age.
const kinds = ['Total', 'Refugees', 'Native'];
const fig2 = chart({
  title: 'Grouped median age against the paper’s mean age',
  xLabel: 'Mean age in the paper (years)', yLabel: 'Median age from the tool (years)',
  series: [
    ...kinds.map((g) => ({ name: g, kind: 'dots', x: R.filter((r) => r.group === g).map((r) => r.mean), y: R.filter((r) => r.group === g).map((r) => +r.medTool.toFixed(2)), size: 4.5 })),
    { name: '', noLegend: true, kind: 'line', x: [27, 35], y: [27, 35], colour: 'var(--muted)', dash: '4 4' },
  ],
  xDomain: [27, 35], yDomain: [28, 36],
  desc: 'Twelve populations: the paper’s mean age on the x-axis, the median age the tool works out from three broad age groups on the y-axis. Every point sits above the dashed one-to-one line, by 0.6 to 2.7 years.',
  height: 280,
});

const f2 = (x) => +x.toFixed(2);
console.log(JSON.stringify(R.map((r) => ({
  area: r.area, group: r.group, pop: r.pop,
  depPaper: r.dep, depTool: f2(r.depTool), depRange: r.depRange.map(f2), depOk: r.depOk,
  youngDep: f2(r.youngDep), oldDep: f2(r.oldDep), oldShare: f2(r.oldShare),
  agingPaper: r.aging, agingTool: f2(r.agingTool), agRange: r.agRange.map(f2), agOk: r.agOk,
  srPaper: r.sr, srTool: f2(r.srTool), meanPaper: r.mean, medTool: f2(r.medTool), medMinusMean: f2(r.medTool - r.mean),
})), null, 0));
console.log('mix', JSON.stringify(MIX.map((m) => ({ area: m.area, refugeeShare: f2(m.refugeeShare), mix: m.mix.map(f2), printed: m.printed, depMix: f2(m.depMix), depPrinted: m.depPrinted, popsAddUp: m.sums === 0 }))));
console.log('all 12 dependency ratios within rounding:', R.every((r) => r.depOk), '| all 12 ageing indices:', R.every((r) => r.agOk));
console.log('median gap range', f2(Math.min(...R.map((r) => r.medTool - r.mean))), f2(Math.max(...R.map((r) => r.medTool - r.mean))));
console.log('refugee - native median:', ['Lesvos', 'Samos', 'Chios', 'Greece'].map((a) => `${a} ${f2(by(a, 'Refugees').medTool - by(a, 'Native').medTool)} (paper mean gap ${f2(by(a, 'Refugees').mean - by(a, 'Native').mean)})`).join(', '));

// The whole-number counts the article asks readers to paste into the tool, and what the tool then shows.
for (const g of ['Refugees', 'Native']) {
  const r = by('Lesvos', g), S = r.y + r.w + r.o;
  const cells = [r.y, r.w, r.o].map((pc) => { const c = (r.pop * pc) / S; return [Math.round((c * r.sr) / (100 + r.sr)), Math.round((c * 100) / (100 + r.sr))]; });
  const st = P.pyramidStats(P.parsePyramid([['Age', 'Male', 'Female'], ['0-14', ...cells[0]], ['15-64', ...cells[1]], ['65+', ...cells[2]]].map((x) => x.map(String))));
  console.log('paste', g, JSON.stringify(cells), '-> sex ratio', st.sexRatio.toFixed(1), 'young', st.dep.young.toFixed(1), 'old', st.dep.old.toFixed(1), 'total', st.dep.total.toFixed(1), 'median', st.median.value.toFixed(1));
}

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pyramid', figure(fig1, 'Figure 1. The 1928 refugee population of Lesvos (bars) and the native population of the same prefecture (outline), drawn by the Population pyramid tool from the paper’s three broad age shares. Each half is a share of that population’s own total. The split between men and women inside each age group is ours, from the group’s overall sex ratio; the paper publishes no age-by-sex table.'));
  md = inject(md, 'median', figure(fig2, 'Figure 2. The median age the tool interpolates inside three broad age groups, against the mean age the paper reports for the same twelve populations. The ranking is reproduced, but a three-group median is biased upwards: with only 0-14, 15-64 and 65+ to work with, the 15-64 group is spread evenly over fifty years.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
