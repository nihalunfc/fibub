// Figures and numbers for src/blog/discoveries/polyoxometalate-buffer-capacity-tris-hepes-phosphate-acetate-citrate-ph-drop.md,
// made with the maths of the Buffer recipe calculator (src/lib/sci/buffer.ts: BUFFERS, oneForm, pHOf, pHAtOtherT, pKaApparent, betaMaxSingle).
// Run: node scripts/blog-figures/polyoxometalate-buffer-capacity-tris-hepes-phosphate-acetate-citrate-ph-drop.mjs
import fs from 'node:fs';
import { BUFFERS, oneForm, pHOf, pHAtOtherT, pKaApparent, betaMaxSingle } from '../../src/lib/sci/buffer.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/polyoxometalate-buffer-capacity-tris-hepes-phosphate-acetate-citrate-ph-drop.md', import.meta.url);
const B = (id) => BUFFERS.find((b) => b.id === id);
const form = (id, name) => B(id).forms.find((x) => x.name.startsWith(name));

// Stated in the paper (facts): five 0.1 M buffers: acetate pH 4 to 5.5, citrate pH 3 to 6.5, sodium phosphate pH 2 to 8,
// Tris-HCl pH 7 to 8 and HEPES pH 7 to 8; cited pKa values acetate 4.76, citrate 3.13/4.76/6.40, phosphate 2.15/6.86,
// Tris 8.06, HEPES 7.5; polyoxometalate solutions at 3 mM and 15 mM; measurement at 25 C, incubation 24 h at 37 C;
// pH drops "up to 2.5 units" (15 mM P2W18 from pH 8) and "up to 5 units" (PW12 in Tris-HCl).
const C = 0.1, T = 25;
// The buffer starting forms (our choice of how to reach a pH; the pH state is the same for any recipe).
const START = { acetate: 'Acetic acid', citrate: 'Citric acid, anhydrous', phosphate: 'Sodium dihydrogen phosphate, anhydrous', tris: 'Tris base', hepes: 'HEPES (free acid)' };
const stateOf = (id, pH, t = T) => oneForm(B(id), form(id, START[id]), pH, t, C, 1, 1).state;
const betaRel = (id, pH, t = T) => stateOf(id, pH, t).beta / betaMaxSingle(C);

const pHs = Array.from({ length: 71 }, (_, i) => 2 + i * 0.1);
const SERIES = [['acetate', 'Acetate', 'var(--c-blog)'], ['citrate', 'Citrate', 'var(--c-tools)'], ['phosphate', 'Phosphate', 'var(--ink)'], ['tris', 'Tris', 'var(--muted)'], ['hepes', 'HEPES', 'var(--c-blog)']];
const fig1 = chart({
  title: 'Buffer capacity of five 0.1 M buffers', xLabel: 'pH', yLabel: 'Buffer capacity β (mol/(L·pH))',
  desc: 'Buffer capacity against pH at 25 degrees Celsius for 0.1 molar acetate, citrate, phosphate, Tris and HEPES, from the buffer recipe calculator. Each buffer works only within about one pH unit of a pKa; phosphate has almost no capacity between pH 3.5 and 5.5.',
  series: SERIES.map(([id, name, c], i) => ({ name, x: pHs, y: pHs.map((p) => stateOf(id, p).beta), kind: 'line', colour: c, dash: i === 4 ? '5 3' : undefined })),
  xDomain: [2, 9], yDomain: [0, 0.14],
});

