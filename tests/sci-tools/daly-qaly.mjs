// #492 DALY and QALY calculator: discounting, burden, arms and ICERs against direct numeric integrals of e^(−rt)
// with scipy.integrate.quad.
import { disc, burden, arm, icer, parseBurden, parseStages } from '../../src/lib/sci/daly.ts';

export default async (check) => {
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const ref = [[30, 0.03, 0, 19.78101134198], [62.5, 0.035, 0, 25.36580312799], [4, 0.05, 7.5, 2.49168819968], [0.5, 0.03, 2, 0.467368241857], [17.3, 0.015, 3.3, 14.501625874013],
    [50.04512778171289, 0.08982416629598798, 15.51371380490387, 2.732372560967], [18.094054480248293, 0.03071646220621132, 17.471068907925236, 8.116337921495],
    [0.5206978347894206, 0.08230161341989387, 15.941388575040925, 0.137251812379], [37.488002732213296, 0.031000210255112043, 5.5685122420154665, 18.652518167454]];
  for (const [L, r, s, v] of ref) check(`daly: discounted ${+L.toFixed(2)} years at ${+(100 * r).toFixed(2)} % from year ${+s.toFixed(2)} = scipy quad ${v}`, close(disc(L, r, s), v, 1e-10));
  check('daly: no discounting is plain years', disc(30, 0) === 30 && disc(0, 0.03) === 0 && close(disc(30, 1e-9), 30, 1e-6));
  const b = burden([{ name: 'X', deaths: 20, yearsLost: 30, cases: 500, weight: 0.2, duration: 4 }, { name: 'Y', deaths: 3, yearsLost: 62.5, cases: 12000, weight: 0.05, duration: 0.5 }], 0.03);
  check('daly: burden YLL, YLD and DALY (scipy 480.2847, 674.6931, 1154.9778)', close(b.yll, 480.2847301551) && close(b.yld, 674.6930855482) && close(b.daly, 1154.9778157033) && close(b.rows[0].daly, b.rows[0].yll + b.rows[0].yld));
  { const u = burden([{ name: 'X', deaths: 20, yearsLost: 30, cases: 500, weight: 0.2, duration: 4 }], 0);
    check('daly: undiscounted burden 20×30 + 500×0.2×4', u.yll === 600 && close(u.yld, 400) && close(u.daly, 1000)); }
  const a0 = arm([{ utility: 0.6, years: 5, weight: 0.3 }], 0.03, 10), a1 = arm([{ utility: 0.8, years: 3, weight: 0.15 }, { utility: 0.7, years: 5, weight: 0.2 }], 0.03, 10);
  check('daly: arm QALYs and DALYs (scipy quad)', close(a0.qaly, 2.785840471499) && close(a0.daly, 5.389245427194) && close(a1.qaly, 5.265579290876) && close(a1.daly, 2.806020914503) && a1.years === 8 && close(a1.undiscountedQaly, 5.9));
  const ic = icer(2000, a0, 12000, a1, 30000);
  check('daly: ICER per QALY, per DALY averted, net benefit', close(ic.perQaly, 4032.68276556) && close(ic.perDaly, 3871.13080991) && close(ic.nmb, 64392.164581) && ic.quadrant === 'more-cost-more-effect');
  { const plain = arm([{ utility: 0.6, years: 5 }], 0, 10);
    check('daly: without weights, DALY uses 1 − utility; years to the horizon count in full', close(plain.daly, 0.4 * 5 + 5) && close(plain.qaly, 3)); }
  check('daly: quadrants', icer(5, a0, 1, a1).quadrant === 'dominant' && icer(1, a1, 5, a0).quadrant === 'dominated' && icer(5, a1, 1, a0).quadrant === 'less-cost-less-effect' && icer(1, a0, 2, a0).quadrant === 'no-difference' && Number.isNaN(icer(1, a0, 2, a0).perQaly));
  { const p = parseBurden([['Condition', 'Deaths', 'Years lost', 'Cases', 'Weight', 'Years'], ['X', '20', '30', '500', '0.2', '4'], ['Y', '3', '62,5', '12 000', '0.05', '0.5']]);
    check('daly: burden rows with a header, decimal comma and spaced thousands', !p.error && p.rows.length === 2 && p.rows[1].yearsLost === 62.5 && p.rows[1].cases === 12000); }
  check('daly: bad burden rows', parseBurden([['X', '1', '2', '3', '1.5', '4']]).error && parseBurden([['X', '1', '2']]).error && parseBurden([]).error && parseBurden([['X', '-1', '2', '3', '0.5', '4']]).error);
  { const s = parseStages('0.8, 3, 0.15\n0.7 5\n'), bad = [parseStages('2, 3'), parseStages('0.5, 0'), parseStages('0.5'), parseStages(''), parseStages('0.5, 2, 1.5')];
    check('daly: stage lines', !s.error && s.stages.length === 2 && s.stages[0].weight === 0.15 && s.stages[1].weight === undefined && bad.every((x) => x.error)); }
};
