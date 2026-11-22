// Class 12 Microbes in Human Welfare (step player): brewing wine. Yeast (Saccharomyces cerevisiae, "brewer's yeast") ferments the sugar of grape juice without oxygen:
// glucose -> 2 ethanol + 2 CO2. Sugar falls and alcohol rises until the yeast stops (about 12 to 14 % alcohol) or the sugar is used up; the wine is cleared of yeast and matured.
import { canvas, text, title, line, rng } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Steps of fermenting grape juice into wine with yeast, showing sugar falling and alcohol rising' });
  const T = ['Crush the fruit', 'Add yeast', 'Ferment without oxygen', 'Fermentation ends', 'Clear and mature'];
  const NOTE = ['Grapes are crushed to a juice (must) rich in sugar, about 20 %. Barley is used for beer after malting; fruit juice for wine.', 'A culture of the yeast Saccharomyces cerevisiae is added. The vat is closed from air.', 'Without oxygen the yeast breaks glucose to ethanol and CO₂ (anaerobic respiration). CO₂ bubbles out; sugar falls and alcohol rises.', 'When the sugar is nearly used up or the alcohol reaches about 12 to 14 %, the yeast stops working and settles.', 'The liquid is separated from the yeast, filtered, and aged. Wine and beer are made by fermentation only; whisky, brandy and rum are also distilled.'];
  const SUG = [20, 20, 6, 0.5, 0.5], ALC = [0, 0, 8, 13, 13];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const r = rng(4);
    const t0 = title(ctx, T[step], col), vx = w * 0.12, vw = w * 0.44, vy = t0 + 30, vh = 130;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.strokeRect(vx, vy, vw, vh);
    ctx.fillStyle = step >= 3 ? col.s[2] : col.s[3]; ctx.globalAlpha = 0.45; ctx.fillRect(vx + 2, vy + 18, vw - 4, vh - 20); ctx.globalAlpha = 1;
    if (step === 0) for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc(vx + 20 + (k % 4) * 26 + (k > 3 ? 12 : 0), vy + 40 + Math.floor(k / 4) * 30, 9, 0, 7); ctx.fillStyle = col.s[4] || col.s[1]; ctx.fill(); }
    if (step >= 1) for (let k = 0; k < 14; k++) { ctx.fillStyle = col.ink; ctx.fillRect(vx + 8 + r() * (vw - 22), vy + 30 + r() * (vh - 50) , 3, 3); }
    if (step === 2) for (let k = 0; k < 12; k++) { ctx.beginPath(); ctx.arc(vx + 10 + r() * (vw - 20), vy + 24 + r() * (vh - 40), 3 + r() * 2, 0, 7); ctx.strokeStyle = col.bg; ctx.lineWidth = 1.5; ctx.stroke(); }
    if (step === 2) text(ctx, 'CO₂ bubbles', vx + vw / 2, vy - 10, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, step >= 1 ? 'yeast (dots) in juice' : 'juice', vx + vw / 2, vy + vh + 14, { color: col.muted, size: 10.5, align: 'center' });
    const bx = w * 0.64, bw = w * 0.3, bh = 110, by = vy + 8;
    [['sugar', SUG[step], 20, col.s[3]], ['alcohol', ALC[step], 20, col.s[0]]].forEach(([n, v, mx, c], i) => { const x = bx + i * (bw / 2 + 6); ctx.fillStyle = col.line; ctx.fillRect(x, by, bw / 2 - 6, bh); ctx.fillStyle = c; const hh = bh * v / mx; ctx.fillRect(x, by + bh - hh, bw / 2 - 6, hh); text(ctx, v + ' %', x + (bw / 2 - 6) / 2, by - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, n, x + (bw / 2 - 6) / 2, by + bh + 14, { color: col.muted, size: 10.5, align: 'center' }); });
    text(ctx, 'C₆H₁₂O₆  →  2 C₂H₅OH + 2 CO₂', w / 2, vy + vh + 40, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    wrap(ctx, NOTE[step], 12, h - 62, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
