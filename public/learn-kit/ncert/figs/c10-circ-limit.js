// Class 10 Circles: a tangent is the limit of a secant. A secant through the fixed point A meets the circle again at B.
// If the angle α between the secant and the tangent at A shrinks, the chord AB = 2r sin α shrinks to 0 and B runs into A.
// The secant then touches the circle at one point only: it has become the tangent at A.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let al = 70, dir = -1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A secant through a fixed point turning until its second point meets the first and it becomes a tangent' });
  const ctl = row(host);
  const s = slider(ctl, { label: 'Angle α with the tangent', min: 0, max: 90, step: 1, value: al, fmt: (v) => v + '°', oninput: (v) => { al = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { al += dir * dt * 18; if (al < 0) { al = 0; dir = 1; } if (al > 90) { al = 90; dir = -1; } s.set(Math.round(al)); say(); });
  anim.button(ctl);
  const out = readout(host);
  function say() { const a = (al * Math.PI) / 180; out.innerHTML = al < 1 ? 'α = 0°: B has merged with A. The chord has shrunk to 0 and the line touches the circle at <b>one point</b>: a <b>tangent</b>.' : `α = ${Math.round(al)}°: chord AB = 2r sin α = <b>${(2 * Math.sin(a)).toFixed(2)} r</b>. The line meets the circle at 2 points: a <b>secant</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Secant → tangent', col);
    const R = Math.min(w * 0.25, (h - 70) * 0.36), cx = w / 2, cy = h / 2 - 2, a = (al * Math.PI) / 180, A = [cx, cy + R];
    const u = [Math.cos(a), -Math.sin(a)], B = [A[0] + u[0] * 2 * R * Math.sin(a), A[1] + u[1] * 2 * R * Math.sin(a)], tan = al < 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[10, A[1]], [w - 10, A[1]], ], col.line, 1.5, [4, 4]);
    const L = R * 2.9; line(ctx, [[A[0] - u[0] * R * 1.1, A[1] - u[1] * R * 1.1], [A[0] + u[0] * L, A[1] + u[1] * L]], tan ? col.s[2] : col.s[1], 3);
    line(ctx, [A, B], col.s[3], 5);
    dot(ctx, A[0], A[1], 6, col.ink, col.panel); if (!tan) dot(ctx, B[0], B[1], 6, col.s[3], col.panel);
    text(ctx, 'A', A[0] - 12, A[1] + 14, { color: col.ink, size: 13, weight: 700, halo: col.panel });
    if (!tan) text(ctx, 'B', B[0] + 9, B[1] - 11, { color: col.s[3], size: 13, weight: 700, halo: col.panel });
    ctx.beginPath(); ctx.arc(A[0], A[1], 26, -a, 0); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'α', A[0] + 36, A[1] - 8, { color: col.s[4], size: 13, weight: 700, halo: col.panel });
    text(ctx, tan ? 'tangent at A' : 'secant AB', w - 12, h - 16, { color: tan ? col.s[2] : col.s[1], size: 13, weight: 700, align: 'right', halo: col.panel });
  };
  say();
}
