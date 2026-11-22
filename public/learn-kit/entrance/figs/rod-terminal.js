// Electromagnetic induction: a rod of mass 0.1 kg slides on smooth rails 0.5 m apart, joined by a resistor R, in a
// field B into the screen, pulled by a constant force F. Motional emf Blv drives a current; the field pushes back
// with B²l²v/R (Lenz). Speed rises to the terminal value v_t = FR/(B²l²) with time constant τ = mR/(B²l²).
import { canvas, axes, line, row, slider, readout, text, arrow, loop, button, fmt } from '../../kit.js';

const m = 0.1, l = 0.5;
export default function (host) {
  let F = 0.5, B = 1, R = 2, t = 0, x = 0;
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'A rod pulled along rails in a magnetic field reaches a terminal speed' });
  const ctl = row(host);
  const reset = () => { t = 0; x = 0; cv.redraw(); };
  slider(ctl, { label: 'Force F', min: 0.1, max: 2, step: 0.1, value: F, fmt: (v) => `${v} N`, oninput: (v) => { F = v; reset(); } });
  slider(ctl, { label: 'Field B', min: 0.2, max: 2, step: 0.1, value: B, fmt: (v) => `${v} T`, oninput: (v) => { B = v; reset(); } });
  slider(ctl, { label: 'Resistance R', min: 0.5, max: 5, step: 0.5, value: R, fmt: (v) => `${v} Ω`, oninput: (v) => { R = v; reset(); } });
  const k = () => (B * B * l * l) / R, vt = () => F / k(), tau = () => m / k(), v = (s) => vt() * (1 - Math.exp(-s / tau()));
  const anim = loop(host, (dt) => { t += dt; x += v(t) * dt; if (t > 6 * tau() + 1) { t = 0; x = 0; } cv.redraw(); });
  anim.button(ctl); button(ctl, 'Restart', reset);
  const out = readout(host);
  const show = () => {
    const vv = v(t), e = B * l * vv, I = e / R;
    out.innerHTML = `v = ${fmt(vv, 3)} m/s · emf Blv = ${fmt(e, 3)} V · I = ${fmt(I, 3)} A · opposing force BIl = ${fmt(B * I * l, 3)} N · terminal speed FR/(B²l²) = <b>${fmt(vt(), 3)} m/s</b>, τ = ${fmt(tau(), 3)} s. At the terminal speed F·v = I²R: all the work becomes heat.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = 26, rh = h * 0.36, y1 = top + 10, y2 = top + rh;
    for (let xx = 20; xx < w; xx += 26) for (let yy = y1 + 12; yy < y2; yy += 22) text(ctx, '×', xx, yy, { color: col.line, size: 11, align: 'center' });
    line(ctx, [[30, y1], [w - 10, y1]], col.ink, 2.5); line(ctx, [[30, y2], [w - 10, y2]], col.ink, 2.5);
    // resistor zigzag on the left
    const zz = []; for (let i = 0; i <= 8; i++) zz.push([30 + (i % 2 ? 6 : -6) * (i > 0 && i < 8 ? 1 : 0), y1 + ((y2 - y1) * i) / 8]);
    line(ctx, zz, col.s[2], 2); text(ctx, 'R', 44, (y1 + y2) / 2, { color: col.s[2], size: 12, weight: 600 });
    const span = w - 110, px = 70 + ((x * 40) % span);
    line(ctx, [[px, y1 - 4], [px, y2 + 4]], col.s[0], 5);
    arrow(ctx, px + 4, (y1 + y2) / 2, px + 40, (y1 + y2) / 2, col.s[3], 2); text(ctx, 'F', px + 44, (y1 + y2) / 2, { color: col.s[3], size: 12, weight: 600 });
    const I = (B * l * v(t)) / R;
    if (I > 1e-3) { arrow(ctx, px - 4, (y1 + y2) / 2 + 14, px - 4 - Math.min(40, 30 * (I / (F / (B * l)))), (y1 + y2) / 2 + 14, col.s[1], 2); text(ctx, 'BIl', px - 30, (y1 + y2) / 2 + 28, { color: col.s[1], size: 11 }); }
    // v-t graph
    ctx.save(); ctx.translate(0, y2 + 8);
    const T = 6 * tau();
    const { X, Y } = axes(ctx, w, h - y2 - 8, col, { x: [0, T], y: [0, vt() * 1.25], xlabel: 't (s)', ylabel: 'v (m/s)', t: 10 });
    line(ctx, [[X(0), Y(vt())], [X(T), Y(vt())]], col.muted, 1, [4, 4]);
    text(ctx, 'terminal speed', X(T) - 4, Y(vt()) - 9, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    const pts = []; for (let s = 0; s <= Math.min(t, T); s += T / 150) pts.push([X(s), Y(v(s))]);
    line(ctx, pts, col.s[0], 2.5);
    ctx.restore();
    show();
  };
  cv.redraw();
}
