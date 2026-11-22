// Class 10 Colourful World: advance sunrise and delayed sunset. The air gets denser towards the ground, so light from the Sun
// is refracted downwards on its way to you, and the Sun seems higher than it really is. Near the horizon the shift is about
// 0.57 degrees (34 arcminutes, Bennett's formula R = 1/tan(h + 7.31/(h + 4.4)) arcmin), a bit more than the Sun's own width,
// so you see the Sun about 2 minutes before it truly rises and for about 2 minutes after it truly sets (the Sun
// moves 15 degrees per hour, so 0.57 degrees takes about 2.3 minutes at the equator). The Sun also looks flattened.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

const bennett = (h) => 1 / Math.tan(((h + 7.31 / (h + 4.4)) * Math.PI) / 180) / 60; // degrees
export default function (host) {
  let min = -1.5, air = true;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'The Sun seen above the horizon slightly before it has geometrically risen' });
  const ctl = row(host);
  choice(ctl, 'Atmosphere', [['on', 'With air'], ['off', 'No air (like the Moon)']], 'on', (v) => { air = v === 'on'; update(); });
  slider(ctl, { label: 'Time from true sunrise', min: -8, max: 8, step: 0.5, value: min, fmt: (v) => `${v > 0 ? '+' : ''}${v} min`, oninput: (v) => { min = v; update(); } });
  const out = readout(host);
  const st = () => { const h = min * 0.25, ap = air ? h + bennett(Math.max(h, -0.5)) : h; return { h, ap, vis: ap + 0.27 > 0 && ap - 0.27 < 5 }; };
  function update() {
    const { h, ap } = st(), seen = ap + 0.265 > 0;
    out.innerHTML = `True height of the Sun: <b>${h.toFixed(2)}°</b>. ${air ? `Refraction lifts it by ${(ap - h).toFixed(2)}°, so it appears at <b>${ap.toFixed(2)}°</b>.` : 'Without air there is no lifting.'} ` + (seen ? (h < -0.265 ? '<b>You can see the Sun even though it is still below the horizon.</b>' : 'The Sun is visible.') : 'The Sun has not appeared yet.') + ' (At sunset the same lift gives about 2 extra minutes of daylight.)';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sunrise comes early: the Sun looks higher than it is', col);
    const hor = h * 0.74, sc = 55, cx = w * 0.5, { h: th, ap } = st(), r = 0.265 * sc;
    ctx.fillStyle = col.soft; ctx.fillRect(0, hor, w, h - hor); line(ctx, [[0, hor], [w, hor]], col.ink, 2); text(ctx, 'horizon', 8, hor + 12, { color: col.muted, size: 10.5 });
    for (let k = 1; k <= 3; k++) { line(ctx, [[0, hor - k * sc], [14, hor - k * sc]], col.line, 1); text(ctx, `${k}°`, 18, hor - k * sc, { color: col.muted, size: 10 }); }
    // true position (ghost, may be below ground: clipped by drawing below the horizon in the soil colour)
    ctx.save(); ctx.beginPath(); ctx.rect(0, 40, w, h - 40); ctx.clip();
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx - 70, hor - th * sc, r, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    text(ctx, 'true position', cx - 70, Math.min(h - 8, hor - th * sc + r + 14), { color: col.muted, size: 10.5, align: 'center' });
    // the Sun as you see it: only the part above the horizon, flattened near the horizon
    const squash = air ? 1 - 0.14 * Math.max(0, 1 - Math.max(0, ap) / 1.5) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 40, w, hor - 40); ctx.clip(); ctx.fillStyle = '#f2a31a'; ctx.beginPath(); ctx.ellipse(cx + 40, hor - ap * sc, r, r * squash, 0, 0, 7); ctx.fill(); ctx.restore();
    text(ctx, 'what you see', cx + 40, Math.max(56, hor - ap * sc - r - 12), { color: '#c77d00', size: 11, weight: 700, align: 'center', halo: col.panel });
    if (air) { line(ctx, [[cx - 70, hor - th * sc - r - 4], [cx - 70, hor - th * sc - r - 4 - Math.max(2, (ap - th) * sc)]], col.s[3], 2); }
    text(ctx, air ? 'lift = refraction by the air' : 'no air, no lift', cx - 70, hor - 28 - 100 > 56 ? hor - 128 : 56, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
  };
  update();
}
