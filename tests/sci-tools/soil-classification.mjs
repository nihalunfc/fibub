// #655 soil classification (USCS, AASHTO). Checked against an independent Python implementation of the same
// decision rules (400 random soils, all agreeing; a sample covering every group is kept here) and numpy.interp on
// log(size) for D10/D30/D60 and percent passing. Hand-worked group index example below.
import { uscs, aashto, dAt, passingAt, fromCurve, aLine, uLine, groupIndex } from '../../src/lib/sci/soilclass.ts';
export default async (check) => {
  // [gravel, sand, fines, d10, d30, d60, LL, PL, nonPlastic, p10, p40, USCS, AASHTO, GI] from Python.
  const cases = [[59.8394,38.9708,1.18982,0.532666,1.26427,3.48714,68.7861,41.7374,0,55.499,22.7579,"GP","A-2-7",0],[2.74873,0.959497,96.2918,0.103332,0.116268,0.469941,37.5951,36.4292,0,99.5013,97.8091,"ML","A-4",4],[2.87251,1.07256,96.0549,0.0537934,0.31769,0.406746,17.6915,8.93627,0,97.0727,96.7389,"CL","A-4",4],[38.4535,33.5429,28.0036,0.0167004,0.0256234,0.0476485,17.1495,12.3531,0,71.6204,58.342,"GC-GM","A-2-4",0],[68.8883,27.6186,3.49308,0.00429907,0.0198912,0.057212,19.7595,2.88603,0,99.0162,11.9486,"GW","A-2-6",0],[30.8134,4.49202,64.6946,0.00135697,0.00420917,0.00457244,39.8216,4.74254,0,99.3163,82.1931,"CL","A-6",18],[36.6192,60.6387,2.74215,0.0585611,0.0748556,0.240464,41.4687,3.42786,0,61.9589,19.2592,"SP","A-2-7",0],[12.987,38.729,48.284,0.0233849,0.0696745,0.12563,38.4503,24.2562,0,79.0871,57.5374,"SC","A-6",4],[27.7757,61.8184,10.4059,0.00465172,0.0204484,0.0317406,47.6426,14.3849,0,19.5303,13.3437,"SW-SC","A-2-7",0],[7.12861,82.0366,10.8348,0.168349,0.251551,0.716715,74.0255,72.3301,0,96.2177,37.7424,"SP-SM","A-1-b",0],[27.8133,21.9536,50.2331,0.906312,3.39692,3.60528,71.5035,34.1028,0,98.1768,76.3078,"MH","A-7-5",15],[0.897482,15.9577,83.1448,0.548598,0.676276,0.852018,55.5736,14.996,0,84.1792,83.3732,"CH","A-7-6",34],[76.9399,6.53015,16.53,0.261911,1.19386,1.21048,79.6916,77.195,0,39.1835,22.6144,"GM","A-1-b",0],[26.4635,46.8762,26.6603,0.00374323,0.0068591,0.00861531,68.7032,49.6913,0,32.5202,27.7066,"SM","A-2-7",1],[3.74875,25.0068,71.2444,0.00121418,0.00221175,0.013176,80.2763,74.2038,0,91.1017,89.8917,"MH","A-5",12],[70.6898,25.6526,3.65764,0.0491509,0.0594345,0.175487,25.7639,5.8148,1,7.92684,4.04955,"GP","A-1-a",0],[37.0579,61.6777,1.26448,0.00507916,0.0281439,0.133127,46.1453,19.9161,0,58.5138,54.159,"SW","A-2-7",0],[9.00197,84.9048,6.09322,0.175576,0.950071,2.46354,68.9183,59.6127,0,31.1999,11.094,"SW-SM","A-2-5",0],[10.3896,50.8305,38.7799,0.00136479,0.00191285,0.00226176,23.8476,17.5476,0,94.7198,40.8008,"SC-SM","A-4",0],[81.5471,7.01303,11.4399,0.0860861,0.284842,0.61761,29.0177,15.0204,0,80.7126,60.3095,"GW-GC","A-2-6",0],[53.4553,36.8536,9.69104,0.00275051,0.00572993,0.00818577,57.6276,47.5238,0,32.2819,27.3495,"GP-GM","A-2-7",0],[44.5448,46.0169,9.43828,0.0372322,0.0869653,0.124192,17.7797,8.88189,0,67.9374,35.4249,"SP-SC","A-2-4",0],[66.7723,25.1546,8.07305,0.420885,2.59074,8.00089,55.1787,34.2418,0,95.2248,86.7791,"GW-GM","A-2-7",0],[65.9134,4.7491,29.3375,0.350778,0.4882,2.87977,27.5939,20.2569,0,43.6366,30.0962,"GC","A-2-4",0],[54.6974,39.0515,6.25105,0.00210356,0.00556436,0.0266738,55.4491,12.2922,0,48.1244,26.8816,"GP-GC","A-2-7",0],[33.904,10.5163,55.5797,0.555875,1.22561,1.30333,15.996,11.6343,0,81.7834,62.7912,"CL-ML","A-4",0],[18.2817,80.0503,1.66796,0.00303108,0.00687977,0.0229917,41.7734,18.4813,1,84.9726,73.8085,"SP","A-3",0]];
  let ok = 0;
  for (const c of cases) {
    const u = uscs({ gravel: c[0], sand: c[1], fines: c[2], d10: c[3], d30: c[4], d60: c[5], LL: c[6], PL: c[7], nonPlastic: !!c[8] }).symbol;
    const a = aashto({ p10: c[9], p40: c[10], p200: c[2], LL: c[6], PI: c[6] - c[7], nonPlastic: !!c[8] });
    if (u === c[11] && a.group === c[12] && a.GI === c[13]) ok++; else console.log('soil-classification mismatch', c, u, a.group, a.GI);
  }
  check(`soil-classification: ${cases.length} soils match the Python classifier`, ok === cases.length && cases.length > 25);
  const size = [4.75, 2, 0.85, 0.425, 0.25, 0.15, 0.075, 0.02, 0.005], pas = [100, 92, 80, 61, 44, 30, 18, 9, 4];
  check('soil-classification: D10 by log interpolation (numpy)', Math.abs(dAt(size, pas, 10) - 0.023163876864869305) < 1e-12);
  check('soil-classification: D30 on a sieve and D60 (numpy)', Math.abs(dAt(size, pas, 30) - 0.15) < 1e-12 && Math.abs(dAt(size, pas, 60) - 0.41193919042129934) < 1e-12);
  check('soil-classification: passing at 1 mm and 0.1 mm (numpy)', Math.abs(passingAt(size, pas, 1) - 82.2791917677349) < 1e-9 && Math.abs(passingAt(size, pas, 0.1) - 22.980449991346124) < 1e-9);
  check('soil-classification: passing above the top sieve is 100, below the finest unknown', passingAt(size, pas, 10) === 100 && Number.isNaN(passingAt(size, pas, 0.001)));
  const f = fromCurve(size, pas);
  check('soil-classification: fractions from the curve', f.gravel === 0 && f.sand === 82 && f.fines === 18 && f.p10 === 92 && f.p40 === 61);
  check('soil-classification: A-line and U-line', aLine(50) === 0.73 * 30 && aLine(22) === 4 && Math.abs(uLine(50) - 37.8) < 1e-12);
  // Hand-worked: F = 58, LL = 35, PI = 14 → 23 × 0.175 + 0.01 × 43 × 4 = 4.025 + 1.72 = 5.745 → 6.
  { const g = groupIndex(58, 35, 14, 'A-6'); check('soil-classification: group index worked by hand', Math.abs(g.raw - 5.745) < 1e-12 && g.GI === 6); }
  check('soil-classification: partial GI for A-2-6', groupIndex(30, 35, 15, 'A-2-6').GI === 1 && groupIndex(30, 35, 15, 'A-2-4').GI === 0);
  check('soil-classification: negative GI reported as 0', groupIndex(40, 20, 5, 'A-4').GI === 0);
  { const r = uscs({ gravel: 0, sand: 40, fines: 60, LL: 32, PL: 18 }); check('soil-classification: sandy lean clay name', r.symbol === 'CL' && r.name === 'sandy lean clay'); }
  { const r = uscs({ gravel: 20, sand: 70, fines: 10, d10: 0.08, d30: 0.5, d60: 1.2, LL: 30, PL: 26 }); check('soil-classification: dual symbol with gravel', r.symbol === 'SW-SM' && r.name === 'well-graded sand with silt and gravel'); }
  { const r = uscs({ gravel: 0, sand: 10, fines: 90, LL: 60, PL: 40, LLdry: 40 }); check('soil-classification: organic test', r.symbol === 'OH'); }
  let threw = false; try { uscs({ gravel: 10, sand: 10, fines: 10 }); } catch { threw = true; }
  check('soil-classification: fractions must add to 100', threw);
};
