// Figures for src/blog/discoveries/gfrp-reinforced-concrete-beam-aci-440-factored-moment-load-combination.md, made with the maths of the
// Load combination helper (src/lib/sci/eng-loadcomb.ts) and the Rebar calculator (src/lib/sci/eng-rebar.ts).
// Run: node scripts/blog-figures/gfrp-reinforced-concrete-beam-aci-440-factored-moment-load-combination.mjs
import fs from 'node:fs';
import * as LC from '../../src/lib/sci/eng-loadcomb.ts';
import * as R from '../../src/lib/sci/eng-rebar.ts';
import { parseTable } from '../../src/lib/sci/num.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gfrp-reinforced-concrete-beam-aci-440-factored-moment-load-combination.md', import.meta.url);

// Values printed by Reddy et al. (2023), E3S Web of Conferences 391: 01213, doi:10.1051/e3sconf/202339101213 (CC BY 4.0), ACI 440.1R-15 example:
// service moments MD = 76 and ML = 47 kN.m; Mu = 1.2 MD + 1.6 ML = 166.4 kN.m; b = 300 mm, d = 414 mm; fc' = 28 MPa; ffu* = 550 MPa, CE = 0.8,
// ffu = 440 MPa; Ef = 45,000 MPa; ecu = 0.003; balanced ratio 0.01079; design ratio 1.5 x balanced; required Af about 2011 mm2; four No. 25 bars
// (db = 25.4 mm) provide 2040 mm2 (the paper's table value 510 mm2 per bar); phi = 0.65; ff = 349 MPa.
const MD = 76, ML = 47, b = 300, d = 414, fc = 28, ffu = 0.8 * 550, Ef = 45000, ecu = 0.003, beta1 = 0.85, phi = 0.65;
const calc = (rules) => {
  const L = LC.parseLoads(parseTable(`Load, M (kN·m)\nD, ${MD}\nL, ${ML}`));
  const C = LC.parseCombos(rules, ['D', 'L']);
  return LC.evaluate(L, C);
};
const rules = ['ACI/ASCE: 1.2D + 1.6L', 'ASCE: 1.4D', 'EN 1990 (6.10): 1.35D + 1.5L', 'Service: D + L'].join('\n');
const res = calc(rules);
const vals = res.rows.map((r) => ({ name: r.combo, M: r.values[0] }));
// Combination sweep over the live share of a fixed 123 kN.m service moment
const tot = MD + ML, shares = Array.from({ length: 41 }, (_, i) => i * 0.025);
const mu = (f) => { const L = LC.parseLoads(parseTable(`Load, M\nD, ${MD}\nL, ${ML}`)); return LC.evaluate(L, LC.parseCombos(f, ['D', 'L'])).rows[0].values[0]; };
const muShare = (rule, s) => { const L = LC.parseLoads(parseTable(`Load, M\nD, ${tot * (1 - s)}\nL, ${tot * s}`)); return LC.evaluate(L, LC.parseCombos(rule, ['D', 'L'])).rows[0].values[0]; };
const crossShare = (() => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (muShare('1.2D + 1.6L', m) < muShare('1.4D', m) ? lo = m : hi = m); } return hi; })();

// ACI 440.1R design equations (our recomputation script, not a fibub tool)
const rhoB = 0.85 * beta1 * fc / ffu * (Ef * ecu) / (Ef * ecu + ffu);
const rho = 1.5 * rhoB, AfReq = rho * b * d;
const ffOf = (r) => Math.sqrt((Ef * ecu) ** 2 / 4 + 0.85 * beta1 * fc / r * Ef * ecu) - 0.5 * Ef * ecu;
const phiMn = (Af) => { const r = Af / (b * d), ff = ffOf(r); return { r, ff, Mn: r * ff * (1 - 0.59 * r * ff / fc) * b * d * d / 1e6 }; };
const a25 = R.area(25.4), A4 = 4 * a25;
const mn1 = phiMn(AfReq), mn2 = phiMn(2040), mn3 = phiMn(A4);
const mass = (rho_) => 4 * R.massPerM(25.4, rho_);

const bars = [1, 2, 3, 4, 5, 6];
const fig1 = chart({
  title: 'Factored moment against the live share', xLabel: 'Live share of the 123 kN·m service moment (%)', yLabel: 'Design moment (kN·m)',
  series: [
    { name: '1.2D + 1.6L', x: shares.map((s) => s * 100), y: shares.map((s) => muShare('1.2D + 1.6L', s)) },
    { name: '1.4D', x: shares.map((s) => s * 100), y: shares.map((s) => muShare('1.4D', s)), colour: 'var(--c-tools)' },
    { name: '1.35D + 1.5L', x: shares.map((s) => s * 100), y: shares.map((s) => muShare('1.35D + 1.5L', s)), colour: 'var(--muted)', dash: '5 4' },
    { name: 'Paper', kind: 'dots', x: [100 * ML / tot], y: [166.4], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0, 100], yDomain: [120, 200],
  desc: 'Design bending moment from three load combinations against the live share of a fixed service moment of 123 kilonewton-metres, with the paper’s 166.4 kilonewton-metres at a live share of 38 per cent.',
});
const fig2 = chart({
  title: 'Steel area from No. 25 bars', xLabel: 'Number of bars', yLabel: 'Area (mm²)',
  series: [
    { name: 'Area', kind: 'dots', x: bars, y: bars.map((n) => n * a25), size: 4 },
    { name: 'Required', x: [0.5, 6.5], y: [AfReq, AfReq], colour: 'var(--c-tools)', dash: '5 4' },
  ],
  xDomain: [0.5, 6.5], yDomain: [0, 3300], xTicks: [1, 2, 3, 4, 5, 6],
  desc: 'Cross-section area of one to six bars of 25.4 millimetre diameter against the required fibre-reinforced polymer area of about 2011 square millimetres.',
});
const out = { vals, muPaper: mu('1.2D + 1.6L'), crossShare: crossShare * 100, rhoB, rho, AfReq, a25, A4, mn1, mn2, mn3, phiMn1: phi * mn1.Mn, phiMn2: phi * mn2.Mn, phiMn3: phi * mn3.Mn,
  massSteel: mass(7850), massGfrp: mass(2100), ratio: 7850 / 2100, share: ML / tot, e610: mu('1.35D + 1.5L'), s14: mu('1.4D'), svc: mu('D + L') };
console.log(JSON.stringify(out, (k, v) => typeof v === 'number' ? +v.toPrecision(5) : v));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'combos', figure(fig1, 'Figure 1. Design moment from three load combinations as the live share of a fixed 123 kN·m service moment changes, from the Load combination helper’s maths. Dot: the paper’s 38 % live share, where 1.2D + 1.6L gives 166.4 kN·m.'));
  md = inject(md, 'bars', figure(fig2, 'Figure 2. Area of No. 25 (25.4 mm) bars from the Rebar calculator’s maths against the required area of about 2011 mm². Four bars are the smallest number that reach it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
