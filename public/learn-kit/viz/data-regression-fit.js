// Fitting a line by hand: set the slope and intercept, and each point gets a square whose area is its squared error.
// Least squares is the line with the smallest total square area. Try: tune the sliders until the total stops falling,
// then press "Best fit" and compare. Data are made up.
import { canvas, text, row, slider, button, readout, title, axes, line, dot } from '../kit.js';

const X = [1, 2, 3, 4, 5, 6, 7, 8], Y = [2.4, 3.1, 3.2, 4.9, 5.3, 6.8, 6.4, 8.3];
const best = (() => { const n = 8, mx = 4.5, my = Y.reduce((a, b) => a + b, 0) / n; let sxy = 0, sxx = 0; X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; }); const b = sxy / sxx; return { b, a: my - b * mx }; })();
export default function (host) {
  let a = 1, b = 0.4;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Points, a line you set, and the squared errors as squares' });
  const c1 = row(host);
  const sa = slider(c1, { label: 'intercept a', min: -2, max: 5, step: 0.05, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = v; draw(); } });
  const sb = slider(c1, { label: 'slope b', min: -0.5, max: 2, step: 0.01, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = v; draw(); } });
  button(c1, 'Best fit', () => { a = best.a; b = best.b; sa.set(a); sb.set(b); draw(); });
  const out = readout(host);
  const sse = (A, B) => X.reduce((s, x, i) => s + (Y[i] - (A + B * x)) ** 2, 0);
  function draw() { const s = sse(a, b), m = sse(best.a, best.b); out.innerHTML = `Line y = ${a.toFixed(2)} + ${b.toFixed(2)}x. Total squared error (sum of the square areas) = <b>${s.toFixed(2)}</b>. The least-squares line (a = ${best.a.toFixed(2)}, b = ${best.b.toFixed(2)}) gives <b>${m.toFixed(2)}</b>, the smallest possible. ${s < m * 1.05 ? 'You are very close.' : `You are ${(s / m).toFixed(1)}× higher.`}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 9], y: [0, 10], xlabel: 'x', ylabel: 'y', l: 34, t: 26 });
    title(ctx, 'Each square = one squared error', col);
    const ux = (ax.X(1) - ax.X(0)), uy = (ax.Y(0) - ax.Y(1));
    X.forEach((x, i) => { const yh = a + b * x, e = Y[i] - yh, side = Math.abs(e) * uy; ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = col.bad; ctx.fillRect(ax.X(x), Math.min(ax.Y(Y[i]), ax.Y(yh)), side, side); ctx.restore(); ctx.strokeStyle = col.bad; ctx.beginPath(); ctx.moveTo(ax.X(x), ax.Y(Y[i])); ctx.lineTo(ax.X(x), ax.Y(yh)); ctx.stroke(); });
    ctx.save(); ax.clip(); line(ctx, [[ax.X(0), ax.Y(a)], [ax.X(9), ax.Y(a + b * 9)]], col.s[0], 2.5); ctx.restore();
    X.forEach((x, i) => dot(ctx, ax.X(x), ax.Y(Y[i]), 5, col.ink, col.panel));
  };
  draw();
}
