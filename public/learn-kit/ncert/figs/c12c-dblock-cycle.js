// Class 12 Chemistry, d- and f-block (step player): why E°(Cu2+/Cu) is positive while Zn and Fe are negative. Energy to turn M(s) into M2+(aq):
// atomisation (solid to gas atoms) + first and second ionisation + hydration (negative). The smaller the net enthalpy, the more easily the metal gives up electrons in water.
// Values in kJ/mol, rounded: atomisation, IE1+IE2, hydration of M2+ (NCERT-style data tables; CRC Handbook).
import { canvas, text, title, line, row, choice } from '../../kit.js';

const M = { Zn: { a: 130, i: 2639, hyd: -2046, e: -0.76 }, Fe: { a: 416, i: 2323, hyd: -1920, e: -0.44 }, Cu: { a: 339, i: 2703, hyd: -2100, e: 0.34 } };
const LAB = ['Start: M(s)', '1. Atomise: M(s) → M(g)', '2. Ionise: M(g) → M²⁺(g) + 2e⁻', '3. Hydrate: M²⁺(g) → M²⁺(aq)', 'Net energy and E°'];

export default function (host) {
  let step = 0, m = 'Cu';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Energy steps for turning a metal into its aqueous M2+ ion' });
  const ctl = row(host);
  choice(ctl, 'metal', [['Zn', 'Zn'], ['Fe', 'Fe'], ['Cu', 'Cu']], m, (v) => { m = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, LAB[step], col), d = M[m], lv = [0, d.a, d.a + d.i, d.a + d.i + d.hyd];
    const L = 54, B = h - 30, T = top + 30, sc = (B - T) / 3200, bw = (w - L - 14) / 4.4, Y = (v) => B - v * sc;
    line(ctx, [[L, B], [w - 10, B]], col.ink, 1.5); text(ctx, '0', L - 6, B, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'kJ/mol', L - 6, T - 8, { color: col.muted, size: 10.5, align: 'right' });
    for (let v = 1000; v <= 3000; v += 1000) { line(ctx, [[L, Y(v)], [w - 10, Y(v)]], col.line, 1); text(ctx, String(v), L - 6, Y(v), { color: col.muted, size: 10.5, align: 'right' }); }
    const names = ['atomise', 'ionise', 'hydrate', 'net'], vals = [d.a, d.i, d.hyd, lv[3]];
    for (let s = 1; s <= Math.min(step, 4); s++) {
      const x = L + 10 + (s - 1) * bw * 1.1, last = s === 4, y1 = last ? 0 : lv[s - 1], y2 = last ? lv[3] : lv[s];
      ctx.fillStyle = last ? col.s[0] : s === 3 ? col.s[2] : col.s[3]; ctx.fillRect(x, Y(Math.max(y1, y2)), bw, Math.abs(Y(y1) - Y(y2)));
      text(ctx, (vals[s - 1] > 0 ? '+' : '−') + Math.abs(vals[s - 1]), x + bw / 2, Y(Math.max(y1, y2)) - 9, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
      text(ctx, names[s - 1], x + bw / 2, B + 14, { color: col.muted, size: 10.5, align: 'center' });
    }
    if (step === 4) text(ctx, `E° = ${d.e > 0 ? '+' : '−'}${Math.abs(d.e).toFixed(2)} V (${m}²⁺/${m})`, L + 8, T + 6, { color: col.ink, size: 13, weight: 700 });
    if (step === 4) text(ctx, m === 'Cu' ? 'highest net cost: Cu holds on' : m === 'Zn' ? 'lowest net cost: Zn lets go easily' : 'in between', L + 8, T + 24, { color: col.muted, size: 11 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
