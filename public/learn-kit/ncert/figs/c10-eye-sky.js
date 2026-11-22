// Class 10 Colourful World: why the sky is blue and the Sun red at sunset. Air molecules scatter short wavelengths (blue)
// far more than long ones (red): scattering strength goes as 1/wavelength^4. At noon sunlight crosses a thin slice of
// atmosphere, little is lost, and the scattered blue light fills the sky. When the Sun is low its light crosses a much
// longer path of air (air mass about 1/sin(height)); nearly all the blue and green have been scattered out of the beam,
// so the Sun looks orange-red. Optical depths used for a clear sky: blue 0.36, green 0.14, red 0.07; transmitted = exp(-depth x air mass).
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let el = 60;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Sunlight crossing the atmosphere at different heights of the Sun and the colour of the Sun that results' });
  const ctl = row(host);
  slider(ctl, { label: 'Height of the Sun in the sky', min: 2, max: 90, step: 1, value: el, fmt: (v) => (v > 70 ? `${v}° (noon)` : v < 10 ? `${v}° (sunrise / sunset)` : `${v}°`), oninput: (v) => { el = v; update(); } });
  const out = readout(host);
  const TAU = [0.07, 0.14, 0.36], air = () => Math.min(32, 1 / Math.sin((el * Math.PI) / 180)), T = (m) => TAU.map((t) => Math.exp(-t * m));
  const rgb = (m) => { const t = T(m), mx = Math.max(...t), g = t.map((v) => v / mx); return `rgb(${Math.round(255 * g[0])},${Math.round(255 * Math.pow(g[1], 1.2))},${Math.round(255 * Math.pow(g[2], 1.2))})`; };
  function update() {
    const m = air(), t = T(m);
    out.innerHTML = `Sun at ${el}°: the light crosses about <b>${m.toFixed(1)}×</b> the thickness of air overhead. Left in the beam: red ${(t[0] * 100).toFixed(0)}%, green ${(t[1] * 100).toFixed(0)}%, blue ${(t[2] * 100).toFixed(0)}%. ${m > 6 ? 'Blue is almost all scattered away: the Sun looks <b>red-orange</b>.' : m > 2 ? 'Some blue is lost: the Sun looks <b>yellow-orange</b>.' : 'Little is lost: the Sun looks nearly white or pale yellow, and the sky overhead is blue.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A longer path through air removes the blue', col);
    const m = air(), gy = h * 0.66, th = 34, Re = 230, E = (el * Math.PI) / 180, ox = w * 0.66, C = [ox, gy + Re];
    // Earth and a shell of air (a curved, exaggerated cutaway: not to scale)
    ctx.save(); ctx.beginPath(); ctx.rect(0, 40, w, h - 40); ctx.clip();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.arc(C[0], C[1], Re + th, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.arc(C[0], C[1], Re, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(C[0], C[1], Re + th, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    const sPath = -Re * Math.sin(E) + Math.sqrt(Re * Re * Math.sin(E) ** 2 + 2 * Re * th + th * th), d = [-Math.cos(E), -Math.sin(E)], O = [ox, gy];
    const topPt = [O[0] + d[0] * sPath, O[1] + d[1] * sPath], sun = [Math.max(24, O[0] + d[0] * (sPath + 46)), Math.max(52, O[1] + d[1] * (sPath + 46))];
    line(ctx, [sun, topPt], '#f2c14e', 2.4);
    const n = 24; let prev = topPt;
    for (let k = 1; k <= n; k++) { const f = k / n, p = [topPt[0] + (O[0] - topPt[0]) * f, topPt[1] + (O[1] - topPt[1]) * f]; ctx.strokeStyle = rgb(m * f); ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(...prev); ctx.lineTo(...p); ctx.stroke(); prev = p; }
    // scattered blue leaving the beam
    for (let k = 1; k < 10; k++) { const f = k / 10, p = [topPt[0] + (O[0] - topPt[0]) * f, topPt[1] + (O[1] - topPt[1]) * f], up = k % 2 ? 1 : -1, L = 8 + 10 * (1 - f * 0.5); arrow(ctx, p[0], p[1], p[0] + up * -d[1] * L * 1.0 * -1, p[1] + up * d[0] * L * -1, '#2a6df4', 1.3, 4); }
    ctx.restore();
    dot(ctx, O[0], O[1] - 1, 6, col.ink); text(ctx, 'you', O[0] + 10, O[1] + 12, { color: col.ink, size: 11, weight: 700 });
    dot(ctx, sun[0], sun[1], 13, rgb(m)); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sun[0], sun[1], 13, 0, 7); ctx.stroke();
    text(ctx, 'Sun', sun[0] + 18, sun[1], { color: col.ink, size: 11, weight: 700, halo: col.panel });
    text(ctx, 'air shell (not to scale)', w - 8, gy + 34, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'blue scattered out of the beam', w - 8, 50, { color: '#2a6df4', size: 10.5, weight: 700, align: 'right' });
    // colour chips: the Sun's colour and the sky overhead
    const bright = Math.max(0.15, Math.sin(E)), sky = `rgb(${Math.round(60 * bright + 15)},${Math.round(130 * bright + 25)},${Math.round(215 * bright + 40)})`;
    ctx.fillStyle = rgb(m); ctx.fillRect(10, h - 28, 26, 18); ctx.fillStyle = sky; ctx.fillRect(w - 36, h - 28, 26, 18); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(10, h - 28, 26, 18); ctx.strokeRect(w - 36, h - 28, 26, 18);
    text(ctx, 'Sun colour', 40, h - 19, { color: col.ink, size: 10.5 }); text(ctx, 'sky overhead', w - 40, h - 19, { color: col.ink, size: 10.5, align: 'right' });
  };
  update();
}
