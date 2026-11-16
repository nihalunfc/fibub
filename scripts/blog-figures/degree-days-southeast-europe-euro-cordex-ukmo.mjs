// Figures for src/blog/discoveries/degree-days-southeast-europe-euro-cordex-ukmo.md, made with the maths of the
// Degree days calculator (src/lib/sci/degreedays.ts), including its UK Met Office (ukmo) method.
// Run: node scripts/blog-figures/degree-days-southeast-europe-euro-cordex-ukmo.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { heating, cooling, degreeDays, monthly } from '../../src/lib/sci/degreedays.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/degree-days-southeast-europe-euro-cordex-ukmo.md', import.meta.url);
// Paper: Chervenkov and Slavov (2025), Atmosphere 16, 1153, doi:10.3390/atmos16101153 (CC BY): bases 15.5 °C (heating)
// and 22 °C (cooling), UKMO method; January heating 400-500 °D on the plains; July-August cooling about 75-90 °D in hot spots.
const HB = 15.5, CB = 22;

// Figure 1: one day's degree days against its mean temperature, for a day with a 12 °C range (min = mean - 6, max = mean + 6).
const means = Array.from({ length: 81 }, (_, i) => 10 + i * 0.25);
const D = (m) => ({ tmin: m - 6, tmax: m + 6, mean: m });
const fig1 = chart({
  title: 'Cooling degree days for one day (base 22 °C, 12 °C daily range)', xLabel: 'Daily mean temperature (°C)', yLabel: 'Cooling degree days',
  series: ['mean', 'sine', 'ukmo'].map((m) => ({ name: { mean: 'Mean method', sine: 'Single sine', ukmo: 'UK Met Office' }[m], kind: 'line', dash: m === 'mean' ? '4 3' : undefined, x: means, y: means.map((t) => +cooling(D(t), CB, m).toFixed(3)) })),
  xDomain: [10, 30], yDomain: [0, 8], vlines: [{ x: CB, text: 'base 22 °C' }],
  desc: 'On days whose mean is below 22 °C but whose afternoon is above it, the mean method counts no cooling, while the UK Met Office and sine methods count some; the two curve methods stay within about 0.4 degree days of each other.', height: 270,
});

// Figure 2: a made-up year for a lowland site in Southeast Europe (our own monthly normals, not the paper's data),
// with a small day-to-day wobble from a fixed pseudo-random sequence, then the same year 2.5 °C warmer.
const NORM = [-1, 1, 6, 12, 17.5, 21.5, 24, 23.5, 18, 12, 6, 1]; // monthly mean °C (our assumption)
const RANGE = [8, 9, 11, 12, 13, 13, 14, 14, 13, 11, 9, 8];        // daily max - min °C (our assumption)
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function year(dT) {
  const out = []; let doy = 0; seed = 7;
  DAYS.forEach((n, mi) => { for (let d = 1; d <= n; d++, doy++) {
    const f = (doy + 0.5) / 365 * 12 - 0.5, i0 = Math.floor(f), w = f - i0, a = (i0 + 12) % 12, b = (i0 + 13) % 12;
    const mean = NORM[a] * (1 - w) + NORM[b] * w + 3 * (rnd() + rnd() + rnd()) + dT, rg = RANGE[a] * (1 - w) + RANGE[b] * w;
    out.push({ date: `2025-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, tmin: mean - rg / 2, tmax: mean + rg / 2, mean });
  } });
  return out;
}
const run = (dT, method) => monthly(degreeDays(year(dT), { heatBase: HB, coolBase: CB, growBase: 10, growUpper: null, method }));
const now = run(0, 'ukmo'), warm = run(2.5, 'ukmo'), nowMean = run(0, 'mean'), nowSine = run(0, 'sine');
const mx = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], MN = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const fig2 = chart({
  title: 'Monthly degree days, made-up lowland year and 2.5 °C warmer (UKMO)', xLabel: 'Month', yLabel: 'Degree days (°C·day)',
  series: [
    { name: 'Heating now', kind: 'line', x: mx, y: now.map((m) => +m.hdd.toFixed(1)) },
    { name: 'Heating +2.5 °C', kind: 'line', dash: '4 3', x: mx, y: warm.map((m) => +m.hdd.toFixed(1)) },
    { name: 'Cooling now', kind: 'line', x: mx, y: now.map((m) => +m.cdd.toFixed(1)) },
    { name: 'Cooling +2.5 °C', kind: 'line', dash: '4 3', x: mx, y: warm.map((m) => +m.cdd.toFixed(1)) },
  ],
  xDomain: [1, 12], yDomain: [0, 550], xTicks: mx, xFmt: (t) => MN[t - 1],
  desc: 'In the made-up year January needs about 500 heating degree days at base 15.5 °C and July gives about 90 cooling degree days at base 22 °C. Warming every day by 2.5 °C cuts winter heating by about 75 per month and raises midsummer cooling by about 55 per month.', height: 290,
});

const sum = (a, k) => +a.reduce((s, m) => s + m[k], 0).toFixed(1);
const facts = {
  day1224: { H: heating(D(18), HB, 'ukmo'), Hs: +heating(D(18), HB, 'sine').toFixed(3) },
  jan: { ukmo: +now[0].hdd.toFixed(1), sine: +nowSine[0].hdd.toFixed(1), mean: +nowMean[0].hdd.toFixed(1), warm: +warm[0].hdd.toFixed(1) },
  jul: { ukmo: +now[6].cdd.toFixed(1), sine: +nowSine[6].cdd.toFixed(1), mean: +nowMean[6].cdd.toFixed(1), warm: +warm[6].cdd.toFixed(1) },
  aug: { ukmo: +now[7].cdd.toFixed(1), warm: +warm[7].cdd.toFixed(1) },
  year: { H: sum(now, 'hdd'), Hw: sum(warm, 'hdd'), C: sum(now, 'cdd'), Cw: sum(warm, 'cdd'), Cmean: sum(nowMean, 'cdd'), Csine: sum(nowSine, 'cdd') },
  janMean: +(year(0).slice(0, 31).reduce((s, d) => s + d.mean, 0) / 31).toFixed(2),
  julyDays: year(0).slice(181, 186).map((d) => [d.tmin.toFixed(1), d.tmax.toFixed(1)]),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'day', figure(fig1, 'Figure 1. Cooling degree days for a single day with a 12 °C range, by three of the Degree days calculator\'s methods. Worked with the tool\'s own functions; no data from the paper.'));
  md = inject(md, 'year', figure(fig2, 'Figure 2. A made-up year for a lowland site in Southeast Europe (our own monthly normals), run through the UK Met Office method at the paper\'s bases, then every day warmed by 2.5 °C. A simulation, not EURO-CORDEX output.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
