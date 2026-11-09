// Polarisation optics: Jones vectors and matrices for fully polarised light, Mueller matrices and Stokes vectors for
// any light (partly polarised or unpolarised), and the path on the Poincaré sphere. Angles in degrees.
// Convention: E = Re{(Ex, Ey) e^{i(kz − ωt)}}; S3 = 2 Im(Ex* Ey) > 0 is right-handed in the IEEE convention
// (clockwise as seen from behind, looking along the beam). Plain maths, no DOM.

export type Z = [number, number];
export type J2 = [Z, Z, Z, Z]; // [a, b, c, d] for [[a, b], [c, d]]
export type Stokes = [number, number, number, number];
export type M4 = number[][];
const rad = (d: number) => (d * Math.PI) / 180;
const zm = (a: Z, b: Z): Z => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const za = (a: Z, b: Z): Z => [a[0] + b[0], a[1] + b[1]];
const zc = (a: Z): Z => [a[0], -a[1]];
const ex = (ph: number): Z => [Math.cos(ph), Math.sin(ph)];

export function jmul(A: J2, B: J2): J2 {
  return [za(zm(A[0], B[0]), zm(A[1], B[2])), za(zm(A[0], B[1]), zm(A[1], B[3])), za(zm(A[2], B[0]), zm(A[3], B[2])), za(zm(A[2], B[1]), zm(A[3], B[3]))];
}
export const japply = (A: J2, v: [Z, Z]): [Z, Z] => [za(zm(A[0], v[0]), zm(A[1], v[1])), za(zm(A[2], v[0]), zm(A[3], v[1]))];
const rot = (t: number): J2 => { const c = Math.cos(t), s = Math.sin(t); return [[c, 0], [s, 0], [-s, 0], [c, 0]]; };
/** Element J rotated so its axis is at angle θ: R(−θ) J R(θ). */
const atAngle = (J: J2, deg: number): J2 => jmul(rot(-rad(deg)), jmul(J, rot(rad(deg))));

/** Linear polariser, transmission axis at θ. */
export const jPolariser = (deg: number): J2 => atAngle([[1, 0], [0, 0], [0, 0], [0, 0]], deg);
/** Retarder (waveplate) with retardance δ (degrees; 90 = quarter wave, 180 = half wave), fast axis at θ. */
export const jRetarder = (delta: number, deg: number): J2 => atAngle([[1, 0], [0, 0], [0, 0], ex(rad(delta))], deg);
/** Rotator (optical activity, Faraday): turns the polarisation by α. */
export const jRotator = (alpha: number): J2 => { const c = Math.cos(rad(alpha)), s = Math.sin(rad(alpha)); return [[c, 0], [-s, 0], [s, 0], [c, 0]]; };
/** Partial polariser (diattenuator): intensity transmittances tMax along θ and tMin across it. */
export const jPartial = (tMax: number, tMin: number, deg: number): J2 => atAngle([[Math.sqrt(tMax), 0], [0, 0], [0, 0], [Math.sqrt(tMin), 0]], deg);

/** Stokes vector of a Jones vector. */
export function stokesOf(v: [Z, Z]): Stokes {
  const [x, y] = v, a = x[0] ** 2 + x[1] ** 2, d = y[0] ** 2 + y[1] ** 2, c = zm(zc(x), y);
  return [a + d, a - d, 2 * c[0], 2 * c[1]];
}
/** Mueller matrix of a Jones matrix: M_ij = ½ Tr(J† σ_i J σ_j). */
export function muellerOf(J: J2): M4 {
  const sig: J2[] = [[[1, 0], [0, 0], [0, 0], [1, 0]], [[1, 0], [0, 0], [0, 0], [-1, 0]], [[0, 0], [1, 0], [1, 0], [0, 0]], [[0, 0], [0, -1], [0, 1], [0, 0]]];
  const Jd: J2 = [zc(J[0]), zc(J[2]), zc(J[1]), zc(J[3])];
  return sig.map((si) => sig.map((sj) => { const P = jmul(Jd, jmul(si, jmul(J, sj))); return 0.5 * (P[0][0] + P[3][0]); }));
}
export const mapply = (M: M4, s: Stokes): Stokes => M.map((r) => r[0] * s[0] + r[1] * s[1] + r[2] * s[2] + r[3] * s[3]) as Stokes;
/** Depolariser that removes a fraction f of the polarisation (0 = none, 1 = fully depolarising). */
export const mDepolariser = (f: number): M4 => [[1, 0, 0, 0], [0, 1 - f, 0, 0], [0, 0, 1 - f, 0], [0, 0, 0, 1 - f]];

