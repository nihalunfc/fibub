// #880 gravity corrections: drift, normal gravity (GRS80 and WGS84), free-air (simple and second order), Bouguer slab
// and complete Bouguer anomalies against an independent NumPy reduction of the same made-up survey (np.interp drift);
// the survey was built from a known anomaly, which the page gets back to within the 0.001 rounding of the readings.
// Ring terrain corrections against SciPy dblquad integration of the vertical attraction of each annular sector.
import { reduce, normalGravity, freeAir, bouguerSlab, ringCompartment, terrainCorrection, driftAt, parseHours } from '../../src/lib/sci/gravity.ts';
const ROWS = [["BASE", "08:00", 2512.3, 52.0995, 118.0, "", ""], ["G00", "08:15", 2496.131, 52.1, 121.4, 0.0, 0.12], ["G01", "08:30", 2495.953, 52.1018, 125.0, 200.0, 0.08], ["G02", "08:45", 2495.179, 52.1036, 131.7, 400.0, 0.05], ["G03", "09:00", 2494.035, 52.1054, 140.2, 600.0, 0.09], ["G04", "09:15", 2492.125, 52.10719, 152.8, 800.0, 0.21], ["G05", "09:30", 2491.307, 52.10899, 160.3, 1000.0, 0.35], ["BASE", "09:50", 2512.373, 52.0995, 118.0, "", ""], ["G06", "10:05", 2492.271, 52.11079, 158.1, 1200.0, 0.3], ["G07", "10:20", 2494.142, 52.11259, 149.9, 1400.0, 0.18], ["G08", "10:35", 2496.181, 52.11439, 141.2, 1600.0, 0.1], ["G09", "10:50", 2497.701, 52.11619, 135.5, 1800.0, 0.07], ["G10", "11:05", 2499.215, 52.11799, 130.0, 2000.0, 0.06], ["BASE", "11:30", 2512.44, 52.0995, 118.0, "", ""]] ;
const TRUTH = [-13.96731, -13.64513, -13.299971, -12.900327, -12.380641, -11.752137, -11.452137, -11.480641, -11.400327, -11.199971, -10.94513] ;
const EXP = {"gobs": [981234.56, 981218.3810455, 981218.1930909, 981217.4091364, 981216.2551818, 981214.3352273, 981213.5072727, 981234.56, 981214.44795, 981216.3089, 981218.33785, 981219.8478, 981221.35175, 981234.56], "faa": [14.6797522, -0.4938831, 0.2710092, 1.396564, 2.7076013, 4.5187793, 5.8472215, 14.6797522, 5.950878, 5.1232097, 4.3092439, 3.9020805, 3.5506397, 14.6797522], "sba": [1.467439, -14.0868901, -13.7250853, -13.3497212, -12.9904183, -12.5900466, -12.1013701, 1.467439, -11.7513823, -11.6609068, -11.5007445, -11.2696859, -11.0052986, 1.467439], "cba": [1.467439, -13.9668901, -13.6450853, -13.2997212, -12.9004183, -12.3800466, -11.7513701, 1.467439, -11.4513823, -11.4809068, -11.4007445, -11.1996859, -10.9452986, 1.467439], "faa2": [14.6663887, -0.5076619, 0.2567877, 1.3815148, 2.6914929, 4.5010825, 5.8285672, 14.6663887, 5.9325026, 5.105874, 4.2930011, 3.8865473, 3.5357867, 14.6663887], "gw": [981256.1517975, 981256.1957183, 981256.3538315, 981256.5119421, 981256.6700503, 981256.8272777, 981256.985381, 981256.1517975, 981257.1434818, 981257.3015801, 981257.459676, 981257.6177693, 981257.7758602, 981256.1517975], "drift": [0.0, 0.0099545, 0.0199091, 0.0298636, 0.0398182, 0.0497727, 0.0597273, 0.073, 0.08305, 0.0931, 0.10315, 0.1132, 0.12325, 0.14], "tcnum": [0.0257865, 0.0642618, 0.0441032, 0.0442929, 0.0624362]} ;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const allNear = (a, b, tol) => a.length === b.length && a.every((v, i) => near(v, b[i], tol));

