// Straight-line catchments: haversine distances from people to facilities, share of population within a distance,
// nearest-facility distances, per-facility catchment population and a simple walkability score from amenity
// counts. Distances are great-circle ("as the crow flies"), not along roads or paths. Plain maths, no DOM.

export const R_EARTH = 6371008.8; // mean Earth radius in metres (IUGG)
const RAD = Math.PI / 180;

export type Place = { lat: number; lon: number; name?: string; w?: number; type?: string };

/** Great-circle distance in metres between two latitude/longitude points (haversine formula). */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = lat1 * RAD, p2 = lat2 * RAD, dp = p2 - p1, dl = (lon2 - lon1) * RAD;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Centroid (lat, lon) and area (m²) of a polygon given as GeoJSON rings of [lon, lat]; holes are taken away. */
export function polygonCentroid(rings: number[][][]): { lat: number; lon: number; area: number } {
  const [lon0, lat0] = rings[0][0], k = Math.cos(lat0 * RAD);
  const X = (lon: number) => (lon - lon0) * RAD * R_EARTH * k, Y = (lat: number) => (lat - lat0) * RAD * R_EARTH;
  let A = 0, cx = 0, cy = 0;
  rings.forEach((ring, ri) => {
    let a = 0, x = 0, y = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const x0 = X(ring[i][0]), y0 = Y(ring[i][1]), x1 = X(ring[i + 1][0]), y1 = Y(ring[i + 1][1]), c = x0 * y1 - x1 * y0;
      a += c; x += (x0 + x1) * c; y += (y0 + y1) * c;
    }
    if (a === 0) return;
    const s = (ri === 0 ? 1 : -1) * Math.sign(a); // outer ring adds, holes take away, whatever their winding
    A += (s * a) / 2; cx += (s * x) / 6; cy += (s * y) / 6;
  });
  if (!(Math.abs(A) > 0)) return { lat: lat0, lon: lon0, area: 0 };
  return { lat: lat0 + cy / A / (RAD * R_EARTH), lon: lon0 + cx / A / (RAD * R_EARTH * k), area: A };
}

/** Points from GeoJSON: Point and MultiPoint as they are, Polygon and MultiPolygon as their centroid. */
export function geojsonPlaces(obj: unknown, weightKey = '', nameKey = '', typeKey = ''): { places: Place[]; polygons: number; skipped: number } {
  const places: Place[] = []; let polygons = 0, skipped = 0;
  const o = obj as { type?: string; features?: unknown[]; geometry?: unknown; geometries?: unknown[] };
  const feats = o?.type === 'FeatureCollection' ? (o.features ?? []) : o?.type === 'Feature' ? [o] : [{ type: 'Feature', geometry: o, properties: {} }];
  for (const f0 of feats) {
    const f = f0 as { geometry?: { type?: string; coordinates?: unknown }; properties?: Record<string, unknown> };
    const g = f.geometry, pr = f.properties ?? {};
    const name = nameKey && pr[nameKey] != null ? String(pr[nameKey]) : undefined, type = typeKey && pr[typeKey] != null ? String(pr[typeKey]) : undefined;
    const w = weightKey ? Number(pr[weightKey]) : 1;
    if (!g || !g.type || !(Number.isFinite(w) && w >= 0)) { skipped++; continue; }
    const c = g.coordinates as number[] & number[][] & number[][][] & number[][][][];
    if (g.type === 'Point') places.push({ lon: c[0], lat: c[1], w, name, type });
    else if (g.type === 'MultiPoint') (c as number[][]).forEach((p) => places.push({ lon: p[0], lat: p[1], w: w / c.length, name, type }));
    else if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
      const polys = (g.type === 'Polygon' ? [c] : c) as number[][][][], parts = polys.map(polygonCentroid), A = parts.reduce((s, p) => s + p.area, 0);
      if (!(A > 0)) { skipped++; continue; }
      places.push({ lat: parts.reduce((s, p) => s + p.lat * p.area, 0) / A, lon: parts.reduce((s, p) => s + p.lon * p.area, 0) / A, w, name, type });
      polygons++;
    } else skipped++;
  }
  return { places: places.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon)), polygons, skipped };
}

/**
 * Nearest facility for each person point. Facilities are sorted by latitude and searched outwards until the
 * north–south gap alone is longer than the best distance found, which gives the same answer as checking all.
 */
export function nearest(pop: Place[], fac: Place[]): { d: number; i: number }[] {
  const order = fac.map((_, i) => i).sort((a, b) => fac[a].lat - fac[b].lat), lats = order.map((i) => fac[i].lat);
  const mPerDeg = RAD * R_EARTH;
  return pop.map((p) => {
    let lo = 0, hi = lats.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (lats[m] < p.lat) lo = m + 1; else hi = m; }
    let best = Infinity, bi = -1;
    for (let j = lo; j < order.length; j++) { if ((lats[j] - p.lat) * mPerDeg > best) break; const d = haversine(p.lat, p.lon, fac[order[j]].lat, fac[order[j]].lon); if (d < best) { best = d; bi = order[j]; } }
    for (let j = lo - 1; j >= 0; j--) { if ((p.lat - lats[j]) * mPerDeg > best) break; const d = haversine(p.lat, p.lon, fac[order[j]].lat, fac[order[j]].lon); if (d < best) { best = d; bi = order[j]; } }
    return { d: best, i: bi };
  });
}

/** Weighted quantile: the smallest value with at least share q of the total weight at or below it. */
export function wQuantile(v: number[], w: number[], q: number): number {
  const idx = v.map((_, i) => i).sort((a, b) => v[a] - v[b]), tot = w.reduce((s, x) => s + x, 0);
  let c = 0;
  for (const i of idx) { c += w[i]; if (c >= q * tot - 1e-9 * tot) return v[i]; }
  return v[idx[idx.length - 1]];
}

/** Share of the population weight whose nearest facility is within each distance. */
export const coverage = (d: number[], w: number[], limits: number[]) => {
  const tot = w.reduce((s, x) => s + x, 0);
  return limits.map((L) => ({ limit: L, pop: d.reduce((s, x, i) => s + (x <= L ? w[i] : 0), 0), share: tot > 0 ? d.reduce((s, x, i) => s + (x <= L ? w[i] : 0), 0) / tot : NaN }));
};

/** For each facility: population within r (a person can count for several facilities) and population for whom it is the nearest. */
export function catchments(pop: Place[], fac: Place[], r: number, near: { d: number; i: number }[]) {
  return fac.map((f, k) => {
    let within = 0, served = 0, n = 0;
    pop.forEach((p, j) => { const w = p.w ?? 1; if (haversine(p.lat, p.lon, f.lat, f.lon) <= r) { within += w; n++; } if (near[j].i === k) served += w; });
    return { within, points: n, served };
  });
}

/**
 * Walkability score per person point: the share (0 to 100) of the chosen amenity types with at least one amenity
 * within r, plus the number of chosen amenities within r.
 */
export function walkScores(pop: Place[], amen: Place[], types: string[], r: number) {
  const chosen = amen.filter((a) => a.type && types.includes(a.type));
  return pop.map((p) => {
    const seen = new Set<string>(); let count = 0;
    for (const a of chosen) if (Math.abs(a.lat - p.lat) * RAD * R_EARTH <= r && haversine(p.lat, p.lon, a.lat, a.lon) <= r) { seen.add(a.type!); count++; }
    return { score: types.length ? (100 * seen.size) / types.length : NaN, count, types: seen.size };
  });
}
