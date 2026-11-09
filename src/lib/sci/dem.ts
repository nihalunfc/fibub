// Digital elevation models: read a GeoTIFF or an ESRI ASCII grid, and work out slope and aspect (Horn 1981),
// hillshade, and curvature (Zevenbergen and Thorne 1987, as in ArcGIS). Geographic grids (cells in degrees) get
// their cell size in metres row by row from the WGS 84 radii of curvature. No DOM.
import { readTiff, type Tag } from './tiff.ts';

export type Grid = {
  w: number; h: number; z: Float32Array; // row by row from the top (north), NaN = no data
  dx: number; dy: number; // cell size in the file's units (degrees or metres or feet), both positive
  x0: number; y0: number; // outer corner of the top-left cell (x west edge, y north edge)
  unit: 'm' | 'ft' | 'usft' | 'deg' | 'unknown';
  epsg?: number; geoTags?: Map<number, Tag>; notes: string[];
};

export const MAX_CELLS = 16e6;
const D = Math.PI / 180;
const A = 6378137, F = 1 / 298.257223563, E2 = F * (2 - F);
export const UNIT_M: Record<string, number> = { m: 1, ft: 0.3048, usft: 1200 / 3937, unknown: 1 };

// ---------- readers ----------
/** ESRI ASCII grid (.asc): a short header (ncols, nrows, xllcorner or xllcenter, ..., cellsize, NODATA_value) then values. */
export function readAsc(text: string): Grid {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const hdr: Record<string, number> = {};
  let k = 0;
  for (; k < lines.length; k++) {
    const m = lines[k].trim().match(/^([a-zA-Z_]+)\s+([-+\d.eE]+)\s*$/);
    if (!m) { if (!lines[k].trim()) continue; break; }
    hdr[m[1].toLowerCase()] = Number(m[2]);
  }
  const w = hdr.ncols, h = hdr.nrows;
  if (!(w > 0 && h > 0)) throw new Error('This is not an ESRI ASCII grid: the header needs ncols and nrows.');
  if (w * h > MAX_CELLS) throw new Error(`The grid is ${w} × ${h} cells; the limit here is ${MAX_CELLS / 1e6} million cells.`);
  const dx = hdr.cellsize ?? hdr.dx, dy = hdr.cellsize ?? hdr.dy;
  if (!(dx > 0 && dy > 0)) throw new Error('The header needs a cellsize (or dx and dy) above zero.');
  const xll = hdr.xllcorner ?? (hdr.xllcenter !== undefined ? hdr.xllcenter - dx / 2 : 0);
  const yll = hdr.yllcorner ?? (hdr.yllcenter !== undefined ? hdr.yllcenter - dy / 2 : 0);
  const nd = hdr.nodata_value;
  const z = new Float32Array(w * h);
  let n = 0;
  const body = lines.slice(k).join(' ');
  const re = /[^\s,]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) && n < w * h) { const v = Number(m[0]); z[n++] = !Number.isFinite(v) || v === nd ? NaN : v; }
  if (n < w * h) throw new Error(`The grid should hold ${w * h} values (${w} × ${h}) but has ${n}.`);
  const notes: string[] = [];
  const geo = Math.abs(xll) <= 360 && Math.abs(yll) <= 90 && dx < 0.5 && Math.abs(xll + w * dx) <= 360 && Math.abs(yll + h * dy) <= 90.0001;
  if (geo) notes.push('The corner and cell size look like degrees, so the grid is treated as longitude and latitude. Change "Cell size unit" if it is not.');
  return { w, h, z, dx, dy, x0: xll, y0: yll + h * dy, unit: geo ? 'deg' : 'unknown', notes };
}

