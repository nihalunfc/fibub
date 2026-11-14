// #T952 Cell Signal, "Networks near you": pure helpers shared by the tile builder (scripts/cells/build-tiles.mjs)
// and the page. No DOM. Tower data are OpenCelliD cell records (CC BY-SA 4.0) grouped into ~1 km squares per carrier,
// stored as 1° x 1° tile files under /cells/. The page fetches the tiles for the area and works out everything on
// the device; the exact location never leaves it.

export const BIN = 0.01;          // degrees per square inside a tile (about 1.1 km north-south)
export const TECHS = ['5G', '4G', '3G', '2G'] as const;
// OpenCelliD "radio" values to our columns.
export const radioIndex = (r: string) => ({ NR: 0, LTE: 1, UMTS: 2, CDMA: 2, GSM: 3 } as Record<string, number>)[r?.toUpperCase()] ?? -1;

// Mobile country codes we cover, and which country each belongs to.
export const MCC_COUNTRY: Record<string, 'ca' | 'us' | 'uk' | 'in'> = {
  '302': 'ca', '310': 'us', '311': 'us', '312': 'us', '313': 'us', '314': 'us', '315': 'us', '316': 'us',
  '234': 'uk', '235': 'uk', '404': 'in', '405': 'in', '406': 'in',
};
export const COUNTRY_NAME = { ca: 'Canada', us: 'USA', uk: 'UK', in: 'India' } as const;

// Network names in public MCC-MNC tables are company names ("Bharti Airtel Ltd (Kolkata)"); turn them into the brand
// people know. First match wins; anything else keeps its own name.
const BRANDS: Record<string, [RegExp, string][]> = {
  ca: [[/rogers|fido/i, 'Rogers'], [/bell|virgin/i, 'Bell'], [/telus|koodo/i, 'Telus'], [/freedom|wind|shaw/i, 'Freedom Mobile'], [/vid[eé]otron|fizz/i, 'Vidéotron'], [/sasktel/i, 'SaskTel'], [/eastlink/i, 'Eastlink'], [/tbay/i, 'Tbaytel']],
  us: [[/at&t|at ?and ?t|cingular|cricket/i, 'AT&T'], [/t-?mobile|sprint|metro ?pcs|nextel/i, 'T-Mobile'], [/verizon|cellco|alltel/i, 'Verizon'], [/u\.?s\.? ?cellular|united states cellular/i, 'UScellular (now T-Mobile)'], [/dish|boost/i, 'Boost Mobile']],
  uk: [[/\bee\b|everything everywhere|orange|t-?mobile/i, 'EE'], [/vodafone/i, 'Vodafone'], [/three|hutchison|\bh3g\b/i, 'Three'], [/\bo2\b|telef[oó]nica/i, 'O2']],
  in: [[/airtel|bharti/i, 'Airtel'], [/jio/i, 'Jio'], [/vodafone|idea|\bvi\b/i, 'Vi'], [/bsnl|bharat sanchar/i, 'BSNL'], [/mtnl|mahanagar/i, 'MTNL'], [/reliance/i, 'Reliance (old network)'], [/aircel/i, 'Aircel (closed)'], [/tata|docomo/i, 'Tata Docomo (closed)'], [/telenor|uninor/i, 'Telenor (closed)']],
};
export const brandOf = (country: string, name: string) => {
  for (const [re, b] of BRANDS[country] || []) if (re.test(name)) return b;
  return name.trim() || 'Unknown';
};

export const tileKey = (lat: number, lon: number) => `${Math.floor(lat)}_${Math.floor(lon)}`;

// Distance in km (haversine on a sphere of radius 6371 km; plenty for a few km).
export const km = (a: number, b: number, c: number, d: number) => {
  const r = Math.PI / 180, dl = (c - a) * r, dn = (d - b) * r;
  const h = Math.sin(dl / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dn / 2) ** 2;
  return 12742 * Math.asin(Math.min(1, Math.sqrt(h)));
};

