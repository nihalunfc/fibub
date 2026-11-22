// Class 10 Circles: the tangent at a point P is perpendicular to the radius OP. Drag P round the circle (or use the slider):
// the tangent turns but the angle stays 90 degrees. Slide Q along the tangent: OQ² = r² + PQ² > r², so every point of the
// tangent other than P lies OUTSIDE the circle. That is why a tangent touches at one point only.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 35, t = 1.1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 280, label: 'A circle with a draggable point P, its tangent and a point Q sliding along the tangent' });
  const ctl = row(host);
  const sa = slider(ctl, { label: 'Position of P', min: 0, max: 360, step: 1, value: a, fmt: (v) => v + '°', oninput: (v) => { a = v; say(); } });
  slider(ctl, { label: 'Q along tangent', min: -1.4, max: 1.4, step: 0.1, value: t, fmt: (v) => v.toFixed(1) + ' r', oninput: (v) => { t = v; say(); } });
  const out = readout(host);
  let G = {};
  const say = () => { const oq = Math.sqrt(1 + t * t); out.innerHTML = `∠OPQ = <b>90°</b> wherever P is. PQ = ${Math.abs(t).toFixed(1)} r, so OQ = √(r² + PQ²) = <b>${oq.toFixed(2)} r</b>, which is more than r: Q is outside the circle.`; cv.redraw(); };
  cv.c.style.touchAction = 'none'; let on = false;
  const mv = (e) => { const r = cv.c.getBoundingClientRect(); a = ((Math.atan2(-(e.clientY - r.top - G.cy), e.clientX - r.left - G.cx) * 180) / Math.PI + 360) % 360; sa.set(Math.round(a)); say(); };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (Math.hypot(e.clientX - r.left - G.px, e.clientY - r.top - G.py) < 32) { on = true; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => on && mv(e));
  cv.c.addEventListener('pointerup', () => (on = false)); cv.c.addEventListener('pointercancel', () => (on = false));
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tangent ⟂ radius (drag P)', col);
    const R = Math.min(w * 0.25, (h - 70) * 0.32), cx = w / 2, cy = h / 2 + 12, th = (a * Math.PI) / 180;
    const ux = Math.cos(th), uy = -Math.sin(th), tx = -uy, ty = ux; // radius direction and tangent direction (screen coords)
    const px = cx + R * ux, py = cy + R * uy; G = { cx, cy, px, py };
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    const L = R * 2.3; line(ctx, [[px - tx * L, py - ty * L], [px + tx * L, py + ty * L]], col.s[2], 2.5);
    line(ctx, [[cx, cy], [px, py]], col.s[0], 2.5);
    const m = 11; line(ctx, [[px - ux * m, py - uy * m], [px - ux * m + tx * m, py - uy * m + ty * m], [px + tx * m, py + ty * m]], col.ink, 1.5);
    const qx = px + tx * t * R, qy = py + ty * t * R;
    line(ctx, [[cx, cy], [qx, qy]], col.s[3], 1.8, [5, 4]);
    dot(ctx, cx, cy, 4, col.ink); dot(ctx, px, py, 7, col.s[0], col.panel); dot(ctx, qx, qy, 6, col.s[3], col.panel);
    text(ctx, 'O', cx - 12, cy + 2, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'P', px + ux * 15, py + uy * 15, { color: col.s[0], size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Q', qx - ux * 13 + tx * 4, qy - uy * 13 + ty * 4, { color: col.s[3], size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'r', (cx + px) / 2 - uy * 11, (cy + py) / 2 + ux * 11, { color: col.s[0], size: 12, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, '90°', px - ux * 30 + tx * 24, py - uy * 30 + ty * 24, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  say();
}
