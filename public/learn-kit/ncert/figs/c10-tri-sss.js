// Class 10 Triangles: the SSS criterion. If the three sides of one triangle are proportional to the three sides of another, the
// triangles are similar and their angles match. The first triangle has sides 3, 4, 5. The second has sides 3k, 4k and 5k(1 + e).
// With e = 0 the ratios are equal and the angles agree. Spoil one side (e not 0) and the angles no longer match.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const ang = (a, b, c) => Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI; // angle opposite a
export default function (host) {
  let k = 1.4, e = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A 3-4-5 triangle and a second triangle whose sides are compared' });
  const ctl = row(host);
  slider(ctl, { label: 'scale k', min: 0.6, max: 1.6, step: 0.1, value: k, fmt: (v) => '×' + v.toFixed(1), oninput: (v) => { k = v; go(); } });
  slider(ctl, { label: 'stretch the longest side by', min: -0.2, max: 0.2, step: 0.05, value: e, fmt: (v) => (v > 0 ? '+' : '') + Math.round(v * 100) + '%', oninput: (v) => { e = v; go(); } });
  const out = readout(host);
  const S2 = () => [3 * k, 4 * k, 5 * k * (1 + e)];
  function go() {
    const [a, b, c] = S2(), same = Math.abs(e) < 1e-9;
    out.innerHTML = `Ratios of sides: ${(a / 3).toFixed(2)}, ${(b / 4).toFixed(2)}, ${(c / 5).toFixed(2)}. Angles of the second: ${ang(a, b, c).toFixed(0)}°, ${ang(b, a, c).toFixed(0)}°, ${ang(c, a, b).toFixed(0)}° (first: 37°, 53°, 90°). ${same ? '<b>All ratios equal: similar by SSS.</b>' : '<b>Ratios differ: not similar</b>, and the angles have changed.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, same() ? 'Same ratios on all three sides: SSS' : 'One side spoiled: not similar', col) + 10;
    const T = [[3, 4, 5], S2()], hh = ([a, b, c]) => { const ca = (b * b + c * c - a * a) / (2 * b * c); return b * Math.sqrt(Math.max(0, 1 - ca * ca)); };
    const s = Math.min((w - 30) / (T[0][2] + T[1][2] + 0.6), (h - top - 50) / Math.max(hh(T[0]), hh(T[1]))), Bm = h - 36;
    let ox = 12;
    T.forEach(([a, b, c], i) => {
      const cosA = (b * b + c * c - a * a) / (2 * b * c), Ax = ox, Cx = ox + b * cosA * s, Cy = Bm - b * Math.sqrt(Math.max(0, 1 - cosA * cosA)) * s;
      const P = [[Ax, Bm], [ox + c * s, Bm], [Cx, Cy]], colr = i ? (same() ? col.s[1] : col.s[3]) : col.s[0];
      ctx.beginPath(); ctx.moveTo(...P[0]); ctx.lineTo(...P[1]); ctx.lineTo(...P[2]); ctx.closePath(); ctx.fillStyle = colr; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = colr; ctx.lineWidth = 2.5; ctx.stroke();
      const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      text(ctx, (+c.toFixed(2)).toString(), mid(P[0], P[1])[0], Bm + 14, { color: colr, size: 11, weight: 700, align: 'center' });
      text(ctx, (+b.toFixed(2)).toString(), mid(P[0], P[2])[0] - 8, mid(P[0], P[2])[1], { color: colr, size: 11, weight: 700, align: 'right' });
      text(ctx, (+a.toFixed(2)).toString(), mid(P[1], P[2])[0] + 8, mid(P[1], P[2])[1], { color: colr, size: 11, weight: 700 });
      ox += c * s + 0.6 * s;
    });
  };
  const same = () => Math.abs(e) < 1e-9;
  go();
}
