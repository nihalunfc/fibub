// Class 8 Baudhayana-Pythagoras: the rope-stretchers' right angle. A loop of rope with knots at equal gaps is pegged out as a
// triangle with sides in the ratio 3 : 4 : 5 (12 gaps in all). Because 3^2 + 4^2 = 5^2, the corner between the 3 and the 4 is exactly 90 degrees.
// A 4 : 5 : 6 rope pegged the same way does not make a right angle.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  const sets = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 5, 6]];
  let k = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 270, label: 'A rope with equal knots pegged as a triangle to test for a right angle' });
  const ctl = row(host);
  choice(ctl, 'Rope sides', sets.map((s, i) => [i, s.join('-')]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [a, b, c] = sets[k], t = title(ctx, 'Rope with ' + (a + b + c) + ' equal gaps: sides ' + a + ', ' + b + ', ' + c, col);
    const px = (a * a + b * b - c * c) / (2 * a), py = Math.sqrt(Math.max(0, b * b - px * px)), minx = Math.min(0, px), maxx = Math.max(a, px), sc = Math.min((w - 70) / (maxx - minx), (h - t - 80) / py), ox = (w - (maxx - minx) * sc) / 2 - minx * sc, oy = h - 46;
    const P = [[0, 0], [a, 0], [px, py]].map(([x, y]) => [ox + x * sc, oy - y * sc]);
    const side = (p, q, n, cl) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.strokeStyle = cl; ctx.lineWidth = 3; ctx.stroke(); for (let i = 1; i < n; i++) { ctx.beginPath(); ctx.arc(p[0] + (q[0] - p[0]) * i / n, p[1] + (q[1] - p[1]) * i / n, 3.5, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); } };
    side(P[0], P[1], a, col.s[0]); side(P[0], P[2], b, col.s[2]); side(P[1], P[2], c, col.s[3]);
    P.forEach((p) => { ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); });
    const ang = Math.acos(px / b) * 180 / Math.PI;
    text(ctx, 'angle here = ' + +ang.toFixed(1) + '°', P[0][0] + 14, P[0][1] - 18, { color: Math.abs(ang - 90) < 0.01 ? col.s[2] : col.s[3], size: 12, weight: 700 });
    text(ctx, Math.abs(ang - 90) < 0.01 ? 'Right angle: ' + a + '² + ' + b + '² = ' + c + '²' : 'Not a right angle: ' + a * a + ' + ' + b * b + ' ≠ ' + c * c, w / 2, h - 14, { color: Math.abs(ang - 90) < 0.01 ? col.s[2] : col.s[3], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const [a, b, c] = sets[k]; out.innerHTML = `Rope of ${a + b + c} equal gaps. ${a}² + ${b}² = ${a * a + b * b} and ${c}² = ${c * c}. ${a * a + b * b === c * c ? 'Equal, so the corner between sides ' + a + ' and ' + b + ' is a right angle: the Baudhayana rope trick.' : 'Not equal, so the corner is not 90°.'}`; cv.redraw(); }
  upd();
}
