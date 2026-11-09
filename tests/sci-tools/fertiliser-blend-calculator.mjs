// #381 fertiliser blend calculator: NNLS and least-cost blends, checked against scipy.optimize.nnls and linprog.
import { blend, parseProduct, P2O5_PER_P, K2O_PER_K, LB_AC_PER_KG_HA, EXAMPLE_PRODUCTS } from '../../src/lib/sci/fertiliser.ts';

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const ex = EXAMPLE_PRODUCTS.split('\n').map(parseProduct);
  check('fertiliser: parse "Ammonium sulphate, 21-0-0-24, 400"', ex[3].name === 'Ammonium sulphate' && ex[3].grade.join() === '21,0,0,24' && ex[3].price === 400);
  { const p = parseProduct('DAP 18-46-0'); check('fertiliser: parse a line with no price', p.name === 'DAP' && p.grade.join() === '18,46,0,0' && p.price === undefined); }
  { const p = parseProduct('11-52-0'); check('fertiliser: grade alone names the product', p.name === '11-52-0' && p.grade[1] === 52); }
  check('fertiliser: line with no grade is rejected', parseProduct('Urea 46 %') === null);
  check('fertiliser: P2O5/P 2.2914 and K2O/K 1.2046 from atomic weights', near(P2O5_PER_P, 2.29134, 1e-5) && near(K2O_PER_K, 1.20460, 1e-5));
  check('fertiliser: 1 kg/ha = 0.892179 lb/ac', near(LB_AC_PER_KG_HA, 0.8921791, 1e-6));
  // Exact: 150-60-90 from urea, DAP and potash (by hand: DAP 60/0.46, potash 90/0.6, urea (150 - 0.18 DAP)/0.46).
  { const r = blend(ex, [150, 60, 90, null]);
    check('fertiliser: example exact blend (urea 275.05, DAP 130.43, potash 150)', r.exact && near(r.x[0], 275.0472590) && near(r.x[1], 130.4347826) && near(r.x[2], 150) && r.x[3] === 0); }
  // Inexact: no straight N, so NNLS. scipy nnls: DAP 223.7705, potash 150, residual 117.82246.
  { const r = blend([parseProduct('DAP, 18-46-0'), parseProduct('MOP, 0-0-60')], [150, 60, 90, null]);
    check('fertiliser: NNLS with DAP and potash only matches scipy (223.7705, 150, residual 117.8225)', !r.exact && near(r.x[0], 223.7704918) && near(r.x[1], 150) && near(r.residual, 117.8224560) && near(r.diff[0], 40.27868852 - 150) && near(r.diff[1], 42.93442623)); }
  // At least every need, with DAP and potash: N binds, DAP 833.33.
  { const r = blend([parseProduct('DAP, 18-46-0, 780'), parseProduct('MOP, 0-0-60, 540')], [150, 60, 90, null], 'atleast');
    check('fertiliser: meet every need with DAP and potash (DAP 833.33, potash 150)', near(r.x[0], 833.333333) && near(r.x[1], 150) && r.diff[1] > 323 && near(r.cost, 833.333333 * 780 + 150 * 540)); }
  // Several exact blends: the cheapest one (scipy linprog with A x = b): 342923.913.
  const five = [...ex, parseProduct('Compound, 10-10-10, 300')];
  { const r = blend(five, [150, 60, 90, 30]);
    check('fertiliser: cheapest of the exact blends matches scipy linprog (342923.91)', r.exact && near(r.cost, 342923.9130434783) && near(r.x[4], 600) && near(r.x[0], 138.5869565) && r.x[1] === 0); }
  { const r = blend(five, [150, 60, 90, null], 'atleast');
    check('fertiliser: least-cost blend meeting every need matches scipy linprog (328304.35)', near(r.cost, 328304.3478260869) && near(r.x[0], 195.6521739)); }
  { const r = blend(five.map((p) => ({ ...p, price: undefined })), [150, 60, 90, null], 'atleast');
    check('fertiliser: without prices the lightest blend is chosen (555.48 kg)', r.cost === null && r.objective === 'mass' && near(r.mass, 555.4820416)); }
  { const r = blend([parseProduct('Urea 46-0-0')], [100, 50, null, null], 'atleast');
    check('fertiliser: a need no product contains has no blend', !r.feasible); }
};