/** A GeoTIFF's first band as a grid. */
export function gridFromTiff(buf: ArrayBuffer): Grid {
  const r = readTiff(buf, MAX_CELLS);
  const notes: string[] = [];
  if (r.bands.length > 1) notes.push(`The file has ${r.bands.length} bands; the first is used as elevation.`);
  const g = r.geo;
  let dx = g.scale?.[0] ?? 1, dy = g.scale?.[1] ?? 1, x0 = 0, y0 = 0;
  if (g.tie) { x0 = g.tie[2] - g.tie[0] * dx; y0 = g.tie[3] + g.tie[1] * dy; }
  if (!g.scale) notes.push('The file has no pixel size; enter the cell size below.');
  let unit: Grid['unit'] = 'unknown';
  if (g.model === 2 || (g.epsg && g.epsg >= 4000 && g.epsg < 5000)) unit = 'deg';
  else if (g.linearUnit === 9002) unit = 'ft';
  else if (g.linearUnit === 9003) unit = 'usft';
  else if (g.model === 1 || g.linearUnit === 9001) unit = 'm';
  else if (g.scale && dx < 0.5 && Math.abs(x0) <= 360 && Math.abs(y0) <= 90) { unit = 'deg'; notes.push('No coordinate system is given, but the numbers look like degrees.'); }
  if (dy < 0) dy = -dy;
  return { w: r.width, h: r.height, z: r.bands[0], dx, dy, x0, y0, unit, epsg: g.epsg, geoTags: r.geoTags, notes };
}

// ---------- cell sizes ----------
/** Cell width and height in metres for each row (geographic grids vary with latitude). */
export function rowSizes(g: Grid, unit = g.unit): { dxm: Float64Array; dym: Float64Array } {
  const dxm = new Float64Array(g.h), dym = new Float64Array(g.h);
  for (let r = 0; r < g.h; r++) {
    if (unit === 'deg') {
      const lat = (g.y0 - (r + 0.5) * g.dy) * D, s = Math.sin(lat), w = 1 - E2 * s * s;
      const N = A / Math.sqrt(w), M = (A * (1 - E2)) / (w * Math.sqrt(w));
      dxm[r] = g.dx * D * N * Math.cos(lat); dym[r] = g.dy * D * M;
    } else { const k = UNIT_M[unit] ?? 1; dxm[r] = g.dx * k; dym[r] = g.dy * k; }
  }
  return { dxm, dym };
}

// ---------- terrain ----------
export type Kind = 'slope' | 'slopepct' | 'aspect' | 'hillshade' | 'curv' | 'profile' | 'plan';
export type Opts = { zf?: number; unit?: Grid['unit']; az?: number; alt?: number };

/**
 * One derived layer. zf turns elevation units into metres (e.g. 0.3048 for feet). Neighbours outside the grid or
 * without data take the centre cell's value (as gdaldem -compute_edges), so edge cells get values too.
 *   slope: degrees (Horn's 3 × 3 weighted differences); slopepct: percent rise
 *   aspect: compass direction the slope faces, 0–360° clockwise from north; NaN where flat
 *   hillshade: 0–255, light from azimuth az (compass) and altitude alt (degrees above the horizon)
 *   curv, profile, plan: curvature as in ArcGIS, in 1/100 per metre (positive = convex for curv; ArcGIS signs)
 */
