// Class 11 Mechanical Properties of Fluids: the barometer and the U-tube manometer. Atmospheric pressure supports a liquid column of height h = P / (rho g): about 0.76 m of mercury
// (rho 13600) or 10.3 m of water (rho 1000) at 101 kPa. Drag the "weather" slider to change the air pressure. In the manometer the gas pressure is P0 + rho g (height difference).
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let P = 101.3, liq = 'Hg';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A barometer column whose height shows the air pressure, for mercury or water' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Liquid', [['Hg', 'mercury'], ['H2O', 'water']], liq, (v) => { liq = v; go(); });
  slider(ctl, { label: 'air pressure (kPa)', min: 90, max: 105, step: 0.5, value: P, fmt: (v) => v.toFixed(1) + ' kPa', oninput: (v) => { P = v; go(); } });
  const rho = () => (liq === 'Hg' ? 13600 : 1000);
  const go = () => { const hh = (P * 1000) / (rho() * 9.8); ro.textContent = `h = P/ρg = ${(P * 1000).toFixed(0)} / (${rho()} × 9.8) = ${hh.toFixed(2)} m of ${liq === 'Hg' ? 'mercury' : 'water'}${liq === 'Hg' ? ' (' + (hh * 1000).toFixed(0) + ' mm; a normal day is about 760 mm)' : ': far too tall to be practical, which is why barometers use mercury'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Barometer: the air holds up the liquid column', col) + 10, hh = (P * 1000) / (rho() * 9.8), scale = (h - top - 70) / (liq === 'Hg' ? 1.0 : 11), cx = w * 0.4, bot = h - 40, tubeW = 22;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fillRect(cx - 70, bot - 22, 140, 22); ctx.globalAlpha = 1; line(ctx, [[cx - 70, bot - 22], [cx + 70, bot - 22]], col.s[0], 2);
    line(ctx, [[cx - 70, bot], [cx + 70, bot]], col.ink, 2); line(ctx, [[cx - 70, bot], [cx - 70, bot - 22]], col.ink, 2); line(ctx, [[cx + 70, bot], [cx + 70, bot - 22]], col.ink, 2);
    const ty = Math.max(top, bot - 22 - hh * scale - 12), ly = bot - 22 - hh * scale;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(cx - tubeW / 2 + 3, Math.max(ly, top + 6), tubeW - 6, bot - 22 - Math.max(ly, top + 6) + 8); ctx.globalAlpha = 1;
    line(ctx, [[cx - tubeW / 2, top], [cx - tubeW / 2, bot - 14]], col.ink, 2); line(ctx, [[cx + tubeW / 2, top], [cx + tubeW / 2, bot - 14]], col.ink, 2); line(ctx, [[cx - tubeW / 2, top], [cx + tubeW / 2, top]], col.ink, 2);
    text(ctx, 'vacuum', cx + tubeW / 2 + 6, (top + Math.max(ly, top + 6)) / 2, { color: col.muted, size: 10.5 });
    arrow(ctx, cx + 100, bot - 22 - 40, cx + 100, bot - 22 - 6, col.s[1], 2.5, 7); arrow(ctx, cx + 118, bot - 22 - 40, cx + 118, bot - 22 - 6, col.s[1], 2.5, 7); text(ctx, 'air pressure P', cx + 109, bot - 22 - 50, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    arrow(ctx, cx - tubeW / 2 - 14, bot - 22, cx - tubeW / 2 - 14, Math.max(ly, top + 6), col.s[3], 2, 6); text(ctx, 'h = ' + hh.toFixed(2) + ' m', cx - tubeW / 2 - 20, (bot - 22 + Math.max(ly, top + 6)) / 2, { color: col.s[3], size: 12, weight: 700, align: 'right' });
    if (liq === 'H2O' && ly < top) text(ctx, '(column drawn cut off at the top: 10.3 m)', cx, top + 24, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
