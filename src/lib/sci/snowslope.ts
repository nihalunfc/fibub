// Snow and slope helpers: snow water equivalent (SWE) from depth and density, from snow tube weighings or from
// layers; bulk density; ground and roof snow load (a user factor, not a design code); slope angle from map contour
// spacing, from a phone's tilt sensors, or from two GPS points with elevations (Vincenty's inverse on WGS84); and
// the general avalanche starting-angle bands. Not an avalanche or safety forecast. Plain TypeScript, no DOM.
//   SWE (mm) = depth (mm) × ρ_snow / ρ_water          1 mm of SWE = 1 kg/m²
//   load (kN/m²) = SWE (kg/m²) × g / 1000             roof load = factor × ground load
//   slope angle = atan(rise / horizontal run)

export const RHO_W = 1000; // kg/m³, density of water used for SWE
export const G = 9.80665; // m/s², standard gravity
const R = Math.PI / 180;

/** SWE in mm (= kg/m²) from snow depth in cm and bulk density in kg/m³. */
export const sweFromDepth = (depthCm: number, rho: number) => (depthCm * 10 * rho) / RHO_W;

export type Tube = { full: number; empty: number; length: number }; // grams, grams, core length cm
/** One snow tube sample: tube inner diameter in cm, weights in g, core length in cm (the snow depth sampled). */
export function tubeSample(diamCm: number, t: Tube) {
  const area = Math.PI * (diamCm / 200) ** 2; // m²
  const mass = (t.full - t.empty) / 1000; // kg
  const swe = mass / area; // kg/m² = mm
  const rho = t.length > 0 ? mass / (area * (t.length / 100)) : NaN;
  return { mass, area, swe, rho };
}
/** Several tube samples: each sample's SWE and density, and their means (density as total mass over total volume). */
export function tubeSamples(diamCm: number, ts: Tube[]) {
  const each = ts.map((t) => tubeSample(diamCm, t));
  const n = each.length, mean = n ? each.reduce((s, e) => s + e.swe, 0) / n : NaN;
  const sd = n > 1 ? Math.sqrt(each.reduce((s, e) => s + (e.swe - mean) ** 2, 0) / (n - 1)) : NaN;
  const area = n ? each[0].area : NaN, totM = each.reduce((s, e) => s + e.mass, 0), totL = ts.reduce((s, t) => s + t.length, 0) / 100;
  return { each, swe: mean, sd, rho: totM / (area * totL), depth: totL * 100 / (n || 1) };
}

export type Layer = { h: number; rho: number }; // thickness cm, density kg/m³
/** Layers: total depth (cm), SWE (mm) and bulk density (thickness-weighted mean, kg/m³). */
export function layers(ls: Layer[]) {
  const depth = ls.reduce((s, l) => s + l.h, 0), swe = ls.reduce((s, l) => s + sweFromDepth(l.h, l.rho), 0);
  return { depth, swe, rho: depth > 0 ? (swe / (depth * 10)) * RHO_W : NaN };
}

/** Ground snow load in kN/m² from SWE in mm (kg/m²). */
export const groundLoad = (sweMm: number) => (sweMm * G) / 1000;
/** Roof load from a ground load and a user factor (shape, exposure, thermal… all in one number). */
export function roofLoad(ground: number, factor: number, areaM2 = 0) {
  const roof = ground * factor, total = roof * areaM2; // kN
  return { roof, total, tonnes: (total * 1000) / G / 1000, kgm2: (roof * 1000) / G, psf: roof * 20.885434 };
}

/** Slope from map contours: contour interval (m), number of intervals crossed, map distance (mm), map scale 1:N. */
export function slopeFromMap(interval: number, count: number, mapMm: number, scale: number) {
  const rise = interval * count, run = (mapMm / 1000) * scale;
  return { rise, run, deg: Math.atan2(rise, run) / R, grade: (100 * rise) / run };
}
/** Slope from rise and horizontal run (any length unit). */
export const slopeDeg = (rise: number, run: number) => Math.atan2(Math.abs(rise), run) / R;

/** Tilt of a phone lying on the slope from DeviceOrientation β and γ (degrees): the angle between the screen's
 *  normal and the vertical, cos t = cos β cos γ (W3C Z-X'-Y'' angles; α, the compass heading, does not matter).
 *  The downhill direction, measured clockwise from the top edge of the phone, is also returned. */
