// Class 8 Power Play: the chessboard and the grains of rice. One grain on square 1, then double on each next square:
// square k holds 2^(k-1) grains and the first k squares hold 2^k - 1 in all. Slide along the board to see it explode.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let k = 10;
  const cv = canvas(host, { aspect: 1, max: 440, min: 290, label: 'A chessboard whose squares hold doubling numbers of rice grains' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Square', min: 1, max: 64, step: 1, value: k, fmt: (v) => Math.round(v), oninput: (v) => { k = Math.round(v); sync(); } });
  const big = (x) => (x < 1e6 ? x.toLocaleString('en-IN') : x.toExponential(2).replace('e+', ' × 10^'));
  function sync() {
    const one = 2 ** (k - 1), all = 2 ** k - 1, tonnes = all * 0.025 / 1e6;
    out.innerHTML = `Square ${k}: 2<sup>${k - 1}</sup> = <b>${big(one)}</b> grains. All squares up to ${k}: <b>${big(all)}</b> grains, about <b>${tonnes < 1 ? tonnes.toFixed(5) : tonnes < 1e6 ? tonnes.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : tonnes.toExponential(1)}</b> tonnes of rice (a grain is 0.025 g).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Rice on a chessboard: 1, 2, 4, 8 …', col), s = Math.min((w - 20) / 8, (h - top - 14) / 8), x0 = (w - 8 * s) / 2, y0 = top + 8;
    for (let i = 0; i < 64; i++) {
      const r = Math.floor(i / 8), c = r % 2 ? 7 - (i % 8) : i % 8, x = x0 + c * s, y = y0 + (7 - r) * s, on = i < k;
      ctx.fillStyle = on ? col.s[0] : col.soft; ctx.globalAlpha = on ? 0.25 + 0.75 * ((i + 1) / 64) ** 0.5 : 1; ctx.fillRect(x, y, s - 1, s - 1); ctx.globalAlpha = 1;
      if (i === k - 1) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, s - 4, s - 4); }
      if (i < 12 || i === k - 1) text(ctx, i < 9 ? String(2 ** i) : '2^' + i, x + s / 2, y + s / 2, { color: col.ink, size: Math.min(11, s / 3.2), align: 'center', weight: i === k - 1 ? 700 : 400 });
      else if (i === 12) text(ctx, '…', x + s / 2, y + s / 2, { color: col.muted, size: 12, align: 'center' });
    }
  };
  sync();
}
