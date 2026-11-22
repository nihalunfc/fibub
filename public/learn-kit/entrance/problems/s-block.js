// Live problems for s-block elements and hydrogen.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
// [name, formula, molar mass, mol CO2 per mol on heating, equation]
const CARB = [
  ['calcium carbonate', 'CaCO<sub>3</sub>', 100, 1, 'CaCO<sub>3</sub> → CaO + CO<sub>2</sub>'],
  ['magnesium carbonate', 'MgCO<sub>3</sub>', 84, 1, 'MgCO<sub>3</sub> → MgO + CO<sub>2</sub>'],
  ['lithium carbonate', 'Li<sub>2</sub>CO<sub>3</sub>', 74, 1, 'Li<sub>2</sub>CO<sub>3</sub> → Li<sub>2</sub>O + CO<sub>2</sub>'],
  ['barium carbonate', 'BaCO<sub>3</sub>', 197, 1, 'BaCO<sub>3</sub> → BaO + CO<sub>2</sub> (needs strong heating)'],
  ['sodium hydrogencarbonate', 'NaHCO<sub>3</sub>', 84, 0.5, '2NaHCO<sub>3</sub> → Na<sub>2</sub>CO<sub>3</sub> + H<sub>2</sub>O + CO<sub>2</sub>'],
];
// [formula, molar mass, OH⁻ per formula unit]
const BASES = [['NaOH', 40, 1], ['KOH', 56, 1], ['Ca(OH)<sub>2</sub>', 74, 2], ['Ba(OH)<sub>2</sub>', 171, 2]];

export default {
  'sb-carbonate-co2': {
    title: 'volume of CO2 from heating a carbonate',
    make(r) {
      const [name, f, M, k, eq] = CARB[Math.floor(r() * CARB.length)], m = pick(r, 1, 50, 0.5);
      const mol = (m / M) * k, answer = mol * 22.4;
      return { m, M, k,
        q: `<p>${m} g of ${name}, ${f} (M = ${M} g/mol), is heated until it decomposes completely: ${eq}. What volume of CO<sub>2</sub> is given off, measured at STP (22.4 L/mol)?</p>`,
        answer, unit: 'L', tol: 0.005,
        hint: `Moles of ${f} = mass ÷ molar mass; then use the equation's ratio (${k === 1 ? '1 mol CO<sub>2</sub> per mol' : '1 mol CO<sub>2</sub> per 2 mol'}).`,
        solution: steps(`Moles of ${f} = ${m} ÷ ${M} = ${n(m / M, 4)} mol.`, `Moles of CO<sub>2</sub> = ${n(m / M, 4)} × ${k} = ${n(mol, 4)} mol.`, `Volume = ${n(mol, 4)} × 22.4 = <b>${n(answer, 4)} L</b>.`, 'Na<sub>2</sub>CO<sub>3</sub> and K<sub>2</sub>CO<sub>3</sub> would give nothing: group 1 carbonates (except Li) do not decompose on ordinary heating.') };
    },
    verify: (x) => { const massCO2 = x.m * (44 * x.k) / x.M; return (massCO2 / 44) * 22.4; },
  },
  'sb-hydroxide-ph': {
    title: 'pH of an alkali or alkaline earth hydroxide solution',
    make(r) {
      const [f, M, k] = BASES[Math.floor(r() * BASES.length)], m = pick(r, 0.02, 1, 0.01), V = pick(r, 250, 2000, 250);
      const oh = ((m / M) * k) / (V / 1000), answer = 14 + Math.log10(oh);
      return { m, M, k, V,
        q: `<p>${m} g of ${f} (M = ${M} g/mol) is dissolved in water to make ${V} mL of solution at 25 °C. Assuming it is fully dissolved and fully ionised, find the pH.</p>`,
        answer, unit: '', tol: 0, abs: 0.02,
        hint: `Each ${f} gives ${k} OH⁻. [OH⁻] = moles of OH⁻ ÷ volume in litres; pOH = −log[OH⁻]; pH = 14 − pOH.`,
        solution: steps(`Moles of ${f} = ${m} ÷ ${M} = ${n(m / M, 4)}; OH⁻ = ${n((m / M) * k, 4)} mol.`, `[OH⁻] = ${n((m / M) * k, 4)} ÷ ${V / 1000} = ${n(oh, 4)} M; pOH = ${n(-Math.log10(oh), 4)}.`, `pH = 14 − ${n(-Math.log10(oh), 4)} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { const oh = (x.m * x.k * 1000) / (x.M * x.V); return -Math.log10(1e-14 / oh); },
  },
  'sb-h2o2-volume': {
    title: 'volume strength of hydrogen peroxide',
    make(r) {
      const pct = pick(r, 1, 12, 0.5), gL = pct * 10, answer = (gL * 22.4) / 68;
      return { gL,
        q: `<p>A hydrogen peroxide solution contains ${pct}% H<sub>2</sub>O<sub>2</sub> (w/v, grams per 100 mL). What is its volume strength, the volume of O<sub>2</sub> at STP given by 1 volume of the solution? (2H<sub>2</sub>O<sub>2</sub> → 2H<sub>2</sub>O + O<sub>2</sub>)</p>`,
        answer, unit: 'volume', tol: 0.005,
        hint: '68 g of H<sub>2</sub>O<sub>2</sub> (2 mol) gives 22.4 L of O<sub>2</sub> at STP. Work out the grams in 1 L first.',
        solution: steps(`${pct}% w/v = ${gL} g per litre.`, `O<sub>2</sub> from 1 L = ${gL} × 22.4 ÷ 68 = ${n(answer, 4)} L.`, `So 1 L gives ${n(answer, 4)} L of O<sub>2</sub>: <b>${n(answer, 3)} volume</b>. (Shortcut: volume strength = 11.2 × molarity.)`) };
    },
    verify: (x) => 11.2 * (x.gL / 34),
  },
};
