// 4.3 Letter shifts: write the alphabet with its positions, pick a shift, and code a word letter by letter.
import { canvas, text, row, slider, choice, readout } from '../../kit.js';

export const shift = (word, k) => word.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26 * 3) % 26) + 65));
export default function (host) {
  const cv = canvas(host, { aspect: 0.32, max: 220, min: 150, label: 'The alphabet with numbers and the shifted letters under it' });
  let k = 2, word = 'CLOUD';
  const ctl = row(host);
  slider(ctl, { label: 'Shift each letter by', min: -5, max: 5, step: 1, value: k, fmt: (v) => (v > 0 ? `+${v}` : String(v)), oninput: (v) => { k = v; go(); } });
  choice(ctl, 'Word', ['CLOUD', 'RIVER', 'TABLE', 'ZEBRA'], word, (v) => { word = v; go(); });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = `${word} → <b>${shift(word, k)}</b>. Positions to remember: E 5, J 10, O 15, T 20, Y 25 ("EJOTY"). Opposite letters add to 27: A–Z, B–Y, M–N.`; };
  cv.draw = (ctx, w, h, col) => {
    const cw = (w - 10) / 26, used = new Set(word);
    for (let i = 0; i < 26; i++) {
      const c = String.fromCharCode(65 + i), x = 5 + cw * (i + 0.5), on = used.has(c);
      if (on) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(x - cw / 2, 6, cw, h - 12); ctx.globalAlpha = 1; }
      text(ctx, String(i + 1), x, h * 0.18, { color: col.muted, size: 9, align: 'center' });
      text(ctx, c, x, h * 0.42, { color: col.ink, size: 12, weight: on ? 700 : 400, align: 'center' });
      text(ctx, shift(c, k), x, h * 0.72, { color: on ? col.s[3] : col.muted, size: 12, weight: on ? 700 : 400, align: 'center' });
    }
  };
  go();
}
