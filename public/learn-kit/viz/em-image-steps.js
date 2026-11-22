// The method of images, in four steps (a step player, or use the buttons and the slider). A charge +q sits a height d above
// a grounded conducting plane. Step 1: the real situation, with induced charge on the plane. Step 2: take the metal away and
// put an image charge −q at depth d: above the plane the field is exactly the same. Step 3: check that the plane is at V = 0
// and the field meets it at right angles. Step 4: read off the induced surface charge σ(ρ) = −qd/2π(ρ²+d²)^{3/2}, whose total is −q,
// and the force q²/4πε₀(2d)².
import { canvas, axes, line, text, row, slider, button, readout, dot } from '../kit.js';
import { lines, contours } from './_em-field.js';

const TITLES = ['1. A charge above a grounded metal plane', '2. Replace the metal by an image charge −q', '3. The plane is an equipotential, field ⊥ to it', '4. Induced charge and the force'];
export default function (host) {
  let st = 0, d = 0.8;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 340, label: 'A point charge above a conducting plane and its image charge' });
  const ctl = row(host);
  [0, 1, 2, 3].forEach((i) => button(ctl, String(i + 1), () => { st = i; upd(); }));
  slider(ctl, { label: 'Height d', min: 0.4, max: 1.3, value: d, step: 0.05, fmt: (x) => x.toFixed(2) + ' m', oninput: (x) => { d = x; upd(); } });
  const out = readout(host);
  const MSG = ['The charge pulls opposite charge up out of the metal: the plane carries induced charge, and field lines from +q end on it. Finding that charge directly is hard.', 'Uniqueness theorem: if the new charges give V = 0 on the plane and the same charge above, the field above must be the same. So put −q at depth d (dashed region is not real).', 'Every point of the plane is equidistant from +q and −q, so their potentials cancel there: V = 0. Lines of E arrive at 90°, as they must at a conductor.', 'Because we now know E at the surface, σ = ε₀E_n: σ(ρ) = −qd/(2π(ρ²+d²)^{3/2}). Adding up gives exactly −q. The force on q is that of the image, F = q²/(4πε₀(2d)²), towards the plane.'];
  function upd() { out.innerHTML = `<b>${TITLES[st]}.</b> ${MSG[st]}${st === 3 ? ` At d = ${d.toFixed(2)} m, with q = 1 nC: F = ${(8.99e9 * 1e-18 / (2 * d) ** 2 * 1e9).toFixed(2)} nN; half of the induced charge lies within ρ = ${(d * Math.sqrt(3)).toFixed(2)} m.` : ''}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const sc = Math.min(w, 420) * 0.5, py = h * 0.42, cx = w / 2, dpx = d * sc * 0.5, Q = st === 0 ? [{ x: cx, y: py - dpx, q: 2 }, { x: cx, y: py + dpx, q: -2 }] : [{ x: cx, y: py - dpx, q: 2 }, { x: cx, y: py + dpx, q: -2 }];
    ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[7]; if (st <= 3) ctx.fillRect(0, py, w, h * 0.0 + (st === 0 || st === 3 ? 22 : 0)); ctx.globalAlpha = 1;
    const clip = { y0: 0, y1: py };
    if (st === 2) contours(ctx, Q, sc * 0.5, w, py, [-8, -4, -2, -1, 1, 2, 4, 8], (L) => (L > 0 ? col.s[5] : col.s[0]), { y0: 0, y1: py, alpha: 0.5 });
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, py + 1); ctx.clip(); lines(ctx, Q, sc * 0.5, w, h, col.ink, { per: 5, clip }); ctx.restore();
    if (st === 1 || st === 2) { ctx.save(); ctx.beginPath(); ctx.rect(0, py, w, 70); ctx.clip(); ctx.globalAlpha = 0.45; ctx.setLineDash([3, 4]); lines(ctx, Q.map((c) => ({ ...c, y: c.y })), sc * 0.5, w, h, col.muted, { per: 5, width: 1, clip: { y0: py, y1: py + 90 } }); ctx.restore(); }
    ctx.fillStyle = col.s[7]; ctx.globalAlpha = st === 1 || st === 2 ? 0.1 : 0.35; ctx.fillRect(0, py, w, st === 3 ? 18 : 40); ctx.globalAlpha = 1; line(ctx, [[0, py], [w, py]], col.ink, 2.4);
    text(ctx, 'grounded conductor', 10, py + 14, { color: col.muted, size: 10.5 });
    dot(ctx, cx, py - dpx, 9, col.s[5], col.panel); text(ctx, '+q', cx + 14, py - dpx, { color: col.s[5], size: 12, weight: 700 });
    if (st >= 1 && st < 3) { ctx.save(); if (st < 3) ctx.setLineDash([3, 3]); dot(ctx, cx, py + dpx, 9, col.s[0], col.panel); ctx.restore(); text(ctx, '−q (image)', cx + 14, py + dpx, { color: col.s[0], size: 12, weight: 700 }); }
    if (st === 0 || st === 3) for (let k = -8; k <= 8; k++) { const rho = k * 0.17, s = (d) / Math.pow(rho * rho + d * d, 1.5) * 0.5 * d * d; for (let j = 0; j < Math.round(s * 3 + 0.4); j++) text(ctx, '−', cx + k * w * 0.05, py + 12 + j * 0, { color: col.s[0], size: 12, weight: 700, align: 'center' }); }
    if (st === 3) { const G = axes(ctx, w, h, col, { x: [-3, 3], y: [0, 1.05], xlabel: 'distance ρ along the plane (in units of d)', ylabel: '|σ| (relative)', l: 40, t: py + 36, b: 36, xt: [-3, -2, -1, 0, 1, 2, 3], yt: [0, 1], fy: (v) => v });
      line(ctx, Array.from({ length: 121 }, (_, i) => { const r = -3 + i * 0.05; return [G.X(r), G.Y(1 / Math.pow(r * r + 1, 1.5))]; }), col.s[0], 2.4); }
    text(ctx, TITLES[st], 10, 16, { color: col.ink, size: 11.5, weight: 700 });
  };
  upd();
  return { step(i, n) { st = Math.max(0, Math.min(3, Math.round(i * 3 / Math.max(1, n - 1)))); upd(); } };
}
