// Small 3D helpers for the school molecule tools (VSEPR shapes, SN1/SN2, chirality): rotation matrices and a
// simple perspective projection. Plain maths, no DOM.
export type V3 = [number, number, number];
export type M3 = number[]; // 3×3, row major

export const I3: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const mul = (a: M3, b: M3): M3 => {
  const r = new Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) r[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
  return r;
};
export const rotX = (t: number): M3 => [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)];
export const rotY = (t: number): M3 => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)];
export const rotZ = (t: number): M3 => [Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t), 0, 0, 0, 1];
export const apply = (m: M3, v: V3): V3 => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];

/** Project a rotated point to the screen: x right, y down, z towards the viewer; returns screen x, y, depth z and a scale. */
export function project(v: V3, cx: number, cy: number, s: number, persp = 0.18) {
  const k = 1 / (1 - persp * v[2]);
  return { x: cx + v[0] * s * k, y: cy - v[1] * s * k, z: v[2], k };
}
