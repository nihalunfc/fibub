// Live problems for Module 6 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
// Module 6: the hot Big Bang, from the first second to recombination. Each verify(p) recomputes the answer by a
// different route (SI units instead of MeV, a numerical integral or search instead of a formula, and so on).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const KEV = P.K_B / P.EV;            // Boltzmann constant in eV per kelvin, 8.617 × 10⁻⁵
const MEV_KG = 1e6 * P.EV / (P.C * P.C); // 1 MeV/c² in kg
const HBAR = P.H_PLANCK / (2 * Math.PI);
const ZETA3 = 1.2020569;
const TAU_N = 879;                    // neutron mean lifetime, s (PDG 2024: 878.4 ± 0.5)
const Q_NP = 1.2933;                  // neutron minus proton mass, MeV
const SIGMA_T = 6.6524587e-29;        // Thomson cross-section, m²
/** Photons per cubic metre in a blackbody at T (K): 16π ζ(3) (kT / hc)³. */
const nGamma = (T) => 16 * Math.PI * ZETA3 * Math.pow((P.K_B * T) / (P.H_PLANCK * P.C), 3);
/** Simple numerical search for the peak of a function on [a, b] (golden section). */
const peak = (f, a, b) => { const g = (Math.sqrt(5) - 1) / 2; for (let i = 0; i < 120; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (f(c) > f(d)) b = d; else a = c; } return (a + b) / 2; };
/** Bisection for f(x) = 0 on [a, b] with f increasing. */
const solve = (f, a, b) => { for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (f(m) > 0) b = m; else a = m; } return (a + b) / 2; };

