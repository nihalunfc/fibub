// 3.10 Reading a chart: the same made-up data as a table, a bar chart and a pie chart. Switch view and read the
// percent change, share and average the questions ask for.
import { canvas, text, row, choice, readout } from '../../kit.js';

export const DATA = { years: ['2021', '2022', '2023', '2024', '2025'], sales: [120, 150, 135, 180, 215] }; // thousand units, made up
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 220, label: 'Made-up yearly sales of a bicycle maker as a bar or pie chart' });
  let view = 'bars';
  const ctl = row(host);
  choice(ctl, 'Show as', ['bars', 'pie'], view, (v) => { view = v; cv.redraw(); });
  const out = readout(host);
  const tot = DATA.sales.reduce((a, b) => a + b, 0);
  out.innerHTML = `Biggest rise: 2023 → 2024, (180 − 135) ÷ 135 = <b>33.3%</b>. Average = ${tot} ÷ 5 = <b>${tot / 5}</b> thousand. 2025's share of the five years = 215 ÷ ${tot} = <b>${((215 / tot) * 100).toFixed(1)}%</b>.`;
  cv.draw = (ctx, w, h, col) => {
    const n = DATA.sales.length;
    if (view === 'bars') {
      const B = h - 30, T = 24, max = 250, bw = (w - 60) / n;
      DATA.sales.forEach((v, i) => {
        const x = 40 + i * bw, y = B - ((B - T) * v) / max;
        ctx.fillStyle = col.s[0]; ctx.fillRect(x + bw * 0.15, y, bw * 0.7, B - y);
        text(ctx, String(v), x + bw / 2, y - 9, { color: col.ink, size: 12, weight: 600, align: 'center' });
        text(ctx, DATA.years[i], x + bw / 2, B + 12, { color: col.muted, size: 11, align: 'center' });
      });
      text(ctx, 'Bicycles sold (thousands, made-up data)', 40, 10, { color: col.muted, size: 11 });
    } else {
      let a0 = -Math.PI / 2; const cx = w * 0.38, cy = h / 2 + 6, R = Math.min(w * 0.3, h * 0.4);
      DATA.sales.forEach((v, i) => {
        const a1 = a0 + (v / tot) * Math.PI * 2;
        ctx.fillStyle = col.s[i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fill();
        ctx.fillRect(w * 0.72, 30 + i * 22, 12, 12);
        text(ctx, `${DATA.years[i]}: ${((v / tot) * 100).toFixed(1)}% (${((v / tot) * 360).toFixed(0)}°)`, w * 0.72 + 18, 36 + i * 22, { color: col.ink, size: 11 });
        a0 = a1;
      });
    }
  };
  cv.redraw();
}
