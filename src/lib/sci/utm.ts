// UTM, MGRS and latitude/longitude conversions, and distances on the ellipsoid. No DOM.
// Transverse Mercator by the Krüger series to sixth order in n (Karney 2011, "Transverse Mercator with an accuracy
// of a few nanometres"): better than a millimetre anywhere within a few thousand kilometres of the central meridian.
// MGRS 100 km square letters follow the WGS84 ("AA") lettering. Distances by Vincenty's inverse formula (1975).
// Angles in degrees, lengths in metres.

export type Ellipsoid = { id: string; name: string; a: number; f: number };
export const ELLIPSOIDS: Ellipsoid[] = [
  { id: 'wgs84', name: 'WGS 84', a: 6378137, f: 1 / 298.257223563 },
  { id: 'grs80', name: 'GRS 1980 (NAD83, ETRS89, GDA)', a: 6378137, f: 1 / 298.257222101 },
  { id: 'intl', name: 'International 1924 (ED50)', a: 6378388, f: 1 / 297 },
  { id: 'clrk66', name: 'Clarke 1866 (NAD27)', a: 6378206.4, f: 1 - 6356583.8 / 6378206.4 },
];
export const WGS84 = ELLIPSOIDS[0];
export const K0 = 0.9996, FALSE_E = 500000, FALSE_N_SOUTH = 10000000;
const D = Math.PI / 180;

type Series = { A: number; alpha: number[]; beta: number[]; e: number };
const cache = new Map<string, Series>();
function series(ell: Ellipsoid): Series {
  const key = `${ell.a},${ell.f}`;
  let s = cache.get(key);
  if (s) return s;
  const f = ell.f, n = f / (2 - f), n2 = n * n, n3 = n2 * n, n4 = n3 * n, n5 = n4 * n, n6 = n5 * n;
  const A = (ell.a / (1 + n)) * (1 + n2 / 4 + n4 / 64 + n6 / 256);
  const alpha = [0,
    n / 2 - (2 / 3) * n2 + (5 / 16) * n3 + (41 / 180) * n4 - (127 / 288) * n5 + (7891 / 37800) * n6,
    (13 / 48) * n2 - (3 / 5) * n3 + (557 / 1440) * n4 + (281 / 630) * n5 - (1983433 / 1935360) * n6,
    (61 / 240) * n3 - (103 / 140) * n4 + (15061 / 26880) * n5 + (167603 / 181440) * n6,
    (49561 / 161280) * n4 - (179 / 168) * n5 + (6601661 / 7257600) * n6,
    (34729 / 80640) * n5 - (3418889 / 1995840) * n6,
    (212378941 / 319334400) * n6];
  const beta = [0,
    n / 2 - (2 / 3) * n2 + (37 / 96) * n3 - (1 / 360) * n4 - (81 / 512) * n5 + (96199 / 604800) * n6,
    (1 / 48) * n2 + (1 / 15) * n3 - (437 / 1440) * n4 + (46 / 105) * n5 - (1118711 / 3870720) * n6,
    (17 / 480) * n3 - (37 / 840) * n4 - (209 / 4480) * n5 + (5569 / 90720) * n6,
    (4397 / 161280) * n4 - (11 / 504) * n5 - (830251 / 7257600) * n6,
    (4583 / 161280) * n5 - (108847 / 3991680) * n6,
    (20648693 / 638668800) * n6];
  s = { A, alpha, beta, e: Math.sqrt(f * (2 - f)) };
  cache.set(key, s);
  return s;
}

/**
 * Transverse Mercator forward: x east and y north of the central meridian lon0 at the equator (no false origin),
 * with the grid convergence γ (degrees, angle from true north to grid north, clockwise positive) and point scale k.
 */
