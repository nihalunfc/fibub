// Class 12 Rate of change: a balloon is filled with air at a steady rate dV/dt. Since V = 4/3 pi r^3, dV/dt = 4 pi r^2 dr/dt, so the radius
// grows at dr/dt = (dV/dt) / (4 pi r^2): quickly at first, then more and more slowly as the balloon gets big. The rates of related
// quantities are tied together by the chain rule. Press play to blow it up; change the filling rate.
import { canvas, text, title, line, dot, axes, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let rate = 100, t = 0.3, st = 4;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'A balloon being filled at a steady rate and the slowing growth of its radius' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'air in (cm³/s)', min: 40, max: 200, step: 10, value: rate, fmt: (v) => String(v), oninput: (v) => { rate = v; say(); } });
  const R = (tt) => Math.cbrt((3 * rate * tt) / (4 * Math.PI));
  const an = loop(host, (dt) => { t += dt * 1.5; if (t > 12) t = 0.3; say(); }); an.button(ctl);
  button(ctl, 'Restart', () => { t = 0.3; say(); });
  function say() {
    const r = R(t), dr = rate / (4 * Math.PI * r * r);
    out.innerHTML = `After ${t.toFixed(1)} s: r = <b>${r.toFixed(2)} cm</b>. dV/dt = ${rate} cm³/s is fixed, but dr/dt = dV/dt ÷ (4πr²) = <b>${dr.toFixed(3)} cm/s</b>. Same air every second, yet the radius grows more slowly as the surface 4πr² gets bigger.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Steady air, slowing radius', col);
    const r = R(t), rmax = R(12), S = Math.min(70, w * 0.2) / rmax, cx = w * 0.27, cy = 100;
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(2, r * S), 0, 7); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[cx, cy + r * S], [cx, cy + r * S + 14]], col.muted, 1.5);
    line(ctx, [[cx, cy], [cx + r * S, cy]], col.ink, 2); text(ctx, `r = ${r.toFixed(1)}`, cx + 6, cy - 8, { color: col.ink, size: 11.5, weight: 800, halo: col.panel });
    const dr = rate / (4 * Math.PI * r * r);
    const L = [];
    if (st >= 1) L.push(['V = (4/3)πr³', col.ink]);
    if (st >= 2) L.push(['dV/dt = 4πr² · dr/dt', col.s[0]]);
    if (st >= 3) L.push([`now: r = ${r.toFixed(1)} cm, dV/dt = ${rate}`, col.muted]);
    if (st >= 4) L.push([`dr/dt = ${dr.toFixed(3)} cm/s`, col.s[3]]);
    L.forEach(([l, c], i) => text(ctx, l, w * 0.5, 50 + i * 24, { color: c, size: 12.5, weight: 800 }));
    const A = axes(ctx, w, h, col, { x: [0, 12], y: [0, Math.ceil(rmax)], l: 40, r: 14, t: 170, b: 34, xlabel: 'time (s)', ylabel: 'radius (cm)', xt: [0, 4, 8, 12] });
    const pts = []; for (let u = 0; u <= t; u += 0.1) pts.push([A.X(u), A.Y(R(u))]); line(ctx, pts, col.s[3], 3);
    dot(ctx, A.X(t), A.Y(r), 5.5, col.s[3], col.ink);
  };
  say();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
