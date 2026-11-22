// 9.2 Glide of an edge dislocation. A square lattice with an extra half-plane above the slip plane: atoms are drawn
// at their perfect positions plus the displacement u = (b/2π)·θ (θ measured round the core), a simple model of the edge
// field. A shear stress moves the core one atom spacing at a time; after it has crossed, the top half has slipped by b.
// Only bonds next to the core change at each step, which is why slip by dislocations needs so little stress.
import { canvas, row, choice, readout, line, dot, text, arrow, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'An edge dislocation gliding through a square lattice under shear' });
  let xc = -1, view = 'atoms', t = 0;
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Show', [['atoms', 'Atoms'], ['circuit', 'Burgers circuit']], view, (v) => { view = v; cv.redraw(); });
  const NX = 13, NY = 8, A = 1;
  const lp = loop(host, (dt) => { t += dt; xc = -2 + ((t * 1.2) % (NX + 4)); cv.redraw(); show(); });
  lp.button(ctl);
  const show = () => {
    const done = Math.max(0, Math.min(1, (xc + 0.5) / NX));
    out.innerHTML = xc < 0 ? 'The dislocation enters from the left under the shear stress τ (arrows).' : xc > NX - 1 ? 'It has left on the right: the top half is now shifted by one Burgers vector b, a slip step on each side.' : `Core at column ${Math.round(xc)}: the slipped region (left of ⊥) is ${Math.round(done * 100)}% of the slip plane. Only the bonds at the core are distorted.`;
  };
  // displacement of an atom at (x, y) relative to a core at (xc, 0); slip plane at y = 0 between rows -0.5 and +0.5
  const ux = (x, y) => (A / (2 * Math.PI)) * Math.atan2(y, x - xc);
  cv.draw = (ctx, W, H, col) => {
    const s = Math.min((W - 40) / (NX + 1), (H - 60) / (NY + 1)), ox = (W - s * (NX - 1)) / 2, oy = H / 2 + 6;
    const P = (x, y) => [ox + x * s, oy - y * s];
    text(ctx, 'Edge dislocation gliding along the slip plane', 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    line(ctx, [P(-0.8, 0), P(NX - 0.2, 0)], col.muted, 1, [4, 4]);
    text(ctx, 'slip plane', ...P(NX - 0.3, 0.18), { color: col.muted, size: 10.5, align: 'right' });
    const pos = [];
    for (let j = 0; j < NY; j++) {
      const y = j - NY / 2 + 0.5; const rowPts = [];
      for (let i = 0; i < NX; i++) { const u = ux(i, y); rowPts.push(P(i + u, y)); }
      pos.push(rowPts);
    }
    for (const rp of pos) line(ctx, rp, col.line, 1.2);
    for (let i = 0; i < NX; i++) { const colPts = pos.filter((_, j) => j >= NY / 2).map((rp) => rp[i]); line(ctx, colPts, col.line, 1.2); const low = pos.filter((_, j) => j < NY / 2).map((rp) => rp[i]); line(ctx, low, col.line, 1.2); }
    for (const rp of pos) for (const [x, y] of rp) dot(ctx, x, y, Math.max(2.5, s * 0.16), col.s[0]);
    if (xc > -0.5 && xc < NX - 0.5) { const [cx, cy] = P(xc, 0); ctx.save(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 9, cy); ctx.lineTo(cx + 9, cy); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 16); ctx.stroke(); ctx.restore(); }
    // shear arrows
    const [lx, ty] = P(1, NY / 2 + 0.3), [rx] = P(NX - 2, 0), [, by] = P(0, -NY / 2 - 0.3);
    arrow(ctx, lx, ty, rx, ty, col.s[2], 2); arrow(ctx, rx, by, lx, by, col.s[2], 2);
    text(ctx, 'τ', (lx + rx) / 2, ty - 9, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    if (view === 'circuit' && xc > 2 && xc < NX - 3) {
      // Burgers circuit: 4 steps right, 4 up, 4 left, 4 down round the core (counted in atoms)
      const i0 = Math.round(xc) - 2, j0 = NY / 2 - 2, path = [];
      const at = (i, j) => pos[j][i];
      for (let k = 0; k <= 4; k++) path.push(at(i0 + k, j0));
      for (let k = 1; k <= 3; k++) path.push(at(i0 + 4, j0 + k));
      for (let k = 1; k <= 4; k++) path.push(at(i0 + 4 - k, j0 + 3));
      // down the slipped (left) side: crossing the slip plane, the atom straight below upper atom i is lower atom i + 1
      path.push(at(i0, j0 + 2)); path.push(at(i0 + 1, j0 + 1)); path.push(at(i0 + 1, j0));
      line(ctx, path, col.s[1], 2.5);
      const [ex, ey] = at(i0 + 1, j0), [sx, sy] = at(i0, j0);
      arrow(ctx, ex, ey + 10, sx, sy + 10, col.s[3], 2.5, 7);
      text(ctx, 'b', (ex + sx) / 2, ey + 22, { color: col.s[3], size: 12, weight: 700, align: 'center' });
      text(ctx, '4 right, 3 up, 4 left, 3 down: the circuit fails to close by b', 10, H - 10, { color: col.s[1], size: 11, weight: 700 });
    }
  };
  cv.redraw(); show();
}
