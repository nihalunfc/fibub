// Figures for src/blog/discoveries/salmonella-alheira-sausage-batter-bigelow-z-value-recomputed.md, made with the
// maths of the F-value calculator (src/lib/sci/thermproc.ts: zValue, fNeeded, lethalRate, fProfile).
// Run: node scripts/blog-figures/salmonella-alheira-sausage-batter-bigelow-z-value-recomputed.mjs
import fs from 'node:fs';
import { zValue, fNeeded, fProfile } from '../../src/lib/sci/thermproc.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/salmonella-alheira-sausage-batter-bigelow-z-value-recomputed.md', import.meta.url);

// From the paper's text: Coelho-Fernandes, Cadavez and Gonzales-Barron (2022), Biology and Life Sciences Forum 18(1): 44,
// doi:10.3390/foods2022-13001 (CC BY 4.0). Four D-values of Salmonella Typhimurium in alheira sausage batter.
const PTS = [{ T: 54, D: 26.52 }, { T: 57, D: 7.936 }, { T: 60, D: 3.663 }, { T: 63, D: 0.348 }];
const z = zValue(PTS);

// Paper-stated values we compare against (all from its running text).
const PAPER = { z: 5.016, logDref: 2.302, Dref: 200, r2: 0.947, D70: 0.021, sevenLogSeconds: 9.0 };

const D70 = z.dAt(70), F7 = fNeeded(D70, 7, 0);
const report = {
  z: +z.z.toFixed(4), r2: +z.fit.r2.toFixed(4), intercept: +z.fit.a.toFixed(4), slope: +z.fit.b.toFixed(6),
  logD50: +Math.log10(z.dAt(50)).toFixed(4), D50: +z.dAt(50).toFixed(2),
  D63: +z.dAt(63).toFixed(4), D70: +D70.toFixed(5), F7min: +F7.toFixed(5), F7sec: +(F7 * 60).toFixed(2),
  edr: PTS.map((p) => +(1 / p.D).toFixed(4)),
  F7at63: +fNeeded(z.dAt(63), 7, 0).toFixed(3),
};

// An assumed gentle cook that stops short: the sausage centre creeps up to about 58 degrees C over 30 min and then
// cools. OUR ASSUMPTION, not the paper's: a plausible first-order heating curve, nothing measured.
const prof = [];
for (let t = 0; t <= 60; t += 2) {
  const T = t <= 30 ? 59 - 39 * Math.exp(-t / 8) : (59 - 39 * Math.exp(-30 / 8)) - 1.2 * (t - 30);
  prof.push({ t, T: +T.toFixed(1) });
}
const P = fProfile(prof, 70, z.z);
const logs = P.F.map((f) => f / D70);
const crossAt = (() => { for (let i = 1; i < logs.length; i++) if (logs[i] >= 7) return P.t[i - 1] + ((7 - logs[i - 1]) / (logs[i] - logs[i - 1])) * (P.t[i] - P.t[i - 1]); return null; })();
report.profile = { peak: P.peak, peakAt: P.peakAt, F: +P.total.toFixed(3), logs: +(P.total / D70).toFixed(2), crossAt: crossAt === null ? null : +crossAt.toFixed(1) };

const TT = Array.from({ length: 111 }, (_, i) => 50 + i * 0.2);
const fig1 = chart({
  title: 'Alheira batter: D-value against temperature', xLabel: 'Temperature (°C)', yLabel: 'D-value (min)',
  series: [
    { name: 'Bigelow line (fibub fit)', kind: 'line', x: TT, y: TT.map((T) => Math.log10(z.dAt(T))) },
    { name: "The paper's four D-values", kind: 'dots', x: PTS.map((p) => p.T), y: PTS.map((p) => Math.log10(p.D)), size: 3.4 },
  ],
  xDomain: [50, 72], yDomain: [-2.1, 2.5], yTicks: [-2, -1, 0, 1, 2],
  yFmt: (t) => (t < 0 ? String(+(10 ** t).toPrecision(2)) : String(10 ** t)),
  vlines: [{ x: 50, text: '200 min' }, { x: 70, text: '0.021 min', left: true }],
  desc: `The four published D-values of Salmonella Typhimurium in alheira batter on a log scale against temperature, and the straight Bigelow line fitted by fibub (z = ${z.z.toFixed(3)} degrees C). The line is extended to 50 and 70 degrees C.`,
  height: 270,
});

const fig2 = chart({
  title: 'Time for a 7-log kill at each centre temperature', xLabel: 'Temperature (°C)', yLabel: 'Time needed (min)',
  series: [{ name: '7 × D', kind: 'line', x: TT, y: TT.map((T) => Math.log10(7 * z.dAt(T))), noLegend: true }],
  xDomain: [54, 72], yDomain: [-1.3, 2.6], yTicks: [-1, 0, 1, 2],
  yFmt: (t) => (t < 0 ? String(+(10 ** t).toPrecision(2)) : String(10 ** t)),
  vlines: [{ x: 63, text: '3.6 min', dy: 0 }, { x: 70, text: '0.14 min', left: true, dy: 14 }],
  desc: 'Minutes needed for a seven-log reduction at each centre temperature, worked out from the fitted Bigelow line. It falls from about 224 minutes at 54 degrees C to 0.14 minutes at 70 degrees C.',
  height: 250,
});

const fig3 = chart({
  title: 'An assumed cook: log reductions as the centre heats', xLabel: 'Time (min)', yLabel: 'Log reductions so far',
  series: [{ name: 'Log reductions', kind: 'line', x: P.t, y: logs.map((v) => Math.min(v, 12)), noLegend: true }],
  xDomain: [0, 60], yDomain: [0, 9], hlines: [{ y: 7, text: '7 logs' }],
  vlines: crossAt === null ? [] : [{ x: crossAt, text: `${crossAt.toFixed(0)} min`, left: true }],
  desc: 'On an assumed heating curve for a sausage centre, the log reductions built up by the general method stop short of seven logs.',
  height: 250,
});

console.log(JSON.stringify(report, null, 1));
console.log('paper says', JSON.stringify(PAPER));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'bigelow', figure(fig1, `Figure 1. The paper's four D-values (points) and the Bigelow line the F-value calculator's maths fits to them: z = ${z.z.toFixed(3)} °C, R² = ${z.fit.r2.toFixed(4)}. The dashed lines mark the D-value the fit gives at 50 °C and at 70 °C, the two temperatures the paper quotes.`));
  md = inject(md, 'sevenlog', figure(fig2, 'Figure 2. Minutes needed for a seven-log reduction at each centre temperature, from the same fitted line. A z-value of 5 °C makes the curve very steep: four degrees change the time about tenfold.'));
  md = inject(md, 'cook', figure(fig3, 'Figure 3. Log reductions building up over an assumed heating curve for a sausage centre (our curve, not the paper\'s), by the general method with the paper\'s z-value and a reference of 70 °C.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
