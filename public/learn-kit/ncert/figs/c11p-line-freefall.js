// Class 11 Motion in a Straight Line: free fall. Any object released from rest falls h = (1/2) g t^2 and reaches v = g t, whatever its mass (no air). The ghosts are
// drawn at equal time gaps, so the distance covered in successive gaps grows as 1 : 3 : 5 : 7 : ... (Galileo). Change g to see the Moon, Mars and Jupiter.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

const G = { 9.8: 'Earth', 1.62: 'Moon', 3.71: 'Mars', 24.8: 'Jupiter' };
export default function (host) {
  let g = 9.8, H = 45, t = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A ball falling from a height with positions drawn at equal time intervals' });
  const ctl = row(host), out = readout(host);
  const T = () => Math.sqrt(2 * H / g);
  const anim = loop(host, (d) => { if (hold > 0) { hold -= d; if (hold <= 0) t = 0; } else { t += d * Math.min(1, 2 / T()) ; if (t >= T()) { t = T(); hold = 1.2; } } say(); });
  choice(ctl, 'World', Object.entries(G).map(([v, n]) => [+v, n]), g, (v) => { g = v; t = 0; hold = 0; say(); });
  slider(ctl, { label: 'Height (m)', min: 5, max: 100, step: 5, value: H, fmt: (v) => v + ' m', oninput: (v) => { H = v; t = 0; hold = 0; say(); } });
  anim.button(ctl);
  function say() { const tf = T(); out.innerHTML = `g = ${g} m/s². Fall time ${tf.toFixed(2)} s, landing speed ${(g * tf).toFixed(1)} m/s (${(g * tf * 3.6).toFixed(0)} km/h). Now (t = ${t.toFixed(2)} s on the clock): fallen ${(0.5 * g * t * t).toFixed(1)} m, speed ${(g * t).toFixed(1)} m/s.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Free fall on ' + G[g], col);
    const top = 40, bot = h - 32, X0 = w * 0.3, Y = (m) => top + (m / H) * (bot - top), tf = T();
    line(ctx, [[X0 - 30, bot], [w - 20, bot]], col.ink, 2); line(ctx, [[X0 - 30, top], [X0 + 30, top]], col.muted, 2);
    for (let i = 0; i <= 5; i++) { const m = (H * i) / 5, y = Y(m); line(ctx, [[w * 0.62, y], [w * 0.62 + 8, y]], col.muted, 1); text(ctx, (H - m).toFixed(0) + ' m', w * 0.62 + 12, y, { size: 10, color: col.muted }); }
    const K = 6; for (let i = 1; i <= K; i++) { const ti = (tf * i) / K, m = 0.5 * g * ti * ti, y = Y(m); if (ti <= t + 1e-6) { ctx.globalAlpha = 0.4; dot(ctx, X0, y, 9, col.s[1], col.s[1]); ctx.globalAlpha = 1; text(ctx, `${[1, 3, 5, 7, 9, 11][i - 1]}`, X0 - 22, i === 1 ? y - 12 : y - (Y(m) - Y(0.5 * g * ((tf * (i - 1)) / K) ** 2)) / 2, { size: 11, weight: 700, color: col.s[1], align: 'center' }); } }
    const m = 0.5 * g * t * t; dot(ctx, X0, Y(m), 10, col.s[0], col.ink);
    text(ctx, 'ghosts every ' + (tf / K).toFixed(2) + ' s; numbers = gaps 1:3:5:7:9:11', w / 2, h - 5, { size: 10, color: col.muted, align: 'center' });
  };
  say();
}
