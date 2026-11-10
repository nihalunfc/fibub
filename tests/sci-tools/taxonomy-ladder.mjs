// #1389 taxonomy ladder. Each classification checked by hand against standard references for the species
// (kingdom to species; plants in the school dicot/monocot scheme); shared ranks checked for known pairs.
import * as T from '../../src/lib/sci/school-taxonomy.ts';
export default async (check) => {
  check('taxonomy: 7 ranks, 12 organisms with 7 names each', T.RANKS.length === 7 && T.TAXA.length === 12 && T.TAXA.every((t) => t.ranks.length === 7));
  check('taxonomy: every species name is a binomial starting with its genus', T.TAXA.every((t) => T.isBinomial(t.ranks[6]) && t.ranks[6].startsWith(t.ranks[5] + ' ')));
  check('taxonomy: families end in -idae (animals) or -aceae (plants)', T.TAXA.every((t) => (t.ranks[0] === 'Animalia' ? t.ranks[4].endsWith('idae') : t.ranks[4].endsWith('aceae'))));
  const s = (a, b) => T.RANKS[T.shared(T.taxon(a), T.taxon(b))];
  check('taxonomy: tiger and lion share the genus Panthera', s('tiger', 'lion') === 'Genus');
  check('taxonomy: tiger and cat share the family Felidae', s('tiger', 'cat') === 'Family');
  check('taxonomy: cat and dog share the order Carnivora', s('cat', 'dog') === 'Order');
  check('taxonomy: human and tiger share the class Mammalia', s('human', 'tiger') === 'Class');
  check('taxonomy: housefly and honeybee share the class Insecta', s('housefly', 'honeybee') === 'Class');
  check('taxonomy: mango and neem share the order Sapindales', s('mango', 'neem') === 'Order');
  check('taxonomy: wheat and rice share the family Poaceae', s('wheat', 'rice') === 'Family');
  check('taxonomy: human and mango share nothing', T.shared(T.taxon('human'), T.taxon('mango')) === -1);
  check('taxonomy: binomial check', T.isBinomial('Homo sapiens') && !T.isBinomial('homo Sapiens') && !T.isBinomial('Homo'));
};
