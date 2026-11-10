// #1438 Double fertilisation stepper. Checked against the standard account of the Polygonum-type embryo sac
// (1 meiosis + 3 free-nuclear mitoses → 8 nuclei, 7 cells), syngamy (2n) and triple fusion (3n), and the classic
// worked count of meiotic divisions for seeds (100 seeds need 100 + 25 = 125).
import { STAGES, chromosomes, meiosesForSeeds, sacDivisions, PLANTS } from '../../src/lib/sci/dblfert.ts';

export default async (check) => {
  const st = (id) => STAGES.find((s) => s.id === id);
  const sum = (s, f = () => true) => s.items.filter(f).reduce((a, it) => a + (typeof it.count === 'number' ? it.count : 0), 0);
  check('dblfert: 11 steps', STAGES.length === 11 && new Set(STAGES.map((s) => s.id)).size === 11);
  check('dblfert: meiosis gives 4 haploid megaspores', sum(st('meiosis')) === 4 && st('meiosis').items.every((i) => i.ploidy === 1));
  check('dblfert: nuclei double with each mitosis', st('two').nuclei === 2 && st('four').nuclei === 4 && st('eight').nuclei === 8 && 2 ** sacDivisions.mitoses === 8);
  check('dblfert: mature sac 7 cells, 8 nuclei', st('sac').cells === 7 && st('sac').nuclei === 8 && sum(st('sac')) === 8);
  check('dblfert: zygote 2n and endosperm 3n', st('fusion').items.find((i) => i.name.startsWith('Zygote')).ploidy === 2 && st('fusion').items.find((i) => i.name.startsWith('Primary')).ploidy === 3);
  check('dblfert: after fusion 7 nuclei remain', st('fusion').nuclei === 7 && sum(st('fusion')) === 7);
  check('dblfert: maize chromosomes 10, 20, 30', chromosomes(20, 1) === 10 && chromosomes(20, 2) === 20 && chromosomes(20, 3) === 30);
  check('dblfert: wheat endosperm 63', chromosomes(42, 3) === 63);
  check('dblfert: 100 seeds need 125 meioses; 1 seed needs 2', meiosesForSeeds(100) === 125 && meiosesForSeeds(1) === 2 && meiosesForSeeds(40) === 50);
  check('dblfert: plant numbers even', PLANTS.every((p) => p.twoN % 2 === 0));
};
