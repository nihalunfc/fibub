// Figures for src/blog/discoveries/copper-acteoside-corrosion-inhibitor-nitric-acid-eis-tafel.md, made with the maths
// of the Impedance fitter (src/lib/sci/eis.ts) and the Tafel corrosion rate tool (src/lib/sci/corrosion.ts).
// Run: node scripts/blog-figures/copper-acteoside-corrosion-inhibitor-nitric-acid-eis-tafel.mjs
import fs from 'node:fs';
import { MODELS, fitEIS, cEff } from '../../src/lib/sci/eis.ts';
import { bv, signed, tafel, fitBV, sternGeary, rateMmY, METALS } from '../../src/lib/sci/corrosion.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/copper-acteoside-corrosion-inhibitor-nitric-acid-eis-tafel.md', import.meta.url);

// Inputs. "Paper": Al-Qudah et al. (2025), RSC Advances, doi:10.1039/d5ra01657f (CC BY 3.0).
// Paper, Table 5 (polarisation): ppm, Ecorr (mV, as printed), icorr (mA/cm²), βa, βc (mV/decade), IE %, Rp (Ω cm²).
const POL = [[0, -4.23, 0.697, 188.89, 64.00, null, 29.80], [100, 1.75, 0.266, 60.92, 73.37, 61.8, 54.33], [200, 12.70, 0.210, 71.26, 221.26, 69.8, 111.43],
  [300, 19.60, 0.126, 72.48, 824.33, 82.0, 230.46], [400, 29.10, 0.103, 75.34, 1033.16, 85.2, 296.20], [500, 38.60, 0.091, 80.11, 1095.29, 87.0, 356.88]];
// Paper, Table 6 (impedance, 303 K): ppm, Rs, Rct (Ω cm²), Cdl (µF/cm²), CPE exponent, IE %.
const EIS = [[0, 1.75, 240.00, 286.81, 0.77, null], [100, 1.42, 1719.40, 235.04, 0.77, 86.04], [200, 1.42, 1973.70, 221.57, 0.78, 87.84],
  [300, 1.31, 2286.50, 214.40, 0.75, 89.50], [400, 1.14, 2612.20, 203.87, 0.78, 90.81], [500, 1.06, 3789.50, 196.46, 0.75, 93.67]];
const Cu = METALS.find((m) => m.id === 'Cu'); // copper, EW 31.77 g, 8.96 g/cm³ (literature values in the tool)

// 1. Stern–Geary check of the paper's Rp column: Rp = B / icorr with B = βaβc / (2.303 (βa + βc)).
const sg = POL.map(([, , i, ba, bc]) => { const B = sternGeary(ba / 1000, bc / 1000); return { B: B * 1000, Rp: B / (i * 1e-3) }; });
const rate = POL.map((r) => rateMmY(r[2] * 1000, Cu.EW, Cu.rho));
const ieTafel = POL.map((r) => 100 * (1 - r[2] / POL[0][2]));
const ieEis = EIS.map((r) => 100 * (1 - EIS[0][2] / r[2]));

// 2. Simulated impedance spectra for the blank and 500 ppm, using the paper's Rs, Rct and CPE exponent. Our
// assumption: the paper's Cdl is the Hsu–Mansfeld effective capacitance, so Q = C^α · Rct^(α−1). Area 1 cm².
// 0.5% random noise (our choice). The Impedance fitter's R(RQ) fit is not told the answer.
const RQ = MODELS.find((m) => m.id === 'RQ');
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
const sim = ([, Rs, Rct, C, a]) => { const Q = (C * 1e-6) ** a * Rct ** (a - 1); const pts = [];
  for (let k = 0; k <= 40; k++) { const f = 10 ** (5 - (k * 7) / 40), z = RQ.z(2 * Math.PI * f, [Rs, Rct, Q, a]); pts.push({ f, re: z[0] * (1 + 0.01 * rnd()), im: z[1] * (1 + 0.01 * rnd()) }); }
  return { Q, pts }; };
const runs = [EIS[0], EIS[5]].map((row) => { const s = sim(row), fit = fitEIS(RQ, s.pts); return { row, ...s, fit, C: cEff(fit.p[2], fit.p[3], fit.p[1]) * 1e6 }; });
const fig1 = chart({
  title: 'Simulated Nyquist plots from the paper\'s circuit values', xLabel: 'Z′ (Ω cm²)', yLabel: '−Z″ (Ω cm²)',
  series: [
    { name: 'Blank (simulated)', kind: 'dots', size: 2.6, x: runs[0].pts.map((p) => +p.re.toFixed(1)), y: runs[0].pts.map((p) => +(-p.im).toFixed(1)) },
    { name: '500 ppm acteoside (simulated)', kind: 'dots', size: 2.6, x: runs[1].pts.map((p) => +p.re.toFixed(1)), y: runs[1].pts.map((p) => +(-p.im).toFixed(1)) },
  ],
  xDomain: [0, 4000], yDomain: [0, 1500],
  desc: 'The blank gives a small flattened arc about 240 ohm square centimetres wide; with 500 ppm acteoside the arc is about 3,800 wide, sixteen times larger.', height: 280,
});

