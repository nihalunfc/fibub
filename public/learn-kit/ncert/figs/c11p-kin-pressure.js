// Class 11 Kinetic Theory (step player): pressure of a gas from molecular hits. One molecule of mass m bounces between the walls of a box of side L.
// Each hit on the right wall reverses vx, so the wall receives momentum 2 m vx. Hits come every 2L/vx, so the average force is m vx^2 / L.
// For N molecules F = N m <vx^2> / L and <vx^2> = <v^2>/3 (no direction is special), so P = F/L^2 = N m <v^2> / 3V = (1/3) rho <v^2>.
import { canvas, text, title, arrow, loop, rng } from '../../kit.js';

export default function (host) {
  let step = 0, flash = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Molecules bouncing in a box and pushing on the right wall' });
  const R = rng(7), many = [];
  for (let i = 0; i < 16; i++) { const a = R() * 6.283, s = 0.35 + R() * 0.5; many.push({ x: 0.1 + R() * 0.8, y: 0.1 + R() * 0.8, vx: Math.cos(a) * s, vy: Math.sin(a) * s }); }
  const one = { x: 0.3, y: 0.5, vx: 0.7, vy: 0.22 };
  const TITLES = ['One molecule in a cubical box', 'A hit on the wall: momentum 2mvx', 'Force from one molecule = m vx² / L', 'Add up all N molecules', 'No direction is special: P = ⅓ ρ v²'];
  const anim = loop(host, (dt) => {
    const list = step >= 3 ? many : [one];
    for (const m of list) {
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.x > 0.97) { m.x = 0.97; m.vx = -Math.abs(m.vx); flash = 1; }
      if (m.x < 0.03) { m.x = 0.03; m.vx = Math.abs(m.vx); }
      if (m.y > 0.97) { m.y = 0.97; m.vy = -Math.abs(m.vy); }
      if (m.y < 0.03) { m.y = 0.03; m.vy = Math.abs(m.vy); }
    }
    flash = Math.max(0, flash - dt * 3); cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col);
    const bx = 18, by = top + 8, bw = Math.min(w - 36, (h - top - 70) * 1.25), bh = h - top - 74;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = flash > 0 ? col.s[3] : col.ink; ctx.globalAlpha = 0.35 + flash * 0.65; ctx.fillRect(bx + bw - 4, by, 6, bh); ctx.globalAlpha = 1;
    text(ctx, 'wall', bx + bw + 4, by + bh / 2, { color: col.muted, size: 10, base: 'middle' });
    const list = step >= 3 ? many : [one];
    for (const m of list) {
      const px = bx + m.x * bw, py = by + m.y * bh;
      ctx.fillStyle = step >= 3 ? col.s[0] : col.s[1]; ctx.beginPath(); ctx.arc(px, py, step >= 3 ? 5 : 7, 0, 7); ctx.fill();
      if (step < 3) { arrow(ctx, px, py, px + m.vx * 34, py + m.vy * 34, col.s[1], 2, 7); }
    }
    if (step === 1 || step === 2) {
      arrow(ctx, bx + bw - 54, by + 16, bx + bw - 12, by + 16, col.s[0], 2.5, 8); text(ctx, 'before: +mvx', bx + bw - 54, by + 30, { color: col.s[0], size: 10.5, weight: 700 });
      arrow(ctx, bx + bw - 12, by + 52, bx + bw - 54, by + 52, col.s[2], 2.5, 8); text(ctx, 'after: −mvx', bx + bw - 54, by + 66, { color: col.s[2], size: 10.5, weight: 700 });
      text(ctx, 'change = 2mvx', bx + bw - 54, by + 86, { color: col.ink, size: 11, weight: 700 });
    }
    const L = [['vy only slides along the wall:', 'it does not push on it'], ['Δp on molecule = −2mvx', 'wall gets +2mvx (Newton III)'], ['Time between hits t = 2L / vx', 'F = 2mvx / (2L/vx) = m vx²/L'], ['F = (m/L)(vx₁² + vx₂² + …) = N m ⟨vx²⟩ / L', 'sum over all N molecules'], ['⟨vx²⟩ = ⟨v²⟩/3  →  P = F/L² = N m ⟨v²⟩ / 3V', '= ⅓ ρ ⟨v²⟩  (ρ = Nm/V)']][step];
    text(ctx, L[0], w / 2, h - 34, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, L[1], w / 2, h - 14, { color: col.muted, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); if (step >= 3) flash = 0; cv.redraw(); } };
}
