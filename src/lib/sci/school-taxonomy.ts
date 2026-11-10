// Taxonomic hierarchy ladder (Class 11 biology, the living world): organisms placed from kingdom down to species,
// and the lowest rank two organisms share. Ranks follow the school scheme (kingdom, phylum or division, class,
// order, family, genus, species). Plain TypeScript, no DOM.
export const RANKS = ['Kingdom', 'Phylum / Division', 'Class', 'Order', 'Family', 'Genus', 'Species'] as const;
export type Taxon = { id: string; common: string; ranks: [string, string, string, string, string, string, string] };

// Standard classifications (common knowledge in biology; plants use the older dicot/monocot classes still taught).
export const TAXA: Taxon[] = [
  { id: 'human', common: 'Human', ranks: ['Animalia', 'Chordata', 'Mammalia', 'Primates', 'Hominidae', 'Homo', 'Homo sapiens'] },
  { id: 'tiger', common: 'Tiger', ranks: ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'Panthera tigris'] },
  { id: 'lion', common: 'Lion', ranks: ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'Panthera leo'] },
  { id: 'cat', common: 'House cat', ranks: ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Felis', 'Felis catus'] },
  { id: 'dog', common: 'Dog', ranks: ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Canidae', 'Canis', 'Canis familiaris'] },
  { id: 'peacock', common: 'Indian peafowl', ranks: ['Animalia', 'Chordata', 'Aves', 'Galliformes', 'Phasianidae', 'Pavo', 'Pavo cristatus'] },
  { id: 'housefly', common: 'Housefly', ranks: ['Animalia', 'Arthropoda', 'Insecta', 'Diptera', 'Muscidae', 'Musca', 'Musca domestica'] },
  { id: 'honeybee', common: 'Western honey bee', ranks: ['Animalia', 'Arthropoda', 'Insecta', 'Hymenoptera', 'Apidae', 'Apis', 'Apis mellifera'] },
  { id: 'mango', common: 'Mango', ranks: ['Plantae', 'Angiospermae', 'Dicotyledonae', 'Sapindales', 'Anacardiaceae', 'Mangifera', 'Mangifera indica'] },
  { id: 'neem', common: 'Neem', ranks: ['Plantae', 'Angiospermae', 'Dicotyledonae', 'Sapindales', 'Meliaceae', 'Azadirachta', 'Azadirachta indica'] },
  { id: 'wheat', common: 'Wheat', ranks: ['Plantae', 'Angiospermae', 'Monocotyledonae', 'Poales', 'Poaceae', 'Triticum', 'Triticum aestivum'] },
  { id: 'rice', common: 'Rice', ranks: ['Plantae', 'Angiospermae', 'Monocotyledonae', 'Poales', 'Poaceae', 'Oryza', 'Oryza sativa'] },
];
export const taxon = (id: string) => TAXA.find((t) => t.id === id)!;

/** How far down the ladder two organisms stay together: the index of the lowest shared rank, or −1 for none. */
export function shared(a: Taxon, b: Taxon): number {
  let k = -1;
  for (let i = 0; i < RANKS.length; i++) { if (a.ranks[i] === b.ranks[i]) k = i; else break; }
  return k;
}
/** Binomial name check: genus capitalised, species epithet lower case, two words. */
export const isBinomial = (s: string) => /^[A-Z][a-z]+ [a-z]+$/.test(s.trim());
