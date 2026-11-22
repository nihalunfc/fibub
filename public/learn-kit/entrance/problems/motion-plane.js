// Live problems for Vectors and motion in a plane.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8, rad = (d) => (d * Math.PI) / 180;

export default {
  'mp-projectile-height': {
    title: 'greatest height and range of a projectile',
    make(r) {
      const u = pick(r, 10, 40, 2), deg = [30, 37, 45, 53, 60][Math.floor(r() * 5)];
      const uy = u * Math.sin(rad(deg)), answer = (uy * uy) / (2 * G), R = (u * u * Math.sin(rad(2 * deg))) / G;
      return { u, deg,
        q: `<p>A ball is kicked from level ground at ${u} m/s at ${deg}° above the horizontal. How high does it rise? (g = 9.8 m/s², no air resistance)</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: 'Only the vertical part of the velocity decides the height: H = (u sin θ)² / 2g.',
        solution: steps(`Vertical part u<sub>y</sub> = ${u} × sin ${deg}° = ${n(uy)} m/s.`, `At the top v<sub>y</sub> = 0, so 0 = u<sub>y</sub>² − 2gH.`, `H = ${n(uy)}² / (2 × 9.8) = <b>${n(answer)} m</b>.`, `(For interest: the range is u² sin 2θ / g = ${n(R)} m.)`) };
    },
    verify: (x) => { const T = (2 * x.u * Math.sin(rad(x.deg))) / G, t = T / 2; return x.u * Math.sin(rad(x.deg)) * t - 0.5 * G * t * t; },
  },
  'mp-river': {
    title: 'shortest-path river crossing',
    make(r) {
      const v = pick(r, 3, 6, 0.5), w = pick(r, 1, 2.5, 0.5), d = pick(r, 60, 240, 20);
      const answer = d / Math.sqrt(v * v - w * w), ang = (Math.asin(w / v) * 180) / Math.PI;
      return { v, w, d,
        q: `<p>A river ${d} m wide flows at ${w} m/s. A swimmer can swim at ${v} m/s in still water and wants to land exactly opposite the starting point. How long does the crossing take?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Head upstream so the sideways part of your swimming cancels the river: v sin α = w. The part left over carries you across.',
        solution: steps(`To land opposite, the upstream part of the swimming velocity must equal the river speed: sin α = ${w}/${v}, so α = ${n(ang)}° from the straight-across line.`, `Across-river speed = √(v² − w²) = √(${v}² − ${w}²) = ${n(Math.sqrt(v * v - w * w))} m/s.`, `Time = ${d} / ${n(Math.sqrt(v * v - w * w))} = <b>${n(answer)} s</b>.`) };
    },
    verify: (x) => { const a = Math.asin(x.w / x.v); return x.d / (x.v * Math.cos(a)); },
  },
  'mp-circular-accel': {
    title: 'total acceleration in non-uniform circular motion',
    make(r) {
      const R = pick(r, 2, 20, 1), v = pick(r, 4, 20, 1), at = pick(r, 1, 6, 0.5);
      const ac = (v * v) / R, answer = Math.sqrt(ac * ac + at * at);
      return { R, v, at,
        q: `<p>A car goes round a circular track of radius ${R} m. At one instant its speed is ${v} m/s and it is speeding up at ${at} m/s². What is the size of its total acceleration at that instant?</p>`,
        answer, unit: 'm/s²', tol: 0.01,
        hint: 'Two perpendicular parts: towards the centre v²/R, and along the path the rate of change of speed. Add them like perpendicular vectors.',
        solution: steps(`Centripetal part a<sub>c</sub> = v²/R = ${v}²/${R} = ${n(ac)} m/s² (towards the centre).`, `Tangential part a<sub>t</sub> = ${at} m/s² (along the motion).`, `They are at right angles: a = √(a<sub>c</sub>² + a<sub>t</sub>²) = <b>${n(answer)} m/s²</b>.`) };
    },
    verify: (x) => Math.hypot(x.v ** 2 / x.R, x.at),
  },
};
