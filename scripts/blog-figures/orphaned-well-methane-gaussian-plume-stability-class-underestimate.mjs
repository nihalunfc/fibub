// Figures for src/blog/discoveries/orphaned-well-methane-gaussian-plume-stability-class-underestimate.md, made with the maths of the
// Gaussian plume calculator (src/lib/sci/plume.ts: Briggs rural spread, ground reflection, power-law wind).
// Run: node scripts/blog-figures/orphaned-well-methane-gaussian-plume-stability-class-underestimate.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { conc, sigmasFor, vertical } from '../../src/lib/sci/plume.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/orphaned-well-methane-gaussian-plume-stability-class-underestimate.md', import.meta.url);

// Inputs from the paper: Follansbee et al. (2025), Atmos. Meas. Tech. 18: 4527, doi:10.5194/amt-18-4527-2025 (CC BY 4.0).
// Four sensors at 7.5, 15, 22.5 and 47 m downwind; peak CH4 enhancements 53.4, 27.2, 15.1, 6.0 ppm; mean wind 6.6 m/s;
// source height 1.2 m, sensor inlets 1.6 m; direct (Ventbuster) rate 9.0 kg/h; four-sensor Gaussian inversion 10.53 kg/h.
const X = [7.5, 15, 22.5, 47], PEAK = [53.4, 27.2, 15.1, 6.0], SIGY = [2.55, 3.14, 3.83, 6.69];
const U = 6.6, HS = 1.2, ZS = 1.6, DIRECT = 9.0;
// OUR assumptions: air at 88 kPa and 20 °C (a site near 1,100 m altitude), so 1 ppm CH4 = P/(RT) x 16.04 g/mol x 1e-6.
const P = 88000, T = 293, RG = 8.314, MCH4 = 16.04;
const GPM3_PER_PPM = (P / (RG * T)) * MCH4 * 1e-6;
const KGH = 3.6; // g/s to kg/h

const src = (Q, cls) => ({ Q, u: U, H: HS, cls, terrain: 'rural' });
const invert = (cls, i) => (PEAK[i] * GPM3_PER_PPM) / conc(src(1, cls), X[i], 0, ZS) * KGH;       // kg/h that would give the observed peak
const predict = (cls, i) => conc(src(DIRECT / KGH, cls), X[i], 0, ZS) / GPM3_PER_PPM;                 // ppm at the direct rate
// The same equation with the paper's own spread: sigma-y as printed (our reading of the column), sigma-z = 0.58 sigma-y.
const invertPaper = (i) => { const sy = SIGY[i], sz = 0.58 * sy; return (PEAK[i] * GPM3_PER_PPM) / (vertical(ZS, HS, sz) / (2 * Math.PI * U * sy * sz)) * KGH; };

const CLS = ['B', 'C', 'D', 'E'];
const inv = Object.fromEntries(['B', 'C', 'D', 'E', 'F'].map((c) => [c, X.map((_, i) => invert(c, i))]));
const pred = Object.fromEntries(['B', 'C', 'D'].map((c) => [c, X.map((_, i) => predict(c, i))]));
const paperInv = X.map((_, i) => invertPaper(i));
const sig = X.map((x) => ['B', 'D'].map((c) => sigmasFor(x, c, 'rural')));
console.log(JSON.stringify({ gpm3PerPpm: GPM3_PER_PPM, inv: Object.fromEntries(Object.entries(inv).map(([k, v]) => [k, v.map((n) => +n.toFixed(2))])), pred: Object.fromEntries(Object.entries(pred).map(([k, v]) => [k, v.map((n) => +n.toFixed(1))])), paperInv: paperInv.map((n) => +n.toFixed(2)), meanB: +((inv.B[1] + inv.B[2] + inv.B[3]) / 3).toFixed(2), sig: sig.map((s) => s.map((o) => [+o.sy.toFixed(2), +o.sz.toFixed(2)])) }));

const fig1 = chart({
  title: 'Methane rate needed to explain each sensor, by class', xLabel: 'Sensor distance downwind (m)', yLabel: 'Emission rate (kg CH₄ per hour)',
  series: [
    ...CLS.map((c) => ({ name: `Class ${c}`, kind: 'line', x: X, y: inv[c].map((v) => +v.toFixed(2)) })),
    { name: 'Paper σy', kind: 'dots', x: X, y: paperInv.map((v) => +v.toFixed(2)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 50], yDomain: [0, 14], hlines: [{ y: DIRECT, text: 'direct 9.0' }],
  desc: `Emission rate each sensor would need to report for four stability classes. Class B gives ${inv.B.slice(1).map((v) => v.toFixed(1)).join(', ')} kg per hour at 15, 22.5 and 47 m, near the directly measured 9.0; neutral class D gives ${inv.D.slice(1).map((v) => v.toFixed(1)).join(', ')}.`, height: 300,
});
const fig2 = chart({
  title: 'Peak methane predicted at the direct rate', xLabel: 'Sensor distance downwind (m)', yLabel: 'CH₄ enhancement (ppm)',
  series: [
    { name: 'Observed peak', kind: 'dots', x: X, y: PEAK, size: 4, colour: 'var(--ink)' },
    { name: 'Class B', kind: 'line', x: X, y: pred.B.map((v) => +v.toFixed(1)) },
    { name: 'Class C', kind: 'line', x: X, y: pred.C.map((v) => +v.toFixed(1)) },
    { name: 'Class D', kind: 'line', x: X, y: pred.D.map((v) => +v.toFixed(1)) },
  ],
  xDomain: [0, 50], yDomain: [0, 100],
  desc: `At 9.0 kg per hour the Briggs rural class B curve gives ${pred.B.map((v) => v.toFixed(1)).join(', ')} ppm at the four sensors; the observed peaks were ${PEAK.join(', ')} ppm.`, height: 300,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'inversion', figure(fig1, 'Figure 1. The rate each sensor would need to report if the plume followed the Briggs open-country curves of one stability class (our assumptions: wind 6.6 m/s at plume height, air at 88 kPa and 20 °C). The dots reuse the same equation with the paper\'s printed spread, read as σy with σz = 0.58 σy. The dashed line is the direct measurement.'));
  md = inject(md, 'forward', figure(fig2, 'Figure 2. Running the other way: the peak enhancement the tool predicts at the directly measured 9.0 kg/h for three classes, against the four observed peaks.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
