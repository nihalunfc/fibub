// #194 Growth curve (OD600) against the published Enterobacter sp. SM3 growth rates (Pollack-Milgate, Saitia and Tang
// 2024, BMC Microbiology 24, 403, doi:10.1186/s12866-024-03547-3). Used by the discoveries article
// src/blog/discoveries/enterobacter-sm3-doubling-time-od600-cfu.md.
import { analyse, LN2 } from '../../src/lib/sci/growthcurve.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // Rate constants to doubling times, as reported: 1.99 per h (OD) is 21 min, 2.08 (RD) 20 min, 1.96 (CFU) 21 min,
  // E. coli RP437 1.40 per h about 30 min; the shift slope 1.079 h per tenfold dilution is 0.325 h = 19.5 min.
  check('growth SM3: published rates give the published doubling times (21, 20, 21, 30 min)',
    Math.round((LN2 / 1.99) * 60) === 21 && Math.round((LN2 / 2.08) * 60) === 20 && Math.round((LN2 / 1.96) * 60) === 21 && Math.round((LN2 / 1.40) * 60) === 30);
  check('growth SM3: shift slope 1.079 h per tenfold dilution is a doubling time of 0.325 h (19.5 min)', near(1.079 * Math.log10(2), 0.325, 0.0005) && near(1.079 * Math.log10(2) * 60, 19.5, 0.05));
  // The article's "check it yourself" table: flat at OD 0.02 until 1 h, then 0.02·e^(1.99 (t − 1)), rounded to 4 places.
  const t = [0, 0.5, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5], od = [0.02, 0.02, 0.02, 0.0329, 0.0541, 0.089, 0.1463, 0.2406, 0.3957];
  const r = analyse('SM3-like', t, od, 0, { window: 5, minOd: 0.01, model: 'none' });
  check('growth SM3: the article table gives 1.990 per h, 20.9 min and a 1.00 h lag', r.mu.toFixed(3) === '1.990' && (r.td * 60).toFixed(1) === '20.9' && r.lag.toFixed(2) === '1.00' && t[r.win[0]] === 1);
};
