// How a sales tax like GST or VAT builds up along a supply chain, hop by hop. Every business charges tax on its sale,
// claims back the tax it paid on its purchases, and sends only the difference to the government. At the end the total
// collected equals the tax rate times the final price. Example rate 10% (made up; real rates are in the lesson).
import { canvas, text, title, arrow, readout } from '../kit.js';
import { money } from './_biz.js';

const R = 0.1;
// name, buys for (before tax), sells for (before tax)
const CH = [['Grower', 0, 100], ['Maker', 100, 160], ['Shop', 160, 250]];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 330, label: 'Tax charged and claimed at each step of a supply chain' });
  const out = readout(host);
  const net = (i) => CH[i][2] * R - CH[i][1] * R;
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tax sent to the government, hop by hop', col);
    const top = 38, rh = (h - top - 70) / 3, bw = w - 20;
    CH.forEach(([name, buy, sell], i) => {
      const y = top + i * rh, on = k >= i + 1; ctx.globalAlpha = on ? 1 : 0.2;
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(10, y, bw, rh - 10);
      text(ctx, name, 18, y + 14, { color: col.ink, size: 13, weight: 800 });
      text(ctx, buy ? `Buys at ${money(buy)} + tax ${money(buy * R)}` : 'Buys nothing taxed', 18, y + 32, { color: col.muted, size: 11 });
      text(ctx, `Sells at ${money(sell)} + tax ${money(sell * R)}`, 18, y + 48, { color: col.ink, size: 11 });
      text(ctx, `Sends ${money(sell * R)} − claims ${money(buy * R)}`, w - 16, y + 32, { color: col.s[0], size: 11, align: 'right' });
      text(ctx, `= ${money(net(i))} to government`, w - 16, y + 48, { color: col.s[0], size: 12, weight: 800, align: 'right' });
      if (i > 0 && on) arrow(ctx, w / 2, y - 10, w / 2, y, col.muted, 1.5, 6);
      ctx.globalAlpha = 1;
    });
    const total = CH.slice(0, Math.max(0, k)).reduce((a, _, i) => a + net(i), 0), y = h - 54;
    ctx.fillStyle = col.soft; ctx.fillRect(10, y, bw, 44);
    text(ctx, `Government has received ${money(total)} so far`, 18, y + 14, { color: col.ink, size: 12, weight: 800 });
    text(ctx, k >= 3 ? `Shopper pays ${money(250 * (1 + R))}: ${money(250)} + ${money(250 * R)} tax = ${money(total)} collected ✓` : 'Tax is collected a bit at every step, never twice', 18, y + 31, { color: col.muted, size: 11 });
  };
  const say = ['Start: nothing has been sold yet.', 'The grower sells for $100 plus $10 tax. It paid no tax on purchases, so it sends the full $10.', 'The maker bought for $100 (paid $10 tax) and sells for $160 (charges $16). It claims back its $10 and sends only the $6 difference.', 'The shop bought for $160 (paid $16) and sells for $250 (charges $25). It sends $9. The three payments add up to $25, which is 10% of the final $250: the tax is on the value each business added, not on the whole price again and again.'];
  const show = () => { out.textContent = say[k]; cv.redraw(); };
  show();
  return { step(i) { k = Math.max(0, Math.min(3, i)); show(); } };
}
