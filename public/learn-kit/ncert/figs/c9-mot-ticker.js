// Class 9 Science, Chapter 4: a car on a road leaves a dot every second (like a ticker tape). Wide gaps between dots mean
// fast, equal gaps mean steady speed, growing gaps mean speeding up. The position-time and velocity-time graphs are drawn
// live from the same motion: x = ut + ½at², v = u + at.
import { canvas, text, title, line, dot, row, choice, button, loop, readout } from '../../kit.js';

const P = { steady: [10, 0], speed: [0, 2], slow: [16, -2] };
const NAME = { steady: 'steady 10 m/s', speed: 'speeding up (a = +2 m/s²)', slow: 'slowing down (a = −2 m/s²)' };
export default function (host) {
  let kind = 'speed', t = 0, hold = 0;
  const cv = canvas(host, { aspect: 1.02, max: 440, min: 330, label: 'A car on a road leaving a dot each second, with position-time and velocity-time graphs drawn live' });
  const ctl = row(host);
  choice(ctl, 'Motion', [['steady', 'Steady'], ['speed', 'Speeding up'], ['slow', 'Slowing down']], kind, (v) => { kind = v; t = 0; hold = 0; });
  const anim = loop(host, (dt) => { if (hold > 0) { hold -= dt; if (hold <= 0) t = 0; } else { t += dt * 0.9; if (t >= 8) { t = 8; hold = 1.6; } } show(); cv.redraw(); });
  anim.button(ctl); button(ctl, 'Restart', () => { t = 0; hold = 0; });
  const out = readout(host);
  const X = (s) => P[kind][0] * s + 0.5 * P[kind][1] * s * s, V = (s) => P[kind][0] + P[kind][1] * s;
  const show = () => { out.innerHTML = `t = <b>${t.toFixed(1)} s</b>, position <b>${X(t).toFixed(1)} m</b>, speed <b>${V(t).toFixed(1)} m/s</b>. Gaps between dots: ${kind === 'steady' ? 'all equal' : kind === 'speed' ? 'getting bigger' : 'getting smaller'}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Car: ${NAME[kind]}`, col) + 6, L = 18, R = w - 18, rx = (m) => L + (m / 100) * (R - L), ry = top + 40;
    ctx.fillStyle = col.line; ctx.fillRect(L - 6, ry + 10, R - L + 12, 7); for (let m = 0; m <= 100; m += 20) { line(ctx, [[rx(m), ry + 17], [rx(m), ry + 23]], col.muted, 1); text(ctx, `${m}`, rx(m), ry + 33, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'metres', R, ry + 46, { color: col.muted, size: 10, align: 'right' });
    for (let k = 0; k <= Math.floor(t); k++) { dot(ctx, rx(X(k)), ry + 3, 3.5, col.s[1]); if (k % 2 === 0 || w > 380) text(ctx, `${k}s`, rx(X(k)), ry - 16, { color: col.s[1], size: 9.5, align: 'center' }); }
    const cx = rx(X(t)); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.roundRect(cx - 14, ry - 8, 28, 13, 3); ctx.fill(); dot(ctx, cx - 8, ry + 6, 3.5, col.ink); dot(ctx, cx + 8, ry + 6, 3.5, col.ink);
    // mini graphs
    const gy = ry + 70, gh = h - gy - 34, gw = (w - 3 * 22) / 2;
    const graph = (gx, xmax, ymax, fn, lab, yl, c) => {
      const tx = (s) => gx + (s / 8) * gw, ty = (v) => gy + gh - (v / ymax) * gh;
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh);
      for (let k = 0; k <= 8; k += 2) { text(ctx, `${k}`, tx(k), gy + gh + 10, { color: col.muted, size: 10, align: 'center' }); }
      text(ctx, ymax + '', gx - 3, gy + 4, { color: col.muted, size: 10, align: 'right' }); text(ctx, '0', gx - 3, gy + gh, { color: col.muted, size: 10, align: 'right' });
      text(ctx, lab, gx + gw / 2, gy + gh + 25, { color: col.ink, size: 10.5, weight: 600, align: 'center' });
      text(ctx, yl, gx + 3, gy - 8, { color: col.ink, size: 10.5, weight: 700 });
      const pts = []; for (let s = 0; s <= t + 1e-9; s += 0.1) pts.push([tx(s), ty(fn(s))]); line(ctx, pts, c, 2.5);
      dot(ctx, tx(t), ty(fn(t)), 4.5, c, col.panel);
    };
    graph(22, 8, 100, X, 'time (s)', 'position (m)', col.s[0]);
    graph(22 * 2 + gw, 8, 20, V, 'time (s)', 'speed (m/s)', col.s[2]);
  };
  show(); cv.redraw();
}
