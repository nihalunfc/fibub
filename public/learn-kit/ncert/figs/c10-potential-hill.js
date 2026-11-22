// Class 10 Electricity (step player): potential difference as a "height" for charge. The cell is a pump that lifts
// each coulomb up by V volts (gives it V joules); the charge loses that energy in the resistor, in the bulb, and
// comes back to the cell at the bottom. Steps: water analogy, the cell lifts charge, energy given up in the
// resistor, two resistors share the drop, and the voltmeter reads the drop across a part.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'A cell lifting charges up an energy hill and the charges giving the energy up in resistors' });
  const TITLES = ['Water: a pump lifts, water falls back', 'The cell lifts each coulomb by V volts', 'In the resistor the charge gives up its energy', 'Two resistors share the fall', 'A voltmeter measures one drop'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8;
    const L = 30, R = w - 20, base = h - 34, hi = top + 34;
    if (step === 0) {
      // tank on a hill, pump, pipe with a water wheel
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(R - 110, hi, 90, 40); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(R - 110, hi, 90, 40);
      text(ctx, 'high tank', R - 65, hi - 8, { color: col.muted, size: 11, align: 'center' });
      ctx.strokeRect(L, base - 40, 90, 40); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.fillRect(L, base - 40, 90, 40); ctx.globalAlpha = 1;
      text(ctx, 'low tank', L + 45, base + 12, { color: col.muted, size: 11, align: 'center' });
      line(ctx, [[L + 45, base - 40], [L + 45, hi + 20], [R - 110, hi + 20]], col.ink, 2);
      text(ctx, 'pump lifts water', L + 52, (hi + base) / 2 - 20, { color: col.s[3], size: 11.5, weight: 700 });
      line(ctx, [[R - 65, hi + 40], [R - 65, base - 20], [L + 90, base - 20]], col.ink, 2);
      const wx = R - 65, wy = (hi + base) / 2 + 10, a = t * 2;
      ctx.beginPath(); ctx.arc(wx, wy, 18, 0, 7); ctx.stroke();
      for (let k = 0; k < 6; k++) line(ctx, [[wx, wy], [wx + 18 * Math.cos(a + k), wy + 18 * Math.sin(a + k)]], col.ink, 1.5);
      text(ctx, 'falling water turns a wheel', wx - 24, wy + 32, { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
      for (let k = 0; k < 6; k++) { const s = ((t * 0.3 + k / 6) % 1); dot(ctx, L + 45, base - 40 - s * (base - 40 - hi - 20), 3, col.s[0]); dot(ctx, R - 65, hi + 40 + s * (base - 60 - hi - 40), 3, col.s[0]); }
      return;
    }
    // energy-height graph along the circuit: cell (rise), wire (flat), resistor(s) (fall), wire (flat)
    const V = 6, Y = (v) => base - (v / V) * (base - hi);
    const xs = step >= 3 ? [L, L + 40, L + (R - L) * 0.35, L + (R - L) * 0.52, L + (R - L) * 0.68, L + (R - L) * 0.85, R] : [L, L + 40, L + (R - L) * 0.4, L + (R - L) * 0.8, R];
    const vs = step >= 3 ? [0, V, V, 2, 2, 0, 0] : [0, V, V, 0, 0];
    // axis
    line(ctx, [[L - 10, base], [R, base]], col.line, 1); line(ctx, [[L - 10, base], [L - 10, hi - 10]], col.line, 1);
    text(ctx, 'energy per coulomb (volts)', L - 6, hi - 18, { color: col.muted, size: 10.5 });
    text(ctx, '0 V', L - 14, base, { color: col.muted, size: 10, align: 'right' }); text(ctx, `${V} V`, L - 14, Y(V), { color: col.muted, size: 10, align: 'right' });
    const pts = xs.map((x, i) => [x, Y(vs[i])]);
    line(ctx, pts, col.ink, 3);
    // labels
    text(ctx, 'cell', (xs[0] + xs[1]) / 2, base + 14, { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
    if (step >= 3) {
      text(ctx, 'R₁: 4 V', (xs[2] + xs[3]) / 2, base + 14, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
      text(ctx, 'R₂: 2 V', (xs[4] + xs[5]) / 2, base + 14, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
    } else text(ctx, 'resistor', (xs[2] + xs[3]) / 2, base + 14, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
    text(ctx, 'wire (almost no drop)', (xs[1] + xs[2]) / 2, Y(V) - 12, { color: col.muted, size: 10.5, align: 'center' });
    // moving charges along the path
    const segLen = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = segLen.reduce((a, b) => a + b, 0);
    const posAt = (s) => { let d = s * total; for (let i = 0; i < segLen.length; i++) { if (d <= segLen[i]) { const f = d / segLen[i]; return [pts[i][0] + f * (pts[i + 1][0] - pts[i][0]), pts[i][1] + f * (pts[i + 1][1] - pts[i][1])]; } d -= segLen[i]; } return pts.at(-1); };
    for (let k = 0; k < 7; k++) { const [x, y] = posAt((t * 0.12 + k / 7) % 1); dot(ctx, x, y - 6, 5, col.s[7]); }
    if (step === 1) { arrow(ctx, xs[1] + 16, base - 10, xs[1] + 16, Y(V) + 10, col.s[3], 2); text(ctx, 'each coulomb gets 6 J', xs[1] + 24, (base + Y(V)) / 2, { color: col.s[3], size: 12, weight: 700 }); }
    if (step === 2) {
      const mx = (xs[2] + xs[3]) / 2, my = (Y(V) + base) / 2;
      const glow = 0.5 + 0.5 * Math.sin(t * 6);
      ctx.save(); ctx.globalAlpha = 0.2 + 0.3 * glow; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(mx, my, 26, 0, 7); ctx.fill(); ctx.restore();
      text(ctx, '6 J per coulomb → heat and light', mx + 30, my, { color: col.s[1], size: 12, weight: 700 });
    }
    if (step === 4) {
      const x1 = xs[2], x2 = xs[3];
      line(ctx, [[x1, Y(V)], [x1, hi - 4], [x2, hi - 4], [x2, Y(2)]], col.s[6], 1.5, [5, 4]);
      ctx.beginPath(); ctx.arc((x1 + x2) / 2, hi - 4, 13, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[6]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, 'V', (x1 + x2) / 2, hi - 4, { color: col.s[6], size: 13, weight: 700, align: 'center' });
      text(ctx, 'reads 4 V: the drop across R₁ only', (x1 + x2) / 2 + 18, hi + 14, { color: col.s[6], size: 11.5, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); } };
}
