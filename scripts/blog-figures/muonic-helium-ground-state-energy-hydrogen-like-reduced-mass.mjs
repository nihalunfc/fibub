// Figures for src/blog/discoveries/muonic-helium-ground-state-energy-hydrogen-like-reduced-mass.md, made with the maths of the
// Hydrogen orbital viewer (src/lib/sci/phhydro.ts: hydrogen-like 1s energy, radial function and mean radius for charge Z).
// Run: node scripts/blog-figures/muonic-helium-ground-state-energy-hydrogen-like-reduced-mass.mjs
import fs from 'node:fs';
import { properties, radial, RYDBERG_EV, BOHR_PM } from '../../src/lib/sci/phhydro.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/muonic-helium-ground-state-energy-hydrogen-like-reduced-mass.md', import.meta.url);

// Paper (Eskin, Korobov, Martynenko, Sorokin 2019), Table 2, ground state of the (mu, e, nucleus) atom, in eV.
const PAPER = {
  He4: { E: -10956.319047, rows: [-0.59774665, 2.3663, -18.4777], total: -10973.028228 },
  He3: { E: -10858.496122, rows: [-0.59457619, 3.1587, -17.7806], total: -10873.702742 },
};
// Masses in electron masses (CODATA, our own input; the paper prints none): muon, alpha particle (4He nucleus), helion (3He nucleus).
const MU = 206.768283, M = { He4: 7294.29954142, He3: 5495.88528 };
// Assumption: rounded rms charge radii of the two nuclei (fm), general published values, not from the paper.
const R = { He4: 1.68, He3: 1.97 };
const ALPHA = 1 / 137.035999177, HARTREE = 2 * RYDBERG_EV;

const e1s = properties(1, 0, 1).E, e1sZ2 = properties(1, 0, 2).E; // hydrogen-like energies (infinite nuclear mass)
function atom(k) {
  const Mn = M[k], mu = (MU * Mn) / (MU + Mn); // muon reduced mass in electron masses
  const Emu = e1sZ2 * mu;
  const Mc = Mn + MU, mue = Mc / (Mc + 1); // electron around the +1 core (nucleus + muon)
  const Ee = e1s * mue;
  const rMu = (properties(1, 0, 2).rMean * BOHR_PM * 1000) / mu; // fm
  const rEl = properties(1, 0, 1).rMean * BOHR_PM; // pm
  // leading Dirac correction for a 1s level: -(Z alpha)^2 |E| / 4
  const rel = -((2 * ALPHA) ** 2 / 4) * Math.abs(Emu);
  // first-order finite-size shift with the point-Coulomb muon wave function: (2/3) Z (Z mu)^3 r^2 hartree (r in bohr)
  const fs = (r_fm) => ((2 / 3) * 2 * (2 * mu) ** 3 * (r_fm * 1e-3 / BOHR_PM) ** 2) * HARTREE;
  const fsInv = (dE) => Math.sqrt(dE / (((2 / 3) * 2 * (2 * mu) ** 3) * HARTREE)) * BOHR_PM * 1e3;
  return { mu, Emu, Ee, E: Emu + Ee, rMu, rEl, rel, fs, fsInv };
}
const A4 = atom('He4'), A3 = atom('He3');
const sum = (k) => PAPER[k].E + PAPER[k].rows.reduce((a, b) => a + b, 0);

// Figure 1: the muon's 1s radial probability, with the nucleus's size marked.
const pr = (a, rfm) => { const r = (rfm * 1e-3) / BOHR_PM * a.mu; const R1 = radial(1, 0, r, 2); return r * r * R1 * R1 * a.mu / (BOHR_PM * 1e3) * 1; };
const xs = Array.from({ length: 121 }, (_, i) => (i * 600) / 120);
const norm = Math.max(...xs.map((x) => pr(A4, x)));
const fig1 = chart({
  title: 'Where the muon is in muonic helium-4', xLabel: 'Distance from the nucleus (fm)', yLabel: 'Radial probability (relative)',
  series: [{ name: 'Muon 1s', kind: 'line', x: xs, y: xs.map((x) => +(pr(A4, x) / norm).toFixed(4)) }],
  xDomain: [0, 600], yDomain: [0, 1.05],
  vlines: [{ x: R['He4'], text: 'nucleus 1.68 fm' }, { x: +A4.rMu.toFixed(1), text: `mean ${A4.rMu.toFixed(0)} fm`, left: false, dy: 16 }],
  desc: `Radial probability of the muon in the 1s state of muonic helium-4, worked out with the hydrogen-like function for charge 2 and the muon's reduced mass. The peak is near ${(0.5 * BOHR_PM * 1e3 / A4.mu).toFixed(0)} fm and the mean is ${A4.rMu.toFixed(0)} fm, about ${(A4.rMu / R.He4).toFixed(0)} times the nuclear radius of 1.68 fm.`,
  height: 280,
});

