// 7.1 Cubic unit cells. Pick simple, body-centred or face-centred cubic (or diamond) and turn the cube. "Touching
// spheres" draws the atoms at their hard-sphere radius, so you can see where they touch; the readout counts atoms per
// cell (with the corner and face shares), the coordination number, r/a and the packing fraction.
import { canvas, row, slider, choice, readout, fmt, title, line, loop, text } from '../../kit.js';

const S2 = Math.SQRT2, S3 = Math.sqrt(3);
const corners = [];
for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) corners.push([x, y, z, 'corner']);
const faces = [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]].map((p) => [...p, 'face']);
const tetra = [[0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]].map((p) => [...p, 'inside']);
const S = {
  sc: { name: 'Simple cubic', atoms: corners, r: 0.5, cn: 6, touch: 'along the cube edge: a = 2r', count: '8 corners × 1/8 = 1' },
  bcc: { name: 'Body-centred cubic', atoms: [...corners, [0.5, 0.5, 0.5, 'centre']], r: S3 / 4, cn: 8, touch: 'along the body diagonal: √3 a = 4r', count: '8 × 1/8 + 1 centre = 2' },
  fcc: { name: 'Face-centred cubic', atoms: [...corners, ...faces], r: S2 / 4, cn: 12, touch: 'along the face diagonal: √2 a = 4r', count: '8 × 1/8 + 6 faces × 1/2 = 4' },
  diamond: { name: 'Diamond', atoms: [...corners, ...faces, ...tetra], r: S3 / 8, cn: 4, touch: 'along the tetrahedral bond: √3 a/4 = 2r', count: '8 × 1/8 + 6 × 1/2 + 4 inside = 8' },
};
const N = { sc: 1, bcc: 2, fcc: 4, diamond: 8 };

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 280, label: 'A cubic unit cell with its atoms, drawn in 3D' });
  let key = 'bcc', phi = 0.55, big = false;
  const ctl = row(host);
  choice(ctl, 'Lattice', Object.entries(S).map(([k, v]) => [k, v.name]), key, (k) => { key = k; re(); });
  choice(ctl, 'Atoms', [['small', 'Small dots'], ['big', 'Touching spheres']], 'small', (v) => { big = v === 'big'; re(); });
  const rot = slider(ctl, { label: 'Turn the cube', min: 0, max: 6.28, step: 0.01, value: phi, fmt: (v) => `${Math.round(v * 180 / Math.PI)}°`, oninput: (v) => { phi = v; anim.pause(); re(); } });
  const anim = loop(host, (dt) => { phi = (phi + dt * 0.4) % (2 * Math.PI); rot.set(phi); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  const show = () => {
    const s = S[key], pf = N[key] * (4 / 3) * Math.PI * s.r ** 3;
    out.innerHTML = `${s.name}: atoms per cell ${s.count}. Nearest neighbours: <b>${s.cn}</b>. Atoms touch ${s.touch}, so r = ${fmt(s.r, 3)}a. Packing fraction = ${N[key]} × (4/3)πr³ / a³ = <b>${fmt(pf, 3)}</b>.`;
  };
  const re = () => { cv.redraw(); show(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, `${S[key].name} unit cell`, col);
    const el = 0.38, sc = Math.min(W, H) * 0.42, cx = W / 2, cy = H / 2 + 14;
    const P = ([x, y, z]) => {
      x -= 0.5; y -= 0.5; z -= 0.5;
      const xr = x * Math.cos(phi) - y * Math.sin(phi), yr = x * Math.sin(phi) + y * Math.cos(phi);
      return [cx + sc * xr, cy - sc * (z * Math.cos(el) - yr * Math.sin(el)), yr * Math.cos(el) + z * Math.sin(el)];
    };
    // cube edges
    const E = [];
    for (const a of corners) for (const b of corners) { const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); if (d === 1 && a < b) E.push([a, b]); }
    for (const [a, b] of E) { const p = P(a), q = P(b); line(ctx, [[p[0], p[1]], [q[0], q[1]]], col.muted, 1.2); }
    if (key === 'diamond') for (const t of tetra) {
      const p = P(t);
      for (const c of [...corners, ...faces]) { const d = Math.hypot(t[0] - c[0], t[1] - c[1], t[2] - c[2]); if (Math.abs(d - S3 / 4) < 1e-6) { const q = P(c); line(ctx, [[p[0], p[1]], [q[0], q[1]]], col.line, 2); } }
    }
    const kinds = { corner: col.s[0], face: col.s[1], centre: col.s[2], inside: col.s[3] };
    const pts = S[key].atoms.map((a) => [P(a), a[3]]).sort((u, v) => v[0][2] - u[0][2]);
    const rad = big ? S[key].r * sc : 6;
    ctx.save();
    for (const [[x, y, dep], kind] of pts) {
      ctx.globalAlpha = big ? 0.55 : 1;
      ctx.beginPath(); ctx.arc(x, y, rad * (1 - dep * 0.08), 0, 2 * Math.PI);
      ctx.fillStyle = kinds[kind]; ctx.fill();
      ctx.globalAlpha = 1; ctx.lineWidth = 1; ctx.strokeStyle = col.ink; ctx.stroke();
    }
    ctx.restore();
    const legend = Object.entries(kinds).filter(([k]) => S[key].atoms.some((a) => a[3] === k));
    legend.forEach(([k, c], i) => { ctx.fillStyle = c; ctx.fillRect(10, H - 18 - i * 16, 10, 10); text(ctx, { corner: 'corner (1/8 each)', face: 'face (1/2 each)', centre: 'body centre (whole)', inside: 'inside (whole)' }[k], 26, H - 13 - i * 16, { color: col.muted, size: 11 }); });
  };
  re();
}
