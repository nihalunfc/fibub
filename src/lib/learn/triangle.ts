// Solve a triangle with the sine law and the cosine law. Angles in degrees. Pure maths, no page code.
// Sides a, b, c sit opposite angles A, B, C.
export type Tri = { A: number; B: number; C: number; a: number; b: number; c: number };
export type Case = 'AAS' | 'SAS' | 'SSS' | 'SSA';
const D = Math.PI / 180;
const ok = (x: number) => Number.isFinite(x) && x > 0;
const acosD = (x: number) => Math.acos(Math.max(-1, Math.min(1, x))) / D;

/** AAS: angles A and B and side a. SAS: sides b, c and the angle A between them. SSS: sides a, b, c.
 *  SSA: sides a, b and angle A opposite a (zero, one or two triangles). */
export function solveTriangle(kind: Case, x: number, y: number, z: number): { tris: Tri[]; law: string; error?: string } {
  if (![x, y, z].every(ok)) return { tris: [], law: '', error: 'Every value must be a positive number.' };
  if (kind === 'AAS') {
    const A = x, B = y, a = z, C = 180 - A - B;
    if (C <= 0) return { tris: [], law: '', error: 'The two angles must add up to less than 180°.' };
    const k = a / Math.sin(A * D);
    return { tris: [{ A, B, C, a, b: k * Math.sin(B * D), c: k * Math.sin(C * D) }], law: 'Sine law: a / sin A = b / sin B = c / sin C' };
  }
  if (kind === 'SAS') {
    const b = x, c = y, A = z;
    if (A >= 180) return { tris: [], law: '', error: 'The angle must be less than 180°.' };
    const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * D));
    const B = acosD((a * a + c * c - b * b) / (2 * a * c));
    return { tris: [{ A, B, C: 180 - A - B, a, b, c }], law: 'Cosine law: a² = b² + c² − 2bc cos A, then the cosine law again for B' };
  }
  if (kind === 'SSS') {
    const a = x, b = y, c = z;
    if (a + b <= c || a + c <= b || b + c <= a) return { tris: [], law: '', error: 'No triangle: the two shorter sides must add up to more than the longest side.' };
    const A = acosD((b * b + c * c - a * a) / (2 * b * c)), B = acosD((a * a + c * c - b * b) / (2 * a * c));
    return { tris: [{ A, B, C: 180 - A - B, a, b, c }], law: 'Cosine law: cos A = (b² + c² − a²) / 2bc' };
  }
  const a = x, b = y, A = z; // SSA
  if (A >= 180) return { tris: [], law: '', error: 'The angle must be less than 180°.' };
  const s = (b * Math.sin(A * D)) / a;
  const law = 'Sine law: sin B = b sin A / a (the ambiguous case)';
  if (s > 1 + 1e-12) return { tris: [], law, error: 'No triangle: side a is too short to reach the base.' };
  const B1 = Math.asin(Math.min(1, s)) / D, out: Tri[] = [];
  for (const B of s >= 1 - 1e-12 ? [90] : [B1, 180 - B1]) {
    const C = 180 - A - B;
    if (C > 1e-9) out.push({ A, B, C, a, b, c: (a * Math.sin(C * D)) / Math.sin(A * D) });
  }
  if (!out.length) return { tris: [], law, error: 'No triangle: the angles would add up to more than 180°.' };
  return { tris: out, law };
}
