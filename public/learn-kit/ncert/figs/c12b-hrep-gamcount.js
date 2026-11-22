// Class 12 Biology, Human Reproduction: how many gametes come from the same number of primary germ cells. Each primary spermatocyte gives 4 sperm
// (4 equal cells); each primary oocyte gives 1 large ovum and polar bodies (small cells that disintegrate; 3 are counted in the usual textbook
// scheme) because the divisions of oogenesis are unequal. Slide the number of cells starting meiosis.
import { canvas, text, title, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 3;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Dots for sperm and for eggs and polar bodies produced from the chosen number of primary cells' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'primary cells starting meiosis', min: 1, max: 8, step: 1, value: 3, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); go(); } });
  const go = () => { ro.textContent = `${n} primary spermatocyte${n > 1 ? 's' : ''} → ${4 * n} sperm (all functional).  ${n} primary oocyte${n > 1 ? 's' : ''} → ${n} ovum${n > 1 ? 'a' : ''} + ${3 * n} polar bodies (not functional). The sperm line makes four times as many gametes; the egg line puts all the cytoplasm and food into one big cell.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Gametes from n primary cells', col) + 4, half = (h - top) / 2, pad = 10;
    const sec = (y0, name, c1, build) => {
      text(ctx, name, pad, y0 + 12, { color: c1, size: 12, weight: 700 });
      for (let i = 0; i < n; i++) { const x = pad + 14 + i * ((w - 2 * pad - 20) / n), cw = (w - 2 * pad - 20) / n; build(x, y0 + 34, cw, i); }
    };
    sec(top, 'Spermatogenesis: 1 primary spermatocyte → 4 sperm', col.s[0], (x, y, cw) => { dot(ctx, x + cw * 0.3, y + 6, 8, col.s[1], col.ink); for (let k = 0; k < 4; k++) { dot(ctx, x + (k % 2) * 16 + 4, y + 36 + Math.floor(k / 2) * 18, 6, col.s[0], col.ink); } });
    sec(top + half, 'Oogenesis: 1 primary oocyte → 1 ovum + 3 polar bodies', col.s[3], (x, y, cw) => { dot(ctx, x + cw * 0.3, y + 6, 8, col.s[1], col.ink); dot(ctx, x + 10, y + 42, 13, col.s[3], col.ink); for (let k = 0; k < 3; k++) dot(ctx, x + 34 + (k % 2) * 10, y + 34 + k * 7, 3.5, col.muted); });
    text(ctx, 'big orange = ovum, small grey = polar bodies', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
