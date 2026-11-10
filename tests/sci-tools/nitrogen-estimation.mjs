// #1364 Nitrogen estimation (Dumas and Kjeldahl). Checked against independent hand calculations in Python:
// Dumas 0.30 g, 50 mL N₂ at 300 K and 715 mm Hg → V(STP) 42.8059 mL, 17.8358 % N; same over water with aqueous
// tension 27 mm Hg → 17.162 %; Kjeldahl 0.50 g, 10 mL 0.5 M H₂SO₄ → 28 %; back titration 1.0 g, 50 mL 0.5 M H₂SO₄,
// 60 mL 0.5 M NaOH → 28 %; urea 46.667 % from its formula.
import * as N from '../../src/lib/sci/nitrogen-estimation.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const d = N.dumas(0.3, 50, 300, 715);
  check('nitrogen: Dumas V at STP 42.8059 mL, 17.8358 % (Python)', near(d.v0, 42.80592105263158) && near(d.pct, 17.835800438596493));
  check('nitrogen: Dumas over water subtracts aqueous tension', near(N.dumas(0.3, 50, 300, 715, 27).pct, 17.16228070175439) && N.dumas(0.3, 50, 300, 715, 27).pDry === 688);
  check('nitrogen: Kjeldahl direct, H₂SO₄ basicity 2 → 28 %', near(N.kjeldahl(0.5, 0.5, 10, 2).pct, 28) && N.kjeldahl(0.5, 0.5, 10, 2).mmolNH3 === 10);
  check('nitrogen: Kjeldahl back titration → 28 %', near(N.kjeldahl(1, 0.5, 50, 2, 0.5, 60).pct, 28) && N.kjeldahl(1, 0.5, 50, 2, 0.5, 60).mmolNH3 === 20);
  check('nitrogen: Kjeldahl with HCl (basicity 1)', near(N.kjeldahl(0.25, 0.1, 25, 1).pct, 14));
  check('nitrogen: urea 46.667 %, glycine 18.667 % from formula', near(N.pctFromFormula(2, 60), 46.666666666666664) && near(N.pctFromFormula(1, 75), 18.666666666666668));
};
