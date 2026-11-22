// 10.2 Embeddings: king − man + woman lands on queen. Steps: words as points, the "royal" arrow from man to
// king, the same arrow moved to start at woman, the nearest word, and the parallel man → woman arrow.
// Made-up 2D map (real embeddings have hundreds of numbers), same points as the lesson's worked example.
import { canvas, title, axes, dot, text, arrow, line, loop, calm, ease, lerp } from '../../kit.js';

const W = { king: [1, 2.8], man: [1, 1.4], woman: [2.2, 1.4], queen: [2.2, 2.8], apple: [3.3, 0.5], banana: [3.9, 1.1] };
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 260, label: 'Words as points on a map: the arrow from man to king, moved to woman, lands on queen' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.9); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 4.5], y: [0, 3.6], xlabel: 'number 1', ylabel: 'number 2', l: 40, t: 42 });
    const P = (p) => [X(p[0]), Y(p[1])], e = ease(k);
    for (const [name, p] of Object.entries(W)) {
      const hot = step >= 3 && name === 'queen';
      dot(ctx, ...P(p), hot ? 7 : 5, hot ? col.s[2] : col.s[0], hot ? col.ink : undefined);
      text(ctx, name, P(p)[0] + 8, P(p)[1] - 10, { color: col.ink, size: 12, weight: 600, halo: col.panel });
    }
    if (step >= 1) {
      const t = step === 1 ? e : 1;
      arrow(ctx, ...P(W.man), ...P([1, lerp(1.4, 2.8, t)]), col.s[1], 2.5, 9);
      text(ctx, 'royal step (0, +1.4)', X(1), Y(1.4) + 20, { color: col.s[1], size: 11.5, weight: 600, align: 'center', halo: col.panel });
    }
    if (step >= 2) {
      const t = step === 2 ? e : 1;
      arrow(ctx, ...P(W.woman), ...P([2.2, lerp(1.4, 2.8, t)]), col.s[1], 2.5, 9);
      text(ctx, 'woman + royal step', X(2.2) + 8, Y(2.1), { color: col.s[1], size: 11.5, weight: 600, halo: col.panel });
    }
    if (step >= 3) {
      ctx.beginPath(); ctx.arc(...P(W.queen), 16, 0, Math.PI * 2); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
      if (step === 3) text(ctx, 'lands on (2.2, 2.8): queen', X(2.0), Y(3.45), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    }
    if (step >= 4) {
      line(ctx, [P(W.man), P(W.woman)], col.s[3], 2, [5, 4]);
      line(ctx, [P(W.king), P(W.queen)], col.s[3], 2, [5, 4]);
      text(ctx, 'male → female: the same arrow twice', X(1.8), Y(3.45), { color: col.s[3], size: 11.5, weight: 600, align: 'center', halo: col.panel });
    }
    title(ctx, ['Words as points', 'man → king', 'Move the arrow to woman', 'Nearest word', 'Relations are directions'][step], col);
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
