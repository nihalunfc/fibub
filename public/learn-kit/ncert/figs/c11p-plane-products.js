// Class 11 Motion in a Plane: the scalar (dot) and vector (cross) products of two vectors. A is fixed along x. A.B = A B cos(theta) is a number: A times the part of B along A
// (work = F . d). A x B has magnitude A B sin(theta), equal to the area of the parallelogram; its direction is by the right-hand rule, perpendicular to the page (out of it for
// a positive angle with B above A, into it below). Reverse B or turn it past 180 degrees and the signs flip.
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let th = 50, B = 4, A = 5;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Two vectors with the projection for the dot product and the parallelogram for the cross product' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Angle θ between A and B', min: 0, max: 180, step: 5, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; go(); } });
  slider(ctl, { label: 'Size of B', min: 1, max: 6, step: 0.5, value: B, fmt: (v) => v.toFixed(1), oninput: (v) => { B = v; go(); } });
  function go() { const r = th * Math.PI / 180, d = A * B * Math.cos(r), c = A * B * Math.sin(r); out.innerHTML = `A = ${A}, B = ${B}. <b>A·B = AB cosθ = ${d.toFixed(2)}</b> (scalar; zero at 90°, negative beyond). <b>|A × B| = AB sinθ = ${c.toFixed(2)}</b> (the shaded parallelogram’s area; zero at 0° and 180°), direction out of the page (right-hand rule).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Dot product and cross product', col);
    const u = Math.min((w - 40) / 17.5, (h - 90) / 7), ox = 20 + 6.2 * u, oy = h - 46, r = th * Math.PI / 180;
    const P = (x, y) => [ox + x * u, oy - y * u], bx = B * Math.cos(r), by = B * Math.sin(r);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.moveTo(...P(0, 0)); ctx.lineTo(...P(A, 0)); ctx.lineTo(...P(A + bx, by)); ctx.lineTo(...P(bx, by)); ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [P(bx, by), P(bx, 0)], col.muted, 1, [3, 3]); line(ctx, [P(0, 0), P(bx, 0)], col.s[2], 5);
    arrow(ctx, ...P(0, 0), ...P(A, 0), col.s[0], 3.5, 10); arrow(ctx, ...P(0, 0), ...P(bx, by), col.s[1], 3.5, 10);
    text(ctx, 'A', ...P(A + 0.45, 0), { size: 13, weight: 700, color: col.s[0], align: 'center' }); text(ctx, 'B', ...P(bx * 0.6 - 0.35, by * 0.6 + 0.35), { size: 13, weight: 700, color: col.s[1], align: 'center', halo: col.panel });
    text(ctx, 'green: B cosθ, the part of B along A', 14, oy + 24, { size: 11, weight: 700, color: col.s[2] });
    text(ctx, 'area = |A × B|', ...P(A * 0.7 + bx * 0.5, by * 0.5 + 0.1), { size: 11, weight: 700, color: col.s[3], align: 'center', halo: col.panel });
    ctx.beginPath(); ctx.arc(ox, oy, 24, 0, -r, true); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
  };
  go();
}
