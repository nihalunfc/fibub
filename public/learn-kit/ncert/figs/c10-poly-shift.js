// Class 10 Polynomials: a quadratic has 2, 1 or 0 zeros. Slide the parabola y = x^2 - 4x + c up and down: two zeros while it
// dips below the x-axis, one where it just touches (c = 4), none once it floats above. Play moves it by itself.
import { canvas, axes, line, dot, text, title, row, slider, button, readout, loop } from '../../kit.js';

const SUP = { 2: '²', 3: '³' };
const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const poly = (c) => { const d = c.length - 1; let s = ''; c.forEach((v, i) => { const e = d - i; if (!v) return; const a = Math.abs(v); let t = (a === 1 && e > 0) ? '' : num(a); t += e > 1 ? 'x' + SUP[e] : e === 1 ? 'x' : ''; s += s ? ` ${v < 0 ? '−' : '+'} ${t}` : (v < 0 ? '−' : '') + t; }); return s || '0'; };
const val = (c, x) => c.reduce((a, v) => a * x + v, 0);
const roots = (c, lo = -6, hi = 6) => { const f = (x) => val(c, x), r = []; let px = lo, py = f(px);
  for (let i = 1; i <= 1500; i++) { const x = lo + (hi - lo) * i / 1500, y = f(x); if (py === 0) r.push(px); else if (py * y < 0) { let a = px, b = x; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } r.push((a + b) / 2); } px = x; py = y; }
  if (c.length === 3) { const D = c[1] * c[1] - 4 * c[0] * c[2]; if (Math.abs(D) < 1e-9 && c[0]) return [-c[1] / (2 * c[0])]; }
  return r; };
const curve = (ctx, ax, c, x0, x1, color, w = 2.5) => { ctx.save(); ax.clip(); const pts = []; for (let i = 0; i <= 240; i++) { const x = x0 + (x1 - x0) * i / 240; pts.push([ax.X(x), ax.Y(val(c, x))]); } line(ctx, pts, color, w); ctx.restore(); };
export default function (host) {
  let c0 = 3, dir = 1;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A parabola moving up and down the screen with zero, one or two crossing points on the x-axis' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Constant c in x² − 4x + c', min: -2, max: 7, step: 0.25, value: c0, fmt: num, oninput: (v) => { c0 = v; upd(); } });
  const a = loop(host, (dt) => { c0 += dir * dt * 1.1; if (c0 > 7) { c0 = 7; dir = -1; } if (c0 < -2) { c0 = -2; dir = 1; } sl.set(c0); upd(); }, { autoplay: false });
  a.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const c = [1, -4, c0], t = title(ctx, 'p(x) = x² − 4x + ' + num(c0), col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-1, 5], y: [-4, 10], t: t + 4, xt: [0, 1, 2, 3, 4], yt: [-4, 0, 4, 8], xlabel: 'x', ylabel: 'p(x)', b: 36 });
    curve(ctx, ax, c, -1, 5, col.s[0]);
    const D = 16 - 4 * c0, r = D < -1e-9 ? [] : D < 1e-9 ? [2] : [2 - Math.sqrt(D) / 2, 2 + Math.sqrt(D) / 2];
    for (const x of r) dot(ctx, ax.X(x), ax.Y(0), 6, col.s[2], col.ink);
    text(ctx, `${r.length} zero${r.length === 1 ? '' : 's'}`, ax.R - 6, ax.T + 12, { color: r.length ? col.s[2] : col.s[6], size: 14, weight: 700, align: 'right' });
  };
  function upd() { const D = 16 - 4 * c0; out.innerHTML = D > 1e-9 ? `The curve dips below the axis and crosses it twice: <b>two zeros</b>, x = ${num(2 - Math.sqrt(D) / 2)} and ${num(2 + Math.sqrt(D) / 2)}.` : D > -1e-9 ? 'The lowest point just touches the axis: <b>one zero</b>, x = 2.' : 'The whole curve is above the axis: <b>no real zero</b>. The ball never reaches the ground.'; cv.redraw(); }
  upd();
}
