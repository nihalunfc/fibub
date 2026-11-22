// Live problems for Module 11 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const HBAR = 1.054571817e-34;                 // reduced Planck constant, J s
const HBARC = HBAR * P.C;                     // ħc, J m
const GEV = 1e9 * P.EV;                       // one GeV in joules
const MPL_RED_GEV = 2.435e18;                 // reduced Planck mass √(ħc/8πG) c², GeV
const T_PLANCK = 1.416784e32;                 // Planck temperature, K
const ZETA3 = 1.2020569;                      // Riemann zeta(3)
const RHO_CRIT_H2 = 1.87834e-26;              // critical density / h², kg/m³

export default {
  // ---------- 11.1 The horizon and flatness problems ----------
  'horizon-flatness-problems-angle': {
    title: 'how big is a causally connected patch of the CMB?',
    make(r) {
      const z = pick(r, 900, 1300, 50);
      const s = Math.sqrt(1 + z), answer = 1 / (s - 1) / P.DEG;
      return {
        q: `<p>Take a simple universe of matter only (Einstein-de Sitter). On a map that stretches with the universe, the distance light can have travelled since the start grows as √a. The light of the CMB left at redshift z = ${z}. Seen from Earth today, what <b>angle</b> on the sky (in degrees) does the horizon distance at that moment span?</p>`,
        answer, unit: '°', tol: 0.01,
        hint: 'On the stretching map the horizon is proportional to √a: today a = 1, back then a = 1/(1 + z). The distance to the CMB is the horizon today minus the horizon then. Angle = (horizon then) ÷ (distance to the CMB), in radians.',
        solution: steps(
          `Horizon then ∝ √(1/(1 + z)) = 1/√${1 + z} = ${n(1 / s, 4)}; horizon today ∝ 1.`,
          `Distance to the CMB ∝ 1 − ${n(1 / s, 4)} = ${n(1 - 1 / s, 4)}.`,
          `Angle = ${n(1 / s, 4)} ÷ ${n(1 - 1 / s, 4)} = 1/(√${1 + z} − 1) = ${n(answer * P.DEG, 4)} radians = <b>${n(answer)}°</b>. With radiation and dark energy included the answer is about 1.2°, so the sky holds roughly 10<sup>4</sup> patches that could never have exchanged a signal.`),
        z,
      };
    },
    // independent: integrate the conformal time ∫ da / (a² H) with H ∝ a^(-3/2) numerically
    verify: (p) => {
      const f = (a) => 1 / Math.sqrt(a); // 1/(a²H) ∝ a^(-1/2); the u = √a substitution makes 2u f(u²) finite at u = 0
      const ar = 1 / (1 + p.z);
      const etaR = P.simpson((u) => (u ? 2 * u * f(u * u) : 2), 0, Math.sqrt(ar), 4000);
      const eta0 = P.simpson((u) => (u ? 2 * u * f(u * u) : 2), 0, 1, 4000);
      return etaR / (eta0 - etaR) / (Math.PI / 180);
    },
  },
  'horizon-flatness-problems-tuning': {
    title: 'how flat was the universe at the start?',
    make(r) {
      const ok = pick(r, 1, 5, 1) * 1e-3;
      const which = pick(r, 0, 2, 1);
      const [label, T] = [['about one second after the start (temperature about 10¹⁰ K)', 1e10], ['the time protons formed (temperature about 10¹² K)', 1e12], ['the Planck time, about 10⁻⁴³ s (temperature 1.4 × 10³² K)', T_PLANCK]][which];
      const Or = 9.1e-5, a = P.T_CMB / T;
      const answer = (ok * a * a) / Or;
      return {
        q: `<p>Today the universe is flat to within |Ω − 1| &lt; ${n(ok)}. Early on, when radiation ruled, |Ω − 1| = |Ω<sub>k,0</sub>| a²/Ω<sub>r</sub>, where |Ω<sub>k,0</sub>| is today's |Ω − 1|, Ω<sub>r</sub> = 9.1 × 10<sup>−5</sup> is today's radiation share and a = T<sub>0</sub>/T (T<sub>0</sub> = 2.7255 K). How small must |Ω − 1| have been at ${label}? (Ignore changes in the number of particle types.)</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Find a from the temperature ratio, square it, multiply by today\'s |Ω − 1| and divide by 9.1 × 10⁻⁵.',
        solution: steps(
          `a = 2.7255 ÷ ${n(T)} = ${n(a)}.`,
          `a² = ${n(a * a)}.`,
          `|Ω − 1| &lt; ${n(ok)} × ${n(a * a)} ÷ (9.1 × 10<sup>−5</sup>) = <b>${n(answer)}</b>. Any bigger and the universe would have collapsed or emptied out long before today. Nothing in the plain Big Bang explains such fine tuning.`),
        ok, T, Or,
      };
    },
    // independent: matter-era growth (∝ a/Ωm, back to equality a_eq = Ωr/Ωm), then radiation-era growth (∝ a²), in logs
    verify: (p) => {
      const Om = 0.31, aeq = p.Or / Om, a = P.T_CMB / p.T;
      const L = Math.log10(p.ok / Om) + Math.log10(aeq) + 2 * Math.log10(a / aeq);
      return 10 ** L;
    },
  },

  // ---------- 11.2 Cosmic inflation ----------
  'cosmic-inflation-efolds': {
    title: 'how much does inflation stretch space?',
    make(r) {
      const N = pick(r, 50, 70, 1), size = pick(r, 1, 9, 1);
      const g = Math.exp(N), answer = size * 1e-30 * g;
      return {
        q: `<p>During inflation a region grows by a factor e (2.718...) in each "e-fold". A region ${size} × 10<sup>−30</sup> m across, far smaller than a proton, inflates by ${N} e-folds. How big is it at the end, in <b>metres</b>?</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: `The growth factor after N e-folds is e<sup>N</sup>. If your calculator has no e<sup>x</sup> key, use e<sup>N</sup> = 10<sup>0.4343 N</sup>.`,
        solution: steps(
          `Growth factor e<sup>${N}</sup> = ${n(g)} (that is ${n(N / Math.LN2, 3)} doublings).`,
          `Size at the end: ${size} × 10<sup>−30</sup> m × ${n(g)} = <b>${n(answer)} m</b>.`,
          'All of this takes a tiny fraction of a second. It is space itself that grows, so nothing moves through space faster than light.'),
        N, size,
      };
    },
    verify: (p) => { let s = p.size * 1e-30; for (let i = 0; i < p.N * 100; i++) s *= Math.exp(0.01); return s; },
  },
  'cosmic-inflation-duration': {
    title: 'how long did inflation last?',
    make(r) {
      const e = pick(r, 2, 15, 1) * 1e15, N = pick(r, 50, 65, 1);
      const rho = (e * GEV) ** 4 / HBARC ** 3; // J/m³
      const H = Math.sqrt((8 * Math.PI * P.G * rho) / (3 * P.C * P.C));
      const answer = N / H;
      return {
        q: `<p>Inflation at an energy scale E = ${n(e)} GeV has an energy density ρc² = E⁴/(ħc)³. While the inflaton rolls slowly, the expansion rate H = √(8πGρ/3) stays nearly constant, and each e-fold takes a time 1/H. How long, in <b>seconds</b>, do ${N} e-folds take? (1 GeV = 1.602 × 10<sup>−10</sup> J, ħc = 3.162 × 10<sup>−26</sup> J m, G = 6.674 × 10<sup>−11</sup> m³ kg⁻¹ s⁻², c = 3.00 × 10<sup>8</sup> m/s.)</p>`,
        answer, unit: 's', tol: 0.02,
        hint: 'Turn E into joules, raise it to the 4th power and divide by (ħc)³ to get an energy density in J/m³. Divide by c² to get ρ in kg/m³, then find H and multiply 1/H by the number of e-folds.',
        solution: steps(
          `E = ${n(e)} × 1.602 × 10<sup>−10</sup> J = ${n(e * GEV)} J, so ρc² = E⁴/(ħc)³ = ${n(rho)} J/m³.`,
          `ρ = ${n(rho / (P.C * P.C))} kg/m³ and H = √(8πGρ/3) = ${n(H)} per second.`,
          `Time = ${N} ÷ ${n(H)} = <b>${n(answer)} s</b>. Inflation did all its work in far less than a trillionth of a trillionth of a trillionth of a second.`),
        e, N,
      };
    },
    // independent: natural units, H = E²/(√3 M̄_Pl) in GeV, then divide by ħ in GeV s
    verify: (p) => { const Hgev = (p.e * p.e) / (Math.sqrt(3) * MPL_RED_GEV); return p.N / (Hgev / 6.582119569e-25); },
  },

  // ---------- 11.3 Quantum seeds ----------
  'quantum-seeds-tilt': {
    title: 'are big ripples stronger than small ones?',
    make(r) {
      const ns = pick(r, 0.955, 0.975, 0.001), ratio = pick(r, 2, 4, 1);
      const k = 10 ** ratio, answer = Math.pow(k, ns - 1);
      return {
        q: `<p>The strength of the primordial ripples depends on their size as P(k) = A<sub>s</sub>(k/k<sub>*</sub>)<sup>n<sub>s</sub> − 1</sup>, where k counts waves per unit length (small k = big ripples). With n<sub>s</sub> = ${ns}, what is the ratio P(k<sub>small</sub>)/P(k<sub>big</sub>) for ripples ${n(k)} times smaller (k ${n(k)} times bigger)?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'A<sub>s</sub> and k<sub>*</sub> cancel in the ratio: you need only (k ratio)<sup>n<sub>s</sub> − 1</sup>.',
        solution: steps(
          `n<sub>s</sub> − 1 = ${n(ns - 1, 3)}.`,
          `Ratio = ${n(k)}<sup>${n(ns - 1, 3)}</sup> = 10<sup>${ratio} × (${n(ns - 1, 3)})</sup> = <b>${n(answer, 4)}</b>.`,
          'Smaller ripples are slightly weaker: the spectrum is "red-tilted". With n<sub>s</sub> exactly 1, every size would be equally strong. Planck measured 0.965 ± 0.004, which rules out exactly 1 by about 8 standard deviations, as slow-roll inflation expects.'),
        ns, k,
      };
    },
    verify: (p) => Math.exp((p.ns - 1) * Math.log(p.k)),
  },
  'quantum-seeds-efolds': {
    title: 'read the number of e-folds from the tilt',
    make(r) {
      const ns = pick(r, 0.958, 0.972, 0.001);
      const answer = 2 / (1 - ns);
      return {
        q: `<p>In Starobinsky's model of inflation, and in many others, the tilt of the ripples is n<sub>s</sub> ≈ 1 − 2/N, where N is the number of e-folds between the moment the ripples we see froze and the end of inflation. If n<sub>s</sub> = ${ns}, what is N?</p>`,
        answer, unit: 'e-folds', tol: 0.005,
        hint: 'Rearrange: N = 2/(1 − n<sub>s</sub>).',
        solution: steps(
          `1 − n<sub>s</sub> = ${n(1 - ns, 3)}.`,
          `N = 2 ÷ ${n(1 - ns, 3)} = <b>${n(answer, 3)}</b>.`,
          'The measured tilt, 0.965, gives N ≈ 57: right in the range of 50 to 60 e-folds that inflation needs to explain the horizon and flatness problems. Two separate numbers agree.'),
        ns,
      };
    },
    // independent: solve 1 − 2/N = ns by Newton's method
    verify: (p) => { let N = 30; for (let i = 0; i < 60; i++) N -= (1 - 2 / N - p.ns) / (2 / (N * N)); return N; },
  },

  // ---------- 11.4 Primordial gravitational waves ----------
  'primordial-gravitational-waves-scale': {
    title: 'the energy of inflation from r',
    make(r) {
      const rr = pick(r, 1, 30, 1) / 1000;
      const As = 2.1e-9;
      const answer = Math.pow(1.5 * Math.PI * Math.PI * As * rr, 0.25) * MPL_RED_GEV;
      return {
        q: `<p>If gravitational waves from inflation are found with tensor-to-scalar ratio r = ${rr}, the energy scale of inflation follows from V = (3π²/2) A<sub>s</sub> r M̄<sup>4</sup>, with A<sub>s</sub> = 2.1 × 10<sup>−9</sup> (the measured strength of the density ripples) and M̄ = 2.435 × 10<sup>18</sup> GeV (the reduced Planck mass). What is V<sup>1/4</sup>, in <b>GeV</b>?</p>`,
        answer, unit: 'GeV', tol: 0.01,
        hint: 'Multiply out (3π²/2) × A<sub>s</sub> × r, take the fourth root, then multiply by M̄.',
        solution: steps(
          `(3π²/2) × 2.1 × 10<sup>−9</sup> × ${rr} = ${n(1.5 * Math.PI * Math.PI * As * rr)}.`,
          `Fourth root: ${n(Math.pow(1.5 * Math.PI * Math.PI * As * rr, 0.25))}.`,
          `V<sup>1/4</sup> = that × 2.435 × 10<sup>18</sup> GeV = <b>${n(answer)} GeV</b>, near the energy where the strong, weak and electromagnetic forces may unite, and a trillion times beyond the LHC. Because of the fourth root, even r = 0.001 would still mean about 6 × 10<sup>15</sup> GeV.`),
        rr, As,
      };
    },
    // independent: through the expansion rate. Tensor power 2H²/(π²M̄²) = r A_s gives H; then V = 3 H² M̄².
    verify: (p) => { const H = Math.PI * MPL_RED_GEV * Math.sqrt((p.rr * p.As) / 2); return Math.pow(3 * H * H * MPL_RED_GEV ** 2, 0.25); },
  },
  'primordial-gravitational-waves-models': {
    title: 'is the simplest inflation model ruled out?',
    make(r) {
      const N = pick(r, 50, 62, 1);
      const answer = 8 / N;
      return {
        q: `<p>The simplest inflaton potential, V = ½m²φ² (a ball in a bowl), predicts n<sub>s</sub> = 1 − 2/N and a tensor-to-scalar ratio r = 8/N. With N = ${N} e-folds, what r does it predict? (BICEP/Keck and Planck together find r &lt; 0.036.)</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Divide 8 by N, then compare with the limit.',
        solution: steps(
          `r = 8 ÷ ${N} = <b>${n(answer, 3)}</b>.`,
          `That is ${n(answer / 0.036, 2)} times the upper limit r &lt; 0.036, so this model is ruled out, although its n<sub>s</sub> = ${n(1 - 2 / N, 3)} looks fine.`,
          `Starobinsky's model gives the same n<sub>s</sub> but r ≈ 12/N² = ${n(12 / (N * N), 2)}, well inside the limit. That is why it is now the favourite benchmark.`),
        N,
      };
    },
    // independent: slow-roll parameters for m²φ² (M̄ = 1): φ² ≈ 4N, ε = 2/φ², r = 16ε
    verify: (p) => 16 * (2 / (4 * p.N)),
  },

  // ---------- 11.5 Matter and antimatter ----------
  'matter-antimatter-eta': {
    title: 'how many photons for each atom?',
    make(r) {
      const ob = pick(r, 0.0215, 0.0235, 0.0005);
      const nb = (ob * RHO_CRIT_H2) / P.M_P;
      const ng = (2 * ZETA3 / (Math.PI ** 2)) * ((P.K_B * P.T_CMB) / HBARC) ** 3;
      const answer = nb / ng;
      return {
        q: `<p>The CMB and the amounts of light elements give a baryon density Ω<sub>b</sub>h² = ${ob}, so ρ<sub>b</sub> = ${ob} × 1.878 × 10<sup>−26</sup> kg/m³. The CMB at 2.7255 K holds n<sub>γ</sub> = 4.11 × 10<sup>8</sup> photons per cubic metre. Taking each baryon to weigh one proton mass (1.673 × 10<sup>−27</sup> kg), what is the baryon-to-photon ratio η = n<sub>b</sub>/n<sub>γ</sub>?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Number of baryons per cubic metre = density ÷ proton mass. Then divide by the number of photons per cubic metre.',
        solution: steps(
          `ρ<sub>b</sub> = ${ob} × 1.878 × 10<sup>−26</sup> = ${n(ob * RHO_CRIT_H2)} kg/m³.`,
          `n<sub>b</sub> = ${n(ob * RHO_CRIT_H2)} ÷ (1.673 × 10<sup>−27</sup>) = ${n(nb)} baryons per m³ (about one in every four cubic metres).`,
          `η = ${n(nb)} ÷ (4.11 × 10<sup>8</sup>) = <b>${n(answer)}</b>: about one baryon for every ${n(1 / answer, 2)} photons. That tiny number is the leftover of the matter-antimatter battle.`),
        ob,
      };
    },
    // independent: the standard fitting formula η = 273.9 × 10⁻¹⁰ Ω_b h² (for T0 = 2.7255 K)
    verify: (p) => 273.9e-10 * p.ob,
  },
  'matter-antimatter-leftover': {
    title: 'the light that belongs to you',
    make(r) {
      const eta = pick(r, 5.8, 6.4, 0.1) * 1e-10, mass = pick(r, 40, 100, 5);
      const nb = mass / P.M_P, answer = nb / eta;
      return {
        q: `<p>For every baryon (proton or neutron) in the universe there are about 1/η photons in the CMB, with η = ${n(eta)}. A person has a mass of ${mass} kg, almost all in baryons of about 1.673 × 10<sup>−27</sup> kg each. About how many CMB photons "go with" the baryons in that person?</p>`,
        answer, unit: 'photons', tol: 0.01,
        hint: 'Count the baryons (mass ÷ proton mass), then divide by η.',
        solution: steps(
          `Baryons: ${mass} ÷ (1.673 × 10<sup>−27</sup>) = ${n(nb)}.`,
          `Photons per baryon: 1/η = ${n(1 / eta)}.`,
          `${n(nb)} × ${n(1 / eta)} = <b>${n(answer)} photons</b>. Each of your atoms is roughly a one-in-a-billion survivor, and the light from the annihilation of the rest still fills the sky as the CMB.`),
        eta, mass,
      };
    },
    verify: (p) => Math.exp(Math.log(p.mass) - Math.log(P.M_P) - Math.log(p.eta)),
  },

  // ---------- 11.6 The Planck era ----------
  'planck-era-units': {
    title: 'build the Planck units from three constants',
    make(r) {
      const which = pick(r, 0, 2, 1);
      const lp = Math.sqrt((HBAR * P.G) / P.C ** 3), tp = Math.sqrt((HBAR * P.G) / P.C ** 5), mp = Math.sqrt((HBAR * P.C) / P.G);
      const rows = [
        ['Planck length', '√(ħG/c³)', 'm', lp],
        ['Planck time', '√(ħG/c⁵)', 's', tp],
        ['Planck mass', '√(ħc/G)', 'kg', mp],
      ];
      const [name, f, unit, answer] = rows[which];
      return {
        q: `<p>Using ħ = 1.0546 × 10<sup>−34</sup> J s, G = 6.674 × 10<sup>−11</sup> m³ kg⁻¹ s⁻² and c = 2.998 × 10<sup>8</sup> m/s, work out the <b>${name}</b>, ${f}, in ${unit}.</p>`,
        answer, unit, tol: 0.005,
        hint: 'Multiply and divide the constants as the formula says, then take the square root. Keep the powers of ten separate to avoid slips.',
        solution: steps(
          `Inside the root: ${n(answer * answer)}.`,
          `Square root: <b>${n(answer, 4)} ${unit}</b>.`,
          which === 0 ? 'About 10<sup>20</sup> times smaller than a proton. Below it, our picture of smooth space is expected to fail.'
            : which === 1 ? 'The time light takes to cross one Planck length. Describing the universe before this age needs a theory of quantum gravity.'
            : 'About 22 micrograms, the mass of a speck of dust. Squeezed into a Planck length, though, it would be a black hole about as small as its own quantum wavelength.'),
        which,
      };
    },
    // independent: length from time × c, time from length ÷ c, mass from the Planck energy √(ħc⁵/G) ÷ c²
    verify: (p) => {
      if (p.which === 0) return P.C * Math.sqrt((HBAR * P.G) / P.C ** 5);
      if (p.which === 1) return Math.sqrt((HBAR * P.G) / P.C ** 3) / P.C;
      return Math.sqrt((HBAR * P.C ** 5) / P.G) / P.C ** 2;
    },
  },
  'planck-era-energy-gap': {
    title: 'how far are we from the Planck energy?',
    make(r) {
      const list = [['a proton-proton collision at the LHC', 13.6e12], ['the highest-energy cosmic ray ever seen (the "Oh-My-God" particle of 1991)', 3.2e20], ['the energy where the forces may unite (grand unification)', 1e25], ['a collision in a proposed 100 TeV successor to the LHC', 1e14]];
      const [label, eV] = list[pick(r, 0, 3, 1)];
      const EP = Math.sqrt((HBAR * P.C ** 5) / P.G) / P.EV;
      const answer = EP / eV;
      return {
        q: `<p>The Planck energy is E<sub>P</sub> = √(ħc⁵/G) ≈ 1.22 × 10<sup>19</sup> GeV = 1.22 × 10<sup>28</sup> eV. How many times bigger is it than the energy of ${label}, about ${n(eV)} eV?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Divide the Planck energy by the given energy, keeping both in eV.',
        solution: steps(
          `E<sub>P</sub> = 1.22 × 10<sup>28</sup> eV.`,
          `${n(EP)} ÷ ${n(eV)} = <b>${n(answer)}</b>.`,
          'A ring collider built like the LHC would have to be light-years around to reach it. The very early universe is the only place it was ever reached.'),
        eV,
      };
    },
    // independent: through the Planck temperature, E_P = k_B T_P
    verify: (p) => (P.K_B * T_PLANCK / P.EV) / p.eV,
  },

  // ---------- 11.7 The multiverse ----------
  'multiverse-eternal': {
    title: 'why eternal inflation never stops',
    make(r) {
      const pDecay = pick(r, 0.5, 0.9, 0.05), k = pick(r, 10, 60, 10);
      const g = Math.exp(3) * (1 - pDecay); // growth of the inflating volume per Hubble time
      const answer = (k * Math.LN10) / Math.log(g);
      return {
        q: `<p>In each Hubble time (1/H), an inflating region grows e times in every direction, so its volume grows e³ ≈ 20.1 times. Suppose that in each Hubble time a fraction ${pDecay} of the inflating volume stops inflating and becomes a "bubble universe". How many Hubble times until the still-inflating volume has grown 10<sup>${k}</sup> times?</p>`,
        answer, unit: 'Hubble times', tol: 0.01,
        hint: 'Growth per Hubble time g = e³ × (1 − fraction that stops). After n Hubble times the volume is gⁿ times bigger, so n = log(10<sup>k</sup>) ÷ log(g).',
        solution: steps(
          `g = 20.09 × (1 − ${pDecay}) = ${n(g, 4)} per Hubble time: more than 1, so the inflating volume keeps growing.`,
          `n = ${k} × ln 10 ÷ ln ${n(g, 4)} = ${n(k * Math.LN10, 4)} ÷ ${n(Math.log(g), 4)} = <b>${n(answer)}</b>.`,
          'However many bubbles form, the inflating space between them grows faster, as long as less than about 95% of it stops per Hubble time. That is eternal inflation. Whether the bubbles count as real "other universes" is the hard part.'),
        pDecay, k,
      };
    },
    verify: (p) => p.k / Math.log10(20.0855369 * (1 - p.pDecay)),
  },
  'multiverse-landscape': {
    title: 'counting habitable vacua in the landscape',
    make(r) {
      const N = pick(r, 300, 600, 50), k = pick(r, 118, 124, 1);
      const answer = N - k;
      return {
        q: `<p>Suppose string theory allows 10<sup>${N}</sup> different vacua (kinds of empty space), with vacuum energies spread evenly between −1 and +1 in Planck units. Galaxies, and so observers, seem to need |vacuum energy| below about 10<sup>−${k}</sup> in those units. About how many vacua qualify? Give the <b>power of ten</b> (for 10<sup>50</sup>, answer 50).</p>`,
        answer, unit: '(power of ten)', tol: 0, abs: 0.5,
        hint: 'The window from −10<sup>−k</sup> to +10<sup>−k</sup> is a fraction (2 × 10<sup>−k</sup>) ÷ 2 = 10<sup>−k</sup> of the whole range from −1 to +1. Multiply the number of vacua by that fraction: the powers of ten subtract.',
        solution: steps(
          `Fraction of vacua in the window: (2 × 10<sup>−${k}</sup>) ÷ 2 = 10<sup>−${k}</sup>.`,
          `Number: 10<sup>${N}</sup> × 10<sup>−${k}</sup> = 10<sup>${N - k}</sup>, so the answer is <b>${answer}</b>.`,
          'If the landscape is real and eternal inflation makes every vacuum somewhere, plenty of regions have a tiny dark energy, and observers can only live in those. That is the anthropic argument. Every assumption in this sum is unproven, which is why it is controversial.'),
        N, k,
      };
    },
    verify: (p) => p.N + Math.log10((2 * 10 ** -p.k) / 2),
  },
};
