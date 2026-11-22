// 4.4 Line of best fit: move the slope and intercept and watch the residuals (vertical gaps) and their squared total.
// The fixed data are made up for the lesson. data-fit="1" starts at the least-squares line.
import { canvas, axes, dot, line, text, row, slider, readout, fmt } from '../../kit.js';

const PTS = [[1, 3.1], [2, 4.8], [3, 5.2], [4, 7.4], [5, 8.1], [6, 9.9], [7, 10.4], [8, 12.6], [9, 13.1]];
function lsq() {
  const n = PTS.length, sx = PTS.reduce((s, p) => s + p[0], 0), sy = PTS.reduce((s, p) => s + p[1], 0);
  const sxx = PTS.reduce((s, p) => s + p[0] * p[0], 0), sxy = PTS.reduce((s, p) => s + p[0] * p[1], 0);
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { m, b: (sy - m * sx) / n };
}
export default function (host) {
  const best = lsq();
  const S = host.dataset.fit ? { ...best } : { m: 0.6, b: 5 };
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 240, label: 'Scatterplot with an adjustable line and its residuals' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'slope', min: -1, max: 3, step: 0.05, value: +S.m.toFixed(2), fmt: (v) => fmt(v), oninput: (v) => { S.m = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'intercept', min: -4, max: 10, step: 0.1, value: +S.b.toFixed(1), fmt: (v) => fmt(v), oninput: (v) => { S.b = v; cv.redraw(); show(); } });
  const sse = () => PTS.reduce((s, [x, y]) => s + (y - (S.m * x + S.b)) ** 2, 0);
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 10], y: [0, 16], xlabel: 'hours studied', ylabel: 'score', r: 70 });
    ctx.save(); A.clip();
    for (const [x, y] of PTS) line(ctx, [[A.X(x), A.Y(y)], [A.X(x), A.Y(S.m * x + S.b)]], col.s[1], 1.5, [3, 3]);
    line(ctx, [[A.X(0), A.Y(S.b)], [A.X(10), A.Y(S.m * 10 + S.b)]], col.s[0], 2.5);
    ctx.restore();
    for (const [x, y] of PTS) dot(ctx, A.X(x), A.Y(y), 4.5, col.ink);
    text(ctx, `y = ${fmt(S.m)}x ${S.b < 0 ? '−' : '+'} ${fmt(Math.abs(S.b))}`, A.L + 8, A.T + 6, { color: col.s[0], size: 12, weight: 700, base: 'top' });
  };
  const show = () => {
    out.innerHTML = `Sum of squared residuals: <b>${fmt(sse())}</b> (the best possible is ${fmt(PTS.reduce((s, [x, y]) => s + (y - (best.m * x + best.b)) ** 2, 0))}, at slope ${fmt(best.m)} and intercept ${fmt(best.b)}). The dashed lines are the residuals: actual minus predicted. The line of best fit makes them as small as possible overall.`;
  };
  cv.redraw(); show();
}
