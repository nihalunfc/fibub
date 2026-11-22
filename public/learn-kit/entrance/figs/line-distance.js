// Straight lines: a line set by its angle of inclination and y-intercept, and a point P. The figure draws the
// perpendicular from P to the line, its foot and the image of P, and the readout gives the line in several forms
// and the perpendicular distance |ax₁ + by₁ + c|/√(a² + b²).
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let ang = 135, c = 2, px = 3, py = 3;
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 280, label: 'A straight line, a point, the perpendicular from the point to the line, its foot and the image of the point' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'inclination θ', min: 0, max: 175, step: 5, value: ang, fmt: (v) => v + '°', oninput: (v) => { ang = v; re(); } });
  slider(ctl, { label: 'y-intercept c', min: -5, max: 5, step: 0.5, value: c, fmt: (v) => fmt(v, 2), oninput: (v) => { c = v; re(); } });
  slider(ctl, { label: 'P: x₁', min: -5, max: 5, step: 0.5, value: px, fmt: (v) => fmt(v, 2), oninput: (v) => { px = v; re(); } });
  slider(ctl, { label: 'P: y₁', min: -5, max: 5, step: 0.5, value: py, fmt: (v) => fmt(v, 2), oninput: (v) => { py = v; re(); } });
  const out = readout(host);
  // line as a x + b y + k = 0 with (a, b) a unit normal
  const geo = () => {
    const t = (ang * Math.PI) / 180, a = -Math.sin(t), b = Math.cos(t), k = -b * c; // passes through (0, c)
    const s = a * px + b * py + k;
    return { t, a, b, k, s, fx: px - a * s, fy: py - b * s, ix: px - 2 * a * s, iy: py - 2 * b * s };
  };
  const show = () => {
    const { t, s, fx, fy, ix, iy } = geo();
    const vert = Math.abs(Math.cos(t)) < 1e-9, m = Math.tan(t);
    const form = vert ? 'vertical line' : `y = ${fmt(m, 3)}x ${c < 0 ? '−' : '+'} ${fmt(Math.abs(c), 3)} (slope m = tan θ = ${fmt(m, 3)})`;
    const xint = Math.abs(m) < 1e-9 ? 'none (parallel to the x-axis)' : fmt(-c / m, 3);
    out.innerHTML = `Line: ${form}; x-intercept ${xint}, y-intercept ${fmt(c, 3)}. Distance from P(${fmt(px, 2)}, ${fmt(py, 2)}) = <b>${fmt(Math.abs(s), 4)}</b>. Foot of the perpendicular (${fmt(fx, 3)}, ${fmt(fy, 3)}); image of P (${fmt(ix, 3)}, ${fmt(iy, 3)}). ${vert ? '' : `P is ${Math.abs(py - m * px - c) < 1e-9 ? 'on the line' : py - m * px - c > 0 ? 'above the line' : 'below the line'}: y₁ − mx₁ − c = ${fmt(py - m * px - c, 3)}, and its sign tells the side.`}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const Ly = 6, Lx = (Ly * (w - 48)) / (h - 50);
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [-Lx, Lx], y: [-Ly, Ly], l: 34, r: 14, t: 22, b: 28 });
    ctx.save(); clip();
    line(ctx, [[X(-Lx), Y(0)], [X(Lx), Y(0)]], col.muted, 1.2);
    line(ctx, [[X(0), Y(-Ly)], [X(0), Y(Ly)]], col.muted, 1.2);
    const { t, fx, fy, ix, iy } = geo(), dx = Math.cos(t), dy = Math.sin(t);
    line(ctx, [[X(-20 * dx), Y(c - 20 * dy)], [X(20 * dx), Y(c + 20 * dy)]], col.s[0], 2.5);
    line(ctx, [[X(px), Y(py)], [X(ix), Y(iy)]], col.s[1], 1.5, [5, 4]);
    line(ctx, [[X(px), Y(py)], [X(fx), Y(fy)]], col.s[1], 2.5);
    // right-angle mark at the foot
    const ux = px - fx, uy = py - fy, ul = Math.hypot(ux, uy);
    if (ul > 0.3) { const e = 0.3, ax = (ux / ul) * e, ay = (uy / ul) * e, bx = dx * e, by = dy * e; line(ctx, [[X(fx + ax), Y(fy + ay)], [X(fx + ax + bx), Y(fy + ay + by)], [X(fx + bx), Y(fy + by)]], col.ink, 1); }
    dot(ctx, X(px), Y(py), 5, col.ink); text(ctx, 'P', X(px) + 8, Y(py) - 9, { color: col.ink, weight: 700, halo: col.panel });
    dot(ctx, X(fx), Y(fy), 4, col.s[1]); text(ctx, 'foot', X(fx) + 8, Y(fy) + 10, { color: col.s[1], size: 11, halo: col.panel });
    dot(ctx, X(ix), Y(iy), 4, col.s[2]); text(ctx, 'image', X(ix) + 8, Y(iy) + 10, { color: col.s[2], size: 11, halo: col.panel });
    ctx.restore();
  };
  re();
}
