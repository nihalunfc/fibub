// Classification for school: the five kingdoms, a handful of familiar species with their ranks from kingdom to
// species, the lowest rank two species share, and a checker for binomial (two-part scientific) names.
// Ranks are widely published general facts; this selection and the text are fibub's own. Plain TypeScript, no DOM.

export const RANKS = ['Kingdom', 'Phylum / Division', 'Class', 'Order', 'Family', 'Genus', 'Species'] as const;
export type Sp = { id: string; common: string; ranks: string[]; note?: string };
const sp = (id: string, common: string, r: string, note?: string): Sp => ({ id, common, ranks: r.split('|'), note });

export const SPECIES: Sp[] = [
  sp('human', 'Human', 'Animalia|Chordata|Mammalia|Primates|Hominidae|Homo|Homo sapiens'),
  sp('tiger', 'Tiger', 'Animalia|Chordata|Mammalia|Carnivora|Felidae|Panthera|Panthera tigris'),
  sp('lion', 'Lion', 'Animalia|Chordata|Mammalia|Carnivora|Felidae|Panthera|Panthera leo'),
  sp('cat', 'House cat', 'Animalia|Chordata|Mammalia|Carnivora|Felidae|Felis|Felis catus'),
  sp('peafowl', 'Indian peafowl (peacock)', 'Animalia|Chordata|Aves|Galliformes|Phasianidae|Pavo|Pavo cristatus'),
  sp('housefly', 'Housefly', 'Animalia|Arthropoda|Insecta|Diptera|Muscidae|Musca|Musca domestica'),
  sp('mango', 'Mango', 'Plantae|Angiospermae|Dicotyledonae|Sapindales|Anacardiaceae|Mangifera|Mangifera indica'),
  sp('potato', 'Potato', 'Plantae|Angiospermae|Dicotyledonae|Solanales|Solanaceae|Solanum|Solanum tuberosum', 'Older books put potato and brinjal in the order Polemoniales; Solanales is the name used today.'),
  sp('brinjal', 'Brinjal (eggplant)', 'Plantae|Angiospermae|Dicotyledonae|Solanales|Solanaceae|Solanum|Solanum melongena'),
  sp('wheat', 'Wheat', 'Plantae|Angiospermae|Monocotyledonae|Poales|Poaceae|Triticum|Triticum aestivum'),
  sp('mushroom', 'Button mushroom', 'Fungi|Basidiomycota|Agaricomycetes|Agaricales|Agaricaceae|Agaricus|Agaricus bisporus'),
  sp('euglena', 'Euglena', 'Protista|Euglenozoa|Euglenoidea|Euglenales|Euglenaceae|Euglena|Euglena gracilis'),
  sp('ecoli', 'E. coli (gut bacterium)', 'Monera|Pseudomonadota|Gammaproteobacteria|Enterobacterales|Enterobacteriaceae|Escherichia|Escherichia coli', 'Pseudomonadota was called Proteobacteria until 2021.'),
];
export const byId = (id: string) => SPECIES.find((s) => s.id === id)!;

export const KINGDOMS: Record<string, string> = {
  Monera: 'Single cells with no nucleus (prokaryotes): bacteria.',
  Protista: 'Single cells with a nucleus: Euglena, Amoeba, Paramecium, many algae.',
  Fungi: 'Take in food from dead or living matter; cell walls of chitin: mushrooms, moulds, yeast.',
  Plantae: 'Many cells, make their own food by photosynthesis, cell walls of cellulose.',
  Animalia: 'Many cells, no cell walls, take in food; most can move.',
};

/** The groups one rank below a path (e.g. ['Animalia'] → phyla), with how many of our species are in each. */
export function children(path: string[]): { name: string; n: number }[] {
  const d = path.length, m = new Map<string, number>();
  for (const s of SPECIES) if (path.every((p, i) => s.ranks[i] === p) && d < RANKS.length) m.set(s.ranks[d], (m.get(s.ranks[d]) ?? 0) + 1);
  return [...m].map(([name, n]) => ({ name, n })).sort((a, b) => a.name.localeCompare(b.name));
}

/** The lowest rank two species share (index into RANKS), or −1 if not even the kingdom. */
export function shared(a: Sp, b: Sp): number {
  let i = -1; while (i + 1 < RANKS.length && a.ranks[i + 1] === b.ranks[i + 1]) i++;
  return i;
}

/** Check a binomial name. Returns the fixed form, the short form, and what was wrong. */
export function checkName(s: string): { ok: boolean; fixed: string; short: string; issues: string[]; extra: string } {
  const issues: string[] = [];
  const words = s.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { ok: false, fixed: '', short: '', issues: ['A binomial name has two words: the genus, then the species (specific epithet).'], extra: '' };
  let [g, e] = words; const rest = words.slice(2);
  if (/[^A-Za-z-]/.test(g + e)) issues.push('Use letters only (a hyphen is allowed in the second word).');
  if (g[0] !== g[0].toUpperCase() || g.slice(1) !== g.slice(1).toLowerCase()) issues.push('The genus starts with a capital letter and the rest is small.');
  if (e !== e.toLowerCase()) issues.push('The second word (species) is all small letters, even when it comes from a place or person.');
  g = g[0].toUpperCase() + g.slice(1).toLowerCase(); e = e.toLowerCase();
  let extra = '';
  if (rest.length) {
    if (/^[a-z]/.test(rest[0]) && rest.length === 1) extra = `"${rest[0]}" makes a three-part name for a subspecies (trinomial), also written in italics.`;
    else if (/^[A-Z(]/.test(rest[0])) extra = `"${rest.join(' ')}" looks like the name of the person who first described it. That part is not in italics.`;
    else extra = 'Only the first two words are the binomial name.';
  }
  return { ok: issues.length === 0, fixed: `${g} ${e}`, short: `${g[0]}. ${e}`, issues, extra };
}
