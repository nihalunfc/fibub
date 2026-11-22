// Class 10 Metals and Non-metals (step player): getting zinc from its ore, and the thermite reaction.
// Zinc blende ZnS is concentrated (froth flotation), roasted in air to ZnO (2ZnS + 3O2 -> 2ZnO + 2SO2), or the carbonate
// is calcined (ZnCO3 -> ZnO + CO2), then ZnO is reduced with carbon (ZnO + C -> Zn + CO). Thermite: Fe2O3 + 2Al -> Al2O3 + 2Fe,
// a displacement so hot that the iron is molten and welds railway tracks.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 300, label: 'A furnace showing roasting, calcination, reduction with carbon and the thermite reaction' });
  const TITLES = ['Concentrate the ore (froth flotation)', 'Roasting a sulphide ore in air', 'Calcination of a carbonate ore', 'Reduction: oxide + carbon → metal', 'Thermite: aluminium reduces iron oxide'];
  const D = [
    { i: null, o: null, a: 'ZnS lumps with rock (gangue)', b: 'ZnS-rich froth', eq: 'Ore is ground and floated in water with oil: the sulphide sticks to bubbles and floats; sand sinks.', c0: '#9aa0a8', c1: '#c7cfd6', glow: 0 },
    { i: 'air (O₂)', o: 'SO₂ gas', a: 'ZnS', b: 'ZnO', eq: '2ZnS + 3O₂ → 2ZnO + 2SO₂. Heating strongly in excess air turns the sulphide into oxide.', c0: '#c7cfd6', c1: '#e8e4d0', glow: 0.7 },
    { i: 'limited air', o: 'CO₂ gas', a: 'ZnCO₃', b: 'ZnO', eq: 'ZnCO₃ → ZnO + CO₂. Heating a carbonate ore strongly in limited air.', c0: '#d8d3c4', c1: '#e8e4d0', glow: 0.7 },
    { i: 'coke (C)', o: 'CO gas', a: 'ZnO', b: 'Zn', eq: 'ZnO + C → Zn + CO. Carbon takes the oxygen from the oxide: the oxide is reduced and carbon is oxidised.', c0: '#e8e4d0', c1: '#9aa0a8', glow: 1 },
    { i: 'Al powder', o: 'molten Fe', a: 'Fe₂O₃', b: 'Fe', eq: 'Fe₂O₃ + 2Al → Al₂O₃ + 2Fe + heat. Aluminium is more reactive than iron, so it displaces it. The molten iron welds broken railway lines.', c0: '#a8442a', c1: '#d8d8dc', glow: 1 },
  ];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, d = D[step], cx = w / 2, fy = top + 36, fw = Math.min(190, w * 0.5), fh = h - fy - 120;
    ctx.fillStyle = col.soft; ctx.fillRect(cx - fw / 2, fy, fw, fh); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.strokeRect(cx - fw / 2, fy, fw, fh);
    const prog = (t * 0.25) % 1;
    // charge in furnace
    for (let i = 0; i < 9; i++) { const x = cx - fw / 2 + 14 + (i % 3) * ((fw - 28) / 2.2), y = fy + fh - 32 - Math.floor(i / 3) * 16; const f = Math.min(1, prog * 1.6); ctx.fillStyle = f > 0.5 && step > 0 ? d.c1 : d.c0; ctx.fillRect(x, y, 22, 12); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x, y, 22, 12); }
    if (d.glow) for (let i = 0; i < 6; i++) { const x = cx - fw / 2 + 12 + i * (fw - 24) / 5, fl = 8 + 6 * Math.sin(t * 9 + i * 2); ctx.fillStyle = '#f08a24'; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(x - 6, fy + fh + 18); ctx.lineTo(x, fy + fh + 18 - fl - 8); ctx.lineTo(x + 6, fy + fh + 18); ctx.fill(); ctx.globalAlpha = 1; }
    text(ctx, d.a, cx - fw / 2 - 6, fy + fh - 28, { color: col.ink, size: 12, weight: 700, align: 'right' }); text(ctx, '→ ' + d.b, cx + fw / 2 + 6, fy + fh - 28, { color: col.s[2], size: 12, weight: 700 });
    if (d.i) { line(ctx, [[cx - fw / 2 - 40, fy + 14], [cx - fw / 2, fy + 14]], col.s[0], 3); text(ctx, d.i, cx - fw / 2 - 42, fy + 14, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); for (let i = 0; i < 3; i++) dot(ctx, cx - fw / 2 - 40 + ((t * 40 + i * 14) % 40), fy + 14, 2.5, col.s[0]); }
    if (d.o) { line(ctx, [[cx + fw / 2, fy + 14], [cx + fw / 2 + 40, fy + 14]], col.s[7], 3); text(ctx, d.o, cx + fw / 2 + 44, fy + 14, { color: col.s[7], size: 10.5, weight: 700 }); for (let i = 0; i < 3; i++) dot(ctx, cx + fw / 2 + ((t * 40 + i * 14) % 40), fy + 14, 2.5, col.s[7]); }
    if (step === 4) { const f = Math.min(1, prog * 1.6); ctx.fillStyle = `rgba(255,${Math.round(220 - 100 * f)},60,${0.6 * f})`; ctx.beginPath(); ctx.arc(cx, fy + fh - 30, 30 + 14 * Math.sin(t * 10), 0, 7); ctx.fill(); }
    const L = []; let a = ''; d.eq.split(' ').forEach((wd) => { if ((a + ' ' + wd).length > Math.floor(w / 6.1)) { L.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; }); L.push(a);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (L.length - 1 - i) * 12, { color: col.muted, size: 10, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
