// Class 12 Biology, Biotechnology: Principles and Processes: copies of a target made by PCR. With efficiency E (1 = perfect doubling) the number of
// copies after n cycles is N = N0 (1 + E)^n. At E = 1 this is N0 x 2^n. The graph has a logarithmic y axis, so the exponential rise is a straight line.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 20, n0 = 1, E = 1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Number of DNA copies against PCR cycle number on a log scale' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'cycles', min: 0, max: 35, step: 1, value: 20, fmt: (v) => v.toFixed(0), oninput: (v) => { n = v; go(); } });
  slider(ctl, { label: 'start copies', min: 1, max: 100, step: 1, value: 1, fmt: (v) => v.toFixed(0), oninput: (v) => { n0 = v; go(); } });
  slider(ctl, { label: 'efficiency', min: 0.6, max: 1, step: 0.01, value: 1, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { E = v; go(); } });
  const N = (k) => n0 * Math.pow(1 + E, k);
  const go = () => { const v = N(n); ro.textContent = `After ${n} cycles: ${v < 1e6 ? Math.round(v).toLocaleString('en-IN') : v.toExponential(2)} copies (${n0} × ${(1 + E).toFixed(2)}^${n}). At about 3 minutes a cycle, that took ${n * 3} minutes.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'PCR: copies against cycles', col);
    const a = axes(ctx, w, h, col, { x: [0, 35], y: [1, 1e12], ylog: true, xlabel: 'cycle number', ylabel: 'copies', t: 40, fy: (v) => '10^' + Math.round(Math.log10(v)), xt: [0, 5, 10, 15, 20, 25, 30, 35], yt: [1, 1e3, 1e6, 1e9, 1e12], l: 48 });
    const pts = []; for (let k = 0; k <= 35; k++) pts.push([a.X(k), a.Y(Math.max(1, N(k)))]);
    line(ctx, pts, col.s[0], 2.5);
    const ref = []; for (let k = 0; k <= 35; k++) ref.push([a.X(k), a.Y(Math.pow(2, k))]);
    ctx.setLineDash([4, 4]); line(ctx, ref, col.muted, 1.2); ctx.setLineDash([]);
    text(ctx, 'dashed: perfect doubling from 1 copy', a.R - 4, a.B - 8, { color: col.muted, size: 10, align: 'right' });
    dot(ctx, a.X(n), a.Y(Math.max(1, N(n))), 6, col.s[2], col.panel);
  };
  go();
}
