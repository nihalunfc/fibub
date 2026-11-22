// Class 9 Area: area and perimeter of the common four-sided shapes and the triangle. Each shape is built from its
// measurements; the formula shown is checked against the polygon area worked out from the corners (shoelace rule).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const SH = {
  rect: { name: 'Rectangle', a: 'length', b: 'breadth', h: null, f: (a, b) => `area = l × b = ${a} × ${b}`, v: (a, b) => [[0, 0], [a, 0], [a, b], [0, b]], A: (a, b) => a * b },
  par: { name: 'Parallelogram', a: 'base', b: 'slant side', h: 'height', f: (a, b, h) => `area = base × height = ${a} × ${h}`, v: (a, b, h) => { const o = Math.sqrt(Math.max(0, b * b - h * h)); return [[0, 0], [a, 0], [a + o, h], [o, h]]; }, A: (a, b, h) => a * h },
  tri: { name: 'Triangle', a: 'base', b: 'slope offset', h: 'height', f: (a, b, h) => `area = ½ × base × height = ½ × ${a} × ${h}`, v: (a, b, h) => [[0, 0], [a, 0], [b, h]], A: (a, b, h) => 0.5 * a * h },
  rho: { name: 'Rhombus', a: 'long diagonal', b: 'short diagonal', h: null, f: (a, b) => `area = ½ × d₁ × d₂ = ½ × ${a} × ${b}`, v: (a, b) => [[0, b / 2], [a / 2, 0], [a, b / 2], [a / 2, b]], A: (a, b) => 0.5 * a * b },
  trap: { name: 'Trapezium', a: 'long parallel side', b: 'short parallel side', h: 'height', f: (a, b, h) => `area = ½ × (a + b) × h = ½ × (${a} + ${b}) × ${h}`, v: (a, b, h) => [[0, 0], [a, 0], [(a + b) / 2, h], [(a - b) / 2, h]], A: (a, b, h) => 0.5 * (a + b) * h },
};
const shoelace = (p) => Math.abs(p.reduce((s, q, i) => s + q[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * q[1], 0)) / 2;
export default function (host) {
  let k = 'par', a = 8, b = 6, hh = 4;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A choice of shapes with sliders for their measurements and the area and perimeter worked out' });
  const ctl = row(host);
  choice(ctl, 'Shape', Object.entries(SH).map(([i, d]) => [i, d.name]), k, (v) => { k = v; build(); fix(); });
  const sl = row(host);
  let sa, sb, sh;
  const build = () => {
    sl.innerHTML = ''; const d = SH[k];
    sa = slider(sl, { label: d.a, min: 2, max: 12, step: 1, value: a, fmt: (v) => v + ' m', oninput: (v) => { a = v; sync(); } });
    sb = slider(sl, { label: d.b, min: k === 'tri' ? 0 : 2, max: 12, step: 1, value: b, fmt: (v) => v + ' m', oninput: (v) => { b = v; sync(); } });
    if (d.h) sh = slider(sl, { label: d.h, min: 2, max: 10, step: 1, value: hh, fmt: (v) => v + ' m', oninput: (v) => { hh = v; sync(); } });
  };
  const out = readout(host);
  function fix() { sync(); }
  function sync() {
    if (k === 'par' && b < hh) { b = hh; sb.set(b); }
    if (k === 'trap' && b > a) { b = a; sb.set(b); }
    if (k === 'tri' && b > a) { b = a; sb.set(b); }
    const d = SH[k], p = d.v(a, b, hh), per = p.reduce((s, q, i) => s + Math.hypot(q[0] - p[(i + 1) % p.length][0], q[1] - p[(i + 1) % p.length][1]), 0), A = d.A(a, b, hh);
    out.innerHTML = `<b>${d.name}</b>: ${d.f(a, b, hh)} = <b>${+A.toFixed(2)} m²</b>. Perimeter (sum of the sides) = <b>${+per.toFixed(2)} m</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const d = SH[k], top = title(ctx, d.name + ': area and perimeter', col), p = d.v(a, b, hh), xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = Math.min((w - 40) / (x1 - x0 || 1), (h - top - 50) / (y1 - y0 || 1), 40), ox = (w - s * (x1 - x0)) / 2, by = h - 28 - ((h - top - 50) - s * (y1 - y0)) / 2;
    const P = p.map((q) => [ox + (q[0] - x0) * s, by - (q[1] - y0) * s]);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    const mx = P.reduce((q, r) => q + r[0], 0) / P.length, my = P.reduce((q, r) => q + r[1], 0) / P.length;
    if (d.h) { // height line from the top vertex down to the base line
      const topV = k === 'tri' ? P[2] : P[2], bx = k === 'trap' ? P[3][0] : topV[0];
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(k === 'trap' ? bx : topV[0], by - (y1 - y0) * s); ctx.lineTo(k === 'trap' ? bx : topV[0], by); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'h', (k === 'trap' ? bx : topV[0]) + 5, by - ((y1 - y0) * s) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    }
    if (k === 'rho') { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); ctx.lineTo(P[2][0], P[2][1]); ctx.moveTo(P[1][0], P[1][1]); ctx.lineTo(P[3][0], P[3][1]); ctx.stroke(); ctx.setLineDash([]); }
    text(ctx, +d.A(a, b, hh).toFixed(1) + ' m²', mx, my, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'check from corners: ' + +shoelace(p).toFixed(1), w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  build(); sync();
}
