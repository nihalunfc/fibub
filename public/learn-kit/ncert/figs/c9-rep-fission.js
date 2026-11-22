// Class 9 Reproduction (step player): binary fission in an amoeba. The nucleus divides first, then the cell pinches
// in the middle and splits into two daughter cells, each with one nucleus. The daughters are identical copies of the
// parent (clones) and each grows and can divide again, so one cell becomes 2, 4, 8... Bacteria and many single-celled
// organisms reproduce this way. Shapes are schematic.
import { canvas, text, title, dot, line, loop, font, ease } from '../../kit.js';

const T = ['One amoeba', 'The nucleus divides', 'The cell pinches in', 'Two new amoebae', 'Each one divides again'];
const CAP = ['A single-celled amoeba has one nucleus. It feeds and grows until it is big enough to divide.', 'First the nucleus splits into two. Each new nucleus has a full copy of the instructions.', 'The cell membrane and cytoplasm pinch in at the middle, between the two nuclei.', 'The cell separates: two daughter cells, each with one nucleus, each the same as the parent.', 'Each daughter grows and divides in turn: 1, 2, 4, 8, ... A population grows very fast.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 300, label: 'An amoeba dividing by binary fission in steps' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function cell(ctx, x, y, r, col, nuc) {
    const wob = (k) => 1 + 0.05 * Math.sin(t * 2 + k);
    ctx.beginPath(); for (let a = 0; a <= 6.3; a += 0.1) { const rr = r * wob(a * 3 + x); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath();
    ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
    if (nuc) dot(ctx, x + nuc[0], y + nuc[1], r * 0.28, col.s[1]);
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const cx = w / 2, cy = h * 0.42, R = Math.min(w * 0.19, 62), p = ease(Math.min(1, (t % 3.6) / 2));
    if (step === 0) { cell(ctx, cx, cy, R * 1.25, col, [0, 0]); text(ctx, 'nucleus', cx, cy + R * 1.25 + 14, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    if (step === 1) { const d = R * 0.5 * p; ctx.beginPath(); ctx.ellipse(cx, cy, R * (1.25 + 0.3 * p), R * 1.25, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); dot(ctx, cx - d, cy, R * 0.28, col.s[1]); dot(ctx, cx + d, cy, R * 0.28, col.s[1]); text(ctx, 'two nuclei', cx, cy + R * 1.25 + 14, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    if (step === 2) { const d = R * 0.9, pinch = 1 - 0.55 * p; ctx.beginPath(); ctx.moveTo(cx - d - R, cy); ctx.ellipse(cx - d, cy, R * 1.05, R * 1.05, 0, Math.PI * 0.6, Math.PI * 1.4); ctx.lineTo(cx - 8, cy - R * pinch); ctx.lineTo(cx + 8, cy - R * pinch); ctx.ellipse(cx + d, cy, R * 1.05, R * 1.05, 0, Math.PI * 1.6, Math.PI * 0.4); ctx.lineTo(cx + 8, cy + R * pinch); ctx.lineTo(cx - 8, cy + R * pinch); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); dot(ctx, cx - d, cy, R * 0.28, col.s[1]); dot(ctx, cx + d, cy, R * 0.28, col.s[1]); }
    if (step === 3) { const d = R * (0.9 + 0.9 * p); cell(ctx, cx - d, cy, R * 1.05, col, [0, 0]); cell(ctx, cx + d, cy, R * 1.05, col, [0, 0]); text(ctx, 'daughter cells', cx, cy + R * 1.25 + 16, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (step === 4) { const r2 = R * 0.62, d = R * 1.7; [-1, 1].forEach((s) => { const sp = R * 0.85 * p; cell(ctx, cx + s * d, cy - sp, r2, col, [0, 0]); cell(ctx, cx + s * d, cy + sp, r2, col, [0, 0]); }); text(ctx, '1 → 2 → 4', cx, cy + R * 1.8, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    ctx.font = font(10.5, 400); const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s).width > w - 24) { L.push(cur); cur = wd; } else cur = s; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
