// Hydrogen orbitals as pictures: a slice through the atom shows |ψ|² (brightness) or the sign of ψ (two colours). Pick 1s to
// 3d, switch the slicing plane, and compare with the radial distribution P(r) = r²R² underneath, whose peaks and n − l − 1 nodes
// match the slice. Notice p and d lobes point along axes, s is a ball, and each extra node adds a ring.
import { canvas, axes, line, text, title, row, choice, readout } from '../kit.js';

const O = {
  '1s': { n: 1, l: 0, f: (x, y, z, r) => Math.exp(-r), R: (r) => 2 * Math.exp(-r), name: '1s' },
  '2s': { n: 2, l: 0, f: (x, y, z, r) => (2 - r) * Math.exp(-r / 2), R: (r) => (2 - r) * Math.exp(-r / 2) / (2 * Math.SQRT2) },
  '2pz': { n: 2, l: 1, f: (x, y, z, r) => z * Math.exp(-r / 2), R: (r) => r * Math.exp(-r / 2) / (2 * Math.sqrt(6)) },
  '2px': { n: 2, l: 1, f: (x, y, z, r) => x * Math.exp(-r / 2), R: (r) => r * Math.exp(-r / 2) / (2 * Math.sqrt(6)) },
  '3s': { n: 3, l: 0, f: (x, y, z, r) => (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3), R: (r) => 2 / (81 * Math.sqrt(3)) * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3) },
  '3pz': { n: 3, l: 1, f: (x, y, z, r) => z * (6 - r) * Math.exp(-r / 3), R: (r) => 8 / (27 * Math.sqrt(6)) * r * (1 - r / 6) * Math.exp(-r / 3) },
  '3dz2': { n: 3, l: 2, f: (x, y, z, r) => (3 * z * z - r * r) * Math.exp(-r / 3), R: (r) => 4 / (81 * Math.sqrt(30)) * r * r * Math.exp(-r / 3) },
  '3dxz': { n: 3, l: 2, f: (x, y, z, r) => x * z * Math.exp(-r / 3), R: (r) => 4 / (81 * Math.sqrt(30)) * r * r * Math.exp(-r / 3) },
  '3dxy': { n: 3, l: 2, f: (x, y, z, r) => x * y * Math.exp(-r / 3), R: (r) => 4 / (81 * Math.sqrt(30)) * r * r * Math.exp(-r / 3) },
  '3dx2y2': { n: 3, l: 2, f: (x, y, z, r) => (x * x - y * y) * Math.exp(-r / 3), R: (r) => 4 / (81 * Math.sqrt(30)) * r * r * Math.exp(-r / 3) },
};
const LAB = { '2pz': '2p_z', '2px': '2p_x', '3pz': '3p_z', '3dz2': '3d_z²', '3dxz': '3d_xz', '3dxy': '3d_xy', '3dx2y2': '3d_x²−y²' };
const EXT = { 1: 5, 2: 14, 3: 28 };
export default function (host) {
  const cv = canvas(host, { aspect: 1.15, max: 520, min: 420, label: 'A slice through a hydrogen orbital and its radial distribution' });
  let key = '2pz', plane = 'xz', view = 'dens';
  const ctl = row(host), ctl2 = row(host), ctl3 = row(host), out = readout(host);
  const keys = Object.keys(O);
  choice(ctl, 'Orbital', keys.slice(0, 4).map((k) => [k, LAB[k] || k]), key, (v) => { key = v; g2.set?.(); cv.redraw(); show(); });
  const mk = (p, ks) => ks.map((k) => [k, LAB[k] || k]);
  choice(ctl2, 'More', mk(0, keys.slice(4)), key, (v) => { key = v; cv.redraw(); show(); });
  const g2 = {};
  choice(ctl3, 'Plane', [['xz', 'Vertical slice (x–z)'], ['xy', 'Flat slice (x–y)']], plane, (v) => { plane = v; cv.redraw(); });
  choice(ctl3, 'Show', [['dens', 'Density |ψ|²'], ['sign', 'Sign of ψ']], view, (v) => { view = v; cv.redraw(); });
  function show() {
    const o = O[key], rm = o.R ? 0 : 0; let rp = 0, best = 0;
    for (let r = 0.05; r < 40; r += 0.05) { const p = r * r * o.R(r) ** 2; if (p > best) { best = p; rp = r; } }
    out.innerHTML = `<b>${LAB[key] || key}</b>: n = ${o.n}, l = ${o.l}. Radial nodes n − l − 1 = <b>${o.n - o.l - 1}</b>, angular nodes l = <b>${o.l}</b>, total n − 1 = ${o.n - 1}. Most probable radius ≈ <b>${rp.toFixed(1)} a₀</b> (${(rp * 0.0529).toFixed(2)} nm). A slice cannot show every angle: s is a ball, p and d have lobes and zero on the nodal planes.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const o = O[key], E = EXT[o.n], gh = Math.round(h * 0.68), N = 64;
    title(ctx, LAB[key] || key, col);
    const side = Math.min(w - 20, gh - 34), x0 = (w - side) / 2, y0 = 30, cell = side / N;
    const vals = new Float32Array(N * N); let mx = 0;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const u = ((i + 0.5) / N * 2 - 1) * E, v = (1 - (j + 0.5) / N * 2) * E;
      const x = u, y = plane === 'xy' ? v : 0, z = plane === 'xz' ? v : 0, r = Math.hypot(x, y, z);
      const f = o.f(x, y, z, r); vals[j * N + i] = f; mx = Math.max(mx, Math.abs(f));
    }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const f = vals[j * N + i] / mx;
      if (view === 'dens') { ctx.globalAlpha = Math.min(1, f * f * 1.0); ctx.fillStyle = col.s[0]; }
      else { ctx.globalAlpha = Math.min(1, Math.abs(f) * 1.1); ctx.fillStyle = f >= 0 ? col.s[0] : col.s[1]; }
      ctx.fillRect(x0 + i * cell, y0 + j * cell, cell + 0.6, cell + 0.6);
    }
    ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.strokeRect(x0, y0, side, side);
    line(ctx, [[x0 + side / 2, y0], [x0 + side / 2, y0 + side]], col.line, 1, [3, 4]); line(ctx, [[x0, y0 + side / 2], [x0 + side, y0 + side / 2]], col.line, 1, [3, 4]);
    text(ctx, 'x', x0 + side - 4, y0 + side / 2 - 8, { color: col.muted, size: 10, align: 'right' }); text(ctx, plane === 'xz' ? 'z' : 'y', x0 + side / 2 + 6, y0 + 8, { color: col.muted, size: 10 });
    text(ctx, `edge = ±${E} a₀`, x0 + 4, y0 + side - 8, { color: col.muted, size: 10 });
    // radial distribution
    const a = axes(ctx, w, h, col, { x: [0, E], y: [0, 1.08], l: 34, t: gh + 14, b: 30, yt: [], xlabel: 'r (a₀)', ylabel: 'P(r)' });
    let mxp = 0; const P = []; for (let i = 0; i <= 200; i++) { const r = (i / 200) * E, p = r * r * o.R(r) ** 2; P.push([r, p]); mxp = Math.max(mxp, p); }
    line(ctx, P.map(([r, p]) => [a.X(r), a.Y(p / mxp)]), col.s[2], 2);
  };
  show();
}
