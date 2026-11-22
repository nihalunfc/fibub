// Cubic unit cells: simple, body-centred and face-centred. The cube is drawn in a slanted (oblique) view with
// corner, body and face atoms coloured by how much of each sits inside the cell (1/8, 1, 1/2). Set the edge length
// and molar mass to get the radius, packing efficiency and density: d = Z M / (N_A a³).
import { canvas, text, row, slider, choice, readout, fmt, line } from '../../kit.js';

const NA = 6.022e23;
const CELLS = {
  sc: { name: 'Simple', Z: 1, cn: 6, r: (a) => a / 2, rr: 'r = a/2', pe: 52.4, eg: 'polonium' },
  bcc: { name: 'Body-centred', Z: 2, cn: 8, r: (a) => (Math.sqrt(3) * a) / 4, rr: 'r = √3 a/4', pe: 68, eg: 'Na, K, Fe (α), Cr' },
  fcc: { name: 'Face-centred', Z: 4, cn: 12, r: (a) => a / (2 * Math.sqrt(2)), rr: 'r = a/(2√2)', pe: 74, eg: 'Cu, Ag, Au, Al' },
};
export default function (host) {
  let key = 'fcc', a = 361, M = 63.5;
  const cv = canvas(host, { aspect: 0.75, max: 400, min: 280, label: 'A cubic unit cell with its corner, face and body atoms' });
  const ctl = row(host);
  choice(ctl, 'Cell', Object.entries(CELLS).map(([k, c]) => [k, c.name]), key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Edge a', min: 250, max: 600, step: 1, value: a, fmt: (v) => `${v} pm`, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'Molar mass', min: 20, max: 210, step: 0.5, value: M, fmt: (v) => `${v} g/mol`, oninput: (v) => { M = v; upd(); } });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const c = CELLS[key], d = (c.Z * M) / (NA * (a * 1e-10) ** 3);
    out.innerHTML = `${c.name} cubic (${c.eg}): Z = ${c.Z} atoms per cell, coordination number ${c.cn}, ${c.rr} = ${fmt(c.r(a))} pm, packing efficiency ${c.pe}%. Density d = ZM/(N_A a³) = ${c.Z} × ${M} / (6.022×10²³ × (${a}×10⁻¹⁰ cm)³) = <b>${fmt(d)} g/cm³</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const c = CELLS[key], s = Math.min(w * 0.42, h * 0.62), ox = w * 0.3, oy = h * 0.82, dx = s * 0.45, dy = -s * 0.32;
    const P = (x, y, z) => [ox + x * s + z * dx, oy - y * s + z * dy];
    const E = [[0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 1], [1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 0, 0], [1, 1, 0, 1, 1, 1], [0, 1, 1, 0, 1, 0], [0, 1, 1, 0, 0, 1], [0, 1, 1, 1, 1, 1], [1, 0, 1, 0, 0, 1], [1, 0, 1, 1, 0, 0], [1, 0, 1, 1, 1, 1]];
    for (const [x1, y1, z1, x2, y2, z2] of E) line(ctx, [P(x1, y1, z1), P(x2, y2, z2)], col.muted, 1.4);
    const atoms = [];
    for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) atoms.push([x, y, z, 'corner']);
    if (key === 'bcc') atoms.push([0.5, 0.5, 0.5, 'body']);
    if (key === 'fcc') for (const f of [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]]) atoms.push([...f, 'face']);
    atoms.sort((p, q) => q[2] - p[2]);
    const colr = { corner: col.s[0], body: col.s[2], face: col.s[1] };
    const rad = Math.max(5, s * 0.07);
    for (const [x, y, z, t] of atoms) {
      const [px, py] = P(x, y, z);
      ctx.beginPath(); ctx.arc(px, py, rad * (1 - z * 0.15), 0, Math.PI * 2);
      ctx.fillStyle = colr[t]; ctx.globalAlpha = 1 - z * 0.25; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // the line along which atoms touch
    const touch = key === 'sc' ? [P(0, 0, 0), P(1, 0, 0)] : key === 'bcc' ? [P(0, 0, 0), P(1, 1, 1)] : [P(0, 0, 0), P(1, 1, 0)];
    line(ctx, touch, col.s[3], 2, [5, 4]);
    const lx = w * 0.66;
    text(ctx, `${c.name} cubic`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    const tally = key === 'sc' ? ['8 corners × 1/8 = 1'] : key === 'bcc' ? ['8 corners × 1/8 = 1', '1 body centre × 1 = 1'] : ['8 corners × 1/8 = 1', '6 faces × 1/2 = 3'];
    tally.forEach((t, i) => text(ctx, t, lx, 50 + i * 20, { color: i === 0 ? col.s[0] : key === 'bcc' ? col.s[2] : col.s[1], size: 12 }));
    text(ctx, `Z = ${c.Z}`, lx, 54 + tally.length * 20, { color: col.ink, size: 13, weight: 700 });
    text(ctx, `atoms touch along the`, lx, 100 + tally.length * 20, { color: col.s[3], size: 11 });
    text(ctx, key === 'sc' ? 'edge: a = 2r' : key === 'bcc' ? 'body diagonal: √3a = 4r' : 'face diagonal: √2a = 4r', lx, 116 + tally.length * 20, { color: col.s[3], size: 11, weight: 600 });
  };
  upd();
}
