// Colour with a purpose: the same six lines drawn two ways. "Every line a colour" makes the reader decode a legend; "Grey
// plus one" shouts the one thing that matters. Pick which line is the story and flip between the two. Made-up data.
import { canvas, axes, line, text, title, row, choice, readout } from '../kit.js';
import { wob } from './_biz.js';

const NAMES = ['Rideau', 'Queen', 'Forks', 'Online', 'Kiosk', 'Depot'];
const D = NAMES.map((n, s) => Array.from({ length: 12 }, (_, m) => 50 + s * 6 + m * (s === 3 ? 4.5 : 0.8) + 4 * wob(s * 12 + m, 1.7)));
export default function (host) {
  let mode = 'grey', hl = 3;
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 290, label: 'Six store lines, coloured two ways' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Colour', [['rainbow', 'Every line a colour'], ['grey', 'Grey plus one']], mode, (v) => { mode = v; cv.redraw(); show(); });
  choice(c2, 'The story is', NAMES.map((n, i) => [i, n]), hl, (v) => { hl = v; cv.redraw(); show(); });
  const out = readout(host);
  function show() { out.innerHTML = mode === 'rainbow' ? 'Six colours, six legend look-ups. Where do you look first? Nothing tells you what matters.' : `The eye goes straight to <b>${NAMES[hl]}</b>. The others stay visible as context, and the label sits at the line's end so there is no legend to decode.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'rainbow' ? 'Which line should I look at?' : `Our story: ${NAMES[hl]}`, col);
    const a = axes(ctx, w, h, col, { t: 40, x: [1, 12], y: [40, 120], xlabel: 'Month', l: 36, grid: mode === 'rainbow', xt: [1, 3, 6, 9, 12] });
    const order = [...D.keys()].filter((i) => i !== hl).concat(hl);
    order.forEach((s) => {
      const on = mode === 'rainbow' || s === hl, c = mode === 'rainbow' ? col.s[s] : s === hl ? col.s[0] : col.muted;
      ctx.globalAlpha = on ? 1 : 0.55; line(ctx, D[s].map((v, m) => [a.X(m + 1), a.Y(v)]), c, on ? 3.2 : 1.6); ctx.globalAlpha = 1;
      if (mode === 'grey') text(ctx, NAMES[s], a.R - 2, a.Y(D[s][11]) - (s === hl ? 0 : 0), { color: s === hl ? col.s[0] : col.muted, size: s === hl ? 12 : 9.5, weight: s === hl ? 800 : 400, align: 'right', halo: col.panel, fit: false, base: 'bottom' });
    });
    if (mode === 'rainbow') NAMES.forEach((n, i) => { ctx.fillStyle = col.s[i]; const x = 40 + (i % 3) * 100, y = 30 + Math.floor(i / 3) * 0; void y; });
    if (mode === 'rainbow') NAMES.forEach((n, i) => { const x = 42 + i * (w - 60) / 6; ctx.fillStyle = col.s[i]; ctx.fillRect(x, h - 14, 8, 8); text(ctx, n, x + 11, h - 10, { color: col.muted, size: 9, fit: false }); });
  };
  show(); cv.redraw();
}
