// Class 12 Electromagnetic Waves: how fast is c? Time taken to cover a distance by light and radio (3e8 m/s), a jet
// (250 m/s), sound in air (343 m/s) and a car (17 m/s). Bars use a log scale so all four fit; the numbers are exact.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  const TRIPS = [['Delhi to Chennai', 2180e3], ['Earth to a GEO satellite (INSAT)', 35786e3], ['Earth to the Moon', 384400e3], ['Earth to the Sun', 1.496e11]];
  const RUN = [['Light / radio', 3e8, 3], ['Jet plane', 250, 0], ['Sound in air', 343, 1], ['Car on a highway', 17, 2]];
  let ti = 0, t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Bars comparing the travel time of light, a jet, sound and a car over a chosen distance' });
  const ctl = row(host);
  choice(ctl, 'Journey', TRIPS.map((x, i) => [i, x[0]]), ti, (v) => { ti = v; upd(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const human = (s) => (s < 1e-3 ? `${(s * 1e6).toFixed(0)} µs` : s < 1 ? `${(s * 1e3).toFixed(1)} ms` : s < 120 ? `${s.toFixed(1)} s` : s < 7200 ? `${(s / 60).toFixed(0)} min` : s < 172800 ? `${(s / 3600).toFixed(1)} h` : s < 3.15e7 ? `${(s / 86400).toFixed(0)} days` : `${(s / 3.156e7).toFixed(1)} years`);
  function upd() { const d = TRIPS[ti][1]; out.innerHTML = `${TRIPS[ti][0]} (${(d / 1000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} km): light takes <b>${human(d / 3e8)}</b>, a jet <b>${human(d / 250)}</b>. A radio signal to INSAT and back takes about a quarter of a second: that is the delay you hear on a satellite phone.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Time to cover the distance (log scale)', col);
    const d = TRIPS[ti][1], L = 112, R = w - 12, rowH = (h - top - 30) / 4, lmin = -6, lmax = 10;
    RUN.forEach(([name, v, ci], i) => {
      const s = d / v, y = top + 14 + i * rowH, len = Math.max(4, ((Math.log10(s) - lmin) / (lmax - lmin)) * (R - L));
      text(ctx, name, 8, y + rowH * 0.32, { color: col.ink, size: 11.5, weight: 700 });
      ctx.fillStyle = col.s[ci]; ctx.globalAlpha = 0.3; ctx.fillRect(L, y + 4, len, rowH * 0.5); ctx.globalAlpha = 1;
      ctx.fillStyle = col.s[ci]; const px = L + (((t * (i === 0 ? 1.4 : 0.5)) % 1)) * len; ctx.fillRect(px - 2, y + 2, 5, rowH * 0.5 + 4);
      text(ctx, human(s), Math.min(R, L + len + 6) > w - 70 ? L + len - 6 : L + len + 6, y + rowH * 0.32, { color: col.ink, size: 11.5, weight: 700, align: L + len + 6 > w - 70 ? 'right' : 'left', halo: col.panel });
    });
    text(ctx, 'longer bar = longer time', 8, h - 12, { color: col.muted, size: 10.5 });
  };
  upd();
}
