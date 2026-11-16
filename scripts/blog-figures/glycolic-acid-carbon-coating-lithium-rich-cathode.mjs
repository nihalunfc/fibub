// Figures for src/blog/discoveries/glycolic-acid-carbon-coating-lithium-rich-cathode.md, made with the maths of the
// Battery cycling analyser (src/lib/sci/battery.ts) and the Impedance (EIS) fitter (src/lib/sci/eis.ts).
// Run: node scripts/blog-figures/glycolic-acid-carbon-coating-lithium-rich-cathode.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { cycling, cyclesTo } from '../../src/lib/sci/battery.ts';
import { MODELS, fitEIS, exchangeCurrent } from '../../src/lib/sci/eis.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/glycolic-acid-carbon-coating-lithium-rich-cathode.md', import.meta.url);

// Inputs from the paper: Yang et al. (2026), Batteries 12(2), 70, doi:10.3390/batteries12020070 (CC BY).
const ICE = { LRM: 0.835, G5: 0.899 }, Q1 = { LRM: 259.2, G5: 285.8 };            // first cycle at 0.1 C, mAh/g
const RATE = [0.1, 0.2, 0.5, 1, 2, 3];
const RATEQ = { LRM: [264.8, 243.4, 223.9, 209.4, 184.7, 160.2], G5: [284.9, 265.2, 245.0, 220.5, 201.2, 183.9] };
const CYC1C = { LRM: { q0: 253.9, ret: 0.81 }, G5: { q0: 239.2, ret: 0.76 } };    // 1 C, 100 cycles, as in the main text
const EIS_P = { fresh: { LRM: [7.167, 174.0], G5: [3.673, 149.5] }, cycled: { LRM: [11.96, 338.4], G5: [8.476, 150.7] } }; // Re, Rct (Ω)
const DLI = { LRM: 4.65e-17, G5: 2.47e-16 }, AREA = 1.44, T = 298.15;          // cm²/s; electrode area cm²

// 1. First cycle with the analyser: charge = discharge / ICE.
const first = Object.fromEntries(Object.entries(Q1).map(([k, q]) => { const s = cycling([1], [q / ICE[k]], [q], 'dc', 1); return [k, { qch: +(q / ICE[k]).toFixed(1), ce: s.first.ce, irrev: +s.irrev.toFixed(1) }]; }));

// 2. Simulated 100 cycles at 1 C: a straight fade from the paper's first capacity to its stated retention, CE 99.6 % (our assumption).
const sim = Object.fromEntries(Object.entries(CYC1C).map(([k, { q0, ret }]) => {
  const c = Array.from({ length: 100 }, (_, i) => i + 1), qd = c.map((n) => q0 * (1 - (1 - ret) * (n - 1) / 99));
  const s = cycling(c, qd.map((q) => q / 0.996), qd, 'dc', 1), to80 = cyclesTo(s.rows, 0.8);
  return [k, { fade: +(100 * s.fadePerCycle).toFixed(3), last: +s.last.qout.toFixed(1), ret: +s.last.ret.toFixed(3), to80: to80 && +to80.n.toFixed(1), extrap: to80?.extrapolated, rows: s.rows }];
}));

// 3. Rate capability: share of the 0.1 C capacity kept at each rate.
const keep = Object.fromEntries(Object.entries(RATEQ).map(([k, q]) => [k, q.map((v) => +(100 * v / q[0]).toFixed(1))]));

// 4. Impedance: simulate Randles spectra with the paper's Re and Rct, CPE Q = 2e-5, α = 0.85 (our assumptions), and a Warburg
//    coefficient scaled as 1/√D from the paper's diffusion coefficients (σ = 300 Ω s^-½ for pristine LRM, our assumption). Then fit.
const rand = MODELS.find((m) => m.id === 'Randles');
const sigma = { LRM: 300, G5: 300 * Math.sqrt(DLI.LRM / DLI.G5) };
const freqs = Array.from({ length: 50 }, (_, k) => 10 ** (5 - (k * 7) / 49));       // 100 kHz to 10 mHz, as in the paper
const spectra = {}, fits = {};
for (const st of ['fresh', 'cycled']) for (const k of ['LRM', 'G5']) {
  const t = [EIS_P[st][k][0], EIS_P[st][k][1], 2e-5, 0.85, sigma[k]];
  const pts = freqs.map((f) => { const z = rand.z(2 * Math.PI * f, t); return { f, re: z[0], im: z[1] }; });
  spectra[`${st} ${k}`] = pts;
  const r = fitEIS(rand, pts);
  fits[`${st} ${k}`] = { Rs: +r.p[0].toFixed(3), Rct: +r.p[1].toFixed(1), i0: exchangeCurrent(r.p[1] * AREA, 1, T) };
}

