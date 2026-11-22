// Class 9 Probability: a bag of coloured marbles (orange, green and blue). Theoretical probability of a colour = its marbles / all marbles.
// Drawing with replacement many times gives experimental probabilities that settle near those values.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  const K = [4, 3, 3];
  let draws = [0, 0, 0], last = -1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A bag of orange green and blue marbles with bars comparing theoretical and experimental probability' });
  const ctl = row(host);
  ['Orange', 'Green', 'Blue'].forEach((nm, i) => slider(ctl, { label: nm + ' marbles', min: 0, max: 10, step: 1, value: K[i], fmt: (v) => String(v), oninput: (v) => { K[i] = v; draws = [0, 0, 0]; last = -1; sync(); } }));
  const c2 = row(host);
  [[1, 'Draw 1'], [10, 'Draw 10'], [100, 'Draw 100'], [1000, 'Draw 1000']].forEach(([k, l]) => button(c2, l, () => draw(k)));
  button(c2, 'Reset', () => { draws = [0, 0, 0]; last = -1; sync(); });
  const out = readout(host);
  const tot = () => K[0] + K[1] + K[2];
  function draw(k) { const T = tot(); if (!T) return; for (let i = 0; i < k; i++) { let r = Math.floor(Math.random() * T), c = 0; while (r >= K[c]) { r -= K[c]; c++; } draws[c]++; last = c; } sync(); }
  function sync() {
    const T = tot(), n = draws[0] + draws[1] + draws[2];
    out.innerHTML = T ? `${T} marbles in the bag, so P(orange) = ${K[0]}/${T} = <b>${(K[0] / T).toFixed(3)}</b>. ` + (n ? `After ${n} draws (the marble goes back each time): orange came ${draws[0]} times, experimental P(orange) = <b>${(draws[0] / n).toFixed(3)}</b>.` : 'Draw some marbles (each one goes back into the bag).') + ` P(not orange) = ${(1 - K[0] / T).toFixed(3)}.` : 'The bag is empty: add some marbles.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Draw a marble from the bag', col), T = tot(), n = draws[0] + draws[1] + draws[2], names = ['Orange', 'Green', 'Blue'], cols = [col.s[1], col.s[2], col.s[0]];
    // the bag: marbles as dots
    const bx = 14, bw = w - 28, bh = (h - top) * 0.3; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(bx, top + 8, bw, bh, 14); ctx.stroke();
    let idx = 0; const per = Math.max(1, Math.ceil(Math.sqrt(T || 1) * 2)), r = Math.min(10, (bh - 14) / (Math.ceil(T / per) * 2.3 + 0.5), (bw - 20) / (per * 2.3));
    for (let c = 0; c < 3; c++) for (let q = 0; q < K[c]; q++) { const row = Math.floor(idx / per), cc = idx % per; ctx.fillStyle = cols[c]; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bx + 16 + cc * r * 2.3 + r, top + 18 + row * r * 2.3 + r, r, 0, 7); ctx.fill(); ctx.stroke(); idx++; }
    if (last >= 0) text(ctx, 'last: ' + names[last], w - 20, top + 8 + bh + 12, { color: cols[last], size: 12, weight: 700, align: 'right' });
    // bars: theoretical (outline) and experimental (filled)
    const gy0 = top + 8 + bh + 30, gy1 = h - 40, bwid = (w - 60) / 3;
    text(ctx, 'outline = theory, solid = experiment', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
    for (let c = 0; c < 3; c++) {
      const x = 30 + c * bwid + 8, wd = bwid - 16, th = T ? K[c] / T : 0, ex = n ? draws[c] / n : 0;
      ctx.fillStyle = cols[c]; ctx.globalAlpha = 0.85; ctx.fillRect(x, gy1 - ex * (gy1 - gy0), wd, ex * (gy1 - gy0)); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.strokeRect(x, gy1 - th * (gy1 - gy0), wd, th * (gy1 - gy0)); ctx.setLineDash([]);
      text(ctx, names[c], x + wd / 2, gy1 + 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, th.toFixed(2), x + wd / 2, gy1 - th * (gy1 - gy0) - 8, { color: col.ink, size: 10, align: 'center', halo: col.panel });
    }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(26, gy0); ctx.lineTo(26, gy1); ctx.lineTo(w - 14, gy1); ctx.stroke();
  };
  sync();
}
