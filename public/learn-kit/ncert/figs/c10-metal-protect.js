// Class 10 Metals and Non-metals: protecting iron from rusting. A coating keeps air and water off. If the coat is
// scratched: paint and tin leave bare iron to rust (tin is less reactive than iron, so rust is even faster at the scratch),
// but zinc (galvanising) is MORE reactive than iron, so zinc corrodes instead and keeps protecting the iron (sacrificial).
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, clamp, lerp, rng } from '../../kit.js';

const COAT = { none: ['Bare iron', null, 0.12, 0.12], paint: ['Painted', '#4a78c4', 0.004, 0.09], zinc: ['Galvanised (zinc)', '#c3c9cf', 0.002, 0.0004], tin: ['Tin plated', '#e4e7ea', 0.003, 0.2] };
const NOTE = {
  none: 'No coat: air and water reach the iron, so it rusts all over.',
  paint: 'Paint keeps air and water out while it is whole. A scratch lets them in, and rust spreads under the paint.',
  zinc: 'Zinc is more reactive than iron, so even when scratched the zinc corrodes first (sacrificial protection) and the iron stays safe. Used for pipes, buckets, roofing sheets, and the iron frames of bridges.',
  tin: 'Tin is less reactive than iron. While whole it protects, but at a scratch the iron corrodes faster than bare iron. Tin cans are used for food only while the coat is undamaged.',
};
export default function (host) {
  let c = 'none', sc = true, day = 0, t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 300, label: 'An iron plate with different coatings, scratched or not, rusting over days' });
  const ctl = row(host);
  choice(ctl, 'Coating', Object.entries(COAT).map(([v, o]) => [v, o[0]]), c, (v) => { c = v; say(); });
  choice(ctl, 'Scratch', [['y', 'Scratched'], ['n', 'Whole']], 'y', (v) => { sc = v === 'y'; say(); });
  slider(ctl, { label: 'Days', min: 0, max: 60, step: 1, value: 0, fmt: (v) => `${v} d`, oninput: (v) => { day = v; say(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  const level = () => clamp(1 - Math.exp(-(sc || c === 'none' ? COAT[c][3] : COAT[c][2]) * day * 0.3), 0, 1);
  function say() { out.innerHTML = `${NOTE[c]} <b>Day ${day}: rust on the iron ${Math.round(level() * 100)}%.</b>`; cv.redraw(); }
  const R = rng(13), sp = Array.from({ length: 20 }, () => [R(), R()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${COAT[c][0]}${c === 'none' ? '' : sc ? ' with a scratch' : ', coat intact'}`, col) + 10, f = level();
    const px = 20, pw = w - 40, py = top + 50, ph = 54, ct = c === 'none' ? 0 : 10;
    ctx.fillStyle = '#7c8085'; ctx.fillRect(px, py, pw, ph);
    if (c !== 'none') { ctx.fillStyle = COAT[c][1]; ctx.fillRect(px - 2, py - ct, pw + 4, ct); ctx.fillRect(px - 2, py + ph, pw + 4, ct); ctx.fillRect(px - 2, py - ct, 4, ph + 2 * ct); ctx.fillRect(px + pw - 2, py - ct, 4, ph + 2 * ct); }
    const sx = px + pw * 0.5;
    if (sc && c !== 'none') { ctx.fillStyle = col.bg || '#fff'; ctx.fillRect(sx - 9, py - ct - 1, 18, ct + 1); }
    // rust patches
    const rx = c === 'none' ? px : sx - 28, rw = c === 'none' ? pw : 56;
    if (f > 0.02 && (sc || c === 'none')) { sp.forEach(([a, b], i) => { if (i / 20 < f * 1.4) { ctx.fillStyle = `rgba(184,80,24,${0.4 + 0.6 * f})`; ctx.fillRect(rx + a * rw, py + b * 8 - (c === 'none' ? 0 : 0), 9 * f + 3, 6 * f + 2); } }); }
    if (c === 'zinc' && sc && day > 0) { for (let i = 0; i < 8; i++) { ctx.fillStyle = `rgba(240,240,240,${0.2 + 0.6 * clamp(day / 60, 0, 1)})`; ctx.fillRect(sx - 14 + i * 4, py - ct + 1, 3, 4); } text(ctx, 'zinc corrodes (white)', sx, py - ct - 10, { color: col.s[2], size: 10, weight: 700, align: 'center' }); }
    if (c !== 'none' && sc) text(ctx, 'scratch', sx + 36, py - ct - 6, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'iron', px + 6, py + ph / 2, { color: '#fff', size: 12, weight: 700 }); if (c !== 'none') text(ctx, c === 'paint' ? 'paint' : c === 'zinc' ? 'zinc coat' : 'tin coat', px + pw - 6, py + ph + ct + 12, { color: col.ink, size: 10.5, align: 'right' });
    // bar
    const by = py + ph + 50;
    ctx.fillStyle = col.soft; ctx.fillRect(px, by, pw, 14); ctx.fillStyle = f > 0.5 ? col.bad : col.s[1]; ctx.fillRect(px, by, pw * f, 14);
    text(ctx, 'rust level', px, by - 8, { color: col.muted, size: 10.5 });
    // compare strip
    ['none', 'paint', 'zinc', 'tin'].forEach((k, i) => { const cl = clamp(1 - Math.exp(-(sc || k === 'none' ? COAT[k][3] : COAT[k][2]) * day * 0.3), 0, 1), bw2 = pw / 4 - 6, x = px + i * (pw / 4); ctx.fillStyle = col.soft; ctx.fillRect(x, by + 40, bw2, 8); ctx.fillStyle = k === c ? col.s[1] : col.muted; ctx.fillRect(x, by + 40, bw2 * cl, 8); text(ctx, COAT[k][0].split(' ')[0], x + bw2 / 2, by + 60, { color: k === c ? col.ink : col.muted, size: 9.5, align: 'center' }); });
  };
  say();
}
