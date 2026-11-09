// Geological cross-sections: a topographic profile sampled from a DEM (ESRI ASCII grid or GeoTIFF) along a
// polyline, or typed distance-elevation pairs; geological contacts drawn down from where they cross the surface
// at their apparent dip in the section's direction; units filled between contacts (layer-cake rule); and the
// picture drawn through a plot.ts Painter so the page, SVG and PNG match. Plain TypeScript, no DOM.
import { readTiff } from './tiff.ts';
import { apparentDip } from './apparentdip.ts';
import { niceTicks, tickLabel, type Painter } from './plot.ts';

/** A DEM: z row by row from the top (north) row; (x0, y0) is the centre of the top-left cell. */
export type Dem = { w: number; h: number; z: Float32Array; x0: number; y0: number; dx: number; dy: number; geographic: boolean; note: string };
export type Profile = { d: number[]; z: number[]; x: number[]; y: number[]; segD: number[]; segAz: number[] };
export type Contact = { name: string; d: number; strike: number; dip: number };

const R = Math.PI / 180;
export const EARTH_R = 6371008.8; // mean Earth radius (m), for distances on a latitude-longitude grid

/** An ESRI ASCII grid (ncols, nrows, xllcorner or xllcenter, yllcorner or yllcenter, cellsize, NODATA_value). */
export function parseAsciiGrid(text: string): Dem {
  const tok = text.trim().split(/\s+/);
  const head: Record<string, number> = {};
  let i = 0;
  while (i < tok.length - 1 && /^[a-z_]+$/i.test(tok[i])) { head[tok[i].toLowerCase()] = Number(tok[i + 1]); i += 2; }
  const w = head.ncols, h = head.nrows;
  if (!(w >= 2 && h >= 2)) throw new Error('This does not look like an ASCII grid: it needs ncols and nrows (2 or more) in its header.');
  const dx = head.cellsize ?? head.dx, dy = head.cellsize ?? head.dy;
  if (!(dx > 0 && dy > 0)) throw new Error('The ASCII grid header needs a cellsize above 0.');
  const corner = head.xllcorner !== undefined;
  const xll = head.xllcorner ?? head.xllcenter, yll = head.yllcorner ?? head.yllcenter;
  if (!Number.isFinite(xll) || !Number.isFinite(yll)) throw new Error('The ASCII grid header needs xllcorner and yllcorner (or xllcenter and yllcenter).');
  const nd = head.nodata_value;
  if (tok.length - i < w * h) throw new Error(`The grid should hold ${w} × ${h} = ${(w * h).toLocaleString('en')} values but has ${(tok.length - i).toLocaleString('en')}.`);
  const z = new Float32Array(w * h);
  for (let k = 0; k < w * h; k++) { const v = Number(tok[i + k]); z[k] = !Number.isFinite(v) || (nd !== undefined && v === nd) ? NaN : v; }
  const x0 = corner ? xll + dx / 2 : xll, ybot = corner ? yll + dy / 2 : yll;
  return { w, h, z, x0, y0: ybot + (h - 1) * dy, dx, dy, geographic: false, note: `ASCII grid, ${w} × ${h} cells of ${dx}` };
}

/** A single-band GeoTIFF DEM. Uses the pixel scale and tie point; pixel-is-area unless the file says pixel-is-point. */
export function demFromTiff(buf: ArrayBuffer, maxSamples = 30e6): Dem {
  const r = readTiff(buf, maxSamples);
  const g = r.geo;
  if (!g.scale || !g.tie) throw new Error('This TIFF has no georeferencing (pixel scale and tie point), so distances along the line are unknown. Save the DEM as a GeoTIFF or an ASCII grid.');
  // GTRasterTypeGeoKey (1025): 1 = pixel is area (tie point at the cell corner), 2 = pixel is point (cell centre).
  const keys = r.geoTags.get(34735)?.values;
  let rasterType = 1;
  if (Array.isArray(keys)) for (let k = 4; k + 3 < keys.length; k += 4) if (keys[k] === 1025 && keys[k + 1] === 0) rasterType = keys[k + 3];
  const [i0, j0, X, Y] = g.tie, [sx, sy] = g.scale;
  const half = rasterType === 2 ? 0 : 0.5;
  const geographic = g.model === 2;
  return { w: r.width, h: r.height, z: r.bands[0], x0: X + (half - i0) * sx, y0: Y - (half - j0) * sy, dx: sx, dy: sy, geographic, note: `GeoTIFF, ${r.width} × ${r.height} cells of ${+sx.toPrecision(6)}${geographic ? '°' : ''}${g.epsg ? `, EPSG ${g.epsg}` : ''}` };
}

