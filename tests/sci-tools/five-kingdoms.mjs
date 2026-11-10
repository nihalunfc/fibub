// #1386 five-kingdom sorter. Every example organism checked by hand against the five-kingdom rules (Whittaker
// 1969) and the classify() function: prokaryote → Monera, chitin → Fungi, other single cells → Protista,
// many cells with cellulose → Plantae, many cells without a wall that take in food → Animalia.
import * as K from '../../src/lib/sci/school-kingdoms.ts';
export default async (check) => {
  check('kingdoms: 18 examples, unique ids, every kingdom used', K.EXAMPLES.length === 18 && new Set(K.EXAMPLES.map((e) => e.id)).size === 18 && K.KINGDOMS.every((k) => K.EXAMPLES.some((e) => e.kingdom === k)));
  for (const e of K.EXAMPLES) check(`kingdoms: ${e.name} → ${e.kingdom}`, K.classify(e).kingdom === e.kingdom);
  check('kingdoms: no nucleus is always Monera', K.classify({ cell: 'pro', org: 'multi', wall: 'cellulose', food: 'auto' }).kingdom === 'Monera');
  check('kingdoms: many cells, no wall, makes food fits none', K.classify({ cell: 'eu', org: 'multi', wall: 'none', food: 'auto' }).kingdom === null);
  check('kingdoms: chitin and photosynthesis fits none', K.classify({ cell: 'eu', org: 'multi', wall: 'chitin', food: 'auto' }).kingdom === null);
  check('kingdoms: every kingdom has a trait row', K.KINGDOMS.every((k) => K.TRAITS[k].cell && K.TRAITS[k].examples));
};
