// #407 Allometric body mass estimator. Reference values from statsmodels OLS on log10 X and log10 M
// (params, bse, rsquared, scale, get_prediction().summary_frame obs_ci and mean_ci) for the made-up example data.
import { fitAllometry, predict, fromEquation, readRows, EXAMPLE_REF, EXAMPLE_FOSSILS } from '../../src/lib/sci/allometry.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const r = readRows(EXAMPLE_REF, 2), f = fitAllometry(r.cols[0], r.cols[1]);
  check('allometry: example 12 specimens, header skipped', r.names.length === 12 && !r.errors.length && r.names[0] === 'Ref 1');
  check('allometry: a, b and their standard errors (statsmodels)', near(f.a, -2.85931304, 1e-8) && near(f.b, 2.43835146, 1e-8) && near(f.seA, 0.14239391, 1e-7) && near(f.seB, 0.06579187, 1e-7));
  check('allometry: r² and SEE (statsmodels)', near(f.r2, 0.9927722779183329, 1e-12) && near(f.see, 0.059213181329011176, 1e-12));
  check('allometry: %PE 10.4134, %SEE 14.6075 (numpy)', near(f.pe, 10.413380672441082, 1e-10) && near(f.seePct, 14.607537529336945, 1e-10));
  check('allometry: smearing 1.0077854, QMLE 1.0093381 (numpy)', near(f.smear, 1.0077854380313898, 1e-12) && near(f.qmle, 1.0093380902370683, 1e-12));
  const P = [[160, 0.95, 327.42070146899397, 238.5300840360851, 449.43729502157925, 299.3378209593352, 358.1382245881041],
    [65, 0.95, 36.408843731651544, 26.021399657321762, 50.942836255267714, 31.54812883384214, 42.01846356268925],
    [410, 0.95, 3247.6729540384536, 2282.0169694722745, 4621.954944897706, 2713.936951811409, 3886.3760668253694],
    [160, 0.9, 327.42070146899397, 253.0501921950433, 423.64842650590947, 304.38764403183035, 352.19667372318673]];
  for (const [x, lv, mean, lo, hi, cl, ch] of P) {
    const p = predict(f, x, 1, lv);
    check(`allometry: X = ${x}, ${lv * 100} % prediction and confidence intervals (statsmodels)`, near(p.mass, mean, 1e-10) && near(p.lo, lo, 1e-9) && near(p.hi, hi, 1e-9) && near(p.ciLo, cl, 1e-9) && near(p.ciHi, ch, 1e-9));
  }
  check('allometry: smearing applied to the estimate only; extrapolation flagged', near(predict(f, 160, f.smear).mass, 327.42070146899397 * 1.0077854380313898, 1e-10) && predict(f, 410).extrapolated && !predict(f, 160).extrapolated);
  check('allometry: typed equation, base 10 and base e', near(fromEquation(-2, 2.5, 100), 10 ** 3, 1e-12) && near(fromEquation(1, 3, Math.E ** 2, 'e', 1.1), Math.exp(7) * 1.1, 1e-12));
  { const fo = readRows(EXAMPLE_FOSSILS, 1), sp = readRows('Fossil A 160\nBig one 2.5', 1); check('allometry: fossil rows, names with spaces', fo.names.join() === 'Fossil A,Fossil B,Fossil C' && fo.cols[0].join() === '160,65,410' && sp.names.join() === 'Fossil A,Big one' && sp.cols[0].join() === '160,2.5'); }
  { const b = readRows('X,M\n10,5\n20\n-3,4\n30,40', 2); check('allometry: bad rows reported, unnamed rows numbered', b.errors.length === 2 && b.errors[1].includes('above zero') && b.names.join() === 'Specimen 1,Specimen 2'); }
  // An exact power law gives SEE 0, smearing 1 and b exactly.
  { const g = fitAllometry([1, 2, 4, 8], [3, 3 * 2 ** 1.5, 3 * 4 ** 1.5, 3 * 8 ** 1.5]); check('allometry: exact power law M = 3 X^1.5', near(g.b, 1.5, 1e-12) && near(10 ** g.a, 3, 1e-12) && g.see < 1e-12 && near(g.smear, 1, 1e-12)); }
};
