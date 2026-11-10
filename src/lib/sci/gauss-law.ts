// Gauss's law at school level: the flux through a closed surface counts only the charge inside it, shown by
// counting each charge's own field lines across the surface; and the fields of a long wire, a flat sheet and a
// thin spherical shell found with a Gaussian surface. Board positions in cm, charges in µC. No DOM.
import { EPS0, K } from './em-p34.ts';
import { pick, r3, type Question } from './elec-quiz.ts';

export type Charge = { q: number; x: number; y: number };
export type Surface = { kind: 'circle' | 'square'; cx: number; cy: number; r: number }; // r: radius or half-side

export function isInside(c: { x: number; y: number }, s: Surface) {
  return s.kind === 'circle' ? Math.hypot(c.x - s.cx, c.y - s.cy) < s.r : Math.abs(c.x - s.cx) < s.r && Math.abs(c.y - s.cy) < s.r;
}

/** Charge inside the surface (µC) and the flux through it, Φ = q_in / ε₀ (N m²/C). */
export function flux(cs: Charge[], s: Surface) {
  const qin = cs.filter((c) => isInside(c, s)).reduce((a, c) => a + c.q, 0);
  return { qin, phi: (qin * 1e-6) / EPS0 };
}

/** Distances t > 0 along the ray p + t d where it crosses the surface, with +1 going out and −1 going in. */
export function rayCrossings(px: number, py: number, dx: number, dy: number, s: Surface): { t: number; sign: number }[] {
  const ts: number[] = [];
  if (s.kind === 'circle') {
    const fx = px - s.cx, fy = py - s.cy, b = fx * dx + fy * dy, c = fx * fx + fy * fy - s.r * s.r, D = b * b - c;
    if (D > 0) ts.push(-b - Math.sqrt(D), -b + Math.sqrt(D));
  } else {
    // The four sides x = cx ± r and y = cy ± r.
    for (const [axis, side] of [[0, 1], [0, -1], [1, 1], [1, -1]] as const) {
      const pos = (axis === 0 ? s.cx : s.cy) + side * s.r, p0 = axis === 0 ? px : py, d0 = axis === 0 ? dx : dy;
      if (Math.abs(d0) < 1e-12) continue;
      const t = (pos - p0) / d0, o = axis === 0 ? py + t * dy : px + t * dx, oc = axis === 0 ? s.cy : s.cx;
      if (Math.abs(o - oc) <= s.r + 1e-9) ts.push(t);
    }
  }
  // Keep each place once (a ray through a corner meets two sides there) and only where the ray really goes from
  // outside to inside or back; a ray that just touches the surface does not cross it.
  const out: { t: number; sign: number }[] = [];
  for (const t of ts.filter((t) => t > 1e-9).sort((a, b) => a - b)) {
    if (out.length && Math.abs(out[out.length - 1].t - t) < 1e-7) continue;
    const e = 1e-6, before = isInside({ x: px + (t - e) * dx, y: py + (t - e) * dy }, s), after = isInside({ x: px + (t + e) * dx, y: py + (t + e) * dy }, s);
    if (before !== after) out.push({ t, sign: after ? -1 : 1 });
    else out.push({ t, sign: 0 });
  }
  return out.filter((x) => x.sign !== 0);
}

/** Field lines drawn for each charge: LINES_PER_UC per µC, evenly spread round it. */
export const LINES_PER_UC = 4;

/** Count every charge's own field lines across the surface. The field points out of a positive charge and into a
 *  negative one, so for a negative charge a ray going out across the surface is field going in. */
export function lineCount(cs: Charge[], s: Surface) {
  let out = 0, inn = 0;
  for (const c of cs) {
    const n = Math.round(Math.abs(c.q) * LINES_PER_UC), sg = Math.sign(c.q);
    for (let k = 0; k < n; k++) {
      const a = ((k + 0.5) / n) * 2 * Math.PI;
      for (const x of rayCrossings(c.x, c.y, Math.cos(a), Math.sin(a), s)) { if (x.sign * sg > 0) out++; else inn++; }
    }
  }
  return { out, in: inn, net: out - inn };
}

