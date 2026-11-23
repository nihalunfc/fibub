// Class 8 Algebra Play: forming and solving an equation from a story. A taxi charges Rs 20 to start plus Rs 12 for every km:
// fare = 20 + 12k. Given the fare, find k by trial, then see the equation 20 + 12k = fare solve it exactly.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

const TARGET = [68, 92, 116, 140];
export default function (host) {
  let k = 3, ti = 2;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A taxi fare bar and a target fare to match by choosing the distance' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Distance k (km)', min: 0, max: 15, step: 1, value: k, fmt: (v) => v + ' km', oninput: (v) => { k = v; sync(); } });
  button(ctl, 'New fare', () => { ti = (ti + 1) % TARGET.length; sync(); });
  const out = readout(host);
  const fare = () => 20 + 12 * k, T = () => TARGET[ti];
  function sync() { const d = fare() - T(); out.innerHTML = `Fare = 20 + 12 × ${k} = <b>₹ ${fare()}</b>. Target ₹ ${T()}: ` + (d === 0 ? `<b>match!</b> The equation 20 + 12k = ${T()} gives 12k = ${T() - 20}, so k = ${(T() - 20) / 12}.` : d < 0 ? 'too low, go further.' : 'too high, go less far.'); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Taxi: fare = 20 + 12k', col), L = 16, W = w - 32, mx = 210, f = fare(), y = top + 30;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(L, y, W, 36);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.7; ctx.fillRect(L, y, (20 / mx) * W, 36); ctx.globalAlpha = 1;
    for (let i = 0; i < k; i++) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.65; ctx.fillRect(L + ((20 + 12 * i) / mx) * W + 1, y, (12 / mx) * W - 2, 36); ctx.globalAlpha = 1; }
    text(ctx, '₹20', L + (10 / mx) * W, y + 18, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    const tx = L + (T() / mx) * W; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(tx, y - 10); ctx.lineTo(tx, y + 48); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'target ₹' + T(), Math.min(tx, w - 50), y - 16, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'fare so far ₹' + f, L, y + 62, { color: f === T() ? col.s[2] : col.ink, size: 14, weight: 700 });
    text(ctx, 'Each blue block is one km = ₹12; the orange block is the ₹20 start.', w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  sync();
}
