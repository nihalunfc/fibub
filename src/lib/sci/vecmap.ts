// Vector map files: read GeoJSON, KML/KMZ, zipped Shapefiles (.shp, .dbf, .prj, .cpg) and CSV with WKT or
// latitude/longitude columns; write GeoJSON, KML and CSV (WKT); geodesic area, perimeter and length on the WGS 84
// ellipsoid. No DOM.
// Areas: each edge is followed along the geodesic (densified to steps of at most 2 km with Vincenty's direct
// formula), then the polygon's area is the spherical excess on the authalic sphere (radius Rq, latitudes turned
// into authalic latitudes), which keeps areas exact for an equal-area map of the ellipsoid.
import { unzipSync } from 'fflate';
import { inverse, direct, tmForward, tmInverse, WGS84, type Ellipsoid } from './utm.ts';
import { readTable } from './tableconv.ts';

export type Pos = number[]; // [lon, lat] (or [x, y] before unprojecting)
export type Geom =
  | { type: 'Point'; coordinates: Pos }
  | { type: 'MultiPoint'; coordinates: Pos[] }
  | { type: 'LineString'; coordinates: Pos[] }
  | { type: 'MultiLineString'; coordinates: Pos[][] }
  | { type: 'Polygon'; coordinates: Pos[][] }
  | { type: 'MultiPolygon'; coordinates: Pos[][][] }
  | { type: 'GeometryCollection'; geometries: Geom[] };
export type Props = Record<string, string | number | boolean | null>;
export type Feature = { geometry: Geom | null; properties: Props };
export type Layer = { name: string; features: Feature[]; fields: string[]; source: string; crs: string; notes: string[]; planarUnit?: string; planar?: Feature[] };

const D = Math.PI / 180;

// ---------------------------------------------------------------- GeoJSON
const GTYPES = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];
function cleanGeom(g: any, notes: Set<string>): Geom | null {
  if (!g || typeof g !== 'object') return null;
  if (!GTYPES.includes(g.type)) throw new Error(`Unknown geometry type "${g.type}".`);
  if (g.type === 'GeometryCollection') return { type: g.type, geometries: (g.geometries ?? []).map((x: any) => cleanGeom(x, notes)).filter(Boolean) };
  const depth = { Point: 0, MultiPoint: 1, LineString: 1, MultiLineString: 2, Polygon: 2, MultiPolygon: 3 }[g.type as string]!;
  const fix = (c: any, d: number): any => {
    if (!Array.isArray(c)) throw new Error(`A ${g.type} has coordinates that are not a list.`);
    if (d === 0) {
      const p = c.map(Number);
      if (p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) throw new Error('A position is not a pair of numbers.');
      if (p.length > 2) notes.add('Heights (third coordinate) are kept in GeoJSON but ignored for area and length.');
      return p;
    }
    return c.map((x: any) => fix(x, d - 1));
  };
  return { type: g.type, coordinates: fix(g.coordinates, depth) } as Geom;
}
const cleanProps = (p: any): Props => {
  const o: Props = {};
  if (p && typeof p === 'object') for (const [k, v] of Object.entries(p)) o[k] = v == null ? null : typeof v === 'object' ? JSON.stringify(v) : (v as string | number | boolean);
  return o;
};
export function readGeoJSON(text: string, name = 'GeoJSON'): Layer {
  let j: any;
  try { j = JSON.parse(text.replace(/^﻿/, '')); } catch { throw new Error('This file is not valid JSON.'); }
  const notes = new Set<string>();
  let feats: Feature[] = [];
  if (j?.type === 'FeatureCollection') feats = (j.features ?? []).map((f: any) => ({ geometry: cleanGeom(f?.geometry, notes), properties: cleanProps(f?.properties) }));
  else if (j?.type === 'Feature') feats = [{ geometry: cleanGeom(j.geometry, notes), properties: cleanProps(j.properties) }];
  else if (GTYPES.includes(j?.type)) feats = [{ geometry: cleanGeom(j, notes), properties: {} }];
  else throw new Error('This JSON is not GeoJSON (no FeatureCollection, Feature or geometry).');
  const crsName: string = j?.crs?.properties?.name ?? '';
  if (crsName && !/CRS84|4326/.test(crsName)) throw new Error(`This GeoJSON says its coordinates are in ${crsName}. Only longitude and latitude (WGS 84) are supported for GeoJSON; export it again as WGS 84.`);
  const layer = finish({ name, features: feats, fields: [], source: 'GeoJSON', crs: 'WGS 84 longitude, latitude', notes: [...notes] });
  checkLonLat(layer);
  return layer;
}

function finish(l: Layer): Layer {
  const f = new Set<string>();
  for (const x of l.features) for (const k of Object.keys(x.properties)) f.add(k);
  l.fields = [...f];
  return l;
}
function checkLonLat(l: Layer) {
  const b = bounds(l.features);
  if (b && (b[0] < -540 || b[2] > 540 || b[1] < -90.0001 || b[3] > 90.0001)) throw new Error('The coordinates are not longitude and latitude in degrees (they look like metres from a map projection). Export the data in WGS 84 (EPSG:4326) and try again.');
}