/** Stokes vector of light with intensity 1, azimuth ψ, ellipticity angle χ (±45° circular) and degree of polarisation p. */
export function stokesFrom(psi: number, chi: number, p = 1): Stokes {
  const a = rad(2 * psi), b = rad(2 * chi);
  return [1, p * Math.cos(b) * Math.cos(a), p * Math.cos(b) * Math.sin(a), p * Math.sin(b)];
}
/** Jones vector (unit intensity) for azimuth ψ and ellipticity χ. */
export function jonesFrom(psi: number, chi: number): [Z, Z] {
  const p = rad(psi), c = rad(chi);
  // Rotate the ellipse (cos χ, i sin χ) by ψ.
  const ax: Z = [Math.cos(c), 0], ay: Z = [0, Math.sin(c)];
  return [za(zm([Math.cos(p), 0], ax), zm([-Math.sin(p), 0], ay)), za(zm([Math.sin(p), 0], ax), zm([Math.cos(p), 0], ay))];
}

export type Describe = { I: number; dop: number; psi: number; chi: number; kind: string; hand: string };
/** Intensity, degree of polarisation, azimuth ψ (−90 to 90), ellipticity χ (−45 to 45) and a plain name. */
export function describe(s: Stokes): Describe {
  const I = s[0], Ip = Math.hypot(s[1], s[2], s[3]), dop = I > 0 ? Math.min(1, Ip / I) : 0;
  const psi = (0.5 * Math.atan2(s[2], s[1]) * 180) / Math.PI, chi = Ip > 0 ? (0.5 * Math.asin(Math.max(-1, Math.min(1, s[3] / Ip))) * 180) / Math.PI : 0;
  const hand = Math.abs(chi) < 0.05 ? '' : chi > 0 ? 'right-handed' : 'left-handed';
  let kind: string;
  if (I < 1e-12) kind = 'no light';
  else if (dop < 1e-6) kind = 'unpolarised';
  else if (Math.abs(chi) < 0.05) kind = `linear at ${fix(psi)}°`;
  else if (Math.abs(Math.abs(chi) - 45) < 0.05) kind = `${hand} circular`;
  else kind = `${hand} elliptical, axis at ${fix(psi)}°`;
  if (I >= 1e-12 && dop >= 1e-6 && dop < 1 - 1e-6) kind = `partly polarised (${fix(dop * 100)} %), ${kind}`;
  return { I, dop, psi, chi, kind, hand };
}
const fix = (x: number) => { const r = Math.round(x * 10) / 10; return String(Object.is(r, -0) ? 0 : r).replace('-', '−'); };

export type El = { kind: 'polariser' | 'retarder' | 'rotator' | 'partial' | 'depolariser'; a: number; b: number; c: number; label: string };
/** Read elements, one per line: "polariser 45", "qwp 0", "hwp 22.5", "retarder 60 30" (retardance, axis), "rotator 30",
 * "partial 0.9 0.1 0" (Tmax, Tmin, axis), "depolariser 0.5". Throws with a plain message. */
