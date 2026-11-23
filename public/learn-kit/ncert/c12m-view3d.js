// Helper for the Class 12 Maths figures that draw 3D axes: a turnable view (mouse drag or the "turn" slider; touch keeps scrolling the page)
// with x to the right, y into the screen and z up. P(x,y,z) gives the canvas position; axes() draws the three axes and the floor grid.
import { line, text, slider, canvas, title } from '../kit.js';

export function view3d(cv, ctl, { yaw = 0.55, pitch = 0.4, span = 5 } = {}) {
  const v = { yaw, pitch, span, s: 40, cx: 0, cy: 0 };
  const redraw = () => cv.redraw();
  v.P = (x, y, z) => {
    const c = Math.cos(v.yaw), s = Math.sin(v.yaw), x1 = x * c - y * s, y1 = x * s + y * c, cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
    return [v.cx + v.s * x1, v.cy - v.s * (z * cp - y1 * sp)];
  };
  v.fit = (w, h, top = 24) => { v.s = Math.min(w, h - top) / (1.75 * v.span); v.cx = w / 2; v.cy = top + (h - top) / 2; };
  v.axes = (ctx, col, L = v.span) => {
    ctx.save();
    for (let k = -L; k <= L; k++) { line(ctx, [v.P(k, -L, 0), v.P(k, L, 0)], col.line, 0.6); line(ctx, [v.P(-L, k, 0), v.P(L, k, 0)], col.line, 0.6); }
    [['x', [L, 0, 0], col.s[0]], ['y', [0, L, 0], col.s[1]], ['z', [0, 0, L], col.s[2]]].forEach(([n, e, c]) => {
      line(ctx, [v.P(-e[0], -e[1], -e[2]), v.P(...e)], c, 1.4);
      const p = v.P(e[0] * 1.08, e[1] * 1.08, e[2] * 1.08); text(ctx, n, p[0], p[1], { color: c, size: 12, weight: 700, align: 'center' });
    });
    ctx.restore();
  };
  let drag = null;
  cv.c.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') return; drag = [e.clientX, e.clientY, v.yaw, v.pitch]; cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; v.yaw = drag[2] + (e.clientX - drag[0]) * 0.01; v.pitch = Math.max(0, Math.min(1.4, drag[3] + (e.clientY - drag[1]) * 0.01)); if (v.sl) v.sl.set(((v.yaw % 6.2832) + 6.2832) % 6.2832); redraw(); });
  const end = () => { drag = null; };
  cv.c.addEventListener('pointerup', end); cv.c.addEventListener('pointercancel', end);
  v.sl = slider(ctl, { label: 'turn the view', min: 0, max: 6.28, step: 0.02, value: yaw, fmt: (x) => Math.round(x * 57.3) + '°', oninput: (x) => { v.yaw = x; redraw(); } });
  return v;
}

/** Wrapped text: draws `s` in lines no wider than w from (x, y); returns the y after the last line. */
export function wrap(ctx, s, x, y, w, color, size = 13, lh = 18) {
  ctx.save(); ctx.font = `400 ${size}px system-ui`;
  const words = s.split(' '); let l = '';
  const out = [];
  words.forEach((wd) => { const t = l ? l + ' ' + wd : wd; if (ctx.measureText(t).width > w && l) { out.push(l); l = wd; } else l = t; });
  out.push(l); ctx.restore();
  out.forEach((t, i) => text(ctx, t, x, y + i * lh, { color, size, fit: false }));
  return y + out.length * lh;
}

/** A step player made of worked lines: BOX[i] = [heading, ...lines]; step i shows boxes 0..i (earlier ones faded). Returns the figure's { step }. */
export function textSteps(host, ttl, BOX, label, aspect = 0.95) {
  let st = 0;
  const cv = canvas(host, { aspect, max: 440, min: 330, label });
  cv.draw = (ctx, w, h, col) => {
    let y = title(ctx, ttl, col) + 10;
    BOX.slice(0, st + 1).forEach((b, i) => {
      const cur = i === st; ctx.save(); ctx.globalAlpha = cur ? 1 : 0.6;
      y = wrap(ctx, (i ? `${i}. ` : '') + b[0], 12, y, w - 24, cur ? col.ink : col.muted, 12.5, 17);
      b.slice(1).forEach((t) => { y = wrap(ctx, t, 22, y + 2, w - 34, cur ? col.s[3] : col.muted, 13, 18); });
      ctx.restore(); y += 6;
    });
  };
  cv.redraw();
  return { step(i) { st = Math.min(BOX.length - 1, i); cv.redraw(); } };
}
