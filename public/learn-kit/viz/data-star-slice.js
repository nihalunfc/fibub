// A star schema you can slice: the fact table sits in the middle, three dimensions around it. Tap a value in any
// dimension to filter; the matching fact rows light up and the total updates. Filters on different dimensions combine
// with AND. Try: Region = West, then Product = Book, and read how many fact rows are left. Data are made up.
import { canvas, text, row, choice, readout, title } from '../kit.js';

const F = [[1, 'Pen', 'West', 'Jan', 40], [2, 'Book', 'East', 'Jan', 90], [3, 'Pen', 'East', 'Feb', 30], [4, 'Lamp', 'West', 'Feb', 120], [5, 'Book', 'West', 'Feb', 60], [6, 'Pen', 'West', 'Mar', 25], [7, 'Lamp', 'East', 'Mar', 80], [8, 'Book', 'East', 'Mar', 70]];
const DIM = { prod: ['Product', ['Pen', 'Book', 'Lamp'], 1], reg: ['Region', ['West', 'East'], 2], mon: ['Month', ['Jan', 'Feb', 'Mar'], 3] };
export default function (host) {
  const f = { prod: null, reg: null, mon: null };
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'A star schema with a fact table and three filterable dimensions' });
  const rows = Object.entries(DIM).map(([k, [nm, vals]]) => { const r = row(host); choice(r, nm, [[null, 'All'], ...vals.map((v) => [v, v])], null, (v) => { f[k] = v; draw(); }); return r; });
  const out = readout(host);
  const ok = (r) => Object.entries(DIM).every(([k, d]) => f[k] === null || r[d[2]] === f[k]);
  function draw() { const m = F.filter(ok), tot = m.reduce((s, r) => s + r[4], 0); out.innerHTML = `<b>${m.length} of ${F.length} fact rows</b> match, total sales <b>${tot}</b>. The fact table stores keys and numbers; each dimension holds the descriptive words you filter and group by. Pick nothing to see the grand total.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Fact table in the middle, dimensions around it', col);
    const m = F.filter(ok);
    const cx = w / 2, cy = h / 2 + 8, bw = 62;
    const dimBox = (k, x, y, c) => { const d = DIM[k]; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, 18 + d[1].length * 15); text(ctx, 'dim_' + d[0].toLowerCase(), x + 4, y + 9, { color: c, size: 10, weight: 700, fit: false }); d[1].forEach((v, i) => { const on = f[k] === v; if (on) { ctx.fillStyle = c; ctx.globalAlpha = 0.25; ctx.fillRect(x + 1, y + 18 + i * 15, bw - 2, 14); ctx.globalAlpha = 1; } text(ctx, v, x + 6, y + 25 + i * 15, { color: col.ink, size: 10.5, weight: on ? 700 : 400, fit: false }); }); ctx.beginPath(); };
    // lines
    ctx.strokeStyle = col.line; ctx.lineWidth = 2; [[cx, 60], [24 + bw, cy], [w - 24 - bw, cy]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); });
    dimBox('prod', cx - bw / 2, 34, col.s[0]); dimBox('reg', 10, cy - 24, col.s[1]); dimBox('mon', w - 10 - bw, cy - 28, col.s[2]);
    const fw = Math.min(200, w - 2 * (bw + 24)), fx = cx - fw / 2, fy = cy - 36;
    ctx.fillStyle = col.panel; ctx.fillRect(fx, fy, fw, 18 + F.length * 11); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(fx, fy, fw, 18 + F.length * 11);
    text(ctx, 'fact_sales', fx + 4, fy + 9, { color: col.ink, size: 10, weight: 700, fit: false });
    F.forEach((r, i) => { const on = ok(r); if (on) { ctx.fillStyle = col.good; ctx.globalAlpha = 0.25; ctx.fillRect(fx + 1, fy + 18 + i * 11, fw - 2, 11); ctx.globalAlpha = 1; } text(ctx, `${r[1].slice(0, 3)}·${r[2].slice(0, 1)}·${r[3]}  ${r[4]}`, fx + 6, fy + 23.5 + i * 11, { color: on ? col.ink : col.muted, size: 9.5, weight: on ? 700 : 400, fit: false }); });
    const tot = m.reduce((s, r) => s + r[4], 0); ctx.fillStyle = col.s[2]; ctx.fillRect(10, h - 30, w - 20, 22); text(ctx, `SUM(sales) = ${tot}  from ${m.length} fact rows`, w / 2, h - 19, { color: '#fff', size: 12.5, weight: 700, align: 'center' });
  };
  draw();
}
