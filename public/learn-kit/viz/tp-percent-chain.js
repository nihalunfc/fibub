// Percent changes in a chain: start at 100 and apply up to three changes one after another. Each bar is the value after that
// step. The total change is NOT the sum of the percents (a rise of 20% then a fall of 20% leaves you 4% down), because each
// percent is taken of a different base. Use the toggle to apply the same changes in reverse order: the result does not move.
import { canvas, row, slider, choice, readout, text, title } from '../kit.js';

const sg = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);
export default function (host) {
  let ps = [20, -20, 10], rev = false;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 290, label: 'Bars showing a value after successive percent changes' });
  const r = row(host);
  ps.forEach((v, i) => slider(r, { label: 'Change ' + (i + 1), min: -50, max: 100, step: 5, value: v, fmt: (x) => sg(x) + '%', oninput: (x) => { ps[i] = x; cv.redraw(); show(); } }));
  const r2 = row(host); choice(r2, 'Order', [[false, 'As set'], [true, 'Reversed']], rev, (v) => { rev = v; cv.redraw(); show(); });
  const out = readout(host);
  const seq = () => (rev ? [...ps].reverse() : ps), vals = () => { const a = [100]; seq().forEach((p) => a.push(a[a.length - 1] * (1 + p / 100))); return a; };
  const show = () => { const a = vals(), fin = a[3], sum = ps.reduce((x, y) => x + y, 0), mult = ps.map((p) => 1 + p / 100).reduce((x, y) => x * y, 1);
    out.innerHTML = `Multiply: ${ps.map((p) => (1 + p / 100).toFixed(2)).join(' × ')} = <b>${mult.toFixed(4)}</b>, so 100 becomes <b>${fin.toFixed(2)}</b> (a net change of <b>${sg(+(fin - 100).toFixed(2))}%</b>). Adding the percents would wrongly give ${sg(sum)}%. Reversing the order changes the path but not the end.`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Start 100, then three changes', col);
    const a = vals(), s = seq(), mx = Math.max(150, ...a) * 1.1, top = 52, bot = h - 44, bw = (w - 40) / 4;
    a.forEach((v, i) => { const x = 14 + i * (bw + 4), hh = v / mx * (bot - top); ctx.fillStyle = i === 0 ? col.muted : s[i - 1] >= 0 ? col.good : col.bad; ctx.globalAlpha = 0.7; ctx.fillRect(x, bot - hh, bw, hh); ctx.globalAlpha = 1;
      text(ctx, v.toFixed(1), x + bw / 2, bot - hh - 8, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
      text(ctx, i === 0 ? 'start' : sg(s[i - 1]) + '%', x + bw / 2, bot + 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); if (i) text(ctx, '× ' + (1 + s[i - 1] / 100).toFixed(2), x + bw / 2, bot + 28, { color: col.muted, size: 10, align: 'center' }); });
    const y = bot - 100 / mx * (bot - top); ctx.strokeStyle = col.ink; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(w - 10, y); ctx.stroke(); ctx.setLineDash([]);
  };
  show();
}
