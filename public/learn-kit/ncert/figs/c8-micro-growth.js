// Class 8 Science, Microscopic world: bacteria multiply by splitting in two (binary fission). With plenty of food and
// warmth one bacterium can divide about every 20 minutes, so numbers = 2^(time / 20 min). In a fridge or when salted
// or dried, division is far slower. The dish shows up to 200 dots; the number below is the true count.
import { canvas, axes, text, title, dot, line, row, slider, choice, readout, rng } from '../../kit.js';

const COND = { warm: ['Warm kitchen (37 °C)', 20], fridge: ['Fridge (4 °C)', 180], hot: ['Boiled (100 °C)', 0] };
export default function (host) {
  let t = 120, cond = 'warm';
  const R = rng(3), pos = Array.from({ length: 220 }, () => { const a = R() * 6.283, r = Math.sqrt(R()); return [Math.cos(a) * r, Math.sin(a) * r]; });
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'A dish with bacteria that multiply over time and a growth graph' });
  const ctl = row(host);
  choice(ctl, 'Kept in', [['warm', 'Warm'], ['fridge', 'Fridge'], ['hot', 'Boiled']], cond, (v) => { cond = v; upd(); });
  slider(ctl, { label: 'Time', min: 0, max: 480, step: 20, value: t, fmt: (v) => `${v / 60 >= 1 ? (v / 60).toFixed(1) + ' h' : v + ' min'}`, oninput: (v) => { t = v; upd(); } });
  const out = readout(host);
  const N = (tt) => (COND[cond][1] ? Math.pow(2, tt / COND[cond][1]) : 0);
  function upd() { const n = N(t); out.innerHTML = cond === 'hot' ? 'Boiling kills the bacteria, so the count stays at <b>0</b>.' : `After ${t} min in the ${COND[cond][0].toLowerCase()}: <b>${n >= 1e6 ? (n / 1e6).toFixed(1) + ' million' : Math.round(n).toLocaleString('en-IN')}</b> bacteria (start with 1; doubling every ${COND[cond][1]} min).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Bacteria double again and again', col);
    const r = Math.min(w * 0.14, 46), cx = 20 + r, cy = 40 + r;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillStyle = col.soft; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.stroke();
    const k = cond === 'hot' ? 0 : Math.max(1, Math.round(Math.min(220, N(t))));
    for (let i = 0; i < k; i++) dot(ctx, cx + pos[i][0] * (r - 5), cy + pos[i][1] * (r - 5), 2, col.s[1]);
    text(ctx, 'dish', cx + r + 12, cy - 10, { color: col.muted, size: 10.5 });
    text(ctx, 'each dot is a bacterium', cx + r + 12, cy + 6, { color: col.muted, size: 10.5 });
    const gy0 = cy + r + 14;
    const g = axes(ctx, w, h, col, { x: [0, 480], y: [0, 100], xlabel: 'time (min)', ylabel: '% of a million', l: 44, t: gy0, yt: [0, 50, 100], xt: [0, 120, 240, 360, 480] });
    const pts = []; for (let tt = 0; tt <= 480; tt += 10) pts.push([g.X(tt), g.Y(Math.min(100, N(tt) / 1e4))]);
    line(ctx, pts, col.s[1], 2.5); dot(ctx, g.X(t), g.Y(Math.min(100, N(t) / 1e4)), 5, col.s[1], col.ink);
  };
  upd();
}
