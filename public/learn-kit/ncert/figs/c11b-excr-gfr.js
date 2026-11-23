// Class 11 Biology, Excretory products: glomerular filtration rate. Filtration is pushed by the blood pressure in the glomerulus (about 55 mm Hg) and opposed by the osmotic pull of
// blood proteins (about 30) and the back-pressure of the fluid in the capsule (about 15). Net filtration pressure = 55 - 30 - 15 = 10 mm Hg; GFR = Kf x NFP with Kf about 12.5 mL/min per mm Hg gives 125 mL/min.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let g = 55, b = 30, c = 15;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A balance of the glomerular pressure pushing fluid out against two opposing pressures, with the net filtration pressure and GFR' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Glomerular blood pressure', min: 35, max: 80, step: 1, value: g, fmt: (v) => v + ' mm Hg', oninput: (v) => { g = v; go(); } });
  slider(ctl, { label: 'Blood protein pull', min: 15, max: 40, step: 1, value: b, fmt: (v) => v + ' mm Hg', oninput: (v) => { b = v; go(); } });
  slider(ctl, { label: 'Capsule back-pressure', min: 5, max: 30, step: 1, value: c, fmt: (v) => v + ' mm Hg', oninput: (v) => { c = v; go(); } });
  const go = () => {
    const nfp = g - b - c, gfr = Math.max(0, nfp) * 12.5;
    ro.textContent = nfp <= 0 ? `Net filtration pressure ${nfp} mm Hg: nothing is filtered. This happens in shock (low blood pressure) or when a kidney stone blocks the ureter and raises the back-pressure.` : `NFP = ${g} - ${b} - ${c} = ${nfp} mm Hg. GFR = 12.5 x ${nfp} = ${gfr.toFixed(0)} mL/min = about ${(gfr * 1.44).toFixed(0)} L/day (normal: 125 mL/min, 180 L/day).`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Net filtration pressure', col), k = (w - 120) / 100, x0 = 70, nfp = g - b - c, gfr = Math.max(0, nfp) * 12.5;
    const bar = (y, name, v, c1, sx = 0, lab) => { text(ctx, name, 8, y + 9, { color: col.ink, size: 10.5, weight: 700 }); ctx.fillStyle = c1; ctx.fillRect(x0 + sx * k, y, v * k, 20); text(ctx, lab, x0 + (sx + v) * k + 4, y + 10, { color: col.ink, size: 10.5 }); };
    text(ctx, 'pushes OUT', 8, t0 + 14, { color: col.s[2], size: 10.5 });
    bar(t0 + 24, 'blood', g, col.s[2], 0, g + '');
    text(ctx, 'pushes BACK', 8, t0 + 62, { color: col.s[3], size: 10.5 });
    bar(t0 + 72, 'protein', b, col.s[3], 0, b + '');
    bar(t0 + 98, 'capsule', c, col.s[1] ?? col.s[4], b, c + '');
    line(ctx, [[x0 + (b + c) * k, t0 + 66], [x0 + (b + c) * k, t0 + 122]], col.ink, 2, [4, 3]);
    text(ctx, 'NFP', 8, t0 + 150, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = nfp > 0 ? col.s[2] : col.bad ?? col.s[3]; ctx.fillRect(x0, t0 + 140, Math.max(0, Math.abs(nfp)) * k, 20); text(ctx, nfp + ' mm Hg', x0 + Math.abs(nfp) * k + 4, t0 + 150, { color: col.ink, size: 11, weight: 700 });
    // GFR gauge
    const gy = t0 + 190; text(ctx, 'GFR', 8, gy + 10, { color: col.ink, size: 11, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(x0, gy, w - x0 - 14, 20); ctx.fillStyle = col.s[0]; ctx.fillRect(x0, gy, Math.min(1, gfr / 250) * (w - x0 - 14), 20);
    line(ctx, [[x0 + 0.5 * (w - x0 - 14), gy - 4], [x0 + 0.5 * (w - x0 - 14), gy + 24]], col.ink, 2); text(ctx, 'normal 125', x0 + 0.5 * (w - x0 - 14), gy + 36, { color: col.muted, size: 10, align: 'center' });
    text(ctx, gfr.toFixed(0) + ' mL/min', x0 + 6, gy + 10, { color: col.bg, size: 11, weight: 700 });
  };
  go();
}
