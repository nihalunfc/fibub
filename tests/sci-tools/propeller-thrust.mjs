// #669 propeller and rotor thrust. The BEM model is checked against an independent SciPy script that solves the
// axial and swirl momentum balances of every station for the induced velocities with fsolve (a different
// formulation from the tool's one-variable inflow-angle residual). Momentum theory is checked by its identities.
import { hoverPower, staticThrust, figureOfMerit, inducedVelocity, idealPower, idealEfficiency, bem, EXAMPLE_PROP, EXAMPLE_FOIL } from '../../src/lib/sci/eng-prop.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a / b - 1) < t;
  const A = Math.PI * 0.254 ** 2 / 4, rho = 1.225;
  const T = staticThrust(100, rho, A, 0.7);
  check('prop: thrust from power and power from thrust round trip', rel(hoverPower(T, rho, A, 0.7), 100, 1e-12));
  check('prop: ideal power = FM × shaft power', rel(idealPower(T, rho, A), 70, 1e-12) && rel(figureOfMerit(T, 100, rho, A), 0.7, 1e-12));
  check('prop: example 100 W, FM 0.7, 10 in: 8.4731 N', Math.abs(T - 8.473051) < 1e-5);
  check('prop: induced velocity v = √(T/2ρA)', rel(inducedVelocity(T, rho, A), Math.sqrt(T / (2 * rho * A)), 1e-12));
  { const V = 12, v = inducedVelocity(T, rho, A, V); check('prop: axial flight T = 2ρAv(V+v) and Froude efficiency', rel(2 * rho * A * v * (V + v), T, 1e-12) && rel(idealEfficiency(T, rho, A, V), V / (V + v), 1e-12)); }
  // SciPy fsolve BEM (scratch prop.py): thrust, torque, power.
  const py = [[0, 8.519531004888103, 0.11464156870473205], [5, 7.161792024042215, 0.11567932924303391], [10, 5.280397385410235, 0.10402171963243348], [15, 3.0089667925018158, 0.07490101680012677]];
  for (const [V, Tp, Qp] of py) { const r = bem({ ...EXAMPLE_PROP, V }); check(`prop: BEM 10×5 at 8000 rpm, ${V} m/s matches SciPy`, rel(r.T, Tp, 1e-9) && rel(r.Q, Qp, 1e-9) && r.failed === 0); }
  { const r = bem({ B: 3, D: 1.8, hubD: 0.25, chordRoot: 0.15, chordTip: 0.08, pitch: 1.4, rpm: 2400, V: 40, rho: 1.1, foil: EXAMPLE_FOIL }); check('prop: BEM 3-blade 1.8 m at 40 m/s matches SciPy (1433.61 N, 76104 W)', rel(r.T, 1433.6053615246392, 1e-9) && rel(r.P, 76104.39449627983, 1e-9) && Math.abs(r.eta - 0.75349) < 1e-4); }
  { const r = bem(EXAMPLE_PROP); check('prop: static FM from BEM 0.735, CT 0.0940, CP 0.0313', Math.abs(r.FM - 0.73485) < 1e-4 && Math.abs(r.CT - 0.093987) < 1e-5 && Math.abs(r.CP - 0.031285) < 1e-5 && r.stalled === 14); }
  { const a = bem(EXAMPLE_PROP), b = bem({ ...EXAMPLE_PROP, tipLoss: false }); check('prop: tip loss lowers thrust', b.T > a.T); }
  { const r = bem({ ...EXAMPLE_PROP, V: 10 }); check('prop: CP = 2π CQ and η = J CT / CP', rel(r.CP, 2 * Math.PI * r.CQ, 1e-12) && rel(r.eta, r.J * r.CT / r.CP, 1e-12)); }
};
