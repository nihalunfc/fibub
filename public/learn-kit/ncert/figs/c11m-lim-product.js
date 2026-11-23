// Class 11 Maths, Limits and Derivatives: the product rule as an area. The rectangle has sides u and v. When x grows by dx, u grows by du and v by dv.
// The new area is the old one plus two thin strips (u·dv and v·du) and a tiny corner du·dv: Δ(uv) = u dv + v du + du dv. Divide by dx and let dx -> 0: (uv)′ = u v′ + v u′, because the corner vanishes faster.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let dx = 0.8; const x0 = 2, u0 = x0 + 2, v0 = 2 * x0 + 1;   // u = x + 2, v = 2x + 1 at x = 2
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 310, label: 'A rectangle of sides u and v grows by two strips and a small corner' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'step dx', min: 0.05, max: 1, step: 0.05, value: dx, fmt: (v) => v.toFixed(2), oninput: (v) => { dx = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Product rule as area: u = x + 2, v = 2x + 1 at x = 2', col), du = dx, dv = 2 * dx;
    const sc = Math.min((w - 40) / (u0 + 1.2), (h - top - 24) / (v0 + 2.4)), X0 = 20, Y0 = h - 14;
    const R = (a, b, c, d, fill, lab) => { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = fill; ctx.fillRect(X0 + a * sc, Y0 - (b + d) * sc, c * sc, d * sc); ctx.restore(); ctx.strokeStyle = fill; ctx.lineWidth = 1.5; ctx.strokeRect(X0 + a * sc, Y0 - (b + d) * sc, c * sc, d * sc); if (lab && c * sc > 30 && d * sc > 14) text(ctx, lab, X0 + (a + c / 2) * sc, Y0 - (b + d / 2) * sc, { color: col.ink, size: 12, weight: 700, align: 'center' }); };
    R(0, 0, u0, v0, col.s[0], 'u · v = ' + u0 * v0);
    R(u0, 0, du, v0, col.s[1], ''); R(0, v0, u0, dv, col.s[3], ''); R(u0, v0, du, dv, col.bad, '');
    text(ctx, 'v·du', X0 + (u0 + du / 2) * sc, Y0 - v0 * sc / 2 - 14 + 14, { color: col.s[1], size: 11, weight: 800, align: 'center', halo: col.panel });
    text(ctx, 'u·dv', X0 + u0 * sc / 2, Y0 - (v0 + dv / 2) * sc, { color: col.s[3], size: 11, weight: 800, align: 'center', halo: col.panel });
    text(ctx, 'du·dv', X0 + (u0 + du / 2) * sc, Y0 - (v0 + dv + 0.35) * sc, { color: col.bad, size: 10.5, weight: 800, align: 'center', halo: col.panel });
    const d = (u0 + du) * (v0 + dv) - u0 * v0;
    ro.innerHTML = `Δ(uv) = <b>${d.toFixed(3)}</b> = v·du (${(v0 * du).toFixed(2)}) + u·dv (${(u0 * dv).toFixed(2)}) + du·dv (${(du * dv).toFixed(3)}). Divide by dx = ${dx.toFixed(2)}: <b>${(d / dx).toFixed(3)}</b>, which tends to v·u′ + u·v′ = ${v0}×1 + ${u0}×2 = <b>${v0 + 2 * u0}</b> as dx → 0.`;
  };
  cv.redraw();
}