/** Bilinear elevation at map point (x, y); NaN outside the grid or next to a missing cell. Within half a cell of the edge the edge value is used. */
export function bilinear(dem: Dem, x: number, y: number): number {
  let c = (x - dem.x0) / dem.dx, r = (dem.y0 - y) / dem.dy;
  if (c < -0.5 || r < -0.5 || c > dem.w - 0.5 || r > dem.h - 0.5) return NaN;
  c = Math.min(dem.w - 1, Math.max(0, c)); r = Math.min(dem.h - 1, Math.max(0, r));
  const c0 = Math.min(dem.w - 2, Math.floor(c)), r0 = Math.min(dem.h - 2, Math.floor(r)), fc = c - c0, fr = r - r0;
  const z = dem.z, i = r0 * dem.w + c0;
  return (z[i] * (1 - fc) + z[i + 1] * fc) * (1 - fr) + (z[i + dem.w] * (1 - fc) + z[i + dem.w + 1] * fc) * fr;
}

/** Ground distance (m) and azimuth (degrees from north) of a step; latitude-longitude grids use a local flat Earth at the mid-latitude. */
export function step(a: [number, number], b: [number, number], geographic: boolean): { len: number; az: number; ex: number; ny: number } {
  let ex = b[0] - a[0], ny = b[1] - a[1];
  if (geographic) { const k = EARTH_R * R; ex *= k * Math.cos(((a[1] + b[1]) / 2) * R); ny *= k; }
  return { len: Math.hypot(ex, ny), az: ((Math.atan2(ex, ny) / R) + 360) % 360, ex, ny };
}

/** Samples along a polyline every `spacing` metres or less (each segment split evenly; vertices included). */
export function profileFromDem(dem: Dem, verts: [number, number][], spacing: number, maxPts = 20000): Profile {
  const p: Profile = { d: [], z: [], x: [], y: [], segD: [0], segAz: [] };
  let dist = 0;
  for (let s = 0; s + 1 < verts.length; s++) {
    const a = verts[s], b = verts[s + 1], st = step(a, b, dem.geographic);
    const n = Math.max(1, Math.ceil(st.len / spacing - 1e-9));
    for (let k = s === 0 ? 0 : 1; k <= n; k++) {
      const f = k / n, x = a[0] + f * (b[0] - a[0]), y = a[1] + f * (b[1] - a[1]);
      p.d.push(dist + f * st.len); p.x.push(x); p.y.push(y); p.z.push(bilinear(dem, x, y));
      if (p.d.length > maxPts) throw new Error(`More than ${maxPts.toLocaleString('en')} samples. Use a larger sample spacing.`);
    }
    dist += st.len; p.segD.push(dist); p.segAz.push(st.az);
  }
  return p;
}

/** Elevation at distance d along a profile (linear between samples; NaN outside). */
export function zAt(p: Profile, d: number): number {
  const D = p.d, n = D.length;
  if (!(n > 0) || d < D[0] - 1e-9 || d > D[n - 1] + 1e-9) return NaN;
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (D[m] <= d) lo = m; else hi = m; }
  if (hi === lo) return p.z[lo];
  const f = Math.min(1, Math.max(0, (d - D[lo]) / (D[hi] - D[lo] || 1)));
  return p.z[lo] + f * (p.z[hi] - p.z[lo]);
}
/** The section's azimuth at distance d (the segment it falls in). */
export function azAt(p: Profile, d: number): number {
  for (let s = 0; s < p.segAz.length; s++) if (d <= p.segD[s + 1] + 1e-9) return p.segAz[s];
  return p.segAz[p.segAz.length - 1];
}

/** The apparent dip (degrees, positive = down towards increasing distance) of a contact in a section running towards az. */
export const apparent = (strike: number, dip: number, az: number) => apparentDip({ strike, dip }, az);

