// Class 9 Science, Chapter 6: F = ma. Your trolley B races a reference trolley A (force 10 N, mass 5 kg, so a = 2 m/s²). Set the
// force and the mass. Double the force and the acceleration doubles; double the mass and it halves. Dots mark each 0.5 s
// so you can see the speed grow. a = F/m.
import { canvas, text, title, line, dot, arrow, row, slider, button, loop, readout } from '../../kit.js';

export default function (host) {
  let F = 10, m = 5, t = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Two trolleys pushed by different forces and masses racing along a track with dots every half second' });
  const ctl = row(host);
  slider(ctl, { label: 'Force on B', min: 2, max: 40, step: 2, value: F, fmt: (v) => `${v} N`, oninput: (v) => { F = v; t = 0; hold = 0; } });
  slider(ctl, { label: 'Mass of B', min: 1, max: 20, step: 1, value: m, fmt: (v) => `${v} kg`, oninput: (v) => { m = v; t = 0; hold = 0; } });
  const anim = loop(host, (dt) => { if (hold > 0) { hold -= dt; if (hold <= 0) t = 0; } else { t += dt; if (t >= 3.5) { t = 3.5; hold = 1.2; } } show(); cv.redraw(); });
  anim.button(ctl); button(ctl, 'Restart', () => { t = 0; hold = 0; });
  const out = readout(host);
  const show = () => { const a = F / m; out.innerHTML = `Trolley B: a = F/m = ${F} ÷ ${m} = <b>${a.toFixed(2)} m/s²</b> (A has 2.00). At t = ${t.toFixed(1)} s, B’s speed is ${(a * t).toFixed(1)} m/s and A’s ${(2 * t).toFixed(1)} m/s. ${a > 2.01 ? 'B is gaining on A.' : a < 1.99 ? 'B is falling behind.' : 'A tie.'}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Race: same time, different pushes', col) + 8, L = 26, R = w - 20, dMax = 0.5 * 2 * 3.5 * 3.5 * 1.7;
    const X = (d) => L + (d / dMax) * (R - L);
    [['A  (10 N, 5 kg)', 2, col.s[0], top + 24], ['B  (' + F + ' N, ' + m + ' kg)', F / m, col.s[2], top + 24 + (h - top) * 0.42]].forEach(([nm, a, c, y]) => {
      text(ctx, nm, L, y - 8, { color: c, size: 11.5, weight: 700 });
      ctx.fillStyle = col.line; ctx.fillRect(L - 4, y + 24, R - L + 8, 4);
      for (let k = 0; k * 0.5 <= t + 1e-9; k++) { const d = 0.5 * a * (k * 0.5) ** 2; if (X(d) <= R + 2) { dot(ctx, X(d), y + 36, 3, c); } }
      const d = Math.min(0.5 * a * t * t, dMax), bw = 26 + Math.min(24, (nm.startsWith('A') ? 5 : m) * 1.5);
      const px = Math.min(X(d), R - bw / 2); ctx.fillStyle = c; ctx.globalAlpha = 0.45; ctx.fillRect(px - bw / 2, y, bw, 22); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(px - bw / 2, y, bw, 22);
      dot(ctx, px - bw / 2 + 6, y + 26, 3, col.ink); dot(ctx, px + bw / 2 - 6, y + 26, 3, col.ink);
      const Fv = nm.startsWith('A') ? 10 : F; arrow(ctx, px - bw / 2 - 4 - Fv * 1.6, y + 11, px - bw / 2 - 2, y + 11, c, 3, 8);
    });
    // bars
    const by = h - 56, bw2 = (w - 60) / 2;
    text(ctx, 'acceleration', L, by - 6, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = col.s[0]; ctx.fillRect(L, by + 2, Math.min(bw2 * 2, 2 * 22), 9); ctx.fillStyle = col.s[2]; ctx.fillRect(L, by + 16, Math.min(bw2 * 2, (F / m) * 22), 9);
    text(ctx, 'A 2.0', L + 2 * 22 + 6, by + 7, { color: col.s[0], size: 10.5 }); text(ctx, `B ${(F / m).toFixed(1)}`, L + Math.min(bw2 * 2, (F / m) * 22) + 6, by + 21, { color: col.s[2], size: 10.5 });
  };
  show(); cv.redraw();
}
