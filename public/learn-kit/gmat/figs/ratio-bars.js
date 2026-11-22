// 4.2 A ratio a : b as equal blocks: the total splits into a + b parts of the same size.
import { canvas, text, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.32, max: 200, min: 160, label: 'A ratio shown as equal blocks' });
  let a = 3, b = 5, tot = 120;
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'a', min: 1, max: 9, step: 1, value: a, fmt: f, oninput: (v) => { a = Math.round(v); go(); } });
  slider(ctl, { label: 'b', min: 1, max: 9, step: 1, value: b, fmt: f, oninput: (v) => { b = Math.round(v); go(); } });
  slider(ctl, { label: 'Total', min: 20, max: 400, step: 10, value: tot, fmt: f, oninput: (v) => { tot = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const k = tot / (a + b); out.innerHTML = `${a} + ${b} = ${a + b} parts. One part = ${tot} ÷ ${a + b} = ${+k.toFixed(3)}. So the shares are ${a} × ${+k.toFixed(3)} = <b>${+(a * k).toFixed(2)}</b> and ${b} × ${+k.toFixed(3)} = <b>${+(b * k).toFixed(2)}</b>.${Number.isInteger(k) ? '' : ' The part is not whole, so this total cannot be split into whole items in this ratio.'}`; };
  cv.draw = (ctx, w, h, col) => {
    const n = a + b, L = 14, R = w - 14, bw = (R - L) / n, y = h * 0.4;
    for (let i = 0; i < n; i++) { ctx.fillStyle = i < a ? col.s[0] : col.s[1]; ctx.fillRect(L + i * bw + 1, y, bw - 2, 34); text(ctx, String(+(tot / n).toFixed(1)), L + (i + 0.5) * bw, y + 17, { color: col.panel, size: 10.5, weight: 700, align: 'center' }); }
    text(ctx, `a: ${a} parts`, L + (a * bw) / 2, y + 52, { color: col.ink, size: 11, align: 'center' });
    text(ctx, `b: ${b} parts`, L + a * bw + (b * bw) / 2, y + 52, { color: col.ink, size: 11, align: 'center' });
    title(ctx, 'Every block holds the same amount', col);
  };
  go();
}
