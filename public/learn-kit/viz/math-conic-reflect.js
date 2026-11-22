// The reflection property of conics, as a moving ray. Light leaves one focus, hits the curve and bounces by the law of
// reflection (angle in = angle out, measured against the tangent). In an ellipse every bounce goes through the other
// focus; in a parabola it leaves parallel to the axis (a searchlight, a dish); in a hyperbola it appears to come from
// the other focus. The readout checks the distance rules that define each curve.
import { canvas, axes, row, slider, choice, readout, loop, dot, line, text, arrow } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let kind = 'ell', e = 0.6, s = 1.0;
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 250, label: 'A ray leaving a focus and reflecting off a conic' });
  const c1 = row(host);
  const eBox = document.createElement('div'); eBox.className = 'lk-controls';
  const mkE = () => { eBox.innerHTML = ''; if (kind === 'par') return; slider(eBox, { label: 'eccentricity e', min: kind === 'ell' ? 0.1 : 1.2, max: kind === 'ell' ? 0.9 : 3, step: 0.05, value: e, fmt: (v) => f2(v), oninput: (v) => { e = v; re(); } }); };
  choice(c1, 'Curve', [['ell', 'Ellipse'], ['par', 'Parabola'], ['hyp', 'Hyperbola']], kind, (v) => { kind = v; e = v === 'ell' ? 0.6 : 1.8; mkE(); re(); });
  c1.after(eBox); mkE();
  const c2 = row(host);
  const out = readout(host);
  const anim = loop(host, (dt) => { s += dt * 0.35; if (s > 3.14159 * 2) s -= 3.14159 * 2; re(); });
  anim.button(c2);
  slider(c2, { label: 'hit point', min: 0, max: 6.28, step: 0.02, value: s, fmt: (v) => f2(v), oninput: (v) => { s = v; re(); } });
  const geom = () => {
    if (kind === 'ell') { const a = 3, c = e * a, b = Math.sqrt(a * a - c * c); const t = s; const P = [a * Math.cos(t), b * Math.sin(t)]; return { a, c, F1: [-c, 0], F2: [c, 0], P, T: [-a * Math.sin(t), b * Math.cos(t)], pts: Array.from({ length: 121 }, (_, i) => [a * Math.cos(i * 0.0524), b * Math.sin(i * 0.0524)]) }; }
    if (kind === 'par') { const p = 1.2, t = Math.tan((s - Math.PI) / 2.2) * 0.9; const P = [p * t * t, 2 * p * t]; return { F1: [p, 0], P, T: [2 * p * t, 2 * p], pts: Array.from({ length: 121 }, (_, i) => { const u = (i - 60) / 20; return [p * u * u, 2 * p * u]; }) }; }
    const a = 1.4, c = e * a, b = Math.sqrt(c * c - a * a), u = Math.sin(s) * 1.5; const P = [a * Math.cosh(u), b * Math.sinh(u)];
    return { a, c, F1: [-c, 0], F2: [c, 0], P, T: [a * Math.sinh(u), b * Math.cosh(u)], pts: Array.from({ length: 121 }, (_, i) => { const v = (i - 60) / 30; return [a * Math.cosh(v), b * Math.sinh(v)]; }), pts2: Array.from({ length: 121 }, (_, i) => { const v = (i - 60) / 30; return [-a * Math.cosh(v), b * Math.sinh(v)]; }) };
  };
  const re = () => cv.redraw();
  cv.draw = (ctx, w, h, col) => {
    const g = geom(), A = axes(ctx, w, h, col, { x: [-5, 6], y: [-4, 4], l: 8, b: 8, t: 22, r: 8, grid: false, xt: [], yt: [] });
    const X = (p) => [A.X(p[0]), A.Y(p[1])];
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.line, 1);
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    line(ctx, g.pts.map(X), col.ink, 2.5); if (g.pts2) line(ctx, g.pts2.map(X), col.ink, 2.5);
    const P = g.P, F1 = g.F1, T = g.T, tl = Math.hypot(...T), t = [T[0] / tl, T[1] / tl];
    // incoming direction F1 -> P; law of reflection: r = d - 2(d.n)n with n the unit normal to the tangent
    let d = [P[0] - F1[0], P[1] - F1[1]]; const dl = Math.hypot(...d); d = [d[0] / dl, d[1] / dl];
    const nn = [-t[1], t[0]], dn = d[0] * nn[0] + d[1] * nn[1], rf = [d[0] - 2 * dn * nn[0], d[1] - 2 * dn * nn[1]];
    const R2 = [P[0] + rf[0] * 12, P[1] + rf[1] * 12];
    line(ctx, [[A.X(P[0] - t[0] * 2), A.Y(P[1] - t[1] * 2)], [A.X(P[0] + t[0] * 2), A.Y(P[1] + t[1] * 2)]], col.muted, 1, [4, 4]);
    line(ctx, [X(F1), X(P)], col.s[1], 2.5); line(ctx, [X(P), X(R2)], col.s[2], 2.5);
    if (g.F2) { line(ctx, [X(P), X(g.F2)], col.s[2], 1, [3, 4]); dot(ctx, ...X(g.F2), 4, col.s[0]); }
    dot(ctx, ...X(F1), 4, col.s[0]); dot(ctx, ...X(P), 5, col.s[3], col.ink);
    ctx.restore();
    text(ctx, 'F', ...[X(F1)[0], X(F1)[1] + 12], { color: col.s[0], size: 11, weight: 700, align: 'center' });
    text(ctx, 'dashed = tangent', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
    const d1 = Math.hypot(P[0] - F1[0], P[1] - F1[1]), d2 = g.F2 ? Math.hypot(P[0] - g.F2[0], P[1] - g.F2[1]) : 0;
    out.innerHTML = kind === 'ell' ? `PF₁ + PF₂ = ${f2(d1)} + ${f2(d2)} = <b>${f2(d1 + d2)}</b> = 2a = ${f2(2 * g.a)} for every point. The reflected ray (green) passes through the other focus F₂.` : kind === 'par' ? `Every ray from the focus leaves <b>parallel to the axis</b> (green). PF = ${f2(d1)} equals the distance from P to the directrix x = −p, ${f2(P[0] + 1.2)}.` : `|PF₁ − PF₂| = |${f2(d1)} − ${f2(d2)}| = <b>${f2(Math.abs(d1 - d2))}</b> = 2a = ${f2(2 * g.a)}. The reflected ray looks as if it came straight from F₂ (dotted).`;
  };
  re();
}
