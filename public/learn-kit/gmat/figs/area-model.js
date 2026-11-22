// 1.4 Multiplying in your head: the area model splits 47 × 23 into four easy rectangles.
import { canvas, text, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 230, label: 'Area model for multiplying two numbers' });
  let x = 47, y = 23;
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'First', min: 11, max: 99, step: 1, value: x, fmt: f, oninput: (v) => { x = Math.round(v); go(); } });
  slider(ctl, { label: 'Second', min: 11, max: 99, step: 1, value: y, fmt: f, oninput: (v) => { y = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const [a, b, c, d] = [x - (x % 10), x % 10, y - (y % 10), y % 10]; out.innerHTML = `${x} × ${y} = ${a}×${c} + ${a}×${d} + ${b}×${c} + ${b}×${d} = ${a * c} + ${a * d} + ${b * c} + ${b * d} = <b>${x * y}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const a = x - (x % 10), b = x % 10, c = y - (y % 10), d = y % 10, S = Math.min((w - 80) / x, (h - 60) / y), L = 50, T = 34;
    const R = [[0, 0, a, c, a * c, 0], [a, 0, b, c, b * c, 1], [0, c, a, d, a * d, 2], [a, c, b, d, b * d, 3]];
    for (const [px, py, pw, ph, v, k] of R) {
      if (!pw || !ph) continue;
      ctx.fillStyle = col.s[k]; ctx.globalAlpha = 0.85; ctx.fillRect(L + px * S, T + py * S, pw * S - 1, ph * S - 1); ctx.globalAlpha = 1;
      if (pw * S > 26 && ph * S > 14) text(ctx, String(v), L + (px + pw / 2) * S, T + (py + ph / 2) * S, { color: col.panel, size: 12, weight: 700, align: 'center' });
    }
    text(ctx, String(a), L + (a / 2) * S, T - 9, { color: col.ink, size: 11, align: 'center' }); if (b) text(ctx, String(b), L + (a + b / 2) * S, T - 9, { color: col.ink, size: 11, align: 'center' });
    text(ctx, String(c), L - 14, T + (c / 2) * S, { color: col.ink, size: 11, align: 'center' }); if (d) text(ctx, String(d), L - 14, T + (c + d / 2) * S, { color: col.ink, size: 11, align: 'center' });
    title(ctx, 'Split each number into tens and ones', col, 12);
  };
  go();
}
