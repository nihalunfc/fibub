// Class 12 Biology, Chapter 13 Biodiversity and Conservation: live problems (original fibub questions). Ids start with c12b-biodiv-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-biodiv-sar': {
    title: 'species-area relationship',
    make(r) {
      const C = choose(r, [10, 15, 20, 25, 40]), Z = choose(r, [0.1, 0.15, 0.2, 0.25, 0.3]), A = choose(r, [100, 1000, 10000, 100000]);
      const ans = C * Math.pow(A, Z);
      return { C, Z, A, q: `<p>For birds in a region, the species-area relation is S = C × A^Z with C = ${C} and Z = ${Z}. How many species are expected in an area of ${n(A)} km²?</p>`, answer: ans, unit: 'species', tol: 0.02,
        hint: 'S = C × A^Z. Work out A to the power Z (use a calculator or logs), then multiply by C.',
        solution: steps(`log S = log C + Z log A = log ${C} + ${Z} × log ${n(A)}.`, `A^Z = ${n(A)}^${Z} = ${n(Math.pow(A, Z))}.`, `S = ${C} × ${n(Math.pow(A, Z))} = <b>${n(ans)}</b> species.`) };
    },
    verify: (x) => Math.pow(10, Math.log10(x.C) + x.Z * Math.log10(x.A)),
  },
  'c12b-biodiv-zslope': {
    title: 'finding Z from two areas',
    make(r) {
      const Z = choose(r, [0.1, 0.2, 0.25, 0.3, 0.5]), A1 = choose(r, [10, 100, 1000]), k = choose(r, [10, 100]), S1 = choose(r, [20, 40, 50, 80]);
      const A2 = A1 * k, S2 = S1 * Math.pow(k, Z);
      return { Z, A1, A2, S1, S2, q: `<p>A survey finds ${S1} species in ${n(A1)} km² and ${n(S2, 4)} species in ${n(A2)} km² of the same kind of habitat. Using log S = log C + Z log A, what is the slope Z?</p>`, answer: Z, unit: '', tol: 0.03,
        hint: 'Z is the slope of the log-log line: Z = (log S₂ − log S₁) ÷ (log A₂ − log A₁).',
        solution: steps(`log S₂ − log S₁ = ${n(Math.log10(S2) - Math.log10(S1), 4)}.`, `log A₂ − log A₁ = ${n(Math.log10(A2) - Math.log10(A1), 4)}.`, `Z = ${n(Math.log10(S2) - Math.log10(S1), 4)} ÷ ${n(Math.log10(A2) - Math.log10(A1), 4)} = <b>${n(Z)}</b>.`) };
    },
    verify: (x) => Math.log(x.S2 / x.S1) / Math.log(x.A2 / x.A1),
  },
  'c12b-biodiv-loss': {
    title: 'species left after habitat is cleared',
    make(r) {
      const S = choose(r, [100, 200, 400, 1000]), cut = choose(r, [50, 75, 90]), Z = choose(r, [0.15, 0.2, 0.25]);
      const left = S * Math.pow(1 - cut / 100, Z);
      return { S, cut, Z, q: `<p>A forest has ${S} species. ${cut} % of it is cleared. Using the species-area law with Z = ${Z}, about how many species can the remaining forest support in the long run?</p>`, answer: left, unit: 'species', tol: 0.02,
        hint: 'The area left is (1 − cleared fraction). Species left = S × (area left)^Z.',
        solution: steps(`Area left = ${100 - cut} % = ${n(1 - cut / 100)} of the original.`, `(${n(1 - cut / 100)})^${Z} = ${n(Math.pow(1 - cut / 100, Z))}.`, `Species left = ${S} × ${n(Math.pow(1 - cut / 100, Z))} = <b>${n(left)}</b> (about ${n(S - left)} species lost).`) };
    },
    verify: (x) => Math.exp(Math.log(x.S) + x.Z * Math.log(1 - x.cut / 100)),
  },
  'c12b-biodiv-richness': {
    title: 'species richness and the proportion of a group',
    make(r) {
      const tot = choose(r, [1500, 3000, 5000, 8000]), pct = choose(r, [10, 20, 25, 40, 50]);
      return { tot, pct, q: `<p>A national park has ${n(tot)} recorded plant species. If ${pct} % of them are endemic (found nowhere else), how many endemic species does the park hold?</p>`, answer: tot * pct / 100, unit: 'species', tol: 0, abs: 0.01,
        hint: 'Percent means per hundred: multiply the total by the percentage and divide by 100.',
        solution: steps(`${pct} % of ${n(tot)} = ${n(tot)} × ${pct} ÷ 100.`, `= <b>${n(tot * pct / 100)}</b> endemic species.`, 'Endemic species cannot be saved anywhere else if this habitat goes.') };
    },
    verify: (x) => { let c = 0; for (let i = 0; i < x.pct; i++) c += x.tot / 100; return c; },
  },
};
