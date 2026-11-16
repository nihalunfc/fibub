// Figures for src/blog/discoveries/nuri-derived-smallsat-launch-vehicle-staging-delta-v.md, made with the maths of the
// Rocket equation calculator (src/lib/sci/orbit.ts: staging() and BODIES).
// Run: node scripts/blog-figures/nuri-derived-smallsat-launch-vehicle-staging-delta-v.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { staging, BODIES, G0 } from '../../src/lib/sci/orbit.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/nuri-derived-smallsat-launch-vehicle-staging-delta-v.md', import.meta.url);

// Inputs. "Paper": Seo and Kim (2026), Aerospace 13(9), 801, doi:10.3390/aerospace13090801 (CC BY).
const ISP1 = 299.8, ISP2 = 360;          // s, paper
const DRY1 = 4000, SI1 = 0.086;          // kg and structural index (dry / stage mass), paper (staging design)
const DRY2 = 677, PROP2 = 4700;          // kg, paper (staging design); index 12.6% follows
const FAIRING = 300, PAYLOAD = 500;      // kg, paper
const DV_NEED = 10500, DV1_P = 4830, DV2_P = 5670; // m/s, paper's budget and split
const MAX_GLOM = 53240;                  // kg, paper (largest lift-off mass allowed by thrust-to-weight 1.3)
const ALT = 500;                         // km, paper (target orbit)
// Our derivation: the first stage's propellant from its dry mass and structural index (the paper's mass table was
// not available to us). Our simplification: the fairing leaves with the first stage.
const PROP1 = DRY1 / SI1 - DRY1;
const STAGES = [{ name: 'Stage 1 (+ fairing)', dry: DRY1 + FAIRING, prop: PROP1, isp: ISP1 }, { name: 'Stage 2', dry: DRY2, prop: PROP2, isp: ISP2 }];
const r = staging(STAGES, PAYLOAD);
const E = BODIES.find((b) => b.id === 'earth'), vOrbit = Math.sqrt(E.mu / (E.radius + ALT)) * 1000;
let lo = 0, hi = 3000; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (staging(STAGES, m).dv > DV_NEED) lo = m; else hi = m; }
const plAtNeed = lo;

// Figure 1: total delta-v against payload for the staging-design vehicle.
const pls = Array.from({ length: 61 }, (_, i) => i * 25);
const fig1 = chart({
  title: 'Delta-v against payload, staging-design vehicle', xLabel: 'Payload (kg)', yLabel: 'Total delta-v (km/s)',
  series: [{ name: 'Delta-v', kind: 'line', x: pls, y: pls.map((p) => +(staging(STAGES, p).dv / 1000).toFixed(4)) }],
  yDomain: [9.6, 11.2], hlines: [{ y: DV_NEED / 1000, text: 'budget 10.5 km/s' }], vlines: [{ x: PAYLOAD, text: '500 kg' }],
  desc: `Delta-v falls as payload grows; the curve crosses the 10.5 km/s budget at about ${Math.round(plAtNeed)} kg.`, height: 280,
});

// Figure 2: how the split of the 10.5 km/s between the stages changes the lift-off mass, at the paper's structural
// indexes. For each stage, stage mass ms = m_above (R − 1)/(1 − s R) with R = e^(Δv/ve) (rocket equation solved for
// the stage), then checked with staging().
const SI2 = DRY2 / (DRY2 + PROP2);
function sizeFor(dv2) {
  const stage = (dv, isp, s, above) => { const R = Math.exp(dv / (isp * G0)), ms = (above * (R - 1)) / (1 - s * R); return ms > 0 ? { dry: s * ms, prop: (1 - s) * ms } : null; };
  const s2 = stage(dv2, ISP2, SI2, PAYLOAD); if (!s2) return NaN;
  const s1 = stage(DV_NEED - dv2, ISP1, SI1, PAYLOAD + s2.dry + s2.prop + FAIRING); if (!s1) return NaN;
  const chk = staging([{ name: '1', dry: s1.dry + FAIRING, prop: s1.prop, isp: ISP1 }, { name: '2', dry: s2.dry, prop: s2.prop, isp: ISP2 }], PAYLOAD);
  if (Math.abs(chk.dv - DV_NEED) > 1e-6) throw new Error('sizing check failed');
  return chk.liftoff;
}
const splits = Array.from({ length: 33 }, (_, i) => 4600 + i * 50);
const glom = splits.map(sizeFor);
let best = 0; glom.forEach((g, i) => { if (g < glom[best]) best = i; });
const fig2 = chart({
  title: 'Lift-off mass for each way of splitting 10.5 km/s', xLabel: 'Delta-v given to the second stage (km/s)', yLabel: 'Lift-off mass (tonnes)',
  series: [{ name: 'Lift-off mass', kind: 'line', x: splits.map((s) => s / 1000), y: glom.map((g) => +(g / 1000).toFixed(3)) }],
  yDomain: [50, 66], vlines: [{ x: DV2_P / 1000, text: 'paper 5.67' }], hlines: [{ y: MAX_GLOM / 1000, text: 'limit 53.2 t' }],
  desc: `Lift-off mass is lowest, about ${(glom[best] / 1000).toFixed(1)} tonnes, when the second stage gives ${(splits[best] / 1000).toFixed(2)} km/s; the paper's 5.67 km/s split needs ${(sizeFor(DV2_P) / 1000).toFixed(1)} tonnes.`, height: 280,
});

const k = (x) => Math.round(x);
console.log(JSON.stringify({ PROP1: k(PROP1), SI2: +SI2.toFixed(4), stages: r.stages.map((s) => ({ m0: k(s.m0), mf: k(s.mf), ratio: +s.ratio.toFixed(4), ve: +s.ve.toFixed(1), dv: k(s.dv) })), liftoff: k(r.liftoff), dv: k(r.dv), pf: +(r.payloadFraction * 100).toFixed(3), vOrbit: k(vOrbit), plAtNeed: k(plAtNeed), best: { dv2: splits[best], glom: k(glom[best]) }, atPaperSplit: k(sizeFor(DV2_P)), dv1check: DV1_P }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'payload', figure(fig1, 'Figure 1. Total ideal delta-v of the paper\'s staging-design vehicle against payload, from the Rocket equation calculator\'s staging maths. First-stage propellant worked out from the paper\'s structural index; fairing dropped with the first stage.'));
  md = inject(md, 'split', figure(fig2, 'Figure 2. Lift-off mass needed for 10.5 km/s and a 500 kg payload, for each split of the delta-v between the stages, at the paper\'s engines and structural indexes (each design checked with the calculator\'s staging maths).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
