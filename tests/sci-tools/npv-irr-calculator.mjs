// NPV and IRR: checked against numpy_financial 1.1 (npv, irr, mirr), every IRR against the positive real roots of
// the cash-flow polynomial from numpy.roots, and payback against numpy.cumsum of plain and discounted flows.
import { npv, irrAll, mirr, payback, profitabilityIndex, equivalentAnnuity, signChanges } from '../../src/lib/sci/npv.ts';

const REF = {"ex":{"cf":[-10000,3000,4200,4800,2500,1500],"npv10":2443.573774766997,"npv0":6000.0,"irr_np":0.20014173787050793,"irrs":[0.20014173787050793],"mirr":0.15932496795275886,"cum":[-10000,-7000,-2800,2000,4500,6000],"dcum":[-10000.0,-7272.727272727273,-3801.652892561984,-195.34184823441183,1512.1917901782645,2443.573774766997]},"multi":{"cf":[-1000,6000,-11000,6000],"npv10":-128.474830954171,"npv0":0.0,"irr_np":2.220446049250313e-16,"irrs":[2.220446049250313e-16,0.999999999999998,2.0000000000000018],"mirr":0.0904921628998352,"cum":[-1000,5000,-6000,0],"dcum":[-1000.0,4454.545454545454,-4636.363636363636,-128.474830954171]},"mine":{"cf":[-1600,10000,-10000],"npv10":-773.5537190082632,"npv0":-1600.0,"irr_np":0.25,"irrs":[0.25,4.0],"mirr":0.04924329564069918,"cum":[-1600,8400,-1600],"dcum":[-1600.0,7490.90909090909,-773.5537190082632]},"none":{"cf":[100,200,300],"npv10":529.7520661157024,"npv0":600.0,"irr_np":null,"irrs":[],"mirr":null,"cum":[100,300,600],"dcum":[100.0,281.8181818181818,529.7520661157024]},"long":{"cf":[-500,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,-200],"npv10":55.19513105545005,"npv0":1100.0,"irr_np":0.11363074090037495,"irrs":[-0.23056969584170128,0.11363074090037495],"mirr":0.11747047145277412,"cum":[-500,-440,-380,-320,-260,-200,-140,-80,-20,40,100,160,220,280,340,400,460,520,580,640,700,760,820,880,940,1000,1060,1120,1180,1240,1300,1100],"dcum":[-500.0,-445.45454545454544,-395.8677685950413,-350.78888054094665,-309.8080732190424,-272.5527938354931,-238.68435803226646,-207.89487093842408,-179.9044281258401,-154.458571023491,-131.32597365771912,-110.29633968883559,-91.1784906262142,-73.79862784201293,-57.998752583648155,-43.635229621498354,-30.577481474089446,-18.70680134008135,-7.915273945528533,1.8952055040649345,10.813823185513542,18.921657441375913,26.29241585579625,32.9931053234511,39.08464120313732,44.62240109376116,49.65672826705556,54.23338933368684,58.39399030335163,62.17635482122871,65.6148680192988,55.19513105545008]},"neg":{"cf":[-100,30,30,30],"npv10":-25.394440270473343,"npv0":-10.0,"irr_np":-0.050885441372619855,"irrs":[-0.050885441372619855],"mirr":0.004089916445556341,"cum":[-100,-70,-40,-10],"dcum":[-100.0,-72.72727272727273,-47.93388429752067,-25.394440270473343]}};

export default async (check) => {
  const near = (a, b, t = 1e-9) => (a === b) || Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const firstCross = (cum) => { if (cum[0] >= 0) return 0; for (let t = 1; t < cum.length; t++) if (cum[t] >= 0) return t - 1 + -cum[t - 1] / (cum[t] - cum[t - 1]); return NaN; };
  for (const [k, v] of Object.entries(REF)) {
    check(`npv: ${k}: NPV at 10 % and 0 % match numpy_financial`, near(npv(0.1, v.cf), v.npv10) && near(npv(0, v.cf), v.npv0));
    const irr = irrAll(v.cf);
    check(`npv: ${k}: all IRRs [${v.irrs.map((x) => x.toFixed(6)).join(', ')}] match numpy.roots`, irr.length === v.irrs.length && irr.every((r, i) => Math.abs(r - v.irrs[i]) < 1e-9));
    if (v.irr_np !== null) check(`npv: ${k}: numpy_financial.irr's answer is among them`, irr.some((r) => Math.abs(r - v.irr_np) < 1e-9));
    const m = mirr(v.cf, 0.08, 0.12);
    check(`npv: ${k}: MIRR (8 % finance, 12 % reinvest) matches numpy_financial`, v.mirr === null ? Number.isNaN(m) : near(m, v.mirr));
    const pb = payback(v.cf), dpb = payback(v.cf, 0.1), e1 = firstCross(v.cum), e2 = firstCross(v.dcum);
    check(`npv: ${k}: payback and discounted payback`, (Number.isNaN(pb) ? Number.isNaN(e1) : near(pb, e1)) && (Number.isNaN(dpb) ? Number.isNaN(e2) : near(dpb, e2)));
  }
  check('npv: sign changes (Descartes)', signChanges(REF.multi.cf) === 3 && signChanges(REF.ex.cf) === 1 && signChanges([-1, 0, 0, 2]) === 1);
  check('npv: profitability index = 1 + NPV / outlay', near(profitabilityIndex(0.1, REF.ex.cf), 1 + REF.ex.npv10 / 10000));
  check('npv: equivalent annuity of a level annuity is the payment', near(equivalentAnnuity(0.07, [0, 100, 100, 100, 100]), 100) && near(equivalentAnnuity(0, [-30, 10, 10, 10]), 0));
  check('npv: a double root (cash flows −1, 2, −1) is found', (() => { const r = irrAll([-1, 2, -1]); return r.length === 1 && Math.abs(r[0]) < 1e-6; })());
};
