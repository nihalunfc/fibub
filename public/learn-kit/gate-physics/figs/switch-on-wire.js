// 3.5 Retarded potentials: a current I0 switched on at t = 0 in an infinite straight wire. At time t only the
// segments within ct of the field point have been heard from, so A_z = (mu0 I0/2 pi) ln[(ct + sqrt(c^2t^2 - s^2))/s]
// for s < ct and 0 beyond. Plotted against s: B = (mu0 I0/2 pi s) ct/sqrt(c^2t^2 - s^2) and |E| = (mu0 I0 c/2 pi)
// / sqrt(c^2t^2 - s^2), with the steady B = mu0 I0/2 pi s dashed. A slider (or Play) moves t; the front sits at s = ct.
// Units: s in metres, ct in metres, B in units of mu0 I0/(2 pi * 1 m), E in units of mu0 I0 c/(2 pi * 1 m).
import { canvas, axes, line, text, row, slider, button, readout, fmt, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 260, label: 'Magnetic and electric fields of a wire after its current is switched on, against distance' });
  let ct = 2;
  const ctl = row(host);
  const sl = slider(ctl, { label: 'ct', min: 0.2, max: 5, step: 0.02, value: ct, fmt: (v) => fmt(v, 3) + ' m', oninput: (v) => { ct = v; cv.redraw(); say(); } });
  const lp = loop(host, (dt) => { ct += dt * 0.6; if (ct > 5) ct = 0.2; sl.set(ct); cv.redraw(); say(); }, { autoplay: false });
  lp.button(ctl);
  const out = readout(host);
  const say = () => {
    const s = 1;
    out.innerHTML = ct <= s ? `At s = 1 m nothing has arrived yet (the front is at s = ct = ${fmt(ct, 3)} m): A = 0, B = 0, E = 0.` : `At s = 1 m: B is <b>${fmt(ct / Math.sqrt(ct * ct - 1), 4)}</b> × its steady value and |E| = <b>${fmt(1 / Math.sqrt(ct * ct - 1), 3)}</b> μ₀I₀c/2π per metre, pointing against the current. Both settle (B → steady, E → 0) as ct grows.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const g = axes(ctx, w, h, col, { x: [0, 5], y: [0, 3], xlabel: 's, distance from the wire (m)', ylabel: 'field' });
    ctx.save(); g.clip();
    const st = [], B = [], Ef = [];
    for (let s = 0.05; s <= 5; s += 0.01) {
      st.push([g.X(s), g.Y(Math.min(3.2, 1 / s))]);
      if (s < ct - 1e-3) { const q = Math.sqrt(ct * ct - s * s); B.push([g.X(s), g.Y(Math.min(3.2, ct / (s * q)))]); Ef.push([g.X(s), g.Y(Math.min(3.2, 1 / q))]); }
    }
    line(ctx, st, col.muted, 1.5, [5, 4]);
    if (B.length) { line(ctx, B, col.s[0], 2.5); line(ctx, Ef, col.s[3], 2.5); }
    line(ctx, [[g.X(ct), g.T], [g.X(ct), g.B]], col.s[2], 1.5, [2, 3]);
    ctx.restore();
    text(ctx, 'B (units μ₀I₀/2π·m)', g.L + 8, g.T + 10, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, '|E| (units μ₀I₀c/2π·m)', g.L + 8, g.T + 26, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, 'steady B', g.L + 8, g.T + 42, { color: col.muted, size: 11, weight: 700 });
    if (ct < 4.6) text(ctx, 'front s = ct', g.X(ct) + 4, g.B - 12, { color: col.s[2], size: 11, weight: 700 });
  };
  cv.redraw(); say();
}
