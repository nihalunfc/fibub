// #1366 Ortho/para/meta director. Checked against standard textbook outcomes of electrophilic substitution and
// IUPAC naming of disubstituted benzenes: nitration of phenol → 2- and 4-nitrophenol; of toluene →
// 1-methyl-2-nitrobenzene and 1-methyl-4-nitrobenzene; of nitrobenzene → 1,3-dinitrobenzene; bromination of
// nitrobenzene → 1-bromo-3-nitrobenzene; chlorination of chlorobenzene → 1,2- and 1,4-dichlorobenzene.
import * as D from '../../src/lib/sci/ring-directors.ts';
const S = (id) => D.SUBS.find((s) => s.id === id), E = (id) => D.ELECTROPHILES.find((e) => e.id === id);
const names = (s, e) => D.positions(S(s)).map((k) => D.productName(S(s), E(e), k));
export default async (check) => {
  check('directors: phenol nitration → 2- and 4-nitrophenol', names('OH', 'nitration').join() === '2-nitrophenol,4-nitrophenol');
  check('directors: toluene nitration names', names('CH3', 'nitration').join() === '1-methyl-2-nitrobenzene,1-methyl-4-nitrobenzene');
  check('directors: nitrobenzene nitration → 1,3-dinitrobenzene', names('NO2', 'nitration').join() === '1,3-dinitrobenzene');
  check('directors: nitrobenzene bromination → 1-bromo-3-nitrobenzene', names('NO2', 'bromination').join() === '1-bromo-3-nitrobenzene');
  check('directors: chlorobenzene chlorination → 1,2- and 1,4-dichlorobenzene', names('Cl', 'chlorination').join() === '1,2-dichlorobenzene,1,4-dichlorobenzene');
  check('directors: benzoic acid bromination → 3-bromobenzoic acid', names('COOH', 'bromination').join() === '3-bromobenzoic acid');
  check('directors: anisole bromination names', names('OCH3', 'bromination').join() === '1-bromo-2-methoxybenzene,1-bromo-4-methoxybenzene');
  check('directors: halogens are o/p but deactivating', S('Cl').dir === 'op' && !S('Cl').activates && S('Br').dir === 'op');
  check('directors: every −R group is meta, every activator is o/p', D.SUBS.every((s) => (s.resonance === '−R') === (s.dir === 'm')) && D.SUBS.filter((s) => s.activates).every((s) => s.dir === 'op'));
};
