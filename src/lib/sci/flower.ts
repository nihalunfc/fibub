// Parts of a flower and the steps from pollination to seed, for school (Class 9/10) and Class 12 (embryo sac and
// double fertilisation). Text is fibub's own. Plain TypeScript, no DOM.

export type Part = { id: string; name: string; group: string; job: string };
export const PARTS: Part[] = [
  { id: 'sepal', name: 'Sepal', group: 'Calyx (outer ring)', job: 'Green leaf-like parts that protect the flower while it is a bud.' },
  { id: 'petal', name: 'Petal', group: 'Corolla', job: 'Often bright and scented to attract insects and birds that carry pollen.' },
  { id: 'anther', name: 'Anther', group: 'Stamen (male part)', job: 'Makes pollen grains, which carry the male gametes.' },
  { id: 'filament', name: 'Filament', group: 'Stamen (male part)', job: 'The stalk that holds the anther up.' },
  { id: 'stigma', name: 'Stigma', group: 'Pistil / carpel (female part)', job: 'The sticky top where pollen lands and is caught.' },
  { id: 'style', name: 'Style', group: 'Pistil / carpel (female part)', job: 'The tube the pollen tube grows down to reach the ovary.' },
  { id: 'ovary', name: 'Ovary', group: 'Pistil / carpel (female part)', job: 'Holds the ovules; after fertilisation it becomes the fruit.' },
  { id: 'ovule', name: 'Ovule', group: 'Inside the ovary', job: 'Contains the egg cell; after fertilisation it becomes the seed.' },
  { id: 'receptacle', name: 'Receptacle', group: 'Base', job: 'The swollen top of the stalk that all the flower parts sit on.' },
];
export const part = (id: string) => PARTS.find((p) => p.id === id)!;

export type Level = '10' | '12';
/** Captions along the stage slider (0..1). */
export function stageText(level: Level, cross: boolean, t: number): string {
  const s: [number, string][] = [
    [0, cross ? 'Pollination: a bee brings pollen from another flower of the same kind and leaves it on the stigma (cross-pollination).' : 'Pollination: pollen from this flower\'s own anthers falls on its stigma (self-pollination).'],
    [0.25, level === '12' ? 'The pollen grain grows a pollen tube down the style. It carries two male gametes.' : 'The pollen grain grows a pollen tube down through the style.'],
    [0.55, level === '12' ? 'Double fertilisation: one male gamete fuses with the egg (zygote, 2n); the other fuses with the two polar nuclei (primary endosperm nucleus, 3n).' : 'Fertilisation: the male gamete from the tube fuses with the egg cell in the ovule, making a zygote.'],
    [0.8, level === '12' ? 'The zygote grows into the embryo and the endosperm feeds it; the ovule becomes the seed and the ovary the fruit. Petals and stamens wither.' : 'The zygote grows into an embryo, the ovule becomes a seed and the ovary ripens into a fruit. Petals fall off.'],
  ];
  let c = s[0][1]; for (const [at, x] of s) if (t >= at) c = x; return c;
}

/** The mature embryo sac (Polygonum type, the common one): 7 cells, 8 nuclei. */
export const EMBRYO_SAC = [
  { name: 'Egg cell', n: 1, cells: 1 }, { name: 'Synergids', n: 2, cells: 2 }, { name: 'Antipodal cells', n: 3, cells: 3 }, { name: 'Central cell (2 polar nuclei)', n: 2, cells: 1 },
];
export const sacCells = () => EMBRYO_SAC.reduce((s, x) => s + x.cells, 0);
export const sacNuclei = () => EMBRYO_SAC.reduce((s, x) => s + x.n, 0);