export function derive(g: Grid, kind: Kind, o: Opts = {}): Float32Array {
  const { w, h, z } = g, zf = o.zf ?? 1;
  const { dxm, dym } = rowSizes(g, o.unit ?? g.unit);
  const out = new Float32Array(w * h);
  const az = (o.az ?? 315) * D, zen = (90 - (o.alt ?? 45)) * D, cz = Math.cos(zen), sz = Math.sin(zen);
  for (let r = 0; r < h; r++) {
    const dx = dxm[r], dy = dym[r];
    for (let c = 0; c < w; c++) {
      const i = r * w + c, e = z[i];
      if (Number.isNaN(e)) { out[i] = NaN; continue; }
      const at = (rr: number, cc: number) => { if (rr < 0 || rr >= h || cc < 0 || cc >= w) return e; const v = z[rr * w + cc]; return Number.isNaN(v) ? e : v; };
      const a = at(r - 1, c - 1) * zf, b = at(r - 1, c) * zf, cc_ = at(r - 1, c + 1) * zf;
      const d = at(r, c - 1) * zf, f = at(r, c + 1) * zf, ee = e * zf;
      const gg = at(r + 1, c - 1) * zf, hh = at(r + 1, c) * zf, ii = at(r + 1, c + 1) * zf;
      if (kind === 'curv' || kind === 'profile' || kind === 'plan') {
        const Dc = ((d + f) / 2 - ee) / (dx * dx), Ec = ((b + hh) / 2 - ee) / (dy * dy), Fc = (-a + cc_ + gg - ii) / (4 * dx * dy);
        const G = (f - d) / (2 * dx), H = (b - hh) / (2 * dy), g2 = G * G + H * H;
        if (kind === 'curv') out[i] = -2 * (Dc + Ec) * 100;
        else if (g2 === 0) out[i] = 0;
        else if (kind === 'profile') out[i] = (-2 * (Dc * G * G + Ec * H * H + Fc * G * H)) / g2 * 100;
        else out[i] = (2 * (Dc * H * H + Ec * G * G - Fc * G * H)) / g2 * 100;
        continue;
      }
      const gx = (cc_ + 2 * f + ii - (a + 2 * d + gg)) / (8 * dx); // dz/d(east)
      const gy = (a + 2 * b + cc_ - (gg + 2 * hh + ii)) / (8 * dy); // dz/d(north)
      const p = Math.sqrt(gx * gx + gy * gy), s = Math.atan(p);
      if (kind === 'slope') out[i] = s / D;
      else if (kind === 'slopepct') out[i] = p * 100;
      else {
        const asp = gx === 0 && gy === 0 ? NaN : Math.atan2(-gx, -gy);
        if (kind === 'aspect') out[i] = Number.isNaN(asp) ? NaN : ((asp / D) + 360) % 360;
        else { const v = cz * Math.cos(s) + (Number.isNaN(asp) ? 0 : sz * Math.sin(s) * Math.cos(az - asp)); out[i] = 255 * Math.max(0, v); }
      }
    }
  }
  return out;
}

// ---------- statistics ----------
export type Stats = { n: number; nodata: number; min: number; max: number; mean: number; sd: number; median: number; p2: number; p98: number };
export function stats(a: Float32Array): Stats {
  let n = 0, s = 0, s2 = 0, mn = Infinity, mx = -Infinity;
  for (let i = 0; i < a.length; i++) { const v = a[i]; if (Number.isNaN(v)) continue; n++; s += v; s2 += v * v; if (v < mn) mn = v; if (v > mx) mx = v; }
  const mean = n ? s / n : NaN, sd = n > 1 ? Math.sqrt(Math.max(0, (s2 - n * mean * mean) / (n - 1))) : NaN;
  // Percentiles from a sample of at most 200,000 values (exact for smaller grids).
  const step = Math.max(1, Math.floor(a.length / 200000)), smp: number[] = [];
  for (let i = 0; i < a.length; i += step) if (!Number.isNaN(a[i])) smp.push(a[i]);
  smp.sort((x, y) => x - y);
  const pc = (p: number) => { if (!smp.length) return NaN; const x = (p / 100) * (smp.length - 1), lo = Math.floor(x), hi = Math.ceil(x); return smp[lo] + (smp[hi] - smp[lo]) * (x - lo); };
  return { n, nodata: a.length - n, min: n ? mn : NaN, max: n ? mx : NaN, mean, sd, median: pc(50), p2: pc(2), p98: pc(98) };
}
/** Share of the ground area (cells weighted by their area in m²) in each class [lo, hi). */
export function classShares(a: Float32Array, g: Grid, edges: number[], unit = g.unit): { lo: number; hi: number; area: number; share: number }[] {
  const { dxm, dym } = rowSizes(g, unit);
  const area = new Float64Array(edges.length - 1);
  let tot = 0;
  for (let r = 0; r < g.h; r++) {
    const ca = dxm[r] * dym[r];
    for (let c = 0; c < g.w; c++) {
      const v = a[r * g.w + c]; if (Number.isNaN(v)) continue;
      let k = 0; while (k < edges.length - 2 && v >= edges[k + 1]) k++;
      area[k] += ca; tot += ca;
    }
  }
  return Array.from(area, (x, k) => ({ lo: edges[k], hi: edges[k + 1], area: x, share: tot ? x / tot : 0 }));
}
/** Area of each of 8 aspect sectors (N, NE, ...), centred on the compass points, and of flat cells. */
export function aspectShares(asp: Float32Array, g: Grid, unit = g.unit) {
  const { dxm, dym } = rowSizes(g, unit);
  const sec = new Float64Array(9); let tot = 0;
  for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) {
    const i = r * g.w + c; if (Number.isNaN(g.z[i])) continue;
    const ca = dxm[r] * dym[r], v = asp[i];
    sec[Number.isNaN(v) ? 8 : Math.floor(((v + 22.5) % 360) / 45)] += ca; tot += ca;
  }
  return Array.from(sec, (x) => (tot ? x / tot : 0));
}
/** Planimetric area of all cells with data (m²). */
export function groundArea(g: Grid, unit = g.unit) {
  const { dxm, dym } = rowSizes(g, unit);
  let s = 0;
  for (let r = 0; r < g.h; r++) { let n = 0; for (let c = 0; c < g.w; c++) if (!Number.isNaN(g.z[r * g.w + c])) n++; s += n * dxm[r] * dym[r]; }
  return s;
}

