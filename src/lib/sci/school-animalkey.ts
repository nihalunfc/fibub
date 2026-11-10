// Animal classification key (Class 11 biology, animal kingdom): a branching key on level of organisation,
// symmetry, germ layers, body cavity, notochord, jointed legs and segments that ends at the major phyla, and
// example animals with their answers. A teaching model, simplified from the usual basis of classification.
// Plain TypeScript, no DOM.
export type Node = { id: string; q: string; help: string; opts: { label: string; to: string }[] } | { id: string; phylum: string; traits: string };

export const NODES: Record<string, Node> = {
  org: { id: 'org', q: 'How are the cells organised?', help: 'Cellular level: cells work together loosely, with no true tissues. Tissue level or higher: cells form tissues and usually organs.', opts: [{ label: 'Loose cells, no tissues', to: 'porifera' }, { label: 'Tissues or organs', to: 'sym' }] },
  sym: { id: 'sym', q: 'What symmetry does the adult body have?', help: 'Radial: any cut through the centre gives two matching halves. Bilateral: only one cut, down the middle, gives left and right halves.', opts: [{ label: 'Radial', to: 'layers' }, { label: 'Bilateral', to: 'coelom' }] },
  layers: { id: 'layers', q: 'How many germ layers form the body?', help: 'Diploblastic: two layers (ectoderm and endoderm) with jelly between. Triploblastic: three, with mesoderm in the middle.', opts: [{ label: 'Two (diploblastic)', to: 'sting' }, { label: 'Three (triploblastic)', to: 'echinodermata' }] },
  sting: { id: 'sting', q: 'Stinging cells or comb plates?', help: 'Cnidoblasts are stinging cells on the tentacles. Comb plates are eight rows of fused cilia used for swimming.', opts: [{ label: 'Stinging cells', to: 'cnidaria' }, { label: 'Eight rows of comb plates', to: 'ctenophora' }] },
  coelom: { id: 'coelom', q: 'What kind of body cavity?', help: 'Acoelomate: no cavity between gut and body wall. Pseudocoelomate: a cavity not fully lined by mesoderm. Coelomate: a true coelom lined by mesoderm.', opts: [{ label: 'None (acoelomate)', to: 'platyhelminthes' }, { label: 'False (pseudocoelom)', to: 'aschelminthes' }, { label: 'True coelom', to: 'chord' }] },
  chord: { id: 'chord', q: 'Is there a notochord?', help: 'A notochord is a stiff rod along the back, at least in the embryo. Hemichordates have only a short stomochord in the collar.', opts: [{ label: 'Yes, a notochord', to: 'chordata' }, { label: 'Only a stomochord (proboscis, collar, trunk)', to: 'hemichordata' }, { label: 'No', to: 'legs' }] },
  legs: { id: 'legs', q: 'Jointed legs and a hard outer skeleton?', help: 'Arthropods have jointed appendages and a chitin exoskeleton.', opts: [{ label: 'Yes', to: 'arthropoda' }, { label: 'No', to: 'segs' }] },
  segs: { id: 'segs', q: 'Is the body divided into ring-like segments?', help: 'Metameric segmentation: the body is a row of similar segments, seen as rings outside.', opts: [{ label: 'Yes, ring segments', to: 'annelida' }, { label: 'No: soft body with a mantle, often a shell', to: 'mollusca' }] },
  porifera: { id: 'porifera', phylum: 'Porifera', traits: 'Sponges: pores all over, water canals, cellular level of organisation, mostly marine.' },
  cnidaria: { id: 'cnidaria', phylum: 'Cnidaria (Coelenterata)', traits: 'Radial, diploblastic, stinging cells (cnidoblasts), a single gut opening; polyp and medusa forms.' },
  ctenophora: { id: 'ctenophora', phylum: 'Ctenophora', traits: 'Comb jellies: radial, diploblastic, eight rows of comb plates, many glow (bioluminescence).' },
  platyhelminthes: { id: 'platyhelminthes', phylum: 'Platyhelminthes', traits: 'Flatworms: bilateral, triploblastic, flattened, no body cavity; many are parasites.' },
  aschelminthes: { id: 'aschelminthes', phylum: 'Aschelminthes (Nematoda)', traits: 'Roundworms: round in cross-section, pseudocoelom, a complete gut; many are parasites.' },
  annelida: { id: 'annelida', phylum: 'Annelida', traits: 'Segmented worms: true coelom, ring-like segments, closed circulation.' },
  arthropoda: { id: 'arthropoda', phylum: 'Arthropoda', traits: 'Jointed legs, chitin exoskeleton, segmented body; the largest phylum (insects, crustaceans, spiders).' },
  mollusca: { id: 'mollusca', phylum: 'Mollusca', traits: 'Soft, unsegmented body with a muscular foot and a mantle, usually a shell.' },
  echinodermata: { id: 'echinodermata', phylum: 'Echinodermata', traits: 'Spiny skin, radial adults (bilateral larvae), water vascular system with tube feet; all marine.' },
  hemichordata: { id: 'hemichordata', phylum: 'Hemichordata', traits: 'Worm-like marine animals with a proboscis, collar and trunk, and a stomochord.' },
  chordata: { id: 'chordata', phylum: 'Chordata', traits: 'Notochord, a hollow nerve cord on the back and gill slits at some stage; includes all vertebrates.' },
};
export const ROOT = 'org';
export const isLeaf = (n: Node): n is { id: string; phylum: string; traits: string } => 'phylum' in n;
export const PHYLA = Object.values(NODES).filter(isLeaf).map((n) => n.id);

