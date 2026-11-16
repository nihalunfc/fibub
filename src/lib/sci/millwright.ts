// Maths for the Learn course "How machines work" (#L382 levers-in-tools, #L383 belts-and-pulleys,
// #L384 bearings-and-friction). Plain TypeScript, no DOM; checked in tests/tools/<id>.mjs against hand-worked numbers.

export const G = 9.8; // m/s², rounded school value

// ---------- Levers ----------

/** Principle of moments: effort × effort arm = load × load arm, so effort = load × loadArm ÷ effortArm (any units, same for both arms). */
export const leverEffort = (load: number, loadArm: number, effortArm: number) => (load * loadArm) / effortArm;
/** Mechanical advantage of an ideal lever: effort arm ÷ load arm. */
export const leverMA = (loadArm: number, effortArm: number) => effortArm / loadArm;
/** Push needed on a wheel brace or spanner: torque (N·m) ÷ distance from the nut to the hand (m). */
export const braceForce = (torque: number, arm: number) => torque / arm;

export type LeverClass = 1 | 2 | 3;
/** Everyday tools that are levers, with their class and why. */
export const LEVER_TOOLS: { id: string; name: string; cls: LeverClass; why: string }[] = [
  { id: 'hammer', name: 'Claw hammer pulling a nail', cls: 1, why: 'The head rocks on the wood (fulcrum) between the nail (load) and your hand (effort).' },
  { id: 'crowbar', name: 'Crowbar lifting a slab', cls: 1, why: 'The bar rests on a block (fulcrum) between the slab and your hands.' },
  { id: 'pliers', name: 'Pliers', cls: 1, why: 'The pivot pin sits between the jaws (load) and the handles (effort). Two class 1 levers joined at the pin.' },
  { id: 'scissors', name: 'Scissors', cls: 1, why: 'The screw is the fulcrum, between the blades cutting (load) and your fingers (effort).' },
  { id: 'opener', name: 'Bottle opener', cls: 2, why: 'The far edge rests on the cap top (fulcrum), the cap edge it lifts (load) is in the middle, your hand is at the end.' },
  { id: 'barrow', name: 'Wheelbarrow', cls: 2, why: 'The wheel is the fulcrum at one end, the load sits in the middle, you lift the handles at the other end.' },
  { id: 'nutcracker', name: 'Nutcracker', cls: 2, why: 'The hinge is at one end, the nut in the middle, your hand at the other end.' },
  { id: 'tweezers', name: 'Tweezers', cls: 3, why: 'The joined end is the fulcrum, your fingers press in the middle, the tips grip the load at the far end.' },
  { id: 'shovel', name: 'Shovel or broom', cls: 3, why: 'Your top hand is the fulcrum, your lower hand pushes in the middle, the load is at the blade end.' },
];

// ---------- Belts, pulleys, chains ----------

/** Driven speed: n1·d1 = n2·d2 (belts, using pitch diameters) so n2 = n1·d1 ÷ d2. Also works with teeth for chains and gears. */
export const drivenRpm = (n1: number, d1: number, d2: number) => (n1 * d1) / d2;
/** Torque on the driven shaft, ignoring losses: T2 = T1·d2 ÷ d1 (slower shaft, more torque). */
export const drivenTorque = (t1: number, d1: number, d2: number) => (t1 * d2) / d1;
/** Torque from power: T (N·m) = P (W) ÷ ω, with ω = 2π n ÷ 60. */
export const torqueFromPower = (watts: number, rpm: number) => watts / ((2 * Math.PI * rpm) / 60);
/** Belt speed in m/s from a pulley diameter in mm and its rpm: v = π d n ÷ 60. */
export const beltSpeed = (dmm: number, rpm: number) => (Math.PI * (dmm / 1000) * rpm) / 60;
/** Open belt length, the usual approximation: L ≈ 2C + π(D + d)/2 + (D − d)²/(4C). Same units as the inputs. */
export const beltLength = (D: number, d: number, C: number) => 2 * C + (Math.PI * (D + d)) / 2 + (D - d) ** 2 / (4 * C);
/** Open belt length, exact: L = 2C·cos β + π(D + d)/2 + β(D − d), with sin β = (D − d)/(2C). */
export function beltLengthExact(D: number, d: number, C: number) {
  const big = Math.max(D, d), small = Math.min(D, d), b = Math.asin((big - small) / (2 * C));
  return 2 * C * Math.cos(b) + (Math.PI * (big + small)) / 2 + b * (big - small);
}
/** Wrap angle on the small pulley, in degrees: 180° − 2·asin((D − d)/(2C)). */
export function wrapSmall(D: number, d: number, C: number) {
  const big = Math.max(D, d), small = Math.min(D, d);
  return 180 - (2 * Math.asin(Math.min(1, (big - small) / (2 * C))) * 180) / Math.PI;
}
/** The closest the two pulleys can be before their rims touch: (D + d)/2. */
export const minCentre = (D: number, d: number) => (D + d) / 2;

