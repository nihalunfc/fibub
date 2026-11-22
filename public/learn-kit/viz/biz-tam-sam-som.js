// Market size three ways: TAM (everyone who could use it), SAM (the part you can serve with your product and places) and
// SOM (what you can realistically win soon). Circles are drawn with area in proportion. Top-down starts from the whole
// market; bottom-up starts from the sales you can really make. Compare the two answers.
import { canvas, text, title, row, slider, readout, choice } from '../kit.js';
import { short } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 400, min: 310, label: 'Nested circles for TAM, SAM and SOM' });
  let mode = 'top';
  const ctl = row(host);
  choice(ctl, 'Method', [['top', 'Top-down'], ['bottom', 'Bottom-up']], mode, (v) => { mode = v; draw(); });
  const c1 = row(host), c2 = row(host);
  const S = {
    n: slider(c1, { label: 'Possible buyers', min: 100000, max: 20000000, step: 100000, value: 5000000, fmt: (v) => (v / 1e6).toFixed(1) + 'M', oninput: () => draw() }),
    price: slider(c1, { label: 'Price a year', min: 10, max: 500, step: 5, value: 60, fmt: (v) => '$' + v, oninput: () => draw() }),
    sam: slider(c1, { label: 'You can serve', min: 0.02, max: 1, step: 0.01, value: 0.2, fmt: (v) => Math.round(v * 100) + '%', oninput: () => draw() }),
    som: slider(c1, { label: 'You can win (of SAM)', min: 0.002, max: 0.2, step: 0.002, value: 0.03, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: () => draw() }),
    calls: slider(c2, { label: 'Sales calls a week', min: 5, max: 200, step: 5, value: 40, fmt: (v) => v, oninput: () => draw() }),
    close: slider(c2, { label: 'Share who buy', min: 0.01, max: 0.5, step: 0.01, value: 0.1, fmt: (v) => Math.round(v * 100) + '%', oninput: () => draw() }),
  };
  const out = readout(host);
  function draw() { cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const tam = S.n.value * S.price.value, samN = S.n.value * S.sam.value, sam = samN * S.price.value;
    const bottomN = S.calls.value * 52 * S.close.value * 2, bottom = bottomN * S.price.value; // 2 years of selling
    const somN = mode === 'top' ? samN * S.som.value : Math.min(bottomN, samN), som = somN * S.price.value;
    title(ctx, 'How big is the market?', col);
    const R = Math.min(w * 0.34, (h - 50) / 2), cx = R + 10, cy = h - R - 12;
    const rS = R * Math.sqrt(sam / tam), rO = Math.max(4, R * Math.sqrt(som / tam));
    [[R, col.s[0], 0.2, 'TAM'], [Math.max(rS, rO + 6), col.s[1], 0.35, 'SAM'], [rO, col.s[2], 0.8, 'SOM']].forEach(([r, c, al], i) => {
      ctx.globalAlpha = al; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy + R - r, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke();
    });
    const lx = cx + R + 10;
    const L = (y, name, c, v, n) => { text(ctx, name, lx, y, { color: c, size: 12, weight: 800, fit: false }); text(ctx, short(v) + ' a year', lx, y + 14, { color: col.ink, size: 11, fit: false }); text(ctx, short(n).replace('$', '') + ' people', lx, y + 27, { color: col.muted, size: 10, fit: false }); };
    L(60, 'TAM', col.s[0], tam, S.n.value); L(h * 0.42 + 10, 'SAM', col.s[1], sam, samN); L(h * 0.72 - 6, 'SOM', col.s[2], som, somN);
    out.innerHTML = mode === 'top' ? `<b>Top-down:</b> ${(S.n.value / 1e6).toFixed(1)}M buyers × $${S.price.value} = TAM <b>${short(tam)}</b>. You can serve ${Math.round(S.sam.value * 100)}% (SAM <b>${short(sam)}</b>) and win ${(S.som.value * 100).toFixed(1)}% of that: SOM <b>${short(som)}</b>.`
      : `<b>Bottom-up:</b> ${S.calls.value} calls × 52 weeks × ${Math.round(S.close.value * 100)}% buy × 2 years = <b>${Math.round(bottomN).toLocaleString()} customers</b> × $${S.price.value} = SOM <b>${short(bottom)}</b>. Check it against the top-down figure: a SOM you cannot reach with real sales effort is a wish.`;
  };
  draw();
}
