// Class 12 Dual Nature (step player): Einstein's photoelectric equation as an energy account. One photon gives all of h*nu to one electron.
// The electron pays the work function phi to leave the metal; what is left is its (maximum) kinetic energy: h nu = phi + K_max.
// A retarding voltage V0 that just stops the fastest electrons satisfies e V0 = K_max, so V0 = (h/e) nu - phi/e: a straight line in nu.
// Numbers: sodium, phi = 2.3 eV, light of hv = 4.1 eV (about 300 nm).
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'Energy account of the photoelectric effect' });
  const TITLES = ['One photon of energy hν = 4.1 eV arrives', 'The electron pays the work function φ = 2.3 eV', 'The rest is its kinetic energy: K = hν − φ = 1.8 eV', 'A stopping voltage V₀ takes exactly that away: eV₀ = K', 'Put together and divide by e: a straight line', 'Threshold: when K = 0, hν₀ = φ'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, hv = 4.1, phi = 2.3, K = hv - phi, base = h - 30, sc = (base - top - 20) / 4.4, Y = (e) => base - e * sc;
    const bx = 24, bw = w * 0.22;
    text(ctx, 'photon', bx + bw / 2, base + 14, { color: col.muted, size: 10.5, align: 'center' });
    ctx.fillStyle = col.s[4]; ctx.fillRect(bx, Y(hv), bw, hv * sc); text(ctx, 'hν = 4.1 eV', bx + bw / 2, Y(hv) - 8, { color: col.s[4], size: 11.5, weight: 700, align: 'center' });
    if (step >= 1) {
      const x = bx + bw + 24; ctx.fillStyle = col.s[3]; ctx.fillRect(x, Y(phi), bw, phi * sc); text(ctx, 'φ = 2.3', x + bw / 2, Y(phi / 2), { color: col.panel, size: 11.5, weight: 700, align: 'center' });
      text(ctx, 'paid to escape', x + bw / 2, base + 14, { color: col.muted, size: 10.5, align: 'center' });
      arrow(ctx, bx + bw + 2, Y(phi / 2), x - 2, Y(phi / 2), col.ink, 1.5, 6);
    }
    if (step >= 2) {
      const x = bx + bw + 24; ctx.fillStyle = col.s[2]; ctx.fillRect(x, Y(hv), bw, K * sc); text(ctx, 'K = 1.8', x + bw / 2, Y(phi + K / 2), { color: col.panel, size: 11.5, weight: 700, align: 'center' });
    }
    // right: electron and stopping voltage, then line graph
    const rx = w * 0.62;
    if (step === 3) {
      const ex = rx - 10, ey = top + 70; dot(ctx, ex, ey, 6, col.s[0]); arrow(ctx, ex + 8, ey, ex + 70, ey, col.s[0], 2.5, 8); text(ctx, 'K = 1.8 eV', ex + 8, ey - 14, { color: col.s[0], size: 11, weight: 700 });
      ctx.strokeStyle = col.ink; ctx.lineWidth = 4; line(ctx, [[ex + 92, ey - 30], [ex + 92, ey + 30]], col.ink, 4); text(ctx, '−', ex + 100, ey - 28, { color: col.ink, size: 13, weight: 700 });
      text(ctx, 'retarding', ex + 92, ey + 46, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'V₀ = 1.8 V', ex + 92, ey + 60, { color: col.s[1], size: 12, weight: 700, align: 'center' });
      text(ctx, 'eV₀ = K = hν − φ', w - 8, h - 14, { color: col.s[7], size: 12.5, weight: 700, align: 'right' });
    }
    if (step >= 4) {
      const gx0 = rx - 6, gx1 = w - 12, gy0 = top + 6, gy1 = base - 20, X = (v) => gx0 + (v / 12) * (gx1 - gx0), Yv = (v) => gy1 - ((v + 2.4) / 5.4) * (gy1 - gy0), q = 0.4136;
      line(ctx, [[gx0, Yv(0)], [gx1, Yv(0)]], col.ink, 1.2); line(ctx, [[gx0, gy0], [gx0, gy1]], col.ink, 1.2);
      line(ctx, [[X(2.3 / q), Yv(0)], [X(11.5), Yv(q * 11.5 - 2.3)]], col.s[2], 3); line(ctx, [[X(0), Yv(-2.3)], [X(2.3 / q), Yv(0)]], col.s[2], 1.5, [4, 4]);
      text(ctx, 'ν', gx1, Yv(0) + 12, { color: col.muted, size: 11, align: 'right' }); text(ctx, 'V₀', gx0 + 4, gy0 + 6, { color: col.muted, size: 11 });
      text(ctx, 'slope h/e', X(7.2), Yv(0) + 26, { color: col.s[1], size: 11, weight: 700 }); text(ctx, '−φ/e', gx0 + 4, Yv(-2.3) - 2, { color: col.s[3], size: 11, weight: 700 });
      if (step >= 5) { dot(ctx, X(2.3 / q), Yv(0), 5.5, col.s[3], col.ink); text(ctx, 'ν₀ = φ/h', X(2.3 / q) + 2, Yv(0) - 12, { color: col.s[3], size: 11, weight: 700 }); }
      text(ctx, 'V₀ = (h/e)ν − φ/e', w - 8, h - 14, { color: col.s[7], size: 12.5, weight: 700, align: 'right' });
    }
    if (step === 0) text(ctx, 'all or nothing: one photon,', w - 8, top + 20, { color: col.muted, size: 11, align: 'right' }), text(ctx, 'one electron', w - 8, top + 36, { color: col.muted, size: 11, align: 'right' });
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
