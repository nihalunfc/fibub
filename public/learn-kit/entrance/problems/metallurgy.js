// Live problems for Metals and metallurgy.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const F = 96500;

export default {
  'met-hall-heroult': {
    title: 'aluminium from the Hall-Héroult cell',
    make(r) {
      const kA = pick(r, 10, 200, 10), hr = pick(r, 1, 24, 1), eff = pick(r, 80, 98, 2);
      const Q = kA * 1000 * hr * 3600 * (eff / 100), answer = (Q / F / 3) * 27 / 1000;
      return { kA, hr, eff,
        q: `<p>A Hall-Héroult cell runs at ${kA} kA for ${hr} hours with ${eff}% current efficiency. How many kg of aluminium does it produce? (Al = 27 g/mol, F = 96 500 C/mol)</p>`,
        answer, unit: 'kg', tol: 0.005,
        hint: 'Useful charge = I × t × efficiency. Al³⁺ + 3e⁻ → Al, so moles of Al = (charge/F)/3.',
        solution: steps(`Charge = ${kA}×10³ A × ${hr * 3600} s × ${eff / 100} = ${n(Q, 4)} C.`, `Moles of e⁻ = ${n(Q, 4)}/96 500 = ${n(Q / F, 4)}; moles of Al = ${n(Q / F / 3, 4)}.`, `Mass = ${n(Q / F / 3, 4)} × 27 g = <b>${n(answer)} kg</b>.`) };
    },
    // equivalent mass of Al = 27/3 = 9 g per faraday
    verify: (x) => (9 * x.kA * 1000 * x.hr * 3600 * x.eff) / (100 * F * 1000),
  },
  'met-ellingham-cross': {
    title: 'temperature above which carbon reduces an oxide',
    make(r) {
      const ox = [['ZnO', 'Zn', -696, -0.201], ['FeO', 'Fe', -528, -0.129], ['MnO', 'Mn', -770, -0.150], ['NiO', 'Ni', -480, -0.180]][Math.floor(r() * 4)];
      const [name, metal] = ox, dH = ox[2] + pick(r, -10, 10, 2), dS = +(ox[3] + pick(r, -0.01, 0.01, 0.002)).toFixed(3);
      const answer = (dH - -221) / (dS - 0.179);
      return { dH, dS,
        q: `<p>Per mole of O₂, for 2${metal} + O₂ → 2${name}: ΔH° = ${dH} kJ and ΔS° = ${Math.round(dS * 1000)} J/K. For 2C + O₂ → 2CO: ΔH° = −221 kJ and ΔS° = +179 J/K. Treating both as constant, above what temperature can carbon reduce ${name} to ${metal}?</p>`,
        answer, unit: 'K', tol: 0.005,
        hint: 'Carbon reduces the oxide when its line lies below the oxide line: ΔG°(C → CO) < ΔG°(oxide). Set the two ΔG° = ΔH° − TΔS° equal and solve for T.',
        solution: steps(`ΔG°(oxide) = ${dH} − T(${dS}); ΔG°(CO) = −221 − T(0.179) (kJ, with ΔS in kJ/K).`, `Equal when ${dH} + 221 = T(${dS} − 0.179), so T = ${n(dH + 221, 4)}/${n(dS - 0.179, 4)}.`, `T = <b>${n(answer, 4)} K</b>. Above it, the overall ΔG° of 2${name} + 2C → 2${metal} + 2CO is negative.`) };
    },
    // overall reaction MO + C → M + CO has ΔH = (−221 − ΔH_ox)/2 and ΔS = (0.179 − ΔS_ox)/2; T = ΔH/ΔS
    verify: (x) => ((-221 - x.dH) / 2) / ((0.179 - x.dS) / 2),
  },
  'met-ore-iron': {
    title: 'iron from haematite ore',
    make(r) {
      const t = pick(r, 1, 50, 1), pc = pick(r, 50, 95, 5), y = pick(r, 80, 98, 2);
      const answer = t * (pc / 100) * (112 / 160) * (y / 100);
      return { t, pc, y,
        q: `<p>A blast furnace is fed ${t} tonnes of haematite ore containing ${pc}% Fe₂O₃ by mass. If ${y}% of the iron is recovered, how many tonnes of iron are produced? (Fe 56, O 16)</p>`,
        answer, unit: 'tonnes', tol: 0.005,
        hint: 'Fe₂O₃ (160 g/mol) contains 2 × 56 = 112 g of iron per 160 g. Find the mass of Fe₂O₃, then the iron in it, then apply the recovery.',
        solution: steps(`Fe₂O₃ = ${t} × ${pc / 100} = ${n(t * pc / 100, 4)} t.`, `Iron in it = ${n(t * pc / 100, 4)} × 112/160 = ${n((t * pc / 100) * 0.7, 4)} t.`, `Recovered = × ${y / 100} = <b>${n(answer)} t</b>.`) };
    },
    // mole route: moles of Fe₂O₃ × 2 × 56
    verify: (x) => ((x.t * 1e6 * x.pc) / 100 / 160) * 2 * 56 * (x.y / 100) / 1e6,
  },
};
