// 8.2 Larmor precession and resonance absorption. Left: a magnetic moment precessing about B₀ at the Larmor
// frequency ν₀ = (γ/2π)B₀ (slowed down enormously for the eye; the cone angle does not change the rate). Right: the
// Lorentzian absorption line of full width 1/(πT₂) around ν₀, with the RF frequency as a marker; the readout gives
// ν₀ for the chosen spin and field and the absorption at the RF frequency as a fraction of the peak.
import { canvas, line, dot, arrow, row, slider, choice, readout, title, text, fmt, loop, axes } from '../../kit.js';

const SP = { p: ['proton ¹H', 42.577e6], c: ['carbon-13', 10.708e6], e: ['free electron', 28.025e9] };
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 400, min: 260, label: 'A spin precessing about a magnetic field, and its resonance absorption line' });
  let sp = 'p', B = 1, off = 0, T2 = 1, ang = 0;
  const ctl = row(host);
  choice(ctl, 'Spin', [['p', '¹H'], ['c', '¹³C'], ['e', 'electron']], sp, (v) => { sp = v; redo(); });
  slider(ctl, { label: 'Field B₀ (T)', min: 0.1, max: 20, value: B, log: true, fmt: (v) => fmt(v, 3), oninput: (v) => { B = v; redo(); } });
  const ctl2 = row(host);
  slider(ctl2, { label: 'RF offset from ν₀ (in units of 1/πT₂)', min: -4, max: 4, step: 0.05, value: off, fmt: (v) => v.toFixed(2), oninput: (v) => { off = v; redo(); } });
  slider(ctl2, { label: 'T₂ (s, NMR) or ns (ESR)', min: 0.01, max: 10, value: T2, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { T2 = v; redo(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { ang += dt * 2.2; cv.redraw(); });
  anim.button(ctl2);
  const lor = (x) => 1 / (1 + 4 * x * x);   // x = offset / FWHM
  const show = () => {
    const [nm, g] = SP[sp], nu = g * B, el = sp === 'e', t2 = el ? T2 * 1e-9 : T2, fw = 1 / (Math.PI * t2);
    const unit = nu > 1e9 ? [1e9, 'GHz'] : [1e6, 'MHz'];
    out.innerHTML = `${nm} in ${fmt(B, 3)} T: ν₀ = <b>${fmt(nu / unit[0], 4)} ${unit[1]}</b> (${fmt(g / 1e6, 5)} MHz/T × B₀). Linewidth 1/(πT₂) = ${fmt(fw, 3)} Hz. The RF is ${fmt(off * fw, 3)} Hz off resonance, where the absorption is <b>${fmt(lor(off), 3)}</b> of the peak; half power at ±${fmt(fw / 2, 3)} Hz.`;
  };
  const redo = () => { cv.redraw(); show(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Precession about B₀ and the resonance line', col);
    // left: cone
    const cx = w * 0.22, cy = (h + top) / 2 + 10, Lr = Math.min(w * 0.17, (h - top) * 0.38), tilt = 0.5;
    arrow(ctx, cx, cy + Lr * 0.6, cx, cy - Lr * 1.25, col.muted, 1.5);
    text(ctx, 'B₀', cx + 6, cy - Lr * 1.2, { color: col.muted, size: 12, weight: 700 });
    const rx = Lr * Math.sin(tilt), ry = rx * 0.32, hz = cy - Lr * Math.cos(tilt);
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.ellipse(cx, hz, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
    const tx = cx + rx * Math.cos(ang), ty = hz + ry * Math.sin(ang);
    arrow(ctx, cx, cy, tx, ty, col.s[0], 2.6);
    dot(ctx, cx, cy, 3, col.ink);
    text(ctx, 'μ precesses at ω = γB₀', cx, cy + Lr * 0.6 + 14, { color: col.ink, size: 11, align: 'center' });
    // right: Lorentzian
    ctx.save(); ctx.translate(w * 0.42, 0);
    const a = axes(ctx, w * 0.58, h, col, { x: [-4, 4], y: [0, 1.1], xlabel: '(ν − ν₀) / linewidth', ylabel: 'absorption', t: top + 6, l: 40 });
    const pts = []; for (let i = 0; i <= 200; i++) { const x = -4 + 8 * i / 200; pts.push([a.X(x), a.Y(lor(x))]); }
    line(ctx, pts, col.s[1], 2.3);
    line(ctx, [[a.X(-0.5), a.Y(0.5)], [a.X(0.5), a.Y(0.5)]], col.s[3], 1.5);
    text(ctx, 'FWHM = 1/πT₂', a.X(0.6), a.Y(0.5), { color: col.s[3], size: 10, halo: col.panel });
    line(ctx, [[a.X(off), a.Y(0)], [a.X(off), a.Y(lor(off))]], col.s[0], 2);
    dot(ctx, a.X(off), a.Y(lor(off)), 4.5, col.s[0], col.panel);
    text(ctx, 'RF', a.X(off) + 4, a.Y(0) - 10, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    ctx.restore();
  };
  redo();
}
