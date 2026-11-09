// #567 Design of experiments generator: maths checks.
// REF below was produced by an independent Python script (numpy, itertools, statsmodels 0.15.0, scipy), written apart
// from the TypeScript: minimum-aberration word-length patterns by exhaustive search over every generator set; effects
// and Lenth's PSE/ME/SME by hand with numpy and scipy.stats.t; statsmodels OLS for a replicated 2^3 with centre points
// (with a curvature term), for full quadratic fits of a rotatable CCD and a Box-Behnken design (stationary point by
// numpy.linalg.solve, eigenvalues by eigvalsh), and anova_lm(typ=2) for an additive 3 x 2 x 4 factorial. The
// responses are made up (simulated). Plackett-Burman rows are checked against the generating rows printed by Plackett
// and Burman (1946) for N = 12, 20 and 24, which the Paley construction reproduces.
import * as D from '../../src/lib/sci/doe.ts';
const REF = {"ma": {"4-1": [0, 0, 0, 0, 1], "5-1": [0, 0, 0, 0, 0, 1], "5-2": [0, 0, 0, 2, 1, 0], "6-1": [0, 0, 0, 0, 0, 0, 1], "6-2": [0, 0, 0, 0, 3, 0, 0], "6-3": [0, 0, 0, 4, 3, 0, 0], "7-1": [0, 0, 0, 0, 0, 0, 0, 1], "7-2": [0, 0, 0, 0, 1, 2, 0, 0], "7-3": [0, 0, 0, 0, 7, 0, 0, 0], "7-4": [0, 0, 0, 7, 7, 0, 0, 1], "8-2": [0, 0, 0, 0, 0, 2, 1, 0, 0], "8-3": [0, 0, 0, 0, 3, 4, 0, 0, 0], "8-4": [0, 0, 0, 0, 14, 0, 0, 0, 1], "9-4": [0, 0, 0, 0, 6, 8, 0, 0, 1, 0], "9-5": [0, 0, 0, 4, 14, 8, 0, 4, 1, 0], "10-5": [0, 0, 0, 0, 10, 16, 0, 0, 5, 0, 0], "11-7": [0, 0, 0, 12, 26, 28, 24, 20, 13, 4, 0, 0], "15-11": [0, 0, 0, 35, 105, 168, 280, 435, 435, 280, 168, 105, 35, 0, 0, 1]}, "frac": {"y": [50.81, 62.85, 42.59, 57.18, 42.54, 54.91, 49.77, 63.95, 44.41, 56.54, 36.57, 48.95, 36.24, 47.33, 46.8, 57.11], "effects": [12.386249999999997, 0.9112500000000026, 0.478749999999998, -0.15625, -0.3987500000000068, 8.24125, -0.22125000000000483, -6.331250000000004, -0.9087499999999977, 0.3162499999999966, -0.6112500000000054, 0.4087499999999977, -0.3787499999999966, 0.7012499999999946, -0.03625000000000256], "pse": 0.6056250000000034, "me": 1.5568086242072519, "sme": 3.1605456705608583}, "rep": {"y": [19.34, 22.42, 14.51, 19.94, 15.77, 28.12, 12.97, 22.43, 20.91, 23.93, 16.49, 20.16, 17.25, 25.25, 13.3, 23.45, 21.5, 23.19, 23.06], "params": {"Intercept": 19.76500000000002, "A": 3.4474999999999953, "B": -1.8587500000000021, "A:B": 0.14124999999999993, "C": 0.05250000000000171, "A:C": 1.5475000000000012, "B:C": 0.07875000000000186, "A:B:C": -0.2337500000000014, "ctr": 2.818333333333328}, "bse": {"Intercept": 0.2728789414129767, "A": 0.2728789414129765, "B": 0.27287894141297653, "A:B": 0.2728789414129765, "C": 0.27287894141297664, "A:C": 0.2728789414129766, "B:C": 0.2728789414129766, "A:B:C": 0.27287894141297664, "ctr": 0.686730276179973}, "p": {"Intercept": 6.138214383017552e-15, "A": 1.797859792835132e-07, "B": 4.6733249101489945e-05, "A:B": 0.6159738643237662, "C": 0.8512852884418638, "A:C": 0.00020638109203311244, "B:C": 0.7787890585169266, "A:B:C": 0.4117189936334206, "ctr": 0.0021309372383186624}, "sigma": 1.091515765651906, "df": 10.0}, "ccd": {"y": [70.51, 75.1, 72.54, 82.07, 80.13, 79.57, 79.93, 68.8, 79.82, 72.95, 78.73, 80.73, 79.97], "params": {"Intercept": 80.06600000000005, "A": 3.713079182168925, "B": 2.1467692988145526, "I(A ** 2)": -2.8830000000000053, "I(B ** 2)": -2.117999999999998, "A:B": 1.2350000000000256}, "bse": {"Intercept": 0.1750850011432896, "A": 0.13841684693649486, "B": 0.13841684693649484, "I(A ** 2)": 0.14843553160620673, "I(B ** 2)": 0.14843553160620673, "A:B": 0.19575098219851197}, "r2": 0.9954076875281894, "xs": [0.8026298637778362, 0.7407972569830509], "ys": 82.35127452305895, "eig": [-3.2268693963817725, -1.7741306036182307]}, "bbd": {"y": [11.47, 15.45, 9.93, 13.15, 10.04, 15.81, 12.87, 15.64, 13.28, 11.0, 14.21, 12.16, 9.98, 9.53, 10.43], "params": {"Intercept": 9.979999999999999, "A": 1.9674999999999985, "B": -1.021249999999999, "C": 0.5937499999999996, "I(A ** 2)": 1.72375, "I(B ** 2)": 0.7962499999999997, "I(C ** 2)": 1.8862500000000004, "A:B": -0.19000000000000014, "A:C": -0.75, "B:C": 0.05750000000000062}, "bse": {"Intercept": 0.21603626238820808, "A": 0.13229465219728279, "B": 0.1322946521972828, "C": 0.13229465219728276, "I(A ** 2)": 0.1947324553500692, "I(B ** 2)": 0.19473245535006922, "I(C ** 2)": 0.19473245535006922, "A:B": 0.18709289136682897, "A:C": 0.18709289136682897, "B:C": 0.18709289136682886}, "r2": 0.9898120228535504, "xs": [-0.6008947393260144, 0.57991031724286, -0.2856900988034394], "ys": 9.007938846363626, "eig": [0.7865301378839452, 1.4261903371353866, 2.193529524980668]}, "multi": {"y": [5.56, 6.65, 7.24, 3.47, 5.63, 7.38, 6.44, 7.71, 8.46, 4.83, 6.77, 8.46, 5.38, 6.87, 7.77, 4.3, 6.54, 7.48, 6.84, 9.15, 9.39, 6.09, 7.78, 8.3], "ss": [30.045224999999917, 4.532704166666686, 13.068645833333292], "F": [88.93492275614071, 26.833927516864325, 25.789100879643044], "p": [9.908008817825777e-10, 7.52991837845897e-05, 1.4799565128590634e-06], "sse": 2.871587500000001, "means": [[5.36375, 7.1375, 8.06], [7.288333333333334, 6.4191666666666665], [5.988333333333333, 7.111666666666667, 6.390000000000001, 7.925]]}};

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Minimum aberration.
  for (const [key, wlp] of Object.entries(REF.ma)) {
    const [k, p] = key.split('-').map(Number), f = D.bestFraction(k, p);
    check(`doe: 2^(${k}−${p}) word-length pattern ${f.wlp.slice(3).join(',')} is the minimum-aberration one`, f.wlp.join() === wlp.join());
  }
  const res = { '5-1': 5, '6-1': 6, '6-2': 4, '7-2': 4, '7-3': 4, '7-4': 3, '8-2': 5, '8-4': 4, '9-4': 4, '15-11': 3 };
  for (const [key, r] of Object.entries(res)) { const [k, p] = key.split('-').map(Number); check(`doe: 2^(${k}−${p}) has resolution ${r}`, D.bestFraction(k, p).resolution === r); }
  // Hand-derived: 2^(4-1) with D = ABC is I = ABCD; A is aliased with BCD and AB with CD.
  { const f = D.customFraction(4, 1, 'D=ABC'); check('doe: 2^(4−1) D=ABC gives I = ABCD', f.relation.map((w) => D.wordName(w)).join() === 'ABCD' && f.resolution === 4);
    const t = D.aliasTable(f); check('doe: 2^(4−1) aliases A = BCD and AB = CD', t.find((r) => r.effect === 'A').aliases.join() === 'BCD' && t.find((r) => r.effect === 'AB').aliases.join() === 'CD' && t.length === 7); }
  // Hand-derived: 2^(6-2) with E = ABC, F = BCD: I = ABCE = BCDF = ADEF.
  { const f = D.customFraction(6, 2, 'E=ABC, F=BCD'); check('doe: 2^(6−2) defining relation I = ABCE = ADEF = BCDF', f.relation.map((w) => D.wordName(w)).sort().join() === 'ABCE,ADEF,BCDF');
    const t = D.aliasTable(f); check('doe: 2^(6−2) AB = CE and AD = EF', t.find((r) => r.effect === 'AB').aliases.includes('CE') && t.find((r) => r.effect === 'AD').aliases.includes('EF'));
    const X = D.fractional(f); check('doe: every run satisfies each defining word (product of its columns = +1)', X.length === 16 && f.relation.every((w) => X.every((r) => r.reduce((s, v, j) => ((w >> j) & 1 ? s * v : s), 1) === 1))); }
  // Classic saturated 2^(7-4): D=AB, E=AC, F=BC, G=ABC has the same pattern as the search finds.
  check('doe: saturated 2^(7−4)_III from D=AB, E=AC, F=BC, G=ABC', D.customFraction(7, 4, 'D=AB, E=AC, F=BC, G=ABC').wlp.join() === REF.ma['7-4'].join());
  // Full factorial order (first factor fastest) and levels.
  check('doe: 2^3 in standard (Yates) order', D.ff2(3).map((r) => r.map((v) => (v > 0 ? '+' : '-')).join('')).join(' ') === '--- +-- -+- ++- --+ +-+ -++ +++');
  check('doe: 3 × 2 full factorial', D.fullFactorial([3, 2]).map((r) => r.join('')).join(' ') === '00 10 20 01 11 21');
  // Plackett-Burman: the published generating rows, orthogonality and balance.
  const pbRow = { 12: '++-+++---+-', 20: '++--++++-+-+----++-', 24: '+++++-+-++--++--+-+----' };
  for (const [N, row] of Object.entries(pbRow)) check(`doe: Plackett–Burman N = ${N} first row is ${row}`, D.plackettBurman(Number(N))[0].map((v) => (v > 0 ? '+' : '-')).join('') === row);
  for (const N of [8, 12, 16, 20, 24, 32, 40, 44, 48]) {
    const H = D.plackettBurman(N), m = N - 1;
    const orth = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => H.reduce((s, r) => s + r[i] * r[j], 0))).every((row, i) => row.every((v, j) => v === (i === j ? N : 0)));
    const bal = Array.from({ length: m }, (_, j) => H.reduce((s, r) => s + r[j], 0)).every((v) => v === 0);
    check(`doe: Plackett–Burman N = ${N}: ${m} balanced, orthogonal columns, last run all minus`, H.length === N && orth && bal && H[N - 1].every((v) => v === -1));
  }
  check('doe: sizes offered', D.pbSizes(48).join() === '4,8,12,16,20,24,32,40,44,48');
  // Central composite: α values and the properties they are meant to give.
  { const c = D.ccd(3, { alpha: 'rotatable', face: 'circumscribed', centerF: 4, centerA: 2 }), X = c.coded;
    const m4 = (i) => X.reduce((s, r) => s + r[i] ** 4, 0), m22 = (i, j) => X.reduce((s, r) => s + r[i] ** 2 * r[j] ** 2, 0);
    check('doe: rotatable CCD (k = 3): α = 8^¼ and [iiii] = 3 [iijj]', near(c.alpha, 8 ** 0.25, 1e-15) && near(m4(0), 3 * m22(0, 1), 1e-12) && X.length === 20); }
  { const o = { alpha: 'orthogonal', face: 'circumscribed', centerF: 4, centerA: 3 }, c = D.ccd(3, o), X = c.coded;
    const avg = (b) => { const rows = X.filter((_, i) => c.block[i] === b); return rows.reduce((s, r) => s + r[0] ** 2, 0) / rows.length; };
    check('doe: orthogonally blocked CCD: Σx² per run equal in both blocks', near(avg(1), avg(2), 1e-12) && near(c.alpha, Math.sqrt(3 * (1 + 3 / 6) / (1 + 4 / 8)), 1e-15)); }
  { const c = D.ccd(2, { alpha: 'rotatable', face: 'faced', centerF: 1, centerA: 1 }); check('doe: face-centred CCD has α = 1', c.alpha === 1 && c.coded.every((r) => r.every((v) => Math.abs(v) <= 1))); }
  { const c = D.ccd(2, { alpha: 'rotatable', face: 'inscribed', centerF: 1, centerA: 1 }); check('doe: inscribed CCD stays inside ±1 (corners at ±1/α)', near(Math.max(...c.coded.flat()), 1, 1e-15) && near(c.coded[3][0], 1 / 2 ** 0.5, 1e-15)); }
  { const c = D.ccd(5, { alpha: 'rotatable', face: 'circumscribed', centerF: 0, centerA: 0, half: true }); check('doe: CCD with a 2^(5−1) core: 16 + 10 runs, α = 2', c.coded.length === 26 && near(c.alpha, 2, 1e-15) && c.fraction.resolution === 5); }
  // Box-Behnken.
  { const b = D.boxBehnken(3, 3); check('doe: Box–Behnken k = 3: 12 edge midpoints + 3 centres', b.coded.length === 15 && b.coded.slice(0, 12).every((r) => r.filter((v) => v === 0).length === 1)); }
  check('doe: Box–Behnken sizes for 4 and 5 factors (27 and 46 runs)', D.boxBehnken(4, D.bbdCenters(4)).coded.length === 27 && D.boxBehnken(5, D.bbdCenters(5)).coded.length === 46);
  // Run order.
  { const a = D.runOrder(16, 7), b = D.runOrder(16, 7); check('doe: seeded run order is a repeatable permutation', a.join() === b.join() && [...a].sort((x, y) => x - y).join() === Array.from({ length: 16 }, (_, i) => i).join() && D.runOrder(16, 8).join() !== a.join()); }
  // Effects and Lenth on the unreplicated 2^(5-1).
  { const f = D.customFraction(5, 1, 'E=ABCD'), X = D.fractional(f), y = REF.frac.y;
    const cols = [], names = [];
    for (let r = 1; r < 16; r++) { cols.push(X.map((row) => row.slice(0, 4).reduce((s, v, j) => ((r >> j) & 1 ? s * v : s), 1))); names.push(D.wordName(r)); }
    const M = X.map((_, i) => cols.map((c) => c[i])), e = D.twoLevelEffects(M, y, names);
    check('doe: 15 effects of the 2^(5−1) = mean(+) − mean(−)', e.rows.every((r, j) => near(r.effect, REF.frac.effects[j], 1e-12)) && e.dfResid === 0);
    const L = D.lenth(e.rows.map((r) => r.effect));
    check(`doe: Lenth PSE ${L.pse}, ME and SME`, near(L.pse, REF.frac.pse, 1e-12) && near(L.me, REF.frac.me, 1e-10) && near(L.sme, REF.frac.sme, 1e-10)); }
  // Replicated 2^3 with centre points: t tests and curvature as statsmodels OLS.
  { const F = D.ff2(3), Xr = [...F, ...F, [0, 0, 0], [0, 0, 0], [0, 0, 0]], y = REF.rep.y;
    const words = [1, 2, 4, 3, 5, 6, 7], nm = { 1: 'A', 2: 'B', 4: 'C', 3: 'A:B', 5: 'A:C', 6: 'B:C', 7: 'A:B:C' };
    const M = Xr.map((r) => words.map((w) => r.reduce((s, v, j) => ((w >> j) & 1 ? s * v : s), 1)));
    const e = D.twoLevelEffects(M, y, words.map((w) => nm[w]), Xr.map((r) => r.every((v) => v === 0)));
    check('doe: replicated 2^3 coefficients, SEs and p-values = statsmodels', e.rows.every((r) => near(r.coef, REF.rep.params[r.name], 1e-10) && near(r.se / 2, REF.rep.bse[r.name], 1e-9) && near(r.p, REF.rep.p[r.name], 1e-8)) && e.dfResid === REF.rep.df && near(e.sigma, REF.rep.sigma, 1e-10));
    check('doe: curvature from the centre points', near(e.curvature.est, REF.rep.params.ctr, 1e-10) && near(e.curvature.p, REF.rep.p.ctr, 1e-8)); }
  // Quadratic response surfaces.
  const quadCheck = (key, coded, names) => {
    const q = D.quadratic(coded, REF[key].y, names), r = REF[key];
    const map = (n) => n === 'Intercept' ? n : n.endsWith('²') ? `I(${n[0]} ** 2)` : n.includes('·') ? n.replace('·', ':') : n;
    check(`doe: ${key} quadratic coefficients and SEs = statsmodels`, q.coefs.every((c) => near(c.est, r.params[map(c.name)], 1e-9) && near(c.se, r.bse[map(c.name)], 1e-9)) && near(q.r2, r.r2, 1e-12));
    check(`doe: ${key} stationary point, its value and the eigenvalues (${q.kind})`, q.stationary.every((v, i) => near(v, r.xs[i], 1e-9)) && near(q.yStationary, r.ys, 1e-10) && q.eigen.every((v, i) => near(v, r.eig[i], 1e-10)));
    return q;
  };
  { const c = D.ccd(2, { alpha: 'rotatable', face: 'circumscribed', centerF: 3, centerA: 2 }); const q = quadCheck('ccd', c.coded, ['A', 'B']); check('doe: the CCD example has a maximum', q.kind === 'maximum'); }
  { const b = D.boxBehnken(3, 3); const q = quadCheck('bbd', b.coded, ['A', 'B', 'C']); check('doe: the Box–Behnken example has a minimum', q.kind === 'minimum'); }
  // Multi-level main effects and ANOVA.
  { const lv = D.fullFactorial([3, 2, 4]), me = D.mainEffects(lv, REF.multi.y, ['A', 'B', 'C']);
    check('doe: main-effect means per level', me.means.every((f, j) => f.every((m, i) => near(m.mean, REF.multi.means[j][i], 1e-12))));
    check('doe: additive ANOVA sums of squares, F and p = anova_lm', me.anova.every((a, j) => near(a.ss, REF.multi.ss[j], 1e-10) && near(a.F, REF.multi.F[j], 1e-9) && near(a.p, REF.multi.p[j], 1e-7)) && near(me.sseError, REF.multi.sse, 1e-10)); }
  check('doe: Jacobi eigenvalues of [[2,1],[1,2]] are 1 and 3', D.jacobiEigen([[2, 1], [1, 2]]).every((v, i) => near(v, [1, 3][i], 1e-14)));
  // Bad input.
  const throws = (name, fn, re) => { try { fn(); check(name, false); } catch (e) { check(`${name} (${e.message})`, re.test(e.message)); } };
  throws('doe: wrong number of generators', () => D.customFraction(6, 2, 'E=ABC'), /Give 2 generators/);
  throws('doe: generator using an added factor', () => D.customFraction(6, 2, 'E=ABC, F=BCE'), /not one of the factors/);
  throws('doe: duplicate generators', () => D.customFraction(6, 2, 'E=ABC, F=ABC'), /same interaction/);
  throws('doe: main-effect generator refused', () => D.customFraction(5, 1, 'E=A'), /two or more/);
  throws('doe: impossible fraction', () => D.bestFraction(4, 3), /fewer than 2 base factors|not possible/);
  throws('doe: unsupported Plackett–Burman size', () => D.plackettBurman(28), /No 28-run/);
  throws('doe: quadratic needs enough runs', () => D.quadratic([[0, 0], [1, 1], [-1, 1]], [1, 2, 3], ['A', 'B']), /needs more than/);
};
