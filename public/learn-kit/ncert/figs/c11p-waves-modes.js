// Class 11 Waves: harmonics of a stretched string, an open pipe and a closed pipe of the same length L (wave speed v). String fixed at both ends and open pipe:
// f_n = n v / 2L, n = 1, 2, 3, ... (all harmonics). Closed pipe (node at the closed end, antinode at the open): f = (2n - 1) v / 4L, only odd harmonics
// 1, 3, 5, ... of its fundamental v/4L, which is half that of the open pipe. Bars show where each system can ring.
import { canvas, axes, line, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let L = 0.5, v = 340;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 270, label: 'Allowed frequencies of a string, an open pipe and a closed pipe of the same length' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'length L (m)', min: 0.2, max: 1.5, step: 0.05, value: L, fmt: (x) => x.toFixed(2), oninput: (x) => { L = x; go(); } });
  slider(ctl, { label: 'wave speed v (m/s)', min: 100, max: 400, step: 10, value: v, fmt: (x) => x.toFixed(0), oninput: (x) => { v = x; go(); } });
  const go = () => { ro.innerHTML = `Open pipe or string: f₁ = v/2L = <b>${(v / 2 / L).toFixed(0)} Hz</b>, then 2f₁, 3f₁… Closed pipe: f₁ = v/4L = <b>${(v / 4 / L).toFixed(0)} Hz</b>, then only 3f₁, 5f₁… (the pipe closed at one end sounds an octave lower).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Frequencies each can sound (Hz)', col), fmax = 4 * v / 2 / 0.2 * 0.5;
    const a = axes(ctx, w, h, col, { x: [0, 3000], y: [0, 3], xt: [0, 1000, 2000, 3000], yt: [], xlabel: 'frequency (Hz)', l: 14, r: 12, t: top + 8, b: 40, grid: true });
    const rows = [['String / open pipe', (n) => n * v / 2 / L, col.s[0]], ['Closed pipe', (n) => (2 * n - 1) * v / 4 / L, col.s[2]]];
    rows.forEach(([nm, fn, c], j) => { const yc = a.T + 56 + j * (a.B - a.T) / 2; text(ctx, nm, a.L + 4, yc - 38, { color: c, size: 11.5, weight: 700 }); line(ctx, [[a.L, yc + 20], [a.R, yc + 20]], col.line, 1);
      for (let n = 1; n <= 40; n++) { const f = fn(n); if (f > 3000) break; ctx.fillStyle = c; ctx.fillRect(a.X(f) - 2.5, yc - 6, 5, 26); text(ctx, String(Math.round(f)), a.X(f), yc - 14, { color: col.ink, size: 9, align: 'center', fit: false }); } });
  };
  go();
}
