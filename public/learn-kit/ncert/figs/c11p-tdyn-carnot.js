// Class 11 Thermodynamics (step player): the Carnot cycle for an ideal gas between Th = 500 K and Tc = 300 K (gamma = 5/3, nR = 1 in these units). 1-2 isothermal expansion at Th (heat Qh in), 2-3 adiabatic expansion cooling to Tc,
// 3-4 isothermal compression at Tc (heat Qc out), 4-1 adiabatic compression back to Th. Qh = nR Th ln(V2/V1), Qc = nR Tc ln(V3/V4), and V3/V4 = V2/V1 so Qc/Qh = Tc/Th: efficiency = 1 - Tc/Th = 40 %. The enclosed area is the net work.
import { canvas, text, title, axes, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'The four steps of the Carnot cycle on a pressure-volume diagram with heat flows' });
  const Th = 500, Tc = 300, g = 5 / 3, V1 = 1, V2 = 2, r = (Th / Tc) ** (1 / (g - 1)), V3 = V2 * r, V4 = V1 * r;
  const seg = [
    (u) => { const V = V1 + (V2 - V1) * u; return [V, Th / V]; },
    (u) => { const V = V2 + (V3 - V2) * u; return [V, (Th / V2) * (V2 / V) ** g]; },
    (u) => { const V = V3 + (V4 - V3) * u; return [V, Tc / V]; },
    (u) => { const V = V4 + (V1 - V4) * u; return [V, (Tc / V4) * (V4 / V) ** g]; },
  ];
  const T = ['The Carnot cycle: two isotherms, two adiabats', '1 → 2: isothermal expansion at Tₕ', '2 → 3: adiabatic expansion', '3 → 4: isothermal compression at T꜀', '4 → 1: adiabatic compression', 'Net work and efficiency'];
  const txt = [['Gas in a cylinder, a hot reservoir (500 K), a cold one', '(300 K) and an insulating stand.'], ['Gas touches the hot reservoir and expands slowly.', 'Qₕ = nRTₕ ln(V₂/V₁) = 347 in. ΔU = 0.'], ['Insulated: Q = 0. It expands, does work and cools', 'from Tₕ to T꜀ (T V^(γ−1) is constant).'], ['Gas touches the cold reservoir and is squeezed slowly.', 'Q꜀ = nRT꜀ ln(V₃/V₄) = 208 out. ΔU = 0.'], ['Insulated again: compressed, the gas heats back up', 'from T꜀ to Tₕ. The cycle is closed.'], ['W = Qₕ − Q꜀ = 347 − 208 = 139 (the loop area).', 'η = W/Qₕ = 1 − T꜀/Tₕ = 40 %. Only a fraction becomes work.']];
  loop(host, (dt) => { t += dt; if (step >= 1 && step <= 4) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col), A = axes(ctx, w, h - 56, col, { x: [0, 5], y: [0, 560], xlabel: 'volume', ylabel: 'pressure', l: 40, t: top + 6, b: 30, xt: [], yt: [] }), cols = [col.s[1], col.s[0], col.s[3], col.s[2]];
    const P = (sgm, u) => { const [V, p] = sgm(u); return [A.X(V), A.Y(p)]; };
    for (let k = 0; k < 4; k++) { const pts = []; for (let i = 0; i <= 40; i++) pts.push(P(seg[k], i / 40)); const done = step === 0 || step === 5 || step > k + 1 || step === k + 1; line(ctx, pts, done ? cols[k] : col.line, step === k + 1 ? 4 : step === 0 || step === 5 ? 3 : 2.5, step > 0 && step < 5 && step !== k + 1 && step < k + 1 ? [4, 3] : undefined); }
    if (step === 5) { ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.25; ctx.beginPath(); for (let k = 0; k < 4; k++) for (let i = 0; i <= 40; i++) { const [x, y] = P(seg[k], i / 40); ctx.lineTo(x, y); } ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    [[V1, Th / V1, '1'], [V2, Th / V2, '2'], [V3, Tc / V3, '3'], [V4, Tc / V4, '4']].forEach(([V, p, n]) => { dot(ctx, A.X(V), A.Y(p), 4, col.ink); text(ctx, n, A.X(V) + (n === '1' || n === '4' ? -10 : 10), A.Y(p) - 8, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    if (step >= 1 && step <= 4) { const u = (t * 0.4) % 1, [x, y] = P(seg[step - 1], u); dot(ctx, x, y, 6, col.s[7] ?? col.ink, col.panel); }
    if (step === 1) { arrow(ctx, A.X(1.4), A.Y(380), A.X(1.4), A.Y(300), cols[0], 3, 8); text(ctx, 'Qₕ in', A.X(1.45) + 6, A.Y(340), { color: cols[0], size: 11.5, weight: 700 }); }
    if (step === 3) { arrow(ctx, A.X(3.2), A.Y(60), A.X(3.2), A.Y(150), cols[2], 3, 8); text(ctx, 'Q꜀ out', A.X(3.2) + 8, A.Y(100), { color: cols[2], size: 11.5, weight: 700 }); }
    if (step === 5) text(ctx, 'net work W', A.X(2.7), A.Y(250), { color: col.s[4] ?? col.ink, size: 12, weight: 700, align: 'center' });
    txt[step].forEach((s, i) => text(ctx, s, w / 2, h - 36 + i * 17, { color: i ? col.muted : col.ink, size: 11.5, weight: i ? 400 : 700, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
