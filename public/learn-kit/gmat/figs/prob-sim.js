// 5.4 Probability as long-run frequency: draw two marbles again and again and watch the share settle.
import { canvas, axes, line, row, slider, button, readout, title, loop } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Running share of trials where both marbles are red' });
  let red = 4, blue = 6, hits = 0, n = 0, hist = [];
  const ctl = row(host), f = (v) => String(Math.round(v));
  const reset = () => { hits = 0; n = 0; hist = []; cv.redraw(); say(); };
  slider(ctl, { label: 'Red', min: 2, max: 10, step: 1, value: red, fmt: f, oninput: (v) => { red = Math.round(v); reset(); } });
  slider(ctl, { label: 'Blue', min: 1, max: 10, step: 1, value: blue, fmt: f, oninput: (v) => { blue = Math.round(v); reset(); } });
  const lp = loop(host, () => { if (n < 2000) { for (let k = 0; k < 8; k++) { const t = red + blue; const a = Math.random() < red / t, b = a ? Math.random() < (red - 1) / (t - 1) : false; hits += a && b; n++; } hist.push(hits / n); cv.redraw(); say(); } }, { autoplay: false });
  lp.button(ctl); button(ctl, '↻ Reset', reset);
  const out = readout(host);
  const exact = () => (red * (red - 1)) / ((red + blue) * (red + blue - 1));
  const say = () => { out.innerHTML = `Exact: ${red}/${red + blue} × ${red - 1}/${red + blue - 1} = <b>${exact().toFixed(4)}</b>. After ${n} trials both were red ${n ? ((hits / n) * 100).toFixed(1) : 0}% of the time.`; };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [0, Math.max(10, hist.length)], y: [0, 1], xlabel: 'Batches of 8 draws', ylabel: 'Share both red' });
    line(ctx, [[X(0), Y(exact())], [X(Math.max(10, hist.length)), Y(exact())]], col.s[1], 2, [5, 4]);
    if (hist.length > 1) line(ctx, hist.map((p, i) => [X(i + 1), Y(p)]), col.s[0], 2);
    title(ctx, 'The share settles on the exact probability (dashed)', col);
  };
  cv.redraw(); say();
}
