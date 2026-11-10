// Plant life cycles and alternation of generations (Class 11 biology, plant kingdom): each group's stages round a
// wheel, with the ploidy (n or 2n) of each stage, where meiosis and fertilisation happen, and how much of the
// life the gametophyte and sporophyte take up. A teaching model; shares of the wheel are rough, not measured.
// Plain TypeScript, no DOM.
export type Stage = { name: string; ploidy: 1 | 2; share: number; note: string; end?: 'meiosis' | 'fertilisation' };
export type Group = { id: string; label: string; example: string; pattern: 'haplontic' | 'diplontic' | 'haplo-diplontic'; dominant: 'gametophyte' | 'sporophyte'; water: boolean; stages: Stage[]; extra?: string };

export const GROUPS: Group[] = [
  { id: 'alga', label: 'Green alga', example: 'Chlamydomonas, Spirogyra', pattern: 'haplontic', dominant: 'gametophyte', water: true, stages: [
    { name: 'Haploid alga', ploidy: 1, share: 0.55, note: 'The free-living, photosynthetic plant body is haploid (n).' },
    { name: 'Gametes', ploidy: 1, share: 0.15, note: 'Gametes form by mitosis and swim in water.', end: 'fertilisation' },
    { name: 'Zygote', ploidy: 2, share: 0.1, note: 'The zygote is the only diploid stage; it often rests through bad seasons.', end: 'meiosis' },
    { name: 'Haploid spores', ploidy: 1, share: 0.2, note: 'Meiosis in the zygote gives haploid spores that grow into new algae.' },
  ] },
  { id: 'moss', label: 'Bryophyte', example: 'moss, liverwort', pattern: 'haplo-diplontic', dominant: 'gametophyte', water: true, stages: [
    { name: 'Leafy gametophyte', ploidy: 1, share: 0.42, note: 'The green moss plant you see is the haploid gametophyte, growing from a thread-like protonema.' },
    { name: 'Sperm and egg', ploidy: 1, share: 0.1, note: 'Antheridia make swimming sperm; archegonia hold the egg. Sperm need a film of water.', end: 'fertilisation' },
    { name: 'Zygote', ploidy: 2, share: 0.06, note: 'Fertilisation inside the archegonium gives the diploid zygote.' },
    { name: 'Sporophyte (foot, seta, capsule)', ploidy: 2, share: 0.2, note: 'The sporophyte stays attached to the gametophyte and depends on it for food.', end: 'meiosis' },
    { name: 'Spores', ploidy: 1, share: 0.12, note: 'Meiosis in the capsule gives haploid spores.' },
    { name: 'Protonema', ploidy: 1, share: 0.1, note: 'A spore germinates into a green thread, the protonema, which buds into leafy shoots.' },
  ] },
  { id: 'fern', label: 'Pteridophyte', example: 'fern, horsetail', pattern: 'haplo-diplontic', dominant: 'sporophyte', water: true, stages: [
    { name: 'Fern plant (sporophyte)', ploidy: 2, share: 0.5, note: 'The fern with roots, stem and leaves is the diploid sporophyte, free-living and long-lived.' },
    { name: 'Sporangia', ploidy: 2, share: 0.08, note: 'Sporangia on the undersides of leaves make spores.', end: 'meiosis' },
    { name: 'Spores', ploidy: 1, share: 0.08, note: 'Meiosis gives haploid spores, spread by wind.' },
    { name: 'Prothallus (gametophyte)', ploidy: 1, share: 0.18, note: 'A tiny, flat, green, free-living gametophyte that needs damp shade.' },
    { name: 'Sperm and egg', ploidy: 1, share: 0.06, note: 'Sperm swim to the egg, so fertilisation needs water.', end: 'fertilisation' },
    { name: 'Zygote and embryo', ploidy: 2, share: 0.1, note: 'The zygote grows into a new sporophyte; the prothallus dies.' },
  ] },
  { id: 'gymno', label: 'Gymnosperm', example: 'pine, cycas', pattern: 'diplontic', dominant: 'sporophyte', water: false, stages: [
    { name: 'Tree (sporophyte)', ploidy: 2, share: 0.62, note: 'The tree is the diploid sporophyte; it carries male and female cones.' },
    { name: 'Cones and sporangia', ploidy: 2, share: 0.06, note: 'Microsporangia in male cones, ovules (megasporangia) on female cones.', end: 'meiosis' },
    { name: 'Pollen and megaspore', ploidy: 1, share: 0.06, note: 'Meiosis gives microspores (which become pollen) and a megaspore.' },
    { name: 'Gametophytes', ploidy: 1, share: 0.08, note: 'The male gametophyte is a few cells in the pollen; the female gametophyte stays inside the ovule. Neither lives on its own.', end: 'fertilisation' },
    { name: 'Zygote and embryo', ploidy: 2, share: 0.08, note: 'Pollen tubes carry the male gametes, so no water is needed.' },
    { name: 'Naked seed', ploidy: 2, share: 0.1, note: 'The ovule becomes a seed, not enclosed in a fruit.' },
  ], extra: 'The seed coat and embryo are 2n; the stored food around the embryo is the female gametophyte tissue (n).' },
  { id: 'angio', label: 'Angiosperm', example: 'mango, mustard, grass', pattern: 'diplontic', dominant: 'sporophyte', water: false, stages: [
    { name: 'Flowering plant (sporophyte)', ploidy: 2, share: 0.6, note: 'The whole plant is the diploid sporophyte.' },
    { name: 'Anther and ovule', ploidy: 2, share: 0.06, note: 'Microspore mother cells in the anther and the megaspore mother cell in the ovule.', end: 'meiosis' },
    { name: 'Microspores and megaspore', ploidy: 1, share: 0.05, note: 'Meiosis gives four microspores per mother cell, and one functional megaspore.' },
    { name: 'Pollen grain and embryo sac', ploidy: 1, share: 0.09, note: 'The pollen grain (2 or 3 cells) and the embryo sac (7 cells, 8 nuclei) are the tiny gametophytes.', end: 'fertilisation' },
    { name: 'Zygote and embryo', ploidy: 2, share: 0.08, note: 'Double fertilisation: one male gamete + egg = zygote (2n); the other + two polar nuclei = endosperm (3n).' },
    { name: 'Seed in a fruit', ploidy: 2, share: 0.12, note: 'The ovule becomes the seed and the ovary the fruit.' },
  ], extra: 'Endosperm, the food store of many seeds, is triploid (3n): two polar nuclei and one male gamete.' },
  { id: 'human', label: 'Human (for comparison)', example: 'most animals', pattern: 'diplontic', dominant: 'sporophyte', water: false, stages: [
    { name: 'Body', ploidy: 2, share: 0.8, note: 'Every body cell is diploid (2n = 46).', end: 'meiosis' },
    { name: 'Sperm and egg', ploidy: 1, share: 0.1, note: 'Meiosis makes haploid gametes (n = 23) directly; there is no haploid plant-like stage.', end: 'fertilisation' },
    { name: 'Zygote', ploidy: 2, share: 0.1, note: 'Fertilisation restores 2n.' },
  ] },
];

/** Total share of the wheel spent haploid and diploid. */
export const phaseShare = (g: Group) => ({ n: g.stages.filter((s) => s.ploidy === 1).reduce((a, s) => a + s.share, 0), dn: g.stages.filter((s) => s.ploidy === 2).reduce((a, s) => a + s.share, 0) });

/** Check that ploidy only changes at meiosis (2n → n) and fertilisation (n → 2n), round the whole loop. */
export function consistent(g: Group): boolean {
  const s = g.stages;
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = s[(i + 1) % s.length];
    if (a.end === 'meiosis' && !(a.ploidy === 2 && b.ploidy === 1)) return false;
    if (a.end === 'fertilisation' && !(a.ploidy === 1 && b.ploidy === 2)) return false;
    if (!a.end && a.ploidy !== b.ploidy) return false;
  }
  return Math.abs(s.reduce((x, y) => x + y.share, 0) - 1) < 1e-9;
}
