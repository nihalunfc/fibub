// 3.2 A quadratic's solutions are where its graph meets the x-axis; factor form shows them directly.
import { canvas, axes, line, dot, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'A parabola and its roots' });
  let p = -2, q = 3;
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'Root p', min: -6, max: 6, step: 1, value: p, fmt: f, oninput: (v) => { p = Math.round(v); go(); } });
  slider(ctl, { label: 'Root q', min: -6, max: 6, step: 1, value: q, fmt: f, oninput: (v) => { q = Math.round(v); go(); } });
  const out = readout(host);
  const sg = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
  const go = () => { cv.redraw(); const b = -(p + q), c = p * q; out.innerHTML = `(x ${sg(-p)})(x ${sg(-q)}) = x² ${sg(b)}x ${sg(c)}. The roots ${p} and ${q} add to ${p + q} (= −b) and multiply to ${c} (= c).${p === q ? ' Equal roots: the curve just touches the axis.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [-7, 7], y: [-15, 15], xlabel: 'x', ylabel: 'y' });
    const pts = []; for (let x = -7; x <= 7; x += 0.1) { const y = (x - p) * (x - q); if (Math.abs(y) <= 15) pts.push([X(x), Y(y)]); }
    line(ctx, pts, col.s[0], 2.5);
    dot(ctx, X(p), Y(0), 6, col.s[1]); dot(ctx, X(q), Y(0), 6, col.s[1]);
    title(ctx, 'Roots are where the curve crosses y = 0', col);
  };
  go();
}
