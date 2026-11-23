// Class 12 Maths, Functions: the horizontal line test. Slide the line y = c across the graph. If any position meets the curve more than
// once, the function is not one-one; if some position misses it completely, the function is not onto the whole real line.
import { canvas, text, title, row, slider, choice, axes, line, dot, readout } from '../../kit.js';

const F = {
  sq: ['x²', (x) => x * x, { all: ['not one-one', '[0, ∞)', false], pos: ['one-one', '[0, ∞)', false] }],
  cube: ['x³', (x) => x ** 3 / 4, { all: ['one-one', 'all of ℝ', true], pos: ['one-one', '[0, ∞)', false] }],
  lin: ['2x + 1', (x) => 2 * x + 1, { all: ['one-one', 'all of ℝ', true], pos: ['one-one', '[1, ∞)', false] }],
  sin: ['3 sin x', (x) => 3 * Math.sin(x), { all: ['not one-one', '[−3, 3]', false], pos: ['not one-one', '[−3, 3]', false] }],
  exp: ['eˣ', (x) => Math.exp(x), { all: ['one-one', '(0, ∞)', false], pos: ['one-one', '[1, ∞)', false] }],
  wig: ['x³ − 3x', (x) => x ** 3 - 3 * x, { all: ['not one-one', 'all of ℝ', true], pos: ['not one-one', '[−2, ∞)', false] }],
};
export default function (host) {
  let key = 'sq', dom = 'all', c = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A graph with a movable horizontal line that counts how many times it meets the curve' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [name, f, info] = F[key], x0 = dom === 'all' ? -3 : 0, a = axes(ctx, w, h, col, { x: [-3, 3], y: [-5, 5], l: 34, b: 24, t: 30, r: 12 });
    title(ctx, `y = ${name}, domain ${dom === 'all' ? 'all of ℝ' : 'x ≥ 0'}`, col);
    ctx.save(); a.clip();
    const pts = []; for (let x = x0; x <= 3.0001; x += 0.02) pts.push([a.X(x), a.Y(f(x))]);
    line(ctx, pts, col.s[0], 2.5);
    ctx.restore();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.L, a.Y(c)); ctx.lineTo(a.R, a.Y(c)); ctx.stroke();
    let cnt = 0; for (let x = x0; x < 3; x += 0.005) { const u = f(x) - c, v = f(x + 0.005) - c; if (u === 0 || u * v < 0) { cnt++; dot(ctx, a.X(x + 0.0025), a.Y(c), 5, col.s[2], col.panel); } }
    const d = info[dom];
    out.innerHTML = `The line y = ${c.toFixed(1)} meets the curve <b>${cnt}</b> time${cnt === 1 ? '' : 's'}. ${cnt === 0 ? 'A value in the codomain with no x: not onto ℝ.' : cnt > 1 ? 'Two inputs, one output: not one-one.' : ''}<br>Verdict for this domain: <b>${d[0]}</b>; range ${d[1]}; ${d[2] ? 'onto ℝ' : 'not onto ℝ'}.`;
  };
  const r = row(host);
  choice(r, 'Function', Object.entries(F).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; cv.redraw(); });
  choice(r, 'Domain', [['all', 'all of ℝ'], ['pos', 'x ≥ 0 only']], dom, (v) => { dom = v; cv.redraw(); });
  slider(r, { label: 'Line y = c', min: -5, max: 5, step: 0.1, value: 1, fmt: (v) => v.toFixed(1), oninput: (v) => { c = v; cv.redraw(); } });
  cv.redraw();
}
