// Class 11 Chemistry, Thermodynamics: the first law, change in internal energy = heat added to the system + work done on the system, dU = q + w.
// Slide q (heat in is +, out is -) and w (work done ON the gas is +, work done BY the gas is -). The energy bar shows U before and after. Starting U is taken as 300 J.
import { canvas, text, title, row, slider, button, readout, arrow } from '../../kit.js';

export default function (host) {
  let q = 60, wk = 40;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A gas in a piston with heat and work changing its internal energy' });
  const ctl = row(host), ro = readout(host);
  const sq = slider(ctl, { label: 'heat q (J): in is +, out is −', min: -100, max: 100, step: 5, value: q, fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(0), oninput: (v) => { q = v; go(); } });
  const sw = slider(ctl, { label: 'work w (J): on gas is +, by gas is −', min: -100, max: 100, step: 5, value: wk, fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(0), oninput: (v) => { wk = v; go(); } });
  const preset = (l, a, b) => button(ctl, l, () => { q = a; wk = b; sq.set(a); sw.set(b); go(); });
  preset('Adiabatic squeeze', 0, 80); preset('Heated, gas pushes out', 80, -50); preset('Free, cools by expanding', 0, -60);
  const go = () => { const d = q + wk; ro.textContent = `ΔU = q + w = ${q} + (${wk}) = ${d} J. ${d > 0 ? 'Internal energy rises, so the gas warms up.' : d < 0 ? 'Internal energy falls, so the gas cools down.' : 'No net change in internal energy: the temperature stays the same.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'First law: ΔU = q + w', col), cx = w * 0.3, cw = Math.min(110, w * 0.3), top = t0 + 40, hh = 120;
    const pist = top + 40 - wk * 0.25;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - cw / 2, top); ctx.lineTo(cx - cw / 2, top + hh); ctx.lineTo(cx + cw / 2, top + hh); ctx.lineTo(cx + cw / 2, top); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(cx - cw / 2 + 2, pist, cw - 4, top + hh - pist); ctx.globalAlpha = 1;
    ctx.fillStyle = col.ink; ctx.fillRect(cx - cw / 2 + 2, pist - 6, cw - 4, 7); ctx.fillRect(cx - 3, pist - 40, 6, 36);
    text(ctx, 'gas', cx, top + hh - 18, { color: col.ink, size: 12, weight: 700, align: 'center' });
    if (wk > 0) arrow(ctx, cx, pist - 60, cx, pist - 44, col.s[2], 3, 9); else if (wk < 0) arrow(ctx, cx, pist - 44, cx, pist - 60, col.s[3], 3, 9);
    text(ctx, wk === 0 ? 'w = 0' : wk > 0 ? 'w = +' + wk + ' J on gas' : 'w = ' + wk + ' J by gas', cx, pist - 70, { color: wk >= 0 ? col.s[2] : col.s[3], size: 11, weight: 700, align: 'center' });
    if (q !== 0) { const len = Math.abs(q) * 0.35; q > 0 ? arrow(ctx, cx, top + hh + 44, cx, top + hh + 8, col.bad, 3, 9) : arrow(ctx, cx, top + hh + 8, cx, top + hh + 44, col.s[1], 3, 9); text(ctx, (q > 0 ? 'q = +' : 'q = ') + q + ' J', cx, top + hh + 58, { color: q > 0 ? col.bad : col.s[1], size: 11, weight: 700, align: 'center' }); } else text(ctx, 'q = 0 (insulated)', cx, top + hh + 30, { color: col.muted, size: 11, align: 'center' });
    // energy bars
    const bx = w * 0.62, bw = 38, base = top + hh + 20, sc = 0.32, U0 = 300, U1 = U0 + q + wk;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx - 10, base); ctx.lineTo(bx + 2 * bw + 24, base); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, base - U0 * sc * 0.5, bw, U0 * sc * 0.5); ctx.fillStyle = U1 >= U0 ? col.s[2] : col.s[3]; ctx.fillRect(bx + bw + 12, base - Math.max(0, U1) * sc * 0.5, bw, Math.max(0, U1) * sc * 0.5);
    text(ctx, 'U before', bx + bw / 2, base + 14, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'U after', bx + bw * 1.5 + 12, base + 14, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, U0 + ' J', bx + bw / 2, base - U0 * sc * 0.5 - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, U1 + ' J', bx + bw * 1.5 + 12, base - Math.max(0, U1) * sc * 0.5 - 9, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'ΔU = ' + (U1 - U0 > 0 ? '+' : '') + (U1 - U0) + ' J', bx + bw + 6, t0 + 24, { color: col.s[3], size: 13, weight: 700, align: 'center' });
  };
  go();
}
