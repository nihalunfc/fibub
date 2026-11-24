// Figures for src/blog/discoveries/low-permittivity-ceramic-patch-antenna-transmission-line-model.md, made with the
// maths of the Antenna calculator (src/lib/sci/eng-antenna.ts: the transmission-line model of a rectangular patch).
// Run: node scripts/blog-figures/low-permittivity-ceramic-patch-antenna-transmission-line-model.mjs
import fs from 'node:fs';
import { patch } from '../../src/lib/sci/eng-antenna.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/low-permittivity-ceramic-patch-antenna-transmission-line-model.md', import.meta.url);

// Inputs from the paper: Liu F. et al. (2025), Crystals 15(7): 599, doi:10.3390/cryst15070599 (CC BY 4.0).
// Ca3(BO3)2 microwave ceramic sintered under 800 MPa: er = 5.95, Q x f = 11,836 GHz, tau_f = -39.89 ppm/C.
// Simulated 5G patch antenna on it: dimensions 3.75 x 5.4 x 1.4 mm, resonance 14.97 GHz, S11 -25.5 dB, gain 7.15 dBi.
// OUR READING of those dimensions: 5.4 mm is the patch width, 3.75 mm the resonant length and 1.4 mm the substrate
// thickness, which is the only arrangement consistent with a patch at this frequency on this ceramic.
const F = 14.97e9, ER = 5.95, H = 1.4e-3, PAPER = { W: 5.4, L: 3.75, h: 1.4, f: 14.97 };
const p = patch(F, ER, H);

// The frequency at which the model's design length (or width) equals the paper's dimension, by bisection.
const fFor = (target, key) => { let lo = 8e9, hi = 25e9; for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; patch(m, ER, H)[key] > target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const fL = fFor(PAPER.L * 1e-3, 'L'), fW = fFor(PAPER.W * 1e-3, 'W');

const ers = Array.from({ length: 96 }, (_, i) => 2 + i * 0.25); // 2 to 25.75
const sweep = ers.map((er) => patch(F, er, H));
const fig1 = chart({
  title: 'Patch size at 14.97 GHz against substrate permittivity', xLabel: 'Substrate relative permittivity εr', yLabel: 'Patch dimension (mm)',
  series: [
    { name: 'Width W', kind: 'line', x: ers, y: sweep.map((q) => +(q.W * 1e3).toFixed(3)) },
    { name: 'Length L', kind: 'line', x: ers, y: sweep.map((q) => +(q.L * 1e3).toFixed(3)) },
    { name: 'Paper\'s footprint', kind: 'dots', size: 4, x: [ER, ER], y: [PAPER.W, PAPER.L], colour: 'var(--ink)' },
  ],
  xDomain: [2, 25], yDomain: [0, 9], vlines: [{ x: ER, text: 'the paper\'s ceramic, εr 5.95' }],
  desc: 'Design width and length of a rectangular patch at 14.97 GHz on a 1.4 mm substrate, against the substrate permittivity. The paper\'s 5.4 by 3.75 mm footprint is marked at its ceramic\'s permittivity of 5.95.',
  height: 285,
});

const fs2 = Array.from({ length: 101 }, (_, i) => 12 + i * 0.06); // 12 to 18 GHz
const fig2 = chart({
  title: 'Which frequency fits a 3.75 mm length?', xLabel: 'Frequency (GHz)', yLabel: 'Design length L (mm)',
  series: [{ name: '', noLegend: true, kind: 'line', x: fs2, y: fs2.map((g) => +(patch(g * 1e9, ER, H).L * 1e3).toFixed(4)) }],
  xDomain: [12, 18], yDomain: [2.4, 5],
  hlines: [{ y: PAPER.L, text: 'the paper\'s 3.75 mm' }],
  vlines: [{ x: +(fL / 1e9).toFixed(2), text: `${(fL / 1e9).toFixed(2)} GHz (model)` }, { x: PAPER.f, text: `${PAPER.f} GHz (paper)`, dy: 14 }],
  desc: 'The transmission-line model\'s design length against frequency for this ceramic. A 3.75 mm length is resonant at 14.06 GHz in the model, 6 per cent below the 14.97 GHz the paper simulates.',
  height: 270,
});

const mm = (v) => +(v * 1e3).toPrecision(5);
console.log(JSON.stringify({
  design: { W_mm: mm(p.W), L_mm: mm(p.L), eeff: +p.eeff.toPrecision(5), dL_mm: mm(p.dL), Rin_ohm: +p.Rin.toPrecision(5), inset_mm: mm(p.inset), lam0_mm: mm(p.lambda0), lamg_mm: mm(p.lambdag), ground: [mm(p.groundW), mm(p.groundL)], G1_mS: +(p.G1 * 1e3).toPrecision(4), G12_mS: +(p.G12 * 1e3).toPrecision(4) },
  paper: PAPER, widthGapPct: +((100 * (p.W * 1e3 - PAPER.W)) / PAPER.W).toFixed(2), lengthGapPct: +((100 * (p.L * 1e3 - PAPER.L)) / PAPER.L).toFixed(2),
  fFor3p75mm_GHz: +(fL / 1e9).toFixed(3), fFor5p4mm_GHz: +(fW / 1e9).toFixed(3), hOverLam0: +(H / p.lambda0).toFixed(4), hOverLamg: +(H / p.lambdag).toFixed(3), modelLimit_mm: mm(p.lambda0 / 10),
  byEr: Object.fromEntries([2.2, 5.95, 10, 20, 25].map((er) => { const q = patch(F, er, H); return [er, { W: mm(q.W), L: mm(q.L), area_mm2: +(q.W * q.L * 1e6).toFixed(2), eeff: +q.eeff.toFixed(3), Rin: +q.Rin.toFixed(0) }]; })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'size', figure(fig1, 'Figure 1. Patch width and length at 14.97 GHz on a 1.4 mm substrate, worked out with the Antenna calculator\'s transmission-line model, as the substrate permittivity changes. The two black dots are the paper\'s own footprint at its ceramic\'s εr of 5.95.'));
  md = inject(md, 'freq', figure(fig2, 'Figure 2. The same model read backwards: the design length falls as frequency rises, and the paper\'s 3.75 mm length is resonant at 14.06 GHz in the model against the 14.97 GHz of its full-wave simulation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
