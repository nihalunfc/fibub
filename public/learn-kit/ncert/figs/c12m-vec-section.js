// Class 12 Maths, Vector Algebra: the section formula. A point P divides the line from A to B in the ratio m : n.
// Internally: r_P = (n a + m b)/(m + n).  Externally: r_P = (m b - n a)/(m - n).  Drag A and B, slide m and n, flip internal/external.
import { canvas, text, title, line, dot, arrow, row, choice, slider, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let A = [-3, -1], B = [4, 2], m = 2, n = 1, mode = 'in';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Two draggable points A and B and the point P that divides AB in a ratio m to n, inside or outside' });
  const ctl = row(host);
  choice(ctl, 'divides', [['in', 'internally'], ['out', 'externally']], mode, (v) => { mode = v; fixN(); go(); });
  const sm = slider(ctl, { label: 'm', min: 1, max: 5, step: 1, value: m, fmt: (v) => String(v), oninput: (v) => { m = v; fixN(); go(); } });
  const sn = slider(ctl, { label: 'n', min: 1, max: 5, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; fixN(); go(); } });
  const ro = readout(host);
  const fixN = () => { if (mode === 'out' && m === n) { n = m === 5 ? 4 : m + 1; sn.set(n); } };
  const g = { s: 28, ox: 0, oy: 0 }, X = (u) => g.ox + u * g.s, Y = (v) => g.oy - v * g.s;
  const near = (x, y) => [A, B].findIndex((p) => Math.hypot(x - X(p[0]), y - Y(p[1])) < 20);
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  let di = -1;
  const xy = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.c.addEventListener('pointerdown', (e) => { di = near(...xy(e)); if (di >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (di < 0) return; const [x, y] = xy(e); const p = [Math.max(-5, Math.min(5, Math.round((x - g.ox) / g.s))), Math.max(-4, Math.min(4, Math.round((g.oy - y) / g.s)))]; if (di === 0) A = p; else B = p; go(); });
  cv.c.addEventListener('pointerup', () => { di = -1; });
  const P = () => mode === 'in' ? [(n * A[0] + m * B[0]) / (m + n), (n * A[1] + m * B[1]) / (m + n)] : [(m * B[0] - n * A[0]) / (m - n), (m * B[1] - n * A[1]) / (m - n)];
  const go = () => {
    const p = P(), f = (v) => +v.toFixed(2);
    ro.textContent = mode === 'in' ? `P = (${n}a + ${m}b)/${m + n} = (${f(p[0])}, ${f(p[1])}).  With m : n = ${m} : ${n}, P is ${m}/${m + n} of the way from A to B.`
      : `P = (${m}b − ${n}a)/${m - n} = (${f(p[0])}, ${f(p[1])}).  P lies on the line AB, outside the segment, on the side of ${m > n ? 'B' : 'A'}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Section formula: A, P, B in the ratio m : n', col);
    g.s = Math.min((w - 24) / 12, (h - top - 16) / 9); g.ox = w / 2; g.oy = top + 12 + 4.4 * g.s;
    for (let i = -5; i <= 5; i++) line(ctx, [[X(i), Y(-4)], [X(i), Y(4)]], col.line, i === 0 ? 1.4 : 0.6);
    for (let j = -4; j <= 4; j++) line(ctx, [[X(-5), Y(j)], [X(5), Y(j)]], col.line, j === 0 ? 1.4 : 0.6);
    const p = P(), pa = [X(A[0]), Y(A[1])], pb = [X(B[0]), Y(B[1])], pp = [X(p[0]), Y(p[1])], O = [X(0), Y(0)];
    arrow(ctx, O[0], O[1], pa[0], pa[1], col.s[0], 1.3, 6); arrow(ctx, O[0], O[1], pb[0], pb[1], col.s[1], 1.3, 6); arrow(ctx, O[0], O[1], pp[0], pp[1], col.s[3], 1.8, 7);
    const dx = pb[0] - pa[0], dy = pb[1] - pa[1], ext = mode === 'out';
    line(ctx, [pa, pb], col.ink, 3);
    if (ext) line(ctx, m > n ? [pb, pp] : [pp, pa], col.ink, 2, [5, 4]);
    dot(ctx, pa[0], pa[1], 6.5, col.s[0], col.panel); dot(ctx, pb[0], pb[1], 6.5, col.s[1], col.panel); dot(ctx, pp[0], pp[1], 6, col.s[3], col.panel);
    const off = (q, sx, sy) => [q[0] + sx * 10, q[1] + sy * 12];
    [['A', pa, col.s[0]], ['B', pb, col.s[1]], ['P', pp, col.s[3]]].forEach(([t, q, c]) => { const o = off(q, dx >= 0 ? (t === 'A' ? -1 : 1) : (t === 'A' ? 1 : -1), -1); text(ctx, t, o[0], o[1], { color: c, size: 13, weight: 700, align: 'center', halo: col.panel }); });
    void dy;
  };
  go();
}
