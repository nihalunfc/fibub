// Figures for src/blog/discoveries/nacl-powder-xrd-fcc-indexing-lattice-parameter-coherence-length.md, made with
// the maths of the XRD peak calculator (src/lib/sci/xrd.ts: Bragg, cubic indexing, Scherrer, Williamson-Hall).
// Run: node scripts/blog-figures/nacl-powder-xrd-fcc-indexing-lattice-parameter-coherence-length.mjs
import fs from 'node:fs';
import { dFromTwoTheta, rankCubic, scherrer, williamsonHall } from '../../src/lib/sci/xrd.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/nacl-powder-xrd-fcc-indexing-lattice-parameter-coherence-length.md', import.meta.url);

// Inputs from the paper: AlGharram et al. (2026), Compounds 6(3): 48, doi:10.3390/compounds6030048 (CC BY).
// Nine reflections, 2theta in degrees as printed (one decimal), and the wavelength the paper states.
const LAM = 1.542;
const TT = [27.4, 31.7, 45.5, 53.9, 56.5, 66.3, 73.1, 75.4, 84.1];
const K = 0.9;
// The paper's own Williamson-Hall line: beta cos(theta) = 0.00299 + 0.00082 * (4 sin theta), radians.
const WH_INT = 0.00299, WH_SLOPE = 0.00082;
const RAD = Math.PI / 180;

const sOf = (tt, shift = 0) => tt.map((t) => 1 / dFromTwoTheta(t + shift, LAM) ** 2);
const fit = (shift = 0) => rankCubic(sOf(TT, shift), 0.005, 1 / dFromTwoTheta(20, LAM) ** 2);

const ranked = fit();
const best = ranked[0];
const perPeak = best.lines.map((l, i) => Math.sqrt(l.N) * dFromTwoTheta(TT[i], LAM));
const hkl = best.lines.map((l) => l.hkl);

// Peak widths implied by the paper's OWN Williamson-Hall line (not measured widths: the paper's FWHM table is an image).
const beta = TT.map((t) => { const th = (t / 2) * RAD; return (WH_INT + WH_SLOPE * 4 * Math.sin(th)) / Math.cos(th) / RAD; });
const sizes = TT.map((t, i) => scherrer(t, beta[i], LAM, K) / 10); // nm
const wh = williamsonHall(TT.map((t, i) => ({ tt: t, beta: beta[i] })), LAM, K);

// How far the lattice parameter moves when every 2theta is nudged (the printed values are rounded to 0.1 deg).
const shifts = Array.from({ length: 41 }, (_, i) => -0.1 + i * 0.005);
const aShift = shifts.map((s) => fit(s)[0].a);

const fig1 = chart({
  title: 'NaCl: lattice parameter from each reflection', xLabel: '2θ (°)', yLabel: 'a from this line (Å)',
  series: [
    { name: 'One line at a time', kind: 'dots', x: TT, y: perPeak.map((v) => +v.toFixed(4)), size: 4 },
    { name: 'All nine lines together', kind: 'line', x: [25, 86], y: [best.a, best.a], colour: 'var(--c-tools)' },
  ],
  xDomain: [25, 86], yDomain: [5.632, 5.65],
  hlines: [{ y: 5.64009, text: 'reference 5.6401 Å' }],
  desc: `The lattice parameter worked out from each of the nine NaCl reflections separately, between 5.638 and 5.646 angstrom, against the single value ${best.a.toFixed(4)} angstrom from a least-squares fit to all nine.`,
  height: 270,
});

const fig2 = chart({
  title: 'Scherrer size per line, against the Williamson-Hall size', xLabel: '2θ (°)', yLabel: 'Apparent size (nm)',
  series: [
    { name: 'Scherrer, line by line', kind: 'dots', x: TT, y: sizes.map((v) => +v.toFixed(2)), size: 4 },
    { name: 'Williamson-Hall intercept', kind: 'line', x: [25, 86], y: [wh.size / 10, wh.size / 10], colour: 'var(--c-tools)' },
  ],
  xDomain: [25, 86], yDomain: [20, 52],
  desc: `Scherrer sizes fall from about 37 nm at the first line to about 27 nm at the last, while the Williamson-Hall intercept gives ${(wh.size / 10).toFixed(1)} nm for the same widths.`,
  height: 270,
});

const fig3 = chart({
  title: 'What rounding 2θ to 0.1° does to the lattice parameter', xLabel: 'Shift added to every 2θ (°)', yLabel: 'Fitted a (Å)',
  series: [{ name: '', kind: 'line', x: shifts, y: aShift.map((v) => +v.toFixed(5)) }],
  xDomain: [-0.1, 0.1], yDomain: [5.625, 5.656],
  bands: [{ x0: -0.05, x1: 0.05, text: 'rounding to 0.1°' }],
  hlines: [{ y: best.a, text: '' }],
  desc: `The fitted lattice parameter moves by about 0.0075 angstrom for every 0.05 degree the whole pattern shifts, so rounding 2theta to one decimal already costs more than the quoted uncertainty.`,
  height: 250,
});

const out = {
  a: +best.a.toFixed(5), aSd: +best.aSd.toFixed(5), lattice: best.lattice, hkl, rms: +best.rms.toExponential(3),
  perPeak: perPeak.map((v) => +v.toFixed(4)), perPeakRange: [Math.min(...perPeak).toFixed(4), Math.max(...perPeak).toFixed(4)],
  ranked: ranked.map((f) => ({ lattice: f.lattice, a: +f.a.toFixed(4), unindexed: f.unindexed, missing: f.missing.length })),
  beta: beta.map((v) => +v.toFixed(3)), sizes: sizes.map((v) => +v.toFixed(1)),
  meanSize: +(sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1),
  whSize: +(wh.size / 10).toFixed(2), whStrain: wh.strain, whR2: +wh.r2.toFixed(6),
  aAt: { minus05: +fit(-0.05)[0].a.toFixed(5), plus05: +fit(0.05)[0].a.toFixed(5) },
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'alattice', figure(fig1, `Figure 1. The lattice parameter of rock-salt NaCl worked out from each printed reflection on its own (dots) and from all nine together by least squares (line), with the reference value 5.6401 Å. Inputs: the paper's nine 2θ values and λ = 1.542 Å.`));
  md = inject(md, 'sizes', figure(fig2, `Figure 2. Apparent crystallite size from the Scherrer equation, line by line, against the size from the Williamson-Hall intercept, for peak widths rebuilt from the paper's own Williamson-Hall line. Not the paper's measured widths.`));
  md = inject(md, 'shift', figure(fig3, `Figure 3. How the fitted lattice parameter moves when the whole pattern is shifted. The shaded strip is the ±0.05° that rounding 2θ to one decimal allows.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
