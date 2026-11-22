// Huygens' principle building a refracted wavefront. A plane wave meets a boundary; every point it reaches sends out a small
// circular wavelet, slower in the second medium (v₂ = v₁/n). The new wavefront is the line that touches all the wavelets,
// and it comes out bent: sinθ₁/sinθ₂ = v₁/v₂ = n. Slide the angle and the index; with n < 1 (light going into a faster
// medium) wavelets can run out ahead and the bent front vanishes beyond the critical angle.
import { canvas, text, row, slider, readout, loop, line, arrow } from '../kit.js';

export default function (host) {
  let th = 40, n = 1.6, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 280, label: 'Wavelets building a refracted wavefront at a boundary' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle of incidence', min: 0, max: 80, value: th, step: 1, fmt: (x) => x + '°', oninput: (x) => { th = x; upd(); } });
  slider(ctl, { label: 'Index ratio n = v₁/v₂', min: 0.7, max: 2.2, value: n, step: 0.05, fmt: (x) => x.toFixed(2), oninput: (x) => { n = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t = (t + dt * 0.55) % 1; cv.redraw(); }); anim.button(ctl);
  function upd() { const s = Math.sin(th * Math.PI / 180) / n; out.innerHTML = s >= 1 ? `sinθ₂ = sinθ₁/n = ${s.toFixed(2)} ≥ 1: the wavelets cannot make a common tangent. <b>No refracted wave</b> (total internal reflection).` : `Wavelets in medium 2 are ${n.toFixed(2)}× smaller than the spacing in medium 1, so the front bends: θ₂ = asin(sinθ₁/n) = <b>${(Math.asin(s) * 180 / Math.PI).toFixed(1)}°</b>. The wavelength shrinks by the same factor n; the frequency does not change.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cy = h * 0.46, a1 = th * Math.PI / 180, s2 = Math.sin(a1) / n, lam = 38, v1 = lam, v2 = lam / n, ph = t * lam;
    ctx.globalAlpha = 0.1; ctx.fillStyle = col.s[4]; ctx.fillRect(0, cy, w, h - cy); ctx.globalAlpha = 1; line(ctx, [[0, cy], [w, cy]], col.ink, 1.8);
    text(ctx, 'medium 1 (speed v₁)', 10, 14, { color: col.muted, size: 11 }); text(ctx, `medium 2 (speed v₁/${n.toFixed(2)})`, 10, h - 10, { color: col.muted, size: 11 });
    const d1 = [Math.sin(a1), Math.cos(a1)]; // direction of travel (screen coords, y down)
    const clipTo = (fn) => { ctx.save(); ctx.beginPath(); fn(); ctx.clip(); };
    // incident fronts: p·d1 = c, spacing lam; draw the part above the boundary
    ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2;
    for (let k = -3; k < 9; k++) { const c = (k * lam + ph) - 160, p = (x) => (c - x * d1[0]) / d1[1] + cy; const pts = [[0, p(0)], [w, p(w)]].map(([x, y]) => [x, y]); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, cy); ctx.clip(); ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.stroke(); ctx.restore(); }
    arrow(ctx, w * 0.2, cy - 90 * d1[1] - 10, w * 0.2 + 36 * d1[0], cy - 90 * d1[1] - 10 + 36 * d1[1], col.s[5], 2, 7);
    // wavelets: from points x_j on the boundary, started when a front passed
    if (s2 < 1) {
      const a2 = Math.asin(s2), d2 = [Math.sin(a2), Math.cos(a2)];
      ctx.save(); ctx.beginPath(); ctx.rect(0, cy, w, h - cy); ctx.clip();
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1; for (let xj = 20; xj < w; xj += 22) { const r = v2 * ((ph + 160) / lam * 0 + 0) ; const t0 = xj * Math.sin(a1) / v1; const rad = (((ph - 160) - xj * Math.sin(a1)) % lam + lam) % lam; ctx.beginPath(); ctx.arc(xj, cy, rad / n, 0, Math.PI); ctx.stroke(); if (rad / n > 3) { ctx.beginPath(); ctx.arc(xj, cy, rad / n + lam / n, 0, Math.PI); ctx.stroke(); } }
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.4;
      for (let k = -2; k < 12; k++) { const c = (k * lam / n + (ph / n)) % 1e9 - 0 + 0; const cc = (k * lam + ph - 160) / n; const p = (x) => (cc - x * d2[0]) / d2[1] + cy; ctx.beginPath(); ctx.moveTo(0, p(0)); ctx.lineTo(w, p(w)); ctx.stroke(); }
      ctx.restore();
      arrow(ctx, w * 0.62, cy + 30, w * 0.62 + 36 * d2[0], cy + 30 + 36 * d2[1], col.s[2], 2, 7);
      ctx.strokeStyle = col.muted; ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(w * 0.5, cy - 60); ctx.lineTo(w * 0.5, cy + 60); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, `θ₂ = ${(a2 * 180 / Math.PI).toFixed(0)}°`, w * 0.5 + 6, cy + 54, { color: col.s[2], size: 11, weight: 700 });
    }
    text(ctx, `θ₁ = ${th}°`, w * 0.5 + 6, cy - 46, { color: col.s[5], size: 11, weight: 700 });
  };
  upd();
}
