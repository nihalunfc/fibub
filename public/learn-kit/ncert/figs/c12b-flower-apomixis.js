// Class 12 Biology, Sexual Reproduction in Flowering Plants: normal seeds, apomixis and polyembryony compared. In sexual seed formation every seed is a
// new genetic mix (colours here). Apomixis makes seeds without fertilisation (an unreduced egg or nucellar cell grows into an embryo), so every seed
// is a clone of the mother. Polyembryony puts several embryos in one seed (as in citrus, mango): some are nucellar clones of the mother.
import { canvas, text, title, row, choice, button, readout, rng } from '../../kit.js';

export default function (host) {
  let mode = 'sexual', seed = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A mother plant and its seeds: variable for sexual seeds, identical clones for apomixis, several embryos for polyembryony' });
  const ctl = row(host), ro = readout(host);
  const INFO = {
    sexual: 'Sexual: egg and sperm (from two parents) meet, so each seed has a new mix of genes. Good for variety; a farmer cannot keep a perfect hybrid this way.',
    apomixis: 'Apomixis: the seed forms without fertilisation, so every seed is a clone of the mother (same colour here). It could let farmers keep hybrid seeds for ever, so scientists try to put it into crops.',
    poly: 'Polyembryony: one seed holds more than one embryo, as in citrus and mango. Some come from nucellus cells (clones of the mother), one may come from the zygote (new mix).',
  };
  choice(ctl, 'Seeds made by', [['sexual', 'Fertilisation'], ['apomixis', 'Apomixis'], ['poly', 'Polyembryony']], 'sexual', (v) => { mode = v; go(); });
  button(ctl, 'New seeds', () => { seed += 7; go(); });
  const go = () => { ro.textContent = INFO[mode]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { sexual: 'Seeds from fertilisation vary', apomixis: 'Apomictic seeds are clones', poly: 'Many embryos in one seed' }[mode], col) + 8, r = rng(seed);
    const PAL = [col.s[0], col.s[1], col.s[5], col.s[4], col.s[6], col.s[7]], mc = col.s[3];
    ctx.beginPath(); ctx.arc(52, top + 60, 28, 0, 7); ctx.fillStyle = mc; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    text(ctx, 'mother plant', 52, top + 104, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const x0 = 112, cols = 3, cw = (w - x0 - 8) / cols, rows = 2, rh = (h - top - 30) / rows;
    for (let i = 0; i < cols * rows; i++) {
      const x = x0 + (i % cols) * cw + cw / 2, y = top + Math.floor(i / cols) * rh + rh / 2 - 4;
      ctx.beginPath(); ctx.ellipse(x, y, cw * 0.4, rh * 0.36, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
      const n = mode === 'poly' ? 2 + Math.floor(r() * 2) : 1;
      for (let k = 0; k < n; k++) {
        const clone = mode === 'apomixis' || (mode === 'poly' && k > 0), c = clone ? mc : PAL[Math.floor(r() * PAL.length)];
        const ex = x + (k - (n - 1) / 2) * cw * 0.3, rr = Math.min(cw, rh) * (mode === 'poly' ? 0.13 : 0.2);
        ctx.beginPath(); ctx.arc(ex, y, rr, 0, 7); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke();
      }
    }
    text(ctx, mode === 'sexual' ? 'every seed a different mix' : mode === 'apomixis' ? 'same colour as the mother' : 'orange = clone of mother, others = new mix', x0 + (w - x0) / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
