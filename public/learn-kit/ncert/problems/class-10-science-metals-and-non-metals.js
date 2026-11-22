// Class 10 Science, Metals and Non-metals: live problems (original fibub questions). Ids start with c10s-metal-.
import { pick, choose, n, steps } from './_util.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const ATOM = [[3, 'lithium'], [8, 'oxygen'], [9, 'fluorine'], [11, 'sodium'], [12, 'magnesium'], [13, 'aluminium'], [16, 'sulphur'], [17, 'chlorine'], [19, 'potassium'], [20, 'calcium']];
const shells = (z) => { const out = []; let left = z; for (const cap of [2, 8, 8, 18]) { const k = Math.min(cap, left); out.push(k); left -= k; if (!left) break; } return out; };

export default {
  'c10s-metal-ion': {
    title: 'electrons gained or lost to form an ion',
    make(r) {
      const [z, nm] = choose(r, ATOM), sh = shells(z), outer = sh[sh.length - 1], metal = outer <= 3 && !(z === 8 || z === 9 || z === 16 || z === 17);
      const answer = metal ? outer : 8 - outer;
      return { z, q: `<p>The atom of <b>${nm}</b> has atomic number ${z}, so its electrons are arranged as ${sh.join(', ')}. To get a full outer shell (2 for the first shell only; otherwise 8, the octet), how many electrons does it ${metal ? 'lose' : 'gain'}? (Give the number.)</p>`, answer, unit: 'electrons', abs: 0.01, tol: 0,
        hint: 'Count the electrons in the outer shell. A few (1 to 3) are easier to give away; many (5 to 7) are easier to gain to reach 8.',
        solution: steps(`Electron arrangement: ${sh.join(', ')}; outer shell has ${outer} electron${outer > 1 ? 's' : ''}.`, metal ? `Losing ${outer} leaves the full shell below it: it <b>loses ${outer}</b> and becomes a positive ion.` : `Gaining ${8 - outer} makes 8: it <b>gains ${8 - outer}</b> and becomes a negative ion.`) };
    },
    verify: (x) => { const sh = shells(x.z), o = sh[sh.length - 1]; return Math.min(o, 8 - o); },
  },
  'c10s-metal-formula': {
    title: 'how many ions in an ionic compound',
    make(r) {
      const a = choose(r, [1, 2, 3]), b = choose(r, [1, 2, 3]), cat = { 1: 'Na', 2: 'Ca', 3: 'Al' }[a], an = { 1: 'Cl', 2: 'O', 3: 'N' }[b];
      const answer = a / gcd(a, b);
      return { a, b, q: `<p>The metal ion ${cat}<sup>${a}+</sup> combines with the non-metal ion ${an}<sup>${b}−</sup> to make a neutral compound. How many <b>${cat}</b> ions are there for each ${an}${b === 1 && a === 1 ? '' : ' unit in the simplest formula'}? (Give the smallest whole-number count of ${cat} in the formula.)</p>`, answer: b / gcd(a, b), unit: 'ions', abs: 0.01, tol: 0,
        hint: 'The total positive charge must equal the total negative charge. Cross the charges and cancel any common factor.',
        solution: steps(`Charges: ${cat} is ${a}+, ${an} is ${b}−. Total + must equal total −.`, `Number of ${cat} × ${a} = number of ${an} × ${b}. Smallest whole numbers: ${b / gcd(a, b)} ${cat} and ${a / gcd(a, b)} ${an}, so <b>${b / gcd(a, b)}</b>.`) };
    },
    verify: (x) => { let k = 1; while ((k * x.a) % x.b) k++; return k; },
  },
  'c10s-metal-iron': {
    title: 'iron from haematite',
    make(r) {
      const m = pick(r, 16, 480, 16);
      return { m, q: `<p>Haematite (Fe₂O₃) is reduced in a blast furnace: Fe₂O₃ + 3CO → 2Fe + 3CO₂. How many kg of iron can be obtained from ${m} kg of pure Fe₂O₃? (Fe = 56, O = 16.)</p>`, answer: (m * 112) / 160, unit: 'kg', tol: 0.01,
        hint: 'Fe₂O₃ = 2 × 56 + 3 × 16 = 160. Of every 160 parts by mass, 112 are iron.',
        solution: steps('Fe₂O₃ = 112 + 48 = 160; iron in it = 112.', `Iron = ${m} × 112 ÷ 160 = <b>${n((m * 112) / 160)} kg</b>.`) };
    },
    verify: (x) => (x.m / 160) * 2 * 56,
  },
  'c10s-metal-thermite': {
    title: 'aluminium for the thermite reaction',
    make(r) {
      const m = pick(r, 16, 320, 16);
      return { m, q: `<p>A railway repair team uses the thermite reaction Fe₂O₃ + 2Al → Al₂O₃ + 2Fe. What mass of aluminium powder (in kg) is needed to react completely with ${m} kg of Fe₂O₃? (Al = 27, Fe = 56, O = 16.)</p>`, answer: (m * 54) / 160, unit: 'kg', tol: 0.01,
        hint: '1 Fe₂O₃ (160) reacts with 2 Al (54), so the masses are in the ratio 160 : 54.',
        solution: steps('Fe₂O₃ = 160 and 2Al = 54.', `Aluminium = ${m} × 54 ÷ 160 = <b>${n((m * 54) / 160)} kg</b>.`) };
    },
    verify: (x) => (x.m / 160) * 2 * 27,
  },
  'c10s-metal-sodium': {
    title: 'sodium from molten salt',
    make(r) {
      const m = pick(r, 117, 1170, 117);
      return { m, q: `<p>Molten sodium chloride is electrolysed: 2NaCl → 2Na + Cl₂. How many kg of sodium metal are obtained from ${m} kg of NaCl? (Na = 23, Cl = 35.5.)</p>`, answer: (m * 23) / 58.5, unit: 'kg', tol: 0.01,
        hint: 'NaCl = 23 + 35.5 = 58.5, of which sodium is 23 parts.',
        solution: steps('Mass fraction of sodium in NaCl = 23 ÷ 58.5.', `Sodium = ${m} × 23 ÷ 58.5 = <b>${n((m * 23) / 58.5)} kg</b>.`) };
    },
    verify: (x) => x.m - (x.m * 35.5) / 58.5,
  },
  'c10s-metal-alloy': {
    title: 'composition of an alloy',
    make(r) {
      const [nm, a, b, pa] = choose(r, [['brass', 'copper', 'zinc', 70], ['bronze', 'copper', 'tin', 88], ['solder', 'lead', 'tin', 50], ['steel (stainless)', 'iron', 'chromium and nickel', 74]]), m = pick(r, 20, 500, 20);
      return { m, pa, q: `<p>${nm[0].toUpperCase() + nm.slice(1)} is about ${pa}% ${a} by mass and the rest ${b}. How many kg of ${b} are in ${m} kg of ${nm.split(' ')[0]}?</p>`, answer: (m * (100 - pa)) / 100, unit: 'kg', tol: 0.01,
        hint: 'The rest is 100 − the percentage of the first metal.',
        solution: steps(`${b[0].toUpperCase() + b.slice(1)} makes up 100 − ${pa} = ${100 - pa}%.`, `Mass = ${m} × ${100 - pa} ÷ 100 = <b>${n((m * (100 - pa)) / 100)} kg</b>.`) };
    },
    verify: (x) => x.m - (x.m * x.pa) / 100,
  },
  'c10s-metal-galv': {
    title: 'mass of zinc on a galvanised sheet',
    make(r) {
      const A = pick(r, 100, 2000, 100), th = pick(r, 10, 80, 5);
      return { A, th, q: `<p>A galvanised iron sheet has an area of ${A} cm² and a zinc coat ${th} micrometres (μm) thick on one side. The density of zinc is 7.1 g/cm³. What mass of zinc is on the sheet, in grams? (1 μm = 10<sup>−4</sup> cm.)</p>`, answer: A * th * 1e-4 * 7.1, unit: 'g', tol: 0.01,
        hint: 'Volume = area × thickness (in cm), then mass = density × volume.',
        solution: steps(`Thickness = ${th} × 10<sup>−4</sup> cm = ${n(th * 1e-4)} cm.`, `Volume = ${A} × ${n(th * 1e-4)} = ${n(A * th * 1e-4)} cm³.`, `Mass = 7.1 × ${n(A * th * 1e-4)} = <b>${n(A * th * 1e-4 * 7.1)} g</b>.`) };
    },
    verify: (x) => (7.1 * x.A * x.th) / 10000,
  },
};
