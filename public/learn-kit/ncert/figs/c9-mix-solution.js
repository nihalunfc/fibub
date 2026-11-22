// Class 9 Mixtures: a solution and its concentration. Add solute (potassium nitrate) to water: it dissolves until the
// solution is saturated, then the extra settles at the bottom. Readout: mass percent = solute mass / solution mass x
// 100, and mass by volume = solute mass / solution volume (g per 100 mL). Warming raises the amount that dissolves.
// Solubility of KNO3 in g per 100 g water: 13.3 (0 C), 31.6 (20), 63.9 (40), 110 (60), 169 (80), 246 (100)
// (CRC Handbook of Chemistry and Physics); values between are joined by straight lines.
import { canvas, text, title, dot, line, row, slider, readout, loop, rng } from '../../kit.js';

const TT = [0, 20, 40, 60, 80, 100], SS = [13.3, 31.6, 63.9, 110, 169, 246];
export const solub = (T) => { for (let i = 1; i < TT.length; i++) if (T <= TT[i]) return SS[i - 1] + ((SS[i] - SS[i - 1]) * (T - TT[i - 1])) / (TT[i] - TT[i - 1]); return SS[5]; };
export default function (host) {
  let m = 20, T = 20, t = 0, R = rng(8);
  const water = 100; // grams of water (about 100 mL)
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A beaker of water in which potassium nitrate dissolves until saturated with the extra settling at the bottom' });
  const ctl = row(host);
  slider(ctl, { label: 'Solute added (g)', min: 0, max: 150, step: 1, value: m, fmt: (v) => v + ' g', oninput: (v) => { m = v; upd(); } });
  slider(ctl, { label: 'Temperature (°C)', min: 0, max: 100, step: 5, value: T, fmt: (v) => v + ' °C', oninput: (v) => { T = v; upd(); } });
  const out = readout(host);
  function upd() {
    const s = solub(T), d = Math.min(m, s), sol = water + d, pct = (d / sol) * 100;
    out.innerHTML = `Dissolved: <b>${d.toFixed(1)} g</b> in 100 g of water (the most it can hold at ${T} °C is ${s.toFixed(1)} g). Mass percent = ${d.toFixed(1)} ÷ ${sol.toFixed(1)} × 100 = <b>${pct.toFixed(1)}%</b>. Mass by volume ≈ <b>${d.toFixed(1)} g per 100 mL</b>. ` + (m > s ? `The extra <b>${(m - s).toFixed(1)} g</b> cannot dissolve: the solution is <b>saturated</b>. Heat it and more dissolves.` : m > 0.95 * s ? 'Nearly saturated.' : 'Unsaturated: it can still take more.');
    cv.redraw();
  }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Dissolving in water', col);
    const bx = w * 0.12, bw = w * 0.5, by = 52, bh = h - 90, s = solub(T), d = Math.min(m, s), extra = Math.max(0, m - s);
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by + 18, bw, bh - 18); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const n = Math.round(d * 0.8);
    for (let i = 0; i < n; i++) { const r = ((i * 97) % 100) / 100, q = ((i * 53) % 100) / 100; dot(ctx, bx + 8 + ((r + Math.sin(t * 1.5 + i) * 0.03 + 1) % 1) * (bw - 16), by + 28 + ((q + Math.cos(t * 1.2 + i) * 0.03 + 1) % 1) * (bh - 62), 2.6, col.s[0]); }
    const ex = Math.round(extra * 0.5); for (let i = 0; i < ex; i++) dot(ctx, bx + 6 + ((i * 13) % (bw - 12)), by + bh - 6 - Math.floor((i * 13) / (bw - 12)) * 5, 3.2, col.s[2], col.ink);
    text(ctx, 'solvent: water', bx + bw + 10, by + 40, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'solute: KNO₃', bx + bw + 10, by + 60, { color: col.s[0], size: 11, weight: 700 });
    if (extra > 0) text(ctx, 'undissolved', bx + bw + 10, by + bh - 6, { color: col.s[2], size: 10.5, weight: 700 });
    // gauge of saturation
    const gx = bx + bw + 14, gy = by + 96, gw = w - gx - 12; text(ctx, 'holds at most ' + s.toFixed(0) + ' g', gx, gy - 8, { color: col.muted, size: 10 });
    ctx.fillStyle = col.line; ctx.fillRect(gx, gy, gw, 12); ctx.fillStyle = extra > 0 ? col.bad : col.good; ctx.fillRect(gx, gy, gw * Math.min(1, d / s), 12);
    text(ctx, ((d / s) * 100).toFixed(0) + '% full', gx, gy + 26, { color: col.ink, size: 10.5, weight: 700 });
  };
  upd();
}
