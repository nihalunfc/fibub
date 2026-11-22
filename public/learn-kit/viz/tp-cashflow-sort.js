// Cash flow statement sorting game: tap an item, then tap the box where it belongs (operating, investing or financing
// activity). It checks itself, says why, and keeps the net cash flow for each box. Items follow the usual Class 12 rules
// (interest paid and dividends paid are treated as financing here). Try to sort all ten.
import { canvas, row, button, readout, text } from '../kit.js';

const ITEMS = [
  ['Cash received from customers', 'op', 60], ['Salaries paid', 'op', -25], ['Purchase of machinery', 'inv', -40], ['Sale of old land', 'inv', 15],
  ['Issue of equity shares', 'fin', 50], ['Repayment of bank loan', 'fin', -20], ['Interest received on investments', 'inv', 5],
  ['Dividend paid to shareholders', 'fin', -10], ['Cash paid to suppliers', 'op', -30], ['Purchase of long-term investments', 'inv', -12],
];
const BOX = { op: 'Operating', inv: 'Investing', fin: 'Financing' };
const WHY = { op: 'day-to-day trading of the business', inv: 'buying or selling long-term assets and investments', fin: 'raising or repaying owners\' and lenders\' money' };

export default function (host) {
  let sel = -1, put = ITEMS.map(() => null), msg = 'Tap an item, then tap its box.';
  const cv = canvas(host, { aspect: 1.2, max: 450, min: 390, label: 'Cash flow items to sort into operating, investing and financing activities' });
  const c = row(host); button(c, 'Reset', () => { put = ITEMS.map(() => null); sel = -1; msg = 'Tap an item, then tap its box.'; cv.redraw(); show(); });
  const out = readout(host);
  const hits = [];
  const show = () => { const done = put.filter((x) => x).length, good = put.filter((x, i) => x && x === ITEMS[i][1]).length; out.innerHTML = `${msg} <b>${good}</b> correct of ${done} placed (${ITEMS.length} items). Amounts are in ₹ thousand and made up.`; };
  cv.c.addEventListener('click', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    const h = hits.find((r) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]); if (!h) return;
    if (h[4] === 'item') { sel = put[h[5]] ? -1 : h[5]; if (put[h[5]]) { put[h[5]] = null; } }
    else if (sel >= 0) { put[sel] = h[5]; const ok = ITEMS[sel][1] === h[5]; msg = ok ? `Yes: it is ${BOX[h[5]].toLowerCase()}, ${WHY[h[5]]}.` : `Not quite: "${ITEMS[sel][0]}" is ${BOX[ITEMS[sel][1]].toLowerCase()}, ${WHY[ITEMS[sel][1]]}.`; sel = -1; }
    cv.redraw(); show();
  });
  cv.draw = (ctx, w, h, col) => {
    hits.length = 0;
    const gap = 6, bw = (w - 4 * gap) / 3, bt = 22, bh = 44;
    ['op', 'inv', 'fin'].forEach((k, i) => {
      const x = gap + i * (bw + gap), items = ITEMS.map((it, j) => [it, j]).filter(([, j]) => put[j] === k);
      const net = items.reduce((s, [it]) => s + it[2], 0);
      ctx.fillStyle = col.soft; ctx.fillRect(x, bt, bw, h * 0.4); ctx.strokeStyle = sel >= 0 ? col.s[0] : col.line; ctx.lineWidth = sel >= 0 ? 2 : 1; ctx.strokeRect(x, bt, bw, h * 0.4);
      text(ctx, BOX[k], x + bw / 2, bt + 13, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'net ' + (net > 0 ? '+' : net < 0 ? '−' : '') + Math.abs(net), x + bw / 2, bt + 29, { color: col.muted, size: 11, align: 'center' });
      items.forEach(([it, j], r) => { const okk = it[1] === k; text(ctx, (okk ? '✓ ' : '✗ ') + it[0].slice(0, 15) + (it[0].length > 15 ? '…' : ''), x + 5, bt + 44 + r * 12, { color: okk ? col.good : col.bad, size: 10 }); });
      hits.push([x, bt, bw, h * 0.4, 'box', k]);
    });
    const y0 = h * 0.4 + 38;
    text(ctx, 'Items to place (tap one):', 8, y0 - 4, { color: col.muted, size: 11 });
    ITEMS.forEach((it, j) => {
      if (put[j]) return;
      const idx = ITEMS.slice(0, j).filter((_, q) => !put[q]).length, y = y0 + 8 + idx * 18;
      ctx.fillStyle = sel === j ? col.s[0] : col.panel; ctx.globalAlpha = sel === j ? 0.25 : 1; ctx.fillRect(6, y, w - 12, 17); ctx.globalAlpha = 1; ctx.strokeStyle = sel === j ? col.s[0] : col.line; ctx.strokeRect(6, y, w - 12, 17);
      text(ctx, it[0], 12, y + 9, { color: col.ink, size: 11 }); hits.push([6, y, w - 12, 17, 'item', j]);
    });
  };
  show();
}
