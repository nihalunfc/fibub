// Class 12 Wave Optics: Young's double-slit experiment. At a screen point y the path difference is d*y/D; bright where it is a whole number of
// wavelengths, dark where it is a half number. Fringe width beta = lambda*D/d. Intensity I = I_max cos^2(pi d y / (lambda D)) for two equal slits.
// Slide d, lambda and D to see the fringes squeeze, stretch and change colour; "white light" adds all colours (central white, coloured edges).
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';
import { wl2rgb } from '../c12p-optlib.js';

const comp = (s) => s.match(/\d+/g).map(Number);
export default function (host) {
  let d = 0.5, lam = 550, D = 1, y = 1.4, light = 'mono';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: "Young's double slit: geometry, fringes and intensity" });
  const ctl = row(host);
  slider(ctl, { label: 'Slit gap d', min: 0.1, max: 1, step: 0.05, value: d, fmt: (v) => `${v.toFixed(2)} mm`, oninput: (v) => { d = v; cv.redraw(); } });
  slider(ctl, { label: 'Wavelength λ', min: 400, max: 700, step: 10, value: lam, fmt: (v) => `${v} nm`, oninput: (v) => { lam = v; cv.redraw(); } });
  slider(ctl, { label: 'Screen distance D', min: 0.5, max: 2, step: 0.1, value: D, fmt: (v) => `${v.toFixed(1)} m`, oninput: (v) => { D = v; cv.redraw(); } });
  slider(ctl, { label: 'Point P at y', min: -6, max: 6, step: 0.1, value: y, fmt: (v) => `${v.toFixed(1)} mm`, oninput: (v) => { y = v; cv.redraw(); } });
  choice(ctl, 'Light', [['mono', 'One colour'], ['white', 'White']], light, (v) => { light = v; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two slits, one pattern', col) + 4, sh = (h - top) * 0.42, R = 6;
    // geometry sketch (not to scale)
    const sx = 26, slx = w * 0.3, scx = w * 0.86, cy = top + sh * 0.5, gap = Math.max(10, d * 40), py = cy - (y / R) * (sh * 0.42);
    line(ctx, [[scx, top + 2], [scx, top + sh]], col.ink, 3); text(ctx, 'screen', scx - 4, top + 8, { color: col.muted, size: 10.5, align: 'right' });
    dot(ctx, sx, cy, 4, wl2rgb(lam)); text(ctx, 'S', sx, cy + 14, { color: col.ink, size: 11, align: 'center' });
    line(ctx, [[slx, top + 2], [slx, cy - gap / 2 - 2]], col.ink, 3); line(ctx, [[slx, cy - gap / 2 + 2], [slx, cy + gap / 2 - 2]], col.line, 1); line(ctx, [[slx, cy + gap / 2 + 2], [slx, top + sh]], col.ink, 3);
    line(ctx, [[sx, cy], [slx, cy - gap / 2]], col.muted, 1); line(ctx, [[sx, cy], [slx, cy + gap / 2]], col.muted, 1);
    text(ctx, 'S₁', slx + 6, cy - gap / 2 - 4, { color: col.ink, size: 10.5 }); text(ctx, 'S₂', slx + 6, cy + gap / 2 + 10, { color: col.ink, size: 10.5 });
    line(ctx, [[slx, cy - gap / 2], [scx, py]], col.s[0], 1.5); line(ctx, [[slx, cy + gap / 2], [scx, py]], col.s[1], 1.5);
    dot(ctx, scx, py, 5, col.s[3], col.ink); text(ctx, 'P', scx + 8, py, { color: col.ink, size: 11, weight: 700 });
    text(ctx, 'O', scx + 8, cy, { color: col.muted, size: 10.5 });
    // fringes
    const x0 = 10, x1 = w - 10, ys = top + sh + 12, sh2 = (h - ys) * 0.36, k = (Math.PI * d * 1000) / (lam * D), X = (px) => ((px - x0) / (x1 - x0) - 0.5) * 2 * R;
    const I = (yy) => Math.cos(k * yy) ** 2;
    for (let px = x0; px < x1; px += 1) {
      const yy = X(px);
      if (light === 'mono') { ctx.fillStyle = wl2rgb(lam, I(yy)); }
      else { let r = 0, g = 0, b = 0, n = 0; for (let l = 400; l <= 700; l += 15) { const c = comp(wl2rgb(l)), kk = (Math.PI * d * 1000) / (l * D), v = Math.cos(kk * yy) ** 2; r += c[0] * v; g += c[1] * v; b += c[2] * v; n++; } const s = 255 / Math.max(r, g, b, 1) * 0.0 + 1; ctx.fillStyle = `rgb(${Math.min(255, r / n * 2.0 * s)|0},${Math.min(255, g / n * 2.0 * s)|0},${Math.min(255, b / n * 2.0 * s)|0})`; }
      ctx.fillRect(px, ys, 1, sh2);
    }
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0, ys, x1 - x0, sh2);
    // intensity curve
    const cy0 = ys + sh2 + 8, ch = h - cy0 - 18, pts = [];
    for (let px = x0; px <= x1; px += 2) pts.push([px, cy0 + ch - (light === 'mono' ? I(X(px)) : (() => { let s = 0; for (let l = 400; l <= 700; l += 30) s += Math.cos(((Math.PI * d * 1000) / (l * D)) * X(px)) ** 2; return s / 11; })()) * ch]);
    line(ctx, pts, col.ink, 1.8);
    const pxp = x0 + (y / R / 2 + 0.5) * (x1 - x0);
    line(ctx, [[pxp, ys - 2], [pxp, cy0 + ch]], col.s[3], 1.5, [4, 3]);
    text(ctx, '−6 mm', x0, h - 8, { color: col.muted, size: 10 }); text(ctx, '0', (x0 + x1) / 2, h - 8, { color: col.muted, size: 10, align: 'center' }); text(ctx, '+6 mm', x1, h - 8, { color: col.muted, size: 10, align: 'right' });
    const beta = (lam * 1e-9 * D) / (d * 1e-3) * 1000, dl = (d * y * 1000) / (lam * D), frac = Math.abs(dl - Math.round(dl));
    out.innerHTML = `Fringe width β = λD/d = <b>${beta.toFixed(2)} mm</b>. At P the path difference is dy/D = <b>${dl.toFixed(2)} λ</b>` + (light === 'mono' ? (frac < 0.12 ? ': <b>bright</b> (a whole number of wavelengths).' : Math.abs(frac - 0.5) < 0.12 ? ': <b>dark</b> (a half number).' : ': in between.') : '. In white light every colour has its own β: the centre stays white, the edges turn coloured and fade.');
  };
  cv.redraw();
}
