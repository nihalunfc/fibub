// Mixing two solutions. Two vessels hold different strengths (per cent); pour them into one and the result is the
// weighted average: (V1·c1 + V2·c2) ÷ (V1 + V2). The "Hit a target" button sets the amounts with the alligation rule
// V1 : V2 = (c2 − t) : (t − c1), which is the same thing seen from the other side. Press Pour to animate.
import { canvas, row, slider, button, readout, loop, text, title, clamp, ease } from '../kit.js';

export default function (host) {
  let c1 = 20, c2 = 80, v1 = 3, v2 = 2, tg = 44, p = 1;
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 290, label: 'Two solutions poured into one vessel' });
  const r = row(host);
  slider(r, { label: 'Vessel 1 strength', min: 0, max: 100, step: 5, value: c1, fmt: (v) => v + '%', oninput: (v) => { c1 = Math.min(v, c2 - 5); cv.redraw(); show(); } });
  slider(r, { label: 'Vessel 2 strength', min: 0, max: 100, step: 5, value: c2, fmt: (v) => v + '%', oninput: (v) => { c2 = Math.max(v, c1 + 5); cv.redraw(); show(); } });
  slider(r, { label: 'Litres from 1', min: 0.5, max: 8, step: 0.5, value: v1, fmt: (v) => v + ' L', oninput: (v) => { v1 = v; cv.redraw(); show(); } });
  slider(r, { label: 'Litres from 2', min: 0.5, max: 8, step: 0.5, value: v2, fmt: (v) => v + ' L', oninput: (v) => { v2 = v; cv.redraw(); show(); } });
  const r2 = row(host);
  slider(r2, { label: 'Target strength', min: 5, max: 95, step: 1, value: tg, fmt: (v) => v + '%', oninput: (v) => { tg = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { if (p < 1) { p = clamp(p + dt / 1.6, 0, 1); cv.redraw(); } else anim.pause(); }, { autoplay: false });
  const r3 = row(host); button(r3, 'Pour ▶', () => { p = 0; anim.play(); });
  button(r3, 'Hit a target', () => { if (tg <= c1 || tg >= c2) return; const a = c2 - tg, b = tg - c1, k = 8 / Math.max(a, b); v1 = Math.round(a * k * 2) / 2 || 0.5; v2 = Math.round(b * k * 2) / 2 || 0.5; cv.redraw(); show(); });
  const out = readout(host);
  const res = () => (v1 * c1 + v2 * c2) / (v1 + v2);
  const show = () => { const g = (x) => +x.toFixed(2); out.innerHTML = `(${v1}×${c1} + ${v2}×${c2}) ÷ ${v1 + v2} = <b>${g(res())}%</b>. Alligation: to get ${tg}%, mix vessel 1 and 2 in the ratio (${c2} − ${tg}) : (${tg} − ${c1}) = <b>${tg > c1 && tg < c2 ? (c2 - tg) + ' : ' + (tg - c1) : 'not possible (target outside the two strengths)'}</b>. The answer always lies between ${c1}% and ${c2}%, nearer the one you use more of.`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Pour, mix, and read the strength', col);
    const vessel = (x, y, bw, bh, lvl, strength, lab, sub) => { const fill = lvl * bh; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.12 + 0.75 * strength / 100; ctx.fillRect(x, y + bh - fill, bw, fill); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bh);
      text(ctx, lab, x + bw / 2, y + bh + 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, sub, x + bw / 2, y + bh + 26, { color: col.muted, size: 10.5, align: 'center' }); };
    const bw = Math.min(70, w * 0.2), y = 52, bh = h * 0.48, e = ease(p), cap = 16;
    vessel(w * 0.08, y, bw, bh, (v1 / cap) * (1 - e), c1, 'Vessel 1', `${c1}%, ${v1} L`);
    vessel(w * 0.08 + bw + w * 0.07, y, bw, bh, (v2 / cap) * (1 - e), c2, 'Vessel 2', `${c2}%, ${v2} L`);
    const rx = w - bw * 1.35 - 10; vessel(rx, y, bw * 1.35, bh, ((v1 + v2) / cap) * e, res(), 'Mixture', `${+res().toFixed(1)}%, ${v1 + v2} L`);
    text(ctx, '→', rx - 14, y + bh / 2, { color: col.muted, size: 22, align: 'center' });
    const ys = y + bh + 56, L = 16, W = w - 32; ctx.fillStyle = col.line; ctx.fillRect(L, ys, W, 12); const X = (v) => L + v / 100 * W;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(X(c1), ys, X(c2) - X(c1), 12); ctx.globalAlpha = 1;
    [[c1, '1'], [c2, '2']].forEach(([v, n]) => text(ctx, n, X(v), ys - 7, { color: col.ink, size: 11, weight: 700, align: 'center' })); ctx.fillStyle = col.ink; ctx.fillRect(X(res()) - 2, ys - 3, 4, 18); text(ctx, 'mix', X(res()), ys + 26, { color: col.ink, size: 11, weight: 700, align: 'center' });
    if (tg > c1 && tg < c2) { ctx.strokeStyle = col.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(tg), ys - 4); ctx.lineTo(X(tg), ys + 16); ctx.stroke(); text(ctx, 'target', X(tg), ys + 38, { color: col.warn, size: 10.5, weight: 700, align: 'center' }); }
  };
  show();
}
