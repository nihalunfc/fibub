// Live problems for Hydrocarbons.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const HC = [['CH<sub>4</sub>', 1, 4], ['C<sub>2</sub>H<sub>6</sub>', 2, 6], ['C<sub>2</sub>H<sub>4</sub>', 2, 4], ['C<sub>2</sub>H<sub>2</sub>', 2, 2], ['C<sub>3</sub>H<sub>8</sub>', 3, 8], ['C<sub>3</sub>H<sub>6</sub>', 3, 6], ['C<sub>4</sub>H<sub>10</sub>', 4, 10]];
// alkane, [product name, H count, H type (0 = 1°, 1 = 2°, 2 = 3°)] for every monohalo product
const ALK = [
  ['propane', [['1-halopropane', 6, 0], ['2-halopropane', 2, 1]]],
  ['butane', [['1-halobutane', 6, 0], ['2-halobutane', 4, 1]]],
  ['2-methylpropane', [['1-halo-2-methylpropane', 9, 0], ['2-halo-2-methylpropane', 1, 2]]],
  ['2-methylbutane', [['1-halo-2-methylbutane', 6, 0], ['2-halo-2-methylbutane', 1, 2], ['2-halo-3-methylbutane', 2, 1], ['1-halo-3-methylbutane', 3, 0]]],
];
const HYD = [['ethene', 28, 1], ['ethyne', 26, 2], ['propyne', 40, 2], ['buta-1,3-diene', 54, 2], ['cyclohexene', 82, 1], ['hex-1-ene', 84, 1], ['pent-1-yne', 68, 2], ['hexa-1,3,5-triene', 80, 3]];

export default {
  'hc-combustion': {
    title: 'oxygen needed and volume change on burning a hydrocarbon',
    make(r) {
      const [f, x, y] = HC[Math.floor(r() * HC.length)], V = pick(r, 10, 60, 5), ask = r() < 0.5 ? 'o2' : 'drop';
      const o2 = V * (x + y / 4), answer = ask === 'o2' ? o2 : V * (1 + y / 4);
      return { x, y, V, ask,
        q: ask === 'o2'
          ? `<p>${V} mL of ${f} is burnt completely. What volume of O<sub>2</sub> (same temperature and pressure) is needed?</p>`
          : `<p>${V} mL of ${f} is exploded with excess O<sub>2</sub> and the mixture is cooled to room temperature, so the water condenses. By how many mL does the gas volume shrink?</p>`,
        answer, unit: 'mL', tol: 0.001,
        hint: 'C<sub>x</sub>H<sub>y</sub> + (x + y/4) O<sub>2</sub> → x CO<sub>2</sub> + (y/2) H<sub>2</sub>O. At the same T and P, volumes are in the mole ratio; liquid water takes no gas volume.',
        solution: ask === 'o2'
          ? steps(`Here x = ${x}, y = ${y}: O<sub>2</sub> per volume = ${x} + ${y}/4 = ${x + y / 4}.`, `O<sub>2</sub> needed = ${V} × ${x + y / 4} = <b>${n(o2, 4)} mL</b>.`)
          : steps(`Before: ${V} + ${n(o2, 4)} (O<sub>2</sub> used) mL of gas that takes part. After: ${V * x} mL CO<sub>2</sub> (water is liquid).`, `Shrinkage = ${V} + ${n(o2, 4)} − ${V * x} = V(1 + y/4) = <b>${n(answer, 4)} mL</b>.`, 'Passing the gas through KOH would then remove the CO<sub>2</sub> as a further shrinkage of xV.') };
    },
    verify: (x) => { const o2 = x.V * (2 * x.x + x.y / 2) / 2; return x.ask === 'o2' ? o2 : x.V + o2 - x.V * x.x; },
  },
  'hc-halo-ratio': {
    title: 'share of a product in free radical halogenation',
    make(r) {
      const [alk, prods] = ALK[Math.floor(r() * ALK.length)], br = r() < 0.35, rel = br ? [1, 82, 1600] : [1, 3.8, 5];
      const k = Math.floor(r() * prods.length), [name, nH, t] = prods[k];
      const w = prods.map(([, c, tt]) => c * rel[tt]), tot = w.reduce((a, b) => a + b, 0), answer = (100 * w[k]) / tot;
      const X = br ? 'bromo' : 'chloro', nm = name.replace('halo', X);
      return { k, br, ai: ALK.findIndex((a) => a[0] === alk),
        q: `<p>${alk[0].toUpperCase() + alk.slice(1)} is ${br ? 'brominated' : 'chlorinated'} in light (monosubstitution only). The relative reactivity per H of 1° : 2° : 3° hydrogens is ${rel.join(' : ')}. What percentage of the monohalo product is ${nm}?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'For each product, multiply the number of hydrogens that lead to it by their reactivity per H. Its share = its number ÷ the total.',
        solution: steps(prods.map(([p, c, tt], i) => `${p.replace('halo', X)}: ${c} H × ${rel[tt]} = ${n(w[i], 4)}`).join('; ') + '.', `Total = ${n(tot, 4)}.`, `Share of ${nm} = ${n(w[k], 4)} ÷ ${n(tot, 4)} × 100 = <b>${n(answer, 4)}%</b>.`, br ? 'Bromination is far more selective: it strongly prefers the most substituted carbon.' : 'Chlorination is fast and not very selective, so the many primary H still win a big share.') };
    },
    verify: (x) => { const rel = x.br ? [1, 82, 1600] : [1, 3.8, 5], P = ALK[x.ai][1]; let s = 0; for (const [, c, t] of P) s += c * rel[t]; return P[x.k][1] * rel[P[x.k][2]] / s * 100; },
  },
  'hc-hydrogenation': {
    title: 'number of π bonds from hydrogen uptake',
    make(r) {
      const [, M, pi] = HYD[Math.floor(r() * HYD.length)], m = pick(r, 0.5, 10, 0.1);
      const V = +((m / M) * pi * 22.4).toFixed(3), answer = (V / 22.4) / (m / M);
      return { M, m, V,
        q: `<p>${m} g of an open-chain unsaturated hydrocarbon (molar mass ${M} g/mol) takes up ${V} L of H<sub>2</sub> at STP for complete hydrogenation over a nickel catalyst. How many π bonds does each molecule contain? (Give the number your data give; it should be close to a whole number.)</p>`,
        answer, unit: '', tol: 0, abs: 0.05,
        hint: 'Each π bond (one in a C=C, two in a C≡C) takes one H<sub>2</sub>. Compare moles of H<sub>2</sub> with moles of hydrocarbon.',
        solution: steps(`Moles of hydrocarbon = ${m} ÷ ${M} = ${n(m / M, 4)}.`, `Moles of H<sub>2</sub> = ${V} ÷ 22.4 = ${n(V / 22.4, 4)}.`, `π bonds per molecule = ${n(V / 22.4, 4)} ÷ ${n(m / M, 4)} = <b>${n(answer, 3)}</b>, so ${Math.round(answer)}.`) };
    },
    verify: (x) => (x.V * x.M) / (22.4 * x.m),
  },
};
