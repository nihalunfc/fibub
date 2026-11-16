// Figures for src/blog/discoveries/christiana-volcano-santorini-argon-argon-ages.md, made with the maths of the
// Radiometric age calculator (src/lib/sci/geochron.ts: J factor, 40Ar/39Ar age and the York isochron fit).
// Run: node scripts/blog-figures/christiana-volcano-santorini-argon-argon-ages.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { K40, jFromStandard, arArAge, york } from '../../src/lib/sci/geochron.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/christiana-volcano-santorini-argon-argon-ages.md', import.meta.url);

// Inputs. "Paper": Vroon et al. (2026), Geochronology 8, 279-295, doi:10.5194/gchron-8-279-2026 (CC BY 4.0).
const T_STD = 28.201e6;          // years: Fish Canyon sanidine standard age used in the paper (Kuiper et al. 2008)
const ATM = 298.56;              // atmospheric 40Ar/36Ar used in the paper (Lee et al. 2006)
const T_LAVA = 2.63e6;           // years: the paper's mean of five accepted lava ages (2.63 ± 0.05 Ma, 1 sd)
const T_OBS = 0.133e6, S_OBS = 0.014e6; // years: the paper's obsidian age, 2σ
const T_MP = 0.145e6;            // years: Middle Pumice eruption of Santorini, about 145 ka, as cited in the paper
const ACC = [2.60, 2.57, 2.63, 2.69, 2.66], ACC_S = [0.02, 0.02, 0.02, 0.03, 0.02]; // Ma, 2σ: the paper's five accepted plateau ages
const LAM_MIN = 5.463e-10;       // per year: Min et al. (2000) total 40K decay constant, used in the paper (literature value)
const R_STD = 12.0;              // our assumption: the standard's measured 40Ar*/39Ar (labs measure their own); the tool's default
const SJ = 0.2;                  // our assumption: J uncertainty, % (1σ), the tool's default

// 1. J, and the 40Ar*/39Ar ratio each age gives.
const J = jFromStandard(T_STD, R_STD);
const ratioFor = (t, lam = K40.lambda, Jx = J) => Math.expm1(lam * t) / Jx;
const R_LAVA = ratioFor(T_LAVA), R_OBS = ratioFor(T_OBS);

// 2. The same ratios with the Min et al. (2000) decay constant (J recomputed from the same standard).
const J_MIN = Math.expm1(LAM_MIN * T_STD) / R_STD;
const tMin = Math.log1p(J_MIN * R_LAVA) / LAM_MIN;

// 3. Precision: what ratio precision a ±0.02 Ma (2σ) age on 2.6 Ma needs, with the assumed 0.2% J error.
const a1 = arArAge(J, ratioFor(2.60e6), 0, (J * SJ) / 100);
const relAge = 0.01 / 2.60; // 1σ relative (half of 0.02 Ma 2σ)
const relJ = SJ / 100, relR = Math.sqrt(Math.max(0, relAge ** 2 - relJ ** 2));

// 4. Simulated step-heating isochrons: x = 39Ar/36Ar, y = 40Ar/36Ar = trapped + R* · x. Seven steps, 0.3% errors (our choices).
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const XS = [40, 70, 110, 160, 220, 300, 400]; // 39Ar/36Ar of the heating steps: our assumption
function simulate(trapped) {
  const pts = XS.map((x) => { const y = trapped + R_LAVA * x; return { x: x * (1 + 0.003 * gauss()), sx: 0.003 * x, y: y * (1 + 0.003 * gauss()), sy: 0.003 * y, r: 0 }; });
  const f = york(pts), iso = arArAge(J, f.b).t;
  // "Plateau" style: each step corrected with the atmospheric ratio, then a weighted mean of the step ratios.
  const steps = pts.map((p) => (p.y - ATM) / p.x), w = pts.map((p) => (p.x / p.sy) ** 2);
  const Rplat = steps.reduce((s, v, i) => s + v * w[i], 0) / w.reduce((s, v) => s + v, 0);
  return { pts, f, iso, plat: arArAge(J, Rplat).t };
}
const atm = simulate(ATM), sub = simulate(288.4); // 288.4: a sub-atmospheric intercept like one the paper reports (our pick)
const fig1 = chart({
  title: 'Simulated isochrons for a 2.63-million-year-old lava', xLabel: '³⁹Ar/³⁶Ar', yLabel: '⁴⁰Ar/³⁶Ar',
  series: [
    { name: 'Trapped argon = air (298.56)', kind: 'dots', size: 3.5, x: atm.pts.map((p) => +p.x.toFixed(2)), y: atm.pts.map((p) => +p.y.toFixed(2)) },
    { name: 'Trapped argon = 288.4', kind: 'dots', size: 3.5, x: sub.pts.map((p) => +p.x.toFixed(2)), y: sub.pts.map((p) => +p.y.toFixed(2)) },
    { name: '', kind: 'line', x: [0, 420], y: [atm.f.a, atm.f.a + atm.f.b * 420].map((v) => +v.toFixed(2)), colour: 'var(--c-blog)' },
    { name: '', kind: 'line', x: [0, 420], y: [sub.f.a, sub.f.a + sub.f.b * 420].map((v) => +v.toFixed(2)), colour: 'var(--c-tools)', dash: '5 4' },
  ],
  xDomain: [0, 420], yDomain: [250, 800],
  desc: `Two simulated sets of heating steps for the same lava: the lines' slopes give the same age, about ${(atm.iso / 1e6).toFixed(2)} and ${(sub.iso / 1e6).toFixed(2)} Ma, while the intercepts recover the trapped argon, ${atm.f.a.toFixed(1)} and ${sub.f.a.toFixed(1)}.`, height: 300,
});

