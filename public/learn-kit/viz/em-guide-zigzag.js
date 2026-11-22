// Why a waveguide has a cutoff, using the bouncing plane-wave picture. A mode is a plane wave zig-zagging between the two
// walls at an angle set by sinθ = mλ/2a (its sideways pattern has to fit the width). Along the guide the energy moves only at
// v_g = c cosθ, slower than c; the crests move at v_p = c/cosθ, faster than c; and v_g·v_p = c². As f falls to f_c = mc/2a the
// ray goes straight across (θ = 90°) and nothing travels: cutoff. Parallel-plate guide, width a, TEₘ mode.
import { canvas, axes, line, text, row, slider, readout, loop, dot } from '../kit.js';

export default function (host) {
  let a = 3, f = 9, m = 1, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 310, label: 'A plane wave bouncing between two walls of a waveguide' });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'Width a', min: 1, max: 5, value: a, step: 0.1, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { a = x; upd(); } });
  slider(ctl, { label: 'Frequency f', min: 2, max: 30, value: f, step: 0.5, fmt: (x) => x + ' GHz', oninput: (x) => { f = x; upd(); } });
  slider(c2, { label: 'Mode m', min: 1, max: 3, value: m, step: 1, fmt: (x) => x, oninput: (x) => { m = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t = (t + dt * 0.25) % 1; cv.redraw(); }); anim.button(c2);
  const fc = () => m * 30 / (2 * a); // GHz (c = 30 cm/ns)
  function upd() { const c = fc(), r = c / f; out.innerHTML = f <= c ? `f = ${f} GHz is at or below the cutoff f<sub>c</sub> = mc/2a = <b>${c.toFixed(2)} GHz</b>: sinθ would exceed 1. The mode does not propagate; the field just dies away exponentially (evanescent).` : `Cutoff f<sub>c</sub> = mc/2a = ${c.toFixed(2)} GHz. Bounce angle θ = asin(f<sub>c</sub>/f) = <b>${(Math.asin(r) * 180 / Math.PI).toFixed(1)}°</b> from the axis. v<sub>g</sub> = c√(1−(f<sub>c</sub>/f)²) = <b>${(Math.sqrt(1 - r * r)).toFixed(3)} c</b>, v<sub>p</sub> = c/√(...) = ${(1 / Math.sqrt(1 - r * r)).toFixed(3)} c; product = c². Guide wavelength λ<sub>g</sub> = λ/√(1−(f<sub>c</sub>/f)²) = ${(30 / f / Math.sqrt(1 - r * r)).toFixed(2)} cm.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const c = fc(), r = c / f, top = 40, bot = 150, hh = bot - top, x0 = 12, x1 = w - 12;
    ctx.fillStyle = col.ink; ctx.fillRect(x0, top - 5, x1 - x0, 5); ctx.fillRect(x0, bot, x1 - x0, 5);
    if (r < 1) { const th = Math.asin(r), s = hh / Math.tan(th) * 1; // axial distance per bounce = hh / tan(angle to wall)... ray makes angle th with the axis? no: sinθ = fc/f where θ is measured from the axis
      const ax = Math.sqrt(1 - r * r), dxb = hh * ax / r; // axial length per bounce
      let px = x0 + 4, py = bot, d = -1; const pts = [[px, py]]; while (px < x1) { const nx = Math.min(x1, px + dxb); const ny = d < 0 ? top : bot; pts.push([nx, nx === px + dxb ? ny : py + d * (nx - px) * r / Math.max(ax, 1e-3)]); px = nx; py = ny; d = -d; if (pts.length > 80) break; }
      line(ctx, pts, col.s[5], 2.2);
      // wavefronts (perpendicular to the ray) along the first leg
      const u = [ax, -r], nrm = [r, ax]; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1; const lam = Math.min(60, Math.max(14, (30 / f) * 14)); for (let k = -4; k < 40; k++) { const s0 = (k + t) * lam, cxm = x0 + 4 + u[0] * s0, cym = bot + u[1] * s0; ctx.beginPath(); ctx.moveTo(cxm + nrm[0] * 0, cym); ctx.stroke(); }
      const tot = pts.reduce((s, p, i) => s + (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0); let dd = t * tot, ok = false; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (dd <= l) { dot(ctx, pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * dd / l, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * dd / l, 5, col.s[1], col.panel); break; } dd -= l; }
      text(ctx, `θ = ${(th * 180 / Math.PI).toFixed(0)}°`, x0 + 10, top + 26, { color: col.s[5], size: 12, weight: 700 });
    } else { for (let k = 0; k < 10; k++) { const x = x0 + 10 + k * (x1 - x0 - 20) / 9, al = Math.exp(-k * 0.5); ctx.globalAlpha = al; line(ctx, [[x, top + 10], [x, bot - 10]], col.s[5], 2); } ctx.globalAlpha = 1; text(ctx, 'cut off: field decays, nothing propagates', w / 2, (top + bot) / 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, 'metal wall', x1 - 4, top - 12, { color: col.muted, size: 10, align: 'right' });
    const G = axes(ctx, w, h, col, { x: [0, 1.6], y: [0, 3], xlabel: 'k_z (units of k at cutoff)', ylabel: 'f / f_c', l: 40, t: 176, b: 36, xt: [0, 0.5, 1, 1.5], yt: [0, 1, 2, 3], fy: (v) => v });
    line(ctx, Array.from({ length: 161 }, (_, i) => { const kz = i / 100; return [G.X(kz), G.Y(Math.sqrt(1 + kz * kz))]; }), col.s[0], 2.4); line(ctx, [[G.X(0), G.Y(0)], [G.X(1.6), G.Y(1.6)]], col.muted, 1.2, [4, 3]);
    const ff = f / c; if (ff > 1) { const kz = Math.sqrt(ff * ff - 1); dot(ctx, G.X(kz), G.Y(ff), 5.5, col.s[5], col.panel); } text(ctx, 'light line f = ck/2π', G.X(1.0), G.Y(1.0 + 0.55) - 2, { color: col.muted, size: 10 }); text(ctx, 'f² = f_c² + (ck_z/2π)²', G.X(0.15), G.Y(2.7), { color: col.s[0], size: 10.5, weight: 700 });
    if (ff > 1) text(ctx, 'dot = your mode', G.R - 4, G.B - 8, { color: col.s[5], size: 10, align: 'right' });
  };
  upd();
}
