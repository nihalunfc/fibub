// Class 12 Alternating Current: why electricity is sent at high voltage. A power station sends P = 10 MW along a line
// of total resistance 2 ohm. The current is I = P/V and the heat lost is I^2 R, so raising the voltage 10 times cuts the
// loss 100 times. That is why transformers step the voltage up before the long line (e.g. 400 kV) and down at the town.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  const LEVELS = [11, 33, 66, 132, 220, 400]; let idx = 0, t = 0;
  const P = 10e6, Rl = 2;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 280, label: 'Power sent along a line at different voltages with the heat lost shown' });
  const ctl = row(host);
  slider(ctl, { label: 'Line voltage (kV)', min: 0, max: 5, step: 1, value: idx, fmt: (v) => `${LEVELS[v]} kV`, oninput: (v) => { idx = v; upd(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  const I = () => P / (LEVELS[idx] * 1000), loss = () => I() ** 2 * Rl;
  function upd() { out.innerHTML = `I = P/V = <b>${I().toFixed(0)} A</b>. Heat lost in the line = I²R = <b>${(loss() / 1000).toFixed(0)} kW</b>, which is <b>${((loss() / P) * 100).toFixed(2)}%</b> of the 10 MW sent. Ten times the voltage, one hundredth of the loss.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `10 MW sent at ${LEVELS[idx]} kV over a 2 Ω line`, col);
    const y = top + 50, x0 = 36, x1 = w - 36;
    // line: thickness shows current, glow shows loss
    const lw = 2 + 12 * (I() / 910);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
    const frac = Math.min(1, loss() / P);
    ctx.save(); ctx.globalAlpha = Math.min(0.9, 0.12 + frac * 3); ctx.strokeStyle = col.s[3]; ctx.lineWidth = lw + 8; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
    for (let k = 0; k < 8; k++) { const x = x0 + ((t * 40 + k * (x1 - x0) / 8) % (x1 - x0)); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); }
    text(ctx, 'power station', x0, y - 18, { color: col.muted, size: 11 }); text(ctx, 'city', x1, y - 18, { color: col.muted, size: 11, align: 'right' });
    // bars: delivered vs lost
    const bx = 36, bw = w - 72, by = y + 50, bh = 26;
    ctx.fillStyle = col.s[2]; ctx.fillRect(bx, by, bw * (1 - Math.min(1, frac)), bh);
    ctx.fillStyle = col.s[3]; ctx.fillRect(bx + bw * (1 - Math.min(1, frac)), by, Math.max(2, bw * Math.min(1, frac)), bh);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    text(ctx, `delivered ${((1 - frac) * 10).toFixed(2)} MW`, bx + 6, by + bh + 16, { color: col.s[2], size: 12, weight: 700 });
    text(ctx, `lost as heat ${(loss() / 1e6).toFixed(3)} MW`, bx + bw, by + bh + 36, { color: col.s[3], size: 12, weight: 700, align: 'right' });
    text(ctx, 'current in the line (thick = large)', bx, y + 28, { color: col.muted, size: 11 });
  };
  upd();
}
