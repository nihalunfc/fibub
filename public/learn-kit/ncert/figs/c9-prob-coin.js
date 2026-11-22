// Class 9 Probability: tossing a coin many times. The relative frequency of heads (heads / tosses) jumps about at first
// and settles near the true probability (1/2 for a fair coin, 0.7 for the loaded coin) as the tosses pile up.
import { canvas, text, title, row, button, choice, readout } from '../../kit.js';

export default function (host) {
  let H = 0, T = 0, last = null, hist = [], bias = 0.5;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Coin tosses with counts of heads and tails and a graph of the relative frequency of heads' });
  const ctl = row(host);
  [[1, 'Toss 1'], [10, 'Toss 10'], [100, 'Toss 100'], [1000, 'Toss 1000']].forEach(([k, l]) => button(ctl, l, () => toss(k)));
  const c2 = row(host);
  choice(c2, 'Coin', [['0.5', 'Fair'], ['0.7', 'Loaded']], '0.5', (v) => { bias = +v; reset(); });
  button(c2, 'Reset', () => reset());
  const out = readout(host);
  function reset() { H = T = 0; last = null; hist = []; sync(); }
  function toss(k) { for (let i = 0; i < k; i++) { if (Math.random() < bias) { H++; last = 'H'; } else { T++; last = 'T'; } hist.push(H / (H + T)); } sync(); }
  function sync() {
    const n = H + T;
    out.innerHTML = n ? `${n} toss${n > 1 ? 'es' : ''}: ${H} heads, ${T} tails. Experimental probability of heads = ${H}/${n} = <b>${(H / n).toFixed(3)}</b>. ${bias === 0.5 ? 'The true value for a fair coin is 0.5.' : 'This coin is loaded: its true value is 0.7, which you can only discover by tossing many times.'}` : 'Press a Toss button. Try Toss 1 a few times, then Toss 1000.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Relative frequency of heads settles down', col), n = H + T;
    // coin and bars
    const cx = 36, cy = top + 28; ctx.fillStyle = last ? (last === 'H' ? col.s[3] : col.s[1]) : col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill(); ctx.stroke();
    text(ctx, last || '?', cx, cy, { color: col.ink, size: 18, weight: 700, align: 'center' });
    const bx = 74, bw = w - bx - 14, mx = Math.max(1, H, T);
    [['Heads', H, col.s[3]], ['Tails', T, col.s[1]]].forEach(([nm, v, c], i) => { const y = top + 10 + i * 26; ctx.fillStyle = c; ctx.globalAlpha = 0.8; ctx.fillRect(bx, y, (v / mx) * bw * 0.82, 18); ctx.globalAlpha = 1; text(ctx, nm + ' ' + v, bx + 4, y + 9, { color: col.ink, size: 11, weight: 700, halo: col.panel }); });
    // graph
    const gx0 = 38, gx1 = w - 14, gy0 = top + 76, gy1 = h - 30, N = Math.max(10, n), X = (i) => gx0 + (i / N) * (gx1 - gx0), Y = (v) => gy1 - v * (gy1 - gy0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; [0, 0.5, 1].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, String(v), gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, Y(bias)); ctx.lineTo(gx1, Y(bias)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'true value ' + bias, gx1, Y(bias) - 9, { color: col.s[3], size: 10, weight: 700, align: 'right', halo: col.panel });
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.2; ctx.beginPath(); const step = Math.max(1, Math.floor(hist.length / 400)); hist.forEach((v, i) => { if (i % step && i !== hist.length - 1) return; const x = X(i + 1), y = Y(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.stroke();
    text(ctx, 'number of tosses →  ' + N, gx1, gy1 + 14, { color: col.muted, size: 10, align: 'right' });
  };
  sync();
}
