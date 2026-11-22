// Class 9 Reproduction (step player): sexual reproduction in animals, in outline. Male gametes (sperm: tiny, with a tail,
// many) swim to the female gamete (egg: large, with stored food, few). One sperm fuses with the egg: fertilisation.
// The fused cell, the zygote, divides again and again (2, 4, 8, ... cells), forms an embryo, and then the organs develop.
// Development happens inside an egg or inside the mother's body, depending on the animal. A schematic, not to scale.
import { canvas, text, title, dot, line, loop, font, ease } from '../../kit.js';

const T = ['Gametes meet', 'Fertilisation', 'The zygote', 'Cell division: 2, 4, 8', 'The embryo develops'];
const CAP = ['Sperm (male gametes) are tiny and swim with a tail. The egg (female gamete) is much larger and holds food.', 'One sperm enters the egg and the two nuclei fuse. Then the egg’s surface changes so no other sperm can get in.', 'The fertilised egg is the zygote. It has one set of instructions from each parent.', 'The zygote divides into 2 cells, then 4, then 8, and so on, making a ball of cells.', 'The ball of cells grows into an embryo as tissues and organs form. It develops inside an egg (hen, frog) or inside the mother’s body (cow, human).'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 420, min: 300, label: 'Sperm reaching an egg, fertilisation, the zygote and cell divisions' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const cx = w / 2, cy = h * 0.42, R = Math.min(w * 0.18, 56), P = ease(Math.min(1, (t % 4) / 3));
    const egg = (x, y, r, nuc) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke(); if (nuc) dot(ctx, x, y, r * 0.28, col.s[1]); };
    const sperm = (x, y, a) => { dot(ctx, x, y, 4, col.s[3]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.6; ctx.beginPath(); for (let k = 0; k < 14; k++) { const px = x - 4 - k * 1.8, py = y + Math.sin(k * 0.8 + a) * 3; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); };
    if (step === 0) { egg(cx + 36, cy, R, true); text(ctx, 'egg', cx + 36, cy + R + 14, { color: col.s[0], size: 11, weight: 700, align: 'center' }); for (let k = 0; k < 7; k++) { const f = ((t * 0.18 + k * 0.13) % 1), x = 16 + f * (cx + 36 - R - 22), y = cy + (k - 3) * 24 + Math.sin(t * 5 + k) * 5; sperm(x, y, t * 12 + k); } text(ctx, 'sperm', 40, cy - 94, { color: col.s[3], size: 11, weight: 700 }); }
    if (step === 1) { egg(cx, cy, R, false); const f = P; sperm(cx - R - 30 + f * 34, cy, t * 12); for (let k = 0; k < 3; k++) sperm(cx - R - 20 - k * 10 - 30, cy + (k - 1) * 30, t * 10 + k); dot(ctx, cx, cy - 4, R * 0.26, col.s[1]); dot(ctx, cx + (1 - f) * R * 0.45, cy + 6, R * 0.2, col.s[3]); }
    if (step === 2) { egg(cx, cy, R, true); ctx.beginPath(); ctx.arc(cx, cy, R + 7, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'zygote', cx, cy + R + 22, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, 'one cell', cx, cy + R + 38, { color: col.muted, size: 10.5, align: 'center' }); }
    if (step === 3) { const n = Math.floor((t % 6) / 2); const cells = [[[0, 0]], [[-1, 0], [1, 0]], [[-1, -1], [1, -1], [-1, 1], [1, 1]]][Math.min(2, n)]; const r = n === 0 ? R : n === 1 ? R * 0.55 : R * 0.44; cells.forEach(([a, b]) => { ctx.beginPath(); ctx.arc(cx + a * r, cy + b * r, r, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); dot(ctx, cx + a * r, cy + b * r, r * 0.28, col.s[1]); }); text(ctx, `${cells.length} cell${cells.length > 1 ? 's' : ''}`, cx, cy + R + 28, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    if (step === 4) { for (let i = 0; i < 24; i++) { const a = i * 2.4, r = Math.sqrt(i) * 9; dot(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9 - 4, 6, i % 3 ? col.s[2] : col.s[4]); } ctx.beginPath(); ctx.ellipse(cx, cy - 4, R * 1.2, R * 1.1, 0, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, 'embryo: tissues and organs form', cx, cy + R + 28, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    ctx.font = font(10.5, 400); const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s).width > w - 24) { L.push(cur); cur = wd; } else cur = s; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
