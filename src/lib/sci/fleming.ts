// Fleming's left-hand rule and the DC motor (school level): the force on a current-carrying wire in a magnetic field,
// F = I L × B (size B I L sin θ), and the turning effect on a coil with a split-ring commutator. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export type V3 = [number, number, number];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const rad = (d: number) => (d * Math.PI) / 180;

/** Field B (T) along ±x; a wire of length L (m) at angle θ (degrees) to the field in the x-z plane, current I (A,
 *  sign gives the way it flows). Returns the vectors of B, the current direction and the force F = I L × B. */
export function wireForce(B: number, I: number, L: number, thetaDeg: number, bSign = 1) {
  const Bv: V3 = [bSign * B, 0, 0];
  const dir: V3 = [Math.cos(rad(thetaDeg)), 0, -Math.sin(rad(thetaDeg))]; // wire direction (current flows this way when I > 0)
  const IL: V3 = [I * L * dir[0], 0, I * L * dir[2]];
  const F = cross(IL, Bv);
  return { Bv, dir, IL, F, size: Math.abs(B * I * L * Math.sin(rad(thetaDeg))) };
}

/** Torque on a flat coil of N turns and area A (m²) carrying I in field B, when its normal is at φ to the field:
 *  τ = N B I A sin φ. With a split-ring commutator the current reverses each half turn, so the torque keeps one sign. */
export const torque = (N: number, B: number, I: number, A: number, phiDeg: number) => N * B * I * A * Math.sin(rad(phiDeg));
/** Direction of the current in side AB of the coil at rotation angle φ (degrees) with a split ring: +1 or −1. */
export const commutated = (phiDeg: number) => {
  const p = ((phiDeg % 360) + 360) % 360;
  return p < 180 ? 1 : -1;
};
export const motorTorque = (N: number, B: number, I: number, A: number, phiDeg: number) => commutated(phiDeg) * torque(N, B, I, A, phiDeg);

/** Simple 3D view: turn by yaw about the vertical axis, then tilt by pitch; returns screen x (right) and y (down). */
export function project(p: V3, yawDeg: number, pitchDeg: number, scale: number): [number, number] {
  const cy = Math.cos(rad(yawDeg)), sy = Math.sin(rad(yawDeg)), cp = Math.cos(rad(pitchDeg)), sp = Math.sin(rad(pitchDeg));
  const x1 = cy * p[0] + sy * p[2], z1 = -sy * p[0] + cy * p[2];
  const y2 = cp * p[1] - sp * z1;
  return [scale * x1, -scale * y2];
}

export function questions(rng: () => number = Math.random): Question[] {
  const B = pick(rng, [0.1, 0.2, 0.25, 0.4, 0.5, 0.8]), I = pick(rng, [1, 2, 2.5, 3, 4, 5]), Lcm = pick(rng, [5, 10, 20, 25, 50]);
  const F = B * I * (Lcm / 100);
  const th = pick(rng, [30, 45, 60]);
  const F2 = F * Math.sin(rad(th));
  const N = pick(rng, [20, 50, 100, 200]), side = pick(rng, [2, 4, 5, 10]), I3 = pick(rng, [0.5, 1, 2]), B3 = pick(rng, [0.1, 0.2, 0.5]);
  const A3 = (side / 100) ** 2, T = N * B3 * I3 * A3;
  const Fw = pick(rng, [0.01, 0.02, 0.05, 0.1]), Bw = pick(rng, [0.1, 0.2, 0.5]), Lw = pick(rng, [10, 20, 50]);
  const Iw = Fw / (Bw * (Lw / 100));
  return [
    { text: `A wire ${Lcm} cm long carries ${I} A at right angles to a magnetic field of ${B} T. What force acts on it, in newtons?`, answer: F, unit: 'N', tol: 0.02,
      steps: ['F = B I L (sin 90° = 1)', `F = ${B} × ${I} × ${Lcm / 100} = ${r3(F)} N`] },
    { text: `The same wire is turned so it makes ${th}° with the field. What is the force now, in newtons?`, answer: F2, unit: 'N', tol: 0.02,
      steps: ['F = B I L sin θ', `F = ${B} × ${I} × ${Lcm / 100} × sin ${th}° = ${r3(F2)} N`] },
    { text: `A square coil of ${N} turns, each side ${side} cm, carries ${I3} A in a field of ${B3} T. What is the largest torque on it, in N m?`, answer: T, unit: 'N m', tol: 0.02,
      steps: [`Area A = (${side / 100} m)² = ${r3(A3)} m²`, `τ = N B I A (largest when the coil's plane is along the field) = ${N} × ${B3} × ${I3} × ${r3(A3)} = ${r3(T)} N m`] },
    { text: `What current must flow in a ${Lw} cm wire at right angles to a ${Bw} T field to feel a force of ${Fw} N?`, answer: Iw, unit: 'A', tol: 0.02,
      steps: ['I = F / (B L)', `I = ${Fw} / (${Bw} × ${Lw / 100}) = ${r3(Iw)} A`] },
  ];
}
