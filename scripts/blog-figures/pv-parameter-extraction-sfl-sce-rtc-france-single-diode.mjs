// Figures for src/blog/discoveries/pv-parameter-extraction-sfl-sce-rtc-france-single-diode.md, made with the maths of
// the Solar cell I-V analyser (src/lib/sci/solarcell.ts: explicit Lambert W single-diode model and the
// Levenberg-Marquardt diode fit).
// Run: node scripts/blog-figures/pv-parameter-extraction-sfl-sce-rtc-france-single-diode.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { currentAt, modelMpp, thermalVoltage, normalise, metrics, fitDiode } from '../../src/lib/sci/solarcell.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pv-parameter-extraction-sfl-sce-rtc-france-single-diode.md', import.meta.url);

// Inputs. "Paper": Faris et al. (2026), Energies 19, 1240, doi:10.3390/en19051240 (CC BY 4.0), RTC France cell results.
const T = 33;                                                          // °C, paper (the benchmark cell's temperature)
const SDM = { Iph: 0.7607755, I0: 3.23021e-7, n: 1.481181, Rs: 0.036377, Rsh: 53.71853 }; // paper, single-diode model
const RMSE_SDM = 9.860219e-4, RMSE_DDM = 9.824848e-4;                  // A, paper
const DDM = { Iph: 0.7607811, I01: 7.49358e-7, n1: 2, I02: 2.25974e-7, n2: 1.451014, Rs: 0.03674, Rsh: 55.48545 }; // paper, double-diode model
const Vt = thermalVoltage(T), a = SDM.n * Vt;

// Double-diode current, solved by Newton's method (our few lines; the tool itself fits the single-diode model only).
function ddmI(V) {
  let I = DDM.Iph - V / DDM.Rsh;
  for (let k = 0; k < 100; k++) {
    const x = V + I * DDM.Rs, e1 = Math.exp(x / (DDM.n1 * Vt)), e2 = Math.exp(x / (DDM.n2 * Vt));
    const f = DDM.Iph - DDM.I01 * (e1 - 1) - DDM.I02 * (e2 - 1) - x / DDM.Rsh - I;
    const df = -DDM.I01 * e1 * DDM.Rs / (DDM.n1 * Vt) - DDM.I02 * e2 * DDM.Rs / (DDM.n2 * Vt) - DDM.Rs / DDM.Rsh - 1;
    const d = f / df; I -= d; if (Math.abs(d) < 1e-15) break;
  }
  return I;
}

// 1. The single-diode curve and its figures of merit.
const mpp = modelMpp(SDM, a);
const vs = Array.from({ length: 121 }, (_, i) => -0.2 + (0.8 * i) / 120).filter((v) => v <= mpp.Voc + 0.005);
const fig1 = chart({
  title: 'RTC France cell from the paper\'s single-diode parameters (33 °C)', xLabel: 'Voltage (V)', yLabel: 'Current (A) and power (W)',
  series: [
    { name: 'Current', kind: 'line', x: vs.map((v) => +v.toFixed(4)), y: vs.map((v) => +currentAt(v, SDM, a).toFixed(5)) },
    { name: 'Power', kind: 'line', x: vs.map((v) => +v.toFixed(4)), y: vs.map((v) => +(Math.max(0, v) * currentAt(v, SDM, a)).toFixed(5)), dash: true },
  ],
  yDomain: [0, 0.85], vlines: [{ x: +mpp.V.toFixed(4), text: `Pmax ${(mpp.P * 1000).toFixed(1)} mW`, left: true }],
  desc: `The current stays near ${(mpp.Isc * 1000).toFixed(0)} mA up to about 0.4 V and then falls to zero at ${mpp.Voc.toFixed(4)} V; power peaks at ${(mpp.P * 1000).toFixed(1)} mW.`, height: 300,
});

