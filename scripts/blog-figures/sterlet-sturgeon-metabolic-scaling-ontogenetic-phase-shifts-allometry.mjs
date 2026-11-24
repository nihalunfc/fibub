// Figures for src/blog/discoveries/sterlet-sturgeon-metabolic-scaling-ontogenetic-phase-shifts-allometry.md, made with the
// maths of the Allometry calculator (src/lib/sci/allomfit.ts: log-log least squares, exponent tests).
// Run: node scripts/blog-figures/sterlet-sturgeon-metabolic-scaling-ontogenetic-phase-shifts-allometry.mjs
import fs from 'node:fs';
import { fitAllometry, testExponent } from '../../src/lib/sci/allomfit.ts';
import { tTwoSided } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sterlet-sturgeon-metabolic-scaling-ontogenetic-phase-shifts-allometry.md', import.meta.url);

// Inputs from the paper: Kim (2025), Hydrobiology 4(3): 24, doi:10.3390/hydrobiology4030024 (CC BY).
// Three growth phases with their mass ranges (g) and fish numbers; common within-phase exponent 0.608; phase
// constants a1 2.17, a2 2.38, a3 3.77 (R in µL O2 per fish per minute, M in g); residual mean square 0.00392 (log10).
const B = 0.608, S = Math.sqrt(0.00392);
const PH = [{ id: 'Phase 1', n: 5, lo: 0.0241, hi: 0.1051, a: 2.17 }, { id: 'Phase 2', n: 10, lo: 0.2884, hi: 0.6131, a: 2.38 }, { id: 'Phase 3', n: 14, lo: 0.6438, hi: 2.6368, a: 3.77 }];
// Each phase's own fit as stated in the paper (b ± SEM, n), for recomputing its tests against 1 and 3/4.
const PAPER = [{ id: 'Phase 1', b: 0.638, se: 0.077, n: 5, p1: 1.85e-2 }, { id: 'Phase 2', b: 0.54, se: 0.096, n: 10, p1: 1.35e-3 }, { id: 'Phase 3', b: 0.609, se: 0.106, n: 14, p1: 3.04e-3 }, { id: 'All fish', b: 0.763, se: 0.031, n: 30, p1: 2.16e-8 }];
const paperTests = PAPER.map((p) => { const t1 = (p.b - 1) / p.se, t75 = (p.b - 0.75) / p.se; return { ...p, t1, pTo1: tTwoSided(Math.abs(t1), p.n - 2), t75, pTo75: tTwoSided(Math.abs(t75), p.n - 2) }; });

// SIMULATED fish (our assumption): masses spread evenly on a log scale across each phase's range, R = a_i M^0.608
// times a random log10 scatter with the paper's residual SD (0.0626).
let seed = 24; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const sim = PH.map((p) => { const M = Array.from({ length: p.n }, (_, i) => +(p.lo * (p.hi / p.lo) ** (i / (p.n - 1))).toPrecision(4)); return { ...p, M, R: M.map((m) => +(p.a * m ** B * 10 ** (S * gauss())).toPrecision(4)) }; });
const exact = PH.map((p) => { const M = Array.from({ length: p.n }, (_, i) => p.lo * (p.hi / p.lo) ** (i / (p.n - 1))); return { M, R: M.map((m) => p.a * m ** B) }; });
const fits = sim.map((s) => fitAllometry(s.M, s.R));
const all = fitAllometry(sim.flatMap((s) => s.M), sim.flatMap((s) => s.R));
const allExact = fitAllometry(exact.flatMap((s) => s.M), exact.flatMap((s) => s.R));
const t75 = testExponent(all, 0.75), t1 = testExponent(all, 1), tw = fits.map((f) => [testExponent(f, 0.75), testExponent(f, 1)]);

