// Class 11 Biology, Respiration in Plants: live problems (original fibub questions). Ids start with c11b-resp-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-resp-glyco-count': {
    title: 'net ATP and NADH from glycolysis',
    make(r) {
      const g = pick(r, 2, 12);
      return { g, q: `<p>${g} molecules of glucose go through glycolysis. How many ATP are gained <b>net</b>?</p>`, answer: 2 * g, unit: 'ATP', tol: 0.01,
        hint: 'Each glucose uses 2 ATP and makes 4.',
        solution: steps(`Made = 4 × ${g} = ${4 * g}; used = 2 × ${g} = ${2 * g}.`, `Net = ${4 * g} − ${2 * g} = <b>${2 * g}</b> ATP.`) };
    },
    verify: (x) => x.g * (4 - 2),
  },
  'c11b-resp-krebs-turns': {
    title: 'products of the Krebs cycle',
    make(r) {
      const g = pick(r, 1, 10);
      return { g, q: `<p>How many NADH are produced in the Krebs cycle alone (not counting glycolysis or the link reaction) when ${g} glucose molecule${g > 1 ? 's are' : ' is'} respired completely?</p>`, answer: 6 * g, unit: 'NADH', tol: 0.01,
        hint: 'Each glucose gives 2 acetyl CoA, so the cycle turns twice. Each turn makes 3 NADH.',
        solution: steps(`Turns = 2 × ${g} = ${2 * g}.`, `NADH = ${2 * g} × 3 = <b>${6 * g}</b>.`) };
    },
    verify: (x) => 3 * x.g * 2,
  },
  'c11b-resp-atp-total': {
    title: 'ATP from NADH and FADH₂',
    make(r) {
      const nad = pick(r, 4, 14, 2), fad = pick(r, 2, 6, 2), atp = pick(r, 2, 6, 2);
      return { nad, fad, atp, q: `<p>A cell makes ${nad} NADH and ${fad} FADH₂ in the electron donating steps and ${atp} ATP directly. Using 3 ATP per NADH and 2 per FADH₂, how many ATP does it get in all?</p>`, answer: 3 * nad + 2 * fad + atp, unit: 'ATP', tol: 0.01,
        hint: 'ATP = 3 × NADH + 2 × FADH₂ + direct ATP.',
        solution: steps(`From NADH: 3 × ${nad} = ${3 * nad}.`, `From FADH₂: 2 × ${fad} = ${2 * fad}.`, `Total = ${3 * nad} + ${2 * fad} + ${atp} = <b>${3 * nad + 2 * fad + atp}</b>.`) };
    },
    verify: (x) => x.nad * 3 + x.fad * 2 + x.atp,
  },
  'c11b-resp-rq-calc': {
    title: 'respiratory quotient from volumes',
    make(r) {
      const o = pick(r, 100, 300, 20), co = choose(r, [0.7, 0.8, 0.9, 1.0, 1.2]);
      const c = Math.round(o * co);
      return { o, c, q: `<p>Germinating seeds in a respirometer take up ${o} mL of O₂ and release ${c} mL of CO₂ in an hour. What is the RQ?</p>`, answer: c / o, unit: '', tol: 0.01,
        hint: 'RQ = CO₂ released ÷ O₂ used.',
        solution: steps(`RQ = ${c} ÷ ${o} = <b>${n(c / o)}</b>.`, c / o < 0.95 ? 'This is below 1, so the seeds are burning some fat (or protein).' : c / o > 1.05 ? 'This is above 1: some organic acid or partial anaerobic respiration.' : 'About 1: mainly carbohydrate.') };
    },
    verify: (x) => 1 / (x.o / x.c),
  },
};
