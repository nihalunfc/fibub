// Class 8 Earth: the greenhouse effect with a one-layer model. Sunlight absorbed by Earth averages 240 W/m2 (1361 W/m2 solar constant, 30%
// reflected, spread over the whole sphere). With no atmosphere the surface would be at 255 K (-18 C). A greenhouse-gas layer absorbs a
// fraction e of the heat (infrared) leaving the surface and sends half of it back down. Balance gives sigma Ts^4 = 240 / (1 - e/2), so
// e = 0.78 gives about 288 K (15 C), Earth's natural average. More gas (bigger e) means a warmer surface.
import { canvas, text, title, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

const SIG = 5.67e-8;
export default function (host) {
  let e = 78, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Sunlight arriving, heat leaving the ground and a greenhouse gas layer sending some heat back' });
  const ctl = row(host);
  slider(ctl, { label: 'Greenhouse gases in the air', min: 0, max: 100, step: 1, value: e, fmt: (v) => (v === 78 ? '78% (natural today)' : `${v}%`), oninput: (v) => { e = v; say(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  const Ts = () => Math.pow(240 / (SIG * (1 - e / 200)), 0.25);
  const say = () => { const T = Ts() - 273.15; out.innerHTML = `Surface temperature: <b>${T.toFixed(0)} °C</b>. ${e === 0 ? 'With no greenhouse gases Earth would be about -18 °C, frozen.' : e === 78 ? 'This is the natural greenhouse effect that keeps Earth at about 15 °C.' : e > 78 ? 'More greenhouse gas traps more heat, so the planet warms. This is global warming.' : 'Less gas lets more heat escape, so it is colder.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The greenhouse effect', col);
    const gy = h * 0.78, ly = h * 0.38, Tm = Ts() - 273.15;
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.5; ctx.fillRect(0, gy, w, h - gy); ctx.globalAlpha = 1; text(ctx, 'Earth\'s surface', 10, gy + 14, { color: col.ink, size: 10.5, weight: 700 });
    ctx.save(); ctx.globalAlpha = 0.12 + 0.5 * e / 100; ctx.fillStyle = col.muted; ctx.fillRect(0, ly - 16, w, 32); ctx.restore(); text(ctx, 'greenhouse gas layer (CO₂, methane, water vapour)', w * 0.5, ly, { color: col.ink, size: 10, weight: 700, align: 'center' });
    for (let i = 0; i < 3; i++) arrow(ctx, 36 + i * 28, 36, 36 + i * 28 + 36, gy - 4, col.warn, 3, 9);
    text(ctx, 'sunlight in', 40, 30, { color: col.warn, size: 10.5, weight: 700 });
    const up = 1 - e / 100 * 0.5, back = e / 100 * 0.5;
    for (let i = 0; i < 3; i++) { const x = w * 0.58 + i * 28; arrow(ctx, x, gy - 4, x, ly + 22, col.bad, 2.6, 8); ctx.save(); ctx.globalAlpha = Math.max(0.15, 1 - e / 100); arrow(ctx, x + 4, ly - 20, x + 4, 40, col.bad, 2.6 * (1 - e / 160), 8); ctx.restore(); ctx.save(); ctx.globalAlpha = Math.max(0.1, e / 100); arrow(ctx, x - 6, ly + 20, x - 6, gy - 10, col.bad, 1.2 + 3.2 * e / 100, 8); ctx.restore(); }
    text(ctx, 'heat from ground', w * 0.58, gy - 14, { color: col.bad, size: 10, weight: 700, halo: col.panel }); text(ctx, 'some heat comes back down', w * 0.98, (ly + gy) / 2, { color: col.bad, size: 10, weight: 700, align: 'right', halo: col.panel });
    // thermometer
    const tx = w - 26, th = (gy - 50), f = Math.max(0, Math.min(1, (Tm + 40) / 90));
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(tx - 6, 40, 12, th); ctx.fillStyle = Tm > 0 ? col.bad : col.s[0]; ctx.fillRect(tx - 6, 40 + th * (1 - f), 12, th * f);
    text(ctx, `${Tm.toFixed(0)} °C`, tx, 32, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  say();
}
