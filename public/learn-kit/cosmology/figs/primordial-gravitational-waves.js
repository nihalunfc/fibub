// 11.4 E-modes and B-modes, built the way cosmologists define them. Polarisation is a headless stick at each point
// (Stokes Q and U). Take any smooth bumpy field ψ. Its curvature gives an E pattern:
//   Q = ∂²ψ/∂x² − ∂²ψ/∂y²,  U = 2 ∂²ψ/∂x∂y   (sticks line up radially or around each bump: mirror-symmetric)
// Turn every stick by 45° and you get a B pattern from the same field:
//   Q = −2 ∂²ψ/∂x∂y,  U = ∂²ψ/∂x² − ∂²ψ/∂y²   (sticks swirl: left- and right-handed, not mirror-symmetric).
// Density ripples (scalars) make only E at first order; gravitational waves make both, so a primordial B pattern
// on degree scales would be the fingerprint of inflation's gravitational waves. Lensing and dust also make B.
// ψ here is a sum of Gaussian bumps; the stick angle is ½ atan2(U, Q), its length grows with √(Q² + U²).
import { canvas, text, title, row, choice, readout, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Polarisation sticks around bumps in an E-mode pattern and a B-mode swirl pattern' });
  let mode = 'E', sky = 'one';
  const r = rng(11);
  const many = Array.from({ length: 9 }, () => ({ x: r(), y: r(), s: r() < 0.5 ? -1 : 1, sig: 0.07 + 0.05 * r() }));
  const one = [{ x: 0.5, y: 0.5, s: 1, sig: 0.16 }];
  const ctl = row(host);
  choice(ctl, 'Pattern', [['E', 'E-mode'], ['B', 'B-mode']], mode, (v) => { mode = v; cv.redraw(); show(); });
  choice(ctl, 'Sky', [['one', 'One spot'], ['many', 'Many spots']], sky, (v) => { sky = v; cv.redraw(); show(); });
  const out = readout(host);
  // second derivatives of ψ at (x, y), in units where the panel is 0..1 (aspect handled by caller)
  const hess = (bumps, x, y) => {
    let xx = 0, yy = 0, xy = 0, psi = 0;
    for (const b of bumps) {
      const dx = x - b.x, dy = y - b.y, s2 = b.sig * b.sig, g = b.s * Math.exp(-(dx * dx + dy * dy) / (2 * s2));
      psi += g; xx += g * (dx * dx / (s2 * s2) - 1 / s2); yy += g * (dy * dy / (s2 * s2) - 1 / s2); xy += g * (dx * dy) / (s2 * s2);
    }
    return { xx, yy, xy, psi };
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'E' ? 'E-mode: sticks point at or around spots' : 'B-mode: the same field, turned 45°: swirls', col);
    const L = 8, T = top + 8, W = w - 16, H = h - T - 24, side = Math.max(W, H);
    const bumps = sky === 'one' ? one : many;
    // faint shading of ψ (the bumps)
    const cells = 48, cw = W / cells, chh = H / Math.round(cells * H / W);
    for (let i = 0; i < cells; i++) for (let j = 0; j * chh < H; j++) {
      const x = (i + 0.5) * cw / side, y = (j + 0.5) * chh / side;
      const { psi } = hess(bumps, x, y);
      if (Math.abs(psi) < 0.05) continue;
      ctx.fillStyle = psi > 0 ? col.s[3] : col.s[0];
      ctx.globalAlpha = Math.min(0.28, Math.abs(psi) * 0.3);
      ctx.fillRect(L + i * cw, T + j * chh, cw + 0.5, chh + 0.5);
    }
    ctx.globalAlpha = 1;
    // sticks
    const n = sky === 'one' ? 15 : 19, step = W / n, sticks = [];
    let maxP = 0;
    for (let i = 0; i < n; i++) for (let j = 0; (j + 0.5) * step < H; j++) {
      const px = L + (i + 0.5) * step, py = T + (j + 0.5) * step;
      const x = (px - L) / side, y = (py - T) / side;
      const d = hess(bumps, x, y);
      const Q = mode === 'E' ? d.xx - d.yy : -2 * d.xy, U = mode === 'E' ? 2 * d.xy : d.xx - d.yy;
      const P = Math.hypot(Q, U); maxP = Math.max(maxP, P);
      sticks.push([px, py, 0.5 * Math.atan2(U, Q), P]);
    }
    ctx.strokeStyle = col.ink; ctx.lineCap = 'round';
    for (const [px, py, ang, P] of sticks) {
      const len = step * 0.85 * Math.min(1, Math.sqrt(P / maxP) * 1.2);
      if (len < 2) continue;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px - Math.cos(ang) * len / 2, py - Math.sin(ang) * len / 2); ctx.lineTo(px + Math.cos(ang) * len / 2, py + Math.sin(ang) * len / 2); ctx.stroke();
    }
    text(ctx, 'shading: the bumpy field · sticks: polarisation direction', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
  };
  const show = () => {
    out.innerHTML = mode === 'E'
      ? 'E-mode: around each spot the sticks line up straight towards it or in rings around it. The pattern looks the same in a mirror. Ordinary density ripples make this kind, and it has been measured precisely since 2002.'
      : 'B-mode: the same sticks, each turned by 45°, make pinwheels that twist one way or the other. A mirror swaps the twists. Density ripples cannot make this pattern at first order; gravitational waves can. So can gravitational lensing and dust in our own galaxy.';
  };
  cv.redraw(); show();
}
