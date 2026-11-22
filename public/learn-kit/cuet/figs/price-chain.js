// 3.4 Cost price → marked price → selling price. Mark-up on cost, discount on the marked price; profit is on cost.
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 260, min: 190, label: 'Bars for cost price, marked price and selling price' });
  let cp = 800, up = 40, off = 20;
  const ctl = row(host);
  slider(ctl, { label: 'Cost price (₹)', min: 100, max: 2000, step: 50, value: cp, fmt: (v) => `₹${v}`, oninput: (v) => { cp = v; go(); } });
  slider(ctl, { label: 'Mark-up on cost', min: 0, max: 100, step: 5, value: up, fmt: (v) => `${v}%`, oninput: (v) => { up = v; go(); } });
  slider(ctl, { label: 'Discount on marked price', min: 0, max: 60, step: 5, value: off, fmt: (v) => `${v}%`, oninput: (v) => { off = v; go(); } });
  const out = readout(host);
  const vals = () => { const mp = cp * (1 + up / 100), sp = mp * (1 - off / 100); return { mp, sp, pr: ((sp - cp) / cp) * 100 }; };
  const go = () => {
    cv.redraw(); const { mp, sp, pr } = vals();
    out.innerHTML = `MP = ₹${+mp.toFixed(2)}, SP = ₹${+sp.toFixed(2)}. ${pr >= 0 ? 'Profit' : 'Loss'} = <b>${Math.abs(pr).toFixed(2)}%</b> of cost (multiplier ${(1 + up / 100).toFixed(2)} × ${(1 - off / 100).toFixed(2)} = ${((1 + up / 100) * (1 - off / 100)).toFixed(4)}).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { mp, sp } = vals(), max = 4000, x0 = 110, bw = w - x0 - 70, rh = (h - 12) / 3;
    [['Cost price', cp, col.s[7] || col.muted], ['Marked price', mp, col.s[0]], ['Selling price', sp, sp >= cp ? col.s[2] : col.s[1]]].forEach(([lab, v, c], i) => {
      const y = 6 + i * rh;
      text(ctx, lab, x0 - 8, y + rh / 2, { color: col.ink, size: 12, align: 'right' });
      ctx.fillStyle = c; ctx.fillRect(x0, y + 6, (v / max) * bw, rh - 12);
      text(ctx, `₹${+v.toFixed(0)}`, x0 + (v / max) * bw + 6, y + rh / 2, { color: col.ink, size: 12, weight: 600 });
    });
    const sx = x0 + (cp / max) * bw; ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(sx, 4); ctx.lineTo(sx, h - 4); ctx.stroke(); ctx.setLineDash([]);
  };
  go();
}
