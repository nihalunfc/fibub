// Graph transformations: y = a·f(b(x − h)) + k. Slide a (stretch up or flip), b (squeeze sideways or flip), h (shift
// right) and k (shift up) and see the solid graph move away from the faint original f. Try |f(x)| (negative parts
// folded up) and f(|x|) (right half copied to the left) from the Mode switch.
import { canvas, axes, row, slider, choice, button, readout, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const F = {
  sq: ['x²', (x) => x * x], abs: ['|x|', Math.abs], cube: ['x³', (x) => x ** 3], sin: ['sin x', Math.sin], sqrt: ['√x', Math.sqrt],
  inv: ['1/x', (x) => 1 / x], exp: ['eˣ', Math.exp],
};
export default function (host) {
  let k = 'sq', a = 1, b = 1, hh = 0, kk = 0, mode = 'plain';
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 270, label: 'A graph and its transformed copy' });
  const c1 = row(host), c2 = row(host), c3 = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(c1, 'Base f', Object.entries(F).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  choice(c1, 'Mode', [['plain', 'f'], ['abs', '|f(x)|'], ['even', 'f(|x|)']], mode, (v) => { mode = v; re(); });
  const S = [
    slider(c2, { label: 'a (up/flip)', min: -3, max: 3, step: 0.1, value: a, fmt: (v) => f2(v, 1), oninput: (v) => { a = v; re(); } }),
    slider(c2, { label: 'b (sideways)', min: -3, max: 3, step: 0.1, value: b, fmt: (v) => f2(v, 1), oninput: (v) => { b = v; re(); } }),
    slider(c3, { label: 'h (right)', min: -4, max: 4, step: 0.1, value: hh, fmt: (v) => f2(v, 1), oninput: (v) => { hh = v; re(); } }),
    slider(c3, { label: 'k (up)', min: -4, max: 4, step: 0.1, value: kk, fmt: (v) => f2(v, 1), oninput: (v) => { kk = v; re(); } }),
  ];
  button(c3, 'Reset', () => { a = 1; b = 1; hh = 0; kk = 0; S[0].set(1); S[1].set(1); S[2].set(0); S[3].set(0); re(); });
  const out = readout(host);
  const g = (x) => { const f = F[k][1]; const u = b * (x - hh); const v = mode === 'even' ? f(Math.abs(u)) : f(u); return a * (mode === 'abs' ? Math.abs(v) : v) + kk; };
  function show() {
    const nm = F[k][0], inner = `${f2(b, 1)}(x ${hh < 0 ? '+' : '−'} ${f2(Math.abs(hh), 1)})`;
    out.innerHTML = `y = ${f2(a, 1)} · f(${inner}) ${kk < 0 ? '−' : '+'} ${f2(Math.abs(kk), 1)} with f = ${nm}. <b>${a < 0 ? 'Flipped upside down (a < 0). ' : Math.abs(a) > 1 ? 'Stretched up. ' : Math.abs(a) < 1 && a !== 0 ? 'Squashed down. ' : ''}${b < 0 ? 'Mirrored left-right (b < 0). ' : Math.abs(b) > 1 ? 'Squeezed sideways. ' : ''}${hh ? `Shifted ${hh > 0 ? 'right' : 'left'} by ${f2(Math.abs(hh), 1)}. ` : ''}${kk ? `Shifted ${kk > 0 ? 'up' : 'down'} by ${f2(Math.abs(kk), 1)}.` : ''}</b> Note the sideways changes work "backwards": x − h moves the graph right.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 28, b: 22, t: 22, r: 10, xt: [-4, 0, 4], yt: [-4, 0, 4] });
    ctx.save(); A.clip(); ctx.beginPath(); ctx.moveTo(A.X(0), A.T); ctx.lineTo(A.X(0), A.B); ctx.moveTo(A.L, A.Y(0)); ctx.lineTo(A.R, A.Y(0)); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
    curve(ctx, A, F[k][1], -6, 6, col.muted, 2, { dash: [5, 4], jump: 300 });
    curve(ctx, A, g, -6, 6, col.s[0], 3, { jump: 300, n: 400 });
    text(ctx, 'faint dashed: f(x)  ·  solid: transformed', A.L + 6, A.T + 8, { color: col.muted, size: 11 });
  };
  re();
}
