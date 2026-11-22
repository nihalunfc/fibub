// Class 9 Area: a triangle exists only if each side is shorter than the other two added together (the triangle
// inequality). Set the three sides with the sliders: the triangle is built from them and Heron's formula gives its
// area; as the longest side reaches the sum of the other two the triangle goes flat and the area drops to 0.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { heron } from './c9-area-lib.js';

export default function (host) {
  let a = 13, b = 14, c = 15;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A triangle built from three side lengths with its area from Heron formula' });
  const ctl = row(host);
  slider(ctl, { label: 'Side a', min: 1, max: 20, step: 1, value: a, fmt: (v) => v + ' m', oninput: (v) => { a = v; sync(); } });
  slider(ctl, { label: 'Side b', min: 1, max: 20, step: 1, value: b, fmt: (v) => v + ' m', oninput: (v) => { b = v; sync(); } });
  slider(ctl, { label: 'Side c', min: 1, max: 20, step: 1, value: c, fmt: (v) => v + ' m', oninput: (v) => { c = v; sync(); } });
  const out = readout(host);
  function sync() {
    const L = [a, b, c].sort((x, y) => x - y), ok = L[0] + L[1] > L[2], A = heron(a, b, c), s = (a + b + c) / 2;
    out.innerHTML = ok ? `s = ${s}. Area = √(${s} × ${s - a} × ${s - b} × ${s - c}) = <b>${A.toFixed(2)} m²</b>. Perimeter = ${a + b + c} m.` : `<b>No triangle.</b> ${L[0]} + ${L[1]} = ${L[0] + L[1]} is not more than ${L[2]}: the two short sides cannot reach across. (Heron’s formula would need the square root of ${s * (s - a) * (s - b) * (s - c)} ≤ 0.)`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Build a triangle from its three sides', col), L = [a, b, c].sort((x, y) => x - y), ok = L[0] + L[1] > L[2];
    const base = L[2], x = (L[2] ** 2 + L[0] ** 2 - L[1] ** 2) / (2 * L[2]), hh = ok ? Math.sqrt(Math.max(0, L[0] ** 2 - x * x)) : 0, k = Math.min((w - 50) / 20, (h - top - 50) / 17), ox = (w - base * k) / 2, by = h - 30;
    if (!ok) { // show how far the two short sides reach
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + L[0] * k, by); ctx.stroke(); ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(ox + L[0] * k, by - 10); ctx.lineTo(ox + (L[0] + L[1]) * k, by - 10); ctx.stroke();
      ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(ox, by + 14); ctx.lineTo(ox + base * k, by + 14); ctx.stroke();
      text(ctx, 'the short sides fall short of ' + base, w / 2, top + 40, { color: col.s[2], size: 13, weight: 700, align: 'center' });
      return;
    }
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(ox, by); ctx.lineTo(ox + base * k, by); ctx.lineTo(ox + x * k, by - hh * k); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, L[2] + '', ox + (base * k) / 2, by + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, L[0] + '', ox + (x * k) / 2 - 10, by - (hh * k) / 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, L[1] + '', ox + (base * k + x * k) / 2 + 10, by - (hh * k) / 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, heron(a, b, c).toFixed(1) + ' m²', ox + ((base + x) / 3) * k, by - (hh * k) / 3, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
