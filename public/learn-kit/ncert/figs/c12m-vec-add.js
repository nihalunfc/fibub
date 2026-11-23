// Class 12 Maths, Vector Algebra: adding and subtracting vectors. Drag the tips of a and b (they snap to whole numbers).
// Triangle law: put the tail of b at the head of a, then a + b goes from the start of a to the head of b; the parallelogram gives the same answer.
// a - b = a + (-b): turn b around and add. k a stretches a by |k| (and flips it when k is negative); components simply add or scale.
import { canvas, text, title, line, dot, arrow, row, choice, slider, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let a = [3, 1], b = [1, 3], mode = 'sum', k = 2;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Two vectors a and b that can be dragged, with their sum or difference drawn by the triangle and parallelogram laws' });
  const ctl = row(host);
  choice(ctl, 'show', [['sum', 'a + b'], ['diff', 'a − b'], ['scal', 'k a']], mode, (v) => { mode = v; ks.style.display = v === 'scal' ? '' : 'none'; go(); });
  const kslider = slider(ctl, { label: 'k', min: -2, max: 2, step: 0.5, value: k, fmt: (v) => String(v), oninput: (v) => { k = v; go(); } });
  const ks = ctl.lastElementChild; ks.style.display = 'none';
  const ro = readout(host);
  let g = { s: 30, ox: 0, oy: 0 };
  const X = (u) => g.ox + u * g.s, Y = (v) => g.oy - v * g.s;
  const tip = (p) => [X(p[0]), Y(p[1])];
  const near = (x, y) => [a, b].findIndex((p) => Math.hypot(x - X(p[0]), y - Y(p[1])) < 20);
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  let dragI = -1;
  const xy = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = xy(e); dragI = near(x, y); if (dragI >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (dragI < 0) return; const [x, y] = xy(e); const p = [Math.max(-5, Math.min(5, Math.round((x - g.ox) / g.s))), Math.max(-4, Math.min(4, Math.round((g.oy - y) / g.s)))]; if (dragI === 0) a = p; else b = p; go(); });
  cv.c.addEventListener('pointerup', () => { dragI = -1; });
  const mag = (p) => Math.hypot(p[0], p[1]);
  const go = () => {
    const f = (p) => `(${p[0]}, ${p[1]})`;
    const r = mode === 'sum' ? [a[0] + b[0], a[1] + b[1]] : mode === 'diff' ? [a[0] - b[0], a[1] - b[1]] : [k * a[0], k * a[1]];
    ro.textContent = mode === 'sum' ? `a = ${f(a)}, b = ${f(b)}: a + b = ${f(r)}, |a + b| = ${mag(r).toFixed(2)}.  Components add.  Note |a + b| ≤ |a| + |b| = ${(mag(a) + mag(b)).toFixed(2)}.`
      : mode === 'diff' ? `a − b = ${f(r)}, |a − b| = ${mag(r).toFixed(2)}.  It is the arrow from the head of b to the head of a.`
      : `${k} a = ${f(r)}, |${k} a| = ${mag(r).toFixed(2)} = |${k}| × |a|.  ${k < 0 ? 'A negative k reverses the direction.' : k === 0 ? 'k = 0 gives the zero vector.' : 'A positive k keeps the direction.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'sum' ? 'Triangle and parallelogram law' : mode === 'diff' ? 'Subtracting: add the reverse' : 'Multiply by a scalar', col);
    g.s = Math.min((w - 24) / 11, (h - top - 20) / 9); g.ox = w / 2; g.oy = top + 14 + 4.4 * g.s;
    for (let i = -5; i <= 5; i++) line(ctx, [[X(i), Y(-4)], [X(i), Y(4)]], col.line, i === 0 ? 1.4 : 0.6);
    for (let j = -4; j <= 4; j++) line(ctx, [[X(-5), Y(j)], [X(5), Y(j)]], col.line, j === 0 ? 1.4 : 0.6);
    const O = [X(0), Y(0)], A = tip(a), B = tip(b);
    const aC = col.s[0], bC = col.s[1], rC = col.s[3];
    if (mode === 'sum') {
      const S = tip([a[0] + b[0], a[1] + b[1]]);
      line(ctx, [O, B, S], bC, 1.2, [4, 3]); line(ctx, [A, S], bC, 1.5, [5, 3]);
      arrow(ctx, A[0], A[1], S[0], S[1], bC, 2, 8);
      arrow(ctx, O[0], O[1], S[0], S[1], rC, 3, 10); text(ctx, 'a + b', (O[0] + S[0]) / 2 + 8, (O[1] + S[1]) / 2 - 10, { color: rC, size: 12, weight: 700, halo: col.panel });
    } else if (mode === 'diff') {
      const D = tip([a[0] - b[0], a[1] - b[1]]), nb = tip([-b[0], -b[1]]);
      arrow(ctx, O[0], O[1], nb[0], nb[1], bC, 1.5, 7); text(ctx, '−b', nb[0] - 6, nb[1] + 12, { color: bC, size: 11, weight: 700, align: 'right' });
      line(ctx, [A, D], bC, 1.5, [5, 3]);
      arrow(ctx, B[0], B[1], A[0], A[1], rC, 2, 8);
      arrow(ctx, O[0], O[1], D[0], D[1], rC, 3, 10); text(ctx, 'a − b', D[0] + 8, D[1] - 4, { color: rC, size: 12, weight: 700, halo: col.panel });
    } else {
      const K = tip([k * a[0], k * a[1]]);
      arrow(ctx, O[0], O[1], K[0], K[1], rC, 3, 10); text(ctx, `${k} a`, K[0] + 8, K[1] - 8, { color: rC, size: 12, weight: 700, halo: col.panel });
    }
    arrow(ctx, O[0], O[1], A[0], A[1], aC, 3, 10); text(ctx, 'a', A[0] + 8, A[1] - 8, { color: aC, size: 13, weight: 700 });
    if (mode !== 'scal') { arrow(ctx, O[0], O[1], B[0], B[1], bC, 3, 10); text(ctx, 'b', B[0] + 8, B[1] - 8, { color: bC, size: 13, weight: 700 }); }
    dot(ctx, A[0], A[1], 6, aC, col.panel); if (mode !== 'scal') dot(ctx, B[0], B[1], 6, bC, col.panel);
  };
  go();
}