export function tmForward(lat: number, lon: number, lon0: number, ell: Ellipsoid = WGS84, k0 = K0) {
  const { A, alpha, e } = series(ell);
  const phi = lat * D, lam = (((lon - lon0 + 540) % 360) - 180) * D;
  const cl = Math.cos(lam), sl = Math.sin(lam), tl = Math.tan(lam);
  const tau = Math.tan(phi), sig = Math.sinh(e * Math.atanh((e * tau) / Math.sqrt(1 + tau * tau)));
  const taup = tau * Math.sqrt(1 + sig * sig) - sig * Math.sqrt(1 + tau * tau);
  const xip = Math.atan2(taup, cl), etap = Math.asinh(sl / Math.sqrt(taup * taup + cl * cl));
  let xi = xip, eta = etap, p = 1, q = 0;
  for (let j = 1; j <= 6; j++) {
    const c = Math.cos(2 * j * xip), s = Math.sin(2 * j * xip), ch = Math.cosh(2 * j * etap), sh = Math.sinh(2 * j * etap);
    xi += alpha[j] * s * ch; eta += alpha[j] * c * sh;
    p += 2 * j * alpha[j] * c * ch; q += 2 * j * alpha[j] * s * sh;
  }
  const x = k0 * A * eta, y = k0 * A * xi;
  const g1 = Math.atan((taup / Math.sqrt(1 + taup * taup)) * tl), g2 = Math.atan2(q, p);
  const k1 = (Math.sqrt(1 - e * e * Math.sin(phi) ** 2) * Math.sqrt(1 + tau * tau)) / Math.sqrt(taup * taup + cl * cl);
  const k2 = (A / ell.a) * Math.sqrt(p * p + q * q);
  return { x, y, convergence: (g1 + g2) / D, scale: k0 * k1 * k2 };
}

/** Transverse Mercator inverse (x, y relative to the central meridian and the equator, no false origin). */
export function tmInverse(x: number, y: number, lon0: number, ell: Ellipsoid = WGS84, k0 = K0) {
  const { A, beta, e } = series(ell);
  const xi = y / (k0 * A), eta = x / (k0 * A);
  let xip = xi, etap = eta, p = 1, q = 0;
  for (let j = 1; j <= 6; j++) {
    const c = Math.cos(2 * j * xi), s = Math.sin(2 * j * xi), ch = Math.cosh(2 * j * eta), sh = Math.sinh(2 * j * eta);
    xip -= beta[j] * s * ch; etap -= beta[j] * c * sh;
    p -= 2 * j * beta[j] * c * ch; q -= 2 * j * beta[j] * s * sh;
  }
  const shp = Math.sinh(etap), sxp = Math.sin(xip), cxp = Math.cos(xip);
  const taup = sxp / Math.sqrt(shp * shp + cxp * cxp);
  let tau = taup;
  for (let it = 0; it < 20; it++) {
    const sig = Math.sinh(e * Math.atanh((e * tau) / Math.sqrt(1 + tau * tau)));
    const ti = tau * Math.sqrt(1 + sig * sig) - sig * Math.sqrt(1 + tau * tau);
    const d = ((taup - ti) / Math.sqrt(1 + ti * ti)) * ((1 + (1 - e * e) * tau * tau) / ((1 - e * e) * Math.sqrt(1 + tau * tau)));
    tau += d;
    if (Math.abs(d) < 1e-14) break;
  }
  const phi = Math.atan(tau), lam = Math.atan2(shp, cxp);
  const g1 = Math.atan(Math.tan(xip) * Math.tanh(etap)), g2 = Math.atan2(q, p);
  const k1 = (Math.sqrt(1 - e * e * Math.sin(phi) ** 2) * Math.sqrt(1 + tau * tau)) * Math.sqrt(shp * shp + cxp * cxp);
  const k2 = (A / ell.a) / Math.sqrt(p * p + q * q);
  let lon = lon0 + lam / D;
  lon = ((lon + 540) % 360) - 180;
  return { lat: phi / D, lon, convergence: (g1 - g2) / D, scale: k0 * k1 * k2 };
}

export const BANDS = 'CDEFGHJKLMNPQRSTUVWX';
/** Latitude band letter (C to X, 8° each, X is 12°), or '' outside 80° S to 84° N. */
export function bandLetter(lat: number) {
  if (!(lat >= -80 && lat <= 84)) return '';
  return BANDS[Math.min(19, Math.floor((lat + 80) / 8))];
}
/** Southern and northern edges of a latitude band. */
export function bandRange(letter: string): [number, number] {
  const i = BANDS.indexOf(letter.toUpperCase());
  return [-80 + 8 * i, i === 19 ? 84 : -72 + 8 * i];
}