// ---------------------------------------------------------------- XML (for KML)
export type XNode = { name: string; attrs: Record<string, string>; children: XNode[]; text: string };
const ENT: Record<string, string> = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
const unent = (s: string) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENT[e] ?? m));
/** A small XML reader: elements, attributes, text and CDATA; namespace prefixes are dropped. */
export function parseXml(s: string): XNode {
  const root: XNode = { name: '#root', attrs: {}, children: [], text: '' };
  const stack = [root];
  let i = 0;
  while (i < s.length) {
    const lt = s.indexOf('<', i);
    const top = stack[stack.length - 1];
    if (lt < 0) { top.text += unent(s.slice(i)); break; }
    if (lt > i) top.text += unent(s.slice(i, lt));
    if (s.startsWith('<!--', lt)) { const e = s.indexOf('-->', lt); i = e < 0 ? s.length : e + 3; continue; }
    if (s.startsWith('<![CDATA[', lt)) { const e = s.indexOf(']]>', lt); top.text += s.slice(lt + 9, e < 0 ? s.length : e); i = e < 0 ? s.length : e + 3; continue; }
    if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) { const e = s.indexOf('>', lt); i = e < 0 ? s.length : e + 1; continue; }
    const gt = s.indexOf('>', lt);
    if (gt < 0) throw new Error('The XML ends in the middle of a tag.');
    const tag = s.slice(lt + 1, gt);
    i = gt + 1;
    if (tag.startsWith('/')) {
      const nm = tag.slice(1).trim().replace(/^[\w.-]+:/, '');
      while (stack.length > 1 && stack.pop()!.name !== nm) { /* close unclosed tags */ }
      continue;
    }
    const self = tag.endsWith('/');
    const m = tag.match(/^([\w:.-]+)([\s\S]*?)\/?$/);
    if (!m) continue;
    const node: XNode = { name: m[1].replace(/^[\w.-]+:/, ''), attrs: {}, children: [], text: '' };
    for (const a of m[2].matchAll(/([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) node.attrs[a[1].replace(/^[\w.-]+:/, '')] = unent(a[3] ?? a[4] ?? '');
    top.children.push(node);
    if (!self) stack.push(node);
  }
  return root;
}
const kids = (n: XNode, name: string) => n.children.filter((c) => c.name === name);
const kid = (n: XNode, name: string) => n.children.find((c) => c.name === name);
const allText = (n: XNode): string => n.text + n.children.map(allText).join('');

function kmlCoords(n: XNode | undefined): Pos[] {
  if (!n) return [];
  return allText(n).trim().split(/\s+/).filter(Boolean).map((t) => {
    const p = t.split(',').map(Number);
    if (p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) throw new Error(`A KML coordinate "${t}" is not longitude,latitude.`);
    return p.length > 2 ? p.slice(0, 3) : p;
  });
}
function kmlGeoms(n: XNode): Geom[] {
  const out: Geom[] = [];
  for (const c of n.children) {
    if (c.name === 'Point') { const p = kmlCoords(kid(c, 'coordinates')); if (p.length) out.push({ type: 'Point', coordinates: p[0] }); }
    else if (c.name === 'LineString' || c.name === 'LinearRing') { const p = kmlCoords(kid(c, 'coordinates')); if (p.length) out.push({ type: 'LineString', coordinates: p }); }
    else if (c.name === 'Polygon') {
      const ring = (b: XNode | undefined) => kmlCoords(b ? kid(kid(b, 'LinearRing') ?? b, 'coordinates') : undefined);
      const outer = ring(kid(c, 'outerBoundaryIs'));
      const inner = kids(c, 'innerBoundaryIs').flatMap((b) => kids(b, 'LinearRing').map((r) => kmlCoords(kid(r, 'coordinates'))));
      if (outer.length) out.push({ type: 'Polygon', coordinates: [outer, ...inner] });
    } else if (c.name === 'MultiGeometry') out.push(...kmlGeoms(c));
    else if (c.name === 'Track') {
      const p = kids(c, 'coord').map((k) => k.text.trim().split(/\s+/).map(Number));
      if (p.length) out.push({ type: 'LineString', coordinates: p });
    } else if (c.name === 'MultiTrack') out.push(...kmlGeoms(c));
  }
  return out;
}
/** Combines several geometries into one Multi* geometry or a GeometryCollection. */
export function combine(gs: Geom[]): Geom | null {
  if (!gs.length) return null;
  if (gs.length === 1) return gs[0];
  const t = gs[0].type;
  if (gs.every((g) => g.type === t) && t !== 'GeometryCollection' && !t.startsWith('Multi')) {
    return { type: ('Multi' + t) as 'MultiPoint', coordinates: gs.map((g) => (g as { coordinates: Pos }).coordinates) } as Geom;
  }
  return { type: 'GeometryCollection', geometries: gs };
}
export function readKML(text: string, name = 'KML'): Layer {
  const doc = parseXml(text);
  const feats: Feature[] = [];
  const walk = (n: XNode, folder: string) => {
    for (const c of n.children) {
      if (c.name === 'Placemark') {
        const props: Props = {};
        const nm = kid(c, 'name'); if (nm) props.name = allText(nm).trim();
        const ds = kid(c, 'description'); if (ds) props.description = allText(ds).trim();
        if (folder) props.folder = folder;
        const ext = kid(c, 'ExtendedData');
        if (ext) {
          for (const d of kids(ext, 'Data')) { const v = kid(d, 'value'); props[d.attrs.name ?? 'value'] = v ? allText(v).trim() : ''; }
          for (const sd of kids(ext, 'SchemaData')) for (const d of kids(sd, 'SimpleData')) props[d.attrs.name ?? 'value'] = allText(d).trim();
        }
        for (const [k, v] of Object.entries(props)) if (typeof v === 'string' && v !== '' && /^-?\d+(\.\d+)?(e[-+]?\d+)?$/i.test(v) && k !== 'name' && k !== 'description') props[k] = Number(v);
        feats.push({ geometry: combine(kmlGeoms(c)), properties: props });
      } else if (c.name === 'Folder' || c.name === 'Document') {
        const fn = kid(c, 'name');
        walk(c, c.name === 'Folder' && fn ? (folder ? folder + ' / ' : '') + allText(fn).trim() : folder);
      } else if (c.name === 'kml') walk(c, folder);
    }
  };
  walk(doc, '');
  if (!feats.length) throw new Error('No placemarks found in this KML.');
  const l = finish({ name, features: feats, fields: [], source: 'KML', crs: 'WGS 84 longitude, latitude', notes: [] });
  checkLonLat(l);
  return l;
}

// ---------------------------------------------------------------- WKT geometry
export function parseWkt(s: string): Geom | null {
  let t = s.trim().toUpperCase();
  const srid = t.match(/^SRID=\d+;/); if (srid) t = t.slice(srid[0].length);
  let i = 0;
  const ws = () => { while (i < t.length && /\s/.test(t[i])) i++; };
  const word = () => { ws(); const m = t.slice(i).match(/^[A-Z]+/); if (!m) throw new Error(`WKT: expected a word at "${t.slice(i, i + 12)}".`); i += m[0].length; return m[0]; };
  const expect = (c: string) => { ws(); if (t[i] !== c) throw new Error(`WKT: expected "${c}" at "${t.slice(i, i + 12)}".`); i++; };
  const peek = () => { ws(); return t[i]; };
  const pos = (): Pos => { ws(); const m = t.slice(i).match(/^[-+]?[\d.]+(?:E[-+]?\d+)?(?:\s+[-+]?[\d.]+(?:E[-+]?\d+)?){1,3}/); if (!m) throw new Error(`WKT: expected coordinates at "${t.slice(i, i + 12)}".`); i += m[0].length; const p = m[0].trim().split(/\s+/).map(Number); return p.slice(0, 2); };
  const list = <T>(f: () => T): T[] => { expect('('); const out = [f()]; while (peek() === ',') { i++; out.push(f()); } expect(')'); return out; };
  const ptMaybeParen = (): Pos => { if (peek() === '(') { i++; const p = pos(); expect(')'); return p; } return pos(); };
  const geom = (): Geom | null => {
    const w = word();
    ws(); if (/^(Z|M|ZM)\b/.test(t.slice(i))) word();
    if (t.slice(i).trimStart().startsWith('EMPTY')) { word(); return null; }
    switch (w) {
      case 'POINT': return { type: 'Point', coordinates: list(pos)[0] };
      case 'LINESTRING': return { type: 'LineString', coordinates: list(pos) };
      case 'POLYGON': return { type: 'Polygon', coordinates: list(() => list(pos)) };
      case 'MULTIPOINT': return { type: 'MultiPoint', coordinates: list(ptMaybeParen) };
      case 'MULTILINESTRING': return { type: 'MultiLineString', coordinates: list(() => list(pos)) };
      case 'MULTIPOLYGON': return { type: 'MultiPolygon', coordinates: list(() => list(() => list(pos))) };
      case 'GEOMETRYCOLLECTION': return { type: 'GeometryCollection', geometries: list(geom).filter(Boolean) as Geom[] };
      default: throw new Error(`WKT: unknown geometry "${w}".`);
    }
  };
  const g = geom(); ws();
  if (i < t.length) throw new Error(`WKT: unexpected text "${t.slice(i, i + 12)}".`);
  return g;
}
const n2 = (x: number) => String(+x.toFixed(9));
export function toWkt(g: Geom | null): string {
  if (!g) return 'GEOMETRYCOLLECTION EMPTY';
  const p = (c: Pos) => `${n2(c[0])} ${n2(c[1])}`, l = (c: Pos[]) => `(${c.map(p).join(', ')})`, pg = (c: Pos[][]) => `(${c.map(l).join(', ')})`;
  switch (g.type) {
    case 'Point': return `POINT (${p(g.coordinates)})`;
    case 'MultiPoint': return `MULTIPOINT (${g.coordinates.map((c) => `(${p(c)})`).join(', ')})`;
    case 'LineString': return `LINESTRING ${l(g.coordinates)}`;
    case 'MultiLineString': return `MULTILINESTRING (${g.coordinates.map(l).join(', ')})`;
    case 'Polygon': return `POLYGON ${pg(g.coordinates)}`;
    case 'MultiPolygon': return `MULTIPOLYGON (${g.coordinates.map(pg).join(', ')})`;
    case 'GeometryCollection': return `GEOMETRYCOLLECTION (${g.geometries.map(toWkt).join(', ')})`;
  }
}

/** A CSV (or pasted table) with a WKT column, or latitude and longitude columns. */
export function readCsv(text: string, name = 'CSV'): Layer {
  const { rows } = readTable(text);
  if (rows.length < 2) throw new Error('The table needs a header row and at least one row of data.');
  const head = rows[0].map((h) => h.trim());
  let iw = head.findIndex((h) => /^(wkt|geometry|geom|the_geom|shape|wkt_geom)$/i.test(h));
  if (iw < 0) iw = head.findIndex((_, k) => /^\s*(SRID=\d+;)?\s*(MULTI)?(POINT|LINESTRING|POLYGON)|^\s*GEOMETRYCOLLECTION/i.test(rows[1][k] ?? ''));
  const ilat = head.findIndex((h) => /^(lat|latitude|y)$/i.test(h)), ilon = head.findIndex((h) => /^(lon|long|lng|longitude|x)$/i.test(h));
  if (iw < 0 && (ilat < 0 || ilon < 0)) throw new Error('Could not find a WKT column (named wkt or geometry) or latitude and longitude columns.');
  const feats: Feature[] = [];
  const bad: number[] = [];
  rows.slice(1).forEach((r, k) => {
    const props: Props = {};
    head.forEach((h, j) => { if (j === iw || (iw < 0 && (j === ilat || j === ilon))) return; const v = r[j] ?? ''; props[h || `column_${j + 1}`] = v !== '' && /^-?\d+(\.\d+)?(e[-+]?\d+)?$/i.test(v) ? Number(v) : v; });
    try {
      let g: Geom | null;
      if (iw >= 0) g = parseWkt(r[iw] ?? '');
      else { const la = Number(r[ilat]), lo = Number(r[ilon]); if (!Number.isFinite(la) || !Number.isFinite(lo)) throw new Error('not a number'); g = { type: 'Point', coordinates: [lo, la] }; }
      feats.push({ geometry: g, properties: props });
    } catch { bad.push(k + 2); }
  });
  if (!feats.length) throw new Error('No row had a geometry that could be read.');
  const l = finish({ name, features: feats, fields: [], source: iw >= 0 ? 'CSV with WKT' : 'CSV with latitude and longitude', crs: 'WGS 84 longitude, latitude (assumed)', notes: bad.length ? [`${bad.length} row${bad.length === 1 ? '' : 's'} could not be read and ${bad.length === 1 ? 'was' : 'were'} left out (line${bad.length === 1 ? '' : 's'} ${bad.slice(0, 8).join(', ')}${bad.length > 8 ? ', …' : ''}).`] : [] });
  checkLonLat(l);
  return l;
}

// ---------------------------------------------------------------- Shapefile
export function ringArea2(r: Pos[]) { let s = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]); return s / 2; } // >0 when counter-clockwise
export function pointInRing(p: Pos, r: Pos[]) {
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
/** Shapefile rings to polygons: clockwise rings are outer, counter-clockwise rings are holes in the outer ring that holds them. */
export function ringsToPolygons(rings: Pos[][]): Pos[][][] {
  const outers: Pos[][][] = [], holes: Pos[][] = [];
  for (const r of rings) (ringArea2(r) <= 0 ? outers.push([r]) : holes.push(r));
  for (const h of holes) {
    let best: Pos[][] | null = null, bestA = Infinity;
    for (const o of outers) { const a = Math.abs(ringArea2(o[0])); if (a < bestA && pointInRing(h[0], o[0]) && pointInRing(h[Math.floor(h.length / 2)], o[0])) { best = o; bestA = a; } }
    if (best) best.push(h); else outers.push([h]);
  }
  return outers;
}
export function readShp(buf: ArrayBuffer): { geoms: (Geom | null)[]; type: number; notes: string[] } {
  const dv = new DataView(buf);
  if (buf.byteLength < 100 || dv.getInt32(0, false) !== 9994) throw new Error('The .shp file is not a shapefile (wrong file code).');
  const type = dv.getInt32(32, true), notes: string[] = [];
  const geoms: (Geom | null)[] = [];
  let o = 100;
  while (o + 8 <= buf.byteLength) {
    const len = dv.getInt32(o + 4, false) * 2;
    const c = o + 8;
    o = c + len;
    if (len < 4 || c + len > buf.byteLength) { if (c + 4 <= buf.byteLength) notes.push('The .shp file ends early; the last record was skipped.'); break; }
    const st = dv.getInt32(c, true);
    const pt = (p: number): Pos => [dv.getFloat64(p, true), dv.getFloat64(p + 8, true)];
    if (st === 0) { geoms.push(null); continue; }
    if (st === 1 || st === 11 || st === 21) { geoms.push({ type: 'Point', coordinates: pt(c + 4) }); continue; }
    if (st === 8 || st === 18 || st === 28) {
      const n = dv.getInt32(c + 36, true), pts: Pos[] = [];
      for (let k = 0; k < n; k++) pts.push(pt(c + 40 + 16 * k));
      geoms.push(n === 1 ? { type: 'Point', coordinates: pts[0] } : { type: 'MultiPoint', coordinates: pts }); continue;
    }
    if ([3, 5, 13, 15, 23, 25].includes(st)) {
      const np = dv.getInt32(c + 36, true), n = dv.getInt32(c + 40, true);
      const parts: number[] = []; for (let k = 0; k < np; k++) parts.push(dv.getInt32(c + 44 + 4 * k, true));
      const p0 = c + 44 + 4 * np, rings: Pos[][] = [];
      for (let k = 0; k < np; k++) { const a = parts[k], b = k + 1 < np ? parts[k + 1] : n; const r: Pos[] = []; for (let q = a; q < b; q++) r.push(pt(p0 + 16 * q)); rings.push(r); }
      if (st % 10 === 3) geoms.push(rings.length === 1 ? { type: 'LineString', coordinates: rings[0] } : { type: 'MultiLineString', coordinates: rings });
      else { const polys = ringsToPolygons(rings.filter((r) => r.length >= 4)); geoms.push(!polys.length ? null : polys.length === 1 ? { type: 'Polygon', coordinates: polys[0] } : { type: 'MultiPolygon', coordinates: polys }); }
      continue;
    }
    if (st === 31) { geoms.push(null); if (!notes.includes('MultiPatch (3D) shapes are not drawn.')) notes.push('MultiPatch (3D) shapes are not drawn.'); continue; }
    throw new Error(`Shape type ${st} is not a shapefile type this reader knows.`);
  }
  if ([11, 13, 15, 18].includes(type)) notes.push('Heights (Z values) in the shapefile are ignored.');
  return { geoms, type, notes };
}

const CPG: Record<string, string> = { '1252': 'windows-1252', '65001': 'utf-8', 'utf8': 'utf-8', 'utf-8': 'utf-8', '1251': 'windows-1251', '1250': 'windows-1250', '936': 'gbk', '932': 'shift_jis', '950': 'big5', '949': 'euc-kr', '874': 'windows-874', '1253': 'windows-1253', '1254': 'windows-1254', '1255': 'windows-1255', '1256': 'windows-1256' };
export function readDbf(buf: ArrayBuffer, cpg = ''): { fields: { name: string; type: string; len: number; dec: number }[]; records: Props[]; encoding: string } {
  const dv = new DataView(buf), u8 = new Uint8Array(buf);
  if (buf.byteLength < 32) throw new Error('The .dbf file is too short.');
  const n = dv.getUint32(4, true), hlen = dv.getUint16(8, true), rlen = dv.getUint16(10, true);
  const fields: { name: string; type: string; len: number; dec: number; off: number }[] = [];
  let off = 1;
  for (let p = 32; p + 32 <= hlen && u8[p] !== 0x0d; p += 32) {
    let e = p; while (e < p + 11 && u8[e]) e++;
    const name = new TextDecoder('latin1').decode(u8.subarray(p, e)).trim();
    const f = { name, type: String.fromCharCode(u8[p + 11]), len: u8[p + 16], dec: u8[p + 17], off };
    if (f.type === 'C' && f.dec) f.len += f.dec * 256; // long character fields
    fields.push(f); off += f.len;
  }
  // Encoding: the .cpg file if there is one, else UTF-8 when every text field decodes as UTF-8, else Windows-1252.
  const c = cpg.trim().toLowerCase();
  let enc = CPG[c] ?? CPG[c.replace(/^(ansi|cp|windows-?)\s*_?/, '')] ?? '';
  if (!enc && c) { try { new TextDecoder(c); enc = c; } catch { /* unknown label */ } }
  if (!enc) {
    enc = 'utf-8';
    try { new TextDecoder('utf-8', { fatal: true }).decode(u8.subarray(hlen, Math.min(u8.length, hlen + n * rlen))); } catch { enc = 'windows-1252'; }
  }
  let dec: TextDecoder;
  try { dec = new TextDecoder(enc); } catch { dec = new TextDecoder('windows-1252'); enc = 'windows-1252'; }
  const records: Props[] = [];
  for (let r = 0; r < n; r++) {
    const base = hlen + r * rlen;
    if (base + rlen > u8.length) break;
    const rec: Props = {};
    for (const f of fields) {
      const raw = dec.decode(u8.subarray(base + f.off, base + f.off + f.len));
      const s = raw.replace(/\0+$/, '').trim();
      if (f.type === 'N' || f.type === 'F') rec[f.name] = s === '' || /^\*+$/.test(s) ? null : Number(s);
      else if (f.type === 'L') rec[f.name] = /^[TtYy]$/.test(s) ? true : /^[FfNn]$/.test(s) ? false : null;
      else if (f.type === 'D') rec[f.name] = /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : s || null;
      else if (f.type === 'I' && f.len === 4) rec[f.name] = dv.getInt32(base + f.off, true);
      else if (f.type === 'O' && f.len === 8) rec[f.name] = dv.getFloat64(base + f.off, true);
      else rec[f.name] = raw.replace(/[\0 ]+$/, '');
    }
    records.push(rec);
  }
  return { fields: fields.map(({ off: _o, ...f }) => f), records, encoding: enc };
}

// ---------------------------------------------------------------- .prj (WKT 1) and map projections
type WNode = { k: string; v: (string | number | WNode)[] };
export function parseWktCrs(s: string): WNode {
  let i = 0;
  const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };
  const node = (): WNode => {
    ws(); const m = s.slice(i).match(/^[A-Za-z_][\w]*/); if (!m) throw new Error('The .prj file is not WKT.');
    i += m[0].length; ws();
    const open = s[i]; if (open !== '[' && open !== '(') return { k: m[0].toUpperCase(), v: [] };
    const close = open === '[' ? ']' : ')'; i++;
    const v: (string | number | WNode)[] = [];
    for (;;) {
      ws();
      if (s[i] === '"') { const e = s.indexOf('"', i + 1); v.push(s.slice(i + 1, e)); i = e + 1; }
      else if (/[-+\d.]/.test(s[i])) { const mm = s.slice(i).match(/^[-+]?[\d.]+(?:[eE][-+]?\d+)?/)!; v.push(Number(mm[0])); i += mm[0].length; }
      else v.push(node());
      ws();
      if (s[i] === ',') { i++; continue; }
      if (s[i] === close) { i++; break; }
      throw new Error('The .prj file is not valid WKT.');
    }
    return { k: m[0].toUpperCase(), v };
  };
  return node();
}
const sub = (n: WNode, k: string) => n.v.find((x) => typeof x === 'object' && (x as WNode).k === k) as WNode | undefined;
const subs = (n: WNode, k: string) => n.v.filter((x) => typeof x === 'object' && (x as WNode).k === k) as WNode[];

