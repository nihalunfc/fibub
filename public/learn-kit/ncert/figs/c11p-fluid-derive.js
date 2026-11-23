// Class 11 Mechanical Properties of Fluids (step player): Bernoulli's equation from the work-energy theorem. A steady, incompressible, non-viscous fluid moves through a pipe that narrows and rises.
// In time dt a slug of volume dV = A1 v1 dt = A2 v2 dt (continuity) enters at 1 and leaves at 2. Work by pressure forces = (P1 - P2) dV. Change in KE = 1/2 rho dV (v2^2 - v1^2), in PE = rho dV g (h2 - h1).
// Equating gives P1 + 1/2 rho v1^2 + rho g h1 = P2 + 1/2 rho v2^2 + rho g h2.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 340, label: 'A pipe that narrows and rises with the fluid slug that moves through it, used to derive Bernoulli\'s equation' });
  const T = ['A pipe that narrows and rises', 'In time dt a slug moves in and out', 'Work done by the pressures', 'Change in kinetic and potential energy', 'Work = change in energy', 'Bernoulli’s equation'];
  loop(host, (dt) => { t += dt; if (step === 1) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, Y = (hh) => top + 160 - hh, xa = 14, xb = w * 0.36, xc = w * 0.64, xd = w - 14, A1 = 34, A2 = 20, y1 = 120, y2 = 40;
    const cyl = (x) => { const u = Math.min(1, Math.max(0, (x - xb) / (xc - xb))), s = u * u * (3 - 2 * u); return [Y(y1 + (y2 - y1) * s) + 0, A1 + (A2 - A1) * s]; };
    const up = [], dn = []; for (let x = xa; x <= xd; x += 4) { const [c, a] = cyl(x); up.push([x, c - a]); dn.push([x, c + a]); }
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.15; ctx.beginPath(); up.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); dn.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, up, col.ink, 2); line(ctx, dn, col.ink, 2);
    line(ctx, [[xa, Y(0) + 8], [xd, Y(0) + 8]], col.muted, 1, [3, 3]); text(ctx, 'reference level (h = 0)', xa + 2, Y(0) + 20, { color: col.muted, size: 10 });
    const slug = (x0, wd, c) => { const [cy, a] = cyl(x0 + wd / 2); ctx.fillStyle = c; ctx.globalAlpha = 0.6; ctx.fillRect(x0, cy - a, wd, 2 * a); ctx.globalAlpha = 1; };
    const s = step === 1 ? 0.5 + 0.5 * Math.sin(t * 2.5) : 1;
    if (step >= 1) { slug(xa + 40, 24 * (0.4 + 0.6 * s), col.s[1]); slug(xd - 64, 24 * 0.74 * (0.4 + 0.6 * s) * 1.0, col.s[3]); }
    text(ctx, 'A₁, v₁, P₁, h₁', xa + 4, Y(y1) + A1 + 14, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, 'A₂, v₂, P₂, h₂', xd - 4, Y(y2) + A2 + 14, { color: col.ink, size: 10.5, weight: 700, align: 'right' });
    arrow(ctx, xa + 4, Y(y1) - 6, xa + 30, Y(y1) - 6, col.s[1], 2, 6); arrow(ctx, xd - 4, Y(y2) + 6, xd - 28, Y(y2) + 6, col.s[3], 2, 6);
    const by = h - 78, L = (str, i, c = col.ink, b = 700) => text(ctx, str, w / 2, by + i * 18, { color: c, size: 12, weight: b, align: 'center' });
    if (step === 0) { L('Steady flow, no friction, fluid cannot be squeezed.', 0, col.muted, 400); L('We follow the fluid between the two cross-sections.', 1, col.muted, 400); }
    if (step === 1) { L('dV = A₁ v₁ dt = A₂ v₂ dt   (continuity)', 0, col.s[7]); L('red slug enters at 1, orange slug leaves at 2: same volume', 1, col.muted, 400); }
    if (step === 2) { L('Push at 1: P₁A₁ × v₁dt = P₁ dV (positive work)', 0); L('Push at 2 opposes: −P₂ dV', 1); L('W = (P₁ − P₂) dV', 2, col.s[7]); }
    if (step === 3) { L('ΔKE = ½ρ dV (v₂² − v₁²)', 0); L('ΔPE = ρ dV g (h₂ − h₁)', 1); L('(the middle of the fluid is unchanged)', 2, col.muted, 400); }
    if (step === 4) { L('(P₁ − P₂) dV = ½ρ dV (v₂² − v₁²) + ρ dV g (h₂ − h₁)', 0, col.ink, 600); L('divide by dV and collect the 1s and the 2s', 1, col.muted, 400); }
    if (step === 5) { L('P + ½ρv² + ρgh = constant', 0, col.s[7]); L('pressure + kinetic energy + height energy, per unit volume', 1, col.muted, 400); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
