// Sunspots from a white-light image of the Sun: find the disc, flatten its limb darkening, pick out the dark
// spots (umbrae and penumbrae), group them and give the relative sunspot (Wolf) number R = k (10 g + s).

export type Disc = { cx: number; cy: number; r: number; level: number };
export type Spot = { id: number; x: number; y: number; area: number; umbrae: number; depth: number; mu: number; manual?: boolean; off?: boolean };
export type Group = { id: number; spots: Spot[]; x: number; y: number; area: number };

/** Find the solar disc: pixels brighter than half way between the sky and the disc, then the centre from their
 *  centroid and the radius from their area. */
export function findDisc(d: ArrayLike<number>, w: number, h: number): Disc {
  let lo = Infinity, hi = -Infinity;
  const step = Math.max(1, Math.floor((w * h) / 250000));
  for (let i = 0; i < d.length; i += step) { const v = d[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
  // Two-level split (k-means on brightness), robust to an off-centre or partly clipped disc.
  let t = (lo + hi) / 2;
  for (let it = 0; it < 30; it++) { let s0 = 0, n0 = 0, s1 = 0, n1 = 0; for (let i = 0; i < d.length; i += step) { const v = d[i]; if (v > t) { s1 += v; n1++; } else { s0 += v; n0++; } } const nt = ((n0 ? s0 / n0 : lo) + (n1 ? s1 / n1 : hi)) / 2; if (Math.abs(nt - t) < 1e-6 * (hi - lo + 1)) break; t = nt; }
  let n = 0, sx = 0, sy = 0, sv = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = d[y * w + x]; if (v > t) { n++; sx += x; sy += y; sv += v; } }
  if (n < 100) throw new Error('No bright disc found. Use a white-light image of the Sun on a dark sky.');
  // Spots inside the disc are darker than t, so the area undercounts slightly: fill by using the extent too.
  const cx = sx / n, cy = sy / n;
  let rMax = 0; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[y * w + x] > t) { const r = Math.hypot(x - cx, y - cy); if (r > rMax) rMax = r; }
  const rArea = Math.sqrt(n / Math.PI), r = Math.min(rMax, rArea * 1.03);
  return { cx, cy, r, level: sv / n };
}

/** Median brightness in rings across the disc (limb darkening), as a function of r/R in `bins` steps. */
export function limbProfile(d: ArrayLike<number>, w: number, h: number, disc: Disc, bins = 60) {
  const rings: number[][] = Array.from({ length: bins }, () => []);
  const x0 = Math.max(0, Math.floor(disc.cx - disc.r)), x1 = Math.min(w - 1, Math.ceil(disc.cx + disc.r)), y0 = Math.max(0, Math.floor(disc.cy - disc.r)), y1 = Math.min(h - 1, Math.ceil(disc.cy + disc.r));
  const stride = Math.max(1, Math.floor(disc.r / 300));
  for (let y = y0; y <= y1; y += stride) for (let x = x0; x <= x1; x += stride) { const rr = Math.hypot(x - disc.cx, y - disc.cy) / disc.r; if (rr < 1) rings[Math.min(bins - 1, Math.floor(rr * bins))].push(d[y * w + x]); }
  const prof = rings.map((a) => { if (!a.length) return NaN; a.sort((p, q) => p - q); return a[a.length >> 1]; });
  // Fill gaps from neighbours.
  for (let i = 0; i < bins; i++) if (!Number.isFinite(prof[i])) prof[i] = prof[i - 1] ?? prof.find(Number.isFinite) ?? 1;
  return (rr: number) => { const f = Math.min(bins - 1, Math.max(0, rr * bins - 0.5)), i = Math.floor(f), j = Math.min(bins - 1, i + 1); return prof[i] + (prof[j] - prof[i]) * (f - i); };
}

/** Dark spots: connected regions inside `edge` × R whose brightness, relative to the local limb-darkened disc, is
 *  below `pen` (penumbra). Each region counts its umbrae (separate cores below `umb`) as spots, at least one. */
