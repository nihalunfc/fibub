// A Fermi sea, filled one electron at a time. Allowed wave-vectors form a grid; the Pauli principle lets each grid point
// hold two electrons (spin up and down), so electrons fill the lowest energies first and make a sphere in k-space (left,
// one slice shown). Add electrons: the sphere grows, k_F ∝ N^(1/3), and the right-hand plot shows the filled part of the
// density of states g(E) ∝ √E up to the Fermi energy. Colour of dots: filled grid points in the slice vs empty.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../kit.js';

const RMAX = 7, pts = [];
for (let x = -RMAX; x <= RMAX; x++) for (let y = -RMAX; y <= RMAX; y++) for (let z = -RMAX; z <= RMAX; z++) pts.push({ x, y, z, e: x * x + y * y + z * z });
pts.sort((a, b) => a.e - b.e || a.x - b.x || a.y - b.y || a.z - b.z);
export default function (host) {
  let N = 40;
  const cv = canvas(host, { aspect: 0.62, max: 460, min: 300, label: 'A slice of k-space filling with electrons up to the Fermi sphere, and the filled density of states' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Electrons N', min: 2, max: 400, step: 2, value: N, fmt: (v) => `${v}`, oninput: (v) => { N = v; upd(); } });
  const out = readout(host);
  const EF = () => pts[Math.min(pts.length - 1, Math.ceil(N / 2) - 1)].e;
  function upd() {
    const e = EF(), kf = Math.pow((3 * N) / (8 * Math.PI), 1 / 3);
    out.innerHTML = `N = ${N} electrons fill ${Math.ceil(N / 2)} grid points (two per point). Highest filled shell: n² = <b>${e}</b> in units of the box ground-level spacing, so E<sub>F</sub> = ${e} ε₀ (ε₀ = 2π²ħ²/mL²). Counting formula k<sub>F</sub> = (3π²n)<sup>1/3</sup> gives radius ${kf.toFixed(2)} grid units against ${Math.sqrt(e).toFixed(2)} from the dots. Quadruple N and E<sub>F</sub> grows by ${(Math.pow(4, 2 / 3)).toFixed(2)} (E<sub>F</sub> ∝ n<sup>2/3</sup>).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Filling the Fermi sea', col);
    const e = EF(), nOcc = Math.ceil(N / 2), s = Math.min(w * 0.46, h - 60) / (2 * RMAX + 1), cx = 8 + s * (RMAX + 0.5), cy = 38 + s * (RMAX + 0.5);
    const filled = new Set(pts.slice(0, nOcc).map((p) => p.x + ',' + p.y + ',' + p.z));
    for (let x = -RMAX; x <= RMAX; x++) for (let y = -RMAX; y <= RMAX; y++) { const f = filled.has(x + ',' + y + ',0'); dot(ctx, cx + x * s, cy - y * s, f ? Math.max(1.8, s * 0.3) : 1.3, f ? col.s[0] : col.line); }
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.8; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, Math.sqrt(e + 0.5) * s, 0, 6.3); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'k_y', cx - 10, 38 + 2, { color: col.muted, size: 10 }); text(ctx, 'slice k_z = 0', 10, h - 8, { color: col.muted, size: 10 });
    ctx.save(); ctx.translate(w * 0.5 + 6, 24);
    const A = axes(ctx, w * 0.5 - 12, h - 24, col, { x: [0, 20], y: [0, 4.7], xlabel: 'E (ε₀)', ylabel: 'g(E)', t: 10, b: 32, l: 30, yt: [], fy: () => '', fx: (v) => v.toFixed(0), xt: [0, 10, 20] });
    const pts2 = []; for (let E = 0; E <= 20; E += 0.25) pts2.push([A.X(E), A.Y(Math.sqrt(E))]);
    ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); pts2.forEach(([x, y], i) => { if ((i * 0.25) <= e) ctx.lineTo(x, y); }); ctx.lineTo(A.X(e), A.Y(0)); ctx.closePath(); ctx.globalAlpha = 0.35; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, pts2, col.s[1], 2.5); line(ctx, [[A.X(e), A.Y(0)], [A.X(e), A.Y(Math.sqrt(e))]], col.s[3], 2, [4, 3]);
    text(ctx, `E_F = ${e}`, Math.min(A.X(e) + 4, A.R - 40), A.Y(Math.sqrt(e)) - 8, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    ctx.restore();
  };
  upd();
  return { step(i) { N = [2, 8, 40, 200][Math.min(3, i)]; sl.set(N); upd(); } };
}
