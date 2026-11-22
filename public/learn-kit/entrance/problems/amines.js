// Live problems for Amines and diazonium salts.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'am-kjeldahl': {
    title: 'percentage of nitrogen by the Kjeldahl method',
    make(r) {
      const w = pick(r, 0.2, 1, 0.05), V = pick(r, 5, 40, 1), M = [0.05, 0.1, 0.2, 0.25][Math.floor(r() * 4)];
      const answer = (1.4 * 2 * M * V) / w;
      return { w, V, M,
        q: `<p>${w} g of an organic compound is digested with conc. H<sub>2</sub>SO<sub>4</sub> and the ammonia set free is absorbed in sulphuric acid. It neutralises exactly ${V} mL of ${M} M H<sub>2</sub>SO<sub>4</sub>. What is the percentage of nitrogen in the compound?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'H₂SO₄ is dibasic: 1 mol of acid takes 2 mol of NH₃. Moles of N = moles of NH₃; mass of N = moles × 14.',
        solution: steps(`mmol of H₂SO₄ = ${M} × ${V} = ${n(M * V, 4)}; mmol of NH₃ = 2 × that = ${n(2 * M * V, 4)}.`, `Mass of N = ${n(2 * M * V, 4)} × 14 mg = ${n(28 * M * V, 4)} mg = ${n(0.028 * M * V, 4)} g.`, `%N = ${n(0.028 * M * V, 4)}/${w} × 100 = <b>${n(answer)}%</b>.`) };
    },
    // normality form: %N = 1.4 × N × V / w with N = 2M
    verify: (x) => (14 * 2 * x.M * x.V) / (1000 * x.w) * 100,
  },
  'am-ph': {
    title: 'pH of an amine solution',
    make(r) {
      const A = [['methylamine', 3.38], ['ethylamine', 3.29], ['dimethylamine', 3.27], ['ammonia', 4.75], ['aniline', 9.38], ['trimethylamine', 4.22]];
      const [name, pKb] = A[Math.floor(r() * A.length)], c = [0.01, 0.05, 0.1, 0.2, 0.5][Math.floor(r() * 5)];
      const answer = 14 - 0.5 * (pKb - Math.log10(c));
      return { pKb, c,
        q: `<p>Find the pH of a ${c} M aqueous solution of ${name} (pK<sub>b</sub> = ${pKb}) at 25 °C, using the weak-base approximation.</p>`,
        answer, unit: '', tol: 0.005, abs: 0.02,
        hint: '[OH⁻] = √(Kb c), so pOH = ½(pKb − log c), and pH = 14 − pOH.',
        solution: steps(`pOH = ½(${pKb} − (${n(Math.log10(c), 3)})) = ${n(0.5 * (pKb - Math.log10(c)), 4)}.`, `pH = 14 − ${n(0.5 * (pKb - Math.log10(c)), 4)} = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => 14 + Math.log10(Math.sqrt(Math.pow(10, -x.pKb) * x.c)),
  },
  'am-acetanilide': {
    title: 'mass of acetanilide from aniline',
    make(r) {
      const g = pick(r, 2, 20, 0.5), y = pick(r, 60, 95, 5);
      const answer = (g / 93) * 135 * (y / 100);
      return { g, y,
        q: `<p>${g} g of aniline (C<sub>6</sub>H<sub>5</sub>NH<sub>2</sub>, M = 93) is acetylated with excess ethanoic anhydride. The yield of acetanilide (C<sub>6</sub>H<sub>5</sub>NHCOCH<sub>3</sub>, M = 135) is ${y}%. What mass of acetanilide is obtained?</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: '1 mol of aniline gives 1 mol of acetanilide (the NH₂ swaps one H for COCH₃).',
        solution: steps(`Moles of aniline = ${g}/93 = ${n(g / 93, 4)}.`, `Theoretical acetanilide = ${n(g / 93, 4)} × 135 = ${n((g / 93) * 135, 4)} g.`, `At ${y}%: <b>${n(answer)} g</b>.`) };
    },
    // mass gain route: each mole gains 42 g (H replaced by COCH₃)
    verify: (x) => (x.g + (x.g / 93) * 42) * (x.y / 100),
  },
};
