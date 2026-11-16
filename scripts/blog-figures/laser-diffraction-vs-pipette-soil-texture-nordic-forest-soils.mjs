// Figures for src/blog/discoveries/laser-diffraction-vs-pipette-soil-texture-nordic-forest-soils.md, made with the maths of the
// Soil texture triangle (src/lib/sci/soiltexture.ts: usdaClass, POLYGONS, triXY).
// Run: node scripts/blog-figures/laser-diffraction-vs-pipette-soil-texture-nordic-forest-soils.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { usdaClass, POLYGONS, CLASSES, triXY } from '../../src/lib/sci/soiltexture.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/laser-diffraction-vs-pipette-soil-texture-nordic-forest-soils.md', import.meta.url);
// Paper: Callesen et al. (2023), Front. For. Glob. Change 6, 1144845, doi:10.3389/ffgc.2023.1144845 (CC BY). Four Danish forest
// soils, clay < 2 µm, silt 2-20 µm, sand 20-2000 µm, by sieving and sedimentation (SSM) and by three laser diffraction (LD)
// instruments. We use the SSM values and our own average of the three LD instruments, rounded to whole per cent.
const LD = { DK1882: [[18.4, 66.5, 15.2], [15.5, 58.4, 26.1], [13.1, 60.6, 26.3]], DK1892: [[4.5, 13.4, 82.1], [6.9, 20.5, 71.6], [5.0, 17.4, 77.6]],
  DK1900: [[9.5, 28, 62.5], [10.7, 31.3, 58.1], [7.5, 25.1, 68.4]], DK2042: [[4.5, 13.1, 82.1], [6.2, 21.0, 72.8], [4.3, 14.9, 80.8]] };
const SSM = { DK1882: [38, 37, 25], DK1892: [10, 13, 76], DK1900: [22, 18, 60], DK2042: [15, 11, 73] }; // clay, silt, sand
const avg = (rows) => [0, 1, 2].map((j) => rows.reduce((s, r) => s + r[j], 0) / rows.length);
const norm = ([c, si, sa]) => { const t = c + si + sa; return [c, si, sa].map((v) => Math.round((100 * v) / t)); };
const S = Object.keys(SSM).map((id) => { const a = norm(SSM[id]), b = norm(avg(LD[id])); return { id, ssm: a, ld: b, cSsm: usdaClass(a[2], a[1], a[0]), cLd: usdaClass(b[2], b[1], b[0]), dClay: a[0] - b[0] }; });

// How much clay can move into silt before the class changes (0.1 % steps from the SSM result).
const shift = (c, si, sa) => { const c0 = usdaClass(sa, si, c); for (let d = 0.1; d <= c; d += 0.1) if (usdaClass(sa, si + d, c - d) !== c0) return +d.toFixed(1); return null; };

// Figure 1: the USDA triangle with class edges, each sample from SSM (dot) to the LD average (arrow line).
const edges = CLASSES.map((n) => { const p = [...POLYGONS[n], POLYGONS[n][0]].map(([c, si, sa]) => triXY(c, si, sa)); return { name: '', noLegend: true, kind: 'line', colour: 'var(--line)', x: p.map((q) => +q[0].toFixed(4)), y: p.map((q) => +q[1].toFixed(4)) }; });
const xy = (v) => triXY(v[0], v[1], v[2]).map((q) => +q.toFixed(4));
const fig1 = chart({
  title: 'Four Danish forest soils: sieve and settle (dots) against laser (ends)', xLabel: '', yLabel: '',
  series: [...edges,
    ...S.map((s) => ({ name: '', noLegend: true, kind: 'line', colour: 'var(--c-blog)', x: [xy(s.ssm)[0], xy(s.ld)[0]], y: [xy(s.ssm)[1], xy(s.ld)[1]] })),
    { name: 'Sieving and sedimentation', kind: 'dots', x: S.map((s) => xy(s.ssm)[0]), y: S.map((s) => xy(s.ssm)[1]), size: 4.5 },
    { name: 'Laser diffraction (average of 3)', kind: 'dots', colour: 'var(--c-tools)', x: S.map((s) => xy(s.ld)[0]), y: S.map((s) => xy(s.ld)[1]), size: 3.5 },
    ...[['100 % clay', 0.5, 0.866, 8, 4], ['100 % sand', 0, 0, 2, -8], ['100 % silt', 1, 0, -70, -8]].map(([t, x, y, dx, dy]) => ({ name: '', noLegend: true, kind: 'dots', size: 0.1, x: [x], y: [y], label: { text: t, dx, dy } })),
    ...S.map((s) => ({ name: '', noLegend: true, kind: 'dots', size: 0.1, x: [xy(s.ssm)[0]], y: [xy(s.ssm)[1]], label: { text: s.id, dx: 6, dy: -6 } })),
  ],
  xDomain: [0, 1], yDomain: [0, 0.9], xTicks: [], yTicks: [], height: 330,
  desc: 'On the USDA texture triangle (clay at the top, sand bottom left, silt bottom right) every sample moves down and to the right from the sieve-and-settle result to the laser result: clay is lost and silt gained. All four cross into another USDA class (three of four in the paper\'s own size system).',
});

// Figure 2: clay by SSM against clay by laser, each instrument, with the 1:1 line.
const ids = Object.keys(SSM), inst = ['Coulter', 'HELOS', 'Malvern'];
const fig2 = chart({
  title: 'Clay by sieve and settle against clay by laser', xLabel: 'Clay by sieving and sedimentation (%)', yLabel: 'Clay by laser diffraction (%)',
  series: [
    { name: '1 : 1', kind: 'line', dash: '4 3', colour: 'var(--muted)', x: [0, 40], y: [0, 40] },
    ...inst.map((n, k) => ({ name: n, kind: 'dots', size: 4, x: ids.map((id) => SSM[id][0]), y: ids.map((id) => LD[id][k][0]) })),
  ],
  xDomain: [0, 40], yDomain: [0, 40], height: 290,
  desc: 'Every laser clay value lies below the 1:1 line; the gap grows with clay content, from about 3 to 6 points at 10 % clay to 20 to 25 points at 38 %.',
});

const facts = { S, shifts: S.map((s) => ({ id: s.id, needed: shift(...s.ssm) })) };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'tri', figure(fig1, 'Figure 1. The four Danish samples placed on the USDA texture triangle with the Soil texture triangle\'s own class edges: the sieving-and-sedimentation result (dot) joined to our average of the three laser instruments (smaller dot). Percentages from the paper; the averaging and the classes are ours.'));
  md = inject(md, 'clay', figure(fig2, 'Figure 2. Clay (under 2 µm) by each laser instrument against sieving and sedimentation for the same four samples, as reported in the paper, with the 1:1 line.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
