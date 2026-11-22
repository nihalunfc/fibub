// 5.5 Proportions in words: move the slider and see the pie slice and the words that describe it
// ("just under a third", "the majority"). Approximation words keep a Task 1 report from being a list of numbers.
import { canvas, text, row, slider, readout } from '../../kit.js';

const FR = [[100 / 3, 'a third'], [25, 'a quarter'], [50, 'half'], [200 / 3, 'two thirds'], [75, 'three quarters'], [20, 'a fifth'], [10, 'one in ten'], [40, 'two fifths'], [60, 'three fifths'], [80, 'four fifths'], [100, 'all']];
/** Words for a percentage: the nearest common fraction with just over / just under / exactly. */
export function fractionWords(p) {
  if (p <= 0) return 'none';
  let best = FR[0];
  for (const f of FR) if (Math.abs(f[0] - p) < Math.abs(best[0] - p)) best = f;
  const d = p - best[0];
  const near = Math.abs(d) < 0.6 ? 'exactly ' : Math.abs(d) <= 3 ? (d < 0 ? 'just under ' : 'just over ') : Math.abs(d) <= 6 ? (d < 0 ? 'nearly ' : 'more than ') : 'roughly ';
  return (best[1] === 'all' && d < 0 ? 'almost all' : near + best[1]);
}
const SIZE = (p) => p > 50 ? 'the majority' : p === 50 ? 'exactly half' : p >= 40 ? 'a large minority' : p >= 15 ? 'a significant minority' : p >= 5 ? 'a small minority' : 'a tiny fraction';

export default function (host) {
  let p = 31;
  const ctl = row(host);
  slider(ctl, { label: 'Share of people who cycle to work', min: 1, max: 99, step: 1, value: p, fmt: (x) => x + '%', oninput: (x) => { p = x; show(); } });
  const cv = canvas(host, { aspect: 0.55, max: 260, min: 200, label: 'A pie chart with one slice for the chosen percentage', mark: 'tr' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const r = Math.min(h / 2 - 14, w / 4), cx = r + 20, cy = h / 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = col.line; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (p / 100) * Math.PI * 2); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.fill();
    const x = cx + r + 24;
    text(ctx, p + '% cycle', x, cy - 30, { color: col.ink, size: 15, weight: 700 });
    text(ctx, '= ' + fractionWords(p), x, cy - 6, { color: col.ink, size: 14 });
    text(ctx, '= ' + SIZE(p), x, cy + 18, { color: col.muted, size: 13 });
  };
  const show = () => { out.textContent = `"${p}% of workers cycle" can also be "${fractionWords(p)} of workers cycle" or "${SIZE(p)} of workers cycle". Use the exact figure once, then vary.`; cv.redraw(); };
  show();
}
