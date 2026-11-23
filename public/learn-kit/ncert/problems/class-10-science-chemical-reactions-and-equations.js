// Class 10 Science, Chemical Reactions and Equations: live problems (original fibub questions). Ids start with c10s-react-.
import { pick, choose, n, steps } from './_util.js';

// Atoms in a formula such as Al2(SO4)3, counted by a tiny parser (used by verify to count a different way).
const count = (f) => {
  const st = [{}]; let i = 0;
  while (i < f.length) {
    const ch = f[i];
    if (ch === '(') { st.push({}); i++; continue; }
    if (ch === ')') { i++; let d = ''; while (/\d/.test(f[i] || '')) d += f[i++]; const top = st.pop(), k = +d || 1; for (const e in top) st[st.length - 1][e] = (st[st.length - 1][e] || 0) + top[e] * k; continue; }
    let e = ch; i++; while (/[a-z]/.test(f[i] || '')) e += f[i++];
    let d = ''; while (/\d/.test(f[i] || '')) d += f[i++];
    st[st.length - 1][e] = (st[st.length - 1][e] || 0) + (+d || 1);
  }
  return st[0];
};
const total = (f) => Object.values(count(f)).reduce((a, b) => a + b, 0);
const sub = (f) => f.replace(/(\d+)/g, '<sub>$1</sub>');

const EQ = [
  { l: ['Fe', 'O2'], r: ['Fe2O3'], c: [4, 3, 2] },
  { l: ['Al', 'O2'], r: ['Al2O3'], c: [4, 3, 2] },
  { l: ['H2', 'N2'], r: ['NH3'], c: [3, 1, 2] },
  { l: ['C3H8', 'O2'], r: ['CO2', 'H2O'], c: [1, 5, 3, 4] },
  { l: ['Na', 'H2O'], r: ['NaOH', 'H2'], c: [2, 2, 2, 1] },
  { l: ['Al', 'HCl'], r: ['AlCl3', 'H2'], c: [2, 6, 2, 3] },
  { l: ['Ca(OH)2', 'HCl'], r: ['CaCl2', 'H2O'], c: [1, 2, 1, 2] },
];

