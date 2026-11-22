// Live problems for Respiration in plants.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const SUBS = [
  ['glucose', 'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>', 6, 12, 6],
  ['tripalmitin (a fat)', 'C<sub>51</sub>H<sub>98</sub>O<sub>6</sub>', 51, 98, 6],
  ['palmitic acid', 'C<sub>16</sub>H<sub>32</sub>O<sub>2</sub>', 16, 32, 2],
  ['malic acid (an organic acid)', 'C<sub>4</sub>H<sub>6</sub>O<sub>5</sub>', 4, 6, 5],
  ['oxalic acid (an organic acid)', 'C<sub>2</sub>H<sub>2</sub>O<sub>4</sub>', 2, 2, 4],
  ['citric acid (an organic acid)', 'C<sub>6</sub>H<sub>8</sub>O<sub>7</sub>', 6, 8, 7],
];

export default {
  'presp-rq': {
    title: 'respiratory quotient of a substrate from its formula',
    make(r) {
      const [name, f, c, hh, o] = SUBS[Math.floor(r() * SUBS.length)];
      const o2 = c + hh / 4 - o / 2, answer = c / o2;
      return { c, hh, o,
        q: `<p>A tissue respires only ${name}, ${f}, completely to CO<sub>2</sub> and H<sub>2</sub>O. What is its respiratory quotient (RQ)?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'RQ = CO<sub>2</sub> released ÷ O<sub>2</sub> used. For C<sub>x</sub>H<sub>y</sub>O<sub>z</sub>, CO<sub>2</sub> = x and O<sub>2</sub> needed = x + y/4 − z/2 per molecule.',
        solution: steps(`CO<sub>2</sub> released per molecule = ${c}.`, `O<sub>2</sub> needed = ${c} + ${hh}/4 − ${o}/2 = ${n(o2, 4)}.`, `RQ = ${c} ÷ ${n(o2, 4)} = <b>${n(answer, 3)}</b>. ${answer > 1.05 ? 'Above 1: the acid already carries much oxygen.' : answer < 0.95 ? 'Below 1: fats are poor in oxygen, so they need more O<sub>2</sub>.' : 'Exactly 1 for carbohydrates.'}`) };
    },
    // count O atoms on both sides instead: O in products (2x + y/2) minus O in the substrate, halved, is the O2 used
    verify: (x) => x.c / ((2 * x.c + x.hh / 2 - x.o) / 2),
  },
  'presp-atp-mix': {
    title: 'ATP from glucose split between aerobic respiration and fermentation',
    make(r) {
      const G = pick(r, 10, 100, 10), aer = pick(r, 10, 90, 10);
      const a = (G * aer) / 100, f = G - a, answer = a * 38 + f * 2;
      return { G, aer,
        q: `<p>Yeast cells break down ${G} glucose molecules: ${aer}% by aerobic respiration and the rest by alcoholic fermentation. How many ATP do they gain in all? (Use the NCERT count: 38 ATP per glucose aerobically.)</p>`,
        answer, unit: 'ATP', tol: 0,
        hint: 'Aerobic respiration gives 38 ATP per glucose; fermentation gives only the net 2 ATP of glycolysis.',
        solution: steps(`Aerobic: ${aer}% of ${G} = ${n(a)} glucose × 38 = ${n(a * 38, 5)} ATP.`, `Fermentation: ${n(f)} glucose × 2 = ${n(f * 2, 5)} ATP.`, `Total = <b>${n(answer, 6)} ATP</b>.`) };
    },
    verify: (x) => 2 * x.G + 36 * (x.G * x.aer) / 100,
  },
};
