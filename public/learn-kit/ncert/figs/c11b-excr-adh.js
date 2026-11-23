// Class 11 Biology, Excretory products: water balance and ADH. Osmoreceptors in the hypothalamus sense plasma osmolarity (normal about 290 mOsm/L). When it rises, ADH is released;
// ADH makes the collecting duct permeable to water, so water is taken back and the urine is small and concentrated. The body must still get rid of about 800 mOsm of solute a day, so
// urine volume = solute load / urine osmolarity (800 mOsm / 1200 mOsm per L = 0.67 L; 800 / 100 = 8 L).
import { canvas, text, title, line, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let osm = 290;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Collecting duct with ADH level, urine concentration and urine volume bars for a chosen blood osmolarity' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Blood osmolarity (mOsm/L)', min: 280, max: 310, step: 1, value: osm, fmt: (v) => String(Math.round(v)), oninput: (v) => { osm = v; go(); } });
  const model = () => { const adh = Math.min(1, Math.max(0, (osm - 282) / 20)), u = 100 + 1100 * adh; return { adh, u, vol: 800 / u }; };
  const go = () => {
    const m = model();
    ro.textContent = `Blood ${Math.round(osm)} mOsm/L (${osm < 288 ? 'too watery: you drank a lot' : osm > 296 ? 'too salty: dehydrated' : 'about normal'}). ADH ${Math.round(m.adh * 100)} % of maximum; urine ${Math.round(m.u)} mOsm/L; volume ${m.vol.toFixed(1)} L a day. Drag left after drinking, right on a hot day without water.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'ADH and the collecting duct', col), m = model();
    const x0 = 36, y0 = t0 + 14, y1 = y0 + 110;
    ctx.fillStyle = col.soft; ctx.fillRect(x0 - 24, y0 - 4, 96, y1 - y0 + 8); text(ctx, 'salty medulla', x0 + 24, y1 + 14, { color: col.muted, size: 10, align: 'center' });
    line(ctx, [[x0 + 24, y0], [x0 + 24, y1]], col.line, 20);
    for (let k = 0; k < 5; k++) { const a = m.adh; arrow(ctx, x0 + 24, y0 + 14 + k * 20, x0 + 24 - 20 * a, y0 + 14 + k * 20, col.s[0], 1 + 2 * a, 6); }
    arrow(ctx, x0 + 24, y1, x0 + 24, y1 + 4, col.s[3], 2, 4);
    text(ctx, 'water pulled back', x0 + 90, y0 + 40, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, `${Math.round(m.adh * 100)} % open`, x0 + 90, y0 + 56, { color: col.ink, size: 10.5 });
    // bars
    const bx = x0 + 18, bw = w - bx - 20, by = y1 + 38, bar = (i, name, frac, c, val) => {
      const y = by + i * 36; text(ctx, name, bx, y, { color: col.ink, size: 11, weight: 700 });
      ctx.fillStyle = col.line; ctx.fillRect(bx, y + 8, bw, 12); ctx.fillStyle = c; ctx.fillRect(bx, y + 8, bw * frac, 12); text(ctx, val, bx + bw, y, { color: col.ink, size: 11, align: 'right' });
    };
    bar(0, 'ADH in blood', m.adh, col.s[0], Math.round(m.adh * 100) + ' %');
    bar(1, 'Urine concentration', (m.u - 100) / 1100 * 0.92 + 0.08, col.s[3], Math.round(m.u) + ' mOsm/L');
    bar(2, 'Urine volume per day', Math.min(1, m.vol / 8), col.s[2], m.vol.toFixed(1) + ' L');
  };
  go();
}
