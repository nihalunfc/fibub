// Simpson's paradox with points: inside each of three groups the trend goes UP, but pooled together the trend goes
// DOWN, because the groups with higher x sit lower overall. Toggle pooled versus by-group lines and drag the "group
// offset" slider to see the sign flip. Data are made up.
import { canvas, text, row, choice, slider, readout, title, axes, line, dot, rng } from '../kit.js';

const R = rng(14), G = [[1.5, 8.5], [4.5, 5.5], [7.5, 2.5]];
const base = G.map(() => Array.from({ length: 9 }, (_, i) => [(i / 8) * 2 - 1 + (R() - 0.5) * 0.3, (i / 8) * 1.6 - 0.8 + (R() - 0.5) * 0.9]));
export default function (host) {
  let mode = 'both', drop = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Three groups of points with their own rising trends and one falling pooled trend' });
  const c1 = row(host); choice(c1, 'Lines', [['pooled', 'Pooled'], ['group', 'By group'], ['both', 'Both']], mode, (v) => { mode = v; draw(); });
  const c2 = row(host); slider(c2, { label: 'group offset', min: 0, max: 1, step: 0.05, value: drop, fmt: (v) => v.toFixed(2), oninput: (v) => { drop = v; draw(); } });
  const out = readout(host);
  const pts = () => G.map((g, gi) => base[gi].map(([dx, dy]) => [g[0] + dx, 5.5 + (g[1] - 5.5) * drop + dy]));
  const ols = (P) => { const n = P.length, mx = P.reduce((s, p) => s + p[0], 0) / n, my = P.reduce((s, p) => s + p[1], 0) / n; let a = 0, b = 0; P.forEach(([x, y]) => { a += (x - mx) * (y - my); b += (x - mx) ** 2; }); return { b: a / b, a: my - (a / b) * mx }; };
  function draw() { const P = pts(), all = P.flat(), pooled = ols(all), gs = P.map(ols); out.innerHTML = `Pooled slope <b>${pooled.b.toFixed(2)}</b> (${pooled.b < 0 ? 'down' : 'up'}); slopes inside the groups: ${gs.map((g) => g.b.toFixed(2)).join(', ')} (all up). The lurking variable is the group: it sets both where the points sit in x and in y.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x (e.g. hours of treatment)', ylabel: 'y', l: 34, t: 26 }); title(ctx, 'Which line tells the truth?', col);
    const P = pts();
    P.forEach((g, gi) => g.forEach(([x, y]) => dot(ctx, ax.X(x), ax.Y(y), 4, col.s[gi + 1 > 2 ? gi + 1 : gi])));
    ctx.save(); ax.clip();
    if (mode !== 'pooled') P.forEach((g, gi) => { const f = ols(g), xs = g.map((p) => p[0]), a = Math.min(...xs), b = Math.max(...xs); line(ctx, [[ax.X(a), ax.Y(f.a + f.b * a)], [ax.X(b), ax.Y(f.a + f.b * b)]], col.s[gi + 1 > 2 ? gi + 1 : gi], 3); });
    if (mode !== 'group') { const f = ols(P.flat()); line(ctx, [[ax.X(0), ax.Y(f.a)], [ax.X(10), ax.Y(f.a + f.b * 10)]], col.ink, 2.5, [7, 5]); }
    ctx.restore();
    text(ctx, 'dashed = pooled', ax.R - 4, ax.B - 10, { color: col.ink, size: 10, align: 'right' });
  };
  draw();
}
