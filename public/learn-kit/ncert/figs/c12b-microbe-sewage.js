// Class 12 Microbes in Human Welfare (step player): sewage treatment. Primary treatment removes floating and settling solids; secondary (biological) treatment lets aerobic microbes in the aeration tank
// form flocs and digest organic matter, so the biochemical oxygen demand (BOD) falls sharply; the settled activated sludge is partly reused and the rest digested by anaerobic bacteria, giving biogas.
// BOD values are typical figures for municipal sewage (raw about 300 mg/L, after primary about 200, final effluent about 25).
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'Steps of a sewage treatment plant: primary treatment, aeration tank, settling and sludge digester, with BOD falling' });
  const T = ['Raw sewage arrives', 'Primary treatment: physical', 'Secondary treatment: aeration tank', 'Settling: activated sludge', 'Anaerobic sludge digester'];
  const NOTE = ['Sewage is household and industrial waste water with a high load of organic matter and microbes. It must be cleaned before it goes back into rivers.', 'Screens remove floating debris; grit settles; in the primary settling tank solids settle as primary sludge. The clear liquid is the primary effluent.', 'Air is pumped in. Aerobic bacteria grow into flocs (masses of bacteria with fungal filaments) and digest the organic matter. The BOD falls greatly.', 'The effluent goes to a settling tank, where the flocs settle as activated sludge. A small part is used again to seed the aeration tank; the rest goes to the digester. The clear water is released into rivers.', 'Anaerobic bacteria digest the bulk of the sludge, releasing biogas (methane, CO₂, H₂) that can be used as fuel.'];
  const BOD = [300, 200, 25, 25, 25], names = ['raw sewage', 'after primary', 'after aeration', 'final effluent'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), tw = (w - 40) / 4 - 6, ty = t0 + 22, th = 62;
    const tanks = [['screens + grit', 'primary tank', 1], ['aeration tank', '(air + flocs)', 2], ['settling tank', '', 3], ['digester', '(no air)', 4]];
    tanks.forEach(([a, b, s], i) => {
      const x = 14 + i * (tw + 8), on = step === s || (step === 0 && false), lit = step === s;
      ctx.fillStyle = lit ? col.s[0] : col.soft; ctx.globalAlpha = lit ? 0.35 : 1; ctx.fillRect(x, ty, tw, th); ctx.globalAlpha = 1; ctx.strokeStyle = lit ? col.s[0] : col.muted; ctx.lineWidth = lit ? 3 : 1.5; ctx.strokeRect(x, ty, tw, th);
      text(ctx, a, x + tw / 2, ty + th + 12, { color: col.ink, size: 9.5, weight: lit ? 700 : 400, align: 'center' }); if (b) text(ctx, b, x + tw / 2, ty + th + 24, { color: col.muted, size: 9, align: 'center' });
      if (i < 3) arrow(ctx, x + tw + 1, ty + th / 2, x + tw + 7, ty + th / 2, col.muted, 1.5, 5);
      if (s === 2) for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + 10 + k * (tw - 20) / 4, ty + th - 10 - (k % 2) * 14, 3, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1; ctx.stroke(); }
      if (s === 3) { ctx.fillStyle = col.s[4] || col.muted; ctx.fillRect(x + 2, ty + th - 10, tw - 4, 8); }
      if (s === 4 && step === 4) text(ctx, 'CH₄', x + tw / 2, ty - 8, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    });
    text(ctx, 'sewage in', 14, ty - 8, { color: col.muted, size: 10 }); if (step >= 3) text(ctx, 'clean water out', w - 14, ty - 8, { color: col.good, size: 10, weight: 700, align: 'right' });
    const gy = ty + th + 56, bw = w - 40, k = Math.min(step, 3);
    text(ctx, 'BOD (biochemical oxygen demand), mg of O₂ per litre', 14, gy, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.line; ctx.fillRect(14, gy + 10, bw, 18); ctx.fillStyle = BOD[k] > 100 ? col.s[3] : col.s[2]; ctx.fillRect(14, gy + 10, bw * BOD[step] / 300, 18);
    text(ctx, `${names[k]}: about ${BOD[step]} mg/L`, 14, gy + 42, { color: col.ink, size: 11.5, weight: 700 });
    wrap(ctx, NOTE[step], 12, h - 70, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
