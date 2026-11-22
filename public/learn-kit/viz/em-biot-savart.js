// Magnetic field of a current, drawn as a grid of compass needles (the arrow end is the north pole). Choose a long
// straight wire (current out of the page, view from the end), one circular loop, or a solenoid (view cut through the
// axis). Needles come from adding up μ₀I dl × r̂/4πr² for every bit of wire. Reverse the current and every needle
// flips. Tap the picture to read B at that point.
import { canvas, text, row, slider, choice, button, readout, arrow, dot, fmt } from '../kit.js';

const MU = 1e-7; // μ0/4π
export default function (host) {
  let mode = 'wire', I = 3, Nt = 12, probe = [0.06, 0.05], grid = [];
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 270, label: 'Compass needles showing the magnetic field of a wire, a loop and a solenoid' });
  cv.c.style.cursor = 'crosshair';
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Source', [['wire', 'Straight wire'], ['loop', 'Circular loop'], ['sol', 'Solenoid']], mode, (v) => { mode = v; upd(); });
  let mag = 3, sgn = 1; slider(c2, { label: 'Current I', min: 0.5, max: 5, value: mag, step: 0.5, fmt: (x) => x.toFixed(1) + ' A', oninput: (x) => { mag = x; I = sgn * mag; upd(); } });
  button(c2, 'Reverse current', () => { sgn = -sgn; I = sgn * mag; upd(); });
  slider(c2, { label: 'Turns (solenoid)', min: 3, max: 30, value: Nt, step: 1, fmt: (x) => x, oninput: (x) => { Nt = x; upd(); } });
  const out = readout(host);
  const A = 0.04, LS = 0.12; // loop radius, solenoid half-length (m); the view spans ±0.12 m across
  const loopsAt = () => (mode === 'loop' ? [0] : Array.from({ length: Nt }, (_, i) => -LS + (i + 0.5) / Nt * 2 * LS));
  const B = (x, y) => { // field at (x, y) in the plane through the axis (x axis); wire: plane perpendicular to the wire
    if (mode === 'wire') { const r2 = x * x + y * y + 1e-6; return [-2e-7 * I * y / r2, 2e-7 * I * x / r2]; }
    let bx = 0, by = 0; const n = 48;
    for (const xc of loopsAt()) for (let k = 0; k < n; k++) { const f = (k + 0.5) / n * 2 * Math.PI, dl = A * 2 * Math.PI / n, rx = x - xc, ry = y - A * Math.cos(f), rz = -A * Math.sin(f), rr = Math.sqrt(rx * rx + ry * ry + rz * rz) + 1e-9;
      const lx = 0, ly = -Math.sin(f) * dl, lz = Math.cos(f) * dl; // dl × r
      const cxx = ly * rz - lz * ry, cyy = lz * rx - lx * rz; bx += MU * I * cxx / rr ** 3; by += MU * I * cyy / rr ** 3; }
    return [bx, by];
  };
  const W = 0.13, toPx = (x, y) => [cv.w / 2 + x / W * (cv.w / 2 - 6), cv.h / 2 - y / W * (cv.w / 2 - 6)], toM = (px, py) => [(px - cv.w / 2) / (cv.w / 2 - 6) * W, -(py - cv.h / 2) / (cv.w / 2 - 6) * W];
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(); probe = toM(e.clientX - b.left, e.clientY - b.top); upd(); });
  function upd() { grid = []; const nx = 11, ny = Math.max(5, Math.round(nx * cv.h / cv.w)); for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const x = (-W + (i + 0.5) / nx * 2 * W), y = (-W * cv.h / cv.w + (j + 0.5) / ny * 2 * W * cv.h / cv.w); grid.push([x, y, ...B(x, y)]); }
    const b = B(probe[0], probe[1]), mag = Math.hypot(b[0], b[1]);
    const f = mode === 'wire' ? `Wire: B = μ₀I/2πr; at the tap r = ${(Math.hypot(...probe) * 100).toFixed(1)} cm.` : mode === 'loop' ? `Loop (radius 4 cm): centre B = μ₀I/2a = <b>${(4e-7 * Math.PI * I / (2 * A) * 1e6).toFixed(1)} µT</b>; far away it falls like a dipole.` : `Solenoid (${Nt} turns, 24 cm): inside B ≈ μ₀nI = <b>${(4e-7 * Math.PI * Nt / (2 * LS) * I * 1e3).toFixed(2)} mT</b>, nearly uniform; outside it is small.`;
    out.innerHTML = `${f} At the tap point: |B| = <b>${fmt(mag * 1e6, 3)} µT</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    if (!grid.length) return;
    const mx = Math.max(...grid.map((g) => Math.hypot(g[2], g[3]))) || 1;
    for (const [x, y, bx, by] of grid) { const m = Math.hypot(bx, by); if (m < 1e-12) continue; const [px, py] = toPx(x, y), a = Math.atan2(-by, bx), L = 9 + 10 * Math.pow(m / mx, 0.35); ctx.globalAlpha = 0.35 + 0.65 * Math.pow(m / mx, 0.3);
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px - Math.cos(a) * L / 2, py - Math.sin(a) * L / 2); ctx.lineTo(px, py); ctx.stroke();
      ctx.strokeStyle = col.s[5]; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a) * L / 2, py + Math.sin(a) * L / 2); ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (mode === 'wire') { const [x, y] = toPx(0, 0); dot(ctx, x, y, 9, col.ink); text(ctx, I >= 0 ? '⊙' : '⊗', x, y, { color: col.panel, size: 13, align: 'center', weight: 700 }); }
    else { const xs = loopsAt(); xs.forEach((xc) => { const [x1, y1] = toPx(xc, A), [x2, y2] = toPx(xc, -A); dot(ctx, x1, y1, mode === 'loop' ? 8 : 4, col.ink); dot(ctx, x2, y2, mode === 'loop' ? 8 : 4, col.ink); if (mode === 'loop') { text(ctx, I >= 0 ? '⊗' : '⊙', x1, y1, { color: col.panel, size: 12, align: 'center' }); text(ctx, I >= 0 ? '⊙' : '⊗', x2, y2, { color: col.panel, size: 12, align: 'center' }); } }); }
    const [qx, qy] = toPx(probe[0], probe[1]); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(qx - 5, qy - 5, 10, 10);
    text(ctx, 'red end = north pole of the needle', 10, h - 10, { color: col.muted, size: 10.5 });
  };
  upd();
}
