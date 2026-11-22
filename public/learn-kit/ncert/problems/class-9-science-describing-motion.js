// Class 9 Science, Chapter 4 Describing Motion Around Us: live problems (original fibub questions). Ids start with c9s-mot-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-mot-avgspeed': {
    title: 'average speed over two legs',
    make(r) {
      const d1 = pick(r, 20, 120, 10), v1 = pick(r, 40, 80, 10), d2 = pick(r, 20, 120, 10), v2 = pick(r, 20, 60, 10);
      const t1 = d1 / v1, t2 = d2 / v2, answer = (d1 + d2) / (t1 + t2);
      return { d1, v1, d2, v2, q: `<p>A bus covers ${d1} km at ${v1} km/h and then ${d2} km at ${v2} km/h along the same road. What is its average speed for the whole trip, in km/h?</p>`, answer, unit: 'km/h', tol: 0.01,
        hint: 'Average speed = total distance ÷ total time (not the average of the two speeds). Find each time first: t = d/v.',
        solution: steps(`t₁ = ${d1}/${v1} = ${n(t1)} h and t₂ = ${d2}/${v2} = ${n(t2)} h.`, `Total distance = ${d1 + d2} km, total time = ${n(t1 + t2)} h.`, `Average speed = ${d1 + d2} ÷ ${n(t1 + t2)} = <b>${n(answer)} km/h</b>.`) };
    },
    verify: (x) => (x.d1 + x.d2) / (x.d1 / x.v1 + x.d2 / x.v2),
  },
  'c9s-mot-circle': {
    title: 'distance and displacement on a circular track',
    make(r) {
      const rad = pick(r, 20, 100, 10), ask = choose(r, ['dist', 'disp']);
      if (ask === 'dist') return { rad, ask, q: `<p>An athlete runs once round a circular track of radius ${rad} m, ending where she started. What is the <b>distance</b> she ran, in metres?</p>`, answer: 2 * Math.PI * rad, unit: 'm', tol: 0.01, hint: 'Distance is the length of the path: the circumference 2πr.', solution: steps(`Distance = 2πr = 2 × 3.14 × ${rad}.`, `= <b>${n(2 * Math.PI * rad)} m</b>.`) };
      return { rad, ask, q: `<p>An athlete runs <b>half</b> way round a circular track of radius ${rad} m, from one end of a diameter to the other. What is the magnitude of her <b>displacement</b>, in metres?</p>`, answer: 2 * rad, unit: 'm', tol: 0.01, hint: 'Displacement is the straight line from start to finish: here a diameter.', solution: steps(`Start and finish are at opposite ends of a diameter.`, `Displacement = diameter = 2 × ${rad} = <b>${2 * rad} m</b>.`) };
    },
    verify: (x) => (x.ask === 'dist' ? 2 * Math.PI * x.rad : x.rad + x.rad),
  },
  'c9s-mot-accel': {
    title: 'acceleration from a change in speed',
    make(r) {
      const u = pick(r, 0, 20, 2), t = pick(r, 2, 12), a = pick(r, 1, 5, 0.5), v = u + a * t;
      return { u, v, t, q: `<p>A scooter's speed rises from ${u} m/s to ${n(v)} m/s in ${t} s. Find its acceleration in m/s².</p>`, answer: a, unit: 'm/s²', tol: 0.01,
        hint: 'a = (v − u)/t.', solution: steps(`Change in speed = ${n(v)} − ${u} = ${n(v - u)} m/s.`, `a = ${n(v - u)} ÷ ${t} = <b>${n(a)} m/s²</b>.`) };
    },
    verify: (x) => (x.v - x.u) / x.t,
  },
  'c9s-mot-v-eq': {
    title: 'final speed with v = u + at',
    make(r) {
      const u = pick(r, 2, 20, 2), a = pick(r, 1, 4, 0.5), t = pick(r, 3, 10), answer = u + a * t;
      return { u, a, t, q: `<p>A cyclist moving at ${u} m/s speeds up uniformly at ${n(a)} m/s² for ${t} s. Find her final speed in m/s.</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'v = u + at.', solution: steps(`v = u + at = ${u} + ${n(a)} × ${t}.`, `v = <b>${n(answer)} m/s</b>.`) };
    },
    verify: (x) => Math.sqrt(x.u * x.u + 2 * x.a * (x.u * x.t + 0.5 * x.a * x.t * x.t)),
  },
  'c9s-mot-s-eq': {
    title: 'distance with s = ut + ½at²',
    make(r) {
      const u = pick(r, 0, 12, 2), a = pick(r, 1, 5, 0.5), t = pick(r, 3, 12), answer = u * t + 0.5 * a * t * t;
      return { u, a, t, q: `<p>A train leaving a station at ${u} m/s accelerates uniformly at ${n(a)} m/s² for ${t} s. How far does it travel in this time, in metres?</p>`, answer, unit: 'm', tol: 0.01,
        hint: 's = ut + ½at².', solution: steps(`s = ut + ½at² = ${u} × ${t} + ½ × ${n(a)} × ${t}².`, `s = ${n(u * t)} + ${n(0.5 * a * t * t)} = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => 0.5 * (x.u + (x.u + x.a * x.t)) * x.t,
  },
  'c9s-mot-brake': {
    title: 'braking distance with v² = u² + 2as',
    make(r) {
      const u = pick(r, 10, 30, 5), a = pick(r, 2, 8, 1), answer = (u * u) / (2 * a);
      return { u, a, q: `<p>A car travelling at ${u} m/s brakes with a steady retardation of ${a} m/s² until it stops. How far does it travel while braking, in metres?</p>`, answer, unit: 'm', tol: 0.01,
        hint: 'Final speed v = 0, acceleration is −a. Use v² = u² + 2as and solve for s.',
        solution: steps(`0 = ${u}² + 2 × (−${a}) × s.`, `s = ${u}² ÷ (2 × ${a}) = ${u * u} ÷ ${2 * a} = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => { const t = x.u / x.a; return x.u * t - 0.5 * x.a * t * t; },
  },
  'c9s-mot-vtarea': {
    title: 'distance from the area of a v-t graph',
    make(r) {
      const v = pick(r, 10, 30, 5), t1 = pick(r, 4, 10, 2), t2 = pick(r, 10, 30, 5), t3 = pick(r, 4, 10, 2);
      const answer = 0.5 * v * t1 + v * t2 + 0.5 * v * t3;
      return { v, t1, t2, t3, q: `<p>A train speeds up steadily from rest to ${v} m/s in ${t1} s, runs at ${v} m/s for ${t2} s, then slows steadily to rest in ${t3} s. Using the area under its velocity-time graph, find the total distance in metres.</p>`, answer, unit: 'm', tol: 0.01,
        hint: 'Split the area into two triangles and a rectangle: ½ × base × height and base × height.',
        solution: steps(`Speeding up (triangle): ½ × ${t1} × ${v} = ${n(0.5 * v * t1)} m.`, `Steady (rectangle): ${t2} × ${v} = ${v * t2} m.`, `Slowing (triangle): ½ × ${t3} × ${v} = ${n(0.5 * v * t3)} m.`, `Total = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => 0.5 * (x.t1 + 2 * x.t2 + x.t3) * x.v,
  },
  'c9s-mot-circspeed': {
    title: 'speed in uniform circular motion',
    make(r) {
      const rad = pick(r, 0.5, 3, 0.5), T = pick(r, 0.5, 4, 0.5), answer = (2 * Math.PI * rad) / T;
      return { rad, T, q: `<p>A stone tied to a string is whirled in a circle of radius ${n(rad)} m and takes ${n(T)} s for one full turn. Find its speed in m/s.</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'In one period T it covers the circumference 2πr, so v = 2πr/T.',
        solution: steps(`Circumference = 2πr = 2 × 3.14 × ${n(rad)} = ${n(2 * Math.PI * rad)} m.`, `v = ${n(2 * Math.PI * rad)} ÷ ${n(T)} = <b>${n(answer)} m/s</b>.`) };
    },
    verify: (x) => Math.PI * 2 * x.rad * (1 / x.T),
  },
};