// 3. Simulated polarisation curves (Wagner–Traud) from the paper's Ecorr, icorr, βa and βc, scanned ±250 mV in 2 mV
// steps (our choice), then the Tafel tool's own extraction.
const scan = (r) => { const E = [], i = []; for (let k = -125; k <= 125; k++) { const e = (r[1] + 2 * k) / 1000; E.push(e); i.push(bv(e, r[1] / 1000, r[2] * 1e-3, r[3] / 1000, r[4] / 1000)); } return signed(E, i); };
const tf = [POL[0], POL[5]].map((r) => { const c = scan(r), t = tafel(c, 0.08, 0.2), nl = fitBV(c, t.E0, t); return { c, t, nl }; });
const thin = (c) => c.filter((_, j) => j % 3 === 0 && Math.abs(c[j].i) > 1e-7);
const fig2 = chart({
  title: 'Simulated polarisation curves', xLabel: 'E (mV, as printed in the paper)', yLabel: 'Current density (A/cm²)',
  series: tf.map((r, k) => ({ name: k ? '500 ppm (simulated)' : 'Blank (simulated)', kind: 'line', x: thin(r.c).map((p) => +(p.E * 1000).toFixed(1)), y: thin(r.c).map((p) => +Math.log10(Math.abs(p.i)).toFixed(3)) })),
  yFmt: (v) => `1e${v}`, yTicks: [-7, -6, -5, -4, -3, -2], yDomain: [-7, -1.5], xDomain: [-260, 300],
  desc: 'Both curves dip to a sharp minimum at the corrosion potential; the inhibited curve sits about a factor of eight lower and has a much steeper cathodic branch.', height: 280,
});

const facts = {
  sg: sg.map((s, k) => ({ ppm: POL[k][0], B: +s.B.toFixed(2), Rp: +s.Rp.toFixed(2), paper: POL[k][6] })),
  rate: rate.map((v) => +v.toFixed(3)), ieTafel: ieTafel.map((v) => +v.toFixed(1)), ieEis: ieEis.map((v) => +v.toFixed(2)),
  eis: runs.map((r) => ({ ppm: r.row[0], Q: r.Q.toExponential(3), fit: r.fit.p.map((v) => +v.toPrecision(4)), rel: r.fit.rel.map((v) => +(100 * v).toFixed(2)), C_uF: +r.C.toFixed(1), rms: r.fit.rmsPct.toFixed(2) })),
  tafel: tf.map((r) => ({ lines: { Ecorr: +(r.t.Ecorr * 1000).toFixed(2), icorr_uA: +(r.t.icorr * 1e6).toFixed(1), ba: +(r.t.ba * 1000).toFixed(1), bc: +(r.t.bc * 1000).toFixed(1) }, wt: r.nl && { icorr_uA: +(r.nl.icorr * 1e6).toFixed(1), ba: +(r.nl.ba * 1000).toFixed(1), bc: +(r.nl.bc * 1000).toFixed(1) } })),
};
console.log(JSON.stringify(facts));
// A 25-line scan for readers to paste into the Tafel tool (blank, 20 mV steps, mV and mA/cm²).
console.log(Array.from({ length: 25 }, (_, k) => { const e = -4.23 - 240 + 20 * k; const v = bv(e / 1000, -0.00423, 0.697, 0.18889, 0.064); return `${e.toFixed(2)}\t${Math.abs(v) < 1e-9 ? 0 : v.toPrecision(4)}`; }).join('\n'));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'nyq', figure(fig1, 'Figure 1. Simulated impedance spectra (Nyquist plots), 10 mHz to 100 kHz, built from the paper\'s Rs, Rct, double-layer capacitance and CPE exponent for the blank and 500 ppm, with 0.5% noise. Simulated, not the measured data.'));
  md = inject(md, 'pol', figure(fig2, 'Figure 2. Simulated polarisation curves from the paper\'s Tafel parameters for the blank and 500 ppm, with the Tafel tool\'s Wagner–Traud maths. Simulated, not the measured scans.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
