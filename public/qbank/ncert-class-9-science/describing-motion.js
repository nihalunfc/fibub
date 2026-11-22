// Class 9 Science, Chapter 4 Describing Motion Around Us: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('dm');
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  topic: 'describing-motion', name: 'Describing Motion Around Us', n: 4,
  items: [
    m.mcq(1, 'distance', '<p>Displacement of a body is:</p>', 'the shortest straight-line change of position with its direction', ['the total length of the path travelled', 'always equal to the distance', 'always positive'], '<p>Displacement is a vector from the start to the finish. Distance is the path length.</p>'),
    m.mcq(2, 'distance', '<p>A girl walks 6 m east and then 8 m north. The magnitude of her displacement is:</p>', '10 m', ['14 m', '2 m', '48 m'], '<p>√(6² + 8²) = √100 = 10 m. The distance is 14 m.</p>', { trap: 'Adding 6 and 8: that is the distance, not the displacement.' }),
    m.mcq(2, 'distance', '<p>A runner completes 3 full laps of a 400 m circular track. Her distance and displacement are:</p>', '1200 m and 0', ['1200 m and 1200 m', '0 and 1200 m', '400 m and 400 m'], '<p>The path length is 3 × 400 = 1200 m. She ends where she started, so the displacement is zero.</p>'),
    m.mcq(1, 'speed', '<p>Which quantity is a vector?</p>', 'velocity', ['speed', 'distance', 'time'], '<p>Velocity has direction as well as size. Speed, distance and time are scalars.</p>'),
    m.mcq(2, 'speed', '<p>A car travels half the distance at 30 km/h and the other half at 60 km/h. Its average speed is:</p>', '40 km/h', ['45 km/h', '50 km/h', '30 km/h'], '<p>For distance d each half: times d/30 and d/60. Average = 2d ÷ (d/30 + d/60) = 2 ÷ (1/20) = 40 km/h. It is not the simple mean, because more time is spent at the lower speed.</p>', { trap: 'Taking the average of the two speeds.' }),
    m.mcq(2, 'speed', '<p>90 km/h expressed in m/s is:</p>', '25 m/s', ['90 m/s', '324 m/s', '15 m/s'], '<p>90 ÷ 3.6 = 25 m/s.</p>'),
    m.mcq(1, 'acceleration', '<p>The SI unit of acceleration is:</p>', 'm/s²', ['m/s', 'm²/s', 'kg m/s'], '<p>Acceleration is the change of velocity (m/s) per second, so m/s².</p>'),
    m.mcq(2, 'acceleration', '<p>A body has a negative acceleration. This means:</p>', 'its velocity is decreasing in the chosen positive direction', ['it must be at rest', 'it is moving backwards', 'it has no velocity'], '<p>A negative sign means the acceleration is opposite to the chosen positive direction. A body moving forward with negative acceleration is slowing down.</p>'),
    m.mcq(2, 'graphs', '<p>A position-time graph is a horizontal straight line. The body is:</p>', 'at rest', ['moving with uniform velocity', 'moving with uniform acceleration', 'moving in a circle'], '<p>The position does not change with time, so the slope (velocity) is zero.</p>'),
    m.mcq(2, 'graphs', '<p>The slope of a velocity-time graph gives:</p>', 'acceleration', ['displacement', 'speed', 'distance'], '<p>Slope = change in velocity ÷ change in time = acceleration.</p>'),
    m.mcq(3, 'graphs', '<p>A velocity-time graph is a horizontal line at 8 m/s from t = 0 to t = 5 s. The displacement is:</p>', '40 m', ['8 m', '13 m', '1.6 m'], '<p>The area is a rectangle: 8 × 5 = 40 m.</p>'),
    m.mcq(3, 'graphs', '<p>On a position-time graph the line from t = 0 goes steeply up and then flattens. This shows that the body:</p>', 'was moving fast and then slowed down to rest', ['was accelerating throughout', 'moved backwards at the end', 'moved with constant velocity'], '<p>A steep slope means high speed. The slope reduces to zero where the line is flat, so the body stops.</p>'),
    m.mcq(2, 'equations', '<p>Which equation of motion does <i>not</i> involve the time t?</p>', 'v² = u² + 2as', ['v = u + at', 's = ut + ½at²', 's = ½(u + v)t'], '<p>v² = u² + 2as links the speeds, the acceleration and the displacement only.</p>'),
    m.mcq(2, 'equations', '<p>A bus starts from rest and accelerates at 1.5 m/s² for 8 s. The distance it covers is:</p>', '48 m', ['12 m', '96 m', '24 m'], '<p>s = ut + ½at² = 0 + ½ × 1.5 × 64 = 48 m.</p>'),
    m.mcq(3, 'equations', '<p>A car brakes from 20 m/s at 4 m/s². Its stopping distance is:</p>', '50 m', ['5 m', '80 m', '100 m'], '<p>v² = u² + 2as gives 0 = 400 − 8s, so s = 50 m.</p>'),
    m.mcq(3, 'equations', '<p>The speed of a car is doubled. If the braking acceleration is the same, the stopping distance becomes:</p>', 'four times', ['twice', 'half', 'the same'], '<p>s = u²/2a, so s is proportional to u². Doubling u multiplies s by 4.</p>', { trap: 'Thinking distance is proportional to speed.' }),
    m.mcq(2, 'equations', '<p>A ball is thrown vertically upward. At the highest point:</p>', 'its velocity is zero but its acceleration is 9.8 m/s² downward', ['its velocity and acceleration are both zero', 'its acceleration is zero', 'its velocity is the largest'], '<p>Gravity acts all the time, so a = 9.8 m/s² downward even at the top, where the velocity is momentarily zero.</p>', { trap: 'Believing acceleration is zero where velocity is zero.' }),
    m.mcq(2, 'circular', '<p>In uniform circular motion, which quantity stays constant?</p>', 'the speed', ['the velocity', 'the displacement from the start', 'the direction of motion'], '<p>The speed is constant but the direction keeps changing, so the velocity is not constant.</p>'),
    m.mcq(3, 'circular', '<p>A stone whirled on a string is suddenly released. It moves:</p>', 'in a straight line along the tangent', ['towards the centre', 'in a circle of larger radius', 'radially outwards'], '<p>Without a pull towards the centre, the stone keeps the velocity it had at the instant of release: straight along the tangent.</p>'),
    m.ar(2, 'distance', 'Distance travelled is always greater than or equal to the magnitude of displacement.', 'The shortest path between two points is a straight line.', 0, '<p>Both true, and R explains A: the path is at least as long as the straight line.</p>'),
    m.ar(2, 'graphs', 'The area under a velocity-time graph gives the displacement.', 'Velocity multiplied by time gives displacement.', 0, '<p>Both true; R is the reason for A.</p>'),
    m.ar(3, 'circular', 'A body moving in a circle with constant speed has zero acceleration.', 'Its speed does not change.', 3, '<p>A is false: the velocity changes direction so there is acceleration towards the centre. R is true (the speed is constant) but does not make A true.</p>'),
    m.nat(1, 'speed', '<p>A cyclist covers 150 m in 30 s at a steady speed. Find the speed in m/s.</p>', () => 150 / 30, 0.01, '<p>v = d/t = 150/30 = 5 m/s.</p>', { unit: 'm/s' }),
    m.nat(2, 'acceleration', '<p>A car speeds up from 5 m/s to 25 m/s in 8 s. Find its acceleration in m/s².</p>', () => (25 - 5) / 8, 0.01, '<p>a = (25 − 5)/8 = 2.5 m/s².</p>', { unit: 'm/s²' }),
    m.nat(3, 'equations', '<p>A car starts from rest and covers 200 m with an acceleration of 4 m/s². Find its final speed in m/s.</p>', () => Math.sqrt(2 * 4 * 200), 0.01, '<p>v² = u² + 2as = 0 + 2 × 4 × 200 = 1600, so v = 40 m/s.</p>', { unit: 'm/s' }),
    m.nat(3, 'graphs', '<p>A v-t graph is a straight line from 0 m/s at t = 0 to 12 m/s at t = 6 s. Find the distance covered in metres.</p>', () => 0.5 * 12 * 6, 0.01, '<p>Area of the triangle = ½ × 6 × 12 = 36 m.</p>', { unit: 'm' }),
    m.nat(3, 'circular', '<p>A toy car goes round a circular track of radius 0.5 m once every 2 s. Find its speed in m/s (take π = 3.14).</p>', () => 2 * 3.14 * 0.5 / 2, 0.02, '<p>v = 2πr/T = 2 × 3.14 × 0.5 ÷ 2 = 1.57 m/s.</p>', { unit: 'm/s' }),
    m.msq(2, 'equations', '<p>A body is thrown vertically up and comes back. Taking g = 9.8 m/s², which statements are true? (Choose all that apply.)</p>', ['The acceleration is 9.8 m/s² downward all the time.', 'At the top the velocity is zero.', 'At the top the acceleration is zero.', 'The speed on the way down at the starting level equals the speed thrown up with.'], [0, 1, 3], '<p>Gravity acts all the time, so (A) is true and (C) is false. At the top v = 0. With no air resistance the body returns with the same speed it started with.</p>'),
  ],
  gens: [
    { id: 'dm-g01', type: 'nat', level: 2, exams: ['board'], sub: 'acceleration',
      make(rng) { const u = pick(rng, 0, 15, 5), a = pick(rng, 1, 5, 0.5), t = pick(rng, 2, 10), v = u + a * t; return { u, a, t, v, q: `<p>A car's speed rises from ${u} m/s to ${v} m/s in ${t} s. Find its acceleration in m/s² (2 decimal places).</p>`, answer: r2(a), tol: 0.01, unit: 'm/s²', sol: `<p>a = (v − u)/t = (${v} − ${u})/${t} = ${r2(a)} m/s².</p>` }; },
      verify: (p) => r2((p.v - p.u) / p.t) },
    { id: 'dm-g02', type: 'nat', level: 3, exams: ['board'], sub: 'equations',
      make(rng) { const u = pick(rng, 0, 10, 2), a = pick(rng, 1, 4, 0.5), t = pick(rng, 3, 10); const s = u * t + 0.5 * a * t * t; return { u, a, t, q: `<p>A scooter with initial speed ${u} m/s accelerates at ${a} m/s² for ${t} s. Find the distance covered in metres.</p>`, answer: r2(s), tol: 0.01, unit: 'm', sol: `<p>s = ut + ½at² = ${u} × ${t} + ½ × ${a} × ${t}² = ${r2(s)} m.</p>` }; },
      verify: (p) => r2((p.u + (p.u + p.a * p.t)) / 2 * p.t) },
    { id: 'dm-g03', type: 'nat', level: 3, exams: ['board'], sub: 'equations',
      make(rng) { const u = pick(rng, 10, 30, 5), a = pick(rng, 2, 8, 1); return { u, a, q: `<p>A car moving at ${u} m/s is brought to rest by a steady retardation of ${a} m/s². Find the stopping distance in metres.</p>`, answer: r2(u * u / (2 * a)), tol: 0.01, unit: 'm', sol: `<p>0 = ${u}² − 2 × ${a} × s, so s = ${u * u}/${2 * a} = ${r2(u * u / (2 * a))} m.</p>` }; },
      verify: (p) => { const t = p.u / p.a; return r2(p.u * t - 0.5 * p.a * t * t); } },
    { id: 'dm-g04', type: 'nat', level: 2, exams: ['board'], sub: 'speed',
      make(rng) { const d1 = pick(rng, 30, 120, 30), v1 = pick(rng, 30, 60, 10), v2 = pick(rng, 60, 90, 10); const avg = 2 * d1 / (d1 / v1 + d1 / v2); return { d1, v1, v2, q: `<p>A bus goes ${d1} km at ${v1} km/h and then another ${d1} km at ${v2} km/h. Find its average speed in km/h (1 decimal place).</p>`, answer: +avg.toFixed(1), tol: 0.01, unit: 'km/h', sol: `<p>Total distance ${2 * d1} km; time = ${d1}/${v1} + ${d1}/${v2} = ${(d1 / v1 + d1 / v2).toFixed(3)} h; average = ${avg.toFixed(1)} km/h.</p>` }; },
      verify: (p) => +(2 * p.v1 * p.v2 / (p.v1 + p.v2)).toFixed(1) },
  ],
};