export type Shape = 'wire' | 'sheet' | 'shell';
/** Field (N/C) at distance r (m) for: a long wire with λ (C/m), a large sheet with σ (C/m²), a thin shell of
 *  charge Q (C) and radius R (m). */
export function symmetricField(shape: Shape, r: number, amount: number, R = 0) {
  if (shape === 'wire') return amount / (2 * Math.PI * EPS0 * r);
  if (shape === 'sheet') return amount / (2 * EPS0);
  return r < R ? 0 : (K * amount) / (r * r);
}

export function questions(rng: () => number = Math.random): Question[] {
  const a = pick(rng, [2, 3, 5]), b = pick(rng, [-1, 1, 4]), c = pick(rng, [6, -7, 9]);
  const qin = a + b, phi = (qin * 1e-6) / EPS0;
  const lam = pick(rng, [1, 2, 4, 5]), r = pick(rng, [10, 20, 50]), Ew = (lam * 1e-6) / (2 * Math.PI * EPS0 * (r / 100));
  const sig = pick(rng, [1, 2, 3, 5]), Es = (sig * 1e-6) / (2 * EPS0);
  const Q = pick(rng, [2, 4, 8]), R = pick(rng, [5, 10]), d = pick(rng, [20, 30, 40]), Eo = (K * Q * 1e-6) / (d / 100) ** 2;
  const qc = pick(rng, [3, 6, 12]), face = (qc * 1e-6) / (6 * EPS0);
  return [
    { text: `A closed surface holds charges of +${a} µC and ${b > 0 ? '+' : '−'}${Math.abs(b)} µC. A ${c > 0 ? '+' : '−'}${Math.abs(c)} µC charge sits outside. What is the flux through the surface, in N m²/C?`, answer: phi, unit: 'N m²/C', tol: 0.02,
      steps: ['Φ = q_inside / ε₀; charges outside add nothing.', `q_inside = ${r3(qin)} µC, so Φ = ${qin} × 10⁻⁶ / 8.85 × 10⁻¹² = ${r3(phi)} N m²/C`] },
    { text: `A long straight wire carries ${lam} µC per metre. What is the field ${r} cm from it, in N/C?`, answer: Ew, unit: 'N/C', tol: 0.02,
      steps: ['A cylinder round the wire: E × 2πrL = λL / ε₀, so E = λ / (2πε₀ r).', `E = ${lam} × 10⁻⁶ / (2π × 8.85 × 10⁻¹² × ${r / 100}) = ${r3(Ew)} N/C`] },
    { text: `A large flat sheet has ${sig} µC on each square metre. What is the field near it, in N/C?`, answer: Es, unit: 'N/C', tol: 0.02,
      steps: ['A pillbox through the sheet: E × 2A = σA / ε₀, so E = σ / (2ε₀), the same at any distance.', `E = ${sig} × 10⁻⁶ / (2 × 8.85 × 10⁻¹²) = ${r3(Es)} N/C`] },
    { text: `A thin spherical shell of radius ${R} cm carries ${Q} µC. What is the field ${d} cm from its centre, in N/C?`, answer: Eo, unit: 'N/C', tol: 0.02,
      steps: ['Outside, a sphere of radius r encloses all of Q: E = kQ / r², as if Q sat at the centre.', `E = 8.99 × 10⁹ × ${Q} × 10⁻⁶ / ${d / 100}² = ${r3(Eo)} N/C`] },
    { text: `A ${qc} µC charge sits at the centre of a cube. What is the flux through one face, in N m²/C?`, answer: face, unit: 'N m²/C', tol: 0.02,
      steps: ['The whole cube gets q / ε₀, shared equally by 6 faces.', `Φ_face = ${qc} × 10⁻⁶ / (6 × 8.85 × 10⁻¹²) = ${r3(face)} N m²/C`] },
  ];
}
