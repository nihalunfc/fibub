// Class 10 Circles: how many tangents can be drawn from a point P? Inside the circle: none (every line through P cuts the circle
// twice). On the circle: exactly one. Outside: exactly two. Drag P, or use the slider for its distance from the centre.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let d = 2, ang = 0.6, dir = -1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A draggable point and the tangents from it to a circle: none inside, one on, two outside' });
  const ctl = row(host);
  const s = slider(ctl, { label: 'Distance of P from O', min: 0, max: 3, step: 0.05, value: d, fmt: (v) => v.toFixed(2) + ' r', oninput: (v) => { d = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { d += dir * dt * 0.5; if (d < 0.1) dir = 1; if (d > 2.9) dir = -1; s.set(d); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host); let G = {};
  const kind = () => (Math.abs(d - 1) < 0.03 ? 1 : d < 1 ? 0 : 2);
  function say() { const k = kind(); out.innerHTML = k === 0 ? 'P is <b>inside</b> the circle: <b>0 tangents</b>. Any line through P cuts the circle in two points.' : k === 1 ? 'P is <b>on</b> the circle: exactly <b>1 tangent</b>, at P itself.' : `P is <b>outside</b>: exactly <b>2 tangents</b>. Each has length √(OP² − r²) = <b>${Math.sqrt(d * d - 1).toFixed(2)} r</b>.`; cv.redraw(); }
  cv.c.style.touchAction = 'none'; let on = false;
  const mv = (e) => { const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left - G.cx, y = e.clientY - r.top - G.cy; d = Math.min(3, Math.hypot(x, y) / G.R); if (Math.abs(d - 1) < 0.05) d = 1; ang = Math.atan2(y, x); anim.pause(); s.set(d); say(); };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (Math.hypot(e.clientX - r.left - G.px, e.clientY - r.top - G.py) < 34) { on = true; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => on && mv(e));
  cv.c.addEventListener('pointerup', () => (on = false)); cv.c.addEventListener('pointercancel', () => (on = false));
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tangents from a point (drag P)', col);
    const R = Math.min(w * 0.17, (h - 60) * 0.26), cx = w * 0.4, cy = h / 2 + 12, k = kind(), dd = k === 1 ? 1 : d;
    const px = cx + Math.cos(ang) * dd * R, py = cy + Math.sin(ang) * dd * R; G = { cx, cy, R, px, py };
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    const c = [col.s[3], col.s[2], col.s[1]][k];
    if (k === 2) {
      const al = Math.acos(1 / dd);
      for (const sg of [1, -1]) { const th = ang + sg * al, tx = cx + Math.cos(th) * R, ty = cy + Math.sin(th) * R; const ex = tx + (tx - px) * 0.35, ey = ty + (ty - py) * 0.35; line(ctx, [[px, py], [ex, ey]], c, 2.5); dot(ctx, tx, ty, 5, col.s[0], col.panel); line(ctx, [[cx, cy], [tx, ty]], col.s[0], 1.3, [4, 4]); }
    } else if (k === 1) { const tx = -Math.sin(ang), ty = Math.cos(ang); line(ctx, [[px - tx * R * 1.8, py - ty * R * 1.8], [px + tx * R * 1.8, py + ty * R * 1.8]], c, 2.5); }
    dot(ctx, cx, cy, 3.5, col.ink); dot(ctx, px, py, 7, c, col.ink);
    text(ctx, 'P', px + 12, py - 12, { color: col.ink, size: 13, weight: 700, halo: col.panel }); text(ctx, 'O', cx - 12, cy + 2, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, ['0 tangents', '1 tangent', '2 tangents'][k], w - 12, h - 16, { color: c, size: 14, weight: 700, align: 'right', halo: col.panel });
  };
  say();
}
