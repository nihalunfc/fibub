// Class 12 Electrostatic Potential and Capacitance: a conductor in an electric field. Free electrons drift against the applied field and pile up on the left face,
// leaving + on the right. These surface charges make an opposite field inside; the motion stops when it exactly cancels the applied field, so E inside = 0
// (electrostatic shielding, and why the surface is an equipotential). The animation relaxes the induced field toward the applied one.
import { canvas, text, title, arrow, rng, row, button, readout, loop } from '../../kit.js';

export default function (host) {
  let on = false, ei = 0, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A metal slab in an electric field: surface charges build up until the field inside is zero' });
  const ctl = row(host), ro = readout(host);
  button(ctl, 'Switch field on', () => { on = true; });
  button(ctl, 'Switch field off', () => { on = false; });
  const rnd = rng(7), pts = Array.from({ length: 26 }, () => ({ u: rnd(), v: rnd() }));
  loop(host, (dt) => { ei += ((on ? 1 : 0) - ei) * Math.min(1, dt * 1.6); t += dt; ro.textContent = `Applied field E₀ = ${on ? '1.00' : '0.00'};  induced field = ${ei.toFixed(2)};  net field inside = ${(on ? 1 - ei : -ei).toFixed(2)} (→ 0 once settled).`; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Free electrons move until E inside = 0', col) + 8, L = w * 0.28, R = w * 0.72, T = top + 24, B = h - 30;
    ctx.fillStyle = col.soft; ctx.fillRect(L, T, R - L, B - T); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(L, T, R - L, B - T);
    const E0 = on ? 1 : 0;
    for (const y of [T + 6, (T + B) / 2, B - 6]) { arrow(ctx, 10, y, L - 6, y, E0 ? col.s[3] : col.line, 2, 7); arrow(ctx, R + 6, y, w - 10, y, E0 ? col.s[3] : col.line, 2, 7); }
    text(ctx, 'E₀', 14, T - 8, { color: col.s[3], size: 12, weight: 700 });
    pts.forEach((p, i) => { const x = L + 14 + p.u * (R - L - 28) * (1 - ei * 0.9) + 0 - ei * 0, y = T + 12 + p.v * (B - T - 24); const jig = Math.sin(t * 3 + i) * 1.2; text(ctx, '−', L + 10 + p.u * (R - L - 28) * (1 - 0.8 * ei) * 0.97 + jig, y, { color: col.s[0], size: 14, weight: 700, align: 'center' }); });
    for (let c = 0; c < 4; c++) for (let i = 0; i < 7; i++) text(ctx, '+', L + 14 + c * (R - L - 28) / 3, T + 14 + i * (B - T - 28) / 6, { color: col.s[2], size: 12, weight: 700, align: 'center', });
    if (ei > 0.1) { for (const y of [(T + B) / 2 - 20, (T + B) / 2 + 20]) arrow(ctx, R - 24, y, L + 24 + (1 - ei) * (R - L - 50) * 0 + 0, y, col.s[1], 2 * ei + 0.5, 7); text(ctx, 'induced field', (L + R) / 2, (T + B) / 2, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.soft }); }
    text(ctx, 'metal slab', (L + R) / 2, B + 14, { color: col.muted, size: 11, align: 'center' });
  };
}
