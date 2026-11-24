// Figures for src/blog/discoveries/penciclovir-cats-famciclovir-nonlinear-pharmacokinetics-simulated.md, made with the
// maths of the Pharmacokinetics simulator (src/lib/sci/pksim.ts: one-compartment curves, superposition, steady state)
// and the Molar mass calculator (src/lib/sci/chem.ts) for the prodrug-to-drug conversion.
// Run: node scripts/blog-figures/penciclovir-cats-famciclovir-nonlinear-pharmacokinetics-simulated.mjs
import fs from 'node:fs';
import { simulate, summarise } from '../../src/lib/sci/pksim.ts';
import { molarMass, parseFormula } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/penciclovir-cats-famciclovir-nonlinear-pharmacokinetics-simulated.md', import.meta.url);

// Inputs from the paper: Qu, Ke, Zhang and Zhang (2025), Front. Vet. Sci. 12: 1695827, doi:10.3389/fvets.2025.1695827 (CC BY).
// Group means (penciclovir in plasma). Single oral famciclovir: dose (mg/kg), CL/F (L/h), Vz/F (L), Tmax (h), Cmax (ng/mL),
// AUC0-inf (h·ng/mL). IV penciclovir 10 mg/kg over 1 h: CL 1.21 L/h, Vz 3.33 L, Cmax 7572 ng/mL, t½ 2.03 h, AUC0-inf 25823.71.
// Repeated famciclovir 62.5 mg/kg every 12 h: CLss/F 5.91 L/h, Vss/F 46.71 L, AUC0-12,ss 25203.75, Tmax day 1 2.9 h,
// Cmax day 1 3072, Cmax,ss 3197, Cmin,ss 1047 ng/mL, accumulation (AUC) 1.09, fluctuation 105.69 %.
const G = [
  { d: 15.625, cl: 2.11, v: 7.55, tmax: 3.45, cmax: 2170, auc: 21347, fPaper: 67.12 },
  { d: 31.25, cl: 3.58, v: 17.93, tmax: 3.25, cmax: 2340, auc: 21589, fPaper: 33.94 },
  { d: 62.5, cl: 5.90, v: 41.93, tmax: 3.60, cmax: 2890, auc: 33646, fPaper: 26.45 },
  { d: 93.75, cl: 6.90, v: 50.24, tmax: 3.40, cmax: 3290, auc: 35064, fPaper: 18.37 },
];
const IV = { cl: 1.21, v: 3.33, auc: 25823.71, dose: 10, cmax: 7572, thalf: 2.03 };
const MD = { cl: 5.91, v: 46.71, auc: 25203.75, tmax: 2.9, cmax1: 3072, cmaxSs: 3197, cminSs: 1047, rac: 1.09, fluct: 105.69 };

// Famciclovir C14H19N5O4 → penciclovir C10H15N5O3, one to one.
const mFam = molarMass(parseFormula('C14H19N5O4')), mPen = molarMass(parseFormula('C10H15N5O3')), ratio = mPen / mFam;

// One compartment: ka that puts the peak at the reported Tmax, by bisection on the tool's own simulated peak time.
const tmaxFor = (m, ka) => summarise(m, { route: 'oral', amount: 1, tau: 1000, n: 1, ka, f: 1 }).tmax1;
const kaFor = (m, tmax) => { let lo = (m.cl / m.v1) * 1.0001, hi = 20; for (let i = 0; i < 60; i++) { const k = Math.sqrt(lo * hi); tmaxFor(m, k) > tmax ? (lo = k) : (hi = k); } return Math.sqrt(lo * hi); };

// IV: the amount given follows from AUC × CL (µg → mg); body weight from amount ÷ 10 mg/kg.
const ivDose = (IV.auc * IV.cl) / 1000, ivS = summarise({ comp: 1, cl: IV.cl, v1: IV.v }, { route: 'infusion', amount: ivDose, tau: 1000, n: 1, tinf: 1 });
const iv = { dose: +ivDose.toFixed(1), kg: +(ivDose / IV.dose).toFixed(2), cmax: Math.round(ivS.cmax1 * 1000), thalf: +ivS.halfLives[0].toFixed(2) };

const single = G.map((g) => {
  const m = { comp: 1, cl: g.cl, v1: g.v }, dose = (g.auc * g.cl) / 1000, ka = kaFor(m, g.tmax);
  const S = summarise(m, { route: 'oral', amount: dose, tau: 1000, n: 1, ka, f: 1 });
  const fPct = ((g.auc / (g.d * ratio)) / (IV.auc / IV.dose)) * 100; // absolute bioavailability, molar-corrected
  return { d: g.d, k: +(g.cl / g.v).toFixed(3), thalf: +S.halfLives[0].toFixed(2), dose: +dose.toFixed(1), kg: +(dose / g.d).toFixed(2), ka: +ka.toFixed(2), cmax: Math.round(S.cmax1 * 1000), cmaxPaper: g.cmax, diff: +((S.cmax1 * 1000 / g.cmax - 1) * 100).toFixed(1), aucPerMg: +(g.auc / g.d).toFixed(0), fPct: +fPct.toFixed(1), fPaper: g.fPaper, m, amount: dose, kaRaw: ka };
});

