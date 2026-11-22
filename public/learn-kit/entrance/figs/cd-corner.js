// Continuity and differentiability at x = 0. Pick a function and shrink h: the two chords from (0, f(0)) to the
// points at −h and +h show the left and right difference quotients. If both settle on the same slope the function
// is differentiable; if they settle on different slopes there is a corner; if the values themselves jump it is not
// even continuous.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

const FN = {
  abs: { f: (x) => Math.abs(x), name: 'f(x) = |x|', say: 'Continuous, but the left slope → −1 and the right slope → +1: a corner, not differentiable.' },
  xabs: { f: (x) => x * Math.abs(x), name: 'f(x) = x|x|', say: 'Both slopes → 0: differentiable at 0, even though it is built from |x|.' },
  floor: { f: (x) => Math.floor(x), name: 'f(x) = [x]', say: 'Left limit −1, right limit 0 = f(0): a jump. Not continuous, so not differentiable.' },
  remov: { f: (x) => (x === 0 ? 2 : x + 1), name: 'f(x) = x + 1 (x ≠ 0), f(0) = 2', say: 'Both one-sided limits are 1 but f(0) = 2: a removable discontinuity. Redefine f(0) = 1 to fix it.' },
  cbrt: { f: (x) => Math.cbrt(x), name: 'f(x) = ∛x', say: 'Continuous, but both slopes grow without bound: a vertical tangent, not differentiable.' },
  xsin: { f: (x) => (x === 0 ? 0 : x * Math.sin(1 / x)), name: 'f(x) = x sin(1/x), f(0) = 0', say: 'Continuous (squeezed between −|x| and |x|), but the chord slope sin(1/h) keeps swinging between −1 and 1: not differentiable.' },
  x2sin: { f: (x) => (x === 0 ? 0 : x * x * Math.sin(1 / x)), name: 'f(x) = x² sin(1/x), f(0) = 0', say: 'The chord slope h sin(1/h) → 0: differentiable at 0 with f′(0) = 0 (but f′ is not continuous there).' },
};

export default function (host) {
  let key = 'abs', h = 0.8;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 250, label: 'A function near x = 0 with left and right chords showing the one-sided slopes' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'f', [['abs', '|x|'], ['xabs', 'x|x|'], ['floor', '[x]'], ['remov', 'hole'], ['cbrt', '∛x'], ['xsin', 'x sin(1/x)'], ['x2sin', 'x² sin(1/x)']], key, (v) => { key = v; re(); });
  slider(ctl, { label: 'h', min: 0.01, max: 1.5, value: h, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { h = v; re(); } });
  const out = readout(host);
  const show = () => {
    const { f, name, say } = FN[key];
    const L = (f(0) - f(-h)) / h, R = (f(h) - f(0)) / h;
    out.innerHTML = `${name}. f(−h) = ${fmt(f(-h), 3)}, f(0) = ${fmt(f(0), 3)}, f(h) = ${fmt(f(h), 3)}. Left quotient [f(0) − f(−h)]/h = <b>${fmt(L, 3)}</b>, right quotient [f(h) − f(0)]/h = <b>${fmt(R, 3)}</b>. ${say}`;
  };
  cv.draw = (ctx, w, h0, col) => {
    const { f } = FN[key];
    const S = Math.max(1.6 * h, 0.15), k = w / h0;
    const { X, Y, clip } = axes(ctx, w, h0, col, { x: [-S * k, S * k], y: [-S, S + (key === 'remov' || key === 'floor' ? 1 : 0)].map((v) => v + (key === 'remov' ? 0.6 : 0)), xlabel: 'x', ylabel: 'y', l: 44 });
    ctx.save(); clip();
    const lo = -S * k, hi = S * k, N = 900; let seg = [], prev = null;
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N; if (x === 0) continue;
      const y = f(x);
      if (prev !== null && Math.abs(y - prev) > S * 0.5 && key === 'floor') { line(ctx, seg, col.s[0], 2.5); seg = []; }
      seg.push([X(x), Y(y)]); prev = y;
    }
    line(ctx, seg, col.s[0], 2.5);
    const y0 = f(0);
    const ext = (x1, y1) => { const m = (y1 - y0) / x1; return [[X(-S * k), Y(y0 - m * S * k)], [X(S * k), Y(y0 + m * S * k)]]; };
    line(ctx, ext(-h, f(-h)), col.s[1], 1.5, [6, 4]);
    line(ctx, ext(h, f(h)), col.s[2], 1.5, [6, 4]);
    ctx.restore();
    if (key === 'remov') dot(ctx, X(0), Y(1), 5, col.panel, col.s[0]);
    if (key === 'floor') dot(ctx, X(0), Y(-1), 5, col.panel, col.s[0]);
    dot(ctx, X(-h), Y(f(-h)), 5, col.s[1]);
    dot(ctx, X(h), Y(f(h)), 5, col.s[2]);
    dot(ctx, X(0), Y(y0), 5, col.ink);
  };
  re();
}
