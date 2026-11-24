// Figures for src/blog/discoveries/dp600-dp800-early-plasticity-four-point-bending-proof-stress.md, made with the
// maths of the Stress-strain curve analyser (src/lib/sci/tensile.ts: analyse(), the modulus fit and the offset yield).
// Run: node scripts/blog-figures/dp600-dp800-early-plasticity-four-point-bending-proof-stress.mjs
import fs from 'node:fs';
import { analyse } from '../../src/lib/sci/tensile.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/dp600-dp800-early-plasticity-four-point-bending-proof-stress.md', import.meta.url);

// Inputs from the paper: Diouf, Liegard, Tabourot, Sene, Roux and Balland (2026), Mechanics & Industry 27: 11,
// doi:10.1051/meca/2026014 (CC BY 4.0). Yield strengths Re and the onset of irreversible strain measured in
// 4-point bending (bend) and with the thermal camera (therm), both in MPa; the paper's own modulus fit range (fit).
// OUR assumptions: E = 210 GPa for every sheet, the Ramberg-Osgood form of the transition, and a detection
// threshold of 3 x the paper's strain standard deviation of 7e-8, so 2.1e-7 of plastic strain.
const E = 210000, THR = 3 * 7e-8;
const STEELS = [
  { id: 'DP600', re: 305, bend: [127, 135], therm: [345, 396], t: 2, fit: [20, 150] },
  { id: 'DP800', re: 360, bend: [154, 169], therm: [400, 419], t: 2, fit: [20, 150] },
  { id: 'DC01', re: 158, bend: [64, 68], therm: [187, 200], t: 3, fit: [20, 50] },
];
const mid = (a) => (a[0] + a[1]) / 2;

// The Ramberg-Osgood exponent that puts THR of plastic strain at the measured onset stress and 0.2 % at Re:
// 0.002 (s/Re)^n = THR  =>  n = ln(THR/0.002) / ln(s/Re).
const expo = (s, re) => Math.log(THR / 0.002) / Math.log(s / re);

const rows = STEELS.map((S) => {
  const n = expo(mid(S.bend), S.re), nLo = expo(S.bend[1], S.re), nHi = expo(S.bend[0], S.re);
  const eps = (sig) => sig / E + 0.002 * (sig / S.re) ** n;        // total strain of the simulated curve
  const sigAt = (ep) => S.re * (ep / 0.002) ** (1 / n);            // stress at a given plastic strain
  const top = S.re * 1.25, N = 500;                                // the simulated test stops a quarter above Re
  const stress = Array.from({ length: N + 1 }, (_, i) => (top * i) / N);
  const strain = stress.map(eps);
  // What the tool reports: modulus from the paper's own fit range (as a fraction of the highest stress) and the
  // proof stress at a range of offsets.
  const run = (fit, off) => analyse(strain, stress, { lo: fit[0] / top, hi: fit[1] / top, offset: off, toe: false });
  const base = run(S.fit, 0.002);
  const proof = (off, fit = S.fit) => run(fit, off).yield.s;
  // Fitted modulus against the top of the fit range (the bottom stays 20 MPa).
  const tops = Array.from({ length: 46 }, (_, i) => 40 + i * 5).filter((h) => h < top);
  const eCurve = tops.map((h) => { try { return run([20, h], 0.002).E / 1000; } catch { return NaN; } });
  return { ...S, n, nLo, nHi, eps, sigAt, top, stress, strain, base, proof, tops, eCurve,
    pTrue: [THR, 1e-5, 1e-4, 2e-4, 1e-3, 2e-3].map((ep) => ({ ep, s: sigAt(ep), tool: proof(ep) })) };
});

// Figure 1: proof stress against the offset strain (log axis), with the paper's two measurements marked.
const OFFS = Array.from({ length: 81 }, (_, i) => -7 + (i * 4.3) / 80); // log10 of offset strain, 1e-7 to 2e-3
const fig1 = chart({
  title: 'The yield strength you report depends on the offset', xLabel: 'Offset (plastic) strain', yLabel: 'Proof stress (MPa)',
  series: [
    ...rows.map((r) => ({ name: r.id, kind: 'line', x: OFFS, y: OFFS.map((L) => +r.sigAt(10 ** L).toFixed(2)) })),
    ...rows.map((r) => ({ name: '', noLegend: true, kind: 'dots', size: 4, x: [Math.log10(THR), Math.log10(0.002)], y: [mid(r.bend), r.re] })),
  ],
  xDomain: [-7, -2.6], yDomain: [0, 400], xTicks: [-7, -6, -5, -4, -3], xFmt: (t) => `1e${t}`,
  vlines: [{ x: Math.log10(THR), text: 'bending rig', dy: 0 }, { x: Math.log10(0.002), text: '0.2 %', left: true }],
  desc: `Proof stress against offset strain for DP600, DP800 and DC01, from Ramberg-Osgood curves fitted to the paper's onset stress and yield strength. The dots mark the paper's bending onsets at 2.1e-7 and its yield strengths at 0.2 %.`,
  height: 290,
});