// Repeated dosing: amount from AUC0-12,ss × CL/F; ka from Tmax on day 1; 28 doses (14 days).
const mMd = { comp: 1, cl: MD.cl, v1: MD.v }, mdDose = (MD.auc * MD.cl) / 1000, mdKa = kaFor(mMd, MD.tmax);
const mdReg = { route: 'oral', amount: mdDose, tau: 12, n: 28, ka: mdKa, f: 1 }, mdSim = simulate(mMd, mdReg), mdS = summarise(mMd, mdReg, mdSim);
const md = { dose: +mdDose.toFixed(1), ka: +mdKa.toFixed(2), cmax1: Math.round(mdS.cmax1 * 1000), cmaxSs: Math.round(mdS.cmaxSs * 1000), cminSs: Math.round(mdS.cminSs * 1000), cavSs: Math.round(mdS.cavSs * 1000), auc1: Math.round(mdS.auc1 * 1000), rac: +mdS.racAuc.toFixed(2), fluct: +mdS.fluct.toFixed(1), thalf: +mdS.halfLives[0].toFixed(2), racNeeded: +(MD.auc / MD.rac).toFixed(0) };
// Check it yourself: the same with rounded inputs as typed into the tool.
const cyS = summarise(mMd, { route: 'oral', amount: 149, tau: 12, n: 28, ka: 0.73, f: 1 });
const cy = { cmaxSs: +cyS.cmaxSs.toFixed(3), cminSs: +cyS.cminSs.toFixed(3), cavSs: +cyS.cavSs.toFixed(3), rac: +cyS.racAuc.toFixed(3), cmax1: +cyS.cmax1.toFixed(3), tmax1: +cyS.tmax1.toFixed(2), fluct: +cyS.fluct.toFixed(1), thalf: +cyS.halfLives[0].toFixed(2) };

const TT = Array.from({ length: 121 }, (_, i) => i * 0.3);
const fig1 = chart({
  title: 'Four single doses: one-compartment curves', xLabel: 'Hours after the dose', yLabel: 'Penciclovir (ng/mL)',
  series: [
    ...single.map((s) => { const sim = simulate(s.m, { route: 'oral', amount: s.amount, tau: 1000, n: 1, ka: s.kaRaw, f: 1 }); return { name: s.d === 93.75 ? '93.75 mg/kg' : String(s.d), kind: 'line', x: TT, y: TT.map((t) => Math.round(sim.single(t) * 1000)) }; }),
    { name: 'Reported peak', kind: 'dots', x: G.map((g) => g.tmax), y: G.map((g) => g.cmax), size: 4, colour: 'var(--ink)' },
  ].map((s, i) => (i < 4 ? { ...s, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'][i], dash: i % 2 ? '5 3' : undefined } : s)),
  xDomain: [0, 36], yDomain: [0, 3600],
  desc: `Simulated penciclovir curves after four oral famciclovir doses, each from its group's mean CL/F and Vz/F with ka set to match the reported Tmax. The simulated peaks are ${single.map((s) => s.cmax).join(', ')} ng/mL against reported ${G.map((g) => g.cmax).join(', ')}.`, height: 290,
});
const T2 = Array.from({ length: 241 }, (_, i) => i * 0.3);
const fig2 = chart({
  title: 'Every 12 hours: the linear model against the reported steady state', xLabel: 'Hours from the first dose', yLabel: 'Penciclovir (ng/mL)',
  series: [
    { name: 'Linear one-compartment model', kind: 'line', x: T2, y: T2.map((t) => Math.round(mdSim.at(t) * 1000)) },
    { name: 'Reported day-1 Cmax', kind: 'dots', x: [MD.tmax], y: [MD.cmax1], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 72], yDomain: [0, 3600],
  hlines: [{ y: MD.cmaxSs, text: `reported Cmax,ss ${MD.cmaxSs}` }, { y: MD.cminSs, text: `reported Cmin,ss ${MD.cminSs}` }],
  desc: `Three days of 62.5 mg/kg every 12 hours simulated from the paper's steady-state CL/F and Vss/F. The model's first peak is ${md.cmax1} ng/mL against a reported ${MD.cmax1}; its steady-state peak and trough are ${md.cmaxSs} and ${md.cminSs} against reported ${MD.cmaxSs} and ${MD.cminSs}.`, height: 290,
});

console.log(JSON.stringify({ mFam: +mFam.toFixed(2), mPen: +mPen.toFixed(2), ratio: +ratio.toFixed(4), iv, single: single.map(({ m, amount, kaRaw, ...r }) => r), md, cy }, null, 1));
if (fs.existsSync(ART)) {
  let md0 = fs.readFileSync(ART, 'utf8');
  md0 = inject(md0, 'single', figure(fig1, 'Figure 1. One-compartment curves from the Pharmacokinetics simulator\'s maths for the four single doses, each built from that group\'s mean CL/F and Vz/F with the absorption rate set so the peak falls at the reported Tmax. Dots: the reported mean Cmax. Simulated, not the measured curves.'));
  md0 = inject(md0, 'repeat', figure(fig2, 'Figure 2. The first three days of 62.5 mg/kg every 12 hours, simulated from the steady-state CL/F and Vss/F with a linear model. Dashed lines: the reported steady-state peak and trough; dot: the reported first-day peak.'));
  fs.writeFileSync(ART, md0);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
