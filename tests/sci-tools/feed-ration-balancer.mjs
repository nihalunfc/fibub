// #397 Feed ration balancer: simplex against scipy.optimize.linprog (HiGHS), Pearson square against the textbook example.
import { lp, leastCost, pearson, readFeeds, EXAMPLE_FEEDS, EXAMPLE_REQ } from '../../src/lib/sci/ration.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  // Textbook LP (Hillier and Lieberman's Wyndor example): max 3x + 5y, x ≤ 4, 2y ≤ 12, 3x + 2y ≤ 18 → (2, 6), 36.
  { const r = lp([-3, -5], [{ a: [1, 0], op: '<=', b: 4 }, { a: [0, 2], op: '<=', b: 12 }, { a: [3, 2], op: '<=', b: 18 }]);
    check('ration: Wyndor LP optimum (2, 6), 36', r.status === 'optimal' && near(r.x[0], 2, 1e-9) && near(r.x[1], 6, 1e-9) && near(-r.cost, 36, 1e-9)); }
  check('ration: infeasible LP found', lp([1, 1], [{ a: [1, 1], op: '>=', b: 5 }], [0, 0], [2, 2]).status === 'infeasible');
  check('ration: unbounded LP found', lp([-1, 0], [{ a: [1, -1], op: '<=', b: 1 }]).status === 'unbounded');
  check('ration: equality rows and lower bounds', (() => { const r = lp([2, 3], [{ a: [1, 1], op: '=', b: 10 }], [1, 4], [Infinity, Infinity]); return r.status === 'optimal' && near(r.x[0], 6, 1e-9) && near(r.x[1], 4, 1e-9) && near(r.cost, 24, 1e-9); })());
  // Random problems solved by scipy linprog (HiGHS) in the cross-check: one of each status.
  { const r = lp([7.75, 5.86, -0.4], [{ a: [2.5, -1.2, 4], op: '>=', b: 6.3 }, { a: [1, 1, 1], op: '<=', b: 5 }], [0, 0.5, 0], [3, Infinity, 1]);
    check(`ration: mixed LP as scipy 11.52 at (1.16, 0.5, 1) (${r.cost})`, r.status === 'optimal' && near(r.cost, 11.52, 1e-9) && near(r.x[0], 1.16, 1e-9) && near(r.x[2], 1, 1e-9)); }
  const { feeds, errors } = readFeeds(parseTable(EXAMPLE_FEEDS), num);
  check('ration: example feeds read', feeds.length === 5 && errors.length === 0 && feeds[0].min === 4 && Number.isNaN(feeds[0].max) && feeds[1].max === 10);
  const r = leastCost(feeds, EXAMPLE_REQ);
  // scipy linprog (HiGHS): cost 4.437068888830455, x = [8.01324503, 10, 0, 2.91390728, 0.05576856].
  check(`ration: example least cost 4.43707 (${r.cost})`, r.status === 'optimal' && near(r.cost, 4.437068888830455, 1e-9));
  check('ration: example kg DM per feed as scipy', [8.01324503, 10, 0, 2.91390728, 0.05576856].every((v, i) => near(r.dmKg[i], v, 1e-7)));
  check('ration: example as-fed silage 28.571 kg', near(r.asFedKg[1], 10 / 0.35, 1e-9));
  check('ration: example binding limits', ['Crude protein minimum', 'Energy minimum', 'Calcium minimum', 'Maize silage (example) maximum'].every((b) => r.binding.includes(b)) && !r.binding.includes('Phosphorus minimum'));
  check('ration: supplies meet every minimum', r.supplied.cp >= 3000 - 1e-6 && r.supplied.en >= 220 - 1e-6 && r.supplied.ca >= 100 - 1e-6 && r.supplied.p >= 60 && r.supplied.dm >= 19 && r.supplied.dm <= 21);
  { const bad = leastCost(feeds, { ...EXAMPLE_REQ, cpMin: 12000 });
    check(`ration: impossible protein limit, relax list (${bad.relax})`, bad.status === 'infeasible' && bad.relax.includes('Crude protein minimum') && bad.relax.includes('Dry matter intake maximum')); }
  // Pearson square, textbook example: maize 9 % CP and soybean meal 44 % CP for 16 % CP: 28 and 7 parts, 80 % and 20 %.
  { const s = pearson(9, 44, 16); check('ration: Pearson square 28 : 7 parts, 80 / 20 %', s.ok && s.partsA === 28 && s.partsB === 7 && near(s.fracA, 0.8, 1e-12)); }
  { const s = pearson(10, 48, 20, 88, 89); check('ration: Pearson as fed shares', near(s.asFedA, (28 / 38 / 0.88) / (28 / 38 / 0.88 + 10 / 38 / 0.89), 1e-12)); }
  check('ration: Pearson target outside the feeds', !pearson(9, 44, 50).ok);
  check('ration: bad feed rows reported', readFeeds([['A', '120', '10', '9', '1', '1', '1']], num).errors[0].includes('at most 100') && readFeeds([['B', 'x', '1']], num).feeds.length === 0);
};
