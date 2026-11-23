// Class 11 Waves (step player): the Doppler effect for sound. A source emits a crest every period T0 = 1/f0. If the source moves, each new wavefront starts from a new place,
// so fronts bunch up ahead (shorter wavelength) and spread out behind. f' = f0 (v +- vo) / (v -+ vs): upper signs when source and observer move toward each other.
// Circles show the fronts, the dot the source. Sound speed v is drawn as 1. Observers A (ahead) and B (behind) read the frequency they receive.
import { canvas, text, title, loop, row, slider, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0, vs = 0.5, vo = 0, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Wavefronts from a moving source, with observers ahead of and behind it' });
  const ctl = row(host);
  slider(ctl, { label: 'source speed vs / v', min: 0, max: 0.8, step: 0.05, value: vs, fmt: (x) => x.toFixed(2), oninput: (x) => { vs = x; } });
  slider(ctl, { label: 'observer A speed vo / v (toward source)', min: 0, max: 0.6, step: 0.05, value: vo, fmt: (x) => x.toFixed(2), oninput: (x) => { vo = x; } });
  const anim = loop(host, (dt) => { t += dt * 0.45; cv.redraw(); }); anim.button(ctl);
  const TT = ['Source at rest: even rings', 'Source moves right: rings bunch ahead', 'Observer moving toward a still source', 'Both moving: f′ = f₀ (v ± vo) / (v ∓ vs)'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cy = top + (h - top - 62) / 2 + 4, u = Math.min(w, 440) * 0.34;
    const s = step === 0 || step === 2 ? 0 : vs, o = step <= 1 ? 0 : vo, T0 = 1;
    const sx = w * 0.5, R0 = u * 0.55; ctx.save(); ctx.beginPath(); ctx.rect(0, top + 4, w, h - top - 62); ctx.clip();
    for (let i = 0; i < 12; i++) { const te = Math.floor(t / T0) * T0 - i * T0, age = t - te, r = age * R0; if (r <= 0) continue; ctx.strokeStyle = col.s[0]; ctx.globalAlpha = Math.max(0.15, 1 - i * 0.08); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(sx - s * age * R0, cy, r, 0, 7); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(sx, cy, 6, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.stroke();
    if (s) arrow(ctx, sx + 8, cy - 14, sx + 8 + 30 * s / 0.5, cy - 14, col.s[2], 2.5, 7);
    const ax = w - 30, bx = 30; for (const [x, nm, c] of [[ax, 'A', col.s[1]], [bx, 'B', col.s[3]]]) { ctx.fillStyle = c; ctx.fillRect(x - 6, cy - 6, 12, 12); text(ctx, nm, x, cy + 22, { color: c, size: 12, weight: 700, align: 'center' }); }
    if (o) arrow(ctx, ax - 10, cy - 16, ax - 10 - 26 * o / 0.3, cy - 16, col.s[1], 2.5, 7);
    const fA = (1 + o) / (1 - s), fB = (1 - 0) / (1 + s);
    text(ctx, `A hears f′ = ${fA.toFixed(2)} f₀` + (fA > 1.001 ? ' (higher)' : ''), w - 8, h - 50, { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
    text(ctx, `B hears f′ = ${fB.toFixed(2)} f₀` + (fB < 0.999 ? ' (lower)' : ''), 8, h - 50, { color: col.s[3], size: 11.5, weight: 700 });
    const N = ['Same wavelength all round: everyone hears f₀', 'Ahead λ′ = (v − vs)T: shorter, so pitch up. Behind: longer, pitch down.', 'Observer meets crests faster: f′ = f₀ (v + vo)/v', 'Toward each other: top signs. Moving apart: bottom signs.'][step];
    const ws = N.split(' '); let a1 = '', b1 = ''; for (const q of ws) { if ((a1 + q).length < w / 7.2 && !b1) a1 += q + ' '; else b1 += q + ' '; }
    text(ctx, a1.trim(), w / 2, h - 28, { color: col.ink, size: 11, weight: 700, align: 'center' }); if (b1) text(ctx, b1.trim(), w / 2, h - 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); cv.redraw(); } };
}
