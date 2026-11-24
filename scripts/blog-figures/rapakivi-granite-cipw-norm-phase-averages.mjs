// Figures for src/blog/discoveries/rapakivi-granite-cipw-norm-phase-averages.md, made with the maths of the
// CIPW norm calculator (src/lib/sci/cipw.ts: the Verma et al. 2003 step order and the iron split).
// Run: node scripts/blog-figures/rapakivi-granite-cipw-norm-phase-averages.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { cipw, M } from '../../src/lib/sci/cipw.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/rapakivi-granite-cipw-norm-phase-averages.md', import.meta.url);

// Inputs from the paper: Solano-Acosta, Soesoo and Hints (2026), Estonian Journal of Earth Sciences 75(2), 83-102,
// doi:10.3176/earth.2026.06 (CC BY 4.0). Phase averages of the major oxides as stated in its text (section 4.1).
// MnO is NOT given as a phase average, so we use 0.05 wt% for all three phases (OUR assumption, from the
// per-sample value 0.04 wt% in the one Table 1 row we quote).
const MNO = 0.05;
const PHASE = {
  I: { SiO2: 66.94, TiO2: 0.79, Al2O3: 13.61, Fe2O3: 2.30, FeO: 2.75, MnO: MNO, MgO: 1.30, CaO: 3.13, Na2O: 2.82, K2O: 5.15, P2O5: 0.32 },
  II: { SiO2: 69.93, TiO2: 0.40, Al2O3: 13.42, Fe2O3: 1.05, FeO: 2.67, MnO: MNO, MgO: 0.65, CaO: 2.02, Na2O: 2.59, K2O: 6.35, P2O5: 0.11 },
  III: { SiO2: 71.78, TiO2: 0.33, Al2O3: 13.20, Fe2O3: 1.37, FeO: 1.19, MnO: MNO, MgO: 0.61, CaO: 1.94, Na2O: 3.35, K2O: 5.57, P2O5: 0.04 },
};
// One real sample row quoted from the paper's Table 1 (Phase I).
const SAMPLE = { SiO2: 63.80, TiO2: 1.08, Al2O3: 13.73, Fe2O3: 3.03, FeO: 3.68, MnO: 0.04, MgO: 1.84, CaO: 3.80, Na2O: 2.94, K2O: 4.60, P2O5: 0.46 };
// The paper's own phase-average normative minerals (wt%), from its text.
const PAPER = {
  I: { Q: 23.19, Or: 30.68, Ab: 24.03, An: 9.30, Il: 1.51, Mt: 3.23, Ap: 0.75 },
  II: { Q: 25.66, Or: 37.80, Ab: 22.06, An: 6.05, Il: 0.76, Mt: 2.59, Ap: 0.26 },
  III: { Q: 26.79, Or: 33.08, Ab: 28.48, An: 4.54, Il: 0.63, Mt: 1.76, Ap: 0.09 },
};
const KEYS = ['Q', 'Or', 'Ab', 'An', 'Il', 'Mt', 'Ap'];

const norms = Object.fromEntries(Object.entries(PHASE).map(([k, c]) => [k, cipw(c)]));
const sample = cipw(SAMPLE);

// Figure 1: our norm against the paper's, all 21 values, with the 1:1 line.
const px = [], py = [], lab = [];
for (const ph of ['I', 'II', 'III']) for (const k of KEYS) { px.push(PAPER[ph][k]); py.push(+norms[ph].wt[k].toFixed(2)); lab.push(`${ph} ${k}`); }
const big = px.map((v, i) => Math.abs(py[i] - v)).map((d, i) => ({ d, i })).sort((a, b) => b.d - a.d);
const fig1 = chart({
  title: 'CIPW norm: the tool against the paper (21 values)',
  xLabel: "Paper's phase-average norm (wt%)", yLabel: 'Tool, norm of the mean analysis (wt%)',
  series: [
    { name: 'Phase I, II, III', kind: 'dots', x: px, y: py, size: 3.5 },
    { name: '1:1', kind: 'line', x: [0, 40], y: [0, 40], colour: 'var(--muted)', dash: '4 4' },
  ],
  xDomain: [0, 40], yDomain: [0, 40], width: 520, height: 300,
  desc: 'Scatter of the tool’s normative minerals against the paper’s for quartz, orthoclase, albite, anorthite, ilmenite, magnetite and apatite in all three phases. Nearly every point sits on the 1:1 line; the two that sit off it are Phase II quartz and magnetite.',
});

