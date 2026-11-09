// Total-field magnetic anomalies of simple bodies: a sphere (dipole), an infinite horizontal cylinder, a thin dyke
// (sheet) of any dip and down-dip extent, and a vertical-sided rectangular prism, magnetised by induction in the
// Earth's field plus an optional remanent magnetisation. ΔT is the anomalous field projected on the main field
// direction (the usual total-field approximation). Plain maths; no DOM.
//
// Coordinates: s along the profile (azimuth α from north), t across it (90° clockwise from s), z down; metres.
// Field in nT, magnetisation in A/m, susceptibility in SI.

export type Vec = [number, number, number];
const MU0_4PI = 1e-7; // μ0/4π in T·m/A
const NT = 1e9;

/** Unit vector in (s, t, z) for inclination I and declination D (degrees), on a profile of azimuth α. */
export function dirVec(inc: number, dec: number, az: number): Vec {
  const r = Math.PI / 180, ci = Math.cos(inc * r);
  return [ci * Math.cos((dec - az) * r), ci * Math.sin((dec - az) * r), Math.sin(inc * r)];
}
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export type Field = { F: number; inc: number; dec: number; az: number };
export type Magn = { chi: number; mr?: number; rinc?: number; rdec?: number };

/** Magnetisation vector (A/m) in profile coordinates: induced χF/μ0 along the field plus remanence Mr along (Ir, Dr). */
export function magnetisation(f: Field, m: Magn): Vec {
  const Hind = (m.chi * f.F * 1e-9) / (4 * Math.PI * 1e-7);
  let M = scale(dirVec(f.inc, f.dec, f.az), Hind);
  if (m.mr && m.mr !== 0) M = add(M, scale(dirVec(m.rinc ?? f.inc, m.rdec ?? f.dec, f.az), m.mr));
  return M;
}
/** Koenigsberger ratio Q = remanent ÷ induced magnetisation. */
export const koenigsberger = (f: Field, m: Magn) => (m.mr ?? 0) / ((m.chi * f.F * 1e-9) / (4 * Math.PI * 1e-7));

export type Body =
  | { kind: 'sphere'; s0: number; t0?: number; z: number; R: number }
  | { kind: 'cylinder'; s0: number; z: number; R: number }
  | { kind: 'dyke'; s0: number; z: number; thick: number; dip: number; extent: number }
  | { kind: 'prism'; s0: number; t0?: number; width: number; length: number; z1: number; z2: number };

/** Check a body's sizes; returns a message or ''. */
export function bodyProblem(b: Body): string {
  if (b.kind === 'sphere' || b.kind === 'cylinder') { if (!(b.R > 0)) return 'The radius must be above zero.'; if (!(b.z > b.R)) return 'The centre must be deeper than the radius, so the body stays underground.'; }
  if (b.kind === 'dyke') { if (!(b.z > 0)) return 'The top of the dyke must be below the surface (depth above zero).'; if (!(b.thick > 0 && b.extent > 0)) return 'Thickness and down-dip extent must be above zero.'; if (!(b.dip > 0 && b.dip < 180)) return 'Dip must be between 0° and 180° (90° is vertical).'; }
  if (b.kind === 'prism') { if (!(b.width > 0 && b.length > 0)) return 'Width and length must be above zero.'; if (!(b.z1 > 0 && b.z2 > b.z1)) return 'The top must be below the surface and the bottom deeper than the top.'; }
  return '';
}

