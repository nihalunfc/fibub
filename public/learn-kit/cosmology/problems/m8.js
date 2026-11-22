// Live problems for Module 8 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const GEV_KG = 1e9 * P.EV / (P.C * P.C); // 1 GeV/c² in kg (1.783e-27)
const KPC = 1e3 * P.PC;

export default {
  // ---------- 8.1 Zwicky's missing mass ----------
  'zwicky-missing-mass-virial': {
    title: 'weigh a galaxy cluster from its speeds',
    make(r) {
      const sig = pick(r, 700, 1200, 50), R = pick(r, 1, 2.5, 0.1), stars = pick(r, 1, 4, 0.5);
      const answer = (5 * (sig * 1e3) ** 2 * R * P.MPC) / P.G / P.M_SUN;
      return {
        q: `<p>The galaxies in a cluster move along our line of sight with a typical spread (velocity dispersion) of ${sig} km/s. The cluster is about ${R} Mpc in radius. Using the virial theorem for a uniform ball, <i>M</i> ≈ 5σ²<i>R</i>/<i>G</i>, how many <b>solar masses</b> does the cluster hold? (Its stars add up to about ${stars} × 10<sup>13</sup> suns.)</p>`,
        answer, unit: 'solar masses', tol: 0.02,
        hint: 'Put σ in m/s and R in metres (1 Mpc = 3.086 × 10²² m), use G = 6.674 × 10⁻¹¹, then divide the mass in kg by the Sun\'s 1.989 × 10³⁰ kg.',
        solution: steps(
          `σ² = (${sig} × 10³ m/s)² = ${n((sig * 1e3) ** 2)} m²/s². R = ${R} × 3.086 × 10²² m = ${n(R * P.MPC)} m.`,
          `M = 5 × ${n((sig * 1e3) ** 2)} × ${n(R * P.MPC)} ÷ 6.674 × 10⁻¹¹ = ${n(answer * P.M_SUN)} kg.`,
          `Divide by 1.989 × 10³⁰ kg: <b>${n(answer)} solar masses</b>.`,
          `The stars are only ${n((stars * 1e13 / answer) * 100, 2)}% of that. This is Zwicky's puzzle: most of the mass does not shine.`),
        sig, R,
      };
    },
    // same formula with G in astronomers' units: 4.3009 × 10⁻⁹ Mpc (km/s)² per solar mass
    verify: (p) => (5 * p.sig * p.sig * p.R) / 4.3009e-9,
  },
  'zwicky-missing-mass-hubble': {
    title: 'correct Zwicky for the modern Hubble constant',
    make(r) {
      const H0 = pick(r, 65, 75, 1);
      const answer = 500 * H0 / 558;
      return {
        q: `<p>In 1937 Zwicky found that the Coma cluster has about 500 times more mass than light (in solar units), using Hubble's expansion rate of 558 km/s per Mpc to get its distance. Virial masses grow in step with the distance (<i>M</i> ∝ <i>d</i>); luminosities grow as its square (<i>L</i> ∝ <i>d</i>²), and the distance is <i>d</i> = <i>v</i>/<i>H</i><sub>0</sub>. What mass-to-light ratio do you get with <i>H</i><sub>0</sub> = ${H0}?</p>`,
        answer, unit: 'solar units', tol: 0.02,
        hint: 'M/L ∝ d / d² = 1/d, and d ∝ 1/H₀, so M/L ∝ H₀.',
        solution: steps(
          `M/L ∝ d ÷ d² = 1/d. Since d = v/H₀, a smaller H₀ makes the cluster farther away and M/L smaller: M/L ∝ H₀.`,
          `New M/L = 500 × ${H0} ÷ 558 = <b>${n(answer)}</b>.`,
          `Hubble's H₀ was about 8 times too big, so Zwicky's number shrinks about 8-fold. Even so, it is many times what stars alone give (a few): the missing mass survives the correction.`),
        H0,
      };
    },
    verify: (p) => { const v = 7000, dOld = v / 558, dNew = v / p.H0; return 500 * (dNew / dOld) / (dNew / dOld) ** 2; },
  },

  // ---------- 8.2 Rotation curves ----------
  'rotation-curves-mass': {
    title: 'mass inside a flat rotation curve',
    make(r) {
      const v = pick(r, 150, 300, 10), R = pick(r, 10, 60, 5);
      const answer = ((v * 1e3) ** 2 * R * KPC) / P.G / P.M_SUN;
      return {
        q: `<p>A spiral galaxy's gas still orbits at ${v} km/s at ${R} kpc from its centre. How much mass (in <b>solar masses</b>) lies inside ${R} kpc? Use <i>M</i> = <i>v</i>²<i>r</i>/<i>G</i>.</p>`,
        answer, unit: 'solar masses', tol: 0.02,
        hint: 'A circular orbit needs gravity GM/r² to equal v²/r. 1 kpc = 3.086 × 10¹⁹ m.',
        solution: steps(
          `v = ${v} × 10³ m/s, r = ${R} × 3.086 × 10¹⁹ m = ${n(R * KPC)} m.`,
          `M = v² r / G = ${n((v * 1e3) ** 2)} × ${n(R * KPC)} ÷ 6.674 × 10⁻¹¹ = ${n(answer * P.M_SUN)} kg.`,
          `÷ 1.989 × 10³⁰ kg = <b>${n(answer)} solar masses</b>. If the curve stays flat twice as far out, the mass inside doubles.`),
        v, R,
      };
    },
    verify: (p) => (p.v * p.v * p.R) / 4.30091e-6,
  },
  'rotation-curves-kepler': {
    title: 'what Kepler would predict far out',
    make(r) {
      const v1 = pick(r, 180, 260, 10), r1 = pick(r, 8, 15, 1), k = pick(r, 2, 5, 1), r2 = r1 * k;
      const answer = v1 * Math.sqrt(r1 / r2);
      return {
        q: `<p>Nearly all of a galaxy's stars lie inside ${r1} kpc, where the gas orbits at ${v1} km/s. If the stars were all the mass, how fast should gas orbit at ${r2} kpc? (Measured: still about ${v1} km/s.)</p>`,
        answer, unit: 'km/s', tol: 0.01,
        hint: 'Outside almost all the mass, v = √(GM/r), so v falls as 1/√r.',
        solution: steps(
          `With the mass M fixed, v ∝ 1/√r. Going from ${r1} to ${r2} kpc is ${k} times farther.`,
          `v = ${v1} ÷ √${k} = <b>${n(answer)} km/s</b>.`,
          `The gas really moves at about ${v1} km/s, so the mass inside ${r2} kpc must be about ${k} times the mass of the stars (M ∝ v² r). The extra is dark.`),
        v1, r1, r2,
      };
    },
    verify: (p) => { const M = (p.v1 * 1e3) ** 2 * p.r1 * KPC / P.G; return Math.sqrt(P.G * M / (p.r2 * KPC)) / 1e3; },
  },

  // ---------- 8.3 The Bullet Cluster ----------
  'bullet-cluster-offset': {
    title: 'turn an angle on the sky into a distance',
    make(r) {
      const th = pick(r, 20, 60, 2), D = pick(r, 900, 1000, 10);
      const answer = th * P.ARCSEC * D * 1e3;
      return {
        q: `<p>In a pair of colliding clusters, the centre of mass found by lensing sits ${th} arcseconds from the centre of the hot gas. The clusters' angular diameter distance is ${D} Mpc. How far apart are the two centres, in <b>kpc</b>?</p>`,
        answer, unit: 'kpc', tol: 0.01,
        hint: 'Small angles: size = distance × angle in radians. 1 arcsecond = 4.848 × 10⁻⁶ radians; 1 Mpc = 1,000 kpc.',
        solution: steps(
          `${th}″ = ${th} × 4.848 × 10⁻⁶ = ${n(th * P.ARCSEC)} radians.`,
          `Size = ${D} Mpc × ${n(th * P.ARCSEC)} = ${n(answer / 1e3)} Mpc = <b>${n(answer)} kpc</b>.`,
          `Hundreds of thousands of light-years: far bigger than the uncertainty in a good lensing map, which is why such an offset is convincing.`),
        th, D,
      };
    },
    verify: (p) => (p.th / 3600) * (Math.PI / 180) * p.D * 1000,
  },
  'bullet-cluster-time': {
    title: 'how long ago did the clusters collide?',
    make(r) {
      const d = pick(r, 500, 900, 50), v = pick(r, 2500, 4500, 250);
      const answer = (d * KPC) / (v * 1e3) / (1e6 * P.YEAR);
      return {
        q: `<p>Since passing through the larger cluster, the smaller cluster's mass has travelled about ${d} kpc, at an average of ${v} km/s. How many <b>million years</b> ago did they pass through each other?</p>`,
        answer, unit: 'million years', tol: 0.01,
        hint: 'time = distance ÷ speed. 1 kpc = 3.086 × 10¹⁶ km; one million years = 3.156 × 10¹³ s.',
        solution: steps(
          `Distance: ${d} × 3.086 × 10¹⁶ km = ${n(d * KPC / 1e3)} km.`,
          `Time: ${n(d * KPC / 1e3)} ÷ ${v} km/s = ${n(answer * 1e6 * P.YEAR)} s.`,
          `÷ 3.156 × 10¹³ s = <b>${n(answer)} million years</b>: a blink in cosmic time, which is why the gas has not yet fallen back onto the mass.`),
        d, v,
      };
    },
    // 1 km/s ≈ 1.0227 pc per million years
    verify: (p) => (p.d * 1000) / (p.v * 1.02271),
  },

  // ---------- 8.4 Dark matter in the CMB ----------
  'dark-matter-cmb-ratio': {
    title: 'dark matter to atoms, from the CMB',
    make(r) {
      const wc = pick(r, 0.115, 0.125, 0.001), wb = pick(r, 0.0218, 0.023, 0.0002);
      const answer = wc / wb;
      return {
        q: `<p>A fit to the CMB peaks gives Ω<sub>c</sub>h² = ${wc} for dark matter and Ω<sub>b</sub>h² = ${wb} for atoms. How many times more dark matter than ordinary matter is there?</p>`,
        answer, unit: 'times', tol: 0.005,
        hint: 'Both numbers carry the same h², so it cancels in the ratio.',
        solution: steps(
          `Ratio = ${wc} ÷ ${wb} = <b>${n(answer)}</b>.`,
          `So dark matter is ${n(100 * wc / (wc + wb))}% of all matter.`,
          `With h = 0.674: Ω<sub>c</sub> = ${n(wc / 0.674 ** 2)} and Ω<sub>b</sub> = ${n(wb / 0.674 ** 2)}, the "26% and 5%" of the universe's budget.`),
        wc, wb,
      };
    },
    verify: (p) => { const f = p.wc / (p.wc + p.wb); return f / (1 - f); },
  },
  'dark-matter-cmb-growth': {
    title: 'can atoms alone make galaxies?',
    make(r) {
      const d = pick(r, 2, 10, 1), z = pick(r, 1050, 1150, 10);
      const answer = d * 1e-5 * (1 + z);
      return {
        q: `<p>Without dark matter, a lump of atoms could only start to grow when light let go of it at recombination (redshift ${z}), when it was ${d} × 10<sup>−5</sup> denser than average. If it then grew in step with the size of the universe, <i>a</i> = 1/(1 + <i>z</i>), how big would its density contrast δ be today?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'From recombination to today the universe grows by a factor 1 + z.',
        solution: steps(
          `The universe has grown ${1 + z} times since recombination.`,
          `δ today = ${d} × 10⁻⁵ × ${1 + z} = <b>${n(answer)}</b>.`,
          `A lump only collapses into a galaxy when δ reaches about 1. Atoms alone fall short by a factor of ${n(1 / answer, 2)}, and dark energy and the low density of atoms would slow them even more. Dark matter lumps were already about 10⁻³ or more at recombination.`),
        d, z,
      };
    },
    verify: (p) => { const aRec = 1 / (1 + p.z); return (p.d * 1e-5) * (1 / aRec); },
  },

  // ---------- 8.5 Candidates ----------
  'dark-matter-candidates-count': {
    title: 'how many dark matter particles in a litre?',
    make(r) {
      const kind = r() < 0.5 ? 'wimp' : 'axion', rho = pick(r, 0.3, 0.5, 0.05);
      const m = kind === 'wimp' ? [10, 30, 50, 100, 300, 1000][Math.min(5, Math.floor(r() * 6))] : [1, 3, 10, 30, 100][Math.min(4, Math.floor(r() * 5))] * 1e-15; // GeV
      const answer = (rho / m) * 1000;
      const mText = kind === 'wimp' ? `a WIMP of ${m} GeV` : `an axion of ${n(m * 1e15)} μeV (${n(m)} GeV)`;
      return {
        q: `<p>Near the Sun, dark matter has a density of about ${rho} GeV per cm³. If it is all ${mText}, how many particles are inside a <b>one-litre</b> bottle (1,000 cm³) at any moment?</p>`,
        answer, unit: 'particles', tol: 0.01,
        hint: 'Number per cm³ = density ÷ mass of one particle (both in GeV). Then multiply by 1,000.',
        solution: steps(
          `Per cm³: ${rho} ÷ ${n(m)} = ${n(rho / m)}.`,
          `Per litre: × 1,000 = <b>${n(answer)}</b>.`,
          kind === 'wimp' ? 'A handful of heavy particles: they rarely hit anything, which is why detectors need tonnes of xenon and years of waiting.' : 'An enormous crowd of very light particles: so many that they behave like a smooth wave, which is how haloscopes try to catch them.'),
        rho, m,
      };
    },
    verify: (p) => { const rhoSI = p.rho * GEV_KG * 1e6, mSI = p.m * GEV_KG; return (rhoSI / mSI) * 1e-3; },
  },
  'dark-matter-candidates-neutrino': {
    title: 'how much of the dark matter can neutrinos be?',
    make(r) {
      const sum = pick(r, 0.06, 0.15, 0.01);
      const wnu = (112 * sum) / 10540;
      const answer = 100 * wnu / 0.12;
      return {
        q: `<p>The Big Bang left about 112 neutrinos per cm³ of each of the three types (counting antineutrinos). Suppose the three masses add up to ${sum} eV. The critical density is 10,540 <i>h</i>² eV per cm³, and dark matter has Ω<sub>c</sub>h² = 0.12. What <b>percentage</b> of the dark matter could neutrinos be?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Energy density of neutrinos = 112 per cm³ × (sum of the three masses). Divide by 10,540 eV/cm³ to get Ω_ν h², then compare with 0.12.',
        solution: steps(
          `Neutrino density: 112 × ${sum} eV = ${n(112 * sum)} eV per cm³.`,
          `Ω<sub>ν</sub>h² = ${n(112 * sum)} ÷ 10,540 = ${n(wnu)} (the rule of thumb is Σm ÷ 94 eV; a more careful calculation gives Σm ÷ 93 eV).`,
          `As a share of 0.12: <b>${n(answer)}%</b>. Neutrinos are real dark matter, but only a sliver of it.`),
        sum,
      };
    },
    verify: (p) => 100 * (p.sum / (10540 / 112)) / 0.12,
  },

  // ---------- 8.6 Searches ----------
  'dark-matter-searches-flux': {
    title: 'WIMPs passing through your thumbnail',
    make(r) {
      const m = [10, 30, 50, 100, 200, 500, 1000][Math.min(6, Math.floor(r() * 7))], v = pick(r, 220, 250, 10);
      const answer = (0.3 / m) * v * 1e5;
      return {
        q: `<p>Take the standard local dark matter density, 0.3 GeV per cm³, made of WIMPs of ${m} GeV moving at about ${v} km/s relative to us. How many pass through 1 cm² (a thumbnail) <b>each second</b>?</p>`,
        answer, unit: 'per second', tol: 0.01,
        hint: 'Flux = number per cm³ × speed in cm/s. 1 km/s = 10⁵ cm/s.',
        solution: steps(
          `Number per cm³: 0.3 ÷ ${m} = ${n(0.3 / m)}.`,
          `Speed: ${v} km/s = ${n(v * 1e5)} cm/s.`,
          `Flux = ${n(0.3 / m)} × ${n(v * 1e5)} = <b>${n(answer)} per cm² per second</b>, yet almost none of them hit anything.`),
        m, v,
      };
    },
    verify: (p) => { const nSI = (0.3 * 1e6) / p.m; return nSI * p.v * 1e3 * 1e-4; },
  },
  'dark-matter-searches-recoil': {
    title: 'the biggest kick a WIMP can give a xenon nucleus',
    make(r) {
      const m = [20, 50, 100, 200, 500][Math.min(4, Math.floor(r() * 5))], v = pick(r, 200, 600, 50);
      const M = 131 * 0.9315, mu = (m * M) / (m + M), b = (v * 1e3) / P.C;
      const answer = (2 * mu * mu * b * b / M) * 1e6; // keV
      return {
        q: `<p>A WIMP of ${m} GeV moving at ${v} km/s hits a xenon-131 nucleus (mass 122 GeV) head-on. What is the most energy, in <b>keV</b>, the nucleus can get? Use <i>E</i><sub>max</sub> = 2μ²<i>v</i>²/<i>M</i>, where μ = <i>mM</i>/(<i>m</i> + <i>M</i>) and <i>v</i> is a fraction of the speed of light.</p>`,
        answer, unit: 'keV', tol: 0.01,
        hint: 'v/c = speed ÷ 299,792 km/s. Keep masses in GeV; the answer comes out in GeV, then × 10⁶ for keV.',
        solution: steps(
          `μ = ${m} × ${n(M, 4)} ÷ ${n(m + M, 4)} = ${n(mu)} GeV. v/c = ${n(b)}.`,
          `E<sub>max</sub> = 2 × ${n(mu)}² × (${n(b)})² ÷ ${n(M, 4)} = ${n(answer / 1e6)} GeV = <b>${n(answer)} keV</b>.`,
          `A few to tens of keV: a tiny flash, which is why detectors must be so quiet. A light WIMP gives far less, below what detectors can see.`),
        m, v,
      };
    },
    // elastic collision: the largest energy share is 4mM/(m+M)² of the WIMP's kinetic energy ½mv²
    verify: (p) => { const M = 131 * 0.9315, b = (p.v * 1e3) / P.C; return (4 * p.m * M / (p.m + M) ** 2) * 0.5 * p.m * b * b * 1e6; },
  },

  // ---------- 8.7 MOND ----------
  'mond-flat-speed': {
    title: 'MOND\'s flat rotation speed',
    make(r) {
      const mant = pick(r, 1, 9, 1), e = pick(r, 9, 11, 1), M = mant * 10 ** e, a0 = 1.2e-10;
      const answer = Math.pow(P.G * M * P.M_SUN * a0, 0.25) / 1e3;
      return {
        q: `<p>A galaxy's stars and gas weigh ${mant} × 10<sup>${e}</sup> suns. In MOND, far from the centre the orbital speed levels off at <i>v</i> = (<i>G M a</i><sub>0</sub>)<sup>1/4</sup>, with <i>a</i><sub>0</sub> = 1.2 × 10<sup>−10</sup> m/s². What is that speed, in <b>km/s</b>?</p>`,
        answer, unit: 'km/s', tol: 0.01,
        hint: 'M in kg = suns × 1.989 × 10³⁰. Multiply G × M × a₀, then take the square root twice.',
        solution: steps(
          `M = ${n(M * P.M_SUN)} kg; G M a₀ = 6.674 × 10⁻¹¹ × ${n(M * P.M_SUN)} × 1.2 × 10⁻¹⁰ = ${n(P.G * M * P.M_SUN * a0)} m⁴/s⁴.`,
          `Fourth root: ${n(answer * 1e3)} m/s = <b>${n(answer)} km/s</b>.`,
          `This is the baryonic Tully-Fisher relation, M ∝ v⁴: MOND predicts it from the visible mass alone, with nothing to adjust.`),
        M,
      };
    },
    verify: (p) => Math.exp(0.25 * (Math.log(P.G) + Math.log(p.M * P.M_SUN) + Math.log(1.2e-10))) / 1e3,
  },
  'mond-radius': {
    title: 'where does MOND take over?',
    make(r) {
      const mant = pick(r, 1, 9, 1), e = pick(r, 9, 11, 1), M = mant * 10 ** e;
      const answer = Math.sqrt((P.G * M * P.M_SUN) / 1.2e-10) / KPC;
      return {
        q: `<p>A galaxy has ${mant} × 10<sup>${e}</sup> suns of stars and gas. At what distance from its centre, in <b>kpc</b>, does its Newtonian pull <i>GM</i>/<i>r</i>² drop to <i>a</i><sub>0</sub> = 1.2 × 10<sup>−10</sup> m/s²? (Treat all the mass as being inside.)</p>`,
        answer, unit: 'kpc', tol: 0.01,
        hint: 'Solve GM/r² = a₀ for r: r = √(GM/a₀). Then divide metres by 3.086 × 10¹⁹.',
        solution: steps(
          `GM = 6.674 × 10⁻¹¹ × ${n(M * P.M_SUN)} kg = ${n(P.G * M * P.M_SUN)} m³/s².`,
          `r = √(${n(P.G * M * P.M_SUN)} ÷ 1.2 × 10⁻¹⁰) = ${n(answer * KPC)} m = <b>${n(answer)} kpc</b>.`,
          `Beyond about this radius, MOND says gravity is stronger than Newton's; in the dark matter picture, the halo takes over there. Both put the change at the same place, which is part of the puzzle.`),
        M,
      };
    },
    // G in kpc (km/s)² per sun, a0 in (km/s)² per kpc
    verify: (p) => Math.sqrt((4.30091e-6 * p.M) / (1.2e-10 * KPC / 1e6)),
  },

  // ---------- 8.8 Dark matter today ----------
  'dark-matter-today-earth': {
    title: 'how much dark matter is inside the Earth?',
    make(r) {
      const rho = pick(r, 0.3, 0.5, 0.05);
      const answer = rho * GEV_KG * 1e6 * (4 / 3) * Math.PI * P.R_EARTH ** 3;
      return {
        q: `<p>If the local dark matter density is ${rho} GeV per cm³ and dark matter passes straight through the Earth, how many <b>kilograms</b> of it are inside the Earth (radius 6,371 km) at any moment? (1 GeV/c² = 1.783 × 10⁻²⁷ kg.)</p>`,
        answer, unit: 'kg', tol: 0.01,
        hint: 'Turn the density into kg per m³ (1 m³ = 10⁶ cm³), then multiply by the Earth\'s volume 4/3 π R³.',
        solution: steps(
          `Density: ${rho} × 1.783 × 10⁻²⁷ kg × 10⁶ = ${n(rho * GEV_KG * 1e6)} kg/m³.`,
          `Earth's volume: 4/3 × π × (6.371 × 10⁶ m)³ = ${n((4 / 3) * Math.PI * P.R_EARTH ** 3)} m³.`,
          `Mass: <b>${n(answer)} kg</b>, about a bag of sugar, spread through the whole planet. Dark matter is everywhere, but very thin.`),
        rho,
      };
    },
    verify: (p) => { const gPerCm3 = p.rho * GEV_KG * 1e3; const vCm3 = (4 / 3) * Math.PI * (P.R_EARTH * 100) ** 3; return gPerCm3 * vCm3 / 1e3; },
  },
  'dark-matter-today-ratio': {
    title: 'our neighbourhood against the cosmic average',
    make(r) {
      const rho = pick(r, 0.3, 0.5, 0.05), wc = 0.12;
      const avg = wc * P.criticalDensity(100); // kg/m³
      const answer = (rho * GEV_KG * 1e6) / avg;
      return {
        q: `<p>Averaged over the whole universe, dark matter's density is Ω<sub>c</sub>h² × 1.878 × 10<sup>−26</sup> kg/m³, with Ω<sub>c</sub>h² = 0.12. Near the Sun it is ${rho} GeV per cm³. How many <b>times</b> denser is dark matter here than on average?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Put both in kg/m³: 1 GeV per cm³ = 1.783 × 10⁻²⁷ kg × 10⁶ per m³.',
        solution: steps(
          `Average: 0.12 × 1.878 × 10⁻²⁶ = ${n(avg)} kg/m³ (a bit more than one proton's mass per cubic metre).`,
          `Here: ${rho} × 1.783 × 10⁻²¹ = ${n(rho * GEV_KG * 1e6)} kg/m³.`,
          `Ratio: <b>${n(answer)}</b>. We live inside a halo, a lump hundreds of thousands of times denser than the cosmic average.`),
        rho,
      };
    },
    // in GeV per cm³: critical density / h² = 1.0537 × 10⁻⁵ GeV/cm³
    verify: (p) => p.rho / (0.12 * 1.05375e-5),
  },
};
