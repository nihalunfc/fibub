// Figures for src/blog/discoveries/optical-tweezers-corner-frequency-fast-calibration.md, made with the maths of the
// Optical tweezers calibration tool (src/lib/sci/phtweezers.ts: Stokes drag, the aliased Lorentzian spectrum and its fit).
// Run: node scripts/blog-figures/optical-tweezers-corner-frequency-fast-calibration.mjs
import fs from 'node:fs';
import * as OT from '../../src/lib/sci/phtweezers.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/optical-tweezers-corner-frequency-fast-calibration.md', import.meta.url);

// Inputs from the paper: Stilgoe, A. B., Armstrong, D. J. and Rubinsztein-Dunlop, H. (2021), Micromachines 12(5),
// article 570 (CC BY 4.0). A 2 um polystyrene bead in water; equilibrium aliased-spectrum fit omega_c = 6942 +- 870 1/s,
// about 118 pN/um; falling-particle (FORMA) omega_c = 7834 +- 794 1/s; precision about 10 % per fall, RSD below 6 %.
const WC = 6942, WC_SE = 870, WC_FORMA = 7834, K_PAPER = 118e-6; // N/m (118 pN/um)
const ETA = 0.89e-3, R = 1e-6, TK = 298.15; // water at 25 C, 1 um radius: OUR assumptions, the paper states neither
const G = OT.drag(ETA, R), FC = WC / (2 * Math.PI), K = G * WC;

// How precisely can an equilibrium power spectrum pin that corner frequency, against record length?
const FS = 100000, SEEDS = 40;
const LENS = [0.02, 0.05, 0.2, 1, 5];
const runs = LENS.map((sec) => {
  const n = Math.round(sec * FS), L = n >= 8192 ? 8192 : n >= 2048 ? 2048 : 512;
  const got = [];
  for (let s = 1; s <= SEEDS; s++) {
    const x = OT.simulateBead(K, G, TK, FS, n, s), ps = OT.psd(x, FS, L), b = OT.block(ps.f, ps.P, 4);
    try { got.push(OT.fitPsd(b.f, b.P, { fmin: 50, fmax: 20000, aliased: true, fs: FS, nAvg: ps.segments * 4 }).fc); } catch { /* too few points */ }
  }
  const mean = got.reduce((a, b) => a + b, 0) / got.length;
  const sd = Math.sqrt(got.reduce((a, b) => a + (b - mean) ** 2, 0) / (got.length - 1));
  return { sec, n, L, segments: Math.floor(n / L), mean, sd, rsd: (100 * sd) / mean, bias: 100 * (mean / FC - 1) };
});

// One 1 s record, for the spectrum figure and the aliasing comparison.
const x1 = OT.simulateBead(K, G, TK, FS, FS, 7), ps1 = OT.psd(x1, FS, 8192), b1 = OT.block(ps1.f, ps1.P, 4);
const nAvg1 = ps1.segments * 4;
const aliased = OT.fitPsd(b1.f, b1.P, { fmin: 50, fmax: 20000, aliased: true, fs: FS, nAvg: nAvg1 });
const plain = OT.fitPsd(b1.f, b1.P, { fmin: 50, fmax: 20000, nAvg: nAvg1 });
// The same trap sampled slowly, where aliasing really bites.
const FS2 = 5000, x2 = OT.simulateBead(K, G, TK, FS2, 10 * FS2, 7), ps2 = OT.psd(x2, FS2, 2048), b2 = OT.block(ps2.f, ps2.P, 4);
const al2 = OT.fitPsd(b2.f, b2.P, { fmin: 10, fmax: 2400, aliased: true, fs: FS2, nAvg: ps2.segments * 4 });
const pl2 = OT.fitPsd(b2.f, b2.P, { fmin: 10, fmax: 2400, nAvg: ps2.segments * 4 });
const eq1 = OT.equipartition(x1.map((v) => v * 1e-9), TK);

const lg = (v) => Math.log10(v);
const p10 = (t) => { const v = 10 ** t; return v >= 1000 ? `${+(v / 1000).toPrecision(2)}k` : v >= 1 ? String(Math.round(v)) : String(+v.toPrecision(2)); };

