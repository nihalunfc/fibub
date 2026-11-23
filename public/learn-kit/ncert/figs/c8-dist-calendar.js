// Class 8 We Distribute: a calendar pattern explained with algebra. In any 2 x 2 block of dates the top-left date is x; the others are
// x + 1, x + 7 and x + 8, so the four add to 4x + 16 = 4(x + 4): always four times the number just below the block's centre.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let x = 9;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'A month calendar with a two by two block of dates whose sum is four x plus sixteen' });
  const ctl = row(host);
  slider(ctl, { label: 'Top-left date x', min: 1, max: 27, step: 1, value: x, fmt: (v) => String(Math.round(v)), oninput: (v) => { x = Math.round(v); upd(); } });
  const out = readout(host);
  const fix = () => ((x - 1) % 7 === 6 ? x - 1 : x);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '2 × 2 block: x, x+1, x+7, x+8', col), X0 = fix(), cw = Math.min(48, (w - 20) / 7), ch = Math.min(34, (h - t - 70) / 5), ox = (w - 7 * cw) / 2, oy = t + 20;
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => text(ctx, d, ox + (i + 0.5) * cw, oy - 4, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    for (let d = 1; d <= 35; d++) {
      const r = Math.floor((d - 1) / 7), c = (d - 1) % 7, inb = d === X0 || d === X0 + 1 || d === X0 + 7 || d === X0 + 8;
      if (inb) { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = col.s[2]; ctx.fillRect(ox + c * cw + 1, oy + r * ch + 3, cw - 2, ch - 2); ctx.restore(); }
      if (d <= 31) text(ctx, String(d), ox + (c + 0.5) * cw, oy + (r + 0.5) * ch + 3, { color: col.ink, size: 13, weight: inb ? 700 : 400, align: 'center' });
    }
    text(ctx, X0 + ' + ' + (X0 + 1) + ' + ' + (X0 + 7) + ' + ' + (X0 + 8) + ' = ' + (4 * X0 + 16), w / 2, h - 34, { color: col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, '4x + 16 = 4 × ' + X0 + ' + 16 = 4 × ' + (X0 + 4), w / 2, h - 12, { color: col.s[5], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const X0 = fix(); out.innerHTML = `Sum of the block = <b>${4 * X0 + 16}</b>. In algebra: x + (x+1) + (x+7) + (x+8) = 4x + 16. It works for every block because the extras 1 + 7 + 8 always add to 16.`; cv.redraw(); }
  upd();
}
