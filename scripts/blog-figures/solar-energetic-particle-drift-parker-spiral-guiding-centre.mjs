// Figures for src/blog/discoveries/solar-energetic-particle-drift-parker-spiral-guiding-centre.md,
// made with the maths of the Particle drift simulator (src/lib/sci/phdrift.ts: theoryDrift and the Boris pusher).
// Run: node scripts/blog-figures/solar-energetic-particle-drift-parker-spiral-guiding-centre.mjs
import fs from 'node:fs';
import { simulate, theoryDrift, E_CH, AMU } from '../../src/lib/sci/phdrift.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/solar-energetic-particle-drift-parker-spiral-guiding-centre.md', import.meta.url);

// Inputs from the paper: Laitinen, T. and Dalla, S. (2025), ApJ 979, 106, doi:10.3847/1538-4357/ad9c3b (CC BY 4.0).
// Non-relativistic proton gyrofrequency at 1 au: 0.49 s^-1, so B(1 au) = omega m / q. Parker spiral scale a_eq = 0.93 au,
// solar wind 400 km/s. Theoretical colatitudinal drift at 1 au: 17, 160 and 1300 km/s at 10, 100 and 1000 MeV.
const MP = 1.007276 * AMU, C = 2.99792458e8, AU = 1.495978707e11;
const OMEGA = 0.49, B1 = (OMEGA * MP) / E_CH; // T
const REST = (MP * C * C) / E_CH / 1e6; // MeV
const A_EQ = 0.93;
const PAPER = [{ T: 10, v: 17 }, { T: 100, v: 160 }, { T: 1000, v: 1300 }];

const gamma = (T) => 1 + T / REST;
const beta = (T) => { const g = gamma(T); return Math.sqrt(1 - 1 / (g * g)); };
/** The tool's curved-field case for a proton of kinetic energy T (MeV) at 1 au, pitch angle alpha (degrees).
 *  `relativistic` feeds the tool the effective energy gamma m v^2 / 2, which is what a non-relativistic
 *  code needs to reproduce the relativistic drift gamma m (v_par^2 + v_perp^2 / 2) / (q B R). */
function toolDrift(T, alphaDeg, relativistic) {
  const g = gamma(T), v = beta(T) * C;
  const W = relativistic ? (0.5 * g * MP * v * v) / E_CH : T * 1e6; // eV
  const a = (alphaDeg * Math.PI) / 180;
  const p = { scenario: 'curv', q: E_CH, m: MP, B0: B1, R0: AU, Wperp: W * Math.sin(a) ** 2, Wpar: W * Math.cos(a) ** 2, periods: 20, steps: 64 };
  return { theory: Math.abs(theoryDrift(p)[2]), p };
}
const MAGIC = (Math.acos(1 / Math.sqrt(3)) * 180) / Math.PI; // 54.7 deg: the isotropic pitch-angle average

// Figure 1: drift against energy, the tool's non-relativistic result and its relativistic correction,
// with the paper's three theoretical values.
const Es = Array.from({ length: 61 }, (_, i) => 10 ** (i / 20)); // 1 to 1000 MeV
const lg = (v) => Math.log10(v);
const fig1 = chart({
  title: 'Drift of a solar proton at 1 au, against energy',
  xLabel: 'Proton kinetic energy (MeV)', yLabel: 'Drift speed (km s⁻¹)',
  series: [
    { name: 'Tool, as typed (non-relativistic)', kind: 'line', x: Es.map(lg), y: Es.map((T) => lg(toolDrift(T, MAGIC, false).theory / 1e3)) },
    { name: 'Tool, relativistic energy', kind: 'line', x: Es.map(lg), y: Es.map((T) => lg(toolDrift(T, MAGIC, true).theory / 1e3)) },
    { name: 'Paper, theory', kind: 'dots', x: PAPER.map((p) => lg(p.T)), y: PAPER.map((p) => lg(p.v)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 3], yDomain: [lg(1), lg(3000)],
  xTicks: [0, 1, 2, 3], xFmt: (t) => String(Math.round(10 ** t)),
  yTicks: [0, 1, 2, 3, Math.log10(3000)], yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  desc: 'Drift speed against proton energy at 1 au, on log axes. The tool as typed rises in a straight line; fed the relativistic energy it bends over and lands on the paper three theoretical values of 17, 160 and 1300 km/s.',
  height: 290,
});

// Figure 2: how the drift depends on the pitch angle, at 100 MeV.
const alphas = Array.from({ length: 89 }, (_, i) => i + 2); // the tool needs some energy across the field, so start at 2 degrees
const fig2 = chart({
  title: 'The same 100 MeV proton, at every pitch angle',
  xLabel: 'Pitch angle α (degrees)', yLabel: 'Drift speed (km s⁻¹)',
  series: [
    { name: 'Tool, relativistic energy', kind: 'line', x: alphas, y: alphas.map((a) => +(toolDrift(100, a, true).theory / 1e3).toFixed(2)) },
    { name: '', noLegend: true, kind: 'dots', x: [MAGIC], y: [toolDrift(100, MAGIC, true).theory / 1e3], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 90], yDomain: [110, 265],
  hlines: [{ y: 160, text: 'paper: 160 km s⁻¹' }],
  vlines: [{ x: MAGIC, text: 'isotropic (54.7°)' }],
  desc: 'Drift speed against pitch angle for a 100 MeV proton at 1 au. It falls from about 249 km/s for a nearly field-aligned particle to 124 km/s for a purely gyrating one, passing the paper 160 km/s near the isotropic value at 54.7 degrees.',
  height: 280,
});

// Numbers quoted in the article.
const rows = PAPER.map(({ T, v }) => {
  const plain = toolDrift(T, MAGIC, false), rel = toolDrift(T, MAGIC, true), sim = simulate(rel.p);
  return {
    T, paper: v, toolPlain: +(plain.theory / 1e3).toFixed(1), toolRel: +(rel.theory / 1e3).toFixed(1),
    boris: +(Math.hypot(...sim.measured) / 1e3).toFixed(1), gamma: +gamma(T).toFixed(4), beta: +beta(T).toFixed(4),
    Weff: +((0.5 * gamma(T) * MP * (beta(T) * C) ** 2) / E_CH / 1e6).toFixed(2),
    rL_AU: +(sim.rL / AU).toFixed(5), energyDrift: Math.abs(sim.ke1 / sim.ke0 - 1),
  };
});
const parker = (1 + 2 * A_EQ * A_EQ) / Math.pow(1 + A_EQ * A_EQ, 1.5);
const pitch = [0, 30, 54.7356, 70, 90].map((a) => ({ a, v: +(toolDrift(100, a, true).theory / 1e3).toFixed(1) }));
console.log(JSON.stringify({ B1_nT: +(B1 * 1e9).toFixed(3), restMeV: +REST.toFixed(2), parkerFactor: +parker.toFixed(4), magic: +MAGIC.toFixed(2), rows, pitch }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'energy', figure(fig1, 'Figure 1. The drift of a proton at 1 au in the Particle drift simulator\'s curved-field case, with the field strength and radius of curvature of the Parker spiral at 1 au. Typed in as plain kinetic energy the tool is non-relativistic and runs straight on (upper line); fed the relativistic energy γmv²/2 it bends over and meets the paper\'s three theoretical values.'));
  md = inject(md, 'pitch', figure(fig2, 'Figure 2. The same 100 MeV proton at every pitch angle, from field-aligned (0°) to purely gyrating (90°). The drift only ever changes by a factor of two across the whole range, and the paper\'s 160 km s⁻¹ sits near the isotropic value.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