// Figure 2: the fitted modulus against the top of the fit range.
const fig2 = chart({
  title: 'Where a modulus fit goes wrong', xLabel: 'Top of the modulus fit range (MPa)', yLabel: "Fitted Young's modulus (GPa)",
  series: rows.map((r) => ({ name: r.id, kind: 'line', x: r.tops, y: r.eCurve.map((v) => +v.toFixed(2)) })),
  xDomain: [40, 250], yDomain: [60, 220], hlines: [{ y: 210, text: '210 GPa put in' }],
  vlines: [{ x: 50, text: 'DC01 range', dy: 14 }, { x: 150, text: 'DP range' }],
  desc: 'Young\'s modulus fitted by the tool when the fit range runs from 20 MPa up to the stress on the x-axis. DC01 loses its modulus above about 60 MPa; the DP steels hold to 150 MPa.',
  height: 290,
});

const out = rows.map((r) => ({
  id: r.id, n: +r.n.toFixed(2), nRange: [+r.nHi.toFixed(2), +r.nLo.toFixed(2)],
  E: +(r.base.E / 1000).toFixed(2), r2: +r.base.r2.toFixed(6), intercept: +r.base.intercept.toFixed(3),
  Rp02: +r.base.yield.s.toFixed(1), elasticStrainAtOnset: +(mid(r.bend) / E).toExponential(2),
  proofAt: r.pTrue.map((p) => ({ ep: p.ep, true: +p.s.toFixed(1), tool: +p.tool.toFixed(1) })),
  bands: [[20, 50], [20, 80], [20, 150], [40, 120], [60, 200]].map((b) => {
    try { const a = analyse(r.strain, r.stress, { lo: b[0] / r.top, hi: b[1] / r.top, offset: 0.002, toe: false });
      return { band: b, E: +(a.E / 1000).toFixed(1), Rp02: +a.yield.s.toFixed(1), micro: +analyse(r.strain, r.stress, { lo: b[0] / r.top, hi: b[1] / r.top, offset: THR, toe: false }).yield.s.toFixed(1) };
    } catch (e) { return { band: b, error: e.message }; }
  }),
  // Force in the paper's 4-point rig at the onset: s = F a t / (2 I), I = w t^3 / 12, w = 35 mm, a = 250 mm.
  forceAtOnset: +(2 * ((35 * r.t ** 3) / 12) * mid(r.bend) / (250 * r.t)).toFixed(2),
}));
console.log(JSON.stringify(out, null, 1));

// A sample of the DP600 curve for the "Check it yourself" steps (stress MPa, strain mm/mm).
const dp = rows[0];
const SAMPLE = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 290, 300, 305, 310, 320, 330];
console.log('DP600 paste rows:', SAMPLE.map((s) => `${s}, ${dp.eps(s).toFixed(7)}`).join(' | '));
{
  const stress = SAMPLE, strain = SAMPLE.map((s) => +dp.eps(s).toFixed(7));
  const a = analyse(strain, stress, { lo: 20 / 330, hi: 150 / 330, offset: 0.002, toe: false });
  const b = analyse(strain, stress, { lo: 20 / 330, hi: 150 / 330, offset: THR, toe: false });
  console.log('SAMPLE: E', (a.E / 1000).toFixed(1), 'r2', a.r2.toFixed(5), 'Rp0.2', a.yield.s.toFixed(1), 'micro', b.yield.s.toFixed(1), 'ratio', (a.yield.s / a.uts).toFixed(3), 'uts', a.uts);
}

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'offset', figure(fig1, 'Figure 1. Proof stress against the offset strain used to measure it, for Ramberg-Osgood curves that pass through both numbers the paper reports for each sheet: the onset of irreversible strain (left dots, at 2.1 x 10⁻⁷ of plastic strain) and the yield strength (right dots, at 0.2 %). Simulated curves, not the paper’s measurements.'));
  md = inject(md, 'modulus', figure(fig2, 'Figure 2. Young’s modulus that the Stress-strain curve analyser fits when the fit range starts at 20 MPa and ends at the stress on the x-axis. The same 210 GPa went into all three curves.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
