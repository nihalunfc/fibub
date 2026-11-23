// Class 8 A Square and a Cube: a square number is an n by n block of tiles. Each new L-shaped border of 2n - 1 tiles
// turns the block for n into the block for n + 1, so n squared = 1 + 3 + 5 + ... + (2n - 1).
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { box } from './c8-lib.js';

export default function (host) {
  let n = 5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A square block of tiles with the newest L-shaped layer coloured' });
  const out = readout(host); const ctl = row(host);
  const sl = slider(ctl, { label: 'Side n', min: 1, max: 12, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = Math.round(v); sync(); } });
  function sync() {
    const odd = Array.from({ length: n }, (_, i) => 2 * i + 1);
    out.innerHTML = `<b>${n} × ${n} = ${n * n}</b> tiles. The newest L-layer has <b>${2 * n - 1}</b> tiles. Sum of the first ${n} odd numbers: ${n <= 6 ? odd.join(' + ') : '1 + 3 + … + ' + (2 * n - 1)} = ${n * n}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Square numbers as tiles', col), s = Math.min((w - 24) / 12, (h - top - 14) / 12), x0 = (w - s * n) / 2, y0 = top + 8 + (12 - n) * s * 0.0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const layer = Math.max(r, c); // 0-based layer index
      box(ctx, x0 + c * s, y0 + r * s, s - 1, col.s[layer % 6], col.panel, 1);
    }
    text(ctx, `${n}²`, w / 2, y0 + n * s + 9, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  sync();
}
