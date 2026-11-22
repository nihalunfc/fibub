// Class 10 Triangles: the AA (angle-angle) criterion. If two angles of one triangle equal two angles of another, the third angles
// are equal too (angles add to 180°), so the triangles have the same shape: they are similar and all three pairs of sides are in
// the same ratio. Set angles A and B once; the second triangle is any enlargement, and the side ratios are all equal to k.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let A = 55, B = 65, k = 1.4;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'Two triangles with the same two angles and all three side ratios equal' });
  const ctl = row(host);
  slider(ctl, { label: 'angle A', min: 30, max: 90, step: 5, value: A, fmt: (v) => v + '°', oninput: (v) => { A = v; go(); } });
  slider(ctl, { label: 'angle B', min: 30, max: 80, step: 5, value: B, fmt: (v) => v + '°', oninput: (v) => { B = v; go(); } });
  slider(ctl, { label: 'size of second triangle k', min: 0.6, max: 1.6, step: 0.1, value: k, fmt: (v) => '×' + v.toFixed(1), oninput: (v) => { k = v; go(); } });
  const out = readout(host);
  const rad = Math.PI / 180, geom = () => { const Ce = 180 - A - B, a = Math.sin(A * rad) / Math.sin(Ce * rad), b = Math.sin(B * rad) / Math.sin(Ce * rad); return { Ce, a, b, c: 1 }; };
  function go() {
    const g = geom();
    out.innerHTML = `Angles ${A}°, ${B}° and ${g.Ce}° in both triangles. Sides of the first: ${g.a.toFixed(2)}, ${g.b.toFixed(2)}, 1.00; of the second: ${(g.a * k).toFixed(2)}, ${(g.b * k).toFixed(2)}, ${k.toFixed(2)}. Ratios: ${k.toFixed(2)}, ${k.toFixed(2)}, ${k.toFixed(2)}. <b>Similar by AA.</b>`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two equal angles are enough: AA', col) + 10;
    const g = geom(), apexX = g.b * Math.cos(A * rad), apexY = g.b * Math.sin(A * rad);
    const widths = 1 + k + 0.35, hmax = Math.max(1, k) * apexY, s = Math.min((w - 30) / widths, (h - top - 50) / hmax), Bm = h - 36;
    const draw = (ox, f, c, names) => {
      const P = [[ox, Bm], [ox + f * s, Bm], [ox + f * apexX * s, Bm - f * apexY * s]];
      ctx.beginPath(); ctx.moveTo(...P[0]); ctx.lineTo(...P[1]); ctx.lineTo(...P[2]); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke();
      text(ctx, `${A}°`, P[0][0] + 8, P[0][1] - 8, { color: c, size: 10.5, weight: 700 });
      text(ctx, `${B}°`, P[1][0] - 8, P[1][1] - 8, { color: c, size: 10.5, weight: 700, align: 'right' });
      text(ctx, `${g.Ce}°`, P[2][0], P[2][1] + 14, { color: c, size: 10.5, weight: 700, align: 'center' });
      text(ctx, names, (P[0][0] + P[1][0]) / 2, Bm + 14, { color: c, size: 11.5, weight: 700, align: 'center' });
    };
    draw(12, 1, col.s[0], 'ABC'); draw(12 + s + 0.35 * s, k, col.s[1], 'PQR  (k times bigger)');
  };
  go();
}
