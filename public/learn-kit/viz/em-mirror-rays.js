// Ray diagrams for a concave or convex mirror, drawn from the mirror formula. Slide the object along the axis (and change
// the focal length). Three rays are drawn: parallel to the axis (reflects through F), through F (reflects parallel), and
// aimed at the centre C (comes straight back). Solid lines are real rays; dashed lines are extensions behind the mirror
// that make a virtual image. The readout gives v, magnification and the nature of the image. Heights are stretched.
import { canvas, text, row, slider, choice, readout, line, arrow } from '../kit.js';

export default function (host) {
  let conc = true, d = 30, f = 12;
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 230, label: 'Ray diagram for a spherical mirror with a movable object' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Mirror', [[true, 'Concave'], [false, 'Convex']], conc, (v) => { conc = v; upd(); });
  slider(c2, { label: 'Object distance u', min: 4, max: 48, value: d, step: 0.5, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { d = x; upd(); } });
  slider(c2, { label: 'Focal length |f|', min: 5, max: 20, value: f, step: 0.5, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { f = x; upd(); } });
  const out = readout(host);
  const fs = () => (conc ? -f : f); // new Cartesian sign convention, mirror at x = 0, light travelling toward −x after reflecting... object at x = −d
  const img = () => { const F = fs(), v = 1 / (1 / F + 1 / d); return { v, m: -v / -d * -1 }; };
  function upd() { const F = fs(), v = 1 / (1 / F + 1 / d), m = -v / (-d) * 1; // m = −v/u with u = −d ⇒ v/d… written out below
    const mm = -v / (-d) ; const real = v < 0, h2 = mm; 
    out.innerHTML = `1/v + 1/u = 1/f with u = −${d.toFixed(1)}, f = ${F > 0 ? '+' : '−'}${f}: v = <b>${v.toFixed(1)} cm</b> (${real ? 'in front of the mirror, REAL' : 'behind the mirror, VIRTUAL'}). Magnification m = −v/u = <b>${mm.toFixed(2)}</b>: ${Math.abs(mm) > 1 ? 'magnified' : 'diminished'}, ${mm > 0 ? 'upright' : 'inverted'}. ${!conc ? 'A convex mirror always gives a virtual, upright, smaller image.' : d < f ? 'Inside F a concave mirror gives a magnified, virtual, upright image (a shaving mirror).' : Math.abs(d - f) < 0.6 ? 'Object at F: reflected rays are parallel, image at infinity.' : ''}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const F = fs(), v = 1 / (1 / F + 1 / d), xmin = -54, xmax = 26, X = (x) => 8 + (x - xmin) / (xmax - xmin) * (w - 16), cy = h / 2, ys = 2.4 * (w - 16) / (xmax - xmin), Y = (y) => cy - y * ys, ho = 4, hi = (-v / -d) * ho * -1 * -1;
    line(ctx, [[0, cy], [w, cy]], col.muted, 1);
    const Rr = 2 * Math.abs(F); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); for (let yy = -9; yy <= 9; yy += 0.5) { const xx = (conc ? -1 : 1) * (Rr - Math.sqrt(Rr * Rr - yy * yy)); const px = X(xx), py = Y(yy); yy === -9 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.stroke();
    for (let yy = -9; yy <= 9; yy += 1.5) line(ctx, [[X(0.3), Y(yy)], [X(2.2), Y(yy + 1.1)]], col.muted, 1);
    [[F, 'F'], [2 * F, 'C']].forEach(([x, l]) => { line(ctx, [[X(x), cy - 4], [X(x), cy + 4]], col.ink, 1.5); text(ctx, l, X(x), cy + 14, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    arrow(ctx, X(-d), cy, X(-d), Y(ho), col.s[0], 3, 8); text(ctx, 'object', X(-d), cy + 14, { color: col.s[0], size: 10.5, align: 'center' });
    const T = [-d, ho], mir = (xx) => 0; // ray ends on the plane x = 0 (drawn straight; the mirror is shallow)
    // ray 1: parallel → through F
    const P1 = [0, ho], dir1 = F < 0 ? [F - 0, 0 - ho] : [0 - F, ho - 0]; const L1 = Math.hypot(...dir1), u1 = dir1.map((q) => q / L1);
    const ext = (P, u, s) => [P[0] + u[0] * s, P[1] + u[1] * s], toX = (P, u, xe) => ext(P, u, (xe - P[0]) / u[0]);
    const ray = (P, u, c) => { line(ctx, [[X(T[0]), Y(T[1])], [X(P[0]), Y(P[1])]], c, 1.5); const E = toX(P, u, xmin); line(ctx, [[X(P[0]), Y(P[1])], [X(E[0]), Y(E[1])]], c, 1.8); const Bk = toX(P, u, xmax); line(ctx, [[X(P[0]), Y(P[1])], [X(Bk[0]), Y(Bk[1])]], c, 1.2, [4, 3]); };
    ray(P1, u1, col.s[5]);
    // ray 2: aimed at/through F → reflects parallel
    const y2 = T[1] * F / (F + d), P2 = [0, y2]; ray(P2, [-1, 0], col.s[2]);
    // ray 3: aimed at C → retraces
    const y3 = T[1] * 2 * F / (2 * F + d), P3 = [0, y3], u3 = (() => { const q = [T[0] - 0, T[1] - y3], L = Math.hypot(...q); return q.map((z) => z / L); })(); ray(P3, u3, col.s[1]);
    const xi = v, hi2 = -v / -d * ho * -1 * 1;
    const m = -v / (-d), hI = m * ho, real = v < 0; ctx.save(); if (!real) ctx.setLineDash([4, 3]); arrow(ctx, X(xi), cy, X(xi), Y(hI), col.s[3], 3, 8); ctx.restore(); text(ctx, real ? 'real image' : 'virtual image', X(xi), Y(hI) + (hI >= 0 ? -10 : 14), { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    text(ctx, `${conc ? 'Concave' : 'Convex'} mirror: f = ${F > 0 ? '+' : '−'}${f} cm`, 10, 16, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
