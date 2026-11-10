// #1291 Reaction type sorter. Every reaction is checked to be balanced atom by atom; the formula parser is checked
// against hand counts; the type of each reaction is checked against its shape (one product = combination, one
// reactant = decomposition, an element in and an element out = displacement, two compounds swapping = double).
import { REACTIONS, atoms, count, balanced, equation, pretty } from '../../src/lib/sci/rxsort-l2.ts';

export default async (check) => {
  check('parser: Ca(OH)2 → Ca O H O H', atoms('Ca(OH)2').join(' ') === 'Ca O H O H');
  check('parser: Pb(NO3)2 has 1 Pb, 2 N, 6 O', JSON.stringify(count([{ n: 1, f: 'Pb(NO3)2' }])) === '{"Pb":1,"N":2,"O":6}');
  check('parser: 2 Fe2O3 has 4 Fe and 6 O', JSON.stringify(count([{ n: 2, f: 'Fe2O3' }])) === '{"Fe":4,"O":6}');
  check('parser: NH4Cl has 6 atoms', atoms('NH4Cl').length === 6);
  check(`all ${REACTIONS.length} reactions are balanced`, REACTIONS.every(balanced));
  check('an unbalanced equation is caught', !balanced({ left: [{ n: 1, f: 'H2' }, { n: 1, f: 'O2' }], right: [{ n: 1, f: 'H2O' }] }));
  const isEl = (f) => /^[A-Z][a-z]?\d*$/.test(f);
  const shape = (r) => r.right.length === 1 ? 'combination' : r.left.length === 1 ? 'decomposition'
    : r.left.some((x) => isEl(x.f)) && r.right.some((x) => isEl(x.f)) ? 'displacement' : 'double';
  check('every type matches the shape of its equation', REACTIONS.every((r) => shape(r) === r.type));
  check('every type has at least 4 reactions', ['combination', 'decomposition', 'displacement', 'double'].every((t) => REACTIONS.filter((r) => r.type === t).length >= 4));
  check('decompositions say how the energy comes; redox ones say both views', REACTIONS.filter((r) => r.type === 'decomposition').every((r) => r.by) && REACTIONS.filter((r) => r.ox).every((r) => r.red && r.why10 && r.why11));
  check('double displacements are never redox; displacements always are', REACTIONS.filter((r) => r.type === 'double').every((r) => !r.ox) && REACTIONS.filter((r) => r.type === 'displacement').every((r) => r.ox));
  check('ids are unique', new Set(REACTIONS.map((r) => r.id)).size === REACTIONS.length);
  check('equation text', equation(REACTIONS.find((r) => r.id === 'fe-cuso4')) === 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)' && pretty('Pb(NO3)2') === 'Pb(NO₃)₂');
};
