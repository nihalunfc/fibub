// Electromagnetic waves: E (up-down) and B (in-out of the page) oscillate in phase, at right angles to each other and
// to the direction of travel. The slider picks a wavelength from gamma rays to radio waves; the bar below shows where
// it sits in the spectrum, with its frequency f = c/λ and photon energy E = hc/λ.
import { canvas, line, arrow, row, slider, readout, text, loop, fmt } from '../../kit.js';

const C = 3e8, HC = 1240e-9; // hc in eV m
const REG = [
  [1e-14, 1e-11, 'gamma'], [1e-11, 1e-8, 'X-ray'], [1e-8, 4e-7, 'UV'], [4e-7, 7e-7, 'visible'],
  [7e-7, 1e-3, 'infrared'], [1e-3, 0.1, 'microwave'], [0.1, 1e4, 'radio'],
];
const region = (l) => (REG.find(([a, b]) => l >= a && l < b) || REG[6])[2];
export default function (host) {
  let lam = 5e-7, ph = 0;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'An electromagnetic wave and the electromagnetic spectrum' });
  const ctl = row(host);
  slider(ctl, { label: 'Wavelength', min: 1e-13, max: 1000, value: lam, log: true, fmt: (v) => `${fmt(v, 2)} m`, oninput: (v) => { lam = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { ph += dt * 3; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const show = () => { out.innerHTML = `λ = ${fmt(lam, 3)} m · <b>${region(lam)}</b> · f = c/λ = ${fmt(C / lam, 3)} Hz · photon energy hc/λ = ${fmt(HC / lam, 3)} eV. All travel at 3 × 10⁸ m/s in vacuum.`; };
  cv.draw = (ctx, w, h, col) => {
    const y0 = h * 0.36, x0 = 30, x1 = w - 20, A = h * 0.2, dx = 0.5, dy = 0.35; // B drawn along a slanted depth axis
    line(ctx, [[x0, y0], [x1, y0]], col.muted, 1.2);
    arrow(ctx, x1 - 20, y0, x1, y0, col.muted, 1.2, 7); text(ctx, 'travel', x1 - 4, y0 + 14, { color: col.muted, size: 11, align: 'right' });
    const N = 160, Ep = [], Bp = [], waves = 2.5;
    for (let i = 0; i <= N; i++) {
      const s = i / N, x = x0 + s * (x1 - x0 - 30), a = Math.sin(2 * Math.PI * waves * s - ph);
      Ep.push([x, y0 - A * a]); Bp.push([x + A * 0.8 * a * dx, y0 + A * 0.8 * a * dy]);
      if (i % 8 === 0) { line(ctx, [[x, y0], [x, y0 - A * a]], col.s[3], 1); line(ctx, [[x, y0], [x + A * 0.8 * a * dx, y0 + A * 0.8 * a * dy]], col.s[0], 1); }
    }
    line(ctx, Ep, col.s[3], 2.5); line(ctx, Bp, col.s[0], 2.5);
    text(ctx, 'E', x0 - 4, y0 - A - 6, { color: col.s[3], size: 13, weight: 700 });
    text(ctx, 'B', x0 + A * 0.4 + 6, y0 + A * 0.4, { color: col.s[0], size: 13, weight: 700 });
    // spectrum bar (log of wavelength)
    const by = h * 0.76, bh = 22, L0 = Math.log10(1e-13), L1 = Math.log10(1000), X = (l) => x0 + ((Math.log10(l) - L0) / (L1 - L0)) * (x1 - x0);
    REG.forEach(([a, b, name], i) => {
      const xa = X(Math.max(a, 1e-13)), xb = X(Math.min(b, 1000));
      ctx.fillStyle = i % 2 ? col.soft : col.panel; ctx.fillRect(xa, by, xb - xa, bh);
      ctx.strokeStyle = col.line; ctx.strokeRect(xa, by, xb - xa, bh);
      if (xb - xa > 26) text(ctx, name, (xa + xb) / 2, by + bh / 2, { color: col.ink, size: 10, align: 'center', fit: false });
    });
    const xm = X(lam);
    line(ctx, [[xm, by - 8], [xm, by + bh + 4]], col.s[1], 3);
    text(ctx, '← shorter λ, higher f and photon energy', x0, by + bh + 16, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
