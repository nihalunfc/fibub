// Class 9 Rotation: the angle between clock hands. The minute hand turns 360° in 60 min (6° per minute); the hour
// hand turns 360° in 12 h (30° per hour, 0.5° per minute). The angle between them is the difference of the two
// positions (the smaller of the difference and 360° minus the difference).
import { canvas, text, title, row, slider, button, readout, loop, dot } from '../../kit.js';

const two = (v) => String(v).padStart(2, '0');
export function face(ctx, cx, cy, R, col, mins, wedge = true) {
  const hh = (mins * 0.5) % 360, mm = (mins % 60) * 6, pt = (d, r) => [cx + Math.sin((d * Math.PI) / 180) * r, cy - Math.cos((d * Math.PI) / 180) * r];
  ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 60; i++) { const [x0, y0] = pt(i * 6, R - (i % 5 ? 4 : 9)), [x1, y1] = pt(i * 6, R - 1); ctx.strokeStyle = i % 5 ? col.muted : col.ink; ctx.lineWidth = i % 5 ? 1 : 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  for (let i = 1; i <= 12; i++) { const [x, y] = pt(i * 30, R - 21); text(ctx, String(i), x, y, { color: col.ink, size: Math.max(10, R / 7), weight: 700, align: 'center' }); }
  if (wedge) {
    let a = hh * Math.PI / 180 - Math.PI / 2, b = mm * Math.PI / 180 - Math.PI / 2, d = ((mm - hh) % 360 + 360) % 360;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(cx, cy);
    if (d <= 180) ctx.arc(cx, cy, R * 0.5, a, b, false); else ctx.arc(cx, cy, R * 0.5, b, a, false);
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  }
  let [x, y] = pt(hh, R * 0.5); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
  [x, y] = pt(mm, R * 0.78); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.lineCap = 'butt';
  dot(ctx, cx, cy, 5, col.ink);
}
export default function (host) {
  let m = 3 * 60 + 40;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A clock face with an hour hand and a minute hand and the angle between them' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Time', min: 0, max: 719, step: 1, value: m, fmt: (v) => { const t = Math.round(v), h = Math.floor(t / 60) || 12; return `${h}:${two(t % 60)}`; }, oninput: (v) => { m = v; sync(); } });
  const anim = loop(host, (dt) => { m = (m + 60 * dt) % 720; sl.set(m); sync(); }, { autoplay: false });
  anim.button(ctl);
  const c2 = row(host);
  [['3:00', 180], ['6:00', 360], ['9:00', 540], ['12:30', 30], ['4:20', 260]].forEach(([l, v]) => button(c2, l, () => { anim.pause(); m = v; sl.set(v); sync(); }));
  const out = readout(host);
  function sync() {
    const t = Math.round(m), hh = (t * 0.5) % 360, mm = (t % 60) * 6, d = Math.abs(hh - mm), ang = Math.min(d, 360 - d), hr = Math.floor(t / 60) || 12;
    out.innerHTML = `At ${hr}:${two(t % 60)}: hour hand ${hh}° from 12, minute hand ${mm}° from 12. Difference ${d}°, so the angle between the hands is <b>${ang}°</b>.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle between the hands', col);
    face(ctx, w / 2, top + (h - top) / 2, Math.min(w / 2 - 12, (h - top) / 2 - 6), col, Math.round(m));
  };
  sync();
}