/** A contact's line in the section: z = z0 − tan(α)(d − d0). */
export function contactLine(p: Profile, c: Contact) {
  const az = azAt(p, c.d), alpha = apparent(c.strike, c.dip, az), z0 = zAt(p, c.d), t = Math.tan(alpha * R);
  return { az, alpha, z0, at: (d: number) => z0 - t * (d - c.d) };
}

/**
 * Units between contacts, layer-cake rule: contacts are listed from the top of the sequence down; unit i lies
 * below the surface and above contact i, and below every earlier contact. At each distance its top is
 * min(surface, contacts above) and its base max(contact i, section base). The last unit fills everything below.
 */
export function unitBands(p: Profile, lines: ((d: number) => number)[], base: number): { top: number[]; bottom: number[] }[] {
  const out = Array.from({ length: lines.length + 1 }, () => ({ top: [] as number[], bottom: [] as number[] }));
  p.d.forEach((d, k) => {
    let upper = p.z[k];
    for (let i = 0; i <= lines.length; i++) {
      const lower = i < lines.length ? Math.max(base, lines[i](d)) : base;
      const top = Math.max(base, upper), bot = Math.min(top, lower);
      out[i].top.push(top); out[i].bottom.push(bot);
      if (i < lines.length) upper = Math.min(upper, lines[i](d));
    }
  });
  return out;
}

/** Typed distance, elevation pairs, sorted by distance. */
export function parsePairs(rows: string[][], numf: (s: string) => number): Profile | string {
  const pts = rows.map((r) => [numf(r[0]), numf(r[1])]).filter(([d, z]) => Number.isFinite(d) && Number.isFinite(z)).sort((a, b) => a[0] - b[0]);
  if (pts.length < 2) return 'Give at least two rows of distance and elevation.';
  for (let i = 1; i < pts.length; i++) if (pts[i][0] === pts[i - 1][0]) return `Two rows share the distance ${pts[i][0]}.`;
  return { d: pts.map((q) => q[0]), z: pts.map((q) => q[1]), x: [], y: [], segD: [pts[0][0], pts[pts.length - 1][0]], segAz: [0] };
}

/** The made-up example DEM: a ridge and a valley on a projected grid (metres), 160 × 120 cells of 25 m. */
export function exampleDem(): Dem {
  const w = 160, h = 120, dx = 25, x0 = 500012.5, y0 = 4202987.5, z = new Float32Array(w * h);
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
    const x = c * dx, y = (h - 1 - r) * dx; // metres from the lower-left cell centre
    const ridge = 260 * Math.exp(-((((x - 1700) * 0.94 + (y - 1500) * 0.34) / 650) ** 2));
    const valley = -70 * Math.exp(-((((x - 3200) * 0.9 - (y - 1500) * 0.43) / 300) ** 2));
    z[r * w + c] = Math.round((320 + 0.03 * x + ridge + valley + 12 * Math.sin(y / 230) * Math.cos(x / 310)) * 10) / 10;
  }
  return { w, h, z, x0, y0, dx, dy: dx, geographic: false, note: 'made-up example DEM, 160 × 120 cells of 25 m' };
}
export const EXAMPLE_LINE: [number, number][] = [[500300, 4201600], [502000, 4201900], [503700, 4201300]];
export const EXAMPLE_CONTACTS = 'Sandstone, 2600, 10, 20\nShale, 1500, 15, 25\nLimestone, 700, 20, 30';
export const EXAMPLE_LOWEST = 'Dolomite';

// ---------- drawing ----------
export type SectionStyle = { ink: string; muted: string; grid: string; fills: string[]; line: string };
export type SectionDraw = {
  p: Profile; ve: number; base: number; top: number; contacts: (Contact & { line: (d: number) => number; alpha: number })[];
  lowest: string; units: { top: number[]; bottom: number[] }[]; title: string; dUnit: string; zUnit: string; labelAz?: string;
};
export const FILLS = ['#f3d98c', '#b8d88f', '#9cc4e4', '#e8aaa1', '#c9b6e2', '#f2bf86', '#a6d6c6', '#d6d6d6', '#e3c9a8', '#bcc8d8'];
/** Layout: plot width W − margins; height follows the vertical exaggeration so angles on paper are true × VE. */
export function sectionSize(s: Pick<SectionDraw, 'p' | 've' | 'base' | 'top'>, W = 720) {
  const L = s.p.d[s.p.d.length - 1] - s.p.d[0], left = 62, right = 16, topM = 34, bottom = 52;
  const pw = W - left - right, scale = pw / L, ph = (s.top - s.base) * scale * s.ve;
  return { W, H: Math.round(ph + topM + bottom), left, right, topM, bottom, pw, ph, scale, L };
}

