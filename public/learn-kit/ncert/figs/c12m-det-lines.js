// Class 12 Determinants: two linear equations a1x + b1y = c1 and a2x + b2y = c2 are two lines. With D = a1b2 - a2b1:
// D != 0 means the lines cross once (unique solution, x = Dx/D, y = Dy/D); D = 0 means parallel (no solution) or the same line
// (infinitely many). Change the second equation and watch D, Dx, Dy and the picture agree.
import { canvas, text, title, line, dot, axes, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  const E1 = [2, 1, 5]; let a = 1, b = -1, c = 1;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Two lines whose crossing point is found with determinants' });
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  const sa = slider(ctl, { label: 'a₂', min: -6, max: 6, step: 1, value: a, fmt: (v) => String(Math.round(v)), oninput: (v) => { a = Math.round(v); say(); } });
  const sb = slider(ctl, { label: 'b₂', min: -6, max: 6, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); say(); } });
  const sc = slider(ctl, { label: 'c₂', min: -10, max: 10, step: 1, value: c, fmt: (v) => String(Math.round(v)), oninput: (v) => { c = Math.round(v); say(); } });
  const set = (x, y, z) => { a = x; b = y; c = z; sa.set(x); sb.set(y); sc.set(z); say(); };
  button(ctl2, 'Crossing lines', () => set(1, -1, 1)); button(ctl2, 'Parallel lines', () => set(4, 2, 6)); button(ctl2, 'Same line', () => set(4, 2, 10));
  const calc = () => { const D = E1[0] * b - a * E1[1], Dx = E1[2] * b - c * E1[1], Dy = E1[0] * c - a * E1[2]; return { D, Dx, Dy }; };
  function say() {
    const { D, Dx, Dy } = calc();
    out.innerHTML = `Equation 1: 2x + y = 5. Equation 2: ${a}x + ${b < 0 ? '(' + b + ')' : b}y = ${c}.<br>D = ${E1[0]}×${b} − ${a}×${E1[1]} = <b>${D}</b>, Dx = ${Dx}, Dy = ${Dy}. ` +
      (D !== 0 ? `So x = ${Dx}/${D} = <b>${+(Dx / D).toFixed(3)}</b>, y = ${Dy}/${D} = <b>${+(Dy / D).toFixed(3)}</b>: one solution.` : Dx === 0 && Dy === 0 ? '<b>D = 0 and Dx = Dy = 0: the same line, infinitely many solutions.</b>' : '<b>D = 0 but Dx or Dy is not 0: parallel lines, no solution (inconsistent).</b>');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Where do the two lines meet?', col);
    const A = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 30, r: 12, t: 40, b: 26, xt: [-4, 0, 4], yt: [-4, 0, 4] });
    const draw = (p, q, r, c0) => {
      ctx.save(); A.clip();
      const pts = q !== 0 ? [[-6, (r + 6 * p) / q], [6, (r - 6 * p) / q]] : p !== 0 ? [[r / p, -6], [r / p, 6]] : [];
      line(ctx, pts.map(([x, y]) => [A.X(x), A.Y(y)]), c0, 3); ctx.restore();
    };
    draw(E1[0], E1[1], E1[2], col.s[0]); draw(a, b, c, col.s[3]);
    const { D, Dx, Dy } = calc();
    if (D !== 0) { const x = Dx / D, y = Dy / D; if (Math.abs(x) <= 6 && Math.abs(y) <= 6) { dot(ctx, A.X(x), A.Y(y), 7, col.s[1], col.ink); text(ctx, `(${+x.toFixed(2)}, ${+y.toFixed(2)})`, A.X(x) + 9, A.Y(y) - 12, { color: col.ink, size: 12, weight: 800, halo: col.panel }); } }
    text(ctx, 'line 1: 2x + y = 5', A.L + 6, A.T + 10, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'line 2: your equation', A.L + 6, A.T + 26, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
  };
  say();
}
