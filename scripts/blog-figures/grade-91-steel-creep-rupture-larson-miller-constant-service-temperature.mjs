// Figures for src/blog/discoveries/grade-91-steel-creep-rupture-larson-miller-constant-service-temperature.md,
// made with the maths of the Larson-Miller creep calculator (src/lib/sci/creep.ts).
// Run: node scripts/blog-figures/grade-91-steel-creep-rupture-larson-miller-constant-service-temperature.mjs
import fs from 'node:fs';
import { param, logTime, fitParam, ruptureTime, bestC } from '../../src/lib/sci/creep.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/grade-91-steel-creep-rupture-larson-miller-constant-service-temperature.md', import.meta.url);

// Paper (Yaguchi, Kanai and Tamura 2025, Frontiers in Materials 12: 1613803, doi:10.3389/fmats.2025.1613803, CC BY):
// long-term serviced Grade 91 steel; iso-stress tests 600-700 C; Larson-Miller C 16-21 (welded joints), 18-21 (base
// metal); worked example: a 10 000 h rupture at 650 C converted to 600 C gives about 60 000 h (C = 10), 240 000 h
// (C = 20) and 890 000 h (C = 30); across the measured C range the estimated life varies by about 0.75 to 1.45 times.
const K = (C) => ({ C, Q: 0, Ta: 0, logta: 0 });
const TK = (c) => c + 273.15;
const T1 = TK(650), T2 = TK(600); // test temperature and service (reference) temperature
const T0 = 1e4; // the paper's 10 000 h rupture at 650 C

/** Rupture time at T2 that a single rupture (t, T1) implies for a given Larson-Miller C. */
const carry = (t, Ta, Tb, C) => 10 ** logTime('lm', param('lm', Ta, t, K(C)), Tb, K(C));

// 1. The paper's three worked values.
const worked = [10, 20, 30].map((C) => ({ C, t: carry(T0, T1, T2, C) }));

// 2. The ratio of carried-over lives for two C values is 10^(dC (T1/T2 - 1)), free of the rupture time itself.
const ratio = (C, Cref, Ta, Tb) => carry(T0, Ta, Tb, C) / carry(T0, Ta, Tb, Cref);
// The reference C that reproduces both of the paper's sensitivity figures (1.45 at C = 21, 0.75 at C = 16).
let lo = 10, hi = 30;
for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (ratio(21, m, T1, T2) > 1.45) lo = m; else hi = m; }
const Cref = (lo + hi) / 2;
const sens = { Cref: +Cref.toFixed(2), up: +ratio(21, Cref, T1, T2).toFixed(3), down: +ratio(16, Cref, T1, T2).toFixed(3), plus3: +ratio(Cref + 3, Cref, T1, T2).toFixed(3), minus3: +ratio(Cref - 3, Cref, T1, T2).toFixed(3) };

// 3. A simulated Grade 91-like rupture set for the "Check it yourself" steps. Our assumptions: a straight master
// curve in log10 stress, C = the reference C above, 270 000 h at 600 C and 40 MPa, 20 000 h at 600 C and 80 MPa.
const anchor = (s, t) => T2 * (Cref + Math.log10(t));
const bSlope = (anchor(80, 2e4) - anchor(40, 2.7e5)) / (Math.log10(80) - Math.log10(40));
const aInt = anchor(40, 2.7e5) - bSlope * Math.log10(40);
const LMP = (s) => aInt + bSlope * Math.log10(s);
const sig = (v, n = 3) => +v.toPrecision(n);
const SET = [];
for (const c of [625, 650, 675]) for (const s of [40, 56, 80]) SET.push({ T: TK(c), Tc: c, s, t: sig(10 ** (LMP(s) / TK(c) - Cref)) });

const fits = [16, Cref, 21].map((C) => {
  const f = fitParam('lm', SET, 1, K(C));
  return { C: +C.toFixed(2), c0: Math.round(f.c[0]), c1: Math.round(f.c[1]), rms: +f.rms.toFixed(4), life600_40: Math.round(ruptureTime(f, 40, T2)), life600_60: Math.round(ruptureTime(f, 60, T2)) };
});
const best = +bestC(SET, 1).toFixed(2);

// Figure 1: an iso-stress line is straight in 1/T, and its slope and intercept are the Larson-Miller parameter and C.
const invT = (c) => 1000 / TK(c);
const Cs = [16, Cref, 21];
const xs = Array.from({ length: 81 }, (_, i) => 600 + i * 1.25);
const fig1 = chart({
  title: 'One rupture at 650 °C, carried down to 600 °C', xLabel: '1000 / T (1/K)', yLabel: 'log₁₀ rupture time (h)',
  series: Cs.map((C) => ({ name: `C = ${C === Cref ? Cref.toFixed(1) : C}`, kind: 'line', x: xs.map(invT), y: xs.map((c) => Math.log10(carry(T0, T1, TK(c), C))) })),
  xDomain: [invT(700), invT(600)], vlines: [{ x: invT(650), text: 'test, 650 °C', left: true }, { x: invT(600), text: '600 °C', left: true, dy: 16 }],
  desc: `Each line is log rupture time against 1/T through the same 10 000 h rupture at 650 C. At 600 C the three lines give ${Math.round(carry(T0, T1, T2, 16) / 1000)}, ${Math.round(carry(T0, T1, T2, Cref) / 1000)} and ${Math.round(carry(T0, T1, T2, 21) / 1000)} thousand hours.`,
  height: 266,
});

// Figure 2: how much the carried-over life moves with C, for four test temperatures.
const dC = Array.from({ length: 61 }, (_, i) => -6 + i * 0.2);
const fig2 = chart({
  title: 'Life error from getting C wrong (service 600 °C)', xLabel: 'Error in C', yLabel: 'Life ratio',
  series: [625, 650, 675, 700].map((c) => ({ name: `test at ${c} °C`, kind: 'line', x: dC, y: dC.map((d) => 10 ** (d * (TK(c) / T2 - 1))) })),
  xDomain: [-6, 6], yDomain: [0, 5], hlines: [{ y: 1, text: '' }],
  desc: `The ratio is 10 to the power of the C error times (T_test/T_service - 1), so a 3-unit error in C changes the life by ${(10 ** (3 * (TK(650) / T2 - 1))).toFixed(2)} times for a 650 C test and ${(10 ** (3 * (TK(700) / T2 - 1))).toFixed(2)} times for a 700 C test.`,
  height: 266,
});

console.log(JSON.stringify({ worked: worked.map((w) => ({ C: w.C, t: Math.round(w.t) })), sens, master: { a: Math.round(aInt), b: Math.round(bSlope) }, SET, fits, best }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'isostress', figure(fig1, 'Figure 1. The same measured rupture (10 000 h at 650 °C) carried down to 600 °C with three Larson-Miller constants. A single Larson-Miller parameter makes log rupture time a straight line in 1/T, which is what the paper measured; the constant C sets how steeply the line falls, so the three lines agree at the test temperature and disagree at the service temperature.'));
  md = inject(md, 'ratio', figure(fig2, 'Figure 2. How wrong the extrapolated life is when C is wrong by a given amount, for a service temperature of 600 °C and tests at four temperatures. The ratio does not depend on the rupture time, only on the two temperatures and the error in C.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
