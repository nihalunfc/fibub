// Figures for src/blog/discoveries/cylindrical-roller-thrust-bearing-spin-to-roll-reduction-factor-l10-life.md,
// made with the maths of the Bearing life calculator (src/lib/sci/eng-shaft.ts: L10 = (C/P)^p, hours, required C).
// Run: node scripts/blog-figures/cylindrical-roller-thrust-bearing-spin-to-roll-reduction-factor-l10-life.mjs
import fs from 'node:fs';
import { L10, hours, requiredC } from '../../src/lib/sci/eng-shaft.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cylindrical-roller-thrust-bearing-spin-to-roll-reduction-factor-l10-life.md', import.meta.url);

// Inputs from the paper: Sauvage, Terwey, Lehmann and Jacobs (2025), Lubricants 13(2): 65, doi:10.3390/lubricants13020065
// (CC BY): eta = 0.85 (ISO/TR 1281-1 at a 90° contact angle) and 0.91 (their revised value), stated life reductions
// 42 % and 27 %; the ISO fit eta(alpha) = 1 - 0.15 sin(alpha), 0.89 at 48°; reference speed about 150 rpm.
// Our assumption for the worked example: C = 2000 kN without the reduction, axial load P = 500 kN, 150 rpm.
const ROLLER = 10 / 3, BALL = 3;
const lifeShare = (eta, p) => L10(eta, 1, p); // (eta C / P)^p ÷ (C / P)^p
const ETAS = [0.85, 0.91];
const rows = ETAS.map((eta) => ({ eta, roller: lifeShare(eta, ROLLER), ball: lifeShare(eta, BALL), cUp: 1 / eta }));
const C0 = 2000, P = 500, RPM = 150;
const ex = [1, ...ETAS].map((eta) => { const C = C0 * eta, L = L10(C, P, ROLLER); return { eta, C, L, h: hours(L, RPM) }; });
const keepLife = ETAS.map((eta) => requiredC(P, L10(C0, P, ROLLER), ROLLER) / eta);

const E = Array.from({ length: 41 }, (_, i) => +(0.8 + i * 0.005).toFixed(3));
const fig1 = chart({
  title: 'Life left after a load-rating reduction η', xLabel: 'Reduction factor η (share of C kept)', yLabel: 'L10 life, % of unreduced',
  series: [
    { name: 'Roller bearing, p = 10/3', kind: 'line', x: E, y: E.map((e) => +(100 * lifeShare(e, ROLLER)).toFixed(2)) },
    { name: 'Ball bearing, p = 3', kind: 'line', x: E, y: E.map((e) => +(100 * lifeShare(e, BALL)).toFixed(2)), dash: '5 4' },
    { name: '', noLegend: true, kind: 'dots', x: ETAS, y: rows.map((r) => +(100 * r.roller).toFixed(2)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0.8, 1], yDomain: [40, 100],
  vlines: rows.map((r, k) => ({ x: r.eta, text: `η ${r.eta}: ${(100 * r.roller).toFixed(1)} %`, left: k === 0, dy: k * 16 })),
  desc: `Share of the L10 life left when the load rating is multiplied by η. For a roller bearing, η 0.85 leaves ${(100 * rows[0].roller).toFixed(1)} % and η 0.91 leaves ${(100 * rows[1].roller).toFixed(1)} %.`, height: 270,
});
const A = Array.from({ length: 46 }, (_, i) => 45 + i);
const fig2 = chart({
  title: 'ISO/TR 1281-1 reduction against contact angle', xLabel: 'Contact angle α (degrees)', yLabel: 'Share (%)',
  series: [
    { name: 'η = 1 − 0.15 sin α', kind: 'line', x: A, y: A.map((a) => +(100 * (1 - 0.15 * Math.sin(a * Math.PI / 180))).toFixed(2)) },
    { name: 'L10 life left (p = 10/3)', kind: 'line', x: A, y: A.map((a) => +(100 * lifeShare(1 - 0.15 * Math.sin(a * Math.PI / 180), ROLLER)).toFixed(2)) },
  ],
  xDomain: [45, 90], yDomain: [50, 100], hlines: [{ y: 100 * rows[1].roller, text: `revised η 0.91: ${(100 * rows[1].roller).toFixed(0)} % life` }],
  desc: `The ISO reduction factor falls from 0.894 at 45 degrees to 0.85 at 90 degrees, and the roller life left from ${(100 * lifeShare(1 - 0.15 * Math.sin(Math.PI / 4), ROLLER)).toFixed(0)} % to ${(100 * rows[0].roller).toFixed(0)} %.`, height: 260,
});

console.log(JSON.stringify({ rows: rows.map((r) => ({ eta: r.eta, rollerLeft: +(100 * r.roller).toFixed(2), rollerCut: +(100 - 100 * r.roller).toFixed(2), ballCut: +(100 - 100 * r.ball).toFixed(2), cUp: +(100 * (r.cUp - 1)).toFixed(1) })), ex: ex.map((x) => ({ eta: x.eta, C: x.C, L: +x.L.toFixed(2), h: Math.round(x.h) })), keepLife: keepLife.map((c) => Math.round(c)), at45: +(100 * lifeShare(1 - 0.15 * Math.SQRT1_2, ROLLER)).toFixed(1) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'life', figure(fig1, 'Figure 1. Share of the basic rating life L10 that is left when the dynamic load rating is multiplied by a reduction factor η, from the Bearing life calculator\'s L10 = (C/P)^p. Dots: the paper\'s ISO value 0.85 and revised value 0.91. The dashed ball-bearing curve is for comparison only.'));
  md = inject(md, 'angle', figure(fig2, 'Figure 2. The ISO/TR 1281-1 reduction factor for thrust roller bearings, η = 1 − 0.15 sin α, as the paper writes it, and the roller-bearing life it leaves, between a 45° and a 90° contact angle.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
