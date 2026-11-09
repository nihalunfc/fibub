// #745 Difference-in-differences: TWFE DiD, event study and pre-trend F checked against statsmodels 0.15
// (OLS with county and year dummies, cov_type='cluster' by county, use_t=True) on the made-up panel in
// src/tools/difference-in-differences/example.csv; 2 × 2 from cell means against statsmodels HC2 on
// individual data with those means, SDs and sizes.
import { readFileSync } from 'node:fs';
import { didPanel, did2x2 } from '../../src/lib/sci/did.ts';

const R = {"did":{"b":2.115208333333329,"se":0.11833009270518917,"p":2.4272818555396333e-13,"ci":[1.8675406029410029,2.362876063725655]},"event":{"e2015":{"b":-0.004166666666711727,"se":0.34058049847601374,"p":0.9903664608236217,"ci":[-0.7170098424393808,0.7086765091059574]},"e2016":{"b":0.27541666666668524,"se":0.4176311712102517,"p":0.5175061372492906,"ci":[-0.5986954205470862,1.1495287538804568]},"e2017":{"b":0.16749999999997733,"se":0.39619387078337137,"p":0.6772072859125361,"ci":[-0.6617433017587562,0.9967433017587108]},"e2019":{"b":1.193333333333316,"se":0.3455092531491016,"p":0.002659687160449654,"ci":[0.4701741554715967,1.9164925111950355]},"e2020":{"b":2.0816666666667034,"se":0.33758720415765364,"p":0.000006319461107383841,"ci":[1.3750885279042857,2.7882448054291213]},"e2021":{"b":2.475416666666696,"se":0.3651534104207998,"p":0.0000017866537017008804,"ci":[1.7111417951067325,3.23969153822666]},"e2022":{"b":3.149166666666624,"se":0.3157679919627911,"p":5.496858555573014e-9,"ci":[2.4882566638762924,3.8100766694569552]}},"pre":{"F":0.16156372922762258,"p":0.920883483793997,"df1":3,"df2":19},"cell":{"b":4.000000000000004,"se":2.551423282317193,"p":0.11887819370160448,"ci":[-1.0381032317703314,9.03810323177034]}};

export default async (check) => {
  const rows = readFileSync(new URL('../../src/tools/difference-in-differences/example.csv', import.meta.url), 'utf8').trim().split('\n').slice(1)
    .map((l) => { const [u, t, tr, y] = l.split(','); return { unit: u, time: +t, treated: tr === '1', y: +y }; });
  const rel = (a, b) => Math.abs(a - b) / Math.max(1e-12, Math.abs(b));
  const r = didPanel(rows, 2019);
  check(`did: TWFE estimate ${r.did.b.toFixed(4)}, clustered SE, p and CI match statsmodels`, rel(r.did.b, R.did.b) < 1e-9 && rel(r.did.se, R.did.se) < 1e-9 && rel(r.did.p, R.did.p) < 1e-8 && rel(r.did.lo, R.did.ci[0]) < 1e-9 && rel(r.did.hi, R.did.ci[1]) < 1e-9);
  check('did: 20 counties (8 treated), 19 df', r.units.treated === 8 && r.units.control === 12 && r.twfe.df === 19);
  check('did: reference period 2018 by default, event time −1', r.ref === 2018 && r.event.find((e) => e.time === 2018).rel === -1 && r.event.find((e) => e.time === 2018).est === null);
  for (const e of r.event) if (e.est) {
    const ref = R.event['e' + e.time];
    check(`did: event-study ${e.time} (k = ${e.rel}) matches statsmodels`, rel(e.est.b, ref.b) < 1e-9 && rel(e.est.se, ref.se) < 1e-9 && rel(e.est.p, ref.p) < 1e-8 && rel(e.est.lo, ref.ci[0]) < 1e-9);
  }
  check('did: pre-trend joint F(3, 19) matches statsmodels f_test', rel(r.pre.F, R.pre.F) < 1e-9 && rel(r.pre.p, R.pre.p) < 1e-9 && r.pre.df1 === 3 && r.pre.df2 === 19);
  const means = r.means.find((m) => m.time === 2015);
  check('did: group means by period', means.nT === 8 && means.nC === 12 && Math.abs(means.control - 61.81666666666666) < 1e-9);
  // A different reference period changes the event coefficients by a constant shift.
  const r17 = didPanel(rows, 2019, 2017);
  check('did: reference 2017 shifts every coefficient by the 2017 one', Math.abs(r17.event.find((e) => e.time === 2018).est.b + R.event.e2017.b) < 1e-9 && Math.abs(r17.event.find((e) => e.time === 2022).est.b - (R.event.e2022.b - R.event.e2017.b)) < 1e-9);
  // 2 × 2 from cell means.
  const c = did2x2({ mean: 50, sd: 8, n: 40 }, { mean: 57, sd: 9, n: 38 }, { mean: 48, sd: 7.5, n: 45 }, { mean: 51, sd: 8.2, n: 44 });
  check('did: 2 × 2 from means: 7 − 3 = 4, counterfactual 53', c.did === 4 && c.treatedChange === 7 && c.controlChange === 3 && c.counterfactual === 53);
  check('did: 2 × 2 SE, p and CI match statsmodels HC2 on the individual data', rel(c.se, R.cell.se) < 1e-9 && rel(c.p, R.cell.p) < 1e-9 && rel(c.lo, R.cell.ci[0]) < 1e-9 && c.df === 163);
  check('did: means only gives no SE', did2x2({ mean: 1 }, { mean: 2 }, { mean: 1 }, { mean: 1.5 }).se === undefined);
  const t = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('did: no comparison units explained', /comparison units/.test(t(() => didPanel(rows.map((x) => ({ ...x, treated: true })), 2019))));
  check('did: no pre-period explained', /No periods before/.test(t(() => didPanel(rows, 2015))));
  check('did: treated must be fixed within a unit', /same in every row of a unit/.test(t(() => didPanel(rows.map((x, i) => (i === 0 ? { ...x, treated: false } : x)), 2019))));
};
