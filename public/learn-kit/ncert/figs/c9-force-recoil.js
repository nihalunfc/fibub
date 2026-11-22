// Class 9 Science, Chapter 6: recoil of a gun. Before firing, gun and bullet are at rest: total momentum zero. After firing, the bullet
// goes forward with momentum m·v and the gun goes back with momentum M·V. Momentum is conserved, so M·V = m·v and the heavy gun
// moves far more slowly than the light bullet: V = m·v/M. The two momentum bars are equal and opposite.
import { canvas, text, title, line, dot, arrow, row, slider, button, loop, readout, clamp } from '../../kit.js';

export default function (host) {
  let mb = 20, vb = 400, M = 4, t = 0, fired = false;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A gun and a bullet before and after firing, with equal and opposite momentum bars' });
  const ctl = row(host);
  slider(ctl, { label: 'Bullet mass', min: 5, max: 50, step: 5, value: mb, fmt: (q) => `${q} g`, oninput: (q) => { mb = q; upd(); } });
  slider(ctl, { label: 'Bullet speed', min: 100, max: 800, step: 50, value: vb, fmt: (q) => `${q} m/s`, oninput: (q) => { vb = q; upd(); } });
  slider(ctl, { label: 'Gun mass', min: 1, max: 8, step: 0.5, value: M, fmt: (q) => `${q} kg`, oninput: (q) => { M = q; upd(); } });
  button(ctl, 'Fire', () => { t = 0; fired = true; upd(); }); button(ctl, 'Reset', () => { fired = false; t = 0; upd(); });
  loop(host, (dt) => { if (fired) t += dt; cv.redraw(); });
  const out = readout(host);
  const V = () => (mb / 1000 * vb) / M;
  function upd() { out.innerHTML = `Bullet momentum = ${mb / 1000} kg × ${vb} m/s = <b>${(mb / 1000 * vb).toFixed(1)} kg m/s</b>. Gun recoils backwards at V = mv/M = <b>${V().toFixed(2)} m/s</b> (${Math.round(vb / V())} times slower than the bullet). Total momentum after = ${(mb / 1000 * vb).toFixed(1)} − ${(M * V()).toFixed(1)} = 0.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fire the gun: momentum is shared out', col) + 14, cx = w * 0.45, gy = top + 36;
    const q = clamp(t, 0, 3), gx = cx - Math.min(70, V() * 40 * Math.min(q, 1.5)), bx = cx + 40 + (fired ? Math.min(q * 160, w - cx - 50) : 0);
    ctx.fillStyle = col.line; ctx.fillRect(10, gy + 40, w - 20, 3);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.6; ctx.fillRect(gx - 40, gy + 6, 64, 18); ctx.fillRect(gx - 30, gy + 22, 14, 18); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(gx - 40, gy + 6, 64, 18);
    text(ctx, 'gun', gx - 8, gy - 4, { color: col.ink, size: 10.5, align: 'center', weight: 700 });
    if (!fired || q < 0.02) dot(ctx, cx + 28, gy + 15, 4, col.s[1]); else dot(ctx, bx, gy + 15, 4, col.s[1], col.ink);
    if (fired && q > 0.05) { arrow(ctx, gx - 20, gy - 10, gx - 20 - Math.min(40, 6 + V() * 12), gy - 10, col.s[3], 3, 8); arrow(ctx, bx - 6, gy - 10, bx + 28, gy - 10, col.s[1], 3, 8); }
    // bars
    const pb = mb / 1000 * vb, by = gy + 74, bh = h - by - 18, mid = by + bh / 2, S = (bh / 2 - 16) / Math.max(pb, 0.01);
    line(ctx, [[12, mid], [w - 12, mid]], col.muted, 1);
    const bar = (x, v2, c, lab) => { ctx.fillStyle = c; ctx.globalAlpha = fired ? 1 : 0.15; ctx.fillRect(x, v2 >= 0 ? mid - v2 * S : mid, 44, Math.abs(v2) * S); ctx.globalAlpha = 1; text(ctx, lab, x + 22, h - 8, { color: col.muted, size: 10.5, align: 'center' }); if (fired) text(ctx, `${v2.toFixed(1)}`, x + 22, v2 >= 0 ? mid - v2 * S - 9 : mid + Math.abs(v2) * S + 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); };
    text(ctx, fired ? 'momentum after firing (kg m/s)' : 'before: all at rest, total momentum 0', 12, by - 2, { color: col.ink, size: 11.5, weight: 700 });
    bar(w * 0.2, -M * V(), col.s[3], 'gun (back)'); bar(w * 0.4, pb, col.s[1], 'bullet'); bar(w * 0.62, fired ? 0 : 0, col.s[2], 'total');
    text(ctx, '= 0', w * 0.62 + 22, mid - 12, { color: col.s[2], size: 12, weight: 700, align: 'center' });
  };
  upd();
}
