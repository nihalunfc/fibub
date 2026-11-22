// The Moon's phase and the time of night, from above the north pole with sunlight from the right. Drag the Moon around
// its orbit (or press Play) and turn the Earth: the small flag is you. Where you stand decides the time of day, and the
// readout says whether the Moon is above your horizon. Try full Moon: it rises as the Sun sets.
import { canvas, text, row, slider, button, readout, loop, title, dot, arrow } from '../kit.js';

const D = Math.PI / 180, NAMES = ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
export default function (host) {
  let age = 7.4, hour = 18;
  const cv = canvas(host, { aspect: 0.82, max: 430, min: 300, label: 'Earth, Moon and Sun from above with an observer who can be moved round the Earth' });
  const c1 = row(host), c2 = row(host);
  const sa = slider(c1, { label: 'Days since new Moon', min: 0, max: 29.5, step: 0.1, value: age, fmt: (v) => v.toFixed(1), oninput: (v) => { age = v; show(); } });
  const sh = slider(c1, { label: 'Your local time', min: 0, max: 24, step: 0.1, value: hour, fmt: (v) => { const h = Math.floor(v) % 24, m = Math.round((v % 1) * 60) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }, oninput: (v) => { hour = v; show(); } });
  [['New', 0], ['First qtr', 7.4], ['Full', 14.8], ['Last qtr', 22.1]].forEach(([n, d]) => button(c2, n, () => { age = d; sa.set(d); show(); }));
  const anim = loop(host, (dt) => { hour = (hour + dt * 2) % 24; sh.set(hour); show(); }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  // Sun in direction +x. Observer at local hour: noon faces the Sun.
  const geo = () => {
    const phase = (age / 29.53) * 2 * Math.PI, mo = phase + Math.PI * 0; // Moon's angle from the Sun direction, ccw from above: new moon = 0 (between Earth and Sun)
    const obs = (hour - 12) * 15 * D; // observer's direction angle (noon = toward Sun, ccw positive when the day goes on)
    const up = Math.cos(mo - obs) > 0; // Moon above the horizon when it is within 90° of the zenith direction
    const lit = (1 - Math.cos(mo)) / 2;
    return { mo, obs, up, lit, ph: NAMES[Math.round(age / 29.53 * 8) % 8] };
  };
  function show() {
    const g = geo(), rise = ((12 + (age / 29.53) * 24 - 6) + 24) % 24, set = (rise + 12) % 24, f = (v) => `${String(Math.floor(v) % 24).padStart(2, '0')}:${String(Math.round((v % 1) * 60) % 60).padStart(2, '0')}`;
    out.innerHTML = `<b>${g.ph}</b> (${Math.round(g.lit * 100)}% lit). Moon is <b>${g.up ? 'above' : 'below'}</b> your horizon at this time. It rises about <b>${f(rise)}</b> and sets about <b>${f(set)}</b> local solar time: each day it comes up about 50 minutes later because it moves on in its orbit.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sun, Earth and Moon from above the north pole', col);
    const cx = w * 0.46, cy = h * 0.55, R = Math.min(w * 0.36, h * 0.36), g = geo();
    // sunlight arrows
    for (let i = -2; i <= 2; i++) arrow(ctx, w - 6, cy + i * 28, w - 50, cy + i * 28, col.s[1], 1.5, 6);
    text(ctx, 'sunlight', w - 8, cy - 70, { color: col.s[1], size: 10.5, align: 'right', weight: 600 });
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    // Earth (night half shaded)
    const re = R * 0.3;
    ctx.beginPath(); ctx.arc(cx, cy, re, 0, 7); ctx.fillStyle = col.soft; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, re, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fillStyle = col.muted; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(cx, cy, re, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, 'night', cx - re * 0.6, cy, { color: col.bg, size: 10, align: 'center' }); text(ctx, 'day', cx + re * 0.55, cy, { color: col.ink, size: 10, align: 'center' });
    // observer (flag) with horizon line
    const ox = cx + re * Math.cos(-g.obs), oy = cy + re * Math.sin(-g.obs);
    const tx = Math.cos(-g.obs), ty = Math.sin(-g.obs);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - ty * re * 0.9, oy + tx * re * 0.9); ctx.lineTo(ox + ty * re * 0.9, oy - tx * re * 0.9); ctx.stroke();
    arrow(ctx, ox, oy, ox + tx * 22, oy + ty * 22, col.s[2], 2, 7);
    text(ctx, 'you', ox + tx * 30, oy + ty * 30, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    // Moon: angle mo from the Sun direction, counter-clockwise seen from above (screen y down)
    const mx = cx + R * Math.cos(-g.mo), my = cy + R * Math.sin(-g.mo), rm = 11;
    ctx.beginPath(); ctx.arc(mx, my, rm, 0, 7); ctx.fillStyle = col.bg; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(mx, my, rm, -Math.PI / 2, Math.PI / 2); ctx.fillStyle = col.s[6] || col.s[1]; ctx.fill(); ctx.restore();
    text(ctx, 'Moon', mx, my - 18, { color: col.ink, size: 11, align: 'center', weight: 600 });
    // line of sight from you to the Moon
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = g.up ? col.good : col.bad; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(mx, my); ctx.stroke(); ctx.restore();
    // what you see: a small disc with the lit fraction
    const vx = 40, vy = h - 40, vr = 22; ctx.beginPath(); ctx.arc(vx, vy, vr, 0, 7); ctx.fillStyle = col.muted; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.stroke();
    const k = Math.cos(g.mo), waxing = Math.sin(g.mo) > 0, ry = vr * Math.abs(k);
    ctx.save(); ctx.translate(vx, vy); if (!waxing) ctx.scale(-1, 1); ctx.fillStyle = col.s[6] || col.s[1];
    ctx.beginPath(); ctx.arc(0, 0, vr, -Math.PI / 2, Math.PI / 2, false);
    if (k > 0) ctx.ellipse(0, 0, ry, vr, 0, Math.PI / 2, -Math.PI / 2, true); else ctx.ellipse(0, 0, ry, vr, 0, Math.PI / 2, Math.PI * 1.5, false);
    ctx.fill(); ctx.restore();
    text(ctx, 'seen from Earth', vx + vr + 8, vy, { color: col.muted, size: 10.5 });
    text(ctx, g.up ? 'Moon is up' : 'Moon is down', w - 10, h - 12, { color: g.up ? col.good : col.bad, size: 11.5, weight: 700, align: 'right' });
  };
  show();
}
