// Indefinite integrals: an antiderivative is a whole family F(x) + C. The short dashes are the slope field (the slope
// f(x) at each point, the same all the way up each vertical line); the faint curves are F + C for several C, and the
// bold one passes through the chosen point, fixing C.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

const FN = {
  x: { f: (x) => 2 * x, F: (x) => x * x, name: 'f(x) = 2x', Fs: 'x²', dom: () => true },
  cos: { f: Math.cos, F: Math.sin, name: 'f(x) = cos x', Fs: 'sin x', dom: () => true },
  exp: { f: (x) => Math.exp(x) / 4, F: (x) => Math.exp(x) / 4, name: 'f(x) = eˣ/4', Fs: 'eˣ/4', dom: () => true },
  inv: { f: (x) => 1 / x, F: (x) => Math.log(Math.abs(x)), name: 'f(x) = 1/x', Fs: 'log|x|', dom: (x) => Math.abs(x) > 0.05 },
  atan: { f: (x) => 2 / (1 + x * x), F: (x) => 2 * Math.atan(x), name: 'f(x) = 2/(1 + x²)', Fs: '2 tan⁻¹x', dom: () => true },
};

export default function (host) {
  let key = 'x', px = 1, py = 0;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 250, label: 'Slope field and a family of antiderivative curves differing by a constant' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'f', [['x', '2x'], ['cos', 'cos x'], ['exp', 'eˣ/4'], ['inv', '1/x'], ['atan', '2/(1+x²)']], key, (v) => { key = v; re(); });
  slider(ctl, { label: 'point x', min: -3.5, max: 3.5, step: 0.1, value: px, fmt: (v) => fmt(v, 2), oninput: (v) => { px = Math.abs(v) < 0.05 && key === 'inv' ? 0.1 : v; re(); } });
  slider(ctl, { label: 'point y', min: -4, max: 4, step: 0.1, value: py, fmt: (v) => fmt(v, 2), oninput: (v) => { py = v; re(); } });
  const out = readout(host);
  const C = () => { const g = FN[key]; return py - g.F(g.dom(px) ? px : 0.1); };
  const show = () => {
    const g = FN[key], c = C();
    out.innerHTML = `${g.name}. Every antiderivative is ${g.Fs} + C; they are copies of one curve slid up or down. Through (${fmt(px, 2)}, ${fmt(py, 2)}): C = ${fmt(py, 3)} − F(${fmt(px, 2)}) = <b>${fmt(c, 3)}</b>.${key === 'inv' ? ' For 1/x the two sides of x = 0 may even take different constants.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const g = FN[key], XR = 4, YR = 4.2;
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [-XR, XR], y: [-YR, YR], xlabel: 'x', ylabel: 'y', l: 36 });
    ctx.save(); clip();
    const sx = (X(1) - X(0)), sy = (Y(0) - Y(1));
    for (let x = -XR + 0.25; x < XR; x += 0.5) for (let y = -YR + 0.3; y < YR; y += 0.6) {
      if (!g.dom(x)) continue;
      const m = g.f(x), ang = Math.atan2(m * sy, sx), L = 7;
      line(ctx, [[X(x) - L * Math.cos(ang), Y(y) + L * Math.sin(ang)], [X(x) + L * Math.cos(ang), Y(y) - L * Math.sin(ang)]], col.muted, 1.2);
    }
    const curve = (c, color, wd) => {
      let seg = [];
      for (let x = -XR; x <= XR + 1e-9; x += 0.02) {
        if (!g.dom(x)) { line(ctx, seg, color, wd); seg = []; continue; }
        seg.push([X(x), Y(g.F(x) + c)]);
      }
      line(ctx, seg, color, wd);
    };
    ctx.globalAlpha = 0.45;
    for (let c = -6; c <= 6; c += 1.5) curve(c, col.s[0], 1.2);
    ctx.globalAlpha = 1;
    curve(C(), col.s[1], 2.8);
    ctx.restore();
    dot(ctx, X(px), Y(py), 5, col.s[1], col.panel);
  };
  re();
}
