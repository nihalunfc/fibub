// The story of a dashboard, top to bottom: headline numbers first (what happened), then the trend (is it getting better or
// worse), then the breakdown (where and why), then the action (what to do). Step through to see each block light up and what
// question it answers. Layout is a made-up sketch.
import { canvas, text, title, readout } from '../kit.js';

const BLOCKS = [
  ['Headline KPIs', 'What happened? Three numbers with their targets, so the reader knows in two seconds if all is well.'],
  ['Trend', 'Is it getting better or worse? One line chart with this year against last year and the target.'],
  ['Breakdown', 'Where is it coming from? Bars sorted by size, with the one store that explains the change in colour.'],
  ['Action', 'What should we do? One sentence and an owner. If the dashboard has no action, it is a report, not a story.'],
];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.86, max: 400, min: 320, label: 'A dashboard sketch with four blocks lit in order' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Read it like a story: top to bottom', col);
    const g = 8, x = 10, ww = w - 20, top = 34, H = h - top - 8;
    const hs = [H * 0.2, H * 0.3, H * 0.3, H * 0.2];
    let y = top;
    BLOCKS.forEach(([n], i) => {
      const bh = hs[i] - g, on = i === k;
      ctx.globalAlpha = i <= k ? 1 : 0.25;
      ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(x, y, ww, bh); ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = on ? 2.5 : 1; ctx.strokeRect(x, y, ww, bh);
      text(ctx, `${i + 1}. ${n}`, x + 8, y + 12, { color: on ? col.s[0] : col.muted, size: 11, weight: 800, fit: false });
      if (i === 0) [['Sales', '$1.2M'], ['Margin', '31%'], ['Orders', '9.4k']].forEach(([a, b], j) => { const bx = x + 8 + j * (ww - 16) / 3; text(ctx, b, bx, y + bh * 0.58, { color: col.ink, size: 16, weight: 800, fit: false }); text(ctx, a, bx, y + bh * 0.58 + 15, { color: col.muted, size: 9.5, fit: false }); });
      if (i === 1) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let j = 0; j <= 20; j++) { const px = x + 14 + (j / 20) * (ww - 28), py = y + bh - 12 - (0.25 + 0.5 * (j / 20) + 0.1 * Math.sin(j)) * (bh - 30); j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
      if (i === 2) [0.9, 0.65, 0.5, 0.3, 0.2].forEach((f, j) => { ctx.fillStyle = j === 0 ? col.s[1] : col.muted; ctx.globalAlpha *= j === 0 ? 1 : 0.5; ctx.fillRect(x + 12, y + 22 + j * ((bh - 30) / 5), (ww - 40) * f, (bh - 30) / 5 - 4); ctx.globalAlpha = i <= k ? 1 : 0.25; });
      if (i === 3) text(ctx, 'Restock the lead store before the next promotion (owner: Sam, by Friday).', x + 8, y + bh * 0.66, { color: col.ink, size: 11, weight: 600 });
      ctx.globalAlpha = 1; y += hs[i];
    });
  };
  const show = () => { out.innerHTML = `<b>${BLOCKS[k][0]}.</b> ${BLOCKS[k][1]}`; cv.redraw(); };
  show();
  return { step(i) { k = Math.max(0, Math.min(3, i)); show(); } };
}
