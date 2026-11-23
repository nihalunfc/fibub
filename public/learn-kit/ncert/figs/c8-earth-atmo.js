// Class 8 Earth: layers of the atmosphere. Troposphere 0-12 km (weather, most of the air; temperature falls with height), stratosphere
// 12-50 km (ozone layer near 20-30 km warms it), mesosphere 50-85 km (coldest, meteors burn up), thermosphere above 85 km (very thin; auroras
// and the International Space Station at about 400 km). Standard-atmosphere values rounded (US Standard Atmosphere 1976): temperature in
// degrees C and pressure in hPa at the heights below.
import { canvas, text, title, line, dot, axes, row, slider, readout } from '../../kit.js';

const T = [[0, 15], [11, -56], [20, -56], [32, -44], [47, -2], [51, -2], [71, -58], [85, -92], [100, -78]];
const PR = [[0, 1013], [5.5, 505], [11, 226], [20, 55], [30, 12], [50, 0.8], [85, 0.004], [100, 0.0003]];
const LAY = [['Troposphere', 0, 12], ['Stratosphere', 12, 50], ['Mesosphere', 50, 85], ['Thermosphere', 85, 100]];
const interp = (pts, x, log) => { for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [a, b] = pts[i - 1], [c, d] = pts[i], f = (x - a) / (c - a); return log ? Math.exp(Math.log(b) + (Math.log(d) - Math.log(b)) * f) : b + (d - b) * f; } return pts[pts.length - 1][1]; };
export default function (host) {
  let alt = 10;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The layers of the atmosphere with temperature against height and a balloon at a chosen height' });
  const ctl = row(host);
  slider(ctl, { label: 'Height of the balloon', min: 0, max: 100, step: 1, value: alt, fmt: (v) => `${v} km`, oninput: (v) => { alt = v; say(); } });
  const out = readout(host);
  const say = () => { const p = interp(PR, alt, true), t = interp(T, alt), L = LAY.find((l) => alt <= l[2]) || LAY[3]; out.innerHTML = `At <b>${alt} km</b> you are in the <b>${L[0].toLowerCase()}</b>. Air temperature about <b>${Math.round(t)} °C</b>, pressure about <b>${p >= 10 ? Math.round(p) : p.toPrecision(2)} hPa</b> (${(p / 1013 * 100) >= 1 ? Math.round(p / 1013 * 100) : (p / 1013 * 100).toPrecision(1)}% of sea level). ${alt >= 20 && alt <= 30 ? 'The ozone layer is here, absorbing harmful ultraviolet rays.' : alt < 12 ? 'Clouds and weather are in this layer; planes cruise near its top.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Layers of the atmosphere', col), a = axes(ctx, w, h, col, { x: [-100, 30], y: [0, 100], xlabel: 'temperature (°C)', ylabel: 'height (km)', t: top + 10, l: 44, xt: [-100, -50, 0], yt: [0, 20, 40, 60, 80, 100] });
    LAY.forEach(([nm, lo, hi], i) => { ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[(i * 2) % 8]; ctx.fillRect(a.L, a.Y(hi), a.R - a.L, a.Y(lo) - a.Y(hi)); ctx.restore(); text(ctx, nm, a.R - 6, a.Y((lo + hi) / 2), { color: col.ink, size: 10.5, weight: 700, align: 'right' }); });
    ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = col.s[2]; ctx.fillRect(a.L, a.Y(30), a.R - a.L, a.Y(20) - a.Y(30)); ctx.restore(); text(ctx, 'ozone layer', a.L + 6, a.Y(25), { color: col.s[2], size: 10, weight: 700 });
    line(ctx, T.map(([h, t]) => [a.X(t), a.Y(h)]), col.s[1], 3);
    line(ctx, [[a.L, a.Y(alt)], [a.R, a.Y(alt)]], col.muted, 1, [4, 4]); const t = interp(T, alt);
    dot(ctx, a.X(t), a.Y(alt), 6.5, col.warn, col.ink); text(ctx, 'balloon', a.X(t) + 10, a.Y(alt) - 8, { color: col.ink, size: 10.5, weight: 700, halo: col.panel });
    [[8.8, 'Mt Everest'], [11, 'planes'], [85, 'meteors burn']].forEach(([hh, nm]) => { if (hh !== 11) text(ctx, nm, a.L + 6, a.Y(hh) - 7, { color: col.muted, size: 9.5 }); });
  };
  say();
}
