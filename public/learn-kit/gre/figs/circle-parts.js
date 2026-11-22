// 4.3 Circle parts: a central angle cuts an arc and a sector in proportion to the full circle.
import { canvas, row, slider, readout, text, title } from '../../kit.js';
export default function (host) {
  let r = 5, ang = 90;
  const cv = canvas(host, { aspect: 0.6, max: 300, min: 220, label: 'A circle with a shaded sector' });
  const c = row(host);
  slider(c, { label: 'Radius', min: 1, max: 10, step: 1, value: r, fmt: (v) => String(Math.round(v)), oninput: (v) => { r = Math.round(v); go(); } });
  slider(c, { label: 'Central angle', min: 10, max: 350, step: 5, value: ang, fmt: (v) => Math.round(v) + '°', oninput: (v) => { ang = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const fr = ang / 360;
    out.innerHTML = `Fraction of the circle = ${ang} ÷ 360 = ${(fr).toFixed(3)}. Arc = fraction × 2πr = ${(fr * 2 * Math.PI * r).toFixed(2)}. Sector area = fraction × πr² = ${(fr * Math.PI * r * r).toFixed(2)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 10, R = Math.min(w, h) * 0.34, a1 = (-ang * Math.PI) / 180;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a1, 0); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R, a1, 0); ctx.stroke(); ctx.lineWidth = 1;
    text(ctx, `${ang}°`, cx + 14, cy - 12, { color: col.ink, size: 12, weight: 700 }); text(ctx, `r = ${r}`, cx + R / 2, cy + 12, { color: col.ink, size: 12, align: 'center' });
    title(ctx, 'Arc and sector are the same fraction of the circle as the angle is of 360°', col);
  };
  go();
}
