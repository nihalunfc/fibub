// Class 10 Probability: complementary events. A bag holds 20 marbles and k of them are red. P(red) = k/20 and P(not red) =
// (20 - k)/20. Together they use up the whole bar of length 1: P(E) + P(not E) = 1, so P(not E) = 1 - P(E).
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let k = 6, pick = -1, tally = [0, 0];
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A bag of twenty marbles and a bar showing the probability of red and not red adding to one' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Red marbles', min: 0, max: 20, step: 1, value: k, oninput: (v) => { k = v; pick = -1; tally = [0, 0]; say(); } });
  button(ctl, 'Pick one marble', () => { pick = Math.floor(Math.random() * 20); tally[pick < k ? 0 : 1]++; say(); });
  const out = readout(host);
  function say() {
    out.innerHTML = `P(red) = ${k}/20 = <b>${(k / 20).toFixed(2)}</b>. P(not red) = 1 − ${k}/20 = ${20 - k}/20 = <b>${((20 - k) / 20).toFixed(2)}</b>.` + (k === 0 ? ' Red is impossible: probability 0.' : k === 20 ? ' Red is certain: probability 1.' : '') + (pick >= 0 ? ` You picked a ${pick < k ? 'red' : 'non-red'} marble (red ${tally[0]}, not red ${tally[1]} so far).` : '');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Event “red” and its complement “not red”', col), bw = Math.min(w - 40, 300), bx = (w - bw) / 2, by = top + 8, bh = h * 0.5, r = Math.min(bw / 10, bh / 8) * 0.8;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 14); ctx.stroke();
    for (let i = 0; i < 20; i++) {
      const x = bx + bw * (0.12 + 0.19 * (i % 5)), y = by + bh * (0.14 + 0.24 * Math.floor(i / 5));
      ctx.fillStyle = i < k ? col.s[1] : col.s[0]; ctx.beginPath(); ctx.arc(x + r * 0.4, y + r * 0.4, r, 0, 7); ctx.fill();
      if (i === pick) { ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke(); }
    }
    const y = by + bh + 22, p = k / 20, W = w - 36;
    ctx.fillStyle = col.s[1]; ctx.fillRect(18, y, W * p, 26); ctx.fillStyle = col.s[0]; ctx.fillRect(18 + W * p, y, W * (1 - p), 26);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(18, y, W, 26);
    if (p > 0.12) text(ctx, 'P(red) = ' + p.toFixed(2), 24, y + 13, { color: col.panel, size: 11.5, weight: 700 });
    if (p < 0.88) text(ctx, 'P(not red) = ' + (1 - p).toFixed(2), w - 24, y + 13, { color: col.panel, size: 11.5, weight: 700, align: 'right' });
    text(ctx, '0', 18, y + 40, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'total = 1', w / 2, y + 40, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, '1', 18 + W, y + 40, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
