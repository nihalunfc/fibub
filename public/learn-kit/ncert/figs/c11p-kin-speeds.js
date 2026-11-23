// Class 11 Kinetic Theory: Maxwell distribution of molecular speeds. f(v) = 4 pi (m / 2 pi k T)^(3/2) v^2 exp(-m v^2 / 2 k T).
// Raising T moves the peak right and flattens the curve (area stays 1); a heavier gas is slower. Marks: v_mp = sqrt(2kT/m) (most probable),
// v_avg = sqrt(8kT / pi m), v_rms = sqrt(3kT/m). Always v_mp < v_avg < v_rms. Dashed curve: the same gas at 300 K.
import { canvas, axes, line, text, title, row, slider, choice, readout } from '../../kit.js';

const K = 1.380649e-23, U = 1.66054e-27;
const GASES = [[2.016, 'H₂'], [4.003, 'He'], [28.01, 'N₂'], [32, 'O₂'], [44.01, 'CO₂']];
export default function (host) {
  let M = 28.01, T = 300;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Distribution of molecular speeds for a gas at a chosen temperature' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Gas', GASES.map(([m, n]) => [m, n]), M, (v) => { M = v; go(); });
  slider(ctl, { label: 'temperature T (K)', min: 100, max: 1000, step: 10, value: T, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v; go(); } });
  const f = (v, t) => { const m = M * U, a = m / (2 * K * t); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v); };
  const sp = (t) => ({ mp: Math.sqrt(2 * K * t / (M * U)), av: Math.sqrt(8 * K * t / (Math.PI * M * U)), rms: Math.sqrt(3 * K * t / (M * U)) });
  const go = () => { const s = sp(T); ro.innerHTML = `At ${T} K: most probable <b>${s.mp.toFixed(0)}</b> m/s, average <b>${s.av.toFixed(0)}</b> m/s, rms <b>${s.rms.toFixed(0)}</b> m/s. Compare: rms ∝ √(T/M).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'How many molecules have each speed?', col);
    const xmax = 3000, n = 160, ymax = Math.max(...Array.from({ length: n }, (_, i) => Math.max(f(i * xmax / n, T), f(i * xmax / n, 300)))) * 1.18;
    const A = axes(ctx, w, h, col, { x: [0, xmax], y: [0, ymax], xt: [0, 1000, 2000, 3000], yt: [], xlabel: 'speed v (m/s)', ylabel: 'fraction of molecules', l: 36, t: top + 8, b: 40 });
    const pts = (t) => Array.from({ length: n + 1 }, (_, i) => [A.X(i * xmax / n), A.Y(f(i * xmax / n, t))]);
    line(ctx, pts(300), col.muted, 1.5, [5, 4]);
    const p = pts(T); ctx.beginPath(); ctx.moveTo(A.X(0), A.B); p.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(A.X(xmax), A.B); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, p, col.s[0], 3);
    const s = sp(T), tags = [['v_mp', s.mp, col.s[2]], ['v_avg', s.av, col.s[1]], ['v_rms', s.rms, col.s[3]]];
    tags.forEach(([nm, v, c], i) => { if (v > xmax) return; line(ctx, [[A.X(v), A.B], [A.X(v), A.T + 10 + i * 14]], c, 1.5, [3, 3]); text(ctx, nm, A.X(v) + 3, A.T + 10 + i * 14, { color: c, size: 11, weight: 700 }); });
    text(ctx, 'dashed: same gas at 300 K', A.R - 4, A.B - 10, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
