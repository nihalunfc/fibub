// Figures for src/blog/discoveries/cdbr-laser-cooling-candidate-spectroscopic-constants-repump-wavelengths.md, made
// with the maths of the Diatomic spectroscopy calculator (src/lib/sci/diatomic.ts: bondLength, rotConstant,
// reducedMass, fitAnharmonic, G) and the Kinetic theory explorer (src/lib/sci/learngas.ts: vrms, vmostProbable).
// Run: node scripts/blog-figures/cdbr-laser-cooling-candidate-spectroscopic-constants-repump-wavelengths.mjs
import fs from 'node:fs';
import { bondLength, rotConstant, reducedMass, fitAnharmonic, G, H, KB } from '../../src/lib/sci/diatomic.ts';
import { vrms, vmostProbable } from '../../src/lib/sci/learngas.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cdbr-laser-cooling-candidate-spectroscopic-constants-repump-wavelengths.md', import.meta.url);

// Inputs from the paper: Mostafa et al. (2026), Int. J. Mol. Sci. 27(1): 184, doi:10.3390/ijms27010184 (CC BY).
// X2Σ+ ground state: Re 2.468 Å, ωe 231.4 cm-1, Be 5.928 (read as 5.928e-2 cm-1, see the article).
// Cooling and repumping lasers 349.6, 352.5, 355.4, 358.3 nm; lifetime 16.07 to 41.35 ns; Doppler limit 1.24e-4 K;
// recoil limit 8.31e-7 K; initial temperature 496.0 K and "V_rms" 207.2 m/s.
const RE = 2.468, WE = 231.4, BE = 0.05928, WL = [349.6, 352.5, 355.4, 358.3];
const TD = 1.24e-4, TR = 8.31e-7, TAU = [16.07e-9, 41.35e-9], TINI = 496.0;
// Masses (u): IUPAC standard atomic weights and AME isotope masses.
const AW = { Cd: 112.414, Br: 79.904 }, ISO = { '112Cd': 111.9027629, '114Cd': 113.9033651, '79Br': 78.9183376, '81Br': 80.9162897 };
const HBAR = H / (2 * Math.PI), AMU = 1.6605390666e-27;

// 1. Bond length from Be for each isotopologue and for average masses.
const iso = [['112Cd', '79Br'], ['112Cd', '81Br'], ['114Cd', '79Br'], ['114Cd', '81Br']].map(([a, b]) => { const mu = reducedMass(ISO[a], ISO[b]); return { id: `${a}${b}`, mu, r: bondLength(BE, mu), B: rotConstant(RE, mu) }; });
const muAvg = reducedMass(AW.Cd, AW.Br), rAvg = bondLength(BE, muAvg), Bavg = rotConstant(RE, muAvg);

// 2. Level spacings of the ground state from the four laser wavelengths (vacuum wavenumbers), and a Birge–Sponer fit.
const nu = WL.map((l) => 1e7 / l), d = nu.map((x) => nu[0] - x);
const fit = fitAnharmonic([1, 2, 3], d.slice(1));
const dG = [d[1], d[2] - d[1], d[3] - d[2]];
// Rounding of the wavelengths to 0.1 nm: try every ±0.05 nm corner.
let lo = { we: Infinity, wexe: Infinity, g: Infinity }, hi = { we: -Infinity, wexe: -Infinity, g: -Infinity };
for (let m = 0; m < 16; m++) {
  const w = WL.map((l, i) => l + ((m >> i) & 1 ? 0.05 : -0.05)), n2 = w.map((l) => 1e7 / l), d2 = n2.map((x) => n2[0] - x), f2 = fitAnharmonic([1, 2, 3], d2.slice(1));
  lo = { we: Math.min(lo.we, f2.we), wexe: Math.min(lo.wexe, f2.wexe), g: Math.min(lo.g, d2[1]) }; hi = { we: Math.max(hi.we, f2.we), wexe: Math.max(hi.wexe, f2.wexe), g: Math.max(hi.g, d2[1]) };
}

// 3. Laser-cooling numbers (our arithmetic with the standard formulas): Doppler limit ħΓ/2kB with Γ = 1/τ; recoil h²/(mλ²kB).
const mMol = AW.Cd + AW.Br;
const tdFor = (tau) => HBAR / (2 * KB * tau);
const tauFromTD = HBAR / (2 * KB * TD);
const trecoil = H ** 2 / (mMol * AMU * (WL[0] * 1e-9) ** 2 * KB);
const speeds = { rms: vrms(TINI, mMol / 1000), mp: vmostProbable(TINI, mMol / 1000) };

