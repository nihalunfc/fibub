// Distance and displacement for the school distance-displacement tool: a walk made of straight legs on a map
// (x east, y north, metres) and a runner going round a circular track at a steady speed. Plain TypeScript, no DOM.
import type { QuizQuestion } from '../school-quiz-b';

export type Pt = { x: number; y: number };

/** Direction of (dx, dy) in words, e.g. "53.1° north of east". */
export function direction(dx: number, dy: number, d = 1) {
  const e = 1e-9;
  if (Math.abs(dx) < e && Math.abs(dy) < e) return 'none';
  if (Math.abs(dy) < e) return dx > 0 ? 'east' : 'west';
  if (Math.abs(dx) < e) return dy > 0 ? 'north' : 'south';
  const th = (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI, r = Math.round(th * 10 ** d) / 10 ** d;
  return `${r}° ${dy > 0 ? 'north' : 'south'} of ${dx > 0 ? 'east' : 'west'}`;
}

/** Compass bearing in degrees clockwise from north (0 to 360). */
export const bearing = (dx: number, dy: number) => ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;

/** Distance travelled along the path and the straight-line displacement from its first to its last point. */
export function walk(pts: Pt[]) {
  let dist = 0;
  for (let i = 1; i < pts.length; i++) dist += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  const a = pts[0] ?? { x: 0, y: 0 }, b = pts[pts.length - 1] ?? a, dx = b.x - a.x, dy = b.y - a.y;
  return { dist, dx, dy, disp: Math.hypot(dx, dy), dir: direction(dx, dy), bearing: bearing(dx, dy), legs: Math.max(0, pts.length - 1) };
}

/** Runner on a circle of radius r (m) at speed v (m/s), starting at the east point going anticlockwise, after t s. */
export function lap(r: number, v: number, t: number) {
  const T = (2 * Math.PI * r) / v, w = v / r, th = w * t;
  const x = r * Math.cos(th), y = r * Math.sin(th), dx = x - r, dy = y;
  const vx = -v * Math.sin(th), vy = v * Math.cos(th);
  return { T, omega: w, angle: th, x, y, arc: v * t, disp: Math.hypot(dx, dy), dx, dy, vx, vy, vdir: direction(vx, vy), ac: (v * v) / r, laps: t / T };
}

const pick = (r: () => number, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const n = (x: number, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d);
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
export function questions(level: 9 | 11, r: () => number = Math.random): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  { const [a, b, c] = TRIPLES[pick(r, 0, TRIPLES.length - 1)], k = pick(r, 1, 5) * 10;
    qs.push({ text: `You walk ${a * k} m east, then ${b * k} m north. What is the size of your displacement?`, ans: c * k, unit: 'm', work: `The two legs are at right angles, so use Pythagoras: √(${a * k}² + ${b * k}²) = ${c * k} m. The distance walked is ${a * k + b * k} m, but the displacement is the straight line from start to finish.` }); }
  { const a = pick(r, 2, 9) * 50, b = pick(r, 1, 8) * 50;
    qs.push({ text: `A dog runs ${a} m along a straight path, then turns round and runs ${b} m back. What total distance does it run?`, ans: a + b, unit: 'm', work: `Distance adds up every metre run, whatever the direction: ${a} + ${b} = ${a + b} m. (Its displacement is only ${Math.abs(a - b)} m.)` }); }
  { const R = pick(r, 2, 10) * 5;
    qs.push({ text: `An athlete runs half a lap of a circular track of radius ${R} m. What is the size of her displacement?`, ans: 2 * R, unit: 'm', work: `After half a lap she is on the opposite side of the circle: displacement = diameter = 2 × ${R} = ${2 * R} m. The distance run is π × ${R} = ${n(Math.PI * R)} m.` }); }
  { const d = pick(r, 4, 20) * 100, t = pick(r, 2, 10) * 60;
    qs.push({ text: `You walk ${d} m round a park in ${t / 60} minutes and end up back where you started. What was your average speed in m/s?`, ans: d / t, unit: 'm/s', work: `Average speed = distance ÷ time = ${d} ÷ ${t} s = ${n(d / t)} m/s. Your average velocity is 0, because your displacement is 0.` }); }
  if (level === 11) {
    const R = pick(r, 2, 10) * 10, v = pick(r, 2, 12);
    qs.push({ text: `A car goes round a circle of radius ${R} m at a steady ${v} m/s. What is the size of its acceleration?`, ans: (v * v) / R, unit: 'm/s²', work: `The speed is steady but the direction keeps changing, so there is a centripetal acceleration a = v² ÷ r = ${v}² ÷ ${R} = ${n((v * v) / R, 3)} m/s², pointing to the centre.` });
  }
  return qs;
}
