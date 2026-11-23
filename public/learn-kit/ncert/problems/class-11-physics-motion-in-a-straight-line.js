// Class 11 Physics, Motion in a Straight Line: live problems (original fibub questions). Ids start with c11p-line-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-line-avg': {
    title: 'average speed over two stretches',
    make(r) {
      const d = pick(r, 60, 180, 30), v1 = choose(r, [40, 50, 60]), v2 = choose(r, [20, 30, 90]), ans = (2 * d) / (d / v1 + d / v2);
      return { d, v1, v2, q: `<p>A bus covers ${d} km at ${v1} km/h and then another ${d} km at ${v2} km/h along the same road. What is its average speed for the whole trip?</p>`, answer: ans, unit: 'km/h', tol: 0.01,
        hint: 'Average speed = total distance ÷ total time (not the average of the two speeds).',
        solution: steps(`Time = ${d}/${v1} + ${d}/${v2} = ${n(d / v1 + d / v2, 4)} h.`, `Total distance = ${2 * d} km.`, `Average speed = ${2 * d}/${n(d / v1 + d / v2, 4)} = <b>${n(ans)} km/h</b>.`) };
    },
    verify: (x) => 2 / (1 / x.v1 + 1 / x.v2),
  },
  'c11p-line-eqn': {
    title: 'distance to stop a train',
    make(r) {
      const v = choose(r, [36, 54, 72, 90, 108]), a = choose(r, [0.5, 1, 1.5, 2]), u = v / 3.6, s = (u * u) / (2 * a);
      return { v, a, q: `<p>A train running at ${v} km/h is brought to rest with a constant deceleration of ${a} m/s². How far does it travel while stopping?</p>`, answer: s, unit: 'm', tol: 0.01,
        hint: 'Convert to m/s, then use v² = u² + 2as with final v = 0 and a negative.',
        solution: steps(`u = ${v}/3.6 = ${n(u, 4)} m/s.`, `0 = u² − 2as, so s = u²/2a = ${n(u * u, 5)}/${2 * a}.`, `s = <b>${n(s)} m</b>.`) };
    },
    verify: (x) => { const u = x.v / 3.6, t = u / x.a; return u * t - 0.5 * x.a * t * t; },
  },
  'c11p-line-fall': {
    title: 'a stone dropped from a bridge',
    make(r) {
      const t = pick(r, 2, 6, 0.5), g = 9.8, h = 0.5 * g * t * t, v = g * t;
      return { t, q: `<p>A stone dropped from a bridge takes ${t} s to hit the river below. Taking g = 9.8 m/s² and neglecting air, find the height of the bridge above the water.</p>`, answer: h, unit: 'm', tol: 0.01,
        hint: 'Released from rest: h = ½ g t².',
        solution: steps(`h = ½ × 9.8 × ${t}² = ${n(h)} m.`, `(It hits the water at ${n(v)} m/s.)`) };
    },
    verify: (x) => { let h = 0, v = 0; const N = 20000, dt = x.t / N; for (let i = 0; i < N; i++) { h += v * dt + 0.5 * 9.8 * dt * dt; v += 9.8 * dt; } return h; },
  },
  'c11p-line-up': {
    title: 'maximum height of a ball thrown up',
    make(r) {
      const u = pick(r, 10, 40, 5), g = 9.8, H = (u * u) / (2 * g), T = (2 * u) / g;
      return { u, q: `<p>A cricket ball is thrown straight up at ${u} m/s. Taking g = 9.8 m/s², how high does it rise above the hand?</p>`, answer: H, unit: 'm', tol: 0.01,
        hint: 'At the top the velocity is zero: 0 = u² − 2gH.',
        solution: steps(`H = u²/2g = ${u}²/19.6 = <b>${n(H)} m</b>.`, `Time up and down = 2u/g = ${n(T)} s.`) };
    },
    verify: (x) => { const t = x.u / 9.8; return x.u * t - 0.5 * 9.8 * t * t; },
  },
  'c11p-line-meet': {
    title: 'when a faster vehicle catches up',
    make(r) {
      const x0 = pick(r, 100, 500, 50), vA = choose(r, [20, 25, 30]), vB = choose(r, [10, 12, 15]), t = x0 / (vA - vB);
      return { x0, vA, vB, q: `<p>A police jeep at the starting line chases a truck that is ${x0} m ahead. The jeep moves at ${vA} m/s and the truck at ${vB} m/s, both steady and in the same direction. After how many seconds does the jeep catch the truck?</p>`, answer: t, unit: 's', tol: 0.01,
        hint: 'The gap closes at the relative velocity vA − vB. Time = gap ÷ relative velocity.',
        solution: steps(`Relative velocity = ${vA} − ${vB} = ${vA - vB} m/s.`, `t = ${x0}/${vA - vB} = <b>${n(t)} s</b>.`) };
    },
    verify: (x) => { let t = 0; const dt = 0.001; while (x.vA * t < x.x0 + x.vB * t && t < 1e4) t += dt; return t; },
  },
  'c11p-line-area': {
    title: 'distance from a velocity-time graph',
    make(r) {
      const a = choose(r, [1, 2, 3]), t1 = choose(r, [4, 5, 6]), t2 = choose(r, [10, 20, 30]), t3 = choose(r, [2, 4]), v = a * t1, s = 0.5 * v * t1 + v * t2 + 0.5 * v * t3;
      return { a, t1, t2, t3, q: `<p>A metro train starts from rest with acceleration ${a} m/s² for ${t1} s, then runs at constant speed for ${t2} s, then slows uniformly to a stop in ${t3} s. Find the total distance covered using the area under its v–t graph.</p>`, answer: s, unit: 'm', tol: 0.01,
        hint: 'Top speed v = a t₁. The graph is a trapezoid: add two triangles and a rectangle.',
        solution: steps(`Top speed = ${a} × ${t1} = ${v} m/s.`, `Areas: ½ × ${v} × ${t1} = ${n(0.5 * v * t1)}; ${v} × ${t2} = ${v * t2}; ½ × ${v} × ${t3} = ${n(0.5 * v * t3)}.`, `Total = <b>${n(s)} m</b>.`) };
    },
    verify: (x) => ((x.t2 + (x.t1 + x.t2 + x.t3)) / 2) * (x.a * x.t1),
  },
};
