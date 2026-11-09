// Gravity survey reduction: instrument drift from repeated base readings, normal (theoretical) gravity on the
// ellipsoid (Somigliana's closed form with GRS80 or WGS84 constants), free-air and Bouguer slab corrections, Hammer
// style ring terrain corrections, and free-air, simple and complete Bouguer anomalies. Units: mGal, metres, kg/m³.
// Plain maths; no DOM.

export const G = 6.6743e-11; // m³ kg⁻¹ s⁻², CODATA 2018
export const MGAL = 1e5; // mGal per m/s²

/** Defining and derived constants of the reference ellipsoids (Moritz 1980 for GRS80; NIMA TR8350.2 for WGS84). */
export const ELLIPSOIDS = {
  grs80: { name: 'GRS80', ge: 9.7803267715, k: 0.001931851353, e2: 0.00669438002290 },
  wgs84: { name: 'WGS84', ge: 9.7803253359, k: 0.00193185265241, e2: 0.00669437999013 },
} as const;
export type Ellipsoid = keyof typeof ELLIPSOIDS;

/** Normal gravity on the ellipsoid at geodetic latitude φ (degrees), in mGal: γ = γe(1 + k sin²φ)/√(1 − e² sin²φ). */
export function normalGravity(latDeg: number, ell: Ellipsoid = 'grs80'): number {
  const E = ELLIPSOIDS[ell], s2 = Math.sin((latDeg * Math.PI) / 180) ** 2;
  return (E.ge * (1 + E.k * s2)) / Math.sqrt(1 - E.e2 * s2) * MGAL;
}

/**
 * Free-air correction in mGal for height h (m) above the ellipsoid or datum, added to observed gravity.
 * 'simple': 0.3086 h. 'second': the second-order form (0.3087691 − 0.0004398 sin²φ) h − 7.2125×10⁻⁸ h²
 * (as in Hinze et al. 2005, from the GRS80 normal gravity gradient).
 */
export function freeAir(h: number, latDeg: number, mode: 'simple' | 'second' = 'simple'): number {
  if (mode === 'simple') return 0.3086 * h;
  const s2 = Math.sin((latDeg * Math.PI) / 180) ** 2;
  return (0.3087691 - 0.0004398 * s2) * h - 7.2125e-8 * h * h;
}

/** Bouguer slab correction 2πGρh in mGal (ρ in kg/m³, h in m); about 0.04193 mGal per metre for 1000 kg/m³. */
export const bouguerSlab = (rho: number, h: number) => 2 * Math.PI * G * rho * h * MGAL;

/**
 * Terrain correction (mGal) of one ring compartment, inner radius r1, outer r2 (m), mean height difference h (m,
 * above or below the station: the sign does not matter), n compartments in the ring (Hammer 1939's formula for an
 * annular sector of a flat-topped cylinder): (2πGρ/n)[r2 − r1 + √(r1² + h²) − √(r2² + h²)].
 */
export function ringCompartment(r1: number, r2: number, h: number, n: number, rho: number): number {
  return ((2 * Math.PI * G * rho) / n) * (r2 - r1 + Math.hypot(r1, h) - Math.hypot(r2, h)) * MGAL;
}
export type Ring = { r1: number; r2: number; heights: number[] };
/** Terrain correction of a set of rings, each split into as many equal compartments as heights given. */
export function terrainCorrection(rings: Ring[], rho: number) {
  const per = rings.map((g) => g.heights.reduce((s, h) => s + ringCompartment(g.r1, g.r2, h, g.heights.length, rho), 0));
  return { per, total: per.reduce((s, v) => s + v, 0) };
}

/** Parse h:mm, h:mm:ss or decimal hours to hours. */
export function parseHours(s: string): number {
  const t = s.trim();
  if (!t) return NaN;
  if (t.includes(':')) { const p = t.split(':').map(Number); if (p.some((x) => !Number.isFinite(x))) return NaN; return p[0] + (p[1] ?? 0) / 60 + (p[2] ?? 0) / 3600; }
  const v = Number(t.replace(',', '.')); return Number.isFinite(v) ? v : NaN;
}

/**
 * Drift at time t (hours) from base readings (time, reading) taken in order: linear between neighbouring base
 * readings, held flat before the first and after the last. Drift is zero at the first base reading.
 */
export function driftAt(base: { t: number; r: number }[], t: number): number {
  if (!base.length) return 0;
  const b = base.slice().sort((x, y) => x.t - y.t), r0 = b[0].r;
  if (t <= b[0].t) return 0;
  for (let i = 1; i < b.length; i++) if (t <= b[i].t) { const f = (t - b[i - 1].t) / (b[i].t - b[i - 1].t || 1); return b[i - 1].r + f * (b[i].r - b[i - 1].r) - r0; }
  return b[b.length - 1].r - r0;
}

export type Reading = { name: string; t: number; reading: number; lat: number; h: number; x?: number; tc?: number };
export type ReduceOpts = { base: string; gBase: number; cal: number; rho: number; ell: Ellipsoid; fa: 'simple' | 'second' };
export type Reduced = Reading & { drift: number; gObs: number; gamma: number; faC: number; bC: number; faa: number; sba: number; cba: number; isBase: boolean };

/**
 * Reduce a gravity survey. Readings (in dial units × cal = mGal) are drift-corrected against the base station's
 * repeated readings, tied to the base's absolute gravity gBase (mGal), and reduced to free-air, simple Bouguer and
 * complete Bouguer (with each station's terrain correction tc) anomalies.
 */
export function reduce(rows: Reading[], o: ReduceOpts) {
  const baseRows = rows.filter((r) => r.name === o.base);
  if (!baseRows.length) throw new Error(`No readings at the base station "${o.base}"`);
  const base = baseRows.map((r) => ({ t: r.t, r: r.reading * o.cal })).sort((a, b) => a.t - b.t);
  const r0 = base[0].r;
  const out: Reduced[] = rows.map((r) => {
    const drift = driftAt(base, r.t);
    const gObs = o.gBase + (r.reading * o.cal - drift - r0);
    const gamma = normalGravity(r.lat, o.ell), faC = freeAir(r.h, r.lat, o.fa), bC = bouguerSlab(o.rho, r.h);
    const faa = gObs - gamma + faC, sba = faa - bC, cba = sba + (r.tc ?? 0);
    return { ...r, drift, gObs, gamma, faC, bC, faa, sba, cba, isBase: r.name === o.base };
  });
  const span = base.length > 1 ? base[base.length - 1].t - base[0].t : 0;
  const rate = span > 0 ? (base[base.length - 1].r - r0) / span : 0;
  return { rows: out, base, rate };
}
