// Class 12 Maths, Matrices: matrix multiplication is the bill at a tea stall. Rows of Q are what each family bought; the column p holds the
// prices; each family's bill is (row of Q) times (column p). Move the price sliders and the bills change.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const Q = [[4, 2, 3], [2, 5, 1]], NAMES = ['chai', 'samosa', 'vada pav'], FAM = ['Sharma family', 'Iyer family'];
export default function (host) {
  const p = [10, 15, 20];
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 190, label: 'Quantities bought by two families multiplied by prices to give each bill' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Bill = Q × p (rows of Q times the price column)', col), cs = Math.min(34, (w - 150) / 4.4), y = top + 38;
    const xq = 80, xp = xq + 3 * cs + 30, xr = xp + cs + 30;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    [[xq, 3, 2], [xp, 1, 3], [xr, 1, 2]].forEach(([x, c, r]) => { ctx.beginPath(); ctx.moveTo(x + 5, y - 3); ctx.lineTo(x, y - 3); ctx.lineTo(x, y + r * cs + 3); ctx.lineTo(x + 5, y + r * cs + 3); ctx.moveTo(x + c * cs - 5, y - 3); ctx.lineTo(x + c * cs, y - 3); ctx.lineTo(x + c * cs, y + r * cs + 3); ctx.lineTo(x + c * cs - 5, y + r * cs + 3); ctx.stroke(); });
    ['chai', 'samosa', 'vada'].forEach((n, j) => text(ctx, n, xq + j * cs + cs / 2, y - 14, { color: col.muted, size: 9.5, align: 'center' })); text(ctx, 'price ₹', xp + cs / 2, y - 14, { color: col.s[2], size: 10, weight: 700, align: 'center' }); text(ctx, 'bill ₹', xr + cs / 2, y - 14, { color: col.s[3], size: 10, weight: 700, align: 'center' });
    FAM.forEach((f, i) => text(ctx, f.split(' ')[0], xq - 8, y + i * cs + cs / 2, { color: col.s[i * 2], size: 11, weight: 700, align: 'right' }));
    Q.forEach((r, i) => r.forEach((v, j) => text(ctx, String(v), xq + j * cs + cs / 2, y + i * cs + cs / 2, { color: col.ink, size: 14, weight: 600, align: 'center' })));
    p.forEach((v, j) => text(ctx, String(v), xp + cs / 2, y + j * cs + cs / 2 - 0, { color: col.ink, size: 14, weight: 600, align: 'center' }));
    text(ctx, '×', xq + 3 * cs + 15, y + 1.5 * cs, { color: col.ink, size: 16, weight: 700, align: 'center' }); text(ctx, '=', xp + cs + 15, y + cs, { color: col.ink, size: 16, weight: 700, align: 'center' });
    Q.forEach((r, i) => text(ctx, String(r.reduce((s, v, j) => s + v * p[j], 0)), xr + cs / 2, y + i * cs + cs / 2, { color: col.s[3], size: 15, weight: 800, align: 'center' }));
    out.innerHTML = Q.map((r, i) => `<b>${FAM[i]}</b>: ${r.map((v, j) => `${v}×${p[j]}`).join(' + ')} = ₹${r.reduce((s, v, j) => s + v * p[j], 0)}`).join('<br>') + '<br>One row of Q meets the one column of prices: that is why the number of columns of Q must equal the number of rows of p.';
  };
  const r = row(host);
  NAMES.forEach((n, j) => slider(r, { label: `Price of ${n} (₹)`, min: 5, max: 40, step: 1, value: p[j], fmt: String, oninput: (v) => { p[j] = v; cv.redraw(); } }));
  cv.redraw();
}
