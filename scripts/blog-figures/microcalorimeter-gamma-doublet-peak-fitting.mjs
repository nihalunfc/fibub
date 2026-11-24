// Figures for src/blog/discoveries/microcalorimeter-gamma-doublet-peak-fitting.md, made with the maths of the
// Spectrum peak fitter (src/lib/sci/phpeak.ts: Gaussian peaks on a background by Poisson-weighted least squares).
// Run: node scripts/blog-figures/microcalorimeter-gamma-doublet-peak-fitting.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { fitPeaks, FWHM, sumArea } from '../../src/lib/sci/phpeak.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/microcalorimeter-gamma-doublet-peak-fitting.md', import.meta.url);

// From the paper: Schreiber et al. (2025), Front. Nucl. Eng. 4: 1654123, doi:10.3389/fnuen.2025.1654123 (CC BY 4.0).
// The Ba-140 and Ce-144 gamma lines at 132.687 and 133.515 keV; microcalorimeter peak FWHM below 100 eV near 100 keV
// (as low as 53 eV), against about 550 eV for a commercial HPGe detector; spectra binned at 0.01 keV per channel;
// about 12,000 counts in a peak for a 1 % statistical uncertainty.
const E1 = 132.687, E2 = 133.515, BIN = 0.01;
const RES = [{ id: 'Microcalorimeter', fwhm: 0.100 }, { id: 'HPGe', fwhm: 0.550 }];
// OUR assumptions: 12,000 counts in the strong line and 3,000 in the weak one, on a flat 20 counts per channel.
const A1 = 12000, A2 = 3000, BG = 20;
const LO = 131.4, HI = 134.8;
const E = []; for (let e = LO; e <= HI + 1e-9; e += BIN) E.push(+e.toFixed(2));

let seed = 1654123 >>> 0;
const rnd = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pois = (mu) => { if (mu < 30) { const L = Math.exp(-mu); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; } const u = rnd() || 1e-12, v = rnd(); return Math.max(0, Math.round(mu + Math.sqrt(mu) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v))); };
const gauss = (e, A, mu, sg) => ((A * BIN) / (sg * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((e - mu) / sg) ** 2);

const cases = RES.map((r) => {
  const sg = r.fwhm / FWHM;
  const mean = E.map((e) => BG + gauss(e, A1, E1, sg) + gauss(e, A2, E2, sg));
  const y = mean.map(pois);
  const fit = fitPeaks(E, y, 0, E.length - 1, [E1, E2], 1);
  if (!fit.ok) throw new Error(r.id + ': ' + fit.error);
  const one = fitPeaks(E, y, 0, E.length - 1, [(E1 + E2) / 2], 1); // what you get if you call it one peak
  return { ...r, sg, mean, y, fit, one, sum: sumArea(y, 0, E.length - 1, 10) };
});

const show = (c) => {
  console.log(`\n${c.id}: input FWHM ${(c.fwhm * 1000).toFixed(0)} eV, separation/FWHM = ${((E2 - E1) / c.fwhm).toFixed(2)}, total counts ${c.y.reduce((a, b) => a + b, 0)}`);
  c.fit.peaks.forEach((p, i) => console.log(`  peak ${i + 1}: centroid ${p.mu.toFixed(4)} +/- ${p.muSe.toFixed(4)} keV, FWHM ${(p.fwhm * 1000).toFixed(1)} +/- ${(p.fwhmSe * 1000).toFixed(1)} eV, area ${Math.round(p.area)} +/- ${Math.round(p.areaSe)} (${(100 * p.areaSe / p.area).toFixed(2)} %)`));
  console.log(`  chi2/nu ${c.fit.redChi2.toFixed(3)} on ${c.fit.df} df; summation net area ${Math.round(c.sum.net)} +/- ${Math.round(c.sum.se)}`);
  if (c.one.ok) { const p = c.one.peaks[0]; console.log(`  one-peak fit: centroid ${p.mu.toFixed(4)} keV, FWHM ${(p.fwhm * 1000).toFixed(0)} eV, area ${Math.round(p.area)} +/- ${Math.round(p.areaSe)}, chi2/nu ${c.one.redChi2.toFixed(2)}`); }
};
cases.forEach(show);
console.log('\nresolution ratios: 550/53 =', (550 / 53).toFixed(1), ' 550/100 =', (550 / 100).toFixed(1));
console.log('1/sqrt(12000) =', (100 / Math.sqrt(12000)).toFixed(2), '%   1/sqrt(600) =', (100 / Math.sqrt(600)).toFixed(1), '%');

// --- Chart 1: the two simulated doublets.
const mc = cases[0], ge = cases[1];
const fig1 = chart({
  title: 'The same doublet seen two ways (simulated)', xLabel: 'Energy (keV)', yLabel: 'Counts per 0.01 keV channel',
  series: [
    { name: 'Microcalorimeter, 100 eV', kind: 'line', x: E, y: mc.y, colour: 'var(--c-blog)' },
    { name: 'HPGe, 550 eV', kind: 'line', x: E, y: ge.y, colour: 'var(--c-tools)' },
  ],
  xDomain: [131.9, 134.3], yDomain: [0, Math.max(...mc.y) * 1.08],
  vlines: [{ x: E1, text: '132.687' }, { x: E2, text: '133.515', dy: 16 }],
  desc: 'Two simulated spectra of the same pair of gamma lines at 132.687 and 133.515 keV. At 100 eV resolution they are two clean separate peaks; at 550 eV the weaker line is only a bump on the side of the stronger one.',
  height: 300,
});

// Single clean peak at 100 eV: how the fitted area uncertainty depends on the number of counts in it.
console.log('\nsingle 100 eV peak on the same flat background, one fit each:');
for (const N of [600, 3000, 12000, 20000]) {
  const sg = 0.1 / FWHM;
  const y = E.map((e) => pois(BG + gauss(e, N, E1, sg)));
  const f = fitPeaks(E, y, 0, E.length - 1, [E1], 1);
  console.log(`  ${N} counts -> area ${Math.round(f.peaks[0].area)} +/- ${Math.round(f.peaks[0].areaSe)} (${((100 * f.peaks[0].areaSe) / f.peaks[0].area).toFixed(1)} %), Poisson limit ${(100 / Math.sqrt(N)).toFixed(1)} %`);
}

// --- Chart 2: how the weak line's area uncertainty depends on the detector's resolution.
const scan = [];
for (let fw = 50; fw <= 900; fw += 50) {
  const sg = fw / 1000 / FWHM;
  const y = E.map((e) => pois(BG + gauss(e, A1, E1, sg) + gauss(e, A2, E2, sg)));
  const f = fitPeaks(E, y, 0, E.length - 1, [E1, E2], 1);
  if (!f.ok) { scan.push({ fw, bad: true }); continue; }
  const p2 = f.peaks[1];
  scan.push({ fw, pct: (100 * p2.areaSe) / p2.area, area: p2.area, fwhm: p2.fwhm * 1000, bias: p2.area - A2 });
}
console.log('\nweak-line (3,000 count) area uncertainty against detector FWHM:');
for (const s of scan) console.log(`  ${s.fw} eV -> ${s.bad ? 'fit failed' : s.pct.toFixed(2) + ' % (area ' + Math.round(s.area) + ')'}`);

const fig2 = chart({
  title: 'The weaker line: how its area uncertainty grows with detector width', xLabel: 'Detector peak width FWHM (eV)', yLabel: 'Uncertainty on the 133.515 keV area (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: scan.map((s) => s.fw), y: scan.map((s) => +Math.log10(s.pct).toFixed(4)), colour: 'var(--c-blog)' },
    { name: '', noLegend: true, kind: 'dots', x: scan.map((s) => s.fw), y: scan.map((s) => +Math.log10(s.pct).toFixed(4)), size: 2.6, colour: 'var(--c-blog)' }],
  xDomain: [0, 920], yDomain: [Math.log10(1.6), Math.log10(40)],
  yTicks: [2, 3, 5, 10, 20, 30].map(Math.log10), yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  vlines: [{ x: 100, text: 'microcalorimeter' }, { x: 550, text: 'HPGe', dy: 16 }],
  desc: 'The fitted uncertainty on the weaker line of the doublet, 3,000 counts beside 12,000, against the detector peak width from 50 to 900 eV. It is about 2 per cent at 100 eV and about 4 per cent at 550 eV.',
  height: 290,
});

