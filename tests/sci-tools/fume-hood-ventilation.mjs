// #516 fume hood and room ventilation: traverse statistics against NumPy (mean, sample SD, % deviations), the
// dilution ventilation model V dC/dt = G − (Q/K) C against SciPy solve_ivp (DOP853, rtol 1e-11) including the time
// a concentration takes to cross a target (solve_ivp event), molar volume and ppm <-> mg/m³ against scipy.constants.R,
// and hand values (24.465 L/mol at 25 °C; 1 ppm acetone = 2.374 mg/m³; 1 ft/min = 0.00508 m/s).
import { parseGrid, traverse, hoodFlow, sashTable, ach, tau, steady, concAt, timeTo, curve, molarVolume, ppmToMg, mgToPpm, rateMgS, FPM, CFM, FLOW, LEN } from '../../src/lib/sci/fumehood.ts';
const EXP = {"trav": {"mean": 0.5086666666666667, "sd": 0.04240395309514479, "mn": 0.42, "mx": 0.57, "dev": [2.228047182175617, 8.125819134993446, 12.057667103538645, 6.159895150720836, -1.703800786369602, -3.669724770642212, 4.193971166448226, 10.091743119266056, 2.228047182175617, -7.601572739187431, -13.49934469200525, -1.703800786369602, 4.193971166448226, -3.669724770642212, -17.43119266055047]}, "flow": 0.34335000000000004, "ode": [{"c": [1187.0, 1115.944041376048, 640.2767110931976, 186.29520565975267, 29.238335005833818], "tt": 3078.4808702864816, "css": 0.0}, {"c": [0.0, 47.202637314470095, 107.33177251734013, 166.69812285512677, 177.64215166375263], "tt": 1805.1422460553267, "css": 177.75}, {"c": [391.44786853977337, 323.9267099708208, 97.582121647483], "tt": 741.4360097146119, "css": 75.0}, {"c": [38.357807971173116, 97.98362846122703, 192.15529832913694], "tt": 2299.5193630316708, "css": 208.33333333333334}], "vm": [24.465403697038127, 22.413969545014137, 24.05511686663333, 26.53188781782268], "conv": [1186.9822529646503, 491.6223092405951, 86.82005652280175]};
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(b), 1e-300);
const allNear = (a, b, tol) => a.length === b.length && a.every((v, i) => near(v, b[i], tol));

