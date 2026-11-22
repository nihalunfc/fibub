// Why a measure beats a stored percentage: the margin of the whole business is total profit ÷ total sales, which is NOT the
// average of each store's margin. Drag the big store's sales and watch the two answers move apart. Made-up stores.
import { canvas, text, title, row, slider, readout, choice } from '../kit.js';
import { money, pct } from './_biz.js';

const ST = [['Rideau', 500, 0.2], ['Queen', 300, 0.25], ['Forks', 120, 0.4], ['Online', 60, 0.1], ['Kiosk', 20, 0.6]];
export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 400, min: 320, label: 'Store margins and two ways to combine them' });
  const ctl = row(host);
  const S = { big: slider(ctl, { label: 'Rideau sales', min: 100, max: 2000, step: 50, value: 500, fmt: (v) => '$' + v + 'k', oninput: () => cv.redraw() }), m: slider(ctl, { label: 'Kiosk margin', min: 0.05, max: 0.9, step: 0.01, value: 0.6, fmt: (v) => pct(v), oninput: () => cv.redraw() }) };
  const out = readout(host);
  const stores = () => ST.map(([n, s, m], i) => [n, i === 0 ? S.big.value : s, i === 4 ? S.m.value : m]);
  cv.draw = (ctx, w, h, col) => {
    const d = stores(), tot = d.reduce((a, r) => a + r[1], 0), prof = d.reduce((a, r) => a + r[1] * r[2], 0), real = prof / tot, avg = d.reduce((a, r) => a + r[2], 0) / d.length;
    title(ctx, 'Margin by store', col);
    const L = 62, bw = w - L - 14, rh = (h - 120) / 5;
    d.forEach(([n, s, m], i) => {
      const y = 36 + i * rh;
      text(ctx, n, 8, y + rh / 2 - 4, { color: col.ink, size: 11, weight: 600, fit: false }); text(ctx, '$' + s + 'k', 8, y + rh / 2 + 9, { color: col.muted, size: 9.5, fit: false });
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25 + 0.75 * (s / Math.max(...d.map((r) => r[1]))); ctx.fillRect(L, y, bw * m, rh - 8); ctx.globalAlpha = 1;
      text(ctx, pct(m), L + bw * m + 4, y + (rh - 8) / 2, { color: col.ink, size: 11, fit: false });
    });
    const y0 = 36 + 5 * rh + 4;
    [['Average of the 5 margins', avg, col.s[1]], ['Total profit ÷ total sales', real, col.s[2]]].forEach(([n, v, c], i) => {
      const y = y0 + i * 28; ctx.fillStyle = c; ctx.fillRect(L, y, bw * v, 14);
      text(ctx, `${n}: ${pct(v, 1)}`, L, y + 24 - 6 + 4, { color: col.ink, size: 10.5, weight: 700, fit: false });
    });
    out.innerHTML = `Average of the margins <b>${pct(avg, 1)}</b>; real margin of the business <b>${pct(real, 1)}</b> (${money(prof * 1000)} ÷ ${money(tot * 1000)}). ` + (Math.abs(avg - real) > 0.03 ? `They differ by <b>${((avg - real) * 100).toFixed(1)} points</b>: a tiny store counts the same in the average but hardly any in the real total.` : 'Close this time, but only by luck: make Rideau bigger or the Kiosk margin higher.') + ' In DAX: <b>DIVIDE ( [Profit], [Sales] )</b>, never an average of a percentage column.';
  };
  cv.redraw();
}