export function findSpots(d: ArrayLike<number>, w: number, h: number, disc: Disc, opts: { pen?: number; umb?: number; minArea?: number; edge?: number } = {}) {
  const pen = opts.pen ?? 0.86, umb = opts.umb ?? 0.6, edge = opts.edge ?? 0.97;
  const minArea = opts.minArea ?? Math.max(3, Math.round((disc.r / 400) ** 2 * 6));
  const prof = limbProfile(d, w, h, disc);
  const x0 = Math.max(0, Math.floor(disc.cx - disc.r)), x1 = Math.min(w - 1, Math.ceil(disc.cx + disc.r)), y0 = Math.max(0, Math.floor(disc.cy - disc.r)), y1 = Math.min(h - 1, Math.ceil(disc.cy + disc.r));
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1, rel = new Float32Array(bw * bh).fill(1), mask = new Uint8Array(bw * bh);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const rr = Math.hypot(x - disc.cx, y - disc.cy) / disc.r; if (rr >= edge) continue;
    const v = d[y * w + x] / (prof(rr) || 1), k = (y - y0) * bw + (x - x0); rel[k] = v; if (v < pen) mask[k] = 1;
  }
  const label = new Int32Array(bw * bh), spots: Spot[] = [];
  let next = 0;
  for (let k = 0; k < mask.length; k++) {
    if (!mask[k] || label[k]) continue;
    next++; const stack = [k], px: number[] = []; label[k] = next;
    while (stack.length) { const c = stack.pop()!; px.push(c); const cx = c % bw, cy = (c / bw) | 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const nx = cx + i, ny = cy + j; if (nx < 0 || ny < 0 || nx >= bw || ny >= bh) continue; const nk = ny * bw + nx; if (mask[nk] && !label[nk]) { label[nk] = next; stack.push(nk); } } }
    if (px.length < minArea) continue;
    let sx = 0, sy = 0, sw = 0, depth = 1;
    for (const c of px) { const wt = 1 - rel[c]; sx += (c % bw) * wt; sy += ((c / bw) | 0) * wt; sw += wt; if (rel[c] < depth) depth = rel[c]; }
    // Umbrae: separate cores below `umb` inside this spot, each at least a few pixels.
    const inSpot = new Set(px), seen = new Set<number>(); let umbrae = 0;
    const minU = Math.max(2, Math.round(minArea / 3));
    for (const c of px) {
      if (rel[c] >= umb || seen.has(c)) continue;
      const st = [c]; seen.add(c); let n = 0;
      while (st.length) { const e = st.pop()!; n++; const ex = e % bw, ey = (e / bw) | 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const nk = (ey + j) * bw + ex + i; if (inSpot.has(nk) && !seen.has(nk) && rel[nk] < umb) { seen.add(nk); st.push(nk); } } }
      if (n >= minU) umbrae++;
    }
    const x = x0 + sx / sw, y = y0 + sy / sw, rr = Math.min(0.999, Math.hypot(x - disc.cx, y - disc.cy) / disc.r);
    spots.push({ id: spots.length + 1, x, y, area: px.length, umbrae, depth, mu: Math.sqrt(1 - rr * rr) });
  }
  return spots;
}

/** How many spots a region counts as for the Wolf number: its umbrae, or one if it has none. */
export const spotCount = (s: Spot) => Math.max(1, s.umbrae);

/** Group spots: single-linkage clustering with a link distance of `link` × R on the disc, measured on the sphere
 *  (so spots near the limb, which look squeezed, are not grouped too eagerly). */
export function groupSpots(spots: Spot[], disc: Disc, link = 0.12): Group[] {
  const on = spots.filter((s) => !s.off), n = on.length, parent = on.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const v3 = (s: Spot) => { const x = (s.x - disc.cx) / disc.r, y = (s.y - disc.cy) / disc.r, z = Math.sqrt(Math.max(0, 1 - x * x - y * y)); return [x, y, z]; };
  const P = on.map(v3);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dd = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1], P[i][2] - P[j][2]); if (dd < link) parent[find(i)] = find(j); }
  const map = new Map<number, Spot[]>();
  on.forEach((s, i) => { const r = find(i); if (!map.has(r)) map.set(r, []); map.get(r)!.push(s); });
  return [...map.values()].map((g, i) => { const a = g.reduce((t, s) => t + s.area, 0) || 1; return { id: i + 1, spots: g, area: a, x: g.reduce((t, s) => t + s.x * s.area, 0) / a, y: g.reduce((t, s) => t + s.y * s.area, 0) / a }; }).sort((p, q) => p.x - q.x).map((g, i) => ({ ...g, id: i + 1 }));
}

/** Relative sunspot number R = k (10 g + s). */
export function wolfNumber(groups: Group[], k = 1) {
  const g = groups.length, s = groups.reduce((t, gr) => t + gr.spots.reduce((u, sp) => u + spotCount(sp), 0), 0);
  return { g, s, R: k * (10 * g + s) };
}

/** A simulated white-light image of the Sun (limb darkened, u = 0.6) with three spot groups, for the example. */
export function simulatedSun(w = 600, h = 600, seed = 5) {
  let st = seed; const rnd = () => { st = (st * 16807) % 2147483647; return st / 2147483647; };
  const cx = w / 2 + 4, cy = h / 2 - 3, R = 0.44 * Math.min(w, h), d = new Float32Array(w * h);
  // Spots: [x, y in units of R from centre, umbra radius, penumbra radius] in units of R.
  const spots: [number, number, number, number][] = [
    [-0.42, 0.18, 0.018, 0.045], [-0.36, 0.2, 0.012, 0.03], [-0.47, 0.15, 0.0, 0.02],
    [0.12, -0.25, 0.024, 0.06], [0.2, -0.27, 0.015, 0.035], [0.25, -0.23, 0.01, 0.025], [0.16, -0.21, 0.0, 0.018],
    [0.62, 0.3, 0.014, 0.034],
  ].map(([x, y, u, p]) => [x, y, u * 0.7, p * 0.7] as [number, number, number, number]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const rx = (x - cx) / R, ry = (y - cy) / R, rr = Math.hypot(rx, ry);
    let v = 8;
    if (rr < 1) {
      const mu = Math.sqrt(1 - rr * rr); v = 200 * (1 - 0.6 * (1 - mu));
      let f = 1; for (const [sx, sy, u, p] of spots) { const dd = Math.hypot(rx - sx, ry - sy); if (dd < p) f = Math.min(f, dd < u ? 0.3 : 0.75); }
      v *= f;
      // A soft edge of one pixel at the limb.
      if (rr > 1 - 1 / R) v *= (1 - rr) * R;
    }
    d[y * w + x] = Math.max(0, v + 3 * (rnd() - 0.5));
  }
  return { d, w, h };
}
