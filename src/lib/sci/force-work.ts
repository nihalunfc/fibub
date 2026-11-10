// #1334 Work as the area under a force-displacement graph. The force is a polyline through points (x, F);
// the work between a and b is the exact signed area under it. Plain maths, no DOM. SI units.
export type Pt = [number, number];

/** Force at x by straight lines between the points (sorted by x); flat beyond the ends. */
export function forceAt(pts: Pt[], x: number) {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0); }
  return pts[pts.length - 1][1];
}

/** Signed area under a straight piece from (x0, y0) to (x1, y1), split at a zero crossing: [positive, negative]. */
function piece(x0: number, y0: number, x1: number, y1: number): [number, number] {
  const w = x1 - x0; if (w <= 0) return [0, 0];
  if (y0 >= 0 && y1 >= 0) return [(w * (y0 + y1)) / 2, 0];
  if (y0 <= 0 && y1 <= 0) return [0, (w * (y0 + y1)) / 2];
  const xc = x0 + (w * y0) / (y0 - y1), a = ((xc - x0) * y0) / 2, b = ((x1 - xc) * y1) / 2;
  return y0 > 0 ? [a, b] : [b, a];
}

/** Work from a to b (a < b): total signed area, and its positive and negative parts. */
export function work(pts: Pt[], a: number, b: number) {
  if (b < a) { const r = work(pts, b, a); return { W: -r.W, pos: -r.neg, neg: -r.pos }; }
  const xs = [a, ...pts.map((p) => p[0]).filter((x) => x > a && x < b), b];
  let pos = 0, neg = 0;
  for (let i = 1; i < xs.length; i++) { const [p, n] = piece(xs[i - 1], forceAt(pts, xs[i - 1]), xs[i], forceAt(pts, xs[i])); pos += p; neg += n; }
  return { W: pos + neg, pos, neg };
}

/** Ready-made force graphs on 0 to 10 m. */
export function preset(kind: string, size: number): Pt[] {
  const xs = Array.from({ length: 11 }, (_, i) => i);
  if (kind === 'spring') return xs.map((x) => [x, size * x / 10] as Pt); // F = kx with k = size/10 N/m
  if (kind === 'ramp') return xs.map((x) => [x, size * (1 - x / 10)] as Pt);
  if (kind === 'step') return xs.map((x) => [x, x <= 4 ? size : x <= 7 ? size / 2 : -size / 2] as Pt);
  return xs.map((x) => [x, size] as Pt);
}

/** Speed reached from rest when work W is done on mass m (work-energy theorem), or NaN if W < 0. */
export const speedFrom = (W: number, m: number) => (W >= 0 ? Math.sqrt((2 * W) / m) : NaN);

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(level: '9' | '11', rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const F = pick(rng, 5, 50), s = pick(rng, 2, 20); qs.push({ text: `A steady force of ${F} N pushes a trolley ${s} m in the direction of the force. How much work does it do?`, ans: F * s, unit: 'J', work: `W = F × s = ${F} × ${s} = ${F * s} J. On a graph this is a rectangle ${s} m wide and ${F} N tall.` }); }
  if (level === '9') {
    { const W = pick(rng, 2, 20) * 50, s = pick(rng, 2, 10); qs.push({ text: `A force does ${W} J of work moving a box ${s} m along its direction. How big is the force?`, ans: W / s, unit: 'N', work: `F = W ÷ s = ${W} ÷ ${s} = ${n(W / s)} N.` }); }
    { const m = pick(rng, 2, 20), h = pick(rng, 1, 10); qs.push({ text: `How much work do you do lifting a ${m} kg bag ${h} m straight up at a steady speed? (g = 9.8 m/s²)`, ans: m * 9.8 * h, unit: 'J', work: `The force you need equals the weight, ${m} × 9.8 = ${n(m * 9.8)} N. W = ${n(m * 9.8)} × ${h} = ${n(m * 9.8 * h)} J.` }); }
  } else {
    { const k = pick(rng, 2, 40) * 10, x = pick(rng, 2, 10) / 100; qs.push({ text: `A spring of spring constant ${k} N/m is stretched ${x * 100} cm from its natural length. How much work does it take?`, ans: 0.5 * k * x * x, unit: 'J', work: `F = kx grows in a straight line, so the area is a triangle: W = ½kx² = ½ × ${k} × ${x}² = ${n(0.5 * k * x * x)} J.` }); }
    { const F0 = pick(rng, 2, 10) * 10, d = pick(rng, 2, 10); qs.push({ text: `A force starts at ${F0} N and falls steadily to zero over ${d} m. How much work does it do?`, ans: (F0 * d) / 2, unit: 'J', work: `The graph is a triangle: W = ½ × base × height = ½ × ${d} × ${F0} = ${n((F0 * d) / 2)} J.` }); }
    { const W = pick(rng, 2, 40) * 10, m = pick(rng, 1, 10); qs.push({ text: `${W} J of work is done on a ${m} kg cart that starts at rest on a smooth track. How fast is it going afterwards?`, ans: Math.sqrt((2 * W) / m), unit: 'm/s', work: `The work becomes kinetic energy: ½mv² = ${W}, so v = √(2 × ${W} ÷ ${m}) = ${n(Math.sqrt((2 * W) / m))} m/s.` }); }
  }
  return qs;
}
