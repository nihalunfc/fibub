// 4.8 The angle between the hands: the minute hand moves 6° a minute, the hour hand 0.5° a minute.
import { canvas, text, row, slider, readout } from '../../kit.js';

export const angle = (hr, min) => { const a = Math.abs(30 * (hr % 12) - 5.5 * min); return Math.min(a, 360 - a); };
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 240, label: 'A clock face with the angle between the hands shaded' });
  let hr = 3, mn = 40;
  const ctl = row(host);
  slider(ctl, { label: 'Hour', min: 1, max: 12, step: 1, value: hr, fmt: String, oninput: (v) => { hr = v; go(); } });
  slider(ctl, { label: 'Minutes', min: 0, max: 59, step: 1, value: mn, fmt: (v) => String(v).padStart(2, '0'), oninput: (v) => { mn = v; go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = `|30 × ${hr % 12} − 5.5 × ${mn}| = ${Math.abs(30 * (hr % 12) - 5.5 * mn)}°, so the smaller angle is <b>${angle(hr, mn)}°</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.42, D = Math.PI / 180;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let k = 1; k <= 12; k++) { const a = (k * 30 - 90) * D; text(ctx, String(k), cx + R * 0.84 * Math.cos(a), cy + R * 0.84 * Math.sin(a), { color: col.ink, size: 12, weight: 600, align: 'center' }); }
    const am = (mn * 6 - 90) * D, ah = ((hr % 12) * 30 + mn * 0.5 - 90) * D;
    let a0 = ah, a1 = am; if (((am - ah) / D + 360) % 360 > 180) [a0, a1] = [am, ah];
    ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 0.45, a0, a1 < a0 ? a1 + Math.PI * 2 : a1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineCap = 'round';
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 0.5 * Math.cos(ah), cy + R * 0.5 * Math.sin(ah)); ctx.stroke();
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 0.75 * Math.cos(am), cy + R * 0.75 * Math.sin(am)); ctx.stroke();
  };
  go();
}
