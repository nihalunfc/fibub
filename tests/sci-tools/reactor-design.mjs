// #665 reactor design: CSTR, PFR, CSTRs in series and batch. Reference values from an independent SciPy
// calculation written for these tests: scipy.integrate.solve_ivp (LSODA, rtol 1e-12) on dX/dV = -rA/FA0 for the
// PFR and dX/dt = -rA/CA0 for the batch reactor, scipy.integrate.quad, and scipy.optimize.brentq for the CSTR and
// tank-by-tank series balances, for five rate laws (2nd order with Arrhenius, 1st order with eps = 0.5,
// half order, reversible first order, saturating).
import * as R from '../../src/lib/sci/reactor.ts';
const REF = [{"k": 0.2932253025454063, "cstr": 682.0693789514629, "pfr": 136.41387579117108, "pfrQuad": 136.41387579029256, "batch": 13.64138757911713, "xc": 0.4475169009693854, "xp": 0.5945057989358162, "ser": [0.26442556691343966, 0.4256434820351383, 0.5324683264206735]}, {"k": 0.2, "cstr": 280.00000000000006, "pfr": 100.70784343282907, "pfrQuad": 100.70784343255752, "batch": 8.047189562175548, "xc": 0.44948974278317794, "xp": 0.5763182770324312, "ser": [0.23013858660780986, 0.3976292457760146, 0.5235095952748211]}, {"k": 0.1, "cstr": 219.08902300206643, "pfr": 135.4044627772846, "pfrQuad": 135.4044627772846, "batch": 13.540446277728455, "xc": 0.33333333333333337, "xp": 0.36658162379719633, "ser": [0.12713814687644664, 0.24535375680012517, 0.35467216960292614]}, {"k": 0.3, "cstr": 400.0, "pfr": 73.93569925995082, "pfrQuad": 73.9356992597275, "batch": 7.39356992599541, "xc": 0.5217391304347826, "xp": 0.6773160265238354, "ser": [0.3076923076923077, 0.49704142011834324, 0.6135639508420574]}, {"k": 0.8, "cstr": 45.00000000000001, "pfr": 30.05898695263945, "pfrQuad": 30.058986952713127, "batch": 3.005898695248684, "xc": 0.8246094703208938, "xp": 0.9828955689652804, "ser": [0.4566002258836544, 0.7734966810295223, 0.9259072574431544]}];
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(Math.abs(b), 1e-300);
  const cases = [{ kind: 'power', k: R.arrhenius(0.15, 60000, 323.15, 333.15), n: 2, CA0: 1, eps: 0 }, { kind: 'power', k: 0.2, n: 1, CA0: 2, eps: 0.5 }, { kind: 'power', k: 0.1, n: 0.5, CA0: 1.5, eps: 0 }, { kind: 'reversible', k: 0.3, K: 4, CA0: 1, eps: 0 }, { kind: 'mm', k: 0.8, Km: 0.5, CA0: 2, eps: 0 }];
  const names = ['2nd order', '1st order gas (eps 0.5)', 'half order', 'reversible 1st order', 'saturating'];
  check('reactor: Arrhenius k at 60 °C from 0.15 at 50 °C, Ea 60 kJ/mol', near(cases[0].k, REF[0].k, 1e-12));
  cases.forEach((c, i) => {
    const X = c.kind === 'reversible' ? 0.75 : 0.8, r = REF[i];
    check(`reactor: ${names[i]}: CSTR volume matches`, near(R.cstrVolume(c, 10, X), r.cstr, 1e-10));
    check(`reactor: ${names[i]}: PFR volume matches solve_ivp and quad`, near(R.pfrVolume(c, 10, X), r.pfr, 1e-9) && near(R.pfrVolume(c, 10, X), r.pfrQuad, 1e-9));
    check(`reactor: ${names[i]}: batch time matches solve_ivp`, near(R.batchTime(c, X), r.batch, 1e-9));
    check(`reactor: ${names[i]}: conversions in 50 L (CSTR, PFR) match`, near(R.cstrConversion(c, 10, 50), r.xc, 1e-10) && near(R.pfrConversion(c, 10, 50), r.xp, 1e-9));
    check(`reactor: ${names[i]}: three 16.7 L CSTRs in series match brentq tank by tank`, R.seriesConversions(c, 10, 3, 50 / 3).every((x, j) => near(x, r.ser[j], 1e-10)));
  });
  check('reactor: total volume of 3 CSTRs in series for X = 0.8 (2nd order) matches brentq (230.72 L)', near(R.seriesVolume(cases[0], 10, 3, 0.8), 230.7240680854094, 1e-9));
  check('reactor: same for the reversible case at X = 0.75 (121.59 L)', near(R.seriesVolume(cases[3], 10, 3, 0.75), 121.5873679831797, 1e-9));
  { const c = { kind: 'power', k: 0.2, n: 1, CA0: 1, eps: 0 };
    check('reactor: first order closed forms (CSTR τ = X/(k(1−X)), PFR τ = −ln(1−X)/k)', near(R.cstrVolume(c, 1, 0.9), 0.9 / (0.2 * 0.1), 1e-12) && near(R.pfrVolume(c, 1, 0.9), -Math.log(0.1) / 0.2, 1e-10));
    check('reactor: many CSTRs in series approach the PFR', Math.abs(R.seriesVolume(c, 1, 50, 0.9) / R.pfrVolume(c, 1, 0.9) - 1) < 0.03); }
  check('reactor: reversible equilibrium conversion K/(1+K)', R.xMax(cases[3]) === 0.8 && R.cstrConversion(cases[3], 10, 1e9) < 0.8);
  check('reactor: zero order PFR and CSTR are the same size', (() => { const c = { kind: 'power', k: 0.05, n: 0, CA0: 1, eps: 0 }; return near(R.pfrVolume(c, 2, 0.6), R.cstrVolume(c, 2, 0.6), 1e-10); })());
};
