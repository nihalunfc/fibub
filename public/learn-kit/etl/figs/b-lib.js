// Shared drawing helpers for the Pipeline to Dashboard step-player figures of Modules 3 and 4 (boxes, graphs,
// a step controller with a short ease between steps). Not a figure itself: lessons never name it in data-fig.
import { canvas, text, title, arrow, ease, loop, calm } from '../../kit.js';

/** Colour for a state: idle, run, done, fail, stale, skip. */
export function tone(col, s) {
  return { idle: col.muted, run: col.s[0], done: col.good || col.s[2], fail: col.bad || col.s[1], stale: col.warn || col.s[3], skip: col.line, key: col.s[4] }[s] || col.muted;
}

/** A rounded box with a tinted fill, a solid border and a centred label (and an optional small second line). */
export function box(ctx, x, y, w, h, label, col, { state = 'idle', size = 11.5, sub, dash, alpha = 0.2 } = {}) {
  const c = tone(col, state);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, 6) : ctx.rect(x, y, w, h);
  ctx.fillStyle = col.panel; ctx.fill();
  ctx.globalAlpha = state === 'idle' || state === 'skip' ? 0.06 : alpha; ctx.fillStyle = c; ctx.fill();
  ctx.globalAlpha = 1; ctx.lineWidth = state === 'run' ? 2.5 : 1.5; ctx.strokeStyle = c;
  if (dash || state === 'stale' || state === 'skip') ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.restore();
  const cx = x + w / 2;
  if (sub) {
    text(ctx, label, cx, y + h / 2 - 7, { color: col.ink, size, weight: 650, align: 'center', fit: false });
    text(ctx, sub, cx, y + h / 2 + 8, { color: col.muted, size: size - 1.5, align: 'center', fit: false });
  } else text(ctx, label, cx, y + h / 2, { color: col.ink, size, weight: 650, align: 'center', fit: false });
}

/** An arrow from the right edge of box a to the left edge of box b (boxes are {x, y, w, h}). */
export function link(ctx, a, b, color) {
  const x0 = a.x + a.w, y0 = a.y + a.h / 2, x1 = b.x, y1 = b.y + b.h / 2;
  arrow(ctx, x0 + 2, y0, x1 - 3, y1, color, 1.5, 7);
}

/**
 * A step-player figure. draw(ctx, w, h, col, step, e) is called with the current step and the eased progress e (0..1)
 * of the move from the previous step. Returns the controller the lesson kit calls with step(i, n).
 */
export function stepFig(host, { aspect = 0.55, max = 300, min = 230, label, name, draw, last = 9 }) {
  const cv = canvas(host, { aspect, max, min, label });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.4); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    draw(ctx, w, h, col, step, ease(k), prev);
    if (name) title(ctx, name, col);
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, last); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}

/** A one-line note along the bottom of a figure. */
export function note(ctx, s, w, h, col) {
  text(ctx, s, w / 2, h - 14, { color: col.ink, size: 12, weight: 600, align: 'center' });
}

/**
 * A graph of boxes. nodes: [{ id, label, sub, fx, fy }] with fx, fy as fractions of the drawing area;
 * edges: [[from, to]]; states: { id: state }.
 */
export function graph(ctx, w, h, col, nodes, edges, states, { top = 40, bottom = 34, bw = 0.2, bh = 34 } = {}) {
  const W = Math.min(w * bw, 150), H = bh, area = h - top - bottom;
  const at = {};
  for (const nd of nodes) at[nd.id] = { x: 8 + nd.fx * (w - 16 - W), y: top + nd.fy * (area - H), w: W, h: H };
  for (const [a, b] of edges) link(ctx, at[a], at[b], col.muted);
  for (const nd of nodes) { const p = at[nd.id]; box(ctx, p.x, p.y, p.w, p.h, nd.label, col, { state: states[nd.id] || 'idle', sub: nd.sub, size: W < 80 ? 10 : 11.5 }); }
  return at;
}
