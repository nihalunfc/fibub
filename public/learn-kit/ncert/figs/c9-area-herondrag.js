// Class 9 Area: Heron's formula live. Drag the three corners of a triangle on the grid (1 square = 1 m). The sides,
// s = (a + b + c)/2 and area = sqrt(s(s - a)(s - b)(s - c)) are worked out from the lengths alone; the same area is
// found a second way from base x height / 2 to show that the two agree.
import { canvas, text, title, readout, dot } from '../../kit.js';
import { heron } from './c9-area-lib.js';

export default function (host) {
  const V = [[2, 1], [14, 1], [6, 9]];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A triangle on a grid with draggable corners and the area worked out by Heron formula' });
  cv.c.style.touchAction = 'none'; cv.c.style.cursor = 'grab';
  const out = readout(host);
  let map = null, drag = -1;
  const GX = 16, GY = 11;
  const info = () => {
    const [A, B, C] = V, d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]), a = d(B, C), b = d(A, C), c = d(A, B), s = (a + b + c) / 2, ar = heron(a, b, c);
    const tw = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2, hgt = c ? (2 * tw) / c : 0;
    return { a, b, c, s, ar, tw, hgt };
  };
  function sync() {
    const q = info(), f = (v) => v.toFixed(2);
    out.innerHTML = q.ar < 0.001 ? 'The three corners are in a straight line, so there is no triangle: the area is 0. Drag a corner away from the line.' : `Sides a = ${f(q.a)}, b = ${f(q.b)}, c = ${f(q.c)} m. s = ${f(q.s)}. Heron: √(${f(q.s)} × ${f(q.s - q.a)} × ${f(q.s - q.b)} × ${f(q.s - q.c)}) = <b>${f(q.ar)} m²</b>. Base × height: ½ × ${f(q.c)} × ${f(q.hgt)} = ${f(q.tw)} m².`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Drag the corners: Heron finds the area', col), s = Math.min((w - 20) / GX, (h - top - 30) / GY), ox = (w - s * GX) / 2, oy = h - 14;
    map = { X: (x) => ox + x * s, Y: (y) => oy - y * s, s, ox, oy };
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let i = 0; i <= GX; i++) { ctx.beginPath(); ctx.moveTo(ox + i * s, oy); ctx.lineTo(ox + i * s, oy - GY * s); ctx.stroke(); }
    for (let j = 0; j <= GY; j++) { ctx.beginPath(); ctx.moveTo(ox, oy - j * s); ctx.lineTo(ox + GX * s, oy - j * s); ctx.stroke(); }
    const P = V.map((v) => [map.X(v[0]), map.Y(v[1])]), q = info();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    const mid = (p, r) => [(p[0] + r[0]) / 2, (p[1] + r[1]) / 2], cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
    [[P[1], P[2], q.a, 'a'], [P[0], P[2], q.b, 'b'], [P[0], P[1], q.c, 'c']].forEach(([p, r, v, n]) => { const m = mid(p, r), dx = m[0] - cx, dy = m[1] - cy, L = Math.hypot(dx, dy) || 1; text(ctx, n + ' = ' + v.toFixed(1), m[0] + (dx / L) * 24, m[1] + (dy / L) * 12, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); });
    text(ctx, 'Area ' + q.ar.toFixed(1) + ' m²', w / 2, top + 14, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    ['A', 'B', 'C'].forEach((n, i) => { dot(ctx, P[i][0], P[i][1], drag === i ? 9 : 7, col.s[2], col.ink); });
  };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [(e.clientX - r.left - map.ox) / map.s, (map.oy - (e.clientY - r.top)) / map.s]; };
  cv.c.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(e); let best = -1, bd = 1.6;
    V.forEach((v, i) => { const d = Math.hypot(v[0] - x, v[1] - y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { drag = best; cv.c.setPointerCapture(e.pointerId); cv.c.style.cursor = 'grabbing'; e.preventDefault(); }
  });
  cv.c.addEventListener('pointermove', (e) => { if (drag < 0) return; const [x, y] = pos(e); V[drag] = [Math.min(GX, Math.max(0, Math.round(x * 2) / 2)), Math.min(GY, Math.max(0, Math.round(y * 2) / 2))]; sync(); });
  const end = () => { drag = -1; cv.c.style.cursor = 'grab'; cv.redraw(); };
  cv.c.addEventListener('pointerup', end); cv.c.addEventListener('pointercancel', end);
  sync();
}
