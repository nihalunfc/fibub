// Kinetic theory of gases for the school tool kinetic-theory. Two parts:
// 1. A box of hard discs in two dimensions (elastic collisions with each other and the walls). It counts the
//    momentum given to the walls, so the pressure comes out of the collisions and can be compared with the
//    two-dimensional ideal-gas law P·A = N·m⟨v²⟩/2, and its speeds settle into the 2D Maxwell (Rayleigh) shape.
// 2. Real gases in three dimensions: v_rms = √(3RT/M), mean kinetic energy (3/2)kT, and P = nRT/V.
// Plain maths, no DOM.
export const R_GAS = 8.314462618; // J/(mol K), CODATA 2018 (exact)
export const K_B = 1.380649e-23; // J/K, exact
export const GASES = [
  { id: 'he', name: 'Helium', M: 0.0040026 },
  { id: 'n2', name: 'Nitrogen (N₂)', M: 0.0280134 },
  { id: 'o2', name: 'Oxygen (O₂)', M: 0.0319988 },
  { id: 'co2', name: 'Carbon dioxide (CO₂)', M: 0.0440095 },
];
export const vrms = (T: number, M: number) => Math.sqrt((3 * R_GAS * T) / M);
export const vmean = (T: number, M: number) => Math.sqrt((8 * R_GAS * T) / (Math.PI * M));
export const vmostProbable = (T: number, M: number) => Math.sqrt((2 * R_GAS * T) / M);
export const meanKE = (T: number) => 1.5 * K_B * T;
/** Pressure (Pa) of n mol in V m³ at T K. */
export const idealP = (n: number, T: number, V: number) => (n * R_GAS * T) / V;

export type Disc = { x: number; y: number; vx: number; vy: number };
export type Box = { ps: Disc[]; w: number; h: number; r: number; m: number; impulse: number; time: number };
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** N discs at random places, all moving at the same speed in random directions (they spread into a Maxwell shape). */
export function makeBox(N: number, speed: number, rand: () => number, w = 1, h = 1, r = 0.012): Box {
  const ps: Disc[] = [];
  let tries = 0;
  while (ps.length < N && tries++ < 100000) {
    const x = r + rand() * (w - 2 * r), y = r + rand() * (h - 2 * r);
    if (ps.every((p) => (p.x - x) ** 2 + (p.y - y) ** 2 > 4 * r * r)) { const a = rand() * 2 * Math.PI; ps.push({ x, y, vx: speed * Math.cos(a), vy: speed * Math.sin(a) }); }
  }
  return { ps, w, h, r, m: 1, impulse: 0, time: 0 };
}
/** Move on by dt: straight flight, elastic bounces off the walls (counting the momentum given to them) and between discs. */
export function stepBox(b: Box, dt: number) {
  const { ps, r } = b;
  for (const p of ps) {
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.x < r) { p.x = 2 * r - p.x; if (p.vx < 0) { b.impulse += 2 * b.m * -p.vx; p.vx = -p.vx; } }
    if (p.x > b.w - r) { p.x = 2 * (b.w - r) - p.x; if (p.vx > 0) { b.impulse += 2 * b.m * p.vx; p.vx = -p.vx; } }
    if (p.y < r) { p.y = 2 * r - p.y; if (p.vy < 0) { b.impulse += 2 * b.m * -p.vy; p.vy = -p.vy; } }
    if (p.y > b.h - r) { p.y = 2 * (b.h - r) - p.y; if (p.vy > 0) { b.impulse += 2 * b.m * p.vy; p.vy = -p.vy; } }
  }
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const a = ps[i], c = ps[j], dx = c.x - a.x, dy = c.y - a.y, d2 = dx * dx + dy * dy;
    if (d2 < 4 * r * r && d2 > 0) {
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, rel = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny;
      if (rel > 0) { a.vx -= rel * nx; a.vy -= rel * ny; c.vx += rel * nx; c.vy += rel * ny; }
      const push = (2 * r - d) / 2; a.x -= nx * push; a.y -= ny * push; c.x += nx * push; c.y += ny * push;
    }
  }
  b.time += dt;
}
export const meanSq = (b: Box) => b.ps.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / b.ps.length;
export const kineticEnergy = (b: Box) => 0.5 * b.m * b.ps.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0);
/** Two-dimensional pressure (force per length of wall) measured from the wall collisions so far. Lengths and areas
 *  are those the disc centres can reach (the box shrunk by one radius on each side). */
export const measuredP = (b: Box) => (b.time > 0 ? b.impulse / (b.time * 2 * (b.w + b.h - 4 * b.r)) : NaN);
/** The 2D ideal-gas value P = N m ⟨v²⟩ / (2A). */
export const theoryP = (b: Box) => (b.ps.length * b.m * meanSq(b)) / (2 * (b.w - 2 * b.r) * (b.h - 2 * b.r));
/** 2D Maxwell (Rayleigh) speed distribution with mean square speed ms: f(v) = (2v/ms) exp(−v²/ms). */
export const maxwell2D = (v: number, ms: number) => ((2 * v) / ms) * Math.exp((-v * v) / ms);
/** Scale every speed (heating or cooling the gas): temperature goes with the square of the factor. */
export const scaleSpeeds = (b: Box, f: number) => { for (const p of b.ps) { p.vx *= f; p.vy *= f; } };
/** Hard discs take up room, which raises the pressure a little: P A = N k T (1 + 2η + …), with η the area
 *  fraction the discs cover (second virial coefficient of hard discs, πσ²/2 per disc with σ = 2r). */
export const discCorrection = (b: Box) => 1 + (2 * b.ps.length * Math.PI * b.r * b.r) / ((b.w - 2 * b.r) * (b.h - 2 * b.r));
