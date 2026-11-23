// Class 8 We Distribute: (a + b)^2 and (a - b)^2 as areas. Plus: a big square of side a + b splits into a^2, two ab rectangles and b^2.
// Minus: from a square of side a cut two strips ab (the b^2 corner is cut twice, so add b^2 back): a^2 - 2ab + b^2.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let a = 5, b = 2, mode = 'plus';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A square of side a plus b or a minus b split into pieces whose areas show the identity' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: 2, max: 8, step: 1, value: a, fmt: (v) => String(Math.round(v)), oninput: (v) => { a = Math.round(v); upd(); } });
  slider(ctl, { label: 'b', min: 1, max: 7, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); upd(); } });
  choice(ctl, 'Show', [['plus', '(a + b)²'], ['minus', '(a − b)²']], mode, (v) => { mode = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const bb = mode === 'minus' ? Math.min(b, a - 1) : b, side = a + (mode === 'plus' ? bb : 0), t = title(ctx, mode === 'plus' ? '(a + b)² = a² + 2ab + b²' : '(a − b)² = a² − 2ab + b²', col), sc = Math.min((w - 60) / side, (h - t - 50) / side), ox = (w - side * sc) / 2 + 6, oy = t + 26;
    const R = (x, y, ww, hh, cl, lab) => { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = cl; ctx.fillRect(ox + x * sc, oy + y * sc, ww * sc, hh * sc); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(ox + x * sc, oy + y * sc, ww * sc, hh * sc); if (lab && ww * sc > 22 && hh * sc > 16) text(ctx, lab, ox + (x + ww / 2) * sc, oy + (y + hh / 2) * sc, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); };
    if (mode === 'plus') { R(0, 0, a, a, col.s[0], 'a²'); R(a, 0, bb, a, col.s[2], 'ab'); R(0, a, a, bb, col.s[2], 'ab'); R(a, a, bb, bb, col.s[3], 'b²'); }
    else { const m = a - bb; R(0, 0, m, m, col.s[0], '(a−b)²'); R(m, 0, bb, m, col.s[2], 'b(a−b)'); R(0, m, m, bb, col.s[2], 'b(a−b)'); R(m, m, bb, bb, col.s[3], 'b²'); }
    text(ctx, 'side ' + (mode === 'plus' ? a + bb : a - bb) + (mode === 'plus' ? '' : '  (whole square is a = ' + a + ')'), w / 2, h - 12, { color: col.muted, size: 12, align: 'center' });
  };
  function upd() { const bb = mode === 'minus' ? Math.min(b, a - 1) : b; out.innerHTML = mode === 'plus' ? `(${a} + ${bb})² = ${(a + bb) ** 2} and ${a * a} + 2×${a * bb} + ${bb * bb} = <b>${a * a + 2 * a * bb + bb * bb}</b>. The two ab rectangles are what (a² + b²) misses.` : `(${a} − ${bb})² = ${(a - bb) ** 2} and ${a * a} − 2×${a * bb} + ${bb * bb} = <b>${a * a - 2 * a * bb + bb * bb}</b>.${b >= a ? ' (b is held below a here.)' : ''}`; cv.redraw(); }
  upd();
}
