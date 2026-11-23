// Class 11 Biology, Locomotion: types of synovial joint and the movement each allows. Ball and socket: movement in all directions (shoulder, hip). Hinge: one plane like a door (knee, elbow).
// Pivot: rotation about one bone (atlas and axis, turning the head). Gliding: flat surfaces slide (wrist bones). Saddle: two planes, no spin (base of the thumb).
import { canvas, text, title, line, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let k = 'hinge', t = 0;
  const D = { hinge: ['Hinge joint', 'knee, elbow, ankle, finger joints', 'Moves in one plane only, like a door: bend and straighten.'], ball: ['Ball and socket joint', 'shoulder, hip', 'The round head of one bone sits in a cup of the other: movement in every direction and rotation.'], pivot: ['Pivot joint', 'atlas on axis (neck), radius and ulna', 'One bone rotates around another: shaking your head for "no".'], glide: ['Gliding joint', 'between carpals (wrist), between vertebrae faces', 'Flat surfaces slide over each other: small movements.'], saddle: ['Saddle joint', 'base of the thumb (carpal and metacarpal)', 'Two saddle-shaped surfaces: back and forth, side to side, but no spin.'] };
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'An animated model of the chosen joint type moving through its range' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Joint', [['hinge', 'Hinge'], ['ball', 'Ball & socket'], ['pivot', 'Pivot'], ['glide', 'Gliding'], ['saddle', 'Saddle']], k, (v) => { k = v; go(); });
  const anim = loop(host, (dt, tt) => { t = tt; cv.redraw(); }); anim.button(ctl);
  const go = () => { ro.textContent = `${D[k][0]}: ${D[k][1]}. ${D[k][2]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0], col), cx = w / 2, cy = t0 + (h - t0) * 0.45, s = Math.sin(t * 1.6), s2 = Math.cos(t * 1.6), len = Math.min(w, 340) * 0.32;
    const bone = (x0, y0, x1, y1, c, wd = 14) => { line(ctx, [[x0, y0], [x1, y1]], c, wd); ctx.beginPath(); ctx.arc(x1, y1, wd * 0.8, 0, 7); ctx.fillStyle = c; ctx.fill(); };
    if (k === 'hinge') { const a = (0.65 + 0.6 * s) * 1.2; bone(cx - len, cy, cx, cy, col.s[0]); bone(cx, cy, cx + len * Math.cos(a), cy + len * Math.sin(a), col.s[3]); ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); text(ctx, 'one plane', cx, cy - 50, { color: col.muted, size: 11, align: 'center' }); }
    if (k === 'ball') { bone(cx - len * 0.9, cy, cx, cy, col.s[0]); const a = t * 1.3, ex = len * Math.cos(a), ey = len * 0.55 * Math.sin(a * 1.7); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx + len * 0.3, cy, len * 0.8, len * 0.62, 0, 0, 7); ctx.stroke(); bone(cx, cy, cx + len * 0.3 + ex * 0.9, cy + ey * 1.1, col.s[3]); ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); text(ctx, 'every direction + rotation', cx, cy + len * 0.9, { color: col.muted, size: 11, align: 'center' }); }
    if (k === 'pivot') { const a = 0.7 * s; bone(cx, cy + len, cx, cy, col.s[0], 22); const nx = cx + 26 * Math.sin(a), ny = cy - 40 - len * 0.1; ctx.beginPath(); ctx.ellipse(cx, cy - 30, 28, 12, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.fillStyle = col.bg; ctx.fillRect(cx + 40 * Math.sin(a) - 4, cy - 56, 8, 14); text(ctx, 'nose →', cx + 40 * Math.sin(a), cy - 66, { color: col.muted, size: 10, align: 'center' }); void nx; void ny; text(ctx, 'spin about the long axis', cx, cy + len + 22, { color: col.muted, size: 11, align: 'center' }); }
    if (k === 'glide') { const d = 26 * s; ctx.fillStyle = col.s[0]; ctx.fillRect(cx - 70 + d, cy - 24, 140, 20); ctx.fillStyle = col.s[3]; ctx.fillRect(cx - 70, cy + 2, 140, 20); text(ctx, 'flat surfaces slide', cx, cy + 56, { color: col.muted, size: 11, align: 'center' }); }
    if (k === 'saddle') { bone(cx - len, cy + 20, cx, cy + 20, col.s[0]); const a = 0.45 * s, b = 0.45 * s2; bone(cx, cy + 20, cx + len * Math.cos(a) * 0.9, cy + 20 - len * Math.sin(a) * 0.9 - 24 * b, col.s[3]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy + 20 - len * 0.6); ctx.lineTo(cx, cy + 20 + len * 0.6); ctx.moveTo(cx - 10, cy + 20); ctx.lineTo(cx + len, cy + 20); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'two planes, no spin', cx, cy + len * 0.9, { color: col.muted, size: 11, align: 'center' }); }
  };
  go();
}
