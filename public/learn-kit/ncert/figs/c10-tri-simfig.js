// Class 10 Triangles: similar figures. Two figures are similar when they have the same shape: all matching angles are equal
// and all matching lengths are in the same ratio (the scale factor k). A photocopier set to 150% makes a similar copy. Stretching
// in one direction only changes the shape: the ratios differ and the angles change, so the copy is NOT similar.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

const HOUSE = [[0, 0], [4, 0], [4, 3], [2, 5], [0, 3]];
const ang = (P, i) => { const n = P.length, p = P[i], a = P[(i + n - 1) % n], b = P[(i + 1) % n]; const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]]; return Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))) * 180 / Math.PI; };
export default function (host) {
  let k = 1.5, mode = 'scale';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A house shape and an enlarged copy, either similar or stretched out of shape' });
  const ctl = row(host);
  choice(ctl, 'Copy is', [['scale', 'scaled evenly'], ['stretch', 'stretched sideways']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'scale k', min: 0.5, max: 1.5, step: 0.1, value: k, fmt: (v) => '×' + v.toFixed(1), oninput: (v) => { k = v; go(); } });
  const out = readout(host);
  const copy = () => HOUSE.map(([x, y]) => [x * k, mode === 'scale' ? y * k : y]);
  function go() {
    const C = copy(), a1 = ang(HOUSE, 3), a2 = ang(C, 3);
    out.innerHTML = mode === 'scale' ? `Width ratio ${k.toFixed(1)}, height ratio ${k.toFixed(1)}: the same. Roof angle ${a1.toFixed(0)}° in both. <b>Similar.</b>` : `Width ratio ${k.toFixed(1)}, height ratio 1.0: different. Roof angle ${a1.toFixed(0)}° becomes ${a2.toFixed(0)}°. ${k === 1 ? 'k = 1 so it is the same size.' : '<b>Not similar.</b>'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'scale' ? 'Same shape, different size' : 'Stretched: the shape changes', col);
    const u = Math.min((w - 30) / 11, (h - 80) / 7.5), B = h - 30, C = copy();
    const draw = (P, ox, c, label) => {
      const pts = P.map(([x, y]) => [ox + x * u, B - y * u]);
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke();
      const apex = pts[3];
      ctx.beginPath(); ctx.arc(apex[0], apex[1], 14, Math.PI * 0.5 - ang(P, 3) * Math.PI / 360 - 0.0, Math.PI * 0.5 + ang(P, 3) * Math.PI / 360); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, label, (pts[0][0] + pts[1][0]) / 2, B + 14, { color: c, size: 11.5, weight: 700, align: 'center' });
    };
    draw(HOUSE, 12, col.s[0], 'original');
    draw(C, 12 + 4 * u + 0.9 * u, mode === 'scale' ? col.s[1] : col.s[3], 'copy');
  };
  go();
}
