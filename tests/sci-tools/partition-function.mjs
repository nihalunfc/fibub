// #919 partition function explorer: checked against an independent NumPy script (direct sums, heat capacity by a
// numerical derivative of U) and against the Schottky and Einstein closed forms.
import * as PF from '../../src/lib/sci/phpartition.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const cm = PF.UNIT.cm.j, toJ = (ls) => ls.map((l) => ({ E: l.E * cm, g: l.g }));
  check('partition: cm⁻¹ and kJ/mol in joules (CODATA exact constants)', near(cm, 1.9864458571489285e-23, 1e-14) && near(PF.UNIT.kJmol.j, 1.6605390671738467e-21, 1e-14));
  const cases = [
    ['rigid rotor B 10 cm⁻¹, 41 levels, 300 K', toJ(PF.presets.rotor(10, 41)), 300, [21.187604193776515, 4.0755164686738135e-21, 5.574201654642416e-23, -1.2647088495253434e-20, 1.3807222427268764e-23]],
    ['oscillator 1000 cm⁻¹, 40 levels, 1000 K', toJ(PF.presets.oscillator(1000, 40)), 1000, [0.6385177572630566, 1.6109879047902526e-20, 9.916207653031265e-24, 6.19367139487126e-21, 1.1652418614616849e-23]],
    ['two level 100 cm⁻¹, g 1 and 3, 150 K', toJ(PF.presets.twoLevel(100, 1, 3)), 150, [2.149615689713143, 1.0623523707388013e-21, 1.7648305129611506e-23, -1.5848933987029244e-21, 3.160233191947242e-24]],
  ];
  for (const [name, ls, T, w] of cases) {
    const t = PF.thermo(ls, T);
    check(`partition: ${name}: Z, U, S, F match NumPy`, near(t.Z, w[0], 1e-12) && near(t.U, w[1], 1e-11) && near(t.S, w[2], 1e-11) && near(t.F, w[3], 1e-11));
    check(`partition: ${name}: heat capacity matches the numerical derivative`, near(t.Cv, w[4], 1e-5));
  }
  { const x = 2.3, t = PF.thermo([{ E: 0, g: 1 }, { E: x * PF.KB * 100, g: 1 }], 100); check('partition: Schottky heat capacity', near(t.Cv / PF.KB, PF.exact.schottky(x), 1e-12)); }
  { const t = PF.thermo(toJ(PF.presets.oscillator(1000, 200)), 1000), x = 1000 * cm / (PF.KB * 1000); check('partition: Einstein heat capacity (200 levels)', near(t.Cv / PF.KB, PF.exact.einstein(x), 1e-10) && near(PF.exact.einstein(x), 0.8439813667639439, 1e-12)); }
  { const t = PF.thermo(toJ(PF.presets.rotor(1, 400)), 3000); check('partition: rotor at high temperature: Cv → kB and Z → kT/B', near(t.Cv / PF.KB, 1, 2e-3) && near(t.Z, PF.KB * 3000 / cm, 2e-3)); }
  { const t = PF.thermo([{ E: 0, g: 2 }, { E: 1e-20, g: 1 }], 1e-3); check('partition: low temperature: all in the ground level, S = kB ln g0', near(t.p[0], 1, 1e-12) && near(t.S, PF.KB * Math.log(2), 1e-9) && t.Cv < 1e-30); }
  { const t = PF.thermo([{ E: 5e-19, g: 1 }, { E: 5.01e-19, g: 1 }], 1); check('partition: huge energies do not overflow', Number.isFinite(t.lnZ) && near(t.p[0], 1, 1e-9)); }
  { const r = PF.parseLevels('energy, g\n0, 1\n100, 3\n', 1); check('partition: reads a header and energy, degeneracy lines', !r.error && r.levels.length === 2 && r.levels[1].g === 3 && r.skipped === 1); }
  check('partition: bad lines give messages', !!PF.parseLevels('0 1\nabc', 1).error && !!PF.parseLevels('0 -2', 1).error && !!PF.parseLevels('', 1).error);
};
