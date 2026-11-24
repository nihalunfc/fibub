// #T157 Activated sludge sizer. Expected values worked out independently in Python from the complete-mix steady-state
// mass balances (Monod effluent BOD, biomass with endogenous decay and cell debris, tank volume from SRT and MLSS,
// oxygen demand, air flow, return and waste sludge), and from the operating point of the palm oil mill effluent
// study used in the blog article palm-oil-mill-wastewater-activated-sludge-hrt-mlss-sludge-age
// (Jagaba et al. 2023, Agriculture 13(8): 1531, CC BY 4.0).
import { size, effluentS, minSrt } from '../../src/lib/sci/asludge.ts';

const BASE = { Q: 4000, S0: 200, srt: 8, mlss: 3000, Y: 0.6, kd: 0.1, fd: 0.15, mumax: 5, Ks: 40, nbVSS: 20, iTSS: 10, vssRatio: 0.85, bcodRatio: 1.6, ote: 0.1, Xr: 8000 };

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));

  check('activated sludge: Monod effluent BOD = Ks(1 + kd SRT) / (SRT(mumax - kd) - 1)', near(effluentS(BASE), 1.884817, 1e-6) && effluentS({ ...BASE, srt: 0.2 }) === Infinity);
  check('activated sludge: washout sludge age', near(minSrt(BASE), 0.245902, 1e-6) && near(minSrt({ ...BASE, S0: 4486 }), 0.2059388, 1e-6));

  const r = size(BASE);
  check('activated sludge: BOD removed, biomass and debris', near(r.S, 1.884817, 1e-6) && near(r.removed, 792.4607, 1e-6) && near(r.bio, 264.1536, 1e-6) && near(r.debris, 31.6984, 1e-5));
  check('activated sludge: sludge production and observed yield', near(r.pxVSS, 375.852, 1e-6) && near(r.pxTSS, 468.0612, 1e-6) && near(r.yobs, 0.474285, 1e-6));
  check('activated sludge: tank volume, retention time, MLVSS and F/M', near(r.V, 1248.163, 1e-6) && near(r.hrt, 7.489, 1e-4) && near(r.mlvss, 2408.993, 1e-6) && near(r.fm, 0.266062, 1e-6));
  check('activated sludge: oxygen demand, air flow, recycle and waste flow', near(r.o2, 847.827, 1e-6) && near(r.airM3min, 21.0781, 1e-5) && near(r.R, 0.6, 1e-9) && near(r.Qw, 58.5076, 1e-6));
  check('activated sludge: volumetric load = Q S0 / V', near(r.olr, (BASE.Q * BASE.S0) / 1000 / r.V, 1e-12));

  // A longer sludge age removes more BOD, makes less sludge and needs more oxygen and a bigger tank.
  const long = size({ ...BASE, srt: 20 });
  check('activated sludge: a longer sludge age means less sludge, more oxygen, a bigger tank', long.S < r.S && long.pxTSS < r.pxTSS && long.o2 > r.o2 && long.V > r.V);

  // The palm oil mill effluent reactor: 7.5 L at a 2-day retention time, 4,486 mg/L BOD, 5,000 mg/L MLSS.
  const POME = { ...BASE, Q: 0.00375, S0: 4486, mlss: 5000, nbVSS: 0, iTSS: 0, srt: 4.2282 };
  const p = size(POME);
  check('activated sludge: POME reactor sludge age holds 7.5 L at 5,000 mg/L', Math.abs(p.V - 0.0075) < 1e-6 && near(p.hrt, 48, 1e-4));
  check('activated sludge: POME loading, F/M and oxygen', near(p.olr, 2.243, 1e-3) && near(p.fm, 0.5277, 1e-3) && near(p.o2 * 1000, 16.19, 1e-2) && near(p.S, 2.8863, 1e-3));
};
