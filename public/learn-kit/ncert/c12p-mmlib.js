// Shared helpers for the Class 12 Physics chapters 4-6 figures (c12p-*): field marks, vectors, dragging, units.
// Not a figure itself (it lives next to figs/, not inside it).
import { line, text, touchGuard } from '../kit.js';

export const MU0 = 4e-7 * Math.PI;
export const rad = (d) => (d * Math.PI) / 180;
/** Rotate a maths-coordinates vector (y up) anticlockwise by a radians. */
export const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
/** A circle with a cross: field pointing INTO the page. */
export function into(ctx, x, y, r, color, w = 1.5) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
  const d = r * 0.7; ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.moveTo(x - d, y + d); ctx.lineTo(x + d, y - d); ctx.stroke(); ctx.restore();
}
/** A circle with a dot: field pointing OUT of the page. */
export function outof(ctx, x, y, r, color, w = 1.5) {
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, Math.max(1.5, r * 0.3), 0, 7); ctx.fill(); ctx.restore();
}
/** A grid of crosses (into) or dots (out) filling a rectangle. */
export function bgrid(ctx, x0, y0, x1, y1, isInto, color, gap = 34, r = 5) {
  for (let y = y0 + gap / 2; y < y1; y += gap) for (let x = x0 + gap / 2; x < x1; x += gap) (isInto ? into : outof)(ctx, x, y, r, color, 1.2);
}
/** Pointer dragging on a figure canvas: f(x, y, phase) with canvas pixel coordinates. */
export function drag(cv, f, near = () => true) {
  const c = cv.c; c.style.cursor = 'grab'; let on = false;
  const pos = (e) => { const b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  touchGuard(c, near);
  c.addEventListener('pointerdown', (e) => { const p = pos(e); if (e.pointerType === 'touch' && !near(...p)) return; on = true; c.setPointerCapture(e.pointerId); f(...p, 'down'); });
  c.addEventListener('pointermove', (e) => { if (on) f(...pos(e), 'move'); });
  const up = () => { on = false; };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
}
/** A short number with a unit prefix: 3.2 mT, 45 µT, 12 nT. */
export function si(v, unit) {
  const a = Math.abs(v);
  const P = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  if (a === 0) return `0 ${unit}`;
  const [m, p] = P.find(([m]) => a >= m * 0.9995) ?? P[P.length - 1];
  return `${+(v / m).toPrecision(3)} ${p}${unit}`;
}
/** Dashed field line helper: a polyline of maths points drawn with an arrow head at index k. */
export function headed(ctx, pts, k, color, w = 1.6) {
  line(ctx, pts, color, w);
  const a = pts[Math.min(pts.length - 1, k + 1)], b = pts[k]; if (!a || !b) return;
  const ang = Math.atan2(a[1] - b[1], a[0] - b[0]); ctx.save(); ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(b[0] + 6 * Math.cos(ang), b[1] + 6 * Math.sin(ang));
  ctx.lineTo(b[0] + 6 * Math.cos(ang + 2.5), b[1] + 6 * Math.sin(ang + 2.5)); ctx.lineTo(b[0] + 6 * Math.cos(ang - 2.5), b[1] + 6 * Math.sin(ang - 2.5)); ctx.fill(); ctx.restore();
}
export { text };

/**
 * Field lines of a set of magnetic poles (pole model, pixel coordinates, y down). poles: [{x, y, s: +1 north / -1 south, out: [ox, oy]}].
 * Lines start at each north pole in the half plane facing outwards and end at a south pole or the box. Returns arrays of [x, y].
 */
export function poleLines(poles, box, per = 9, h = 4) {
  const B = (x, y) => { let bx = 0, by = 0; for (const p of poles) { const dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 1, k = p.s / (r2 * Math.sqrt(r2)); bx += dx * k; by += dy * k; } return [bx, by]; };
  const dirAt = (x, y) => { const [bx, by] = B(x, y), L = Math.hypot(bx, by) || 1; return [bx / L, by / L]; };
  const out = [];
  for (const p of poles.filter((q) => q.s > 0)) {
    const base = Math.atan2(p.out[1], p.out[0]);
    const offs = (per <= 7 ? [0, 45, 90, 130] : [0, 35, 65, 95, 125, 150]).flatMap((d) => (d ? [d, -d] : [0]));
    for (const od of offs) {
      const a = base + (od * Math.PI) / 180; let x = p.x + 7 * Math.cos(a), y = p.y + 7 * Math.sin(a); const pts = [[p.x, p.y], [x, y]];
      for (let i = 0; i < 1500; i++) {
        const d1 = dirAt(x, y), d2 = dirAt(x + d1[0] * h / 2, y + d1[1] * h / 2); x += d2[0] * h; y += d2[1] * h; pts.push([x, y]);
        if (x < box.x0 || x > box.x1 || y < box.y0 || y > box.y1) break;
        if (poles.some((q) => q.s < 0 && Math.hypot(x - q.x, y - q.y) < 6)) { const q = poles.find((q2) => q2.s < 0 && Math.hypot(x - q2.x, y - q2.y) < 6); pts.push([q.x, q.y]); break; }
      }
      out.push(pts);
    }
  }
  return out;
}
/** Field direction (unit vector) of the poles at a point. */
export function poleDir(poles, x, y) {
  let bx = 0, by = 0; for (const p of poles) { const dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 1, k = p.s / (r2 * Math.sqrt(r2)); bx += dx * k; by += dy * k; }
  const L = Math.hypot(bx, by) || 1; return [bx / L, by / L, Math.hypot(bx, by)];
}
/** Draw a bar magnet (north red, south blue) centred at cx, cy, length L, thickness t, pointing along angle a (screen radians; north end first). */
export function barMagnet(ctx, cx, cy, L, t, col, a = 0) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
  ctx.fillStyle = col.s[1]; ctx.fillRect(0, -t / 2, L / 2, t); ctx.fillStyle = col.s[0]; ctx.fillRect(-L / 2, -t / 2, L / 2, t);
  ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(-L / 2, -t / 2, L, t);
  ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(t * 0.55) + 'px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('N', L / 4, 1); ctx.fillText('S', -L / 4, 1);
  ctx.restore();
}
