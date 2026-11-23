// Helpers for the Class 11 Maths geometry and statistics figures (chapters 10 to 14): an equal-scale world window, grid and curve drawing.
import { text, line } from '../kit.js';

/** Fit the world rectangle x:[x0,x1], y:[y0,y1] into the canvas below `top` with equal scale on both axes. */
export function world(w, h, top, x, y, pad = 8) {
  const s = Math.min((w - 2 * pad) / (x[1] - x[0]), (h - top - pad) / (y[1] - y[0]));
  const cx = (x[0] + x[1]) / 2, cy = (y[0] + y[1]) / 2, mx = w / 2, my = top + (h - top) / 2;
  const W = { s, X: (v) => mx + (v - cx) * s, Y: (v) => my - (v - cy) * s, ix: (p) => cx + (p - mx) / s, iy: (p) => cy - (p - my) / s };
  W.P = (a, b) => [W.X(a), W.Y(b)];
  W.box = [mx - ((x[1] - x[0]) * s) / 2, my - ((y[1] - y[0]) * s) / 2, (x[1] - x[0]) * s, (y[1] - y[0]) * s];
  W.clip = (ctx) => { ctx.beginPath(); ctx.rect(...W.box); ctx.clip(); };
  W.x = x; W.y = y;
  return W;
}
/** Light grid at whole numbers (every `step`) and the two axes through the origin, with tick numbers. */
export function grid(ctx, W, col, step = 1, labels = true) {
  const [bx, by, bw, bh] = W.box;
  ctx.save(); W.clip(ctx); ctx.lineWidth = 1; ctx.strokeStyle = col.line;
  for (let v = Math.ceil(W.x[0] / step) * step; v <= W.x[1] + 1e-9; v += step) { const p = Math.round(W.X(v)) + 0.5; ctx.beginPath(); ctx.moveTo(p, by); ctx.lineTo(p, by + bh); ctx.stroke(); }
  for (let v = Math.ceil(W.y[0] / step) * step; v <= W.y[1] + 1e-9; v += step) { const p = Math.round(W.Y(v)) + 0.5; ctx.beginPath(); ctx.moveTo(bx, p); ctx.lineTo(bx + bw, p); ctx.stroke(); }
  ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath();
  ctx.moveTo(bx, W.Y(0)); ctx.lineTo(bx + bw, W.Y(0)); ctx.moveTo(W.X(0), by); ctx.lineTo(W.X(0), by + bh); ctx.stroke();
  ctx.restore();
  if (labels) {
    for (let v = Math.ceil(W.x[0] / step) * step; v <= W.x[1] + 1e-9; v += step) if (v && v % (step * 2) === 0) text(ctx, String(v).replace('-', '−'), W.X(v), Math.min(by + bh - 7, W.Y(0) + 9), { color: col.muted, size: 10, align: 'center', fit: false });
    for (let v = Math.ceil(W.y[0] / step) * step; v <= W.y[1] + 1e-9; v += step) if (v && v % (step * 2) === 0) text(ctx, String(v).replace('-', '−'), Math.max(bx + 8, W.X(0) - 5), W.Y(v), { color: col.muted, size: 10, align: 'right', fit: false });
  }
}
/** Draw the parametric curve f(t) -> [x, y] (world units) for t in [t0, t1]; it is cut at non-finite values and big jumps, and clipped to the window. */
export function path(ctx, W, f, t0, t1, n, color, width = 2.4, dash) {
  ctx.save(); W.clip(ctx); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); let pen = false, px = 0, py = 0;
  for (let i = 0; i <= n; i++) {
    const p = f(t0 + ((t1 - t0) * i) / n);
    if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) { pen = false; continue; }
    const X = W.X(p[0]), Y = W.Y(p[1]);
    if (pen && Math.hypot(X - px, Y - py) < 120) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
    pen = true; px = X; py = Y;
  }
  ctx.stroke(); ctx.restore();
}
/** A straight segment in world units, clipped to the window. */
export function seg(ctx, W, a, b, color, width = 1.6, dash) {
  ctx.save(); W.clip(ctx); line(ctx, [W.P(...a), W.P(...b)], color, width, dash); ctx.restore();
}
/** Format a number for readouts: whole numbers stay whole, others to d places; minus sign is a proper minus. */
export const f = (v, d = 2) => (+(+v).toFixed(d)).toString().replace('-', '−');
