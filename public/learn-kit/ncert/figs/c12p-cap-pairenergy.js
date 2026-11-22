// Class 12 Electrostatic Potential and Capacitance: electrostatic potential energy of a pair of charges, U = k q1 q2 / r (zero at infinite separation).
// Bringing like charges together needs positive work (U rises); unlike charges give energy out (U falls, negative). The graph shows U against r; the dot is the present
// separation, and the readout gives the work an outside agent must do to bring the charge in from far away.
import { canvas, text, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let r = 0.3, sg = 1, q = 3;
  const k = 9e9;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Potential energy of two charges against their separation' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Charges', [[1, 'Like (+ +)'], [-1, 'Unlike (+ −)']], 1, (v) => { sg = v; go(); });
  slider(ctl, { label: 'each charge (µC)', min: 1, max: 5, step: 1, value: q, fmt: (v) => v.toFixed(0), oninput: (v) => { q = v; go(); } });
  slider(ctl, { label: 'separation r (m)', min: 0.1, max: 1, step: 0.01, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  const U = (x) => sg * k * q * q * 1e-12 / x;
  const go = () => { ro.textContent = `U = kq₁q₂/r = ${U(r).toFixed(3)} J.  Work done by an outside force bringing one charge from far away to ${r.toFixed(2)} m = ${U(r).toFixed(3)} J ${U(r) > 0 ? '(you push against repulsion)' : '(the field does the work, you hold back)'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const ym = 0.9;
    const A = axes(ctx, w, h, col, { x: [0, 1], y: sg > 0 ? [0, ym] : [-ym, 0], xlabel: 'separation r (m)', ylabel: 'U (J)', xt: [0, 0.25, 0.5, 0.75, 1], fx: (v) => v.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''), l: 52 });
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 150; i++) { const x = 0.05 + i * 0.95 / 150; pts.push([A.X(x), A.Y(Math.max(-ym, Math.min(ym, U(x))))]); } line(ctx, pts, col.s[0], 3); ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(r), A.T); ctx.lineTo(A.X(r), A.B); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, A.X(r), A.Y(Math.max(-ym, Math.min(ym, U(r)))), 6, col.s[3], col.panel);
    text(ctx, sg > 0 ? 'U > 0: energy stored by pushing together' : 'U < 0: bound pair (needs energy to separate)', A.R - 4, sg > 0 ? A.B - 12 : A.T + 12, { color: col.muted, size: 11, align: 'right' });
  };
  go();
}
