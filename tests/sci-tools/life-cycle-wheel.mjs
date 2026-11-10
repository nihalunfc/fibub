// #1390 life cycle wheel. Each group's cycle checked against standard botany: ploidy changes only at meiosis
// (2n → n) and fertilisation (n → 2n), exactly one of each per cycle, the dominant phase has the larger share,
// and the patterns are haplontic (algae such as Chlamydomonas), haplo-diplontic (bryophytes, pteridophytes) and
// diplontic (seed plants, animals).
import * as L from '../../src/lib/sci/school-lifecycle.ts';
export default async (check) => {
  check('lifecycle: 6 groups', L.GROUPS.length === 6);
  for (const g of L.GROUPS) {
    check(`lifecycle: ${g.id} ploidy changes only at meiosis and fertilisation, shares add to 1`, L.consistent(g));
    check(`lifecycle: ${g.id} has one meiosis and one fertilisation`, g.stages.filter((s) => s.end === 'meiosis').length === 1 && g.stages.filter((s) => s.end === 'fertilisation').length === 1);
    const p = L.phaseShare(g);
    check(`lifecycle: ${g.id} dominant phase is ${g.dominant}`, g.dominant === 'gametophyte' ? p.n > p.dn : p.dn > p.n);
  }
  const pat = Object.fromEntries(L.GROUPS.map((g) => [g.id, g.pattern]));
  check('lifecycle: patterns', pat.alga === 'haplontic' && pat.moss === 'haplo-diplontic' && pat.fern === 'haplo-diplontic' && pat.gymno === 'diplontic' && pat.angio === 'diplontic' && pat.human === 'diplontic');
  check('lifecycle: only seed plants and animals do without water for fertilisation', L.GROUPS.filter((g) => !g.water).map((g) => g.id).join() === 'gymno,angio,human');
  check('lifecycle: a broken cycle is caught', !L.consistent({ ...L.GROUPS[0], stages: L.GROUPS[0].stages.map((s, i) => (i === 2 ? { ...s, ploidy: 1 } : s)) }));
};