// Figure 2: how normative quartz and magnetite move with the ferric iron ratio, for the Phase II average.
const feT = PHASE.II.FeO + (PHASE.II.Fe2O3 * 2 * M.FeO) / M.Fe2O3; // total iron as FeO (wt%)
const splitAt = (r) => { // r = Fe2O3 / (FeO + Fe2O3) by weight, as the paper defines Fe3+#
  let lo = 0, hi = feT * 1.3;
  for (let i = 0; i < 200; i++) { const x = (lo + hi) / 2, feo = feT - (x * 2 * M.FeO) / M.Fe2O3; x / (feo + x) < r ? (lo = x) : (hi = x); }
  const x = (lo + hi) / 2;
  return { Fe2O3: x, FeO: feT - (x * 2 * M.FeO) / M.Fe2O3 };
};
const RR = Array.from({ length: 41 }, (_, i) => 0.15 + i * 0.01);
const sweep = RR.map((r) => { const s = splitAt(r), n = cipw({ ...PHASE.II, ...s }); return { r, q: +n.wt.Q.toFixed(3), mt: +n.wt.Mt.toFixed(3), hy: +n.wt.Hy.toFixed(3) }; });
// The ferric ratio that reproduces the paper's Phase II magnetite, and the quartz that comes with it.
const hit = (field, target) => { let lo = 0.15, hi = 0.6; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2, s = splitAt(m), n = cipw({ ...PHASE.II, ...s }); n.wt[field] < target ? (lo = m) : (hi = m); } const m = (lo + hi) / 2, n = cipw({ ...PHASE.II, ...splitAt(m) }); return { r: m, Q: n.wt.Q, Mt: n.wt.Mt, Hy: n.wt.Hy }; };
const mtHit = hit('Mt', PAPER.II.Mt), qHit = hit('Q', PAPER.II.Q);
const slope = (sweep.at(-1).q - sweep[0].q) / (sweep.at(-1).mt - sweep[0].mt);
const fig2 = chart({
  title: 'Phase II: quartz and magnetite follow the ferric iron ratio',
  xLabel: 'Fe³⁺# = Fe₂O₃ / (FeO + Fe₂O₃) by weight', yLabel: 'Normative mineral (wt%)',
  series: [
    { name: 'Quartz', kind: 'line', x: sweep.map((s) => s.r), y: sweep.map((s) => s.q) },
    { name: 'Magnetite', kind: 'line', x: sweep.map((s) => s.r), y: sweep.map((s) => s.mt) },
    { name: 'Hypersthene', kind: 'line', x: sweep.map((s) => s.r), y: sweep.map((s) => s.hy), colour: 'var(--muted)' },
  ],
  xDomain: [0.15, 0.55], yDomain: [0, 28],
  vlines: [{ x: 0.28, text: 'mean 0.28' }, { x: +mtHit.r.toFixed(3), text: `${mtHit.r.toFixed(2)}`, left: true }],
  hlines: [{ y: PAPER.II.Q, text: "paper's quartz" }, { y: PAPER.II.Mt, text: "paper's magnetite" }],
  width: 520, height: 300,
  desc: `Normative quartz, magnetite and hypersthene for the Phase II average analysis as the ferric iron ratio changes. The paper's quartz (${PAPER.II.Q} wt%) and magnetite (${PAPER.II.Mt} wt%) are both met near Fe3+# ${mtHit.r.toFixed(2)}, not at the phase mean of 0.28.`,
});

const show = (n) => ({ ...Object.fromEntries(['Q', 'Or', 'Ab', 'An', 'Di', 'Hy', 'Mt', 'Il', 'Ap', 'C'].map((k) => [k, +n.wt[k].toFixed(2)])), DI: +n.DI.toFixed(1), anPlag: n.anPlag === null ? null : +n.anPlag.toFixed(1), CI: +n.mafic.toFixed(1), sumIn: +n.sumIn.toFixed(2), total: +n.total.toFixed(2), sat: n.saturation });
console.log(JSON.stringify({
  I: show(norms.I), II: show(norms.II), III: show(norms.III), sample: show(sample),
  worst: big.slice(0, 4).map(({ d, i }) => `${lab[i]} ${d.toFixed(2)}`),
  worstWithout: big.filter(({ i }) => !/II (Q|Mt)/.test(lab[i])).slice(0, 3).map(({ d, i }) => `${lab[i]} ${d.toFixed(2)}`),
  mtHit: { r: +mtHit.r.toFixed(3), Q: +mtHit.Q.toFixed(2), Mt: +mtHit.Mt.toFixed(2), Hy: +mtHit.Hy.toFixed(2) },
  qHit: { r: +qHit.r.toFixed(3), Q: +qHit.Q.toFixed(2), Mt: +qHit.Mt.toFixed(2) },
  dQdMt: +slope.toFixed(2),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'agree', figure(fig1, 'Figure 1. Every normative mineral the paper reports for its three phase averages (horizontal) against the same mineral worked out by the CIPW norm calculator from the phase-average oxides (vertical). Phase II quartz and magnetite are the only points off the 1:1 line.'));
  md = inject(md, 'ferric', figure(fig2, 'Figure 2. For the Phase II average analysis, normative quartz, magnetite and hypersthene as the ferric share of the iron changes with total iron held fixed. Dashed lines mark the paper’s own Phase II quartz and magnetite and the ratio that reproduces them.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
