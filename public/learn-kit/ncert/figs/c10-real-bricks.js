// Class 10 Real Numbers: the Fundamental Theorem of Arithmetic. Every number above 1 is a product of prime "bricks", and the
// set of bricks is the same however you order them. The running product under each brick always ends at n.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

const fac = (n) => { const l = []; for (let p = 2; p * p <= n; p++) while (n % p === 0) { l.push(p); n /= p; } if (n > 1) l.push(n); return l; };
export default function (host) {
  let n = 360, ord = [];
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'Prime factor bricks of a number in any order with running products' });
  const ctl = row(host);
  slider(ctl, { label: 'Number n', min: 2, max: 500, step: 1, value: n, fmt: String, oninput: (v) => { n = v; ord = fac(n); upd(); } });
  button(ctl, 'Shuffle the bricks', () => { for (let i = ord.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; } upd(); });
  const out = readout(host);
  ord = fac(n);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${n} as prime bricks`, col) + 24, bw = Math.min(44, (w - 20) / Math.min(ord.length, 8) - 6), per = Math.max(1, Math.floor((w - 12) / (bw + 6)));
    const primes = [...new Set(ord)].sort((a, b) => a - b); let run = 1;
    ord.forEach((p, i) => { run *= p; const x = 6 + (i % per) * (bw + 6), y = top + Math.floor(i / per) * 74, tone = col.s[primes.indexOf(p) % 8];
      ctx.fillStyle = col.panel; ctx.strokeStyle = tone; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, bw, 34, 6); ctx.fill(); ctx.stroke();
      text(ctx, String(p), x + bw / 2, y + 17, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, '=' + run, x + bw / 2, y + 48, { color: col.muted, size: 11, align: 'center' }); });
  };
  function upd() { out.innerHTML = ord.length === 1 ? `<b>${n}</b> is prime: one brick, nothing to break.` : `<b>${n} = ${ord.join(' × ')}</b>. Shuffle as you like: the same bricks, the same ${n}. (Under each brick: the product so far.)`; cv.redraw(); }
  upd();
}
