// Class 8 A Square and a Cube: is a number a perfect square or a perfect cube? Write it as primes. If every prime appears a
// multiple of 2 times it is a square; a multiple of 3 times, a cube. The smallest multiplier that fixes it is shown.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const NUMS = [144, 216, 500, 648, 1000, 1728, 2916, 3375, 5400];
const fac = (m) => { const o = {}; for (let p = 2; m > 1; p++) while (m % p === 0) { o[p] = (o[p] || 0) + 1; m /= p; } return o; };
export default function (host) {
  let m = 648;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 240, label: 'Prime factors of a number and whether they make a perfect square or cube' });
  const out = readout(host); const ctl = row(host);
  choice(ctl, 'Number', NUMS.map((v) => [v, String(v)]), m, (v) => { m = v; sync(); });
  const need = (f, k) => Object.entries(f).reduce((a, [p, e]) => a * (+p) ** ((k - (e % k)) % k), 1);
  function sync() {
    const f = fac(m), sq = need(f, 2), cu = need(f, 3);
    out.innerHTML = `<b>${m}</b> ${sq === 1 ? 'is a perfect square' : `is not a square: multiply by ${sq} to get ${m * sq} = ${Math.round(Math.sqrt(m * sq))}²`}; ${cu === 1 ? 'it is a perfect cube' : `not a cube: multiply by ${cu} to get ${m * cu} = ${Math.round(Math.cbrt(m * cu))}³`}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${m} as prime factors`, col), f = fac(m), ps = Object.keys(f), cw = Math.min(26, (w - 60) / Math.max(...Object.values(f), 1) - 2), rowH = 50;
    ps.forEach((p, i) => {
      const e = f[p], y = top + 36 + i * rowH;
      text(ctx, p, 14, y + 14, { color: col.ink, size: 14, weight: 700 });
      for (let j = 0; j < e; j++) {
        const x = 34 + j * (cw + 2);
        ctx.fillStyle = col.s[+p % 6]; ctx.globalAlpha = 0.9; ctx.fillRect(x, y, cw, 28); ctx.globalAlpha = 1;
        text(ctx, p, x + cw / 2, y + 14, { color: col.panel, size: 13, weight: 700, align: 'center' });
      }
      text(ctx, `${p} appears ${e} times: pairs leave ${e % 2}, triples leave ${e % 3}`, 34, y + 38, { color: col.muted, size: 11 });
    });
    text(ctx, 'A square needs 0 left over in pairs; a cube needs 0 left over in triples.', w / 2, h - 12, { color: col.ink, size: 11, align: 'center' });
  };
  sync();
}
