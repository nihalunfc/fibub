// Class 10 Areas Related to Circles: the area swept by a clock hand. The minute hand turns 6° every minute, the hour hand
// 0.5° every minute. In t minutes a hand of length r sweeps a sector of angle 6t° (or 0.5t°), so the area swept is
// (angle/360) × πr² and its tip travels an arc of (angle/360) × 2πr.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let t = 15, len = 14, minute = true;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A clock whose hand sweeps a sector as time passes' });
  const ctl = row(host);
  const st = slider(ctl, { label: 'Minutes passed', min: 0, max: 60, step: 1, value: t, fmt: (v) => v + ' min', oninput: (v) => { t = v; anim.pause(); say(); } });
  slider(ctl, { label: 'Hand length', min: 7, max: 21, step: 7, value: len, fmt: (v) => v + ' cm', oninput: (v) => { len = v; say(); } });
  choice(ctl, 'Hand', [[true, 'Minute hand'], [false, 'Hour hand']], true, (v) => { minute = v; say(); });
  const anim = loop(host, (dt) => { t += dt * 6; if (t > 60) t = 0; st.set(Math.round(t)); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  function say() { const ang = (minute ? 6 : 0.5) * Math.round(t), P = 22 / 7; out.innerHTML = `${Math.round(t)} min: the ${minute ? 'minute' : 'hour'} hand has turned <b>${+ang.toFixed(1)}°</b>. Area swept = ${+ang.toFixed(1)}/360 × π × ${len}² = <b>${(ang / 360 * P * len * len).toFixed(1)} cm²</b>. Tip has travelled ${(ang / 360 * 2 * P * len).toFixed(1)} cm.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Area swept by a clock hand', col);
    const R = Math.min(w * 0.34, (h - 60) * 0.44), cx = w / 2, cy = h / 2 + 12, ang = ((minute ? 6 : 0.5) * t * Math.PI) / 180, hl = (len / 21) * R;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6 - Math.PI / 2; line(ctx, [[cx + Math.cos(a) * R * 0.88, cy + Math.sin(a) * R * 0.88], [cx + Math.cos(a) * R * 0.97, cy + Math.sin(a) * R * 0.97]], col.ink, 2); if ([0, 3, 6, 9].includes(i)) text(ctx, String(i === 0 ? 12 : i), cx + Math.cos(a) * R * 0.76, cy + Math.sin(a) * R * 0.76, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, hl, -Math.PI / 2, -Math.PI / 2 + ang); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(cx, cy, hl, -Math.PI / 2, -Math.PI / 2 + ang); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    line(ctx, [[cx, cy], [cx, cy - hl]], col.muted, 1.5, [4, 4]);
    const tx = cx + Math.sin(ang) * hl, ty = cy - Math.cos(ang) * hl; line(ctx, [[cx, cy], [tx, ty]], col.s[3], 4); dot(ctx, tx, ty, 5, col.s[3], col.panel); dot(ctx, cx, cy, 5, col.ink);
  };
  say();
}
