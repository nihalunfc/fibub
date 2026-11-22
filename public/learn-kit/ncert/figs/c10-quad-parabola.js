// Class 10 Quadratic Equations: the graph of y = ax² + bx + c. The roots of ax² + bx + c = 0 are where the parabola
// crosses the x-axis. The discriminant D = b² - 4ac decides how many: D > 0 two crossings, D = 0 one touch, D < 0 none.
// Drag a, b, c and watch the curve, the roots and D change together.
import { canvas, axes, line, dot, text, title, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let a = 1, b = -2, c = -3;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Graph of y = ax² + bx + c with its roots on the x-axis' });
  const ctl = row(host);
  const go = () => { say(); cv.redraw(); };
  slider(ctl, { label: 'a', min: -3, max: 3, step: 0.5, value: a, oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: 'b', min: -6, max: 6, step: 1, value: b, oninput: (v) => { b = v; go(); } });
  slider(ctl, { label: 'c', min: -8, max: 8, step: 1, value: c, oninput: (v) => { c = v; go(); } });
  const out = readout(host);
  const sgn = (v, first) => (v < 0 ? ' − ' : first ? '' : ' + ') + (Math.abs(v) === 1 ? '' : fmt(Math.abs(v)));
  function say() {
    if (a === 0) { out.innerHTML = `a = 0, so this is only a straight line, not a quadratic. Move <b>a</b> away from 0.`; return; }
    const D = b * b - 4 * a * c, f = `${sgn(a, true)}x² ${b ? sgn(b) + 'x' : ''} ${c ? (c < 0 ? ' − ' : ' + ') + Math.abs(c) : ''}`;
    let r;
    if (D > 0) r = `two real roots: x = ${fmt((-b + Math.sqrt(D)) / (2 * a))} and x = ${fmt((-b - Math.sqrt(D)) / (2 * a))}`;
    else if (D === 0) r = `one repeated root: x = ${fmt(-b / (2 * a))}`;
    else r = `no real roots (the curve never meets the x-axis)`;
    out.innerHTML = `${f} = 0 &nbsp; D = b² − 4ac = ${b}² − 4(${a})(${c}) = <b>${D}</b>: ${r}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `y = ${a}x² + (${b})x + (${c})`, col);
    const A = axes(ctx, w, h, col, { x: [-6, 6], y: [-10, 10], t: 34, b: 30, l: 34, xlabel: '' });
    ctx.save(); A.clip();
    const pts = [];
    for (let i = 0; i <= 120; i++) { const x = -6 + (12 * i) / 120; pts.push([A.X(x), A.Y(a * x * x + b * x + c)]); }
    line(ctx, pts, col.s[0], 3);
    ctx.restore();
    if (a === 0) return;
    const D = b * b - 4 * a * c, vx = -b / (2 * a), vy = c - (b * b) / (4 * a);
    if (vx > -6 && vx < 6 && vy > -10 && vy < 10) { dot(ctx, A.X(vx), A.Y(vy), 4, col.s[2]); text(ctx, 'vertex', A.X(vx) + 7, A.Y(vy) + (a > 0 ? 12 : -12), { color: col.s[2], size: 11 }); }
    const rt = D >= 0 ? (D === 0 ? [vx] : [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)]) : [];
    for (const r of rt) if (r > -6.2 && r < 6.2) { dot(ctx, A.X(r), A.Y(0), 6, col.s[1], col.panel); text(ctx, 'x = ' + fmt(r, 3), A.X(r), A.Y(0) + (a > 0 ? -16 : 16), { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); }
    if (D < 0) text(ctx, 'does not reach the x-axis: no real roots', (A.L + A.R) / 2, A.B - 8, { color: col.bad, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
