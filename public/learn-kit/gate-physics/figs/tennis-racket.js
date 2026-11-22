// 2.6 The tennis racket theorem. Euler's equations for a free body with principal moments (1, 2, 3) are solved
// (RK4) for a spin of 1 rad/s about the chosen axis plus a tiny nudge to the other two components. About the largest
// or smallest axis the nudge just wobbles; about the intermediate axis it grows until the body flips over and back.
import { canvas, axes, line, text, title, row, slider, choice, readout, fmt } from '../../kit.js';

const I = [1, 2, 3];

function run(axis, eps, T) {
  let w = [eps, eps, eps]; w[axis] = 1;
  const f = (v) => [(I[1] - I[2]) * v[1] * v[2] / I[0], (I[2] - I[0]) * v[2] * v[0] / I[1], (I[0] - I[1]) * v[0] * v[1] / I[2]];
  const h = 0.01, out = [w.slice()];
  for (let t = 0; t < T; t += h) {
    const k1 = f(w), k2 = f(w.map((x, i) => x + h / 2 * k1[i])), k3 = f(w.map((x, i) => x + h / 2 * k2[i])), k4 = f(w.map((x, i) => x + h * k3[i]));
    w = w.map((x, i) => x + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    out.push(w.slice());
  }
  return out;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 400, min: 260, label: 'Angular velocity components of a freely spinning body against time' });
  let axis = 1, eps = 0.01;
  const T = 40;
  const ctl = row(host);
  choice(ctl, 'Spin about', [[0, 'Smallest axis (I = 1)'], [1, 'Middle axis (I = 2)'], [2, 'Largest axis (I = 3)']], axis, (v) => { axis = v; cv.redraw(); });
  slider(ctl, { label: 'Size of the nudge', min: 0.001, max: 0.1, value: eps, log: true, fmt: (x) => fmt(x, 2), oninput: (x) => { eps = x; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    const data = run(axis, eps, T);
    title(ctx, 'Free rotation: ω₁, ω₂, ω₃ against time', col);
    const ax = axes(ctx, W, H, col, { x: [0, T], y: [-1.15, 1.15], xlabel: 'time (s)', ylabel: 'ω (rad/s)', t: 30, yt: [-1, -0.5, 0, 0.5, 1] });
    ctx.save(); ax.clip();
    for (let i = 0; i < 3; i++) line(ctx, data.map((w, k) => [ax.X(k * 0.01), ax.Y(w[i])]), col.s[[0, 2, 3][i]], i === axis ? 2.5 : 1.6);
    ctx.restore();
    ['ω₁', 'ω₂', 'ω₃'].forEach((s, i) => text(ctx, s, ax.L + 8 + i * 34, ax.T + 10, { color: col.s[[0, 2, 3][i]], size: 12, weight: 700 }));
    const others = [0, 1, 2].filter((i) => i !== axis);
    const grow = Math.sqrt(Math.abs((I[axis] - I[others[0]]) * (I[axis] - I[others[1]]) / (I[others[0]] * I[others[1]])));
    out.innerHTML = axis === 1
      ? `Intermediate axis: the nudge grows like e^(λt) with λ = √((3 − 2)(2 − 1)/(1·3)) = <b>${fmt(grow, 3)}</b> s⁻¹. The body turns upside down (ω₂ changes sign) again and again; a smaller nudge only delays each flip.`
      : `${axis === 0 ? 'Smallest' : 'Largest'} axis: the nudge only wobbles, at Ω = <b>${fmt(grow, 3)}</b> rad/s, and the spin stays put. (With internal friction, only the largest axis would survive.)`;
  };
  cv.redraw();
}
