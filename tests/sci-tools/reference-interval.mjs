// #502 Reference interval: percentiles against numpy (method 'weibull' = CLSI rank p(n+1)), rank CIs against
// scipy.stats.binom, Box-Cox lambda against scipy.stats.boxcox, parametric limits and exact CIs against
// scipy.stats.nct, skewness/kurtosis against scipy.stats (bias=False). References in reference-interval.ref.json
// (made by /tmp/claude-0/a4/ri_ref.py; the example is the page's made-up data).
import { readFileSync } from 'node:fs';
import { referenceInterval, rankCi, rankPercentile, boxcoxLambda, tukey, dixon, harrisBoyd, binomCdf } from '../../src/lib/sci/refint.ts';

export default async (check) => {
  const R = JSON.parse(readFileSync(new URL('./reference-interval.ref.json', import.meta.url), 'utf8'));
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const same = (name, got, ref, tr, tol = 1e-6) => {
    const bad = [];
    if (!got.nonpar) { if ((got.n + 1) * (1 - got.coverage) / 2 >= 1) bad.push('nonparametric missing'); }
    else {
    if (!near(got.nonpar.lower, ref.lower, 1e-9) || !near(got.nonpar.upper, ref.upper, 1e-9)) bad.push('percentiles');
    if (JSON.stringify(got.nonpar.ranks) !== JSON.stringify(ref.ranks)) bad.push(`ranks ${got.nonpar.ranks} vs ${ref.ranks}`);
    if (ref.ranks && (got.nonpar.lowerCi.join() !== ref.lowerCi.join() || got.nonpar.upperCi.join() !== ref.upperCi.join())) bad.push('rank CIs');
    }
    const p = got.par, q = ref.par;
    if (!near(p.lambda, q.lam, 2e-5)) bad.push(`lambda ${p.lambda} vs ${q.lam}`);
    for (const k of ['lower', 'upper']) if (!near(p[k], q[k], tol)) bad.push(`${k} ${p[k]} vs ${q[k]}`);
    for (const k of ['lowerCi', 'upperCi']) for (const i of [0, 1]) if (!near(p[k][i], q[k][i], tol)) bad.push(`${k}[${i}] ${p[k][i]} vs ${q[k][i]}`);
    if (!near(got.skew, q.skew, 1e-5) || !near(got.kurt, q.kurt, 1e-5)) bad.push('shape');
    check(`${name} ${bad.join(', ')}`, bad.length === 0);
  };
  const rows = EXAMPLE.trim().split('\n').map((l) => l.split('\t'));
  const x = rows.map((r) => Number(r[0])), g = rows.map((r) => r[1]);
  for (const tr of ['none', 'log', 'boxcox']) same(`refint: example (240 made-up results) ${tr} = numpy/scipy`, referenceInterval(x, { transform: tr }), R.ex[tr], tr, tr === 'boxcox' ? 2e-5 : 1e-6);
  { const r = referenceInterval(x); check('refint: example nonparametric 13 to 44.97, CI ranks 2 and 11', r.nonpar.lower === 13 && r.nonpar.upper.toFixed(2) === '44.97' && r.nonpar.ranks.join() === '2,11'); }
  for (const [n, rk] of Object.entries(R.ranks)) check(`refint: 90 % CI ranks for n = ${n}: ${rk} (scipy binom)`, JSON.stringify(rankCi(Number(n), 0.025, 0.9)) === JSON.stringify(rk));
  check('refint: n = 120 gives ranks 1 and 7 (as CLSI EP28)', rankCi(120, 0.025).join() === '1,7');
  for (const [n, rk] of Object.entries(R.ranks95)) check(`refint: 95 % CI ranks for n = ${n}`, JSON.stringify(rankCi(Number(n), 0.025, 0.95)) === JSON.stringify(rk));
  R.cases.forEach((c, i) => {
    same(`refint: random case ${i + 1} (n ${c.x.length}, ${c.cov * 100} %, CI ${c.conf * 100} %) raw`, referenceInterval(c.x, { coverage: c.cov, ciConf: c.conf }), c.none, 'none');
    same(`refint: random case ${i + 1} log`, referenceInterval(c.x, { coverage: c.cov, ciConf: c.conf, transform: 'log' }), c.log, 'log');
    same(`refint: random case ${i + 1} Box-Cox`, referenceInterval(c.x, { coverage: c.cov, ciConf: c.conf, transform: 'boxcox' }), c.bc, 'boxcox', 3e-5);
  });
  check('refint: rank percentile interpolates (n = 9, p = 0.25: rank 2.5)', rankPercentile([1, 2, 3, 4, 5, 6, 7, 8, 9], 0.25) === 2.5 && Number.isNaN(rankPercentile([1, 2, 3], 0.025)));
  check('refint: binomial CDF', near(binomCdf(0, 120, 0.025), 0.975 ** 120, 1e-12) && binomCdf(-1, 5, 0.5) === 0 && binomCdf(5, 5, 0.5) === 1);
  { const t = tukey(x.map(Math.log)); check('refint: Tukey fences on logs = numpy', near(t.lo, R.tukeyLog[0], 1e-9) && near(t.hi, R.tukeyLog[1], 1e-9)); const fl = t.flagged.map((i) => x[i]).sort((a, b) => a - b); check(`refint: Tukey on logs flags 10, 118 and 140 (${fl})`, fl.join() === '10,118,140'); }
  { const t = tukey(x); check('refint: Tukey fences raw = numpy', near(t.lo, R.tukeyRaw[0], 1e-9) && near(t.hi, R.tukeyRaw[1], 1e-9)); }
  check('refint: Dixon flags a far value (gap 10 of range 14)', dixon([1, 2, 3, 4, 5, 15]).join() === '5');
  check('refint: Dixon repeats (two far values one after the other)', dixon([1, 2, 3, 4, 30, 100]).join() === '5,4');
  check('refint: Dixon leaves gaps of 1/3 or less', dixon([1, 2, 3, 4, 5, 7]).length === 0 && dixon([0, 1, 2, 3]).length === 0);
  check('refint: Dixon flags a low value', dixon([-20, 1, 2, 3, 4]).join() === '0');
  const xs = x.filter((v, i) => g[i] === 'F').map(Math.log), ys = x.filter((v, i) => g[i] === 'M').map(Math.log);
  { const h = harrisBoyd(xs, ys); check(`refint: Harris-Boyd on logs z = ${h.z.toFixed(3)}, z* = 3 (numpy) → partition`, near(h.z, R.hb.z, 1e-9) && near(h.zStar, 3, 1e-12) && near(h.sdRatio, R.hb.sdr, 1e-9) && h.partition); }
  { const h = harrisBoyd([1, 2, 3, 4, 5], [1.1, 2.1, 3.1, 4.1, 5.1]); check('refint: Harris-Boyd: similar groups are not split', !h.partition && near(h.zStar, 3 * Math.sqrt(5 / 120), 1e-12)); }
  check('refint: Harris-Boyd: SD ratio above 1.5 splits', harrisBoyd([1, 2, 3, 4, 5], [-1, 1.5, 3, 4.5, 7]).partition);
  check('refint: Box-Cox lambda of exact log-normal-like data near 0', Math.abs(boxcoxLambda([1, 2, 4, 8, 16, 32, 64].flatMap((v) => [v * 0.9, v, v * 1.1]))) < 0.2);
  let m = ''; try { referenceInterval([1, 2, 3]); } catch (e) { m = e.message; } check('refint: too few results message', m.includes('at least 10'));
  m = ''; try { referenceInterval([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { transform: 'log' }); } catch (e) { m = e.message; } check('refint: log needs positive values', m.includes('above zero'));
};

const EXAMPLE = `20	F
18	F
18	M
16	M
31	M
38	M
30	F
26	F
48	M
37	M
36	M
28	F
13	F
27	M
32	F
15	M
25	M
19	F
20	M
23	M
30	M
14	F
26	M
30	M
21	M
24	M
27	M
16	F
24	M
42	M
38	F
28	M
36	M
26	F
17	M
35	M
18	F
19	F
29	F
27	M
20	M
22	F
41	M
27	F
44	F
17	F
26	M
28	M
26	M
27	F
22	F
15	F
23	M
20	M
16	F
18	F
31	M
30	M
13	F
24	F
25	M
32	M
34	F
20	M
15	F
27	F
21	F
50	M
13	M
20	F
46	F
13	F
32	F
16	F
32	M
38	F
15	F
32	M
18	M
17	M
20	F
29	M
45	M
22	F
35	M
18	F
20	F
18	F
16	F
27	F
34	M
14	F
20	F
23	F
16	F
23	F
28	M
29	F
15	M
27	F
27	M
18	F
38	M
32	M
24	M
31	F
25	M
34	F
27	M
21	F
22	M
22	M
29	M
38	M
14	F
23	F
20	F
20	M
18	F
27	M
38	F
37	M
19	M
17	M
28	M
26	F
28	F
40	M
25	F
22	M
22	F
27	M
41	M
23	M
31	M
26	M
21	F
34	M
13	F
11	F
19	M
32	M
25	F
32	F
24	F
15	F
21	F
19	F
25	M
23	M
21	F
22	F
27	M
22	F
10	F
19	F
20	M
140	F
25	M
11	F
38	M
28	M
28	M
29	M
23	M
25	M
17	F
32	M
21	F
25	M
18	M
27	F
19	M
27	F
15	F
28	M
19	F
22	F
21	M
36	M
22	F
30	F
28	F
36	M
11	F
21	F
31	F
20	F
26	M
21	F
31	M
39	M
30	F
25	F
18	F
21	M
22	F
15	F
34	M
24	M
29	M
43	M
21	M
33	F
32	M
24	M
11	F
23	M
22	M
24	M
13	F
19	F
25	M
31	F
18	M
27	F
25	F
14	F
19	F
23	F
33	F
26	F
26	M
21	F
28	M
14	F
31	F
13	F
31	M
24	M
28	M
26	F
22	F
25	M
17	M
18	F
31	M
27	M
30	F
118	M
`;
