// Class 12 Chemistry, Chemical Kinetics (step player): the method of initial rates. Data for A + B -> products:
// exp 1 [A] 0.10, [B] 0.10, rate 2.0e-3; exp 2 [A] 0.20, [B] 0.10, rate 4.0e-3; exp 3 [A] 0.10, [B] 0.20, rate 8.0e-3 (mol/L/s). Change one reactant at a time:
// doubling [A] doubles the rate (order 1 in A); doubling [B] makes it 4 times (order 2 in B). rate = k[A][B]^2, k = 2.0e-3 / (0.10 x 0.10^2) = 2.0 L^2 mol^-2 s^-1; overall order 3.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Three experiments, initial rates measured', 'Compare 1 and 2: only [A] changes', 'Compare 1 and 3: only [B] changes', 'Write the rate law', 'Find k from any experiment'];
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 320, label: 'A table of three initial rate experiments with the order found step by step' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 14, L = 12, cw = (w - 24) / 4, rh = 30;
    const heads = ['exp', '[A]', '[B]', 'rate'], data = [['1', '0.10', '0.10', '2.0×10⁻³'], ['2', '0.20', '0.10', '4.0×10⁻³'], ['3', '0.10', '0.20', '8.0×10⁻³']];
    heads.forEach((s, i) => text(ctx, s, L + cw * (i + 0.5), t0, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    const hi = step === 1 ? [0, 1] : step === 2 ? [0, 2] : step >= 4 ? [0] : [];
    data.forEach((r, ri) => { const y = t0 + 12 + ri * rh; if (hi.includes(ri)) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.16; ctx.fillRect(L, y, w - 24, rh - 4); ctx.globalAlpha = 1; } r.forEach((s, i) => { const changed = (step === 1 && ri === 1 && i === 1) || (step === 2 && ri === 2 && i === 2); text(ctx, s, L + cw * (i + 0.5), y + rh / 2 - 2, { color: changed ? col.s[3] : col.ink, size: 12, weight: changed ? 700 : 400, align: 'center' }); }); });
    text(ctx, 'units: mol/L and mol L⁻¹ s⁻¹', L, t0 + 12 + 3 * rh + 4, { color: col.muted, size: 10 });
    const y = t0 + 12 + 3 * rh + 30, P = (s, i, c = col.ink, sz = 12.5) => text(ctx, s, L, y + i * 24, { color: c, size: sz, weight: 700 });
    if (step === 1) { P('[A] × 2  (0.10 → 0.20),  [B] unchanged', 0, col.muted, 11.5); P('rate × 2  (2.0 → 4.0)', 1); P('2^x = 2, so x = 1: first order in A', 2, col.s[3]); }
    if (step === 2) { P('[B] × 2  (0.10 → 0.20),  [A] unchanged', 0, col.muted, 11.5); P('rate × 4  (2.0 → 8.0)', 1); P('2^y = 4, so y = 2: second order in B', 2, col.s[3]); }
    if (step === 3) { P('rate = k [A]¹ [B]²', 0, col.s[3], 16); P('order in A = 1, in B = 2', 1); P('overall order = 1 + 2 = 3', 2); }
    if (step === 4) { P('k = rate / ([A][B]²)', 0, col.muted, 12); P('= 2.0×10⁻³ / (0.10 × 0.10²)', 1); P('k = 2.0 L² mol⁻² s⁻¹', 2, col.s[2], 15); P('(units of k for third order)', 3, col.muted, 11); }
    if (step === 0) { P('rate = k [A]ˣ [B]ʸ — find x, y and k', 0); P('Change ONE reactant at a time.', 1, col.muted, 11.5); }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
