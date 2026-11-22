// Vector addition head to tail: drag the tip of A or the tip of B. The resultant R = A + B runs from the start of A
// to the end of B. Switch to the parallelogram view, or to components, to see that the order does not matter.
import { canvas, text, row, choice, readout, arrow, line, dot } from '../kit.js';
import { drag } from './_mech.js';

export default function (host) {
  let A = [4, 1], B = [1, 3], mode = 'tail';
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 280, label: 'Two vectors added head to tail on a grid' });
  const ctl = row(host);
  choice(ctl, 'View', [['tail', 'Head to tail'], ['para', 'Parallelogram'], ['comp', 'Components']], mode, (v) => { mode = v; cv.redraw(); show(); });
  const out = readout(host);
  const X0 = -1, X1 = 10, Y0 = -1, Y1 = 8;
  const sc = () => Math.min((cv.w - 20) / (X1 - X0), (cv.h - 20) / (Y1 - Y0));
  const px = (x, y) => [10 + (x - X0) * sc(), cv.h - 10 - (y - Y0) * sc()];
  const un = (sx, sy) => [(sx - 10) / sc() + X0, (cv.h - 10 - sy) / sc() + Y0];
  drag(cv, () => [px(...A), px(A[0] + B[0], A[1] + B[1])], (i, sx, sy) => {
    const [x, y] = un(sx, sy).map((v) => Math.round(v * 2) / 2);
    if (i === 0) A = [x, y]; else B = [x - A[0], y - A[1]];
    show();
  });
  const mag = (v) => Math.hypot(v[0], v[1]), ang = (v) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
  function show() {
    const R = [A[0] + B[0], A[1] + B[1]];
    out.innerHTML = `<b>A</b> = (${A[0]}, ${A[1]}), |A| = ${mag(A).toFixed(2)} · <b>B</b> = (${B[0]}, ${B[1]}), |B| = ${mag(B).toFixed(2)} · <b>R = A + B</b> = (${R[0]}, ${R[1]}), |R| = ${mag(R).toFixed(2)} at ${ang(R).toFixed(1)}° from the x-axis. Note |R| ≤ |A| + |B| = ${(mag(A) + mag(B)).toFixed(2)}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    for (let x = 0; x <= X1; x++) { const [a, b] = px(x, Y0), [c, d] = px(x, Y1); line(ctx, [[a, b], [c, d]], x === 0 ? col.muted : col.line, x === 0 ? 1.5 : 1); }
    for (let y = 0; y <= Y1; y++) { const [a, b] = px(X0, y), [c, d] = px(X1, y); line(ctx, [[a, b], [c, d]], y === 0 ? col.muted : col.line, y === 0 ? 1.5 : 1); }
    const o = px(0, 0), a = px(...A), ab = px(A[0] + B[0], A[1] + B[1]), b = px(...B);
    if (mode === 'para') {
      ctx.save(); ctx.setLineDash([5, 4]); line(ctx, [o, b, ab], col.s[1], 1.5); ctx.restore();
      arrow(ctx, o[0], o[1], b[0], b[1], col.s[1], 2);
    }
    if (mode === 'comp') {
      const rx = px(A[0] + B[0], 0), ry = px(0, A[1] + B[1]);
      ctx.save(); ctx.setLineDash([5, 4]); line(ctx, [ab, rx], col.muted, 1.5); line(ctx, [ab, ry], col.muted, 1.5); ctx.restore();
      arrow(ctx, o[0], o[1], rx[0], rx[1], col.s[2], 3); arrow(ctx, o[0], o[1], ry[0], ry[1], col.s[2], 3);
      text(ctx, `Rx = ${A[0] + B[0]}`, (o[0] + rx[0]) / 2, o[1] + 14, { color: col.s[2], size: 11, align: 'center', weight: 600 });
      text(ctx, `Ry = ${A[1] + B[1]}`, o[0] + 8, (o[1] + ry[1]) / 2, { color: col.s[2], size: 11, weight: 600 });
    }
    arrow(ctx, o[0], o[1], a[0], a[1], col.s[0], 3);
    if (mode !== 'para') arrow(ctx, a[0], a[1], ab[0], ab[1], col.s[1], 3);
    arrow(ctx, o[0], o[1], ab[0], ab[1], col.bad, 3.5);
    text(ctx, 'A', (o[0] + a[0]) / 2 - 8, (o[1] + a[1]) / 2 - 8, { color: col.s[0], size: 14, weight: 700 });
    text(ctx, 'B', (a[0] + ab[0]) / 2 + 8, (a[1] + ab[1]) / 2 - 8, { color: col.s[1], size: 14, weight: 700 });
    text(ctx, 'R', (o[0] + ab[0]) / 2 - 12, (o[1] + ab[1]) / 2 + 10, { color: col.bad, size: 14, weight: 700 });
    dot(ctx, a[0], a[1], 7, col.s[0], col.panel); dot(ctx, ab[0], ab[1], 7, col.s[1], col.panel);
    text(ctx, 'Drag the two round tips', 12, 14, { color: col.muted, size: 11 });
  };
  show();
}
