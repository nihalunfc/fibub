// Figures for src/blog/discoveries/concrete-block-retaining-wall-lab-model-sliding-overturning-safety-factors.md, made with
// the maths of the Retaining wall stability tool (src/lib/sci/eng-retwall.ts: Rankine Ka, thrust, sliding and overturning).
// Run: node scripts/blog-figures/concrete-block-retaining-wall-lab-model-sliding-overturning-safety-factors.mjs
import fs from 'node:fs';
import { rankineKa, retainingWall } from '../../src/lib/sci/eng-retwall.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/concrete-block-retaining-wall-lab-model-sliding-overturning-safety-factors.md', import.meta.url);

// Inputs printed by Mazni et al. (2021), E3S Web of Conferences 331: 05013, doi:10.1051/e3sconf/202133105013 (CC BY 4.0):
// dry sand, cohesion 0, friction angle 31.699 deg, unit weight 1.47 g/cm3 (Table 2), blocks 2.20 g/cm3, wall height 40 cm,
// level backfill. Their results: Ka 0.311, Pa 365.74, sum V 990.75, MR 11469.38, MO 4875.26, SF sliding 1.05, overturning 2.35.
const P = { phi: 31.699, gSoil: 1.47, gBlock: 2.2, H: 40, Ka: 0.311, Pa: 365.74, sumV: 990.75, MR: 11469.38, MO: 4875.26, fsS: 1.05, fsO: 2.35 };
const G = 9.80665; // g/cm3 -> kN/m3 is x9.80665; model scale, so 1 cm = 0.01 m
const ph = P.phi, gam = P.gSoil * G, gc = P.gBlock * G, H = P.H / 100;
// OUR assumptions: base friction coefficient tan(2/3 phi), the value that reproduces the paper's sliding factor; level backfill, dry, no surcharge.
const mu = Math.tan((2 / 3) * ph * Math.PI / 180);
const base = { H, tTop: 0, tBot: 0, tb: 0, toe: 0, heel: 0, gc, gamma: gam, gsat: gam + 5, phi: ph, beta: 0, method: 'rankine', delta: 0, q: 0, hw: 0, uplift: false, mu, Df: 0, usePassive: false };
const wall = (t, o = {}) => retainingWall({ ...base, tTop: t, tBot: t, ...o });

const Ka = rankineKa(ph);
const Pa = 0.5 * Ka * P.gSoil * P.H * P.H, MO = Pa * P.H / 3;       // g per cm of wall, g.cm per cm
const Pa2 = 0.5 * P.Ka * P.gSoil * P.H * P.H;
const armImplied = P.MR / P.sumV, tEq = P.sumV / (P.gBlock * P.H);    // cm
const muImplied = (P.fsS * Pa) / P.sumV;
const fsOTarget = P.MR / P.MO;
const eq = wall(tEq / 100);
function need(key, target) { let lo = 0.02, hi = 2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (wall(m)[key] < target ? lo = m : hi = m); } return hi; }
const t15s = need('fsSliding', 1.5), t25o = need('fsOverturning', 2.5), t15o = need('fsOverturning', 1.5);

const ts = Array.from({ length: 41 }, (_, i) => 0.08 + i * 0.0025);
const fig1 = chart({
  title: 'Safety factors of a block wall 40 cm high', xLabel: 'Wall width (cm)', yLabel: 'Safety factor',
  series: [
    { name: 'Sliding', x: ts.map((t) => t * 100), y: ts.map((t) => wall(t).fsSliding), label: { text: 'sliding', anchor: 'end', dx: -4, dy: 14 } },
    { name: 'Overturning', x: ts.map((t) => t * 100), y: ts.map((t) => wall(t).fsOverturning), colour: 'var(--c-tools)', label: { text: 'overturning', anchor: 'end', dx: -4, dy: -6 } },
    { name: 'Paper', kind: 'dots', x: [tEq, tEq], y: [P.fsS, P.fsO], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [8, 18], yDomain: [0, 4.5], hlines: [{ y: 1.5, text: 'target 1.5 (paper)' }, { y: 2.5, text: 'target 2.5 (paper)' }],
  desc: 'Sliding and overturning safety factors of a rectangular 40 cm block gravity wall against its width, with the paper’s two reported factors marked at the equivalent width of 11.26 cm and its 1.5 and 2.5 targets as dashed lines.',
});
const phis = Array.from({ length: 31 }, (_, i) => 26 + i * 0.5);
const fig2 = chart({
  title: 'Same wall, different sand', xLabel: 'Backfill friction angle φ (°)', yLabel: 'Safety factor',
  series: [
    { name: 'Sliding', x: phis, y: phis.map((f) => wall(tEq / 100, { phi: f, mu: Math.tan((2 / 3) * f * Math.PI / 180) }).fsSliding) },
    { name: 'Overturning', x: phis, y: phis.map((f) => wall(tEq / 100, { phi: f, mu: Math.tan((2 / 3) * f * Math.PI / 180) }).fsOverturning), colour: 'var(--c-tools)' },
  ],
  xDomain: [26, 41], yDomain: [0, 3], hlines: [{ y: 1.5, text: 'target 1.5' }],
  desc: 'Sliding and overturning safety factors of the 11.26 cm wide model wall against the friction angle of the sand behind it.',
});
const at = (f) => wall(tEq / 100, { phi: f, mu: Math.tan((2 / 3) * f * Math.PI / 180) });
const out = {
  Ka, KaPaper: P.Ka, Pa, Pa_with_paperKa: Pa2, MO, tEq, armImplied, mu, muImplied, fsOTarget,
  eqS: eq.fsSliding, eqO: eq.fsOverturning, eqSumV_kNperm: eq.sumV, eqSumH_kNperm: eq.sumH, eqMr: eq.Mr, eqMo: eq.Mo,
  t15s: t15s * 100, t25o: t25o * 100, t15o: t15o * 100,
  w10: wall(0.10).fsSliding, w10o: wall(0.10).fsOverturning, w17: wall(0.17).fsSliding, w17o: wall(0.17).fsOverturning,
  phi36S: at(36).fsSliding, phi36O: at(36).fsOverturning, phi26S: at(26).fsSliding, phi26O: at(26).fsOverturning,
  phi40S: at(40).fsSliding,
};
console.log(JSON.stringify(out, (k, v) => typeof v === 'number' ? +v.toPrecision(5) : v));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'width', figure(fig1, 'Figure 1. Sliding and overturning safety factors of a plain rectangular block wall 40 cm high against its width, computed with the Retaining wall stability tool for the paper’s sand. Dots: the paper’s two reported factors, placed at the 11.26 cm equivalent width its vertical load implies. Dashed lines: the paper’s 1.5 and 2.5 targets.'));
  md = inject(md, 'sand', figure(fig2, 'Figure 2. The same 11.26 cm wide wall behind sands of different friction angle (wall base friction set to tan of two thirds of φ, our assumption).'));
  fs.writeFileSync(ART, md);
  console.log('Charts:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
