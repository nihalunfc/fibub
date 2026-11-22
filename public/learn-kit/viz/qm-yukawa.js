// Why the nuclear force is short ranged. Two nucleons swap a meson of mass m, "borrowed" for a time Δt ≈ ħ/mc², so it can go at
// most R = ħc/mc² (pion: 1.4 fm). The potential is Yukawa's e^(−r/R)/r, not Coulomb's 1/r. Slide the meson mass and the separation:
// the meson reaches across only when d < R, and the graph shows Coulomb (m = 0, photon) falling slowly while the Yukawa tail collapses.
import { canvas, axes, line, text, title, row, slider, readout, loop, dot } from '../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 480, min: 380, label: 'A meson exchanged between two nucleons and the Yukawa potential against Coulomb' });
  let m = 140, d = 1.0, ph = 0;
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Exchanged particle mass', min: 20, max: 1000, value: m, log: true, fmt: (v) => Math.round(v) + ' MeV/c²' + (Math.abs(v - 140) < 12 ? ' (π)' : Math.abs(v - 495) < 40 ? ' (K)' : Math.abs(v - 775) < 40 ? ' (ρ)' : ''), oninput: (v) => { m = v; show(); } });
  slider(ctl, { label: 'Nucleon separation d', min: 0.3, max: 6, step: 0.1, value: d, fmt: (v) => v.toFixed(1) + ' fm', oninput: (v) => { d = v; show(); } });
  const anim = loop(host, (dt) => { ph = (ph + dt * 0.5) % 1; cv.redraw(); });
  anim.button(ctl);
  const range = () => 197.327 / m;
  function show() {
    const R = range(), dt = 6.582e-22 / m;
    out.innerHTML = `Range R = ħc/mc² = <b>${R.toFixed(2)} fm</b>; the meson exists for about Δt = ħ/mc² = ${dt.toExponential(1)} s (here ${(dt * 1e24).toFixed(2)} ys). Yukawa strength at d = ${d.toFixed(1)} fm relative to Coulomb: e^(−d/R) = <b>${Math.exp(-d / R).toExponential(1)}</b>. ${d <= R ? 'The meson can cross: the force is strong.' : 'Too far: the meson cannot arrive in time, the force dies off exponentially.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Exchange of a meson and the Yukawa potential', col);
    const R = range(), top = 34, ph1 = Math.round(h * 0.28), cy = top + ph1 / 2 + 6, xA = w * 0.2, xB = w * 0.8, sc = (xB - xA) / 6;
    const xa = w * 0.5 - (d * sc) / 2, xb = w * 0.5 + (d * sc) / 2;
    dot(ctx, xa, cy, 12, col.s[0]); dot(ctx, xb, cy, 12, col.s[2]); text(ctx, 'p', xa, cy, { color: col.bg, size: 12, weight: 700, align: 'center' }); text(ctx, 'n', xb, cy, { color: col.bg, size: 12, weight: 700, align: 'center' });
    // meson travels A -> B; it can go at most R
    const reach = Math.min(d, R), f = ph < 0.5 ? ph / 0.5 : 0, x = xa + (d <= R ? f * d : f * R) * sc, alive = d <= R ? 1 : 1 - f;
    if (ph < 0.5 && f > 0) { ctx.globalAlpha = Math.max(0.15, alive); dot(ctx, x, cy, 6 + (d <= R ? 0 : 0), col.s[1]); ctx.globalAlpha = 1; }
    else if (d <= R) { ctx.globalAlpha = 0.9; dot(ctx, xb - ((ph - 0.5) / 0.5) * d * sc, cy, 6, col.s[1]); ctx.globalAlpha = 1; }
    line(ctx, [[xa, cy + 26], [xa + R * sc, cy + 26]], col.s[1], 3); text(ctx, `range R = ${R.toFixed(2)} fm`, xa, cy + 40, { color: col.s[1], size: 10.5, weight: 700 });
    text(ctx, d <= R ? 'meson arrives' : 'meson fades before it arrives', w / 2, top + 6, { color: d <= R ? col.good : col.bad, size: 11, weight: 700, align: 'center' });
    const a = axes(ctx, w, h, col, { x: [0.2, 6], y: [1e-4, 5], ylog: true, l: 44, t: top + ph1 + 16, b: 38, xlabel: 'separation r (fm)', ylabel: '|V| (units of Coulomb at 1 fm)', xt: [1, 2, 3, 4, 5, 6], yt: [1e-3, 1e-2, 1e-1, 1], fy: (v) => v });
    const pts = (fn) => Array.from({ length: 120 }, (_, i) => { const r = 0.2 + (i / 119) * 5.8; return [a.X(r), a.Y(Math.max(1.1e-4, fn(r)))]; });
    line(ctx, pts((r) => 1 / r), col.muted, 1.8, [6, 4]); line(ctx, pts((r) => Math.exp(-r / R) / r), col.s[1], 2.6);
    line(ctx, [[a.X(d), a.T], [a.X(d), a.B]], col.ink, 1, [3, 3]);
    text(ctx, 'Coulomb 1/r (photon, range ∞)', a.R - 4, a.T + 8, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'Yukawa e^(−r/R)/r', a.R - 4, a.T + 22, { color: col.s[1], size: 10.5, weight: 700, align: 'right' });
  };
  show();
}
