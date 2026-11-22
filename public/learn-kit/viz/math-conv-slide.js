// Convolution as slide, flip and overlap. (f ∗ g)(t) = ∫ f(τ) g(t − τ) dτ. The curve g is flipped and slid by t; at
// each t the area under the product f·g (shaded) is one point of the output below. Press Play to sweep t, or choose
// other shapes. Two boxes give a triangle; smoothing with a wider shape blurs a signal; the delta (very narrow g)
// leaves f unchanged.
import { canvas, axes, row, slider, choice, readout, loop, line, dot, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const SH = {
  box: ['Box', (x) => (x >= 0 && x <= 1 ? 1 : 0)], tri: ['Triangle', (x) => (x >= 0 && x <= 2 ? 1 - Math.abs(x - 1) : 0)], exp: ['Decay e⁻ˣ', (x) => (x >= 0 ? Math.exp(-2 * x) * 2 : 0)],
  two: ['Two pulses', (x) => (x >= 0 && x <= 0.4 ? 1 : x >= 1.2 && x <= 1.6 ? 1 : 0)],
};
export default function (host) {
  let fk = 'box', gk = 'exp', t = 1.2;
  const cv = canvas(host, { aspect: 1.0, max: 420, min: 300, label: 'Two functions, one flipped and slid, with the overlap area and the convolution below' });
  const c = row(host), c2 = row(host);
  choice(c, 'f', Object.entries(SH).map(([id, v]) => [id, v[0]]), fk, (v) => { fk = v; re(); }); choice(c, 'g', Object.entries(SH).map(([id, v]) => [id, v[0]]), gk, (v) => { gk = v; re(); });
  const anim = loop(host, (dt) => { t += dt * 0.8; if (t > 4.5) t = -1; ts.set(t); re(); }, { autoplay: false }); anim.button(c2);
  const ts = slider(c2, { label: 't (shift)', min: -1, max: 4.5, step: 0.02, value: t, fmt: (v) => f2(v), oninput: (v) => { t = v; re(); } });
  const out = readout(host);
  const f = (x) => SH[fk][1](x), g = (x) => SH[gk][1](x);
  const conv = (s) => { let r = 0; const d = 0.005; for (let x = -2; x < 6; x += d) r += f(x) * g(s - x) * d; return r; };
  function re() { cv.redraw(); out.innerHTML = `At shift t = ${f2(t)}: (f∗g)(t) = ∫ f(τ) g(t − τ) dτ = overlap area = <b>${f2(conv(t), 4)}</b>. Flip g about its start, slide it right by t, multiply with f and add up. The output is zero where they do not overlap.`; }
  cv.draw = (ctx, w, h, col) => {
    const top = Math.round(h * 0.55); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, top); ctx.clip();
    const A = axes(ctx, w, top, col, { x: [-1, 5], y: [-0.1, 2.3], l: 30, b: 20, t: 22, r: 10, yt: [0, 1, 2], xt: [-1, 0, 1, 2, 3, 4, 5] });
    const gt = (x) => g(t - x), prod = (x) => f(x) * gt(x);
    ctx.beginPath(); ctx.moveTo(A.X(-1), A.Y(0)); for (let i = 0; i <= 600; i++) { const x = -1 + (6 * i) / 600; ctx.lineTo(A.X(x), A.Y(prod(x))); } ctx.lineTo(A.X(5), A.Y(0)); ctx.globalAlpha = 0.4; ctx.fillStyle = col.s[2]; ctx.fill(); ctx.globalAlpha = 1;
    curve(ctx, A, f, -1, 5, col.s[0], 2.5, { n: 900, jump: 90 }); curve(ctx, A, gt, -1, 5, col.s[1], 2.5, { n: 900, jump: 90 });
    text(ctx, 'blue f(τ) · orange g(t − τ) flipped and shifted · green: product', A.L + 6, A.T + 8, { color: col.muted, size: 9.5 }); ctx.restore();
    ctx.save(); ctx.translate(0, top); ctx.beginPath(); ctx.rect(0, 0, w, h - top); ctx.clip();
    const B = axes(ctx, w, h - top, col, { x: [-1, 5], y: [-0.05, 1.3], l: 30, b: 34, t: 8, r: 10, xlabel: 't', yt: [0, 1], xt: [-1, 0, 1, 2, 3, 4, 5] });
    curve(ctx, B, conv, -1, 5, col.s[2], 3, { n: 180 }); line(ctx, [[B.X(t), B.T], [B.X(t), B.B]], col.muted, 1, [4, 3]); dot(ctx, B.X(t), B.Y(conv(t)), 5, col.s[2], col.ink);
    text(ctx, '(f ∗ g)(t)', B.L + 6, B.T + 8, { color: col.s[2], size: 10.5, weight: 700 }); ctx.restore();
  };
  re();
}
