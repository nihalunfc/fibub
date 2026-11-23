// Small helpers shared by the Class 12 Maths figures (chapters Determinants, Continuity and Differentiability, Application of
// Derivatives): drawing a matrix with brackets, plotting a function with breaks, and dragging handles on a canvas.
import { text, touchGuard } from '../kit.js';

export const det2 = (a, b, c, d) => a * d - b * c;
export const det3 = (m) => m[0][0] * det2(m[1][1], m[1][2], m[2][1], m[2][2]) - m[0][1] * det2(m[1][0], m[1][2], m[2][0], m[2][2]) + m[0][2] * det2(m[1][0], m[1][1], m[2][0], m[2][1]);
export const sg = (v) => (v < 0 ? '−' : '') + Math.abs(+v.toFixed(2));

/** Draw matrix M (rows of numbers or strings) centred at (cx, cy). hl: function (i, j) => colour or null. Returns {w, h, x0, y0, cw, ch}. */
export function matrix(ctx, M, cx, cy, col, { cw = 30, ch = 24, size = 14, hl = null, weight = 600 } = {}) {
  const r = M.length, c = M[0].length, w = c * cw, h = r * ch, x0 = cx - w / 2, y0 = cy - h / 2;
  ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0 - 2 + 6, y0 - 2); ctx.lineTo(x0 - 2, y0 - 2); ctx.lineTo(x0 - 2, y0 + h + 2); ctx.lineTo(x0 - 2 + 6, y0 + h + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0 + w + 2 - 6, y0 - 2); ctx.lineTo(x0 + w + 2, y0 - 2); ctx.lineTo(x0 + w + 2, y0 + h + 2); ctx.lineTo(x0 + w + 2 - 6, y0 + h + 2); ctx.stroke();
  ctx.restore();
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    const k = hl ? hl(i, j) : null, x = x0 + (j + 0.5) * cw, y = y0 + (i + 0.5) * ch;
    if (k) { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = k; ctx.fillRect(x - cw / 2 + 1, y - ch / 2 + 1, cw - 2, ch - 2); ctx.restore(); }
    const v = M[i][j];
    text(ctx, typeof v === 'number' ? sg(v) : String(v), x, y, { color: k ? col.ink : col.ink, size, weight: k ? 800 : weight, align: 'center', fit: false });
  }
  return { w, h, x0, y0, cw, ch };
}

/** Plot f over [a, b] in data space using mappers X, Y; breaks the line where f is not finite or jumps more than `jump` pixels. */
export function plot(ctx, X, Y, f, a, b, color, width = 2.5, n = 240, jump = 1e9) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.beginPath();
  let pen = false, py = 0;
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n, v = f(x);
    if (!Number.isFinite(v)) { pen = false; continue; }
    const px = X(x), y = Y(v);
    if (pen && Math.abs(y - py) < jump) ctx.lineTo(px, y); else ctx.moveTo(px, y);
    pen = true; py = y;
  }
  ctx.stroke(); ctx.restore();
}

/** Make handles draggable. handles() returns [{x, y}] in canvas pixels; onMove(index, x, y) gets canvas pixels. */
export function drag(cv, handles, onMove, reach = 26) {
  let on = -1;
  const pos = (e) => { const b = cv.c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const near = (x, y) => { let best = -1, bd = reach; handles().forEach((p, i) => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } }); return best; };
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); on = near(x, y); if (on >= 0) { cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => { if (on >= 0) { const [x, y] = pos(e); onMove(on, x, y); } });
  const up = () => (on = -1);
  cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
}
