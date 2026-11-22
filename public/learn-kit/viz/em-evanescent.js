// The evanescent wave in total internal reflection. Past the critical angle all the light is reflected, yet a field leaks a
// little way into the second medium: it travels along the surface and dies away exponentially, E ∝ e^{−κz} with
// κ = (2π/λ)√(n₁²sin²θ − n₂²), carrying no power away. Bring a second prism within about a wavelength (slide the gap) and
// the light tunnels across: frustrated total reflection, T ≈ e^{−2κg}. Close to the critical angle the field reaches far.
import { canvas, axes, line, text, row, slider, readout, loop } from '../kit.js';

export default function (host) {
  let th = 50, n1 = 1.5, lam = 600, gap = 200, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 320, label: 'Evanescent wave decaying into the second medium after total internal reflection' });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'Angle of incidence', min: 20, max: 85, value: th, step: 0.5, fmt: (x) => x.toFixed(1) + '°', oninput: (x) => { th = x; upd(); } });
  slider(ctl, { label: 'Wavelength', min: 400, max: 700, value: lam, step: 10, fmt: (x) => x + ' nm', oninput: (x) => { lam = x; upd(); } });
  slider(c2, { label: 'Gap to 2nd prism', min: 0, max: 1500, value: gap, step: 10, fmt: (x) => x + ' nm', oninput: (x) => { gap = x; upd(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(c2);
  const out = readout(host);
  const n2 = 1.0, kap = () => { const q = (n1 * Math.sin(th * Math.PI / 180)) ** 2 - n2 * n2; return q > 0 ? 2 * Math.PI / lam * Math.sqrt(q) : 0; };
  function upd() { const tc = Math.asin(n2 / n1) * 180 / Math.PI, k = kap(); out.innerHTML = k === 0 ? `θ = ${th}° is below the critical angle θc = ${tc.toFixed(1)}°: the light is partly transmitted, no evanescent wave. Increase the angle.` : `θc = ${tc.toFixed(1)}°. κ = ${(k * 1e3).toFixed(2)} per µm: the field falls by 1/e in <b>${(1 / k).toFixed(0)} nm</b> (${(1 / k / lam).toFixed(2)} λ); intensity in ${(1 / (2 * k)).toFixed(0)} nm. Across a gap of ${gap} nm: T ≈ e<sup>−2κg</sup> = <b>${(Math.exp(-2 * k * gap) * 100).toFixed(1)}%</b> tunnels into the second prism. Used in fingerprint scanners and evanescent-wave microscopy.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cy = h * 0.34, cx = w / 2, a1 = th * Math.PI / 180, k = kap(), L = 80, zs = 90 / Math.max(lam, 1) * 1.2; // pixels per nm below the surface
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[4]; ctx.fillRect(0, 0, w, cy); ctx.globalAlpha = 1; line(ctx, [[0, cy], [w, cy]], col.ink, 1.5);
    text(ctx, 'glass n₁ = 1.5', 8, 14, { color: col.muted, size: 11 }); text(ctx, 'air n₂ = 1.0', 8, cy + 16, { color: col.muted, size: 11 });
    const pt = (a, d) => [cx + Math.sin(a) * d, cy - Math.cos(a) * d]; line(ctx, [pt(-a1, L), [cx, cy]], col.s[5], 2.6); line(ctx, [[cx, cy], pt(a1, L)], col.s[5], k > 0 ? 2.6 : 1.2);
    if (k > 0) { const H = h - cy - 56; const Hn = H / zs; ctx.save(); ctx.beginPath(); ctx.rect(0, cy, w, H); ctx.clip(); for (let z = 0; z < H; z += 2) { const env = Math.exp(-k * z / zs); for (let x = 0; x < w; x += 3) { const ph = Math.cos(2 * Math.PI * (x * Math.sin(a1) * n1 / (lam * zs * 0 + 55)) - t * 3); ctx.globalAlpha = Math.min(0.9, env * env * (0.5 + 0.5 * ph) * 0.9); ctx.fillStyle = col.s[2]; ctx.fillRect(x, cy + z, 3, 2); } } ctx.restore(); ctx.globalAlpha = 1; }
    const g = Math.min(H0(h, cy), gap * zs); if (gap < 1500) { const gy = cy + gap * zs; if (gy < h - 50) { ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.18; ctx.fillRect(0, gy, w, 14); ctx.globalAlpha = 1; line(ctx, [[0, gy], [w, gy]], col.ink, 1.5); const T = Math.exp(-2 * k * gap); if (k > 0) line(ctx, [[cx + 10, gy], [cx + 10 + 40, gy + 40]], col.s[1], 1 + 6 * T); text(ctx, '2nd prism', w - 8, gy + 8, { color: col.muted, size: 10.5, align: 'right' }); } }
    const G = axes(ctx, w, h, col, { x: [0, 1500], y: [0, 1.05], xlabel: 'distance from the surface (nm)', ylabel: 'intensity', l: 44, t: h - 120 + 0, b: 38, xt: [0, 500, 1000, 1500], yt: [0, 1], fy: (v) => v });
    if (k > 0) line(ctx, Array.from({ length: 151 }, (_, i) => [G.X(i * 10), G.Y(Math.exp(-2 * k * i * 10))]), col.s[2], 2.4); line(ctx, [[G.X(gap), G.T], [G.X(gap), G.B]], col.s[1], 1.2, [4, 3]);
  };
  function H0(h, cy) { return h - cy - 56; }
  upd();
}
