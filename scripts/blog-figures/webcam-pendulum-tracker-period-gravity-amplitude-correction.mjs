// Figures for src/blog/discoveries/webcam-pendulum-tracker-period-gravity-amplitude-correction.md, made with the maths of
// the Pendulum lab analyser (src/lib/sci/phpendulum.ts: exact large-amplitude period and the T² against L fit for g).
// Run: node scripts/blog-figures/webcam-pendulum-tracker-period-gravity-amplitude-correction.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { largeFactor, smallPeriod, fitG } from '../../src/lib/sci/phpendulum.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/webcam-pendulum-tracker-period-gravity-amplitude-correction.md', import.meta.url);

// Inputs from the paper: de Souza, Maia and de Andrade (2025), arXiv:2506.07301 (CC BY 4.0), Phys. Educ. 60, 055024.
// Period run: L = 45.8 ± 0.1 cm, measured T = 1.3630 ± 0.0004 s, local g = 9.7821671 m/s² (latitude 10.88° S).
// Damped run: L = 31.2 cm, starting amplitude 6.3°, damping rate γ = 0.005 per second, 150 s of data.
const L = 0.458, uL = 0.001, T = 1.3630, uT = 0.0004, G = 9.7821671;
const T0 = smallPeriod(L, G);
const solveAmp = (target) => { let lo = 0, hi = 60; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; largeFactor(m) < target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const amp = solveAmp(T / T0), ampLo = solveAmp((T - uT) / T0), ampHi = solveAmp((T + uT) / T0);
const ampLshort = solveAmp(T / smallPeriod(L - uL, G)), ampLlong = solveAmp(T / smallPeriod(L + uL, G));
const gAt = (a) => fitG([L], [T], [a]).g; // one point: g = 4π² L / (T / factor)²
const gTable = [0, 5, 10, 15, 20].map((a) => ({ a, T: +(T0 * largeFactor(a)).toFixed(4), g: +gAt(a).toFixed(3) }));
const Lneed = G * (T / (2 * Math.PI)) ** 2;
// Damped run: period change from 6.3° down to the amplitude after 150 s.
const Ld = 0.312, Td = smallPeriod(Ld, G), a150 = 6.3 * Math.exp(-0.005 * 150);
const damp = { T0: +Td.toFixed(4), msAt63: +((largeFactor(6.3) - 1) * Td * 1000).toFixed(2), a150: +a150.toFixed(2), msAt150: +((largeFactor(a150) - 1) * Td * 1000).toFixed(2) };

// Simulated lengths (OUR assumption): 0.20 to 0.60 m, all swung at the same 11.5° amplitude, with 0.4 ms timing scatter.
let seed = 7301; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const LS = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6];
const AMP = +amp.toFixed(1);
const TS = LS.map((l) => +(smallPeriod(l, G) * largeFactor(AMP) + 0.0004 * gauss()).toFixed(4));
const fitRaw = fitG(LS, TS), fitCor = fitG(LS, TS, LS.map(() => AMP));

const AA = Array.from({ length: 81 }, (_, i) => i * 0.25);
const fig1 = chart({
  title: 'Period of the 45.8 cm pendulum against swing size', xLabel: 'Amplitude (degrees from vertical)', yLabel: 'Period (s)',
  series: [{ name: 'Exact period, g = 9.7822 m/s²', kind: 'line', x: AA, y: AA.map((a) => +(T0 * largeFactor(a)).toFixed(5)) }],
  xDomain: [0, 20], yDomain: [1.358, 1.372],
  hlines: [{ y: T, text: 'measured 1.3630 s' }, { y: +T0.toFixed(4), text: 'small-angle 1.3595 s' }],
  vlines: [{ x: +amp.toFixed(1), text: `${amp.toFixed(1)}°` }],
  desc: `The exact period of a 45.8 cm pendulum rises from ${T0.toFixed(4)} s for tiny swings to ${(T0 * largeFactor(20)).toFixed(4)} s at 20 degrees. It equals the measured 1.3630 s at an amplitude of ${amp.toFixed(1)} degrees.`, height: 260,
});
const LL = [0, 0.65];
const fig2 = chart({
  title: 'Same swings, two answers for g (simulated)', xLabel: 'Length L (m)', yLabel: 'Period squared T² (s²)',
  series: [
    { name: 'Simulated periods at 11.5°', kind: 'dots', x: LS, y: TS.map((t) => +(t * t).toFixed(4)), size: 3 },
    { name: `No correction: g = ${fitRaw.g.toFixed(3)}`, kind: 'line', x: LL, y: LL.map((l) => +(fitRaw.slope * l).toFixed(4)), dash: true },
    { name: `Corrected: g = ${fitCor.g.toFixed(3)}`, kind: 'line', x: LL, y: LL.map((l) => +(fitCor.slope * l).toFixed(4)) },
  ],
  xDomain: [0, 0.65], yDomain: [0, 2.7],
  desc: `Simulated periods for nine lengths, all swung at 11.5 degrees. Fitting T squared against L without the amplitude correction gives g = ${fitRaw.g.toFixed(3)}; with it, g = ${fitCor.g.toFixed(3)} m/s², against the true 9.782.`, height: 260,
});

console.log(JSON.stringify({ T0: +T0.toFixed(4), ratioPct: +((T / T0 - 1) * 100).toFixed(3), amp: +amp.toFixed(2), ampRange: [+ampLo.toFixed(1), +ampHi.toFixed(1)], ampIfL: [+ampLshort.toFixed(1), +ampLlong.toFixed(1)], Lneed: +(Lneed * 1000).toFixed(1), gTable, damp, sim: { LS, TS, raw: { g: +fitRaw.g.toFixed(4), ug: +fitRaw.ug.toFixed(4) }, cor: { g: +fitCor.g.toFixed(4), ug: +fitCor.ug.toFixed(4), r2: +fitCor.r2.toFixed(6) } } }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'amp', figure(fig1, 'Figure 1. The exact period of a 45.8 cm pendulum against amplitude, from the Pendulum lab analyser\'s maths with the paper\'s local g. The measured period (upper dashed line) matches a swing of about 11.5°; the small-angle formula gives the lower line.'));
  md = inject(md, 'fit', figure(fig2, 'Figure 2. Simulated periods (our assumption: nine lengths, all at 11.5°, 0.4 ms scatter), fitted with the analyser\'s T² against L fit with and without its amplitude correction. Not the paper\'s data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
