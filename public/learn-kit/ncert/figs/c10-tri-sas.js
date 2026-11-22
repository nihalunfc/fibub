// Class 10 Triangles: the SAS criterion. If one angle of a triangle equals one angle of another and the two sides around that
// angle are in the same ratio, the triangles are similar. Here angle A is 50° in both, the first triangle has sides AB = 4 and AC = 3 around it,
// and the second has AB = 4m and AC = 3n. When m = n it is a scaled copy; otherwise the other two angles differ.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const rad = Math.PI / 180, ANG = 50;
export default function (host) {
  let m = 1.5, n = 1.5;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'Two triangles with the same 50 degree angle and two sides around it compared' });
  const ctl = row(host);
  slider(ctl, { label: 'AB stretched by m', min: 0.6, max: 1.6, step: 0.1, value: m, fmt: (v) => '×' + v.toFixed(1), oninput: (v) => { m = v; go(); } });
  slider(ctl, { label: 'AC stretched by n', min: 0.6, max: 1.6, step: 0.1, value: n, fmt: (v) => '×' + v.toFixed(1), oninput: (v) => { n = v; go(); } });
  const out = readout(host);
  const angles = (c, b) => { const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(ANG * rad)), B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / rad; return [B, 180 - ANG - B]; };
  const same = () => Math.abs(m - n) < 1e-9;
  function go() {
    const [B1, C1] = angles(4, 3), [B2, C2] = angles(4 * m, 3 * n);
    out.innerHTML = `Angle A = 50° in both. AB ratio ${m.toFixed(1)}, AC ratio ${n.toFixed(1)}. Other angles: ${B1.toFixed(0)}° and ${C1.toFixed(0)}° in the first, ${B2.toFixed(0)}° and ${C2.toFixed(0)}° in the second. ${same() ? '<b>Equal ratios: similar by SAS.</b>' : '<b>Different ratios: not similar.</b>'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, same() ? 'Equal angle, proportional sides around it: SAS' : 'Sides not in the same ratio: not similar', col) + 10;
    const s = Math.min((w - 30) / (4 + 4 * m + 0.6), (h - top - 50) / (3 * Math.max(1, n) * Math.sin(ANG * rad) + 0.2)), Bm = h - 34;
    let ox = 12;
    [[4, 3, 0], [4 * m, 3 * n, 1]].forEach(([c, b, i]) => {
      const P = [[ox, Bm], [ox + c * s, Bm], [ox + b * Math.cos(ANG * rad) * s, Bm - b * Math.sin(ANG * rad) * s]], colr = i ? (same() ? col.s[1] : col.s[3]) : col.s[0];
      ctx.beginPath(); ctx.moveTo(...P[0]); ctx.lineTo(...P[1]); ctx.lineTo(...P[2]); ctx.closePath(); ctx.fillStyle = colr; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = colr; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(P[0][0], P[0][1], 18, -ANG * rad, 0); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, '50°', P[0][0] + 22, P[0][1] - 10, { color: col.ink, size: 10.5, weight: 700 });
      text(ctx, 'AB = ' + +c.toFixed(1), (P[0][0] + P[1][0]) / 2, Bm + 14, { color: colr, size: 11, weight: 700, align: 'center' });
      text(ctx, 'AC = ' + +b.toFixed(1), (P[0][0] + P[2][0]) / 2 - 8, (P[0][1] + P[2][1]) / 2 - 4, { color: colr, size: 11, weight: 700, align: 'right' });
      ox += c * s + 0.6 * s;
    });
  };
  go();
}
