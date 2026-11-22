// Refraction, total internal reflection and the optical fibre. "Flat surface": change the angle of incidence and the two
// indices; n₁ sin θ₁ = n₂ sin θ₂. When light goes into a less dense medium there is a critical angle sin θc = n₂/n₁, beyond
// which nothing is refracted. Line thickness shows how the light divides (Fresnel). "Fibre": a ray zig-zags down the core by
// total reflection if it enters within the acceptance angle sin θ₀ = √(n₁² − n₂²); otherwise it leaks out.
import { canvas, text, row, slider, choice, readout, loop, line, arrow, dot } from '../kit.js';

export default function (host) {
  let mode = 'flat', th = 35, n1 = 1.5, n2 = 1.0, nc = 1.46, ncl = 1.44, th0 = 12, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 280, label: 'A ray refracting or totally reflecting at a boundary, and light in an optical fibre' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Show', [['flat', 'Flat surface'], ['fibre', 'Optical fibre']], mode, (v) => { mode = v; mk(); upd(); });
  let loopRow = row(host);
  function mk() { c2.innerHTML = '';
    if (mode === 'flat') { slider(c2, { label: 'Angle of incidence θ₁', min: 0, max: 89, value: th, step: 1, fmt: (x) => x + '°', oninput: (x) => { th = x; upd(); } }); slider(c2, { label: 'n₁ (upper)', min: 1, max: 2.4, value: n1, step: 0.05, fmt: (x) => x.toFixed(2), oninput: (x) => { n1 = x; upd(); } }); slider(c2, { label: 'n₂ (lower)', min: 1, max: 2.4, value: n2, step: 0.05, fmt: (x) => x.toFixed(2), oninput: (x) => { n2 = x; upd(); } }); }
    else { slider(c2, { label: 'Entry angle θ₀ (in air)', min: 0, max: 60, value: th0, step: 1, fmt: (x) => x + '°', oninput: (x) => { th0 = x; upd(); } }); slider(c2, { label: 'Core n₁', min: 1.4, max: 1.8, value: nc, step: 0.01, fmt: (x) => x.toFixed(2), oninput: (x) => { nc = x; if (ncl >= nc) ncl = nc - 0.01; upd(); } }); slider(c2, { label: 'Cladding n₂', min: 1.3, max: 1.7, value: ncl, step: 0.01, fmt: (x) => x.toFixed(2), oninput: (x) => { ncl = Math.min(x, nc - 0.005); upd(); } }); } }
  const anim = loop(host, (dt) => { t += dt * 0.35; cv.redraw(); }); anim.button(c2);
  const out = readout(host);
  const fres = (a, b, ti) => { const si = Math.sin(ti) * a / b; if (si >= 1) return 1; const tt = Math.asin(si), ci = Math.cos(ti), ct = Math.cos(tt); const rs = ((a * ci - b * ct) / (a * ci + b * ct)) ** 2, rp = ((a * ct - b * ci) / (a * ct + b * ci)) ** 2; return (rs + rp) / 2; };
  function upd() {
    if (mode === 'flat') { const s = n1 * Math.sin(th * Math.PI / 180) / n2, c = n2 < n1 ? Math.asin(n2 / n1) * 180 / Math.PI : null;
      out.innerHTML = s >= 1 ? `n₁ sinθ₁ = ${(n1 * Math.sin(th * Math.PI / 180)).toFixed(3)} > n₂: no refracted ray is possible. <b>Total internal reflection</b> (critical angle ${c.toFixed(1)}°; here θ₁ = ${th}° is beyond it).` : `θ₂ = asin(n₁sinθ₁/n₂) = <b>${(Math.asin(s) * 180 / Math.PI).toFixed(1)}°</b>. ${c ? `Critical angle θc = asin(n₂/n₁) = ${c.toFixed(1)}°. Increase θ₁ past it.` : 'Light going into a denser medium bends towards the normal; there is no critical angle.'} Reflected share ≈ ${(fres(n1, n2, th * Math.PI / 180) * 100).toFixed(1)}%.`; }
    else { const NA = Math.sqrt(Math.max(0, nc * nc - ncl * ncl)), ta = Math.asin(Math.min(1, NA)) * 180 / Math.PI, ok = Math.sin(th0 * Math.PI / 180) < NA;
      out.innerHTML = `Numerical aperture NA = √(n₁² − n₂²) = <b>${NA.toFixed(3)}</b>, acceptance half-angle = asin(NA) = <b>${NA >= 1 ? '90' : ta.toFixed(1)}°</b>. Entry angle ${th0}°: ${ok ? '<b>trapped</b>: it reaches the wall at more than the critical angle and reflects totally every time (no loss, even round bends).' : '<b>leaks out</b> at the first wall hit; the signal fades quickly.'}`; }
    cv.redraw(); }
  const R2 = Math.PI / 180;
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'flat') {
      const cy = h * 0.5, cx = w / 2, L = Math.min(w, h) * 0.42, a1 = th * R2, s2 = n1 * Math.sin(a1) / n2, Rf = fres(n1, n2, a1);
      ctx.globalAlpha = Math.min(0.35, 0.05 + 0.1 * (n1 - 1)); ctx.fillStyle = col.s[4]; ctx.fillRect(0, 0, w, cy); ctx.globalAlpha = Math.min(0.35, 0.05 + 0.1 * (n2 - 1)); ctx.fillRect(0, cy, w, h - cy); ctx.globalAlpha = 1;
      line(ctx, [[0, cy], [w, cy]], col.ink, 1.5); line(ctx, [[cx, cy - L], [cx, cy + L]], col.muted, 1, [4, 4]);
      text(ctx, `n₁ = ${n1.toFixed(2)}`, 10, 16, { color: col.ink, size: 12, weight: 700 }); text(ctx, `n₂ = ${n2.toFixed(2)}`, 10, h - 12, { color: col.ink, size: 12, weight: 700 });
      const pt = (a, d) => [cx + Math.sin(a) * d, cy - Math.cos(a) * d];
      arrow(ctx, ...pt(-a1, L), cx, cy, col.s[5], 3, 9); line(ctx, [[cx, cy], pt(a1, L)], col.s[5], 1 + 5 * Rf);
      if (s2 < 1) { const a2 = Math.asin(s2); line(ctx, [[cx, cy], [cx + Math.sin(a2) * L, cy + Math.cos(a2) * L]], col.s[2], 1 + 5 * (1 - Rf)); }
      if (n2 < n1) { const ac = Math.asin(n2 / n1); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(...pt(-ac, L * 0.9)); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'θc', ...pt(-ac, L * 0.95), { color: col.muted, size: 10.5 }); }
      text(ctx, `θ₁ = ${th}°`, cx - 6, cy - 14, { color: col.s[5], size: 11, weight: 700, align: 'right' }); if (s2 < 1) text(ctx, `θ₂ = ${(Math.asin(s2) / R2).toFixed(1)}°`, cx + 8, cy + 18, { color: col.s[2], size: 11, weight: 700 }); else text(ctx, 'total internal reflection', cx, cy + 20, { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
    } else {
      const cy = h / 2, hw = 28, x0 = 40, x1 = w - 14, NA = Math.sqrt(Math.max(0, nc * nc - ncl * ncl)), ok = Math.sin(th0 * R2) < NA;
      ctx.globalAlpha = 0.5; ctx.fillStyle = col.s[4]; ctx.fillRect(x0, cy - hw - 20, x1 - x0, 20); ctx.fillRect(x0, cy + hw, x1 - x0, 20); ctx.globalAlpha = 0.15; ctx.fillRect(x0, cy - hw, x1 - x0, 2 * hw); ctx.globalAlpha = 1;
      line(ctx, [[x0, cy - hw], [x1, cy - hw]], col.ink, 1.5); line(ctx, [[x0, cy + hw], [x1, cy + hw]], col.ink, 1.5); line(ctx, [[x0, cy - hw - 20], [x1, cy - hw - 20]], col.muted, 1); line(ctx, [[x0, cy + hw + 20], [x1, cy + hw + 20]], col.muted, 1);
      text(ctx, 'core n₁', x1 - 4, cy - 8, { color: col.ink, size: 10.5, align: 'right' }); text(ctx, 'cladding n₂ (lower)', x1 - 4, cy - hw - 10, { color: col.ink, size: 10.5, align: 'right' });
      const ta = Math.asin(Math.min(1, NA)); ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x0 - 30 * Math.cos(ta), cy - s * 30 * Math.sin(ta) * 1); ctx.stroke(); }); ctx.setLineDash([]); text(ctx, 'acceptance cone', 6, cy + 40, { color: col.muted, size: 10 });
      const tr = Math.asin(Math.sin(th0 * R2) / nc), sl = Math.tan(tr); let x = x0, y = cy + hw * 0, dir = -1, pts = [[x0, cy]], alpha = 1; // goes up first
      const segs = []; let px = x0, py = cy, d = -1, a = 1;
      for (let k = 0; k < 40 && px < x1; k++) { const wall = d < 0 ? cy - hw : cy + hw, dx = Math.abs(wall - py) / Math.max(sl, 1e-4), nx = Math.min(x1, px + dx), ny = py + d * (nx - px) * sl; segs.push([px, py, nx, ny, a]); px = nx; py = ny; if (nx >= x1) break; if (ok) d = -d; else { const al = Math.PI / 2 - tr, st = nc * Math.sin(al) / Math.max(ncl, 1e-3); const ex = Math.min(x1, px + 60), ey = py + d * 60 * Math.tan(Math.asin(Math.min(0.999, st)) ); line(ctx, [[px, py], [px + 28, py + d * 28 * Math.tan(Math.min(1.3, Math.asin(Math.min(0.97, st))) - 0) * 1]], col.s[5], 2, [3, 3]); a *= 0.15; d = -d; if (a < 0.02) break; } }
      segs.forEach(([a1, b1, c1, d1, al]) => { ctx.globalAlpha = al; line(ctx, [[a1, b1], [c1, d1]], col.s[5], 2.6); }); ctx.globalAlpha = 1;
      const tot = segs.reduce((s, q) => s + Math.hypot(q[2] - q[0], q[3] - q[1]), 0); let dd = (t % 1) * tot; for (const q of segs) { const l = Math.hypot(q[2] - q[0], q[3] - q[1]); if (dd <= l) { dot(ctx, q[0] + (q[2] - q[0]) * dd / l, q[1] + (q[3] - q[1]) * dd / l, 5, col.s[1], col.panel); break; } dd -= l; }
      text(ctx, ok ? 'Total internal reflection at every bounce' : 'Leaks into the cladding', 10, 16, { color: ok ? col.s[2] : col.s[5], size: 12, weight: 700 });
    }
  };
  mk(); upd();
}
