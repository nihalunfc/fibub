// Class 9 Mixtures: crystallisation by cooling. 100 g of potassium nitrate is dissolved in 100 g of hot water (60 C
// holds up to 110 g, so it is unsaturated). As the solution cools, the most it can hold falls (31.6 g at 20 C), so
// the extra comes out as pure crystals. Crystals formed = 100 - solubility at that temperature (never below zero).
// Solubility of KNO3 in g per 100 g water: 13.3 (0 C), 31.6 (20), 63.9 (40), 110 (60), 169 (80), 246 (100) (CRC Handbook).
import { canvas, text, title, dot, line, row, slider, readout, loop, rng } from '../../kit.js';

const TT = [0, 20, 40, 60, 80, 100], SS = [13.3, 31.6, 63.9, 110, 169, 246];
const solub = (T) => { for (let i = 1; i < TT.length; i++) if (T <= TT[i]) return SS[i - 1] + ((SS[i] - SS[i - 1]) * (T - TT[i - 1])) / (TT[i] - TT[i - 1]); return SS[5]; };
export default function (host) {
  let T = 80, t = 0, R = rng(15);
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A solution of potassium nitrate cooling so crystals form at the bottom with a graph of solubility against temperature' });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature (°C)', min: 0, max: 100, step: 1, value: T, fmt: (v) => v + ' °C', oninput: (v) => { T = v; upd(); } });
  const out = readout(host);
  const cr = () => Math.max(0, 100 - solub(T));
  function upd() { const s = solub(T), c = cr(); out.innerHTML = `At ${T} °C, 100 g of water can hold <b>${s.toFixed(1)} g</b> of KNO₃. We dissolved 100 g, so ` + (c > 0.05 ? `<b>${c.toFixed(1)} g</b> has come out as crystals (${(c).toFixed(0)}% of what we had).` : 'everything is still dissolved: the solution is unsaturated.') + ' Slow cooling gives larger, purer crystals than fast cooling.'; cv.redraw(); }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Crystallisation by cooling', col);
    const bx = 14, bw = w * 0.42, by = 52, bh = h * 0.5, c = cr(), d = 100 - c;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by + 14, bw, bh - 14); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    for (let i = 0; i < Math.round(d * 0.5); i++) { const a = ((i * 97) % 100) / 100, b = ((i * 53) % 100) / 100; dot(ctx, bx + 8 + ((a + Math.sin(t + i) * 0.02 + 1) % 1) * (bw - 16), by + 22 + ((b + Math.cos(t + i) * 0.02 + 1) % 1) * (bh - 50), 2.2, col.s[0]); }
    const nC = Math.round(c * 0.35); for (let i = 0; i < nC; i++) { const x = bx + 8 + ((i * 17) % (bw - 22)), y = by + bh - 8 - Math.floor((i * 17) / (bw - 22)) * 9; ctx.save(); ctx.translate(x, y); ctx.rotate(i); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-5, 3); ctx.lineTo(0, -6); ctx.lineTo(5, 3); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    text(ctx, T + ' °C', bx + bw / 2, by + 8, { color: T > 50 ? col.bad : col.s[0], size: 11, weight: 700, align: 'center' });
    text(ctx, 'crystals: ' + c.toFixed(1) + ' g', bx + bw / 2, by + bh + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // graph
    const gx = bx + bw + 40, gw = w - gx - 14, gy = by + 4, gh = bh - 10;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh); text(ctx, 'solubility (g / 100 g water)', gx - 28, gy - 6, { color: col.muted, size: 9.5 });
    const X = (tv) => gx + (tv / 100) * gw, Y = (s) => gy + gh - (s / 250) * gh;
    line(ctx, TT.map((tv, i) => [X(tv), Y(SS[i])]), col.s[1], 2.5);
    line(ctx, [[gx, Y(100)], [gx + gw, Y(100)]], col.s[2], 1.5, [4, 3]); text(ctx, '100 g dissolved', gx + gw - 2, Y(100) - 7, { color: col.s[2], size: 9.5, align: 'right' });
    dot(ctx, X(T), Y(solub(T)), 5, col.bad); line(ctx, [[X(T), Y(solub(T))], [X(T), gy + gh]], col.bad, 1, [2, 2]);
    text(ctx, '0', gx, gy + gh + 10, { color: col.muted, size: 9.5 }); text(ctx, '100 °C', gx + gw, gy + gh + 10, { color: col.muted, size: 9.5, align: 'right' });
    const msg = 'Where the red dot is below the dashed line, the extra KNO₃ cannot stay dissolved and forms crystals.';
    const L = []; let cur = ''; ctx.font = '11px system-ui'; msg.split(' ').forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 28 + i * 14 - (L.length - 1) * 7, { color: col.ink, size: 11, align: 'center' }));
  };
  upd();
}
