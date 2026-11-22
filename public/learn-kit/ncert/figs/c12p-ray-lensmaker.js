// Class 12 Ray Optics: the lens maker's formula 1/f = (n_lens/n_medium - 1)(1/R1 - 1/R2) with the lens drawn from its two
// surfaces (New Cartesian signs: R is positive if the centre of curvature is on the far side of the surface). Pick a shape,
// set the radii, the glass and the surrounding medium. Three parallel rays show where the lens brings light to a focus
// (or spreads it out, so it seems to come from a focus on the near side). A convex meniscus turns concave when R2 < R1.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const SHAPES = { bi: ['Biconvex', 1, -1], plano: ['Plano-convex', 1, 0], bicon: ['Biconcave', -1, 1], men: ['Meniscus', 1, 1] };
  let shape = 'bi', a = 15, b = 15, n = 1.5, med = 1;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A thin lens drawn from its two surface radii with parallel rays showing the focus' });
  const ctl = row(host);
  choice(ctl, 'Shape', Object.entries(SHAPES).map(([k, v]) => [k, v[0]]), shape, (v) => { shape = v; upd(); });
  slider(ctl, { label: 'Radius |R₁|', min: 5, max: 40, step: 1, value: a, fmt: (v) => `${v} cm`, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'Radius |R₂|', min: 5, max: 40, step: 1, value: b, fmt: (v) => `${v} cm`, oninput: (v) => { b = v; upd(); } });
  slider(ctl, { label: 'Glass index n', min: 1.3, max: 2, step: 0.05, value: n, fmt: (v) => v.toFixed(2), oninput: (v) => { n = v; upd(); } });
  choice(ctl, 'Lens is in', [[1, 'Air'], [1.33, 'Water']], med, (v) => { med = v; upd(); });
  const out = readout(host);
  const R1 = () => SHAPES[shape][1] * a, R2 = () => (SHAPES[shape][2] === 0 ? Infinity : SHAPES[shape][2] * b);
  const P = () => (n / med - 1) * (1 / R1() - (Number.isFinite(R2()) ? 1 / R2() : 0));
  function upd() {
    const p = P(), f = 1 / p;
    out.innerHTML = `1/R₁ − 1/R₂ = ${(1 / R1() - (Number.isFinite(R2()) ? 1 / R2() : 0)).toFixed(3)} cm⁻¹, n_lens/n_medium − 1 = ${(n / med - 1).toFixed(2)} → f = <b>${Math.abs(f) > 1e4 ? '∞' : f.toFixed(1) + ' cm'}</b> (${f > 0 ? 'converging' : 'diverging'}), power = <b>${(100 * p).toFixed(1)} D</b>.${n / med < 1.01 ? ' With n_lens ≈ n_medium the lens does nothing.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${SHAPES[shape][0]} lens: shape decides the focus`, col);
    const s = 5, cy = Math.round(h * 0.55), lx = Math.round(w * 0.45), r1 = R1() * s, r2 = Number.isFinite(R2()) ? R2() * s : Infinity;
    let hh = Math.min(h * 0.28, 0.7 * Math.min(Math.abs(r1), Math.abs(r2)));
    const prof = (v0, R, y) => (R === Infinity ? v0 : v0 + R - Math.sign(R) * Math.sqrt(R * R - y * y));
    const offL = prof(0, r1, hh), offR = r2 === Infinity ? 0 : prof(0, r2, hh), t = Math.max(3, 4 - offR + offL), x1 = lx - t / 2, x2 = lx + t / 2;
    line(ctx, [[6, cy], [w - 6, cy]], col.line, 1);
    const pts = []; for (let k = -20; k <= 20; k++) { const y = (k / 20) * hh; pts.push([prof(x1, r1, y), cy + y]); } for (let k = 20; k >= -20; k--) { const y = (k / 20) * hh; pts.push([prof(x2, r2, y), cy + y]); }
    ctx.save(); ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.globalAlpha = 1; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
    const f = 1 / P(), xF = lx + f * s;
    for (const [k, c] of [[-0.62, col.s[0]], [0, col.s[1]], [0.62, col.s[2]]]) {
      const y = cy + k * hh;
      line(ctx, [[8, y], [lx, y]], c, 1.8);
      if (Math.abs(f) < 1e4) {
        const dir = f > 0 ? [xF - lx, cy - y] : [lx - xF, y - cy], L = w / Math.max(1, Math.hypot(...dir));
        line(ctx, [[lx, y], [lx + dir[0] * L, y + dir[1] * L]], c, 1.8);
        if (f < 0) line(ctx, [[lx, y], [xF, cy]], c, 1.3, [4, 4]);
      } else line(ctx, [[lx, y], [w - 6, y]], c, 1.8);
    }
    if (Math.abs(f) < 1e4 && xF > 4 && xF < w - 4) { dot(ctx, xF, cy, 5, col.s[3], col.panel); text(ctx, f > 0 ? 'F (real focus)' : 'F (virtual focus)', xF, cy + 18, { color: col.s[3], size: 11.5, weight: 700, align: 'center', halo: col.panel }); }
    else text(ctx, 'focus is beyond the picture', w - 10, h - 12, { color: col.muted, size: 11, align: 'right' });
  };
  upd();
}
