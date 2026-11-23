// Class 11 Physics, Motion in a Plane: live problems (original fibub questions). Ids start with c11p-plane-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

const deg = (r) => (r * 180) / Math.PI;

export default tidyProblems({
  'c11p-plane-vec': {
    title: 'magnitude of the sum of two vectors',
    make(r) {
      const ax = pick(r, 1, 8, 1), ay = pick(r, 1, 8, 1), bx = pick(r, 1, 8, 1), by = pick(r, -6, 6, 1), R = Math.hypot(ax + bx, ay + by);
      return { ax, ay, bx, by, q: `<p>Two forces are <b>A</b> = ${ax}<b>î</b> + ${ay}<b>ĵ</b> N and <b>B</b> = ${bx}<b>î</b> ${by < 0 ? '−' : '+'} ${Math.abs(by)}<b>ĵ</b> N. Find the magnitude of the resultant force.</p>`, answer: R, unit: 'N', tol: 0.01,
        hint: 'Add the x-components and the y-components separately, then use Pythagoras.',
        solution: steps(`R<sub>x</sub> = ${ax} + ${bx} = ${ax + bx}, R<sub>y</sub> = ${ay} + (${by}) = ${ay + by}.`, `|R| = √(${ax + bx}² + ${ay + by}²) = <b>${n(R)} N</b>.`) };
    },
    verify: (x) => { const A = Math.hypot(x.ax, x.ay), B = Math.hypot(x.bx, x.by), c = (x.ax * x.bx + x.ay * x.by) / (A * B); return Math.sqrt(A * A + B * B + 2 * A * B * c); },
  },
  'c11p-plane-range': {
    title: 'range of a cricket throw',
    make(r) {
      const u = pick(r, 15, 35, 5), a = choose(r, [30, 37, 45, 53, 60]), g = 9.8, R = (u * u * Math.sin(2 * a * Math.PI / 180)) / g;
      return { u, a, q: `<p>A fielder throws a ball at ${u} m/s at ${a}° above the horizontal from ground level. Taking g = 9.8 m/s² and ignoring air, find the horizontal range.</p>`, answer: R, unit: 'm', tol: 0.01,
        hint: 'R = u² sin2θ / g.',
        solution: steps(`sin(2 × ${a}°) = sin ${2 * a}° = ${n(Math.sin(2 * a * Math.PI / 180), 4)}.`, `R = ${u * u} × ${n(Math.sin(2 * a * Math.PI / 180), 4)} / 9.8 = <b>${n(R)} m</b>.`) };
    },
    verify: (x) => { const r = x.a * Math.PI / 180, T = (2 * x.u * Math.sin(r)) / 9.8; return x.u * Math.cos(r) * T; },
  },
  'c11p-plane-height': {
    title: 'maximum height of a projectile',
    make(r) {
      const u = pick(r, 15, 40, 5), a = choose(r, [30, 37, 45, 53, 60, 75]), g = 9.8, H = Math.pow(u * Math.sin(a * Math.PI / 180), 2) / (2 * g);
      return { u, a, q: `<p>A football is kicked at ${u} m/s at ${a}° above the horizontal. Find the greatest height it reaches (g = 9.8 m/s²).</p>`, answer: H, unit: 'm', tol: 0.01,
        hint: 'Only the vertical component u sinθ matters: H = (u sinθ)² / 2g.',
        solution: steps(`u<sub>y</sub> = ${u} sin ${a}° = ${n(u * Math.sin(a * Math.PI / 180), 4)} m/s.`, `H = u<sub>y</sub>²/2g = <b>${n(H)} m</b>.`) };
    },
    verify: (x) => { let y = 0, v = x.u * Math.sin(x.a * Math.PI / 180), best = 0; const dt = 1e-4; while (v > 0) { y += v * dt; v -= 9.8 * dt; best = Math.max(best, y); } return best; },
  },
  'c11p-plane-cliff': {
    title: 'a ball rolled off a table or cliff',
    make(r) {
      const h = choose(r, [5, 10, 20, 45, 80]), v = choose(r, [5, 10, 15, 20]), g = 10, R = v * Math.sqrt((2 * h) / g);
      return { h, v, q: `<p>A stone is thrown horizontally at ${v} m/s from the edge of a ${h} m high cliff. Taking g = 10 m/s², how far from the foot of the cliff does it land?</p>`, answer: R, unit: 'm', tol: 0.01,
        hint: 'Time to fall from rest is the same as a dropped stone: h = ½gt². Horizontal distance = v t.',
        solution: steps(`t = √(2h/g) = √(${2 * h}/10) = ${n(Math.sqrt(2 * h / g), 4)} s.`, `Distance = ${v} × ${n(Math.sqrt(2 * h / g), 4)} = <b>${n(R)} m</b>.`) };
    },
    verify: (x) => { let y = x.h, t = 0; const dt = 1e-4; while (y > 0) { t += dt; y = x.h - 5 * t * t; } return x.v * t; },
  },
  'c11p-plane-circ': {
    title: 'centripetal acceleration of a car on a bend',
    make(r) {
      const kmh = choose(r, [36, 54, 72, 90]), R = choose(r, [50, 80, 100, 150, 200]), v = kmh / 3.6, a = (v * v) / R;
      return { kmh, R, q: `<p>A car goes round a circular bend of radius ${R} m at a steady ${kmh} km/h. Find its centripetal acceleration.</p>`, answer: a, unit: 'm/s²', tol: 0.01,
        hint: 'Convert to m/s first, then a = v²/r.',
        solution: steps(`v = ${kmh}/3.6 = ${n(v, 4)} m/s.`, `a = v²/r = ${n(v * v, 5)}/${R} = <b>${n(a)} m/s²</b>.`) };
    },
    verify: (x) => { const v = x.kmh / 3.6, w = v / x.R; return w * w * x.R; },
  },
  'c11p-plane-rain': {
    title: 'the umbrella tilt in the rain',
    make(r) {
      const vr = choose(r, [8, 10, 12, 15]), vp = choose(r, [3, 4, 5, 6, 9]), a = deg(Math.atan(vp / vr));
      return { vr, vp, q: `<p>Rain falls vertically at ${vr} m/s. A person walks at ${vp} m/s on a level road. At what angle from the vertical should she tilt her umbrella (in degrees)?</p>`, answer: a, unit: '°', tol: 0.01,
        hint: 'In her frame the rain has a horizontal velocity −v_person and a vertical velocity −v_rain. tanθ = v_person / v_rain.',
        solution: steps(`Rain relative to the walker: ${vp} m/s backward and ${vr} m/s downward.`, `tanθ = ${vp}/${vr}, so θ = <b>${n(a)}°</b> from the vertical, towards the direction she walks.`) };
    },
    verify: (x) => 90 - deg(Math.atan2(x.vr, x.vp)),
  },
  'c11p-plane-boat': {
    title: 'a boat crossing a river',
    make(r) {
      const w = choose(r, [100, 200, 300, 400]), vb = choose(r, [2, 4, 5]), vr = choose(r, [1, 2, 3]), drift = (vr * w) / vb;
      return { w, vb, vr, q: `<p>A river ${w} m wide flows at ${vr} m/s. A boat that can do ${vb} m/s in still water is always steered straight across (perpendicular to the banks). How far downstream does it land from the point directly opposite?</p>`, answer: drift, unit: 'm', tol: 0.01,
        hint: 'Crossing time = width ÷ boat speed across. The current carries it for that time.',
        solution: steps(`Time = ${w}/${vb} = ${n(w / vb)} s.`, `Drift = ${vr} × ${n(w / vb)} = <b>${n(drift)} m</b> downstream.`) };
    },
    verify: (x) => { let X = 0, Y = 0; const dt = 0.01; while (Y < x.w) { Y += x.vb * dt; X += x.vr * dt; } return X; },
  },
}, ['c11p-plane-vec']);
