// Live problems for Gases and liquids.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const GASES = [['H<sub>2</sub>', 2], ['He', 4], ['CH<sub>4</sub>', 16], ['N<sub>2</sub>', 28], ['O<sub>2</sub>', 32], ['CO<sub>2</sub>', 44], ['SO<sub>2</sub>', 64]];
const g = (r) => GASES[Math.floor(r() * GASES.length)];

export default {
  'sm-ideal-gas': {
    title: 'mass of gas in a cylinder (ideal gas equation)',
    make(r) {
      const [f, M] = g(r), V = pick(r, 2, 50, 0.5), tC = pick(r, -20, 150), P = pick(r, 0.5, 10, 0.5);
      const T = tC + 273, mol = (P * V) / (0.0821 * T), answer = mol * M;
      return { M, V, T, P,
        q: `<p>A ${V} L cylinder holds ${f} (molar mass ${M} g/mol) at ${tC} °C and ${P} atm. Treating it as an ideal gas, what mass of gas is inside? Use R = 0.0821 L atm K<sup>−1</sup> mol<sup>−1</sup>.</p>`,
        answer, unit: 'g', tol: 0.01,
        hint: 'PV = nRT gives the moles; temperature must be in kelvin. Then mass = moles × molar mass.',
        solution: steps(`T = ${tC} + 273 = ${T} K.`, `n = PV/RT = (${P} × ${V}) ÷ (0.0821 × ${T}) = ${n(mol, 4)} mol.`, `Mass = ${n(mol, 4)} × ${M} = <b>${n(answer, 4)} g</b>.`) };
    },
    verify: (x) => ((x.P * 101325) * (x.V * 1e-3)) / (8.314 * x.T) * x.M,
  },
  'sm-graham': {
    title: 'effusion time from Graham\'s law',
    make(r) {
      let a = g(r), b = g(r); if (a === b) b = GASES[(GASES.indexOf(a) + 3) % GASES.length];
      const t1 = pick(r, 10, 120, 5), answer = t1 * Math.sqrt(b[1] / a[1]);
      return { t1, M1: a[1], M2: b[1],
        q: `<p>A certain volume of ${a[0]} (M = ${a[1]}) leaks out through a pinhole in ${t1} s. Under the same conditions, how long does the same volume of ${b[0]} (M = ${b[1]}) take?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Rate of effusion ∝ 1/√M, and time for the same volume ∝ 1/rate, so time ∝ √M.',
        solution: steps(`t₂/t₁ = √(M₂/M₁) = √(${b[1]}/${a[1]}) = ${n(Math.sqrt(b[1] / a[1]), 4)}.`, `t₂ = ${t1} × ${n(Math.sqrt(b[1] / a[1]), 4)} = <b>${n(answer, 4)} s</b>.`, answer > t1 ? 'The heavier gas is slower, so it takes longer.' : 'The lighter gas is faster, so it takes less time.') };
    },
    verify: (x) => { const r1 = 1 / Math.sqrt(x.M1), r2 = 1 / Math.sqrt(x.M2); return x.t1 * r1 / r2; },
  },
  'sm-speeds': {
    title: 'molecular speeds from kinetic theory',
    make(r) {
      const [f, M] = g(r), T = pick(r, 200, 1200, 50), k = Math.floor(r() * 3);
      const names = ['root mean square', 'average', 'most probable'], fs = ['3RT/M', '8RT/(πM)', '2RT/M'], fac = [3, 8 / Math.PI, 2][k];
      const answer = Math.sqrt((fac * 8.314 * T) / (M / 1000));
      return { M, T, k,
        q: `<p>Find the ${names[k]} speed of ${f} molecules (M = ${M} g/mol) at ${T} K. Use R = 8.314 J K<sup>−1</sup> mol<sup>−1</sup>.</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: `Use u = √(${fs[k]}) with M in kg/mol, so that the answer comes out in m/s.`,
        solution: steps(`M = ${M} g/mol = ${M / 1000} kg/mol.`, `u = √(${fs[k]}) = √(${n(fac, 4)} × 8.314 × ${T} ÷ ${M / 1000}).`, `= <b>${n(answer, 4)} m/s</b>.`, 'Ratio of the three speeds: most probable : average : r.m.s. = 1 : 1.128 : 1.225.') };
    },
    verify: (x) => { const ump = Math.sqrt(2 * 8.314 * x.T / (x.M / 1000)); return ump * [Math.sqrt(1.5), Math.sqrt(4 / Math.PI), 1][x.k]; },
  },
};
