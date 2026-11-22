// C3 and C4 plants side by side. The leaf diagram follows the carbon: in C3 RuBisCO in the mesophyll fixes CO₂ directly;
// in C4 (Kranz anatomy) PEP carboxylase first makes oxaloacetate in the mesophyll, malate carries CO₂ to the bundle
// sheath, where it is released next to RuBisCO, which almost removes photorespiration. Slide the temperature: C4 wins when it is hot.
import { canvas, loop, row, slider, choice, readout, axes, line, text, title } from '../kit.js';

const c3 = (T) => 100 * Math.exp(-(((T - 24) / 9) ** 2)) - 0 * T;
const c4 = (T) => 150 * Math.exp(-(((T - 36) / 11) ** 2)) * 0.9 + 0 * T;

export default function (host) {
  let type = 'c4', T = 36, t = 0;
  const cv = canvas(host, { aspect: 1.25, max: 470, min: 380, label: 'Carbon paths in C3 and C4 leaves and the photosynthesis rate against temperature' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  choice(ctl, 'Plant', [['c3', 'C3 (wheat, rice)'], ['c4', 'C4 (maize, sugarcane)']], type, (v) => { type = v; show(); });
  slider(ctl, { label: 'Leaf temperature', min: 12, max: 45, step: 1, value: T, fmt: (v) => `${v} °C`, oninput: (v) => { T = v; show(); } });
  const out = readout(host);
  const show = () => { out.innerHTML = `At <b>${T} °C</b> (schematic): C3 rate <b>${c3(T).toFixed(0)}</b>, C4 rate <b>${c4(T).toFixed(0)}</b> (arbitrary units). ${type === 'c3' ? 'C3: RuBisCO also binds O₂ when it is hot, wasting carbon as photorespiration.' : 'C4: CO₂ is pumped into the bundle sheath, so RuBisCO rarely meets O₂: no visible photorespiration, higher optimum temperature, costs 2 extra ATP per CO₂.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, type === 'c3' ? 'C3 leaf: Calvin cycle in mesophyll' : 'C4 leaf: two cell types (Kranz anatomy)', col);
    const topH = h * 0.5, bx = w / 2, by = 100;
    const cell = (x, y, rw, rh, c, lab) => { ctx.beginPath(); ctx.ellipse(x, y, rw, rh, 0, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke(); text(ctx, lab, x, y - rh - 8, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); };
    const ph = (t * 0.5) % 1, mv = (a, b, f) => a + (b - a) * f;
    const dotp = (x, y, c, lab) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = c; ctx.fill(); if (lab) text(ctx, lab, x + 8, y, { color: col.ink, size: 10, weight: 700, fit: false }); };
    text(ctx, 'air (stomata)', 10, 36, { color: col.muted, size: 10 });
    if (type === 'c3') {
      cell(bx, by + 18, w * 0.38, 46, col.s[2], 'mesophyll cell (chloroplasts)');
      dotp(mv(w * 0.18, bx - 40, ph), mv(40, by + 10, ph), col.s[5], ph < 0.5 ? 'CO₂' : '');
      text(ctx, 'RuBisCO: CO₂ + RuBP → 2 PGA → sugar', bx, by + 22, { color: col.ink, size: 11, align: 'center', weight: 600 });
      if (T > 30) { dotp(mv(w * 0.82, bx + 30, ph), mv(40, by + 14, ph), col.bad, ''); text(ctx, `O₂ competes (photorespiration up with heat)`, bx, by + 54, { color: col.bad, size: 10.5, align: 'center', weight: 700 }); }
    } else {
      cell(bx - w * 0.22, by + 16, w * 0.2, 48, col.s[2], 'mesophyll');
      cell(bx + w * 0.2, by + 16, w * 0.22, 48, col.s[0], 'bundle sheath');
      text(ctx, 'PEPcase: CO₂ + PEP → OAA (4 C)', bx - w * 0.2, by + 76, { color: col.ink, size: 9.5, align: 'center', weight: 600 });
      text(ctx, 'CO₂ + RuBisCO: Calvin', bx + w * 0.2, by + 16, { color: col.ink, size: 9.5, align: 'center', weight: 600 });
      dotp(mv(w * 0.1, bx - w * 0.22, Math.min(1, ph * 2)), mv(40, by + 24, Math.min(1, ph * 2)), col.s[5], '');
      ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - w * 0.1, by + 40); ctx.lineTo(bx + w * 0.1, by + 40); ctx.stroke(); text(ctx, 'malate (4 C) →', bx, by + 52, { color: col.s[3], size: 10.5, align: 'center', weight: 700 });
      if (ph > 0.5) dotp(mv(bx - w * 0.1, bx + w * 0.1, (ph - 0.5) * 2), by + 40, col.s[3], '');
      text(ctx, 'carbon is concentrated where RuBisCO is', bx, by + 96, { color: col.s[0], size: 10.5, align: 'center', weight: 700 });
    }
    // rate plot
    const P = axes(ctx, w, h, col, { x: [10, 45], y: [0, 140], xt: [15, 25, 35, 45], yt: [0, 50, 100], l: 36, t: topH + 22, b: 34, xlabel: 'Temperature (°C)', ylabel: 'Rate' });
    const crv = (f, c) => line(ctx, Array.from({ length: 71 }, (_, i) => { const x = 10 + 35 * i / 70; return [P.X(x), P.Y(f(x))]; }), c, type === (c === col.s[2] ? 'c3' : 'c4') ? 3 : 1.5);
    crv(c3, col.s[2]); crv(c4, col.s[0]);
    ctx.strokeStyle = col.ink; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(P.X(T), P.T); ctx.lineTo(P.X(T), P.B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'C3', P.X(18), P.Y(c3(18)) - 8, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'C4', P.X(40), P.Y(c4(40)) - 8, { color: col.s[0], size: 11, weight: 700, align: 'center' });
  };
  show();
}
