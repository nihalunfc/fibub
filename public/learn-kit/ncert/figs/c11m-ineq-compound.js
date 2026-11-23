// Class 11 Maths, Linear Inequalities: two conditions on the same x. "AND" keeps only the overlap of the two shaded
// sets (like needing both 150 cm height and age above 12 for a ride); "OR" keeps everything shaded by either.
import { canvas, row, slider, choice, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let a = -2, b = 3, mode = 'and', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Two shaded inequalities on one number line combined with and or or' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'combine with', [['and', 'AND (overlap)'], ['or', 'OR (either)']], mode, (v) => { mode = v; re(); });
  slider(c2, { label: 'x > a, a =', min: -5, max: 5, step: 1, value: a, fmt: (v) => String(v).replace('-', '−'), oninput: (v) => { a = v; re(); } });
  slider(c2, { label: 'x ≤ b, b =', min: -5, max: 5, step: 1, value: b, fmt: (v) => String(v).replace('-', '−'), oninput: (v) => { b = v; re(); } });
  slider(c2, { label: 'test x', min: -6, max: 6, step: 0.5, value: t, fmt: (v) => String(v).replace('-', '−'), oninput: (v) => { t = v; re(); } });
  const A = (x) => x > a, B = (x) => x <= b, ok = (x) => (mode === 'and' ? A(x) && B(x) : A(x) || B(x));
  const re = () => { cv.redraw(); out.innerHTML = `x > ${a} is ${A(t) ? 'true' : 'false'} at x = ${t}; x ≤ ${b} is ${B(t) ? 'true' : 'false'}. ${mode === 'and' ? 'AND needs both' : 'OR needs at least one'}, so x = ${t} is <b>${ok(t) ? 'a solution' : 'not a solution'}</b>.${mode === 'and' && a >= b ? ' The overlap is empty here: no solution.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `x > ${a}  ${mode === 'and' ? 'AND' : 'OR'}  x ≤ ${b}`, col), X = (v) => 20 + ((v + 6) / 12) * (w - 40), gap = (h - top - 20) / 4;
    const lane = (i, label, f, c, ends) => { const y = top + 20 + i * gap; line(ctx, [[20, y], [w - 20, y]], col.line, 1.5); for (let x = -6; x <= 6; x += 0.25) if (f(x)) { ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fillRect(X(x), y - 6, X(x + 0.25) - X(x) + 0.5, 12); ctx.globalAlpha = 1; } text(ctx, label, 22, y - 14, { color: col.muted, size: 11 }); };
    lane(0, 'x > a', A, col.s[0]); lane(1, 'x ≤ b', B, col.s[1]); lane(2, mode === 'and' ? 'both' : 'either', ok, col.s[2]);
    const y3 = top + 20 + 2 * gap; for (let v = -6; v <= 6; v += 2) { line(ctx, [[X(v), y3 + 10], [X(v), y3 + 15]], col.muted, 1); text(ctx, String(v).replace('-', '−'), X(v), y3 + 25, { color: col.muted, size: 10, align: 'center' }); }
    dot(ctx, X(a), top + 20, 5, col.panel, col.s[0]); dot(ctx, X(b), top + 20 + gap, 5, col.s[1], col.panel);
    const yt = top + 20 + 3 * gap + 6; line(ctx, [[X(t), top + 10], [X(t), yt]], col.ink, 1); dot(ctx, X(t), yt, 7, ok(t) ? col.s[2] : col.s[1], col.panel);
  };
  re();
}
