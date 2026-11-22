// Live problems for Electromagnetic waves.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const C = 3e8, E0 = 8.85e-12, MU0 = 1 / (E0 * C * C), H = 6.63e-34;

export default {
  'emw-intensity': {
    title: 'intensity of a wave from its field amplitude',
    make(r) {
      const Em = pick(r, 10, 1000, 10);
      const answer = 0.5 * E0 * C * Em * Em;
      return { Em,
        q: `<p>A plane electromagnetic wave in vacuum has an electric field amplitude of ${Em} V/m. What is its intensity, in W/m²? (ε₀ = 8.85 × 10⁻¹² F/m, c = 3 × 10⁸ m/s)</p>`,
        answer, unit: 'W/m²', tol: 0.005,
        hint: 'Intensity = (average energy density) × c = ½ε₀E₀²c. Electric and magnetic fields carry equal shares.',
        solution: steps(`I = ½ × 8.85 × 10⁻¹² × ${Em}² × 3 × 10⁸.`, `I = <b>${n(answer)} W/m²</b>.`, `The magnetic amplitude is B₀ = E₀/c = ${n((Em / C) * 1e9)} nT.`) };
    },
    verify: (x) => { // average energy density from both fields, times c
      const B0 = x.Em / C, u = 0.25 * E0 * x.Em ** 2 + (0.25 * B0 ** 2) / MU0; return u * C;
    },
  },
  'emw-pressure': {
    title: 'force of light on a surface',
    make(r) {
      const I = pick(r, 100, 2000, 100), A = pick(r, 1, 50), refl = r() < 0.5;
      const answer = ((I * A) / C) * (refl ? 2 : 1) * 1e6;
      return { I, A, refl,
        q: `<p>Light of intensity ${I} W/m² falls straight onto a ${A} m² surface that ${refl ? 'reflects it all' : 'absorbs it all'}. What force does the light exert, in µN?</p>`,
        answer, unit: 'µN', tol: 0.005,
        hint: `Momentum carried per second per m² is I/c. ${refl ? 'Reflection reverses the momentum, so the change is twice as much.' : 'Absorption takes all of it.'}`,
        solution: steps(`Force = ${refl ? '2' : '1'} × IA/c = ${refl ? '2 × ' : ''}${I} × ${A} / (3 × 10⁸).`, `F = <b>${n(answer)} µN</b>: tiny, but enough to steer a solar sail in space.`) };
    },
    verify: (x) => { // count photons of 500 nm: N per second, each with momentum h/λ
      const lam = 5e-7, Nps = (x.I * x.A) / ((H * C) / lam); return Nps * (H / lam) * (x.refl ? 2 : 1) * 1e6;
    },
  },
  'emw-displacement': {
    title: 'magnetic field between the plates of a charging capacitor',
    make(r) {
      const I = pick(r, 0.5, 5, 0.5), R = pick(r, 5, 20), rr = pick(r, 1, R - 1);
      const answer = ((4 * Math.PI * 1e-7 * I * rr * 1e-2) / (2 * Math.PI * (R * 1e-2) ** 2)) * 1e6;
      return { I, R, rr,
        q: `<p>A capacitor with circular plates of radius ${R} cm is being charged by a steady current of ${I} A. What is the magnetic field between the plates, ${rr} cm from the central axis, in µT? (μ₀ = 4π × 10⁻⁷ T m/A)</p>`,
        answer, unit: 'µT', tol: 0.005,
        hint: 'Between the plates the displacement current equals the charging current I, spread evenly over the plate area. A circle of radius r encloses I r²/R² of it. Then B × 2πr = μ₀ I<sub>d,enclosed</sub>.',
        solution: steps(`Enclosed displacement current = ${I} × (${rr}/${R})² = ${n(I * (rr / R) ** 2)} A.`, `B = μ₀ I<sub>d</sub>/(2πr) = μ₀ I r/(2πR²).`, `B = <b>${n(answer)} µT</b>.`) };
    },
    verify: (x) => { // displacement current from ε₀ dΦ_E/dt with E = q/(ε₀πR²)
      const R = x.R * 1e-2, r = x.rr * 1e-2, dEdt = x.I / (E0 * Math.PI * R * R), Id = E0 * dEdt * Math.PI * r * r;
      return ((4 * Math.PI * 1e-7 * Id) / (2 * Math.PI * r)) * 1e6;
    },
  },
};
