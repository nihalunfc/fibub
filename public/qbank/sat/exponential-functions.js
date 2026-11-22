// SAT Math · Advanced math · exponential growth and decay. Original (fibub).
import { int, choose, shuffleOpts, fmt, v, usd, steps } from './_util.js';
const F = { section: 'math', domain: 'advanced' };

export default {
  topic: 'exponential-functions',
  gens: [
    { id: 'sat-ex-g01', type: 'nat', level: 2, exams: ['sat'], sub: 'growth', facets: F, format: 'numeric',
      make(r) {
        const P = int(r, 2, 40) * 100, pct = choose(r, [2, 3, 4, 5, 6, 8, 10, 12, 15]), t = int(r, 2, 6), dec = r() < 0.35;
        const b = dec ? 1 - pct / 100 : 1 + pct / 100, val = Math.round(P * b ** t);
        const what = dec ? `A car worth ${usd(P)} loses ${pct}% of its value each year.` : `A savings account starts with ${usd(P)} and earns ${pct}% interest each year, compounded once a year.`;
        return { q: `<p>${what} To the nearest dollar, what is it worth after ${t} years?</p>`, answer: val, tol: 1, P, b, t,
          sol: steps(`Each year multiplies the value by ${fmt(b)} (that is 100% ${dec ? '−' : '+'} ${pct}%).`, `After ${t} years: ${P} × ${fmt(b)}<sup>${t}</sup>.`, `= <b>${val.toLocaleString('en-US')}</b> dollars, to the nearest dollar.`),
          trap: `Adding ${pct}% of the starting amount each year (that is linear, not exponential).` };
      },
      verify: (p) => Math.round(p.P * p.b ** p.t) },
    { id: 'sat-ex-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'half-life', facets: F, format: 'numeric',
      make(r) {
        const n = int(r, 1, 5), hl = choose(r, [2, 3, 5, 6, 8, 10, 12]), A0 = 2 ** n * int(r, 3, 25), t = n * hl;
        return { q: `<p>A medicine leaves the body so that the amount left halves every ${hl} hours. A patient takes ${A0} milligrams. How many milligrams are left after ${t} hours?</p>`, answer: A0 / 2 ** n, tol: 0, A0, hl, t,
          sol: steps(`${t} hours is ${t} ÷ ${hl} = ${n} half-lives.`, `Halve ${n} time${n > 1 ? 's' : ''}: ${A0} × (1/2)<sup>${n}</sup>.`, `= <b>${fmt(A0 / 2 ** n)}</b> mg.`) };
      },
      verify: (p) => p.A0 * 0.5 ** (p.t / p.hl) },
    { id: 'sat-ex-g03', type: 'mcq', level: 2, exams: ['sat'], sub: 'read the rate', facets: F, format: 'single',
      make(r) {
        const a = int(r, 2, 90) * 10, pct = choose(r, [3, 4, 5, 7, 8, 12, 15, 20, 25, 35]), dec = r() < 0.5;
        const b = dec ? (100 - pct) / 100 : (100 + pct) / 100;
        const right = `It ${dec ? 'decreases' : 'increases'} by ${pct}% each year.`;
        const o = shuffleOpts(r, right, [`It ${dec ? 'decreases' : 'increases'} by ${dec ? 100 - pct : 100 + pct}% each year.`, `It ${dec ? 'increases' : 'decreases'} by ${pct}% each year.`, `It ${dec ? 'decreases' : 'increases'} by ${fmt(b)} each year.`, `It ${dec ? 'decreases' : 'increases'} by ${a} each year.`]);
        return { q: `<p>The number of birds in a park ${v('t')} years after a survey is modelled by ${v('B')}(${v('t')}) = ${a}(${fmt(b)})<sup>${v('t')}</sup>. Which statement describes how the number changes?</p>`, ...o,
          sol: steps(`In ${v('a')}·${v('b')}<sup>${v('t')}</sup>, the base ${v('b')} is what the amount is multiplied by each year.`, `${fmt(b)} = 1 ${dec ? '−' : '+'} ${fmt(pct / 100)}, so each year the number is ${dec ? (100 - pct) + '% of' : (100 + pct) + '% of'} the year before.`, `That is <b>${right.toLowerCase().replace('it ', 'a change: ')}</b>`),
          trap: `Reading ${fmt(b)} as a ${dec ? 100 - pct : 100 + pct}% change: subtract it from 1 (or 1 from it) first.` };
      } },
    { id: 'sat-ex-g04', type: 'nat', level: 3, exams: ['sat'], sub: 'doubling', facets: F, format: 'numeric',
      make(r) {
        const d = choose(r, [3, 4, 5, 6, 8, 10, 20, 30]), n = int(r, 2, 6), N0 = int(r, 1, 12) * 50, unit = choose(r, ['minutes', 'hours', 'days']);
        return { q: `<p>A population of bacteria doubles every ${d} ${unit}. It starts at ${N0}. After how many ${unit} will it reach ${(N0 * 2 ** n).toLocaleString('en-US')}?</p>`, answer: n * d, tol: 0, N0, d, target: N0 * 2 ** n,
          sol: steps(`${(N0 * 2 ** n).toLocaleString('en-US')} ÷ ${N0} = ${2 ** n} = 2<sup>${n}</sup>, so it has to double ${n} times.`, `${n} doublings × ${d} ${unit} = <b>${n * d}</b> ${unit}.`) };
      },
      verify: (p) => Math.log2(p.target / p.N0) * p.d },
    { id: 'sat-ex-g05', type: 'nat', level: 3, exams: ['sat'], sub: 'percent per period', facets: F, format: 'numeric',
      make(r) {
        const pct = choose(r, [10, 20, 21, 44, 69, 96]), a = int(r, 2, 20) * 100;
        const pairs = { 21: [10, 2], 44: [20, 2], 69: [30, 2], 96: [40, 2], 10: [10, 1], 20: [20, 1] };
        const [per, k] = pairs[pct];
        return { q: `<p>A town's population ${v('P')} is modelled by ${v('P')} = ${a}(${fmt(1 + per / 100)})<sup>${k === 1 ? v('t') : k + v('t')}</sup>, where ${v('t')} is the number of years since 2020. By what percent does the population grow each <b>year</b>?</p>`, answer: pct, tol: 0.01, per, k,
          sol: k === 1 ? steps(`The base ${fmt(1 + per / 100)} means ×${fmt(1 + per / 100)} each year: a <b>${pct}%</b> increase.`)
            : steps(`The exponent is ${k}${v('t')}, so the factor ${fmt(1 + per / 100)} is applied twice per year.`, `Per year: ${fmt(1 + per / 100)}<sup>2</sup> = ${fmt((1 + per / 100) ** 2)}.`, `That is a <b>${pct}%</b> increase per year (not ${per}%).`),
          trap: 'Reading the percent straight from the base when the exponent is not just t.' };
      },
      verify: (p) => Math.round(((1 + p.per / 100) ** p.k - 1) * 10000) / 100 },
  ],
  items: [
    { id: 'sat-ex-001', type: 'mcq', level: 1, exams: ['sat'], sub: 'linear or exponential', facets: F,
      q: '<p>A quantity increases by the same <b>percentage</b> every month. Which kind of model fits it best?</p>',
      options: ['Exponential growth', 'Linear growth', 'Exponential decay', 'Linear decay'], answer: 0,
      sol: '<p>The same percentage each time means the same multiplier each time: exponential. The same <i>amount</i> each time would be linear.</p>' },
    { id: 'sat-ex-002', type: 'mcq', level: 3, exams: ['sat'], sub: 'equivalent form', facets: F,
      q: '<p>The value of a machine is modelled by <i>V</i>(<i>t</i>) = 9,000(0.81)<sup><i>t</i></sup>, where <i>t</i> is in years. Which equivalent model shows the percent change every half year?</p>',
      options: ['<i>V</i>(<i>t</i>) = 9,000(0.9)<sup>2<i>t</i></sup>', '<i>V</i>(<i>t</i>) = 9,000(0.405)<sup>2<i>t</i></sup>', '<i>V</i>(<i>t</i>) = 9,000(0.9)<sup><i>t</i>/2</sup>', '<i>V</i>(<i>t</i>) = 4,500(0.81)<sup>2<i>t</i></sup>'], answer: 0,
      sol: '<p>0.9<sup>2</sup> = 0.81, so (0.9)<sup>2<i>t</i></sup> = (0.81)<sup><i>t</i></sup>. With 2<i>t</i> half-years, the base 0.9 shows a 10% drop every half year. Halving the base (0.405) is a common wrong move.</p>' },
  ],
};
