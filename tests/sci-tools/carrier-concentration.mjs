// #862 Carrier concentration: Varshni gap, Nc/Nv, ni, F½ and the Fermi level from charge neutrality with
// partly ionised dopants. Reference numbers from Python: mpmath polylog for F½ (F½(η) = −Li₃⸝₂(−e^η)),
// scipy.integrate.quad for the same integral, scipy.optimize.brentq on the neutrality equation written
// independently, scipy.constants (CODATA 2022 masses, hence the 2e-9 tolerance on Nc).
import * as C from '../../src/lib/sci/carriers.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const etas = [-30, -5, -1.0001, -0.9999, 0, 1, 3, 5, 10, 20, 50, 100];
  const ref = [9.357622968839866e-14, 0.006721954314505913, 0.3277657576829967, 0.3278245632065682, 0.765147024625408, 1.5756407761513003, 4.487547421351709, 8.844208895242954, 24.084656964637652, 67.49151222165892, 266.0928125213626, 752.3455915521961];
  check('carriers: F½(η) matches mpmath polylog to 1e-13 from η = −30 to 100 (both sides of the series switch at −1)', etas.every((e, i) => rel(C.fermiHalf(e), ref[i], 1e-13)));
  check('carriers: F½ → e^η when non-degenerate, and (4/3√π) η^{3/2} when strongly degenerate', rel(C.fermiHalf(-12), Math.exp(-12), 1e-5) && rel(C.fermiHalf(400), (4 / (3 * Math.sqrt(Math.PI))) * 400 ** 1.5, 1e-5));
  check('carriers: Varshni Eg(300 K) = 1.17 − 5e-4·300²/950 = 1.122632 eV', Math.abs(C.varshni(300, 1.17, 5e-4, 650) - 1.1226315789473684) < 1e-15);
  check('carriers: Nc(m* = 1, 300 K) = 2.5094e19 cm⁻³ (SciPy constants)', rel(C.effDos(1, 300), 2.5094e19, 1e-4) && rel(C.effDos(1.1, 300) / C.effDos(1.1, 150), 2 ** 1.5, 1e-12));

  const m = C.PRESETS[0].m;
  const d = (Nd, Na) => ({ Nd, Ed: 0.045, gd: 2, Na, Ea: 0.045, ga: 4 });
  const cases = [
    [300, d(1e16, 0), 'fd', 0.9164731673786386, 9960917065569184 * (1 + 8.6e-12)],
    [50, d(1e16, 0), 'fd', 1.1327242378568998, NaN],
    [20, d(1e16, 1e14), 'fd', 1.131426410346868, NaN],
    [700, d(1e15, 0), 'fd', 0.4811924971132573, NaN],
    [300, d(1e20, 0), 'fd', 1.1074382081428358, NaN],
    [300, d(1e20, 0), 'boltzmann', 1.1051371657587068, NaN],
    [300, d(0, 1e17), 'fd', 0.13693452630219058, NaN],
    [300, d(0, 0), 'fd', 0.5551412901312153, NaN],
  ];
  for (const [T, dd, st, EF] of cases) {
    const s = C.solve(T, m, dd, st);
    check(`carriers: Fermi level ${T} K, ND ${dd.Nd}, NA ${dd.Na}, ${st} = ${EF.toFixed(6)} eV above Ev (SciPy brentq, to 1e-10 eV)`, Math.abs(s.EF - EF) < 1e-10);
  }
  const s300 = C.solve(300, m, d(1e16, 0));
  check('carriers: 300 K, 1e16 donors: n = 9.9609e15 (99.6 % ionised), p ≈ ni²/n (to the 1e-4 Fermi-Dirac correction), ni = 8.477e9 cm⁻³', rel(s300.n, 9960917065569184, 1e-8) && rel(s300.p, (s300.ni * s300.ni) / s300.n, 2e-4) && rel(s300.ni, 8477031113.09763, 1e-8));
  check('carriers: charge balance n + NA⁻ = p + ND⁺ holds to 1e-10 relative in a compensated case', (() => { const s = C.solve(80, m, d(3e16, 1e16)); return Math.abs(s.n + s.NaIon - s.p - s.NdIon) / s.n < 1e-10; })());
  check('carriers: undoped gives EF = Ei and n = p = ni', rel(C.solve(300, m, d(0, 0)).n, C.solve(300, m, d(0, 0)).ni, 1e-8) && Math.abs(C.solve(300, m, d(0, 0)).EF - C.solve(300, m, d(0, 0)).Ei) < 1e-9);
  check('carriers: Fermi-Dirac and Boltzmann agree when non-degenerate, part at 1e20', rel(C.solve(300, m, d(1e15, 0), 'boltzmann').n, C.solve(300, m, d(1e15, 0)).n, 1e-6) && Math.abs(C.solve(300, m, d(1e20, 0)).EF - C.solve(300, m, d(1e20, 0), 'boltzmann').EF) > 1e-3);
  check('carriers: intrinsic temperature for 1e15 cm⁻³ = 552.640 K (SciPy brentq)', Math.abs(C.intrinsicTemperature(m, d(1e15, 0)) - 552.6396115205043) < 1e-6);
  check('carriers: 90 % ionisation temperature for 1e16 donors = 132.0526 K (SciPy brentq)', Math.abs(C.freezeOutTemperature(m, d(1e16, 0)) - 132.05263920284577) < 1e-5);
  check('carriers: regimes at 30 K, 300 K, 900 K are freeze-out, extrinsic, intrinsic', ['freeze-out', 'extrinsic', 'intrinsic'].every((r, i) => C.regime(C.solve([30, 300, 900][i], m, d(1e16, 0)), d(1e16, 0)) === r));
  check('carriers: degenerate flag at 1e20 donors in a GaAs-like gap (low Nc), not at 1e15', C.solve(300, C.PRESETS[2].m, d(1e20, 0)).degenerate && !C.solve(300, C.PRESETS[2].m, d(1e15, 0)).degenerate);
  check('carriers: no NaN at 2 K or 2000 K', [2, 2000].every((T) => { const s = C.solve(T, m, d(1e17, 1e15)); return [s.EF, s.n, s.p, s.NdIon].every(Number.isFinite); }));
};
