// Meselson-Stahl experiment (school level, Class 12 biology): DNA labelled with heavy ¹⁵N is moved to light ¹⁴N and
// copied for g generations. Predicts the bands in a caesium chloride density gradient for the semi-conservative,
// conservative and dispersive models, and draws every DNA molecule's strands. Pure functions, no DOM.

export type Model = 'semi' | 'conservative' | 'dispersive';
export type Band = { heavy: number; share: number; name: string };
/** A double helix: the share of ¹⁵N in each of its two strands. */
export type Duplex = [number, number];

const NAME = (h: number) => (h === 1 ? 'heavy (¹⁵N/¹⁵N)' : h === 0 ? 'light (¹⁴N/¹⁴N)' : h === 0.5 ? 'hybrid (¹⁵N/¹⁴N)' : `${Math.round(h * 100)} % ¹⁵N`);

/** All molecules after g rounds of copying in ¹⁴N, starting from one fully heavy molecule. */
export function molecules(model: Model, g: number): Duplex[] {
  if (!Number.isInteger(g) || g < 0 || g > 10) throw new Error('Use 0 to 10 generations.');
  let mols: Duplex[] = [[1, 1]];
  for (let i = 0; i < g; i++) {
    const next: Duplex[] = [];
    for (const [a, b] of mols) {
      if (model === 'semi') next.push([a, 0], [b, 0]);
      else if (model === 'conservative') next.push([a, b], [0, 0]);
      else { const f = (a + b) / 4; next.push([f, f], [f, f]); } // old and new pieces scattered evenly along every strand
    }
    mols = next;
  }
  return mols;
}

/** Bands in the density gradient: heavy share of the duplex (1, 0.5, 0 …) and fraction of all DNA. */
export function bands(model: Model, g: number): Band[] {
  const mols = molecules(model, g), map = new Map<number, number>();
  for (const [a, b] of mols) { const h = Math.round(((a + b) / 2) * 1e9) / 1e9; map.set(h, (map.get(h) ?? 0) + 1); }
  return [...map.entries()].sort((x, y) => y[0] - x[0]).map(([heavy, n]) => ({ heavy, share: n / mols.length, name: NAME(heavy) }));
}

/** Single-strand bands after heating separates the strands (fraction heavy and light strands). */
export function strands(model: Model, g: number): Band[] {
  const map = new Map<number, number>(), mols = molecules(model, g);
  for (const d of mols) for (const s of d) { const h = Math.round(s * 1e9) / 1e9; map.set(h, (map.get(h) ?? 0) + 1); }
  return [...map.entries()].sort((x, y) => y[0] - x[0]).map(([heavy, n]) => ({ heavy, share: n / (2 * mols.length), name: heavy === 1 ? 'heavy strand' : heavy === 0 ? 'light strand' : `${Math.round(heavy * 100)} % ¹⁵N strand` }));
}

/** Semi-conservative shortcut: after g ≥ 1 generations, the hybrid share is 2/2^g. */
export const hybridShare = (g: number) => (g === 0 ? 0 : 2 / 2 ** g);