// Figure 1: log-log plot, each phase with its own line, and the single line through all fish.
const L = Math.log10, ln = (lo, hi, a, b) => { const xs = [L(lo), L(hi)]; return { x: xs, y: xs.map((x) => +(L(a) + b * x).toFixed(4)) }; };
const dec = (v) => ({ '-2': '0.01', '-1.5': '0.03', '-1': '0.1', '-0.5': '0.3', '0': '1', '0.5': '3', '1': '10' }[String(v)] ?? '');
const fig1 = chart({
  title: 'Sterlet oxygen use against body mass (simulated)', xLabel: 'Body mass M (g), log scale', yLabel: 'R (µL O₂ per min), log scale',
  series: [
    ...sim.map((s, i) => ({ name: s.id, kind: 'dots', x: s.M.map((m) => +L(m).toFixed(4)), y: s.R.map((r) => +L(r).toFixed(4)), size: 3, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
    ...sim.map((s, i) => ({ name: '', noLegend: true, kind: 'line', ...ln(s.lo, s.hi, fits[i].a, fits[i].b), colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
    { name: 'One line through all', kind: 'line', ...ln(0.02, 3, all.a, all.b), colour: 'var(--muted)', dash: '5 4' },
  ],
  xDomain: [-1.75, 0.5], yDomain: [-0.75, 1], xTicks: [-1.5, -1, -0.5, 0, 0.5], yTicks: [-0.5, 0, 0.5, 1], xFmt: dec, yFmt: dec,
  desc: `Simulated sterlet from the paper's three phases: each phase rises with slope near ${B}, but each sits higher than the last, so one line through all fish has a steeper slope of ${all.b.toFixed(3)}.`, height: 290,
});

// Figure 2: fitted exponents with 95 % limits: the paper's own values (b ± t·SEM) and our simulated fits.
const tcrit = (n) => { let lo = 0, hi = 50; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; tTwoSided(m, n - 2) > 0.05 ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const fig2 = chart({
  title: 'Scaling exponent b with 95 % limits', xLabel: '1, 2, 3 = growth phase; 4 = all fish in one line', yLabel: 'Exponent b',
  series: [
    { name: 'Paper (b ± t × SEM)', kind: 'dots', x: [0.9, 1.9, 2.9, 3.9], y: PAPER.map((p) => p.b), errors: PAPER.map((p) => +(tcrit(p.n) * p.se).toFixed(3)), size: 3.5 },
    { name: 'Our simulated fits', kind: 'dots', x: [1.1, 2.1, 3.1, 4.1], y: [...fits, all].map((f) => +f.b.toFixed(3)), errors: [...fits, all].map((f) => +(f.tCrit * f.seB).toFixed(3)), size: 3.5 },
  ],
  xDomain: [0.5, 4.5], yDomain: [-0.1, 1.3], xTicks: [1, 2, 3, 4], hlines: [{ y: 1, text: 'isometry, b = 1' }, { y: 0.75, text: 'b = 3/4' }],
  desc: 'Each phase alone has an exponent near 0.6, with wide limits from few fish; all fish together give near 0.76, close to 3/4 but driven by the jumps between phases.', height: 270,
});

const r3 = (v) => +v.toFixed(3);
console.log(JSON.stringify({
  paperTests: paperTests.map((p) => ({ id: p.id, paperP1: p.p1, t1: r3(p.t1), pTo1: +p.pTo1.toPrecision(3), t75: r3(p.t75), pTo75: +p.pTo75.toPrecision(3), half: r3(tcrit(p.n) * p.se) })),
  fits: fits.map((f, i) => ({ id: PH[i].id, b: r3(f.b), se: r3(f.seB), lo: r3(f.bLo), hi: r3(f.bHi), a: r3(f.a), r2: +f.r2.toFixed(3), p75: +tw[i][0].p.toPrecision(3), p1: +tw[i][1].p.toPrecision(3) })),
  all: { b: r3(all.b), se: r3(all.seB), lo: r3(all.bLo), hi: r3(all.bHi), a: r3(all.a), r2: +all.r2.toFixed(3), p75: +t75.p.toPrecision(3), p1: +t1.p.toPrecision(3) },
  allExact: { b: +allExact.b.toFixed(4), a: r3(allExact.a), r2: +allExact.r2.toFixed(4) }, ratio31: r3(3.77 / 2.17),
  phase3: sim[2].M.map((m, i) => `${m}, ${sim[2].R[i]}`).join(' | '),
}));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'loglog', figure(fig1, 'Figure 1. Simulated sterlet built from the paper\'s phase constants, common exponent and scatter, with each phase\'s fitted line and one line through all fish (dashed), from the Allometry calculator\'s maths. Not the paper\'s measurements.'));
  md = inject(md, 'exponents', figure(fig2, 'Figure 2. Exponents with 95 % limits: the paper\'s stated values (b ± t × SEM) next to the Allometry calculator\'s fits to our simulated fish. Isometry (b = 1) and Kleiber\'s 3/4 are dashed.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
