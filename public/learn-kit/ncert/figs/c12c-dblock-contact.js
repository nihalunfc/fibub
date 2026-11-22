// Class 12 Chemistry, d- and f-block (step player): vanadium(V) oxide as a catalyst in the contact process, 2SO2 + O2 -> 2SO3.
// V2O5 (V = +5) hands an oxygen to SO2 and becomes V2O4 (V = +4); V2O4 is then re-oxidised by O2 back to V2O5. Changing oxidation state is what lets a transition metal be a catalyst.
// The catalyst opens a two-hump path with a lower highest hump (smaller activation energy). It is unchanged at the end.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Catalytic cycle of vanadium oxide in the contact process, with the energy profile' });
  const TT = ['Without a catalyst: one high hump', 'V₂O₅ gives oxygen to SO₂', 'V₂O₄ takes oxygen from O₂', 'Net: catalyst unchanged', 'A lower highest hump'];
  loop(host, (dt) => { t += dt; if (step === 1 || step === 2) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cy = top + 52, rx = 52, lx = w * 0.28, rxx = w * 0.72;
    const node = (x, y, a, b, on) => { ctx.fillStyle = on ? col.soft : col.panel; ctx.strokeStyle = on ? col.s[0] : col.ink; ctx.lineWidth = on ? 3 : 1.6; ctx.beginPath(); ctx.arc(x, y, 36, 0, 7); ctx.fill(); ctx.stroke(); text(ctx, a, x, y - 7, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, b, x, y + 10, { color: col.muted, size: 11, align: 'center' }); };
    if (step >= 1 && step <= 3) {
      node(lx, cy, 'V₂O₅', 'V = +5', step !== 2); node(rxx, cy, 'V₂O₄', 'V = +4', step !== 1);
      arrow(ctx, lx + 38, cy - 14, rxx - 38, cy - 14, col.s[3], 2.5, 8); arrow(ctx, rxx - 38, cy + 14, lx + 38, cy + 14, col.s[2], 2.5, 8);
      text(ctx, 'gives O', w / 2, cy - 26, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'takes O', w / 2, cy + 28, { color: col.s[2], size: 11, weight: 700, align: 'center' });
      const p = (t * 0.6) % 1;
      if (step === 1) text(ctx, 'SO₂ + [O] → SO₃', w / 2, cy + 56, { color: col.ink, size: 13, weight: 700, align: 'center' });
      if (step === 2) text(ctx, '2V₂O₄ + O₂ → 2V₂O₅', w / 2, cy + 56, { color: col.ink, size: 13, weight: 700, align: 'center' });
      if (step === 3) { text(ctx, 'SO₂ in, SO₃ out. V₂O₅ comes back unchanged.', w / 2, cy + 56, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); }
      const px = step === 2 ? rxx - (rxx - lx) * p : lx + (rxx - lx) * p, py = step === 2 ? cy + 14 : cy - 14;
      if (step !== 3) { ctx.fillStyle = step === 1 ? col.s[3] : col.s[2]; ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill(); }
    } else if (step === 0) text(ctx, 'SO₂ and O₂ meet rarely with enough energy', w / 2, cy, { color: col.ink, size: 12.5, align: 'center' });
    else text(ctx, 'compare the two paths below', w / 2, cy, { color: col.ink, size: 12.5, align: 'center' });
    // energy profile
    const L = 40, R = w - 20, B = h - 30, T = cy + 84, X = (f) => L + f * (R - L);
    line(ctx, [[L, T - 6], [L, B], [R, B]], col.muted, 1.5); text(ctx, 'energy', L + 4, T - 4, { color: col.muted, size: 10.5 }); text(ctx, 'reaction path', R, B + 12, { color: col.muted, size: 10.5, align: 'right' });
    const hump = (f, hgt) => B - 30 - hgt * Math.exp(-Math.pow((f - 0.5) / 0.14, 2)) - 28 * f;
    const curve = (fn, c, wd) => { ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.beginPath(); for (let i = 0; i <= 80; i++) { const f = i / 80; i ? ctx.lineTo(X(f), fn(f)) : ctx.moveTo(X(f), fn(f)); } ctx.stroke(); };
    curve((f) => hump(f, B - T - 36), step === 0 || step === 4 ? col.s[3] : col.line, step === 0 || step === 4 ? 3 : 2);
    if (step >= 3) { const two = (f) => B - 30 - 28 * f - (B - T - 36) * 0.5 * (Math.exp(-Math.pow((f - 0.3) / 0.1, 2)) + Math.exp(-Math.pow((f - 0.7) / 0.1, 2))); curve(two, col.s[2], step === 4 ? 3 : 2); text(ctx, 'with V₂O₅', X(0.5), B - 14, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    if (step === 0 || step === 4) text(ctx, 'no catalyst', X(0.84), T + 14, { color: col.s[3], size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
