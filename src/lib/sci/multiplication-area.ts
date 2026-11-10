// Mental multiplication with the area picture (school maths, the distributive property): split numbers by place
// value into a grid of easy products, or work from a round "base" number, (B + x)(B + y) = B² + B·x + B·y + x·y,
// which gives 103 × 97 = 100² − 3². Plain TypeScript, no DOM.

/** Place-value parts of a whole number, largest first, zeros left out: 147 → [100, 40, 7]. */
export function placeParts(n: number): number[] {
  const out: number[] = [];
  let p = 1;
  while (n > 0) { const d = n % 10; if (d) out.unshift(d * p); n = Math.floor(n / 10); p *= 10; }
  return out.length ? out : [0];
}

/** Grid of partial products for a × b split by place value. */
export function grid(a: number, b: number) {
  const ra = placeParts(a), rb = placeParts(b);
  const cells = ra.map((x) => rb.map((y) => x * y));
  return { ra, rb, cells, total: cells.flat().reduce((s, v) => s + v, 0) };
}

/** Parts of (B + x)(B + y) where x = a − B and y = b − B. */
export function baseParts(a: number, b: number, B: number) {
  const x = a - B, y = b - B;
  return { x, y, BB: B * B, Bx: B * x, By: B * y, xy: x * y, total: B * B + B * x + B * y + x * y };
}

/** A handy round base: the multiple of 100 near both numbers (within 20), else the multiple of 10 nearest their mean. */
export function autoBase(a: number, b: number): number {
  const h = Math.round((a + b) / 200) * 100;
  if (h > 0 && Math.abs(a - h) <= 20 && Math.abs(b - h) <= 20) return h;
  return Math.max(10, Math.round((a + b) / 20) * 10);
}

/** When a and b are the same distance d from their middle m, a × b = m² − d². Null when a + b is odd. */
export function squaresTrick(a: number, b: number): { m: number; d: number } | null {
  if ((a + b) % 2) return null;
  return { m: (a + b) / 2, d: Math.abs(a - b) / 2 };
}