export default {
  'c10s-react-coeff': {
    title: 'balance an equation: sum of coefficients',
    make(r) {
      const e = choose(r, EQ), all = [...e.l, ...e.r];
      const eq = `${e.l.map(sub).join(' + ')} → ${e.r.map(sub).join(' + ')}`;
      return { all, nl: e.l.length, q: `<p>Balance the equation <b>${eq}</b> using the smallest whole-number coefficients. What is the <b>sum of all the coefficients</b> (including any 1s)?</p>`, answer: e.c.reduce((a, b) => a + b, 0), unit: '', abs: 0.01, tol: 0,
        hint: 'Count each kind of atom on both sides, then change the numbers in front of formulas, never the little numbers inside them. Start with the formula that has the most atoms.',
        solution: steps(`Balanced: ${e.c.map((c, i) => `${c > 1 ? c : ''}${sub(all[i])}${i === e.l.length - 1 ? ' → ' : i < all.length - 1 ? ' + ' : ''}`).join('')}.`, `Add the coefficients: ${e.c.join(' + ')} = <b>${e.c.reduce((a, b) => a + b, 0)}</b>.`) };
    },
    // different way: search every combination of coefficients 1-6 for the smallest balanced one
    verify: (x) => {
      const k = x.all.length, atoms = x.all.map(count), els = [...new Set(atoms.flatMap((a) => Object.keys(a)))];
      let best = null;
      const rec = (i, cs) => {
        if (i === k) { if (els.every((e) => cs.reduce((s, c, j) => s + (j < x.nl ? 1 : -1) * c * (atoms[j][e] || 0), 0) === 0)) { const sum = cs.reduce((a, b) => a + b, 0); if (best === null || sum < best) best = sum; } return; }
        for (let c = 1; c <= 6; c++) rec(i + 1, [...cs, c]);
      };
      rec(0, []); return best;
    },
  },
  'c10s-react-atoms': {
    title: 'count atoms in a formula',
    make(r) {
      const f = choose(r, ['Ca(OH)2', 'Al2(SO4)3', 'Mg(NO3)2', '(NH4)2SO4', 'Fe2(SO4)3', 'Ca3(PO4)2', 'Ba(OH)2']), k = pick(r, 2, 5);
      const per = f === 'Ca(OH)2' ? 5 : f === 'Al2(SO4)3' ? 17 : f === 'Mg(NO3)2' ? 9 : f === '(NH4)2SO4' ? 15 : f === 'Fe2(SO4)3' ? 17 : f === 'Ca3(PO4)2' ? 13 : 5;
      return { f, k, q: `<p>How many atoms are there altogether in ${k} formula units of <b>${sub(f)}</b>? (This is what the coefficient ${k} in front of the formula means.)</p>`, answer: k * per, unit: 'atoms', abs: 0.01, tol: 0,
        hint: 'Atoms outside a bracket are counted once; the number after a bracket multiplies everything inside it. Then multiply by the coefficient.',
        solution: steps(`One ${sub(f)} has <b>${per}</b> atoms (multiply what is inside each bracket by its subscript, then add).`, `${k} × ${per} = <b>${k * per}</b> atoms.`) };
    },
    verify: (x) => x.k * total(x.f),
  },
  'c10s-react-mass': {
    title: 'conservation of mass',
    make(r) {
      const a = pick(r, 12, 60, 4), b = pick(r, 8, Math.min(40, a - 4), 4), lost = pick(r, 1, 9);
      return { a, b, q: `<p>${a} g of a metal carbonate is heated in an open dish and decomposes into a solid oxide and carbon dioxide gas. The oxide left in the dish weighs ${b} g (the gas escaped). What mass of carbon dioxide was given off? (Take the carbonate to have decomposed fully.)</p>`, answer: a - b, unit: 'g', tol: 0.005,
        hint: 'Mass is conserved: the mass of what you started with equals the mass of everything formed, including the gas that escaped.',
        solution: steps('Mass of carbonate = mass of oxide + mass of CO₂.', `Mass of CO₂ = ${a} − ${b} = <b>${a - b} g</b>.`) };
    },
    verify: (x) => x.a - x.b,
  },
  'c10s-react-limestone': {
    title: 'quicklime from limestone',
    make(r) {
      const m = pick(r, 50, 500, 10);
      return { m, q: `<p>Limestone (CaCO₃) is heated: CaCO₃ → CaO + CO₂. How many kg of quicklime (CaO) can be made from ${m} kg of pure limestone? (Atomic masses: Ca = 40, C = 12, O = 16.)</p>`, answer: (m * 56) / 100, unit: 'kg', tol: 0.01,
        hint: 'Work out the formula masses: CaCO₃ = 100, CaO = 56, CO₂ = 44. The masses of the products add up to the mass of limestone.',
        solution: steps('CaCO₃ = 40 + 12 + 3 × 16 = 100; CaO = 40 + 16 = 56; CO₂ = 12 + 32 = 44.', `${m} kg of CaCO₃ gives ${m} × 56 ÷ 100 = <b>${n((m * 56) / 100)} kg</b> of CaO (and ${n((m * 44) / 100)} kg of CO₂).`) };
    },
    verify: (x) => x.m - (x.m * 44) / 100,
  },
  'c10s-react-copper': {
    title: 'copper deposited on an iron nail',
    make(r) {
      const m = pick(r, 2.8, 14, 1.4);
      return { m, q: `<p>An iron nail is placed in copper sulphate solution: Fe + CuSO₄ → FeSO₄ + Cu. If ${n(m)} g of iron goes into the solution, what mass of copper is deposited? (Atomic masses: Fe = 56, Cu = 64; one Cu atom is deposited for each Fe atom that dissolves.)</p>`, answer: (m * 64) / 56, unit: 'g', tol: 0.01,
        hint: 'One Fe atom is replaced by one Cu atom, so the masses are in the ratio of the atomic masses 64 : 56.',
        solution: steps('The equation shows 1 Fe for 1 Cu, so mass of Cu ÷ mass of Fe = 64 ÷ 56.', `Mass of Cu = ${n(m)} × 64 ÷ 56 = <b>${n((m * 64) / 56)} g</b>. The nail gains mass because each Cu atom is heavier than the Fe atom it replaced.`) };
    },
    verify: (x) => (x.m / 56) * 64,
  },
  'c10s-react-electrolysis': {
    title: 'gas volumes in electrolysis of water',
    make(r) {
      const v = pick(r, 4, 40, 2), which = choose(r, ['H', 'O']);
      const given = which === 'H' ? v : v / 2;
      return { v, which, q: `<p>In the electrolysis of water, ${n(given)} mL of ${which === 'H' ? 'hydrogen is collected at the cathode' : 'oxygen is collected at the anode'}. What volume of ${which === 'H' ? 'oxygen' : 'hydrogen'} is collected at the other electrode, in mL?</p>`, answer: which === 'H' ? v / 2 : v, unit: 'mL', tol: 0.01,
        hint: '2H₂O → 2H₂ + O₂: hydrogen and oxygen are produced in the volume ratio 2 : 1.',
        solution: steps('The equation gives 2 volumes of H₂ to 1 volume of O₂.', which === 'H' ? `O₂ = ${n(given)} ÷ 2 = <b>${n(v / 2)} mL</b>.` : `H₂ = ${n(given)} × 2 = <b>${n(v)} mL</b>.`) };
    },
    verify: (x) => (x.which === 'H' ? x.v / 2 : x.v),
  },
};
