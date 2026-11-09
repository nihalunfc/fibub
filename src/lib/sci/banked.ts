// A car going round a banked curve for the school banked-curve tool: the normal force and the friction
// needed at a given speed, the ideal (no-friction) speed and the safe speed range with friction μ.
// Plain TypeScript, no DOM.

export const G = 9.8; // m/s², rounded school value
const rad = (d: number) => (d * Math.PI) / 180;

/** Forces per kg at speed v (m/s), radius r (m), bank angle (degrees). f > 0 acts down the slope (the car tends to slide out). */
export function forces(v: number, r: number, angle: number, g = G) {
  const th = rad(angle), ac = (v * v) / r;
  const N = g * Math.cos(th) + ac * Math.sin(th), f = ac * Math.cos(th) - g * Math.sin(th);
  return { N, f, ac, muNeeded: Math.abs(f) / N };
}

/** Ideal speed (no friction needed), and the slowest and fastest safe speeds with friction μ (m/s). vMax is Infinity when no speed can make it skid out. */
export function speeds(r: number, angle: number, mu: number, g = G) {
  const th = rad(angle), s = Math.sin(th), c = Math.cos(th);
  const ideal = Math.sqrt(r * g * Math.tan(th));
  const top = c - mu * s, vMax = top <= 1e-12 ? Infinity : Math.sqrt((r * g * (s + mu * c)) / top);
  const low = s - mu * c, vMin = low <= 0 ? 0 : Math.sqrt((r * g * low) / (c + mu * s));
  return { ideal, vMin, vMax };
}

export type Verdict = 'safe' | 'out' | 'in';
export function verdict(v: number, r: number, angle: number, mu: number, g = G): Verdict {
  const { f, N } = forces(v, r, angle, g);
  if (Math.abs(f) <= mu * N + 1e-12) return 'safe';
  return f > 0 ? 'out' : 'in';
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const v = pick(rng, 5, 25), r = pick(rng, 2, 20) * 10, a = (v * v) / r; qs.push({ text: `A car goes round a curve of radius ${r} m at ${v} m/s. What is its centripetal acceleration?`, ans: a, unit: 'm/s²', work: `a = v² ÷ r = ${v}² ÷ ${r} = ${n(a)} m/s², pointing towards the centre of the curve.` }); }
  { const r = pick(rng, 2, 20) * 10, mu = pick(rng, 2, 8) / 10, v = Math.sqrt(mu * r * 9.8); qs.push({ text: `On a flat road the friction coefficient between tyres and road is ${mu}. What is the fastest a car can take a curve of radius ${r} m? (g = 9.8 m/s²)`, ans: v, unit: 'm/s', work: `Friction gives the centripetal force: m v²/r ≤ μ m g, so v ≤ √(μ r g) = √(${mu} × ${r} × 9.8) = ${n(v)} m/s.` }); }
  { const ang = [15, 30, 45][pick(rng, 0, 2)], tn = [Math.tan(rad(15)), Math.tan(rad(30)), 1][[15, 30, 45].indexOf(ang)], r = pick(rng, 2, 20) * 10, v = Math.sqrt(r * 9.8 * tn);
    qs.push({ text: `A track is banked at ${ang}° on a curve of radius ${r} m. At what speed does a car need no friction at all? (g = 9.8 m/s²)`, ans: v, unit: 'm/s', work: `With no friction, tan θ = v²/(r g), so v = √(r g tan θ) = √(${r} × 9.8 × ${n(tn)}) = ${n(v)} m/s.` }); }
  { const v = pick(rng, 10, 30), r = pick(rng, 5, 30) * 10, th = (Math.atan((v * v) / (r * 9.8)) * 180) / Math.PI; qs.push({ text: `At what angle (in degrees) should a curve of radius ${r} m be banked so that cars at ${v} m/s need no friction? (g = 9.8 m/s²)`, ans: th, unit: '°', work: `tan θ = v²/(r g) = ${v * v} ÷ ${n(r * 9.8)} = ${n((v * v) / (r * 9.8))}, so θ = ${n(th)}°.` }); }
  return qs;
}
