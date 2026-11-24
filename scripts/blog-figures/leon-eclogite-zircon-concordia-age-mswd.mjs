// Figures for src/blog/discoveries/leon-eclogite-zircon-concordia-age-mswd.md, made with the maths of the
// Concordia plot tool (src/lib/sci/concordia.ts: the Wetherill curve, error ellipses, the Ludwig 1998 concordia age
// with its three MSWDs, and the weighted mean 206Pb/238U age).
// Run: node scripts/blog-figures/leon-eclogite-zircon-concordia-age-mswd.mjs
import fs from 'node:fs';
import { cW, cTW, ellipse, ages, concordiaAge, weightedMean68, L8, L5 } from '../../src/lib/sci/concordia.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/leon-eclogite-zircon-concordia-age-mswd.md', import.meta.url);

// Inputs from the paper: Pitra et al. style petrochronology study published as
// "Origin and evolution of the Variscan Leon eclogites: insights from zircon and garnet petrochronology",
// European Journal of Mineralogy 37: 639 (2025), doi:10.5194/ejm-37-639-2025 (CC BY 4.0).
// Eclogite zircon cores: concordia age 385.7 +/- 2.9 Ma with MSWD 8.7; weighted mean 206Pb/238U age
// 385.7 +/- 1.6 Ma with MSWD 1.14. The paper's own isotope ratios are in supplementary tables we could not read.
const AGE = 385.7e6, U = 137.818;
const PAPER = { concT: 385.7, concS: 2.9, concMswd: 8.7, wmT: 385.7, wmS: 1.6, wmMswd: 1.14 };
// OUR simulation: 12 analyses on concordia at 385.7 Ma, with 2-sigma relative errors of 2.0 % on 207Pb/235U and
// 1.4 % on 206Pb/238U and a correlation of 0.5 (typical of a laser-ablation session), scattered so that the weighted
// mean's MSWD lands near the paper's 1.14. None of this is the paper's data.
const N = 12, E5 = 0.020, E8 = 0.014, RHO = 0.5, SC5 = 0.008;

const [X0, Y0] = cW(AGE);
let seed = 0;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
// One fixed set of draws, centred so the simulated group sits on 385.7 Ma rather than a little off it.
seed = 3857;
const draws = Array.from({ length: N }, () => [gauss(), gauss()]);
for (const j of [0, 1]) { const mean = draws.reduce((s, d) => s + d[j], 0) / N; draws.forEach((d) => { d[j] -= mean; }); }
/** 12 analyses with a systematic fractional excess `bias` in 207Pb/235U and 206Pb/238U scatter `sc8`. */
const makeSc = (bias, sc8) => draws.map(([gy, gx], i) => { const y = Y0 * (1 + sc8 * gy), x = X0 * (1 + bias + SC5 * gx); return { x, sx: (x * E5) / 2, y, sy: (y * E8) / 2, rho: RHO, label: `z${i + 1}` }; });
// Scale the 206Pb/238U scatter so the weighted mean's MSWD matches the paper's 1.14.
let a = 1e-5, b = 0.05;
for (let i = 0; i < 90; i++) { const m = (a + b) / 2; weightedMean68(makeSc(0, m)).mswd < PAPER.wmMswd ? (a = m) : (b = m); }
const SC8 = (a + b) / 2;
const make = (bias) => makeSc(bias, SC8);

const r = (v, n = 2) => +v.toFixed(n);
const clean = make(0);
const cc = concordiaAge(clean), wc = weightedMean68(clean);
// The 207Pb/235U excess that reproduces the paper's concordance MSWD of 8.7.
let lo = 0, hi = 0.05;
for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; concordiaAge(make(m)).mswdConc < PAPER.concMswd ? (lo = m) : (hi = m); }
const BIAS = (lo + hi) / 2;
const off = make(BIAS), co = concordiaAge(off), wo = weightedMean68(off);
const g1 = ages(off[0], U);

const rep = (c, w) => ({ concT: r(c.t / 1e6), concS2: r((2 * c.st) / 1e6), concS2exp: r(((2 * c.st) / 1e6) * Math.sqrt(Math.max(1, c.mswdConc))), mswdConc: r(c.mswdConc), mswdEq: r(c.mswdEq, 3), mswdBoth: r(c.mswd, 3), pConc: +c.pConc.toPrecision(3), wmT: r(w.t / 1e6), wmS2: r((2 * w.s) / 1e6), wmMswd: r(w.mswd, 3) });