export type Projection = { kind: 'geographic' | 'tm' | 'merc' | 'lcc' | 'aea'; name: string; ell: Ellipsoid; unit: number; unitName: string; p: Record<string, number>; inv: (x: number, y: number) => Pos; fwd: (lon: number, lat: number) => Pos };

const qf = (e: number, s: number) => (e === 0 ? 2 * s : (1 - e * e) * (s / (1 - e * e * s * s) - (1 / (2 * e)) * Math.log((1 - e * s) / (1 + e * s))));
const tf = (e: number, phi: number) => Math.tan(Math.PI / 4 - phi / 2) / ((1 - e * Math.sin(phi)) / (1 + e * Math.sin(phi))) ** (e / 2);
const mf = (e: number, phi: number) => Math.cos(phi) / Math.sqrt(1 - e * e * Math.sin(phi) ** 2);
const phiFromT = (e: number, t: number) => { let phi = Math.PI / 2 - 2 * Math.atan(t); for (let k = 0; k < 30; k++) { const n = Math.PI / 2 - 2 * Math.atan(t * ((1 - e * Math.sin(phi)) / (1 + e * Math.sin(phi))) ** (e / 2)); if (Math.abs(n - phi) < 1e-14) { phi = n; break; } phi = n; } return phi; };

/** A map projection from a .prj file (ESRI or OGC WKT 1). Throws for projections this tool cannot undo. */
export function projectionFromPrj(text: string): Projection {
  const root = parseWktCrs(text.trim());
  const geog = root.k === 'GEOGCS' ? root : sub(root, 'GEOGCS');
  if (!geog) throw new Error('The .prj file has no geographic datum (GEOGCS).');
  const sph = sub(sub(geog, 'DATUM') ?? geog, 'SPHEROID') ?? sub(geog, 'ELLIPSOID');
  const a = Number(sph?.v[1] ?? 6378137), invf = Number(sph?.v[2] ?? 298.257223563);
  const ell: Ellipsoid = { id: 'prj', name: String(sph?.v[0] ?? 'WGS 84'), a, f: invf ? 1 / invf : 0 };
  const name = String(root.v[0] ?? '');
  if (root.k === 'GEOGCS') return { kind: 'geographic', name, ell, unit: 1, unitName: 'degree', p: {}, inv: (x, y) => [x, y], fwd: (lo, la) => [lo, la] };
  if (root.k !== 'PROJCS') throw new Error(`The .prj file describes a ${root.k}, not a map projection this tool reads.`);
  const proj = String(sub(root, 'PROJECTION')?.v[0] ?? '').toLowerCase();
  const P: Record<string, number> = {};
  for (const n of subs(root, 'PARAMETER')) P[String(n.v[0]).toLowerCase()] = Number(n.v[1]);
  const units = subs(root, 'UNIT'), unit = Number(units[units.length - 1]?.v[1] ?? 1), unitName = String(units[units.length - 1]?.v[0] ?? 'metre');
  const g = (...ks: string[]) => { for (const k of ks) if (P[k] !== undefined) return P[k]; return 0; };
  const FE = g('false_easting') * unit, FN = g('false_northing') * unit;
  const lon0 = g('central_meridian', 'longitude_of_center', 'longitude_of_origin', 'longitude_of_natural_origin');
  const lat0 = g('latitude_of_origin', 'latitude_of_center', 'latitude_of_natural_origin');
  const k0 = P.scale_factor ?? P.scale_factor_at_natural_origin ?? 1;
  const e = Math.sqrt(ell.f * (2 - ell.f));
  const base = { name, ell, unit, unitName, p: { lon0, lat0, k0, FE, FN } };
  if (/transverse_mercator|gauss_kruger/.test(proj)) {
    const M0 = tmForward(lat0, lon0, lon0, ell, k0).y;
    return { ...base, kind: 'tm', inv: (x, y) => { const r = tmInverse(x * unit - FE, y * unit - FN + M0, lon0, ell, k0); return [r.lon, r.lat]; }, fwd: (lo, la) => { const r = tmForward(la, lo, lon0, ell, k0); return [(r.x + FE) / unit, (r.y - M0 + FN) / unit]; } };
  }
  if (/mercator/.test(proj)) {
    // Web Mercator ("Pseudo Mercator", ESRI "Mercator_Auxiliary_Sphere") uses a sphere of the semi-major axis.
    const sphere = /auxiliary_sphere|pseudo|popular/.test(proj) || /pseudo|web|auxiliary/i.test(name);
    const ee = sphere ? 0 : e;
    const sp1 = g('standard_parallel_1', 'latitude_of_true_scale') * D;
    const kk = P.standard_parallel_1 !== undefined ? mf(ee, sp1) : k0;
    return { ...base, kind: 'merc', p: { ...base.p, k0: kk }, inv: (x, y) => [lon0 + (x * unit - FE) / (a * kk) / D, phiFromT(ee, Math.exp(-(y * unit - FN) / (a * kk))) / D], fwd: (lo, la) => [(FE + a * kk * (lo - lon0) * D) / unit, (FN - a * kk * Math.log(tf(ee, la * D))) / unit] };
  }
  if (/lambert_conformal_conic/.test(proj)) {
    const p1 = (P.standard_parallel_1 ?? lat0) * D, p2 = (P.standard_parallel_2 ?? P.standard_parallel_1 ?? lat0) * D, f0 = lat0 * D;
    const m1 = mf(e, p1), m2 = mf(e, p2), t1 = tf(e, p1), t2 = tf(e, p2), t0 = tf(e, f0);
    const n = Math.abs(p1 - p2) < 1e-12 ? Math.sin(p1) : (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
    const F = m1 / (n * t1 ** n), kk = P.standard_parallel_2 === undefined && P.standard_parallel_1 === undefined ? k0 : 1;
    const r0 = a * kk * F * t0 ** n;
    return { ...base, kind: 'lcc', inv: (x, y) => { const X = x * unit - FE, Y = r0 - (y * unit - FN); const r = Math.sign(n) * Math.hypot(X, Y); const t = (r / (a * kk * F)) ** (1 / n); const th = Math.atan2(Math.sign(n) * X, Math.sign(n) * Y); return [lon0 + th / n / D, phiFromT(e, t) / D]; }, fwd: (lo, la) => { const r = a * kk * F * tf(e, la * D) ** n, th = n * (lo - lon0) * D; return [(FE + r * Math.sin(th)) / unit, (FN + r0 - r * Math.cos(th)) / unit]; } };
  }
  if (/albers/.test(proj)) {
    const p1 = (P.standard_parallel_1 ?? 0) * D, p2 = (P.standard_parallel_2 ?? P.standard_parallel_1 ?? 0) * D, f0 = lat0 * D;
    const m1 = mf(e, p1), m2 = mf(e, p2), q1 = qf(e, Math.sin(p1)), q2 = qf(e, Math.sin(p2)), q0 = qf(e, Math.sin(f0));
    const n = Math.abs(p1 - p2) < 1e-12 ? Math.sin(p1) : (m1 * m1 - m2 * m2) / (q2 - q1), C = m1 * m1 + n * q1, r0 = (a * Math.sqrt(C - n * q0)) / n;
    return { ...base, kind: 'aea', inv: (x, y) => {
      const X = x * unit - FE, Y = r0 - (y * unit - FN), r = Math.hypot(X, Y), q = (C - (r * r * n * n) / (a * a)) / n;
      let phi = Math.asin(Math.max(-1, Math.min(1, q / 2)));
      for (let k = 0; k < 30; k++) { const s = Math.sin(phi), d = ((1 - e * e * s * s) ** 2 / (2 * Math.cos(phi))) * (q / (1 - e * e) - s / (1 - e * e * s * s) + (e ? (1 / (2 * e)) * Math.log((1 - e * s) / (1 + e * s)) : 0)); phi += d; if (Math.abs(d) < 1e-14) break; }
      const th = Math.atan2(Math.sign(n) * X, Math.sign(n) * Y);
      return [lon0 + th / n / D, phi / D];
    }, fwd: (lo, la) => { const r = (a * Math.sqrt(C - n * qf(e, Math.sin(la * D)))) / n, th = n * (lo - lon0) * D; return [(FE + r * Math.sin(th)) / unit, (FN + r0 - r * Math.cos(th)) / unit]; } };
  }
  throw new Error(`The data use the "${sub(root, 'PROJECTION')?.v[0]}" projection, which this tool cannot convert to longitude and latitude. Reproject the layer to WGS 84 (EPSG:4326) in your GIS first.`);
}

export function mapGeom(g: Geom | null, f: (p: Pos) => Pos): Geom | null {
  if (!g) return null;
  switch (g.type) {
    case 'Point': return { type: 'Point', coordinates: f(g.coordinates) };
    case 'MultiPoint': case 'LineString': return { type: g.type, coordinates: g.coordinates.map(f) } as Geom;
    case 'MultiLineString': case 'Polygon': return { type: g.type, coordinates: g.coordinates.map((r) => r.map(f)) } as Geom;
    case 'MultiPolygon': return { type: 'MultiPolygon', coordinates: g.coordinates.map((p) => p.map((r) => r.map(f))) };
    case 'GeometryCollection': return { type: 'GeometryCollection', geometries: g.geometries.map((x) => mapGeom(x, f)!).filter(Boolean) };
  }
}

/** A shapefile from its parts (.shp needed; .dbf, .prj and .cpg optional). */
export function readShapefile(parts: { shp: ArrayBuffer; dbf?: ArrayBuffer; prj?: string; cpg?: string }, name = 'Shapefile'): Layer {
  const { geoms, notes } = readShp(parts.shp);
  const dbf = parts.dbf ? readDbf(parts.dbf, parts.cpg ?? '') : null;
  if (!parts.dbf) notes.push('No .dbf file, so there are no attributes.');
  else if (dbf && dbf.records.length !== geoms.length) notes.push(`The .dbf has ${dbf.records.length} records but the .shp has ${geoms.length} shapes; they were matched in order.`);
  let proj: Projection | null = null, crs = 'longitude, latitude (assumed: no .prj file)';
  if (parts.prj) { proj = projectionFromPrj(parts.prj); crs = proj.kind === 'geographic' ? `${proj.name || 'geographic'} longitude, latitude` : `${proj.name || 'projected'} (${proj.kind === 'tm' ? 'Transverse Mercator' : proj.kind === 'merc' ? 'Mercator' : proj.kind === 'lcc' ? 'Lambert conformal conic' : 'Albers equal-area'}, ${proj.unitName}), converted to longitude and latitude`; }
  else notes.push('No .prj file: the coordinates are taken to be longitude and latitude.');
  if (proj && proj.kind !== 'geographic' && !/wgs|grs|1980|nad83|etrs|gda/i.test(proj.ell.name)) notes.push(`The data are on the ${proj.ell.name} ellipsoid. They are unprojected on it, without a datum shift to WGS 84; positions may differ from WGS 84 by up to a few hundred metres, which hardly changes areas.`);
  const feats: Feature[] = [], planar: Feature[] = [];
  geoms.forEach((g, k) => {
    const props = dbf?.records[k] ?? {};
    planar.push({ geometry: g, properties: props });
    feats.push({ geometry: proj && proj.kind !== 'geographic' ? mapGeom(g, (p) => proj!.inv(p[0], p[1])) : g, properties: props });
  });
  if (dbf) notes.push(`Attributes read as ${dbf.encoding}.`);
  const layer: Layer = { name, features: feats, fields: dbf ? dbf.fields.map((f) => f.name) : [], source: 'Shapefile', crs, notes };
  if (proj && proj.kind !== 'geographic') { layer.planar = planar; layer.planarUnit = proj.unitName; }
  checkLonLat(layer);
  return layer;
}

/** Opens any supported file by its name and bytes. A .zip may hold one or more shapefiles (all are read) or a KML. */
export function readAny(files: { name: string; bytes: Uint8Array }[]): Layer[] {
  const td = (b: Uint8Array) => new TextDecoder('utf-8').decode(b);
  const ab = (b: Uint8Array) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  const flat: { name: string; bytes: Uint8Array }[] = [];
  for (const f of files) {
    const low = f.name.toLowerCase();
    if (low.endsWith('.zip') || low.endsWith('.kmz')) {
      let z: Record<string, Uint8Array>;
      try { z = unzipSync(f.bytes); } catch { throw new Error(`${f.name} is not a readable zip file.`); }
      for (const [n, b] of Object.entries(z)) if (!n.startsWith('__MACOSX/') && !n.endsWith('/')) flat.push({ name: n, bytes: b });
    } else flat.push(f);
  }
  const out: Layer[] = [];
  const byStem = new Map<string, Record<string, Uint8Array>>();
  for (const f of flat) {
    const m = f.name.match(/^(.*)\.([^.\/]+)$/), ext = m ? m[2].toLowerCase() : '', base = (m ? m[1] : f.name).split('/').pop()!;
    if (['shp', 'dbf', 'prj', 'cpg', 'shx'].includes(ext)) { const k = (m ? m[1] : f.name).toLowerCase(); const r = byStem.get(k) ?? {}; r[ext] = f.bytes; r.__name = new TextEncoder().encode(base); byStem.set(k, r); }
    else if (['geojson', 'json'].includes(ext)) out.push(readGeoJSON(td(f.bytes), base));
    else if (ext === 'kml') out.push(readKML(td(f.bytes), base));
    else if (['csv', 'txt', 'tsv'].includes(ext)) out.push(readCsv(td(f.bytes), base));
  }
  for (const [, r] of byStem) {
    const name = td(r.__name);
    if (!r.shp) { if (r.dbf) throw new Error(`${name}.dbf has no matching ${name}.shp; open the .shp too (or the whole zip).`); continue; }
    out.push(readShapefile({ shp: ab(r.shp), dbf: r.dbf ? ab(r.dbf) : undefined, prj: r.prj ? td(r.prj) : undefined, cpg: r.cpg ? td(r.cpg) : undefined }, name));
  }
  if (!out.length) throw new Error('No GeoJSON, KML, KMZ, shapefile or CSV found. A shapefile needs at least its .shp file; zip it with the .dbf and .prj.');
  return out;
}

// ---------------------------------------------------------------- Measures on the ellipsoid
export function bounds(fs: Feature[]): [number, number, number, number] | null {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const eat = (p: Pos) => { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; };
  for (const f of fs) eachPos(f.geometry, eat);
  return Number.isFinite(x0) ? [x0, y0, x1, y1] : null;
}
export function eachPos(g: Geom | null, f: (p: Pos) => void) {
  if (!g) return;
  if (g.type === 'GeometryCollection') { for (const x of g.geometries) eachPos(x, f); return; }
  const walk = (c: any) => { if (typeof c[0] === 'number') f(c); else for (const x of c) walk(x); };
  walk(g.coordinates);
}

const ELL = WGS84;
const E2 = ELL.f * (2 - ELL.f), EE = Math.sqrt(E2);
const QP = qf(EE, 1), RQ = ELL.a * Math.sqrt(QP / 2);
export const AUTHALIC_RADIUS = RQ;
const authalic = (lat: number) => Math.asin(Math.max(-1, Math.min(1, qf(EE, Math.sin(lat * D)) / QP)));

/** Geodesic distance between two points (Vincenty; for the rare nearly-antipodal pair, the authalic sphere). */
export function geoDist(a: Pos, b: Pos) {
  const r = inverse(a[1], a[0], b[1], b[0], ELL);
  if (r.converged) return r.s;
  const p1 = a[1] * D, p2 = b[1] * D, dl = (b[0] - a[0]) * D;
  return 2 * RQ * Math.asin(Math.min(1, Math.sqrt(Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2)));
}
export function lineLength(c: Pos[]) { let s = 0; for (let i = 1; i < c.length; i++) s += geoDist(c[i - 1], c[i]); return s; }

const STEP = 2000;
/** Points along the geodesic from a to b, every STEP metres at most (a included, b not). */
function densify(a: Pos, b: Pos, out: Pos[]) {
  out.push(a);
  const r = inverse(a[1], a[0], b[1], b[0], ELL);
  if (!r.converged || r.s <= STEP) return;
  const n = Math.min(2000, Math.ceil(r.s / STEP));
  for (let k = 1; k < n; k++) { const p = direct(a[1], a[0], r.az1, (r.s * k) / n, ELL); out.push([p.lon, p.lat]); }
}
/** Signed area of one ring on the ellipsoid (m², positive when counter-clockwise) and its perimeter (m). */
export function ringArea(ring: Pos[]) {
  const r = ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1] ? ring.slice(0, -1) : ring.slice();
  if (r.length < 3) return { area: 0, perimeter: r.length === 2 ? 2 * geoDist(r[0], r[1]) : 0 };
  const pts: Pos[] = [];
  let per = 0;
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; per += geoDist(a, b); densify(a, b, pts); }
  // Small rings (under about 0.1° across): Lambert azimuthal equal-area map of the authalic sphere centred on the ring,
  // then the plane area, which avoids rounding errors in the spherical excess of tiny polygons.
  let lo0 = pts[0][0], la0 = pts[0][1], spanLo = 0, spanLa = 0;
  for (const p of pts) { const dl = ((p[0] - lo0 + 540) % 360) - 180; spanLo = Math.max(spanLo, Math.abs(dl)); spanLa = Math.max(spanLa, Math.abs(p[1] - la0)); }
  if (spanLo * Math.cos(la0 * D) < 0.1 && spanLa < 0.1 && Math.abs(la0) < 89) {
    const b0 = authalic(la0), sb0 = Math.sin(b0), cb0 = Math.cos(b0);
    const xy = pts.map((p) => { const b = authalic(p[1]), dl = (((p[0] - lo0 + 540) % 360) - 180) * D, cb = Math.cos(b), sb = Math.sin(b), cd = Math.cos(dl); const k = Math.sqrt(2 / (1 + sb0 * sb + cb0 * cb * cd)); return [RQ * k * cb * Math.sin(dl), RQ * k * (cb0 * sb - sb0 * cb * cd)]; });
    return { area: ringArea2(xy), perimeter: per };
  }
  // Spherical excess on the authalic sphere, edge by edge (each edge with the pole forms a triangle).
  let sum = 0, dlSum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const b1 = authalic(a[1]), b2 = authalic(b[1]);
    let dl = (b[0] - a[0]) * D; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
    dlSum += dl;
    sum += 2 * Math.atan2(Math.tan(dl / 2) * (Math.tan(b1 / 2) + Math.tan(b2 / 2)), 1 + Math.tan(b1 / 2) * Math.tan(b2 / 2));
  }
  // A ring around a pole: the sum is measured from the north pole, so add or take the polar cap.
  // As in GeographicLib, the area is then reduced to between minus and plus half the Earth's area, so a ring
  // walked counter-clockwise (interior on the left) is positive.
  let ex = sum;
  if (Math.abs(dlSum) > Math.PI) ex -= Math.sign(dlSum) * 2 * Math.PI;
  const T = 4 * Math.PI;
  ex = ((ex % T) + T) % T; if (ex > T / 2) ex -= T;
  return { area: -ex * RQ * RQ, perimeter: per };
}
export type Measure = { area: number; perimeter: number; outer: number; length: number; parts: number; vertices: number };
/**
 * Area (m², holes taken off), perimeter of all rings including holes (m), perimeter of the outer rings only (m) and
 * length of lines (m) of a geometry on the WGS 84 ellipsoid.
 */
