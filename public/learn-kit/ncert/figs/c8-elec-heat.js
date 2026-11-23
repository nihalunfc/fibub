// Class 8 Science, Electricity: the heating effect of current. A current passing through a wire heats it:
// heat H = I x I x R x t (joules; I in amperes, R in ohms, t in seconds). Double the current and the heat is four times.
// A thin wire (high resistance) heats more than a thick one. The wire glows from grey to dull red, orange and white-yellow as it
// gets hotter; real heater and bulb filaments are made of materials that stay solid at those temperatures.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let I = 2, thin = true, t = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 290, label: 'A wire that glows redder as the current rises' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Wire', [['thin', 'Thin (R = 5 Ω)'], ['thick', 'Thick (R = 1 Ω)']], 'thin', (v) => { thin = v === 'thin'; upd(); });
  slider(ctl, { label: 'Current', min: 0, max: 5, step: 0.5, value: I, fmt: (v) => `${v} A`, oninput: (v) => { I = v; upd(); } });
  const out = readout(host);
  const R = () => (thin ? 5 : 1);
  function upd() { out.innerHTML = `I = ${I} A, R = ${R()} Ω: heat each second = I² R = ${I}² × ${R()} = <b>${(I * I * R()).toFixed(1)} J</b> (a power of ${(I * I * R()).toFixed(1)} W). Double the current and the heat becomes 4 times. The thin wire glows because the same current heats it 5 times more.`; cv.redraw(); }
  function glow(p) { // p in watts -> colour
    const f = Math.min(1, p / 125); const r = 120 + 135 * Math.min(1, f * 2), g = f < 0.4 ? 60 * f : 24 + 200 * (f - 0.4) / 0.6, b = f < 0.8 ? 40 * f : 200 * (f - 0.8) / 0.2;
    return `rgb(${Math.round(r * (p > 0.5 ? 1 : 0.4))},${Math.round(g)},${Math.round(b)})`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Heating effect of current', col);
    const p = I * I * R(), y = h * 0.34;
    line(ctx, [[20, y + 24], [20, y], [50, y]], col.ink, 3); line(ctx, [[w - 20, y + 24], [w - 20, y], [w - 50, y]], col.ink, 3);
    const colr = p < 0.5 ? col.muted : glow(p);
    if (p > 4) { ctx.save(); ctx.globalAlpha = Math.min(0.5, p / 150); ctx.shadowColor = colr; ctx.shadowBlur = 24; line(ctx, [[50, y], [w - 50, y]], colr, thin ? 5 : 9); ctx.restore(); }
    const pts = []; for (let x = 50; x <= w - 50; x += 3) pts.push([x, y + Math.sin(x / 7) * 5 * (thin ? 1 : 0.6)]);
    line(ctx, pts, colr, thin ? 3 : 7);
    const temp = Math.round(25 + p * 9);
    text(ctx, `wire: about ${temp} °C (in this model)`, w / 2, y + 36, { color: col.ink, size: 11, align: 'center' });
    const by = h * 0.62, bw = w - 40;
    text(ctx, 'Heat made every second (J)', 20, by - 6, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = col.soft; ctx.fillRect(20, by + 4, bw, 16); ctx.fillStyle = col.bad; ctx.fillRect(20, by + 4, Math.max(2, bw * Math.min(1, p / 125)), 16);
    text(ctx, `${p.toFixed(1)} J`, 24, by + 12, { color: p > 20 ? '#fff' : col.ink, size: 10.5, weight: 700 });
    text(ctx, 'Heaters, irons, toasters and bulbs all use this effect.', 20, h - 14, { color: col.muted, size: 10.5 });
  };
  upd();
}
