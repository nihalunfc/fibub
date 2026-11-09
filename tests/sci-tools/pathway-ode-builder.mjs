// #986 pathway ODE builder: simulations checked against scipy.integrate.solve_ivp (DOP853, rtol 1e-12) and the fit
// against scipy.optimize.curve_fit on made-up noisy data generated from known rate constants.
import { parseModel, simulate, fitModel, odeText, rates } from '../../src/lib/sci/sbode.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const m = parseModel('S -> I : MM(Vmax1, Km1)\nI -> P : k2\nP -> : k3\nVmax1 = 1\nKm1 = 2\nk2 = 0.5\nk3 = 0.1\nS = 10');
  check('ODE: parses 3 reactions, species S, I, P, 4 parameters', m.reactions.length === 3 && m.species.join() === 'S,I,P' && m.paramNames.join() === 'Vmax1,Km1,k2,k3' && m.init.I === 0);
  check('ODE: equations written out', odeText(m)[1] === 'd[I]/dt = Vmax1·[S]/(Km1 + [S]) − k2·[I]');
  const t = [0, 5, 10, 15, 20, 25, 30], sim = simulate(m, m.params, t), ref = [[10.0, 0.0, 0.0], [6.016243922935496, 1.4333950412829646, 2.110151747597347], [2.6534493304843823, 1.2883011785176692, 4.02749840891529], [0.6062141455775184, 0.7362261434492139, 4.442558358648298], [0.06521773899992787, 0.1938609732142641, 3.5024145734497583], [0.0055156117213819335, 0.029411433028699512, 2.2879466106983823], [0.00045389627502152337, 0.0035469385253394945, 1.4100943032407234]];
  check('ODE: Michaelis-Menten pathway at 7 times = solve_ivp to 1e-7', ref.every((row, i) => row.every((v, j) => Math.abs(sim[i][j] - v) < 1e-7)));
  check('ODE: mass balance S + I + P falls only by P decay', (() => { const s = simulate(m, { ...m.params, k3: 0 }, [0, 10, 30]); return s.every((y) => Math.abs(y[0] + y[1] + y[2] - 10) < 1e-7); })());
  const m2 = parseModel('A <-> B : kf, kr\n2 B -> C : kd\nkf = 1\nkr = 0.3\nkd = 0.2\nA = 5');
  const s2 = simulate(m2, m2.params, [0, 1, 2, 5, 10]), ref2 = [[5.0, 0.0, 0.0], [2.1326513558798945, 1.9529015126204097, 0.4572235657498484], [1.1246593331782662, 1.6282386180216666, 1.1235510244000342], [0.33188587418828513, 0.7928166685563088, 1.9376487286277038], [0.13067212755058763, 0.38066992874918815, 2.2443289718501127]];
  check('ODE: reversible and 2B -> C (second order) = solve_ivp', ref2.every((row, i) => row.every((v, j) => Math.abs(s2[i][j] - v) < 1e-7)));
  check('ODE: Hill law needs a substrate on the left', (() => { try { parseModel('-> Y : Hill(V, K, n)\nV = 1\nK = 1\nn = 1'); return false; } catch (e) { return /substrate/.test(e.message); } })());
  const m4 = parseModel('-> X : k0\nX -> : kd\nX -> X + Y : Hill(V, K, n)\nY -> : kd\nk0 = 1\nkd = 0.2\nV = 2\nK = 3\nn = 2');
  const s4 = simulate(m4, m4.params, [0, 5, 10, 20]), ref4 = [[0.0, 0.0], [3.16060279414289, 2.0614963813435243], [4.323323583816884, 4.737229503367257], [4.908421805556179, 6.847788585461372]];
  check('ODE: source, decay and Hill activation = solve_ivp', ref4.every((row, i) => row.every((v, j) => Math.abs(s4[i][j] - v) < 1e-7)));
  check('ODE: rates at the start', (() => { const v = rates(m, [10, 0, 0], m.params); return near(v[0], 10 / 12, 1e-12) && v[1] === 0 && v[2] === 0; })());
  for (const [txt, re] of [['A -> B', /colon/], ['A -> B : k\n', /value for the parameter k/], ['A -> B : k\nk = -1', /0 or more/], ['A -> B : k\nk = 1\nZ = 3', /not used/], ['A -> B$ : k\nk=1', /not a species/], ['k = 1', /at least one reaction/], ['A -> B : MM(V)\nV = 1', /two values/]])
    check(`ODE: bad model message ${re}`, (() => { try { parseModel(txt); return false; } catch (e) { return re.test(e.message); } })());
  const [td, I, P] = [[1.0, 2.0, 4.0, 6.0, 8.0, 12.0, 16.0, 20.0, 25.0, 30.0], [0.883, 1.21, 1.919, 1.991, 1.931, 1.347, 0.493, 0.139, 0.021, 0.003], [0.17, 0.566, 1.663, 2.743, 3.61, 4.679, 4.458, 3.281, 2.183, 1.279]];
  const f = fitModel(m, { t: td, cols: [{ species: 'I', y: I }, { species: 'P', y: P }] }, ['Vmax1', 'k2']);
  const fr = [1.170013192192864, 0.4011807436656155], se = [0.010006495944909705, 0.005686387810454976];
  check(`ODE fit: Vmax1 ${fr[0].toFixed(5)}, k2 ${fr[1].toFixed(5)} (curve_fit)`, near(f.values[0], fr[0], 1e-5) && near(f.values[1], fr[1], 1e-5) && f.converged);
  check(`ODE fit: standard errors ${se[0].toFixed(4)}, ${se[1].toFixed(4)} (curve_fit, within 1 %)`, Math.abs(f.se[0] / se[0] - 1) < 0.01 && Math.abs(f.se[1] / se[1] - 1) < 0.01);
  check(`ODE fit: SSE ${0.05360760352631318.toFixed(5)} (curve_fit)`, near(f.sse, 0.05360760352631318, 1e-6) && f.r2 > 0.99 && f.n === 20);
};
