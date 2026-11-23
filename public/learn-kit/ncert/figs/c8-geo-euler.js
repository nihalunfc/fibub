// Class 8 Geometric Themes: solids. A solid's faces F, vertices V and edges E always satisfy Euler's rule V - E + F = 2.
// The wireframe turns slowly; choose what to highlight and count.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

const ring = (n, z, R, off = 0) => Array.from({ length: n }, (_, i) => [R * Math.cos(off + (2 * Math.PI * i) / n), z, R * Math.sin(off + (2 * Math.PI * i) / n)]);
const prism = (n, R, H, off) => { const V = [...ring(n, H, R, off), ...ring(n, -H, R, off)], F = [Array.from({ length: n }, (_, i) => i), Array.from({ length: n }, (_, i) => n + i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + ((i + 1) % n), n + i]); return { V, F }; };
const pyr = (n, R, H0, H1) => { const V = [...ring(n, -H0, R), [0, H1, 0]], F = [Array.from({ length: n }, (_, i) => i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]); return { V, F }; };
const octa = () => { const V = [[1.2, 0, 0], [-1.2, 0, 0], [0, 1.2, 0], [0, -1.2, 0], [0, 0, 1.2], [0, 0, -1.2]], F = []; for (const a of [0, 1]) for (const b of [2, 3]) for (const c of [4, 5]) F.push([a, b, c]); return { V, F }; };
const SOL = { tetra: ['Tetrahedron', pyr(3, 1.1, 0.5, 1.1)], cube: ['Cube', prism(4, 1.13, 0.8, Math.PI / 4)], octa: ['Octahedron', octa()], tprism: ['Triangular prism', prism(3, 1.1, 0.9, 0)], ppyr: ['Pentagonal pyramid', pyr(5, 1, 0.7, 1.1)], hprism: ['Hexagonal prism', prism(6, 1, 0.8, 0)] };
export default function (host) {
  let key = 'cube', hi = 'V', a = 0.6;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A turning solid with its faces, edges and vertices counted' });
  const ctl = row(host);
  choice(ctl, 'Solid', Object.entries(SOL).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; sync(); });
  choice(ctl, 'Count', [['V', 'Vertices'], ['E', 'Edges'], ['F', 'Faces']], hi, (v) => { hi = v; sync(); });
  const out = readout(host);
  const edges = (F) => { const set = new Set(); F.forEach((f) => f.forEach((v, i) => { const u = f[(i + 1) % f.length]; set.add(Math.min(u, v) + '-' + Math.max(u, v)); })); return [...set].map((s) => s.split('-').map(Number)); };
  const anim = loop(host, (dt) => { a += dt * 0.7; cv.redraw(); });
  anim.button(ctl);
  function sync() { const { V, F } = SOL[key][1], E = edges(F); out.innerHTML = `${SOL[key][0]}: V = <b>${V.length}</b>, E = <b>${E.length}</b>, F = <b>${F.length}</b>. V − E + F = ${V.length} − ${E.length} + ${F.length} = <b>${V.length - E.length + F.length}</b>. It is 2 for every solid with flat faces and no holes.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, SOL[key][0] + ': count V, E and F', col), { V, F } = SOL[key][1], E = edges(F), cx = w / 2, cy = (top + h) / 2 + 4, s = Math.min(w, h - top) * 0.3;
    const P = V.map(([x, y, z]) => { const c = Math.cos(a), sn = Math.sin(a), x1 = x * c + z * sn, z1 = -x * sn + z * c, t = 0.45, y1 = y * Math.cos(t) - z1 * Math.sin(t); return [cx + x1 * s, cy - y1 * s]; });
    ctx.strokeStyle = hi === 'E' ? col.s[3] : col.ink; ctx.lineWidth = hi === 'E' ? 3 : 1.8;
    E.forEach(([i, j], k) => { ctx.beginPath(); ctx.moveTo(...P[i]); ctx.lineTo(...P[j]); ctx.stroke(); });
    if (hi === 'V') P.forEach((p) => { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fill(); });
    if (hi === 'F') F.forEach((f, k) => { const px = f.reduce((q, i) => q + P[i][0], 0) / f.length, py = f.reduce((q, i) => q + P[i][1], 0) / f.length; ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(px, py, 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, String(k + 1), px, py, { color: '#fff', size: 10, weight: 700, align: 'center' }); });
    const n = { V: V.length, E: E.length, F: F.length }[hi];
    text(ctx, { V: 'Vertices: ', E: 'Edges: ', F: 'Faces: ' }[hi] + n, 10, h - 14, { color: col.ink, size: 13, weight: 700 });
  };
  sync();
}
