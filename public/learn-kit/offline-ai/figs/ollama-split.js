// 9.2 Ollama: why a CPU/GPU split is slow. An 8 GB model; graphics card reads 300 GB/s, processor memory 50 GB/s.
// Steps: all on the card (27 ms per token, 37 tok/s); 6 GB on the card (20 ms); 2 GB left on the processor (40 ms);
// the total (60 ms, about 17 tok/s).
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const GPU8 = ['GPU 8 GB ÷ 300 GB/s', 8 / 300, 0], GPU6 = ['GPU 6 GB ÷ 300 GB/s', 6 / 300, 0], CPU2 = ['CPU 2 GB ÷ 50 GB/s', 2 / 50, 4];
const ST = [
  [[GPU8], 'All 8 GB on the graphics card', '27 ms per token → about 37 tokens per second'],
  [[GPU6], 'Only 6 GB fits on the card', 'the card\'s part takes 20 ms'],
  [[GPU6, CPU2], 'The other 2 GB runs from processor memory', 'that small part takes 40 ms, twice as long'],
  [[GPU6, CPU2], 'Total time per token: 60 ms', '1 ÷ 0.06 s ≈ 17 tokens per second, less than half'],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 280, min: 220, label: 'A timeline bar for one token: the graphics-card part and the slower processor part' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), L = 12, R = w - 16, max = 0.07, y = h * 0.42, bh = 36;
    const X = (s) => L + ((R - L) * s) / max;
    const [parts, head, foot] = ST[step];
    title(ctx, head, col);
    ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, bh);
    let t0 = 0;
    parts.forEach(([lab, s, c], i) => {
      const grow = i === parts.length - 1 && step < 3 ? e : 1;
      ctx.fillStyle = col.s[c]; ctx.fillRect(X(t0), y, (X(t0 + s) - X(t0)) * grow, bh);
      text(ctx, lab, X(t0) + 4, y - 12 - i * 14, { color: col.ink, size: 11, weight: 600 });
      text(ctx, `${Math.round(s * 1000)} ms`, X(t0) + 6, y + bh / 2, { color: col.panel, size: 12, weight: 700 });
      t0 += s;
    });
    [0, 0.02, 0.04, 0.06].forEach((s) => text(ctx, `${s * 1000} ms`, X(s), y + bh + 14, { color: col.muted, size: 10.5, align: 'center' }));
    text(ctx, foot, L, h - 18, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
