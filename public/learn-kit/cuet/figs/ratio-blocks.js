// 3.3 A ratio as equal blocks: share an amount in a : b : c. Each block is one "part"; the amount ÷ total parts
// is the value of one block.
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.4, max: 250, min: 180, label: 'Rows of equal blocks showing how an amount is shared in a ratio' });
  let a = 2, b = 3, c = 5, total = 2000;
  const ctl = row(host);
  for (const [lab, get, set] of [['A gets parts', () => a, (v) => (a = v)], ['B gets parts', () => b, (v) => (b = v)], ['C gets parts', () => c, (v) => (c = v)]])
    slider(ctl, { label: lab, min: 1, max: 9, step: 1, value: get(), fmt: String, oninput: (v) => { set(v); go(); } });
  slider(ctl, { label: 'Amount (₹)', min: 100, max: 9000, step: 100, value: total, fmt: (v) => `₹${v}`, oninput: (v) => { total = v; go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw();
    const n = a + b + c, one = total / n;
    out.innerHTML = `${a} + ${b} + ${c} = ${n} parts, so one part = ₹${total} ÷ ${n} = <b>₹${+one.toFixed(2)}</b>. A gets ₹${+(a * one).toFixed(2)}, B ₹${+(b * one).toFixed(2)}, C ₹${+(c * one).toFixed(2)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const n = a + b + c, x0 = 34, bw = (w - x0 - 12) / 9, rh = (h - 16) / 3;
    [[a, 'A', col.s[0]], [b, 'B', col.s[2]], [c, 'C', col.s[3]]].forEach(([k, lab, cc], i) => {
      const y = 8 + i * rh;
      text(ctx, lab, 14, y + rh / 2, { color: col.ink, size: 14, weight: 700, align: 'center' });
      for (let j = 0; j < k; j++) { ctx.fillStyle = cc; ctx.fillRect(x0 + j * bw + 2, y + 5, bw - 4, rh - 10); }
      text(ctx, `₹${+((k * total) / n).toFixed(0)}`, x0 + k * bw + 4, y + rh / 2, { color: col.ink, size: 11 });
    });
  };
  go();
}
