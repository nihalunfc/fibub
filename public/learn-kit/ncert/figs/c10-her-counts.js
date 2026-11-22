// Class 10 Heredity: why Mendel counted so many plants. Each seed from a Tt × Tt cross is tall with probability 3/4. With a few
// plants the counts wander far from 3 : 1; with many they settle close to it. Press "Grow plants" for a fresh random batch.
import { canvas, text, title, line, row, slider, button, readout, rng } from '../../kit.js';

export default function (host) {
  let N = 40, seed = 5, tall = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'Bar chart of tall and short plants grown from Tt by Tt, compared with the 3 to 1 ratio' });
  const ctl = row(host);
  slider(ctl, { label: 'Plants grown', min: 4, max: 2000, step: 1, value: N, log: true, fmt: (v) => String(Math.round(v)), oninput: (v) => { N = Math.round(v); grow(); } });
  button(ctl, 'Grow plants', () => { seed++; grow(); });
  const out = readout(host);
  function grow() { const R = rng(seed * 7919 + N); tall = 0; for (let i = 0; i < N; i++) { const a = R() < 0.5, b = R() < 0.5; if (a || b) tall++; } const s = N - tall; out.textContent = `${tall} tall and ${s} short: ratio ${(tall / Math.max(1, s)).toFixed(2)} : 1 (Mendel's 3 : 1 would be ${(N * 0.75).toFixed(0)} tall and ${(N * 0.25).toFixed(0)} short). The more plants you count, the closer you get.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Counting offspring of Tt × Tt', col) + 12, gx = 36, gy = top + 8, gw = w - gx - 16, gh = h - gy - 50, s = N - tall;
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
    const bw = gw * 0.28, Y = (v) => gy + gh - (v / N) * gh * 0.95;
    [[tall, 0.2, col.s[2], 'tall'], [s, 0.6, col.s[3], 'short']].forEach(([v, f, c, l]) => { ctx.fillStyle = c; ctx.fillRect(gx + gw * f, Y(v), bw, gy + gh - Y(v)); text(ctx, String(v), gx + gw * f + bw / 2, Y(v) - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, l, gx + gw * f + bw / 2, gy + gh + 12, { color: col.ink, size: 11, align: 'center' }); });
    [[0.75, 0.2], [0.25, 0.6]].forEach(([e, f]) => { line(ctx, [[gx + gw * f - 6, Y(N * e)], [gx + gw * f + bw + 6, Y(N * e)]], col.ink, 2, [5, 3]); });
    text(ctx, 'dashed line = exactly 3 : 1', w / 2, h - 28, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, `${N} plants`, w - 10, gy + 8, { color: col.ink, size: 11, weight: 700, align: 'right' });
  };
  grow();
}
