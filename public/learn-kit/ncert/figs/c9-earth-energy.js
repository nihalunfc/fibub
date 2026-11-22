// Class 9 Earth as a system: a one-layer model of Earth's energy balance. Sunlight (340 W/m2 averaged over the
// whole sphere = solar constant 1361 / 4) is partly reflected (albedo a). The rest, A = 340(1-a), must leave as
// infrared or Earth keeps warming. With no atmosphere the surface temperature is Te = (A/sigma)^(1/4) = 255 K (-18 C).
// A layer that absorbs a fraction e of the surface infrared (greenhouse gases) sends half of what it absorbs back
// down, so the surface is hotter: sigma*Ts^4 = A * 2/(2-e). Real Earth: a = 0.30, e = about 0.78, Ts = 288 K (15 C).
import { canvas, text, title, arrow, row, slider, readout, button } from '../../kit.js';

const SIG = 5.670e-8;
export default function (host) {
  let a = 0.3, e = 0.78, sun = 100;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'Energy balance of the Earth with albedo and greenhouse sliders and the resulting surface temperature' });
  const ctl = row(host);
  const sA = slider(ctl, { label: 'Reflectivity (albedo)', min: 0, max: 0.9, step: 0.01, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = v; go(); } });
  const sG = slider(ctl, { label: 'Greenhouse gases', min: 0, max: 1, step: 0.01, value: e, fmt: (v) => (v * 100).toFixed(0) + '%', oninput: (v) => { e = v; go(); } });
  const ctl2 = row(host);
  button(ctl2, 'Earth today', () => { a = 0.3; e = 0.78; sA.set(a); sG.set(e); go(); });
  button(ctl2, 'No greenhouse gases', () => { e = 0; sG.set(0); go(); });
  const out = readout(host);
  function calc() {
    const In = 1361 * (sun / 100) / 4, A = In * (1 - a), U = A * 2 / (2 - e);
    return { In, A, U, Ts: Math.pow(U / SIG, 0.25), Te: Math.pow(A / SIG, 0.25) };
  }
  function go() { const r = calc(); out.innerHTML = `Sunlight absorbed: <b>${r.A.toFixed(0)} W/m²</b>. Surface temperature: <b>${(r.Ts - 273.15).toFixed(0)} °C</b> (without any greenhouse effect it would be ${(r.Te - 273.15).toFixed(0)} °C). ${r.Ts - 273.15 < 0 ? 'Below 0 °C: the oceans freeze, which makes the albedo higher still.' : r.Ts - 273.15 > 40 ? 'Far too hot for most life.' : 'Comfortable range for liquid water and life.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Energy in and out (W/m², whole-Earth average)', col) + 8;
    const r = calc(), wd = (f) => 1.5 + f / 70;
    const ySp = top, yAt = top + (h - top) * 0.42, ySf = h - 40;
    ctx.fillStyle = col.soft; ctx.fillRect(0, yAt - 16, w, 34);
    text(ctx, 'atmosphere', 8, yAt + 1, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.4; ctx.fillRect(0, ySf, w, 40); ctx.globalAlpha = 1;
    text(ctx, 'land and sea', 8, ySf + 24, { color: col.ink, size: 11, weight: 700 });
    const x1 = w * 0.2, x2 = w * 0.36, x3 = w * 0.54, x4 = w * 0.7, x5 = w * 0.86;
    arrow(ctx, x1, ySp + 8, x1, ySf - 2, col.s[2], wd(r.In), 10); text(ctx, `${r.In.toFixed(0)} in`, x1 + 4, ySp + 20, { color: col.s[2], size: 10.5, weight: 700 });
    arrow(ctx, x2 - 6, yAt - 40, x2 - 6, ySp + 8, col.s[2], wd(r.In * a), 8); text(ctx, `${(r.In * a).toFixed(0)} reflected`, x2 - 2, ySp + 30, { color: col.s[2], size: 10, weight: 700 });
    arrow(ctx, x3, ySf - 2, x3, yAt + 20, col.s[1], wd(r.U), 10); text(ctx, `${r.U.toFixed(0)} heat up`, x3 + 4, ySf - 16, { color: col.s[1], size: 10, weight: 700 });
    arrow(ctx, x4, yAt - 18, x4, ySp + 8, col.s[1], wd(r.U * (1 - e) + e * r.U / 2), 10); text(ctx, `${(r.U * (1 - e) + e * r.U / 2).toFixed(0)} to space`, x4 + 4, ySp + 20, { color: col.s[1], size: 10, weight: 700 });
    arrow(ctx, x5, yAt + 20, x5, ySf - 2, col.s[3], wd(e * r.U / 2), 10); text(ctx, `${(e * r.U / 2).toFixed(0)} back`, x5 - 8, yAt + 32, { color: col.s[3], size: 10, weight: 700, align: 'right' });
    // thermometer
    const tx = w - 18, y0 = yAt + 70, y1 = ySf - 24, T = r.Ts - 273.15, f = Math.max(0, Math.min(1, (T + 40) / 100));
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(tx - 4, y0, 8, y1 - y0);
    ctx.fillStyle = col.s[1]; ctx.fillRect(tx - 4, y1 - f * (y1 - y0), 8, f * (y1 - y0));
    const z = y1 - (40 / 100) * (y1 - y0); ctx.fillStyle = col.ink; ctx.fillRect(tx - 7, z, 14, 1);
    text(ctx, `${T.toFixed(0)} °C`, tx + 4, y0 - 10, { color: col.ink, size: 11, weight: 700, align: 'right' });
    text(ctx, 'surface', tx + 4, y0 - 24, { color: col.muted, size: 10, align: 'right' });
  };
  go();
}
