// Class 11 Rotational Motion: a rolling race down an incline (seen from above). Rolling without slipping, a = g sin(theta) / (1 + I/(M R^2)), so the shape with the smallest
// I/(M R^2) wins: block (sliding, 0) > solid sphere (2/5) > disc (1/2) > hollow sphere (2/3) > ring (1). The winner does not depend on mass or radius.
import { canvas, line, text, title, row, slider, button, readout, loop } from '../../kit.js';

const RACERS = [['block', 0, 'slides'], ['solid ball', 2 / 5], ['disc', 1 / 2], ['hollow ball', 2 / 3], ['ring', 1]];

export default function (host) {
  let ang = 30, t = 0, hold = 0;
  const g = 9.8, Ltrack = 2;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 320, label: 'Five objects racing down the same slope, seen from above, with finishing times' });
  const ctl = row(host);
  slider(ctl, { label: 'Slope angle', min: 10, max: 45, step: 1, value: 30, fmt: (v) => v + '°', oninput: (v) => { ang = v; t = 0; hold = 0; } });
  const b2 = row(host); button(b2, 'Restart race', () => { t = 0; hold = 0; });
  const ro = readout(host);
  const acc = (k) => g * Math.sin(ang * Math.PI / 180) / (1 + k), tfin = (k) => Math.sqrt(2 * Ltrack / acc(k));
  loop(host, (dt) => { const T = tfin(1); if (t < T + 0.01) t += dt * 0.5; else { hold += dt; if (hold > 1.8) { t = 0; hold = 0; } } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Rolling race: who reaches the bottom first?', col);
    const y0 = top + 18, y1 = h - 86, lane = (w - 20) / RACERS.length;
    ctx.fillStyle = col.soft; ctx.fillRect(10, y0, w - 20, y1 - y0);
    line(ctx, [[10, y1], [w - 10, y1]], col.ink, 3); text(ctx, 'finish', w - 14, y1 - 8, { color: col.muted, size: 10, align: 'right' });
    RACERS.forEach(([n, k], i) => {
      const cx = 10 + lane * (i + 0.5), a = acc(k), s = Math.min(Ltrack, 0.5 * a * t * t), y = y0 + 14 + s / Ltrack * (y1 - y0 - 28), r = 14, T = tfin(k);
      line(ctx, [[10 + lane * i, y0], [10 + lane * i, y1]], col.line, 1, [3, 4]);
      ctx.save(); ctx.translate(cx, y);
      ctx.strokeStyle = col.s[i]; ctx.fillStyle = col.s[i]; ctx.lineWidth = 4;
      if (n === 'block') ctx.fillRect(-r, -r * 0.8, 2 * r, 1.6 * r);
      else { const rot = s / 0.25 * 0.6; ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, r - 2, 0, 6.3); if (n === 'ring' || n === 'hollow ball') ctx.stroke(); else { ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; } ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r - 3, 0); ctx.stroke(); }
      ctx.restore();
      text(ctx, n, cx, y1 + 14, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      text(ctx, k === 0 ? 'I = 0' : 'I = ' + (k === 1 ? '1' : k === 2 / 3 ? '2/3' : k === 1 / 2 ? '1/2' : '2/5') + ' MR²', cx, y1 + 28, { color: col.muted, size: 9.5, align: 'center' });
      if (s >= Ltrack) text(ctx, T.toFixed(2) + ' s', cx, y1 + 44, { color: col.s[i], size: 12, weight: 700, align: 'center', halo: col.panel });
    });
    const order = RACERS.map(([n, k]) => [n, tfin(k)]).sort((p, q) => p[1] - q[1]);
    ro.textContent = `Slope ${ang}°, track 2 m. a = g sinθ ÷ (1 + I/MR²): block ${acc(0).toFixed(2)}, solid ball ${acc(2 / 5).toFixed(2)}, disc ${acc(1 / 2).toFixed(2)}, hollow ball ${acc(2 / 3).toFixed(2)}, ring ${acc(1).toFixed(2)} m/s². Order: ${order.map((o) => o[0]).join(', ')}. (Slowed to half speed.)`;
  };
  cv.redraw();
}