export function measure(g: Geom | null): Measure {
  const m: Measure = { area: 0, perimeter: 0, outer: 0, length: 0, parts: 0, vertices: 0 };
  if (!g) return m;
  eachPos(g, () => m.vertices++);
  const poly = (c: Pos[][]) => { c.forEach((r, k) => { const x = ringArea(r); m.area += k === 0 ? Math.abs(x.area) : -Math.abs(x.area); m.perimeter += x.perimeter; if (k === 0) m.outer += x.perimeter; }); m.parts++; };
  switch (g.type) {
    case 'Polygon': poly(g.coordinates); break;
    case 'MultiPolygon': g.coordinates.forEach(poly); break;
    case 'LineString': m.length = lineLength(g.coordinates); m.parts = 1; break;
    case 'MultiLineString': g.coordinates.forEach((c) => { m.length += lineLength(c); m.parts++; }); break;
    case 'Point': m.parts = 1; break;
    case 'MultiPoint': m.parts = g.coordinates.length; break;
    case 'GeometryCollection': for (const x of g.geometries) { const y = measure(x); m.area += y.area; m.perimeter += y.perimeter; m.outer += y.outer; m.length += y.length; m.parts += y.parts; } break;
  }
  return m;
}
/** Plain (map-plane) area and perimeter in the file's own projected units, for comparison. */
export function planarMeasure(g: Geom | null) {
  let area = 0, per = 0;
  const ring = (r: Pos[]) => { for (let i = 1; i < r.length; i++) per += Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]); return Math.abs(ringArea2(r)); };
  const poly = (c: Pos[][]) => c.forEach((r, k) => (area += k === 0 ? ring(r) : -ring(r)));
  if (g?.type === 'Polygon') poly(g.coordinates); else if (g?.type === 'MultiPolygon') g.coordinates.forEach(poly);
  return { area, perimeter: per };
}

