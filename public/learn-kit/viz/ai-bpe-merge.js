// Byte-pair encoding, the way most tokenisers are built. Start with single letters; at each step find the pair of
// neighbouring tokens that occurs most often in the (made-up) word list, weighted by how often each word appears, and
// glue it into one new token. Step through and watch common chunks like "est" and "low" become single tokens.
import { canvas, text, row, button, readout, title } from '../kit.js';
import { ownSteps, rr } from './_ai.js';

const CORP = [['low', 5], ['lower', 2], ['newest', 6], ['widest', 3]];
const STATES = [];
(function build() {
  let words = CORP.map(([w, f]) => ({ t: [...w], f })), merged = null;
  for (let s = 0; s <= 9; s++) {
    const cnt = new Map();
    words.forEach((w) => { for (let i = 0; i < w.t.length - 1; i++) { const k = w.t[i] + '|' + w.t[i + 1]; cnt.set(k, (cnt.get(k) || 0) + w.f); } });
    const pairs = [...cnt].sort((a, b) => b[1] - a[1]);
    STATES.push({ words: words.map((w) => ({ t: [...w.t], f: w.f })), pairs: pairs.slice(0, 4), merged });
    if (!pairs.length) break;
    const [a, b] = pairs[0][0].split('|'); merged = a + b;
    words = words.map((w) => { const t = []; for (let i = 0; i < w.t.length; i++) { if (w.t[i] === a && w.t[i + 1] === b) { t.push(a + b); i++; } else t.push(w.t[i]); } return { t, f: w.f }; });
  }
})();
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 1.0, max: 400, min: 340, label: 'Words split into tokens, with the most frequent pair merged at each step' });
  const out = readout(host);
  const draw = (i) => {
    k = Math.min(i, STATES.length - 1); const S = STATES[k];
    const vocab = new Set(); STATES[k].words.forEach((w) => w.t.forEach((t) => vocab.add(t)));
    out.innerHTML = k === 0 ? 'Start: every word is split into single letters, so the "vocabulary" is just the letters. Counts like ×6 say how often each word appears.' : `Merge ${k}: the most common neighbouring pair was <b>${S.merged}</b>, so it is now one token. The vocabulary has ${vocab.size} tokens in use. Real tokenisers do this tens of thousands of times over huge text.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const S = STATES[k]; title(ctx, k ? `After ${k} merge${k > 1 ? 's' : ''}` : 'Start: single letters', col);
    let y = 44;
    S.words.forEach((wd) => {
      text(ctx, '×' + wd.f, 10, y + 14, { color: col.muted, size: 11, fit: false });
      let x = 38;
      wd.t.forEach((t) => {
        const bw = 8 + t.length * 11, isNew = t === S.merged, multi = t.length > 1;
        ctx.fillStyle = isNew ? col.s[1] : multi ? col.s[0] : col.soft; rr(ctx, x, y, bw, 28, 5); ctx.fill();
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke();
        text(ctx, t, x + bw / 2, y + 14, { color: isNew || multi ? col.panel : col.ink, size: 14, weight: 700, align: 'center', fit: false });
        x += bw + 4;
      });
      y += 38;
    });
    y += 6; text(ctx, 'Most frequent neighbouring pairs now:', 10, y, { color: col.ink, size: 12, weight: 700 });
    S.pairs.forEach(([p, c], i) => { const [a, b] = p.split('|'); text(ctx, `${a} + ${b}`, 16, y + 20 + i * 18, { color: i === 0 ? col.s[1] : col.muted, size: 12, weight: i === 0 ? 700 : 400, fit: false }); ctx.fillStyle = i === 0 ? col.s[1] : col.line; ctx.fillRect(90, y + 14 + i * 18, c * 9, 10); text(ctx, String(c), 94 + c * 9, y + 20 + i * 18, { color: col.muted, size: 11, fit: false }); });
  };
  ownSteps(host, STATES.length, draw, row, button);
  draw(0);
  return { step: (i) => draw(i) };
}
