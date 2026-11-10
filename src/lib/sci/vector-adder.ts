// #1331 Vector adder: adding two vectors in a plane (triangle and parallelogram laws, components) and three
// forces in balance (Lami's theorem). Plain maths, no DOM. Angles in degrees, measured anticlockwise from +x.
const RAD = Math.PI / 180;

export type Vec = { x: number; y: number };
export const fromPolar = (mag: number, deg: number): Vec => ({ x: mag * Math.cos(deg * RAD), y: mag * Math.sin(deg * RAD) });
export const mag = (v: Vec) => Math.hypot(v.x, v.y);
/** Direction in degrees from 0 to 360. */
export const dir = (v: Vec) => { const a = Math.atan2(v.y, v.x) / RAD; return a < 0 ? a + 360 : a; };

/** Angle between two vectors (0 to 180°). */
export function between(a: Vec, b: Vec) {
  const m = mag(a) * mag(b); if (m === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, (a.x * b.x + a.y * b.y) / m))) / RAD;
}

/** Resultant of A and B by components, plus the law-of-cosines form |R|² = A² + B² + 2AB cos θ and the angle
 *  α that R makes with A (tan α = B sin θ / (A + B cos θ)). */
export function add(a: Vec, b: Vec) {
  const r = { x: a.x + b.x, y: a.y + b.y }, A = mag(a), B = mag(b), th = between(a, b);
  const law = Math.sqrt(Math.max(0, A * A + B * B + 2 * A * B * Math.cos(th * RAD)));
  const alpha = Math.atan2(B * Math.sin(th * RAD), A + B * Math.cos(th * RAD)) / RAD;
  return { r, R: mag(r), dir: dir(r), A, B, theta: th, law, alpha, diff: { x: a.x - b.x, y: a.y - b.y } };
}

/** A weight W hangs from two strings that make angles t1 and t2 with the ceiling (left and right, 0 to 89°).
 *  Lami's theorem: T1 / sin(angle between T2 and W) = T2 / sin(angle between T1 and W) = W / sin(angle between T1 and T2). */
export function lami(W: number, t1: number, t2: number) {
  // String 1 points up-left at 180 − t1, string 2 up-right at t2, weight down at 270.
  const d1 = 180 - t1, d2 = t2, dW = 270;
  const a1 = 360 - (dW - d2), a2 = dW - d1, aW = d1 - d2; // angle opposite each force (between the other two)
  const k = W / Math.sin(aW * RAD);
  const T1 = k * Math.sin(a1 * RAD), T2 = k * Math.sin(a2 * RAD);
  return { T1, T2, a1, a2, aW, d1, d2, ok: aW > 0 && aW < 180 };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const a = pick(rng, 3, 12), b = pick(rng, 3, 12), r = Math.hypot(a, b);
    qs.push({ text: `You walk ${a} m east, then ${b} m north. How far are you from the start, in a straight line?`, ans: r, unit: 'm', work: `The two walks are at 90°, so R = √(${a}² + ${b}²) = √${a * a + b * b} = ${n(r)} m.` }); }
  { const A = pick(rng, 3, 10), B = pick(rng, 3, 10), th = [60, 90, 120][pick(rng, 0, 2)], R = Math.sqrt(A * A + B * B + 2 * A * B * Math.cos(th * RAD));
    qs.push({ text: `Two forces of ${A} N and ${B} N act on the same point with ${th}° between them. What is the size of their resultant?`, ans: R, unit: 'N', work: `R = √(A² + B² + 2AB cos θ) = √(${A * A} + ${B * B} + 2 × ${A} × ${B} × ${n(Math.cos(th * RAD))}) = ${n(R)} N.` }); }
  { const F = pick(rng, 10, 50), th = [30, 37, 45, 53, 60][pick(rng, 0, 4)], x = F * Math.cos(th * RAD);
    qs.push({ text: `A force of ${F} N pulls at ${th}° above the horizontal. What is its horizontal component?`, ans: x, unit: 'N', work: `Fx = F cos θ = ${F} × cos ${th}° = ${n(x)} N.` }); }
  { const W = pick(rng, 2, 10) * 10, t = [30, 45, 60][pick(rng, 0, 2)], T = W / (2 * Math.sin(t * RAD));
    qs.push({ text: `A ${W} N lamp hangs from two equal strings, each at ${t}° to the ceiling. What is the tension in each string?`, ans: T, unit: 'N', work: `The two upward parts hold the weight: 2T sin ${t}° = ${W}, so T = ${W} ÷ (2 × ${n(Math.sin(t * RAD))}) = ${n(T)} N.` }); }
  return qs;
}
