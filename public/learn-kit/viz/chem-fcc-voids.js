// Voids in a face-centred cubic (cubic close-packed) cell, in 3D. Atoms sit at the 8 corners and 6 face centres; the gaps
// between them are octahedral (6 neighbours, at the body centre and the 12 edge centres) and tetrahedral (4 neighbours, 8 of them
// inside). Pick what to show, shrink the atoms to see the holes, drag to turn. Counts per cell: 4 atoms, 4 octahedral, 8 tetrahedral.
import { canvas, text, row, slider, choice, readout, loop, title } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';

const atoms = [];
for (const x of [-0.5, 0.5]) for (const y of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) atoms.push([x, y, z]);
for (const s of [-0.5, 0.5]) { atoms.push([s, 0, 0], [0, s, 0], [0, 0, s]); }
const oct = [[0, 0, 0]]; for (const a of [-0.5, 0.5]) for (const b of [-0.5, 0.5]) oct.push([0, a, b], [a, 0, b], [a, b, 0]);
const tet = []; for (const x of [-0.25, 0.25]) for (const y of [-0.25, 0.25]) for (const z of [-0.25, 0.25]) tet.push([x, y, z]);
const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
const near = (c, r) => atoms.filter((a) => Math.abs(d(a, c) - r) < 0.01);
export default function (host) {
  let show = 'oct', size = 0.55, spin = true;
  const cv = canvas(host, { aspect: 0.9, max: 450, min: 310, label: 'A face-centred cubic unit cell with its octahedral and tetrahedral voids in 3D' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.4 });
  const c1 = row(host);
  choice(c1, 'Show voids', [['none', 'Atoms only'], ['oct', 'Octahedral'], ['tet', 'Tetrahedral'], ['both', 'Both']], show, (v) => { show = v; set(); });
  slider(c1, { label: 'Atom size (1 = touching)', min: 0.15, max: 1, step: 0.05, value: size, fmt: (v) => v.toFixed(2), oninput: (v) => { size = v; cv.redraw(); } });
  loop(host, (dt) => { if (spin && !cam.dragging) { cam.yaw += dt * 0.3; cv.redraw(); } });
  const out = readout(host);
  function set() {
    out.innerHTML = `Atoms per cell: 8 × ⅛ + 6 × ½ = <b>4</b> (N). Octahedral voids: 1 body centre + 12 edges × ¼ = <b>4 = N</b>. Tetrahedral voids: <b>8 = 2N</b>, all inside the cell. In a touching ccp lattice an octahedral hole holds a sphere up to <b>0.414</b> r and a tetrahedral hole up to <b>0.225</b> r. Packing fraction π√2/6 = <b>74%</b>. ${show === 'oct' ? 'Octahedral voids drawn: orange. Each is surrounded by 6 atoms.' : show === 'tet' ? 'Tetrahedral voids drawn: pink. Each is surrounded by 4 atoms.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'FCC (ccp) unit cell and its holes', col);
    const sc = Math.min(w, h) * 0.38, P = cam.proj(w, h, sc, w / 2, h / 2 + 12), r = 0.3536 * size * sc * 0.95;
    wire(ctx, P, shapes.box(1, 1, 1), col.muted, 1.1);
    const items = [];
    atoms.forEach((a) => items.push({ q: P(a), t: 'a' }));
    const addV = (list, k) => list.forEach((c) => items.push({ q: P(c), t: k, c }));
    if (show === 'oct' || show === 'both') addV(oct, 'o'); if (show === 'tet' || show === 'both') addV(tet, 't');
    // polyhedra edges for the voids
    const edges = (c, rad, count, color) => { const n = near(c, rad); ctx.strokeStyle = color; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.2; for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++) if (Math.abs(d(n[i], n[j]) - 0.7071) < 0.01) { const A = P(n[i]), B = P(n[j]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); } ctx.globalAlpha = 1; };
    if (show === 'oct' || show === 'both') oct.forEach((c) => edges(c, 0.5, 6, col.s[1]));
    if (show === 'tet' || show === 'both') tet.forEach((c) => edges(c, 0.433, 4, col.s[3]));
    items.sort((u, v) => u.q[2] - v.q[2]).forEach((it) => {
      const [x, y, z] = it.q;
      if (it.t === 'a') { const rr = r * (1 + z * 0.06); ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = size > 0.7 ? 0.72 : 0.9; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(x, y, 5 + z * 0.8, 0, 7); ctx.fillStyle = it.t === 'o' ? col.s[1] : col.s[3]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); }
    });
    text(ctx, 'blue: atoms · orange: octahedral · pink: tetrahedral', 10, h - 22, { color: col.muted, size: 10 });
    text(ctx, 'Drag to turn', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