// Every tile a circle of radius rKm around (lat, lon) touches.
export const tilesAround = (lat: number, lon: number, rKm: number) => {
  const dLat = rKm / 111, dLon = rKm / (111 * Math.max(0.05, Math.cos((lat * Math.PI) / 180)));
  const out: string[] = [];
  for (let a = Math.floor(lat - dLat); a <= Math.floor(lat + dLat); a++)
    for (let b = Math.floor(lon - dLon); b <= Math.floor(lon + dLon); b++) out.push(`${a}_${b}`);
  return out;
};

// A tile: rows of [latSteps, lonSteps, op, n5G, n4G, n3G, n2G]; the square's centre is
// tileLat + (latSteps + 0.5) * BIN, tileLon + (lonSteps + 0.5) * BIN.
export type Tile = { v: number; tile: string; rows: number[][] };
export type Op = { name: string; country: string };
export type Near = { op: number; name: string; country: string; cells: number[]; total: number; nearest: number; within1: number; label: string; tone: 'good' | 'warn' | 'bad' }; // nearest: km to the closest 4G/5G cell (or 3G/2G if that is all there is)

export function centres(t: Tile) {
  const [la, lo] = t.tile.split('_').map(Number);
  return t.rows.map((r) => ({ lat: la + (r[0] + 0.5) * BIN, lon: lo + (r[1] + 0.5) * BIN, op: r[2], n: r.slice(3, 7) }));
}

// Likely coverage from how close a carrier's cells are. Rules of thumb for towns and suburbs: 4G/5G cells
// within ~1 km usually give a strong indoor signal, within ~3 km a usable one; in open country a tower can
// reach 10 km or more, in dense cities much less. It is an estimate, not a measurement.
// nearest: the closest 4G/5G cell (km); old: the closest 3G/2G cell.
export function coverageLabel(nearest: number, old = Infinity): { label: string; tone: Near['tone'] } {
  if (!isFinite(nearest) && !isFinite(old)) return { label: 'No cells found', tone: 'bad' };
  if (nearest > 8 && old <= 8) return { label: 'Only old 3G/2G cells nearby', tone: 'warn' };
  if (nearest <= 1) return { label: 'Likely strong', tone: 'good' };
  if (nearest <= 3) return { label: 'Likely good', tone: 'good' };
  if (nearest <= 8) return { label: 'Possible, may be weak indoors', tone: 'warn' };
  return { label: 'Unlikely', tone: 'bad' };
}

export function summarise(tiles: Tile[], ops: Op[], lat: number, lon: number, rKm: number): Near[] {
  const by = new Map<number, Near>(), old = new Map<number, number>();
  for (const t of tiles) for (const c of centres(t)) {
    const d = km(lat, lon, c.lat, c.lon);
    let s = by.get(c.op);
    if (!s) { const o = ops[c.op] || { name: 'Unknown', country: '' }; s = { op: c.op, name: o.name, country: o.country, cells: [0, 0, 0, 0], total: 0, nearest: Infinity, within1: 0, label: '', tone: 'bad' }; by.set(c.op, s); }
    if (c.n[0] + c.n[1] > 0) s.nearest = Math.min(s.nearest, d);
    if (c.n[2] + c.n[3] > 0) old.set(c.op, Math.min(old.get(c.op) ?? Infinity, d));
    if (d <= rKm) { for (let i = 0; i < 4; i++) s.cells[i] += c.n[i]; s.total += c.n[0] + c.n[1] + c.n[2] + c.n[3]; }
    if (d <= 1) s.within1 += c.n[0] + c.n[1] + c.n[2] + c.n[3];
  }
  const out = [...by.values()].filter((s) => s.total > 0 || Math.min(s.nearest, old.get(s.op) ?? Infinity) <= rKm * 2);
  for (const s of out) {
    const o = old.get(s.op) ?? Infinity, l = coverageLabel(s.nearest, o); s.label = l.label; s.tone = l.tone;
    if (!isFinite(s.nearest) || (s.nearest > 8 && o < s.nearest)) s.nearest = o; // shown distance: the cell the label is about
  }
  return out.sort((a, b) => (a.tone === 'good' ? 0 : 1) - (b.tone === 'good' ? 0 : 1) || a.nearest - b.nearest || b.total - a.total);
}
