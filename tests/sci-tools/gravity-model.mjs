// Gravity model: haversine distances against scikit-learn's haversine_distances, log-linear OLS against
// statsmodels OLS, and PPML against statsmodels GLM(Poisson) with cov_type='HC0' (scratch script
// grav_check.py, 2026-11-09). Made-up towns and flows.
import { haversine, predict, fitGravity } from '../../src/lib/sci/gravitymodel.ts';

export const PLACES = { 'Ashford Bay': [820, 46.2, 3.1], Brimley: [310, 46.95, 4.4], Coldwater: [145, 45.6, 4.95], Dunmore: [560, 47.4, 2.3], Elmstead: [95, 46.7, 5.8], Fairhaven: [230, 45.35, 2.6], Greywick: [60, 47.85, 4.1] };
export const FLOWS = [['Ashford Bay', 'Brimley', 371], ['Ashford Bay', 'Coldwater', 94], ['Ashford Bay', 'Dunmore', 485], ['Ashford Bay', 'Elmstead', 44], ['Ashford Bay', 'Fairhaven', 408], ['Ashford Bay', 'Greywick', 53], ['Brimley', 'Ashford Bay', 165], ['Brimley', 'Coldwater', 54], ['Brimley', 'Dunmore', 152], ['Brimley', 'Elmstead', 53], ['Brimley', 'Fairhaven', 64], ['Brimley', 'Greywick', 66], ['Coldwater', 'Ashford Bay', 120], ['Coldwater', 'Brimley', 61], ['Coldwater', 'Dunmore', 45], ['Coldwater', 'Elmstead', 53], ['Coldwater', 'Fairhaven', 30], ['Coldwater', 'Greywick', 10], ['Dunmore', 'Ashford Bay', 628], ['Dunmore', 'Brimley', 224], ['Dunmore', 'Coldwater', 46], ['Dunmore', 'Elmstead', 21], ['Dunmore', 'Fairhaven', 61], ['Dunmore', 'Greywick', 53], ['Elmstead', 'Ashford Bay', 36], ['Elmstead', 'Brimley', 63], ['Elmstead', 'Coldwater', 39], ['Elmstead', 'Dunmore', 14], ['Elmstead', 'Fairhaven', 21], ['Elmstead', 'Greywick', 6], ['Fairhaven', 'Ashford Bay', 372], ['Fairhaven', 'Brimley', 39], ['Fairhaven', 'Coldwater', 40], ['Fairhaven', 'Dunmore', 30], ['Fairhaven', 'Elmstead', 0], ['Fairhaven', 'Greywick', 9], ['Greywick', 'Ashford Bay', 19], ['Greywick', 'Brimley', 60], ['Greywick', 'Coldwater', 0], ['Greywick', 'Dunmore', 40], ['Greywick', 'Elmstead', 8], ['Greywick', 'Fairhaven', 10]];

export default async (check) => {
  const close = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const allClose = (a, b, tol) => a.length === b.length && a.every((x, i) => close(x, b[i], tol));
  const pairs = FLOWS.map(([o, d, flow]) => { const [mo, la, lo] = PLACES[o], [md, lb, lob] = PLACES[d]; return { o, d, mo, md, flow, dist: haversine(la, lo, lb, lob) }; });
  check('gravity: haversine matches scikit-learn', allClose(pairs.slice(0, 3).map((p) => p.dist), [129.72227170748718, 157.93461758171802, 146.6703229453607], 1e-12));
  check('gravity: haversine pole to equator is a quarter circle', close(haversine(90, 0, 0, 0), Math.PI / 2 * 6371.0088, 1e-12) && haversine(10, 20, 10, 20) === 0);
  check('gravity: predict', close(predict({ k: 2, a: 1, b: 0.5, c: 2 }, 100, 400, 10), 2 * 100 * 20 / 100, 1e-12));
  const f = fitGravity(pairs);
  check('gravity: OLS coefficients match statsmodels', allClose(f.ols.coefs.map((c) => c.est), [4.240116678785988, 0.838162942307364, 0.6855066736606152, -1.6532994068362663], 1e-9));
  check('gravity: OLS standard errors match statsmodels', allClose(f.ols.coefs.map((c) => c.se), [1.1053290563710376, 0.0649791321758407, 0.06404688758811758, 0.16856800971705693], 1e-9));
  check('gravity: OLS p-values match statsmodels', close(f.ols.coefs[0].p, 0.000485037197130633, 1e-6) && close(f.ols.coefs[3].p, 1.0403851668631865e-11, 1e-4));
  check('gravity: OLS R² and adjusted R²', close(f.ols.r2, 0.915894904991702, 1e-10) && close(f.ols.adjR2, 0.9088861470743439, 1e-10) && f.ols.n === 40 && f.ols.dropped === 2);
  check('gravity: PPML coefficients match statsmodels GLM Poisson', allClose(f.ppml.coefs.map((c) => c.est), [2.944633998245889, 0.9493048382023841, 0.8161456589632714, -1.662467120562121], 1e-8) && f.ppml.converged);
  check('gravity: PPML robust (HC0) standard errors match statsmodels', allClose(f.ppml.coefs.map((c) => c.se), [1.1165318469412258, 0.055746339978509064, 0.08756508503838976, 0.13619906907005908], 1e-7));
  check('gravity: PPML p-value and deviance', close(f.ppml.coefs[0].p, 0.008356788261675066, 1e-5) && close(f.ppml.deviance, 350.18453604228984, 1e-9));
  check('gravity: PPML pseudo R² (squared correlation)', close(f.ppml.pseudoR2, 0.9241668751025593, 1e-9));
  check('gravity: PPML fitted flows', allClose(f.ppml.predicted.slice(0, 3), [367.6484239573904, 142.57084221122741, 485.7187324942421], 1e-8));
  check('gravity: PPML keeps zero flows, totals match (Poisson property)', f.ppml.n === 42 && close(f.ppml.predicted.reduce((s, x) => s + x, 0), pairs.reduce((s, p) => s + p.flow, 0), 1e-8));
  check('gravity: distance exponent c is minus the ln d coefficient', close(f.ppml.params.c, 1.662467120562121, 1e-8) && close(f.ols.params.k, Math.exp(4.240116678785988), 1e-9));
  const g = fitGravity(pairs, true);
  check('gravity: one mass exponent, OLS', allClose(g.ols.coefs.map((c) => c.est), [4.268425405011004, 0.7604439691800335, -1.6558486611165706], 1e-9) && allClose(g.ols.coefs.map((c) => c.se), [1.1423930408181682, 0.051798359229239865, 0.17423098938115816], 1e-9));
  check('gravity: one mass exponent, PPML', allClose(g.ppml.coefs.map((c) => c.est), [2.9684186151351333, 0.88111596370902, -1.6627934805105224], 1e-8) && allClose(g.ppml.coefs.map((c) => c.se), [1.0839610753840856, 0.06020389959102462, 0.14103474804864566], 1e-7));
  let m = '';
  try { fitGravity([{ ...pairs[0], dist: 0 }, ...pairs.slice(1)]); } catch (e) { m = e.message; }
  check('gravity: zero distance refused', /Distance must be above zero/.test(m));
};
