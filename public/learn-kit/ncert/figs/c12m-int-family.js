// Class 12 Maths, Integrals: the antiderivative is a whole family of curves. Every curve F(x) + C has the same slope
// f(x) at the same x, so the curves are vertical copies of each other and the tangents at one x are all parallel.
// Slide C to shift the curve, drag the vertical line to compare the tangents, switch the function, and tick
// "pass through a point" to pick the one member that goes through (1, 2): that fixes C.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

const FN = {
  sq: { name: '2x', f: (x) => 2 * x, F: (x) => x * x, txt: 'x²', y: [-4, 8] },
  cos: { name: 'cos x', f: Math.cos, F: Math.sin, txt: 'sin x', y: [-4, 4] },
  ex: { name: 'eˣ', f: Math.exp, F: Math.exp, txt: 'eˣ', y: [-4, 8] },
  cub: { name: '3x²', f: (x) => 3 * x * x, F: (x) => x ** 3, txt: 'x³', y: [-6, 8] },
};
export default function (host) {
  let k = 'sq', C = 1, x0 = 0.6, pin = false;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A family of curves that differ only by a constant, with parallel tangents at one x' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'f(x) =', Object.entries(FN).map(([id, v]) => [id, v.name]), k, (v) => { k = v; C = Math.max(-3, Math.min(3, C)); sl.set(C); fix(); });
  const sl = slider(c2, { label: 'C', min: -3, max: 3, step: 0.1, value: C, fmt: (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1), oninput: (v) => { C = v; pin = false; cb.checked = false; fix(); } });
  const lab = document.createElement('label'); lab.style.cssText = 'font-size:13px;display:flex;gap:6px;align-items:center';
  const cb = document.createElement('input'); cb.type = 'checkbox'; lab.append(cb, 'pass through (1, 2)'); c2.appendChild(lab);
  cb.addEventListener('change', () => { pin = cb.checked; fix(); });
  let g;
  function fix() { if (pin) { C = 2 - FN[k].F(1); sl.set(Math.max(-3, Math.min(3, C))); } cv.redraw(); const o = FN[k]; out.innerHTML = `∫ ${o.name} dx = ${o.txt} + C. Now C = <b>${C.toFixed(2)}</b>. At x = ${x0.toFixed(2)} the slope of <i>every</i> curve is ${o.f(x0).toFixed(2)}.${pin ? ' This is the particular solution through (1, 2).' : ''}`; }
  cv.draw = (ctx, w, h, col) => {
    const o = FN[k], t = title(ctx, `Curves with slope ${o.name}: y = ${o.txt} + C`, col);
    g = axes(ctx, w, h, col, { x: [-2, 3], y: o.y, l: 34, b: 28, t: t + 4, r: 10 });
    ctx.save(); g.clip();
    for (let c = -3; c <= 3.001; c += 1) { const pts = []; for (let i = 0; i <= 80; i++) { const x = -2 + i * 5 / 80; pts.push([g.X(x), g.Y(o.F(x) + c)]); } line(ctx, pts, col.line, 1.5); }
    const pts = []; for (let i = 0; i <= 80; i++) { const x = -2 + i * 5 / 80; pts.push([g.X(x), g.Y(o.F(x) + C)]); }
    line(ctx, pts, col.s[0], 3);
    for (let c = -3; c <= 3.001; c += 1) {
      const y = o.F(x0) + c, m = o.f(x0), dx = 0.45;
      line(ctx, [[g.X(x0 - dx), g.Y(y - m * dx)], [g.X(x0 + dx), g.Y(y + m * dx)]], col.s[1], 1.5);
    }
    line(ctx, [[g.X(x0), g.T], [g.X(x0), g.B]], col.muted, 1, [4, 4]);
    if (pin) dot(ctx, g.X(1), g.Y(2), 5, col.s[3], col.panel);
    ctx.restore();
    dot(ctx, g.X(x0), g.Y(o.F(x0) + C), 5, col.s[0], col.panel);
    text(ctx, 'drag the dashed line', g.X(x0), g.B - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  let drag = false;
  const mv = (e) => { const b = cv.c.getBoundingClientRect(); x0 = Math.max(-1.8, Math.min(2.8, -2 + (e.clientX - b.left - g.L) / (g.R - g.L) * 5)); fix(); };
  cv.c.addEventListener('pointerdown', (e) => { drag = true; cv.c.setPointerCapture(e.pointerId); mv(e); });
  cv.c.addEventListener('pointermove', (e) => drag && mv(e));
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, (x) => g && Math.abs(x - g.X(x0)) < 24);
  fix();
}
