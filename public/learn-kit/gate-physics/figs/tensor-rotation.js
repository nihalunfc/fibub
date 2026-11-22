// 1.9 Rotating a symmetric 2D tensor. The sliders set T11, T22, T12 in the xy frame and the angle theta of a new
// frame x'y'. The curve is the image of the unit circle under T (an ellipse when T is positive definite); the grey
// lines are the principal axes. The readout lists T' = R T R^T with R = [[cos, sin], [-sin, cos]], and the invariants
// (trace and determinant) that do not change, so you can watch components move while the invariants stay fixed.
import { canvas, line, arrow, text, row, slider, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A symmetric tensor drawn as the image of the unit circle, with a rotated frame and its components' });
  let a = 3, d = 1, b = 1, th = 20;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  const comps = () => {
    const t = (th * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    return { p11: c * c * a + 2 * s * c * b + s * s * d, p22: s * s * a - 2 * s * c * b + c * c * d, p12: (d - a) * s * c + b * (c * c - s * s) };
  };
  const principal = () => { const m = (a + d) / 2, r = Math.hypot((a - d) / 2, b); return { l1: m + r, l2: m - r, ang: (0.5 * Math.atan2(2 * b, a - d) * 180) / Math.PI }; };
  const upd = () => {
    const C = comps(), Pp = principal();
    out.innerHTML = `In the x′y′ frame (θ = ${fmt(th, 3)}°): T′₁₁ = <b>${fmt(C.p11, 3)}</b>, T′₂₂ = <b>${fmt(C.p22, 3)}</b>, T′₁₂ = <b>${fmt(Math.abs(C.p12) < 5e-4 ? 0 : C.p12, 3)}</b>. ` +
      `Invariants: trace ${fmt(C.p11 + C.p22, 4)} (= ${fmt(a + d, 4)}), determinant ${fmt(C.p11 * C.p22 - C.p12 * C.p12, 4)} (= ${fmt(a * d - b * b, 4)}). ` +
      `Principal values ${fmt(Pp.l1, 3)} and ${fmt(Pp.l2, 3)}, reached at θ = ${fmt(Pp.ang, 3)}°, where T′₁₂ = 0.`;
  };
  const S = (lab, v, set) => slider(ctl, { label: lab, min: -4, max: 4, step: 0.1, value: v, fmt: (x) => fmt(x, 2), oninput: (x) => { set(x); cv.redraw(); upd(); } });
  S('T₁₁', a, (x) => (a = x)); S('T₂₂', d, (x) => (d = x)); S('T₁₂', b, (x) => (b = x));
  slider(ctl2, { label: 'Frame angle θ', min: -90, max: 90, step: 1, value: th, fmt: (x) => `${Math.round(x)}°`, oninput: (x) => { th = x; cv.redraw(); upd(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The tensor acting on unit vectors, and a rotated frame', col);
    const cx = w / 2, cy = h / 2 + 10, Pp = principal(), sc = Math.min(w, h - 40) / 2 / Math.max(1.2, Math.abs(Pp.l1), Math.abs(Pp.l2)) * 0.85;
    const X = (x) => cx + x * sc, Y = (y) => cy - y * sc;
    // axes of the original frame
    line(ctx, [[X(-10), Y(0)], [X(10), Y(0)]], col.line, 1); line(ctx, [[X(0), Y(-10)], [X(0), Y(10)]], col.line, 1);
    // unit circle and its image under T
    const circ = [], img = [];
    for (let i = 0; i <= 240; i++) { const f = (2 * Math.PI * i) / 240, ux = Math.cos(f), uy = Math.sin(f); circ.push([X(ux), Y(uy)]); img.push([X(a * ux + b * uy), Y(b * ux + d * uy)]); }
    line(ctx, circ, col.muted, 1, [4, 4]); line(ctx, img, col.s[0], 2.6);
    // principal axes
    const pa = (Pp.ang * Math.PI) / 180;
    for (const q of [pa, pa + Math.PI / 2]) line(ctx, [[X(-9 * Math.cos(q)), Y(-9 * Math.sin(q))], [X(9 * Math.cos(q)), Y(9 * Math.sin(q))]], col.muted, 1.2, [2, 4]);
    // rotated frame and T applied to its first axis
    const t = (th * Math.PI) / 180, e1 = [Math.cos(t), Math.sin(t)], e2 = [-Math.sin(t), Math.cos(t)];
    arrow(ctx, X(0), Y(0), X(e1[0]), Y(e1[1]), col.s[1], 2.5); arrow(ctx, X(0), Y(0), X(e2[0]), Y(e2[1]), col.s[1], 2.5);
    text(ctx, "x′", X(e1[0] * 1.12), Y(e1[1] * 1.12), { color: col.s[1], weight: 700, align: 'center', halo: col.panel });
    text(ctx, "y′", X(e2[0] * 1.12), Y(e2[1] * 1.12), { color: col.s[1], weight: 700, align: 'center', halo: col.panel });
    const Te = [a * e1[0] + b * e1[1], b * e1[0] + d * e1[1]];
    arrow(ctx, X(0), Y(0), X(Te[0]), Y(Te[1]), col.s[2], 2.5);
    text(ctx, "T·x′", X(Te[0]) + 6, Y(Te[1]) - 8, { color: col.s[2], weight: 700, halo: col.panel });
    text(ctx, "T′₁₁ = projection of T·x′ on x′, T′₂₁ = on y′", 10, h - 12, { color: col.muted, size: 11 });
  };
  cv.redraw(); upd();
}
