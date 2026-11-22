// Class 10 Areas Related to Circles: a goat tied with a rope of length r to a post. The grass it can reach is a sector of
// radius r whose angle depends on the walls: tied at the corner of a field the angle is 90° (a quarter circle), on the middle of
// a straight wall 180° (half circle), at the outside corner of a shed 270° (three quarters). Area = angle/360 × πr².
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let r = 4, mode = 90;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A goat tied to a post by a rope grazing a quarter, half or three quarters of a circle' });
  const ctl = row(host);
  slider(ctl, { label: 'Rope length r', min: 1, max: 6, step: 1, value: r, fmt: (v) => v + ' m', oninput: (v) => { r = v; say(); } });
  choice(ctl, 'Post is at', [[90, 'Field corner'], [180, 'Straight wall'], [270, 'Shed corner']], 90, (v) => { mode = v; say(); });
  const out = readout(host);
  function say() { const P = 22 / 7; out.innerHTML = `Angle = <b>${mode}°</b>, so the goat grazes ${mode}/360 of a circle: area = ${mode}/360 × π × ${r}² = <b>${(mode / 360 * P * r * r).toFixed(1)} m²</b> (π = 22/7). Rope end can travel ${(mode / 360 * 2 * P * r).toFixed(1)} m along the arc.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'How much grass can the goat reach?', col);
    const k = Math.min((w - 50) / 12, (h - 70) / 12), cx = w / 2, cy = h / 2 + 14, wall = col.s[4];
    const start = { 90: 0, 180: 0, 270: -Math.PI / 2 }[mode], span = (mode * Math.PI) / 180; // screen angles, y down, clockwise from +x
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r * k, start, start + span); ctx.closePath(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.soft; ctx.strokeStyle = wall; ctx.lineWidth = 4;
    if (mode === 90) { ctx.fillRect(cx - 6 * k, cy - 6 * k, 6 * k, 12 * k); ctx.fillRect(cx - 6 * k, cy - 6 * k, 12 * k, 6 * k); line(ctx, [[cx + 6 * k, cy], [cx, cy], [cx, cy + 6 * k]], wall, 4); ctx.fillStyle = col.s[2]; }
    if (mode === 180) { ctx.fillRect(cx - 6 * k, cy - 6 * k, 12 * k, 6 * k); line(ctx, [[cx - 6 * k, cy], [cx + 6 * k, cy]], wall, 4); }
    if (mode === 270) { ctx.fillStyle = col.line; ctx.fillRect(cx - 3.5 * k, cy, 3.5 * k, 3.5 * k); line(ctx, [[cx, cy], [cx - 3.5 * k, cy], [cx - 3.5 * k, cy + 3.5 * k], [cx, cy + 3.5 * k], [cx, cy]], wall, 4); text(ctx, 'shed', cx - 1.75 * k, cy + 1.75 * k, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
    line(ctx, [[cx, cy], [cx + r * k * Math.cos(start + span / 2), cy + r * k * Math.sin(start + span / 2)]], col.ink, 2, [5, 4]);
    text(ctx, 'r = ' + r + ' m', cx + r * k * 0.5 * Math.cos(start + span / 2) + 4, cy + r * k * 0.5 * Math.sin(start + span / 2) - 9, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    dot(ctx, cx, cy, 6, col.s[3], col.ink); text(ctx, 'post', cx + 9, cy + (mode === 270 ? -12 : -10), { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    const gx = cx + r * k * Math.cos(start + span * 0.8), gy = cy + r * k * Math.sin(start + span * 0.8); dot(ctx, gx, gy, 5, col.s[2], col.panel);
  };
  say();
}