/** Anomalous field vector (nT) at observation point p = (s, t, z) from body b with magnetisation M (A/m). */
export function bodyField(b: Body, M: Vec, p: Vec): Vec {
  if (b.kind === 'sphere') {
    const vol = (4 / 3) * Math.PI * b.R ** 3, m = scale(M, vol);
    const r: Vec = [p[0] - b.s0, p[1] - (b.t0 ?? 0), p[2] - b.z], rr = Math.hypot(...r), u = scale(r, 1 / rr);
    return scale(add(scale(u, 3 * dot(m, u)), scale(m, -1)), (MU0_4PI * NT) / rr ** 3);
  }
  if (b.kind === 'cylinder') {
    // Axis along t; only the s and z parts of M make a field. B = (μ0/2π)[2(m·r̂)r̂ − m]/r² per unit length.
    const m: Vec = [M[0] * Math.PI * b.R * b.R, 0, M[2] * Math.PI * b.R * b.R];
    const r: Vec = [p[0] - b.s0, 0, p[2] - b.z], rr = Math.hypot(r[0], r[2]), u = scale(r, 1 / rr);
    return scale(add(scale(u, 2 * dot(m, u)), scale(m, -1)), (2 * MU0_4PI * NT) / (rr * rr));
  }
  if (b.kind === 'dyke') {
    // A thin sheet of 2D dipoles (moment M·thickness per unit area), striking along t, top edge at (s0, z), dipping
    // toward +s at `dip` degrees, `extent` metres down dip. Integrated in closed form: the along-dip part of M
    // acts as line poles at the top and bottom edges; the across-sheet part as the gradient of the angle the sheet
    // subtends.
    const d = (b.dip * Math.PI) / 180, e: [number, number] = [Math.cos(d), Math.sin(d)], n: [number, number] = [-Math.sin(d), Math.cos(d)];
    const ms: [number, number] = [M[0] * b.thick, M[2] * b.thick];
    const me = ms[0] * e[0] + ms[1] * e[1], mn = ms[0] * n[0] + ms[1] * n[1];
    const rx = p[0] - b.s0, rz = p[2] - b.z, L = b.extent;
    const a = rx * e[0] + rz * e[1], bb = rx * n[0] + rz * n[1];
    const r1 = a * a + bb * bb, r2 = (a - L) ** 2 + bb * bb;
    // Poles: + at the bottom edge, − at the top edge, field ρ/|ρ|² each.
    const bx = rx - L * e[0], bz = rz - L * e[1];
    const poleS = me * (bx / r2 - rx / r1), poleZ = me * (bz / r2 - rz / r1);
    const dA = bb / r1 - bb / r2, dB = -a / r1 - (L - a) / r2;
    const gS = dA * e[0] + dB * n[0], gZ = dA * e[1] + dB * n[1];
    const k = 2 * MU0_4PI * NT;
    return [k * (poleS - mn * gS), 0, k * (poleZ - mn * gZ)];
  }
  // Prism: sum over the six faces of the surface pole density σ = M·n (outward normal) times the closed-form
  // integral of (source − obs)/R³ over each rectangle.
  const s1 = b.s0 - b.width / 2 - p[0], s2 = b.s0 + b.width / 2 - p[0];
  const t1 = (b.t0 ?? 0) - b.length / 2 - p[1], t2 = (b.t0 ?? 0) + b.length / 2 - p[1];
  const z1 = b.z1 - p[2], z2 = b.z2 - p[2];
  const B: Vec = [0, 0, 0];
  const face = (axis: 0 | 1 | 2, w: number, sigma: number, u1: number, u2: number, v1: number, v2: number) => {
    // In-plane axes (u, v) are the other two axes in cyclic order after `axis`.
    if (sigma === 0) return;
    const Iu = rectInt(u1, u2, v1, v2, w);
    const ia = (axis + 1) % 3, ib = (axis + 2) % 3;
    B[ia] += -sigma * Iu[0]; B[ib] += -sigma * Iu[1]; B[axis] += -sigma * Iu[2];
  };
  face(2, z1, -M[2], s1, s2, t1, t2); face(2, z2, M[2], s1, s2, t1, t2); // top (normal −z), bottom (+z): u = s, v = t
  face(0, s1, -M[0], t1, t2, z1, z2); face(0, s2, M[0], t1, t2, z1, z2); // s faces: u = t, v = z
  face(1, t1, -M[1], z1, z2, s1, s2); face(1, t2, M[1], z1, z2, s1, s2); // t faces: u = z, v = s
  return scale(B, MU0_4PI * NT);
}

/** ∫∫ (U, V, W)/R³ dU dV over U ∈ [u1, u2], V ∈ [v1, v2] at fixed W (source minus observation). */
function rectInt(u1: number, u2: number, v1: number, v2: number, w: number): Vec {
  const out: Vec = [0, 0, 0];
  for (const [u, su] of [[u1, -1], [u2, 1]] as const) for (const [v, sv] of [[v1, -1], [v2, 1]] as const) {
    const sg = su * sv, R = Math.sqrt(u * u + v * v + w * w);
    out[0] += sg * -logPlus(v, R, u * u + w * w);
    out[1] += sg * -logPlus(u, R, v * v + w * w);
    out[2] += w === 0 ? 0 : sg * Math.atan((u * v) / (w * R));
  }
  return out;
}
/** log(x + R) where R = √(x² + q), accurate when x is large and negative. */
function logPlus(x: number, R: number, q: number): number {
  if (x >= 0) return Math.log(x + R);
  return q > 0 ? Math.log(q / (R - x)) : -60; // the term cancels in the double sum when q = 0
}

/** Total-field anomaly ΔT (nT) = F̂·ΔB at each point. */
export function totalField(b: Body, f: Field, m: Magn, pts: Vec[]): number[] {
  const M = magnetisation(f, m), fh = dirVec(f.inc, f.dec, f.az);
  return pts.map((p) => dot(fh, bodyField(b, M, p)));
}

/** Profile ΔT at stations s along the line (t = 0) at height h above the ground (z = −h). */
export function profile(b: Body, f: Field, m: Magn, s: number[], h = 0): number[] {
  return totalField(b, f, m, s.map((x) => [x, 0, -h] as Vec));
}

/** RMS misfit between observed and modelled values, raw and after removing the mean difference (a regional level). */
export function misfit(obs: number[], calc: number[]) {
  const d = obs.map((v, i) => v - calc[i]), n = d.length;
  const mean = d.reduce((s, v) => s + v, 0) / n;
  return { rms: Math.sqrt(d.reduce((s, v) => s + v * v, 0) / n), shift: mean, rmsShifted: Math.sqrt(d.reduce((s, v) => s + (v - mean) ** 2, 0) / n), n };
}