// pH after adding x mM strong acid (e.g. protons released by a dissolving acid) to a 0.1 M buffer made at pH 8.0.
function pHAfterAcid(id, pH0, x /* mol/L */) {
  const r = oneForm(B(id), form(id, START[id]), pH0, T, C, 1, 1), s = r.state, b = B(id);
  const base = s.C * s.nbar + s.OH - s.H - x;
  const counter = 2 * s.I - s.alpha.reduce((a, v, i) => a + v * (b.z0 - i) ** 2, 0) * s.C - s.H - s.OH + x;
  return pHOf(b, T, s.C, base, Math.max(counter, 0)).pH;
}
const xs = Array.from({ length: 61 }, (_, i) => i * 2); // mM acid
const fig2 = chart({
  title: 'pH after acid is released into a 0.1 M buffer', xLabel: 'Acid released (mM H⁺)', yLabel: 'pH',
  desc: 'pH of 0.1 molar Tris, HEPES and phosphate buffers that start at pH 8.0 as strong acid is added, from the buffer recipe calculator. Tris drops fastest below pH 7 and reaches pH 3 after about 43 millimolar acid; the 15 and 45 millimolar lines mark one and three protons from a 15 millimolar solution.',
  series: ['tris', 'hepes', 'phosphate'].map((id, i) => ({ name: B(id).name.replace(' (sodium)', ''), x: xs, y: xs.map((x) => pHAfterAcid(id, 8, x / 1000)), kind: 'line', colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
  xDomain: [0, 120], yDomain: [2, 8.5], vlines: [{ x: 15, text: '15 mM', left: true }, { x: 45, text: '45 mM' }],
});

const f = (x, d = 3) => +x.toFixed(d);
const out = {
  beta_rel_at_paper_pH: {
    acetate: [4, 5, 5.5].map((p) => [p, f(betaRel('acetate', p))]),
    citrate: [3, 4, 5, 6, 6.5].map((p) => [p, f(betaRel('citrate', p))]),
    phosphate: [2, 3.5, 4.5, 5.5, 7, 8].map((p) => [p, f(betaRel('phosphate', p))]),
    tris: [7, 7.5, 8].map((p) => [p, f(betaRel('tris', p))]),
    hepes: [7, 7.5, 8].map((p) => [p, f(betaRel('hepes', p))]),
  },
  betaMax_mol_L_pH: f(betaMaxSingle(C), 4),
  pKa_apparent_0p1M: Object.fromEntries(['acetate', 'citrate', 'phosphate', 'tris', 'hepes'].map((id) => { const s = stateOf(id, B(id).pKa[B(id).pKa.length > 1 && id === 'phosphate' ? 1 : 0]); return [id, { pKa25: B(id).pKa, I: f(s.I, 4), pKaApp: pKaApparent(B(id), 25, s.I).map((v) => f(v, 2)) }]; })),
  tempShift: ['tris', 'hepes', 'phosphate'].map((id) => { const r = oneForm(B(id), form(id, START[id]), 8, 25, C, 1, 1); return [id, f(pHAtOtherT(B(id), r, 37), 2), f(pHAtOtherT(B(id), r, 4), 2)]; }),
  acidToReach: Object.fromEntries(['tris', 'hepes', 'phosphate'].map((id) => { const res = {}; for (const target of [7, 5.5, 5, 3]) { let lo = 0, hi = 0.2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (pHAfterAcid(id, 8, m) > target) lo = m; else hi = m; } res[target] = f(lo * 1000, 1); } return [id, res]; })),
  pHat3and15mM: Object.fromEntries(['tris', 'hepes', 'phosphate'].map((id) => [id, [3, 15, 30, 45].map((mM) => f(pHAfterAcid(id, 8, mM / 1000), 2))])),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'beta', figure(fig1, 'Figure 1. Buffer capacity of five 0.1 M buffers against pH at 25 °C, from the buffer recipe calculator. A buffer only holds the pH within about one unit of a pKa; phosphate is nearly flat between pH 3.5 and 5.5, as the paper says.'));
  md = inject(md, 'acid', figure(fig2, 'Figure 2. pH of three 0.1 M buffers made at pH 8.0 as strong acid is added (our model of acid released by a dissolving acidic salt; the paper does not give the amount). The dashed lines mark 15 mM and 45 mM acid: one and three protons per formula unit of the paper\'s 15 mM polyoxometalate (our assumption).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
