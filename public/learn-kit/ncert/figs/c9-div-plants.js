// Class 9 Diversity (step player): the plant kingdom grouped by a few big features, each group adding something new.
// Algae (Thallophyta): simple body, not divided into root/stem/leaf. Bryophytes (moss): small, a stem-like and leaf-like
// body but no vascular tissue (no tubes for water). Pteridophytes (ferns): true roots, stems, leaves and vascular tissue,
// but no seeds (spores). Gymnosperms (pine, deodar, cycas): seeds that are not enclosed in a fruit. Angiosperms: flowers,
// and seeds enclosed in fruits; monocots (one seed leaf) and dicots (two). A ticks table builds up as the steps advance.
import { canvas, text, title, dot, line, loop, font } from '../../kit.js';

const G = [
  ['Algae (Thallophyta)', 'Spirogyra, Ulva, seaweeds', [1, 0, 0, 0, 0], 'Simple body, not divided into root, stem and leaf. Mostly live in water; many are green and make food.'],
  ['Bryophytes', 'Moss, liverwort', [1, 1, 0, 0, 0], 'Small land plants with a stem-like and leaf-like body but no tubes to carry water, so they stay low and damp. They reproduce by spores.'],
  ['Pteridophytes', 'Ferns, horsetails', [1, 1, 1, 0, 0], 'True roots, stems and leaves with vascular tissue (tubes for water and food), so they grow taller. Still reproduce by spores, no seeds.'],
  ['Gymnosperms', 'Pine, deodar, cycas', [1, 1, 1, 1, 0], 'Make seeds, but the seeds are naked: not enclosed in a fruit. Cones carry the seeds. Often tall evergreen trees.'],
  ['Angiosperms', 'Mango, rice, rose, neem', [1, 1, 1, 1, 1], 'Make flowers and their seeds are enclosed in fruits. The biggest plant group. Monocots have one seed leaf and dicots have two.'],
];
const COLS = ['Makes its own food', 'Roots, stem, leaves', 'Vascular tissue', 'Seeds', 'Flowers, fruits'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'Five plant groups, each adding a new feature to the ones before' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const g = G[step]; title(ctx, g[0], col);
    text(ctx, g[1], 10, 50, { color: col.s[3], size: 11, weight: 700 });
    // plant sketch
    const cx = w * 0.5, gy = h * 0.35, sw = Math.sin(t * 1.5) * 1.5;
    const sk = w * 0.2;
    if (step === 0) { for (let k = 0; k < 4; k++) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 40 + k * 26, gy + 30); for (let y = 0; y < 5; y++) ctx.lineTo(cx - 40 + k * 26 + Math.sin(t * 2 + y + k) * 4, gy + 30 - y * 14); ctx.stroke(); } text(ctx, 'seaweed: no real root, stem or leaf', cx, gy + 48, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 1) { for (let k = -3; k <= 3; k++) { line(ctx, [[cx + k * 10, gy + 30], [cx + k * 10 + sw, gy + 6 - Math.abs(k) * 1.5]], col.s[2], 3); for (let j = 0; j < 3; j++) dot(ctx, cx + k * 10 + sw * (j / 3), gy + 24 - j * 7, 2.2, col.s[2]); } line(ctx, [[cx + 4, gy + 20], [cx + 4, gy - 14]], col.s[3], 1.5); dot(ctx, cx + 4, gy - 16, 3, col.s[3]); text(ctx, 'moss with spore capsule', cx, gy + 48, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 2) { for (let k = -2; k <= 2; k++) { const a = -Math.PI / 2 + k * 0.4; line(ctx, [[cx, gy + 30], [cx + Math.cos(a) * 54 + sw, gy + 30 + Math.sin(a) * 54]], col.s[2], 3); for (let j = 1; j < 7; j++) { const px = cx + Math.cos(a) * j * 8, py = gy + 30 + Math.sin(a) * j * 8; line(ctx, [[px, py], [px + 6, py - 3]], col.s[2], 2); line(ctx, [[px, py], [px - 6, py - 3]], col.s[2], 2); } } text(ctx, 'fern frond with true roots below', cx, gy + 48, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 3) { line(ctx, [[cx, gy + 34], [cx, gy - 40]], col.s[4], 5); for (let k = 0; k < 4; k++) { const y = gy - 34 + k * 18, L = 30 - k * 4; line(ctx, [[cx, y], [cx - L, y + 12 + sw]], col.s[2], 2.5); line(ctx, [[cx, y], [cx + L, y + 12 - sw]], col.s[2], 2.5); } ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.ellipse(cx + 38, gy + 20, 10, 15, 0.3, 0, 7); ctx.fill(); text(ctx, 'naked seeds in a cone', cx + 52, gy + 40, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 4) { line(ctx, [[cx, gy + 34], [cx, gy - 18]], col.s[4], 5); [-1, 1].forEach((d) => { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(cx + d * 28, gy - 6, 26, 12, d * -0.4, 0, 7); ctx.fill(); }); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.6; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * 16, gy - 28 + Math.sin(a) * 14, 9, 6, a, 0, 7); ctx.fill(); } dot(ctx, cx, gy - 28, 5, col.s[3]); dot(ctx, cx + 46, gy + 22, 11, col.s[1]); text(ctx, 'flower and fruit with seeds inside', cx, gy + 48, { color: col.muted, size: 10, align: 'center' }); }
    // table
    const top = h * 0.6, rh = 19;
    G.forEach((r, i) => { /* nothing */ });
    COLS.forEach((c, j) => {
      const y = top + j * rh; const has = g[2][j];
      text(ctx, c, 12, y, { color: col.ink, size: 10.5 });
      ctx.beginPath(); ctx.arc(w - 26, y, 7, 0, 7); ctx.fillStyle = has ? col.good : col.soft; ctx.fill(); if (has) text(ctx, '✓', w - 26, y, { color: '#fff', size: 11, weight: 700, align: 'center' });
      else text(ctx, '✕', w - 26, y, { color: col.muted, size: 10, align: 'center' });
    });
    ctx.font = font(10.5, 400); const L = []; let cur = ''; g[3].split(' ').forEach((wd) => { const s = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s).width > w - 24) { L.push(cur); cur = wd; } else cur = s; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); cv.redraw(); } };
}
