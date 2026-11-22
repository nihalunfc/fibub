// Circular motion with a tilt. Banked road: set the bank angle, speed and friction; the figure shows N, mg and the
// friction needed, and whether the car holds, slides up or slides down. Conical pendulum: spin the bob faster and
// the string lifts. Try the ideal speed v = √(rg tan θ) on the road: friction needed is zero.
import { canvas, text, row, choice, slider, readout, loop, arrow, line } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let mode = 'bank', phi = 0;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 280, label: 'A car on a banked road, or a conical pendulum' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Show', [['bank', 'Banked road (r = 50 m)'], ['cone', 'Conical pendulum (L = 1 m)']], mode, (v) => { mode = v; build(); });
  const out = readout(host);
  let s1, s2, s3;
  function build() {
    c2.innerHTML = '';
    if (mode === 'bank') {
      s1 = slider(c2, { label: 'Bank angle', min: 0, max: 40, step: 1, value: 15, fmt: (v) => v + '°', oninput: upd });
      s2 = slider(c2, { label: 'Speed', min: 5, max: 40, step: 1, value: 18, fmt: (v) => v + ' m/s', oninput: upd });
      s3 = slider(c2, { label: 'μ (friction)', min: 0, max: 0.8, step: 0.05, value: 0.3, fmt: (v) => v.toFixed(2), oninput: upd });
    } else s1 = slider(c2, { label: 'Spin ω', min: 2, max: 10, step: 0.1, value: 5, fmt: (v) => v.toFixed(1) + ' rad/s', oninput: upd });
    upd();
  }
  const bank = () => { const th = (s1.value * Math.PI) / 180, v = s2.value, r = 50, m = 1, f = m * ((v * v) / r * Math.cos(th) - G * Math.sin(th)), N = m * (G * Math.cos(th) + (v * v) / r * Math.sin(th)); return { th, v, r, f, N, mu: s3.value }; };
  const cone = () => { const w = s1.value, L = 1, c = Math.min(1, G / (w * w * L)), th = Math.acos(c); return { w, L, th, T: w * w * L, R: L * Math.sin(th) }; };
  function upd() {
    if (mode === 'bank') {
      const b = bank(), t = Math.tan(b.th), vi = Math.sqrt(b.r * G * t), hi = Math.sqrt(b.r * G * (t + b.mu) / (1 - b.mu * t)), lo = Math.sqrt(Math.max(0, b.r * G * (t - b.mu) / (1 + b.mu * t)));
      const st = Math.abs(b.f) <= b.mu * b.N + 1e-9 ? 'holds the road' : b.f > 0 ? 'slides UP and out' : 'slides DOWN and in';
      out.innerHTML = `Ideal speed (no friction) ${vi.toFixed(1)} m/s. Safe range with μ = ${b.mu.toFixed(2)}: ${lo.toFixed(1)} to ${isFinite(hi) && hi > 0 ? hi.toFixed(1) : 'any'} m/s. At ${b.v} m/s friction needed = ${Math.abs(b.f).toFixed(2)} per kg (${b.f >= 0 ? 'down' : 'up'} the slope), most available ${(b.mu * b.N).toFixed(2)}: the car <b>${st}</b>.`;
    } else {
      const c = cone();
      out.innerHTML = c.w * c.w <= G ? 'Too slow: the bob just hangs (needs ω > √(g/L) = 3.13 rad/s).' : `cos θ = g ⁄ (ω²L) so θ = <b>${((c.th * 180) / Math.PI).toFixed(1)}°</b>, circle radius ${c.R.toFixed(2)} m, tension T = mω²L = ${c.T.toFixed(1)} N per kg. T cos θ = mg balances weight; T sin θ = mω²R supplies the pull to the centre.`;
    }
    cv.redraw();
  }
  loop(host, (dt) => { if (mode === 'cone') { phi += dt * cone().w * 0.6; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'bank') {
      const b = bank(), cx = w * 0.5, cy = h * 0.62, L = Math.min(w, h) * 0.6, k = 0.28;
      const u = [Math.cos(b.th), Math.sin(b.th)], n = [-Math.sin(b.th), Math.cos(b.th)];
      const S = (x, y) => [cx + x, cy - y];
      line(ctx, [S(-L * 0.55 * u[0], -L * 0.55 * u[1]), S(L * 0.55 * u[0], L * 0.55 * u[1])], col.ink, 4);
      ctx.save(); ctx.translate(cx, cy - 10); ctx.rotate(-b.th); ctx.fillStyle = col.s[1]; ctx.fillRect(-22, -18, 44, 18); ctx.fillStyle = col.ink; [-14, 14].forEach((x) => { ctx.beginPath(); ctx.arc(x, 0, 5, 0, 7); ctx.fill(); }); ctx.restore();
      const o = S(0, 14 + 0);
      const A = (v, c, lab, dx = 0, dy = 0) => { arrow(ctx, o[0], o[1], o[0] + v[0] * 1, o[1] - v[1] * 1, c, 3); text(ctx, lab, o[0] + v[0] + dx, o[1] - v[1] + dy, { color: c, size: 12, weight: 700 }); };
      const sN = b.N * 4, sf = b.f * 4, sg = G * 4;
      A([n[0] * sN, n[1] * sN], col.bad, 'N', -14, -4);
      A([0, -sg], col.s[2], 'mg', 6, 6);
      if (Math.abs(b.f) > 0.02) A([-u[0] * sf, -u[1] * sf], col.s[1], 'f', 6, 0);
      arrow(ctx, 14, h - 20, 14 + 60, h - 20, col.muted, 2); text(ctx, 'towards the centre of the bend', 80, h - 20, { color: col.muted, size: 10 });
      text(ctx, 'Cross-section of the road (centre of the circle is on the left)', 8, 14, { color: col.muted, size: 11 });
    } else {
      const c = cone(), px = w / 2, py = 40, k = Math.min(w * 0.35, h * 0.5), x = c.R * k * Math.cos(phi), z = c.R * k * Math.sin(phi), by = py + c.L * Math.cos(c.th) * k;
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.ellipse(px, by, c.R * k, c.R * k * 0.28, 0, 0, 7); ctx.stroke(); ctx.restore();
      line(ctx, [[px, py], [px, by]], col.line, 1.5);
      const bx = px + x, bz = by + z * 0.28;
      line(ctx, [[px, py], [bx, bz]], col.ink, 2.5);
      ctx.beginPath(); ctx.arc(bx, bz, 10, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill();
      arrow(ctx, bx, bz, bx, bz + G * 3, col.s[2], 3); text(ctx, 'mg', bx + 6, bz + G * 3, { color: col.s[2], size: 11, weight: 700 });
      const tl = Math.hypot(px - bx, py - bz); arrow(ctx, bx, bz, bx + (px - bx) / tl * c.T * 3, bz + (py - bz) / tl * c.T * 3, col.bad, 3);
      text(ctx, 'T', bx + (px - bx) / tl * c.T * 3 + 6, bz + (py - bz) / tl * c.T * 3, { color: col.bad, size: 11, weight: 700 });
      text(ctx, `θ = ${((c.th * 180) / Math.PI).toFixed(0)}°`, px + 8, py + 30, { color: col.ink, size: 12, weight: 700 });
    }
  };
  build();
}
