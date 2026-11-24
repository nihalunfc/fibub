// Figures for src/blog/discoveries/spaltiite-monoclinic-cell-powder-d-spacings.md, made with the maths of the
// Miller index calculator (src/lib/sci/miller.ts: the metric tensor, d-spacings, plane angles and zone axes).
// Run: node scripts/blog-figures/spaltiite-monoclinic-cell-powder-d-spacings.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import * as M from '../../src/lib/sci/miller.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/spaltiite-monoclinic-cell-powder-d-spacings.md', import.meta.url);

// Inputs from the paper: Graeser et al. (2026), Eur. J. Mineral. 38: 27-37, doi:10.5194/ejm-38-27-2026 (CC BY 4.0).
// Two cells for the same mineral: the single-crystal cell and the cell refined from the Gandolfi powder film.
const SC = M.cellFor('monoclinic', { a: 15.791, b: 10.0, c: 6.323, beta: 99.25 });
const PW = M.cellFor('monoclinic', { a: 15.821, b: 10.023, c: 6.334, beta: 99.21 });
// The eight strongest powder lines: d (Å) as measured, relative intensity, and the paper's indices.
const LINES = [
  { d: 3.914, I: 40, hkl: [0, 2, 1] }, { d: 3.646, I: 34, hkl: [-2, 2, 1] }, { d: 3.496, I: 45, hkl: [3, 1, 1] },
  { d: 2.988, I: 63, hkl: [5, 1, 0] }, { d: 2.869, I: 45, hkl: [-5, 1, 1] }, { d: 2.762, I: 26, hkl: [2, 0, 2] },
  { d: 2.652, I: 36, hkl: [-3, 3, 1] }, { d: 2.506, I: 29, hkl: [0, 4, 0] },
];
const LAM = 1.5406; // Cu Kα1, the tool's default wavelength
const twoTheta = (d) => (2 * Math.asin(LAM / (2 * d)) * 180) / Math.PI;

const rows = LINES.map((L) => {
  const dsc = M.dSpacing(SC, L.hkl), dpw = M.dSpacing(PW, L.hkl);
  return { ...L, dsc, dpw, esc: (100 * (dsc - L.d)) / L.d, epw: (100 * (dpw - L.d)) / L.d, ttObs: twoTheta(L.d), ttPw: twoTheta(dpw) };
});
const mean = (v) => v.reduce((s, x) => s + x, 0) / v.length;
const summary = {
  Vsc: M.volume(SC), Vpw: M.volume(PW),
  meanAbsSc: mean(rows.map((r) => Math.abs(r.esc))), meanAbsPw: mean(rows.map((r) => Math.abs(r.epw))),
  biasSc: mean(rows.map((r) => r.esc)), biasPw: mean(rows.map((r) => r.epw)),
  // One uniform scale on the single-crystal cell that best matches the eight measured spacings.
  scale: mean(rows.map((r) => r.d / r.dsc)),
  d040pw: M.dSpacing(PW, [0, 4, 0]), quarterB: 10.023 / 4,
  // Geometry the tool gives for two of the strong lines.
  ang: M.planeAngle(PW, [5, 1, 0], [-5, 1, 1]), zone: M.zoneAxis([5, 1, 0], [-5, 1, 1]),
  ang2: M.planeAngle(PW, [0, 2, 1], [0, 4, 0]), zone2: M.zoneAxis([0, 2, 1], [0, 4, 0]),
  nRefl: M.reflections(PW, 5).length,
  below40: M.reflections(PW, 5).filter((r) => LAM / (2 * r.d) <= 1 && twoTheta(r.d) < 40).reduce((s, r) => s + r.count, 0),
  // P2₁/c absences: 0k0 needs k even, h0l needs l even. Do the paper's eight indices obey them?
  allowed: rows.every((r) => { const [h, k, l] = r.hkl; if (h === 0 && l === 0) return k % 2 === 0; if (k === 0) return l % 2 === 0; return true; }),
};

const fig1 = chart({
  title: 'Measured minus calculated spacing, eight strongest lines',
  xLabel: 'Measured d-spacing (Å)', yLabel: 'Calculated − measured (%)',
  series: [
    { name: 'Single-crystal cell', kind: 'dots', x: rows.map((r) => r.d), y: rows.map((r) => +r.esc.toFixed(3)), size: 4 },
    { name: 'Powder-film cell', kind: 'dots', x: rows.map((r) => r.d), y: rows.map((r) => +r.epw.toFixed(3)), size: 4 },
  ],
  xDomain: [2.4, 4.05], yDomain: [-0.6, 0.2], hlines: [{ y: 0, text: 'perfect agreement' }],
  desc: 'For each of the eight strongest powder lines, the per cent difference between the d-spacing calculated from each published cell and the measured one. The powder-film cell sits within 0.3 per cent of every line; the single-crystal cell is 0.2 to 0.5 per cent low throughout.',
  height: 270,
});

// A stick pattern: each line at the 2θ the powder cell gives, with the paper's relative intensity.
const sticks = rows.flatMap((r) => [
  { name: '', noLegend: true, kind: 'line', x: [r.ttPw, r.ttPw], y: [0, r.I], colour: 'var(--c-blog)' },
]);
const fig2 = chart({
  title: 'Where the eight lines fall with Cu Kα1 (λ = 1.5406 Å)',
  xLabel: '2θ (°)', yLabel: 'Relative intensity',
  series: [
    ...sticks,
    { name: 'Calculated from the powder cell', kind: 'dots', x: rows.map((r) => r.ttPw), y: rows.map((r) => r.I), size: 3.2, colour: 'var(--c-blog)' },
    { name: 'From the measured spacing', kind: 'dots', x: rows.map((r) => r.ttObs), y: rows.map((r) => r.I), size: 3.2, colour: 'var(--c-tools)' },
  ],
  xDomain: [22, 37], yDomain: [0, 70],
  desc: 'The eight strongest spaltiite powder lines placed on a 2θ axis for copper radiation, drawn from the d-spacings the Miller index calculator gives for the powder-film cell, with the intensities the paper reports.',
  height: 260,
});

const fx = (x, n = 4) => +x.toFixed(n);
console.log(JSON.stringify({
  rows: rows.map((r) => ({ hkl: M.fmtIdx(r.hkl), d: r.d, I: r.I, dsc: fx(r.dsc), dpw: fx(r.dpw), esc: fx(r.esc, 2), epw: fx(r.epw, 2), ttObs: fx(r.ttObs, 3), ttPw: fx(r.ttPw, 3) })),
  summary: { ...summary, zone: summary.zone.join(' '), zone2: summary.zone2.join(' ') },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'resid', figure(fig1, 'Figure 1. How far each published cell is from the eight strongest measured lines, in per cent. Calculated with the Miller index calculator\'s metric-tensor d-spacings from the two cells the paper gives; the measured spacings and the indices are the paper\'s.'));
  md = inject(md, 'sticks', figure(fig2, 'Figure 2. The same eight lines as a stick pattern for copper Kα1 radiation: blue dots are 2θ from the powder-film cell, the second colour is 2θ worked out straight from the measured spacing. Heights are the paper\'s relative intensities.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