export function phoneTilt(beta: number, gamma: number) {
  const b = beta * R, g = gamma * R;
  const c = Math.max(-1, Math.min(1, Math.cos(b) * Math.cos(g)));
  let t = Math.acos(c) / R;
  if (t > 90) t = 180 - t; // screen down: same slope
  // gravity in device axes (x right, y up the screen, z out of the screen), up to a sign: (−cos β sin γ, sin β, cos β cos γ)
  const gx = Math.cos(b) * Math.sin(g), gy = -Math.sin(b); // downhill direction in the screen plane
  const dir = ((Math.atan2(gx, gy) / R) + 360) % 360;
  return { tilt: t, downhill: dir };
}

// WGS84
const A = 6378137, F = 1 / 298.257223563, B = A * (1 - F);
/** Vincenty's inverse formula on the WGS84 ellipsoid: distance in metres between two points (degrees). */
export function vincenty(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const L = (lon2 - lon1) * R, U1 = Math.atan((1 - F) * Math.tan(lat1 * R)), U2 = Math.atan((1 - F) * Math.tan(lat2 * R));
  const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
  let lam = L, prev = 0, sS = 0, cS = 0, sig = 0, c2a = 0, c2m = 0;
  for (let i = 0; i < 200; i++) {
    const sl = Math.sin(lam), cl = Math.cos(lam);
    sS = Math.hypot(cU2 * sl, cU1 * sU2 - sU1 * cU2 * cl);
    if (sS === 0) return 0;
    cS = sU1 * sU2 + cU1 * cU2 * cl; sig = Math.atan2(sS, cS);
    const sa = (cU1 * cU2 * sl) / sS; c2a = 1 - sa * sa;
    c2m = c2a !== 0 ? cS - (2 * sU1 * sU2) / c2a : 0;
    const C = (F / 16) * c2a * (4 + F * (4 - 3 * c2a));
    prev = lam;
    lam = L + (1 - C) * F * sa * (sig + C * sS * (c2m + C * cS * (-1 + 2 * c2m * c2m)));
    if (Math.abs(lam - prev) < 1e-13) break;
  }
  const u2 = (c2a * (A * A - B * B)) / (B * B);
  const AA = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const BB = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const ds = BB * sS * (c2m + (BB / 4) * (cS * (-1 + 2 * c2m * c2m) - (BB / 6) * c2m * (-3 + 4 * sS * sS) * (-3 + 4 * c2m * c2m)));
  return B * AA * (sig - ds);
}
/** Slope between two GPS points with elevations (m). */
export function slopeFromGps(p1: { lat: number; lon: number; z: number }, p2: { lat: number; lon: number; z: number }) {
  const run = vincenty(p1.lat, p1.lon, p2.lat, p2.lon), rise = p2.z - p1.z;
  return { run, rise, deg: slopeDeg(rise, run), grade: run > 0 ? (100 * Math.abs(rise)) / run : Infinity, slopeDist: Math.hypot(run, rise) };
}

export type Band = { id: string; from: number; to: number; name: string; text: string };
/** General avalanche-terrain angle bands (general knowledge; not a forecast). */
export const BANDS: Band[] = [
  { id: 'low', from: 0, to: 25, name: 'Under 25°', text: 'Below the usual starting angles. Avalanches seldom start here, but slopes like this can be in the path or runout of steeper slopes above.' },
  { id: 'mid', from: 25, to: 30, name: '25 to 30°', text: 'Just below the common starting band. Slab avalanches can start here in some conditions, and it is often runout terrain.' },
  { id: 'prime', from: 30, to: 45, name: '30 to 45°', text: 'The band where most slab avalanches start (about 30 to 45°, a general fact of avalanche terrain).' },
  { id: 'steep', from: 45, to: 60, name: '45 to 60°', text: 'Steeper than most slab starts: snow often sluffs off in small loose avalanches, but slabs are still possible.' },
  { id: 'cliff', from: 60, to: 90.0001, name: 'Over 60°', text: 'Very steep: snow seldom builds up much, so it sheds often in small amounts, onto the slopes below.' },
];
export const band = (deg: number) => BANDS.find((b) => deg >= b.from && deg < b.to) ?? BANDS[BANDS.length - 1];
