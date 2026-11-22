// Class 9 Science, Chapter 4: reading a velocity-time graph of a train journey. Move the time slider: the figure shows the
// speed, the acceleration (the slope of the segment you are on) and the distance so far (the shaded area). Segments:
// 0-10 s speeding up, 10-25 s steady, 25-35 s slowing, 35-40 s braking to a stop.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';

const PT = [[0, 0], [10, 20], [25, 20], [35, 10], [40, 0]];
const vAt = (t) => { for (let i = 1; i < PT.length; i++) if (t <= PT[i][0]) { const [a, b] = [PT[i - 1], PT[i]]; return a[1] + ((t - a[0]) / (b[0] - a[0])) * (b[1] - a[1]); } return 0; };
const aAt = (t) => { for (let i = 1; i < PT.length; i++) if (t <= PT[i][0] + 1e-9) return (PT[i][1] - PT[i - 1][1]) / (PT[i][0] - PT[i - 1][0]); return 0; };
const dAt = (t) => { let s = 0; for (let i = 1; i < PT.length; i++) { const [a, b] = [PT[i - 1], PT[i]]; const e = Math.min(t, b[0]); if (e <= a[0]) break; s += 0.5 * (a[1] + vAt(e)) * (e - a[0]); } return s; };
export default function (host) {
  let t = 18;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 310, label: 'A velocity-time graph of a train journey with the area so far shaded and a train on a track above' });
  const ctl = row(host);
  slider(ctl, { label: 'Time', min: 0, max: 40, step: 0.5, value: t, fmt: (x) => `${x.toFixed(1)} s`, oninput: (x) => { t = x; upd(); } });
  const out = readout(host);
  function upd() { const a = aAt(t); out.innerHTML = `Speed <b>${vAt(t).toFixed(1)} m/s</b>. Slope (acceleration) <b>${a.toFixed(1)} m/s²</b> (${a > 0.01 ? 'speeding up' : a < -0.01 ? 'slowing down' : 'steady'}). Area so far = distance <b>${dAt(t).toFixed(0)} m</b> of ${dAt(40).toFixed(0)} m.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Train journey: v-t graph', col) + 4, ry = top + 20, L = 22, R = w - 22;
    ctx.fillStyle = col.line; ctx.fillRect(L, ry + 8, R - L, 5); const cx = L + (dAt(t) / dAt(40)) * (R - L - 30);
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.roundRect(cx, ry - 3, 30, 11, 3); ctx.fill(); dot(ctx, cx + 7, ry + 9, 2.5, col.ink); dot(ctx, cx + 23, ry + 9, 2.5, col.ink);
    const ax = axes(ctx, w, h, col, { x: [0, 40], y: [0, 24], t: ry + 26, xlabel: 'time (s)', ylabel: 'speed (m/s)' });
    ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); for (let s = 0; s <= t + 1e-9; s += 0.25) ctx.lineTo(ax.X(s), ax.Y(vAt(s))); ctx.lineTo(ax.X(t), ax.Y(vAt(t))); ctx.lineTo(ax.X(t), ax.Y(0)); ctx.fill(); ctx.restore();
    line(ctx, PT.map(([x, y]) => [ax.X(x), ax.Y(y)]), col.ink, 3);
    line(ctx, [[ax.X(t), ax.Y(0)], [ax.X(t), ax.Y(vAt(t))]], col.s[2], 2); dot(ctx, ax.X(t), ax.Y(vAt(t)), 6, col.s[2], col.panel);
    [['a = +2', 7.5, 6], ['a = 0', 17.5, 21.8], ['a = −1', 29, 8], ['−2', 38.8, 8]].forEach(([s, x, y]) => text(ctx, s, ax.X(x), ax.Y(y), { color: col.muted, size: 10.5, align: 'center', weight: 700, halo: col.panel }));
  };
  upd();
}