export function parseElements(text: string): El[] {
  const out: El[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const p = line.split(/[\s,;\t]+/), k = p[0].toLowerCase(), v = p.slice(1).map((x) => Number(x.replace('−', '-').replace('°', '')));
    const need = (n: number, ex_: string) => { if (v.length < n || v.slice(0, n).some((x) => !Number.isFinite(x))) throw new Error(`Line ${i + 1}: write it as "${ex_}".`); };
    if (/^(pol|lin|analy)/.test(k)) { need(1, 'polariser 45'); out.push({ kind: 'polariser', a: v[0], b: 0, c: 0, label: `Polariser at ${v[0]}°` }); }
    else if (k === 'qwp' || k.startsWith('quarter')) { need(1, 'qwp 45'); out.push({ kind: 'retarder', a: 90, b: v[0], c: 0, label: `Quarter-wave plate at ${v[0]}°` }); }
    else if (k === 'hwp' || k.startsWith('half')) { need(1, 'hwp 22.5'); out.push({ kind: 'retarder', a: 180, b: v[0], c: 0, label: `Half-wave plate at ${v[0]}°` }); }
    else if (k.startsWith('ret') || k.startsWith('wave')) { need(2, 'retarder 60 30 (retardance, fast-axis angle)'); out.push({ kind: 'retarder', a: v[0], b: v[1], c: 0, label: `Retarder ${v[0]}° at ${v[1]}°` }); }
    else if (k.startsWith('rot')) { need(1, 'rotator 30'); out.push({ kind: 'rotator', a: v[0], b: 0, c: 0, label: `Rotator ${v[0]}°` }); }
    else if (k.startsWith('part') || k.startsWith('diat')) { need(3, 'partial 0.9 0.1 0 (Tmax, Tmin, axis angle)'); if (!(v[0] >= 0 && v[0] <= 1 && v[1] >= 0 && v[1] <= v[0])) throw new Error(`Line ${i + 1}: transmittances between 0 and 1, the first one larger.`); out.push({ kind: 'partial', a: v[0], b: v[1], c: v[2], label: `Partial polariser ${v[0]}/${v[1]} at ${v[2]}°` }); }
    else if (k.startsWith('depol')) { need(1, 'depolariser 0.5'); if (!(v[0] >= 0 && v[0] <= 1)) throw new Error(`Line ${i + 1}: the depolarised fraction is between 0 and 1.`); out.push({ kind: 'depolariser', a: v[0], b: 0, c: 0, label: `Depolariser ${v[0]}` }); }
    else throw new Error(`Line ${i + 1}: "${p[0]}" is not an element. Use polariser, qwp, hwp, retarder, rotator, partial or depolariser.`);
  });
  if (out.length > 50) throw new Error('Up to 50 elements.');
  return out;
}
/** Jones matrix of an element (null for a depolariser, which has none). t scales the retardance/rotation for drawing paths. */
export function jonesOf(e: El, t = 1): J2 | null {
  if (e.kind === 'polariser') return jPolariser(e.a);
  if (e.kind === 'retarder') return jRetarder(e.a * t, e.b);
  if (e.kind === 'rotator') return jRotator(e.a * t);
  if (e.kind === 'partial') return jPartial(e.a, e.b, e.c);
  return null;
}
export const muellerOfEl = (e: El, t = 1): M4 => { const J = jonesOf(e, t); return J ? muellerOf(J) : mDepolariser(e.a * t); };

/** Stokes vector after each element (index 0 is the input). */
export function propagate(s0: Stokes, els: El[]): Stokes[] {
  const out: Stokes[] = [s0];
  for (const e of els) out.push(mapply(muellerOfEl(e), out[out.length - 1]));
  return out;
}
/** Jones vectors after each element, for fully polarised input with no depolariser; null otherwise. */
export function propagateJones(v0: [Z, Z], els: El[]): [Z, Z][] | null {
  const out: [Z, Z][] = [v0];
  for (const e of els) { const J = jonesOf(e); if (!J) return null; out.push(japply(J, out[out.length - 1])); }
  return out;
}
/** Overall Mueller matrix of the chain. */
export function systemMueller(els: El[]): M4 {
  let M: M4 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  for (const e of els) { const E = muellerOfEl(e); M = E.map((r) => [0, 1, 2, 3].map((j) => r[0] * M[0][j] + r[1] * M[1][j] + r[2] * M[2][j] + r[3] * M[3][j])); }
  return M;
}
