// Compared to what? The same sales figure (drag it) looks great, fine or bad depending on what it is set beside. Pick the
// comparison: nothing, a target, last year, last month, or the industry average. A number alone is not a story.
import { canvas, text, title, row, slider, choice, readout } from '../kit.js';

const B = { none: ['Nothing', null], target: ['Target', 150], ly: ['Last year', 100], lm: ['Last month', 135], peer: ['Industry average', 90] };
export default function (host) {
  let cmp = 'none';
  const cv = canvas(host, { aspect: 0.62, max: 320, min: 260, label: 'A sales number compared with a chosen baseline' });
  const ctl = row(host);
  choice(ctl, 'Compare with', Object.entries(B).map(([k, v]) => [k, v[0]]), cmp, (v) => { cmp = v; cv.redraw(); show(); });
  const S = slider(ctl, { label: 'Our sales (thousands)', min: 60, max: 180, step: 1, value: 120, fmt: (v) => '$' + v + 'k', oninput: () => { cv.redraw(); show(); } });
  const out = readout(host);
  const d = () => (B[cmp][1] ? S.value / B[cmp][1] - 1 : null);
  function show() {
    const x = d();
    out.innerHTML = x === null ? `<b>$${S.value}k.</b> Is that good? You cannot tell.` : `<b>$${S.value}k is ${x >= 0 ? '+' : ''}${(x * 100).toFixed(0)}% against ${B[cmp][0].toLowerCase()} ($${B[cmp][1]}k):</b> ${x >= 0.05 ? 'good news.' : x <= -0.05 ? 'bad news.' : 'about level.'} Try the other baselines: the number never changed, only the story did.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Is $' + S.value + 'k good?', col);
    const x = d(), base = B[cmp][1], mx = 200, L = 30, bw = w - 60, y1 = 50, bh = 38;
    const c = x === null ? col.s[0] : x >= 0.05 ? col.good : x <= -0.05 ? col.bad : col.warn;
    ctx.fillStyle = c; ctx.fillRect(L, y1, (bw * S.value) / mx, bh);
    text(ctx, 'Us', L + 6, y1 + bh / 2, { color: col.bg, size: 12, weight: 800, fit: false });
    if (base) {
      ctx.fillStyle = col.muted; ctx.globalAlpha = 0.6; ctx.fillRect(L, y1 + bh + 12, (bw * base) / mx, bh); ctx.globalAlpha = 1;
      text(ctx, B[cmp][0], L + 6, y1 + bh * 1.5 + 12, { color: col.bg, size: 11, weight: 700, fit: false, halo: col.muted });
      ctx.strokeStyle = col.ink; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(L + (bw * base) / mx, y1 - 6); ctx.lineTo(L + (bw * base) / mx, y1 + 2 * bh + 18); ctx.stroke(); ctx.setLineDash([]);
    }
    text(ctx, x === null ? '?' : (x >= 0 ? '+' : '') + (x * 100).toFixed(0) + '%', w / 2, h - 36, { color: c, size: 30, weight: 800, align: 'center', fit: false });
  };
  show(); cv.redraw();
}
