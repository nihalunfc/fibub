// Zooplankton density and biomass from a net sample. Plain maths; no DOM.
// Volume filtered V = π (d/2)² × distance × efficiency (or × flowmeter revolutions × metres per revolution).
// Density (ind m⁻³) = count in the subsample ÷ subsample fraction ÷ V.
// Individual mass from length-weight equations: W = a·L^b, ln W = a + b ln L or log10 W = a + b log10 L.
// Biomass (mass m⁻³) = density × mean individual mass of the measured animals of that taxon.

export type Form = 'power' | 'ln' | 'log10';
export const massOf = (L: number, a: number, b: number, form: Form) =>
  form === 'power' ? a * L ** b : form === 'ln' ? Math.exp(a + b * Math.log(L)) : 10 ** (a + b * Math.log10(L));

/** Water filtered (m³): mouth diameter (m) × distance (m) × efficiency (0 to 1). */
export const netVolume = (diameter: number, distance: number, efficiency = 1) => Math.PI * (diameter / 2) ** 2 * distance * efficiency;

/** "1/16", "0.0625" or "6.25 %" as a fraction. NaN if not readable. */
export function readFraction(s: string): number {
  const t = s.trim().replace(/\s+/g, '');
  let m = /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(t);
  if (m) return Number(m[1]) / Number(m[2]);
  m = /^(\d+(?:\.\d+)?)%$/.exec(t);
  if (m) return Number(m[1]) / 100;
  return /^\d*\.?\d+(e-?\d+)?$/i.test(t) ? Number(t) : NaN;
}

export type Taxon = { taxon: string; count: number; a: number; b: number };
export type TaxonResult = Taxon & { density: number; nMeasured: number; meanLength: number; meanMass: number; massAtMeanLength: number; biomass: number };

export function analyse(taxa: Taxon[], lengths: { taxon: string; length: number }[], volume: number, fraction: number, form: Form) {
  const key = (s: string) => s.trim().toLowerCase();
  const rows: TaxonResult[] = taxa.map((t) => {
    const Ls = lengths.filter((l) => key(l.taxon) === key(t.taxon)).map((l) => l.length);
    const ws = Ls.map((L) => massOf(L, t.a, t.b, form));
    const density = t.count / fraction / volume;
    const meanLength = Ls.length ? Ls.reduce((s, v) => s + v, 0) / Ls.length : NaN;
    const meanMass = ws.length ? ws.reduce((s, v) => s + v, 0) / ws.length : NaN;
    return { ...t, density, nMeasured: Ls.length, meanLength, meanMass, massAtMeanLength: Ls.length ? massOf(meanLength, t.a, t.b, form) : NaN, biomass: density * meanMass };
  });
  const known = new Set(taxa.map((t) => key(t.taxon)));
  const orphans = [...new Set(lengths.filter((l) => !known.has(key(l.taxon))).map((l) => l.taxon.trim()))];
  const totalDensity = rows.reduce((s, r) => s + r.density, 0);
  const withMass = rows.filter((r) => Number.isFinite(r.biomass));
  return { rows, orphans, totalDensity, totalBiomass: withMass.reduce((s, r) => s + r.biomass, 0), missingMass: rows.filter((r) => !Number.isFinite(r.biomass) && r.count > 0).map((r) => r.taxon) };
}
