// Class 11 Rotational Motion: conservation of angular momentum with a spinning wheel and a rotating stool. Seen from above. The wheel spins at w_w (angular momentum L = I_w w_w,
// pointing up). If the person flips the wheel over, its L changes from +L to -L, so the stool and person must take +2L: I_s w_s = 2 I_w w_w. The total L stays the same.
import { canvas, line, text, title, row, slider, button, readout, loop, ease } from '../../kit.js';

export default function (host) {
  const Iw = 0.25; let ww = 20, Is = 3, flip = 0, tgt = 0, a1 = 0, a2 = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'View from above of a spinning wheel held on a rotating stool, with angular momentum bars' });
  const ctl = row(host);
  slider(ctl, { label: 'Wheel speed', min: 5, max: 40, step: 1, value: 20, fmt: (v) => v + ' rad/s', oninput: (v) => { ww = v; } });
  slider(ctl, { label: 'Person + stool I', min: 1, max: 6, step: 0.5, value: 3, fmt: (v) => v + ' kg m²', oninput: (v) => { Is = v; } });
  const b2 = row(host); button(b2, 'Flip the wheel over', () => { tgt = 1 - tgt; });
  const ro = readout(host);
  const state = () => { const w1 = ww * (1 - 2 * ease(flip)), L = Iw * ww, w2 = (L - Iw * w1) / Is; return { w1, w2, L }; };
  loop(host, (dt) => { flip += Math.sign(tgt - flip) * Math.min(Math.abs(tgt - flip), dt / 1.2); const { w1, w2 } = state(); a1 -= w1 * dt * 0.25; a2 -= w2 * dt * 3; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Flip the wheel: the stool spins the other way', col), { w1, w2, L } = state();
    const cx = w * 0.27, cy = top + (h - top) * 0.45, R = Math.min(w * 0.21, (h - top) * 0.3), r = R * 0.5;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.3); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke();
    line(ctx, [[cx, cy], [cx + R * Math.cos(a2), cy + R * Math.sin(a2)]], col.s[2], 3);
    text(ctx, 'stool + person', cx, cy + R + 14, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.3); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    for (let k = 0; k < 3; k++) line(ctx, [[cx, cy], [cx + r * Math.cos(a1 + k * 2.094), cy + r * Math.sin(a1 + k * 2.094)]], col.s[0], 3);
    text(ctx, 'wheel', cx, cy - r - 8, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    const bx = w * 0.74, by = cy, S = (cy - top - 36) / (Iw * 40 * 2) , items = [['wheel', Iw * w1, col.s[0]], ['stool', Is * w2, col.s[2]], ['total', Iw * w1 + Is * w2, col.ink]];
    text(ctx, 'angular momentum', bx - 10, top + 8, { color: col.muted, size: 10.5, weight: 700, align: 'center' });
    line(ctx, [[bx - 54, by], [bx + 80, by]], col.muted, 1);
    items.forEach(([n, v, c], i) => { const x = bx - 36 + i * 44, hgt = v * S; ctx.fillStyle = c; ctx.fillRect(x - 13, Math.min(by, by - hgt), 26, Math.abs(hgt)); text(ctx, n, x, top + 26, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, v.toFixed(1), x, hgt >= 0 ? by - hgt - 8 : by - hgt + 10, { color: col.ink, size: 10.5, align: 'center' }); });
    text(ctx, 'up = anticlockwise', bx - 10, h - 12, { color: col.muted, size: 10, align: 'center' });
    ro.textContent = `Total L = I_w ω_w = ${Iw} × ${ww} = ${L.toFixed(1)} kg m²/s the whole time. Wheel now ${w1.toFixed(1)} rad/s, stool and person ${w2.toFixed(2)} rad/s (${w2 > 0.005 ? 'anticlockwise' : w2 < -0.005 ? 'clockwise' : 'still'}). After the flip: ω_stool = 2 I_w ω_w / I_s = ${(2 * Iw * ww / Is).toFixed(2)} rad/s.`;
  };
  cv.redraw();
}
