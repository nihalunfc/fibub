// Class 11 Biology, Plant Kingdom: why algae of different colours live at different depths. Sea water absorbs red light within a few metres, green and blue light reach deeper.
// Green algae (chlorophyll a and b) use red and blue; brown algae (fucoxanthin) and red algae (phycoerythrin) can use blue and green light too, so red algae reach the deepest water.
// A teaching model: light falls off as e^(-k d) with a different k for each colour, and each group is scored on the light it can use (not measured data).
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

const K = [0.30, 0.07, 0.035]; // red, green, blue attenuation per metre (rounded teaching values)
const USE = { Green: [0.5, 0.05, 0.5], Brown: [0.2, 0.5, 0.5], Red: [0.05, 0.6, 0.35] };
export default function (host) {
  let d = 5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Light of three colours remaining at a depth in sea water and the photosynthesis possible for green, brown and red algae' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'depth', min: 0, max: 100, step: 1, value: d, fmt: (v) => v + ' m', oninput: (v) => { d = v; go(); } });
  const light = (dd) => K.map((k) => Math.exp(-k * dd));
  const score = (g, dd) => { const L = light(dd); return USE[g].reduce((s, u, i) => s + u * L[i], 0); };
  const go = () => { const s = Object.keys(USE).map((g) => [g, score(g, d)]).sort((a, b) => b[1] - a[1]); ro.textContent = `At ${d} m the best-lit group in this model is ${s[0][0].toLowerCase()} algae. ${d < 8 ? 'Near the surface green algae do well.' : d < 30 ? 'Brown algae (kelps) grow in the middle zone.' : 'Only red algae still find usable light.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Light and algae at depth', col) + 4, L = light(d), colors = [col.s[3], col.s[1], col.s[0]], names = ['red light', 'green light', 'blue light'];
    const colH = h - y0 - 20, cx0 = 18, cw = 34; rr(ctx, cx0, y0, cw, colH, 4, col.soft, col.line);
    const gy = y0 + (d / 100) * colH; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18 * (d / 100 + 0.2); ctx.fillRect(cx0, y0, cw, gy - y0); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx0 - 6, gy); ctx.lineTo(cx0 + cw + 6, gy); ctx.stroke(); text(ctx, `${d} m`, cx0 + cw / 2, gy - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    const x1 = 72;
    text(ctx, 'light left (%)', x1, y0 + 8, { color: col.muted, size: 10.5, weight: 700 });
    L.forEach((v, i) => { const y = y0 + 28 + i * 24; text(ctx, names[i], x1, y, { color: col.ink, size: 10.5 }); rr(ctx, x1 + 66, y - 7, 100, 14, 3, col.soft, null); rr(ctx, x1 + 66, y - 7, Math.max(1, 100 * v), 14, 3, colors[i], null); text(ctx, Math.round(v * 100) + '', x1 + 172, y, { color: col.ink, size: 10.5 }); });
    text(ctx, 'photosynthesis possible', x1, y0 + 118, { color: col.muted, size: 10.5, weight: 700 });
    [['Green', col.s[1]], ['Brown', col.s[4]], ['Red', col.s[3]]].forEach(([g, c], i) => { const y = y0 + 140 + i * 30, v = Math.min(1, score(g, d)); text(ctx, g + ' algae', x1, y, { color: col.ink, size: 11, weight: 600 }); rr(ctx, x1 + 76, y - 8, w - x1 - 90, 16, 4, col.soft, null); rr(ctx, x1 + 76, y - 8, Math.max(1, (w - x1 - 90) * v), 16, 4, c, null); });
    text(ctx, 'Green: chlorophyll a, b. Brown: fucoxanthin.', x1, h - 40, { color: col.muted, size: 10 }); text(ctx, 'Red: phycoerythrin (absorbs blue and green).', x1, h - 25, { color: col.muted, size: 10 });
  };
  go();
}
