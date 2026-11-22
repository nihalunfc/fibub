// Class 10 Real Numbers (step player): the proof that the square root of 2 is irrational, by contradiction.
// Suppose sqrt2 = a/b in lowest terms. Then a^2 = 2b^2, so a is even; writing a = 2c gives b^2 = 2c^2, so b is even.
// Both even contradicts "lowest terms", so no such fraction exists.
import { canvas, text, title } from '../../kit.js';

const L = ['Suppose √2 = a/b in lowest terms (no common factor).', 'Square both sides: 2 = a²/b², so a² = 2b².', 'a² is even, so a is even. Write a = 2c.', 'Then 4c² = 2b², so b² = 2c²: b is even too.', 'a and b are both even: they share the factor 2!', 'That contradicts "lowest terms". So √2 is not a/b.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The proof that root 2 is irrational shown line by line with cards for a and b' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Why √2 is irrational', col) + 14;
    for (let i = 0; i <= Math.min(s, 5); i++) text(ctx, `${i + 1}. ${L[i]}`, 10, top + 14 + i * 24, { color: i === s ? col.ink : col.muted, size: 12, weight: i === s ? 700 : 400, halo: col.panel });
    const card = (x, name, state, tone) => {
      const cw = Math.min(110, w * 0.34), cy = h - 70;
      ctx.fillStyle = col.panel; ctx.strokeStyle = tone; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x - cw / 2, cy - 28, cw, 56, 10); ctx.fill(); ctx.stroke();
      text(ctx, name, x, cy - 10, { color: col.ink, size: 16, weight: 700, align: 'center' }); text(ctx, state, x, cy + 12, { color: tone, size: 12, weight: 700, align: 'center' });
    };
    const aS = s < 2 ? 'unknown' : 'even', bS = s < 1 ? 'unknown' : s < 3 ? 'unknown' : 'even';
    card(w * 0.28, 'a', aS, s >= 4 ? col.s[6] : s >= 2 ? col.s[2] : col.muted); card(w * 0.72, 'b', bS, s >= 4 ? col.s[6] : s >= 3 ? col.s[2] : col.muted);
    text(ctx, s >= 5 ? 'irrational' : s >= 4 ? 'contradiction!' : '', w / 2, h - 22, { color: s >= 5 ? col.s[3] : col.s[6], size: 13, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
