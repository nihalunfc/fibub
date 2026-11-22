// Class 10 Light: the New Cartesian sign convention, shown on a live picture. The pole (mirror) or optical centre (lens)
// is the origin; distances measured in the direction the light travels are positive, against it negative; heights above
// the axis are positive, below negative. Pick a mirror or lens, slide the object, and watch the signs of u, v, f and
// the image height change. The numbers use 1/v + 1/u = 1/f (mirror) and 1/v - 1/u = 1/f (lens), f = 10 cm.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';
import { mirrorImage } from './c10-light-mirror.js';
import { lensImage } from './c10-light-lens.js';

const DEV = { cm: ['concave', 'Concave mirror'], vm: ['convex', 'Convex mirror'], cl: ['convex', 'Convex lens'], dl: ['concave', 'Concave lens'] };
export default function (host) {
  let dev = 'cm', d = 25;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Sign convention: distances to the left of the pole are negative and to the right positive' });
  const ctl = row(host);
  choice(ctl, 'Device', [['cm', 'Concave mirror'], ['vm', 'Convex mirror'], ['cl', 'Convex lens'], ['dl', 'Concave lens']], dev, (v) => { dev = v; update(); });
  slider(ctl, { label: 'Object distance', min: 4, max: 30, step: 1, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; update(); } });
  const out = readout(host);
  const info = () => {
    const mirror = dev === 'cm' || dev === 'vm', type = DEV[dev][0], r = mirror ? mirrorImage(type, d) : lensImage(type, d);
    return { mirror, ...r };
  };
  const sg = (x) => (x > 0 ? '+' : '−') + Math.abs(x).toFixed(1);
  function update() {
    const { u, v, f, m } = info();
    out.innerHTML = `u = <b>${sg(u)}</b> cm, v = <b>${Number.isFinite(v) ? sg(v) : '∞'}</b> cm, f = <b>${sg(f)}</b> cm, m = <b>${Number.isFinite(m) ? (m > 0 ? '+' : '−') + Math.abs(m).toFixed(2) : '∞'}</b> (${m > 0 ? 'erect, image above the axis' : 'inverted, image below the axis'}).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, DEV[dev][1] + ': read the signs', col);
    const { mirror, u, v, f, m } = info(), ox = Math.round(w * 0.5), cy = Math.round(h * 0.5), s = (w / 2 - 20) / 32, ho = 26;
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[1]; ctx.fillRect(6, cy - 76, ox - 6, 152); ctx.fillStyle = col.s[0]; ctx.fillRect(ox, cy - 76, w - ox - 6, 152); ctx.restore();
    line(ctx, [[6, cy], [w - 6, cy]], col.ink, 1.5);
    text(ctx, 'light travels →  (+)', ox + 8, cy - 66, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, '(−)  against the light', 10, cy - 66, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'up = +, down = −', w - 10, cy + 68, { color: col.muted, size: 10.5, align: 'right' });
    // the device
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3;
    if (mirror) { const R = 70, cc = dev === 'cm' ? ox - R : ox + R; ctx.beginPath(); ctx.arc(cc, cy, R, dev === 'cm' ? -0.85 : Math.PI - 0.85, dev === 'cm' ? 0.85 : Math.PI + 0.85); ctx.stroke(); }
    else { ctx.lineWidth = 2.5; ctx.fillStyle = col.soft; ctx.beginPath(); const e = dev === 'cl' ? 9 : -6, ed = dev === 'cl' ? 1 : 9; ctx.moveTo(ox - ed, cy - 62); ctx.quadraticCurveTo(ox - ed - e * 1.6, cy, ox - ed, cy + 62); ctx.lineTo(ox + ed, cy + 62); ctx.quadraticCurveTo(ox + ed + e * 1.6, cy, ox + ed, cy - 62); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    text(ctx, mirror ? 'P' : 'O', ox + (dev === 'cm' ? 8 : 0), cy + 15, { color: col.muted, size: 11, weight: 700, align: 'center' });
    // focal mark
    const xf = ox + f * s; line(ctx, [[xf, cy - 4], [xf, cy + 4]], col.ink, 1.5); text(ctx, `F`, xf, cy + 15, { color: col.muted, size: 10.5, align: 'center' });
    // object
    const xo = ox + u * s; arrow(ctx, xo, cy, xo, cy - ho, col.ink, 3, 8); line(ctx, [[xo, cy + 34], [ox, cy + 34]], col.s[1], 1.5);
    text(ctx, `u = ${sg(u)}`, (xo + ox) / 2, cy + 46, { color: col.s[1], size: 11.5, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'object', xo, cy - ho - 8, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // image
    if (Number.isFinite(v)) {
      const xi = ox + v * s, hi = Math.max(-50, Math.min(50, m * ho));
      if (xi > 8 && xi < w - 8) {
        ctx.save(); const virt = mirror ? v > 0 : v < 0; if (virt) ctx.setLineDash([4, 3]); arrow(ctx, xi, cy, xi, cy - hi, col.s[3], 3, 8); ctx.restore();
        line(ctx, [[xi, cy + 54], [ox, cy + 54]], col.s[3], 1.5, virt ? [4, 3] : undefined);
        text(ctx, `v = ${sg(v)}`, (xi + ox) / 2, cy + 62, { color: col.s[3], size: 11.5, weight: 700, align: 'center', halo: col.panel });
        text(ctx, `h′ ${hi > 0 ? '+' : '−'}`, xi + 6, cy - hi * 0.5, { color: col.s[3], size: 11, weight: 700 });
      } else text(ctx, 'image is off the picture', w - 10, h - 12, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    }
    text(ctx, 'F marks the focus; the object’s height h is positive; a dashed image is virtual', 10, h - 12, { color: col.ink, size: 11 });
  };
  update();
}
