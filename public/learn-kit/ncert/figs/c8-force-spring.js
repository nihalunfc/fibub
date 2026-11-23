// Class 8 Forces: a spring balance measures force. Within its working range the stretch of a spring is proportional
// to the load (Hooke's law); that is why the scale of a spring balance has equal gaps. Mass m hangs, weight
// W = m g with g = 10 m/s^2 here; spring constant 100 N per m (1 cm per newton).
import { canvas, text, title, line, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 0.3;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'A spring balance with a hanging load and its graph of stretch against force' });
  const ctl = row(host);
  slider(ctl, { label: 'Hanging mass', min: 0, max: 1, step: 0.1, value: m, fmt: (z) => `${Math.round(z * 1000)} g`, oninput: (z) => { m = z; upd(); } });
  const out = readout(host);
  function upd() { out.innerHTML = `Weight = ${m.toFixed(1)} × 10 = <b>${(m * 10).toFixed(0)} N</b>; stretch = <b>${(m * 10).toFixed(0)} cm</b>. Double the load, double the stretch.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Spring balance: stretch ∝ force', col);
    const sx = w * 0.22, top = 40, F = m * 10, ext = F * 14;
    line(ctx, [[sx - 24, top], [sx + 24, top]], col.ink, 4);
    for (let i = 0; i <= 10; i++) { const y = top + 18 + i * 14; line(ctx, [[sx + 22, y], [sx + 32, y]], col.muted, 1); if (i % 2 === 0) text(ctx, `${i}`, sx + 46, y, { color: col.muted, size: 10, align: 'center' }); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, top); const y1 = top + 18 + ext; for (let i = 1; i <= 12; i++) ctx.lineTo(sx + (i % 2 ? 9 : -9), top + (y1 - top) * i / 12); ctx.lineTo(sx, y1); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(sx - 18, y1, 36, 18 + m * 22); line(ctx, [[sx - 26, y1], [sx + 36, y1]], col.s[3], 1.5, [3, 3]);
    const gx = w * 0.52, gw = w * 0.42, gy = h - 40, gh = h - 110;
    line(ctx, [[gx, gy], [gx + gw, gy]], col.ink, 1.5); line(ctx, [[gx, gy], [gx, gy - gh]], col.ink, 1.5);
    line(ctx, [[gx, gy], [gx + gw, gy - gh]], col.s[1], 2.5);
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(gx + gw * m, gy - gh * m, 6, 0, 7); ctx.fill();
    text(ctx, 'force (N)', gx + gw, gy + 16, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'stretch', gx + 4, gy - gh - 10, { color: col.muted, size: 10.5 });
    text(ctx, 'straight line through 0', gx + gw / 2, gy + 30, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