/** Example animals: the option chosen at each question they meet (index into opts). */
export type Animal = { id: string; name: string; answers: Record<string, number>; phylum: string };
export const ANIMALS: Animal[] = [
  { id: 'sponge', name: 'Bath sponge', answers: { org: 0 }, phylum: 'porifera' },
  { id: 'hydra', name: 'Hydra', answers: { org: 1, sym: 0, layers: 0, sting: 0 }, phylum: 'cnidaria' },
  { id: 'jellyfish', name: 'Jellyfish', answers: { org: 1, sym: 0, layers: 0, sting: 0 }, phylum: 'cnidaria' },
  { id: 'combjelly', name: 'Comb jelly (Pleurobrachia)', answers: { org: 1, sym: 0, layers: 0, sting: 1 }, phylum: 'ctenophora' },
  { id: 'tapeworm', name: 'Tapeworm', answers: { org: 1, sym: 1, coelom: 0 }, phylum: 'platyhelminthes' },
  { id: 'planaria', name: 'Planaria', answers: { org: 1, sym: 1, coelom: 0 }, phylum: 'platyhelminthes' },
  { id: 'ascaris', name: 'Roundworm (Ascaris)', answers: { org: 1, sym: 1, coelom: 1 }, phylum: 'aschelminthes' },
  { id: 'earthworm', name: 'Earthworm', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 1, segs: 0 }, phylum: 'annelida' },
  { id: 'leech', name: 'Leech', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 1, segs: 0 }, phylum: 'annelida' },
  { id: 'cockroach', name: 'Cockroach', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 0 }, phylum: 'arthropoda' },
  { id: 'prawn', name: 'Prawn', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 0 }, phylum: 'arthropoda' },
  { id: 'spider', name: 'Spider', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 0 }, phylum: 'arthropoda' },
  { id: 'snail', name: 'Garden snail', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 1, segs: 1 }, phylum: 'mollusca' },
  { id: 'octopus', name: 'Octopus', answers: { org: 1, sym: 1, coelom: 2, chord: 2, legs: 1, segs: 1 }, phylum: 'mollusca' },
  { id: 'starfish', name: 'Starfish', answers: { org: 1, sym: 0, layers: 1 }, phylum: 'echinodermata' },
  { id: 'urchin', name: 'Sea urchin', answers: { org: 1, sym: 0, layers: 1 }, phylum: 'echinodermata' },
  { id: 'balanoglossus', name: 'Acorn worm (Balanoglossus)', answers: { org: 1, sym: 1, coelom: 2, chord: 1 }, phylum: 'hemichordata' },
  { id: 'frog', name: 'Frog', answers: { org: 1, sym: 1, coelom: 2, chord: 0 }, phylum: 'chordata' },
  { id: 'fish', name: 'Rohu fish', answers: { org: 1, sym: 1, coelom: 2, chord: 0 }, phylum: 'chordata' },
  { id: 'human', name: 'Human', answers: { org: 1, sym: 1, coelom: 2, chord: 0 }, phylum: 'chordata' },
];

/** Follow the key with a set of answers. Returns the path of node ids and the leaf reached (or null if an answer is missing). */
export function walk(answers: Record<string, number>): { path: string[]; leaf: string | null } {
  const path: string[] = [];
  let id = ROOT;
  for (let guard = 0; guard < 20; guard++) {
    path.push(id);
    const n = NODES[id];
    if (isLeaf(n)) return { path, leaf: id };
    const a = answers[id];
    if (a === undefined || !n.opts[a]) return { path, leaf: null };
    id = n.opts[a].to;
  }
  return { path, leaf: null };
}
