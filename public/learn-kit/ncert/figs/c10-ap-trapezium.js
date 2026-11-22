// Class 10 Arithmetic Progressions: the sum of n terms as an area. Build a staircase of unit squares whose column heights are the
// terms a, a + d, ... l. Turn a second copy upside down and put it on top: the two fit into a rectangle n wide and
// (a + l) tall. So 2S = n(a + l), or S = n(a + l)/2. Slide a, d, n and toggle the flipped copy.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let a = 2, d = 2, n = 6, show = 'one';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A staircase of squares and an upside-down copy fitting into a rectangle' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: 1, max: 8, step: 1, value: a, oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: 'd', min: 0, max: 4, step: 1, value: d, oninput: (v) => { d = v; go(); } });
  slider(ctl, { label: 'n', min: 2, max: 9, step: 1, value: n, oninput: (v) => { n = v; go(); } });
  choice(ctl, 'Show', [['one', 'one staircase'], ['two', 'add flipped copy']], show, (v) => { show = v; go(); });
  const out = readout(host);
  const go = () => {
    const l = a + (n - 1) * d, S = (n * (a + l)) / 2;
    out.innerHTML = show === 'one' ? `Last term l = ${a} + ${n - 1} × ${d} = ${l}. Count the squares: S = <b>${S}</b>.` : `Rectangle: ${n} wide, a + l = ${a} + ${l} = ${a + l} tall, area ${n * (a + l)} = 2S. So S = ${n * (a + l)} ÷ 2 = <b>${S}</b> = n(a + l)/2.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const l = a + (n - 1) * d, tall = show === 'two' ? a + l : l, top = title(ctx, show === 'two' ? 'Two staircases make a rectangle' : 'Sum of an AP = number of squares', col) + 16;
    const u = Math.min((w - 40) / n, (h - top - 40) / tall), L = (w - n * u) / 2, B = top + tall * u + 4;
    for (let i = 0; i < n; i++) {
      const t = a + i * d, x = L + i * u;
      for (let r = 0; r < t; r++) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(x + 0.5, B - (r + 1) * u + 0.5, u - 1, u - 1); }
      ctx.globalAlpha = 1;
      if (show === 'two') { const t2 = a + (n - 1 - i) * d; for (let r = 0; r < t2; r++) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.85; ctx.fillRect(x + 0.5, B - (t + r + 1) * u + 0.5, u - 1, u - 1); } ctx.globalAlpha = 1; }
    }
    if (u >= 14) for (let i = 0; i < n; i++) text(ctx, String(a + i * d), L + i * u + u / 2, B + 12, { color: col.muted, size: Math.min(11, u / 1.6), align: 'center' });
    if (show === 'two') { text(ctx, `n = ${n}`, w / 2, B + 26, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, `a + l = ${a + l}`, L - 4, B - (tall * u) / 2, { color: col.ink, size: 11.5, weight: 700, align: 'right' }); }
  };
  go();
}
