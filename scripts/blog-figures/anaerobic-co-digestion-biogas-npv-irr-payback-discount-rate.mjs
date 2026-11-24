// Figures for src/blog/discoveries/anaerobic-co-digestion-biogas-npv-irr-payback-discount-rate.md, made with the
// maths of the NPV and IRR tool (src/lib/sci/npv.ts: npv, irrAll, payback, mirr, profitabilityIndex).
// Run: node scripts/blog-figures/anaerobic-co-digestion-biogas-npv-irr-payback-discount-rate.mjs
import fs from 'node:fs';
import { npv, irrAll, payback, mirr, profitabilityIndex, equivalentAnnuity } from '../../src/lib/sci/npv.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/anaerobic-co-digestion-biogas-npv-irr-payback-discount-rate.md', import.meta.url);

// From the paper: Gao, Li and Zhang (2025), Energies 18(21): 5632 (CC BY 4.0).
// NPV GBP 19 million, IRR 36 %, payback 3 years, net revenues GBP 4.0 million a year (membrane upgrading).
const A = 4.0, NPV_PAPER = 19, IRR_PAPER = 0.36, PB_PAPER = 3, LIFE = 20; // LIFE is OUR assumption

// A project with level cash flows and a simple payback of P periods has capital cost P x A, so however long it
// runs its IRR cannot pass 1 / P. Here that ceiling is 1 / 3 = 33.33 %, below the paper's 36 %.
const level = (n, P = PB_PAPER) => [-P * A, ...Array.from({ length: n }, () => A)];
// With cash flows that grow at g a year, a 3-year payback needs capital cost A (1 + (1+g) + (1+g)²).
const grow = (n, g) => [-A * (1 + (1 + g) + (1 + g) ** 2), ...Array.from({ length: n }, (_, t) => A * (1 + g) ** t)];
const irrOf = (cf) => (irrAll(cf)[0] ?? NaN);
const bisect = (f, lo, hi, target) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; f(m) < target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

const G = bisect((g) => irrOf(grow(LIFE, g)), -0.2, 0.5, IRR_PAPER);     // growth that gives IRR = 36 %
const CF = grow(LIFE, G), C = -CF[0];
const R = bisect((r) => -npv(r, CF), 0, 1, -NPV_PAPER);                  // discount rate that gives NPV = 19
const best = { g: G, capex: C, rate: R };

// Rounded version a reader can type into the tool (GBP million, 2 decimals).
const TYPED = CF.map((x) => +x.toFixed(2));

// Figure 1: IRR against project life, level flows against flows growing at G, both with a 3-year payback.
const NS = Array.from({ length: 29 }, (_, i) => i + 2);
const fig1 = chart({
  title: 'A 3-year payback puts a ceiling on the IRR', xLabel: 'Project life (years)', yLabel: 'IRR (% a year)',
  series: [
    { name: 'Level cash flows', kind: 'line', x: NS, y: NS.map((n) => +(100 * irrOf(level(n))).toFixed(3)) },
    { name: `Growing ${(100 * G).toFixed(1)} % a year`, kind: 'line', x: NS, y: NS.map((n) => +(100 * irrOf(grow(n, G))).toFixed(3)) },
  ],
  xDomain: [2, 30], yDomain: [-10, 42],
  hlines: [{ y: 100 / PB_PAPER, text: 'ceiling 33.3 %' }, { y: 100 * IRR_PAPER, text: "the paper's 36 %" }],
  desc: `Internal rate of return against project life for a plant whose simple payback is 3 years. With level cash flows the IRR can never pass 33.3 %; with cash flows growing ${(100 * G).toFixed(1)} % a year it reaches the paper's 36 % at 20 years.`,
  height: 290,
});

// Figure 2: the NPV profile of the reconstructed cash flow.
const RS = Array.from({ length: 101 }, (_, i) => i * 0.005);
const fig2 = chart({
  title: 'NPV profile of the reconstructed project', xLabel: 'Discount rate (% a year)', yLabel: 'NPV (GBP million)',
  series: [{ name: '', noLegend: true, kind: 'line', x: RS.map((r) => 100 * r), y: RS.map((r) => +npv(r, CF).toFixed(3)) }],
  xDomain: [0, 50], yDomain: [-5, 60],
  hlines: [{ y: 0, text: '' }, { y: NPV_PAPER, text: "the paper's NPV, GBP 19 m" }],
  vlines: [{ x: +(100 * R).toFixed(2), text: `${(100 * R).toFixed(1)} %` }, { x: 36, text: 'IRR 36 %', left: true }],
  desc: `Net present value of the reconstructed 20-year cash flow against the discount rate. It passes GBP 19 million at ${(100 * R).toFixed(1)} % and zero at the 36 % internal rate of return.`,
  height: 290,
});

console.log(JSON.stringify({
  solved: { growth: +(100 * G).toFixed(2), capex: +C.toFixed(3), rateForNpv19: +(100 * R).toFixed(2) },
  check: { irr: +(100 * irrOf(CF)).toFixed(3), payback: +payback(CF).toFixed(4), npvAtR: +npv(R, CF).toFixed(3), discPayback: +payback(CF, R).toFixed(3), pi: +profitabilityIndex(R, CF).toFixed(3), mirr: +(100 * mirr(CF, R, R)).toFixed(2), eaa: +equivalentAnnuity(R, CF).toFixed(3) },
  typed: { cf: TYPED, irr: +(100 * irrOf(TYPED)).toFixed(3), npv15: +npv(0.15, TYPED).toFixed(3), npvAtR: +npv(R, TYPED).toFixed(3), payback: +payback(TYPED).toFixed(4), discPayback15: +payback(TYPED, 0.15).toFixed(3), pi15: +profitabilityIndex(0.15, TYPED).toFixed(3), mirr15: +(100 * mirr(TYPED, 0.15, 0.15)).toFixed(2), eaa15: +equivalentAnnuity(0.15, TYPED).toFixed(3) },
  ceilings: [2, 2.5, 3, 3.5, 4, 5].map((P) => ({ payback: P, irrAt60y: +(100 * irrOf([-P * A, ...Array(60).fill(A)])).toFixed(3), oneOverP: +(100 / P).toFixed(3) })),
  levelAt20: +(100 * irrOf(level(20))).toFixed(3),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ceiling', figure(fig1, 'Figure 1. What a three-year simple payback allows. Worked out with the NPV and IRR tool’s own `irrAll` function for project lives of 2 to 30 years.'));
  md = inject(md, 'profile', figure(fig2, 'Figure 2. The NPV profile of the 20-year cash flow that reproduces all three of the paper’s headline numbers at once. The dashed verticals mark the discount rate that gives GBP 19 million and the 36 % internal rate of return.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
