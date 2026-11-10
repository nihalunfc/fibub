// Five-kingdom sorter (Class 11 biology, biological classification; Class 9 diversity): Whittaker's five
// kingdoms decided from a few features of an organism, and a set of example organisms with those features.
// A teaching model: real classification uses many more characters and DNA. Plain TypeScript, no DOM.
export type Cell = 'pro' | 'eu';
export type Org = 'uni' | 'multi';
export type Wall = 'none' | 'cellulose' | 'chitin' | 'other';
export type Food = 'auto' | 'hetero' | 'both';
export type Features = { cell: Cell; org: Org; wall: Wall; food: Food };
export type Kingdom = 'Monera' | 'Protista' | 'Fungi' | 'Plantae' | 'Animalia';
export const KINGDOMS: Kingdom[] = ['Monera', 'Protista', 'Fungi', 'Plantae', 'Animalia'];

/** What each kingdom is usually like (fibub's own summary of Whittaker's 1969 scheme). */
export const TRAITS: Record<Kingdom, { cell: string; wall: string; body: string; food: string; examples: string }> = {
  Monera: { cell: 'Prokaryotic (no nucleus)', wall: 'Non-cellulosic (peptidoglycan)', body: 'Single cells', food: 'Autotrophic or heterotrophic', examples: 'bacteria, cyanobacteria' },
  Protista: { cell: 'Eukaryotic', wall: 'Present in some', body: 'Single cells', food: 'Autotrophic, heterotrophic or both', examples: 'Amoeba, Paramecium, Euglena, diatoms' },
  Fungi: { cell: 'Eukaryotic', wall: 'Chitin', body: 'Mostly multicellular threads (loose tissue)', food: 'Heterotrophic (absorb food)', examples: 'yeast, moulds, mushrooms' },
  Plantae: { cell: 'Eukaryotic', wall: 'Cellulose', body: 'Tissues and organs', food: 'Autotrophic (photosynthesis)', examples: 'algae, mosses, ferns, conifers, flowering plants' },
  Animalia: { cell: 'Eukaryotic', wall: 'None', body: 'Tissues, organs and organ systems', food: 'Heterotrophic (ingest food)', examples: 'sponges, worms, insects, fish, mammals' },
};

/** The kingdom for a set of features, with the reason, or null and a note when the mix fits none. */
export function classify(f: Features): { kingdom: Kingdom | null; why: string } {
  if (f.cell === 'pro') {
    if (f.org === 'multi') return { kingdom: 'Monera', why: 'Prokaryotic cells always put an organism in Monera. (Some bacteria live in chains or colonies, but each cell lives on its own.)' };
    return { kingdom: 'Monera', why: 'Prokaryotic: no true nucleus. Every prokaryote is in Monera.' };
  }
  if (f.wall === 'chitin') return f.food === 'auto' ? { kingdom: null, why: 'Cells with chitin walls belong to fungi, but no fungus makes its own food. This mix does not fit a kingdom.' } : { kingdom: 'Fungi', why: 'Eukaryotic with a chitin wall and absorbing its food: a fungus (yeast is a single-celled one).' };
  if (f.org === 'uni') return { kingdom: 'Protista', why: 'Eukaryotic but a single cell (and not a yeast): Protista.' };
  if (f.wall === 'cellulose') return { kingdom: 'Plantae', why: f.food === 'auto' ? 'Many-celled, eukaryotic, cellulose wall, makes its own food: a plant.' : 'Many-celled with cellulose walls: a plant, even though this one does not make all its own food (like the parasite Cuscuta).' };
  if (f.wall === 'none') return f.food === 'auto' ? { kingdom: null, why: 'Many-celled, no cell wall and making its own food: no kingdom in this scheme looks like that.' } : { kingdom: 'Animalia', why: 'Many-celled, eukaryotic, no cell wall, eats other living things: an animal.' };
  return { kingdom: null, why: 'Many-celled organisms with an unusual wall are not covered by the simple rules here.' };
}

