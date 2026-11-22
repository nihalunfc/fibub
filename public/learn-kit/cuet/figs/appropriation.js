// 10.1 Profit and loss appropriation: net profit flows out to interest on capital and salaries first; what is
// left (divisible profit) is split in the profit-sharing ratio. A stacked bar shows each partner's total.
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Stacked bars showing each partner’s interest, salary and share of profit' });
  let np = 150000, ioc = 6, sal = 24000, ra = 3, rb = 2;
  const capA = 400000, capB = 200000;
  const ctl = row(host);
  slider(ctl, { label: 'Net profit (₹)', min: 60000, max: 300000, step: 10000, value: np, fmt: (v) => `₹${v.toLocaleString('en-IN')}`, oninput: (v) => { np = v; go(); } });
  slider(ctl, { label: 'Interest on capital', min: 0, max: 12, step: 1, value: ioc, fmt: (v) => `${v}%`, oninput: (v) => { ioc = v; go(); } });
  slider(ctl, { label: "B's salary a year (₹)", min: 0, max: 60000, step: 6000, value: sal, fmt: (v) => `₹${v.toLocaleString('en-IN')}`, oninput: (v) => { sal = v; go(); } });
  const out = readout(host);
  const calc = () => { const ia = (capA * ioc) / 100, ib = (capB * ioc) / 100, div = np - ia - ib - sal; return { ia, ib, div, sa: (div * ra) / (ra + rb), sb: (div * rb) / (ra + rb) }; };
  const go = () => {
    cv.redraw(); const c = calc(), f = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`;
    out.innerHTML = `Capitals: A ₹4,00,000, B ₹2,00,000; ratio 3 : 2. Interest A ${f(c.ia)}, B ${f(c.ib)}; B's salary ${f(sal)}. Divisible profit = ${f(c.div)}${c.div < 0 ? ' (a loss, shared 3 : 2; the deed would decide if interest is allowed only out of profits)' : ''}: A ${f(c.sa)}, B ${f(c.sb)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const c = calc(), max = 300000, x0 = 40, bw = w - x0 - 20, rows = [['A', [c.ia, 0, c.sa]], ['B', [c.ib, sal, c.sb]]], rh = (h - 50) / 2;
    rows.forEach(([lab, parts], i) => {
      let x = x0; const y = 10 + i * rh;
      text(ctx, lab, 20, y + rh / 2, { color: col.ink, size: 14, weight: 700, align: 'center' });
      parts.forEach((v, k) => { const ww = (Math.max(0, v) / max) * bw; ctx.fillStyle = col.s[k === 0 ? 0 : k === 1 ? 3 : 2]; ctx.fillRect(x, y + 8, ww, rh - 16); x += ww; });
      text(ctx, `₹${Math.round(parts.reduce((a, b) => a + b, 0)).toLocaleString('en-IN')}`, x + 6, y + rh / 2, { color: col.ink, size: 12, weight: 600 });
    });
    [[col.s[0], 'Interest on capital'], [col.s[3], 'Salary'], [col.s[2], 'Share of profit']].forEach(([cc, t], k) => { const kx = x0 + k * Math.min(140, bw / 3); ctx.fillStyle = cc; ctx.fillRect(kx, h - 22, 10, 10); text(ctx, t, kx + 14, h - 17, { color: col.ink, size: 11 }); });
  };
  go();
}
