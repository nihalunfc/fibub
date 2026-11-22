// Dot and cross products of two vectors in a plane. a·b = |a||b|cos θ is |a| times the shadow (projection) of b on
// a; |a × b| = |a||b|sin θ is the area of the parallelogram they span. Turn the angle and watch one grow while the
// other shrinks: a·b = 0 when they are perpendicular, a × b = 0 when they are parallel.
import { canvas, line, dot, row, slider, readout, fmt, arrow, text } from '../../kit.js';

export default function (host) {
  let la = 3, lb = 2.5, th = 60;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 250, label: 'Two vectors with the parallelogram they span and the projection of one on the other' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: '|a|', min: 0.5, max: 4, step: 0.1, value: la, fmt: (v) => fmt(v, 2), oninput: (v) => { la = v; re(); } });
  slider(ctl, { label: '|b|', min: 0.5, max: 4, step: 0.1, value: lb, fmt: (v) => fmt(v, 2), oninput: (v) => { lb = v; re(); } });
  slider(ctl, { label: 'angle θ (°)', min: 0, max: 180, step: 1, value: th, fmt: (v) => `${v}°`, oninput: (v) => { th = v; re(); } });
  const out = readout(host);
  const show = () => {
    const t = (th * Math.PI) / 180, d = la * lb * Math.cos(t), c = la * lb * Math.sin(t), p = lb * Math.cos(t);
    out.innerHTML = `a · b = |a||b|cos θ = <b>${fmt(d, 3)}</b> (${Math.abs(d) < 1e-9 ? 'perpendicular' : d > 0 ? 'acute angle' : 'obtuse angle'}). |a × b| = |a||b|sin θ = <b>${fmt(c, 3)}</b> = area of the parallelogram${c < 1e-9 ? ' (parallel: zero area)' : ''}; the triangle is half, ${fmt(c / 2, 3)}. Projection of b on a = ${fmt(p, 3)}. Check: (a·b)² + |a×b|² = ${fmt(d * d + c * c, 4)} = |a|²|b|² = ${fmt(la * la * lb * lb, 4)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t = (th * Math.PI) / 180, s = Math.min(w / 9, h / 5.4);
    const ox = w * 0.42, oy = h * 0.72;
    const P = (x, y) => [ox + x * s, oy - y * s];
    const A = [la, 0], B = [lb * Math.cos(t), lb * Math.sin(t)];
    ctx.beginPath(); [[0, 0], A, [A[0] + B[0], B[1]], B].forEach((q, i) => { const [x, y] = P(...q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
    ctx.globalAlpha = 0.2; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [P(...A), P(A[0] + B[0], B[1]), P(...B)], col.muted, 1, [4, 4]);
    line(ctx, [P(-4.5, 0), P(4.5, 0)], col.line, 1);
    // projection of b on a
    line(ctx, [P(...B), P(B[0], 0)], col.s[2], 1.5, [3, 3]);
    line(ctx, [P(0, 0), P(B[0], 0)], col.s[2], 5);
    arrow(ctx, ...P(0, 0), ...P(...A), col.s[1], 2.5);
    arrow(ctx, ...P(0, 0), ...P(...B), col.s[3], 2.5);
    ctx.beginPath(); ctx.arc(ox, oy, 22, -t, 0); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke();
    text(ctx, 'θ', ox + 28 * Math.cos(t / 2), oy - 28 * Math.sin(t / 2), { color: col.ink, size: 12 });
    text(ctx, 'a', ...P(A[0] + 0.15, -0.3), { color: col.s[1], size: 13, weight: 700 });
    text(ctx, 'b', ...P(B[0] * 1.05 + 0.1, B[1] + 0.2), { color: col.s[3], size: 13, weight: 700 });
    text(ctx, 'projection of b on a', ...P(Math.min(B[0], 0) - 0.2, -0.6), { color: col.s[2], size: 11 });
    dot(ctx, ox, oy, 3, col.ink);
  };
  re();
}
