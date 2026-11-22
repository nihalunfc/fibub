// Class 12 Alternating Current: rotating phasors. A phasor is an arrow of length V0 turning anticlockwise at angular
// speed w; its vertical shadow is v = V0 sin(wt). Pick a resistor, inductor or capacitor and watch the voltage and current
// phasors turn together while the two waveforms are traced on the right. R: in phase. L: current lags by 90 degrees.
// C: current leads by 90 degrees (ELI the ICE man).
import { canvas, line, dot, text, title, arrow, row, choice, loop, slider, readout } from '../../kit.js';

export default function (host) {
  let el = 'R', ph = 0, hist = [], phiOverride = null;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 250, label: 'Rotating voltage and current phasors with the two waveforms traced beside them' });
  const ctl = row(host);
  choice(ctl, 'Element', [['R', 'Resistor'], ['L', 'Inductor'], ['C', 'Capacitor']], el, (v) => { el = v; upd(); });
  const anim = loop(host, (dt) => { ph = (ph + dt * 2.2) % (2 * Math.PI); cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const shift = () => (el === 'R' ? 0 : el === 'L' ? -Math.PI / 2 : Math.PI / 2); // current phase relative to voltage
  function upd() {
    out.innerHTML = el === 'R' ? 'Resistor: i and v rise and fall together. Phase difference <b>0°</b>.' : el === 'L' ? 'Inductor: the current peak comes a quarter cycle <b>after</b> the voltage peak: i lags v by <b>90°</b>.' : 'Capacitor: the current peak comes a quarter cycle <b>before</b> the voltage peak: i leads v by <b>90°</b>.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Phasors (left) and what you see on a scope (right)', col);
    const cx = Math.min(w * 0.27, 110), cy = top + (h - top) / 2 - 6, R = Math.min(cx - 14, (h - top) / 2 - 28);
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
    line(ctx, [[cx - R - 6, cy], [cx + R + 6, cy]], col.line, 1); line(ctx, [[cx, cy - R - 6], [cx, cy + R + 6]], col.line, 1);
    const a = ph, b = ph + shift();
    const rv = R, ri = R * 0.72;
    arrow(ctx, cx, cy, cx + rv * Math.cos(a), cy - rv * Math.sin(a), col.s[0], 3, 10);
    arrow(ctx, cx, cy, cx + ri * Math.cos(b), cy - ri * Math.sin(b), col.s[1], 3, 10);
    text(ctx, 'V', cx + (rv + 10) * Math.cos(a), cy - (rv + 10) * Math.sin(a), { color: col.s[0], size: 12, weight: 700, align: 'center' });
    text(ctx, 'I', cx + (ri + 10) * Math.cos(b), cy - (ri + 10) * Math.sin(b), { color: col.s[1], size: 12, weight: 700, align: 'center' });
    // shadows project to the right
    const x0 = cx + R + 22, x1 = w - 12, ampH = R;
    const yv = cy - rv * Math.sin(a), yi = cy - ri * Math.sin(b);
    line(ctx, [[cx + rv * Math.cos(a), yv], [x0, yv]], col.s[0], 1, [3, 3]);
    line(ctx, [[cx + ri * Math.cos(b), yi], [x0, yi]], col.s[1], 1, [3, 3]);
    line(ctx, [[x0, cy], [x1, cy]], col.line, 1);
    const span = x1 - x0, pv = [], pi = [];
    for (let k = 0; k <= 120; k++) { const u = (k / 120) * 2 * Math.PI, x = x0 + (k / 120) * span; pv.push([x, cy - rv * Math.sin(a - u)]); pi.push([x, cy - ri * Math.sin(b - u)]); }
    line(ctx, pv, col.s[0], 2.5); line(ctx, pi, col.s[1], 2.5);
    dot(ctx, x0, yv, 4.5, col.s[0]); dot(ctx, x0, yi, 4.5, col.s[1]);
    text(ctx, 'v', x1 - 4, cy - rv - 4, { color: col.s[0], size: 12, weight: 700, align: 'right' });
    text(ctx, 'i', x1 - 4, cy + rv + 4, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    text(ctx, el === 'R' ? 'same direction: φ = 0' : el === 'L' ? 'I is 90° behind V' : 'I is 90° ahead of V', cx, cy + R + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center', fit: true });
  };
  upd();
}
