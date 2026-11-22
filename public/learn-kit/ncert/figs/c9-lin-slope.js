// Class 9 Linear Polynomials: the line y = ax + b. The intercept b is where the line cuts the y-axis (at x = 0); the slope a is
// how much y changes when x goes up by 1 (the rise for a run of 1). A positive slope rises, a negative slope falls, zero is flat.
import { canvas, text, title, row, slider, readout, dot, line, arrow, button } from '../../kit.js';
import { plane } from './c9-coord-plane.js';
import { loop } from '../../kit.js';

const num = (v) => String(+v.toFixed(2)).replace('-', '−');
export default function (host) {
  let a = 1, b = 1, t0 = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'The line y equals a x plus b with its slope triangle and intercept' });
  const ctl = row(host);
  const sa = slider(ctl, { label: 'slope a', min: -4, max: 4, step: 0.5, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  const sb = slider(ctl, { label: 'intercept b', min: -6, max: 6, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  const br = row(host);
  let sweep = false, dir = 1;
  const an = loop(host, (dt) => { if (!sweep) return; a += dir * dt * 1.2; if (a > 4) { a = 4; dir = -1; } if (a < -4) { a = -4; dir = 1; } sa.set(a); upd(); }, { autoplay: false });
  button(br, 'Sweep the slope', () => { sweep = !sweep; if (sweep) an.play(); else an.pause(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'y = ' + num(a) + 'x ' + (b < 0 ? '− ' : '+ ') + num(Math.abs(b)), col), g = plane(ctx, w, h, col, { top: t + 6, x0: -6, x1: 6, y0: -8, y1: 8 });
    ctx.save(); ctx.beginPath(); ctx.rect(g.X(-6), g.Y(8), 12 * g.s, 16 * g.s); ctx.clip();
    line(ctx, [[g.X(-6), g.Y(-6 * a + b)], [g.X(6), g.Y(6 * a + b)]], col.s[0], 3.5);
    ctx.restore();
    dot(ctx, g.X(0), g.Y(b), 7, col.s[5], col.ink); text(ctx, 'b = ' + num(b), g.X(0) + 10, g.Y(b) - (b < 7 ? 12 : -12), { color: col.s[5], size: 12, weight: 700, halo: col.panel });
    const x1 = 1; if (Math.abs(b + a) <= 8) { line(ctx, [[g.X(0), g.Y(b)], [g.X(x1), g.Y(b)]], col.s[2], 3); line(ctx, [[g.X(x1), g.Y(b)], [g.X(x1), g.Y(b + a)]], col.s[3], 3); text(ctx, 'run 1', g.X(0.5), g.Y(b) + (a >= 0 ? 12 : -12), { color: col.s[2], size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'rise ' + num(a), g.X(x1) + 6, g.Y(b + a / 2), { color: col.s[3], size: 11, weight: 700, halo: col.panel }); }
  };
  function upd() { out.innerHTML = `Each step of 1 to the right, y changes by <b>${num(a)}</b> (${a > 0 ? 'the line climbs' : a < 0 ? 'the line falls' : 'the line is flat'}). At x = 0, y = <b>${num(b)}</b>: the line cuts the y-axis there.`; cv.redraw(); }
  upd();
}
