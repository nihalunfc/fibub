// Class 8 Earth: where Earth's water is. Each square is 1 per cent. Of all the water, about 97% is salty sea water and about 3% is fresh.
// Of the fresh water, about 69% is ice and glaciers, 30% is groundwater, and only about 1% is easy-to-reach surface water (lakes, rivers,
// soil moisture, air). Values rounded from the USGS "Where is Earth's water?" estimates (Shiklomanov / Gleick).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const VIEWS = {
  all: { t: 'All the water on Earth', cells: [[97, 's', 'Salt water (oceans)'], [3, 'f', 'Fresh water']], note: 'Only about <b>3 in every 100</b> parts of Earth\'s water is fresh. The rest is salty and not drinkable.' },
  fresh: { t: 'Fresh water only (3% of the total)', cells: [[69, 'i', 'Ice caps and glaciers'], [30, 'g', 'Groundwater'], [1, 'x', 'Lakes, rivers, soil, air']], note: 'Of that fresh water, about <b>69% is frozen</b> and <b>30% is underground</b>. Lakes and rivers hold only about 1% of it: a tiny share for all of us.' },
};
export default function (host) {
  let v = 'all';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A hundred squares showing the share of salt water, ice, groundwater and surface fresh water' });
  const ctl = row(host);
  choice(ctl, 'Show', [['all', 'All water'], ['fresh', 'Fresh water']], v, (x) => { v = x; say(); });
  const out = readout(host);
  const say = () => { out.innerHTML = VIEWS[v].note; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, VIEWS[v].t, col);
    const C = { s: col.s[0], f: col.s[2], i: col.muted, g: col.warn, x: col.good }, sq = Math.min((w - 40) / 10, (h - 110) / 10), x0 = (w - sq * 10) / 2, y0 = 36;
    let k = 0; VIEWS[v].cells.forEach(([n, key]) => { for (let j = 0; j < n; j++, k++) { ctx.fillStyle = C[key]; ctx.globalAlpha = 0.85; ctx.fillRect(x0 + (k % 10) * sq + 1, y0 + Math.floor(k / 10) * sq + 1, sq - 2, sq - 2); } });
    ctx.globalAlpha = 1;
    VIEWS[v].cells.forEach(([n, key, nm], i) => { const y = y0 + sq * 10 + 14 + i * 14; ctx.fillStyle = C[key]; ctx.fillRect(x0, y - 5, 10, 10); text(ctx, `${nm}: ${n}%`, x0 + 16, y, { color: col.ink, size: 10.5 }); });
  };
  say();
}
