// #412 Amino acid racemisation age estimator. Ages checked against scipy: the reversible first-order reaction
// integrated with solve_ivp and the time found with brentq (calibrated k found the same way), Arrhenius with
// scipy.constants.R; GUM uncertainty by finite differences on that ODE model; Monte Carlo against numpy (400,000 draws).
import { calc, ratioAt, F, arrhenius, ageOf } from '../../src/lib/sci/racemisation.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const ex = { mode: 'cal', Kp: 1, r: { v: 0.35, u: 0.02 }, r0: { v: 0.02, u: 0.005 }, Ts: { v: 10, u: 1 }, Ea: { v: 120, u: 10 }, k: { v: 0, u: 0 }, Tk: { v: 0, u: 0 }, rCal: { v: 0.2, u: 0.01 }, tCal: { v: 8000, u: 200 }, Tcal: { v: 12, u: 1 } };
  const a = calc(ex);
  check('aar: calibrated age matches the scipy ODE solution', near(a.age, 21623.1334110, 1e-5));
  check('aar: GUM uncertainty matches finite differences on the ODE', near(a.ageU, 5850.0270037, 1e-4));
  check('aar: Monte Carlo median and intervals match numpy (within 1 %)', near(a.mc.median / 21576.5, 1, 0.01) && near(a.mc.lo68 / 16497.8, 1, 0.01) && near(a.mc.hi68 / 28319.6, 1, 0.01) && near(a.mc.lo95 / 12623.9, 1, 0.015) && near(a.mc.hi95 / 37573.2, 1, 0.015) && a.mc.n === 20000);
  check('aar: temperature dominates the budget', a.budget.find((b) => b.name === 'Ts').share > 0.4 && near(a.budget.reduce((s, b) => s + b.share, 0), 1, 1e-9));
  const ile = { mode: 'k', Kp: 0.77, r: { v: 0.6, u: 0.03 }, r0: { v: 0.015, u: 0.003 }, Ts: { v: 8, u: 1.5 }, Ea: { v: 125, u: 8 }, k: { v: 2e-6, u: 2e-7 }, Tk: { v: 15, u: 0 }, rCal: { v: 0, u: 0 }, tCal: { v: 0, u: 0 }, Tcal: { v: 0, u: 0 } };
  check("aar: known k, K' = 0.77, matches the scipy ODE", near(calc(ile, 0).age, 1101159.13283, 0.01));
  // Formulas.
  check('aar: ratio after t inverts the kinetic expression', near(ratioAt(1000, 1e-4, 1, 0.02), Math.tanh(Math.atanh(0.02) + 1e-4 * 1000), 1e-12) && near(F(ratioAt(5000, 3e-5, 0.77, 0.01), 0.77) - F(0.01, 0.77), 1.77 * 3e-5 * 5000, 1e-12));
  check('aar: at the same temperature the calibration sample dates itself', near(ageOf({ r: 0.2, r0: 0.02, Ts: 12, Ea: 120, rCal: 0.2, tCal: 8000, Tcal: 12 }, 'cal', 1), 8000, 1e-8));
  check('aar: Arrhenius', near(arrhenius(1, 25, 35, 100), Math.exp((100000 / 8.314462618) * (1 / 298.15 - 1 / 308.15)), 1e-12) && arrhenius(2, 10, 10, 90) === 2);
  check('aar: equilibrium is 1/K\'', Number.isNaN(F(1, 1)) && near(ratioAt(1e9, 1, 0.77, 0), 1 / 0.77, 1e-9));
  const err = (p) => { try { calc(p, 0); return ''; } catch (e) { return e.message; } };
  check('aar: refuses a ratio at or above equilibrium', err({ ...ex, r: { v: 1, u: 0 } }).includes('below the equilibrium'));
  check('aar: refuses a sample ratio below time zero', err({ ...ex, r: { v: 0.01, u: 0 } }).includes('above the D/L at time zero'));
  check('aar: refuses a zero calibration age and zero Ea', err({ ...ex, tCal: { v: 0, u: 0 } }).includes('calibration age') && err({ ...ex, Ea: { v: 0, u: 0 } }).includes('activation energy'));
  check('aar: refuses a negative uncertainty', err({ ...ex, Ts: { v: 10, u: -1 } }).includes('0 or more'));
};
