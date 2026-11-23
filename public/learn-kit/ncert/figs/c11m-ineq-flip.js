// Class 11 Maths, Linear Inequalities: multiplying (or dividing) both sides by a NEGATIVE number reverses the inequality.
// Start from the true statement 2 < 5 (two points on a number line). Multiply both by k: for k > 0 the order is kept;
// for k < 0 the points swap sides, so "<" must become ">". Adding the same number to both sides only slides them.
import { canvas, row, slider, choice, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let k = 1, add = 0, mode = 'mul';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Two numbers on a number line after multiplying by k or adding a number' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'do the same to both sides', [['mul', 'multiply by k'], ['add', 'add c']], mode, (v) => { mode = v; k = 1; add = 0; sk.set(1); sc.set(0); re(); });
  const sk = slider(c2, { label: 'k', min: -3, max: 3, step: 0.5, value: 1, fmt: (v) => String(v).replace('-', '−'), oninput: (v) => { mode = 'mul'; k = v; re(); } });
  const sc = slider(c2, { label: 'c', min: -6, max: 6, step: 1, value: 0, fmt: (v) => String(v).replace('-', '−'), oninput: (v) => { mode = 'add'; add = v; re(); } });
  const f = (v) => String(+v.toFixed(2)).replace('-', '−');
  const re = () => { cv.redraw(); const p = mode === 'mul' ? 2 * k : 2 + add, q = mode === 'mul' ? 5 * k : 5 + add; out.innerHTML = mode === 'mul' ? (k === 0 ? 'Multiplying by 0 makes both sides 0: the strict inequality is lost.' : k < 0 ? `k is negative: 2 < 5 becomes <b>${f(p)} > ${f(q)}</b>. The sign flips.` : `k is positive: 2 < 5 stays <b>${f(p)} < ${f(q)}</b>.`) : `Adding ${add} to both sides: <b>${f(p)} < ${f(q)}</b>. The sign never changes when you add or subtract.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'mul' ? `2 < 5, both sides × ${f(k)}` : `2 < 5, both sides + ${f(add)}`, col), X = (v) => 20 + ((v + 16) / 32) * (w - 40), y = top + (h - top) * 0.6;
    line(ctx, [[20, y], [w - 20, y]], col.muted, 1.5);
    for (let v = -16; v <= 16; v += 4) { line(ctx, [[X(v), y - 4], [X(v), y + 4]], col.muted, 1); text(ctx, String(v).replace('-', '−'), X(v), y + 17, { color: col.muted, size: 10.5, align: 'center' }); }
    const p = mode === 'mul' ? 2 * k : 2 + add, q = mode === 'mul' ? 5 * k : 5 + add;
    dot(ctx, X(2), y - 40, 6, col.s[0], col.panel); dot(ctx, X(5), y - 40, 6, col.s[1], col.panel);
    text(ctx, '2', X(2), y - 54, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, '5', X(5), y - 54, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    ctx.save(); ctx.setLineDash([3, 3]); line(ctx, [[X(2), y - 34], [X(p), y - 2]], col.s[0], 1.2); line(ctx, [[X(5), y - 34], [X(q), y - 2]], col.s[1], 1.2); ctx.restore();
    dot(ctx, X(p), y, 7, col.s[0], col.panel); dot(ctx, X(q), y, 7, col.s[1], col.panel);
    text(ctx, f(p), X(p), y + 32, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, f(q), X(q), y + 32, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    text(ctx, `${f(p)}  ${p < q ? '<' : p > q ? '>' : '='}  ${f(q)}`, w / 2, h - 12, { color: col.ink, size: 15, weight: 700, align: 'center' });
  };
  re();
}
