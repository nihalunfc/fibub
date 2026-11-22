// A shell explodes in mid-air. The pieces fly apart in different ways, but the centre of mass (red) carries on along
// the very same parabola, because the explosion is all internal force. Slide the explosion time, the mass split and
// the kick; try a kick that sends one piece straight down so it lands first, yet the red path never bends.
import { canvas, text, row, slider, readout, loop, button, line } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 230, label: 'A projectile that explodes in mid-air, with its centre of mass tracked' });
  const c1 = row(host), c2 = row(host);
  const sf = slider(c1, { label: 'Explodes at', min: 0.2, max: 0.9, step: 0.05, value: 0.5, fmt: (v) => Math.round(v * 100) + '% of flight', oninput: re });
  const sq = slider(c1, { label: 'Mass of piece 1', min: 0.2, max: 0.8, step: 0.05, value: 0.5, fmt: (v) => Math.round(v * 100) + '%', oninput: re });
  const sk = slider(c2, { label: 'Kick speed', min: 0, max: 20, step: 1, value: 10, fmt: (v) => v + ' m/s', oninput: re });
  const sd = slider(c2, { label: 'Kick direction', min: -90, max: 90, step: 5, value: 0, fmt: (v) => v + '° from horizontal', oninput: re });
  const anim = loop(host, (dt) => { t += dt * 0.8; if (t > Tend + 0.6) t = 0; cv.redraw(); });
  anim.button(c2);
  const out = readout(host);
  const vx = 12, vy = 18, Tf = (2 * vy) / G; let Tend = Tf;
  function re() { t = 0; cv.redraw(); show(); }
  const geom = () => {
    const te = sf.value * Tf, f = sq.value, k = sk.value, d = (sd.value * Math.PI) / 180, kx = k * Math.cos(d), ky = k * Math.sin(d);
    const x0 = vx * te, y0 = vy * te - 0.5 * G * te * te, ux = vx, uy = vy - G * te;
    return { te, f, x0, y0, ux, uy, A: [ux + (1 - f) * kx, uy + (1 - f) * ky], B: [ux - f * kx, uy - f * ky] };
  };
  const land = (x0, y0, v) => { const a = -0.5 * G, b = v[1], c = y0, D = Math.sqrt(b * b - 4 * a * c); return (-b - D) / (2 * a); };
  function show() {
    const g = geom(), tA = land(g.x0, g.y0, g.A), tB = land(g.x0, g.y0, g.B);
    Tend = g.te + Math.max(tA, tB);
    const xA = g.x0 + g.A[0] * tA, xB = g.x0 + g.B[0] * tB, xc = (g.f * xA + (1 - g.f) * xB);
    out.innerHTML = `Before the blast the speed is (${vx}, ${g.uy.toFixed(1)}) m/s. Momentum is conserved in the blast: m1v1 + m2v2 = (m1 + m2)v. Piece 1 lands at ${xA.toFixed(0)} m after ${(g.te + tA).toFixed(1)} s, piece 2 at ${xB.toFixed(0)} m after ${(g.te + tB).toFixed(1)} s (unbroken shell: ${(vx * Tf).toFixed(1)} m). While both are in the air the red diamond stays on the dashed parabola. ${Math.abs(tA - tB) < 0.02 ? 'Both land together, so the mass-weighted average of the landing points is ' + xc.toFixed(1) + ' m, the unbroken landing point.' : 'They land at different times, so after the first lands the centre of mass leaves the parabola, because the ground then pushes.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    const g = geom(), tA = land(g.x0, g.y0, g.A), tB = land(g.x0, g.y0, g.B), W = vx * Tf * 1.5, X = (x) => 14 + (x / W) * (w - 28), Y = (y) => h - 22 - (y / 22) * (h - 50);
    line(ctx, [[0, Y(0)], [w, Y(0)]], col.muted, 2);
    const para = []; for (let i = 0; i <= 60; i++) { const tm = (Tf * 1.2 * i) / 60; para.push([X(vx * tm), Y(vy * tm - 0.5 * G * tm * tm)]); }
    ctx.save(); ctx.setLineDash([5, 4]); line(ctx, para.filter((p, i) => Y(0) >= p[1] - 0.1), col.red || col.bad, 1.5); ctx.restore();
    const pos = (v, tm, tl) => { const s = Math.min(tm - g.te, tl); return [g.x0 + v[0] * s, g.y0 + v[1] * s - 0.5 * G * s * s]; };
    if (t < g.te) { const q = [vx * t, vy * t - 0.5 * G * t * t]; line(ctx, para.slice(0, Math.ceil((t / (Tf * 1.2)) * 60)), col.ink, 2.5); ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), 8, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); }
    else {
      const A = pos(g.A, t, tA), B = pos(g.B, t, tB), C = [g.f * A[0] + (1 - g.f) * B[0], g.f * A[1] + (1 - g.f) * B[1]];
      [[A, col.s[0], g.f, g.A, tA], [B, col.s[1], 1 - g.f, g.B, tB]].forEach(([p, c, f, v, tl]) => {
        const tr = []; for (let i = 0; i <= 30; i++) { const q = pos(v, g.te + (Math.min(t - g.te, tl) * i) / 30, tl); tr.push([X(q[0]), Y(q[1])]); } line(ctx, tr, c, 2);
        ctx.beginPath(); ctx.arc(X(p[0]), Y(Math.max(0, p[1])), 5 + 8 * f, 0, 7); ctx.fillStyle = c; ctx.fill();
      });
      ctx.save(); ctx.translate(X(C[0]), Y(C[1])); ctx.rotate(Math.PI / 4); ctx.fillStyle = col.bad; ctx.fillRect(-5, -5, 10, 10); ctx.restore();
    }
    text(ctx, 'red diamond = centre of mass; dashed = path without explosion', 8, 14, { color: col.muted, size: 11 });
  };
  show();
}
