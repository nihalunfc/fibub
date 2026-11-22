// Class 10 Probability: roll a die many times. Each face has theoretical probability 1/6 ≈ 0.167, and the bars show the
// experimental probability (fraction of rolls). Pick an event such as "even number" or "more than 4": its bars turn
// coloured, and the number of favourable outcomes ÷ 6 is the theoretical probability the experiment approaches.
import { canvas, text, title, row, button, choice, readout, loop } from '../../kit.js';

const EV = { none: ['Faces only', []], even: ['Even', [2, 4, 6]], gt4: ['More than 4', [5, 6]], prime: ['Prime', [2, 3, 5]] };
export default function (host) {
  let cnt = [0, 0, 0, 0, 0, 0], N = 0, ev = 'even', speed = 20, acc = 0, last = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Bars of the fraction of rolls showing each face of a die, next to the theoretical 1/6' });
  const ctl = row(host);
  const anim = loop(host, (dt) => { acc += dt * speed; let k = Math.floor(acc); acc -= k; while (k-- > 0 && N < 6000) roll(); if (N >= 6000) anim.pause(); say(); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  button(ctl, 'Roll once', () => { anim.pause(); roll(); say(); cv.redraw(); });
  button(ctl, 'Reset', () => { cnt = [0, 0, 0, 0, 0, 0]; N = 0; last = 0; say(); cv.redraw(); });
  choice(ctl, 'Event', Object.entries(EV).map(([k, v]) => [k, v[0]]), ev, (v) => { ev = v; say(); cv.redraw(); });
  choice(ctl, 'Speed', [[5, 'Slow'], [60, 'Fast'], [600, 'Very fast']], speed, (v) => { speed = v; });
  const out = readout(host);
  function roll() { last = 1 + Math.floor(Math.random() * 6); cnt[last - 1]++; N++; }
  function say() {
    const fav = EV[ev][1], k = fav.reduce((s, f) => s + cnt[f - 1], 0);
    out.innerHTML = fav.length ? `Event “${EV[ev][0].toLowerCase()}” = {${fav.join(', ')}}: theoretical P = ${fav.length}/6 = <b>${(fav.length / 6).toFixed(3)}</b>. ` + (N ? `Experiment: ${k}/${N} = <b>${(k / N).toFixed(3)}</b> after ${N} rolls.` : 'Roll the die to test it.') : `Each face has theoretical probability 1/6 = 0.167. ${N ? `After ${N} rolls the bars are close, never exactly equal.` : 'Roll the die to see.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fraction of rolls for each face (N = ' + N + ')', col), fav = EV[ev][1];
    const L = 36, R = w - 12, B = h - 42, T = top + 16, bw = (R - L) / 6, ymax = 0.4, Y = (v) => B - (v / ymax) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let g = 0; g <= 0.4001; g += 0.1) { ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(R, Y(g)); ctx.stroke(); text(ctx, g.toFixed(1), L - 6, Y(g), { color: col.muted, size: 10, align: 'right' }); }
    for (let f = 1; f <= 6; f++) {
      const x = L + (f - 1) * bw, v = N ? cnt[f - 1] / N : 0, on = fav.includes(f);
      ctx.fillStyle = on ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.8; ctx.fillRect(x + 5, Y(v), bw - 10, B - Y(v)); ctx.globalAlpha = 1;
      text(ctx, String(f), x + bw / 2, B + 13, { color: col.ink, size: 13, weight: 700, align: 'center' });
      if (N) text(ctx, v.toFixed(2), x + bw / 2, Y(v) - 8, { color: col.ink, size: 10, align: 'center' });
      if (f === last) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x + 3, B + 2, bw - 6, 22); }
    }
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(L, Y(1 / 6)); ctx.lineTo(R, Y(1 / 6)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'theory 1/6', R - 2, Y(1 / 6) - 9, { color: col.s[3], size: 11, weight: 700, align: 'right' });
  };
  say(); cv.redraw();
}
