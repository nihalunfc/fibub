// Class 8 Science, Electricity: a fuse is a thin wire of a low-melting alloy placed in the circuit. If too much current
// flows (an overload from too many appliances, or a short circuit) the fuse wire heats up and melts first, breaking
// the circuit before the house wiring can overheat. Indian mains is 230 V, so current I = P / V.
// Each appliance has a power rating; total current = (sum of watts) / 230. Choose a fuse and add appliances.
import { canvas, text, title, line, dot, row, choice, button, readout, loop } from '../../kit.js';

const AP = [['Fan', 75], ['Lamp', 40], ['TV', 100], ['Iron', 1000], ['Geyser', 2000]];
export default function (host) {
  let rate = 5, on = AP.map(() => false), blown = false, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A household circuit with appliances and a fuse that melts when the current is too high' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Fuse', [[5, '5 A'], [10, '10 A'], [16, '16 A']], rate, (v) => { rate = v; blown = false; upd(); });
  const bs = AP.map(([n], i) => button(ctl, n + ': off', () => { on[i] = !on[i]; bs[i].textContent = n + (on[i] ? ': ON' : ': off'); upd(); }));
  button(ctl, 'Replace fuse', () => { blown = false; upd(); });
  const out = readout(host);
  const cur = () => AP.reduce((s, [, p], i) => s + (on[i] ? p : 0), 0) / 230;
  function upd() { if (cur() > rate) blown = true; out.innerHTML = blown ? `<b>The fuse has melted!</b> The current would have been ${cur().toFixed(1)} A, more than the ${rate} A rating, so the circuit is broken and everything is off. Switch something off and replace the fuse.` : `Current = total watts ÷ 230 V = <b>${cur().toFixed(2)} A</b>. Fuse rating ${rate} A. ${cur() > rate * 0.8 ? 'Close to the limit!' : 'Safe.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Fuse: the weak link', col);
    const I = cur(), y = h * 0.34, fx = w * 0.5;
    line(ctx, [[20, y], [fx - 36, y]], col.ink, 3); line(ctx, [[fx + 36, y], [w - 20, y]], col.ink, 3);
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(fx - 36, y - 12, 72, 24); ctx.strokeRect(fx - 36, y - 12, 72, 24);
    const heat = Math.min(1, I / rate);
    if (!blown) { const c = `rgb(${Math.round(120 + 135 * heat)},${Math.round(120 - 80 * heat)},${Math.round(120 - 100 * heat)})`; line(ctx, [[fx - 36, y], [fx + 36, y]], c, 2.5); if (heat > 0.8) { ctx.save(); ctx.globalAlpha = 0.5; ctx.shadowColor = '#f60'; ctx.shadowBlur = 14; line(ctx, [[fx - 36, y], [fx + 36, y]], '#f60', 3); ctx.restore(); } }
    else { line(ctx, [[fx - 36, y], [fx - 8, y + 2]], col.muted, 2.5); line(ctx, [[fx + 8, y - 2], [fx + 36, y]], col.muted, 2.5); text(ctx, 'melted', fx, y - 24, { color: col.bad, size: 11, weight: 700, align: 'center' }); }
    text(ctx, `fuse ${rate} A`, fx, y + 28, { color: col.muted, size: 10.5, align: 'center' });
    // appliances
    AP.forEach(([n, p], i) => { const x = 20 + (i + 0.5) * (w - 40) / AP.length, yy = h * 0.58; ctx.fillStyle = on[i] && !blown ? col.s[i] : col.soft; ctx.globalAlpha = on[i] && !blown ? 0.7 : 1; ctx.fillRect(x - 24, yy, 48, 34); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x - 24, yy, 48, 34); text(ctx, n, x, yy + 17, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, `${p} W`, x, yy + 48, { color: col.muted, size: 10, align: 'center' }); line(ctx, [[x, yy], [x, y + 44]], col.line, 1); });
    line(ctx, [[20, y + 44], [w - 20, y + 44]], col.line, 1);
    const by = h - 40, bw = w - 40; ctx.fillStyle = col.soft; ctx.fillRect(20, by, bw, 14);
    ctx.fillStyle = I > rate ? col.bad : col.s[2]; ctx.fillRect(20, by, Math.min(bw, bw * I / (rate * 1.5)), 14);
    const lx = 20 + bw / 1.5; line(ctx, [[lx, by - 4], [lx, by + 18]], col.ink, 2); text(ctx, `limit ${rate} A`, lx, by - 10, { color: col.ink, size: 10, align: 'center' });
    text(ctx, `now ${I.toFixed(1)} A`, 22, by + 28, { color: col.ink, size: 10.5 });
  };
  upd();
}
