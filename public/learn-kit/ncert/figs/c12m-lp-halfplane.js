// Class 12 Maths, Linear Programming: a linear inequality a x + b y <= c (or >=) shades one side of the line a x + b y = c.
// Slide a, b, c and flip the sign; drag the test point: it is a solution exactly when it sits in the shaded half-plane (the left side meets the right side the right way).
// Quick test: put in (0, 0): if it satisfies the inequality, the origin's side is shaded (provided the line misses the origin).
import { canvas, text, title, axes, dot, row, slider, choice, readout, touchGuard } from '../../kit.js';
import { shade, lineFull, ok } from '../c12m-lp.js';

export default function (host) {
  const k = { a: 2, b: 1, c: 8, ge: false }; let P = [5, 6];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A line with one side shaded for an inequality and a draggable test point' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'a (x coefficient)', min: -3, max: 3, step: 1, value: k.a, fmt: (v) => String(v), oninput: (v) => { k.a = v; go(); } });
  slider(ctl, { label: 'b (y coefficient)', min: -3, max: 3, step: 1, value: k.b, fmt: (v) => String(v), oninput: (v) => { k.b = v; go(); } });
  slider(ctl, { label: 'c (right side)', min: -6, max: 24, step: 1, value: k.c, fmt: (v) => String(v), oninput: (v) => { k.c = v; go(); } });
  choice(ctl, 'sign', [[false, '≤'], [true, '≥']], false, (v) => { k.ge = v; go(); });
  let G = null;
  const near = (x, y) => G && Math.hypot(x - G.X(P[0]), y - G.Y(P[1])) < 22;
  touchGuard(cv.c, near);
  let dr = false;
  const xy = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.c.addEventListener('pointerdown', (e) => { if (near(...xy(e))) { dr = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (!dr || !G) return; const [x, y] = xy(e); P = [Math.max(0, Math.min(10, Math.round((x - G.L) / (G.R - G.L) * 10))), Math.max(0, Math.min(10, Math.round((G.B - y) / (G.B - G.T) * 10)))]; go(); });
  cv.c.addEventListener('pointerup', () => { dr = false; });
  const go = () => {
    const v = k.a * P[0] + k.b * P[1], s = ok(k, P[0], P[1]);
    ro.textContent = `${k.a}x + ${k.b}y ${k.ge ? '≥' : '≤'} ${k.c}.  At (${P[0]}, ${P[1]}): ${k.a}(${P[0]}) + ${k.b}(${P[1]}) = ${v}, and ${v} ${k.ge ? '≥' : '≤'} ${k.c} is ${s ? 'TRUE' : 'FALSE'}, so the point ${s ? 'is' : 'is not'} a solution.  Origin test: 0 ${k.ge ? '≥' : '≤'} ${k.c} is ${ok(k, 0, 0) ? 'true' : 'false'}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Which side of the line? (first quadrant)', col);
    G = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x', ylabel: 'y', l: 34, t: top + 8, b: 34, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); G.clip(); shade(ctx, G, [k], col.s[0], 0.25); lineFull(ctx, G, k.a, k.b, k.c, col.s[0], 2.5); ctx.restore();
    const s = ok(k, P[0], P[1]);
    dot(ctx, G.X(0), G.Y(0), 4, col.muted);
    dot(ctx, G.X(P[0]), G.Y(P[1]), 8, s ? col.good : col.bad, col.panel);
    text(ctx, s ? 'solution' : 'not a solution', G.X(P[0]) + 11, G.Y(P[1]) - 11, { color: s ? col.good : col.bad, size: 11.5, weight: 700, halo: col.panel });
  };
  go();
}
