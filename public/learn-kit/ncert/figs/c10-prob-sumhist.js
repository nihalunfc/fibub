// Class 10 Probability: the sum of two dice. There is 1 way to get 2, 2 ways to get 3, ... 6 ways to get 7, ... 1 way to
// get 12, so P(sum = 7) = 6/36 is the largest. Roll two dice many times: the experimental bars climb towards the
// triangle of theoretical probabilities (outlined).
import { canvas, text, title, row, button, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let cnt = Array(13).fill(0), N = 0, speed = 30, acc = 0, theory = true, last = [0, 0];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Bars of the experimental probability of each sum of two dice with the theoretical triangle outlined' });
  const ctl = row(host);
  const anim = loop(host, (dt) => { acc += dt * speed; let k = Math.floor(acc); acc -= k; while (k-- > 0 && N < 20000) roll(); if (N >= 20000) anim.pause(); say(); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  button(ctl, 'Roll once', () => { anim.pause(); roll(); say(); cv.redraw(); });
  button(ctl, 'Reset', () => { cnt = Array(13).fill(0); N = 0; last = [0, 0]; say(); cv.redraw(); });
  choice(ctl, 'Theory', [[true, 'Show'], [false, 'Hide']], theory, (v) => { theory = v; cv.redraw(); });
  choice(ctl, 'Speed', [[5, 'Slow'], [100, 'Fast'], [1000, 'Very fast']], speed, (v) => { speed = v; });
  const out = readout(host);
  function roll() { const a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6); last = [a, b]; cnt[a + b]++; N++; }
  function say() { out.innerHTML = N ? `${N} throws. Sum 7: experiment ${(cnt[7] / N).toFixed(3)}, theory 6/36 = 0.167. Last throw: ${last[0]} + ${last[1]} = ${last[0] + last[1]}.` : 'Theory: P(sum = 7) = 6/36 = 1/6, P(sum = 2) = 1/36. Press Play to test it.'; }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sum of two dice (N = ' + N + ')', col), L = 34, R = w - 10, B = h - 30, T = top + 14, bw = (R - L) / 11, ym = 0.25, Y = (v) => B - (v / ym) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let g = 0; g <= 0.2501; g += 0.05) { ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(R, Y(g)); ctx.stroke(); text(ctx, g.toFixed(2), L - 5, Y(g), { color: col.muted, size: 10, align: 'right' }); }
    for (let s = 2; s <= 12; s++) {
      const x = L + (s - 2) * bw, v = N ? cnt[s] / N : 0, th = (6 - Math.abs(s - 7)) / 36;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.75; ctx.fillRect(x + 2, Y(v), bw - 4, B - Y(v)); ctx.globalAlpha = 1;
      if (theory) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.strokeRect(x + 2, Y(th), bw - 4, B - Y(th)); }
      text(ctx, String(s), x + bw / 2, B + 12, { color: s === last[0] + last[1] && N ? col.s[1] : col.ink, size: 11.5, weight: 700, align: 'center' });
    }
  };
  say(); cv.redraw();
}