// Figure 2: finite-size shift against nuclear radius, with the two radii that reproduce the paper's two table entries.
const rs = Array.from({ length: 41 }, (_, i) => 1.4 + (i * 0.8) / 40);
const fig2 = chart({
  title: 'Nuclear-size shift of the muon level', xLabel: 'Nuclear rms charge radius (fm)', yLabel: 'Energy shift (eV)',
  series: [
    { name: 'He-4 (muon reduced mass)', kind: 'line', x: rs, y: rs.map((r) => +A4.fs(r).toFixed(4)) },
    { name: 'He-3', kind: 'line', x: rs, y: rs.map((r) => +A3.fs(r).toFixed(4)), dash: '5 4' },
    { name: 'Paper rows (+2.3663, +3.1587)', kind: 'dots', x: [A4.fsInv(2.3663), A3.fsInv(3.1587)], y: [2.3663, 3.1587], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [1.4, 2.2], yDomain: [1, 4],
  desc: `First-order finite-size shift of the muon's 1s level against the nuclear charge radius, for helium-4 and helium-3. The paper's +2.3663 eV row needs a radius of ${A4.fsInv(2.3663).toFixed(3)} fm and +3.1587 eV needs ${A3.fsInv(3.1587).toFixed(3)} fm.`,
  height: 280,
});

const out = {
  He4: { mu: +A4.mu.toFixed(4), Emu: +A4.Emu.toFixed(5), Ee: +A4.Ee.toFixed(6), E: +A4.E.toFixed(6), paper: PAPER.He4.E, diff: +(A4.E - PAPER.He4.E).toFixed(6), rel: +((A4.E - PAPER.He4.E) / PAPER.He4.E).toExponential(2), rMu_fm: +A4.rMu.toFixed(2), rEl_pm: +A4.rEl.toFixed(2), relDirac: +A4.rel.toFixed(4), fs168: +A4.fs(1.68).toFixed(4), impliedR_fm: +A4.fsInv(2.3663).toFixed(4), muPeak_fm: +(0.5 * BOHR_PM * 1e3 / A4.mu).toFixed(1) },
  He3: { mu: +A3.mu.toFixed(4), Emu: +A3.Emu.toFixed(5), Ee: +A3.Ee.toFixed(6), E: +A3.E.toFixed(6), paper: PAPER.He3.E, diff: +(A3.E - PAPER.He3.E).toFixed(6), rel: +((A3.E - PAPER.He3.E) / PAPER.He3.E).toExponential(2), rMu_fm: +A3.rMu.toFixed(2), relDirac: +A3.rel.toFixed(4), fs197: +A3.fs(1.97).toFixed(4), impliedR_fm: +A3.fsInv(3.1587).toFixed(4), impliedR_fm_alt: +A3.fsInv(3.1686).toFixed(4) },
  ratio_rows: +(3.1587 / 2.3663).toFixed(4), ratio_pred: +(A3.fs(1.97) / A4.fs(1.68)).toFixed(4),
  sums: { He4: +sum('He4').toFixed(6), He4paper: PAPER.He4.total, He3: +sum('He3').toFixed(6), He3paper: PAPER.He3.total, He3gap: +(sum('He3') - PAPER.He3.total).toFixed(6), He4gap: +(sum('He4') - PAPER.He4.total).toFixed(6) },
  hydrogenElectronOnly: e1s, bareZ2: e1sZ2,
  relVsPaper4: +((A4.rel / PAPER.He4.rows[0] - 1) * 100).toFixed(2), relVsPaper3: +((A3.rel / PAPER.He3.rows[0] - 1) * 100).toFixed(2),
  ratioToBinding4: +(2.3663 / Math.abs(A4.Emu)).toExponential(2), electronRadiusOverMuon: +((A4.rEl * 1e3) / A4.rMu).toFixed(0),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'muon', figure(fig1, 'Figure 1. The radial probability of the muon in its 1s state in muonic helium-4: the hydrogen-like function for nuclear charge 2, with every distance divided by the muon\'s reduced mass (about 201 electron masses). The nucleus (dashed line at 1.68 fm) is tiny compared with the muon\'s orbit.'));
  md = inject(md, 'size', figure(fig2, 'Figure 2. First-order nuclear-size shift of the muon level against the nuclear radius, from the 1s wave function at the origin. Dots: the radii that would give the paper\'s two positive table entries.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