// ---------------------------------------------------------------- Writers
const isClosed = (r: Pos[]) => r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1];
const close = (r: Pos[]) => (isClosed(r) ? r : [...r, r[0]]);
/** Rings in RFC 7946 order: outer rings counter-clockwise, holes clockwise; all closed. */
export function rfc7946(g: Geom | null): Geom | null {
  if (!g) return null;
  const orient = (c: Pos[][]) => c.map((r, k) => { const rr = close(r); const ccw = ringArea2(rr) > 0; return (k === 0) === ccw ? rr : rr.slice().reverse(); });
  if (g.type === 'Polygon') return { type: 'Polygon', coordinates: orient(g.coordinates) };
  if (g.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: g.coordinates.map(orient) };
  if (g.type === 'GeometryCollection') return { type: 'GeometryCollection', geometries: g.geometries.map((x) => rfc7946(x)!) };
  return g;
}
const round = (g: Geom | null) => mapGeom(g, (p) => p.map((v) => +v.toFixed(9)));
export function toGeoJSON(l: Layer, extra?: (k: number) => Props): string {
  return JSON.stringify({ type: 'FeatureCollection', features: l.features.map((f, k) => ({ type: 'Feature', properties: { ...f.properties, ...(extra ? extra(k) : {}) }, geometry: round(rfc7946(f.geometry)) })) });
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function toKML(l: Layer, extra?: (k: number) => Props): string {
  const c = (p: Pos) => `${n2(p[0])},${n2(p[1])}`;
  const ring = (r: Pos[]) => `<LinearRing><coordinates>${close(r).map(c).join(' ')}</coordinates></LinearRing>`;
  const geom = (g: Geom | null): string => {
    if (!g) return '';
    switch (g.type) {
      case 'Point': return `<Point><coordinates>${c(g.coordinates)}</coordinates></Point>`;
      case 'LineString': return `<LineString><coordinates>${g.coordinates.map(c).join(' ')}</coordinates></LineString>`;
      case 'Polygon': return `<Polygon><outerBoundaryIs>${ring(g.coordinates[0])}</outerBoundaryIs>${g.coordinates.slice(1).map((r) => `<innerBoundaryIs>${ring(r)}</innerBoundaryIs>`).join('')}</Polygon>`;
      case 'MultiPoint': return `<MultiGeometry>${g.coordinates.map((p) => geom({ type: 'Point', coordinates: p })).join('')}</MultiGeometry>`;
      case 'MultiLineString': return `<MultiGeometry>${g.coordinates.map((p) => geom({ type: 'LineString', coordinates: p })).join('')}</MultiGeometry>`;
      case 'MultiPolygon': return `<MultiGeometry>${g.coordinates.map((p) => geom({ type: 'Polygon', coordinates: p })).join('')}</MultiGeometry>`;
      case 'GeometryCollection': return `<MultiGeometry>${g.geometries.map(geom).join('')}</MultiGeometry>`;
    }
  };
  const nameKey = l.fields.find((f) => /^name$/i.test(f)) ?? l.fields.find((f) => /name|title|label/i.test(f));
  const pm = l.features.map((f, k) => {
    const props = { ...f.properties, ...(extra ? extra(k) : {}) };
    const nm = nameKey && props[nameKey] != null ? `<name>${esc(String(props[nameKey]))}</name>` : '';
    const data = Object.entries(props).filter(([kk]) => kk !== nameKey).map(([kk, v]) => `<Data name="${esc(kk)}"><value>${esc(v == null ? '' : String(v))}</value></Data>`).join('');
    return `<Placemark>${nm}${data ? `<ExtendedData>${data}</ExtendedData>` : ''}${geom(f.geometry)}</Placemark>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${esc(l.name)}</name>\n${pm.join('\n')}\n</Document></kml>\n`;
}
export function toCsvWkt(l: Layer, extra?: (k: number) => Props): string {
  const cell = (v: unknown) => { const s = v == null ? '' : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const ex = extra ? Object.keys(extra(0)) : [];
  const head = ['WKT', ...l.fields, ...ex];
  return [head.map(cell).join(','), ...l.features.map((f, k) => { const e = extra ? extra(k) : {}; return [toWkt(f.geometry), ...l.fields.map((x) => f.properties[x]), ...ex.map((x) => e[x])].map(cell).join(','); })].join('\r\n') + '\r\n';
}

// ---------------------------------------------------------------- Example (made up)
export const EXAMPLE = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'North meadow', use: 'hay', owner: 'Example farm' }, geometry: { type: 'Polygon', coordinates: [[[-1.2050, 52.4100], [-1.1950, 52.4100], [-1.1950, 52.4150], [-1.2050, 52.4150], [-1.2050, 52.4100]]] } },
    { type: 'Feature', properties: { name: 'Pond field', use: 'grazing', owner: 'Example farm' }, geometry: { type: 'Polygon', coordinates: [[[-1.2050, 52.4040], [-1.1950, 52.4040], [-1.1950, 52.4095], [-1.2050, 52.4095], [-1.2050, 52.4040]], [[-1.2010, 52.4060], [-1.2010, 52.4075], [-1.1990, 52.4075], [-1.1990, 52.4060], [-1.2010, 52.4060]]] } },
    { type: 'Feature', properties: { name: 'Wood', use: 'woodland', owner: 'Parish' }, geometry: { type: 'MultiPolygon', coordinates: [[[[-1.1940, 52.4060], [-1.1880, 52.4060], [-1.1870, 52.4120], [-1.1940, 52.4130], [-1.1940, 52.4060]]], [[[-1.1860, 52.4140], [-1.1830, 52.4140], [-1.1830, 52.4160], [-1.1860, 52.4160], [-1.1860, 52.4140]]]] } },
    { type: 'Feature', properties: { name: 'Brook', use: 'stream', owner: '' }, geometry: { type: 'LineString', coordinates: [[-1.2080, 52.4170], [-1.2040, 52.4160], [-1.1990, 52.4165], [-1.1945, 52.4150], [-1.1900, 52.4135], [-1.1840, 52.4170]] } },
    { type: 'Feature', properties: { name: 'Gate', use: 'access', owner: 'Example farm' }, geometry: { type: 'Point', coordinates: [-1.2000, 52.4097] } },
    { type: 'Feature', properties: { name: 'Well', use: 'water', owner: 'Example farm' }, geometry: { type: 'Point', coordinates: [-1.2030, 52.4125] } },
  ],
});
