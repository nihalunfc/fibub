// Class 8 Baudhayana-Pythagoras: squares on the three sides of a right triangle. Slide the legs a and b: the area of the square on the
// hypotenuse (c^2) always equals the two other squares added (a^2 + b^2).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 3, b = 4;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A right triangle with a square drawn on each side' });
  const ctl = row(host);
  slider(ctl, { label: 'Leg a', min: 1, max: 8, step: 1, value: a, fmt: (v) => String(Math.round(v)), oninput: (v) => { a = Math.round(v); upd(); } });
  slider(ctl, { label: 'Leg b', min: 1, max: 8, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'a² + b² = c²: ' + a * a + ' + ' + b * b + ' = ' + (a * a + b * b), col), c = Math.hypot(a, b), sc = Math.min((w - 20) / (a + 2 * b), (h - t - 40) / (2 * a + b)), ox = w / 2 - (a + 2 * b) * sc / 2 + b * sc, oy = t + 22 + (a + b) * sc;
    const X = (x) => ox + x * sc, Y = (y) => oy - y * sc;
    const poly = (p, cl, lab, lx, ly) => { ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath(); ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = cl; ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, lab, X(lx), Y(ly), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); };
    poly([[0, 0], [a, 0], [a, -a], [0, -a]], col.s[0], 'a² = ' + a * a, a / 2, -a / 2);
    poly([[0, 0], [0, b], [-b, b], [-b, 0]], col.s[2], 'b² = ' + b * b, -b / 2, b / 2);
    poly([[a, 0], [0, b], [b, a + b], [a + b, a]], col.s[3], 'c² = ' + (a * a + b * b), (a + b) / 2, (a + b) / 2);
    poly([[0, 0], [a, 0], [0, b]], col.s[5], '', 0, 0);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(X(0), Y(Math.min(a, b) * 0.2), Math.min(a, b) * 0.2 * sc, Math.min(a, b) * 0.2 * sc);
    text(ctx, 'c = ' + +c.toFixed(2), X(a * 0.62) + 8, Y(b * 0.62) - 4, { color: col.ink, size: 11, weight: 700, halo: col.panel });
  };
  function upd() { out.innerHTML = `Squares on the legs: ${a * a} and ${b * b}, total <b>${a * a + b * b}</b>. Square on the long side: c² = <b>${a * a + b * b}</b>, so c = √${a * a + b * b} ≈ ${+Math.hypot(a, b).toFixed(3)}. ${Number.isInteger(Math.hypot(a, b)) ? 'A whole number: this is a Pythagorean triple!' : 'Not a whole number here.'}`; cv.redraw(); }
  upd();
}
