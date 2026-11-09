// #332 Coral cover point count: point layouts, cover per category, and the Wilson interval (checked against
// statsmodels 0.15 proportion_confint(method='wilson')).
import * as P from '../../src/lib/sci/plantimg.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const ws = [[12, 50, 0.142974, 0.374127], [0, 30, 0, 0.113513], [30, 30, 0.886487, 1], [7, 100, 0.034319, 0.137495], [45, 90, 0.398837, 0.601163]];
  check('coral: Wilson 95 % intervals match statsmodels to 1e-6', ws.every(([k, n, lo, hi]) => { const [a, b] = P.wilson(k, n); return near(a, lo, 1e-6) && near(b, hi, 1e-6); }));
  { const [a, b] = P.wilson(12, 50, 0.9); check('coral: Wilson 90 % for 12 of 50 is 0.155667 to 0.351026 (statsmodels)', near(a, 0.15566702155608025, 1e-9) && near(b, 0.35102623505278024, 1e-9)); }
  // Layouts.
  const st = P.placePoints('stratified', 600, 400, { n: 0, rows: 4, cols: 5, seed: 3, border: 0.05 });
  const inCell = st.every(([x, y], i) => { const r = Math.floor(i / 5), c = i % 5; return x >= 30 + c * 108 && x <= 30 + (c + 1) * 108 && y >= 20 + r * 90 && y <= 20 + (r + 1) * 90; });
  check('coral: stratified random gives one point inside each of the 4 × 5 cells, clear of a 5 % border', st.length === 20 && inCell);
  const g = P.placePoints('grid', 100, 100, { n: 0, rows: 2, cols: 2, seed: 1, border: 0 });
  check('coral: a 2 × 2 grid sits at the cell centres', JSON.stringify(g) === '[[25,25],[75,25],[25,75],[75,75]]');
  const r1 = P.placePoints('random', 640, 480, { n: 50, rows: 0, cols: 0, seed: 9, border: 0 }), r2 = P.placePoints('random', 640, 480, { n: 50, rows: 0, cols: 0, seed: 9, border: 0 });
  check('coral: simple random places n points, the same for the same seed', r1.length === 50 && JSON.stringify(r1) === JSON.stringify(r2) && r1.every(([x, y]) => x >= 0 && x < 640 && y >= 0 && y < 480));
  // Cover: the two made-up quadrats, 5 × 5 stratified points each (seeds 1 and 2), labelled from the drawing.
  const labs = [];
  for (let v = 0; v < 2; v++) { const e = P.exampleReef(v); labs.push(...P.placePoints('stratified', e.w, e.h, { n: 25, rows: 5, cols: 5, seed: 1 + v, border: 0.02 }).map(e.at)); }
  const c = P.cover(labs, P.CORAL_CATS, ['Shadow or tape']);
  const hc = c.rows.find((r) => r.cat === 'Hard coral');
  check(`coral: example 13 of 49 counted points hard coral = 26.5 % (16.21 to 40.26 %, statsmodels), 1 shadow point left out`, c.n === 49 && c.skipped === 1 && hc.k === 13 && near(hc.pct, 26.5306, 1e-3) && near(hc.lo, 16.211282, 1e-5) && near(hc.hi, 40.262289, 1e-5));
  check('coral: cover adds up to 100 % without the left-out category', near(c.rows.reduce((s, r) => s + r.pct, 0), 100, 1e-9) && !c.rows.some((r) => r.cat === 'Shadow or tape'));
  const u = P.cover(['Sand', null, 'Algae', null], ['Sand', 'Algae'], []);
  check('coral: unlabelled points are not counted', u.n === 2 && u.unlabelled === 2 && u.rows[0].pct === 50);
};