// ---------- writers ----------
/** ESRI ASCII grid text of a layer, with the grid's corner and cell size. */
export function toAsc(g: Grid, a: Float32Array, nodata = -9999, digits = 4) {
  const head = `ncols ${g.w}\nnrows ${g.h}\nxllcorner ${g.x0}\nyllcorner ${g.y0 - g.h * g.dy}\n${g.dx === g.dy ? `cellsize ${g.dx}` : `dx ${g.dx}\ndy ${g.dy}`}\nNODATA_value ${nodata}\n`;
  const rows: string[] = [];
  for (let r = 0; r < g.h; r++) { const row: string[] = []; for (let c = 0; c < g.w; c++) { const v = a[r * g.w + c]; row.push(Number.isNaN(v) ? String(nodata) : String(+v.toFixed(digits))); } rows.push(row.join(' ')); }
  return head + rows.join('\n') + '\n';
}
/** GeoTIFF tags (pixel size, tie point and any geokeys) for a grid, to write a layer that lines up with it. */
export function geoTagsFor(g: Grid): Map<number, Tag> {
  const t = new Map<number, Tag>(g.geoTags ?? []);
  t.set(33550, { type: 12, count: 3, values: [g.dx, g.dy, 0] });
  t.set(33922, { type: 12, count: 6, values: [0, 0, 0, g.x0, g.y0, 0] });
  t.delete(34264);
  if (!t.has(34735) && g.unit === 'deg') t.set(34735, { type: 3, count: 12, values: [1, 1, 0, 2, 1024, 0, 1, 2, 2048, 0, 1, 4326] });
  return t;
}

// ---------- example (made up) ----------
/** A made-up valley: 240 × 200 cells of 10 m with two ridges, a peak, a stream valley and a little roughness. */
export function exampleGrid(): Grid {
  const w = 240, h = 200, z = new Float32Array(w * h);
  let seed = 4242; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const bumps = Array.from({ length: 40 }, () => [rnd() * w, rnd() * h, 6 + rnd() * 18, (rnd() - 0.4) * 14]);
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
    const x = c, y = r;
    const valley = 70 + 2 * Math.sin(y / 23) * 8; // stream winds north to south
    let v = 220 + 0.35 * (h - y) + 0.0045 * (x - valley) ** 2 * 3;
    v += 95 * Math.exp(-(((x - 185) / 28) ** 2 + ((y - 60) / 34) ** 2));
    v += 55 * Math.exp(-(((x - 20) / 18) ** 2 + ((y - 150) / 40) ** 2));
    v -= 18 * Math.exp(-(((x - valley) / 6) ** 2));
    for (const [bx, by, br, bh] of bumps) v += bh * Math.exp(-(((x - bx) / br) ** 2 + ((y - by) / br) ** 2));
    z[r * w + c] = Math.round(v * 10) / 10;
  }
  return { w, h, z, dx: 10, dy: 10, x0: 500000, y0: 4200000, unit: 'm', notes: ['Example grid (made up): 240 × 200 cells of 10 m.'] };
}
