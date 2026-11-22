// Class 12 Dual Nature: photons. Light of wavelength lambda comes in packets of energy E = h c / lambda = 1240 eV nm / lambda. A beam of power P sends
// N = P / E photons every second, so a bright ordinary lamp is a flood of very many photons and a faint glow is still billions per second. Drag the colour
// and the power; the stream below shows how many (not to scale: the real numbers are far too big to draw).
import { canvas, text, title, row, slider, readout, line, loop } from '../../kit.js';
import { wl2rgb, wavy, sci, HC_EV_NM } from '../c12p-optlib.js';

export default function (host) {
  let lam = 500, P = 1, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A beam of photons with chosen colour and power' });
  const ctl = row(host);
  slider(ctl, { label: 'Wavelength λ', min: 200, max: 1000, step: 10, value: lam, fmt: (v) => `${v} nm`, oninput: (v) => { lam = v; cv.redraw(); } });
  slider(ctl, { label: 'Power', min: -6, max: 2, step: 0.25, value: -6, fmt: (v) => `${sci(10 ** v, 1)} W`, oninput: (v) => { P = 10 ** v; cv.redraw(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  const out = readout(host);
  P = 1e-6;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Photons: packets of energy hc/λ', col) + 6, E = HC_EV_NM / lam, Ej = E * 1.602e-19, N = P / Ej, c = wl2rgb(lam), cy = top + (h - top) * 0.45;
    const gap = Math.max(14, 120 / Math.pow(Math.max(N, 1) / 1e12, 0.12)) , wl = 12 + lam / 28;
    line(ctx, [[10, cy + 40], [w - 10, cy + 40]], col.line, 1);
    for (let k = -1; k < w / gap + 2; k++) { const x = ((k * gap + t * 90) % (w + gap)) - gap / 2; wavy(ctx, x, x + Math.min(gap * 0.8, wl * 2.5), cy, 13, wl, 0, c, 3); }
    text(ctx, `each packet carries ${E.toFixed(2)} eV`, 12, cy + 56, { color: col.ink, size: 12, weight: 700 });
    text(ctx, lam < 380 ? 'ultraviolet (invisible)' : lam > 750 ? 'infrared (invisible)' : 'visible light', 12, cy + 74, { color: col.muted, size: 11 });
    out.innerHTML = `E = hc/λ = 1240 eV nm ÷ ${lam} nm = <b>${E.toFixed(2)} eV = ${sci(Ej)} J</b>. A beam of ${sci(P, 2)} W then carries N = P/E = <b>${sci(N)} photons every second</b>. Shorter wavelength means a more energetic photon, so fewer of them for the same power.`;
  };
  cv.redraw();
}