export default async (check) => {
  const grid = parseGrid('row\tleft\t2\t3\t4\tright\n0.52 0.55 0.57 0.54 0.50\n0.49, 0.53, 0.56, 0.52, 0.47\n0.44;0.50;0.53;0.49;0.42\n');
  check('fume hood: grid parsed, header skipped', grid.length === 3 && grid.every((r) => r.length === 5));
  const T = traverse(grid);
  check('fume hood: traverse mean and sample SD match NumPy', near(T.mean, EXP.trav.mean, 1e-12) && near(T.sd, EXP.trav.sd, 1e-12));
  check('fume hood: min, max and their places', T.min === 0.42 && T.max === 0.57 && T.minAt.join() === '2,4' && T.maxAt.join() === '0,2');
  check('fume hood: per-point % deviation matches NumPy', allNear(T.points.map((p) => p.dev), EXP.trav.dev, 1e-9));
  check('fume hood: no flags without a band or tolerance', T.meanInBand === null && T.tolOk === null && T.nOutTol === 0 && T.nOutBand === 0);
  const T2 = traverse(grid, { lo: 0.45, hi: 0.6, tol: 15 });
  check('fume hood: band and ±15 % flags (0.42, 0.44 below; −17.4 % outside)', T2.meanInBand === true && T2.nOutBand === 2 && T2.nOutTol === 1 && T2.tolOk === false && T2.points.find((p) => p.outTol).v === 0.42);
  check('fume hood: mean outside the band', traverse(grid, { lo: 0.55 }).meanInBand === false && traverse(grid, { hi: 0.5 }).meanInBand === false);
  check('fume hood: a reading exactly on the tolerance is not flagged', traverse([[90, 110]], { tol: 10 }).nOutTol === 0);
  let bad = false; try { parseGrid('0.5 0.6\n0.5 x 0.6'); } catch { bad = true; }
  check('fume hood: a non-number in the grid is an error', bad);
  check('fume hood: flow = width × height × mean velocity', near(hoodFlow(1.5, 0.45, T.mean), EXP.flow, 1e-15));
  const st = sashTable(1.5, [0.225, 0.45, 0.9], EXP.flow, T.mean);
  check('fume hood: constant-volume velocity doubles when the sash halves; VAV flow scales with height', near(st[0].vCav, 2 * T.mean, 1e-12) && near(st[1].vCav, T.mean, 1e-12) && near(st[2].qVav, 2 * EXP.flow, 1e-12));
  check('fume hood: unit factors (1 ft/min = 0.00508 m/s; 1 cfm = 0.000471947 m³/s)', FPM === 0.00508 && near(CFM, 4.71947443e-4, 1e-12) && FLOW['m3/h'] === 1 / 3600 && LEN.in === 0.0254);
  check('fume hood: 1600 m³/h in a 144 m³ room is 11.11 ACH', near(ach(1600 / 3600, 144), 100 / 9, 1e-12));
  // Dilution model against SciPy solve_ivp.
  const cases = [[144, 1600 / 3600, 3, 1187, 0, [0, 60, 600, 1800, 3600], 50], [144, 1600 / 3600, 3, 0, 1580 / 60, [0, 300, 900, 2700, 7200], 150], [50, 0.2, 1.5, 400, 10, [10, 100, 1000], 120], [300, 1.2, 5, 30, 50, [60, 600, 3000], 180]];
  cases.forEach(([V, Q, K, C0, g, ts, tgt], i) => {
    const tc = tau(V, Q, K), css = steady(g, Q, K), e = EXP.ode[i];
    check(`fume hood: case ${i + 1} steady state and curve match solve_ivp`, rel(css, e.css, 1e-12) || (css === 0 && e.css === 0));
    check(`fume hood: case ${i + 1} C(t) matches solve_ivp (1e-7 relative)`, ts.every((t, j) => rel(concAt(t, C0, css, tc), e.c[j], 1e-7)));
    check(`fume hood: case ${i + 1} time to ${tgt} matches the solve_ivp event (1e-6 relative)`, rel(timeTo(C0, tgt, css, tc), e.tt, 1e-6));
  });
  check('fume hood: purge from 500 to 25 ppm takes τ ln 20', near(timeTo(500, 25, 0, 972), 972 * Math.log(20), 1e-9));
  check('fume hood: unreachable targets give NaN (below the steady state, or past it)', Number.isNaN(timeTo(500, 100, 150, 900)) && Number.isNaN(timeTo(0, 200, 150, 900)) && Number.isNaN(timeTo(100, 300, 0, 900)) && timeTo(80, 80, 0, 900) === 0);
  const cv = curve(100, 0, 600, 1200, 4);
  check('fume hood: curve sampled evenly', cv.t.length === 5 && cv.t[4] === 1200 && near(cv.c[4], 100 * Math.exp(-2), 1e-12));
  check('fume hood: molar volume matches scipy.constants.R', allNear([molarVolume(25, 101.325), molarVolume(0, 101.325), molarVolume(20, 101.325), molarVolume(30, 95)], EXP.vm, 1e-9) && near(molarVolume(25, 101.325), 24.465, 5e-4));
  const vm25 = molarVolume(25, 101.325), vm20 = molarVolume(20, 101.325), vm30 = molarVolume(30, 95);
  check('fume hood: ppm <-> mg/m³ match Python', rel(ppmToMg(500, 58.08, vm25), EXP.conv[0], 1e-9) && rel(mgToPpm(1187, 58.08, vm20), EXP.conv[1], 1e-9) && rel(ppmToMg(25, 92.14, vm30), EXP.conv[2], 1e-9));
  check('fume hood: 1 ppm acetone is 2.374 mg/m³ at 25 °C; the round trip is exact', near(ppmToMg(1, 58.08, vm25), 2.374, 5e-4) && near(mgToPpm(ppmToMg(123.4, 46.07, vm20), 46.07, vm20), 123.4, 1e-12));
  check('fume hood: rate units (2 mL/min at 0.79 g/mL = 26.33 mg/s)', near(rateMgS(2, 'mL/min', 0.79), 1580 / 60, 1e-12) && near(rateMgS(3.6, 'g/h'), 1, 1e-12) && near(rateMgS(60, 'mg/min'), 1, 1e-12) && near(rateMgS(0.06, 'g/min'), 1, 1e-12) && near(rateMgS(3.6, 'mL/h', 1), 1, 1e-12) && rateMgS(5, 'mg/s') === 5);
  check('fume hood: steady state 2 mL/min acetone, 1600 m³/h, K 3 = 177.75 mg/m³ = 74.9 ppm', near(steady(1580 / 60, 1600 / 3600, 3), 177.75, 1e-9) && near(mgToPpm(177.75, 58.08, vm25), 74.88, 0.01));
};
