// Class 10 Probability: experimental probability settles down to the theoretical one. Flip a fair coin again and again
// and plot the fraction of heads after each flip. Early on it jumps about; as the number of trials grows it hugs
// the theoretical probability 1/2. Start new runs to see that every run wanders differently but ends up in the same place.
import { canvas, axes, line, text, title, row, button, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let run = { n: 0, h: 0, fr: [], last: '' }, old = [], speed = 10, acc = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A graph of the fraction of heads in coin flips settling near one half' });
  const ctl = row(host);
  const anim = loop(host, (dt) => { acc += dt * speed; let k = Math.floor(acc); acc -= k; while (k-- > 0 && run.n < 2000) flip(); if (run.n >= 2000) anim.pause(); say(); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  button(ctl, 'Flip once', () => { anim.pause(); flip(); say(); cv.redraw(); });
  button(ctl, 'New run', () => { if (run.n) old.push(run.fr); if (old.length > 4) old.shift(); run = { n: 0, h: 0, fr: [], last: '' }; say(); cv.redraw(); });
  choice(ctl, 'Speed', [[3, 'Slow'], [30, 'Fast'], [300, 'Very fast']], speed, (v) => { speed = v; });
  const out = readout(host);
  function flip() { const head = Math.random() < 0.5; run.n++; if (head) run.h++; run.last = head ? 'H' : 'T'; run.fr.push(run.h / run.n); }
  function say() {
    out.innerHTML = run.n ? `After <b>${run.n}</b> flips: ${run.h} heads. Experimental P(head) = ${run.h}/${run.n} = <b>${(run.h / run.n).toFixed(3)}</b>. Theoretical P(head) = 1/2 = 0.5. Difference ${Math.abs(run.h / run.n - 0.5).toFixed(3)}.` : 'Press Play or Flip once. Theoretical P(head) = 1/2 = 0.5.';
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fraction of heads after n flips', col);
    const xmax = [20, 50, 100, 200, 500, 1000, 2000].find((v) => v >= run.n) ?? 2000;
    const A = axes(ctx, w, h - 44, col, { x: [0, xmax], y: [0, 1], t: top + 28, b: 34, l: 38, xlabel: 'number of flips', yt: [0, 0.25, 0.5, 0.75, 1] });
    ctx.save(); A.clip();
    old.forEach((fr) => line(ctx, fr.map((v, i) => [A.X(i + 1), A.Y(v)]), col.line, 1.5));
    line(ctx, run.fr.map((v, i) => [A.X(i + 1), A.Y(v)]), col.s[0], 2.5);
    ctx.restore();
    line(ctx, [[A.L, A.Y(0.5)], [A.R, A.Y(0.5)]], col.s[3], 2, [6, 4]);
    text(ctx, 'theory 1/2', A.R - 4, A.Y(0.5) - 9, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    // the coin
    const cx = w - 34, cy = top + 10;
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx - 6, h - 20, 14, 0, 7); ctx.fill(); ctx.stroke();
    text(ctx, run.last || '?', cx - 6, h - 20, { color: col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, run.n ? `${run.h} H, ${run.n - run.h} T` : 'no flips yet', 12, h - 20, { color: col.muted, size: 11.5 });
  };
  say(); cv.redraw();
}
