// Class 9 Identities: mental maths with identities. A number near 100 is 100 + d, so (100 + d)^2 = 10000 + 200 d + d^2 and
// (100 + d)(100 - d) = 10000 - d^2. Slide d and compare with the direct multiplication.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let d = 3, mode = 'sq';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A product of numbers near 100 worked out with an algebraic identity and checked by direct multiplication' });
  const c1 = row(host); choice(c1, 'Work out', [['sq', '(100 + d)²'], ['pair', '(100 + d)(100 − d)'], ['sq2', '(100 − d)²']], mode, (v) => { mode = v; upd(); });
  const ctl = row(host); slider(ctl, { label: 'd', min: 1, max: 9, step: 1, value: d, oninput: (v) => { d = v; upd(); } });
  const out = readout(host);
  const calc = () => (mode === 'sq' ? { q: `${100 + d}²`, id: `(100 + ${d})² = 100² + 2·100·${d} + ${d}²`, parts: [10000, 200 * d, d * d], sg: [1, 1, 1], v: (100 + d) ** 2 } : mode === 'sq2' ? { q: `${100 - d}²`, id: `(100 − ${d})² = 100² − 2·100·${d} + ${d}²`, parts: [10000, 200 * d, d * d], sg: [1, -1, 1], v: (100 - d) ** 2 } : { q: `${100 + d} × ${100 - d}`, id: `(100 + ${d})(100 − ${d}) = 100² − ${d}²`, parts: [10000, d * d], sg: [1, -1], v: (100 + d) * (100 - d) });
  cv.draw = (ctx, w, h, col) => {
    const c = calc(), t = title(ctx, c.q, col);
    text(ctx, c.id, 12, t + 24, { color: col.ink, size: 12.5, weight: 600 });
    let y = t + 52, run = 0;
    c.parts.forEach((p, i) => { run += c.sg[i] * p; const wBar = Math.min(w - 150, (p / 10000) * (w - 150) + 3); ctx.save(); ctx.fillStyle = c.sg[i] > 0 ? col.s[0] : col.s[6]; ctx.globalAlpha = 0.6; ctx.fillRect(12, y - 9, wBar, 18); ctx.restore(); text(ctx, (c.sg[i] > 0 ? '+ ' : '− ') + p, 18 + wBar, y, { color: col.ink, size: 12, weight: 700 }); y += 28; });
    text(ctx, 'Total = ' + c.v + '   (direct: ' + c.q.replace('²', ' × ' + c.q.replace('²', '')) + ' = ' + c.v + ')', 12, y + 8, { color: col.s[2], size: 14, weight: 700 });
  };
  function upd() { const c = calc(); out.innerHTML = `<b>${c.q} = ${c.v}</b>. With the identity you only add or subtract easy numbers: ${c.parts.map((p, i) => (i ? (c.sg[i] > 0 ? ' + ' : ' − ') : '') + p).join('')} = ${c.v}.`; cv.redraw(); }
  upd();
}
