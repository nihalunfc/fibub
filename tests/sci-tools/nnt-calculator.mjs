// #465 NNT calculator. Reference values from statsmodels 0.15 (confint_proportions_2indep 'newcomb' and 'wald',
// Table2x2 riskratio_confint and oddsratio_confint) and SciPy chi2_contingency; NNT limits by Altman (1998).
import * as N from '../../src/lib/sci/nnt.ts';

const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async (check) => {
  const r = N.compare(30, 250, 50, 250);
  check('nnt: risks and difference', near(r.p1, 0.12) && near(r.p2, 0.2) && near(r.rd, -0.08));
  check('nnt: Newcombe hybrid score limits (statsmodels newcomb)', near(r.rdCI[0], -0.14411672944007398) && near(r.rdCI[1], -0.015637124007068195));
  check('nnt: Wald limits', (() => { const w = N.rdCI(30, 250, 50, 250, 'wald'); const se = Math.sqrt(0.12 * 0.88 / 250 + 0.2 * 0.8 / 250); return near(w[0], -0.08 - 1.959963984540054 * se) && near(w[1], -0.08 + 1.959963984540054 * se); })());
  check('nnt: RR and log limits (statsmodels Table2x2)', near(r.rr, 0.6) && near(r.rrCI[0], 0.39529070487145557) && near(r.rrCI[1], 0.9107221484427979));
  check('nnt: RRR 40 % (8.9 % to 60.5 %)', near(r.rrr, 0.4) && near(r.rrrCI[0], 0.08927785155720214) && near(r.rrrCI[1], 0.6047092951285444));
  check('nnt: OR and chi-square p (scipy)', near(r.orCI[0], 0.3336678045943069) && near(r.p, 0.014697421770023473));
  check('nnt: NNTB 12.5 (6.94 to 64.0)', r.nnt.kind === 'benefit' && near(r.nnt.nnt, 12.5) && r.nnt.ci.kind === 'benefit' && near(r.nnt.ci.lo, 6.938819690713394) && near(r.nnt.ci.hi, 63.95037857012493));
  const g = N.compare(30, 250, 50, 250, { outcome: 'good' });
  check('nnt: a good outcome that falls is harm (NNTH)', g.nnt.kind === 'harm' && g.nnt.ci.kind === 'harm' && near(g.nnt.ci.lo, 6.938819690713394));
  const x = N.compare(15, 100, 18, 100);
  check('nnt: interval crossing zero, Altman form NNTB 7.48 to ∞ to NNTH 13.5', x.nnt.ci.kind === 'cross' && near(x.nnt.ci.nntb, 7.479215655357983) && near(x.nnt.ci.nnth, 13.500841561819781));
  const xw = N.compare(15, 100, 18, 100, { method: 'wald' });
  check('nnt: Wald crossing zero', xw.nnt.ci.kind === 'cross' && near(xw.nnt.ci.nntb, 7.5301168371458935) && near(xw.nnt.ci.nnth, 13.736251607829047));
  const p = N.patientNNT(0.4, r.rrr, r.rrrCI);
  check('nnt: patient with 40 % baseline risk: NNT 6.25 (4.13 to 28.0)', near(p.nnt, 6.25) && p.ci.kind === 'benefit' && near(p.ci.lo, 4.134217912870959) && near(p.ci.hi, 28.002465968820935));
  const z = N.compare(0, 30, 4, 31);
  check('nnt: zero events: RR 0 without log limits, NNT still given', z.rr === 0 && Number.isNaN(z.rrCI[0]) && near(z.nnt.nnt, 31 / 4));
  check('nnt: equal risks give an infinite NNT', N.compare(10, 100, 10, 100).nnt.nnt === Infinity && N.compare(10, 100, 10, 100).nnt.kind === 'none');
};