// --- A short, pasteable version of the 550 eV spectrum for the "Check it yourself" section: 0.1 keV bins.
const CB = 0.1, CE = []; for (let e = 131.4; e <= 134.9 + 1e-9; e += CB) CE.push(+e.toFixed(1));
const cg = (e, A, mu, sg) => ((A * CB) / (sg * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((e - mu) / sg) ** 2);
for (const fw of [0.55, 0.10]) {
  const sg = fw / FWHM, y = CE.map((e) => pois(200 + cg(e, A1, E1, sg) + cg(e, A2, E2, sg)));
  const f = fitPeaks(CE, y, 0, CE.length - 1, [E1, E2], 1);
  console.log(`\npasteable ${(fw * 1000).toFixed(0)} eV spectrum (0.1 keV bins), ${CE.length} rows:`);
  console.log(CE.map((e, i) => `${e}, ${y[i]}`).join('; '));
  if (f.ok) f.peaks.forEach((pk, i) => console.log(`  fit peak ${i + 1}: ${pk.mu.toFixed(3)} +/- ${pk.muSe.toFixed(3)} keV, FWHM ${(pk.fwhm * 1000).toFixed(0)} eV, area ${Math.round(pk.area)} +/- ${Math.round(pk.areaSe)}, chi2/nu ${f.redChi2.toFixed(2)}`));
  const one = fitPeaks(CE, y, 0, CE.length - 1, [133.1], 1);
  if (one.ok) console.log(`  one-peak fit: ${one.peaks[0].mu.toFixed(3)} keV, FWHM ${(one.peaks[0].fwhm * 1000).toFixed(0)} eV, area ${Math.round(one.peaks[0].area)}, chi2/nu ${one.redChi2.toFixed(2)}`);
}

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'doublet', figure(fig1, 'Figure 1. The same simulated pair of lines, 828 eV apart, at two detector resolutions: 100 eV (microcalorimeter, the paper’s figure for 100 keV) and 550 eV (its figure for a commercial germanium detector). Both have 12,000 counts in the stronger line and 3,000 in the weaker one on a flat background, and both are binned at 0.01 keV. Simulated, not the paper’s data.'));
md = inject(md, 'gefit', figure(fig2, 'Figure 2. The 550 eV spectrum fitted by the Spectrum peak fitter’s maths as two Gaussians on a straight background, with the two components drawn separately. They overlap over most of their width.'));
fs.writeFileSync(ART, md);
console.log('\ncharts written; fig1', fig1.length, 'bytes, fig2', fig2.length, 'bytes');
