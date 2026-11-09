// #215 Solar cycle fitter. References (made-up example series, January 1976 to October 2026): numpy.convolve with
// weights [1, 2 × 11, 1]/24 for the 13-month running mean; scipy.signal.argrelmin(order = k, mode = 'clip') for the
// minima (k = 42 months for 7 years between minima; 15 on a random series), numpy.argmax between them for the maxima;
// scipy.optimize.curve_fit (from its own start values) for the shape a(t − t0)³/(exp((t − t0)²/b²) − c), c = 0.7, on
// each cycle, with its covariance; scipy minimize_scalar for the peak of x³/(e^(x²) − c); and an independent numpy
// Monte Carlo (default_rng(2026); 100,000 covariance draws for the free fit, 20,000 refits for the past-shape band)
// for the 95 % band and the peak's time and height. Monte Carlo values agree statistically (within a few % of the
// band's width); the rest to 1e-12 (smoothing), exactly (indexes) or to scipy's fitting tolerance.
import * as L from '../../src/lib/sci/solarcycle.ts';
const R = {"S40":[null,null,null,null,null,null,7.77083333333,7.87083333333,7.62083333333,6.93333333333,6.36666666667,6.11666666667,6.17916666667,5.69583333333,5.18333333333,4.78333333333,4.025,3.69166666667,3.8,3.53333333333,3.16666666667,3.025,2.775,2.53333333333,2.33333333333,2.1875,2.20833333333,2.4,2.84583333333,2.79583333333,2.89166666667,3.85833333333,5.00416666667,6.08333333333,7.28333333333,8.65416666667,10.7083333333,12.4791666667,14.6791666667,17.6708333333],"Send":[76.4333333333,79.4416666667,82.6125,88.9041666667,94.5833333333,96.5791666667,97.7166666667,100.075,102.195833333,103.266666667,104.970833333,108.1125,110.966666667,113.5125,null,null,null,null,null,null],"rminima":[89,216,348],"rmaxima":[151,281],"minima":[25,155,289,425,562],"maxima":[68,202,344,475],"fits":{"monthly":[{"p":[5.11214382238,3.72940321825,1978.15569561],"cov":[[0.184507418199,-0.0367437426265,0.0362544463722],[-0.0367437426265,0.00765886906572,-0.00755684092025],[0.0362544463722,-0.00755684092025,0.00948713820706]]},{"p":[8.9649232263,3.37183011781,1989.46548877],"cov":[[0.537712983012,-0.0552023443917,0.0544804102575],[-0.0552023443917,0.00593210037652,-0.0058545145623],[0.0544804102575,-0.0058545145623,0.00735354193646]]},{"p":[3.55263948286,3.97688728515,2000.21743323],"cov":[[0.0850718984187,-0.025998634373,0.0256469181701],[-0.025998634373,0.00831572295799,-0.00820314838839],[0.0256469181701,-0.00820314838839,0.0102943311922]]},{"p":[2.52885745834,4.19269292085,2011.46971836],"cov":[[0.0458676315537,-0.0207663727127,0.0204723424909],[-0.0207663727127,0.0098384179382,-0.00969888806673],[0.0204723424909,-0.00969888806673,0.0121571785278]]}],"smoothed":[{"p":[4.87376500237,3.77356517968,1978.11173014],"cov":[[0.00826764546083,-0.00174748139011,0.00172411534879],[-0.00174748139011,0.000386587634167,-0.000381416082613],[0.00172411534879,-0.000381416082613,0.000478792646866]]},{"p":[8.49461853965,3.41639749221,1989.42089178],"cov":[[0.0179649272824,-0.00197214702915,0.00194634114955],[-0.00197214702915,0.000226618851261,-0.000223653252631],[0.00194634114955,-0.000223653252631,0.000280914500918]]},{"p":[3.41563006749,4.01538361117,2000.17749271],"cov":[[0.00611125280254,-0.00196142526201,0.00193475024541],[-0.00196142526201,0.000658854582035,-0.000649887178311],[0.00193475024541,-0.000649887178311,0.000815448773496]]},{"p":[2.41722805785,4.2409452525,2011.42118173],"cov":[[0.00355383949977,-0.00170278538573,0.00167837340973],[-0.00170278538573,0.000853713353712,-0.000841450745209],[0.00167837340973,-0.000841450745209,0.00105438854341]]}]},"peakx":[1.22474487142,1.1779867191,1.1377464966,1.08447909788,1.0033238491],"sub":[0,12,24,36,48,60,72,84,96,108,120,132,144,156],"fc":{"free":{"p":[4.85756935465,3.65004783236,2022.86471847],"lo":[0.0,4.38861690261,32.9755322923,55.12583935,58.7605627295,39.9272225658,17.8821645206,5.50559058619,1.18826107552,0.182988189529,0.0205369182464,0.00168883909981,0.000102706948565,4.63922971361e-06],"hi":[0.408598159499,17.6667405999,64.7238519763,107.594485664,125.560874147,116.82673619,92.2433383782,63.7383134073,39.0633350888,21.4359087945,10.5386141654,4.65875546095,1.86591197234,0.677160746856],"lo68":[0.0,8.51892812911,49.6511806896,85.4395938798,92.6899391008,73.4597267332,43.8539285206,19.9610931247,6.9938611351,1.90935685133,0.410966750258,0.0702820623498,0.00954615252863,0.001040020686],"hi68":[0.117342339844,15.1332659235,61.2742956768,104.117448266,119.645888783,108.893006648,83.6111656478,55.5842298803,32.2864156889,16.3595287832,7.19407035427,2.73821861881,0.902543869336,0.258589231243],"pT":[2026.15724676,2027.46724275],"pV":[65.420436217,125.954985459]},"past":{"mb":3.81770338551,"sb":0.35239965754,"p":[4.30946232091,2022.79595359],"lo":[0.0,7.94008909578,53.7014966742,97.364405549,107.915709492,82.9966022727,47.8463122055,21.0724042458,7.16833941303,1.90353649734,0.394572374021,0.0651418229569,0.00849396771989,0.000880776891944],"hi":[0.575237959146,19.942760698,65.7739050818,109.500424387,131.027173527,131.607883463,113.006953911,84.982929487,56.2606582138,32.6989670119,16.8319690322,7.65775041524,3.08234338355,1.10346169398],"pT":[2026.47362808,2027.46648715],"pV":[109.760746455,134.227068584]}}};
const near = (a, b, t) => Math.abs(a - b) <= t;
const rel = (a, b, t) => Math.abs(a / b - 1) <= t;

