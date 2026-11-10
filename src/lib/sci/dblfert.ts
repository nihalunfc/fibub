// Double fertilisation stepper (Learn, #1438): from the megaspore mother cell to the 7-celled, 8-nucleate embryo
// sac (Polygonum type), then pollen tube, syngamy and triple fusion, with a ploidy counter. Plain data, no DOM.

/** ploidy: 1 = n, 2 = 2n, 3 = 3n. */
export type Item = { name: string; ploidy: 1 | 2 | 3; count: number | 'many'; gone?: boolean };
export type Stage = { id: string; title: string; text: string; items: Item[]; cells: number; nuclei: number; part: 'sac' | 'fert' };

export const STAGES: Stage[] = [
  { id: 'mmc', part: 'sac', title: 'Megaspore mother cell', cells: 1, nuclei: 1,
    text: 'Inside the ovule, one large cell of the nucellus near the micropyle becomes the megaspore mother cell (MMC). It is diploid, like the rest of the plant.',
    items: [{ name: 'Megaspore mother cell', ploidy: 2, count: 1 }] },
  { id: 'meiosis', part: 'sac', title: 'Meiosis: four megaspores', cells: 4, nuclei: 4,
    text: 'The MMC divides by meiosis (megasporogenesis) into a line of four megaspores. Each has half the chromosomes: n.',
    items: [{ name: 'Megaspore', ploidy: 1, count: 4 }] },
  { id: 'functional', part: 'sac', title: 'One megaspore survives', cells: 1, nuclei: 1,
    text: 'In most flowering plants three megaspores die, and only the one at the chalazal end (away from the micropyle) goes on. It is the functional megaspore.',
    items: [{ name: 'Functional megaspore', ploidy: 1, count: 1 }, { name: 'Megaspores breaking down', ploidy: 1, count: 3, gone: true }] },
  { id: 'two', part: 'sac', title: 'Mitosis 1: two nuclei', cells: 1, nuclei: 2,
    text: 'The functional megaspore grows and its nucleus divides by mitosis. No wall forms between the nuclei (free nuclear division); one moves to each end.',
    items: [{ name: 'Free nucleus', ploidy: 1, count: 2 }] },
  { id: 'four', part: 'sac', title: 'Mitosis 2: four nuclei', cells: 1, nuclei: 4,
    text: 'Each nucleus divides again: two at the micropylar end, two at the chalazal end.',
    items: [{ name: 'Free nucleus', ploidy: 1, count: 4 }] },
  { id: 'eight', part: 'sac', title: 'Mitosis 3: eight nuclei', cells: 1, nuclei: 8,
    text: 'A third mitosis gives eight nuclei, four at each end. Three mitoses in all, so 2 × 2 × 2 = 8.',
    items: [{ name: 'Free nucleus', ploidy: 1, count: 8 }] },
  { id: 'sac', part: 'sac', title: 'Embryo sac: 7 cells, 8 nuclei', cells: 7, nuclei: 8,
    text: 'Walls form. At the micropylar end: the egg apparatus (two synergids and the egg). At the chalazal end: three antipodal cells. One nucleus from each end moves to the middle: the two polar nuclei share the large central cell. So 7 cells but 8 nuclei.',
    items: [{ name: 'Synergid', ploidy: 1, count: 2 }, { name: 'Egg cell', ploidy: 1, count: 1 }, { name: 'Polar nucleus (central cell)', ploidy: 1, count: 2 }, { name: 'Antipodal cell', ploidy: 1, count: 3 }] },
  { id: 'tube', part: 'fert', title: 'Pollen tube grows', cells: 7, nuclei: 8,
    text: 'A pollen grain lands on the stigma and grows a pollen tube down the style. The tube carries the tube (vegetative) nucleus and two male gametes, made by mitosis of the generative cell. It enters the ovule through the micropyle.',
    items: [{ name: 'Synergid', ploidy: 1, count: 2 }, { name: 'Egg cell', ploidy: 1, count: 1 }, { name: 'Polar nucleus (central cell)', ploidy: 1, count: 2 }, { name: 'Antipodal cell', ploidy: 1, count: 3 }, { name: 'Male gamete (in the tube)', ploidy: 1, count: 2 }, { name: 'Tube nucleus', ploidy: 1, count: 1 }] },
  { id: 'release', part: 'fert', title: 'Two male gametes released', cells: 7, nuclei: 8,
    text: 'Guided by the filiform apparatus, the tube enters one synergid and bursts, releasing both male gametes into the embryo sac.',
    items: [{ name: 'Synergid', ploidy: 1, count: 2 }, { name: 'Egg cell', ploidy: 1, count: 1 }, { name: 'Polar nucleus (central cell)', ploidy: 1, count: 2 }, { name: 'Antipodal cell', ploidy: 1, count: 3 }, { name: 'Male gamete (free)', ploidy: 1, count: 2 }] },
  { id: 'fusion', part: 'fert', title: 'Double fertilisation', cells: 7, nuclei: 7,
    text: 'One male gamete fuses with the egg: syngamy, giving the zygote (n + n = 2n). The other fuses with the two polar nuclei: triple fusion, giving the primary endosperm nucleus (n + n + n = 3n). Two fusions in one embryo sac: double fertilisation, found only in flowering plants.',
    items: [{ name: 'Zygote (syngamy)', ploidy: 2, count: 1 }, { name: 'Primary endosperm nucleus (triple fusion)', ploidy: 3, count: 1 }, { name: 'Synergid', ploidy: 1, count: 2, gone: true }, { name: 'Antipodal cell', ploidy: 1, count: 3, gone: true }] },
  { id: 'seed', part: 'fert', title: 'Embryo, endosperm, seed', cells: 0, nuclei: 0,
    text: 'The primary endosperm nucleus divides first to make the endosperm, the food store. The zygote then divides to make the embryo. Synergids and antipodals disappear. The ovule becomes the seed and the ovary becomes the fruit; the seed coat comes from the integuments, the mother’s own 2n tissue.',
    items: [{ name: 'Embryo', ploidy: 2, count: 'many' }, { name: 'Endosperm', ploidy: 3, count: 'many' }, { name: 'Seed coat (from integuments)', ploidy: 2, count: 'many' }] },
];

/** Chromosomes in a cell of ploidy p for a plant whose body cells have 2n chromosomes. */
export const chromosomes = (twoN: number, p: 1 | 2 | 3) => (twoN / 2) * p;
/** Meiotic divisions needed for `seeds` seeds: one per ovule (each gives one embryo sac) plus one per four pollen
 * grains (each microspore mother cell gives four). */
export const meiosesForSeeds = (seeds: number) => seeds + Math.ceil(seeds / 4);
/** Nuclear divisions to make one embryo sac from a megaspore mother cell. */
export const sacDivisions = { meiosis: 1, mitoses: 3 };

export const PLANTS: { name: string; twoN: number }[] = [
  { name: 'Pea', twoN: 14 }, { name: 'Onion', twoN: 16 }, { name: 'Maize', twoN: 20 }, { name: 'Rice', twoN: 24 }, { name: 'Bread wheat', twoN: 42 },
];
