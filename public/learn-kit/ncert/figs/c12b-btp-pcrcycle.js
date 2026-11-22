// Class 12 Biology, Biotechnology: Principles and Processes (step player): one cycle of the polymerase chain reaction (PCR).
// Denaturation (about 94 C) splits the double strand; annealing (about 54 C) lets two short primers bind the ends of the target; extension (72 C)
// lets heat-stable Taq polymerase add nucleotides to each primer. One double strand becomes two, so n cycles give 2^n copies of the target.
import { canvas, text, title, line, arrow, lerp, loop } from '../../kit.js';

export default function (host) {
  let st = 0, T = 25, tgtT = 25;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'One PCR cycle: denature the DNA at 94 degrees, anneal primers at 54 degrees, extend with Taq polymerase at 72 degrees' });
  const TT = [25, 94, 54, 72, 72], TITLES = ['Start: one double strand', 'Step 1: denature, 94 °C', 'Step 2: anneal primers, 54 °C', 'Step 3: extend, 72 °C', 'End of cycle 1: two copies'];
  loop(host, (dt) => { if (Math.abs(T - tgtT) > 0.2) { T = lerp(T, tgtT, Math.min(1, dt * 4)); cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 6, x0 = 28, x1 = w - 62, mid = top + 70, sp = 26;
    const strand = (y, c, a, b, wd = 4) => line(ctx, [[a, y], [b, y]], c, wd);
    const g = (y, pairs) => pairs.forEach(([a, b, c, wd]) => strand(y, c, a, b, wd));
    const apart = st >= 1 ? sp * 1.0 : 0, y1 = mid - apart * 0.5, y2 = mid + apart * 0.5 + 2;
    if (st < 4) {
      g(y1, [[x0, x1, col.ink, 4]]); g(y2, [[x0, x1, col.muted, 4]]);
      if (st === 0) for (let k = 0; k < 18; k++) { const x = x0 + 6 + k * ((x1 - x0 - 12) / 17); line(ctx, [[x, y1 + 4], [x, y2 - 4]], col.line, 2); }
      if (st === 0) text(ctx, 'target DNA (to be copied)', (x0 + x1) / 2, mid - 28, { color: col.muted, size: 11, align: 'center' });
      if (st >= 2) { arrow(ctx, x1 - 36, y1 - 0, x1 - 2, y1 - 0, col.s[2], 5, 1); strand(y1 - 8, col.s[2], x1 - 36, x1, 5); strand(y2 + 8, col.s[0], x0, x0 + 36, 5); text(ctx, "primer 2", x1 - 18, y1 - 20, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); text(ctx, "primer 1", x0 + 18, y2 + 22, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); }
      if (st === 3) { strand(y2 + 8, col.s[0], x0, x0 + (x1 - x0) * 0.95, 5); strand(y1 - 8, col.s[2], x1 - (x1 - x0) * 0.95, x1, 5); text(ctx, 'Taq adds bases to each primer', (x0 + x1) / 2, y2 + 38, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, "building the new strand 5′→3′", (x0 + x1) / 2, y2 + 54, { color: col.muted, size: 10.5, align: 'center' }); }
      if (st === 1) text(ctx, 'heat breaks the hydrogen bonds', (x0 + x1) / 2, y2 + 32, { color: col.bad, size: 11, weight: 700, align: 'center' });
      if (st === 2) text(ctx, 'cool: primers bind their complementary ends', (x0 + x1) / 2, y2 + 52, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    } else {
      const ya = mid - 20, yb = mid + 20;
      [ya, yb].forEach((y, i) => { strand(y - 4, col.ink, x0, x1 - 70, 4); strand(y + 4, col.muted, x0, x1 - 70, 4); strand(y - 4, i ? col.s[2] : col.s[0], x0, x1 - 70, 2); });
      text(ctx, '1 → 2 copies', (x0 + x1 - 70) / 2, mid + 52, { color: col.s[3], size: 13, weight: 800, align: 'center' });
      text(ctx, 'Each new double strand has one old and one new strand.', (x0 + x1) / 2, mid + 72, { color: col.muted, size: 10.5, align: 'center' });
    }
    // thermometer
    const tx = w - 30, ty0 = top + 20, ty1 = h - 48, f = (T - 20) / 80;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(tx - 6, ty0, 12, ty1 - ty0);
    ctx.fillStyle = T > 85 ? col.bad : T > 65 ? col.warn : col.s[0]; ctx.fillRect(tx - 5, ty1 - f * (ty1 - ty0), 10, f * (ty1 - ty0));
    text(ctx, Math.round(T) + '°C', tx, ty1 + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'Taq enzyme (from a hot-spring bacterium) survives 94 °C, so it is added once.', 10, h - 12, { color: col.muted, size: 10, fit: true });
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); tgtT = TT[st]; cv.redraw(); } };
}
