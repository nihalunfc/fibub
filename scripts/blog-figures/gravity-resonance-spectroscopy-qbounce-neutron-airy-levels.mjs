// Figures for src/blog/discoveries/gravity-resonance-spectroscopy-qbounce-neutron-airy-levels.md, made with the maths of the
// 1D Schrödinger solver (src/lib/sci/phschro.ts: Airy-zero levels for the "linear (bouncing ball)" potential, finite-difference solver).
// Run: node scripts/blog-figures/gravity-resonance-spectroscopy-qbounce-neutron-airy-levels.mjs
import fs from 'node:fs';
import { linearLevels, airyZeros, solve, energies } from '../../src/lib/sci/phschro.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gravity-resonance-spectroscopy-qbounce-neutron-airy-levels.md', import.meta.url);

// Constants (CODATA, our own input): hbar, neutron mass, standard gravity, elementary charge, Planck constant.
const HBAR = 1.054571817e-34, MN = 1.67492749804e-27, G = 9.80665, QE = 1.602176634e-19, H = 6.62607015e-34;
// Units for the tool: lengths in micrometres, energies in peV, so c = hbar^2/(2m) in peV um^2 and the force F = m g in peV/um.
const PEV = QE * 1e-12, UM = 1e-6;
const c = HBAR ** 2 / (2 * MN) / (UM * UM) / PEV;
const F = (MN * G) * UM / PEV;
// Paper (Jenke et al. 2019): z0 about 5.87 um, t0 about 1 ms, slit height 29.3 +- 0.9 um (2010), second boundary at 30 um,
// initial populations 70 % in state 1 and 30 % in state 2, sensitivity 2e-15 eV.
const PAPER = { z0: 5.87, slit: 29.3, slitErr: 0.9, l2: 30, sens_eV: 2e-15 };

const z0 = Math.cbrt(HBAR ** 2 / (2 * MN * MN * G)) / UM; // um
const E0 = MN * G * z0 * UM / PEV; // peV
const t0 = HBAR / (E0 * PEV);
const a = airyZeros(6);
const E = linearLevels(F, c, 6); // peV
const turn = E.map((e) => e / F); // classical turning height in um
const nu = (i, j) => ((E[j] - E[i]) * PEV) / H; // Hz, 1-based indices converted below
const nuHz = (i, j) => nu(i - 1, j - 1);

// Finite-difference check against the Airy levels.
const fd = energies((x) => F * x, 0, 80, 2000, 5, c);
const fdErr = fd.map((e, i) => Math.abs(e / E[i] - 1));

// Ceiling (absorber) at height L: levels shift up as L shrinks.
const ceil = (L, n = 1200) => energies((x) => F * x, 0, L, n, 4, c);
const Ls = [20, 22, 24, 26, 28, 29.3, 30, 32, 35, 40, 45, 50, 60];
const shifts = Ls.map((L) => ceil(L));
const at = (L) => ceil(L);
const E293 = at(PAPER.slit), E30 = at(PAPER.l2), E293hi = at(PAPER.slit + PAPER.slitErr), E293lo = at(PAPER.slit - PAPER.slitErr);

// Figure 1: probability densities of the first three states without a ceiling.
const open = solve((x) => F * x, 0, 70, 1400, 3, c);
const sel = Array.from(open.x, (x, i) => i).filter((i) => open.x[i] <= 45 && i % 7 === 0);
const fig1 = chart({
  title: 'Neutron states above a mirror', xLabel: 'Height above the mirror (µm)', yLabel: 'Probability density (relative)',
  series: open.states.map((s, j) => ({ name: `State ${j + 1}`, kind: 'line', x: sel.map((i) => +open.x[i].toFixed(2)), y: sel.map((i) => +(s.psi[i] ** 2).toFixed(5)) })),
  xDomain: [0, 45],
  vlines: [{ x: PAPER.slit, text: '29.3 µm slit', left: true }],
  desc: `Probability densities of the first three quantum states of a neutron bouncing on a mirror in Earth's gravity, from the Schrödinger solver. Their classical turning heights are ${turn[0].toFixed(1)}, ${turn[1].toFixed(1)} and ${turn[2].toFixed(1)} micrometres, so a 29.3 micrometre slit lets states 1 and 2 through and squeezes state 3.`,
  height: 290,
});

