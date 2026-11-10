// Asexual reproduction for school: stage captions for each mode, and population growth by fission:
// N = N0 · 2^(t / T) with doubling time T. Plain TypeScript, no DOM.

export type Mode = 'binary' | 'multiple' | 'budding' | 'fragment' | 'regen' | 'spores';
export const MODES: { id: Mode; name: string; who: string; stages: [number, string][] }[] = [
  { id: 'binary', name: 'Binary fission', who: 'Amoeba, bacteria, Paramecium', stages: [[0, 'One full-grown cell.'], [0.3, 'The nucleus stretches and divides into two.'], [0.6, 'The cytoplasm pinches in the middle.'], [0.9, 'Two daughter cells, each with a nucleus. Each grows and can divide again.']] },
  { id: 'multiple', name: 'Multiple fission', who: 'Plasmodium (the malaria parasite)', stages: [[0, 'The cell rounds up inside a protective wall (a cyst).'], [0.3, 'The nucleus divides again and again.'], [0.6, 'Each nucleus gets a little cytoplasm: many small cells inside the cyst.'], [0.85, 'The cyst bursts and releases many daughter cells at once.']] },
  { id: 'budding', name: 'Budding', who: 'Hydra, yeast', stages: [[0, 'A full-grown Hydra.'], [0.25, 'A bump (bud) grows out of the side, from cells that keep dividing.'], [0.55, 'The bud grows tentacles and a mouth.'], [0.85, 'The new Hydra breaks off and lives on its own.']] },
  { id: 'fragment', name: 'Fragmentation', who: 'Spirogyra and other filament algae', stages: [[0, 'A long thread (filament) of cells.'], [0.3, 'The filament breaks into pieces.'], [0.6, 'Each piece keeps growing by cell division.'], [0.85, 'Each piece becomes a full new filament.']] },
  { id: 'regen', name: 'Regeneration', who: 'Planaria, Hydra', stages: [[0, 'A whole Planaria (flatworm).'], [0.3, 'It is cut into pieces.'], [0.6, 'Each piece grows back the parts it is missing.'], [0.85, 'Each piece becomes a complete worm.']] },
  { id: 'spores', name: 'Spore formation', who: 'Rhizopus (bread mould), ferns, mosses', stages: [[0, 'Thread-like hyphae with a round spore case (sporangium) on a stalk.'], [0.3, 'Hundreds of tiny spores form inside the sporangium.'], [0.55, 'The sporangium bursts; light spores drift in the air.'], [0.8, 'A spore that lands somewhere damp grows new hyphae.']] },
];
export const mode = (id: Mode) => MODES.find((m) => m.id === id)!;
/** The caption for stage t (0..1). */
export const caption = (id: Mode, t: number) => { const s = mode(id).stages; let c = s[0][1]; for (const [at, text] of s) if (t >= at) c = text; return c; };

/** Cells after time t with doubling time T, starting from n0. */
export const cells = (n0: number, t: number, T: number) => n0 * Math.pow(2, t / T);
/** Number of doublings in time t. */
export const doublings = (t: number, T: number) => t / T;
/** Time to reach n cells from n0. */
export const timeTo = (n: number, n0: number, T: number) => T * Math.log2(n / n0);
