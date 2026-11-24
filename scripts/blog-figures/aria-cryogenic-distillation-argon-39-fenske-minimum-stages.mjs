// Figures and numbers for src/blog/discoveries/aria-cryogenic-distillation-argon-39-fenske-minimum-stages.md,
// made with the maths of the McCabe-Thiele calculator (src/lib/sci/mccabe.ts: alphaEq, fenske, stepStages).
// Run: node scripts/blog-figures/aria-cryogenic-distillation-argon-39-fenske-minimum-stages.mjs
import fs from 'node:fs';
import { alphaEq, fenske, stepStages } from '../../src/lib/sci/mccabe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/aria-cryogenic-distillation-argon-39-fenske-minimum-stages.md', import.meta.url);

// Inputs stated in the paper's text (facts): ln alpha(39Ar/40Ar) = (1.333 +- 0.036)e-3 at 89.5 K,
// 2870 theoretical stages, HETP 10 cm, and a Fenske minimum of 1727 stages for a separation factor of 10.
const LNA = 1.333e-3, SIG = 0.036e-3, NSTAGES = 2870, HETP = 0.10;
const alpha = (l) => Math.exp(l);
// Our assumption: any two compositions whose odds ratio is S. Light-component fractions xD = 1/2, xB = 1/(1+S).
const ends = (S) => [0.5 * 1, 1 / (1 + S)];
const nmin = (S, l = LNA) => { const [xD, xB] = ends(S); return fenske(xD, xB, alpha(l)); };

const S = Array.from({ length: 60 }, (_, i) => 1 + i * 1.5);
const fig1 = chart({
  title: 'Fenske minimum stages against separation factor',
  xLabel: 'Separation factor S (odds ratio top : bottom)', yLabel: 'Minimum theoretical stages',
  desc: 'Minimum stages at total reflux for argon-39 against argon-40 as a function of the separation factor, with the one-sigma band from the stated relative volatility. The paper stated point of 1727 stages at S = 10 sits on the line, and the 2870-stage column reaches about S = 46.',
  series: [
    { name: '+1σ in ln α (fewer)', x: S, y: S.map((s) => nmin(s, LNA + SIG)), kind: 'line', colour: 'var(--muted)', dash: '3 3' },
    { name: 'ln α = 1.333e-3', x: S, y: S.map((s) => nmin(s)), kind: 'line', colour: 'var(--c-blog)' },
    { name: '-1σ (more)', x: S, y: S.map((s) => nmin(s, LNA - SIG)), kind: 'line', colour: 'var(--muted)', dash: '3 3' },
    { name: 'paper: 1727 at S = 10', x: [10], y: [nmin(10)], kind: 'dots', size: 5, colour: 'var(--c-tools)' },
  ],
  hlines: [{ y: NSTAGES, text: '2870 stages built' }], xDomain: [0, 90], yDomain: [0, 3500], yFmt: (v) => String(v),
});

const hs = Array.from({ length: 71 }, (_, i) => i * 5);
const sAt = (h, l = LNA) => Math.exp((l * h) / HETP);
const fig2 = chart({
  title: 'Separation reached against packed height',
  xLabel: 'Packed height (m, at HETP = 0.10 m)', yLabel: 'Separation factor S at total reflux',
  desc: 'Separation factor reached at total reflux as a function of packed height, from S = alpha to the power N, for the stated relative volatility and its one-sigma band, with the 287 m of packing marked.',
  series: [
    { name: '-1σ', x: hs, y: hs.map((h) => sAt(h, LNA - SIG)), kind: 'line', colour: 'var(--muted)', dash: '3 3' },
    { name: 'ln α = 1.333e-3', x: hs, y: hs.map((h) => sAt(h)), kind: 'line', colour: 'var(--c-blog)' },
    { name: '+1σ', x: hs, y: hs.map((h) => sAt(h, LNA + SIG)), kind: 'line', colour: 'var(--muted)', dash: '3 3' },
  ],
  vlines: [{ x: NSTAGES * HETP, text: '287 m', left: true }], xDomain: [0, 350], yDomain: [1, 100], yReverse: false, yFmt: (v) => String(v),
});

// Numbers quoted in the article.
const [xD10, xB10] = ends(10);
const step = stepStages(alphaEq(alpha(LNA)), { xF: 0.2, xD: xD10, xB: xB10, q: 1, R: Infinity }, 6000);
const a10 = alpha(10 * LNA); // ten times the log volatility: what the page can step
const [xDs, xBs] = ends(10);
let stepTen; try { stepTen = stepStages(alphaEq(a10), { xF: 0.2, xD: xDs, xB: xBs, q: 1, R: Infinity }); } catch (e) { stepTen = e.message; }
let capErr; try { stepStages(alphaEq(alpha(LNA)), { xF: 0.2, xD: xD10, xB: xB10, q: 1, R: Infinity }, 300); } catch (e) { capErr = e.message; }
console.log(JSON.stringify({
  alpha: alpha(LNA), alphaMinus1: alpha(LNA) - 1,
  Nmin10: nmin(10), Nmin10_plus: nmin(10, LNA + SIG), Nmin10_minus: nmin(10, LNA - SIG),
  steppedN: step.N, steppedFrac: step.frac,
  S2870: sAt(287), S_lo: sAt(287, LNA - SIG), S_hi: sAt(287, LNA + SIG),
  heightForS10: HETP * nmin(10), Nmin_for_S100: nmin(100), height_S100: HETP * nmin(100),
  tenXalpha: a10, tenX_fenske: fenske(xDs, xBs, a10), tenX_stepped: stepTen.N ?? stepTen, tenX_frac: stepTen.frac,
  ratio_stage_over_min: NSTAGES / nmin(10), cap300: capErr,
  stagesForS46: nmin(45.865),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'nmin', figure(fig1, 'Figure 1. Fenske minimum number of stages for argon-39 against argon-40, from the stated ln α (solid) and its one-sigma band (dashed). The dot is the paper\'s own 1727-stage example; the dashed horizontal line is the 2870 stages of the full column.'));
  md = inject(md, 'height', figure(fig2, 'Figure 2. The separation a column of this packing reaches at total reflux, from S = α to the power N with N = height ÷ 0.10 m. The full 287 m of packing gives a factor of about 46.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
