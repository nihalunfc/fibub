// Class 9 Surface Area and Volume (extension: why the volume of a sphere is 4/3 pi r^3). Archimedes' idea: stand a cone (tip at the
// bottom centre) inside a cylinder of radius r and height r. At every height y, the ring left between the cone and the cylinder has
// the SAME area as the slice of a hemisphere: pi(r^2 - y^2). So hemisphere = cylinder - cone = pi r^3 - 1/3 pi r^3 = 2/3 pi r^3.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { poly, ell, seg } from './c9-vol-lib.js';

export default function (host) {
  let y = 0.6;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 320, label: 'A cylinder, a cone and a hemisphere sliced at the same height, showing equal slice areas' });
  const ctl = row(host); const out = readout(host);
  slider(ctl, { label: 'Slice at height y (r = 1)', min: 0, max: 1, step: 0.05, value: y, fmt: (v) => v.toFixed(2), oninput: (v) => { y = v; sync(); } });
  const sync = () => { const a = 1 - y * y; out.innerHTML = `At height y = ${y.toFixed(2)}: cylinder slice π·1² minus cone slice π·${y.toFixed(2)}² = <b>π(1 − ${(y * y).toFixed(2)}) = ${a.toFixed(2)}π</b>. Hemisphere slice: radius √(1 − ${(y * y).toFixed(2)}) = ${Math.sqrt(a).toFixed(2)}, area π × ${a.toFixed(2)} = <b>${a.toFixed(2)}π</b>. Equal at every height, so the volumes are equal: hemisphere = πr³ − ⅓πr³ = <b>⅔πr³</b>, and the whole sphere = <b>4⁄3 πr³</b>.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Archimedes’ slicing idea', col), S = Math.min(w * 0.32, (h - top - 130) / 1.05), cx = w / 2, base = top + 14 + S + 14, sy = base - y * S;
    poly(ctx, [[cx - S, base], [cx + S, base], [cx + S, base - S], [cx - S, base - S]], null, col.s[0], 0, 2.5);
    poly(ctx, [[cx, base], [cx - S, base - S], [cx + S, base - S]], col.s[3], col.s[3], 0.25, 2);
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(cx - S, base); ctx.arc(cx, base, S, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, base, S, Math.PI, 0); ctx.stroke();
    seg(ctx, cx - S - 6, sy, cx + S + 6, sy, col.s[4], 2.5, [6, 4]);
    text(ctx, 'y', cx + S + 10, sy, { color: col.s[4], size: 12, weight: 700 });
    text(ctx, 'cone', cx, base - S * 0.3, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'hemisphere', cx, base - S * 0.8, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel });
    const r2 = Math.min(S * 0.52, 52), py = base + 34 + r2 - 6, x1 = cx - S * 0.8, x2 = cx + S * 0.8, rin = r2 * y, rh = r2 * Math.sqrt(1 - y * y);
    ell(ctx, x1, py, r2, r2, col.s[0], col.s[0], 0.3, 2); ell(ctx, x1, py, rin, rin, col.panel, col.s[3], 1, 2);
    ell(ctx, x2, py, rh, rh, col.s[1], col.s[1], 0.35, 2);
    text(ctx, 'cylinder minus cone', x1, py + r2 + 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'hemisphere slice', x2, py + r2 + 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    text(ctx, '=', cx, py, { color: col.ink, size: 22, weight: 700, align: 'center' });
  };
  sync();
}
