// Quadratic equations: y = ax² + bx + c. Move a, b and c and watch the roots, the discriminant and the vertex.
// The dashed line x = k helps with "location of roots" questions: the readout gives f(k), the vertex position and
// whether both roots lie beyond k.
import { canvas, axes, line, dot, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let a = 1, b = -3, c = 2, k = 0;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'Graph of a quadratic with its roots, vertex and a test line x = k' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'a', min: -3, max: 3, step: 0.5, value: a, fmt: (v) => fmt(v, 2), oninput: (v) => { a = v || 0.5; re(); } });
  slider(ctl, { label: 'b', min: -8, max: 8, step: 0.5, value: b, fmt: (v) => fmt(v, 2), oninput: (v) => { b = v; re(); } });
  slider(ctl, { label: 'c', min: -8, max: 8, step: 0.5, value: c, fmt: (v) => fmt(v, 2), oninput: (v) => { c = v; re(); } });
  slider(ctl, { label: 'k (test line)', min: -5, max: 5, step: 0.5, value: k, fmt: (v) => fmt(v, 2), oninput: (v) => { k = v; re(); } });
  const out = readout(host);
  const f = (x) => a * x * x + b * x + c;
  const show = () => {
    const D = b * b - 4 * a * c, xv = -b / (2 * a);
    let roots = D > 1e-12 ? `two real roots ${fmt((-b - Math.sqrt(D)) / (2 * a), 3)} and ${fmt((-b + Math.sqrt(D)) / (2 * a), 3)}` : Math.abs(D) <= 1e-12 ? `one repeated root ${fmt(xv, 3)}` : 'no real roots (complex pair)';
    const both = D >= 0 && a * f(k) > 0 ? (xv > k ? 'both roots are greater than k' : 'both roots are less than k') : D >= 0 && a * f(k) < 0 ? 'k lies between the roots' : '';
    out.innerHTML = `D = b² − 4ac = <b>${fmt(D, 3)}</b>: ${roots}. Vertex at x = −b/2a = ${fmt(xv, 3)}, y = ${fmt(f(xv), 3)}. Sum of roots −b/a = ${fmt(-b / a, 3)}, product c/a = ${fmt(c / a, 3)}. a·f(k) = ${fmt(a * f(k), 3)}${both ? `: ${both}` : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [-6, 6], y: [-10, 10], xlabel: 'x', ylabel: 'y' });
    line(ctx, [[X(-6), Y(0)], [X(6), Y(0)]], col.muted, 1);
    line(ctx, [[X(k), Y(-10)], [X(k), Y(10)]], col.s[2], 1.5, [5, 4]);
    const pts = []; for (let x = -6; x <= 6.001; x += 0.05) { const y = f(x); if (y > -12 && y < 12) pts.push([X(x), Y(y)]); else if (pts.length) { line(ctx, pts.splice(0), col.s[0], 2.5); } }
    if (pts.length) line(ctx, pts, col.s[0], 2.5);
    const D = b * b - 4 * a * c;
    if (D >= 0) [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].forEach((r) => Math.abs(r) <= 6 && dot(ctx, X(r), Y(0), 5, col.s[1]));
    const xv = -b / (2 * a); if (Math.abs(xv) <= 6 && Math.abs(f(xv)) <= 10) dot(ctx, X(xv), Y(f(xv)), 4, col.ink);
  };
  re();
}
