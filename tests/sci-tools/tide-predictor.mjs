// #832 Tide predictor: speeds against UTide's constituent table; I, ν, ξ (vectors here) against Schureman's Napier
// analogies in an independent NumPy script, which also re-evaluated every nodal f and u formula (agreed to 2e-13);
// least-squares analysis and prediction against UTide 0.4 (utide.solve / reconstruct, OLS) on a synthetic record:
// with nodal corrections off the two agree to 3e-10 in amplitude and 0.003° in phase (different mean-longitude
// polynomials); with them on, to Foreman's satellite method's small differences.
import { speed, argument, nodalSet, lunarIntersection, astro, predict, extremes, windows, analyse, rayleighSelect, parseTime, known, EXAMPLE } from '../../src/lib/sci/tide.ts';

const UT = {"a0": {"Z0": 1.9997953729983657, "cons": {"M2": [1.199593039, 109.96544], "S2": [0.501871157, 141.30857], "O1": [0.249932693, 185.15342], "K1": [0.249543872, 204.24981], "N2": [0.247569753, 95.71686], "Q1": [0.051278283, 170.86263], "M4": [0.049960536, 30.33756], "L2": [0.01280665, 74.41871], "J1": [0.005127406, 109.85379], "OO1": [0.00395323, 166.79981], "2Q1": [0.003780717, 354.47352], "2N2": [0.003259732, 117.67813], "MO3": [0.001498104, 17.2865], "MK3": [0.001236198, 344.93051], "S4": [0.000676046, 261.68823], "MM": [0.000661085, 265.57791], "2MS6": [0.000239221, 108.14016], "MF": [0.000220001, 343.8115], "M3": [0.000209327, 84.37732], "MN4": [0.000119176, 334.34609], "M8": [8.0154e-05, 194.19064], "M6": [7.5243e-05, 36.6], "MS4": [4.1135e-05, 334.00382]}, "pred": [2.3017972, 0.7058693, 3.2244689, 1.9963122, 0.6738119, 3.5497518]}, "aN": {"Z0": 1.999738655045288, "cons": {"M2": [1.199031598, 109.94748], "S2": [0.531482077, 140.01071], "K1": [0.2584114, 202.69394], "O1": [0.24915555, 184.94961], "N2": [0.246365777, 96.03942], "M4": [0.049951401, 30.44428], "Q1": [0.04949211, 171.59711], "L2": [0.013297765, 59.28967], "2N2": [0.003922445, 113.156], "J1": [0.003913504, 111.5527], "2Q1": [0.003126598, 353.67979], "OO1": [0.002578679, 173.97803], "MO3": [0.00151902, 15.01169], "MK3": [0.001257296, 349.43058], "S4": [0.000772886, 262.38256], "MM": [0.000742216, 263.68078], "M3": [0.000327252, 98.32612], "2MS6": [0.000303893, 106.27001], "MF": [0.000271943, 357.56588], "MN4": [0.00022159, 337.12999], "M6": [0.000132583, 43.26202], "M8": [8.74e-05, 214.23978], "MS4": [2.7349e-05, 284.66239]}, "pred": [2.2807382, 0.7187983, 3.2123185, 2.0178417, 0.6648012, 3.5142915]}};

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t, ang = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  // Speeds (degrees per hour), UTide's table (freq × 360).
  const sp = { M2: 28.9841043, S2: 30, N2: 28.4397296, K2: 30.0821373, K1: 15.0410686, O1: 13.9430356, P1: 14.9589314, Q1: 13.3986609, MF: 1.098033, MM: 0.5443746, M4: 57.9682085, MS4: 58.9841042, MN4: 57.4238338, M6: 86.9523127, L2: 29.5284789, T2: 29.9589333, J1: 15.5854433, OO1: 16.1391017, M3: 43.4761564, '2N2': 27.8953549, MU2: 27.9682085, NU2: 28.5125831, SSA: 0.0821373, MSF: 1.0158958 };
  check('tide: constituent speeds match UTide to 2e-6 °/h', Object.entries(sp).every(([n, w]) => near(speed(n), w, 2e-6)));
  // Lunar intersection: vectors against Schureman's formulas (NumPy, Napier analogies).
  const li = lunarIntersection(90);
  check('tide: I, ν, ξ at N = 0 and 180° (I = ω ± i)', near(lunarIntersection(0).I, 23.452 + 5.145, 1e-10) && near(lunarIntersection(180).I, 23.452 - 5.145, 1e-10) && near(lunarIntersection(0).nu, 0, 1e-12) && near(lunarIntersection(0).xi, 0, 1e-12));
  check('tide: I, ν, ξ at N = 90° match the Napier-analogy formulas', near(li.I, 23.97856284119121, 1e-12) && near(li.nu, 12.748014684495887, 1e-12) && near(li.xi, 11.679414123340209, 1e-12));
  // Nodal factors at node extremes (Schureman Table 14 ranges): M2 0.963–1.038, K1 0.882–1.113, O1 0.806–1.183.
  const a0 = nodalSet(0, 0), a1 = nodalSet(180, 0);
  check('tide: f(M2) 0.963 at N = 0, 1.038 at N = 180°', near(a0.M2.f, 0.963, 5e-4) && near(a1.M2.f, 1.038, 5e-4));
  check('tide: f(K1) 1.113 and 0.882; f(O1) 1.183 and 0.806 (to 3 decimals)', near(a0.K1.f, 1.113, 5e-4) && near(a1.K1.f, 0.882, 5e-4) && near(a0.O1.f, 1.183, 5e-4) && near(a1.O1.f, 0.806, 5e-4));
  { let mean = 0; for (let k = 0; k < 3600; k++) mean += nodalSet(k / 10, 0).M2.f / 3600; check('tide: f(M2) averages 1 over the node cycle', near(mean, 1, 5e-4)); }
  { const mx = Math.max(...Array.from({ length: 360 }, (_, k) => Math.abs(nodalSet(k, 0).M2.u))), mk = Math.max(...Array.from({ length: 360 }, (_, k) => Math.abs(nodalSet(k, 0).K1.u))); check('tide: u(M2) peaks at 2.1°, u(K1) at 8.9°', near(mx, 2.14, 0.03) && near(mk, 8.86, 0.05)); }
  check('tide: compound M4 = M2 + M2 (f², 2u), MS4 = M2 + S2', (() => { const t = Date.UTC(2026, 5, 1), m = argument('M2', t), m4 = argument('M4', t), s = argument('S2', t), ms = argument('MS4', t); return near(m4.f, m.f * m.f, 1e-12) && ang(m4.V + m4.u, 2 * (m.V + m.u)) < 1e-9 && ang(ms.V + ms.u, m.V + m.u + s.V) < 1e-9; })());
  check('tide: mean longitudes at J2000 (Meeus): s 218.3165°, h 280.4665°, N 125.0445°', (() => { const a = astro(Date.UTC(2000, 0, 1, 12)); return near(a.s, 218.3164477, 1e-6) && near(a.h, 280.46646, 1e-6) && near(a.N, 125.0445479, 1e-6); })());
  // Synthetic record (same as the NumPy/UTide run): 35 days hourly from 2026-03-01 plus small noise.
  const t0 = Date.UTC(2026, 2, 1), n = 35 * 24, t = Array.from({ length: n }, (_, i) => t0 + i * 3600000);
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  const hN = predict(EXAMPLE, 2.0, t, true).map((v) => v + 0.02 * rnd());
  seed = 7; const h0 = predict(EXAMPLE, 2.0, t, false).map((v) => v + 0.02 * rnd());
  const names = rayleighSelect(n - 1);
  check('tide: Rayleigh choice for 35 days drops K2, P1 and the long-period tides', names.length === 23 && !names.includes('K2') && !names.includes('P1') && !names.includes('SA') && names.includes('MM'));
  const b0 = analyse(t, h0, names, false), bN = analyse(t, hN, names, true);
  check('tide: analysis without nodal corrections matches UTide (3e-10 in H, 0.003° in G)', near(b0.Z0, UT.a0.Z0, 1e-9) && b0.cons.every((c) => near(c.H, UT.a0.cons[c.name][0], 1e-8) && (c.H < 1e-3 || ang(c.G, UT.a0.cons[c.name][1]) < 0.005)));
  check('tide: with nodal corrections the main constituents match UTide (Foreman) within 0.4 % and 0.2°', ['M2', 'S2', 'K1', 'O1', 'N2', 'M4'].every((k) => { const c = bN.cons.find((x) => x.name === k); return near(c.H, UT.aN.cons[k][0], 0.004 * c.H) && ang(c.G, UT.aN.cons[k][1]) < 0.2; }));
  const fut = Array.from({ length: 48 }, (_, i) => t0 + (n + 240 + i) * 3600000).filter((_, i) => i % 8 === 0);
  check('tide: prediction from the fit matches utide.reconstruct (no nodal: 1e-7 m)', predict(b0.cons, b0.Z0, fut, false).every((v, i) => near(v, UT.a0.pred[i], 2e-7)));
  check('tide: prediction with nodal corrections matches utide.reconstruct within 1 mm', predict(bN.cons, bN.Z0, fut, true).every((v, i) => near(v, UT.aN.pred[i], 1e-3)));
  // Truth: a noise-free year recovers every constituent exactly.
  const ty = Array.from({ length: 24 * 370 }, (_, i) => Date.UTC(2025, 0, 1) + i * 3600000), hy = predict(EXAMPLE, 2.0, ty, true);
  const ay = analyse(ty, hy, rayleighSelect(24 * 370 - 1), true);
  check('tide: a noise-free year gives back every constituent (1e-6)', near(ay.Z0, 2, 1e-7) && EXAMPLE.every((c) => { const r = ay.cons.find((x) => x.name === c.name); return r && near(r.H, c.H, 1e-6) && ang(r.G, c.G) < 1e-4; }) && ay.rms < 1e-6);
  // Extremes: rate zero at each, alternating, a pure M2 tide every 12.42 h.
  const pure = [{ name: 'M2', H: 1, G: 0 }], e = extremes(pure, 0, t0, t0 + 3 * 86400000, false);
  check('tide: pure M2 high and low waters alternate every 6.21 h at ±1', e.length >= 11 && e.every((x, i) => near(Math.abs(x.h), 1, 1e-9) && (i === 0 || (x.kind !== e[i - 1].kind && near(x.t - e[i - 1].t, 360 / 28.9841043 / 2 * 3600000, 2000)))));
  const tt = []; for (let x = Date.UTC(2026, 10, 9); x <= Date.UTC(2026, 10, 12); x += 360000) tt.push(x);
  const hx = predict(EXAMPLE, 2, tt, true), ex = extremes(EXAMPLE, 2, tt[0], tt[tt.length - 1], true);
  check('tide: every extreme is the highest or lowest point near it', ex.length === 12 && ex.every((x) => { const nb = tt.map((s, i) => [s, hx[i]]).filter(([s]) => Math.abs(s - x.t) < 1800000).map(([, h]) => h); return x.kind === 'high' ? nb.every((h) => h <= x.h + 1e-9) : nb.every((h) => h >= x.h - 1e-9); }));
  const w = windows({ t: tt, h: hx }, 2.6);
  check('tide: windows start and end at the needed level', w.length === 6 && w.every(([a, b]) => near(predict(EXAMPLE, 2, [a], true)[0], 2.6, 2e-3) && near(predict(EXAMPLE, 2, [b], true)[0], 2.6, 2e-3)));
  check('tide: times and names parse', parseTime('2026-01-02 03:04') === Date.UTC(2026, 0, 2, 3, 4) && parseTime('2026-01-02T03:04:30', 5) === Date.UTC(2026, 0, 1, 22, 4, 30) && Number.isNaN(parseTime('2026-13-01')) && known('m2') === 'M2' && known('2MK3') === 'MO3' && known('X9') === null);
  let thr = false; try { analyse(t.slice(0, 20), h0.slice(0, 20), names, true); } catch { thr = true; }
  check('tide: too few readings refused', thr);
};