export default {
  // ---------- 6.1 Gamow, Alpher and Herman ----------
  'gamow-alpher-herman-glow': {
    title: 'predict today\'s glow like Alpher and Herman',
    make(r) {
      const nNuc = pick(r, 1, 9, 0.5), e = pick(r, 24, 25, 1), n0 = pick(r, 0.1, 1, 0.05);
      const Nn = nNuc * 10 ** e, Tn = 1e9;
      const stretch = Math.cbrt(Nn / n0), answer = Tn / stretch;
      return {
        q: `<p>Suppose making the right amount of helium needs ${nNuc} × 10<sup>${e}</sup> atoms per cubic metre at the moment the universe was at 1 billion K (10<sup>9</sup> K). Today space holds about ${n0} atoms per cubic metre. Atoms thin out as 1/a³ and the temperature of the light falls as 1/a. What temperature should the leftover glow have today, in kelvin?</p>`,
        answer, unit: 'K', tol: 0.01,
        hint: 'First find how much the universe has grown: the density fell by (size factor)³, so the size factor is the cube root of (density then ÷ density now). The temperature fell by that same factor.',
        solution: steps(
          `Density then ÷ density now = ${n(Nn)} ÷ ${n0} = ${n(Nn / n0)}.`,
          `Growth in size since then = cube root of that = ${n(stretch)}.`,
          `Temperature today = 10<sup>9</sup> K ÷ ${n(stretch)} = <b>${n(answer)} K</b>. With today's measured numbers this gives about 3 K; Alpher and Herman's 1948 inputs gave about 5 K.`),
        Nn, n0, Tn,
      };
    },
    verify: (p) => 10 ** (Math.log10(p.Tn) + (Math.log10(p.n0) - Math.log10(p.Nn)) / 3),
  },
  'gamow-alpher-herman-peak': {
    title: 'where would the predicted glow shine?',
    make(r) {
      const T = pick(r, 2, 10, 0.5);
      const answer = (P.WIEN_B / T) * 1000;
      return {
        q: `<p>A prediction says the whole sky should glow like a blackbody at ${T} K. At what wavelength does that glow shine most, in <b>millimetres</b>? (Wien's law: λ<sub>peak</sub> = 2.898 × 10<sup>−3</sup> m K ÷ T.)</p>`,
        answer, unit: 'mm', tol: 0.01,
        hint: 'Divide 2.898 × 10⁻³ by the temperature to get metres, then multiply by 1,000 for millimetres.',
        solution: steps(
          `λ<sub>peak</sub> = 2.898 × 10<sup>−3</sup> ÷ ${T} = ${n(P.WIEN_B / T)} m.`,
          `= <b>${n(answer)} mm</b>: microwaves, far beyond what eyes or 1940s optical telescopes could see. Finding it needed a sensitive microwave receiver.`),
        T,
      };
    },
    // the peak of Planck's curve found by search, not by Wien's formula
    verify: (p) => peak((lam) => P.planck(lam, p.T), 1e-5, 1e-1) * 1000,
  },

  // ---------- 6.2 Big Bang or Steady State ----------
  'big-bang-vs-steady-state-creation': {
    title: 'how fast must a steady-state universe make matter?',
    make(r) {
      const H0 = pick(r, 50, 80, 1);
      const nAtoms = P.criticalDensity(H0) / P.M_P;
      const Hs = (H0 * 1000) / P.MPC;
      const answer = 3 * Hs * nAtoms * P.GYR;
      return {
        q: `<p>In the Steady State theory the universe expands at H<sub>0</sub> = ${H0} km/s per Mpc, yet its density never changes. Take that density to be the critical density, ${n(P.criticalDensity(H0))} kg/m³, all hydrogen (1.67 × 10<sup>−27</sup> kg per atom). Each cubic metre grows in volume at the rate 3H<sub>0</sub>, so new atoms must appear at 3H<sub>0</sub> × (atoms per m³). How many new atoms per cubic metre per <b>billion years</b> is that?</p>`,
        answer, unit: 'atoms per m³ per billion years', tol: 0.01,
        hint: 'Turn H₀ into "per second" by dividing by the kilometres in a megaparsec (3.086 × 10¹⁹), then multiply by 3, by the atoms per m³, and by the seconds in a billion years (3.156 × 10¹⁶).',
        solution: steps(
          `Atoms per m³ = ${n(P.criticalDensity(H0))} ÷ 1.67 × 10<sup>−27</sup> = ${n(nAtoms)}.`,
          `H<sub>0</sub> = ${H0} ÷ 3.086 × 10<sup>19</sup> = ${n(Hs)} per second.`,
          `3 × ${n(Hs)} × ${n(nAtoms)} × 3.156 × 10<sup>16</sup> s = <b>${n(answer)}</b> atoms per m³ per billion years. In a room of 50 m³ that is one new atom every few tens of millions of years: far too little to notice.`),
        H0,
      };
    },
    // the same rate as 3 × density ÷ Hubble time, using phys.js's Hubble time
    verify: (p) => (3 * (P.criticalDensity(p.H0) / P.M_P)) / P.hubbleTimeGyr(p.H0),
  },
  'big-bang-vs-steady-state-counts': {
    title: 'counting radio sources in an unchanging universe',
    make(r) {
      const k = pick(r, 2, 10, 1), N0 = pick(r, 50, 400, 10);
      const answer = N0 * Math.pow(k, 1.5);
      return {
        q: `<p>In a universe that is the same everywhere and at all times (and not so far away that expansion matters), a radio survey finds ${N0} sources brighter than some limit. A new receiver can see sources ${k} times fainter. How many sources should it find in the same patch of sky?</p>`,
        answer, unit: 'sources', tol: 0.01,
        hint: 'Brightness falls as 1/distance², so seeing k times fainter reaches √k times farther. The number of sources grows with the volume, distance³.',
        solution: steps(
          `Reach: √${k} = ${n(Math.sqrt(k))} times farther.`,
          `Volume: ${n(Math.sqrt(k))}³ = ${k}<sup>1.5</sup> = ${n(Math.pow(k, 1.5))} times more space, so that many times more sources.`,
          `${N0} × ${n(Math.pow(k, 1.5))} = <b>${n(answer)}</b>. This is the "N ∝ S<sup>−3/2</sup>" rule. Martin Ryle's counts found too many faint sources compared with bright ones: the universe was different in the past.`),
        k, N0,
      };
    },
    verify: (p) => p.N0 * Math.sqrt(p.k) ** 3,
  },

  // ---------- 6.3 Temperature and time ----------
  'temperature-and-time-redshift': {
    title: 'when was space as hot as this?',
    make(r) {
      const list = [['room temperature (293 K)', 293], ['water boils (373 K)', 373], ['lead melts (601 K)', 601], ['iron glows red (about 1,000 K)', 1000], ['hydrogen atoms form (about 3,000 K)', 3000]];
      const [what, T] = list[pick(r, 0, list.length - 1, 1)];
      const answer = T / P.T_CMB - 1;
      return {
        q: `<p>The cosmic background is 2.7255 K today, and its temperature goes as 1/a = 1 + z. At what redshift was the whole universe at the temperature at which ${what}?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'T = 2.7255 K × (1 + z), so 1 + z = T ÷ 2.7255 K.',
        solution: steps(
          `1 + z = ${T} ÷ 2.7255 = ${n(T / P.T_CMB, 4)}.`,
          `z = <b>${n(answer, 4)}</b>: the universe was ${n(T / P.T_CMB, 3)} times smaller than today.`),
        T,
      };
    },
    verify: (p) => solve((z) => P.cmbTemp(z) - p.T, 0, 1e5),
  },
  'temperature-and-time-clock': {
    title: 'read the cosmic clock from the temperature',
    make(r) {
      const T9 = pick(r, 1, 30, 1); // in 10⁹ K
      const T = T9 * 1e9, gs = T > 6e9 ? 10.75 : 3.36;
      const kT = KEV * T / 1e6; // MeV
      const answer = (2.42 / Math.sqrt(gs)) / (kT * kT);
      return {
        q: `<p>In the radiation era, time and temperature are tied by t ≈ (2.42 s ÷ √g<sub>*</sub>) × (1 MeV ÷ kT)², where g<sub>*</sub> counts the kinds of particles in the hot soup. When the universe was at ${T9} × 10<sup>9</sup> K, g<sub>*</sub> was about ${gs}. How old was it, in seconds? (k = 8.617 × 10<sup>−5</sup> eV per K.)</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'First turn the temperature into an energy: kT = 8.617 × 10⁻⁵ eV/K × T, then into MeV (divide by a million).',
        solution: steps(
          `kT = 8.617 × 10<sup>−5</sup> × ${n(T)} eV = ${n(kT, 4)} MeV.`,
          `(1 MeV ÷ kT)² = ${n(1 / (kT * kT), 4)}; 2.42 ÷ √${gs} = ${n(2.42 / Math.sqrt(gs), 4)} s.`,
          `t ≈ <b>${n(answer)} s</b>. ${answer < 10 ? 'Still in the first few seconds.' : answer < 400 ? 'This is the era of the first nuclei, the first few minutes.' : 'Nuclei have already formed.'}`),
        T, gs,
      };
    },
    // independent: energy density ρ = g* (π²/30) (kT)⁴/(ħc)³ in SI, H² = 8πGρ/3c², and t = 1/(2H)
    verify: (p) => {
      const E = P.K_B * p.T, rho = p.gs * (Math.PI ** 2 / 30) * E ** 4 / (HBAR * P.C) ** 3;
      return 1 / (2 * Math.sqrt((8 * Math.PI * P.G * rho) / (3 * P.C * P.C)));
    },
  },

  // ---------- 6.4 The first second ----------
  'first-second-threshold': {
    title: 'how hot to make a particle out of light?',
    make(r) {
      const list = [['a proton', 938.272, P.M_P], ['an electron', 0.511, P.M_E], ['a muon', 105.658, 1.883531627e-28], ['a charged pion', 139.570, 2.48807e-28], ['a neutron', 939.565, 1.67492750e-27]];
      const [name, mev, kg] = list[pick(r, 0, list.length - 1, 1)];
      const answer = (mev * 1e6) / KEV;
      return {
        q: `<p>Particles and their antiparticles are made freely from collisions of light when the typical energy kT is at least about the particle's rest energy mc². The rest energy of ${name} is ${mev} MeV. At roughly what temperature, in kelvin, does kT equal it? (k = 8.617 × 10<sup>−5</sup> eV per K.)</p>`,
        answer, unit: 'K', tol: 0.01,
        hint: 'Set kT = mc² and solve for T: T = mc² ÷ k, with mc² in eV.',
        solution: steps(
          `mc² = ${mev} MeV = ${n(mev * 1e6)} eV.`,
          `T = ${n(mev * 1e6)} ÷ 8.617 × 10<sup>−5</sup> = <b>${n(answer)} K</b>.`,
          `Below this temperature (in practice a few times below it) pairs are no longer made, and the particles and antiparticles annihilate. Only the tiny excess of matter survives.`),
        kg,
      };
    },
    // from the mass in kilograms: T = m c² / k_B
    verify: (p) => (p.kg * P.C * P.C) / P.K_B,
  },
  'first-second-ratio': {
    title: 'neutrons per proton in the hot soup',
    make(r) {
      const kT = pick(r, 0.6, 3, 0.1);
      const answer = Math.exp(-Q_NP / kT);
      return {
        q: `<p>While weak reactions are fast, neutrons and protons keep swapping, and their ratio is n/p = e<sup>−Q/kT</sup>, where Q = 1.293 MeV is how much more energy a neutron's mass holds than a proton's. What is n/p when kT = ${kT} MeV? (Answer as a decimal.)</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Divide 1.293 by kT, put a minus sign in front, and take e to that power.',
        solution: steps(
          `Q/kT = 1.293 ÷ ${kT} = ${n(Q_NP / kT, 4)}.`,
          `n/p = e<sup>−${n(Q_NP / kT, 4)}</sup> = <b>${n(answer, 4)}</b>, about 1 neutron for every ${n(1 / answer, 3)} protons.`,
          'Below kT ≈ 0.8 MeV, about 1 second after the start, the weak reactions become too slow and the ratio stops following this formula: it levels off near 1/6 instead of falling to zero.'),
        kT,
      };
    },
    // from the masses in kilograms: Δm c² against kT in joules
    verify: (p) => Math.exp(-((Q_NP * MEV_KG) * P.C * P.C) / (p.kT * 1e6 * P.EV)),
  },

  // ---------- 6.5 Neutrinos let go ----------
  'cosmic-neutrinos-temperature': {
    title: 'how cold are the relic neutrinos?',
    make(r) {
      const z = pick(r, 0, 1100, 50);
      const Tg = P.T_CMB * (1 + z), answer = Math.cbrt(4 / 11) * Tg;
      return {
        q: `<p>The relic neutrinos are cooler than the background light by the factor (4/11)<sup>1/3</sup>, because electron-positron annihilation heated the light after the neutrinos had let go. The light is at 2.7255 K × (1 + z). What was the neutrino temperature at redshift z = ${z}, in kelvin?</p>`,
        answer, unit: 'K', tol: 0.005,
        hint: 'Find the photon temperature first, then multiply by (4/11)^(1/3) ≈ 0.714.',
        solution: steps(
          `T<sub>γ</sub> = 2.7255 × ${1 + z} = ${n(Tg, 4)} K.`,
          `(4/11)<sup>1/3</sup> = ${n(Math.cbrt(4 / 11), 4)}.`,
          `T<sub>ν</sub> = ${n(Tg, 4)} × ${n(Math.cbrt(4 / 11), 4)} = <b>${n(answer, 4)} K</b>.${z === 0 ? ' Today: about 1.95 K.' : ''}`),
        z,
      };
    },
    // entropy route: photons + e± (g = 2 + 7/8 × 4 = 5.5) hand all their heat to photons (g = 2)
    verify: (p) => P.T_CMB * (1 + p.z) / Math.cbrt(5.5 / 2),
  },
  'cosmic-neutrinos-count': {
    title: 'how many Big Bang neutrinos are in here?',
    make(r) {
      const list = [['a 1-litre bottle', 1000], ['an adult human body (about 65 litres)', 65000], ['a car (about 3 cubic metres of space)', 3e6], ['a classroom 8 m × 7 m × 3 m', 1.68e8]];
      const [what, V] = list[pick(r, 0, 3, 1)];
      const ng = 411, per = (3 / 11) * ng, answer = 3 * per * V;
      return {
        q: `<p>The background light holds 411 photons per cubic centimetre. For each of the three kinds of neutrino, neutrinos plus antineutrinos number 3/11 of the photons. How many relic neutrinos, all kinds together, are inside ${what} (${n(V)} cm³) at any moment?</p>`,
        answer, unit: 'neutrinos', tol: 0.01,
        hint: 'Per kind: 3/11 × 411 ≈ 112 per cm³. Three kinds: about 336 per cm³. Multiply by the volume in cm³.',
        solution: steps(
          `Per kind: 3/11 × 411 = ${n(per)} per cm³.`,
          `All three kinds: 3 × ${n(per)} = ${n(3 * per)} per cm³.`,
          `${n(3 * per)} × ${n(V)} cm³ = <b>${n(answer)}</b> neutrinos, passing through almost without a trace.`),
        V,
      };
    },
    // photon density worked out from the CMB temperature, then 9/11 of it for three kinds
    verify: (p) => (9 / 11) * nGamma(P.T_CMB) / 1e6 * p.V,
  },

  // ---------- 6.6 Big Bang nucleosynthesis ----------
  'big-bang-nucleosynthesis-helium': {
    title: 'helium from the neutron count',
    make(r) {
      const per = pick(r, 6, 8, 0.1);
      const f = 1 / per, answer = (2 * f) / (1 + f);
      return {
        q: `<p>When nuclei finally form, there is 1 neutron for every ${per} protons. Almost every neutron ends up in helium-4 (2 protons + 2 neutrons). What fraction of the mass of ordinary matter becomes helium? (Answer as a decimal, for example 0.25.)</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Each neutron grabs one proton to go into helium. Or use Y = 2(n/p) ÷ (1 + n/p).',
        solution: steps(
          `n/p = 1/${per} = ${n(f, 4)}.`,
          `Y = 2 × ${n(f, 4)} ÷ (1 + ${n(f, 4)}) = <b>${n(answer, 3)}</b>.`,
          'About a quarter of the mass in helium: what astronomers find in the oldest stars and gas clouds.'),
        per,
      };
    },
    // counting nuclei: in a box of 1 neutron and `per` protons, helium holds the neutron and one proton (mass 2) out of 1 + per
    verify: (p) => 2 / (1 + p.per),
  },
  'big-bang-nucleosynthesis-decay': {
    title: 'neutrons decay while they wait',
    make(r) {
      const per0 = pick(r, 5.5, 6.5, 0.1), t = pick(r, 100, 250, 10);
      const X0 = 1 / (1 + per0), X = X0 * Math.exp(-t / TAU_N), answer = (1 - X) / X;
      return {
        q: `<p>Some seconds after the start there is 1 neutron for every ${per0} protons. A free neutron decays into a proton with a mean lifetime of ${TAU_N} s, so the neutrons' share of all the nucleons falls as e<sup>−t/${TAU_N} s</sup>. Deuterium finally survives ${t} s later. How many protons are there then for every neutron?</p>`,
        answer, unit: 'protons per neutron', tol: 0.005,
        hint: 'Neutrons are 1 out of every (1 + protons) nucleons. Multiply that share by e^(−t/879), then protons per neutron = (1 − share) ÷ share.',
        solution: steps(
          `Neutron share at the start: 1 ÷ (1 + ${per0}) = ${n(X0, 4)}.`,
          `After ${t} s: ${n(X0, 4)} × e<sup>−${t}/${TAU_N}</sup> = ${n(X, 4)}.`,
          `Protons per neutron: (1 − ${n(X, 4)}) ÷ ${n(X, 4)} = <b>${n(answer, 4)}</b>. The neutrons that decayed became extra protons, so less helium can form.`),
        per0, t,
      };
    },
    // step the decay forward in small time steps instead of using the exponential
    verify: (p) => {
      let nn = 1, pp = p.per0; const dt = 0.01;
      for (let s = 0; s < p.t - 1e-9; s += dt) { const d = nn * (dt / TAU_N); nn -= d; pp += d; }
      return pp / nn;
    },
  },

  // ---------- 6.7 The lithium problem ----------
  'lithium-problem-factor': {
    title: 'how much lithium is missing?',
    make(r) {
      const pred = pick(r, 4.5, 5.6, 0.1), A = pick(r, 2.1, 2.3, 0.02);
      const obs = 10 ** (A - 12), answer = (pred * 1e-10) / obs;
      return {
        q: `<p>Big Bang nucleosynthesis predicts ${pred} × 10<sup>−10</sup> lithium-7 atoms per hydrogen atom. Old halo stars show A(Li) = ${A}, where A(Li) = 12 + log<sub>10</sub>(Li/H). How many times more lithium does the theory predict than the stars show?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Turn A(Li) back into Li/H: Li/H = 10^(A − 12). Then divide the prediction by it.',
        solution: steps(
          `Observed Li/H = 10<sup>${A} − 12</sup> = ${n(obs)}.`,
          `${pred} × 10<sup>−10</sup> ÷ ${n(obs)} = <b>${n(answer)}</b>. Roughly three times too much: the lithium problem.`),
        pred, A,
      };
    },
    // compare on the A(Li) scale: difference of logs
    verify: (p) => 10 ** ((12 + Math.log10(p.pred * 1e-10)) - p.A),
  },
  'lithium-problem-eta': {
    title: 'could a different baryon density fix lithium?',
    make(r) {
      const obs = pick(r, 1.3, 1.9, 0.1), pred = pick(r, 4.8, 5.4, 0.1);
      const answer = 6.1 * Math.sqrt(obs / pred);
      return {
        q: `<p>Near the measured baryon density (η = 6.1 × 10<sup>−10</sup>), predicted lithium-7 is ${pred} × 10<sup>−10</sup> per hydrogen atom and grows as η². What η (in units of 10<sup>−10</sup>) would bring it down to the ${obs} × 10<sup>−10</sup> seen in old stars, if that rule held?</p>`,
        answer, unit: '× 10⁻¹⁰', tol: 0.005,
        hint: 'Lithium ∝ η², so η must change by the square root of (wanted ÷ predicted).',
        solution: steps(
          `Wanted ÷ predicted = ${obs} ÷ ${pred} = ${n(obs / pred, 4)}.`,
          `√${n(obs / pred, 4)} = ${n(Math.sqrt(obs / pred), 4)}, so η = 6.1 × ${n(Math.sqrt(obs / pred), 4)} = <b>${n(answer, 4)}</b> × 10<sup>−10</sup>.`,
          `But deuterium goes as η<sup>−1.6</sup>: at that η it would be about ${n(Math.pow(6.1 / answer, 1.6), 2)} times the measured 2.5 × 10<sup>−5</sup>, and the CMB rules out such a low η. Changing η does not solve the problem.`),
        obs, pred,
      };
    },
    // search for the η where the η² law meets the observed value
    verify: (p) => solve((eta) => p.pred * (eta / 6.1) ** 2 - p.obs, 0.5, 20),
  },

  // ---------- 6.8 Matter-radiation equality ----------
  'matter-radiation-equality-neutrinos': {
    title: 'equality needs the neutrinos',
    make(r) {
      const Om = pick(r, 0.28, 0.34, 0.01), Og = pick(r, 5.2, 5.6, 0.05) * 1e-5;
      const f = 1 + 3 * (7 / 8) * Math.pow(4 / 11, 4 / 3), Or = Og * f, answer = Om / Or - 1;
      return {
        q: `<p>Today light (photons) makes up Ω<sub>γ</sub> = ${n(Og * 1e5, 3)} × 10<sup>−5</sup> of the critical density and matter Ω<sub>m</sub> = ${Om}. The three kinds of relic neutrino add another 3 × (7/8) × (4/11)<sup>4/3</sup> = 0.681 times the photons' share to the radiation. At what redshift were matter and radiation (photons plus neutrinos) equal?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Ω_r = Ω_γ × (1 + 0.681). Radiation thins as 1/a⁴ and matter as 1/a³, so they were equal when 1 + z = Ω_m ÷ Ω_r.',
        solution: steps(
          `Ω<sub>r</sub> = ${n(Og)} × 1.681 = ${n(Or)}.`,
          `1 + z = ${Om} ÷ ${n(Or)} = ${n(Om / Or, 4)}, so z = <b>${n(answer, 4)}</b>.`,
          `Leave out the neutrinos and you would get z = ${n(Om / Og - 1, 4)}, far too early.`),
        Om, Og,
      };
    },
    // phys.js's zEquality with the radiation share built up from photons and three neutrino kinds
    verify: (p) => P.zEquality({ Om: p.Om, Or: p.Og * (1 + 3 * 0.875 * (4 / 11) ** (4 / 3)) }),
  },
  'matter-radiation-equality-time': {
    title: 'how long after the start was equality?',
    make(r) {
      const Om = pick(r, 0.26, 0.36, 0.01), H0 = pick(r, 64, 74, 1), Or = 9.1e-5 * (67.7 / H0) ** 2;
      const aeq = Or / Om, tH = P.hubbleTimeGyr(H0) * 1e9;
      const answer = (4 * aeq * aeq / (3 * Math.sqrt(Or))) * (1 - Math.SQRT1_2) * tH;
      return {
        q: `<p>A universe of matter and radiation has H<sub>0</sub> = ${H0} km/s per Mpc (Hubble time ${n(tH / 1e9, 4)} billion years), Ω<sub>m</sub> = ${Om} and Ω<sub>r</sub> = ${n(Or)}. Solving the Friedmann equation gives the time of equality as t<sub>eq</sub> = (4 a<sub>eq</sub>² ÷ 3√Ω<sub>r</sub>) × (1 − 1/√2) × (Hubble time), with a<sub>eq</sub> = Ω<sub>r</sub>/Ω<sub>m</sub>. How many <b>years</b> after the start was that?</p>`,
        answer, unit: 'years', tol: 0.01,
        hint: 'Work out a_eq first, square it, divide by 3√Ω_r, multiply by 4, then by 0.2929 and by the Hubble time in years.',
        solution: steps(
          `a<sub>eq</sub> = ${n(Or)} ÷ ${Om} = ${n(aeq)} (z ≈ ${n(1 / aeq - 1, 4)}).`,
          `4a<sub>eq</sub>² ÷ (3√Ω<sub>r</sub>) = ${n(4 * aeq * aeq / (3 * Math.sqrt(Or)))}; × 0.2929 = ${n(answer / tH)} Hubble times.`,
          `× ${n(tH)} years = <b>${n(answer)} years</b>: tens of thousands of years after the start.`),
        Om, H0, Or,
      };
    },
    // integrate the age numerically with phys.js (flat, with Λ, which hardly matters then)
    verify: (p) => P.ageGyr(p.Om / p.Or - 1, { H0: p.H0, Om: p.Om, Or: p.Or, OL: 1 - p.Om - p.Or }) * 1e9,
  },

  // ---------- 6.9 Recombination ----------
  'recombination-photons': {
    title: 'how many atom-breaking photons per atom?',
    make(r) {
      const T = pick(r, 4000, 12000, 500);
      const x = 13.6 / (KEV * T), frac = Math.exp(-x) * (x * x + 2 * x + 2) / (2 * ZETA3);
      const answer = frac / 6.1e-10;
      return {
        q: `<p>The universe is at ${n(T)} K and holds 1.6 billion photons for every atom (η = 6.1 × 10<sup>−10</sup> atoms per photon). The fraction of blackbody photons with energy above 13.6 eV, enough to split a hydrogen atom, is about e<sup>−x</sup>(x² + 2x + 2) ÷ 2.404, with x = 13.6 eV ÷ kT. How many such photons are there for each atom? (k = 8.617 × 10<sup>−5</sup> eV per K.)</p>`,
        answer, unit: 'photons per atom', tol: 0.02,
        hint: 'kT = 8.617 × 10⁻⁵ × T in eV; x = 13.6 ÷ kT. Work out the fraction, then divide by η (or multiply by 1.64 billion).',
        solution: steps(
          `kT = ${n(KEV * T, 4)} eV, so x = 13.6 ÷ ${n(KEV * T, 4)} = ${n(x, 4)}.`,
          `Fraction above 13.6 eV = e<sup>−${n(x, 4)}</sup> × ${n(x * x + 2 * x + 2, 4)} ÷ 2.404 = ${n(frac)}.`,
          `Per atom: ${n(frac)} ÷ 6.1 × 10<sup>−10</sup> = <b>${n(answer)}</b>. ${answer > 1 ? 'More than one per atom, so atoms that form are quickly split again.' : 'Fewer than one per atom from direct hits, yet atoms still struggle: photons of only 3.4 eV can split atoms sitting in their first excited state, and those are far more common.'}`),
        T,
      };
    },
    // count the photons above 13.6 eV by integrating Planck's photon-number curve, u²/(eᵘ − 1)
    verify: (p) => {
      const x = 13.6 / (KEV * p.T), top = x + 60;
      return P.simpson((u) => (u * u) / Math.expm1(u), x, top, 4000) / (2 * ZETA3) / 6.1e-10;
    },
  },
  'recombination-mfp': {
    title: 'how far can light get through the fog?',
    make(r) {
      const z = pick(r, 1300, 1800, 50), xe = pick(r, 0.6, 1, 0.05);
      const nH = 0.19 * (1 + z) ** 3, ne = xe * nH, lam = 1 / (ne * SIGMA_T), answer = lam / P.LY;
      return {
        q: `<p>Today space holds 0.19 hydrogen nuclei per cubic metre, and that number grows as (1 + z)³ in the past. At z = ${z}, a fraction ${xe} of them still have their electron loose. A photon travels on average 1 ÷ (n<sub>e</sub> σ<sub>T</sub>) between bounces off free electrons, with σ<sub>T</sub> = 6.65 × 10<sup>−29</sup> m². How far is that, in light-years? (1 ly = 9.46 × 10<sup>15</sup> m.)</p>`,
        answer, unit: 'light-years', tol: 0.01,
        hint: 'Free electrons per m³: n_e = fraction × 0.19 × (1 + z)³. Then the mean free path = 1 ÷ (n_e × 6.65 × 10⁻²⁹ m²).',
        solution: steps(
          `Hydrogen then: 0.19 × ${1 + z}³ = ${n(nH)} per m³; free electrons: × ${xe} = ${n(ne)} per m³.`,
          `Mean free path = 1 ÷ (${n(ne)} × 6.65 × 10<sup>−29</sup>) = ${n(lam)} m.`,
          `÷ 9.46 × 10<sup>15</sup> = <b>${n(answer)} light-years</b>. Tiny next to the distance light could have crossed by then (hundreds of thousands of light-years), so light zig-zags: the universe is opaque, like fog.`),
        z, xe,
      };
    },
    // the same in centimetres: n in cm⁻³ and σ_T in cm²
    verify: (p) => (1 / (p.xe * 0.19e-6 * (1 + p.z) ** 3 * SIGMA_T * 1e4)) / (P.LY * 100),
  },
};
