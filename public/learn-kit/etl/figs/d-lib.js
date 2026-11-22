// Shared drawing helpers for the Pipeline to Dashboard step-player figures of Module 7 (boxes, notes and a step
// controller with a short ease between steps). Not a figure itself: lessons never name it in data-fig.
import { canvas, text, title, ease, loop, calm } from '../../kit.js';

/** Colour for a state: idle, run, done, fail, stale, skip, key. */
export function tone(col, s) {
  return { idle: col.muted, run: col.s[0], done: col.good || col.s[2], fail: col.bad || col.s[1], stale: col.warn || col.s[3], skip: col.line, key: col.s[4] }[s] || col.muted;
}

/** A rounded box with a tinted fill, a border in the state colour and a centred label (optional small second line). */
export function box(ctx, x, y, w, h, label, col, { state = 'idle', size = 11.5, sub, alpha = 0.2 } = {}) {
  const c = tone(col, state);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, 5) : ctx.rect(x, y, w, h);
  ctx.fillStyle = col.panel; ctx.fill();
  ctx.globalAlpha = state === 'idle' || state === 'skip' ? 0.06 : alpha; ctx.fillStyle = c; ctx.fill();
  ctx.globalAlpha = 1; ctx.lineWidth = state === 'run' ? 2.5 : 1.5; ctx.strokeStyle = c;
  if (state === 'stale' || state === 'skip') ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.restore();
  const cx = x + w / 2;
  if (sub) {
    text(ctx, label, cx, y + h / 2 - 7, { color: col.ink, size, weight: 650, align: 'center', fit: false });
    text(ctx, sub, cx, y + h / 2 + 8, { color: col.muted, size: size - 1.5, align: 'center', fit: false });
  } else text(ctx, label, cx, y + h / 2, { color: col.ink, size, weight: 650, align: 'center', fit: false });
}

/** A one-line note along the bottom of a figure. */
export function note(ctx, s, w, h, col, y = h - 14) {
  text(ctx, s, w / 2, y, { color: col.ink, size: 12, weight: 600, align: 'center' });
}

/**
 * A step-player figure. draw(ctx, w, h, col, step, e, prev) gets the current step and the eased progress e (0..1)
 * of the move from the previous step. Returns the controller the lesson kit calls with step(i, n).
 */
export function stepFig(host, { aspect = 0.55, max = 300, min = 230, label, name, draw, last = 9 }) {
  const cv = canvas(host, { aspect, max, min, label });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => {
    if (k < 1) { k = Math.min(1, k + dt * 1.4); cv.redraw(); } else anim.pause();
  }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    draw(ctx, w, h, col, step, ease(k), prev);
    if (name) title(ctx, name, col);
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, last); k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}

/** Clock text for minutes after midnight, such as 475 → "07:55". */
export const clock = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`;
