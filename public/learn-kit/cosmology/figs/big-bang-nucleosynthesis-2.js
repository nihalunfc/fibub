// 6.6 The nuclear recipe of the first minutes on a chart of light nuclei (protons up, neutrons across), in five
// steps: (1) n + p → D, but light smashes deuterium at once (the bottleneck, until kT ≈ 0.08 MeV); (2) once D
// survives: D + p → ³He, D + D → T + p and ³He + n; (3) T + D → ⁴He + n and ³He + D → ⁴He + p, so nearly every
// neutron ends in helium-4; (4) no stable nucleus has 5 or 8 particles, so the chain stalls; only a trace of
// ⁷Li (T + ⁴He) and ⁷Be (³He + ⁴He, which later becomes ⁷Li) is made; (5) the final mix.
import { canvas, text, title, arrow, line } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 480, min: 320, label: 'Chart of the lightest nuclei with the reactions of Big Bang nucleosynthesis drawn step by step' });
  let step = 0;
  // [key, label, protons Z, neutrons N]
  const NUC = [['n', 'n', 0, 1], ['p', 'p (H)', 1, 0], ['D', 'D', 1, 1], ['T', 'T', 1, 2], ['He3', '³He', 2, 1], ['He4', '⁴He', 2, 2], ['Li7', '⁷Li', 3, 4], ['Be7', '⁷Be', 4, 3], ['Li6', '⁶Li', 3, 3]];
  const GAP = [['⁵He', 2, 3], ['⁵Li', 3, 2], ['⁸Be', 4, 4]];
  const shown = [['n', 'p', 'D'], ['n', 'p', 'D', 'T', 'He3'], ['n', 'p', 'D', 'T', 'He3', 'He4'], ['n', 'p', 'D', 'T', 'He3', 'He4', 'Li7', 'Be7', 'Li6'], ['p', 'D', 'He3', 'He4', 'Li7', 'Li6']];
  const FINAL = { p: '75% of mass', He4: '25% of mass', D: '2.5 per 100,000 H', He3: '1 per 100,000 H', Li7: '5 per 10 billion H', T: 'decays to ³He', Be7: 'decays to ⁷Li', Li6: 'tiny trace' };
  const heads = ['1. Deuterium is smashed', '2. Deuterium survives (3 min)', '3. Neutrons end in helium-4', '4. Dead ends at 5 and 8', '5. The final mix (20 min)'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, heads[step], col) + 8;
    const L = 40, R = w - 10, T = top + 4, B = h - 34;
    const cw = (R - L) / 5, ch = (B - T) / 5;
    const X = (N) => L + (N + 0.5) * cw, Y = (Z) => B - (Z + 0.5) * ch;
    // grid and axis labels
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(L + i * cw, T); ctx.lineTo(L + i * cw, B); ctx.stroke(); ctx.beginPath(); ctx.moveTo(L, T + i * ch); ctx.lineTo(R, T + i * ch); ctx.stroke(); }
    for (let i = 0; i < 5; i++) { text(ctx, String(i), X(i), B + 10, { color: col.muted, size: 11, align: 'center' }); text(ctx, String(i), L - 8, Y(i), { color: col.muted, size: 11, align: 'right' }); }
    text(ctx, 'neutrons →', (L + R) / 2, h - 8, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
    ctx.save(); ctx.translate(12, (T + B) / 2); ctx.rotate(-Math.PI / 2); text(ctx, 'protons →', 0, 0, { color: col.ink, size: 11.5, weight: 600, align: 'center', fit: false }); ctx.restore();
    const bw = Math.min(cw, ch) * 0.62;
    const box = (N, Z, label, fill, ink, dashed) => {
      const x = X(N) - bw / 2, y = Y(Z) - bw / 2;
      ctx.save();
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, bw, bw); }
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5; if (dashed) ctx.setLineDash([4, 3]); ctx.strokeRect(x, y, bw, bw);
      ctx.restore();
      text(ctx, label, X(N), Y(Z), { color: fill ? '#fff' : ink, size: bw > 40 ? 13 : 11.5, weight: 700, align: 'center', fit: false });
    };
    const on = shown[step];
    for (const [k, lab, Z, N] of NUC) {
      if (!on.includes(k)) continue;
      const big = (k === 'He4' && step >= 2) || (k === 'p');
      box(N, Z, lab, big ? (k === 'p' ? col.s[0] : col.s[1]) : null, col.ink);
    }
    if (step === 3) for (const [lab, Z, N] of GAP) { box(N, Z, lab, null, col.s[7], true); line(ctx, [[X(N) - bw / 2, Y(Z) - bw / 2], [X(N) + bw / 2, Y(Z) + bw / 2]], col.s[7], 1.5); }
    const off = bw * 0.55;
    const go = (n1, z1, n2, z2, c = col.s[2]) => {
      const dx = X(n2) - X(n1), dy = Y(z2) - Y(z1), d = Math.hypot(dx, dy);
      arrow(ctx, X(n1) + (dx / d) * off, Y(z1) + (dy / d) * off, X(n2) - (dx / d) * off, Y(z2) - (dy / d) * off, c, 2.2, 8);
    };
    if (step === 0) {
      go(1, 0, 1, 1); go(0, 1, 1, 1);
      text(ctx, '+ light → smashed!', X(1) + bw / 2 + 6, Y(1) - 10, { color: col.s[7], size: 11.5, weight: 700, halo: col.panel });
    }
    if (step === 1) { go(1, 1, 1, 2); go(1, 1, 2, 1); text(ctx, 'D + p, D + D', X(2) + bw / 2 + 4, Y(1.5), { color: col.s[2], size: 11, weight: 700, halo: col.panel }); }
    if (step === 2) { go(1, 2, 2, 2); go(2, 1, 2, 2); text(ctx, '+ D', X(2) + bw / 2 + 4, Y(2), { color: col.s[2], size: 11, weight: 700, halo: col.panel }); }
    if (step === 3) { go(2, 2, 4, 3, col.muted); go(2, 2, 3, 4, col.muted); text(ctx, 'no stable 5 or 8', X(3), Y(0.2), { color: col.s[7], size: 11.5, weight: 700, align: 'center', halo: col.panel }); }
    if (step === 4) {
      const lines = [['H', '75% of the mass'], ['⁴He', '25% of the mass'], ['D', '2.5 per 100,000 H'], ['³He', '1 per 100,000 H'], ['⁷Li', '5 per 10 billion H']];
      lines.forEach(([a, b], i) => { text(ctx, a, L + 6, T + 12 + i * 15, { color: col.ink, size: 11, weight: 700 }); text(ctx, b, L + 34, T + 12 + i * 15, { color: col.ink, size: 11, halo: col.panel }); });
      text(ctx, 'T → ³He, ⁷Be → ⁷Li later', L + 6, T + 12 + 5 * 15, { color: col.muted, size: 10.5 });
    }
  };
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
