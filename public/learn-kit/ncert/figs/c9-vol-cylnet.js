// Class 9 Surface Area and Volume (step player): unroll a cylinder. The curved surface opens into a rectangle 2*pi*r wide and h tall,
// and the two ends are circles of area pi*r^2, so the total surface area is 2*pi*r*h + 2*pi*r^2.
import { canvas, text, title } from '../../kit.js';
import { poly, ell, seg, note } from './c9-vol-lib.js';

const N = ['A cylinder of radius r and height h, like a tin of ghee. Its surface has three parts: a curved side and two flat circles.', 'Take off the top and bottom lids. They are circles of radius r.', 'Cut the curved part straight down one side, and open it out.', 'Flattened, it is a rectangle. Its height is h, and its width is the distance round the circle, 2πr.', 'Curved surface 2πrh, plus two circles 2 × πr²: total surface area = 2πrh + 2πr² = 2πr(h + r).'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A cylinder unrolled into a rectangle and two circles' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Surface of a cylinder', col), cx = w / 2, R = Math.min(w * 0.17, 52), H = Math.min(h * 0.3, 110), ry = R * 0.32, mid = top + (h - top - 70) / 2 + 6;
    const lab = (t, x, y, c, al = 'center') => text(ctx, t, x, y, { color: c || col.ink, size: 12, weight: 700, align: al, halo: col.panel });
    const cyl = (x, y0, alpha, open) => { // body between y0 (top centre) and y0 + H
      poly(ctx, [[x - R, y0], [x + R, y0], [x + R, y0 + H], [x - R, y0 + H]], null, null);
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(x - R, y0); ctx.lineTo(x - R, y0 + H); ctx.ellipse(x, y0 + H, R, ry, 0, Math.PI, 0, true); ctx.lineTo(x + R, y0); ctx.ellipse(x, y0, R, ry, 0, 0, Math.PI, true); ctx.fill(); ctx.globalAlpha = 1;
      seg(ctx, x - R, y0, x - R, y0 + H, col.s[0], 2.5); seg(ctx, x + R, y0, x + R, y0 + H, col.s[0], 2.5);
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y0 + H, R, ry, 0, 0, Math.PI); ctx.stroke();
      if (!open) ell(ctx, x, y0, R, ry, col.s[2], col.s[0], 0.35, 2.5);
      else { ctx.strokeStyle = col.s[0]; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.ellipse(x, y0, R, ry, 0, 0, Math.PI); ctx.stroke(); ctx.setLineDash([]); }
    };
    if (s === 0) { cyl(cx, mid - H / 2, 0.3, false); seg(ctx, cx, mid - H / 2, cx + R, mid - H / 2, col.ink, 1.5); lab('r', cx + R / 2, mid - H / 2 - 8); seg(ctx, cx + R + 12, mid - H / 2, cx + R + 12, mid + H / 2, col.ink, 1.5); lab('h', cx + R + 24, mid, null, 'left'); }
    if (s === 1) { ell(ctx, cx, mid - H / 2 - 30, R, ry, col.s[2], col.s[2], 0.4, 2.5); lab('top lid', cx + R + 6, mid - H / 2 - 30, col.s[2], 'left'); cyl(cx, mid - H / 2 + 0, 0.25, true); ell(ctx, cx, mid + H / 2 + 36, R, ry, col.s[2], col.s[2], 0.4, 2.5); lab('bottom lid', cx + R + 6, mid + H / 2 + 36, col.s[2], 'left'); }
    if (s === 2) { cyl(cx, mid - H / 2, 0.25, true); seg(ctx, cx + R, mid - H / 2 + 0, cx + R, mid + H / 2, col.s[4], 3.5, [6, 4]); lab('cut here ✂', cx + R + 8, mid, col.s[4], 'left'); }
    if (s >= 3) {
      const rw = Math.min(w - 40, 2 * Math.PI * R * 1.0), rx = (w - rw) / 2;
      poly(ctx, [[rx, mid - H / 2 + 10], [rx + rw, mid - H / 2 + 10], [rx + rw, mid + H / 2 + 10], [rx, mid + H / 2 + 10]], col.s[0], col.s[0], 0.3, 2.5);
      lab('2πr', rx + rw / 2, mid + H / 2 + 24); lab('h', rx - 8, mid + 10, null, 'right');
      if (s === 3) lab('curved surface', rx + rw / 2, mid + 10, col.ink);
      if (s === 4) { lab('2πrh', rx + rw / 2, mid + 10); const cyc = mid - H / 2 + 4 - R * 0.8 - 6; ell(ctx, w / 2 - R - 10, cyc, R * 0.8, R * 0.8, col.s[2], col.s[2], 0.4, 2.5); ell(ctx, w / 2 + R + 10, cyc, R * 0.8, R * 0.8, col.s[2], col.s[2], 0.4, 2.5); lab('πr²', w / 2 - R - 10, cyc); lab('πr²', w / 2 + R + 10, cyc); }
    }
    note(ctx, N[s], w, h, col, text);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