// 5. How much a wrong trapped ratio shifts an air-corrected age, against the trapped ratio, for these steps.
const tr = Array.from({ length: 41 }, (_, i) => 280 + i * 0.5);
const shift = tr.map((t) => { const steps = XS.map((x) => (t + R_LAVA * x - ATM) / x), w = XS.map((x) => (x / (0.003 * (t + R_LAVA * x))) ** 2); const R = steps.reduce((s, v, i) => s + v * w[i], 0) / w.reduce((s, v) => s + v, 0); return +((arArAge(J, R).t - T_LAVA) / 1e3).toFixed(2); });
const fig2 = chart({
  title: 'Age error if trapped argon is not air', xLabel: 'True trapped ⁴⁰Ar/³⁶Ar', yLabel: 'Air-corrected age minus true age (thousand years)',
  series: [{ name: 'Age error', kind: 'line', x: tr, y: shift }],
  xDomain: [280, 300], hlines: [{ y: 0, text: '' }], vlines: [{ x: ATM, text: 'air 298.56', left: true }],
  desc: `For the simulated heating steps, every unit that the trapped ratio falls below air makes the air-corrected age about ${Math.abs((shift[0] - shift[shift.length - 1]) / 20).toFixed(0)} thousand years too young.`, height: 300,
});

const mean = ACC.reduce((s, v) => s + v, 0) / ACC.length;
const facts = {
  J: J.toExponential(5), R_LAVA: R_LAVA.toFixed(5), R_OBS: R_OBS.toFixed(5),
  ageBack: (arArAge(J, +R_LAVA.toFixed(4)).t / 1e6).toFixed(4), obsBack: (arArAge(J, +R_OBS.toFixed(4)).t / 1e3).toFixed(2),
  lamTool: K40.lambda, tMin: (tMin / 1e6).toFixed(5), dMinKa: ((tMin - T_LAVA) / 1e3).toFixed(2),
  a1: `${(a1.t / 1e6).toFixed(4)} ± ${(a1.s / 1e6).toFixed(4)} (1σ from J only)`, relAge: (relAge * 100).toFixed(3), relR: (relR * 100).toFixed(3),
  atm: `slope ${atm.f.b.toFixed(5)} a ${atm.f.a.toFixed(2)}±${atm.f.sa.toFixed(2)} iso ${(atm.iso / 1e6).toFixed(4)} plat ${(atm.plat / 1e6).toFixed(4)} mswd ${atm.f.mswd.toFixed(2)}`,
  sub: `slope ${sub.f.b.toFixed(5)} a ${sub.f.a.toFixed(2)}±${sub.f.sa.toFixed(2)} iso ${(sub.iso / 1e6).toFixed(4)} plat ${(sub.plat / 1e6).toFixed(4)} mswd ${sub.f.mswd.toFixed(2)}`,
  shiftPerUnit: ((shift[0] - shift[shift.length - 1]) / 20).toFixed(2), shiftAt288: shift[tr.indexOf(288.5)],
  mean: mean.toFixed(3), sd: Math.sqrt(ACC.reduce((s, v) => s + (v - mean) ** 2, 0) / (ACC.length - 1)).toFixed(3),
  obsVsMP: `${((T_MP - T_OBS) / 1e3).toFixed(0)} ka apart, 2σ ${S_OBS / 1e3} ka`,
  isoData: atm.pts.map((p) => [p.x.toFixed(2), p.sx.toFixed(3), p.y.toFixed(2), p.sy.toFixed(3)].join(' ')),
  isoDataSub: sub.pts.map((p) => [p.x.toFixed(2), p.sx.toFixed(3), p.y.toFixed(2), p.sy.toFixed(3)].join(' ')),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'iso', figure(fig1, 'Figure 1. Two simulated sets of heating steps for a lava 2.63 million years old, fitted with the Radiometric age calculator\'s York isochron maths. Simulated, not the paper\'s measurements.'));
  md = inject(md, 'trap', figure(fig2, 'Figure 2. How far an age corrected with the air ratio drifts when the rock\'s trapped argon is different, for the same simulated heating steps. Simulated.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
