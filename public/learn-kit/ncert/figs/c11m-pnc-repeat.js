// Class 11 Maths, Permutations when some things are alike: the arrangements of the letters of a word whose letters repeat.
// Pretend the identical letters are different (A1, A2, ...) and there are n! arrangements. But swapping identical
// letters changes nothing, so every real arrangement is counted p! times for a letter repeated p times: divide by p!, q!, ...
import { canvas, row, choice, slider, readout, text, title, rng } from '../../kit.js';

const W = { BANANA: 'BANANA', LEVEL: 'LEVEL', ALL: 'ALL', KERALA: 'KERALA', ASSESS: 'ASSESS', DELHI: 'DELHI' };
const f = (n) => (n <= 1 ? 1 : n * f(n - 1));
export default function (host) {
  let word = 'BANANA', d = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'Arrangements of a word with repeated letters, divided by factorials one repeated letter at a time' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  const counts = () => { const m = {}; for (const ch of word) m[ch] = (m[ch] || 0) + 1; return Object.entries(m).filter(([, v]) => v > 1); };
  choice(c1, 'word', Object.keys(W).map((k) => [k, k]), word, (v) => { word = v; d = 0; sl.set(0); re(); });
  const sl = slider(c2, { label: 'divide by repeats', min: 0, max: 3, step: 1, value: 0, fmt: (v) => String(Math.min(v, counts().length)), oninput: (v) => { d = Math.min(v, counts().length); re(); } });
  const re = () => { cv.redraw(); const c = counts(), n = word.length; let t = f(n); const parts = []; c.slice(0, d).forEach(([ch, k]) => { t /= f(k); parts.push(`${k}!`); }); out.innerHTML = `${n}!${parts.length ? ' ÷ ' + parts.join(' ÷ ') : ''} = <b>${t}</b>${d >= c.length ? ' distinct arrangements.' : c.length ? ' (still counting identical swaps; keep dividing).' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Arrangements of the letters of ${word}`, col), n = word.length, c = counts(), tot = f(n), y = top + 40, cw = Math.min(44, (w - 24) / n), x0 = (w - n * cw) / 2;
    const seen = {};
    [...word].forEach((ch, i) => { const k = (seen[ch] = (seen[ch] || 0) + 1), rep = c.findIndex(([x]) => x === ch), shown = rep >= 0 && rep < d; ctx.fillStyle = rep >= 0 ? col.s[(rep + 1) % 8] : col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(x0 + i * cw + 2, y - 18, cw - 4, 40); ctx.globalAlpha = 1; text(ctx, ch, x0 + i * cw + cw / 2, y, { color: col.ink, size: 20, weight: 700, align: 'center' }); if (rep >= 0 && !shown) text(ctx, String(k), x0 + i * cw + cw / 2 + 11, y + 11, { color: col.muted, size: 10 }); });
    text(ctx, d < c.length ? 'labelled copies look different (small numbers)' : 'identical copies are now treated as the same', w / 2, y + 36, { color: col.muted, size: 11, align: 'center' });
    let t = tot; c.slice(0, d).forEach(([, k]) => (t /= f(k)));
    const bw = w - 40, y2 = y + 70; ctx.fillStyle = col.line; ctx.fillRect(20, y2, bw, 22); ctx.fillStyle = col.s[0]; ctx.fillRect(20, y2, bw * Math.max(t, 0.5) / tot, 22);
    text(ctx, `${t} arrangements`, 24, y2 + 38, { color: col.ink, size: 15, weight: 700 }); text(ctx, `n! = ${tot}`, 20 + bw, y2 + 38, { color: col.muted, size: 11.5, align: 'right' });
    c.forEach(([ch, k], i) => text(ctx, `${ch} repeats ${k} times: ${k}! = ${f(k)} swaps look alike`, 20, y2 + 66 + i * 20, { color: i < d ? col.s[(i + 1) % 8] : col.muted, size: 11.5, weight: i < d ? 700 : 400 }));
  };
  re();
}
