// 5.4 Arc and sector as a fraction of the whole circle: slide the central angle and radius.
import { canvas, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  const S = { a: 90, r: 6 };
  const cv = canvas(host, { aspect: 0.6, max: 320, min: 230, label: 'A circle with a shaded sector and its arc' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'central angle (°)', min: 10, max: 360, step: 5, value: S.a, fmt: (v) => String(v), oninput: (v) => { S.a = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'radius', min: 1, max: 12, step: 1, value: S.r, fmt: (v) => String(v), oninput: (v) => { S.r = v; cv.redraw(); show(); } });
  cv.draw = (ctx, w, h, col) => {
    const R = Math.min(h / 2 - 22, w / 2 - 30), cx = w / 2, cy = h / 2 + 4, t = (S.a * Math.PI) / 180;
    ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, -t, 0); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R, -t, 0); ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx + R, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx + R * Math.cos(t), cy - R * Math.sin(t)); ctx.stroke();
    text(ctx, `${S.a}°`, cx + 10, cy - 12, { color: col.ink, size: 12, weight: 700 });
  };
  const show = () => {
    const f = S.a / 360;
    out.innerHTML = `Fraction of the circle: ${S.a}/360 = <b>${fmt(f)}</b>. Arc length = ${fmt(f)} × 2π(${S.r}) = <b>${fmt(f * 2 * S.r)}π</b> ≈ ${fmt(f * 2 * Math.PI * S.r)}. Sector area = ${fmt(f)} × π(${S.r})² = <b>${fmt(f * S.r * S.r)}π</b> ≈ ${fmt(f * Math.PI * S.r * S.r)}.`;
  };
  cv.redraw(); show();
}
