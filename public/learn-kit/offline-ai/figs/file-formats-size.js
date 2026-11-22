// 7.5 File formats: one 12B model packed three ways. Bars for the 16-bit safetensors release (24 GB), Q8_0 GGUF
// (8.5 bits, 12.75 GB) and Q4_K_M GGUF (about 4.8 bits, 7.2 GB), then a 16 GB laptop's memory line to show which fit.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const BARS = [
  ['16-bit safetensors', 16, 'Python tools, vLLM, converters'],
  ['Q8_0 GGUF', 8.5, 'llama.cpp, Ollama, LM Studio'],
  ['Q4_K_M GGUF', 4.8, 'llama.cpp, Ollama, LM Studio'],
];
const P = 12;
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 250, label: 'Bars for the file size of one 12B model in three formats, against a 16 GB laptop' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), L = 12, R = w - 64, max = 26, bh = 22;
    const X = (gb) => L + ((R - L) * gb) / max;
    title(ctx, step < 3 ? 'One 12B model, packed three ways' : 'Which files fit a 16 GB laptop?', col);
    BARS.forEach(([name, bits, eng], i) => {
      if (i > step) return;
      const gb = (P * bits) / 8, y = 46 + i * 62, t = i === step && step < 3 ? e : 1;
      text(ctx, `${name}: ${P} × ${bits} ÷ 8`, L, y, { color: col.ink, size: 12, weight: 600 });
      ctx.fillStyle = col.soft; ctx.fillRect(L, y + 10, R - L, bh);
      const fits = gb * 1.2 <= 11; // about 11 GB usable on a 16 GB laptop
      ctx.fillStyle = step === 3 ? (fits ? col.good || col.s[2] : col.bad || col.s[5]) : col.s[i];
      ctx.fillRect(L, y + 10, (X(gb) - L) * t, bh);
      text(ctx, `${(+gb.toFixed(2))} GB`, X(gb) * t + (1 - t) * L + 6, y + 10 + bh / 2, { color: col.ink, size: 12, weight: 700, halo: col.panel });
      text(ctx, `read by ${eng}`, L, y + bh + 20, { color: col.muted, size: 10.5 });
    });
    if (step === 3) {
      const x = X(11 / 1.2);
      BARS.forEach((_, i) => { const y = 46 + i * 62 + 10; ctx.save(); ctx.strokeStyle = col.ink; ctx.setLineDash([4, 3]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + bh + 4); ctx.stroke(); ctx.restore(); });
      text(ctx, 'dashed line: largest file that fits, 11 GB ÷ 1.2 ≈ 9.2 GB', 12, h - 14, { color: col.ink, size: 11.5, weight: 600 });
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