export default async (check) => {
  const rows = ROWS.map(([name, t, reading, lat, h, x, tc]) => ({ name, t: parseHours(t), reading, lat, h, x: x === '' ? undefined : x, tc: tc === '' ? undefined : tc }));
  const o = { base: 'BASE', gBase: 981234.56, cal: 1, rho: 2670, ell: 'grs80', fa: 'simple' };
  const R = reduce(rows, o);
  check('gravity: drift matches NumPy interp', allNear(R.rows.map((r) => r.drift), EXP.drift, 1e-6));
  check('gravity: observed gravity matches NumPy', allNear(R.rows.map((r) => r.gObs), EXP.gobs, 1e-6));
  check('gravity: free-air, simple and complete Bouguer anomalies match NumPy (1e-6 mGal)', allNear(R.rows.map((r) => r.faa), EXP.faa, 1e-6) && allNear(R.rows.map((r) => r.sba), EXP.sba, 1e-6) && allNear(R.rows.map((r) => r.cba), EXP.cba, 1e-6));
  check('gravity: the known anomaly is recovered (readings rounded to 0.001)', allNear(R.rows.filter((r) => !r.isBase).map((r) => r.cba), TRUTH, 0.0015));
  check('gravity: drift rate 0.04 mGal/h', near(R.rate, 0.04, 1e-3));
  const R2 = reduce(rows, { ...o, fa: 'second' });
  check('gravity: second-order free-air anomaly matches NumPy', allNear(R2.rows.map((r) => r.faa), EXP.faa2, 1e-6));
  check('gravity: WGS84 normal gravity matches NumPy', allNear(rows.map((r) => normalGravity(r.lat, 'wgs84')), EXP.gw, 1e-6));
  check('gravity: GRS80 normal gravity at the equator and pole (978032.67715 and 983218.63685 mGal)', near(normalGravity(0), 978032.67715, 1e-6) && near(normalGravity(90), 983218.63685, 1e-4) && near(normalGravity(-45), normalGravity(45), 1e-9));
  check('gravity: Bouguer slab 0.04193 mGal per metre for 1000 kg/m³; free-air 0.3086 mGal/m', near(bouguerSlab(1000, 1), 0.041935, 2e-6) && near(freeAir(100, 45), 30.86, 1e-12) && near(freeAir(0, 30, 'second'), 0, 0));
  // Ring compartments against numerical integration of the vertical attraction (SciPy dblquad).
  const T = [[2, 20, 3, 6], [60, 200, 25, 6], [200, 500, -40, 6], [500, 1000, 80, 8], [1000, 2500, 150, 12]];
  check('gravity: ring compartments match SciPy integration (1e-7 mGal)', allNear(T.map(([a, b, h, n]) => ringCompartment(a, b, h, n, 2670)), EXP.tcnum, 1e-7));
  check('gravity: terrain correction sums rings; a full ring of 0 height adds nothing', near(terrainCorrection([{ r1: 2, r2: 20, heights: [3, 3, 3, 3, 3, 3] }], 2670).total, EXP.tcnum[0] * 6, 1e-6) && terrainCorrection([{ r1: 0, r2: 50, heights: [0] }], 2670).total === 0);
  check('gravity: drift held flat outside the base readings', driftAt([{ t: 8, r: 10 }, { t: 10, r: 10.2 }], 7) === 0 && near(driftAt([{ t: 8, r: 10 }, { t: 10, r: 10.2 }], 12), 0.2, 1e-12) && near(driftAt([{ t: 8, r: 10 }, { t: 10, r: 10.2 }], 9), 0.1, 1e-12));
  { let m = ''; try { reduce(rows, { ...o, base: 'B1' }); } catch (e) { m = e.message; } check('gravity: missing base station refused', m.includes('No readings at the base station "B1"')); }
  check('gravity: hours parse', parseHours('08:15') === 8.25 && parseHours('9.5') === 9.5 && near(parseHours('10:20:30'), 10 + 20 / 60 + 30 / 3600, 1e-12));
};
