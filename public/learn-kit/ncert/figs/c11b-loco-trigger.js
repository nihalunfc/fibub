// Class 11 Biology, Locomotion (step player): from nerve signal to muscle contraction. A motor neuron releases acetylcholine at the neuromuscular junction, an action potential runs over the
// sarcolemma into the muscle fibre, the sarcoplasmic reticulum releases Ca2+, Ca2+ binds troponin, tropomyosin moves aside and cross-bridges form. When the signal stops, Ca2+ is pumped back and the muscle relaxes.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 290, label: 'Flow chart from motor neuron signal through calcium release to cross-bridge formation and relaxation' });
  const B = [['Motor neuron fires', 'signal reaches the muscle fibre'], ['Acetylcholine released', 'at the neuromuscular junction'], ['Action potential in the sarcolemma', 'spreads into the fibre'], ['Sarcoplasmic reticulum releases Ca²⁺', 'calcium floods the fibre'], ['Ca²⁺ binds troponin', 'tropomyosin slides away from actin'], ['Cross-bridges form and pull', 'the sarcomere shortens (uses ATP)'], ['Signal stops: Ca²⁺ pumped back', 'sites covered, muscle relaxes']];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'How a muscle is told to contract', col), bh = (h - t0 - 20) / 7, bw = w - 40;
    B.forEach(([a, b], i) => {
      const y = t0 + 10 + i * bh, on = i <= step, cur = i === step;
      ctx.globalAlpha = on ? 1 : 0.45; ctx.fillStyle = cur ? col.s[3] : col.soft; ctx.fillRect(20, y, bw, bh - 12); ctx.strokeStyle = on ? col.s[3] : col.line; ctx.lineWidth = cur ? 2.5 : 1.5; ctx.strokeRect(20, y, bw, bh - 12);
      text(ctx, a, w / 2, y + (bh - 12) / 2 - 6, { color: cur ? col.bg : col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, b, w / 2, y + (bh - 12) / 2 + 8, { color: cur ? col.bg : col.muted, size: 10, align: 'center' });
      ctx.globalAlpha = 1;
      if (i < 6) arrow(ctx, w / 2, y + bh - 12, w / 2, y + bh - 1, on && i < step ? col.s[3] : col.line, 2, 5);
    });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 6); cv.redraw(); } };
}
