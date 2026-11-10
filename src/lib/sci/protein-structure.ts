// Protein structure levels (Learn #1395). No DOM. Masses come from fibub's peptide library (residue formulas and
// IUPAC atomic weights). Helix and strand sizes are the usual rounded textbook values: an α-helix has 3.6 residues
// per turn and rises 0.15 nm per residue (pitch 0.54 nm); a stretched β-strand spans about 0.33 nm per residue.
// The folding picture uses a simple 2D "hydrophobic-polar" bead model (springs along the chain, water-fearing beads
// attracting each other, heat as random kicks). It shows the idea, not real folding.
import { peptideMass } from './peptide.ts';
import { RESIDUES } from './protparam.ts';

export const HYDROPHOBIC = new Set('AVLIMFWC');
export const RISE = 0.15, PER_TURN = 3.6, STRAND = 0.33;

/** Keep only the 20 standard one-letter codes, upper case. */
export const clean = (s: string) => [...s.toUpperCase()].filter((c) => RESIDUES[c]).join('');
export const three = (c: string) => RESIDUES[c]?.three ?? '?';

export function primary(seq: string) {
  const n = seq.length;
  return { n, bonds: Math.max(0, n - 1), water: Math.max(0, n - 1), mass: n ? peptideMass(seq).avg : 0, sequences: Math.pow(20, n), hydrophobic: [...seq].filter((c) => HYDROPHOBIC.has(c)).length };
}
export const helix = (n: number) => ({ length: n * RISE, turns: n / PER_TURN, pitch: RISE * PER_TURN });
export const strand = (n: number) => n * STRAND;

/** A tiny seeded random number generator, so the folding can be replayed in tests. */
export function rng(seed = 1) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export type Bead = { x: number; y: number; h: boolean };
/** Start as a straight chain along x, one unit apart. */
export const extended = (seq: string): Bead[] => [...seq].map((c, i) => ({ x: i - (seq.length - 1) / 2, y: 0, h: HYDROPHOBIC.has(c) }));

/**
 * One time step of the bead model. tempC is the temperature in °C: up to about 50 °C the water-fearing beads hold
 * together; above about 60 °C the random kicks win and the chain unfolds (denatures).
 */
export function foldStep(b: Bead[], tempC: number, dt: number, rand: () => number) {
  const n = b.length, fx = new Array(n).fill(0), fy = new Array(n).fill(0);
  const stick = tempC < 60 ? 1.2 * (1 - Math.max(0, tempC - 30) / 40) : 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const dx = b[j].x - b[i].x, dy = b[j].y - b[i].y, d = Math.hypot(dx, dy) || 1e-6, ux = dx / d, uy = dy / d;
    let f = 0;
    if (j === i + 1) f += 30 * (d - 1); // bond spring
    if (d < 0.9) f -= 40 * (0.9 - d); // beads cannot overlap
    if (b[i].h && b[j].h && j > i + 2 && d < 4) f += stick * (d > 1.05 ? 1 : 0); // hydrophobic beads pull together
    if (!(b[i].h && b[j].h) && j > i + 1 && d < 1.6) f -= 2 * (1.6 - d); // polar beads like room (water around them)
    fx[i] += f * ux; fy[i] += f * uy; fx[j] -= f * ux; fy[j] -= f * uy;
  }
  const kick = 0.6 + Math.max(0, tempC - 20) * 0.06;
  for (let i = 0; i < n; i++) {
    b[i].x += (fx[i] * dt * 0.5) + (rand() - 0.5) * kick * Math.sqrt(dt);
    b[i].y += (fy[i] * dt * 0.5) + (rand() - 0.5) * kick * Math.sqrt(dt);
  }
}

/** Radius of gyration (bead units) and how many water-fearing beads are buried (4 or more beads within 1.6 units). */
export function shape(b: Bead[]) {
  const n = b.length || 1, cx = b.reduce((s, p) => s + p.x, 0) / n, cy = b.reduce((s, p) => s + p.y, 0) / n;
  const rg = Math.sqrt(b.reduce((s, p) => s + (p.x - cx) ** 2 + (p.y - cy) ** 2, 0) / n);
  let buried = 0;
  for (const p of b) if (p.h && b.filter((o) => o !== p && Math.hypot(o.x - p.x, o.y - p.y) < 1.6).length >= 4) buried++;
  return { rg, buried };
}