const fig1 = chart({
  title: 'Rate capability: share of the 0.1 C capacity kept', xLabel: 'C-rate', yLabel: 'Capacity kept (%)',
  series: [
    { name: 'Glycolic-acid treated (G5)', kind: 'line', x: RATE, y: keep.G5 },
    { name: 'Untreated', kind: 'line', x: RATE, y: keep.LRM },
    { name: '', kind: 'dots', x: RATE, y: keep.G5, noLegend: true, colour: 'var(--c-blog)' },
    { name: '', kind: 'dots', x: RATE, y: keep.LRM, noLegend: true, colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 3.1], yDomain: [55, 101], height: 260,
  desc: `At 3 C the treated cathode keeps ${keep.G5[5]} % of its 0.1 C capacity and the untreated one ${keep.LRM[5]} %.`,
});
const nyq = (p) => ({ x: p.filter((q) => q.re < 520).map((q) => +q.re.toFixed(1)), y: p.filter((q) => q.re < 520).map((q) => +(-q.im).toFixed(1)) });
const fig2 = chart({
  title: 'Impedance after cycling (simulated from the paper\'s fitted values)', xLabel: 'Z′ (Ω)', yLabel: '−Z″ (Ω)',
  series: [
    { name: 'Treated, cycled', kind: 'line', ...nyq(spectra['cycled G5']) },
    { name: 'Untreated, cycled', kind: 'line', ...nyq(spectra['cycled LRM']) },
    { name: 'Untreated, fresh', kind: 'line', dash: '4 3', colour: 'var(--muted)', ...nyq(spectra['fresh LRM']) },
  ],
  xDomain: [0, 520], yDomain: [0, 260], height: 270,
  desc: 'Simulated Nyquist plots: after cycling the untreated cathode\'s arc roughly doubles, the treated one barely changes.',
});

const facts = { first, sim: Object.fromEntries(Object.entries(sim).map(([k, v]) => [k, { fade: v.fade, last: v.last, ret: v.ret, to80: v.to80, extrap: v.extrap }])), keep, fits, sigma, dRatio: +(DLI.G5 / DLI.LRM).toFixed(2), rctRise: { LRM: +(100 * (338.4 / 174 - 1)).toFixed(1), G5: +(100 * (150.7 / 149.5 - 1)).toFixed(1) } };
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rate', figure(fig1, 'Figure 1. Share of the 0.1 C capacity each cathode keeps at higher rates, worked out from the discharge capacities in the paper\'s rate test.'));
  md = inject(md, 'eis', figure(fig2, 'Figure 2. Nyquist plots simulated with the Impedance fitter\'s Randles circuit, using the paper\'s fitted Re and Rct and our assumed double-layer and Warburg values. An illustration, not the measured spectra.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}

// A short spectrum (15 frequencies, 3 significant figures) for readers to paste into the Impedance fitter.
const short = Array.from({ length: 15 }, (_, k) => 10 ** (5 - k * 0.5)).map((f) => { const z = rand.z(2 * Math.PI * f, [11.96, 338.4, 2e-5, 0.85, sigma.LRM]); return { f: +f.toPrecision(3), re: +z[0].toPrecision(4), im: +z[1].toPrecision(4) }; });
const sf = fitEIS(rand, short);
console.log(short.map((p) => `${p.f}\t${p.re}\t${p.im}`).join('\n'));
console.log('short fit', sf.p.map((v) => +v.toPrecision(4)), 'i0', exchangeCurrent(sf.p[1] * AREA, 1, T).toExponential(3), 'RctA', (sf.p[1] * AREA).toFixed(1));
