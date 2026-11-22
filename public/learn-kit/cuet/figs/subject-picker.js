// 1.3 Tick target courses (simplified example rules) and see how many of them each CUET test unlocks.
// Real rules differ by university and year; the caption says so.
import { canvas, text } from '../../kit.js';

export const COURSES = [
  ['B.Sc. (Hons) Physics', ['English', 'Physics', 'Chemistry', 'Maths']],
  ['B.Sc. (Hons) Chemistry', ['English', 'Physics', 'Chemistry', 'Maths']],
  ['B.Sc. (Hons) Botany or Zoology', ['English', 'Physics', 'Chemistry', 'Biology']],
  ['B.Sc. (Hons) Mathematics', ['English', 'Maths']],
  ['B.Com (Hons)', ['English', 'Maths', 'Accountancy']],
  ['B.A. (Hons) Economics', ['English', 'Maths', 'Economics']],
  ['BBA or BMS', ['English', 'General Test']],
  ['B.A. Programme', ['English', 'General Test']],
];

export default function (host) {
  const picked = new Set([0, 4, 6]);
  const box = document.createElement('div');
  box.className = 'lk-row';
  COURSES.forEach(([name], i) => {
    const l = document.createElement('label'); l.style.cssText = 'display:inline-flex;gap:.35rem;align-items:center;margin:.15rem .6rem .15rem 0;font-size:.9rem';
    const c = document.createElement('input'); c.type = 'checkbox'; c.checked = picked.has(i);
    c.addEventListener('change', () => { c.checked ? picked.add(i) : picked.delete(i); cv.redraw(); });
    l.append(c, name); box.appendChild(l);
  });
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 220, label: 'Bars: how many of the ticked courses each test is needed for' });
  host.insertBefore(box, host.firstChild);
  cv.draw = (ctx, w, h, col) => {
    const count = new Map();
    for (const i of picked) for (const t of COURSES[i][1]) count.set(t, (count.get(t) || 0) + 1);
    const rows = [...count].sort((a, b) => b[1] - a[1]);
    if (!rows.length) { text(ctx, 'Tick at least one course above.', 14, h / 2, { color: col.muted, size: 13 }); return; }
    const n = picked.size, lw = 96, bw = w - lw - 40, rh = Math.min(28, (h - 40) / rows.length);
    rows.forEach(([t, c], k) => {
      const y = 28 + k * rh;
      text(ctx, t, lw - 6, y + rh / 2, { color: col.ink, size: 12, align: 'right' });
      ctx.fillStyle = k < 5 ? col.s[0] : col.line; ctx.fillRect(lw, y + 3, (c / n) * bw, rh - 6);
      text(ctx, `${c} of ${n}`, lw + (c / n) * bw + 6, y + rh / 2, { color: col.ink, size: 11 });
    });
    text(ctx, 'Top five tests in colour', 10, 12, { color: col.muted, size: 11 });
  };
  cv.redraw();
}
