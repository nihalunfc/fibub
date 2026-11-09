// #474 Non-compartmental PK analysis. Reference numbers from an independent numpy implementation following the
// PKNCA / WinNonlin conventions (/tmp check script; 58 random profiles agreed to 1e-14), plus closed forms.
import { nca, cleanProfile, piece } from '../../src/lib/sci/nca.ts';

export default async (check) => {
  const near = (a, b, rel = 1e-8) => Number.isFinite(a) && Math.abs(a - b) <= rel * Math.abs(b);
  const T = [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24], C = [0, 520, 860, 1240, 1460, 1470, 1510, 1490, 1110, 862, 553, 352, 139];
  const pts = cleanProfile(T.map((t, i) => [t, C[i]]));
  const r = nca(pts, { route: 'ev', method: 'linlog', dose: 100 });
  check('nca: Cmax and Tmax', r.cmax === 1510 && r.tmax === 3);
  check('nca: AUC0-t linear-up/log-down', near(r.aucLast, 16101.1026));
  check('nca: AUMC0-t log-down', near(r.aumcLast, 125698.4267));
  check('nca: best fit picks 5 points (adj R² rule)', r.term.n === 5 && near(r.term.adjR2, 0.9998211578));
  check('nca: lambda_z and half-life', near(r.term.lambda, 0.1147622137) && near(r.halfLife, 6.03985544));
  check('nca: AUC0-inf obs and pred', near(r.aucInf, 17312.30266) && near(r.aucInfPred, 17316.01569));
  check('nca: % extrapolated', near(r.extrap, 6.996181175));
  check('nca: AUMC0-inf and MRT', near(r.aumcInf, 165321.2251) && near(r.mrtInf, 9.549349292) && near(r.mrtLast, 7.80682105));
  check('nca: CL/F and Vz/F (raw units)', near(r.cl, 0.005776239128) && near(r.vz, 0.05033223867) && Number.isNaN(r.vss));
  const lin = nca(pts, { route: 'ev', method: 'linear', dose: 100 });
  check('nca: linear trapezoid AUC and AUMC', near(lin.aucLast, 16336) && near(lin.aumcLast, 125271.75) && near(lin.mrtInf, 9.397200002));
  const ch = nca(pts, { route: 'ev', method: 'linlog', dose: 100, lambda: { mode: 'range', from: 12, to: 24 } });
  check('nca: chosen terminal points', ch.term.n === 3 && near(ch.term.lambda, 0.1152266699) && near(ch.aucInf, 17307.42054));
  // IV bolus without a time-0 sample: C0 back-extrapolated.
  const b = nca(cleanProfile([[0.5, 82], [1, 70], [2, 55], [4, 35], [6, 22.5], [8, 14.2], [12, 5.9]]), { route: 'bolus', method: 'linlog', dose: 500 });
  check('nca: bolus C0 back-extrapolated', near(b.c0, 82 * Math.exp(Math.log(82 / 70) * 1)) && b.pts[0].added === 'c0');
  check('nca: bolus AUC, lambda_z (Cmax allowed), Vss', near(b.aucLast, 363.488663) && b.term.n === 6 && near(b.aucInf, 389.7635203) && near(b.mrtInf, 4.407174068) && near(b.vss, 5.653651303));
  const inf = nca(cleanProfile([[0, 0], [0.5, 9.1], [1, 16.8], [2, 28.5], [3, 21.2], [4, 16], [6, 9.2], [8, 5.1], [12, 1.7]]), { route: 'infusion', method: 'linlog', dose: 200, tinf: 2 });
  check('nca: infusion MRT corrected by Tinf/2', near(inf.aucInf, 131.4522571) && near(inf.mrtInf, 3.554587032) && near(inf.vss, 5.408179532) && inf.term.n === 5);
  // Closed form: C = 100 e^(-0.2 t) sampled exactly; log trapezoids are exact, AUCinf = 500, AUMCinf = 2500, MRT = 5.
  const ex = [0, 1, 2, 4, 6, 8, 12].map((t) => [t, 100 * Math.exp(-0.2 * t)]);
  const e = nca(cleanProfile(ex), { route: 'bolus', method: 'linlog', dose: 1000 });
  check('nca: exact exponential, AUC0-inf = C0/k', near(e.aucInf, 500, 1e-10) && near(e.aumcInf, 2500, 1e-10) && near(e.mrtInf, 5, 1e-10) && near(e.cl, 2, 1e-10) && near(e.vz, 10, 1e-10));
  check('nca: log piece equals the integral', near(piece(0, 100, 5, 100 * Math.exp(-1), 'linlog').auc, 500 * (1 - Math.exp(-1)), 1e-12));
  // Bad input.
  const throws = (f) => { try { f(); return false; } catch { return true; } };
  check('nca: rejects repeated times, negatives, too few rows', throws(() => cleanProfile([[0, 1], [1, 2], [1, 3]])) && throws(() => cleanProfile([[0, 1], [1, -2], [2, 3]])) && throws(() => cleanProfile([[0, 1], [1, 2]])));
  check('nca: no lambda_z when the tail does not fall', nca(cleanProfile([[0, 0], [1, 5], [2, 9], [4, 10]]), { route: 'ev', method: 'linlog' }).term === null);
};
