// Class 12 Wave Optics: diffraction at a single slit of width a. On a screen a distance D away the intensity is I0 (sin(b)/b)^2 with
// b = pi a y / (lambda D): a wide bright central maximum and weak side fringes. The first dark spots are at y = +/- lambda D / a
// (a sin(theta) = lambda), so the central maximum is 2 lambda D / a wide: narrower slit, wider spread.
import { canvas, text, title, row, slider, readout, line } from '../../kit.js';
import { wl2rgb } from '../c12p-optlib.js';

export default function (host) {
  let a = 0.1, lam = 550;
  const D = 1, R = 15;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Single-slit diffraction pattern and intensity curve' });
  const ctl = row(host);
  slider(ctl, { label: 'Slit width a', min: 0.05, max: 0.4, step: 0.01, value: a, fmt: (v) => `${v.toFixed(2)} mm`, oninput: (v) => { a = v; cv.redraw(); } });
  slider(ctl, { label: 'Wavelength λ', min: 400, max: 700, step: 10, value: lam, fmt: (v) => `${v} nm`, oninput: (v) => { lam = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Single slit: screen 1 m away', col) + 6, x0 = 10, x1 = w - 10;
    const X = (px) => ((px - x0) / (x1 - x0) - 0.5) * 2 * R, PX = (y) => x0 + (y / R / 2 + 0.5) * (x1 - x0);
    const I = (y) => { const b = (Math.PI * a * 1e-3 * y * 1e-3) / (lam * 1e-9 * D); return Math.abs(b) < 1e-6 ? 1 : (Math.sin(b) / b) ** 2; };
    const sh = (h - top) * 0.22, ys = top + 4;
    for (let px = x0; px < x1; px++) { ctx.fillStyle = wl2rgb(lam, Math.min(1, Math.sqrt(I(X(px))))); ctx.fillRect(px, ys, 1, sh); }
    ctx.strokeStyle = col.line; ctx.strokeRect(x0, ys, x1 - x0, sh);
    const cy0 = ys + sh + 14, ch = h - cy0 - 58, pts = [];
    for (let px = x0; px <= x1; px += 2) pts.push([px, cy0 + ch - I(X(px)) * ch]);
    line(ctx, [[x0, cy0 + ch], [x1, cy0 + ch]], col.line, 1);
    line(ctx, pts, col.ink, 2);
    const y1 = (lam * 1e-9 * D) / (a * 1e-3) * 1000;
    if (y1 < R) for (const s of [-1, 1]) { line(ctx, [[PX(s * y1), cy0 + 4], [PX(s * y1), cy0 + ch]], col.s[3], 1.4, [4, 3]); }
    if (y1 < R) { line(ctx, [[PX(-y1), cy0 + ch + 12], [PX(y1), cy0 + ch + 12]], col.s[2], 2.5); text(ctx, 'central maximum', w / 2, cy0 + ch + 26, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    text(ctx, '−15 mm', x0, h - 4, { color: col.muted, size: 10 }); text(ctx, '0', w / 2, h - 4, { color: col.muted, size: 10, align: 'center' }); text(ctx, '+15 mm', x1, h - 4, { color: col.muted, size: 10, align: 'right' });
    out.innerHTML = `First dark spot at y = λD/a = <b>${y1.toFixed(2)} mm</b> each side, so the central maximum is <b>2λD/a = ${(2 * y1).toFixed(2)} mm</b> wide` + (y1 >= R ? ' (wider than the picture).' : '.') + ' Make the slit narrower and the pattern spreads out: squeezing the light spreads it.';
  };
  cv.redraw();
}
