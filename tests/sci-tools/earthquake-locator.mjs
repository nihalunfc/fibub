// #878 earthquake locator: Geiger least-squares location against SciPy's optimize.least_squares on the same made-up
// picks (great-circle distances, depth fixed and free; standard errors from s²(JᵀJ)⁻¹), noise-free recovery on a flat
// grid, S−P distance, ML (Hutton-Boore / IASPEI; Richter's anchor 1 mm at 100 km = ML 3) and Mw (IASPEI).
import { locate, spDistance, localMagnitude, momentMagnitude, momentFromMw, seismicMoment, gcDistance, gcDestination, parseTime, fmtTime } from '../../src/lib/sci/quake.ts';

const ROWS = [['STA1', 45.312, 10.105, 43209.79, 43213.3, 12.97], ['STB2', 44.861, 10.592, 43211.59, 43216.43, 7.56], ['STC3', 45.044, 9.512, 43214.41, 43221.35, 5.22], ['STD4', 45.598, 10.044, 43214.92, 43222.24, 5.66], ['STE5', 44.702, 9.881, 43213.5, 43219.63, 6.52], ['STF6', 45.21, 10.788, 43213.03, 43218.76, 6.52]];
// SciPy least_squares (xtol = ftol = gtol = 1e-15), Vp 6, Vs 6/1.73.
const EXP = {
  fixed: { lat: 45.08235848549072, lon: 10.218871389308521, t0: 43204.99113013561, rms: 0.03223693707066799, seN: 0.06675176442801128, seE: 0.06707978094244743, seT: 0.01089515597330569 },
  free: { lat: 45.08232290497617, lon: 10.218841079977626, t0: 43204.99927314728, z: 9.83831677744093, rms: 0.03208750473720202, seN: 0.07188807883766378, seE: 0.07129868624923322, seT: 0.03193683565608629, seZ: 0.5961641867658377 },
  ML: [3.3799464264545875, 3.3186094103613497, 3.3619149478438697, 3.42976858645239, 3.39754969063957, 3.3617941336174546],
};
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rel = (a, b, tol) => Math.abs(a / b - 1) <= tol;

export default async (check) => {
  const st = ROWS.map(([name, a, b, tp, ts, amp]) => ({ name, a, b, tp, ts, amp }));
  const o = { vp: 6, vs: 6 / 1.73, spherical: true, depth: 10, freeDepth: false };
  const F = locate(st, o), E = EXP.fixed;
  check('quake: fixed-depth epicentre matches SciPy (1e-7°)', near(F.a, E.lat, 1e-7) && near(F.b, E.lon, 1e-7) && near(F.t0, E.t0, 1e-6) && near(F.depth, 10, 0));
  check('quake: RMS residual and origin-time error match SciPy', rel(F.rms, E.rms, 1e-6) && rel(F.seT, E.seT, 1e-4));
  check('quake: epicentre standard errors in km match SciPy (1 %)', rel(F.seN, E.seN, 0.01) && rel(F.seE, E.seE, 0.01));
  check('quake: ML per station matches SciPy distances', F.rows.every((r, i) => near(localMagnitude(st[i].amp, r.hypo, 'mm'), EXP.ML[i], 1e-6)));
  const G = locate(st, { ...o, freeDepth: true }), X = EXP.free;
  check('quake: free-depth hypocentre matches SciPy', near(G.a, X.lat, 1e-6) && near(G.b, X.lon, 1e-6) && near(G.depth, X.z, 1e-4) && near(G.t0, X.t0, 1e-4) && rel(G.rms, X.rms, 1e-5));
  check('quake: free-depth errors match SciPy (1 %)', rel(G.seZ, X.seZ, 0.01) && rel(G.seT, X.seT, 0.01) && rel(G.seN, X.seN, 0.01));
  // Flat grid, noise-free: exact recovery from three stations with P only (no spare data) and from five with P and S.
  const truth = { x: 12.5, y: -7.25, z: 8, t0: 100 };
  const pts = [[0, 0], [30, 5], [10, -25], [-15, -10], [25, -30]];
  const mk = (n, withS) => pts.slice(0, n).map(([x, y], i) => { const h = Math.hypot(x - truth.x, y - truth.y, truth.z); return { name: `S${i}`, a: x, b: y, tp: truth.t0 + h / 5.8, ts: withS ? truth.t0 + h / 3.35 : undefined }; });
  { const L = locate(mk(5, true), { vp: 5.8, vs: 3.35, spherical: false, depth: 3, freeDepth: true }); check('quake: flat grid, noise-free P and S give the true hypocentre', near(L.a, truth.x, 1e-6) && near(L.b, truth.y, 1e-6) && near(L.depth, truth.z, 1e-5) && near(L.t0, truth.t0, 1e-6) && L.rms < 1e-8); }
  { const L = locate(mk(3, false), { vp: 5.8, vs: 3.35, spherical: false, depth: 8, freeDepth: false }); check('quake: three P times, depth fixed: exact answer, no error estimate', near(L.a, truth.x, 1e-5) && near(L.b, truth.y, 1e-5) && Number.isNaN(L.seE)); }
  { let threw = ''; try { locate(mk(3, false), { vp: 5.8, vs: 3.35, spherical: false, depth: 8, freeDepth: true }); } catch (e) { threw = e.message; } check('quake: too few times for free depth is refused', threw.includes('at least 4')); }
  check('quake: S−P distance d = Δt·Vp·Vs/(Vp−Vs)', near(spDistance(5, 6, 6 / Math.sqrt(3)), 5 * 6 * (6 / Math.sqrt(3)) / (6 - 6 / Math.sqrt(3)), 1e-12) && near(spDistance(1, 6, 3.5), 8.4, 1e-12));
  check('quake: ML anchor (1 mm Wood-Anderson at 100 km is ML 3.0, within 0.001)', near(localMagnitude(1, 100, 'mm'), 3, 0.001) && near(localMagnitude(1e6 / 2080, 100, 'nm'), localMagnitude(1, 100, 'mm'), 1e-12));
  check('quake: ML rises by 1 for 10× amplitude', near(localMagnitude(10, 50) - localMagnitude(1, 50), 1, 1e-12));
  check('quake: Mw (IASPEI) for 1e18 N·m is 5.93; fault 10×5 km, 0.5 m, 30 GPa is 5.85', near(momentMagnitude(1e18), 5.9333333, 1e-6) && near(momentMagnitude(seismicMoment(30e9, 50e6, 0.5)), 5.850040842261134, 1e-12) && rel(momentFromMw(5.85004084226), 7.5e17, 1e-9));
  check('quake: great circle 1° of latitude is 111.19 km; destination goes back', near(gcDistance(0, 0, 1, 0), 111.19492664, 1e-6) && (() => { const [a, b] = gcDestination(45, 10, 63, 250); return near(gcDistance(45, 10, a, b), 250, 1e-9); })());
  check('quake: time parsing and formatting', parseTime('12:00:09.79') === 43209.79 && parseTime('1:05.5') === 65.5 && Number.isNaN(parseTime('-')) && fmtTime(43204.99113, true) === '12:00:04.99' && fmtTime(59.999, true) === '00:01:00.00' && fmtTime(12.345, false) === '12.35');
};
