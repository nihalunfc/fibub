// Class 12 Microbes in Human Welfare: a biogas (gobar gas) plant. Slurry of cattle dung and water ferments in a closed digester; methanogenic bacteria make biogas (about 55-65 % methane, the rest CO2),
// which collects under a floating gas holder. Yield assumed 0.036 cubic metres of gas per kg of fresh dung (a typical value); 1 cubic metre of biogas gives about as much heat as 0.4 kg of LPG.
import { canvas, text, title, line, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let dung = 40, stored = 0, bub = [];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A biogas plant: dung slurry in a digester, bubbles of gas rising and a gas holder filling' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Dung added per day', min: 10, max: 100, step: 5, value: dung, fmt: (v) => v + ' kg', oninput: (v) => { dung = v; go(); } });
  const anim = loop(host, (dt) => { stored = Math.min(1, stored + dt * (dung * 0.036 / 3.6) * 0.08); if (Math.random() < dt * (3 + dung / 12)) bub.push([0.25 + Math.random() * 0.5, 0]); bub = bub.map(([x, y]) => [x + (Math.random() - 0.5) * 0.01, y + dt * 0.5]).filter(([, y]) => y < 1); cv.redraw(); });
  anim.button(ctl); button(ctl, 'Use the gas (cooking)', () => { stored = 0; });
  const go = () => { const gas = dung * 0.036; ro.textContent = `${dung} kg of dung a day gives about ${gas.toFixed(2)} m³ of biogas (about ${(gas * 0.4).toFixed(2)} kg of LPG worth of heat), enough to cook for roughly ${(gas / 0.3).toFixed(1)} hours on a stove using 0.3 m³ an hour. The leftover slurry is a good manure. The gas is mostly methane (55 to 65 %) and CO₂.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Biogas plant', col), dx = w * 0.18, dw = w * 0.64, dy = t0 + 110, dh = h - dy - 24;
    ctx.fillStyle = col.s[4] || col.muted; ctx.globalAlpha = 0.4; ctx.fillRect(dx, dy, dw, dh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.strokeRect(dx, dy, dw, dh);
    text(ctx, 'digester: slurry (dung + water)', w / 2, dy + dh - 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'methanogens work without air', w / 2, dy + dh - 28, { color: col.muted, size: 10, align: 'center' });
    const hh = 34 + stored * 56, hy = dy - hh;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(dx + 8, hy, dw - 16, hh); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.strokeRect(dx + 8, hy, dw - 16, hh);
    text(ctx, `gas holder: ${(stored * 100).toFixed(0)} % full`, w / 2, hy + hh / 2, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    line(ctx, [[w / 2, hy], [w / 2, hy - 18], [w - 30, hy - 18]], col.ink, 3); text(ctx, 'to kitchen', w - 12, hy - 28, { color: col.muted, size: 10.5, align: 'right' });
    line(ctx, [[22, dy - 22], [22, dy + 36], [dx, dy + 36]], col.ink, 3); text(ctx, 'dung in', 22, dy - 32, { color: col.muted, size: 10.5 });
    line(ctx, [[dx + dw, dy + dh - 34], [w - 18, dy + dh - 34]], col.ink, 3); text(ctx, 'manure out', w - 12, dy + dh - 44, { color: col.muted, size: 10, align: 'right' });
    bub.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(dx + x * dw, dy + dh - 40 - y * (dh - 46), 3, 0, 7); ctx.strokeStyle = col.bg; ctx.lineWidth = 1.5; ctx.stroke(); });
  };
  go();
}
