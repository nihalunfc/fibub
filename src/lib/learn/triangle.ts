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

// ---- Added 2026-11-16: the working as an exam answer, plus area and perimeter ----
const n4 = (v: number) => String(+v.toPrecision(4)).replace('-', '−');
const sinD = (d: number) => Math.sin(d * D), cosD = (d: number) => Math.cos(d * D);

/** The solution written step by step. `x, y, z` are the three typed numbers (angles in degrees); `t` is the chosen triangle, `which` 0 or 1 for the ambiguous case. */
export function working(kind: Case, x: number, y: number, z: number, t: Tri, which = 0): string[] {
  const L: string[] = [];
  if (kind === 'AAS') {
    L.push(`Angles add to 180°: C = 180° − ${n4(t.A)}° − ${n4(t.B)}° = ${n4(t.C)}°.`);
    L.push(`Sine law: a / sin A = b / sin B, so b = a sin B / sin A = ${n4(t.a)} × sin ${n4(t.B)}° / sin ${n4(t.A)}° = ${n4(t.a)} × ${n4(sinD(t.B))} / ${n4(sinD(t.A))} = ${n4(t.b)}.`);
    L.push(`Again: c = a sin C / sin A = ${n4(t.a)} × sin ${n4(t.C)}° / sin ${n4(t.A)}° = ${n4(t.a)} × ${n4(sinD(t.C))} / ${n4(sinD(t.A))} = ${n4(t.c)}.`);
  } else if (kind === 'SAS') {
    const sq = t.b * t.b + t.c * t.c - 2 * t.b * t.c * cosD(t.A);
    L.push(`Cosine law: a² = b² + c² − 2bc cos A = ${n4(t.b)}² + ${n4(t.c)}² − 2(${n4(t.b)})(${n4(t.c)}) cos ${n4(t.A)}° = ${n4(sq)}, so a = ${n4(t.a)}.`);
    L.push(`Cosine law again: cos B = (a² + c² − b²) / 2ac = (${n4(t.a * t.a)} + ${n4(t.c * t.c)} − ${n4(t.b * t.b)}) / (2 × ${n4(t.a)} × ${n4(t.c)}) = ${n4(cosD(t.B))}, so B = ${n4(t.B)}°.`);
    L.push(`Angles add to 180°: C = 180° − ${n4(t.A)}° − ${n4(t.B)}° = ${n4(t.C)}°.`);
  } else if (kind === 'SSS') {
    L.push(`Cosine law: cos A = (b² + c² − a²) / 2bc = (${n4(t.b * t.b)} + ${n4(t.c * t.c)} − ${n4(t.a * t.a)}) / (2 × ${n4(t.b)} × ${n4(t.c)}) = ${n4(cosD(t.A))}, so A = ${n4(t.A)}°.`);
    L.push(`cos B = (a² + c² − b²) / 2ac = (${n4(t.a * t.a)} + ${n4(t.c * t.c)} − ${n4(t.b * t.b)}) / (2 × ${n4(t.a)} × ${n4(t.c)}) = ${n4(cosD(t.B))}, so B = ${n4(t.B)}°.`);
    L.push(`Angles add to 180°: C = 180° − ${n4(t.A)}° − ${n4(t.B)}° = ${n4(t.C)}°.`);
  } else {
    const s = (t.b * sinD(t.A)) / t.a;
    L.push(`Sine law: sin B = b sin A / a = ${n4(t.b)} × sin ${n4(t.A)}° / ${n4(t.a)} = ${n4(s)}.`);
    L.push(`B = sin⁻¹(${n4(s)}) = ${n4(Math.asin(Math.min(1, s)) / D)}°${which === 1 ? `, or the other angle with the same sine: 180° − ${n4(Math.asin(Math.min(1, s)) / D)}° = ${n4(t.B)}° (second triangle).` : '. (When a is shorter than b, 180° minus this angle also has the same sine: see the second triangle.)'}`);
    L.push(`C = 180° − ${n4(t.A)}° − ${n4(t.B)}° = ${n4(t.C)}°, and c = a sin C / sin A = ${n4(t.a)} × ${n4(sinD(t.C))} / ${n4(sinD(t.A))} = ${n4(t.c)}.`);
  }
  return L;
}

/** Area ½ bc sin A, perimeter, and the kind of triangle. */
export function describe(t: Tri) {
  const area = 0.5 * t.b * t.c * sinD(t.A), perimeter = t.a + t.b + t.c, big = Math.max(t.A, t.B, t.C);
  const type = Math.abs(big - 90) < 1e-6 ? 'right-angled' : big > 90 ? 'obtuse' : 'acute';
  const eq = (u: number, v: number) => Math.abs(u - v) < 1e-6 * Math.max(1, u, v);
  const sides = eq(t.a, t.b) && eq(t.b, t.c) ? 'equilateral' : eq(t.a, t.b) || eq(t.b, t.c) || eq(t.a, t.c) ? 'isosceles' : 'scalene';
  return { area, perimeter, type, sides };
}