/** The standard UTM zone (1 to 60) with the Norway (32V) and Svalbard (31X to 37X) exceptions. */
export function utmZone(lat: number, lon: number) {
  const L = ((lon + 540) % 360) - 180;
  let z = Math.floor((L + 180) / 6) + 1;
  if (z > 60) z = 60;
  if (lat >= 56 && lat < 64 && L >= 3 && L < 12) z = 32;
  if (lat >= 72 && lat <= 84 && L >= 0 && L < 42) z = L < 9 ? 31 : L < 21 ? 33 : L < 33 ? 35 : 37;
  return z;
}
export const centralMeridian = (zone: number) => zone * 6 - 183;

export type Utm = { zone: number; hemi: 'N' | 'S'; band: string; easting: number; northing: number; convergence: number; scale: number; offCentre: number };

/** Latitude and longitude to UTM. A zone may be forced (for example to keep a project in one zone). */
export function toUtm(lat: number, lon: number, o: { zone?: number; ell?: Ellipsoid } = {}): Utm {
  if (!(lat >= -80 && lat <= 84)) throw new Error('UTM covers 80° S to 84° N. Nearer the poles the Universal Polar Stereographic (UPS) grid is used, which this tool does not convert.');
  const zone = o.zone || utmZone(lat, lon), lon0 = centralMeridian(zone);
  const off = ((lon - lon0 + 540) % 360) - 180;
  if (Math.abs(off) > 15) throw new Error(`The point is ${Math.abs(off).toFixed(1)}° of longitude from the centre of zone ${zone}; choose a nearer zone (at most 15° away).`);
  const t = tmForward(lat, lon, lon0, o.ell ?? WGS84);
  const hemi = lat < 0 ? 'S' : 'N';
  return { zone, hemi, band: bandLetter(lat), easting: t.x + FALSE_E, northing: t.y + (hemi === 'S' ? FALSE_N_SOUTH : 0), convergence: t.convergence, scale: t.scale, offCentre: off };
}

/** UTM to latitude and longitude. */
export function fromUtm(zone: number, hemi: 'N' | 'S', easting: number, northing: number, ell: Ellipsoid = WGS84) {
  if (!(zone >= 1 && zone <= 60 && Number.isInteger(zone))) throw new Error('The UTM zone must be a whole number from 1 to 60.');
  if (!(easting > 0 && easting < 1e6)) throw new Error('A UTM easting lies between 0 and 1,000,000 m (500,000 m is the zone centre).');
  if (!(northing >= 0 && northing <= 1e7)) throw new Error('A UTM northing lies between 0 and 10,000,000 m.');
  return tmInverse(easting - FALSE_E, northing - (hemi === 'S' ? FALSE_N_SOUTH : 0), centralMeridian(zone), ell);
}

// ---------- MGRS ----------
const COLS = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'];
const ROWS = 'ABCDEFGHJKLMNPQRSTUV';
export type MgrsParts = { zone: number; band: string; sq: string; e: string; n: string };

/** MGRS reference for a point (standard zone, WGS84 lettering). digits 0 to 5 per axis (100 km to 1 m); truncated, not rounded. */
export function toMgrsParts(lat: number, lon: number, digits = 5, ell: Ellipsoid = WGS84): MgrsParts {
  const u = toUtm(lat, lon, { ell });
  let E = u.easting, N = u.northing;
  // Round to the millimetre first, so 391234.9998 m counts as 391235 m, then truncate to the precision.
  E = Math.round(E * 1e3) / 1e3; N = Math.round(N * 1e3) / 1e3;
  const col = Math.floor(E / 1e5), row = Math.floor(N / 1e5) % 20;
  const sq = COLS[(u.zone - 1) % 3][col - 1] + ROWS[(row + (u.zone % 2 === 0 ? 5 : 0)) % 20];
  const div = 10 ** (5 - digits);
  const pad = (v: number) => (digits ? String(Math.floor((v % 1e5) / div)).padStart(digits, '0') : '');
  return { zone: u.zone, band: u.band, sq, e: pad(E), n: pad(N) };
}
export function toMgrs(lat: number, lon: number, digits = 5, spaced = true, ell: Ellipsoid = WGS84) {
  const m = toMgrsParts(lat, lon, digits, ell);
  return spaced ? [`${m.zone}${m.band}`, m.sq, m.e, m.n].filter(Boolean).join(' ') : `${m.zone}${m.band}${m.sq}${m.e}${m.n}`;
}

