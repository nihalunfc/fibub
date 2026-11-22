// Live problems for Haloalkanes and haloarenes.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'ha-carius': {
    title: 'percentage of halogen by the Carius method',
    make(r) {
      const X = [['chlorine', 'AgCl', 35.5, 143.5], ['bromine', 'AgBr', 80, 188], ['iodine', 'AgI', 127, 235]][Math.floor(r() * 3)];
      const [el, salt, Ax, Ms] = X, w = pick(r, 0.1, 0.5, 0.01), pct = pick(r, 20, 80, 1);
      const ws = +((w * pct / 100) * (Ms / Ax)).toFixed(3);
      const answer = (Ax / Ms) * (ws / w) * 100;
      return { w, ws, Ax, Ms,
        q: `<p>In a Carius determination, ${w} g of an organic compound gave ${ws} g of ${salt}. What is the percentage of ${el} in the compound? (Ag 108, ${el === 'chlorine' ? 'Cl 35.5' : el === 'bromine' ? 'Br 80' : 'I 127'})</p>`,
        answer, unit: '%', tol: 0.005,
        hint: `All the ${el} ends up in ${salt}. The fraction of ${el} in ${salt} is ${Ax}/${Ms}.`,
        solution: steps(`Mass of ${el} = ${ws} × ${Ax}/${Ms} = ${n(ws * Ax / Ms, 4)} g.`, `Percentage = ${n(ws * Ax / Ms, 4)}/${w} × 100 = <b>${n(answer)}%</b>.`) };
    },
    // moles route: mol AgX = mol X
    verify: (x) => ((x.ws / x.Ms) * x.Ax * 100) / x.w,
  },
  'ha-sn2-rate': {
    title: 'how an SN2 rate changes with concentrations',
    make(r) {
      const r0 = pick(r, 1, 9, 0.5), fa = [0.5, 2, 3, 4][Math.floor(r() * 4)], fb = [0.5, 2, 3][Math.floor(r() * 3)];
      const sn1 = r() < 0.35, answer = sn1 ? r0 * fa : r0 * fa * fb;
      const what = sn1 ? 'tert-butyl bromide with hydroxide in aqueous ethanol (an SN1 reaction)' : 'bromoethane with hydroxide ion in acetone (an SN2 reaction)';
      return { r0, fa, fb, sn1,
        q: `<p>The initial rate of the reaction of ${what} is ${r0} × 10<sup>−5</sup> mol L<sup>−1</sup> s<sup>−1</sup>. The alkyl bromide concentration is multiplied by ${fa} and the OH<sup>−</sup> concentration by ${fb}. What is the new rate, in units of 10<sup>−5</sup> mol L<sup>−1</sup> s<sup>−1</sup>?</p>`,
        answer, unit: '× 10⁻⁵ M/s', tol: 0.005,
        hint: sn1 ? 'SN1: rate = k[RBr]. The nucleophile is not in the slow step.' : 'SN2: rate = k[RBr][OH⁻]. Both are in the single step.',
        solution: steps(sn1 ? 'SN1 rate law: rate = k[RBr]; changing [OH⁻] does nothing.' : 'SN2 rate law: rate = k[RBr][OH⁻].', sn1 ? `New rate = ${r0} × ${fa} = <b>${n(answer)}</b> × 10⁻⁵ M/s.` : `New rate = ${r0} × ${fa} × ${fb} = <b>${n(answer)}</b> × 10⁻⁵ M/s.`) };
    },
    verify: (x) => x.r0 * x.fa * (x.sn1 ? 1 : x.fb),
  },
  'ha-grignard-methane': {
    title: 'methane from a Grignard reagent and active hydrogen',
    make(r) {
      const C = [['ethanol', 46, 1], ['methanol', 32, 1], ['water', 18, 2], ['ethane-1,2-diol', 62, 2], ['glycerol (propane-1,2,3-triol)', 92, 3], ['phenol', 94, 1], ['ethanoic acid', 60, 1], ['ethylamine', 45, 2]];
      const [name, M, h] = C[Math.floor(r() * C.length)], g = pick(r, 0.1, 2, 0.05);
      const answer = (g / M) * h * 22400;
      return { g, M, h,
        q: `<p>${g} g of ${name} (M = ${M} g/mol) is treated with excess CH<sub>3</sub>MgI. What volume of methane is released at STP, in mL? (22.4 L/mol)</p>`,
        answer, unit: 'mL', tol: 0.005,
        hint: 'Each "active" hydrogen (on O or N) gives one CH₄: R-OH + CH₃MgI → CH₄ + R-OMgI. Count the O-H and N-H hydrogens.',
        solution: steps(`${name} has ${h} active H per molecule.`, `Moles = ${g}/${M} = ${n(g / M, 4)}; CH₄ = ${h} × ${n(g / M, 4)} = ${n((g / M) * h, 4)} mol.`, `Volume = ${n((g / M) * h, 4)} × 22 400 = <b>${n(answer)} mL</b>.`) };
    },
    verify: (x) => x.h * 22.4 * 1000 * x.g / x.M,
  },
};
