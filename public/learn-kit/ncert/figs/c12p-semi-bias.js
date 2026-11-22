// Class 12 Semiconductors: biasing a p-n junction. Forward bias (p to the + terminal) lowers the barrier from V0 to V0 - V, narrows the depletion layer and lets majority carriers cross:
// large current once V passes about 0.6 V in silicon. Reverse bias raises the barrier to V0 + V, widens the layer, and only a tiny minority-carrier current (microamps) flows.
// Depletion width taken as w = w0 sqrt((V0 -+ V)/V0), a textbook rule for an abrupt junction (w0 about 1 micrometre).
import { canvas, text, title, arrow, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let fwd = true, V = 0.4, t = 0;
  const V0 = 0.7;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 310, label: 'A p-n junction with a battery in forward or reverse direction showing the depletion layer and the potential barrier' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Battery', [[true, 'Forward'], [false, 'Reverse']], fwd, (v) => { fwd = v; sl.set(fwd ? 0.4 : 5); V = fwd ? 0.4 : 5; go(); });
  const sl = slider(ctl, { label: 'battery voltage (V)', min: 0, max: 10, step: 0.05, value: V, fmt: (v) => v.toFixed(2), oninput: (v) => { V = v; go(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const Vf = () => Math.min(V, 0.78), bar = () => (fwd ? V0 - Vf() : V0 + V), wid = () => Math.sqrt(Math.max(0.02, bar()) / V0);
  const cur = () => (fwd ? (V < 0.4 ? 'almost none' : V < 0.6 ? 'starting to flow (µA to mA)' : 'large, tens of mA: the diode conducts') : 'tiny, about a microamp (minority carriers)');
  const go = () => { ro.textContent = `${fwd ? 'Forward' : 'Reverse'} bias ${V.toFixed(2)} V: barrier = ${bar().toFixed(2)} V, depletion layer ${(wid()).toFixed(2)} × its unbiased width. Current: ${cur()}. ${fwd ? 'Past about 0.7 V (Si) the barrier almost vanishes.' : 'The current barely changes as V rises, until breakdown.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, (fwd ? 'Forward' : 'Reverse') + ' bias', col), mid = w / 2, y0 = top + 36, bh = 78, dw = 14 + wid() * 26, pL = 18, nR = w - 18;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.14; ctx.fillRect(pL, y0, mid - pL, bh); ctx.fillStyle = col.s[0]; ctx.fillRect(mid, y0, nR - mid, bh); ctx.globalAlpha = 1;
    ctx.fillStyle = col.panel; ctx.fillRect(mid - dw, y0, 2 * dw, bh); ctx.strokeStyle = col.s[2]; ctx.setLineDash([3, 3]); ctx.strokeRect(mid - dw, y0, 2 * dw, bh); ctx.setLineDash([]); ctx.strokeStyle = col.muted; ctx.strokeRect(pL, y0, nR - pL, bh);
    text(ctx, 'p', pL + 8, y0 + 12, { color: col.muted, size: 12, weight: 700 }); text(ctx, 'n', nR - 8, y0 + 12, { color: col.muted, size: 12, weight: 700, align: 'right' });
    const flow = fwd && V > 0.35 ? Math.min(1, (V - 0.35) / 0.4) : !fwd ? 0.06 : 0.04;
    const nd = Math.round(8 * flow) + 1;
    for (let i = 0; i < nd; i++) { const k = ((t * (0.5 + flow) + i / nd) % 1), y = y0 + 12 + ((i * 37) % 54), ex = fwd ? nR - 14 - k * (nR - pL - 28) : (flow < 0.1 ? nR - 14 - k * 60 : nR - 14), hx = fwd ? pL + 14 + k * (nR - pL - 28) : pL + 14 + k * 40; if (fwd || i < 1) { ctx.beginPath(); ctx.arc(ex, y, 4.5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.beginPath(); ctx.arc(hx, y + 10, 5, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); } }
    const by = y0 + bh + 26; line(ctx, [[pL + 10, y0 + bh], [pL + 10, by], [mid - 30, by]], col.ink, 2); line(ctx, [[nR - 10, y0 + bh], [nR - 10, by], [mid + 30, by]], col.ink, 2);
    const plusLeft = fwd; text(ctx, plusLeft ? '+' : '−', mid - 22, by - 12, { color: col.ink, size: 16, weight: 700, align: 'center' }); text(ctx, plusLeft ? '−' : '+', mid + 22, by - 12, { color: col.ink, size: 16, weight: 700, align: 'center' });
    line(ctx, [[mid - 12, by - 9], [mid - 12, by + 9]], col.ink, 3); line(ctx, [[mid + 12, by - 5], [mid + 12, by + 5]], col.ink, 3); text(ctx, `${V.toFixed(2)} V`, mid, by + 28, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const gy = by + 40, gh = h - gy - 16, yTop = gy + 6, B = gy + gh, kk = (gh - 40) / Math.max(0.9, bar() * 1.05), lv = (b) => B - 12 - b * kk;
    line(ctx, [[pL, B], [nR, B]], col.line, 1);
    const b = bar();
    line(ctx, [[pL + 10, lv(0)], [mid - dw, lv(0)], [mid + dw, lv(b)], [nR - 10, lv(b)]], col.s[2], 3);
    text(ctx, `barrier ${b.toFixed(2)} V`, mid, lv(b) - 10, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
    ctx.setLineDash([3, 3]); line(ctx, [[mid + 6, lv(0.7)], [nR - 10, lv(0.7)]], col.muted, 1); ctx.setLineDash([]);
    text(ctx, 'V₀ = 0.7 V (no battery)', nR - 10, lv(0.7) - 8, { color: col.muted, size: 10, align: 'right' });
  };
  go();
}
