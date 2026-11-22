// Class 9 Science, Chapter 6: catching a cricket ball with soft hands. A 160 g ball at 30 m/s has momentum p = 4.8 kg m/s whatever
// you do. Pulling the hands back lengthens the stopping time, and F = Δp/t: the same change of momentum with a longer time means
// a smaller force. On the force-time graph the area (the impulse) is the same 4.8 N s each time: a tall thin rectangle or a
// low wide one. Stopping time from the hands' movement d: t = 2d/v (uniform slowing).
import { canvas, axes, text, title, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let d = 0.05, ph = 0;
  const m = 0.16, v = 30, p = m * v;
  const cv = canvas(host, { aspect: 0.96, max: 440, min: 330, label: 'A cricket ball caught by hands moving back by different distances and the force-time graph with the same area' });
  const ctl = row(host);
  slider(ctl, { label: 'Hands move back', min: 0.02, max: 0.5, step: 0.01, value: d, fmt: (x) => `${Math.round(x * 100)} cm`, oninput: (x) => { d = x; upd(); } });
  loop(host, (dt) => { ph = (ph + dt / 2.6) % 1; cv.redraw(); });
  const out = readout(host);
  const T = () => (2 * d) / v, Fm = () => p / T();
  function upd() { out.innerHTML = `Hands move ${Math.round(d * 100)} cm: stopping time t = 2d/v = <b>${(T() * 1000).toFixed(1)} ms</b>. Force F = Δp/t = ${p.toFixed(1)} ÷ ${T().toFixed(4)} = <b>${Math.round(Fm())} N</b> (the ball’s weight is only 1.6 N). Area = F × t = ${p.toFixed(1)} N s every time.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Catching a fast ball: soft hands or stiff hands', col) + 4;
    // scene
    const sy = top + 34, hx = w * 0.62, bx0 = 24, back = Math.min(60, d * 130);
    ctx.fillStyle = col.line; ctx.fillRect(0, sy + 24, w, 3);
    let bx, hxx; if (ph < 0.5) { bx = bx0 + (ph / 0.5) * (hx - 8 - bx0); hxx = hx; } else { const f = Math.min(1, (ph - 0.5) / 0.3); hxx = hx + back * f; bx = hxx - 8; }
    dot(ctx, bx, sy + 10, 8, col.s[1], col.ink);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.fillRect(hxx, sy - 6, 12, 32); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(hxx, sy - 6, 12, 32);
    text(ctx, 'ball 160 g, 30 m/s', 10, sy - 14, { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'hands', hx + 6, sy + 42, { color: col.s[3], size: 10.5, align: 'center', weight: 700 });
    if (ph > 0.5) arrow(ctx, hx + 14, sy + 54, hx + 14 + back, sy + 54, col.s[3], 2, 7);
    // force-time graph (time axis 0-0.035 s, force 0-4000 N)
    const ax = axes(ctx, w, h, col, { x: [0, 0.035], y: [0, 4000], t: sy + 68, l: 56, xlabel: 'time (s)', ylabel: 'force (N)', fx: (v2) => (v2 === 0 ? '0' : v2.toFixed(3)), yt: [0, 1000, 2000, 3000, 4000] });
    const t = Math.min(T(), 0.035), F = Math.min(Fm(), 4000);
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.fillRect(ax.X(0), ax.Y(F), ax.X(t) - ax.X(0), ax.Y(0) - ax.Y(F)); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.strokeRect(ax.X(0), ax.Y(F), ax.X(t) - ax.X(0), ax.Y(0) - ax.Y(F));
    text(ctx, `area = ${p.toFixed(1)} N s`, ax.X(0.035) - 4, ax.Y(3300), { color: col.s[2], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, `${Math.round(Fm())} N`, ax.X(t) + 6, ax.Y(F) + 4, { color: col.ink, size: 11, weight: 700 });
  };
  upd();
}