/** Reads an MGRS reference: the south-west corner of the square it names, its size, and the centre. */
export function parseMgrs(s: string, ell: Ellipsoid = WGS84) {
  const m = s.trim().toUpperCase().match(/^(\d{1,2})\s*([C-HJ-NP-X])\s*([A-HJ-NP-Z])\s*([A-HJ-NP-V])\s*(\d*)\s*(\d*)$/);
  if (!m) return null;
  const zone = Number(m[1]), band = m[2];
  if (zone < 1 || zone > 60) throw new Error('The MGRS zone must be from 1 to 60.');
  let digs = m[5] + m[6];
  if (m[6] && m[5].length !== m[6].length) throw new Error('The MGRS easting and northing must have the same number of digits.');
  if (digs.length % 2 || digs.length > 10) throw new Error('An MGRS reference has an even number of digits after the square letters (0 to 10).');
  const k = digs.length / 2, size = 10 ** (5 - k);
  const colI = COLS[(zone - 1) % 3].indexOf(m[3]);
  if (colI < 0) throw new Error(`The square letter ${m[3]} is not used as a column in zone ${zone}.`);
  const rowI = (ROWS.indexOf(m[4]) - (zone % 2 === 0 ? 5 : 0) + 20) % 20;
  const e100 = (colI + 1) * 1e5, n100 = rowI * 1e5;
  const eIn = k ? Number(digs.slice(0, k)) * size : 0, nIn = k ? Number(digs.slice(k)) * size : 0;
  // Which 2,000 km cycle: the first northing at or above the band's southern edge (at the central meridian).
  const [south] = bandRange(band);
  const hemi: 'N' | 'S' = band < 'N' ? 'S' : 'N';
  const nBand = Math.floor(toUtm(south, centralMeridian(zone), { zone, ell }).northing / 1e5) * 1e5;
  let n2M = 0;
  while (n2M + n100 + nIn < nBand - 1e5) n2M += 2e6;
  const E = e100 + eIn, N = n2M + n100 + nIn;
  const sw = fromUtm(zone, hemi, E, Math.max(N, 0.001), ell);
  const c = fromUtm(zone, hemi, E + size / 2, N + size / 2, ell);
  return { zone, band, sq: m[3] + m[4], hemi, easting: E, northing: N, size, digits: k, sw, centre: c };
}