// 2. How far apart are the one-diode and two-diode answers? Their difference against the reported RMSE.
const vd = Array.from({ length: 81 }, (_, i) => -0.2 + (0.78 * i) / 80);
const diff = vd.map((v) => (ddmI(v) - currentAt(v, SDM, a)) * 1000);
const fig2 = chart({
  title: 'Two-diode minus one-diode current', xLabel: 'Voltage (V)', yLabel: 'Difference (mA)',
  series: [{ name: 'Difference', kind: 'line', x: vd.map((v) => +v.toFixed(4)), y: diff.map((d) => +d.toFixed(4)) }],
  yDomain: [-1.5, 1.5], hlines: [{ y: +(RMSE_SDM * 1000).toFixed(3), text: 'paper\'s RMSE, +0.99 mA' }, { y: -+(RMSE_SDM * 1000).toFixed(3), text: '−0.99 mA' }],
  desc: 'The two models\' currents differ by less than the fit\'s own scatter of about 1 mA at every voltage.', height: 270,
});

// 3. Simulated measurement: 26 points from the single-diode curve with 1 mA of noise (our assumption, matching the
// paper's RMSE), fitted blind with the tool's own fitDiode. Simulated data, not the measured RTC France points.
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const Vs = Array.from({ length: 26 }, (_, i) => -0.2 + (0.79 * i) / 25);
const fits = []; let failed = 0;
for (let trial = 0; trial < 50; trial++) {
  const Is = Vs.map((v) => currentAt(v, SDM, a) + 0.001 * gauss());
  const iv = normalise(Vs, Is); try { fits.push(fitDiode(iv, metrics(iv), T, 1)); } catch { failed++; }
}
// A fit is 'off' when it lands in a different minimum (ideality factor more than 0.2 from the paper's); the spread is
// given as the middle 90% of the other fits.
const good = fits.filter((f) => Math.abs(f.d.n - SDM.n) < 0.2), off = fits.length - good.length;
const stat = (k) => { const x = good.map((f) => f.d[k]).sort((p, q) => p - q); const at = (q) => x[Math.round(q * (x.length - 1))]; return { mean: at(0.5), sd: 0, lo: at(0.05), hi: at(0.95) }; };
const spread = Object.fromEntries(['Iph', 'I0', 'n', 'Rs', 'Rsh'].map((k) => [k, stat(k)]));
const rmse = good.map((f) => f.rmse);

// 4. Points for "Check it yourself": exact model points (no noise), V and mA.
const pts = [-0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.52, 0.54, 0.56, 0.57, 0.58, 0.59].map((v) => [v, +(currentAt(v, SDM, a) * 1000).toFixed(3)]);
const ivx = normalise(pts.map((p) => p[0]), pts.map((p) => p[1] / 1000)), fx = fitDiode(ivx, metrics(ivx), T, 1);

const g = (x, d = 4) => +x.toPrecision(d);
console.log(JSON.stringify({ Vt: g(Vt, 6), a: g(a, 6), mpp: { V: g(mpp.V, 5), I: g(mpp.I, 5), P: g(mpp.P, 5), Voc: g(mpp.Voc, 5), Isc: g(mpp.Isc, 6), FF: g(mpp.FF, 4) },
  ddm: { Isc: g(ddmI(0), 6), maxDiff_mA: g(Math.max(...diff.map(Math.abs)), 3) },
  spread: Object.fromEntries(Object.entries(spread).map(([k, s]) => [k, { mean: g(s.mean), sd: g(s.sd, 3), lo: g(s.lo), hi: g(s.hi) }])), failed, off, good: good.length, rmse: { mean: g(rmse.reduce((s, v) => s + v, 0) / rmse.length, 3) },
  pts, exactFit: { Iph: g(fx.d.Iph, 6), I0: g(fx.d.I0, 5), n: g(fx.d.n, 5), Rs: g(fx.d.Rs, 4), Rsh: g(fx.d.Rsh, 5), P: g(fx.model.P * 1000, 5), Voc: g(fx.model.Voc, 5) }, RMSE_DDM }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'iv', figure(fig1, 'Figure 1. Current and power of the RTC France cell at 33 °C, drawn from the paper\'s single-diode parameters with the Solar cell I-V analyser\'s explicit model.'));
  md = inject(md, 'diff', figure(fig2, 'Figure 2. Current from the paper\'s two-diode parameters minus the current from its single-diode parameters (two-diode solved with a short Newton loop of ours), against the size of the paper\'s fitting error.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
