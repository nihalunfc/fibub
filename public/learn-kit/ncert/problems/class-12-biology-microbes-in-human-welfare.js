// Class 12 Biology, Microbes in Human Welfare: live problems (original fibub questions). Ids start with c12b-microbe-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-microbe-doubling': {
    title: 'bacterial doubling',
    make(r) {
      const N0 = choose(r, [100, 500, 1000, 5000]), g = choose(r, [20, 30, 40]), k = pick(r, 3, 9, 1), t = g * k;
      return { N0, g, k, t, q: `<p>A culture starts with ${n(N0)} bacteria per mL. They divide every ${g} minutes. How many bacteria per mL are there after ${t} minutes (assume no cell dies and food is not limiting)?</p>`, answer: N0 * 2 ** k, unit: 'cells/mL', tol: 0.01,
        hint: 'Number of doublings = time ÷ doubling time. Then N = N₀ × 2<sup>n</sup>.',
        solution: steps(`Doublings n = ${t} ÷ ${g} = ${k}.`, `N = ${n(N0)} × 2<sup>${k}</sup> = ${n(N0)} × ${2 ** k} = <b>${n(N0 * 2 ** k)}</b> per mL.`) };
    },
    verify: (x) => x.N0 * Math.exp(x.k * Math.LN2),
  },
  'c12b-microbe-time': {
    title: 'time to reach a population',
    make(r) {
      const g = choose(r, [20, 30, 45]), k = pick(r, 6, 14, 1), N0 = choose(r, [1, 10, 100]);
      return { g, k, N0, q: `<p>A bacterium that divides every ${g} minutes starts from ${N0} cell${N0 > 1 ? 's' : ''}. How many minutes does it take to reach ${n(N0 * 2 ** k)} cells?</p>`, answer: g * k, unit: 'min', tol: 0.01,
        hint: 'Find how many times the number doubles: 2<sup>n</sup> = final ÷ start. Then multiply n by the doubling time.',
        solution: steps(`Final ÷ start = ${n(N0 * 2 ** k)} ÷ ${N0} = ${2 ** k} = 2<sup>${k}</sup>, so ${k} doublings.`, `Time = ${k} × ${g} = <b>${g * k} min</b>.`) };
    },
    verify: (x) => (Math.log(x.N0 * 2 ** x.k / x.N0) / Math.LN2) * x.g,
  },
  'c12b-microbe-biogas': {
    title: 'biogas from cattle dung',
    make(r) {
      const cows = pick(r, 2, 10, 1), kg = choose(r, [8, 10, 12]), yieldv = 0.036, dung = cows * kg;
      return { cows, kg, dung, q: `<p>Each cow gives about ${kg} kg of dung a day. A family with ${cows} cows puts all of it in a biogas plant. If 1 kg of fresh dung gives 0.036 m³ of biogas, how many m³ of biogas does the plant make per day?</p>`, answer: dung * yieldv, unit: 'm³', tol: 0.02,
        hint: 'Total dung = number of cows × dung per cow. Then multiply by 0.036 m³ per kg.',
        solution: steps(`Dung = ${cows} × ${kg} = ${dung} kg per day.`, `Gas = ${dung} × 0.036 = <b>${n(dung * yieldv)} m³</b> per day.`, `At about 0.3 m³ an hour, that is roughly ${n(dung * yieldv / 0.3)} hours of cooking.`) };
    },
    verify: (x) => x.cows * x.kg * 36 / 1000,
  },
  'c12b-microbe-bod': {
    title: 'BOD removed by sewage treatment',
    make(r) {
      const raw = choose(r, [250, 300, 350, 400]), fin = choose(r, [15, 20, 25, 30]);
      return { raw, fin, q: `<p>Raw sewage entering a treatment plant has a BOD of ${raw} mg/L. After secondary treatment the effluent has a BOD of ${fin} mg/L. What percentage of the BOD was removed?</p>`, answer: 100 * (raw - fin) / raw, unit: '%', tol: 0.01,
        hint: 'Percentage removed = (fall in BOD) ÷ (starting BOD) × 100.',
        solution: steps(`Fall = ${raw} − ${fin} = ${raw - fin} mg/L.`, `Removed = ${raw - fin} ÷ ${raw} × 100 = <b>${n(100 * (raw - fin) / raw)} %</b>.`, 'A low BOD means less oxygen will be used up by microbes in the river, so fish and other water life are safe.') };
    },
    verify: (x) => (1 - x.fin / x.raw) * 100,
  },
  'c12b-microbe-ethanol': {
    title: 'ethanol from fermentation',
    make(r) {
      const g = pick(r, 100, 500, 50);
      return { g, q: `<p>Yeast ferments ${g} g of glucose (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>, molar mass 180) by C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> → 2 C<sub>2</sub>H<sub>5</sub>OH + 2 CO<sub>2</sub>. If all of it reacts, what mass of ethanol (molar mass 46) is made, in grams?</p>`, answer: g / 180 * 2 * 46, unit: 'g', tol: 0.02,
        hint: 'Moles of glucose = mass ÷ 180; each mole gives 2 moles of ethanol; multiply by 46.',
        solution: steps(`Moles of glucose = ${g} ÷ 180 = ${n(g / 180, 4)}.`, `Moles of ethanol = 2 × ${n(g / 180, 4)} = ${n(2 * g / 180, 4)}.`, `Mass = ${n(2 * g / 180, 4)} × 46 = <b>${n(g / 180 * 92)} g</b>. About 51 % of the glucose mass becomes ethanol and the rest leaves as CO<sub>2</sub>.`) };
    },
    verify: (x) => x.g * 0.5111 * 1.0,
  },
};