// ---------- Latitude and longitude text ----------
/** Reads latitude and longitude written as decimal degrees, degrees and decimal minutes, or degrees minutes seconds. */
export function parseLatLon(s: string): { lat: number; lon: number } {
  const t = s.toUpperCase().replace(/[−–]/g, '-')
    .replace(/[°º˚]|\bDEG\b/g, ' ').replace(/[′’‘´`']|\bMIN\b/g, ' ').replace(/[″”“"]|''|\bSEC\b/g, ' ')
    .replace(/\b(LAT|LATITUDE|LON|LONG|LNG|LONGITUDE)\b\s*[:=]?/g, ' ').replace(/(\d)\s*:\s*(?=\d)/g, '$1 ')
    .replace(/\bNORTH\b/g, 'N').replace(/\bSOUTH\b/g, 'S').replace(/\bEAST\b/g, 'E').replace(/\bWEST\b/g, 'W');
  if (/[^\d\s.,;+\-NSEW/]/.test(t)) throw new Error(`Could not read "${s.trim()}" as latitude and longitude.`);
  const toks = t.match(/[NSEW]|[-+]?\d+(?:\.\d+)?|[,;/]/g) ?? [];
  type G = { nums: string[]; hemi?: string; sep?: boolean };
  const groups: G[] = [];
  const hasHemi = toks.some((x) => /^[NSEW]$/.test(x));
  if (hasHemi) {
    const prefix = /^[NSEW]$/.test(toks[0]);
    let cur: G = { nums: [] };
    for (const x of toks) {
      if (/^[,;/]$/.test(x)) continue;
      if (/^[NSEW]$/.test(x)) {
        if (prefix) { if (cur.nums.length || cur.hemi) groups.push(cur); cur = { nums: [], hemi: x }; }
        else { cur.hemi = x; groups.push(cur); cur = { nums: [] }; }
      } else cur.nums.push(x);
    }
    if (cur.nums.length || cur.hemi) groups.push(cur);
  } else {
    const parts = toks.join(' ').split(/\s*[,;/]\s*/).filter((p) => p.trim());
    if (parts.length === 2) for (const p of parts) groups.push({ nums: p.trim().split(/\s+/) });
    else {
      const nums = toks.filter((x) => !/^[,;/]$/.test(x));
      if (nums.length % 2) throw new Error(`Could not split "${s.trim()}" into latitude and longitude; put a comma between them.`);
      groups.push({ nums: nums.slice(0, nums.length / 2) }, { nums: nums.slice(nums.length / 2) });
    }
  }
  if (groups.length !== 2) throw new Error(`Could not read "${s.trim()}" as one latitude and one longitude.`);
  const val = (g: G) => {
    if (!g.nums.length || g.nums.length > 3) throw new Error('Write each coordinate as degrees, degrees and minutes, or degrees, minutes and seconds.');
    const v = g.nums.map(Number);
    const neg = g.nums[0].startsWith('-');
    for (let i = 1; i < v.length; i++) {
      if (!(v[i] >= 0 && v[i] < 60)) throw new Error(`Minutes and seconds must be from 0 to under 60 (found ${g.nums[i]}).`);
      if (g.nums[i].startsWith('-')) throw new Error('Only the degrees may carry a minus sign.');
    }
    for (let i = 0; i < v.length - 1; i++) if (g.nums[i].includes('.')) throw new Error('Only the last part (degrees, minutes or seconds) may have decimals.');
    let d = Math.abs(v[0]) + (v[1] ?? 0) / 60 + (v[2] ?? 0) / 3600;
    if (neg) d = -d;
    if (g.hemi === 'S' || g.hemi === 'W') { if (neg) throw new Error('Use either a minus sign or S/W, not both.'); d = -d; }
    return d;
  };
  let [a, b] = groups;
  const isLon = (g: G) => g.hemi === 'E' || g.hemi === 'W';
  if (isLon(a) && !isLon(b)) [a, b] = [b, a];
  if ((a.hemi && isLon(a)) || (b.hemi && !isLon(b))) throw new Error('Give one latitude (N or S) and one longitude (E or W).');
  const lat = val(a), lon = val(b);
  if (!(Math.abs(lat) <= 90)) throw new Error(`Latitude ${+lat.toFixed(6)} is beyond ±90°. Write latitude first, then longitude.`);
  if (!(Math.abs(lon) <= 180)) throw new Error(`Longitude ${+lon.toFixed(6)} is beyond ±180°.`);
  return { lat, lon };
}

/** Degrees, minutes and seconds, e.g. 51°28′40.12″ N. */
export function fmtDms(v: number, isLat: boolean, dec = 2) {
  const scale = 10 ** dec;
  let tot = Math.round(Math.abs(v) * 3600 * scale);
  const h = isLat ? (v < 0 && tot ? 'S' : 'N') : v < 0 && tot ? 'W' : 'E';
  const d = Math.floor(tot / (3600 * scale)); tot -= d * 3600 * scale;
  const m = Math.floor(tot / (60 * scale)); tot -= m * 60 * scale;
  const sec = (tot / scale).toFixed(dec);
  return `${d}°${String(m).padStart(2, '0')}′${sec.padStart(dec ? 3 + dec : 2, '0')}″ ${h}`;
}
/** Degrees and decimal minutes, e.g. 51°28.6687′ N. */
export function fmtDdm(v: number, isLat: boolean, dec = 4) {
  const scale = 10 ** dec;
  let tot = Math.round(Math.abs(v) * 60 * scale);
  const h = isLat ? (v < 0 && tot ? 'S' : 'N') : v < 0 && tot ? 'W' : 'E';
  const d = Math.floor(tot / (60 * scale)); tot -= d * 60 * scale;
  return `${d}°${(tot / scale).toFixed(dec).padStart(3 + dec, '0')}′ ${h}`;
}

// ---------- Any point ----------
export type ParsedPoint = { lat: number; lon: number; from: 'latlon' | 'utm' | 'mgrs'; note?: string; givenZone?: number; mgrsSize?: number };

/** Reads one point written as latitude/longitude, UTM ("33U 391234 5821234") or MGRS ("33UUP9123421234"). */
export function parsePoint(s: string, ell: Ellipsoid = WGS84): ParsedPoint {
  const t = s.trim();
  if (!t) throw new Error('Type a position.');
  const mg = parseMgrs(t, ell);
  if (mg) {
    const k = mg.digits, sizeTxt = mg.size >= 1000 ? `${mg.size / 1000} km` : `${mg.size} m`;
    const p: ParsedPoint = { lat: mg.centre.lat, lon: mg.centre.lon, from: 'mgrs', givenZone: mg.zone, mgrsSize: mg.size };
    p.note = `This MGRS reference (${k} digit${k === 1 ? '' : 's'} each way) names a ${sizeTxt} square; the position shown is the centre of that square.`;
    const b = bandRange(mg.band);
    if (p.lat < b[0] - 0.5 || p.lat > b[1] + 0.5) throw new Error(`The square ${mg.zone}${mg.band} ${mg.sq} does not fall in latitude band ${mg.band}; check the letters.`);
    return p;
  }
  const u = t.replace(/[−–]/g, '-').match(/^(?:zone\s*)?(\d{1,2})\s*([A-Za-z]|north|south)?\s*[,;\s]\s*(?:E\s*)?(\d+(?:\.\d+)?)\s*(?:m\b\s*)?(?:E\b|mE\b)?\s*[,;\s]\s*(?:N\s*)?(\d+(?:\.\d+)?)\s*(?:m\b\s*)?(?:N\b|mN\b)?$/i);
  if (u && Number(u[3]) >= 1000) {
    const zone = Number(u[1]), E = Number(u[3]), N = Number(u[4]);
    const L = (u[2] ?? '').toUpperCase();
    if (!L) throw new Error(`Add the latitude band letter or N/S after the zone, e.g. "${zone}N ${u[3]} ${u[4]}", so the hemisphere is known.`);
    let hemi: 'N' | 'S', note: string | undefined;
    if (L === 'NORTH' || L === 'SOUTH') hemi = L === 'NORTH' ? 'N' : 'S';
    else if (!BANDS.includes(L)) throw new Error(`"${L}" is not a latitude band letter (C to X, without I and O) or N/S.`);
    else if (L === 'S') {
      // S is band S (32° N to 40° N) or "south"; take whichever fits the northing.
      const north = fromUtm(zone, 'N', E, N, ell);
      if (north.lat >= 31.5 && north.lat <= 40.5) { hemi = 'N'; note = 'Read "S" as latitude band S (32° N to 40° N). For the southern hemisphere write "south".'; }
      else { hemi = 'S'; note = 'Read "S" as the southern hemisphere (the northing does not fit latitude band S, 32° N to 40° N).'; }
    } else hemi = L >= 'N' ? 'N' : 'S';
    const ll = fromUtm(zone, hemi, E, N, ell);
    if (L.length === 1 && L !== 'N' && L !== 'S') {
      const b = bandRange(L);
      if (ll.lat < b[0] - 0.5 || ll.lat > b[1] + 0.5) note = `The band letter ${L} (${b[0]}° to ${b[1]}°) does not match the latitude ${ll.lat.toFixed(4)}°: check the zone letter.`;
    }
    const std = utmZone(ll.lat, ll.lon);
    if (std !== zone) note = (note ? note + ' ' : '') + `By the standard rules this point lies in zone ${std}; it was given in zone ${zone}.`;
    return { lat: ll.lat, lon: ll.lon, from: 'utm', note, givenZone: zone };
  }
  return { ...parseLatLon(t), from: 'latlon' };
}

// ---------- Distance and bearing on the ellipsoid ----------
/**
 * Vincenty's inverse formula: geodesic distance s and the forward azimuths at both ends (degrees from true north).
 * converged is false for nearly antipodal points, where the method fails.
 */
export function inverse(lat1: number, lon1: number, lat2: number, lon2: number, ell: Ellipsoid = WGS84) {
  const { a, f } = ell, b = a * (1 - f);
  const L = ((((lon2 - lon1) + 540) % 360) - 180) * D;
  const U1 = Math.atan((1 - f) * Math.tan(lat1 * D)), U2 = Math.atan((1 - f) * Math.tan(lat2 * D));
  const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
  let lam = L, sinS = 0, cosS = 0, sig = 0, cos2a = 0, cos2sm = 0, sl = 0, cl = 0;
  for (let it = 0; it < 500; it++) {
    sl = Math.sin(lam); cl = Math.cos(lam);
    sinS = Math.sqrt((cU2 * sl) ** 2 + (cU1 * sU2 - sU1 * cU2 * cl) ** 2);
    if (sinS === 0) return { s: 0, az1: 0, az2: 0, converged: true };
    cosS = sU1 * sU2 + cU1 * cU2 * cl; sig = Math.atan2(sinS, cosS);
    const sina = (cU1 * cU2 * sl) / sinS; cos2a = 1 - sina * sina;
    cos2sm = cos2a !== 0 ? cosS - (2 * sU1 * sU2) / cos2a : 0;
    const C = (f / 16) * cos2a * (4 + f * (4 - 3 * cos2a));
    const prev = lam;
    lam = L + (1 - C) * f * sina * (sig + C * sinS * (cos2sm + C * cosS * (-1 + 2 * cos2sm * cos2sm)));
    if (Math.abs(lam) > Math.PI + 1e-9) break;
    if (Math.abs(lam - prev) < 1e-13) {
      const u2 = (cos2a * (a * a - b * b)) / (b * b);
      const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))), B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
      const dS = B * sinS * (cos2sm + (B / 4) * (cosS * (-1 + 2 * cos2sm * cos2sm) - (B / 6) * cos2sm * (-3 + 4 * sinS * sinS) * (-3 + 4 * cos2sm * cos2sm)));
      const az1 = (Math.atan2(cU2 * sl, cU1 * sU2 - sU1 * cU2 * cl) / D + 360) % 360;
      const az2 = (Math.atan2(cU1 * sl, -sU1 * cU2 + cU1 * sU2 * cl) / D + 360) % 360;
      return { s: b * A * (sig - dS), az1, az2, converged: true };
    }
  }
  return { s: NaN, az1: NaN, az2: NaN, converged: false };
}

/** Vincenty's direct formula: the point reached from (lat, lon) going s metres on azimuth az (degrees). */
export function direct(lat: number, lon: number, az: number, s: number, ell: Ellipsoid = WGS84) {
  const { a, f } = ell, b = a * (1 - f);
  const a1 = az * D, sa1 = Math.sin(a1), ca1 = Math.cos(a1);
  const tU1 = (1 - f) * Math.tan(lat * D), cU1 = 1 / Math.sqrt(1 + tU1 * tU1), sU1 = tU1 * cU1;
  const s1 = Math.atan2(tU1, ca1), sina = cU1 * sa1, cos2a = 1 - sina * sina;
  const u2 = (cos2a * (a * a - b * b)) / (b * b);
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))), B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  let sig = s / (b * A), sigP: number, c2sm = 0, ss = 0, cs = 0;
  do {
    c2sm = Math.cos(2 * s1 + sig); ss = Math.sin(sig); cs = Math.cos(sig);
    const dS = B * ss * (c2sm + (B / 4) * (cs * (-1 + 2 * c2sm * c2sm) - (B / 6) * c2sm * (-3 + 4 * ss * ss) * (-3 + 4 * c2sm * c2sm)));
    sigP = sig; sig = s / (b * A) + dS;
  } while (Math.abs(sig - sigP) > 1e-14);
  ss = Math.sin(sig); cs = Math.cos(sig); c2sm = Math.cos(2 * s1 + sig);
  const x = sU1 * ss - cU1 * cs * ca1;
  const phi2 = Math.atan2(sU1 * cs + cU1 * ss * ca1, (1 - f) * Math.sqrt(sina * sina + x * x));
  const lamb = Math.atan2(ss * sa1, cU1 * cs - sU1 * ss * ca1);
  const C = (f / 16) * cos2a * (4 + f * (4 - 3 * cos2a));
  const L = lamb - (1 - C) * f * sina * (sig + C * ss * (c2sm + C * cs * (-1 + 2 * c2sm * c2sm)));
  return { lat: phi2 / D, lon: ((lon + L / D + 540) % 360) - 180, az2: (Math.atan2(sina, -x) / D + 360) % 360 };
}

// ---------- A list of points ----------
export type BatchRow = { line: number; label: string; text: string; p?: ParsedPoint; error?: string };
const LAT_H = /^(lat|latitude|y|lat_dd|latitude_dd)$/i, LON_H = /^(lon|long|lng|longitude|x|lon_dd|longitude_dd)$/i;
const NAME_H = /^(name|label|id|site|point|station|code|description)$/i;

/**
 * Reads a list of points, one per line. A line may start with a name ("Well 3, 33U 391234 5821234"). A table with
 * latitude and longitude columns (and optionally a name column) is read by its column names.
 */
export function parseBatch(text: string, ell: Ellipsoid = WGS84): BatchRow[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out: BatchRow[] = [];
  const sep = lines.slice(0, 5).some((l) => l.includes('\t')) ? '\t' : null;
  const split = (l: string) => (sep ? l.split('\t') : l.split(/\s*[,;]\s*/)).map((c) => c.trim().replace(/^"(.*)"$/, '$1'));
  const first = lines.find((l) => l.trim()) ?? '';
  const head = split(first);
  const iLat = head.findIndex((h) => LAT_H.test(h)), iLon = head.findIndex((h) => LON_H.test(h)), iName = head.findIndex((h) => NAME_H.test(h));
  const table = iLat >= 0 && iLon >= 0;
  let started = false;
  lines.forEach((raw, k) => {
    const l = raw.trim();
    if (!l || l.startsWith('#')) return;
    if (!started) { started = true; if (table || !/\d/.test(l)) return; }
    const row: BatchRow = { line: k + 1, label: '', text: l };
    try {
      if (table) {
        const c = split(l);
        row.label = iName >= 0 ? c[iName] ?? '' : '';
        row.text = `${c[iLat]}, ${c[iLon]}`;
        row.p = parsePoint(row.text, ell);
      } else {
        const cells = sep ? split(l) : null;
        const tryP = (s: string) => { try { return parsePoint(s, ell); } catch (e) { return e as Error; } };
        let p = tryP(sep ? cells!.join(' ') : l);
        if (p instanceof Error) {
          // A leading name: the first cell, or the words before the first number or zone.
          const m = sep ? [null, cells![0], cells!.slice(1).join(' ')] : l.match(/^(.*?[A-Za-z][^,;\t]*?)\s*[,;\t:]\s*(.+)$/) ?? l.match(/^(\S+(?:\s+\S+)*?)\s+(\d.*|[-+NSEW]\s*\d.*)$/i);
          if (m && m[1] && m[2]) { const p2 = tryP(m[2]); if (!(p2 instanceof Error)) { row.label = m[1].trim(); row.text = m[2].trim(); p = p2; } }
        }
        if (p instanceof Error) throw p;
        row.p = p;
      }
    } catch (e) { row.error = (e as Error).message; }
    out.push(row);
  });
  return out;
}

export const EXAMPLE_BATCH = `name, position
Survey peg 1, 52.20556, 0.11917
Survey peg 2, 52°12'25.0"N 0°07'31.5"E
Peg 3 (UTM), 31U 303931 5788288
Peg 4 (MGRS), 31UCT0432088796
Bergen harbour, 60.3947, 5.3221
Svalbard station, 78.2232 N, 15.6469 E
Sydney (south), 33°51.9' S, 151°12.5' E`;
