// Live problems for Kinetic theory of gases.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const R = 8.314, K = 1.380649e-23, NA = 6.02214076e23;
const GASES = [['hydrogen (H₂)', 2], ['helium', 4], ['nitrogen (N₂)', 28], ['oxygen (O₂)', 32], ['carbon dioxide', 44]];

export default {
  'kt-rms-speed': {
    title: 'rms speed of gas molecules',
    make(r) {
      const i = Math.floor(r() * GASES.length), [name, M] = GASES[i], T = pick(r, 200, 900, 50);
      const answer = Math.sqrt((3 * R * T) / (M / 1000));
      return { i, T,
        q: `<p>What is the root-mean-square speed of ${name} molecules (molar mass ${M} g/mol) at ${T} K? (R = 8.314 J/mol K)</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: 'v_rms = √(3RT/M), with M in kg/mol (divide g/mol by 1000).',
        solution: steps(`M = ${M} g/mol = ${M / 1000} kg/mol.`, `v_rms = √(3 × 8.314 × ${T} / ${M / 1000}) = √${n((3 * R * T) / (M / 1000), 4)}.`, `v_rms = <b>${n(answer)} m/s</b>.`) };
    },
    verify: (x) => { // from ½ m v² = (3/2) k T for one molecule
      const m = GASES[x.i][1] / 1000 / NA; return Math.sqrt((3 * K * x.T) / m);
    },
  },
  'kt-mean-free-path': {
    title: 'mean free path of a gas molecule',
    make(r) {
      const T = pick(r, 250, 500, 50), Pk = pick(r, 10, 200, 10), dpm = pick(r, 200, 400, 20); // kPa, picometres
      const P = Pk * 1000, d = dpm * 1e-12, answer = ((K * T) / (Math.SQRT2 * Math.PI * d * d * P)) * 1e9;
      return { T, Pk, dpm,
        q: `<p>Molecules of a gas have diameter ${dpm} pm. The gas is at ${T} K and ${Pk} kPa. What is the mean free path, in nanometres? (k = 1.38 × 10⁻²³ J/K)</p>`,
        answer, unit: 'nm', tol: 0.01,
        hint: 'λ = kT/(√2 π d² P). Convert pm to m (× 10⁻¹²) and kPa to Pa.',
        solution: steps(`d = ${dpm} × 10⁻¹² m, P = ${P} Pa.`, `λ = 1.38 × 10⁻²³ × ${T} / (1.414 × π × (${dpm} × 10⁻¹²)² × ${P}).`, `λ = ${n(answer * 1e-9)} m = <b>${n(answer)} nm</b>.`) };
    },
    verify: (x) => { // λ = 1/(√2 n π d²) with number density n = P/kT
      const nd = (x.Pk * 1000) / (K * x.T), d = x.dpm * 1e-12; return (1 / (Math.SQRT2 * nd * Math.PI * d * d)) * 1e9;
    },
  },
  'kt-mixture-energy': {
    title: 'internal energy of a gas mixture',
    make(r) {
      const n1 = pick(r, 1, 4), n2 = pick(r, 1, 4), T = pick(r, 250, 500, 50);
      const answer = (n1 * 1.5 + n2 * 2.5) * R * T / 1000;
      return { n1, n2, T,
        q: `<p>A container holds ${n1} mol of helium and ${n2} mol of nitrogen at ${T} K. Treating both as ideal gases (nitrogen with 5 degrees of freedom at this temperature), what is the total internal energy, in kJ?</p>`,
        answer, unit: 'kJ', tol: 0.01,
        hint: 'Each degree of freedom carries ½RT per mole. Helium (monatomic) has 3, nitrogen (diatomic) has 5.',
        solution: steps(`Helium: ${n1} × (3/2)RT = ${n(n1 * 1.5 * R * T, 4)} J.`, `Nitrogen: ${n2} × (5/2)RT = ${n(n2 * 2.5 * R * T, 4)} J.`, `U = <b>${n(answer)} kJ</b>.`) };
    },
    verify: (x) => { // count molecules and degrees of freedom, ½kT each
      const N1 = x.n1 * NA, N2 = x.n2 * NA; return ((N1 * 3 + N2 * 5) * 0.5 * K * x.T) / 1000;
    },
  },
};
