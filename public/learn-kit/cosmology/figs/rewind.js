// 4.6 Lemaître's rewind. Slide time back from today towards the start: the galaxies close in, and the
// numbers show what that means: the universe's scale (a), how much denser matter was (1/a³) and how hot the
// cosmic background light was (2.7 K / a). The sizes come from the standard model (Planck 2018 values,
// rounded) through phys.js. Lemaître guessed this in 1931: a "primeval atom" at the start.
import { canvas, text, title, dot, row, slider, readout, rng, fmt } from '../../kit.js';
import { ageGyr, PLANCK18, T_CMB } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 280, label: 'Galaxies crowding together as time runs back towards the Big Bang' });
  // a table of (time, scale factor) from the model, made once
  const tab = [];
  for (let i = 0; i <= 160; i++) { const a = Math.pow(10, -4 + (4 * i) / 160); tab.push([ageGyr(1 / a - 1, PLANCK18), a]); }
  const T0 = tab[tab.length - 1][0];
  const aAt = (t) => { for (let i = 1; i < tab.length; i++) if (tab[i][0] >= t) { const [t0, a0] = tab[i - 1], [t1, a1] = tab[i]; return Math.exp(Math.log(a0) + (Math.log(a1) - Math.log(a0)) * (t - t0) / (t1 - t0)); } return 1; };
  let t = T0;
  const ctl = row(host);
  slider(ctl, { label: 'Time since the start', min: 0.0004, max: T0, value: T0, log: true, fmt: (v) => v >= 1 ? `${v.toFixed(2)} billion yr` : v >= 0.001 ? `${(v * 1000).toFixed(0)} million yr` : `${(v * 1e6).toFixed(0)} thousand yr`, oninput: (v) => { t = v; show(); cv.redraw(); } });
  const out = readout(host);
  const r = rng(5);
  const gal = Array.from({ length: 70 }, () => [(r() - 0.5) * 2, (r() - 0.5) * 2]);
  const show = () => {
    const a = aAt(t);
    out.innerHTML = `Distances were <b>${fmt(a, 3)}</b> of today's (a = ${fmt(a, 3)}). Matter was <b>${fmt(1 / a ** 3, 3)}×</b> denser, and the background light was <b>${fmt(T_CMB / a, 3)} K</b>${T_CMB / a > 3000 ? ': hotter than the surface of a red star, so space glowed' : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const a = aAt(t), cx = w / 2, cy = (h + 14) / 2, SX = w * 0.47, SY = (h - 80) * 0.5;
    // the view zooms so galaxies stay visible: show the shrinking factor as a ring of today's patch
    const z = Math.max(a, 0.12), f = a / z;
    const T = T_CMB / a;
    if (T > 600) { ctx.fillStyle = `rgba(255,110,30,${Math.min(0.5, Math.log10(T / 600) / 2)})`; ctx.fillRect(0, 34, w, h - 34); }
    gal.forEach(([x, y]) => { const px = cx + x * SX * f, py = cy + y * SY * f; if (py > 40 && py < h - 30) dot(ctx, px, py, 3, col.ink); });
    if (a < 0.12) text(ctx, 'too crowded to draw: no galaxies yet, just hot gas everywhere', cx, h - 14, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
    else text(ctx, `${t.toFixed(2)} billion years after the start`, cx, h - 14, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
    title(ctx, 'Run the expansion backwards', col);
  };
  show(); cv.redraw();
}
