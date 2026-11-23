// Class 11 Maths, Relations and Functions: the vertical line test. A graph shows a function only if EVERY vertical line meets it at most once
// (one input, one output). Slide the vertical line along each curve and count the crossings.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const C = {
  par: ['y = x²', [(x) => x * x], true], circ: ['x² + y² = 9', [(x) => Math.sqrt(9 - x * x), (x) => -Math.sqrt(9 - x * x)], false], abs: ['y = |x| − 1', [(x) => Math.abs(x) - 1], true],
  side: ['x = y²', [(x) => Math.sqrt(x), (x) => -Math.sqrt(x)], false], rec: ['y = 1/x', [(x) => (Math.abs(x) < 1e-9 ? NaN : 1 / x)], true], sq: ['y = √x', [(x) => Math.sqrt(x)], true],
};
export default function (host) {
  let k = 'par', x0 = 1.5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A curve with a movable vertical line and the number of crossings' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${C[k][0]}: slide the vertical line`, col);
    const P = plot(ctx, w, h, col, { x: [-4, 4], y: [-4, 4], l: 20, b: 14, t: 28, r: 12 }), fs = C[k][1];
    fs.forEach((f) => curve(ctx, P, f, col.s[0], 2.6, 80));
    ctx.save(); P.clip(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(P.X(x0), P.T); ctx.lineTo(P.X(x0), P.B); ctx.stroke(); ctx.restore();
    const ys = fs.map((f) => f(x0)).filter((y) => Number.isFinite(y) && Math.abs(y) <= 4.2), uniq = [...new Set(ys.map((y) => +y.toFixed(6)))];
    uniq.forEach((y) => dot(ctx, P.X(x0), P.Y(y), 6, col.s[3], col.panel));
    out.innerHTML = `At x = ${r2(x0)} the line meets the curve <b>${uniq.length}</b> time${uniq.length === 1 ? '' : 's'}${uniq.length ? ' (y = ' + uniq.map((y) => r2(y)).join(' and ') + ')' : ''}. ${C[k][2] ? '<b>This curve passes the test: y is a function of x.</b>' : '<b>Some vertical lines cut it twice: y is NOT a function of x.</b>'}`;
  };
  choice(row(host), 'Curve', Object.entries(C).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; cv.redraw(); });
  slider(row(host), { label: 'Line at x', min: -3.5, max: 3.5, step: 0.1, value: x0, fmt: (v) => r2(v, 1), oninput: (v) => { x0 = v; cv.redraw(); } });
  cv.redraw();
}
