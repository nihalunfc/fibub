// A skater (or a stool with weights): no outside torque, so L = Iω stays fixed. Pull the weights in and I falls,
// so ω must rise; the kinetic energy L²/2I rises too, paid for by the work your arms do against the pull outwards.
// Drag the slider slowly or press "Pull in / push out" and read the bars.
import { canvas, text, row, slider, readout, loop, button, line } from '../kit.js';

export default function (host) {
  let ang = 0, rT = 0.9, r = 0.9, going = false;
  const I0 = 2, m = 3, L = (I0 + 2 * m * 0.9 * 0.9) * 2; // starts at ω = 2 with arms out
  const cv = canvas(host, { aspect: 0.78, max: 380, min: 270, label: 'A spinning skater seen from above with weights on outstretched arms, and bars for I, omega, and kinetic energy' });
  const c1 = row(host);
  const sr = slider(c1, { label: 'Weights at radius', min: 0.2, max: 1, step: 0.01, value: 0.9, fmt: (v) => v.toFixed(2) + ' m', oninput: (v) => { rT = v; going = false; } });
  button(c1, 'Pull in / push out', () => { rT = rT > 0.5 ? 0.2 : 0.9; sr.set(rT); });
  const anim = loop(host, (dt) => { r += (rT - r) * Math.min(1, dt * 3); ang += (L / (I0 + 2 * m * r * r)) * dt; cv.redraw(); show(); });
  anim.button(c1);
  const out = readout(host);
  const I = () => I0 + 2 * m * r * r;
  function show() {
    const i = I(), w = L / i, ke = (L * L) / (2 * i);
    out.innerHTML = `L = Iω = ${L.toFixed(2)} kg m²/s (never changes). Now I = ${i.toFixed(2)} kg m², ω = <b>${w.toFixed(2)} rad/s</b> (${(w / (2 * Math.PI)).toFixed(2)} turns/s), kinetic energy ½Iω² = ${ke.toFixed(1)} J. Halving r cuts the weights' contribution to I by 4, so ω rises, but not 4-fold, because the body (I = 2) does not change.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.3, cy = h * 0.42, sc = Math.min(w * 0.27, h * 0.36);
    ctx.beginPath(); ctx.arc(cx, cy, sc * 0.9, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx, cy, sc * 0.16, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    [0, Math.PI].forEach((o) => { const x = cx + Math.cos(ang + o) * r * sc, y = cy + Math.sin(ang + o) * r * sc; line(ctx, [[cx, cy], [x, y]], col.muted, 4); ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); });
    text(ctx, 'top view', 8, 14, { color: col.muted, size: 11 });
    const i = I(), wv = L / i, ke = (L * L) / (2 * i), bx = w * 0.62, bw = w * 0.34, vals = [['L', L, 14, col.s[2]], ['I', i, 4, col.s[0]], ['ω', wv, 14, col.s[1]], ['KE', ke, 90, col.bad]];
    vals.forEach(([n, v, mx, c], k) => { const y = 40 + k * 38; text(ctx, n, bx - 8, y + 6, { color: col.ink, size: 12, weight: 700, align: 'right' }); ctx.fillStyle = col.line; ctx.fillRect(bx, y, bw, 12); ctx.fillStyle = c; ctx.fillRect(bx, y, bw * Math.min(1, v / mx), 12); });
    text(ctx, 'L stays level; I and ω trade; KE rises', 8, h - 12, { color: col.muted, size: 11 });
  };
  show();
}
