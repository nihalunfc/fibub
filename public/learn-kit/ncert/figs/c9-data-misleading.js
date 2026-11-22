// Class 9 Data: a graph can mislead. Three phone batteries last 96, 98 and 100 hours. Drawn from zero the bars look alike (they are within
// 4%). Cut the axis at 95 and the third looks five times the first. Slide the axis start and always check where the axis begins.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Three bars of battery life whose axis starts at a value you can change' });
  const c = row(host); slider(c, { label: 'Axis starts at', min: 0, max: 94, step: 1, value: a, oninput: (v) => { a = v; upd(); } });
  const out = readout(host), D = [['Brand A', 96], ['Brand B', 98], ['Brand C', 100]];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Battery life (hours) by brand', col), L = 40, B = h - 30, Tp = t + 14, bw = (w - L - 16) / 3, Y = (v) => B - ((v - a) / (102 - a)) * (B - Tp);
    const step = a > 80 ? 2 : 20; for (let y = Math.ceil(a / step) * step; y <= 100; y += step) { ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(y)); ctx.lineTo(w - 10, Y(y)); ctx.stroke(); ctx.restore(); text(ctx, String(y), L - 5, Y(y), { color: col.muted, size: 10, align: 'right' }); }
    D.forEach(([n, v], i) => { const x = L + i * bw + bw * 0.15; ctx.save(); ctx.fillStyle = col.s[i === 2 ? 3 : 0]; ctx.globalAlpha = 0.7; ctx.fillRect(x, Y(v), bw * 0.7, B - Y(v)); ctx.restore(); text(ctx, String(v), x + bw * 0.35, Y(v) - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, n, x + bw * 0.35, B + 12, { color: col.ink, size: 11, align: 'center' }); });
    if (a > 0) text(ctx, 'axis cut: starts at ' + a, L + 4, B - 6, { color: col.s[6], size: 10.5, weight: 700, halo: col.panel });
  };
  function upd() { const hA = 96 - a, hC = 100 - a; out.innerHTML = a === 0 ? 'From zero the bars look nearly equal: C is only 4% longer than A. That is the honest picture.' : `Bar C is <b>${(hC / hA).toFixed(1)} times</b> as tall as bar A, but the real batteries differ by only 4%. The axis cut makes a small difference look huge.`; cv.redraw(); }
  upd();
}
