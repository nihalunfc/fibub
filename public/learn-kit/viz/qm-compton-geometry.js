// Compton scattering as a collision: a photon hits an electron at rest and bounces off at angle θ. Drag θ and the photon
// energy; watch the scattered wavelength grow by λc(1 − cos θ), the electron recoil at angle φ, and check that the
// momentum arrows add up. Try 100 keV X-rays at 90° versus 1 eV visible light (almost no shift at all).
import { canvas, text, title, arrow, row, slider, button, readout, loop, ease, line } from '../kit.js';

const MC2 = 511; // keV
export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 500, min: 400, label: 'A photon scattering from a stationary electron' });
  let th = 70, E = 100, t = 0;
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Scattering angle θ', min: 0, max: 180, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; show(); } });
  slider(ctl, { label: 'Photon energy', min: 1, max: 3000, value: E, log: true, fmt: (v) => (v < 10 ? v.toFixed(1) : Math.round(v)) + ' keV', oninput: (v) => { E = v; show(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.4) % 1.6; cv.redraw(); });
  anim.button(ctl);
  const phys = () => {
    const eps = E / MC2, c = Math.cos(th * Math.PI / 180), Ep = E / (1 + eps * (1 - c));
    const lam = 1239.84 / E * 1e-3, lamp = 1239.84 / Ep * 1e-3; // nm: 1239.84 eV nm = hc
    const phi = Math.atan2(Math.sin(th * Math.PI / 180), (1 + eps) * (1 - c)); // electron angle below axis
    return { eps, Ep, lam, lamp, phi, K: E - Ep };
  };
  const show = () => {
    const p = phys(), pe = Math.sqrt(p.K * p.K + 2 * p.K * MC2);
    out.innerHTML = `λ = ${(p.lam * 1000).toFixed(3)} pm → λ′ = <b>${(p.lamp * 1000).toFixed(3)} pm</b>: shift Δλ = λc(1 − cos θ) = <b>${((p.lamp - p.lam) * 1000).toFixed(3)} pm</b> (λc = 2.426 pm). Electron recoils at φ = <b>${(p.phi * 180 / Math.PI).toFixed(1)}°</b> with K = <b>${p.K.toFixed(1)} keV</b> (p = ${pe.toFixed(1)} keV/c). Photon keeps ${(100 * p.Ep / E).toFixed(0)}% of its energy.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Photon + electron at rest', col);
    const p = phys(), cx = w * 0.4, cy = h * 0.3, th_ = th * Math.PI / 180, R = Math.min(w * 0.38, h * 0.22);
    // path lines
    line(ctx, [[10, cy], [cx, cy]], col.line, 1, [3, 4]);
    // momentum triangle (right/bottom): p_in = p_out + p_e, drawn to scale of E (keV/c)
    const sc = (R * 0.9) / E, pe = Math.sqrt(p.K * p.K + 2 * p.K * MC2);
    // animation
    const T = t / 1.6; let ph;
    const wave = (x0, y0, ang, len, lamPix, color) => {
      ctx.save(); ctx.translate(x0, y0); ctx.rotate(ang); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
      for (let s = 0; s <= len; s += 2) { const y = 7 * Math.sin((s / lamPix) * 2 * Math.PI) * Math.min(1, s / 12, (len - s) / 12 + 0.01); s ? ctx.lineTo(s, y) : ctx.moveTo(s, y); }
      ctx.stroke(); ctx.restore();
    };
    const lw = 18, lw2 = lw * p.lamp / p.lam;
    if (T < 0.5) { const f = ease(T / 0.5); const x = 10 + f * (cx - 10 - 30); wave(Math.max(10, x - 50), cy, 0, Math.min(50, x - 10), lw, col.s[1]); }
    else { const f = Math.min(1, (T - 0.5) / 0.9) ; const d1 = f * R * 1.1;
      wave(cx + Math.cos(-th_) * 12, cy + Math.sin(-th_) * 12, -th_, Math.min(60, d1), lw2, col.s[1]);
      if (d1 > 60) wave(cx + Math.cos(-th_) * (d1 - 48), cy + Math.sin(-th_) * (d1 - 48), -th_, 48, lw2, col.s[1]);
      const de = f * R * 0.9 * Math.min(1, pe / E + 0.2);
      dot2(ctx, cx + Math.cos(p.phi) * de, cy + Math.sin(p.phi) * de, 6, col.s[0]); }
    dot2(ctx, cx, cy, 6, col.s[0], T < 0.5);
    text(ctx, 'electron', cx - 8, cy + 18, { color: col.muted, size: 10, align: 'right' });
    // momentum arrows (always shown, static): origin lower area
    const ox = w * 0.1, oy = h * 0.92;
    const s2 = Math.min(w * 0.55 / E, h * 0.4 / (E * 0.98));
    const px = (v) => v * s2;
    arrow(ctx, ox, oy, ox + px(E), oy, col.s[1], 2.4, 8);
    text(ctx, 'p in', ox + px(E) / 2, oy + 12, { color: col.s[1], size: 10.5, weight: 600, align: 'center' });
    const bx = ox + px(p.Ep * Math.cos(th_)), by = oy - px(p.Ep * Math.sin(th_));
    arrow(ctx, ox, oy, bx, by, col.s[2], 2.4, 8);
    arrow(ctx, bx, by, ox + px(E), oy, col.s[0], 2.4, 8);
    text(ctx, "p′ (photon)", (ox + bx) / 2 - 4, (oy + by) / 2 - 8, { color: col.s[2], size: 10.5, weight: 600, align: 'right' });
    text(ctx, 'p electron', (bx + ox + px(E)) / 2 + 6, (by + oy) / 2 - 6, { color: col.s[0], size: 10.5, weight: 600 });
    text(ctx, 'momentum triangle: p in = p′ + p electron', ox, oy - h*0.46, { color: col.muted, size: 10 });
  };
  function dot2(ctx, x, y, r, c, glow) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = c; ctx.fill(); }
  show();
}
