// Quadrat and line-intercept transect summaries: density, frequency, cover, their relative values and the
// importance value per species (Curtis and McIntosh 1951; Canfield 1941 line intercept; Strong 1966 density).

export type Rec = { sample: string; species: string; a: number | null; b: number | null };
export type SpeciesRow = {
  species: string; individuals: number; samplesWith: number;
  /** Individuals per m² (null when not measured). */
  density: number | null;
  /** Share of quadrats or transects where the species was found (0 to 1). */
  frequency: number;
  /** Mean percentage cover (null when not measured). */
  cover: number | null;
  relDensity: number | null; relFrequency: number; relCover: number | null;
  /** Sum of the relative values available (out of 300 with all three). */
  iv: number;
};
export type Summary = { rows: SpeciesRow[]; samples: number; ivMax: number; hasDensity: boolean; hasCover: boolean; totalDensity: number | null; totalCover: number | null };

function finish(rows: Omit<SpeciesRow, 'relDensity' | 'relFrequency' | 'relCover' | 'iv'>[], samples: number, hasDensity: boolean, hasCover: boolean): Summary {
  const sD = rows.reduce((s, r) => s + (r.density ?? 0), 0), sF = rows.reduce((s, r) => s + r.frequency, 0), sC = rows.reduce((s, r) => s + (r.cover ?? 0), 0);
  const out = rows.map((r) => {
    const relDensity = hasDensity ? (sD > 0 ? (100 * r.density!) / sD : 0) : null;
    const relFrequency = sF > 0 ? (100 * r.frequency) / sF : 0;
    const relCover = hasCover ? (sC > 0 ? (100 * r.cover!) / sC : 0) : null;
    return { ...r, relDensity, relFrequency, relCover, iv: (relDensity ?? 0) + relFrequency + (relCover ?? 0) };
  }).sort((x, y) => y.iv - x.iv || x.species.localeCompare(y.species));
  return { rows: out, samples, ivMax: 100 * (1 + (hasDensity ? 1 : 0) + (hasCover ? 1 : 0)), hasDensity, hasCover, totalDensity: hasDensity ? sD : null, totalCover: hasCover ? sC : null };
}

/**
 * Quadrats: each record is one species in one quadrat, a = number of individuals, b = percentage cover
 * (either may be null). `nQuadrats` may be larger than the quadrats named, to count empty quadrats.
 */
export function quadrats(recs: Rec[], area: number, nQuadrats?: number): Summary {
  if (!(area > 0)) throw new Error('The quadrat area must be more than zero.');
  const named = new Set(recs.map((r) => r.sample)).size, n = Math.max(named, nQuadrats ?? 0);
  if (!n) throw new Error('No quadrats found.');
  const hasDensity = recs.some((r) => r.a !== null), hasCover = recs.some((r) => r.b !== null);
  const by = new Map<string, Rec[]>(); for (const r of recs) { if (!by.has(r.species)) by.set(r.species, []); by.get(r.species)!.push(r); }
  const rows = [...by].map(([species, rs]) => {
    const present = new Set(rs.filter((r) => (r.a ?? 0) > 0 || (r.b ?? 0) > 0).map((r) => r.sample));
    const individuals = rs.reduce((s, r) => s + (r.a ?? 0), 0), cov = rs.reduce((s, r) => s + (r.b ?? 0), 0);
    return { species, individuals, samplesWith: present.size, density: hasDensity ? individuals / (n * area) : null, frequency: present.size / n, cover: hasCover ? cov / n : null };
  }).filter((r) => r.samplesWith > 0);
  return finish(rows, n, hasDensity, hasCover);
}

/**
 * Line-intercept transects of length `length` each: each record is one plant crossing the line,
 * a = length of line it covers, b = its widest extent at right angles to the line (optional; needed
 * for density, each plant counting 1/b). Units are the same as `length` (e.g. metres).
 */
export function lineIntercept(recs: Rec[], length: number, nTransects?: number): Summary {
  if (!(length > 0)) throw new Error('The transect length must be more than zero.');
  const named = new Set(recs.map((r) => r.sample)).size, n = Math.max(named, nTransects ?? 0);
  if (!n) throw new Error('No transects found.');
  for (const r of recs) if (!(r.a !== null && r.a > 0)) throw new Error(`${r.species} on ${r.sample}: each plant needs an intercept length above zero.`);
  const withW = recs.filter((r) => r.b !== null).length;
  if (withW && withW < recs.length) throw new Error('Give a width for every plant, or for none.');
  const hasDensity = withW > 0;
  if (hasDensity) for (const r of recs) if (!(r.b! > 0)) throw new Error(`${r.species} on ${r.sample}: widths must be above zero.`);
  const total = n * length;
  const by = new Map<string, Rec[]>(); for (const r of recs) { if (!by.has(r.species)) by.set(r.species, []); by.get(r.species)!.push(r); }
  const rows = [...by].map(([species, rs]) => ({
    species, individuals: rs.length, samplesWith: new Set(rs.map((r) => r.sample)).size,
    density: hasDensity ? rs.reduce((s, r) => s + 1 / r.b!, 0) / total : null,
    frequency: new Set(rs.map((r) => r.sample)).size / n,
    cover: (100 * rs.reduce((s, r) => s + r.a!, 0)) / total,
  }));
  return finish(rows, n, hasDensity, true);
}
