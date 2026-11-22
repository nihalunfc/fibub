// Class 12 Semiconductors (step player): how a p-n junction forms. p side: many holes; n side: many electrons. Join them: carriers diffuse across (holes to n, electrons to p) and recombine
// near the junction. This uncovers fixed ions: negative acceptor ions on the p side, positive donor ions on the n side: the depletion layer. Its electric field (n to p) causes a drift current
// opposing the diffusion; at equilibrium they balance, leaving a barrier potential V0 of about 0.7 V (Si) or 0.3 V (Ge) across a layer about a micrometre thick.
import { canvas, text, title, arrow, line, loop, rng } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const r = rng(3);
  const H = Array.from({ length: 10 }, () => [r(), r(), r()]), E = Array.from({ length: 10 }, () => [r(), r(), r()]);
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 320, label: 'A p-n junction forming: carriers diffuse, recombine, and leave a depletion layer with an electric field' });
  const TITLES = ['Two separate crystals', 'Join them: diffusion begins', 'Recombination near the junction', 'The depletion layer and its field', 'Drift current fights back', 'Equilibrium: barrier potential'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col), y0 = top + 34, bh = 84, mid = w / 2, gapx = step === 0 ? 24 : 0, pw = mid - 18 - gapx, dw = step >= 3 ? 42 : step === 2 ? 22 : 0;
    const pL = 18, pR = mid - gapx, nL = mid + gapx, nR = w - 18;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.12; ctx.fillRect(pL, y0, pR - pL, bh); ctx.fillStyle = col.s[0]; ctx.fillRect(nL, y0, nR - nL, bh); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(pL, y0, pR - pL, bh); ctx.strokeRect(nL, y0, nR - nL, bh);
    text(ctx, 'p-type', pL + 6, y0 + 10, { color: col.muted, size: 10.5, weight: 700 }); text(ctx, 'n-type', nR - 6, y0 + 10, { color: col.muted, size: 10.5, weight: 700, align: 'right' });
    const ion = (x, y, neg) => text(ctx, neg ? '⊖' : '⊕', x, y, { color: neg ? col.s[3] : col.s[0], size: 13, align: 'center' });
    if (step >= 2) { ctx.fillStyle = col.panel; ctx.fillRect(mid - dw, y0 + 1, dw * 2, bh - 2); ctx.strokeStyle = col.s[2]; ctx.setLineDash([3, 3]); ctx.strokeRect(mid - dw, y0, dw * 2, bh); ctx.setLineDash([]); for (let i = 0; i < 4; i++) { ion(mid - dw / 2, y0 + 14 + i * 22, true); ion(mid + dw / 2, y0 + 14 + i * 22, false); } text(ctx, 'depletion layer', mid, y0 + bh + 11, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    const diff = step === 1 || step === 2 ? Math.min(40, t * 14 % 40) : 0;
    H.forEach(([a, b, ph], i) => { let x = pL + 8 + a * (pR - pL - 16) + Math.sin(t * 2 + ph * 6) * 4; const y = y0 + 12 + b * (bh - 24); const cross = step === 1 && i % 3 === 0 ? diff : 0; if (step >= 2 && x > mid - dw) return; if (step >= 2 && i % 3 === 0 && step < 3) return; ctx.beginPath(); ctx.arc(x + cross, y, 5, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); });
    E.forEach(([a, b, ph], i) => { let x = nL + 8 + a * (nR - nL - 16) + Math.sin(t * 2 + ph * 6) * 4; const y = y0 + 12 + b * (bh - 24); const cross = step === 1 && i % 3 === 0 ? diff : 0; if (step >= 2 && x < mid + dw) return; ctx.beginPath(); ctx.arc(x - cross, y, 4.5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); });
    if (step === 1) { arrow(ctx, mid - 36, y0 + bh + 16, mid + 36, y0 + bh + 16, col.s[3], 2.5, 8); text(ctx, 'holes diffuse', mid, y0 + bh + 30, { color: col.s[3], size: 10.5, align: 'center' }); arrow(ctx, mid + 36, y0 - 8, mid - 36, y0 - 8, col.s[0], 2.5, 8); text(ctx, 'electrons diffuse', mid, y0 - 20, { color: col.s[0], size: 10.5, align: 'center' }); }
    if (step >= 3) { arrow(ctx, mid + dw - 6, y0 + bh / 2, mid - dw + 6, y0 + bh / 2, col.s[2], 3, 9); text(ctx, 'E', mid, y0 + bh / 2 - 10, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    const gy = y0 + bh + 50, gh = h - gy - 46;
    if (step >= 4) { arrow(ctx, mid - 6, gy - 8, mid - 6 - 40, gy - 8, col.s[0], 2, 7); text(ctx, 'drift', mid - 26, gy - 20, { color: col.s[0], size: 10.5, align: 'center' }); }
    if (step === 4) { text(ctx, 'diffusion pushes carriers across; the field pushes them back (drift)', w / 2, gy + 6, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'diffusion current →  ← drift current: they cancel at equilibrium', w / 2, gy + 24, { color: col.s[7], size: 11.5, weight: 700, align: 'center' }); }
    if (step === 5 || step === 3) { const a0 = pL + 6, a1 = nR - 6, yb = gy + gh, yt = gy + 4; ctx.strokeStyle = col.muted; ctx.lineWidth = 1; line(ctx, [[a0, yb], [a1, yb]], col.muted, 1); line(ctx, [[a0, yb], [mid - dw, yb], [mid - dw, yb], [mid + dw, yt], [a1, yt]], col.s[2], 3); text(ctx, 'V₀', a1 - 4, yt + 12, { color: col.s[2], size: 12, weight: 700, align: 'right' }); text(ctx, 'potential', a0, gy - 2, { color: col.muted, size: 10.5 }); if (step === 5) text(ctx, 'V₀ ≈ 0.7 V (Si), 0.3 V (Ge); layer ≈ 1 µm thick', w / 2, h - 30, { color: col.s[7], size: 11.5, weight: 700, align: 'center' }); }
    if (step === 0) { text(ctx, 'p: many holes, few electrons.  n: many electrons, few holes.', w / 2, gy + 10, { color: col.ink, size: 11.5, align: 'center' }); text(ctx, 'Each crystal is neutral on its own.', w / 2, gy + 28, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 1) text(ctx, 'Carriers move from high concentration to low: diffusion.', w / 2, gy + 26, { color: col.ink, size: 11.5, align: 'center' });
    if (step === 2) { text(ctx, 'Holes meet electrons and disappear in pairs (recombination).', w / 2, gy + 10, { color: col.ink, size: 11.5, align: 'center' }); text(ctx, 'Left behind: fixed ions that cannot move.', w / 2, gy + 28, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 3) text(ctx, 'A field from n to p stops further crossing.', w / 2, h - 30, { color: col.s[7], size: 11.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
