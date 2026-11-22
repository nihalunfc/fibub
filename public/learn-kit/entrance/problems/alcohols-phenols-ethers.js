// Live problems for Alcohols, phenols and ethers.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const PKA = [['phenol', 10.0], ['4-nitrophenol', 7.15], ['3-nitrophenol', 8.4], ['2,4-dinitrophenol', 4.1], ['4-methylphenol', 10.3], ['ethanol', 15.9], ['4-chlorophenol', 9.4], ['2,4,6-trinitrophenol', 0.4]];

export default {
  'ap-ka-ratio': {
    title: 'how many times more acidic, from pKa',
    make(r) {
      const i = Math.floor(r() * PKA.length); let j = Math.floor(r() * PKA.length); if (j === i) j = (i + 1) % PKA.length;
      const [a, pa] = PKA[i], [b, pb] = PKA[j];
      const [s, ps, wk, pw] = pa < pb ? [a, pa, b, pb] : [b, pb, a, pa];
      const answer = Math.pow(10, pw - ps);
      return { ps, pw,
        q: `<p>The pK<sub>a</sub> of ${s} is ${ps} and that of ${wk} is ${pw}. How many times larger is the K<sub>a</sub> of ${s}?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'pKa = −log Ka, so Ka = 10^(−pKa). The ratio of two Ka values is 10 raised to the difference in pKa.',
        solution: steps(`Ka(${s})/Ka(${wk}) = 10<sup>−${ps}</sup>/10<sup>−${pw}</sup> = 10<sup>${n(pw - ps, 4)}</sup>.`, `= <b>${n(answer)}</b>.`) };
    },
    verify: (x) => Math.exp((x.pw - x.ps) * Math.LN10),
  },
  'ap-sodium-h2': {
    title: 'hydrogen from an alcohol and sodium',
    make(r) {
      const C = [['methanol', 32, 1], ['ethanol', 46, 1], ['propan-1-ol', 60, 1], ['ethane-1,2-diol', 62, 2], ['glycerol', 92, 3], ['phenol', 94, 1], ['butan-2-ol', 74, 1]];
      const [name, M, k] = C[Math.floor(r() * C.length)], g = pick(r, 0.5, 10, 0.5);
      const answer = (g / M) * (k / 2) * 22.4;
      return { g, M, k,
        q: `<p>${g} g of ${name} (M = ${M} g/mol) reacts completely with excess sodium. What volume of hydrogen forms at STP, in litres? (22.4 L/mol)</p>`,
        answer, unit: 'L', tol: 0.005,
        hint: '2R-OH + 2Na → 2R-ONa + H₂: two O-H groups give one H₂. Count the O-H groups in one molecule.',
        solution: steps(`${name} has ${k} O-H group${k > 1 ? 's' : ''}; moles of OH = ${k} × ${g}/${M} = ${n((k * g) / M, 4)}.`, `Moles of H₂ = half of that = ${n((k * g) / M / 2, 4)}.`, `Volume = ${n((k * g) / M / 2, 4)} × 22.4 = <b>${n(answer)} L</b>.`) };
    },
    verify: (x) => (11.2 * x.k * x.g) / x.M,
  },
  'ap-fermentation': {
    title: 'ethanol from glucose by fermentation',
    make(r) {
      const kg = pick(r, 1, 50, 1), y = pick(r, 50, 95, 5);
      const answer = (kg / 180) * 2 * 46 * (y / 100);
      return { kg, y,
        q: `<p>Yeast ferments glucose: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> → 2C<sub>2</sub>H<sub>5</sub>OH + 2CO<sub>2</sub>. How many kg of ethanol can be made from ${kg} kg of glucose at ${y}% yield? (C 12, H 1, O 16)</p>`,
        answer, unit: 'kg', tol: 0.005,
        hint: 'Glucose 180 g/mol gives 2 × 46 = 92 g of ethanol per mole. Then multiply by the yield.',
        solution: steps(`kmol of glucose = ${kg}/180 = ${n(kg / 180, 4)}.`, `Ethanol (theoretical) = 2 × ${n(kg / 180, 4)} × 46 = ${n((kg / 180) * 92, 4)} kg.`, `At ${y}%: <b>${n(answer)} kg</b>.`) };
    },
    // mass ratio: ethanol is 92/180 of the glucose mass
    verify: (x) => x.kg * (92 / 180) * x.y / 100,
  },
};