export type BeltDrive = { n2: number; ratio: number; t1: number; t2: number; v: number; L: number; Lexact: number; wrap: number };
/** A whole open belt drive: driver d1 (mm) at n1 rpm with power P (W), driven d2 (mm), centres C (mm). */
export function beltDrive(d1: number, d2: number, C: number, n1: number, watts: number): BeltDrive {
  const n2 = drivenRpm(n1, d1, d2), t1 = torqueFromPower(watts, n1);
  return { n2, ratio: d2 / d1, t1, t2: drivenTorque(t1, d1, d2), v: beltSpeed(d1, n1), L: beltLength(d1, d2, C), Lexact: beltLengthExact(d1, d2, C), wrap: wrapSmall(d1, d2, C) };
}

// ---------- Bearings and friction ----------

export type BearingId = 'dry' | 'oiled' | 'ball' | 'roller';
/** Typical friction coefficients, referred to the shaft (bore) radius. Plain bushes from engineering tables;
 *  rolling bearings from the constant-μ estimate in bearing makers' catalogues (deep groove ball about 0.0015,
 *  cylindrical roller about 0.0011). Real values depend on speed, load, grease, seals and temperature. */
export const BEARINGS: Record<BearingId, { name: string; mu: number }> = {
  dry: { name: 'Dry plain bush', mu: 0.15 },
  oiled: { name: 'Oiled plain bush', mu: 0.02 },
  ball: { name: 'Ball bearing', mu: 0.0015 },
  roller: { name: 'Roller bearing', mu: 0.0011 },
};
/** Friction torque in a bearing: T = μ·F·r (F radial load in N, r shaft radius in m). */
export const frictionTorque = (mu: number, F: number, r: number) => mu * F * r;
/** Moment of inertia of a solid disc flywheel: I = ½ m R². */
export const discInertia = (m: number, R: number) => 0.5 * m * R * R;
export const rpmToRad = (rpm: number) => (2 * Math.PI * rpm) / 60;

export type SpinDown = { T: number; I: number; w0: number; alpha: number; time: number; turns: number; energy: number; heatStart: number };
/**
 * A flywheel coasting on its bearings with only bearing friction (no air drag): constant friction torque
 * T = μ F r gives a steady slow-down α = T / I, so it stops after t = ω0 / α. All the kinetic energy ½ I ω0²
 * becomes heat in the bearing; at the start it makes T·ω0 watts.
 * m flywheel mass (kg), R its radius (m), r shaft radius (m), rpm start speed, extra radial load (N, e.g. belt pull).
 */
export function spinDown(mu: number, m: number, R: number, r: number, rpm: number, extra = 0): SpinDown {
  const F = m * G + extra, T = frictionTorque(mu, F, r), I = discInertia(m, R), w0 = rpmToRad(rpm), alpha = T / I;
  const time = w0 / alpha;
  return { T, I, w0, alpha, time, turns: (w0 * time) / 2 / (2 * Math.PI), energy: 0.5 * I * w0 * w0, heatStart: T * w0 };
}
/** Speed (rpm) after t seconds of coasting, never below zero. */
export const speedAt = (s: SpinDown, t: number) => Math.max(0, s.w0 - s.alpha * t) * 60 / (2 * Math.PI);
/** Angle turned (rad) after t seconds of coasting (stops growing once the wheel stops). */
export const angleAt = (s: SpinDown, t: number) => { const tt = Math.min(t, s.time); return s.w0 * tt - 0.5 * s.alpha * tt * tt; };