// Figure 1: Birge–Sponer plot.
const vh = [0.5, 1.5, 2.5];
const fig1 = chart({
  title: 'CdBr ground state: spacings from the laser wavelengths', xLabel: 'v + ½ (lower level of each step)', yLabel: 'ΔG (cm⁻¹)',
  series: [
    { name: 'From the wavelengths', kind: 'dots', x: vh, y: dG.map((x) => +x.toFixed(2)), size: 4, errors: [8.2, 8.2, 8.2] },
    { name: 'Fit', kind: 'line', x: [0, 3], y: [0, 3].map((x) => +(fit.we - 2 * fit.wexe * (x + 0.5)).toFixed(2)), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 3], yDomain: [215, 250], hlines: [{ y: WE, text: `paper's ωe ${WE} cm⁻¹` }],
  desc: `Vibrational spacings of the CdBr ground state implied by the four laser wavelengths: ${dG.map((x) => x.toFixed(1)).join(', ')} cm-1, with a straight-line fit giving ωe ${fit.we.toFixed(1)} and ωexe ${fit.wexe.toFixed(2)} cm-1. Rounding the wavelengths to 0.1 nm leaves each spacing uncertain by about 8 cm-1, so they agree with the paper's ωe of 231.4 cm-1.`, height: 260,
});
// Figure 2: bond length from Be against reduced mass.
const pts = [...iso, { id: 'average masses', mu: muAvg, r: rAvg }];
const fig2 = chart({
  title: 'Bond length from Be = 0.05928 cm⁻¹', xLabel: 'Reduced mass μ (u)', yLabel: 're (Å)',
  series: [
    { name: 'Single isotopologues', kind: 'dots', x: iso.map((p) => +p.mu.toFixed(4)), y: iso.map((p) => +p.r.toFixed(4)), size: 4, label: undefined },
    { name: 'Standard atomic weights', kind: 'dots', x: [+muAvg.toFixed(4)], y: [+rAvg.toFixed(4)], size: 5, colour: 'var(--c-tools)' },
    { name: '', noLegend: true, kind: 'line', x: [46.1, 47.5], y: [46.1, 47.5].map((m) => +bondLength(BE, m).toFixed(4)), colour: 'var(--muted)', dash: '3 3' },
  ],
  xDomain: [46.1, 47.5], yDomain: [2.445, 2.485], hlines: [{ y: RE, text: `paper's Re ${RE} Å` }],
  desc: `Bond length worked out from the rotational constant for each CdBr isotopologue (${iso.map((p) => `${p.id} ${p.r.toFixed(4)}`).join(', ')} Å) and for standard atomic weights (${rAvg.toFixed(4)} Å). The paper's 2.468 Å matches the atomic-weight value.`, height: 250,
});

console.log(JSON.stringify({
  iso: iso.map((p) => ({ id: p.id, mu: +p.mu.toFixed(4), r: +p.r.toFixed(4), B: +p.B.toFixed(5) })), muAvg: +muAvg.toFixed(4), rAvg: +rAvg.toFixed(4), Bavg: +Bavg.toFixed(5),
  nu: nu.map((x) => +x.toFixed(1)), d: d.map((x) => +x.toFixed(1)), dG: dG.map((x) => +x.toFixed(1)),
  fit: { we: +fit.we.toFixed(2), wexe: +fit.wexe.toFixed(3), r2: +fit.r2.toFixed(5), seWe: +fit.seWe.toFixed(2), seWexe: +fit.seWexe.toFixed(3) }, rounding: { we: [+lo.we.toFixed(1), +hi.we.toFixed(1)], wexe: [+lo.wexe.toFixed(2), +hi.wexe.toFixed(2)], dG1: [+lo.g.toFixed(1), +hi.g.toFixed(1)] },
  G01_paperWe_ifWexe0: +(G({ we: WE, wexe: 0 }, 1) - G({ we: WE, wexe: 0 }, 0)).toFixed(1),
  doppler: { atTauRange: TAU.map((t) => +tdFor(t).toExponential(3)), tauFromTD_ns: +(tauFromTD * 1e9).toFixed(1) }, recoil: +trecoil.toExponential(3), recoilRatio: +(TR / trecoil).toFixed(3),
  speeds: { rms: +speeds.rms.toFixed(1), mp: +speeds.mp.toFixed(1) }, mMol: +mMol.toFixed(3),
  tool: { r114_79: +bondLength(BE, reducedMass(ISO['114Cd'], ISO['79Br'])).toFixed(4) },
}));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'birge', figure(fig1, 'Figure 1. Vibrational spacings ΔG of the CdBr ground state implied by the paper\'s four laser wavelengths (bars: the ±8 cm⁻¹ that rounding to 0.1 nm allows), with the Diatomic spectroscopy calculator\'s straight-line fit. The dashed line is the paper\'s ωe. Within the rounding, the spacings agree with it.'));
  md = inject(md, 'bond', figure(fig2, 'Figure 2. The bond length the Diatomic spectroscopy calculator\'s maths gives from the paper\'s rotational constant, for the four main CdBr isotopologues and for standard atomic weights. Only the atomic-weight value rounds to the paper\'s 2.468 Å.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
