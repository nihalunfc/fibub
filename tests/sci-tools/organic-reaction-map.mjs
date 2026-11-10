// #1436 Organic reaction map. The fewest-steps distances for all 625 ordered pairs of families (all reactions,
// carbon-keeping reactions only, and Class 11 reactions only) were checked against an independent Python
// breadth-first search over the same edge list (0 mismatches). The routes below are standard textbook sequences.
import { FAMS, RXNS, route, routes, distance, steps, famById } from '../../src/lib/sci/orgmap.ts';

export default async (check) => {
  const to = (r) => r && r.map((x) => x.to).join(',');
  check('orgmap: every reaction joins known families', RXNS.every((r) => famById(r.from) && famById(r.to) && r.from !== r.to));
  check('orgmap: 25 families with unique ids', FAMS.length === 25 && new Set(FAMS.map((f) => f.id)).size === 25);
  check('orgmap: Class 11 routes stay inside Class 11 families', distance('alkyne', 'ketone', { lv: 11 }) === Infinity && distance('alkyne', 'ketone') === 1 && distance('benzene', 'alkane', { lv: 11 }) === Infinity);
  check('orgmap: propan-1-ol to propanone via propene and propan-2-ol', to(route('alcohol1', 'ketone')) === 'alkene,alcohol2,ketone');
  check('orgmap: 1° alcohol straight to aldehyde (PCC)', to(route('alcohol1', 'aldehyde')) === 'aldehyde' && steps('alcohol1', 'aldehyde')[0].reagent.startsWith('PCC'));
  check('orgmap: no direct 1° alcohol → ketone and no ketone → aldehyde step', steps('alcohol1', 'ketone').length === 0 && steps('ketone', 'aldehyde').length === 0);
  check('orgmap: ketone to aldehyde needs 4 steps (via 2° alcohol, alkene, 1° alcohol)', to(route('ketone', 'aldehyde')) === 'alcohol2,alkene,alcohol1,aldehyde');
  check('orgmap: amide to amine is Hoffmann (1 step) or via nitrile when carbons are kept', distance('amide', 'amine') === 1 && to(route('amide', 'amine', { keepCarbons: true })) === 'nitrile,amine');
  check('orgmap: nitrobenzene to phenol through aniline and the diazonium salt', to(route('nitrobenzene', 'phenol')) === 'aniline,diazonium,phenol');
  check('orgmap: alkene to alkyne through the dihalide', to(route('alkene', 'alkyne')) === 'dihalide,alkyne');
  check('orgmap: the azo dye is a dead end', FAMS.every((f) => f.id === 'azo' || distance('azo', f.id) === Infinity));
  check('orgmap: Class 11 has no alcohols', distance('alkene', 'alcohol1', { lv: 11 }) === Infinity && distance('alkene', 'alcohol1') === 1);
  check('orgmap: halide to acid adding one carbon (KCN or Grignard) blocked when keeping carbons', distance('halide1', 'acid') === 2 && to(route('halide1', 'acid', { keepCarbons: true })) === 'alcohol1,acid');
  check('orgmap: route to self is empty', route('acid', 'acid').length === 0);
  const rs = routes('alcohol1', 'ketone', 4);
  check('orgmap: other routes are simple and end right', rs.length >= 2 && rs.every((p) => p[0] === 'alcohol1' && p.at(-1) === 'ketone' && new Set(p).size === p.length) && rs[0].length === 4);
  check('orgmap: carbon changes marked', steps('halide1', 'nitrile')[0].dc === 1 && steps('amide', 'amine')[0].dc === -1 && steps('acid', 'alkane')[0].dc === -1 && steps('grignard', 'alcohol1')[0].dc === 1);
};
