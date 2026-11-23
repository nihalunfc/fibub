// Class 8 Tales by Dots and Lines (step player): drawing a pie chart. Angle of a sector = (count / total) x 360.
// 36 students, favourite fruit: mango 15, banana 9, apple 6, guava 6.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-prop2-lib.js';

const D = [['Mango', 15], ['Banana', 9], ['Apple', 6], ['Guava', 6]];
const N = ['Survey of 36 students: favourite fruit. Mango 15, banana 9, apple 6, guava 6. We want a pie chart.', 'Add the counts for the total: 15 + 9 + 6 + 6 = 36. The whole circle (360°) stands for all 36 students.', 'Each student is 360° ÷ 36 = 10° of the circle.', 'Angles: mango 15 × 10 = 150°, banana 9 × 10 = 90°, apple 6 × 10 = 60°, guava 6 × 10 = 60°.', 'Check: 150 + 90 + 60 + 60 = 360°. Always check that the angles add up to 360°.', 'Draw the circle, then use a protractor to mark each angle in turn from a starting radius. Label each sector.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Drawing a pie chart from a table, step by step' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Pie chart: favourite fruit', col), r = Math.min(w * 0.26, (h - top - 90) / 2), cx = w * 0.3, cy = top + 14 + r + 6;
    let a = -Math.PI / 2; const nshow = s < 5 ? 0 : s === 5 ? 4 : 0;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    D.forEach(([nm, c], i) => { const da = (c / 36) * 2 * Math.PI; if (nshow > i) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a, a + da); ctx.closePath(); ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); const m = a + da / 2; text(ctx, c * 10 + '°', cx + Math.cos(m) * r * 0.62, cy + Math.sin(m) * r * 0.62, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); } a += da; });
    const x0 = w * 0.58, rows = [['Fruit', 'Students', 'Angle']];
    D.forEach(([nm, c]) => rows.push([nm, String(c), s >= 3 ? c * 10 + '°' : s >= 2 ? c + ' × 10' : '']));
    rows.push(['Total', s >= 1 ? '36' : '', s >= 4 ? '360°' : '']);
    rows.forEach((rw, i) => { const y = top + 24 + i * 21, hd = i === 0, tot = i === rows.length - 1; if (s < 1 && tot) return; rw.forEach((c, j) => text(ctx, c, x0 + [0, 52, 104][j] - (j ? 0 : 0), y, { color: i > 0 && i < 5 ? col.ink : col.ink, size: 11, weight: hd || tot ? 700 : 400 })); if (i > 0 && i < 5) { ctx.fillStyle = col.s[i - 1]; ctx.fillRect(x0 - 14, y - 5, 9, 9); } });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
