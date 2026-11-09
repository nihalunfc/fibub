// Forward kinematics from a Denavit-Hartenberg table, in the standard (distal) or modified (proximal, Craig)
// convention. Angles in degrees in the table, radians inside. Plain TypeScript, no DOM.
//   standard:  A_i = Rz(θ_i) · Tz(d_i) · Tx(a_i) · Rx(α_i)          joint i moves about/along z_(i-1)
//   modified:  A_i = Rx(α_(i-1)) · Tx(a_(i-1)) · Rz(θ_i) · Tz(d_i)  joint i moves about/along z_i
import { type Mat, mul, eye, rank } from './ctl-linalg.ts';

export type JointType = 'R' | 'P' | 'F';
/** One row: θ and d are the fixed parts; a revolute joint adds its value to θ, a prismatic joint to d. */
export type DHRow = { type: JointType; theta: number; d: number; a: number; alpha: number; lo?: number; hi?: number };
export type Convention = 'standard' | 'modified';
const rad = Math.PI / 180;

export const rotX = (t: number): Mat => { const c = Math.cos(t), s = Math.sin(t); return [[1, 0, 0, 0], [0, c, -s, 0], [0, s, c, 0], [0, 0, 0, 1]]; };
export const rotZ = (t: number): Mat => { const c = Math.cos(t), s = Math.sin(t); return [[c, -s, 0, 0], [s, c, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]; };
export const transX = (a: number): Mat => [[1, 0, 0, a], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
export const transZ = (d: number): Mat => [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, d], [0, 0, 0, 1]];

/** The joint variable's effect on a row: θ (degrees) and d after adding the joint value q. */
export function rowWith(r: DHRow, q: number): { theta: number; d: number } {
  return { theta: r.theta + (r.type === 'R' ? q : 0), d: r.d + (r.type === 'P' ? q : 0) };
}
/** The homogeneous transform of one row with joint value q (degrees for R, length for P). */
export function linkTransform(r: DHRow, q: number, conv: Convention): Mat {
  const { theta, d } = rowWith(r, q);
  // Closed forms (same as the products of the four elementary transforms; written out for speed and clarity).
  const ct = Math.cos(theta * rad), st = Math.sin(theta * rad), ca = Math.cos(r.alpha * rad), sa = Math.sin(r.alpha * rad);
  const z = (x: number) => (Math.abs(x) < 1e-15 ? 0 : x);
  if (conv === 'standard') return [
    [ct, -st * ca, st * sa, r.a * ct],
    [st, ct * ca, -ct * sa, r.a * st],
    [0, sa, ca, d],
    [0, 0, 0, 1],
  ].map((row) => row.map(z));
  return [
    [ct, -st, 0, r.a],
    [st * ca, ct * ca, -sa, -sa * d],
    [st * sa, ct * sa, ca, ca * d],
    [0, 0, 0, 1],
  ].map((row) => row.map(z));
}

export type FK = {
  /** A_i, one per row. */
  links: Mat[];
  /** 0T_i for i = 0..n (frames[0] is the base, the identity). */
  frames: Mat[];
  /** Points to draw the arm: base, then for each row the corner between its two moves, then its frame origin. */
  path: [number, number, number][];
  /** The frame each joint moves in (standard: frame i-1, modified: frame i), as an index into frames. */
  jointFrame: number[];
  end: Mat;
};
export function forward(rows: DHRow[], q: number[], conv: Convention): FK {
  const links = rows.map((r, i) => linkTransform(r, q[i] ?? 0, conv));
  const frames = [eye(4)];
  const path: [number, number, number][] = [[0, 0, 0]];
  links.forEach((A, i) => {
    const P = frames[i], r = rows[i], { theta, d } = rowWith(r, q[i] ?? 0);
    // Corner point: standard moves d along z_(i-1) first; modified moves a along x_(i-1) first.
    const corner = conv === 'standard' ? mul(P, mul(rotZ(theta * rad), transZ(d))) : mul(P, mul(rotX(r.alpha * rad), transX(r.a)));
    path.push([corner[0][3], corner[1][3], corner[2][3]]);
    const F = mul(P, A); frames.push(F);
    path.push([F[0][3], F[1][3], F[2][3]]);
  });
  return { links, frames, path, jointFrame: rows.map((_, i) => (conv === 'standard' ? i : i + 1)), end: frames[frames.length - 1] };
}

/** Roll (about x), pitch (about y), yaw (about z) in degrees with R = Rz(yaw) · Ry(pitch) · Rx(roll). */
export function rpy(T: Mat): { roll: number; pitch: number; yaw: number; gimbal: boolean } {
  const r20 = Math.max(-1, Math.min(1, T[2][0]));
  const pitch = Math.asin(-r20);
  const gimbal = Math.abs(Math.cos(pitch)) < 1e-9;
  let roll: number, yaw: number;
  if (!gimbal) { roll = Math.atan2(T[2][1], T[2][2]); yaw = Math.atan2(T[1][0], T[0][0]); }
  else { yaw = 0; roll = r20 > 0 ? Math.atan2(-T[0][1], -T[0][2]) : Math.atan2(T[0][1], T[0][2]); }
  return { roll: roll / rad, pitch: pitch / rad, yaw: yaw / rad, gimbal };
}
/** Unit quaternion (w, x, y, z) with w ≥ 0 from the rotation part of T. */
export function quaternion(T: Mat): [number, number, number, number] {
  const [m00, m01, m02] = T[0], [m10, m11, m12] = T[1], [m20, m21, m22] = T[2];
  const tr = m00 + m11 + m22;
  let w: number, x: number, y: number, z: number;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = 0.25 * s; x = (m21 - m12) / s; y = (m02 - m20) / s; z = (m10 - m01) / s; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; w = (m21 - m12) / s; x = 0.25 * s; y = (m01 + m10) / s; z = (m02 + m20) / s; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; w = (m02 - m20) / s; x = (m01 + m10) / s; y = 0.25 * s; z = (m12 + m21) / s; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = 0.25 * s; }
  if (w < 0) { w = -w; x = -x; y = -y; z = -z; }
  const n = Math.hypot(w, x, y, z);
  return [w / n, x / n, y / n, z / n];
}
/** Rotation angle (degrees) and unit axis of T's rotation part. */
export function axisAngle(T: Mat): { angle: number; axis: [number, number, number] } {
  const [w, x, y, z] = quaternion(T);
  const s = Math.hypot(x, y, z), angle = 2 * Math.atan2(s, w) / rad;
  return { angle, axis: s < 1e-12 ? [0, 0, 1] : [x / s, y / s, z / s] };
}

