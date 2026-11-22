// 8.4 Chart reader: drag across a bar chart to read months; each question lights the bars it needs.
import { canvas, row, choice, readout, text, title } from '../../kit.js';
const L = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], V = [80, 95, 70, 110, 120, 140];
const Q = {
  rise: { name: 'Biggest rise', use: [2, 3], say: 'Compare each bar with the one before it. The biggest jump is Mar to Apr: 110 − 70 = 40.' },
  pct: { name: 'Percent change', use: [0, 5], say: 'Jan 80 to Jun 140: change 60, divided by the start 80 = 75%. Dividing by 140 gives the trap 43%.' },
  avg: { name: 'Average', use: [0, 1, 2, 3, 4, 5], say: 'Total 80 + 95 + 70 + 110 + 120 + 140 = 615; 615 ÷ 6 = 102.5.' },
};
export default function (host) {
  let q = 'rise', hover = -1;
  const cv = canvas(host, { aspect: 0.55, max: 300, min: 220, label: 'Units sold per month, January to June' });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = (hover >= 0 ? `<b>${L[hover]}: ${V[hover]} units.</b> ` : '') + Q[q].say; };
  choice(row(host), 'Question', Object.entries(Q).map(([k, v]) => [k, v.name]), q, (v) => { q = v; go(); });
  let geo = null;
  cv.draw = (ctx, w, h, col) => {
    const l = 40, b = 26, t = 56, max = 160, bw = (w - l - 12) / V.length, y = (v) => h - b - (h - b - t) * v / max;
    geo = { l, bw };
    for (let v = 0; v <= max; v += 40) { ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(l, y(v)); ctx.lineTo(w - 8, y(v)); ctx.stroke(); text(ctx, String(v), l - 6, y(v), { color: col.muted, size: 10.5, align: 'right' }); }
    V.forEach((v, i) => { const on = Q[q].use.includes(i); ctx.fillStyle = on ? col.s[0] : col.line; ctx.fillRect(l + i * bw + bw * 0.18, y(v), bw * 0.64, h - b - y(v));
      if (i === hover) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(l + i * bw + bw * 0.18, y(v), bw * 0.64, h - b - y(v)); ctx.lineWidth = 1; }
      text(ctx, L[i], l + i * bw + bw / 2, h - 12, { color: col.muted, size: 11, align: 'center' }); });
    title(ctx, 'Units sold per month (no value labels, as on the test)', col);
  };
  const pick = (e) => { if (!geo) return; const rc = cv.c.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - rc.left, i = Math.floor((x - geo.l) / geo.bw); hover = i >= 0 && i < V.length ? i : -1; go(); };
  cv.c.addEventListener('pointermove', pick); cv.c.addEventListener('pointerdown', pick);
  go();
}
