// Class 9 Probability: rolling a die. Each face has theoretical probability 1/6 = 0.167, but a short run is lumpy.
// With hundreds of rolls the bars of relative frequency level out near the 1/6 line.
import { canvas, text, title, row, button, readout, loop } from '../../kit.js';
import { die } from './c9-prob-lib.js';

export default function (host) {
  const cnt = [0, 0, 0, 0, 0, 0];
  let n = 0, last = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Dice rolls with bars of relative frequency for each face and a line at one sixth' });
  const ctl = row(host);
  [[1, 'Roll 1'], [10, 'Roll 10'], [100, 'Roll 100'], [1000, 'Roll 1000']].forEach(([k, l]) => button(ctl, l, () => roll(k)));
  const c2 = row(host);
  const anim = loop(host, () => roll(6), { autoplay: false });
  anim.button(c2);
  button(c2, 'Reset', () => { cnt.fill(0); n = 0; last = 0; sync(); });
  const out = readout(host);
  function roll(k) { for (let i = 0; i < k; i++) { last = 1 + Math.floor(Math.random() * 6); cnt[last - 1]++; n++; } sync(); }
  function sync() { out.innerHTML = n ? `${n} roll${n > 1 ? 's' : ''}. Number of sixes: ${cnt[5]}, so experimental P(6) = ${cnt[5]}/${n} = <b>${(cnt[5] / n).toFixed(3)}</b>. Theoretical P(6) = 1/6 = 0.167. ${n < 60 ? 'Roll more: the bars are still uneven.' : 'The bars are now close to the line.'}` : 'Roll the die. First 10 rolls, then 1000.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Rolling a die: relative frequency of each face', col);
    const gx0 = 36, gx1 = w - 14, gy0 = top + 12, gy1 = h - 32, Y = (v) => gy1 - (v / 0.4) * (gy1 - gy0), bw = (gx1 - gx0) / 6;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; [0, 0.1, 0.2, 0.3, 0.4].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, String(v), gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    die(ctx, w - 40, top + 52, 40, last || 1, col);
    if (!last) text(ctx, 'roll me', w - 40, top + 82, { color: col.muted, size: 10, align: 'center' });
    for (let i = 0; i < 6; i++) { const f = n ? cnt[i] / n : 0, x = gx0 + i * bw; ctx.fillStyle = col.s[i % 8]; ctx.globalAlpha = 0.85; ctx.fillRect(x + 5, Y(Math.min(f, 0.4)), bw - 10, gy1 - Y(Math.min(f, 0.4))); ctx.globalAlpha = 1; text(ctx, String(i + 1), x + bw / 2, gy1 + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); if (n) text(ctx, f.toFixed(2), x + bw / 2, Math.min(Y(f) - 8, gy1 - 6), { color: col.ink, size: 10, align: 'center', halo: col.panel }); }
    ctx.strokeStyle = col.s[2]; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx0, Y(1 / 6)); ctx.lineTo(gx1, Y(1 / 6)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, '1/6 = 0.167', gx1, Y(1 / 6) - 8, { color: col.s[2], size: 10, weight: 700, align: 'right', halo: col.panel });
  };
  sync();
}