export type Example = Features & { id: string; name: string; kingdom: Kingdom; draw: string; note: string };
// Features are common textbook knowledge; the notes are fibub's own words.
export const EXAMPLES: Example[] = [
  { id: 'ecoli', name: 'Gut bacterium (E. coli)', cell: 'pro', org: 'uni', wall: 'other', food: 'hetero', kingdom: 'Monera', draw: 'rod', note: 'A rod-shaped bacterium that lives in our intestines.' },
  { id: 'nostoc', name: 'Cyanobacterium (Nostoc)', cell: 'pro', org: 'uni', wall: 'other', food: 'auto', kingdom: 'Monera', draw: 'chain', note: 'Photosynthesises and fixes nitrogen; cells form chains in a jelly.' },
  { id: 'amoeba', name: 'Amoeba', cell: 'eu', org: 'uni', wall: 'none', food: 'hetero', kingdom: 'Protista', draw: 'blob', note: 'Moves and feeds with false feet (pseudopodia).' },
  { id: 'paramecium', name: 'Paramecium', cell: 'eu', org: 'uni', wall: 'none', food: 'hetero', kingdom: 'Protista', draw: 'slipper', note: 'Covered in cilia that beat to move it and sweep food in.' },
  { id: 'euglena', name: 'Euglena', cell: 'eu', org: 'uni', wall: 'none', food: 'both', kingdom: 'Protista', draw: 'flagellate', note: 'Photosynthesises in light and eats food in the dark.' },
  { id: 'diatom', name: 'Diatom', cell: 'eu', org: 'uni', wall: 'other', food: 'auto', kingdom: 'Protista', draw: 'box', note: 'A single cell in a two-part glassy (silica) shell.' },
  { id: 'yeast', name: 'Yeast', cell: 'eu', org: 'uni', wall: 'chitin', food: 'hetero', kingdom: 'Fungi', draw: 'budding', note: 'A single-celled fungus that grows by budding; used in baking.' },
  { id: 'mushroom', name: 'Mushroom', cell: 'eu', org: 'multi', wall: 'chitin', food: 'hetero', kingdom: 'Fungi', draw: 'mushroom', note: 'The part we see is the fruiting body; threads (hyphae) run through the soil.' },
  { id: 'rhizopus', name: 'Bread mould (Rhizopus)', cell: 'eu', org: 'multi', wall: 'chitin', food: 'hetero', kingdom: 'Fungi', draw: 'mould', note: 'Hyphae grow over bread and absorb the food.' },
  { id: 'spirogyra', name: 'Green alga (Spirogyra)', cell: 'eu', org: 'multi', wall: 'cellulose', food: 'auto', kingdom: 'Plantae', draw: 'filament', note: 'A thread of cells with spiral chloroplasts, in ponds.' },
  { id: 'moss', name: 'Moss', cell: 'eu', org: 'multi', wall: 'cellulose', food: 'auto', kingdom: 'Plantae', draw: 'moss', note: 'A small plant of damp places, without true roots.' },
  { id: 'fern', name: 'Fern', cell: 'eu', org: 'multi', wall: 'cellulose', food: 'auto', kingdom: 'Plantae', draw: 'fern', note: 'Has roots, stems and leaves with veins, but no seeds.' },
  { id: 'mango', name: 'Mango tree', cell: 'eu', org: 'multi', wall: 'cellulose', food: 'auto', kingdom: 'Plantae', draw: 'tree', note: 'A flowering plant: seeds inside a fruit.' },
  { id: 'cuscuta', name: 'Dodder (Cuscuta)', cell: 'eu', org: 'multi', wall: 'cellulose', food: 'hetero', kingdom: 'Plantae', draw: 'vine', note: 'A plant that has given up photosynthesis and sucks food from its host.' },
  { id: 'sponge', name: 'Sponge', cell: 'eu', org: 'multi', wall: 'none', food: 'hetero', kingdom: 'Animalia', draw: 'sponge', note: 'A simple animal that filters food from water through its pores.' },
  { id: 'earthworm', name: 'Earthworm', cell: 'eu', org: 'multi', wall: 'none', food: 'hetero', kingdom: 'Animalia', draw: 'worm', note: 'A segmented worm that eats soil.' },
  { id: 'housefly', name: 'Housefly', cell: 'eu', org: 'multi', wall: 'none', food: 'hetero', kingdom: 'Animalia', draw: 'insect', note: 'An insect: six jointed legs and wings.' },
  { id: 'fish', name: 'Rohu fish', cell: 'eu', org: 'multi', wall: 'none', food: 'hetero', kingdom: 'Animalia', draw: 'fish', note: 'A bony fish with a backbone.' },
];
export const FEATURE_TEXT = {
  cell: { pro: 'prokaryotic', eu: 'eukaryotic' },
  org: { uni: 'one cell', multi: 'many cells' },
  wall: { none: 'no cell wall', cellulose: 'cellulose wall', chitin: 'chitin wall', other: 'another kind of wall' },
  food: { auto: 'makes its own food', hetero: 'takes in food', both: 'both' },
} as const;
