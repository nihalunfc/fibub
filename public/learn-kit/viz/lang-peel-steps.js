// PEEL paragraph, one move at a time: Point, Explain, Example, Link. Step through and watch a body paragraph (made-up)
// grow sentence by sentence, with the move named next to each sentence. Use the dots or Next in the step player.
import { canvas, text, title } from '../kit.js';
import { box, CARD } from './_lang.js';

const S = [['Point', 'Public transport should be free in big cities.', 'var(--s1)'], ['Explain', 'When tickets cost nothing, more people leave their cars at home, so roads are clearer and the air is cleaner.', 'var(--s2)'], ['Example', 'For instance, when Tallinn made buses free for residents, car use in the centre fell noticeably.', 'var(--s3)'], ['Link', 'This shows that removing the cost of travel is a practical way to cut traffic and pollution together.', 'var(--s4)']];
export default function (host) {
  let cur = 0;
  const cv = canvas(host, { aspect: 0.5, max: 210, min: 170, label: 'A paragraph growing in four moves' });
  const cues = ['claim', 'because...', 'for instance...', 'so...'], len = [0.18, 0.34, 0.28, 0.2];
  cv.draw = (ctx, W, H, col) => {
    const y0 = title(ctx, 'The paragraph grows: P, E, E, L', col) + 6, tot = H - y0 - 10; let y = y0;
    S.forEach(([name], i) => { const h = tot * len[i]; ctx.globalAlpha = i <= cur ? 0.85 : 0.15; ctx.fillStyle = col.s[i]; ctx.fillRect(10, y, W - 20, h - 3); ctx.globalAlpha = 1; text(ctx, name + ': ' + cues[i], 18, y + (h - 3) / 2, { color: i <= cur ? '#fff' : col.muted, size: 12.5, weight: 700, fit: false }); y += h; });
  };
  const wrap = box(host, CARD + 'padding:10px 12px;');
  const draw = (n) => {
    cur = n; cv.redraw();
    wrap.innerHTML = '';
    S.forEach(([name, txt, c], i) => {
      const r = box(wrap, 'display:flex;gap:8px;align-items:flex-start;padding:5px 0;opacity:' + (i <= n ? 1 : 0.18) + ';transition:opacity .4s;');
      box(r, 'flex:0 0 66px;font-weight:700;font-size:12px;border-left:4px solid ' + c + ';padding-left:6px;', name);
      box(r, 'font-size:14px;' + (i === n ? 'font-weight:600;' : ''), txt);
    });
  };
  draw(0);
  return { step(i) { draw(Math.min(i, S.length - 1)); } };
}
