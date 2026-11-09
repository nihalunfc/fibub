// A teaching model of the states of matter for the school tool states-of-matter: which state a substance is in
// at a temperature, Kelvin conversion, and a simple particle picture (vibrate in place, slide past, fly apart).
// The particle motion is a cartoon of the real thing (no real forces), driven by a seeded random number generator
// so it can be tested. Plain maths, no DOM.
export type Phase = 'solid' | 'melting' | 'liquid' | 'boiling' | 'gas';
export type Substance = { id: string; name: string; mp: number; bp: number };
/** Melting and boiling points at normal pressure, °C (general rounded values). */
export const SUBSTANCES: Substance[] = [
  { id: 'water', name: 'Water', mp: 0, bp: 100 },
  { id: 'ethanol', name: 'Ethanol (alcohol)', mp: -114, bp: 78 },
  { id: 'oxygen', name: 'Oxygen', mp: -218, bp: -183 },
  { id: 'iron', name: 'Iron', mp: 1538, bp: 2862 },
];
export const toKelvin = (c: number) => c + 273.15;
export const toCelsius = (k: number) => k - 273.15;
export function phaseOf(tC: number, mp: number, bp: number): Phase {
  if (tC < mp) return 'solid';
  if (tC === mp) return 'melting';
  if (tC < bp) return 'liquid';
  if (tC === bp) return 'boiling';
  return 'gas';
}
/** Mean kinetic energy of a gas particle, (3/2) k T, in joules (k = 1.380649e-23 J/K, exact). */
export const meanKE = (tK: number) => 1.5 * 1.380649e-23 * tK;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export type P = { x: number; y: number; vx: number; vy: number; sx: number; sy: number; c: number; liquid: boolean };
/** Particles in a box 0..1 by 0..1 (y = 0 at the bottom), with lattice sites for the solid in the lower middle. */
export function makeParticles(n: number, rand: () => number): P[] {
  const cols = Math.ceil(Math.sqrt(n)), gap = 0.6 / cols, out: P[] = [];
  for (let i = 0; i < n; i++) {
    const sx = 0.2 + gap * ((i % cols) + 0.5), sy = 0.04 + gap * (Math.floor(i / cols) + 0.5);
    out.push({ x: sx, y: sy, vx: 0, vy: 0, sx, sy, c: i % 2, liquid: false });
  }
  for (const p of out) { p.vx = (rand() - 0.5) * 0.01; p.vy = (rand() - 0.5) * 0.01; }
  return out;
}

/**
 * Move the particles on by dt seconds. `heat` (0 cold to 1 hot within the state) sets how lively they are.
 * In a solid each particle shakes about its site; in a liquid particles slide past each other but stay in the bottom
 * of the box, kept apart by a soft push; in a gas they fly straight and bounce off the walls. `fracLiquid` and
 * `fracGas` say how much of the substance has melted or boiled (for the mixtures at the melting and boiling points).
 */
export function step(ps: P[], dt: number, phase: Phase, heat: number, rand: () => number, fracLiquid = 0, fracGas = 0, wall = Infinity) {
  const n = ps.length, R = 0.6 / Math.ceil(Math.sqrt(n));
  ps.forEach((p, i) => {
    const mode: 'solid' | 'liquid' | 'gas' = phase === 'solid' ? 'solid' : phase === 'liquid' ? 'liquid' : phase === 'gas' ? 'gas'
      : phase === 'melting' ? (i / n < fracLiquid ? 'liquid' : 'solid') : (i / n < fracGas ? 'gas' : 'liquid');
    p.liquid = mode === 'liquid';
    if (mode === 'solid') {
      const amp = 0.008 + 0.02 * heat;
      p.vx += (p.sx - p.x) * 400 * dt + (rand() - 0.5) * amp * 15; p.vy += (p.sy - p.y) * 400 * dt + (rand() - 0.5) * amp * 15;
      p.vx *= 0.8; p.vy *= 0.8;
    } else if (mode === 'liquid') {
      const kick = 0.08 + 0.25 * heat;
      p.vx += (rand() - 0.5) * kick; p.vy += (rand() - 0.5) * kick - 1.2 * dt;
      for (let j = 0; j < n; j++) if (j !== i) {
        const q = ps[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < R) { const f = ((R - d) / R) * 3 * dt * 60; p.vx += (dx / d) * f * 0.02; p.vy += (dy / d) * f * 0.02; }
      }
      p.vx *= 0.9; p.vy *= 0.9;
    } else {
      const sp = 0.35 + 0.5 * heat, v = Math.hypot(p.vx, p.vy);
      if (v < 1e-6) { const a = rand() * 2 * Math.PI; p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp; }
      else { const f = 1 + (sp / v - 1) * 0.2; p.vx *= f; p.vy *= f; }
    }
    p.x += p.vx * dt; p.y += p.vy * dt;
    const r = 0.012, lo = r, hi = 1 - r;
    if (p.x < lo) { p.x = lo; p.vx = Math.abs(p.vx); } if (p.x > hi) { p.x = hi; p.vx = -Math.abs(p.vx); }
    if (p.y < lo) { p.y = lo; p.vy = Math.abs(p.vy); } if (p.y > hi) { p.y = hi; p.vy = -Math.abs(p.vy); }
    // An optional divider at x = 0.5 keeps the two colours apart until it is lifted.
    if (wall !== Infinity) { if (p.c === 0 && p.x > 0.5 - r) { p.x = 0.5 - r; p.vx = -Math.abs(p.vx); } if (p.c === 1 && p.x < 0.5 + r) { p.x = 0.5 + r; p.vx = Math.abs(p.vx); } }
  });
}

/** How mixed two colours are: 0 when each stays on its own side, 1 when both are spread evenly. */
export function mixing(ps: P[]) {
  let a = 0, aL = 0, b = 0, bR = 0;
  for (const p of ps) { if (p.c === 0) { a++; if (p.x < 0.5) aL++; } else { b++; if (p.x >= 0.5) bR++; } }
  const sep = ((aL / a) + (bR / b)) / 2; // 1 = fully separated, 0.5 = evenly mixed
  return Math.max(0, Math.min(1, (1 - sep) * 2));
}
