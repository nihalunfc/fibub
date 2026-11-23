// Class 11 Biology, Photosynthesis in Higher Plants: live problems (original fibub questions). Ids start with c11b-photo-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-photo-atp': {
    title: 'ATP and NADPH for glucose',
    make(r) {
      const g = pick(r, 1, 10), c4 = choose(r, [false, true]), per = c4 ? 5 : 3;
      return { g, per, q: `<p>A ${c4 ? 'C4' : 'C3'} leaf makes ${g} molecule${g > 1 ? 's' : ''} of glucose. How many ATP are used to fix the carbon${c4 ? ' (include the C4 shuttle, 5 ATP per CO₂)' : ' (3 ATP per CO₂)'}?</p>`, answer: g * 6 * per, unit: 'ATP', tol: 0.01,
        hint: 'Each glucose needs 6 CO₂. Multiply by the ATP cost of one CO₂.',
        solution: steps(`CO₂ fixed = ${g} × 6 = ${6 * g}.`, `ATP = ${6 * g} × ${per} = <b>${n(6 * g * per)}</b>.`) };
    },
    verify: (x) => x.g * (x.per === 3 ? 18 : 30),
  },
  'c11b-photo-co2mass': {
    title: 'CO₂ needed for a mass of glucose',
    make(r) {
      const g = pick(r, 10, 90, 10);
      return { g, q: `<p>How many grams of CO₂ must a plant fix to make ${g} g of glucose (C₆H₁₂O₆)? (C = 12, H = 1, O = 16)</p>`, answer: g * 264 / 180, unit: 'g', tol: 0.01,
        hint: 'One glucose (180 g/mol) needs 6 CO₂ (6 × 44 = 264 g).',
        solution: steps(`Moles of glucose = ${g} ÷ 180 = ${n(g / 180)}.`, `Moles of CO₂ = 6 × ${n(g / 180)} = ${n(6 * g / 180)}.`, `Mass = ${n(6 * g / 180)} × 44 = <b>${n(g * 264 / 180)} g</b>.`) };
    },
    verify: (x) => (x.g / 180) * 6 * 44,
  },
  'c11b-photo-wavelength': {
    title: 'energy of a photon',
    make(r) {
      const nm = choose(r, [430, 450, 500, 550, 660, 680, 700]);
      return { nm, q: `<p>Chlorophyll absorbs light of wavelength ${nm} nm. Find the energy of one photon in electron-volts. (Use E = 1240 ÷ λ with λ in nm, which gives eV.)</p>`, answer: 1240 / nm, unit: 'eV', tol: 0.01,
        hint: 'Divide 1240 by the wavelength in nm.',
        solution: steps(`E = 1240 ÷ ${nm}.`, `E = <b>${n(1240 / nm)} eV</b>. Blue photons carry more energy than red ones.`) };
    },
    verify: (x) => 6.626e-34 * 2.998e8 / (x.nm * 1e-9) / 1.602e-19,
  },
  'c11b-photo-c4': {
    title: 'carbon gain with photorespiration',
    make(r) {
      const f = choose(r, [10, 20, 25, 30, 40]);
      return { f, q: `<p>Out of 100 RuBisCO reactions in a hot C3 leaf, ${f} are oxygenations and the rest are carboxylations. Each oxygenation releases half a CO₂ that was already fixed. Find the net number of CO₂ fixed.</p>`, answer: 100 - f - f / 2, unit: 'CO₂', tol: 0.01,
        hint: 'Carboxylations = 100 − oxygenations. Subtract 0.5 per oxygenation.',
        solution: steps(`Carboxylations = 100 − ${f} = ${100 - f}.`, `CO₂ lost = ${f} × 0.5 = ${f / 2}.`, `Net = ${100 - f} − ${f / 2} = <b>${100 - 1.5 * f}</b>.`) };
    },
    verify: (x) => (100 - x.f) - 0.5 * x.f,
  },
};