// Figure 2: how a ceiling raises the levels.
const Lf = Array.from({ length: 41 }, (_, i) => 18 + (i * 42) / 40);
const lev = Lf.map((L) => ceil(L, 800));
const fig2 = chart({
  title: 'A ceiling raises the levels', xLabel: 'Ceiling height above the mirror (µm)', yLabel: 'Energy shift from the open mirror (%)',
  series: [0, 1, 2].map((j) => ({ name: `State ${j + 1}`, kind: 'line', x: Lf.map((v) => +v.toFixed(2)), y: lev.map((l) => +((l[j] / E[j] - 1) * 100).toFixed(3)) })),
  xDomain: [18, 60], yDomain: [0, 60], vlines: [{ x: PAPER.slit, text: '29.3 µm', left: true }],
  desc: `Shift of the first three gravitational energy levels of a neutron when a hard ceiling is placed above the mirror, from the Schrödinger solver. At the paper's 29.3 micrometre slit the shifts are ${((E293[0] / E[0] - 1) * 100).toFixed(2)} %, ${((E293[1] / E[1] - 1) * 100).toFixed(1)} % and ${((E293[2] / E[2] - 1) * 100).toFixed(0)} %.`,
  height: 290,
});

const r = (v, d = 4) => +v.toFixed(d);
const out = {
  c: c, F: F, z0_um: r(z0, 4), E0_peV: r(E0, 5), t0_ms: r(t0 * 1e3, 4),
  airy: a.map((v) => r(v, 5)), E_peV: E.map((v) => r(v, 5)), turn_um: turn.map((v) => r(v, 3)),
  nu12: r(nuHz(1, 2), 2), nu13: r(nuHz(1, 3), 2), nu23: r(nuHz(2, 3), 2), nu24: r(nuHz(2, 4), 2), nu14: r(nuHz(1, 4), 2),
  sens_Hz: r(PAPER.sens_eV / H * QE, 4),
  fdMaxRelErr: Math.max(...fdErr).toExponential(2),
  ceil293: E293.map((v) => r(v, 5)), shift293_pct: E293.map((v, i) => r((v / E[i] - 1) * 100, 3)),
  ceil30: E30.map((v) => r(v, 5)), shift30_pct: E30.map((v, i) => r((v / E[i] - 1) * 100, 3)),
  nu13_ceil293: r(((E293[2] - E293[0]) * PEV) / H, 2), nu12_ceil293: r(((E293[1] - E293[0]) * PEV) / H, 2),
  nu13_ceil30: r(((E30[2] - E30[0]) * PEV) / H, 2),
  nu13_range: [r(((E293hi[2] - E293hi[0]) * PEV) / H, 2), r(((E293lo[2] - E293lo[0]) * PEV) / H, 2)],
  nu12_range: [r(((E293hi[1] - E293hi[0]) * PEV) / H, 2), r(((E293lo[1] - E293lo[0]) * PEV) / H, 2)],
  E1_range_pct: [r((E293hi[0] / E[0] - 1) * 100, 4), r((E293lo[0] / E[0] - 1) * 100, 4)],
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'states', figure(fig1, 'Figure 1. The first three neutron states above a horizontal mirror in Earth\'s gravity, from the Schrödinger solver with a linear potential. The dashed line is the 29.3 µm slit height the paper quotes for its 2010 state selector.'));
  md = inject(md, 'ceiling', figure(fig2, 'Figure 2. How much a hard ceiling at a given height raises the energy of the first three states, from the finite-difference solver (our own extension; the paper shows the two-boundary case only as a sketch).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
