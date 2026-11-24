// #T77 Variable star log: differential photometry from counts, the Argelander step estimate and Julian dates.
// Pinned by the article on the variables of NGC 663 (Xiao, Wang and Deng 2026, Universe 12(1): 9,
// doi:10.3390/universe12010009), whose amplitudes run from 0.014 to 0.330 magnitudes.
import { differential, fractionEstimate, jd, msFromJd, toExtended, parseAavso } from '../../src/lib/astro/aavso.ts';

export default async (check) => {
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  // V = Ccat + 2.5 log10(comparison counts / variable counts).
  const m = (counts) => differential(counts, 2.0e5, 11.42);
  check('aavso: 190000 counts against a 200000-count comparison at 11.42 is 11.4757', near(m(1.9e5), 11.4757, 0.0002));
  check('aavso: 184000 counts is 11.5105, a 0.0348 mag drop', near(m(1.84e5), 11.5105, 0.0002) && near(m(1.84e5) - m(1.9e5), 0.0348, 0.0002));
  check('aavso: equal counts give the comparison magnitude back', near(m(2.0e5), 11.42, 1e-12));
  // A 0.014 mag amplitude is a 1.28 % change in flux.
  check('aavso: 0.014 mag is a 1.28 % flux change', near(100 * (1 - 10 ** (-0.4 * 0.014)), 1.28, 0.01));
  // Argelander steps: 3 steps below 11.2 and 4 above 11.9.
  check('aavso: a 3:4 step estimate between 11.2 and 11.9 is 11.500', near(fractionEstimate(11.2, 11.9, 3, 4), 11.5, 1e-9));
  // Julian dates both ways.
  check('aavso: J2000.0 is JD 2451545.0 and converts back', near(jd(Date.UTC(2000, 0, 1, 12)), 2451545, 1e-9) && near(msFromJd(2451545), Date.UTC(2000, 0, 1, 12), 1e-6));
  // One observation written in the AAVSO extended format and read back.
  const obs = [{ name: 'NGC 663 V10', jd: r(jd(Date.UTC(2026, 10, 24, 20, 30))), mag: 11.5105, err: 0.02, filter: 'V', cmag: 11.42, comp1: 'comp-1' }];
  const back = parseAavso(toExtended(obs, 'xyz', 'CCD')).obs[0];
  check('aavso: the extended row keeps the magnitude (to 3 decimals), error, filter and comparison magnitude', near(back.mag, 11.511, 1e-9) && back.err === 0.02 && back.filter === 'V' && near(back.cmag, 11.42, 1e-9));
};
const r = (v) => Math.round(v * 1e5) / 1e5;
