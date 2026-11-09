// #1087 Le Chatelier sandbox. Equilibrium extents checked against scipy brentq on ln Q − ln K for 24 random starts,
// volumes and temperatures (Python 3, scipy); K(T) against the van 't Hoff equation done there; directions against
// Le Chatelier's principle as written in textbooks.
import * as L from '../../src/lib/sci/lechatelier.ts';
const PY = [["haber", [0.708, 0.309, 1.188], 0.5, 600, 6.968431199273575, -0.0290340817067602], ["haber", [0.2, 1.205, 2.754], 0.25, 650, 1.6867323089134747, 0.015374056814698996], ["haber", [1.561, 1.081, 2.339], 0.25, 700, 0.5, 0.08919081824543765], ["haber", [0.643, 2.782, 2.487], 1, 700, 0.5, 0.017484529853215337], ["haber", [0.58, 0.93, 1.881], 1, 600, 6.968431199273575, -0.006304053224924716], ["haber", [2.534, 1.012, 1.164], 0.5, 650, 1.6867323089134747, 0.1644875671698377], ["contact", [0.742, 0.84, 2.834], 4, 900, 10.0, -0.2950411978550421], ["contact", [0.2, 0.876, 2.115], 1, 1050, 0.23262853723155064, -0.6273585303747011], ["contact", [0.585, 1.271, 0.865], 2, 850, 47.04901477834076, 0.17328882997366443], ["contact", [0.7, 0.779, 2.392], 0.25, 800, 268.63950829374795, 0.2856493891825377], ["contact", [1.388, 2.992, 1.557], 2, 900, 10.0, 0.3750878314008676], ["contact", [0.435, 2.021, 0.199], 0.5, 950, 2.5017520217136124, 0.13957809504905977], ["n2o4", [0.829, 1.067], 4, 330, 0.1, -0.21100838935621652], ["n2o4", [1.903, 0.596], 1, 230, 1.1948601192866453e-05, -0.29543737188592656], ["n2o4", [2.518, 2.124], 1, 480, 65.98243807319675, 1.9631968562393516], ["n2o4", [1.846, 0.712], 1, 280, 0.0024484885681711707, -0.3195911236455344], ["n2o4", [0.873, 0.077], 1, 230, 1.1948601192866453e-05, -0.03685140578124484], ["n2o4", [2.688, 2.864], 1, 230, 1.1948601192866453e-05, -1.4284933514087845], ["hi", [0.968, 0.965, 0.459], 2, 850, 36.92228829989476, 0.6703245285045636], ["hi", [2.04, 0.233, 1.853], 2, 700, 50.0, 0.18030272354128105], ["hi", [0.409, 1.145, 2.885], 1, 850, 36.92228829989476, 0.13940606444476752], ["hi", [0.2, 0.134, 0.509], 1, 700, 50.0, 0.06957768413562991], ["hi", [1.714, 1.318, 0.622], 0.5, 600, 66.5787698385559, 1.1144120179762431], ["hi", [0.2, 0.166, 0.506], 0.5, 850, 36.92228829989476, 0.07402692810692774]];
export default async (check) => {
  const R = Object.fromEntries(L.REACTIONS.map((r) => [r.id, r]));
  check('lechatelier: K(T) equals scipy van t Hoff values', PY.every(([id, , , T, K]) => Math.abs(L.Kat(R[id], T) / K - 1) < 1e-12));
  check('lechatelier: equilibrium extent equals scipy brentq (24 cases)', PY.every(([id, n, V, T, , x]) => Math.abs(L.equilibrate(R[id], n, V, T).xi - x) < 1e-9 * Math.max(1, Math.abs(x))));
  check('lechatelier: at equilibrium Q = K', L.REACTIONS.every((r) => { const e = L.equilibrate(r, r.start, r.V0, r.T0); return Math.abs(L.Q(r, e.n, r.V0) / e.K - 1) < 1e-9; }));
  const h = R.haber, e0 = L.equilibrate(h, h.start, 1, 700).n;
  { const e = L.equilibrate(h, e0, 0.5, 700).n; check('lechatelier: squeezing the Haber box makes more NH3', e[2] > e0[2] + 1e-6); }
  { const e = L.equilibrate(h, e0, 1, 750).n; check('lechatelier: heating the exothermic Haber box makes less NH3', e[2] < e0[2] - 1e-6 && L.Kat(h, 750) < 0.5); }
  { const s = [...e0]; s[0] += 0.5; const e = L.equilibrate(h, s, 1, 700).n; check('lechatelier: adding N2 uses up H2 and makes NH3', e[1] < e0[1] && e[2] > e0[2]); }
  { const hi = R.hi, a = L.equilibrate(hi, hi.start, 1, 700).n, b = L.equilibrate(hi, a, 0.5, 700).n; check('lechatelier: H2 + I2 does not shift on squeezing', Math.abs(b[2] - a[2]) < 1e-9); }
  { const r = R.n2o4, a = L.equilibrate(r, r.start, 1, 330).n, b = L.equilibrate(r, a, 1, 380).n; check('lechatelier: heating endothermic N2O4 makes more NO2', b[1] > a[1] && L.Kat(r, 380) > 0.1); }
  check('lechatelier: predict()', L.predict(h, 'add', 0) === 'right' && L.predict(h, 'add', 2) === 'left' && L.predict(h, 'remove', 2) === 'right' && L.predict(h, 'squeeze') === 'right' && L.predict(h, 'heat') === 'left' && L.predict(R.n2o4, 'heat') === 'right' && L.predict(R.n2o4, 'squeeze') === 'left' && L.predict(R.hi, 'expand') === 'none' && L.predict(h, 'catalyst') === 'none');
  check('lechatelier: predict agrees with the computed shift for every change', L.REACTIONS.every((r) => {
    const e = L.equilibrate(r, r.start, 1, r.T0).n;
    const cases = [['squeeze', 0, e, 0.5, r.T0], ['expand', 0, e, 2, r.T0], ['heat', 0, e, 1, r.T0 + 50], ['cool', 0, e, 1, r.T0 - 50]];
    r.species.forEach((s, i) => { const a = [...e]; a[i] += 0.5; cases.push(['add', i, a, 1, r.T0]); const b = [...e]; b[i] -= 0.1; cases.push(['remove', i, b, 1, r.T0]); });
    return cases.every(([c, i, start, V, T]) => { const xi = L.equilibrate(r, start, V, T).xi, p = L.predict(r, c, i); return p === 'none' ? Math.abs(xi) < 1e-9 : p === 'right' ? xi > 1e-9 : xi < -1e-9; });
  }));
  check('lechatelier: Kc expressions', L.kExpr(h) === '[NH3]² / ([N2][H2]³)' && L.kExpr(R.n2o4) === '[NO2]² / [N2O4]');
  check('lechatelier: Q with no products is 0, with no reactant is infinite', L.Q(h, [1, 3, 0], 1) === 0 && L.Q(h, [0, 3, 1], 1) === Infinity);
};