export default async (check) => {
  const p = L.parseSeries(L.exampleSeries()), v = p.pts.map((q) => q.v);
  check('solar cycle: example read (610 months, no gaps)', p.pts.length === 610 && !p.bad.length && p.gaps === 0 && p.first === '1976-01' && p.last === '2026-10');
  const S = L.smooth13(v);
  check('solar cycle: 13-month mean as numpy (start)', R.S40.every((x, i) => (x === null ? Number.isNaN(S[i]) : near(S[i], x, 1e-10))));
  check('solar cycle: 13-month mean as numpy (end, last 6 months empty)', R.Send.every((x, i) => (x === null ? Number.isNaN(S[S.length - 20 + i]) : near(S[S.length - 20 + i], x, 1e-8))));
  check('solar cycle: a flat series stays flat, and a gap empties 13 months', (() => { const s = L.smooth13([...Array(30).fill(10), NaN, ...Array(30).fill(10)]); return near(s[10], 10, 1e-12) && s.filter((x) => Number.isNaN(x)).length === 6 + 6 + 13; })());
  { let s = 7; const u = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const rnd = Array.from({ length: 400 }, (_, i) => 50 + 40 * Math.sin(i / 20) + 30 * u()), e = L.findExtremes(L.smooth13(rnd), 15);
    check('solar cycle: minima and maxima on a random series as scipy argrelmin + argmax', JSON.stringify(e.minima) === JSON.stringify(R.rminima) && JSON.stringify(e.maxima) === JSON.stringify(R.rmaxima)); }
  const r = L.analyse(p.pts, { gapYears: 7, c: 0.7, firstNumber: 21, fitTo: 'monthly', method: 'auto', level: 0.95, draws: 4000, seed: 5 });
  check('solar cycle: example minima and maxima as scipy', JSON.stringify(r.ext.minima) === JSON.stringify(R.minima) && JSON.stringify(r.ext.maxima) === JSON.stringify(R.maxima) && !r.ext.lastMaxIsPeak);
  check('solar cycle: four complete cycles, numbered from 21, and one in progress', r.cycles.length === 5 && r.cycles[0].n === 21 && r.cycles.filter((c) => c.complete).length === 4 && r.current === r.cycles[4]);
  check('solar cycle: lengths and rise times from the minima and maxima', r.cycles.slice(0, 4).every((c, i) => near(c.length, (R.minima[i + 1] - R.minima[i]) / 12, 1e-9) && near(c.rise, (R.maxima[i] - R.minima[i]) / 12, 1e-9)) && near(r.meanLen, (R.minima[4] - R.minima[0]) / 48, 1e-9));
  for (const key of ['monthly', 'smoothed']) {
    const rr = key === 'monthly' ? r : L.analyse(p.pts, { gapYears: 7, c: 0.7, firstNumber: 1, fitTo: 'smoothed', method: 'free', level: 0.95 });
    check(`solar cycle: shape fitted to each cycle (${key}) as scipy curve_fit`, rr.cycles.slice(0, 4).every((c, i) => { const f = R.fits[key][i].p; return rel(c.fit.p.a, f[0], 2e-6) && rel(c.fit.p.b, f[1], 2e-6) && near(c.fit.p.t0, f[2], 2e-5); }));
    check(`solar cycle: parameter covariance (${key}) as scipy pcov`, rr.cycles.slice(0, 4).every((c, i) => R.fits[key][i].cov.every((row, x) => row.every((q, z) => rel(c.fit.cov[x][z], q, 2e-3)))));
  }
  check('solar cycle: peak of the shape as minimize_scalar for c = 0, 0.3, 0.5, 0.7, 0.9', [0, 0.3, 0.5, 0.7, 0.9].every((c, i) => near(L.peakX(c), R.peakx[i], 2e-8)) && near(L.peakX(0), Math.sqrt(1.5), 1e-12));
  check('solar cycle: the made-up cycles are found back (peaks within 10 %)', r.cycles.slice(0, 4).every((c, i) => rel(L.peakOf(c.fit.p).v, L.EXAMPLE_CYCLES[i + 1].A, 0.1) && near(c.fit.p.t0, L.EXAMPLE_CYCLES[i + 1].t0, 0.3)));
  // Forecasts
  const bandOk = (fc, ref, lo = 'lo', hi = 'hi', tol = 0.06) => R.sub.every((g, j) => { const w = Math.max(ref[hi][j] - ref[lo][j], 1); return near(fc.lo[g], ref[lo][j], tol * w) && near(fc.hi[g], ref[hi][j], tol * w); });
  { const fc = r.fc, ref = R.fc.past;
    check('solar cycle: past-shape fit uses the mean b of the four cycles (as numpy)', r.method === 'past' && near(fc.fit.p.b, ref.mb, 1e-6) && rel(fc.fit.p.a, ref.p[0], 1e-5) && near(fc.fit.p.t0, ref.p[1], 1e-5));
    check('solar cycle: past-shape 95 % band as an independent numpy Monte Carlo', fc.used > 3900 && bandOk(fc, ref, 'lo', 'hi', 0.08));
    check('solar cycle: past-shape peak time and height intervals as numpy', near(fc.peakT[1], ref.pT[0], 0.05) && near(fc.peakT[2], ref.pT[1], 0.05) && near(fc.peakV[1], ref.pV[0], 1.5) && near(fc.peakV[2], ref.pV[1], 1.5)); }
  { const rf = L.analyse(p.pts, { gapYears: 7, c: 0.7, firstNumber: 1, fitTo: 'monthly', method: 'free', level: 0.95, draws: 4000, seed: 5 }), fc = rf.fc, ref = R.fc.free;
    check('solar cycle: free fit of the current cycle as scipy curve_fit', rel(fc.fit.p.a, ref.p[0], 1e-5) && rel(fc.fit.p.b, ref.p[1], 1e-5) && near(fc.fit.p.t0, ref.p[2], 1e-5));
    check('solar cycle: free-fit 95 % band as numpy covariance draws', bandOk(fc, ref));
    check('solar cycle: free-fit peak intervals as numpy', near(fc.peakT[1], ref.pT[0], 0.05) && near(fc.peakT[2], ref.pT[1], 0.05) && near(fc.peakV[1], ref.pV[0], 2) && near(fc.peakV[2], ref.pV[1], 1.5));
    const r68 = L.analyse(p.pts, { gapYears: 7, c: 0.7, firstNumber: 1, fitTo: 'monthly', method: 'free', level: 0.68, draws: 4000, seed: 5 });
    check('solar cycle: 68 % band as numpy', bandOk(r68.fc, ref, 'lo68', 'hi68'));
    const again = L.analyse(p.pts, { gapYears: 7, c: 0.7, firstNumber: 1, fitTo: 'monthly', method: 'free', level: 0.95, draws: 4000, seed: 5 });
    check('solar cycle: same seed, same band', again.fc.lo.every((x, i) => x === fc.lo[i])); }
  // Reading pasted data
  { const a = L.parseSeries('date,value\n2020-01,5\n2020-03, 7\n2020/02,6\n2020-04-15,-1\n2020-05,');
    check('solar cycle: dates as 2020-01, 2020/02 and 2020-04-15; header skipped; -1 and blank are missing', a.pts.length === 5 && a.pts[1].v === 6 && Number.isNaN(a.pts[3].v) && a.gaps === 2 && !a.bad.length); }
  { const a = L.parseSeries('1749;01;1749.042;  96.7; -1.0;   -1;1\n1749;02;1749.123; 104.3; -1.0;   -1;1'), b = L.parseSeries('2001 3 80\n2001  4  81\n2001 6 82');
    check('solar cycle: year;month;decimal year;value lines and "year month value"', a.pts.length === 2 && a.pts[0].v === 96.7 && a.pts[1].v === 104.3 && b.pts.length === 4 && b.pts[3].v === 82 && b.gaps === 1); }
  { const a = L.parseSeries('2001.042 10\n2001.125 11\n2001.208 12');
    check('solar cycle: decimal years go to their month', a.pts.length === 3 && a.first === '2001-01' && a.last === '2001-03'); }
  { const a = L.parseSeries('2001-01,4\nhello,5\n2001-02,x\n2001-01,9');
    check('solar cycle: bad lines are named (no date, not a number, given twice)', a.bad.length === 3 && a.bad[0].includes('no date') && a.bad[1].includes('not a number') && a.bad[2].includes('twice') && a.pts[0].v === 4); }
  { const short = L.parseSeries(L.exampleSeries().split('\n').slice(0, 300).join('\n'));
    const rr = L.analyse(short.pts, { gapYears: 7, c: 0.7, firstNumber: 1, fitTo: 'monthly', method: 'past', level: 0.95 });
    check('solar cycle: past shape needs two fitted cycles', rr.cycles.length === 2 && !rr.fc && rr.note.includes('at least two')); }
};
