// #1270 Classification tree. Every species has seven ranks with the genus matching the first word of its name; shared
// ranks; the walk from the kingdoms; the binomial name checker.
import { RANKS, SPECIES, KINGDOMS, byId, children, shared, checkName } from '../../src/lib/sci/school-taxonomy.ts';

export default async (check) => {
  check('seven ranks, every species complete, genus matches the name', RANKS.length === 7 && SPECIES.every((s) => s.ranks.length === 7 && s.ranks[6].split(' ')[0] === s.ranks[5] && KINGDOMS[s.ranks[0]]));
  check('unique ids and species names', new Set(SPECIES.map((s) => s.id)).size === SPECIES.length && new Set(SPECIES.map((s) => s.ranks[6])).size === SPECIES.length);
  check('five kingdoms at the top, all used', children([]).length === 5 && children([]).reduce((t, c) => t + c.n, 0) === SPECIES.length);
  check('Felidae holds three species in two genera', children(['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae']).map((c) => `${c.name}${c.n}`).join() === 'Felis1,Panthera2');
  check('tiger and lion share genus; tiger and human share class; tiger and mango nothing', shared(byId('tiger'), byId('lion')) === 5 && shared(byId('tiger'), byId('human')) === 2 && shared(byId('tiger'), byId('mango')) === -1);
  check('potato and brinjal share genus Solanum', shared(byId('potato'), byId('brinjal')) === 5 && byId('potato').ranks[5] === 'Solanum');
  check('a species shares everything with itself', shared(byId('wheat'), byId('wheat')) === 6);
  const a = checkName('homo Sapiens');
  check('homo Sapiens fixed with two issues', !a.ok && a.fixed === 'Homo sapiens' && a.short === 'H. sapiens' && a.issues.length === 2);
  check('Panthera tigris is fine', checkName('  Panthera   tigris ').ok && checkName('Panthera tigris').short === 'P. tigris');
  check('one word refused', !checkName('Panthera').ok && checkName('Panthera').fixed === '');
  check('trinomial and author noted', checkName('Panthera tigris tigris').extra.includes('subspecies') && checkName('Homo sapiens Linnaeus').extra.includes('described'));
};
