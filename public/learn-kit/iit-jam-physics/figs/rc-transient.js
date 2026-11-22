// 4.8 DC transients. RC: the capacitor voltage while charging from a battery V0 (or discharging from V0) through R.
// RL: the current while it grows to V0/R (or decays). The dashed curve is the stored energy (as a fraction of its
// final or initial value), which changes on a time scale of τ/2 when decaying. Markers at τ, 2τ, ... 5τ.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 460, min: 280, label: 'Charging and discharging curves of RC and RL circuits against time, with time constants marked' });
  let kind = 'rc', dir = 'up', R = 2, X = 5, t = 1; // R in kΩ; X = C in μF or L in H; probe time in units of τ
  const ctl = row(host);
  choice(ctl, 'Circuit', [['rc', 'RC'], ['rl', 'RL']], kind, (v) => { kind = v; ctl2.querySelectorAll('.lk-slider > span')[1].textContent = kind === 'rc' ? 'C (μF)' : 'L (H)'; upd(); });
  choice(ctl, 'Switch', [['up', 'Charge / grow'], ['down', 'Discharge / decay']], dir, (v) => { dir = v; upd(); });
  const ctl2 = row(host);
  slider(ctl2, { label: 'R (kΩ)', min: 0.5, max: 10, step: 0.5, value: R, fmt: (v) => fmt(v, 3), oninput: (v) => { R = v; upd(); } });
  slider(ctl2, { label: 'C (μF)', min: 1, max: 20, step: 1, value: X, fmt: (v) => fmt(v, 3), oninput: (v) => { X = v; upd(); } });
  slider(ctl2, { label: 'Probe time (τ)', min: 0, max: 5, step: 0.05, value: t, fmt: (v) => fmt(v, 3) + ' τ', oninput: (v) => { t = v; upd(); } });
  const out = readout(host);
  const f = (u) => (dir === 'up' ? 1 - Math.exp(-u) : Math.exp(-u));
  function tau() { return kind === 'rc' ? R * 1e3 * X * 1e-6 : X / (R * 1e3); } // seconds
  function upd() {
    cv.redraw();
    const T = tau(), unit = T >= 1 ? [1, 's'] : T >= 1e-3 ? [1e3, 'ms'] : [1e6, 'μs'];
    const what = kind === 'rc' ? 'capacitor voltage' : 'current';
    out.innerHTML = `τ = ${kind === 'rc' ? 'RC' : 'L/R'} = <b>${fmt(T * unit[0], 3)} ${unit[1]}</b>. At t = ${fmt(t, 3)}τ = ${fmt(t * T * unit[0], 3)} ${unit[1]} the ${what} is <b>${fmt(100 * f(t), 3)}%</b> of ${dir === 'up' ? 'its final value' : 'its starting value'}, and the stored energy ${fmt(100 * f(t) ** 2, 3)}%. ` +
      (dir === 'up' ? 'After 5τ it is within 1% of the end.' : `It halves at τ ln2 = ${fmt(Math.LN2 * T * unit[0], 3)} ${unit[1]}; the energy halves twice as soon.`);
  }
  cv.draw = (ctx, w, h, col) => {
    const g = axes(ctx, w, h, col, { x: [0, 5], y: [0, 1.05], xt: [0, 1, 2, 3, 4, 5], fx: (v) => v + 'τ', yt: [0, 0.37, 0.63, 1], fy: (v) => Math.round(v * 100) + '%', xlabel: 'time', ylabel: kind === 'rc' ? 'V_C (fraction)' : 'I (fraction)' });
    for (const y of [0.37, 0.63]) line(ctx, [[g.L, g.Y(y)], [g.R, g.Y(y)]], col.muted, 1, [3, 4]);
    const P = [], E = [];
    for (let i = 0; i <= 200; i++) { const u = 5 * i / 200; P.push([g.X(u), g.Y(f(u))]); E.push([g.X(u), g.Y(f(u) ** 2)]); }
    line(ctx, E, col.s[2], 1.8, [6, 4]);
    line(ctx, P, col.s[0], 2.5);
    line(ctx, [[g.X(t), g.T], [g.X(t), g.B]], col.s[3], 1.5);
    dot(ctx, g.X(t), g.Y(f(t)), 5, col.s[3]);
    text(ctx, kind === 'rc' ? 'voltage' : 'current', g.R - 4, g.Y(dir === 'up' ? 0.9 : 0.12), { color: col.s[0], size: 11, weight: 700, align: 'right' });
    text(ctx, 'energy (dashed)', g.R - 4, g.Y(dir === 'up' ? 0.78 : 0.26), { color: col.s[2], size: 11, align: 'right' });
  };
  upd();
}
