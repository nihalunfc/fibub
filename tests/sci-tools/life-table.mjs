// #754 Life table: matched to an independent numpy implementation (scratch lt_ref.py) for the tool's made-up
// abridged example under four nax choices and a made-up complete (single-year) table; worst relative
// difference 8e-16 over every column.
import * as L from '../../src/lib/sci/lifetable.ts';

const DATA = [['0', 27, 5200], ['1-4', 6, 21400], ['5-9', 7, 27000], ['10-14', 7, 26500], ['15-19', 9, 25800], ['20-24', 11, 27900], ['25-29', 16, 30100], ['30-34', 23, 31200], ['35-39', 33, 30500], ['40-44', 48, 29400], ['45-49', 71, 28700], ['50-54', 107, 27600], ['55-59', 159, 26100], ['60-64', 230, 23800], ['65-69', 315, 20400], ['70-74', 400, 16200], ['75-79', 467, 11800], ['80-84', 502, 7900], ['85+', 673, 4300]];

export default async (check) => {
  const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.abs(b);
  const ages = DATA.map((r) => L.ageOf(r[0])), M = DATA.map((r) => r[1] / r[2]);
  check('lifetable: ages from labels', ages.join() === '0,1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85' && L.ageOf('85+') === 85);
  const mid = L.lifeTable(ages, M, { method: 'mid', sex: 'female' });
  check('lifetable: midpoint nax = numpy', rel(mid[0].ex, 79.37276306436894) && rel(mid[18].lx, 42192.28269119526) && rel(mid[0].Lx, 99741.05687158338) && rel(mid[1].qx, 0.0011208668036614981));
  const cdf = L.lifeTable(ages, M, { method: 'cd', sex: 'female' });
  check('lifetable: Coale-Demeny female a0 and 4a1', rel(cdf[0].ax, 0.053 + 2.8 * M[0]) && rel(cdf[1].ax, 1.522 - 1.518 * M[0]) && rel(cdf[0].ex, 79.37091590172439));
  const cdm = L.lifeTable(ages, M, { method: 'cd', sex: 'male' });
  check('lifetable: Coale-Demeny male = numpy', rel(cdm[0].ex, 79.37102312323472) && rel(cdm[18].lx, 42192.78808780947) && rel(cdm[0].Lx, 99513.74667152445));
  const ak = L.lifeTable(ages, M, { method: 'ak', sex: 'female' });
  check('lifetable: Andreev-Kingkade female = numpy', rel(ak[0].ex, 79.3716612409119) && rel(ak[0].Lx, 99554.60184272904) && ak[1].ax === 2);
  check('lifetable: identities', Math.abs(cdf.reduce((s, r) => s + r.dx, 0) - 100000) < 1e-6 && cdf.every((r) => rel(r.Tx / r.lx, r.ex)) && cdf[18].qx === 1 && rel(cdf[18].ax, 1 / M[18]));
  // Complete table, made-up Gompertz-Makeham rates.
  const a1 = Array.from({ length: 101 }, (_, i) => i), M1 = a1.map((x) => (x === 0 ? 0.004 : 0.0004 + 0.00003 * Math.exp(0.1 * x)));
  const c = L.lifeTable(a1, M1, { method: 'ak', sex: 'male' });
  check('lifetable: complete table = numpy', rel(c[0].ex, 74.43181859820899) && rel(c[65].ex, 15.241423292829563) && rel(c[100].lx, 166.51863667591493) && rel(c[0].ax, 0.14929 - 1.99545 * 0.004));
  // Constant hazard: e0 = 1/m exactly whatever the intervals, when nax follows the exponential.
  check('lifetable: open group alone', rel(L.lifeTable([0, 5], [0.02, 0.02], { method: 'given', sex: 'female', ax: [(1 / 0.02) - 5 * Math.exp(-0.1) / (1 - Math.exp(-0.1)), 0] })[0].ex, 50));
  check('lifetable: Coale-Demeny high m0 branch', L.coaleDemeny(0.2, 'male').a0 === 0.33 && L.coaleDemeny(0.2, 'female').a1_4 === 1.361 && L.andreevKingkade(0.1, 'female') === 0.31411);
  let bad = 0;
  for (const f of [() => L.lifeTable([0, 0], [0.1, 0.1], { method: 'mid', sex: 'male' }), () => L.lifeTable([0, 1], [0.1, 0], { method: 'mid', sex: 'male' }), () => L.lifeTable([0, 1, 5], [0.1, -1, 0.2], { method: 'mid', sex: 'male' })]) { try { f(); } catch { bad++; } }
  check('lifetable: bad input refused', bad === 3);
};
