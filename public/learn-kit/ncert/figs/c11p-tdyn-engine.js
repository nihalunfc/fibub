// Class 11 Thermodynamics: heat engines and refrigerators. Engine: takes Qh from a hot reservoir, turns W into work and rejects Qc = Qh - W to a cold one; efficiency = W/Qh <= 1 - Tc/Th (Carnot limit).
// Refrigerator: work W pulls Qc out of the cold space and dumps Qh = Qc + W outside; coefficient of performance COP = Qc/W, at best Tc/(Th - Tc). The arrow widths are drawn in proportion to the energy. Slider "how good" scales the real device against the ideal.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let mode = 'eng', Th = 600, Tc = 300, q = 80;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 310, label: 'Energy flow diagram of a heat engine or a refrigerator between a hot and a cold reservoir' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Device', [['eng', 'heat engine'], ['fr', 'refrigerator']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'hot reservoir Tₕ (K)', min: 350, max: 900, step: 10, value: Th, fmt: (v) => v + ' K', oninput: (v) => { Th = v; go(); } });
  slider(ctl, { label: 'cold reservoir T꜀ (K)', min: 200, max: 340, step: 10, value: Tc, fmt: (v) => v + ' K', oninput: (v) => { Tc = v; go(); } });
  slider(ctl, { label: 'how good (% of ideal)', min: 20, max: 100, step: 5, value: q, fmt: (v) => v + ' %', oninput: (v) => { q = v; go(); } });
  const calc = () => { const f = q / 100; if (mode === 'eng') { const eta = (1 - Tc / Th) * f, Qh = 1000, W = eta * Qh; return { Qh, W, Qc: Qh - W, eta }; } const cop = (Tc / (Th - Tc)) * f, Qc = 1000, W = Qc / cop; return { Qh: Qc + W, W, Qc, cop }; };
  const go = () => { const c = calc(); ro.textContent = mode === 'eng' ? `η = W/Qₕ = ${(c.eta * 100).toFixed(0)} % (Carnot limit 1 − T꜀/Tₕ = ${((1 - Tc / Th) * 100).toFixed(0)} %). Of each 1000 J taken in, ${c.W.toFixed(0)} J is work and ${c.Qc.toFixed(0)} J must be thrown away.` : `COP = Q꜀/W = ${c.cop.toFixed(1)}: to remove 1000 J from the cold space you must supply ${c.W.toFixed(0)} J of work, and ${c.Qh.toFixed(0)} J is dumped into the hot side.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'eng' ? 'Heat engine: not all heat can become work' : 'Refrigerator: work moves heat uphill', col) + 6, c = calc(), cx = w / 2, bh = 38;
    const hot = top, cold = h - bh - 12, mid = (hot + bh + cold) / 2, sc = 40 / 1000, wd = (v) => Math.max(3, v * sc);
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.fillRect(14, hot, w - 28, bh); ctx.fillStyle = col.s[0]; ctx.fillRect(14, cold, w - 28, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(14, hot, w - 28, bh); ctx.strokeRect(14, cold, w - 28, bh);
    text(ctx, 'hot reservoir  Tₕ = ' + Th + ' K', cx, hot + bh / 2, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'cold reservoir  T꜀ = ' + Tc + ' K', cx, cold + bh / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(cx, mid, 34, 0, 7); ctx.fill(); ctx.stroke(); text(ctx, mode === 'eng' ? 'engine' : 'fridge', cx, mid, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const bar = (x, y0, y1, v, c2, lab, up) => { const wd2 = wd(v); ctx.fillStyle = c2; ctx.globalAlpha = 0.85; ctx.fillRect(x - wd2 / 2, Math.min(y0, y1), wd2, Math.abs(y1 - y0)); ctx.globalAlpha = 1; arrow(ctx, x, up ? y0 : y1, x, up ? y1 : y0, c2, 1.5, 9); text(ctx, lab, x + wd2 / 2 + 6, (y0 + y1) / 2, { color: col.ink, size: 11.5, weight: 700 }); };
    if (mode === 'eng') { bar(cx - 40, hot + bh, mid - 34, c.Qh, col.s[1], 'Qₕ = ' + c.Qh.toFixed(0) + ' J', false); bar(cx + 80, mid, mid, 0, col.s[2], '', false); bar(cx - 40, mid + 34, cold, c.Qc, col.s[0], 'Q꜀ = ' + c.Qc.toFixed(0) + ' J', false); ctx.fillStyle = col.s[2]; ctx.fillRect(cx + 34, mid - wd(c.W) / 2, 90, wd(c.W)); arrow(ctx, cx + 100, mid, cx + 130, mid, col.s[2], 1.5, 9); text(ctx, 'W = ' + c.W.toFixed(0) + ' J', cx + 80, mid + wd(c.W) / 2 + 14, { color: col.ink, size: 11.5, weight: 700 }); }
    else { bar(cx - 40, mid + 34, cold, c.Qc, col.s[0], 'Q꜀ = ' + c.Qc.toFixed(0) + ' J', true); bar(cx - 40, mid - 34, hot + bh, c.Qh, col.s[1], 'Qₕ = ' + c.Qh.toFixed(0) + ' J', true); ctx.fillStyle = col.s[2]; ctx.fillRect(cx + 34, mid - wd(c.W) / 2, 90, wd(c.W)); arrow(ctx, cx + 130, mid, cx + 100, mid, col.s[2], 1.5, 9); text(ctx, 'W = ' + c.W.toFixed(0) + ' J in', cx + 80, mid + wd(c.W) / 2 + 14, { color: col.ink, size: 11.5, weight: 700 }); }
  };
  go();
}
