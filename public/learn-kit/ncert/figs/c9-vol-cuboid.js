// Class 9 Surface Area and Volume: a cuboid l x b x h as a solid and as a net. Unfold it to see six rectangles in three matching pairs,
// so the total surface area is 2(lb + bh + hl); the volume is the number of unit cubes, l x b x h.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { poly } from './c9-vol-lib.js';

export default function (host) {
  let l = 5, b = 3, h = 4, mode = 'solid';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A cuboid shown as a solid and as an unfolded net with the area of each face' });
  const ctl = row(host);
  choice(ctl, 'Show', [['solid', 'Solid'], ['net', 'Net (unfolded)']], mode, (v) => { mode = v; sync(); });
  slider(ctl, { label: 'Length l', min: 1, max: 6, step: 1, value: l, fmt: (v) => v + ' cm', oninput: (v) => { l = v; sync(); } });
  slider(ctl, { label: 'Breadth b', min: 1, max: 6, step: 1, value: b, fmt: (v) => v + ' cm', oninput: (v) => { b = v; sync(); } });
  slider(ctl, { label: 'Height h', min: 1, max: 6, step: 1, value: h, fmt: (v) => v + ' cm', oninput: (v) => { h = v; sync(); } });
  const out = readout(host);
  function sync() { out.innerHTML = `Faces: 2 × (${l}×${b}) + 2 × (${b}×${h}) + 2 × (${h}×${l}) = ${2 * l * b} + ${2 * b * h} + ${2 * h * l} = <b>${2 * (l * b + b * h + h * l)} cm²</b> total surface area. Volume = ${l} × ${b} × ${h} = <b>${l * b * h} cm³</b>. Four side faces only (lateral surface): <b>${2 * h * (l + b)} cm²</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h0, col) => {
    const top = title(ctx, mode === 'solid' ? 'A cuboid' : 'The net of the cuboid', col), C = [col.s[0], col.s[1], col.s[2]];
    if (mode === 'solid') {
      const k = Math.min((w - 40) / (l + 0.5 * b), (h0 - top - 36) / (h + 0.5 * b)), dx = 0.5 * b * k * 0.85, dy = 0.5 * b * k * 0.6, x0 = (w - (l * k + dx)) / 2, y0 = top + 14 + dy + h * k;
      const F = [[x0, y0], [x0 + l * k, y0], [x0 + l * k, y0 - h * k], [x0, y0 - h * k]];
      poly(ctx, [F[3], F[2], [F[2][0] + dx, F[2][1] - dy], [F[3][0] + dx, F[3][1] - dy]], C[2], col.ink, 0.35);
      poly(ctx, [F[1], [F[1][0] + dx, F[1][1] - dy], [F[2][0] + dx, F[2][1] - dy], F[2]], C[1], col.ink, 0.35);
      poly(ctx, F, C[0], col.ink, 0.35);
      text(ctx, 'l = ' + l, (F[0][0] + F[1][0]) / 2, y0 + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, 'h = ' + h, x0 - 6, y0 - (h * k) / 2, { color: col.ink, size: 11, weight: 700, align: 'right' });
      text(ctx, 'b = ' + b, F[1][0] + dx / 2 + 14, y0 - dy / 2 + 8, { color: col.ink, size: 11, weight: 700 });
    } else {
      const u = Math.min((w - 30) / (2 * l + 2 * b), (h0 - top - 30) / (2 * b + h)), x0 = (w - (2 * l + 2 * b) * u) / 2, y0 = top + 14;
      const face = (x, y, fw, fh, c, t) => { poly(ctx, [[x0 + x * u, y0 + y * u], [x0 + (x + fw) * u, y0 + y * u], [x0 + (x + fw) * u, y0 + (y + fh) * u], [x0 + x * u, y0 + (y + fh) * u]], c, col.ink, 0.35); text(ctx, t, x0 + (x + fw / 2) * u, y0 + (y + fh / 2) * u, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); };
      face(0, b, l, h, C[0], 'l×h=' + l * h); face(l, b, b, h, C[1], 'b×h=' + b * h); face(l + b, b, l, h, C[0], 'l×h=' + l * h); face(2 * l + b, b, b, h, C[1], 'b×h=' + b * h);
      face(0, 0, l, b, C[2], 'l×b=' + l * b); face(0, b + h, l, b, C[2], 'l×b=' + l * b);
    }
  };
  sync();
}
