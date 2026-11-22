// A telescope is a light bucket: its power to show faint stars grows with the area of the aperture, not with magnification.
// Slide the aperture and the eyepiece on a made-up star field (about 14 magnitudes deep). The left disc shows your eye's 7 mm
// pupil as a tiny dot beside the aperture. Magnification only sets the true field of view and the exit pupil.
import { canvas, text, row, slider, readout, rng, title, dot } from '../kit.js';

const F = 1000, R = rng(11), PATCH = 8; // focal length (mm); patch width in degrees
const STARS = []; for (let i = 0; i < 20000; i++) { const m = 14.6 + Math.log(Math.max(1e-6, R())) / Math.log(2.3); if (m > -1) STARS.push([(R() - 0.5) * PATCH, (R() - 0.5) * PATCH, m]); }
export default function (host) {
  let ap = 100, fe = 25;
  const cv = canvas(host, { aspect: 0.72, max: 400, min: 290, label: 'A circular telescope view of a star field, with an inset comparing the aperture with the eye pupil' });
  const c1 = row(host);
  slider(c1, { label: 'Aperture', min: 7, max: 250, step: 1, value: ap, fmt: (v) => `${Math.round(v)} mm`, oninput: (v) => { ap = v; show(); } });
  slider(c1, { label: 'Eyepiece focal length', min: 4, max: 40, step: 1, value: fe, fmt: (v) => `${Math.round(v)} mm`, oninput: (v) => { fe = v; show(); } });
  const out = readout(host);
  const calc = () => { const M = F / fe, exit = ap / M, eff = Math.min(ap, 7 * M); return { M, exit, lim: 6.5 + 5 * Math.log10(eff / 7), area: (ap / 7) ** 2, fov: 50 / M }; };
  function show() {
    const c = calc(), seen = STARS.filter((s) => s[2] < c.lim && Math.abs(s[0]) < c.fov / 2 && Math.abs(s[1]) < c.fov / 2).length;
    out.innerHTML = `A ${Math.round(ap)} mm aperture collects <b>${c.area.toFixed(0)}×</b> the light of a 7 mm pupil, so stars to about magnitude <b>${c.lim.toFixed(1)}</b> (naked eye at a dark site: 6.5). Magnification ${c.M.toFixed(0)}× gives a ${c.fov.toFixed(2)}° true field (50° eyepiece) and an exit pupil of ${c.exit.toFixed(1)} mm${c.exit > 7 ? ' (wider than your pupil: some light is wasted)' : c.exit < 0.5 ? ' (too small: dim and blurry)' : ''}. About ${seen} stars of this made-up field are in view.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'What the eyepiece shows (made-up star field)', col);
    const c = calc(), cx = w * 0.56, cy = h * 0.54, r = Math.min(w * 0.42, h * 0.4);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = '#05060a'; ctx.fill(); ctx.clip();
    for (const s of STARS) {
      if (s[2] >= c.lim) continue;
      const x = cx + (s[0] / (c.fov / 2)) * r, y = cy + (s[1] / (c.fov / 2)) * r;
      if (Math.abs(x - cx) > r || Math.abs(y - cy) > r) continue;
      const rad = Math.max(0.7, Math.min(5, 0.9 + (c.lim - s[2]) * 0.32));
      ctx.globalAlpha = Math.min(1, 0.45 + (c.lim - s[2]) * 0.2); ctx.fillStyle = '#f4f4f0'; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    }
    ctx.restore(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    // inset: aperture and pupil to the same scale
    const ix = 38, iy = h - 46, ir = 30, er = Math.max(1.3, (7 / 250) * ir * (250 / 250));
    ctx.beginPath(); ctx.arc(ix, iy, ir * Math.sqrt(ap / 250 * ap / 250), 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke();
    dot(ctx, ix, iy, er, col.s[5]);
    text(ctx, 'aperture', ix, iy - ir - 6, { color: col.s[0], size: 10, align: 'center', weight: 600 });
    text(ctx, 'eye', ix + ir + 4, iy + 12, { color: col.s[5], size: 10, weight: 600 });
    text(ctx, `limit mag ${c.lim.toFixed(1)}`, cx, cy + r + 12, { color: col.muted, size: 11, align: 'center' });
  };
  show();
}
