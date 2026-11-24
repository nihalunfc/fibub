// 18-electron rule tool: covalent (Green) count. Textbook cases are exact; the vanadium-group carbonyl cations use
// the structures named in Hu and Wang (2024), Molecules 29: 2831 (V(CO)6+ is 16 electrons; an (OC)6M-V(CO)3+ pair).
import { count, METALS } from '../../src/lib/sci/ecount.ts';

export default async (check) => {
  const g = (m) => METALS.find((x) => x[0] === m)[1], CO = (n) => [{ id: 'CO', n }];
  check('ecount: ferrocene 18, Fe(CO)5 18, Ni(CO)4 18', count(g('Fe'), 0, [{ id: 'Cp', n: 2 }]).ve === 18 && count(g('Fe'), 0, CO(5)).ve === 18 && count(g('Ni'), 0, CO(4)).ve === 18);
  check('ecount: Mn2(CO)10 is 18 per Mn with one Mn-Mn bond', count(g('Mn'), 0, CO(5), 1).ve === 18);
  check('ecount: V(CO)6+ = 16 (V(I), d4) and V(CO)7+ = 18', (() => { const a = count(5, 1, CO(6)), b = count(5, 1, CO(7)); return a.ve === 16 && a.os === 1 && a.d === 4 && b.ve === 18; })());
  check('ecount: Nb(CO)6 = 17 alone and 18 with one Nb-V bond (Ta the same)', count(g('Nb'), 0, CO(6)).ve === 17 && count(g('Nb'), 0, CO(6), 1).ve === 18 && count(g('Ta'), 0, CO(6), 1).ve === 18);
  check('ecount: V(CO)3+ = 10 alone and 11 with one bond', count(5, 1, CO(3)).ve === 10 && count(5, 1, CO(3), 1).ve === 11);
  const nb = count(5, 0, CO(6), 1).ve, v = count(5, 1, CO(3), 1).ve;
  check('ecount: the two ends of VNb(CO)9+ add to the cation total (27) plus 2 for the shared bond', nb + v === 5 + 5 + 18 - 1 + 2);
};
