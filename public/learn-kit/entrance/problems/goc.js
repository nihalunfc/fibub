// Live problems for Organic chemistry basics (GOC) and isomerism.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sub = (k) => (k > 1 ? `<sub>${k}</sub>` : '');

export default {
  'goc-dbe': {
    title: 'degree of unsaturation from a formula',
    make(r) {
      const c = pick(r, 3, 12), dbe = pick(r, 0, Math.min(8, c)), nN = pick(r, 0, 2), x = pick(r, 0, 2), o = pick(r, 0, 3);
      const X = ['Cl', 'Br'][Math.floor(r() * 2)];
      const h = 2 * (c - dbe + 1) + nN - x;
      const f = `C${sub(c)}H${sub(h)}${nN ? 'N' + sub(nN) : ''}${o ? 'O' + sub(o) : ''}${x ? X + sub(x) : ''}`;
      const answer = c - (h + x) / 2 + nN / 2 + 1;
      return { c, h, nN, x,
        q: `<p>Find the degree of unsaturation (double bond equivalent, rings + π bonds) of a compound with molecular formula ${f}.</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'DBE = C − (H + X)/2 + N/2 + 1. Oxygen (and sulfur) do not change it; each halogen counts like a hydrogen.',
        solution: steps(`C = ${c}, H = ${h}, X = ${x}, N = ${nN}${o ? `, O = ${o} (ignored)` : ''}.`, `DBE = ${c} − (${h} + ${x})/2 + ${nN}/2 + 1.`, `= <b>${n(answer)}</b>.`, answer >= 4 && c >= 6 ? 'A DBE of 4 or more with 6 or more carbons often means a benzene ring (1 ring + 3 π bonds).' : 'Each ring or double bond counts 1; a triple bond counts 2.') };
    },
    verify: (x) => (2 * x.c + 2 + x.nN - x.h - x.x) / 2,
  },
  'goc-dumas': {
    title: 'percentage of nitrogen by the Dumas method',
    make(r) {
      const w = pick(r, 0.1, 0.5, 0.01), V = pick(r, 20, 80, 0.5), tC = pick(r, 15, 35), P = pick(r, 720, 780);
      const T = tC + 273, V0 = (V * P * 273) / (760 * T), answer = (28 * V0 * 100) / (22400 * w);
      return { w, V, T, P,
        q: `<p>${w} g of an organic compound gives ${V} mL of dry nitrogen collected at ${tC} °C and ${P} mm Hg in a Dumas experiment. Find the percentage of nitrogen in the compound.</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Convert the volume to STP (273 K, 760 mm Hg) with P₁V₁/T₁ = P₀V₀/T₀. 22 400 mL of N₂ at STP weighs 28 g.',
        solution: steps(`V at STP = ${V} × (${P}/760) × (273/${T}) = ${n(V0, 4)} mL.`, `Mass of N = 28 × ${n(V0, 4)} ÷ 22 400 = ${n((28 * V0) / 22400, 4)} g.`, `%N = ${n((28 * V0) / 22400, 4)} ÷ ${w} × 100 = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => { const mol = ((x.P / 760) * (x.V / 1000)) / (0.0821 * x.T); return (mol * 28 * 100) / x.w; },
  },
  'goc-carius': {
    title: 'percentage of halogen or sulfur by the Carius method',
    make(r) {
      const kinds = [['chlorine', 'AgCl', 143.5, 35.5], ['bromine', 'AgBr', 188, 80], ['sulfur', 'BaSO<sub>4</sub>', 233, 32]];
      const [el, ppt, Mp, A] = kinds[Math.floor(r() * 3)], w = pick(r, 0.1, 0.5, 0.01), m = +(w * pick(r, 0.3, 2.5, 0.05)).toFixed(3);
      const answer = (A / Mp) * (m / w) * 100;
      return { w, m, Mp, A,
        q: `<p>In a Carius estimation, ${w} g of an organic compound gives ${m} g of ${ppt}. Find the percentage of ${el} in the compound.</p>`,
        answer, unit: '%', tol: 0.005,
        hint: `All the ${el} ends up in the ${ppt}. Mass of ${el} = (${A}/${Mp}) × mass of precipitate.`,
        solution: steps(`Mass of ${el} = ${A} ÷ ${Mp} × ${m} = ${n((A / Mp) * m, 4)} g.`, `% ${el} = ${n((A / Mp) * m, 4)} ÷ ${w} × 100 = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => ((x.m / x.Mp) * x.A / x.w) * 100,
  },
};
