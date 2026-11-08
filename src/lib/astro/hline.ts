// The 21 cm line of neutral hydrogen: frequency to velocity, the correction to the local standard of rest,
// baseline removal, the terminal (tangent-point) velocity and the Milky Way's rotation curve from it.
import * as A from 'astronomy-engine';

export const F0 = 1420.405751768; // MHz, rest frequency of the hyperfine line
export const C = 299792.458; // km/s
const AU_KM = 149597870.7;

/** Radio-convention velocity (km/s) of a frequency (MHz): positive is moving away. */
export const velRadio = (fMHz: number) => (C * (F0 - fMHz)) / F0;
export const freqRadio = (v: number) => F0 * (1 - v / C);

/** Unit vector (J2000 equatorial) towards galactic l, b in degrees. */
export function galToEq(l: number, b: number) {
  const r = Math.PI / 180, v = new A.Vector(Math.cos(b * r) * Math.cos(l * r), Math.cos(b * r) * Math.sin(l * r), Math.sin(b * r), new A.AstroTime(new Date(Date.UTC(2000, 0, 1, 12))));
  const e = A.RotateVector(A.Rotation_GAL_EQJ(), v), n = Math.hypot(e.x, e.y, e.z);
  return [e.x / n, e.y / n, e.z / n];
}
/** Galactic l, b (degrees) of J2000 RA (hours) and Dec (degrees). */
export function eqToGal(raH: number, dec: number) {
  const r = Math.PI / 180, a = raH * 15 * r, d = dec * r;
  const v = new A.Vector(Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d), new A.AstroTime(new Date(Date.UTC(2000, 0, 1, 12))));
  const g = A.RotateVector(A.Rotation_EQJ_GAL(), v);
  return { l: ((Math.atan2(g.y, g.x) / r) + 360) % 360, b: Math.asin(Math.max(-1, Math.min(1, g.z / Math.hypot(g.x, g.y, g.z)))) / r };
}

/** Standard solar motion: 20 km/s towards RA 18h, Dec +30° (B1900), i.e. RA 18h03m50.2s, Dec +30°00′17″ (J2000). */
const SUN_APEX = { ra: (18 + 3 / 60 + 50.24 / 3600) * 15, dec: 30 + 0 / 60 + 16.8 / 3600, v: 20 };

/** Velocity correction (km/s) to add to a topocentric radial velocity to get the LSR velocity, ignoring Earth's
 *  spin (under 0.5 km/s). Parts: the Earth's orbital motion (barycentric) and the Sun's motion relative to the LSR. */
export function lsrCorrection(l: number, b: number, time: Date) {
  const u = galToEq(l, b), s = A.BaryState(A.Body.Earth, time);
  const vEarth = ((s.vx * u[0] + s.vy * u[1] + s.vz * u[2]) * AU_KM) / 86400;
  const r = Math.PI / 180, a = SUN_APEX.ra * r, d = SUN_APEX.dec * r;
  const vSun = SUN_APEX.v * (Math.cos(d) * Math.cos(a) * u[0] + Math.cos(d) * Math.sin(a) * u[1] + Math.sin(d) * u[2]);
  return { total: vEarth + vSun, earth: vEarth, sun: vSun };
}

/** Least-squares polynomial of `order` through (x, y), with points flagged in `skip` left out. Returns coefficients. */
export function polyfit(x: number[], y: number[], order: number, skip?: boolean[]) {
  const n = order + 1, M = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  const xm = x.reduce((s, v) => s + v, 0) / x.length, xs = Math.max(1e-9, Math.max(...x.map((v) => Math.abs(v - xm))));
  for (let i = 0; i < x.length; i++) {
    if (skip?.[i]) continue; const t = (x[i] - xm) / xs, p: number[] = [];
    for (let k = 0; k < n; k++) p.push(t ** k);
    for (let r = 0; r < n; r++) { for (let c = 0; c < n; c++) M[r][c] += p[r] * p[c]; M[r][n] += p[r] * y[i]; }
  }
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]]; if (Math.abs(M[c][c]) < 1e-300) continue;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const coef = M.map((row, i) => row[n] / (row[i] || 1));
  return (xx: number) => { const t = (xx - xm) / xs; let s = 0; for (let k = n - 1; k >= 0; k--) s = s * t + coef[k]; return s; };
}

/** Remove a polynomial baseline, iteratively leaving out the line (points more than 2.5σ above the fit).
 *  The noise σ comes from channel-to-channel differences, so a broad line cannot inflate it. */
export function baseline(x: number[], y: number[], order = 2) {
  const dif = y.slice(1).map((v, i) => Math.abs(v - y[i])).sort((p, q) => p - q);
  const sigma = ((dif[dif.length >> 1] ?? 0) * 1.4826) / Math.SQRT2 || 1e-9;
  let skip = x.map(() => false), f = polyfit(x, y, order);
  for (let it = 0; it < 30; it++) {
    const hot = y.map((v, i) => v - f(x[i]) > 2.5 * sigma);
    // Leave out the line plus a margin of three channels either side, so its wings do not lift the baseline.
    const next = hot.map((_, i) => hot.slice(Math.max(0, i - 3), i + 4).some(Boolean));
    if (next.filter((v) => !v).length < order + 3) break;
    if (next.every((v, i) => v === skip[i])) break;
    skip = next; f = polyfit(x, y, order, skip);
  }
  return { residual: y.map((v, i) => v - f(x[i])), sigma, base: x.map((v) => f(v)), line: skip };
}

/** Smooth with a running mean of ±k channels (k = 0 leaves it as it is). */
export const smooth = (y: number[], k: number) => (k <= 0 ? [...y] : y.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - k); j <= Math.min(y.length - 1, i + k); j++) { s += y[j]; c++; } return s / c; }));

