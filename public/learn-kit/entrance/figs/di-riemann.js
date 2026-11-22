// Definite integral as the limit of a sum: n rectangles under y = f(x) from a to b (left, right or middle heights).
// Rectangles below the axis count as negative. As n grows, the sum closes in on the exact integral, F(b) − F(a).
import { canvas, axes, line, row, slider, choice, readout, fmt } from '../../kit.js';

const FN = {
  sq: { f: (x) => x * x, F: (x) => x ** 3 / 3, name: 'x²', y: [-1, 9] },
  sin: { f: Math.sin, F: (x) => -Math.cos(x), name: 'sin x', y: [-1.3, 1.3] },
  cub: { f: (x) => x ** 3 - 2 * x, F: (x) => x ** 4 / 4 - x * x, name: 'x³ − 2x', y: [-6, 6] },
  exp: { f: Math.exp, F: Math.exp, name: 'eˣ', y: [-1, 10] },
};

export default function (host) {
  let key = 'sq', a = 0, b = 2, N = 6, how = 'left';
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 240, label: 'Rectangles under a curve approximating a definite integral' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'f(x)', [['sq', 'x²'], ['sin', 'sin x'], ['cub', 'x³ − 2x'], ['exp', 'eˣ']], key, (v) => { key = v; re(); });
  slider(ctl, { label: 'a', min: -3, max: 3, step: 0.1, value: a, fmt: (v) => fmt(v, 2), oninput: (v) => { a = v; re(); } });
  slider(ctl, { label: 'b', min: -3, max: 3, step: 0.1, value: b, fmt: (v) => fmt(v, 2), oninput: (v) => { b = v; re(); } });
  slider(ctl, { label: 'n rectangles', min: 1, max: 100, step: 1, value: N, fmt: (v) => String(v), oninput: (v) => { N = v; re(); } });
  choice(ctl, 'Height at', [['left', 'left'], ['mid', 'middle'], ['right', 'right']], how, (v) => { how = v; re(); });
  const out = readout(host);
  const sum = () => { const g = FN[key], h = (b - a) / N, off = how === 'left' ? 0 : how === 'mid' ? 0.5 : 1; let s = 0; for (let i = 0; i < N; i++) s += g.f(a + (i + off) * h) * h; return s; };
  const show = () => {
    const g = FN[key], ex = g.F(b) - g.F(a), s = sum();
    out.innerHTML = `Sum of ${N} rectangles = <b>${fmt(s, 5)}</b>. Exact ∫ from ${fmt(a, 2)} to ${fmt(b, 2)} of ${g.name} dx = F(b) − F(a) = <b>${fmt(ex, 5)}</b>. Error ${fmt(s - ex, 3)}.${b < a ? ' (b < a: the integral changes sign.)' : ''} Parts below the x-axis count as negative area.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const g = FN[key];
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [-3.2, 3.2], y: g.y, xlabel: 'x', ylabel: 'y', l: 40 });
    ctx.save(); clip();
    line(ctx, [[X(-4), Y(0)], [X(4), Y(0)]], col.muted, 1);
    const dx = (b - a) / N, off = how === 'left' ? 0 : how === 'mid' ? 0.5 : 1;
    for (let i = 0; i < N; i++) {
      const x0 = a + i * dx, y = g.f(x0 + off * dx), xl = Math.min(X(x0), X(x0 + dx)), wd = Math.abs(X(x0 + dx) - X(x0));
      ctx.globalAlpha = 0.35; ctx.fillStyle = y >= 0 ? col.s[0] : col.s[3];
      ctx.fillRect(xl, Math.min(Y(0), Y(y)), wd, Math.abs(Y(y) - Y(0)));
      ctx.globalAlpha = 1; ctx.strokeStyle = y >= 0 ? col.s[0] : col.s[3]; ctx.lineWidth = N > 40 ? 0.5 : 1;
      ctx.strokeRect(xl, Math.min(Y(0), Y(y)), wd, Math.abs(Y(y) - Y(0)));
    }
    const pts = []; for (let x = -3.2; x <= 3.2; x += 0.02) pts.push([X(x), Y(g.f(x))]);
    line(ctx, pts, col.ink, 2.5);
    [a, b].forEach((v) => line(ctx, [[X(v), Y(g.y[0])], [X(v), Y(g.y[1])]], col.s[1], 1.2, [5, 4]));
    ctx.restore();
  };
  re();
}
