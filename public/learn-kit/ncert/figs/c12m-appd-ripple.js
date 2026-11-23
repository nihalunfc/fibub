// Class 12 Rate of change: a raindrop makes a circular ripple whose radius grows at a steady 2 cm/s. The area A = pi r^2 changes at dA/dt = 2 pi r dr/dt,
// so the area grows faster and faster even though the radius grows steadily: at r = 5 cm it is 62.8 cm^2/s, at r = 20 cm it is 251 cm^2/s. Play it.
import { canvas, text, title, line, dot, axes, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let t = 1, v = 2;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'A circular ripple spreading at a steady radius speed with its area growing faster and faster' });
  const ctl = row(host), out = readout(host);
  const st = slider(ctl, { label: 'time (s)', min: 0.2, max: 10, step: 0.1, value: t, fmt: (x) => x.toFixed(1), oninput: (x) => { t = x; say(); } });
  slider(ctl, { label: 'radius speed (cm/s)', min: 1, max: 4, step: 0.5, value: v, fmt: (x) => String(x), oninput: (x) => { v = x; say(); } });
  const an = loop(host, (dt) => { t += dt; if (t > 10) t = 0.2; st.set(t); say(); }, { autoplay: false }); an.button(ctl);
  function say() { const r = v * t; out.innerHTML = `t = ${t.toFixed(1)} s: r = ${r.toFixed(1)} cm, steady dr/dt = ${v} cm/s. dA/dt = 2πr·dr/dt = <b>${(2 * Math.PI * r * v).toFixed(0)} cm²/s</b>: the more circle there is, the more new area each ring adds.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Steady radius speed, growing area speed', col);
    const r = v * t, R10 = v * 10, sc = Math.min(w * 0.22, 70) / R10, cx = w * 0.27, cy = 100;
    for (let k = 0; k < 4; k++) { const rr = r - k * 1.2 * v; if (rr > 0) { ctx.beginPath(); ctx.arc(cx, cy, rr * sc, 0, 7); ctx.strokeStyle = col.s[0]; ctx.globalAlpha = 1 - k * 0.25; ctx.lineWidth = 2.5; ctx.stroke(); ctx.globalAlpha = 1; } }
    dot(ctx, cx, cy, 3, col.ink);
    text(ctx, `r = ${r.toFixed(1)} cm`, w * 0.55, 66, { color: col.ink, size: 13, weight: 800 });
    text(ctx, `A = ${(Math.PI * r * r).toFixed(0)} cm²`, w * 0.55, 88, { color: col.s[0], size: 13, weight: 800 });
    text(ctx, `dA/dt = ${(2 * Math.PI * r * v).toFixed(0)} cm²/s`, w * 0.55, 110, { color: col.s[3], size: 13, weight: 800 });
    const A = axes(ctx, w, h, col, { x: [0, 10], y: [0, 2 * Math.PI * v * v * 10], l: 46, r: 14, t: 170, b: 34, xlabel: 'time (s)', ylabel: 'dA/dt (cm²/s)', xt: [0, 5, 10] });
    line(ctx, [[A.X(0), A.Y(0)], [A.X(10), A.Y(2 * Math.PI * v * v * 10)]], col.s[3], 3);
    dot(ctx, A.X(t), A.Y(2 * Math.PI * v * v * t), 6, col.s[3], col.ink);
  };
  say();
}
