// Shared helpers for the Offline AI step-player figures of Modules 4 to 6 (hardware, buying, power).
// Not a figure itself: lessons never name it in data-fig.
import { canvas, text, ease, loop, calm } from '../../kit.js';

/**
 * A step-player canvas. draw(ctx, w, h, col, s) gets s = { step, prev, e } where e (0..1) is the eased
 * progress of the move from the previous step. Returns the controller the lesson kit calls with step(i, n).
 */
export function stepFig(host, { aspect = 0.6, max = 320, min = 240, label, draw }) {
  const cv = canvas(host, { aspect, max, min, label });
  const s = { step: 0, prev: 0, e: 1 };
  let k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.4); s.e = ease(k); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => draw(ctx, w, h, col, s);
  cv.redraw();
  return { step(i) { s.prev = s.step; s.step = i; k = calm() ? 1 : 0; s.e = ease(k); cv.redraw(); anim.play(); } };
}

/** A filled rounded rectangle (alpha tint) with a solid border. */
export function rect(ctx, x, y, w, h, color, { alpha = 0.85, stroke, r = 4, dash } = {}) {
  if (w <= 0 || h <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)) : ctx.rect(x, y, w, h);
  ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fill();
  if (stroke) { ctx.globalAlpha = 1; ctx.lineWidth = 1.5; ctx.strokeStyle = stroke; if (dash) ctx.setLineDash(dash); ctx.stroke(); }
  ctx.restore();
}

/** A label centred in a segment if it fits, else nothing. */
export function inside(ctx, s, x, y, w, col, size = 11) {
  ctx.save(); ctx.font = `600 ${size}px system-ui,sans-serif`;
  const fits = ctx.measureText(s).width < w - 6;
  ctx.restore();
  if (fits) text(ctx, s, x + w / 2, y, { color: col, size, weight: 600, align: 'center', fit: false });
  return fits;
}
