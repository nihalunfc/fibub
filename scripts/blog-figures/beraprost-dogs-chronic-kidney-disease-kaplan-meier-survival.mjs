// Figures for src/blog/discoveries/beraprost-dogs-chronic-kidney-disease-kaplan-meier-survival.md, made with the
// maths of the Survival analysis tool (src/lib/sci/survival.ts: Kaplan-Meier, log-rank test, Cox model).
// Run: node scripts/blog-figures/beraprost-dogs-chronic-kidney-disease-kaplan-meier-survival.mjs  (rewrites the charts)
import fs from 'node:fs';
import { kaplanMeier, logRank, coxPH, survivalAt } from '../../src/lib/sci/survival.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/beraprost-dogs-chronic-kidney-disease-kaplan-meier-survival.md', import.meta.url);

// Inputs. "Paper": Mayumi, Matsuura and Sano (2026), Front. Vet. Sci. 13:1665061 (CC BY), Results.
const N_B = 16, D_B = 11, MED_B = 1101;   // beraprost: dogs, deaths, median overall survival (days), paper
const N_C = 17, D_C = 16, MED_C = 198;    // historical control: dogs, deaths, median (days), paper
const HR_PAPER = 0.25;                    // unadjusted hazard ratio, paper (95% CI 0.10 to 0.59)

// 1. A SIMULATED data set with the paper's group sizes, death counts and medians. Our assumptions: survival
// times follow an exponential curve with the paper's median; the deaths sit at evenly spaced quantiles of that
// curve; dogs still alive are censored at the end of follow-up, which we spread over 1,900 to 2,000 days
// (beraprost) and put at 1,950 days (the one control dog). These are not the paper's dogs.
function group(n, d, median, censorTimes) {
  const scale = median / Math.LN2, t = [], e = [];
  for (let i = 1; i <= d; i++) { t.push(Math.round(-scale * Math.log(1 - (i - 0.5) / n))); e.push(1); }
  for (const c of censorTimes) { t.push(c); e.push(0); }
  return { t, e };
}
const B = group(N_B, D_B, MED_B, [1900, 1925, 1950, 1975, 2000]);
const C = group(N_C, D_C, MED_C, [1950]);
const kmB = kaplanMeier(B.t, B.e), kmC = kaplanMeier(C.t, C.e);
const T = [...B.t, ...C.t], E = [...B.e, ...C.e], G = [...B.t.map(() => 'Beraprost'), ...C.t.map(() => 'Control')];
const lr = logRank(T, E, G);
const cox = coxPH(T, E, G.map((g) => [g === 'Beraprost' ? 1 : 0]), ['beraprost']);
const term = cox.terms[0];

const stepXY = (km, end) => { const x = [0], y = [1]; let s = 1; for (const st of km.steps) { if (st.events === 0) continue; x.push(st.t, st.t); y.push(s, st.S); s = st.S; } x.push(end); y.push(s); return { x, y }; };
const sb = stepXY(kmB, 2000), sc = stepXY(kmC, 2000);
const fig1 = chart({
  title: 'Kaplan-Meier curves for a simulated 16 + 17 dog study', xLabel: 'Days since entry', yLabel: 'Share still alive',
  series: [
    { name: `Beraprost-like (median ${kmB.median} d)`, kind: 'line', x: sb.x, y: sb.y.map((v) => +v.toFixed(4)) },
    { name: `Control-like (median ${kmC.median} d)`, kind: 'line', x: sc.x, y: sc.y.map((v) => +v.toFixed(4)) },
  ],
  yDomain: [0, 1.02], xDomain: [0, 2000], hlines: [{ y: 0.5, text: 'half still alive' }],
  desc: `Simulated Kaplan-Meier curves: the beraprost-like group falls to one half at ${kmB.median} days, the control-like group at ${kmC.median} days.`, height: 300,
});

// 2. Simulated power: how often would a study of 16 + 17 dogs reach p < 0.05 on the log-rank test, for a range of
// true hazard ratios? Our assumptions: exponential times, control median 198 days, follow-up long enough that
// censoring is light (uniform entry over 700 days, study ends 2,000 days after the first dog). 400 trials each.
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
function trial(hr) {
  const t = [], e = [], g = [];
  for (const [n, h, name] of [[N_B, hr, 'B'], [N_C, 1, 'C']]) for (let i = 0; i < n; i++) {
    const rate = (Math.LN2 / MED_C) * h, life = -Math.log(1 - rnd()) / rate, left = 2000 - 700 * rnd();
    t.push(Math.max(1, Math.round(Math.min(life, left)))); e.push(life <= left ? 1 : 0); g.push(name);
  }
  return logRank(t, e, g).p < 0.05;
}
const hrs = [0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1];
const pow = hrs.map((h) => { let k = 0; for (let i = 0; i < 400; i++) k += trial(h); return k / 400; });
const fig2 = chart({
  title: 'How often 16 + 17 dogs would show a difference (simulated)', xLabel: 'True hazard ratio (beraprost vs control)', yLabel: 'Share of studies with p < 0.05',
  series: [{ name: 'Power', kind: 'line', x: hrs, y: pow }, { name: '', kind: 'dots', x: hrs, y: pow }],
  yDomain: [0, 1], xDomain: [0.1, 1], hlines: [{ y: 0.8, text: '80% power' }], vlines: [{ x: HR_PAPER, text: 'paper: 0.25' }],
  desc: 'Simulated power of the log-rank test with 16 and 17 dogs: high for a hazard ratio of 0.25, low for modest effects such as 0.6 or 0.7.', height: 300,
});

const facts = {
  B: B.t.join(','), C: C.t.join(','), medB: kmB.median, medBci: [kmB.medianLo, kmB.medianHi], medC: kmC.median, medCci: [kmC.medianLo, kmC.medianHi],
  S365B: (+survivalAt(kmB, 365)).toFixed(3), S365C: (+survivalAt(kmC, 365)).toFixed(3),
  lrChi2: lr.chi2.toFixed(2), lrP: lr.p.toPrecision(3), obs: lr.observed, exp: lr.expected.map((v) => v.toFixed(2)),
  hr: term.hr.toFixed(3), hrLo: term.lo.toFixed(3), hrHi: term.hi.toFixed(3), hrP: term.p.toPrecision(3),
  power: Object.fromEntries(hrs.map((h, i) => [h, pow[i]])),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'km', figure(fig1, 'Figure 1. Kaplan-Meier curves from the Survival analysis tool\'s maths for a simulated data set with the paper\'s group sizes, death counts and medians. Simulated, not the study\'s dogs.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. Share of 400 simulated studies of 16 + 17 dogs in which the log-rank test from the Survival analysis tool gives p < 0.05, for different true hazard ratios. Simulated.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
