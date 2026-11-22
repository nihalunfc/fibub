// 1.8 A zoom through the universe. Slide from a person (1 m) to the whole observable universe (about 10²⁷ m).
// Each object is drawn as a circle of its true size relative to the view, so neighbours appear and vanish
// as you zoom. Sizes are rounded diameters (or orbit diameters).
import { canvas, text, row, slider, readout, fmt } from '../../kit.js';

const LY = 9.461e15;
const THINGS = [
  [1.7, 'A person'], [828, 'Burj Khalifa'], [8.8e3, 'Mount Everest (height)'], [1.2742e7, 'Earth'], [1.39e8, 'Jupiter'],
  [7.69e8, 'The Moon\'s orbit'], [1.39e9, 'The Sun'], [2.99e11, 'Earth\'s orbit'], [9.0e12, 'Neptune\'s orbit'],
  [1.5e16, 'Oort cloud of comets (roughly)'], [8.1e16, 'Distance to the nearest star, ×2'], [1.0e21, 'Milky Way disc (100,000 ly)'],
  [9.5e22, 'Local Group of galaxies (10 million ly)'], [4.9e24, 'Laniakea supercluster (520 million ly)'], [8.8e26, 'Observable universe (93 billion ly)'],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 460, min: 300, label: 'A zoom from a person to the observable universe' });
  let p = 0.3;
  const ctl = row(host);
  slider(ctl, { label: 'Zoom: width of the view', min: 0, max: 27.2, step: 0.01, value: p, fmt: (v) => `10^${v.toFixed(1)} m`, oninput: (v) => { p = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const view = Math.pow(10, p), cx = w / 2, cy = h / 2 + 6, px = (w - 20) / view;
    const shown = [];
    THINGS.forEach(([d, name], i) => {
      const r = (d * px) / 2;
      if (r < 1.5 || r > w * 1.6) return;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = col.s[i % 8]; ctx.lineWidth = 2; ctx.stroke();
      if (r > 6 && r < Math.min(w * 0.49, h * 0.47)) shown.push([r, name, i]);
    });
    shown.forEach(([r, name]) => text(ctx, name, cx, r < 16 ? cy - r - 9 : cy - r + 13, { color: col.ink, size: 12, weight: 600, align: 'center', halo: col.panel }));
    // scale bar
    const nice = Math.pow(10, Math.floor(p - 0.3)), bar = nice * px;
    ctx.fillStyle = col.ink; ctx.fillRect(14, h - 22, bar, 3);
    const unit = nice >= LY * 0.5 ? `${fmt(nice / LY)} light-years` : nice >= 1e3 ? `${fmt(nice / 1e3)} km` : `${fmt(nice)} m`;
    text(ctx, unit, 14, h - 32, { color: col.ink, size: 11.5, weight: 600 });
    const light = view / 2.998e8;
    const tl = light < 1 ? `${fmt(light)} seconds` : light < 3600 ? `${fmt(light / 60)} minutes` : light < 86400 * 365.25 ? `${fmt(light / 3600)} hours` : `${fmt(light / 31557600)} years`;
    out.innerHTML = `View width: <b>${fmt(view)} m</b>. Light would take <b>${tl}</b> to cross it.`;
  };
  cv.redraw();
}
