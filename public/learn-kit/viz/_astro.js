// Shared helpers for the astronomy figures (astro-*): a small bright-star list with a few constellation lines, sky
// coordinate maths (equatorial to a 3D unit vector, horizon altitude/azimuth) and the 3D sphere grid drawing.
import { text } from '../kit.js';

const D = Math.PI / 180;
// [name, RA hours, Dec degrees, apparent magnitude]
export const STARS = [
  ['Sirius', 6.75, -16.72, -1.46], ['Canopus', 6.40, -52.70, -0.74], ['Arcturus', 14.26, 19.18, -0.05], ['Vega', 18.62, 38.78, 0.03],
  ['Capella', 5.28, 46.0, 0.08], ['Rigel', 5.24, -8.2, 0.13], ['Procyon', 7.65, 5.22, 0.34], ['Betelgeuse', 5.92, 7.41, 0.5],
  ['Altair', 19.85, 8.87, 0.77], ['Aldebaran', 4.6, 16.51, 0.85], ['Antares', 16.49, -26.43, 1.06], ['Spica', 13.42, -11.16, 0.97],
  ['Pollux', 7.76, 28.03, 1.14], ['Fomalhaut', 22.96, -29.62, 1.16], ['Deneb', 20.69, 45.28, 1.25], ['Regulus', 10.14, 11.97, 1.36],
  ['Polaris', 2.53, 89.26, 1.98], ['Acrux', 12.44, -63.1, 0.76], ['Rigil Kent.', 14.66, -60.83, -0.01], ['Achernar', 1.63, -57.24, 0.46],
  ['Dubhe', 11.06, 61.75, 1.8], ['Merak', 11.03, 56.38, 2.37], ['Phecda', 11.9, 53.69, 2.44], ['Megrez', 12.26, 57.03, 3.3],
  ['Alioth', 12.9, 55.96, 1.76], ['Mizar', 13.4, 54.93, 2.2], ['Alkaid', 13.79, 49.31, 1.86],
  ['Mintaka', 5.53, -0.3, 2.2], ['Alnilam', 5.6, -1.2, 1.7], ['Alnitak', 5.68, -1.94, 1.77], ['Saiph', 5.8, -9.67, 2.1], ['Bellatrix', 5.42, 6.35, 1.6],
  ['Schedar', 0.68, 56.54, 2.24], ['Caph', 0.15, 59.15, 2.27], ['Gamma Cas', 0.945, 60.72, 2.47], ['Ruchbah', 1.43, 60.24, 2.68], ['Segin', 1.91, 63.67, 3.35],
  ['Mimosa', 12.79, -59.69, 1.25], ['Gacrux', 12.52, -57.11, 1.64], ['Delta Cru', 12.25, -58.75, 2.8], ['Hadar', 14.06, -60.37, 0.61],
];
const ix = (n) => STARS.findIndex((s) => s[0] === n);
// constellation line segments by star name
export const LINES = [
  ['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'], ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'],
  ['Caph', 'Schedar'], ['Schedar', 'Gamma Cas'], ['Gamma Cas', 'Ruchbah'], ['Ruchbah', 'Segin'],
  ['Betelgeuse', 'Bellatrix'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'], ['Bellatrix', 'Mintaka'], ['Betelgeuse', 'Alnitak'], ['Alnitak', 'Saiph'], ['Mintaka', 'Rigel'],
  ['Acrux', 'Gacrux'], ['Mimosa', 'Delta Cru'],
].map(([a, b]) => [ix(a), ix(b)]);

/** Unit vector for RA (hours), Dec (degrees): x to the equinox, y to the north pole, z a quarter turn east of x. */
export const eq = (raH, decD) => { const a = raH * 15 * D, d = decD * D; return [Math.cos(d) * Math.cos(a), Math.sin(d), -Math.cos(d) * Math.sin(a)]; };
/** Altitude and azimuth (degrees, azimuth from north through east) of RA h, Dec d for latitude lat and local sidereal time lst (hours). */
export function altaz(raH, decD, lat, lst) {
  const H = (lst - raH) * 15 * D, d = decD * D, f = lat * D;
  const sa = Math.sin(d) * Math.sin(f) + Math.cos(d) * Math.cos(f) * Math.cos(H);
  const alt = Math.asin(sa);
  const az = Math.atan2(-Math.cos(d) * Math.sin(H), Math.sin(d) * Math.cos(f) - Math.cos(d) * Math.sin(f) * Math.cos(H));
  return [alt / D, ((az / D) + 360) % 360];
}
/** A circle of unit vectors about axis a (unit) at angular radius rad (radians), as a polyline. */
export function smallCircle(a, rad, n = 72) {
  const t = Math.abs(a[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let u = [a[1] * t[2] - a[2] * t[1], a[2] * t[0] - a[0] * t[2], a[0] * t[1] - a[1] * t[0]]; const l = Math.hypot(...u); u = u.map((v) => v / l);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  return Array.from({ length: n + 1 }, (_, i) => { const th = (i / n) * 2 * Math.PI, c = Math.cos(rad), s = Math.sin(rad); return [0, 1, 2].map((k) => a[k] * c + s * (u[k] * Math.cos(th) + v[k] * Math.sin(th))); });
}
/** Rotate vector p about y (the polar axis) by a radians (the sky turning). */
export const spinY = ([x, y, z], a) => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
/** Rotate about the x axis (used for the ecliptic tilt). */
export const tiltX = ([x, y, z], a) => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
export const label = (ctx, P, p, s, color, size = 10, dx = 4, dy = -6) => { const q = P(p); text(ctx, s, q[0] + dx, q[1] + dy, { color, size, halo: undefined }); return q; };