// Chart 1: the Wetherill concordia with both sets of 2-sigma ellipses.
const TT = Array.from({ length: 121 }, (_, i) => (360 + (i * 60) / 120) * 1e6);
const curve = { x: TT.map((t) => cW(t)[0]), y: TT.map((t) => cW(t)[1]) };
const ell = (list, colour) => list.map((a) => { const p = ellipse(a, 2, 18); return { name: '', noLegend: true, kind: 'line', x: p.map((q) => r(q[0], 4)), y: p.map((q) => r(q[1], 5)), colour }; });
const fig1 = chart({
  title: 'Wetherill concordia at 385.7 Ma', xLabel: '²⁰⁷Pb/²³⁵U', yLabel: '²⁰⁶Pb/²³⁸U',
  series: [
    { name: 'Concordia, 360 to 420 Ma', kind: 'line', x: curve.x.map((v) => r(v, 5)), y: curve.y.map((v) => r(v, 6)), colour: 'var(--ink)' },
    { name: 'On concordia (simulated)', kind: 'line', x: [], y: [], colour: 'var(--c-tools)' },
    { name: `With 0.7 % excess ²⁰⁷Pb/²³⁵U`, kind: 'line', x: [], y: [], colour: 'var(--c-blog)' },
    ...ell(clean, 'var(--c-tools)'), ...ell(off, 'var(--c-blog)'),
  ],
  xDomain: [0.40, 0.52], yDomain: [0.0565, 0.0675],
  desc: `Twelve simulated zircon analyses as 2-sigma error ellipses on the Wetherill concordia at 385.7 Ma, and the same twelve with a 0.7 per cent systematic excess in 207Pb/235U, which pushes them to the right of the curve.`,
  height: 300,
});

// Chart 2: the concordance MSWD against the 207Pb/235U excess, with the paper's 8.7 marked.
const BB = Array.from({ length: 121 }, (_, i) => (i * 1.2) / 120); // 0 to 1.2 %
const scan = BB.map((b) => { const c = concordiaAge(make(b / 100)), w = weightedMean68(make(b / 100)); return { b, conc: c.mswdConc, wm: w.mswd, t: c.t / 1e6 }; });
const fig2 = chart({
  title: 'What a trace of extra ²⁰⁷Pb does to the MSWDs', xLabel: 'Systematic excess in ²⁰⁷Pb/²³⁵U (%)', yLabel: 'MSWD',
  series: [
    { name: 'MSWD of concordance', kind: 'line', x: BB, y: scan.map((p) => r(p.conc, 3)) },
    { name: 'MSWD of the weighted mean ²⁰⁶Pb/²³⁸U age', kind: 'line', x: BB, y: scan.map((p) => r(p.wm, 3)) },
  ],
  xDomain: [0, 1.2], yDomain: [0, 16],
  hlines: [{ y: PAPER.concMswd, text: `paper: 8.7` }, { y: PAPER.wmMswd, text: `paper: 1.14` }],
  vlines: [{ x: r(100 * BIAS, 3), text: `${r(100 * BIAS, 2)} %` }],
  desc: `The concordance MSWD climbs steeply with a systematic excess in 207Pb/235U while the weighted mean 206Pb/238U MSWD does not move at all. The paper's pair of 8.7 and 1.14 is met at an excess of about ${r(100 * BIAS, 2)} per cent.`,
  height: 290,
});

console.log(JSON.stringify({
  ratios: { r75: r(X0, 5), r68: r(Y0, 6), r76: r(X0 / Y0 / U, 6), tw238206: r(1 / Y0, 3), tw207206: r(cTW(AGE, U)[1], 6) },
  clean: rep(cc, wc), biased: rep(co, wo), biasPct: r(100 * BIAS, 3),
  biasedFirst: { t68: r(g1.t68 / 1e6, 1), t75: r(g1.t75 / 1e6, 1), t76: r(g1.t76 / 1e6, 1), disc: r(g1.disc) },
  sqrtMswd: r(Math.sqrt(PAPER.concMswd)), paperUnexpanded: r(PAPER.concS / Math.sqrt(PAPER.concMswd)),
  rows: clean.map((a) => [r(a.x, 5), r(2 * a.sx, 5), r(a.y, 6), r(2 * a.sy, 6), a.rho]),
  biasedRows: off.map((a) => [r(a.x, 5), r(2 * a.sx, 5), r(a.y, 6), r(2 * a.sy, 6), a.rho]),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'concordia', figure(fig1, `Figure 1. Twelve simulated zircon analyses (ours, not the paper's) as 2σ ellipses on the Wetherill concordia at 385.7 Ma. The blue set sits on the curve; the amber set is the same twelve with a ${r(100 * BIAS, 2)} % systematic excess in ²⁰⁷Pb/²³⁵U, which moves them off it to the right while leaving their ²⁰⁶Pb/²³⁸U ages untouched.`));
  md = inject(md, 'mswd', figure(fig2, `Figure 2. The tool's MSWD of concordance against a systematic excess in ²⁰⁷Pb/²³⁵U. It reaches the paper's 8.7 at about ${r(100 * BIAS, 2)} %, while the weighted mean ²⁰⁶Pb/²³⁸U MSWD stays at ${rep(cc, wc).wmMswd}, close to the paper's 1.14. One small systematic in the 207 channel explains both of the paper's numbers at once.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
