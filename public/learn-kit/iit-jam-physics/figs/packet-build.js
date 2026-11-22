// 6.2 Building a wave packet. Many plane waves with wave numbers spread (Gaussian weights) around k0 are added;
// their sum is a packet whose width shrinks as the spread of k grows. The readout shows that the product of the
// two spreads stays at 1/2, which with p = hbar k is the uncertainty relation. A second view shows a few of the
// component waves on their own.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 270, label: 'A wave packet built by adding plane waves, with its envelope' });
  let dk = 1, k0 = 8, view = 'sum';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const dx = 1 / (2 * dk);
    out.innerHTML = `Spread of wave numbers Δk = <b>${fmt(dk, 3)}</b> per unit length gives a packet of width Δx = <b>${fmt(dx, 3)}</b>: Δx·Δk = 1/2 for a Gaussian. Multiply by ħ: Δx·Δp = ħ/2, the smallest the uncertainty principle allows. A sharper k (smaller Δk) makes a longer packet.`;
  };
  slider(ctl, { label: 'Spread of k, Δk', min: 0.15, max: 4, value: dk, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { dk = v; cv.redraw(); show(); } });
  choice(ctl, 'Show', [['sum', 'the sum'], ['parts', 'some parts']], view, (v) => { view = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const X = 10, a = axes(ctx, w, h, col, { x: [-X, X], y: [-1.15, 1.15], xlabel: 'position x', ylabel: 'ψ (real part)', yt: [-1, 0, 1], t: 24 });
    const N = 500, xs = Array.from({ length: N + 1 }, (_, i) => -X + (2 * X * i) / N);
    const sx = 1 / (2 * dk); // width of |psi|^2 is sx; psi envelope exp(-x^2/(4 sx^2))
    const env = (x) => Math.exp(-(x * x) / (4 * sx * sx));
    ctx.save(); a.clip();
    if (view === 'sum') {
      line(ctx, xs.map((x) => [a.X(x), a.Y(env(x) * Math.cos(k0 * x))]), col.s[0], 2);
      line(ctx, xs.map((x) => [a.X(x), a.Y(env(x))]), col.s[3], 1.5, [5, 4]);
      line(ctx, xs.map((x) => [a.X(x), a.Y(-env(x))]), col.s[3], 1.5, [5, 4]);
    } else {
      [-2, -1, 0, 1, 2].forEach((j, i) => {
        const k = k0 + j * dk, wgt = Math.exp(-(j * j) / 4);
        line(ctx, xs.map((x) => [a.X(x), a.Y(0.9 * wgt * Math.cos(k * x))]), col.s[i % 5], 1.3);
      });
    }
    ctx.restore();
    text(ctx, view === 'sum' ? 'the sum: a packet (dashed: its envelope)' : 'five of the waves: in step only near x = 0', a.L + 6, a.T + 8, { color: col.ink, size: 11, weight: 600, halo: col.panel });
  };
  cv.redraw(); show();
}
