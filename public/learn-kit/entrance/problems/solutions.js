// Live problems for Solutions and colligative properties.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'sol-fp-molar-mass': {
    title: 'molar mass from freezing point depression',
    make(r) {
      const M = pick(r, 60, 300, 2), w2 = pick(r, 1, 10, 0.5), W1 = pick(r, 50, 250, 10), Kf = 1.86;
      const dT = +((Kf * w2 * 1000) / (M * W1)).toFixed(3);
      const answer = (Kf * w2 * 1000) / (dT * W1);
      return { w2, W1, dT, Kf,
        q: `<p>${w2} g of a non-electrolyte dissolved in ${W1} g of water lowers the freezing point by ${dT} K. K<sub>f</sub> of water is 1.86 K kg/mol. What is the molar mass of the solute?</p>`,
        answer, unit: 'g/mol', tol: 0.01,
        hint: 'ΔT_f = K_f × m, and molality m = (w₂/M) / (W₁/1000). Solve for M.',
        solution: steps(`Molality m = ΔT_f / K_f = ${dT} / 1.86 = ${n(dT / Kf, 4)} mol/kg.`, `Moles of solute = m × kg of water = ${n(dT / Kf, 4)} × ${W1 / 1000} = ${n((dT / Kf) * (W1 / 1000), 4)} mol.`, `M = ${w2} g / ${n((dT / Kf) * (W1 / 1000), 4)} mol = <b>${n(answer)} g/mol</b>.`) };
    },
    verify: (x) => x.w2 / ((x.dT / x.Kf) * (x.W1 / 1000)),
  },
  'sol-vant-hoff': {
    title: 'freezing point of a partly dissociated electrolyte',
    make(r) {
      const salts = [['KCl', 2], ['MgCl<sub>2</sub>', 3], ['K<sub>2</sub>SO<sub>4</sub>', 3], ['AlCl<sub>3</sub>', 4], ['K<sub>3</sub>[Fe(CN)<sub>6</sub>]', 4]];
      const [name, nu] = salts[Math.floor(r() * salts.length)];
      const m = pick(r, 0.05, 0.5, 0.05), a = pick(r, 50, 95, 5) / 100, Kf = 1.86;
      const i = 1 + a * (nu - 1), answer = i * Kf * m;
      return { m, a, nu, Kf,
        q: `<p>A ${m} mol/kg aqueous solution of ${name} is ${Math.round(a * 100)}% dissociated. By how many kelvin is the freezing point lowered? (K<sub>f</sub> = 1.86 K kg/mol)</p>`,
        answer, unit: 'K', tol: 0.01,
        hint: `One formula unit gives ${nu} ions. i = 1 + α(ν − 1), then ΔT_f = i K_f m.`,
        solution: steps(`ν = ${nu} ions per formula unit, α = ${a}.`, `i = 1 + ${a} × (${nu} − 1) = ${n(i, 4)}.`, `ΔT_f = ${n(i, 4)} × 1.86 × ${m} = <b>${n(answer)} K</b>.`) };
    },
    verify: (x) => {
      // count particles: undissociated (1 − α) plus ν α ions per formula unit
      const particles = (1 - x.a) + x.nu * x.a;
      return particles * x.m * x.Kf;
    },
  },
  'sol-vapour-y': {
    title: 'vapour composition over an ideal mixture',
    make(r) {
      const pA = pick(r, 60, 160, 5), pB = pick(r, 10, 55, 5), xA = pick(r, 0.1, 0.9, 0.05);
      const P = xA * pA + (1 - xA) * pB, answer = (xA * pA) / P;
      return { pA, pB, xA,
        q: `<p>Liquids A and B form an ideal solution. At 300 K their vapour pressures are p°<sub>A</sub> = ${pA} kPa and p°<sub>B</sub> = ${pB} kPa. For a liquid with x<sub>A</sub> = ${xA}, what is the mole fraction of A in the vapour, y<sub>A</sub>?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Raoult: p_A = x_A p°_A and p_B = x_B p°_B. Dalton: y_A = p_A / total pressure.',
        solution: steps(`p_A = ${xA} × ${pA} = ${n(xA * pA)} kPa; p_B = ${n(1 - xA, 2)} × ${pB} = ${n((1 - xA) * pB)} kPa.`, `Total = ${n(P, 4)} kPa.`, `y_A = ${n(xA * pA)} / ${n(P, 4)} = <b>${n(answer)}</b>. It is larger than x_A because A is the more volatile liquid.`) };
    },
    verify: (x) => 1 - ((1 - x.xA) * x.pB) / (x.xA * x.pA + (1 - x.xA) * x.pB),
  },
};
