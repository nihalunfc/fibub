// Class 11 Maths, Sets (step player): a worked counting problem. 60 students; 35 like chai, 28 like coffee, 12 like both. How many like at least one,
// and how many like neither? Uses n(A ∪ B) = n(A) + n(B) − n(A ∩ B), then subtracts from the whole group.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Step by step Venn diagram of a class survey of chai and coffee drinkers' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '60 students: 35 chai, 28 coffee, 12 both', col), R = Math.min(w * 0.22, 78), cy = top + 14 + R, cA = w / 2 - R * 0.55, cB = w / 2 + R * 0.55;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4; ctx.strokeRect(8, top + 4, w - 16, 2 * R + 20);
    text(ctx, 'U = 60', w - 16, top + 18, { color: col.muted, size: 12, weight: 700, align: 'right' });
    const circ = (x, c, on) => { if (!on) return; ctx.globalAlpha = 0.25; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, cy, R, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, cy, R, 0, 7); ctx.stroke(); };
    circ(cA, col.s[0], s >= 1); circ(cB, col.s[2], s >= 2);
    if (s >= 3) { ctx.save(); ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.clip(); ctx.globalAlpha = 0.55; ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.fill(); ctx.restore(); }
    const L = (t, x, y, c = col.ink, z = 18) => text(ctx, t, x, y, { color: c, size: z, weight: 800, align: 'center' });
    if (s === 1) L('35', cA - R * 0.45, cy);
    if (s === 2) { L('35', cA - R * 0.45, cy); L('28', cB + R * 0.45, cy); }
    if (s === 3) { L('35', cA - R * 0.55, cy); L('28', cB + R * 0.55, cy); L('12', w / 2, cy); }
    if (s >= 4) { L('23', cA - R * 0.55, cy); L('12', w / 2, cy); L('16', cB + R * 0.55, cy); }
    if (s >= 5) L('9', 30, top + 2 * R + 6, col.bad);
    const y = top + 2 * R + 44, say = (t, k, c = col.ink) => text(ctx, t, 12, y + k * 22, { color: c, size: 13, weight: 600 });
    if (s === 0) say('We want: how many like chai or coffee, and how many neither?', 0);
    if (s === 1) say('A = chai lovers: n(A) = 35.', 0);
    if (s === 2) { say('B = coffee lovers: n(B) = 28.', 0); say('35 + 28 = 63, more than 60 students!', 1, col.bad); }
    if (s === 3) { say('The 12 who like both were counted twice (in 35 and in 28).', 0); say('So subtract them once.', 1); }
    if (s >= 4) { say('n(A ∪ B) = 35 + 28 − 12 = 51', 0, col.s[0]); say('Only chai 23, both 12, only coffee 16: 23 + 12 + 16 = 51.', 1); }
    if (s >= 5) say('Neither: 60 − 51 = 9 students.', 2, col.bad);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
