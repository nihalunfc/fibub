// Class 10 Triangles: the basic proportionality theorem (Thales). In triangle ABC a line DE meets AB at D and AC at E.
// If DE is parallel to BC then AD/DB = AE/EC. Slide D along AB; tilt DE away from parallel and the two ratios stop agreeing.
// The converse also holds: if the ratios are equal, DE is parallel to BC.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let t = 0.4, tilt = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Triangle ABC with a line DE across it whose ratios of divided sides are shown' });
  const ctl = row(host);
  slider(ctl, { label: 'move D along AB', min: 0.2, max: 0.85, step: 0.05, value: t, oninput: (v) => { t = v; go(); } });
  slider(ctl, { label: 'tilt DE (0 = parallel to BC)', min: -0.2, max: 0.2, step: 0.05, value: tilt, fmt: (v) => (Math.abs(v) < 1e-9 ? '0' : v.toFixed(2)), oninput: (v) => { tilt = v; go(); } });
  const out = readout(host);
  const AB = 8, AC = 10, tE = () => Math.min(0.95, Math.max(0.05, t + tilt));
  function go() {
    const r1 = t / (1 - t), r2 = tE() / (1 - tE()), par = Math.abs(tilt) < 1e-9;
    out.innerHTML = `AD/DB = ${(AB * t).toFixed(1)}/${(AB * (1 - t)).toFixed(1)} = <b>${r1.toFixed(2)}</b> &nbsp; AE/EC = ${(AC * tE()).toFixed(1)}/${(AC * (1 - tE())).toFixed(1)} = <b>${r2.toFixed(2)}</b>. ${par ? 'Equal, and DE ∥ BC.' : 'Not equal, so DE is not parallel to BC (the converse).'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'AD/DB = AE/EC when DE ∥ BC', col) + 6;
    const A = [w * 0.5, top + 12], B = [w * 0.08, h - 34], C = [w * 0.92, h - 34];
    const P = (S, T, u) => [S[0] + u * (T[0] - S[0]), S[1] + u * (T[1] - S[1])];
    const D = P(A, B, t), E = P(A, C, tE()), par = Math.abs(tilt) < 1e-9;
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [D, E], par ? col.good : col.bad, 3);
    line(ctx, [A, D], col.s[0], 4); line(ctx, [D, B], col.s[1], 4); line(ctx, [A, E], col.s[0], 4); line(ctx, [E, C], col.s[1], 4);
    for (const [p, n, dx, dy] of [[A, 'A', 0, -12], [B, 'B', -12, 6], [C, 'C', 12, 6], [D, 'D', -14, 0], [E, 'E', 14, 0]]) { dot(ctx, p[0], p[1], 4, col.ink); text(ctx, n, p[0] + dx, p[1] + dy, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const m1 = mid(A, D), m2 = mid(D, B), m3 = mid(A, E), m4 = mid(E, C);
    text(ctx, (AB * t).toFixed(1), m1[0] - 14, m1[1], { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
    text(ctx, (AB * (1 - t)).toFixed(1), m2[0] - 14, m2[1], { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
    text(ctx, (AC * tE()).toFixed(1), m3[0] + 14, m3[1], { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
    text(ctx, (AC * (1 - tE())).toFixed(1), m4[0] + 14, m4[1], { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
    text(ctx, par ? 'DE ∥ BC' : 'DE not parallel to BC', (D[0] + E[0]) / 2, (D[1] + E[1]) / 2 + 16, { color: par ? col.good : col.bad, size: 11.5, weight: 700, align: 'center', halo: col.soft });
  };
  go();
}
