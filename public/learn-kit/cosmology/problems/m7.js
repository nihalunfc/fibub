// Live problems for Module 7 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const HBAR = P.H_PLANCK / (2 * Math.PI);
const ZETA3 = 1.2020569;
/** Blackbody photons per cm³ at temperature T: (2ζ(3)/π²) (kT/ħc)³. */
const photonsPerCm3 = (T) => (2 * ZETA3 / Math.PI ** 2) * ((P.K_B * T) / (HBAR * P.C)) ** 3 / 1e6;
const SKY_DEG2 = (4 * Math.PI) / (P.DEG * P.DEG); // 41,253 square degrees

export default {
  // ---------- 7.1 ----------
  'cmb-discovery-excess': {
    title: 'find the leftover noise, like Penzias and Wilson',
    make(r) {
      const tot = pick(r, 6.2, 7.4, 0.1), air = pick(r, 2.0, 2.6, 0.1), ant = pick(r, 0.6, 1.0, 0.1), gnd = 0.1;
      const answer = +(tot - air - ant - gnd).toFixed(6);
      return {
        q: `<p>A radio horn pointed straight up measures a total noise temperature of ${tot} K. You know the air adds ${air} K, the antenna and its wiring ${ant} K, and the ground leaking in at the back ${gnd} K. How many kelvin are left over, unexplained?</p>`,
        answer, unit: 'K', tol: 0.01, abs: 0.02,
        hint: 'Noise temperatures from separate sources simply add. Take every known part away from the total.',
        solution: steps(
          `Known parts: ${air} + ${ant} + ${gnd} = ${n(air + ant + gnd)} K.`,
          `Left over: ${tot} − ${n(air + ant + gnd)} = <b>${n(answer)} K</b>.`,
          'Penzias and Wilson found 3.5 ± 1.0 K left over, the same in every direction and every season: the cosmic microwave background.'),
        tot, air, ant, gnd,
      };
    },
    verify: (p) => p.tot - (p.air + p.ant + p.gnd),
  },
  'cmb-discovery-stretch': {
    title: 'how much has the universe grown since the CMB was released?',
    make(r) {
      const Te = pick(r, 2900, 3100, 20);
      const answer = Te / P.T_CMB - 1;
      return {
        q: `<p>The CMB light set off when the universe had cooled to ${Te.toLocaleString('en-CA')} K. Today it measures 2.7255 K. Its temperature falls in step with the stretching of space, T ∝ 1/a. At what redshift z did it set off?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'T falls as 1/a, and 1 + z = a(today) / a(then), so 1 + z = T(then) / T(today).',
        solution: steps(
          `1 + z = ${Te.toLocaleString('en-CA')} ÷ 2.7255 = ${n(Te / P.T_CMB, 5)}.`,
          `z = <b>${n(answer, 4)}</b>.`,
          'Space has stretched about 1,100 times since then, so every wavelength has too: near-infrared and red light has become microwaves.'),
        Te,
      };
    },
    verify: (p) => Math.exp(Math.log(p.Te) - Math.log(2.7255)) - 1,
  },
  // ---------- 7.2 ----------
  'cmb-blackbody-peak': {
    title: 'where did the CMB shine brightest in the past?',
    make(r) {
      const z = pick(r, 2, 1000, 1);
      const T = P.cmbTemp(z), answer = 160.23 * (1 + z);
      return {
        q: `<p>Today the CMB's brightness per unit frequency peaks at 160.2 GHz. At redshift z = ${z}, at what frequency did it peak, in GHz?</p>`,
        answer, unit: 'GHz', tol: 0.005,
        hint: 'The peak frequency is proportional to the temperature (ν_peak = 58.79 GHz per kelvin × T), and T = 2.7255 (1 + z).',
        solution: steps(
          `T = 2.7255 × (1 + ${z}) = ${n(T, 4)} K.`,
          `ν<sub>peak</sub> = 58.79 GHz/K × ${n(T, 4)} K = <b>${n(answer, 4)} GHz</b>.`,
          `Or, quicker: every photon had ${1 + z} times its present frequency, so the peak did too: 160.2 × ${1 + z}.`),
        z,
      };
    },
    verify: (p) => (2.8214 * P.K_B * P.cmbTemp(p.z)) / P.H_PLANCK / 1e9,
  },
  'cmb-blackbody-photons': {
    title: 'how crowded was the light?',
    make(r) {
      const z = pick(r, 9, 1099, 10);
      const answer = 411 * (1 + z) ** 3;
      return {
        q: `<p>Today there are about 411 CMB photons in every cubic centimetre. At redshift z = ${z}, how many were there per cm³?</p>`,
        answer, unit: 'photons per cm³', tol: 0.01,
        hint: 'No photons are made or destroyed; they are just spread over more volume. A length grows by (1 + z), so a volume grows by (1 + z)³.',
        solution: steps(
          `Volume factor: (1 + ${z})³ = ${n((1 + z) ** 3)}.`,
          `411 × ${n((1 + z) ** 3)} = <b>${n(answer)} photons per cm³</b>.`,
          'Check with temperature: the number of blackbody photons goes as T³, and T was (1 + z) times higher. Same answer, as it must be for a blackbody.'),
        z,
      };
    },
    verify: (p) => photonsPerCm3(P.cmbTemp(p.z)),
  },
  // ---------- 7.3 ----------
  'cmb-dipole-speed': {
    title: 'how fast are we moving?',
    make(r) {
      const dT = pick(r, 1.5, 6, 0.01);
      const answer = (dT / 1000 / P.T_CMB) * P.C / 1000;
      return {
        q: `<p>An observer finds the CMB ${dT} mK hotter than average straight ahead and ${dT} mK colder straight behind. The average is 2.7255 K. How fast is the observer moving through the CMB, in km/s?</p>`,
        answer, unit: 'km/s', tol: 0.005,
        hint: 'For speeds much less than light, ΔT / T = v / c. Turn mK into K first.',
        solution: steps(
          `ΔT / T = ${dT} × 10<sup>−3</sup> ÷ 2.7255 = ${n(dT / 1000 / P.T_CMB)}.`,
          `v = c × ΔT / T = 299,792 km/s × ${n(dT / 1000 / P.T_CMB)} = <b>${n(answer, 4)} km/s</b>.`,
          'The real dipole is 3.36 mK, which gives the Sun\'s 370 km/s.'),
        dT,
      };
    },
    verify: (p) => 299792.458 * (p.dT * 1e-3) / 2.7255,
  },
  'cmb-dipole-earth': {
    title: 'the yearly wobble from Earth\'s orbit',
    make(r) {
      const v = pick(r, 20, 40, 0.5);
      const answer = P.T_CMB * (v * 1000 / P.C) * 1e6;
      return {
        q: `<p>On top of the Sun's motion, a satellite going round the Sun with the Earth moves at ${v} km/s, in a direction that turns through the year. How big (in µK, millionths of a kelvin) is the extra temperature difference this adds straight ahead of it?</p>`,
        answer, unit: 'µK', tol: 0.005,
        hint: 'ΔT = T × v / c, with T = 2.7255 K. One kelvin is 1,000,000 µK.',
        solution: steps(
          `v / c = ${v} ÷ 299,792 = ${n(v / 299792.458)}.`,
          `ΔT = 2.7255 K × ${n(v / 299792.458)} = ${n(answer / 1e6)} K = <b>${n(answer)} µK</b>.`,
          'Earth\'s real orbital speed, about 30 km/s, gives about 270 µK. Because that speed is known so precisely, WMAP and Planck used this yearly wobble to calibrate their detectors.'),
        v,
      };
    },
    verify: (p) => (p.v / 299792.458) * 2.7255e6,
  },
  // ---------- 7.4 ----------
  'cmb-anisotropies-ripple': {
    title: 'one part in a hundred thousand',
    make(r) {
      const N = pick(r, 60000, 150000, 5000);
      const answer = (P.T_CMB / N) * 1e6;
      return {
        q: `<p>A ripple in the CMB is 1 part in ${N.toLocaleString('en-CA')} of its temperature, 2.7255 K. How big is it in microkelvin (µK)?</p>`,
        answer, unit: 'µK', tol: 0.005,
        hint: 'Divide 2.7255 K by the number, then multiply by a million to turn K into µK.',
        solution: steps(
          `2.7255 K ÷ ${N.toLocaleString('en-CA')} = ${n(P.T_CMB / N)} K.`,
          `× 1,000,000 = <b>${n(answer)} µK</b>.`,
          'Tens of microkelvin: like waves 1 mm high on an ocean 100 m deep.'),
        N,
      };
    },
    verify: (p) => 2725500 / p.N,
  },
  'cmb-anisotropies-angle': {
    title: 'how big does a region look on the CMB?',
    make(r) {
      const S = pick(r, 40, 400, 10), D = pick(r, 13700, 14100, 50);
      const answer = (S / D) / P.DEG;
      return {
        q: `<p>The last-scattering surface is now ${D.toLocaleString('en-CA')} Mpc away (a comoving distance, measured today). A region that is now ${S} Mpc across lies on it. In flat space, how big does it look on the sky, in degrees?</p>`,
        answer, unit: 'degrees', tol: 0.005,
        hint: 'Small-angle rule: angle in radians = size ÷ distance, with both measured today. 1 radian = 57.3°.',
        solution: steps(
          `Angle = ${S} ÷ ${D.toLocaleString('en-CA')} = ${n(S / D)} radians.`,
          `× 57.30 = <b>${n(answer)}°</b>.`,
          'A region about 250 Mpc across today looks about 1° across on the CMB.'),
        S, D,
      };
    },
    verify: (p) => Math.atan(p.S / p.D) * 180 / Math.PI,
  },
  // ---------- 7.5 ----------
  'acoustic-peaks-spacing': {
    title: 'the spacing of the peaks',
    make(r) {
      const rs = pick(r, 135, 155, 0.5), D = pick(r, 13000, 15000, 100);
      const answer = (Math.PI * D) / rs;
      return {
        q: `<p>The sound horizon at last scattering is ${rs} Mpc and the distance to last scattering is ${D.toLocaleString('en-CA')} Mpc (both comoving). The acoustic peaks are spaced by Δℓ = π ÷ θ, where θ is the angle the sound horizon covers, in radians. What is Δℓ?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'θ = r_s ÷ D (radians), then Δℓ = π ÷ θ = π D / r_s.',
        solution: steps(
          `θ = ${rs} ÷ ${D.toLocaleString('en-CA')} = ${n(rs / D)} rad = ${n((rs / D) / P.DEG)}°.`,
          `Δℓ = π ÷ ${n(rs / D)} = <b>${n(answer, 4)}</b>.`,
          'For Planck\'s numbers (144 Mpc, 13,870 Mpc) this is about 302. The first peak sits a little below it, at ℓ ≈ 220, and the next ones follow roughly 300 apart: about 540 and 810.'),
        rs, D,
      };
    },
    verify: (p) => 180 / ((p.rs / p.D) * 180 / Math.PI),
  },
  'acoustic-peaks-sound': {
    title: 'the speed of sound before recombination',
    make(r) {
      const R = pick(r, 0, 1.2, 0.05);
      const answer = 1 / Math.sqrt(3 * (1 + R));
      return {
        q: `<p>In the photon-baryon fluid the speed of sound is c ÷ √(3(1 + R)), where R = 3ρ<sub>b</sub> / 4ρ<sub>γ</sub> measures how heavy the atoms are compared with the light. For R = ${R}, what is the speed of sound as a fraction of the speed of light?</p>`,
        answer, unit: '× c', tol: 0.005,
        hint: 'Work out 3 × (1 + R), take the square root, then divide 1 by it.',
        solution: steps(
          `3 × (1 + ${R}) = ${n(3 * (1 + R))}.`,
          `√${n(3 * (1 + R))} = ${n(Math.sqrt(3 * (1 + R)), 4)}.`,
          `Speed of sound = c ÷ ${n(Math.sqrt(3 * (1 + R)), 4)} = <b>${n(answer, 4)} c</b>. With no atoms (R = 0) it would be c/√3 = 0.577 c; at recombination R ≈ 0.6 and sound moved at about 0.45 c.`),
        R,
      };
    },
    verify: (p) => Math.sqrt(1 / (3 + 3 * p.R)),
  },
  // ---------- 7.6 ----------
  'wmap-planck-patches': {
    title: 'how many separate patches can a satellite see?',
    make(r) {
      const [name, th] = [['COBE', 420], ['WMAP', 13], ['Planck', 5], ['A ground-based telescope', 1.5]][Math.floor(r() * 3.999)];
      const answer = SKY_DEG2 * 3600 / (th * th);
      return {
        q: `<p>The whole sky covers 41,253 square degrees. ${name} sees details down to about ${th} arcminutes. Roughly how many separate patches of that size (each ${th}′ × ${th}′) fit on the sky? (60 arcminutes = 1°.)</p>`,
        answer, unit: 'patches', tol: 0.01,
        hint: 'One patch has an area of (θ in degrees)². Divide the sky by it.',
        solution: steps(
          `${th}′ = ${n(th / 60)}°, so one patch covers ${n((th / 60) ** 2)} square degrees.`,
          `41,253 ÷ ${n((th / 60) ** 2)} = <b>${n(answer)}</b> patches.`,
          'Each patch gives roughly one independent temperature reading. Going from COBE\'s 7° to Planck\'s 5′ multiplied the number of readings by about 7,000, which is why Planck could measure so many peaks.'),
        th,
      };
    },
    verify: (p) => (4 * Math.PI) / ((p.th / 60) * Math.PI / 180) ** 2,
  },
  // ---------- 7.7 ----------
  'cmb-polarisation-reion': {
    title: 'how many CMB photons scattered again?',
    make(r) {
      const tau = pick(r, 0.03, 0.12, 0.002);
      const answer = (1 - Math.exp(-tau)) * 100;
      return {
        q: `<p>After the first stars re-ionised the universe, free electrons scattered some CMB photons a second time. The optical depth is τ = ${tau}; the fraction of photons that get through untouched is e<sup>−τ</sup>. What percentage were scattered?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Scattered fraction = 1 − e^(−τ). For small τ this is close to τ itself.',
        solution: steps(
          `e<sup>−${tau}</sup> = ${n(Math.exp(-tau), 5)} got through untouched.`,
          `Scattered: 1 − ${n(Math.exp(-tau), 5)} = ${n(1 - Math.exp(-tau), 4)}, that is <b>${n(answer, 4)}%</b>.`,
          'Planck measured τ = 0.054, so about 5% of the CMB photons were scattered again. They carry a polarisation signal on the largest scales of the sky.'),
        tau,
      };
    },
    verify: (p) => -Math.expm1(-p.tau) * 100,
  },
  // ---------- 7.8 ----------
  'universe-recipe-omega': {
    title: 'from Ω h² to a percentage',
    make(r) {
      const [what, w] = [['ordinary atoms', pick(r, 0.0215, 0.0235, 0.0001)], ['dark matter', pick(r, 0.110, 0.130, 0.001)]][r() < 0.5 ? 0 : 1];
      const H0 = pick(r, 64, 74, 0.1), h = H0 / 100;
      const answer = (w / (h * h)) * 100;
      return {
        q: `<p>The CMB measures the density of ${what} as Ω h² = ${w}, where h = H₀ ÷ 100. If H₀ = ${H0} km/s/Mpc, what percentage of the critical density is ${what}?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Ω = (Ω h²) ÷ h², with h = H₀ ÷ 100.',
        solution: steps(
          `h = ${n(h, 4)}, so h² = ${n(h * h, 4)}.`,
          `Ω = ${w} ÷ ${n(h * h, 4)} = ${n(w / (h * h), 4)}, that is <b>${n(answer, 4)}%</b>.`,
          'The CMB pins Ω h² far better than Ω itself: Ω h² is the actual density (kg per m³, up to a fixed number), and that is what shapes the sound waves.'),
        w, H0,
      };
    },
    verify: (p) => 1e6 * p.w / (p.H0 * p.H0),
  },
  'universe-recipe-age': {
    title: 'the age from the recipe',
    make(r) {
      const wm = pick(r, 0.13, 0.155, 0.001), H0 = pick(r, 64, 72, 0.1), h = H0 / 100;
      const Om = wm / (h * h), answer = P.flatAgeGyr(H0, Om);
      return {
        q: `<p>A flat universe has a matter density Ω<sub>m</sub> h² = ${wm} and H₀ = ${H0} km/s/Mpc; dark energy makes up the rest. Using the age formula for a flat universe of matter and a cosmological constant, t₀ = (2 / (3 H₀ √Ω<sub>Λ</sub>)) × asinh(√(Ω<sub>Λ</sub>/Ω<sub>m</sub>)), how old is it, in billions of years? (1/H₀ = 977.8 ÷ H₀ billion years.)</p>`,
        answer, unit: 'billion years', tol: 0.005,
        hint: 'First Ω_m = (Ω_m h²) ÷ h², then Ω_Λ = 1 − Ω_m. Put both into the formula with 1/H₀ in billions of years.',
        solution: steps(
          `Ω<sub>m</sub> = ${wm} ÷ ${n(h * h, 4)} = ${n(Om, 4)}, so Ω<sub>Λ</sub> = ${n(1 - Om, 4)}.`,
          `1/H₀ = 977.8 ÷ ${H0} = ${n(977.8 / H0, 4)} billion years.`,
          `t₀ = (2 / (3 × √${n(1 - Om, 4)})) × asinh(√(${n(1 - Om, 4)} ÷ ${n(Om, 4)})) × ${n(977.8 / H0, 4)} = <b>${n(answer, 4)} billion years</b>. With Planck's numbers (0.143 and 67.4) this gives 13.8.`),
        wm, H0,
      };
    },
    verify: (p) => { const Om = p.wm / (p.H0 / 100) ** 2; return P.ageGyr(0, { H0: p.H0, Om, OL: 1 - Om }); },
  },
};
