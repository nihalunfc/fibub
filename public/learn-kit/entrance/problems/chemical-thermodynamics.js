// Live problems for Chemical thermodynamics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
// [equation as HTML, Δn(gas), typical ΔU in kJ]
const RX = [
  ['CH<sub>4</sub>(g) + 2O<sub>2</sub>(g) → CO<sub>2</sub>(g) + 2H<sub>2</sub>O(l)', -2, -885],
  ['N<sub>2</sub>(g) + 3H<sub>2</sub>(g) → 2NH<sub>3</sub>(g)', -2, -87],
  ['CaCO<sub>3</sub>(s) → CaO(s) + CO<sub>2</sub>(g)', 1, 175],
  ['PCl<sub>5</sub>(g) → PCl<sub>3</sub>(g) + Cl<sub>2</sub>(g)', 1, 85],
  ['2H<sub>2</sub>(g) + O<sub>2</sub>(g) → 2H<sub>2</sub>O(l)', -3, -564],
  ['C<sub>2</sub>H<sub>5</sub>OH(l) + 3O<sub>2</sub>(g) → 2CO<sub>2</sub>(g) + 3H<sub>2</sub>O(l)', -1, -1364],
  ['2NH<sub>3</sub>(g) → N<sub>2</sub>(g) + 3H<sub>2</sub>(g)', 2, 87],
];

export default {
  'th-dh-du': {
    title: 'enthalpy change from internal energy change',
    make(r) {
      const [eq, dn, base] = RX[Math.floor(r() * RX.length)], dU = base + pick(r, -15, 15), T = pick(r, 298, 500);
      const answer = dU + (dn * 8.314 * T) / 1000;
      return { dn, dU, T,
        q: `<p>For the reaction ${eq} at ${T} K, ΔU = ${dU} kJ (per mole of reaction as written). Find ΔH in kJ. Use R = 8.314 J K<sup>−1</sup> mol<sup>−1</sup> and treat the gases as ideal.</p>`,
        answer, unit: 'kJ', tol: 0.0005, abs: 0.05,
        hint: 'ΔH = ΔU + Δn<sub>g</sub>RT, where Δn<sub>g</sub> = moles of gaseous products − moles of gaseous reactants. Solids and liquids do not count. Watch J against kJ.',
        solution: steps(`Δn<sub>g</sub> = ${dn}.`, `Δn<sub>g</sub>RT = ${dn} × 8.314 × ${T} = ${n((dn * 8.314 * T) / 1000, 4)} kJ.`, `ΔH = ${dU} + (${n((dn * 8.314 * T) / 1000, 4)}) = <b>${n(answer, 5)} kJ</b>.`) };
    },
    verify: (x) => x.dU + (x.dn * 0.0821 * x.T * 101.3) / 1000,
  },
  'th-iso-work': {
    title: 'work in a reversible isothermal expansion',
    make(r) {
      const nm = pick(r, 0.5, 5, 0.5), T = pick(r, 250, 600, 10), V1 = pick(r, 1, 10), f = pick(r, 2, 10);
      const V2 = V1 * f, answer = -2.303 * nm * 8.314 * T * Math.log10(f);
      return { nm, T, f,
        q: `<p>${nm} mol of an ideal gas expands reversibly and isothermally at ${T} K from ${V1} L to ${V2} L. Find the work done on the gas, w, in joules (IUPAC sign: work done on the system is positive).</p>`,
        answer, unit: 'J', tol: 0.005,
        hint: 'For a reversible isothermal change, w = −2.303 nRT log(V₂/V₁). The gas does work on the surroundings, so w is negative.',
        solution: steps(`V₂/V₁ = ${f}; log ${f} = ${n(Math.log10(f), 4)}.`, `w = −2.303 × ${nm} × 8.314 × ${T} × ${n(Math.log10(f), 4)}.`, `= <b>${n(answer, 4)} J</b>. Since ΔU = 0 (ideal gas, constant T), q = −w = ${n(-answer, 4)} J of heat flows in.`) };
    },
    verify: (x) => -x.nm * 8.314 * x.T * Math.log(x.f),
  },
  'th-crossover': {
    title: 'temperature above which a reaction becomes spontaneous',
    make(r) {
      const dH = pick(r, 20, 250), dS = pick(r, 50, 300, 5), answer = (dH * 1000) / dS;
      return { dH, dS,
        q: `<p>A reaction has ΔH° = +${dH} kJ/mol and ΔS° = +${dS} J K<sup>−1</sup> mol<sup>−1</sup>. Assuming both stay constant, above what temperature (in K) is it spontaneous under standard conditions?</p>`,
        answer, unit: 'K', tol: 0.005,
        hint: 'It turns spontaneous when ΔG° = ΔH° − TΔS° drops below zero. Set ΔG° = 0 and solve for T. Change kJ to J first.',
        solution: steps('ΔG° = 0 at the turning point, so T = ΔH°/ΔS°.', `T = ${dH * 1000} J ÷ ${dS} J/K = <b>${n(answer, 4)} K</b>.`, 'Above this temperature the −TΔS° term outweighs the positive ΔH°.') };
    },
    verify: (x) => { let lo = 0, hi = 1e6; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; (x.dH * 1000 - m * x.dS > 0) ? (lo = m) : (hi = m); } return (lo + hi) / 2; },
  },
};
