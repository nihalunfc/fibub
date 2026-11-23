// Class 8 Time and the skies: day and night. Looking down on the North Pole, the Earth turns once in 24 hours, anticlockwise (west to
// east). Sunlight reaches half of Earth at any moment. A place on the sunny side has day, on the far side night, and the Sun seems to
// rise in the east because our place is turning towards it. Time of day sets the angle of the observer: 15 degrees per hour.
import { canvas, text, title, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let hr = 6, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'The Earth seen from above the North Pole, turning, with a person who passes from night to day' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Local time', min: 0, max: 24, step: 0.25, value: hr, fmt: (v) => { const h = Math.floor(v) % 24, m = Math.round((v % 1) * 60); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; }, oninput: (v) => { hr = v; say(); } });
  const an = loop(host, (dt) => { hr = (hr + dt * 1.2) % 24; sl.set(hr); say(); }, { autoplay: false }); an.button(ctl);
  const out = readout(host);
  const phase = () => (hr < 5.5 || hr >= 18.5 ? 'night' : hr < 7 ? 'sunrise' : hr < 17 ? 'day' : 'sunset');
  function say() { const p = phase(); out.innerHTML = `The Earth turns 15° every hour. At this moment the person is in <b>${p}</b>${p === 'sunrise' ? ': the place is just turning into the light, so the Sun appears in the east' : p === 'sunset' ? ': the place is turning away from the light, so the Sun sets in the west' : ''}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Why we have day and night', col);
    const cx = w * 0.56, cy = h * 0.54, R = Math.min(w * 0.3, h * 0.36);
    dot(ctx, 34, cy, 22, col.warn, col.ink); text(ctx, 'Sun', 34, cy + 36, { color: col.muted, size: 10.5, align: 'center' });
    for (const k of [-0.6, -0.3, 0, 0.3, 0.6]) arrow(ctx, 66, cy + k * R * 1.4, cx - R - 8, cy + k * R * 1.4 * 0.96, col.warn, 1.3, 6);
    dot(ctx, cx, cy, R, col.soft, col.ink);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R - 1, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fillStyle = col.ink; ctx.globalAlpha = 0.55; ctx.fill(); ctx.restore();
    text(ctx, 'NIGHT', cx + R * 0.45, cy - R * 0.7, { color: col.panel, size: 11, weight: 700, align: 'center' }); text(ctx, 'DAY', cx - R * 0.5, cy - R * 0.7, { color: col.ink, size: 11, weight: 700, align: 'center' });
    dot(ctx, cx, cy, 3, col.ink);
    const a = (180 + (hr - 12) * 15) * Math.PI / 180, ox = cx + R * Math.cos(a), oy = cy - R * Math.sin(a);
    line(ctx, [[ox, oy], [cx + (R + 16) * Math.cos(a), cy - (R + 16) * Math.sin(a)]], col.s[1], 3); dot(ctx, cx + (R + 20) * Math.cos(a), cy - (R + 20) * Math.sin(a), 5, col.s[1], col.ink);
    dot(ctx, ox, oy, 5, col.s[1], col.panel);
    // spin arrow
    ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.45, 0.5, 2.2, true); ctx.stroke(); ctx.restore();
    text(ctx, 'spins this way', cx, cy + R * 0.7, { color: col.s[2], size: 10, align: 'center', halo: col.soft });
    text(ctx, 'North Pole view', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
  };
  say();
}