/**
 * Geometric Jacobian (6 × number of moving joints): rows vx, vy, vz, ωx, ωy, ωz in the base frame. Columns use
 * length per radian for revolute joints and length per length for prismatic ones. `rank` is the rank of J,
 * `posRank` that of its top three rows (how many directions the tool tip can move in).
 */
export function jacobian(rows: DHRow[], fk: FK): { J: Mat; rank: number; posRank: number; joints: number[] } {
  const pe = [fk.end[0][3], fk.end[1][3], fk.end[2][3]];
  const cols: number[][] = [], joints: number[] = [];
  rows.forEach((r, i) => {
    if (r.type === 'F') return;
    const F = fk.frames[fk.jointFrame[i]];
    const z = [F[0][2], F[1][2], F[2][2]], p = [F[0][3], F[1][3], F[2][3]];
    if (r.type === 'R') { const d = [pe[0] - p[0], pe[1] - p[1], pe[2] - p[2]]; cols.push([z[1] * d[2] - z[2] * d[1], z[2] * d[0] - z[0] * d[2], z[0] * d[1] - z[1] * d[0], ...z]); }
    else cols.push([...z, 0, 0, 0]);
    joints.push(i);
  });
  const J = Array.from({ length: 6 }, (_, k) => cols.map((c) => (Math.abs(c[k]) < 1e-14 ? 0 : c[k])));
  return { J, rank: cols.length ? rank(J, 1e-9) : 0, posRank: cols.length ? rank(J.slice(0, 3), 1e-9) : 0, joints };
}

/**
 * The ranks the Jacobian has at almost every pose of this arm (the most found at a few pseudo-random joint
 * values). A pose whose rank is lower than this is singular. Planar arms, for example, never reach rank 6.
 */
export function genericRank(rows: DHRow[], conv: Convention): { rank: number; posRank: number } {
  let s = 12345, rank = 0, posRank = 0;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let k = 0; k < 4; k++) {
    const q = rows.map((r) => (r.type === 'R' ? -180 + 360 * rnd() : (r.lo ?? 0) + ((r.hi ?? 1) - (r.lo ?? 0)) * rnd()));
    const j = jacobian(rows, forward(rows, q, conv));
    rank = Math.max(rank, j.rank); posRank = Math.max(posRank, j.posRank);
  }
  return { rank, posRank };
}