/** Terminal velocity: the edge of the emission on the high-velocity side (positive for 0° < l < 180°, negative
 *  otherwise). The outermost peak above `k`σ is found, and the edge is where the line falls to half that peak
 *  (the half-intensity method). Returns the edge, the peak's velocity and the k σ edge as a cross-check. */
export function terminalVelocity(v: number[], t: number[], sigma: number, l: number, k = 5) {
  const order = v.map((_, i) => i).sort((a, b) => v[a] - v[b]), vs = order.map((i) => v[i]), ts = order.map((i) => t[i]);
  const pos = ((l % 360) + 360) % 360 < 180, n = vs.length, step = pos ? -1 : 1, start = pos ? n - 1 : 0;
  const thr = k * sigma;
  // Walk in from the outer end to the first channel above k σ (needing two in a row), then on to the peak there.
  let i = start, edge = NaN;
  for (; i >= 0 && i < n && i + step >= 0 && i + step < n; i += step) if (ts[i] > thr && ts[i + step] > thr) break;
  if (!(i >= 0 && i < n) || !(ts[i] > thr)) return { vt: NaN, peak: NaN, edge };
  const o = i - step; edge = o >= 0 && o < n ? vs[o] + ((thr - ts[o]) / (ts[i] - ts[o] || 1)) * (vs[i] - vs[o]) : vs[i];
  let p = i; while (p + step >= 0 && p + step < n && ts[p + step] >= ts[p]) p += step;
  const half = ts[p] / 2;
  let j = p; while (j - step >= 0 && j - step < n && ts[j - step] > half) j -= step;
  const jo = j - step, vt = jo >= 0 && jo < n ? vs[j] + ((ts[j] - half) / (ts[j] - ts[jo] || 1)) * (vs[jo] - vs[j]) : vs[j];
  return { vt, peak: vs[p], edge };
}

/** Galactic constants: IAU 1985 (8.5 kpc, 220 km/s) or a modern pair (8.2 kpc, 233 km/s; Gravity 2019, Eilers 2019). */
export const GALAXY = { iau: { R0: 8.5, V0: 220 }, modern: { R0: 8.2, V0: 233 } } as const;

/** Tangent-point rotation: radius R = R0 |sin l| and circular speed V = |v_t| + V0 |sin l| (|b| small). */
export function tangentPoint(l: number, vt: number, R0: number, V0: number) {
  const s = Math.abs(Math.sin((l * Math.PI) / 180));
  return { R: R0 * s, V: Math.abs(vt) + V0 * s, d: R0 * Math.abs(Math.cos((l * Math.PI) / 180)) };
}

/** Kinematic distance(s) in kpc for an LSR velocity, assuming a flat rotation curve V0. Inside the solar circle
 *  there are two (near and far) unless the velocity is at the tangent point. */
export function kinematicDistance(l: number, b: number, v: number, R0: number, V0: number) {
  const r = Math.PI / 180, sl = Math.sin(l * r), cl = Math.cos(l * r), cb = Math.cos(b * r);
  const den = v / cb + V0 * sl; if (Math.abs(den) < 1e-9) return { R: NaN, d: [] as number[] };
  const R = (R0 * V0 * sl) / den; if (!(R > 0)) return { R: NaN, d: [] as number[] };
  const disc = R * R - R0 * R0 * sl * sl; if (disc < 0) return { R, d: [] as number[] };
  const q = Math.sqrt(disc), d = [R0 * cl - q, R0 * cl + q].filter((x) => x > 0).map((x) => x / cb);
  return { R, d };
}

/** HI column density (atoms/cm²) from the integral of brightness temperature (K km/s), optically thin. */
export const columnDensity = (intKkms: number) => 1.823e18 * intKkms;

/** A simulated drift spectrum (frequency MHz, antenna temperature K) at galactic l, b on `time`, from a flat
 *  rotation curve (220 km/s, R0 8.5 kpc) with HI in a disc and three spiral arms, a sloping baseline and noise. */
export function simulatedHI(l = 30, b = 0, time = new Date(Date.UTC(2026, 6, 15, 4)), seed = 21) {
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  const { R0, V0 } = GALAXY.iau, rl = (l * Math.PI) / 180, corr = lsrCorrection(l, b, time).total;
  const f: number[] = [], T: number[] = [];
  const clouds: [number, number][] = [];
  for (let d = 0.05; d < 22; d += 0.05) {
    const R = Math.sqrt(R0 * R0 + d * d - 2 * R0 * d * Math.cos(rl)); if (R < 2.5 || R > 16) continue;
    const arms = 1 + 1.6 * Math.exp(-0.5 * ((R - 5.5) / 0.4) ** 2) + 1.2 * Math.exp(-0.5 * ((R - 6.8) / 0.4) ** 2) + 0.8 * Math.exp(-0.5 * ((R - 10.5) / 0.6) ** 2);
    clouds.push([V0 * (R0 / R - 1) * Math.sin(rl), 0.05 * arms * Math.exp(-(R - R0) / 6)]);
  }
  for (let fr = F0 - 1.2; fr <= F0 + 1.2; fr += 0.0098) {
    const vLsr = velRadio(fr) + corr;
    let t = 0; for (const [vc, w] of clouds) t += 3 * w * Math.exp(-0.5 * ((vLsr - vc) / 7) ** 2);
    const x = fr - F0; f.push(+fr.toFixed(4)); T.push(+(40 + 3 * x + 1.5 * x * x + t + 0.35 * gauss()).toFixed(3));
  }
  return { f, T };
}
