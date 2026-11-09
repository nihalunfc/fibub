// #469 meta-analysis: checked against statsmodels 0.15 (combine_effects with method_re 'chi2' = DerSimonian-Laird and
// 'iterated' = Paule-Mandel, effectsize_smd, effectsize_2proportions), REML by a scipy brentq root of the REML score,
// Egger's test by statsmodels OLS and the prediction interval by hand (Higgins 2009), on the tool's made-up examples
// and 10 random sets of 3 to 14 studies (two with zero cells).
import { parseStudies, metaAnalysis, twoByTwo, hedgesG, meanDiff, egger, tau2Of } from '../../src/lib/sci/meta.ts';

const BIN = 'Trial\tEvents (treated)\tTotal (treated)\tEvents (control)\tTotal (control)\nTrial A\t12\t120\t20\t118\nTrial B\t8\t85\t15\t90\nTrial C\t30\t310\t41\t305\nTrial D\t3\t46\t9\t50\nTrial E\t0\t25\t4\t27\nTrial F\t22\t200\t25\t195\nTrial G\t15\t140\t30\t142\nTrial H\t12\t60\t5\t58';
const CONT = 'Study\tMean 1\tSD 1\tn 1\tMean 2\tSD 2\tn 2\nStudy 1\t4.1\t1.8\t30\t5.0\t2.0\t31\nStudy 2\t3.8\t2.1\t45\t4.9\t2.2\t44\nStudy 3\t5.2\t1.9\t22\t5.4\t1.7\t25\nStudy 4\t3.5\t1.6\t60\t4.8\t1.9\t58\nStudy 5\t4.4\t2.4\t18\t5.6\t2.2\t20\nStudy 6\t4.0\t2.0\t80\t4.6\t2.1\t82';
const GEN = 'Study\tEffect\tSE\nStudy 1\t0.42\t0.15\nStudy 2\t0.18\t0.11\nStudy 3\t0.55\t0.21\nStudy 4\t0.05\t0.09\nStudy 5\t0.31\t0.13\nStudy 6\t0.62\t0.25\nStudy 7\t0.12\t0.08';
const HR = 'Trial\tHR\tLower\tUpper\nTrial 1\t0.78\t0.61\t1.00\nTrial 2\t0.65\t0.45\t0.94\nTrial 3\t0.91\t0.74\t1.12\nTrial 4\t0.70\t0.52\t0.95\nTrial 5\t1.05\t0.80\t1.38';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const run = (text, kind, opts, tau = 'DL') => { const p = parseStudies(text, kind, opts); return { p, r: metaAnalysis(p.studies.map((s) => s.y), p.studies.map((s) => s.v), tau) }; };
  // Binary, log odds ratio.
  const { p: pb, r: ob } = run(BIN, 'binary', { measure: 'OR' });
  check('meta: 8 trials parsed, Trial E zero-corrected', pb.studies.length === 8 && pb.corrected.join() === 'Trial E' && !pb.skipped.length);
  check('meta: log OR per trial = statsmodels effectsize_2proportions (Trial A −0.6079894, Trial E −2.2789026 with 0.5 added)', near(pb.studies[0].y, -0.6079893722, 1e-9) && near(pb.studies[4].y, -2.2789026084, 1e-9) && near(pb.studies[4].v, 2.303991099986, 1e-11));
  check(`meta: fixed effect log OR −0.4251071 (SE 0.1401308) = combine_effects; got ${ob.fixed.est}`, near(ob.fixed.est, -0.42510709766815147, 1e-12) && near(ob.fixed.se, 0.14013077730217335, 1e-12));
  check('meta: Q 10.991066 (p 0.139009), I² 0.363119', near(ob.Q, 10.99106556452805, 1e-10) && near(ob.pQ, 0.13900921173015396, 1e-10) && near(ob.I2, 0.3631190753159176, 1e-10));
  check('meta: DL tau² 0.0967840 and random effect −0.4346280 (SE 0.1900063)', near(ob.tau2, 0.09678396185606371, 1e-12) && near(ob.random.est, -0.4346279613257943, 1e-12) && near(ob.random.se, 0.190006313149633, 1e-12));
  check('meta: random OR 0.6475 (0.4462 to 0.9397), p 0.022170', near(Math.exp(ob.random.est), 0.6475055193670396, 1e-10) && near(Math.exp(ob.random.lo), 0.44617970061480133, 1e-9) && near(Math.exp(ob.random.hi), 0.9396738512152545, 1e-9) && near(ob.random.p, 0.022170178229762, 1e-9));
  check('meta: prediction interval log OR −1.326615 to 0.457359 (t with 6 df)', near(ob.pi[0], -1.326614968810505, 1e-9) && near(ob.pi[1], 0.4573590461589164, 1e-9));
  check('meta: Egger intercept −0.690683 (SE 1.199368), p 0.585637 = statsmodels OLS', near(ob.egger.intercept, -0.6906830100751136, 1e-10) && near(ob.egger.se, 1.1993680587866302, 1e-10) && near(ob.egger.p, 0.5856369625081272, 1e-10));
  const reml = run(BIN, 'binary', { measure: 'OR' }, 'REML').r, pm = run(BIN, 'binary', { measure: 'OR' }, 'PM').r;
  check('meta: REML tau² 0.00611016 (scipy root) and Paule-Mandel 0.180076 (statsmodels iterated)', near(reml.tau2, 0.006110159091841063, 1e-12) && near(reml.random.est, -0.4261424170789106, 1e-11) && near(pm.tau2, 0.18007622739887105, 2e-5) && near(pm.random.est, -0.4402252083479299, 2e-6));
  check('meta: weights add to 1', near(ob.weightsFixed.reduce((a, b) => a + b, 0), 1, 1e-12) && near(ob.weightsRandom.reduce((a, b) => a + b, 0), 1, 1e-12));
  // Risk ratio and risk difference.
  const rr = run(BIN, 'binary', { measure: 'RR' }).r, rd = run(BIN, 'binary', { measure: 'RD' }).r;
  check('meta: log RR fixed −0.3703210, DL tau² 0.0669058, random −0.3752753', near(rr.fixed.est, -0.3703209545219982, 1e-12) && near(rr.tau2, 0.06690576534390151, 1e-12) && near(rr.random.est, -0.37527530581551105, 1e-12));
  check('meta: RD fixed −0.0479069, I² 0.430470, random −0.0516712', near(rd.fixed.est, -0.047906855222766394, 1e-12) && near(rd.I2, 0.43046958833006677, 1e-10) && near(rd.random.est, -0.05167119624542265, 1e-12));
  // Continuous.
  const { p: ps, r: smd } = run(CONT, 'continuous', { measure: 'SMD' });
  check('meta: Hedges g = statsmodels effectsize_smd (Study 1 −0.4665759, var 0.0674990)', near(ps.studies[0].y, -0.4665759438, 1e-9) && near(ps.studies[0].v, 0.067498978566, 1e-11));
  check('meta: SMD fixed −0.4467210 (SE 0.0895214); DL tau² truncated at 0 (statsmodels gives −0.0027); REML tau² 0.00639978', near(smd.fixed.est, -0.4467209976473601, 1e-12) && near(smd.fixed.se, 0.08952137647224112, 1e-12) && smd.tau2 === 0 && smd.I2 === 0 && near(run(CONT, 'continuous', { measure: 'SMD' }, 'REML').r.tau2, 0.006399777213682191, 1e-12));
  const md = run(CONT, 'continuous', { measure: 'MD' }).r;
  check('meta: MD fixed −0.8974583 (−1.2358404 to −0.5590762), Q 4.496527', near(md.fixed.est, -0.8974583442875712, 1e-12) && near(md.fixed.lo, -1.2358404437677792, 1e-10) && near(md.fixed.hi, -0.5590762448073632, 1e-10) && near(md.Q, 4.496527480995425, 1e-10));
  // Generic estimate and SE.
  const gen = run(GEN, 'generic', {}).r;
  check('meta: generic DL random 0.2463069 (0.1109863 to 0.3816275), tau² 0.0156746, I² 0.511089', near(gen.random.est, 0.24630694683300838, 1e-12) && near(gen.random.lo, 0.11098634842789698, 1e-10) && near(gen.random.hi, 0.3816275452381198, 1e-10) && near(gen.tau2, 0.01567463714652967, 1e-12) && near(gen.I2, 0.5110893937498956, 1e-10));
  check('meta: generic Egger intercept 3.639217, p 0.00141091; PI −0.121219 to 0.613833', near(gen.egger.intercept, 3.639217417049676, 1e-9) && near(gen.egger.p, 0.0014109059123178838, 1e-10) && near(gen.pi[0], -0.121218738483887, 1e-9) && near(gen.pi[1], 0.6138326321499038, 1e-9));
  // Ratios with confidence intervals (log scale).
  const { p: ph, r: hr } = run(HR, 'ci', { log: true });
  check('meta: HR with CI to log HR and SE (Trial 1 var 0.0159008)', near(ph.studies[0].y, -0.2484613593, 1e-9) && near(ph.studies[0].v, 0.015900785689, 1e-11));
  check('meta: HR fixed 0.837127 (0.743757 to 0.942218); random 0.825801 (0.705450 to 0.966684), p 0.017239', near(Math.exp(hr.fixed.est), 0.8371265927964281, 1e-10) && near(Math.exp(hr.fixed.lo), 0.7437569299671559, 1e-9) && near(Math.exp(hr.random.est), 0.8258005134890672, 1e-10) && near(Math.exp(hr.random.lo), 0.705449504351669, 1e-9) && near(Math.exp(hr.random.hi), 0.966683630610157, 1e-9) && near(hr.random.p, 0.017238754959317017, 1e-9));
  check('meta: HR REML tau² 0.01229881, PM 0.01491521', near(tau2Of(ph.studies.map((s) => s.y), ph.studies.map((s) => s.v), 'REML'), 0.0122988064181444, 1e-12) && near(tau2Of(ph.studies.map((s) => s.y), ph.studies.map((s) => s.v), 'PM'), 0.014915207999237368, 2e-5));
  // Helpers and edge cases.
  check('meta: twoByTwo, meanDiff, hedgesG by hand', near(twoByTwo(10, 100, 20, 100, 'RR').y, Math.log(0.5), 1e-12) && near(twoByTwo(10, 100, 20, 100, 'RD').v, 0.09 / 100 + 0.16 / 100, 1e-15) && near(meanDiff(5, 2, 10, 3, 2, 10).v, 0.8, 1e-15) && near(hedgesG(1, 1, 10, 0, 1, 10).y, 1 - 3 / 71, 1e-12));
  check('meta: Egger needs 3 studies', egger([0.1, 0.2], [0.01, 0.02]) === null);
  const dz = parseStudies('A\t0\t20\t0\t22\nB\t3\t30\t5\t30\nC\t2\t25\t6\t24', 'binary', { measure: 'OR' });
  check('meta: double-zero trial left out of OR, kept for RD', dz.excluded.join() === 'A' && dz.studies.length === 2 && parseStudies('A\t0\t20\t0\t22\nB\t3\t30\t5\t30', 'binary', { measure: 'RD' }).studies.length === 2);
  const bad = parseStudies('X\t0.2\t0\nY\t0.1\t0.1\nZ\tabc\t0.2\nW\t0.3\t0.1', 'generic');
  check('meta: zero SE and text rows skipped with reasons', bad.studies.length === 2 && bad.skipped.length === 2 && bad.skipped[0].includes('above zero'));
  let msg = ''; try { metaAnalysis([0.1], [0.01]); } catch (e) { msg = e.message; }
  check('meta: one study message', msg.includes('at least two studies'));
  msg = ''; try { parseStudies('', 'generic'); } catch (e) { msg = e.message; }
  check('meta: empty message', msg.startsWith('Paste your studies'));
  const ci = parseStudies('A\t1.2\t1.5\t1.0', 'ci', { log: true });
  check('meta: reversed CI skipped', ci.studies.length === 0 && ci.skipped[0].includes('upper limit'));
};
