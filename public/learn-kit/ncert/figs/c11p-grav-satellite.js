// Class 11 Gravitation: a satellite in a circular orbit at height h above the Earth (R = 6371 km, GM = 3.986e14 m^3/s^2). Gravity supplies the centripetal force: G M m / r^2 = m v^2 / r,
// so v = sqrt(GM/r) and T = 2 pi sqrt(r^3/GM), with r = R + h. At about 35 800 km the period is one day, so the satellite hangs over one spot on the equator (geostationary).
import { canvas, line, text, title, dot, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let h = 400, t = 0, ph = 0;
  const R = 6371, GM = 3.986e14;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A satellite circling the Earth at a height you choose, with its speed and orbital period' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Height above the surface', min: 200, max: 40000, step: 100, value: 400, fmt: (v) => Math.round(v).toLocaleString('en-IN') + ' km', oninput: (v) => { h = v; } });
  const pr = row(host);
  [['ISS', 400], ['Navigation (GPS)', 20200], ['Geostationary', 35786]].forEach(([n, v]) => button(pr, n, () => { h = v; sl.set(v); }));
  const lp = loop(host, (dt) => { const T = 2 * Math.PI * Math.sqrt(Math.pow((R + h) * 1000, 3) / GM); ph += dt * 1380 / T * 2 * Math.PI; t += dt; cv.redraw(); });
  lp.button(pr);
  const ro = readout(host);
  cv.draw = (ctx, w, hh, col) => {
    const top = title(ctx, 'Orbit speed and period depend on height only', col), cx = w / 2, cy = top + (hh - top) / 2, S = (Math.min(w, hh - top) / 2 - 14) / (R + 40000), rr = (R + h) * S;
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.3); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx, cy, R * S, 0, 6.3); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
    const rot = ph * 0 + (t * 1380 / 86164) * 2 * Math.PI; // Earth turns once a day
    const hx = cx + R * S * Math.cos(rot), hy = cy - R * S * Math.sin(rot); dot(ctx, hx, hy, 3.5, col.ink); text(ctx, 'you', hx + 5, hy - 8, { color: col.ink, size: 10, halo: col.panel });
    const sx = cx + rr * Math.cos(ph), sy = cy - rr * Math.sin(ph);
    dot(ctx, sx, sy, 6, col.s[2], col.panel);
    const v = Math.sqrt(GM / ((R + h) * 1000)) / 1000, T = 2 * Math.PI * Math.sqrt(Math.pow((R + h) * 1000, 3) / GM) / 3600;
    ro.textContent = `Radius r = ${(R + h).toLocaleString('en-IN')} km: v = √(GM/r) = ${v.toFixed(2)} km/s, period T = ${T.toFixed(2)} h${Math.abs(T - 23.93) < 0.4 ? ' (about one day: the satellite stays above the same spot, geostationary)' : ''}. Higher means slower and a longer period. Time is sped up (the clock shows ${Math.round(1380)}× real time).`;
  };
  cv.redraw();
}