// Figure 1: the spectrum of the paper's trap, with both fits. Plotted coarsely (bins of 32, lines on 80 points) to
// keep the SVG small; the fits above use the tool's own bins of 4.
const show = OT.block(ps1.f, ps1.P, 32);
const inFit = show.f.map((f) => f >= 50 && f <= 20000);
const ff = Array.from({ length: 80 }, (_, i) => 40 * (50000 / 40) ** (i / 79));
const fig1 = chart({
  title: 'Spectrum of a bead in the paper’s trap (simulated, 1 s)', xLabel: 'Frequency (Hz)', yLabel: 'Power spectral density (nm²/Hz)',
  series: [
    { name: 'Simulated spectrum', kind: 'dots', x: show.f.filter((_, i) => inFit[i]).map(lg), y: show.P.filter((_, i) => inFit[i]).map((v) => +lg(v).toFixed(3)), size: 2.2 },
    { name: 'Aliased Lorentzian fit', kind: 'line', x: ff.map(lg), y: ff.map((f) => +lg(OT.lorentzAliased(f, aliased.fc, aliased.D, FS)).toFixed(3)) },
    { name: 'Plain Lorentzian fit', kind: 'line', x: ff.map(lg), y: ff.map((f) => +lg(OT.lorentz(f, plain.fc, plain.D)).toFixed(3)), dash: '5 4' },
  ],
  xDomain: [lg(40), lg(50000)], yDomain: [-3, 1.6], xFmt: p10, yFmt: (t) => (10 ** t >= 1 ? String(Math.round(10 ** t)) : String(+(10 ** t).toPrecision(2))),
  vlines: [{ x: lg(aliased.fc), text: `fc ${aliased.fc.toFixed(0)} Hz`, left: true }],
  desc: `Power spectrum of a simulated one-second record from a trap with the paper's corner frequency, with the aliased Lorentzian fitted (${aliased.fc.toFixed(0)} Hz) and the plain Lorentzian for comparison (${plain.fc.toFixed(0)} Hz).`,
  height: 300,
});

// Figure 2: precision of the fitted corner frequency against record length.
const fig2 = chart({
  title: 'How long a record the power spectrum needs', xLabel: 'Record length (seconds)', yLabel: 'Scatter of the fitted fc (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: runs.map((r) => lg(r.sec)), y: runs.map((r) => +lg(r.rsd).toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', x: runs.map((r) => lg(r.sec)), y: runs.map((r) => +lg(r.rsd).toFixed(4)), size: 3.5, colour: 'var(--c-blog)' }],
  xDomain: [lg(0.015), lg(7)], yDomain: [lg(0.5), lg(25)], xFmt: p10, yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  hlines: [{ y: lg(10), text: '10 % (paper, one fall)' }, { y: lg(6), text: '6 % (paper, repeat scatter)' }],
  vlines: [{ x: lg(0.002), text: '2 ms fall' }],
  desc: `Standard deviation of the fitted corner frequency over ${SEEDS} simulated records, as a percentage of the mean, against record length. It falls from ${runs[0].rsd.toFixed(0)} per cent at 20 ms to ${runs[4].rsd.toFixed(1)} per cent at 5 s; the paper's single 2 ms fall reaches about 10 per cent.`,
  height: 300,
});

console.log(JSON.stringify({
  gamma: +G.toExponential(4), fc: +FC.toFixed(2), kPNperUM: +(K * 1e6).toFixed(1), paperK: 118,
  etaFor118: +((K_PAPER / WC / (6 * Math.PI * R)) * 1e3).toFixed(3),
  kFromSE: +(G * WC_SE * 1e6).toFixed(1), kForma: +(G * WC_FORMA * 1e6).toFixed(1), formaHigher: +((WC_FORMA / WC - 1) * 100).toFixed(1),
  Dexpected: +((OT.KB * TK) / G * 1e18).toFixed(0),
  runs: runs.map((r) => ({ ms: r.sec * 1000, n: r.n, L: r.L, segments: r.segments, meanFc: +r.mean.toFixed(1), sd: +r.sd.toFixed(1), rsd: +r.rsd.toFixed(1), bias: +r.bias.toFixed(1) })),
  oneSecond: { fc: +aliased.fc.toFixed(1), seFc: +aliased.seFc.toFixed(1), k: +(2 * Math.PI * G * aliased.fc * 1e6).toFixed(1), plainFc: +plain.fc.toFixed(1), plainHigh: +((plain.fc / aliased.fc - 1) * 100).toFixed(1), chi2dof: +(aliased.chi2 / aliased.dof).toFixed(2), eqK: +(eq1.k * 1e6).toFixed(1), rms: +(Math.sqrt(eq1.variance) * 1e9).toFixed(1) },
  slowSampling: { fs: FS2, aliasedFc: +al2.fc.toFixed(1), plainFc: +pl2.fc.toFixed(1), plainError: +((pl2.fc / FC - 1) * 100).toFixed(1) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'spectrum', figure(fig1, `Figure 1. A simulated one-second record from a trap with the paper's corner frequency (1,105 Hz), its spectrum averaged as the tool does it, and the two models the tool offers. The aliased Lorentzian returns ${aliased.fc.toFixed(0)} Hz; the plain one reads ${plain.fc.toFixed(0)} Hz, ${((plain.fc / aliased.fc - 1) * 100).toFixed(0)} per cent high. Simulated, not the paper's data.`));
  md = inject(md, 'precision', figure(fig2, `Figure 2. Scatter of the fitted corner frequency over ${SEEDS} simulated records of each length, as a percentage of the mean, with the precision figures the paper reports for its single 2 ms falls.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
