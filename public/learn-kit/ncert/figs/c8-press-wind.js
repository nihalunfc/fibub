// Class 8 Winds: air moves from a region of high pressure to a region of low pressure; that moving air is wind. The
// bigger the pressure difference, the faster the wind. Sliders set the pressure in two places (hPa); arrows and
// particles show the flow. Particles are drawn from a fixed pattern that drifts, with speed set by the difference.
import { canvas, text, title, dot, arrow, row, slider, loop, readout, rng } from '../../kit.js';

export default function (host) {
  let A = 1018, B = 1008, t = 0;
  const R = rng(9), ps = Array.from({ length: 34 }, () => ({ x: R(), y: R(), s: 0.7 + R() * 0.6 }));
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Air particles flowing from a high pressure region to a low pressure region' });
  loop(host, (dt) => { t += dt; const v = (A - B) / 20; ps.forEach((p) => { p.x += v * p.s * dt * 0.8; if (p.x > 1) p.x -= 1; if (p.x < 0) p.x += 1; }); cv.redraw(); });
  const ctl = row(host);
  slider(ctl, { label: 'Left pressure', min: 990, max: 1030, step: 1, value: A, fmt: (z) => `${z} hPa`, oninput: (z) => { A = z; upd(); } });
  slider(ctl, { label: 'Right pressure', min: 990, max: 1030, step: 1, value: B, fmt: (z) => `${z} hPa`, oninput: (z) => { B = z; upd(); } });
  const out = readout(host);
  function upd() { const d = A - B; out.innerHTML = d === 0 ? 'Equal pressure: no push, <b>no wind</b>.' : `Difference <b>${Math.abs(d)} hPa</b>: wind blows from the ${d > 0 ? 'left (high)' : 'right (high)'} side to the ${d > 0 ? 'right (low)' : 'left (low)'} side. Bigger difference, stronger wind.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Wind blows from high to low pressure', col);
    const top = 58, bot = h - 60, hi = Math.max(A, B), lo = Math.min(A, B);
    const dens = (x) => { const f = x / w; const p = A + (B - A) * f; return (p - 985) / 50; };
    for (let i = 0; i < 40; i++) { const x0 = i * w / 40; ctx.globalAlpha = 0.10 + 0.4 * Math.max(0, Math.min(1, dens(x0 + 4))); ctx.fillStyle = col.s[0]; ctx.fillRect(x0, top, w / 40 + 1, bot - top); }
    ctx.globalAlpha = 1;
    ps.forEach((p) => { dot(ctx, 10 + p.x * (w - 20), top + 10 + p.y * (bot - top - 20), 3, col.ink); });
    text(ctx, `H ${A}`, 14, top - 10, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, `${B} L`, w - 14, top - 10, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    const d = A - B;
    if (d !== 0) { const L = Math.min(w * 0.7, 30 + Math.abs(d) * 9); const x0 = w / 2 - Math.sign(d) * L / 2, x1 = w / 2 + Math.sign(d) * L / 2; arrow(ctx, x0, bot + 28, x1, bot + 28, col.s[3], 5, 11); text(ctx, `wind ${Math.abs(d) * 3} km/h`, w / 2, bot + 48, { color: col.s[3], size: 11.5, weight: 700, align: 'center' }); }
  };
  upd();
}
