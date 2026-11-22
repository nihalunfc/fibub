// Live problems for Coordination compounds.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

// [complex, d count, strong field?, metal ion]
const CX = [['[Ti(H<sub>2</sub>O)<sub>6</sub>]<sup>3+</sup>', 1, false, 'Ti³⁺'], ['[Cr(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>', 3, false, 'Cr³⁺'], ['[Fe(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>', 6, false, 'Fe²⁺'],
  ['[Fe(CN)<sub>6</sub>]<sup>4−</sup>', 6, true, 'Fe²⁺'], ['[Co(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>', 6, true, 'Co³⁺'], ['[CoF<sub>6</sub>]<sup>3−</sup>', 6, false, 'Co³⁺'],
  ['[Mn(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>', 5, false, 'Mn²⁺'], ['[Fe(CN)<sub>6</sub>]<sup>3−</sup>', 5, true, 'Fe³⁺'], ['[Ni(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>', 8, false, 'Ni²⁺'],
  ['[Mn(CN)<sub>6</sub>]<sup>4−</sup>', 5, true, 'Mn²⁺'], ['[Cr(CN)<sub>6</sub>]<sup>4−</sup>', 4, true, 'Cr²⁺'], ['[Cu(H<sub>2</sub>O)<sub>6</sub>]<sup>2+</sup>', 9, false, 'Cu²⁺']];

export default {
  'cc-cfse': {
    title: 'crystal field stabilisation energy of an octahedral complex',
    make(r) {
      const i = Math.floor(r() * CX.length), [cx, d, strong, ion] = CX[i];
      let t = 0, e = 0;
      if (strong) { t = Math.min(d, 6); e = d - t; } else { const s = Math.min(d, 5); t = Math.min(s, 3); e = s - t; const p = d - s; t += Math.min(p, 3); e += Math.max(0, p - 3); }
      const answer = -0.4 * t + 0.6 * e;
      return { d, strong,
        q: `<p>${cx} is a ${strong ? 'low-spin (strong-field)' : 'high-spin (weak-field)'} octahedral complex of ${ion}. What is its CFSE in units of Δ<sub>o</sub>? (Ignore pairing energy; give a negative number for stabilisation.)</p>`,
        answer, unit: 'Δo', tol: 0, abs: 0.01,
        hint: 'Find the d count of the metal ion. Each t₂g electron counts −0.4Δo, each e_g electron +0.6Δo. Strong field: fill t₂g completely (up to 6) before e_g.',
        solution: steps(`${ion} is d<sup>${d}</sup>; ${strong ? 'strong field, so electrons pair in t₂g first' : 'weak field, so electrons spread over all five orbitals before pairing'}.`, `Configuration t₂g<sup>${t}</sup> e<sub>g</sub><sup>${e}</sup>.`, `CFSE = ${t} × (−0.4) + ${e} × (0.6) = <b>${n(answer)} Δo</b>.`) };
    },
    // the barycentre rule: CFSE = −0.4 × (t₂g count) + 0.6 × (d − t₂g count)
    verify: (x) => {
      const t = x.strong ? Math.min(x.d, 6) : Math.min(x.d, 3) + Math.min(Math.max(0, x.d - 5), 3);
      return -0.4 * t + 0.6 * (x.d - t);
    },
  },
  'cc-wavelength': {
    title: 'wavelength absorbed from the splitting energy',
    make(r) {
      const D = pick(r, 150, 300, 5);
      const answer = (6.626e-34 * 3e8 * 6.022e23) / (D * 1000) * 1e9;
      return { D,
        q: `<p>The crystal field splitting Δ<sub>o</sub> of an octahedral complex is ${D} kJ/mol. At what wavelength (in nm) does the complex absorb most strongly for its d-d transition? (h = 6.626 × 10<sup>−34</sup> J s, c = 3 × 10<sup>8</sup> m/s, N<sub>A</sub> = 6.022 × 10<sup>23</sup>)</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: 'Energy per photon = Δo / N_A (in J). λ = hc / E.',
        solution: steps(`E per ion = ${D} × 1000 / 6.022×10²³ = ${n((D * 1000) / 6.022e23, 4)} J.`, `λ = hc/E = (6.626×10⁻³⁴ × 3×10⁸) / ${n((D * 1000) / 6.022e23, 4)} = ${n(answer * 1e-9, 4)} m.`, `λ = <b>${n(answer)} nm</b>. The complex looks the complementary colour of the light it absorbs.`) };
    },
    // molar form: λ = N_A h c / Δ, worked in nm with Δ in J/mol
    verify: (x) => (6.022e23 * 6.626e-34 * 3e8 * 1e9) / (x.D * 1e3),
  },
  'cc-werner': {
    title: 'silver chloride from a Werner complex',
    make(r) {
      const opts = [['[Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>', 3, 267.5], ['[Co(NH<sub>3</sub>)<sub>5</sub>Cl]Cl<sub>2</sub>', 2, 250.5], ['[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]Cl', 1, 233.5], ['[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>', 3, 266.5], ['[Cr(H<sub>2</sub>O)<sub>5</sub>Cl]Cl<sub>2</sub>·H<sub>2</sub>O', 2, 266.5], ['[Cr(H<sub>2</sub>O)<sub>4</sub>Cl<sub>2</sub>]Cl·2H<sub>2</sub>O', 1, 266.5]];
      const i = Math.floor(r() * opts.length), [f, k, M] = opts[i], g = pick(r, 0.5, 5, 0.25);
      const answer = (g / M) * k * 143.5;
      return { g, k, M,
        q: `<p>${g} g of ${f} (M = ${M} g/mol) is dissolved in water and treated with excess AgNO<sub>3</sub>. What mass of AgCl precipitates? (AgCl = 143.5 g/mol)</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: 'Only chloride ions outside the square brackets (the ionisation sphere) are free to react with Ag⁺. Chlorides bonded to the metal stay put.',
        solution: steps(`Free Cl⁻ per formula unit = ${k}.`, `Moles of complex = ${g}/${M} = ${n(g / M, 4)}; moles of AgCl = ${k} × ${n(g / M, 4)} = ${n((g / M) * k, 4)}.`, `Mass = ${n((g / M) * k, 4)} × 143.5 = <b>${n(answer)} g</b>.`) };
    },
    verify: (x) => x.g * x.k * (143.5 / x.M),
  },
};
