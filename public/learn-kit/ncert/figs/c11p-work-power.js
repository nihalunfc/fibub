// Class 11 Work, Energy and Power: power is the rate of doing work, P = W/t = F v. Two motors lift the same load through the same height, doing the same work
// m g h; the stronger motor just does it faster. Lifting speed v = P/(m g) for a steady lift.
import { canvas, line, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let m = 100, PA = 400, PB = 1200, t = 0;
  const g = 9.8, hgt = 5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Two motors lifting the same load, the stronger one finishing first' });
  const ctl = row(host);
  slider(ctl, { label: 'Load mass', min: 20, max: 200, step: 10, value: 100, fmt: (v) => v + ' kg', oninput: (v) => { m = v; t = 0; } });
  slider(ctl, { label: 'Motor A power', min: 200, max: 2000, step: 100, value: 400, fmt: (v) => v + ' W', oninput: (v) => { PA = v; t = 0; } });
  slider(ctl, { label: 'Motor B power', min: 200, max: 2000, step: 100, value: 1200, fmt: (v) => v + ' W', oninput: (v) => { PB = v; t = 0; } });
  const ro = readout(host);
  loop(host, (dt) => { t += dt * 3; if (t > Math.max(m * g * hgt / PA, m * g * hgt / PB) + 3) t = 0; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same work, different time', col), W = m * g * hgt;
    const base = h - 56, ytop = top + 26, ph = base - ytop;
    [['A', PA, w * 0.28, col.s[0]], ['B', PB, w * 0.72, col.s[2]]].forEach(([n, P, cx, c]) => {
      const T = W / P, f = Math.min(1, t / T), by = base - f * ph * 0.82;
      line(ctx, [[cx - 40, ytop], [cx - 40, base]], col.line, 2); line(ctx, [[cx + 40, ytop], [cx + 40, base]], col.line, 2);
      line(ctx, [[cx - 50, base + 2], [cx + 50, base + 2]], col.muted, 2);
      line(ctx, [[cx, ytop], [cx, by - 24]], col.muted, 1.5);
      const sz = 16 + m / 14; ctx.fillStyle = c; ctx.fillRect(cx - sz / 2, by - sz, sz, sz);
      text(ctx, 'Motor ' + n + ' · ' + P + ' W', cx, h - 38, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, `lifts in ${T.toFixed(1)} s`, cx, h - 22, { color: col.muted, size: 11, align: 'center' });
      text(ctx, `${Math.min(t, T).toFixed(1)} s`, cx, ytop + 4, { color: c, size: 12, weight: 700, align: 'center', halo: col.panel });
    });
    text(ctx, `work = m g h = ${Math.round(W)} J for both`, w / 2, h - 8, { color: col.ink, size: 11, weight: 700, align: 'center' });
    ro.textContent = `Lifting ${m} kg by ${hgt} m needs ${Math.round(W)} J of work whatever the motor. Power = work ÷ time: A takes ${(W / PA).toFixed(1)} s, B takes ${(W / PB).toFixed(1)} s. (The clock runs 3 times faster than real time.)`;
  };
  cv.redraw();
}
