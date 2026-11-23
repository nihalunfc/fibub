// Class 12 Maths, Differential Equations: Newton's law of cooling. A cup of chai at 90 °C in a room at 30 °C loses heat at
// a rate proportional to the difference: dT/dt = −k(T − T_room). Separating variables gives T = T_room + (T₀ − T_room)e^(−kt).
// Slide room temperature and k (a thin steel tumbler cools faster than a thick mug) and see when it reaches 60 °C.
import { canvas, axes, row, slider, readout, line, dot, text, title, loop } from '../../kit.js';

export default function (host) {
  let Tr = 30, k = 0.06, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A cup of tea cooling toward room temperature' });
  const c = row(host), out = readout(host);
  slider(c, { label: 'room °C', min: 10, max: 40, step: 1, value: Tr, fmt: (v) => `${v} °C`, oninput: (v) => { Tr = v; re(); } });
  slider(c, { label: 'k per minute', min: 0.02, max: 0.15, step: 0.005, value: k, fmt: (v) => v.toFixed(3), oninput: (v) => { k = v; re(); } });
  const T = (x) => Tr + (90 - Tr) * Math.exp(-k * x);
  const anim = loop(host, (dt) => { t += dt * 6; if (t > 60) t = 0; re(); }); anim.button(c);
  const re = () => { cv.redraw(); const tt = Math.log((90 - Tr) / (60 - Tr)) / k; out.innerHTML = `After ${t.toFixed(0)} min the chai is <b>${T(t).toFixed(1)} °C</b>. It reaches a drinkable 60 °C after <b>${tt.toFixed(1)} min</b> (T = ${Tr} + ${90 - Tr}e<sup>−${k.toFixed(3)}t</sup>). It never drops below ${Tr} °C.`; };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'dT/dt = −k (T − T_room): chai cooling', col), g = axes(ctx, w, h, col, { x: [0, 60], y: [0, 100], l: 36, b: 34, t: t0 + 4, r: 12, xlabel: 'minutes', yt: [0, 30, 60, 90] });
    ctx.save(); g.clip(); line(ctx, [[g.X(0), g.Y(Tr)], [g.X(60), g.Y(Tr)]], col.muted, 1.5, [5, 4]); line(ctx, [[g.X(0), g.Y(60)], [g.X(60), g.Y(60)]], col.s[3], 1, [2, 4]);
    const p = []; for (let i = 0; i <= 120; i++) { const x = 60 * i / 120; p.push([g.X(x), g.Y(T(x))]); } line(ctx, p, col.s[1], 3); ctx.restore();
    dot(ctx, g.X(t), g.Y(T(t)), 6, col.s[1], col.panel); text(ctx, `room ${Tr} °C`, g.R - 4, g.Y(Tr) - 9, { color: col.muted, size: 11, align: 'right' }); text(ctx, '60 °C', g.R - 4, g.Y(60) - 9, { color: col.s[3], size: 11, align: 'right' });
  };
  re();
}
