// Class 8 Baudhayana-Pythagoras: the converse. For a triangle with sides a, b and longest side c: if a^2 + b^2 = c^2 the angle opposite
// c is a right angle; if it is more the triangle is acute; if less the angle is obtuse. Choose three side lengths.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let s1 = 5, s2 = 12, s3 = 13;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A triangle drawn from three side lengths with a test of the Pythagoras converse' });
  const ctl = row(host);
  [[(v) => (s1 = v), () => s1, 'Side 1'], [(v) => (s2 = v), () => s2, 'Side 2'], [(v) => (s3 = v), () => s3, 'Side 3']].forEach(([st, g, l]) => slider(ctl, { label: l, min: 3, max: 15, step: 1, value: g(), fmt: (v) => String(Math.round(v)), oninput: (v) => { st(Math.round(v)); upd(); } }));
  const out = readout(host);
  const info = () => { const [a, b, c] = [s1, s2, s3].sort((x, y) => x - y); const ok = a + b > c, d = a * a + b * b - c * c; return { a, b, c, ok, d, kind: !ok ? 'none' : d === 0 ? 'right' : d > 0 ? 'acute' : 'obtuse' }; };
  cv.draw = (ctx, w, h, col) => {
    const { a, b, c, ok, d, kind } = info(), t = title(ctx, a + ', ' + b + ', ' + c + (ok ? ': ' + kind + ' triangle' : ': no triangle (a + b ≤ c)'), col);
    if (ok) {
      const px = (c * c + b * b - a * a) / (2 * c), py = Math.sqrt(Math.max(0, b * b - px * px)), minx = Math.min(0, px), maxx = Math.max(c, px), sc = Math.min((w - 40) / (maxx - minx), (h - t - 90) / py), ox = (w - (maxx - minx) * sc) / 2 - minx * sc, oy = h - 64;
      const P = [[0, 0], [c, 0], [px, py]].map(([x, y]) => [ox + x * sc, oy - y * sc]);
      ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[kind === 'right' ? 2 : 0]; ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, 'longest side c = ' + c, ox + c * sc / 2, oy + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'angle opposite c is ' + (kind === 'right' ? '90°' : kind === 'acute' ? 'less than 90°' : 'more than 90°'), w / 2, t + 20, { color: kind === 'right' ? col.s[2] : col.s[3], size: 12, weight: 700, align: 'center' });
    }
    text(ctx, a + '² + ' + b + '² = ' + (a * a + b * b) + '   vs   ' + c + '² = ' + c * c, w / 2, h - 14, { color: ok && d === 0 ? col.s[2] : col.ink, size: 13, weight: 700, align: 'center' });
  };
  function upd() { const i = info(); out.innerHTML = !i.ok ? `${i.a} + ${i.b} is not more than ${i.c}: the two short sides cannot meet.` : `Sum of squares of the two shorter sides = ${i.a * i.a + i.b * i.b}; square of the longest = ${i.c * i.c}. ${i.kind === 'right' ? 'Equal: a <b>right-angled</b> triangle.' : i.kind === 'acute' ? 'Greater: all angles are <b>acute</b>.' : 'Smaller: the biggest angle is <b>obtuse</b>.'}`; cv.redraw(); }
  upd();
}
