// #1186 Venn diagram calculator. Regions covered by set expressions checked against Python's own set
// operations (|, &, -, ^ and complement in U) on the eight region labels; element lists and counts against
// Python sets as well.
import * as VS from '../../src/lib/sci/school-sets.ts';
const PY = { "(A∪B)'∩C": [4], "A'∩B'": [0, 4], "(A∩B)'": [0, 1, 2, 4, 5, 6], "A'∪B'": [0, 1, 2, 4, 5, 6], 'A∪B∩C': [1, 3, 5, 6, 7], '(A∪B)∩C': [5, 6, 7], 'A−B': [1, 5], 'AΔB': [1, 2, 5, 6], "A∪(B∩C)'": [0, 1, 2, 3, 4, 5, 7], '(A−B)∪(B−A)': [1, 2, 5, 6], "U'": [], 'A∩(B∪C)': [3, 5, 7], '(A∩B)∪(A∩C)': [3, 5, 7] };
export default async (check) => {
  for (const [e, r] of Object.entries(PY)) check(`sets: ${e} covers regions ${r.join(',')} (Python sets)`, VS.regions(VS.parseSet(e, 3), 3).join() === r.join());
  check("sets: typed forms (a u b)' n c, not(A or B) and C, (A|B)ᶜ & C all agree", ["(a u b)' n c", 'not(A or B) and C', '(A|B)ᶜ & C', '[A + B]’ ∩ C'].every((s) => VS.regions(VS.parseSet(s, 3), 3).join() === '4'));
  check("sets: De Morgan (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′ in 2 and 3 sets", [2, 3].every((n) => VS.sameRegions(VS.parseSet("(A∪B)'", n), VS.parseSet("A'∩B'", n), n) && VS.sameRegions(VS.parseSet("(A∩B)'", n), VS.parseSet("A'∪B'", n), n)));
  check('sets: A ∪ B′ is not the same as (A ∪ B)′', !VS.sameRegions(VS.parseSet("A∪B'", 2), VS.parseSet("(A∪B)'", 2), 2));
  check('sets: two-set regions of A ∩ B′', VS.regions(VS.parseSet("A∩B'", 2), 2).join() === '1');
  const msg = (s, n = 3) => { try { VS.parseSet(s, n); return ''; } catch (e) { return e.message; } };
  check('sets: friendly messages', msg('(A ∪ B') .includes('never closed') && msg('A B').includes('next to each other') && msg('A ∪').includes('stops too soon') && msg('C', 2).includes('Switch to 3 sets') && msg('A ∪ D').includes('"D"') && msg('').includes('Type a set') && msg('A)').includes('closing bracket'));
  check('sets: region names', VS.regionName(5, 3) === 'A ∩ B′ ∩ C' && VS.regionName(0, 2) === 'outside A and B');
  check('sets: show writes the expression back', VS.show(VS.parseSet("(a u b)' n c", 3)) === '(A ∪ B)′ ∩ C' && VS.show(VS.parseSet("A'", 2)) === 'A′');
  check('sets: lists with ranges and repeats', VS.parseList('{1-4, 7, 7, red}').join() === '1,2,3,4,7,red');
  const U = VS.parseList('1-12'), A = VS.parseList('1-6'), B = VS.parseList('2,4,6,8,10,12'), C = VS.parseList('3,6,9,12');
  const r = VS.applySets(VS.parseSet("(A∪B)'∩C", 3), U, [A, B, C]);
  check("sets: (A ∪ B)′ ∩ C on 1 to 12 = {9} (Python)", r.result.join() === '9' && r.notInU.length === 0);
  check("sets: A′ ∩ B′ in U minus A minus B = {7, 9, 11} (Python)", VS.applySets(VS.parseSet("A'∩B'", 3), U, [A, B, C]).result.join() === '7,9,11');
  check('sets: region lists add up to U', r.byRegion.flat().length === 12 && r.byRegion[7].join() === '6' && r.byRegion[6].join() === '12');
  check('sets: elements outside U are reported', VS.applySets(VS.parseSet('A', 2), ['1', '2'], [['1', '5'], []]).notInU.join() === '5');
  check('sets: n(A ∪ B ∪ C) = 10 by inclusion–exclusion (Python len = 10)', VS.union3(6, 6, 4, 3, 2, 2, 1) === 10 && VS.union2(6, 6, 3) === 9);
};