export function drawSection(P: Painter, s: SectionDraw, st: SectionStyle, W = 720) {
  const g = sectionSize(s, W), d0 = s.p.d[0];
  const X = (d: number) => g.left + (d - d0) * g.scale, Y = (z: number) => g.topM + (s.top - z) * g.scale * s.ve;
  const fs = 12;
  P.text(g.left, 8, s.title, 14, st.ink, 'start', 'top', 0, true);
  // grid and axes
  const xt = niceTicks(d0, d0 + g.L, 7), zt = niceTicks(s.base, s.top, Math.max(2, Math.min(8, Math.round(g.ph / 45))));
  for (const v of xt) if (v >= d0 - 1e-9 && v <= d0 + g.L + 1e-9) { P.line([[X(v), g.topM], [X(v), g.topM + g.ph]], st.grid, 1); P.text(X(v), g.topM + g.ph + 6, tickLabel(v, xt[1] - xt[0]), fs, st.muted, 'middle', 'top'); }
  for (const v of zt) if (v >= s.base - 1e-9 && v <= s.top + 1e-9) { P.line([[g.left, Y(v)], [g.left + g.pw, Y(v)]], st.grid, 1); P.text(g.left - 6, Y(v), tickLabel(v, zt[1] - zt[0]), fs, st.muted, 'end', 'middle'); }
  P.text(g.left + g.pw / 2, g.topM + g.ph + 26, `Distance along the section (${s.dUnit})${s.labelAz ? `, ${s.labelAz}` : ''}`, fs, st.ink, 'middle', 'top');
  P.text(14, g.topM + g.ph / 2, `Elevation (${s.zUnit}), VE ${+s.ve.toPrecision(3)}×`, fs, st.ink, 'middle', 'middle', -90);
  P.clip(g.left, g.topM, g.pw, g.ph);
  // units
  const names = [...s.contacts.map((c) => c.name), s.lowest];
  s.units.forEach((u, i) => {
    const pts: [number, number][] = [];
    s.p.d.forEach((d, k) => { if (Number.isFinite(u.top[k])) pts.push([X(d), Y(u.top[k])]); });
    for (let k = s.p.d.length - 1; k >= 0; k--) if (Number.isFinite(u.bottom[k])) pts.push([X(s.p.d[k]), Y(u.bottom[k])]);
    if (pts.length > 2) P.poly(pts, st.fills[i % st.fills.length], null);
  });
  // contacts below the surface
  for (const c of s.contacts) {
    let run: [number, number][] = [];
    s.p.d.forEach((d, k) => { const z = c.line(d); if (Number.isFinite(z) && z <= s.p.z[k] + 1e-6) run.push([X(d), Y(z)]); else { if (run.length > 1) P.line(run, st.line, 1.6); run = []; } });
    if (run.length > 1) P.line(run, st.line, 1.6);
  }
  // topography
  let run: [number, number][] = [];
  s.p.d.forEach((d, k) => { if (Number.isFinite(s.p.z[k])) run.push([X(d), Y(s.p.z[k])]); else { if (run.length > 1) P.line(run, st.ink, 2); run = []; } });
  if (run.length > 1) P.line(run, st.ink, 2);
  // unit labels where each is thickest
  s.units.forEach((u, i) => {
    let best = -1, bk = -1;
    u.top.forEach((t, k) => { const th = t - u.bottom[k]; if (th > best) { best = th; bk = k; } });
    if (bk >= 0 && best * g.scale * s.ve > fs + 4) P.text(Math.min(g.left + g.pw - 4 - P.measure(names[i], fs) / 2, Math.max(g.left + 4 + P.measure(names[i], fs) / 2, X(s.p.d[bk]))), Y((u.top[bk] + u.bottom[bk]) / 2), names[i], fs, '#1a1a1a', 'middle', 'middle', 0, true);
  });
  P.unclip();
  P.poly([[g.left, g.topM], [g.left + g.pw, g.topM], [g.left + g.pw, g.topM + g.ph], [g.left, g.topM + g.ph]], null, st.muted, 1);
  return g;
}
