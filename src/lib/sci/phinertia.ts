// Moments of inertia of simple uniform shapes about an axis through their centre, the parallel-axis theorem, and
// composite bodies (parts may be holes with negative mass). Lengths in metres, masses in kg. No DOM.

export type Shape = 'point' | 'rod' | 'cylinder' | 'tube' | 'ring' | 'sphere' | 'shell' | 'hollowsphere' | 'box';
export type Orient = 'along' | 'across';

export const SHAPES: Record<Shape, { name: string; dims: string[]; orient: boolean; formula: Record<Orient, string> }> = {
  point: { name: 'Point mass', dims: [], orient: false, formula: { along: '0', across: '0' } },
  rod: { name: 'Thin rod', dims: ['length L'], orient: true, formula: { across: 'mL²/12', along: '0 (thin)' } },
  cylinder: { name: 'Solid cylinder or disc', dims: ['radius R', 'length h'], orient: true, formula: { along: 'mR²/2', across: 'm(3R² + h²)/12' } },
  tube: { name: 'Thick tube', dims: ['inner radius R₁', 'outer radius R₂', 'length h'], orient: true, formula: { along: 'm(R₁² + R₂²)/2', across: 'm(3(R₁² + R₂²) + h²)/12' } },
  ring: { name: 'Thin ring or hoop', dims: ['radius R'], orient: true, formula: { along: 'mR²', across: 'mR²/2' } },
  sphere: { name: 'Solid sphere', dims: ['radius R'], orient: false, formula: { along: '2mR²/5', across: '2mR²/5' } },
  shell: { name: 'Thin spherical shell', dims: ['radius R'], orient: false, formula: { along: '2mR²/3', across: '2mR²/3' } },
  hollowsphere: { name: 'Thick hollow sphere', dims: ['inner radius R₁', 'outer radius R₂'], orient: false, formula: { along: '2m(R₂⁵ − R₁⁵)/5(R₂³ − R₁³)', across: '2m(R₂⁵ − R₁⁵)/5(R₂³ − R₁³)' } },
  box: { name: 'Box or plate', dims: ['side a (across the axis)', 'side b (across the axis)'], orient: false, formula: { along: 'm(a² + b²)/12', across: 'm(a² + b²)/12' } },
};

/** Moment of inertia of one uniform part about the axis through its own centre (parallel to the chosen axis). */
export function centralI(shape: Shape, m: number, d: number[], o: Orient = 'along'): number {
  const [p, q, r] = d;
  switch (shape) {
    case 'point': return 0;
    case 'rod': return o === 'across' ? (m * p * p) / 12 : 0;
    case 'cylinder': return o === 'along' ? (m * p * p) / 2 : (m * (3 * p * p + q * q)) / 12;
    case 'tube': return o === 'along' ? (m * (p * p + q * q)) / 2 : (m * (3 * (p * p + q * q) + r * r)) / 12;
    case 'ring': return o === 'along' ? m * p * p : (m * p * p) / 2;
    case 'sphere': return (2 * m * p * p) / 5;
    case 'shell': return (2 * m * p * p) / 3;
    case 'hollowsphere': return q === p ? (2 * m * p * p) / 3 : (2 * m * (q ** 5 - p ** 5)) / (5 * (q ** 3 - p ** 3));
    case 'box': return (m * (p * p + q * q)) / 12;
  }
}

export type Part = { shape: Shape; m: number; dims: number[]; orient?: Orient; x: number; y: number; hole?: boolean; name?: string };

/** Totals for a composite body about the axis at (0, 0), and about the parallel axis through its centre of mass. */
export function composite(parts: Part[]) {
  const rows = parts.map((p) => {
    const m = p.hole ? -p.m : p.m, Ic = centralI(p.shape, m, p.dims, p.orient ?? 'along'), d2 = p.x * p.x + p.y * p.y;
    return { ...p, mSigned: m, Ic, d: Math.sqrt(d2), md2: m * d2, I: Ic + m * d2 };
  });
  const M = rows.reduce((s, r) => s + r.mSigned, 0), I = rows.reduce((s, r) => s + r.I, 0);
  const cx = rows.reduce((s, r) => s + r.mSigned * r.x, 0) / M, cy = rows.reduce((s, r) => s + r.mSigned * r.y, 0) / M;
  const dcm = Math.hypot(cx, cy), Icm = I - M * dcm * dcm;
  return { rows, M, I, k: Math.sqrt(I / M), cx, cy, dcm, Icm, kcm: Math.sqrt(Icm / M) };
}
