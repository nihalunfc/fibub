// Class 9 Identities: factorising x^2 + bx + c by matching tiles. The tiles are one x-square, b strips (x by 1) and c unit squares.
// To make a rectangle (x + p) wide, the c units must form a p-by-q block (q = c / p) and the strips must be p + q = b. Try each p.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const POLY = { a: [5, 6], b: [7, 12], c: [6, 8], d: [4, 4], e: [8, 15], f: [5, 4] };
export default function (host) {
  let k = 'a', p = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Tiles for a quadratic arranged into a rectangle when the numbers p and q match' });
  const c1 = row(host); choice(c1, 'Polynomial', Object.entries(POLY).map(([v, [b, c]]) => [v, `x² + ${b}x + ${c}`]), k, (v) => { k = v; p = 1; sl.set(1); upd(); });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Try p (a unit-block p wide)', min: 1, max: 15, step: 1, value: p, oninput: (v) => { p = v; upd(); } });
  const out = readout(host);
  const st = () => { const [b, c] = POLY[k], fits = c % p === 0, q = fits ? c / p : null, ok = fits && p + q === b; return { b, c, fits, q, ok }; };
  cv.draw = (ctx, w, h, col) => {
    const { b, c, fits, q, ok } = st(), t = title(ctx, 'x² + ' + b + 'x + ' + c + ': try p = ' + p, col);
    const X0 = 4, mx = Math.max(p, q || 1, 1) + (b), sc = Math.min((w - 40) / (X0 + Math.max(p, q || 0) + 1), (h - t - 70) / (X0 + Math.max(p, q || 0) + 1), 46), ox = 14, oy = t + 20;
    const X = (v) => ox + v * sc, Y = (v) => oy + v * sc;
    const box = (x, y, ww, hh, c2, lab, a = 0.45) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c2; ctx.fillRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); if (lab) text(ctx, lab, X(x + ww / 2), Y(y + hh / 2), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); };
    if (!fits) { box(0, 0, X0, X0, col.s[0], 'x²'); box(X0, 0, p, X0, col.s[2], 'px'); text(ctx, p + ' does not divide ' + c, w / 2, h - 36, { color: col.s[6], size: 14, weight: 700, align: 'center' }); text(ctx, 'the ' + c + ' unit squares cannot form a block that is ' + p + ' wide', w / 2, h - 16, { color: col.muted, size: 11, align: 'center' }); return; }
    box(0, 0, X0, X0, col.s[0], 'x²'); box(X0, 0, p, X0, col.s[2], 'p·x'); box(0, X0, X0, q, col.s[3], 'q·x'); box(X0, X0, p, q, col.s[5], p + '×' + q + '=' + c);
    text(ctx, ok ? '(x + ' + p + ')(x + ' + q + ') ✓' : 'p + q = ' + (p + q) + ', but we need ' + b, w / 2, h - 28, { color: ok ? col.s[2] : col.s[6], size: 15, weight: 700, align: 'center' });
    text(ctx, ok ? 'the strips use exactly all ' + b + ' of the x-tiles' : (p + q > b ? 'too many strips needed (' + (p + q) + ' > ' + b + ')' : 'strips left over (' + (b - p - q) + ')'), w / 2, h - 10, { color: col.muted, size: 11.5, align: 'center' });
  };
  function upd() { const { b, c, fits, q, ok } = st(); out.innerHTML = fits ? `p = ${p}, q = ${c}/${p} = ${q}: product ${p * q} = ${c}, sum ${p + q} ${ok ? '= ' + b + '. <b>Match!</b> x² + ' + b + 'x + ' + c + ' = (x + ' + p + ')(x + ' + q + ').' : '≠ ' + b + '. Not a match: try another p.'}` : `${p} is not a factor of ${c}, so the unit tiles cannot be arranged. Try a factor of ${c}.`; cv.redraw(); }
  upd();
}
