// 9.2 The stretched box. A region of space that grows with the universe (size ∝ a) holds a fixed number of matter
// particles (dots) and is filled with a cosmological constant (the even tint). A fixed "one cubic metre" frame
// that does not grow shows the densities: the dots inside it thin out as 1/a³, the tint stays exactly as dark.
// So the total dark energy in the growing region rises as a³. Step 4 shows why the books still balance: a
// substance with constant density must have negative pressure p = −ρc² (like a stretched spring pulling back
// on a piston), so stretching it does work on it. Bars on the right compare densities per cubic metre.
import { canvas, text, title, dot, rng, loop, calm, lerp, arrow, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 400, min: 300, label: 'A growing box of space: matter thins out while the cosmological constant stays the same in every cubic metre' });
  let step = 0, a = 1, target = 1;
  const anim = loop(host, (dt) => { a = lerp(a, target, Math.min(1, dt * 2.2)); if (Math.abs(a - target) < 1e-3) { a = target; anim.pause(); } cv.redraw(); }, { autoplay: false });
  const r = rng(42);
  const pts = Array.from({ length: 70 }, () => [r() - 0.5, r() - 0.5]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['A box of space today', 'Space grows 1.5 times', 'Space grows 2 times', 'Why the books balance: negative pressure'][step], col);
    const barW = Math.min(150, w * 0.34), boxArea = w - barW - 30;
    const cx = 10 + boxArea / 2, cy = top + (h - top) / 2 + 2;
    const S = Math.min(boxArea, h - top - 30) / 2.25; // pixels per unit at a = 1 (box side 1 → S px)... a up to 2
    const side = S * a;
    // dark energy: same tint everywhere inside the growing box
    ctx.save();
    ctx.globalAlpha = 0.22; ctx.fillStyle = col.s[1];
    ctx.fillRect(cx - side / 2, cy - side / 2, side, side);
    ctx.restore();
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(cx - side / 2, cy - side / 2, side, side);
    // matter: the same 70 particles, carried apart
    for (const [x, y] of pts) dot(ctx, cx + x * side * 0.94, cy + y * side * 0.94, 3, col.ink);
    // the fixed 1 m³ frame (does not grow)
    const f = S * 0.5;
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2;
    ctx.strokeRect(cx - f / 2, cy - f / 2, f, f); ctx.restore();
    const inside = pts.filter(([x, y]) => Math.abs(x * side * 0.94) < f / 2 && Math.abs(y * side * 0.94) < f / 2).length;
    text(ctx, '1 m³', cx, cy - f / 2 - 9, { color: col.s[0], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    if (step === 3) {
      // piston: the box wall pushed outwards, dark energy pulls it back (tension)
      const x0 = cx + side / 2;
      arrow(ctx, x0 + 4, cy - 14, x0 + 34, cy - 14, col.ink, 2);
      arrow(ctx, x0 + 34, cy + 14, x0 + 6, cy + 14, col.s[1], 2.5);
      text(ctx, 'growth', x0 + 38, cy - 14, { color: col.ink, size: 11, weight: 700, halo: col.panel });
      text(ctx, 'pull', x0 + 38, cy + 14, { color: col.s[1], size: 11, weight: 700, halo: col.panel });
    }
    // bars: density per cubic metre (today = 1)
    const bx = w - barW - 8, bTop = top + 40, bBot = h - 40, bh = bBot - bTop, rm = 1 / a ** 3, rl = 1;
    text(ctx, 'density per m³', bx + barW / 2, bBot + 28, { color: col.muted, size: 11, align: 'center' });
    const bar = (i, v, c, lab) => {
      const x = bx + 8 + i * (barW / 2), bw = barW / 2 - 16, y = bBot - bh * Math.min(1, v);
      ctx.fillStyle = c; ctx.fillRect(x, y, bw, bBot - y);
      text(ctx, lab, x + bw / 2, bBot + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, v.toFixed(2), x + bw / 2, y - 9, { color: col.ink, size: 11, align: 'center', halo: col.panel });
    };
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(bx, bBot + 0.5); ctx.lineTo(w - 8, bBot + 0.5); ctx.stroke();
    bar(0, rm, col.ink, 'matter');
    bar(1, rl, col.s[1], 'Λ');
    out.innerHTML = step === 3 ? 'Dark energy pulls back on the growing box like a stretched spring (<b>p = −ρc²</b>), so the growth does work on it: that work is the extra dark energy.'
      : `Size ×<b>${a.toFixed(2)}</b> · dots inside the fixed 1 m³ frame: <b>${inside}</b> · matter per m³ ×<b>${rm.toFixed(2)}</b> · Λ per m³ ×<b>1.00</b> · Λ in the whole box ×<b>${(a ** 3).toFixed(2)}</b>`;
  };
  const out = readout(host);
  cv.redraw();
  return {
    step(i) {
      step = Math.min(3, i); target = [1, 1.5, 2, 2][step];
      if (calm()) a = target;
      cv.redraw(); anim.play();
    },
  };
}
