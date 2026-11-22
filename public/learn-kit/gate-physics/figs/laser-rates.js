// 6.7 Steady-state inversion in three- and four-level lasers (below threshold, equal degeneracies, fast pump and drain
// steps). Three-level: N2/N1 = W tau, inversion (N2 - N1)/N = (W tau - 1)/(W tau + 1). Four-level (lower level empty):
// inversion N2/N = W tau/(1 + W tau). The marker shows the chosen pump rate; the dotted line is the inversion needed for
// threshold, and the readout gives the pump each scheme needs to reach it.
import { canvas, axes, line, dot, text, row, slider, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 270, label: 'Population inversion against pump rate for three-level and four-level lasers' });
  let W = 1, f = 0.05;
  const ctl = row(host);
  const out = readout(host);
  const inv3 = (x) => (x - 1) / (x + 1), inv4 = (x) => x / (1 + x);
  const show = () => {
    const p3 = (1 + f) / (1 - f), p4 = f / (1 - f);
    out.innerHTML = `At Wτ = ${fmt(W, 3)}: three-level inversion <b>${fmt(inv3(W), 3)}</b>, four-level <b>${fmt(inv4(W), 3)}</b> (fractions of all atoms). To reach a threshold inversion of ${fmt(f, 2)}, the three-level laser needs Wτ = <b>${fmt(p3, 3)}</b>, the four-level laser only <b>${fmt(p4, 3)}</b>: ${fmt(p3 / p4, 3)} times less pumping.`;
  };
  const redo = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Pump rate Wτ', min: 0.01, max: 100, value: W, log: true, fmt: (v) => fmt(v, 3), oninput: (v) => { W = v; redo(); } });
  slider(ctl, { label: 'Threshold inversion', min: 0.005, max: 0.5, value: f, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { f = v; redo(); } });

  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Inversion (N_upper − N_lower)/N against pump rate', col);
    const a = axes(ctx, w, h, col, { x: [0.01, 100], y: [-1, 1], xlog: true, xlabel: 'pump rate × upper-level lifetime, Wτ', ylabel: 'inversion', t: 36 });
    const c3 = [], c4 = [];
    for (let i = 0; i <= 200; i++) { const x = 10 ** (-2 + (4 * i) / 200); c3.push([a.X(x), a.Y(inv3(x))]); c4.push([a.X(x), a.Y(inv4(x))]); }
    line(ctx, [[a.L, a.Y(0)], [a.R, a.Y(0)]], col.muted, 1);
    line(ctx, [[a.L, a.Y(f)], [a.R, a.Y(f)]], col.bad || col.muted, 1.2, [2, 4]);
    line(ctx, c3, col.s[0], 2.5); line(ctx, c4, col.s[1], 2.5);
    dot(ctx, a.X(W), a.Y(inv3(W)), 5, col.s[0], col.panel); dot(ctx, a.X(W), a.Y(inv4(W)), 5, col.s[1], col.panel);
    text(ctx, 'four-level', a.X(0.012), a.Y(0.12), { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'three-level', a.X(0.012), a.Y(-0.85), { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'threshold', a.R - 4, a.Y(f) - 8, { color: col.bad || col.muted, size: 10, align: 'right' });
  };
  redo();
}
