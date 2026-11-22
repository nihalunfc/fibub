// Electric field lines and equipotentials of charges you can drag. Pick a preset or add + and - charges, drag any
// charge, and switch field lines, equipotential lines and arrows on or off. Move the pointer over the picture to read
// the potential V and field E at that point. Lines start on + charges and end on - charges, never cross, and
// equipotentials always cut them at right angles.
import { canvas, text, row, button, choice, readout, dot, arrow, fmt, touchGuard } from '../kit.js';

const PRESETS = {
  dipole: [[-0.25, 0, 2], [0.25, 0, -2]], same: [[-0.25, 0, 2], [0.25, 0, 2]], two1: [[-0.25, 0, 4], [0.25, 0, -2]],
  three: [[-0.28, 0.14, 2], [0.28, 0.14, 2], [0, -0.2, -3]], one: [[0, 0, 2]],
};
const LEVELS = [-8, -5, -3, -2, -1, -0.5, 0.5, 1, 2, 3, 5, 8];
export default function (host) {
  let Q = PRESETS.dipole.map((c) => [...c]), show = { lines: true, eq: true, arrows: false }, drag = -1, probe = null;
  const cv = canvas(host, { aspect: 0.75, max: 400, min: 280, label: 'Electric field lines and equipotentials of draggable point charges' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Charges', [['dipole', '+ −'], ['same', '+ +'], ['two1', '+2 −1'], ['three', 'three'], ['one', 'single']], 'dipole', (v) => { Q = PRESETS[v].map((c) => [...c]); cv.redraw(); upd(); });
  button(c2, 'Add +', () => { Q.push([(Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.3, 2]); cv.redraw(); upd(); });
  button(c2, 'Add −', () => { Q.push([(Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.3, -2]); cv.redraw(); upd(); });
  button(c2, 'Remove last', () => { Q.pop(); cv.redraw(); upd(); });
  ['lines', 'eq', 'arrows'].forEach((k, i) => button(c2, ['Field lines', 'Equipotentials', 'Arrows'][i], (e) => { show[k] = !show[k]; e.target.setAttribute('aria-pressed', show[k]); cv.redraw(); }).setAttribute('aria-pressed', show[k]));
  const out = readout(host);
  const S = () => Math.min(cv.w, cv.h * 1.2); // pixels per model unit ×1 (model x in [-0.5,0.5])
  const toPx = (c) => [cv.w / 2 + c[0] * S() * 1.7, cv.h / 2 - c[1] * S() * 1.7];
  const field = (px, py) => { let ex = 0, ey = 0, v = 0; for (const c of Q) { const [cx, cy] = toPx(c), dx = (px - cx) / (S() * 0.5), dy = (py - cy) / (S() * 0.5), r2 = dx * dx + dy * dy + 1e-4, r = Math.sqrt(r2); ex += c[2] * dx / (r2 * r); ey += c[2] * dy / (r2 * r); v += c[2] / r; } return [ex, ey, v]; };
  touchGuard(cv.c, (x, y) => Q.some((c) => { const [cx, cy] = toPx(c); return Math.hypot(cx - x, cy - y) < 22; }));
  const pos = (e) => { const b = cv.c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); drag = -1; let best = 22; Q.forEach((c, i) => { const [cx, cy] = toPx(c), d = Math.hypot(cx - x, cy - y); if (d < best) { best = d; drag = i; } }); if (drag >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { const [x, y] = pos(e); probe = [x, y]; if (drag >= 0) { Q[drag][0] = Math.max(-0.5, Math.min(0.5, (x - cv.w / 2) / (S() * 1.7))); Q[drag][1] = Math.max(-0.4, Math.min(0.4, -(y - cv.h / 2) / (S() * 1.7))); } cv.redraw(); upd(); });
  cv.c.addEventListener('pointerup', () => { drag = -1; });
  function upd() {
    const net = Q.reduce((s, c) => s + c[2], 0);
    let t = `Net charge ${net > 0 ? '+' : ''}${net} (units of q). `;
    if (probe) { const [ex, ey, v] = field(probe[0], probe[1]); t += `At the pointer: V = ${fmt(v, 3)}, |E| = ${fmt(Math.hypot(ex, ey), 3)} (arbitrary units).`; } else t += 'Move the pointer over the picture to read V and E.';
    out.textContent = t;
  }
  cv.draw = (ctx, w, h, col) => {
    const cell = 7, nx = Math.ceil(w / cell) + 1, ny = Math.ceil(h / cell) + 1, V = [];
    if (show.eq) {
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) V.push(field(i * cell, j * cell)[2]);
      ctx.lineWidth = 1; 
      for (const L of LEVELS) {
        ctx.strokeStyle = L > 0 ? col.s[5] : col.s[0]; ctx.globalAlpha = 0.55; ctx.beginPath();
        for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
          const a = V[j * nx + i] - L, b = V[j * nx + i + 1] - L, c = V[(j + 1) * nx + i + 1] - L, d = V[(j + 1) * nx + i] - L, pts = [];
          const X = i * cell, Y = j * cell;
          if (a * b < 0) pts.push([X + cell * a / (a - b), Y]); if (b * c < 0) pts.push([X + cell, Y + cell * b / (b - c)]);
          if (d * c < 0) pts.push([X + cell * d / (d - c), Y + cell]); if (a * d < 0) pts.push([X, Y + cell * a / (a - d)]);
          if (pts.length >= 2) { ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (show.lines) {
      const pos = Q.filter((c) => c[2] > 0), src = pos.length ? pos : Q, sgn = pos.length ? 1 : -1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.85;
      for (const c of src) {
        const [cx, cy] = toPx(c), n = Math.round(Math.abs(c[2]) * 6);
        for (let k = 0; k < n; k++) {
          const a = (k + 0.5) / n * Math.PI * 2; let x = cx + 8 * Math.cos(a), y = cy + 8 * Math.sin(a);
          ctx.beginPath(); ctx.moveTo(x, y);
          for (let s = 0; s < 500; s++) {
            const [ex, ey] = field(x, y), m = Math.hypot(ex, ey) || 1;
            x += sgn * ex / m * 3; y += sgn * ey / m * 3; ctx.lineTo(x, y);
            if (x < 0 || x > w || y < 0 || y > h || Q.some((o) => o !== c && o[2] * c[2] < 0 && Math.hypot(toPx(o)[0] - x, toPx(o)[1] - y) < 6)) break;
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
    if (show.arrows) for (let y = 20; y < h; y += 34) for (let x = 20; x < w; x += 34) { const [ex, ey] = field(x, y), m = Math.hypot(ex, ey); if (m > 0) { const L = Math.min(14, 5 + 5 * Math.log10(1 + m * 5)); arrow(ctx, x - ex / m * L / 2, y - ey / m * L / 2, x + ex / m * L / 2, y + ey / m * L / 2, col.s[2], 1.6, 5); } }
    Q.forEach((c) => { const [x, y] = toPx(c), r = 7 + Math.abs(c[2]) * 1.5; dot(ctx, x, y, r, c[2] > 0 ? col.s[5] : col.s[0], col.panel); text(ctx, c[2] > 0 ? '+' : '−', x, y, { color: '#fff', size: 14, weight: 700, align: 'center' }); });
    text(ctx, 'Drag the charges', 10, h - 10, { color: col.muted, size: 11 });
  };
  upd();
}
