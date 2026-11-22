// Class 9 Science, Chapter 4: a velocity-time graph with the area shaded. Drag the end point (time right, speed up) or the
// start-speed slider. The slope is the acceleration, and the area under the line is the displacement: a rectangle u·t plus
// a triangle ½·a·t² (a trapezium overall), so s = ut + ½at².
import { canvas, axes, text, title, line, dot, row, slider, readout, clamp } from '../../kit.js';

export default function (host) {
  let u = 4, t = 6, v = 16, A = null;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 310, label: 'A velocity-time graph with a draggable end point and the area under it shaded' });
  const ctl = row(host);
  const su = slider(ctl, { label: 'Start speed u', min: 0, max: 12, step: 0.5, value: u, fmt: (x) => `${x} m/s`, oninput: (x) => { u = x; upd(); } });
  const out = readout(host);
  function upd() {
    const a = (v - u) / t, s = 0.5 * (u + v) * t;
    out.innerHTML = `a = (v − u)/t = <b>${a.toFixed(2)} m/s²</b>. Area = displacement s = ½(u + v)t = <b>${s.toFixed(1)} m</b>. Check: ut + ½at² = ${(u * t).toFixed(1)} + ${(0.5 * a * t * t).toFixed(1)} = ${(u * t + 0.5 * a * t * t).toFixed(1)} m. <i>Drag the big dot.</i>`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Area under the v-t line = displacement', col) + 2;
    const ax = A = axes(ctx, w, h, col, { x: [0, 10], y: [0, 30], t: top + 4, xlabel: 'time t (s)', ylabel: 'velocity (m/s)' });
    const a = (v - u) / t, X0 = ax.X(0), Xt = ax.X(t);
    ctx.save(); ctx.globalAlpha = 0.3;
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(X0, ax.Y(0)); ctx.lineTo(X0, ax.Y(Math.min(u, v))); ctx.lineTo(Xt, ax.Y(Math.min(u, v))); ctx.lineTo(Xt, ax.Y(0)); ctx.fill();
    ctx.fillStyle = a >= 0 ? col.s[1] : col.s[3]; ctx.beginPath(); ctx.moveTo(X0, ax.Y(u)); ctx.lineTo(Xt, ax.Y(v)); ctx.lineTo(Xt, ax.Y(Math.min(u, v))); ctx.lineTo(X0, ax.Y(Math.min(u, v))); ctx.closePath(); ctx.fill();
    ctx.restore();
    line(ctx, [[X0, ax.Y(u)], [Xt, ax.Y(v)]], col.ink, 3);
    line(ctx, [[Xt, ax.Y(0)], [Xt, ax.Y(v)]], col.muted, 1, [4, 3]);
    const small = Xt - X0 < 70;
    if (!small) { if (u >= 1.5) text(ctx, `u·t = ${(u * Math.min(1, 1) * t).toFixed(0)}`, (X0 + Xt) / 2, ax.Y(Math.min(u, v) / 2), { color: col.ink, size: 11, align: 'center', weight: 700 });
      if (Math.abs(a) > 0.1) text(ctx, a >= 0 ? `½at² = ${(0.5 * a * t * t).toFixed(0)}` : `−½|a|t²`, (X0 + Xt * 2) / 3, ax.Y((u + v) / 2) - (a >= 0 ? 12 : -2), { color: col.ink, size: 11, align: 'center', weight: 700, halo: col.panel }); }
    dot(ctx, X0, ax.Y(u), 4.5, col.ink); text(ctx, `u=${u}`, X0 + 7, ax.Y(u) - 10, { color: col.ink, size: 10.5, weight: 700, halo: col.panel });
    dot(ctx, Xt, ax.Y(v), 9, col.s[2], col.panel); text(ctx, `v=${v.toFixed(0)}`, Xt - 10, ax.Y(v) - 14, { color: col.s[2], size: 11, align: 'right', weight: 700, halo: col.panel });
    text(ctx, `t=${t.toFixed(1)}`, Xt, ax.Y(0) - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  let drag = false;
  const mv = (e) => { if (!drag || !A) return; const r = cv.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; t = clamp(Math.round(((px - A.X(0)) / (A.X(10) - A.X(0)) * 10) * 5) / 5, 1, 10); v = clamp(Math.round(((A.Y(0) - py) / (A.Y(0) - A.Y(30)) * 30)), 0, 30); upd(); };
  cv.c.style.touchAction = 'none';
  cv.c.addEventListener('pointerdown', (e) => { drag = true; cv.c.setPointerCapture(e.pointerId); mv(e); });
  cv.c.addEventListener('pointermove', mv); cv.c.addEventListener('pointerup', () => { drag = false; });
  upd();
}
