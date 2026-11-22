// Kirchhoff's loop rule, walked. A two-battery circuit with three resistors. Choose a loop; a walker goes round it and
// the graph below plots the potential as it goes: it rises across a battery and falls across each resistor, and it
// always comes back to where it started (the sum of the changes is zero). Change the batteries and resistors; the
// currents come from solving the two loop equations plus the junction rule i₃ = i₁ + i₂.
import { canvas, axes, line, text, row, slider, choice, readout, loop, dot } from '../kit.js';

export default function (host) {
  let E1 = 9, E2 = 4, R1 = 2, R2 = 3, R3 = 4, which = 'L', s = 0;
  const cv = canvas(host, { aspect: 1.15, max: 420, min: 330, label: 'A two-loop circuit and the potential seen by a walker going round a loop' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Loop', [['L', 'Left loop'], ['R', 'Right loop'], ['O', 'Outer loop']], which, (v) => { which = v; s = 0; upd(); });
  const anim = loop(host, (dt) => { s = (s + dt * 0.12) % 1; cv.redraw(); }); anim.button(ctl);
  [['E₁', 'E1', -12, 12, 'V'], ['E₂', 'E2', -12, 12, 'V'], ['R₁', 'R1', 1, 10, 'Ω'], ['R₂', 'R2', 1, 10, 'Ω'], ['R₃', 'R3', 1, 10, 'Ω']].forEach(([lab, k, lo, hi, u]) => slider(c2, { label: lab, min: lo, max: hi, value: ({ E1, E2, R1, R2, R3 })[k], step: 1, fmt: (v) => v + ' ' + u, oninput: (v) => { ({ E1: () => (E1 = v), E2: () => (E2 = v), R1: () => (R1 = v), R2: () => (R2 = v), R3: () => (R3 = v) })[k](); upd(); } }));
  const out = readout(host);
  const sol = () => { const i3 = (E1 / R1 + E2 / R2) / (1 + R3 / R1 + R3 / R2); return { i1: (E1 - i3 * R3) / R1, i2: (E2 - i3 * R3) / R2, i3 }; };
  // layout
  const g = (w) => ({ xl: 40, xm: w / 2, xr: w - 40, yt: 42, yb: 132 });
  const loops = (w, I) => { const { xl, xm, xr, yt, yb } = g(w);
    // components: [x, y, dv in the walking direction, name]
    const b1 = [xl, 62, E1, 'E₁'], r1 = [xl, 104, -I.i1 * R1, 'R₁'], b2 = [xr, 62, E2, 'E₂'], r2 = [xr, 104, -I.i2 * R2, 'R₂'], r3 = [xm, 87, -I.i3 * R3, 'R₃'];
    const dn = (c) => [c[0], c[1], -c[2], c[3]];
    return {
      L: { pts: [[xl, yb], [xl, yt], [xm, yt], [xm, yb], [xl, yb]], comps: [b1, r1, r3] },
      R: { pts: [[xr, yb], [xr, yt], [xm, yt], [xm, yb], [xr, yb]], comps: [b2, r2, r3] },
      O: { pts: [[xl, yb], [xl, yt], [xr, yt], [xr, yb], [xl, yb]], comps: [b1, r1, [b2[0], b2[1], -E2, 'E₂'], [r2[0], r2[1], I.i2 * R2, 'R₂']] },
    }; };
  const prof = (L) => { const segs = [], tot = []; let len = 0; for (let i = 1; i < L.pts.length; i++) { const d = Math.hypot(L.pts[i][0] - L.pts[i - 1][0], L.pts[i][1] - L.pts[i - 1][1]); segs.push([len, d, L.pts[i - 1], L.pts[i]]); len += d; }
    const at = (f) => { let d = f * len; for (const [s0, dd, a, b] of segs) if (d <= s0 + dd + 1e-6) { const t = (d - s0) / dd; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; } return L.pts[0]; };
    const sc = L.comps.map((c) => { let best = 1e9, bf = 0; for (let k = 0; k <= 400; k++) { const p = at(k / 400), dd = Math.hypot(p[0] - c[0], p[1] - c[1]); if (dd < best) { best = dd; bf = k / 400; } } return [bf, c[2], c[3]]; });
    const V = (f) => sc.reduce((a, [p, dv]) => a + dv * Math.min(1, Math.max(0, (f - (p - 0.025)) / 0.05)), 0);
    return { at, V, sc }; };
  function upd() { const I = sol(), L = loops(cv.w || 300, I)[which], P = prof(L), sum = L.comps.reduce((a, c) => a + c[2], 0);
    out.innerHTML = `Currents: i₁ = <b>${I.i1.toFixed(2)} A</b>, i₂ = <b>${I.i2.toFixed(2)} A</b> (up the outer branches), i₃ = <b>${I.i3.toFixed(2)} A</b> (down the middle) so i₃ = i₁ + i₂ ✓. Going round this loop: ${P.sc.map(([, dv, n]) => `${n} ${dv >= 0 ? '+' : '−'}${Math.abs(dv).toFixed(2)}`).join(', ')}. Sum = <b>${sum.toFixed(2)} V</b>. Negative current means the real direction is opposite to the arrow.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const I = sol(), { xl, xm, xr, yt, yb } = g(w), all = loops(w, I), L = all[which], P = prof(L);
    [[xl, yt, yb], [xm, yt, yb], [xr, yt, yb]].forEach(([x]) => line(ctx, [[x, yt], [x, yb]], col.ink, 1.6)); line(ctx, [[xl, yt], [xr, yt]], col.ink, 1.6); line(ctx, [[xl, yb], [xr, yb]], col.ink, 1.6);
    const bat = (x, y, lab, v) => { ctx.fillStyle = col.panel; ctx.fillRect(x - 12, y - 8, 24, 16); ctx.fillStyle = col.ink; ctx.fillRect(x - 9, y - 5, 18, 2.5); ctx.fillRect(x - 5, y + 3, 10, 4.5); text(ctx, `${lab} ${v}`, x + 15, y, { color: col.s[2], size: 11, weight: 700 }); }, res = (x, y, lab, v) => { ctx.fillStyle = col.panel; ctx.fillRect(x - 6, y - 12, 12, 24); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.strokeRect(x - 6, y - 12, 12, 24); text(ctx, `${lab} ${v}`, x + 11, y, { color: col.ink, size: 11, weight: 700 }); };
    bat(xl, 62, 'E₁', E1 + 'V'); res(xl, 104, 'R₁', R1 + 'Ω'); bat(xr, 62, 'E₂', E2 + 'V'); res(xr, 104, 'R₂', R2 + 'Ω'); res(xm, 87, 'R₃', R3 + 'Ω');
    ctx.globalAlpha = 0.9; line(ctx, L.pts, col.s[5], 3.2); ctx.globalAlpha = 1;
    const wp = P.at(s); dot(ctx, wp[0], wp[1], 6, col.s[5], col.panel);
    text(ctx, 'start', L.pts[0][0], L.pts[0][1] + 13, { color: col.muted, size: 10, align: 'center' });
    const G = axes(ctx, w, h, col, { x: [0, 1], y: [-12, 12], xlabel: 'distance round the loop →', ylabel: 'potential (V)', l: 40, t: 160, b: 34, xt: [0, 0.5, 1], fx: (v) => (v === 0 ? 'start' : v === 1 ? 'back' : ''), yt: [-10, 0, 10], fy: (v) => v });
    const pts = Array.from({ length: 201 }, (_, i) => [G.X(i / 200), G.Y(Math.max(-12, Math.min(12, P.V(i / 200))))]); line(ctx, pts, col.s[0], 2.4);
    dot(ctx, G.X(s), G.Y(Math.max(-12, Math.min(12, P.V(s)))), 5, col.s[5], col.panel);
    P.sc.forEach(([p, , n]) => text(ctx, n, G.X(p), G.B - 10, { color: col.muted, size: 10, align: 'center' }));
  };
  upd();
}
