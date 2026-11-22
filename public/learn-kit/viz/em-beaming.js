// Relativistic beaming of radiation. A charge moving at speed βc to the right radiates; the polar plot is the power per unit
// solid angle (per unit emission time) in each direction. At β = 0 the pattern is the familiar sin²θ doughnut, symmetric about
// the acceleration. Speed it up and the lobes swing forward into a narrow cone of half-angle about 1/γ: why synchrotron light
// comes out in a searchlight beam. Choose acceleration along the velocity (linear accelerator) or across it (circular orbit).
import { canvas, text, row, slider, choice, readout, arrow } from '../kit.js';

export default function (host) {
  let kind = 'perp', b = 0.6;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 280, label: 'Polar plot of radiated power for a charge at different speeds' });
  const ctl = row(host);
  choice(ctl, 'Acceleration', [['para', 'Along v (linear)'], ['perp', 'Across v (circular orbit)']], kind, (v) => { kind = v; upd(); });
  slider(ctl, { label: 'Speed β = v/c', min: 0, max: 0.99, value: b, step: 0.01, fmt: (x) => x.toFixed(2), oninput: (x) => { b = x; upd(); } });
  const out = readout(host);
  const f = (th) => { const c = Math.cos(th), s = Math.sin(th), d = 1 - b * c; return kind === 'para' ? s * s / Math.pow(d, 5) : (d * d - (1 - b * b) * s * s) / Math.pow(d, 5); };
  const peak = () => { let m = 0, am = 0; for (let k = 0; k <= 720; k++) { const t = k / 720 * Math.PI, v = f(t); if (v > m) { m = v; am = t; } } return [m, am]; };
  function upd() { const g = 1 / Math.sqrt(1 - b * b), [m, am] = peak(), m0 = kind === 'para' ? 1 : 1; out.innerHTML = `γ = ${g.toFixed(2)}. Strongest direction: <b>${(am * 180 / Math.PI).toFixed(1)}°</b> from the velocity; typical opening angle of the beam ≈ 1/γ = ${(180 / Math.PI / g).toFixed(1)}°. Peak power per solid angle is <b>${m.toFixed(1)}×</b> the β = 0 value (the plot is rescaled to the same size). ${kind === 'perp' ? 'Circular motion at high β: a thin forward cone, as in a synchrotron.' : 'Linear acceleration: two lobes tipped forward; none exactly along v.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.46, cy = h / 2, [m] = peak(), Rm = Math.min(w * 0.42, h * 0.42), pt = (th, sg) => { const r = Rm * Math.pow(Math.max(0, f(th)) / m, 0.75); return [cx + r * Math.cos(th), cy - sg * r * Math.sin(th)]; };
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; [0.33, 0.66, 1].forEach((q) => { ctx.beginPath(); ctx.arc(cx, cy, Rm * q, 0, 7); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(cx - Rm - 6, cy); ctx.lineTo(cx + Rm + 6, cy); ctx.stroke();
    ctx.beginPath(); for (let k = 0; k <= 180; k++) { const [x, y] = pt(k / 180 * Math.PI, 1); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } for (let k = 180; k >= 0; k--) { const [x, y] = pt(k / 180 * Math.PI, -1); ctx.lineTo(x, y); } ctx.closePath(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[5]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 7); ctx.fill(); arrow(ctx, cx, cy + 18, cx + 18 + b * 60, cy + 18, col.s[0], 2.6, 8); text(ctx, 'v', cx + 24 + b * 60, cy + 18, { color: col.s[0], size: 12, weight: 700 });
    if (kind === 'para') { arrow(ctx, cx, cy + 36, cx + 34, cy + 36, col.s[2], 2.2, 7); text(ctx, 'a', cx + 40, cy + 36, { color: col.s[2], size: 12, weight: 700 }); } else { arrow(ctx, cx - 40, cy + 56, cx - 40, cy + 22, col.s[2], 2.2, 7); text(ctx, 'a', cx - 34, cy + 44, { color: col.s[2], size: 12, weight: 700 }); }
    text(ctx, kind === 'para' ? 'a ∥ v: dP/dΩ ∝ sin²θ/(1 − β cosθ)⁵' : 'a ⊥ v (in the orbit plane)', 10, 16, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, 'angle θ from the direction of motion', 10, h - 10, { color: col.muted, size: 10.5 });
  };
  upd();
}
