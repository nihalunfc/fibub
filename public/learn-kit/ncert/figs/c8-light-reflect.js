// Class 8 Light: the law of reflection. The angle of incidence (between the incoming ray and the normal, the line at right
// angles to the mirror) is always equal to the angle of reflection, and the incident ray, normal and reflected ray lie in one
// plane. Drag the torch or use the slider.
import { canvas, text, title, line, dot, arrow, row, slider, readout, touchGuard, clamp } from '../../kit.js';

export default function (host) {
  let ang = 40;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'A ray of light reflecting from a plane mirror with equal angles of incidence and reflection' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle of incidence', min: 5, max: 80, step: 1, value: ang, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { ang = v; say(); } });
  const out = readout(host);
  const G = () => { const w = cv.w, h = cv.h, ox = w / 2, oy = h * 0.72, L = Math.min(w * 0.42, h * 0.58), a = ang * Math.PI / 180; return { ox, oy, L, a, ix: ox - L * Math.sin(a), iy: oy - L * Math.cos(a) }; };
  const say = () => { out.innerHTML = `Angle of incidence <b>i = ${Math.round(ang)}°</b>, angle of reflection <b>r = ${Math.round(ang)}°</b>. They are always equal, whatever you do to the torch.`; cv.redraw(); };
  let on = false;
  touchGuard(cv.c, (x, y) => { const g = G(); return Math.hypot(x - g.ix, y - g.iy) < 28; });
  const mv = (e) => { const r = cv.c.getBoundingClientRect(), g = G(); ang = clamp(Math.atan2(g.ox - (e.clientX - r.left), g.oy - (e.clientY - r.top)) * 180 / Math.PI, 5, 80); sl.set(ang); say(); };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(), g = G(); if (Math.hypot(e.clientX - r.left - g.ix, e.clientY - r.top - g.iy) < 30) { on = true; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => on && mv(e));
  cv.c.addEventListener('pointerup', () => (on = false)); cv.c.addEventListener('pointercancel', () => (on = false));
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Law of reflection: i = r', col);
    const g = G(), rx = g.ox + g.L * Math.sin(g.a);
    line(ctx, [[w * 0.08, g.oy], [w * 0.92, g.oy]], col.ink, 4);
    for (let x = w * 0.1; x < w * 0.92; x += 12) line(ctx, [[x, g.oy], [x - 7, g.oy + 9]], col.muted, 1.5);
    line(ctx, [[g.ox, g.oy], [g.ox, g.oy - g.L * 1.08]], col.muted, 1.5, [5, 4]);
    text(ctx, 'normal', g.ox + 5, g.oy - g.L * 1.08 + 6, { color: col.muted, size: 10.5 });
    arrow(ctx, g.ix, g.iy, g.ox - 2, g.oy - 2, col.s[1], 3, 10);
    arrow(ctx, g.ox + 2, g.oy - 2, rx, g.iy, col.s[2], 3, 10);
    const R = Math.min(34, g.L * 0.4);
    ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(g.ox, g.oy, R, -Math.PI / 2 - g.a, -Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.arc(g.ox, g.oy, R + 6, -Math.PI / 2, -Math.PI / 2 + g.a); ctx.stroke(); ctx.restore();
    text(ctx, 'i', g.ox - R * 0.55 * Math.sin(g.a / 2 + 0.2) - 10, g.oy - R * 1.25, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    text(ctx, 'r', g.ox + R * 0.55 * Math.sin(g.a / 2 + 0.2) + 12, g.oy - R * 1.3, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    dot(ctx, g.ix, g.iy, 10, col.warn, col.ink); text(ctx, 'torch', g.ix, g.iy - 18, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'plane mirror', w * 0.92, g.oy + 20, { color: col.muted, size: 10.5, align: 'right' });
  };
  say();
}