/**
 * The same arm in the other convention. Standard → modified moves each row's a and α onto the next row and adds
 * a fixed tool row if the last a or α is not zero; modified → standard does the reverse (adding a fixed base row
 * if the first a or α is not zero). Joint values carry over unchanged. Returns the new rows and, for each new
 * row, the index of the old joint whose value it takes (-1 for a fixed row).
 */
export function convert(rows: DHRow[], from: Convention): { rows: DHRow[]; map: number[] } {
  const out: DHRow[] = [], map: number[] = [];
  if (from === 'standard') {
    rows.forEach((r, i) => {
      const prev = rows[i - 1];
      out.push({ type: r.type, theta: r.theta, d: r.d, a: prev ? prev.a : 0, alpha: prev ? prev.alpha : 0, lo: r.lo, hi: r.hi }); map.push(i);
    });
    const last = rows[rows.length - 1];
    if (last && (last.a || last.alpha)) { out.push({ type: 'F', theta: 0, d: 0, a: last.a, alpha: last.alpha }); map.push(-1); }
  } else {
    if (rows[0] && (rows[0].a || rows[0].alpha)) { out.push({ type: 'F', theta: 0, d: 0, a: rows[0].a, alpha: rows[0].alpha }); map.push(-1); }
    rows.forEach((r, i) => {
      const next = rows[i + 1];
      out.push({ type: r.type, theta: r.theta, d: r.d, a: next ? next.a : 0, alpha: next ? next.alpha : 0, lo: r.lo, hi: r.hi }); map.push(i);
    });
  }
  return { rows: out, map };
}

/** Made-up example arms (not any real robot's numbers). Lengths in metres, angles in degrees. */
export const DH_EXAMPLES: { id: string; name: string; conv: Convention; rows: DHRow[]; q: number[] }[] = [
  {
    id: 'arm6', name: '6-axis arm with a spherical wrist', conv: 'standard',
    rows: [
      { type: 'R', theta: 0, d: 0.4, a: 0.05, alpha: 90, lo: -170, hi: 170 },
      { type: 'R', theta: 90, d: 0, a: 0.45, alpha: 0, lo: -120, hi: 120 },
      { type: 'R', theta: 0, d: 0, a: 0.05, alpha: 90, lo: -150, hi: 150 },
      { type: 'R', theta: 0, d: 0.42, a: 0, alpha: -90, lo: -180, hi: 180 },
      { type: 'R', theta: 0, d: 0, a: 0, alpha: 90, lo: -120, hi: 120 },
      { type: 'R', theta: 0, d: 0.08, a: 0, alpha: 0, lo: -180, hi: 180 },
    ],
    q: [30, -20, 40, 0, 45, 0],
  },
  {
    id: 'planar2', name: 'Planar 2-link arm', conv: 'standard',
    rows: [
      { type: 'R', theta: 0, d: 0, a: 0.5, alpha: 0, lo: -180, hi: 180 },
      { type: 'R', theta: 0, d: 0, a: 0.4, alpha: 0, lo: -180, hi: 180 },
    ],
    q: [30, 45],
  },
  {
    id: 'scara', name: 'SCARA-type arm (RRPR)', conv: 'standard',
    rows: [
      { type: 'R', theta: 0, d: 0.4, a: 0.35, alpha: 0, lo: -130, hi: 130 },
      { type: 'R', theta: 0, d: 0, a: 0.3, alpha: 180, lo: -140, hi: 140 },
      { type: 'P', theta: 0, d: 0, a: 0, alpha: 0, lo: 0, hi: 0.2 },
      { type: 'R', theta: 0, d: 0, a: 0, alpha: 0, lo: -180, hi: 180 },
    ],
    q: [20, 60, 0.1, 30],
  },
  {
    id: 'stanford', name: 'Spherical (RRP) arm', conv: 'standard',
    rows: [
      { type: 'R', theta: 0, d: 0.3, a: 0, alpha: -90, lo: -180, hi: 180 },
      { type: 'R', theta: 0, d: 0.1, a: 0, alpha: 90, lo: -90, hi: 90 },
      { type: 'P', theta: 0, d: 0.2, a: 0, alpha: 0, lo: 0, hi: 0.5 },
    ],
    q: [45, 30, 0.25],
  },
];
