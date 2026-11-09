// #834 Energy balance climate model. Checked 2026-11-09 against SciPy: 300 random planets (with and without the
// ice-albedo step): every equilibrium against brentq on a fine scan (within 1e-10 K, same count and stability);
// 60 runs of the radiative and linear models (step and 1 %/yr ramp) against solve_ivp DOP853 at rtol 1e-11 (within
// 2e-5 K); 100 equilibrium curves: the snowball and melt-back turning points against minimize_scalar (1.6e-8 W/m²);
// the one-layer model against fsolve on the surface and atmosphere balances (2e-13 K).
import { co2Forcing, heatCap, albedo, net, eqTemp, equilibria, feedbackAt, runRadiative, runLinear, linearStep, efold, sEq, hysteresis, oneLayer, SIGMA } from '../../src/lib/sci/ebm.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('ebm: CO₂ doubling forcing 5.35 ln 2 = 3.708 W/m²', near(co2Forcing(560, 280), 3.708337415995707, 1e-12) && co2Forcing(280, 280) === 0 && co2Forcing(140, 280) < 0);
  const p = { S: 1361, alpha: 0.3, eps: 0.612, F: 0, ice: { on: false, ai: 0.6, Tm: 265, w: 10 } };
  check('ebm: equilibrium 287.83 K from S, α, ε (closed form)', near(eqTemp(p), 287.82814170764755, 1e-12) && near(eqTemp({ ...p, eps: 1 }), 254.5781401165717, 1e-12));
  check('ebm: net flux is zero at equilibrium', Math.abs(net(p, eqTemp(p))) < 1e-9);
  const e = equilibria(p);
  check('ebm: scan finds the one stable equilibrium without ice', e.length === 1 && e[0].stable && near(e[0].T, eqTemp(p), 1e-10));
  check('ebm: Planck feedback 4εσT³ = 3.31 W/m²/K without ice', near(feedbackAt(p, eqTemp(p)), 4 * 0.612 * SIGMA * eqTemp(p) ** 3, 1e-6));
  const pi = { ...p, ice: { ...p.ice, on: true } };
  check('ebm: smooth ice albedo: ice value when cold, ice-free when warm, halfway at Tm', near(albedo(pi, 100), 0.6, 1e-6) && near(albedo(pi, 400), 0.3, 1e-6) && near(albedo(pi, 265), 0.45));
  const lowS = { ...pi, S: 1250 }, three = equilibria(lowS);
  check('ebm: three equilibria (cold stable, middle unstable, warm stable) at S 1250', three.length === 3 && three[0].stable && !three[1].stable && three[2].stable && three[0].T < 265 && three[2].T > 275);
  const h = hysteresis({ ...pi, F: 0 });
  check('ebm: two turning points (scipy: melt S 1347.39, freeze S 1185.96 W/m²)', h.tips.length === 2 && h.tips[0].kind === 'melt' && near(h.tips[0].S, 1347.3911261887538, 1e-8) && h.tips[1].kind === 'freeze' && near(h.tips[1].S, 1185.9646676503116, 1e-8));
  check('ebm: equilibrium curve S_eq(T) puts the equilibria back', three.every((x) => near(sEq(lowS, x.T), 1250, 1e-8)));
  check('ebm: no ice, no turning points', hysteresis(p).tips.length === 0);
  const C = heatCap(100);
  check('ebm: heat capacity of 100 m of water 418 MJ/m²/K; e-folding 11.04 yr at λ 1.2', near(C, 4.18e8) && near(efold(1.2, C), 11.038017255220085, 1e-12));
  const sc = { years: 100, kind: 'step', Ffinal: 3.7, rampYears: 0 };
  const L = runLinear(1.2, C, sc, 100);
  check('ebm: RK4 linear run matches the exact step response', L.t.length === 101 && L.t.every((t, i) => Math.abs(L.T[i] - linearStep(3.7, 1.2, C, t)) < 1e-8));
  const R = runRadiative(p, C, eqTemp(p), { ...sc, Ffinal: co2Forcing(560, 280) }, 100);
  check('ebm: radiative run settles at the new equilibrium', Math.abs(R.T[R.T.length - 1] - eqTemp({ ...p, F: co2Forcing(560, 280) })) < 1e-6 && near(R.t[100], 100) && R.t.length === 101);
  const ramp = runLinear(1.2, C, { years: 200, kind: 'ramp', Ffinal: 3.7, rampYears: 70 }, 200);
  check('ebm: ramp forcing grows to F and holds; runs share sample times', near(ramp.F[35], 3.7 * 70 / 70 * 0.5, 1e-9) && ramp.F[200] === 3.7 && ramp.t[35] === L.t[0] + 35 && ramp.T[200] < 3.7 / 1.2 && ramp.T[200] > 3.0);
  const R2 = runRadiative(lowS, C, 230, { years: 300, kind: 'step', Ffinal: 0, rampYears: 0 }, 50);
  check('ebm: a cold start at S 1250 stays on the frozen branch', Math.abs(R2.T[50] - three[0].T) < 1e-4);
  const o = oneLayer(1361, 0.3, 0.78);
  check('ebm: one-layer model (Ts 288.06 K, Ta 242.23 K, Te 254.58 K)', near(o.Ts, 288.0637768960795, 1e-12) && near(o.Ta, 242.23179735635904, 1e-12) && near(o.Te, 254.5781401165717, 1e-12));
  check('ebm: one-layer fluxes balance (top of atmosphere and surface)', near(o.olr, o.absorbed, 1e-12) && near(o.absorbed + o.atmDown, o.surface, 1e-12));
  check('ebm: one-layer limits: εa 0 gives Te, εa 1 gives 2^¼ Te', near(oneLayer(1361, 0.3, 0).Ts, o.Te, 1e-12) && near(oneLayer(1361, 0.3, 1).Ts, 2 ** 0.25 * o.Te, 1e-12));
  check('ebm: one-layer refuses εa outside 0 to 1', (() => { try { oneLayer(1361, 0.3, 1.2); return false; } catch { return true; } })());
};
