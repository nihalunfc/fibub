// Class 11 Biology, Locomotion (step player): one turn of the cross-bridge cycle. A myosin head with ADP + Pi bound to actin tilts (the power stroke) and pulls the thin filament toward the
// middle of the sarcomere; a fresh ATP releases the head, which splits the ATP and resets. Each head takes many such steps, like hand-over-hand rope pulling.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A myosin head attaching to actin, tilting to pull it, releasing with ATP and resetting' });
  const T = ['Ready: head cocked with ADP + Pi', 'Ca²⁺ has uncovered the site: head binds actin', 'Power stroke: head tilts, actin slides', 'ATP binds: the head lets go', 'ATP splits: head re-cocks'];
  const SH = [0, 0, -34, -34, -34];    // actin shift (px) after a stroke
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), ay = t0 + 70, my = h - 90, sh = SH[step] + (step === 4 ? 0 : 0);
    // thick filament (bottom)
    ctx.fillStyle = col.s[3]; ctx.fillRect(14, my, w - 28, 12); text(ctx, 'thick filament (myosin)', 18, my + 28, { color: col.s[3], size: 10.5, weight: 700 });
    // actin with beads
    for (let i = 0; i < 12; i++) { const x = 64 + i * 30 + sh + (step === 4 ? 0 : 0); ctx.beginPath(); ctx.arc(x, ay, 9, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); }
    text(ctx, 'thin filament (actin)', 18, ay - 22, { color: col.s[0], size: 10.5, weight: 700 });
    // tropomyosin strand covers sites until step 1
    if (step === 0) { line(ctx, [[20, ay - 4], [w - 20, ay - 4]], col.s[2], 4); text(ctx, 'tropomyosin covers the binding sites', w - 18, ay + 22, { color: col.s[2], size: 10, align: 'right' }); }
    else if (step === 1 || step === 2) text(ctx, 'sites uncovered (Ca²⁺ on troponin)', w - 18, ay + 22, { color: col.s[2], size: 10, align: 'right' });
    // myosin head: base at (bx, my), tip at attach point (px, ay+9)
    const px = 150 + (step >= 2 && step <= 3 ? SH[step] * 0 : 0), bx = [px - 50, px - 40, px + 10, px + 10, px - 50][step];
    const tipx = step === 0 ? px - 30 : step === 1 ? px - 4 : step === 2 ? px - 4 + SH[2] : step === 3 ? px - 22 : px - 30;
    const tipy = step === 1 || step === 2 ? ay + 9 : ay + 36;
    line(ctx, [[bx, my], [tipx, tipy]], col.s[3], 6); ctx.beginPath(); ctx.arc(tipx, tipy, 8, 0, 7); ctx.fillStyle = step === 1 || step === 2 ? col.s[3] : col.s[2]; ctx.fill();
    const lab = ['ADP + Pi', 'ADP + Pi', 'ADP + Pi leave', 'ATP', 'ADP + Pi'][step]; text(ctx, lab, tipx + 14, tipy + 14, { color: col.ink, size: 10.5, weight: 700 });
    if (step === 2) arrow(ctx, w * 0.62, ay - 34, w * 0.62 - 50, ay - 34, col.s[3], 3, 9), text(ctx, 'actin slides toward the centre', w * 0.62 - 25, ay - 46, { color: col.s[3], size: 10.5, align: 'center', weight: 700 });
    text(ctx, ['1', '2', '3', '4', '5'][step] + ' of 5', w - 14, h - 14, { color: col.muted, size: 10.5, align: 'right' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
