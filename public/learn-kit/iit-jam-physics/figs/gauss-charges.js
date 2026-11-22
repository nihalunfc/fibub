// 4.1 / 4.2 Field lines, a Gaussian surface and equipotentials for a few point charges (a slice through 3-D charges).
// Pick a charge set. Tap to move the dashed Gaussian surface (or the probe); the slider sets its radius. The readout
// gives the charge inside and the flux, Q_enc/eps0, whatever the size or position. data-mode="potential" on the
// figure starts with equipotentials and a probe that reads V and |E|.
import { canvas, text, arrow, row, choice, slider, readout, fmt, dot } from '../../kit.js';

const SETS = {
  single: { name: '+q', q: [[0, 0, 1]] },
  dipole: { name: '+q, −q', q: [[-0.8, 0, 1], [0.8, 0, -1]] },
  like: { name: '+q, +q', q: [[-0.8, 0, 1], [0.8, 0, 1]] },
  uneven: { name: '+2q, −q', q: [[-0.7, 0, 2], [0.7, 0, -1]] },
};
const XB = 2.6, YB = 2.0; // world bounds used for tracing and contours

const field = (Q, x, y) => {
  let ex = 0, ey = 0;
  for (const [a, b, q] of Q) { const dx = x - a, dy = y - b, r2 = dx * dx + dy * dy, r3 = r2 * Math.sqrt(r2) || 1e-9; ex += q * dx / r3; ey += q * dy / r3; }
  return [ex, ey];
};
const pot = (Q, x, y) => Q.reduce((s, [a, b, q]) => s + q / (Math.hypot(x - a, y - b) || 1e-9), 0);

function traceLines(Q) {
  const lines = [];
  for (const [a, b, q] of Q) {
    if (q <= 0) continue;
    const n = 8 * q;
    for (let k = 0; k < n; k++) {
      const t = (2 * Math.PI * (k + 0.5)) / n;
      let x = a + 0.06 * Math.cos(t), y = b + 0.06 * Math.sin(t);
      const pts = [[x, y]];
      for (let s = 0; s < 900; s++) {
        const [e1x, e1y] = field(Q, x, y), m1 = Math.hypot(e1x, e1y) || 1;
        const hx = x + 0.01 * e1x / m1, hy = y + 0.01 * e1y / m1;
        const [e2x, e2y] = field(Q, hx, hy), m2 = Math.hypot(e2x, e2y) || 1;
        x += 0.02 * e2x / m2; y += 0.02 * e2y / m2;
        pts.push([x, y]);
        if (Math.abs(x) > XB * 1.3 || Math.abs(y) > YB * 1.5) break;
        if (Q.some(([c, d, p]) => p < 0 && Math.hypot(x - c, y - d) < 0.05)) break;
      }
      lines.push(pts);
    }
  }
  return lines;
}

// Marching squares: line segments of V = level on a grid.
function contours(Q, levels) {
  const nx = 130, ny = 100, dx = (2 * XB) / nx, dy = (2 * YB) / ny, V = [];
  for (let j = 0; j <= ny; j++) { const r = []; for (let i = 0; i <= nx; i++) r.push(pot(Q, -XB + i * dx, -YB + j * dy)); V.push(r); }
  const segs = [];
  for (const L of levels) {
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const c = [V[j][i], V[j][i + 1], V[j + 1][i + 1], V[j + 1][i]];
      if (c.some((v) => Math.abs(v) > 12)) continue; // skip cells touching a charge
      const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], cut = [];
      for (let e = 0; e < 4; e++) {
        const a = c[e], b = c[(e + 1) % 4];
        if ((a - L) * (b - L) < 0) { const f = (L - a) / (b - a), [x0, y0] = P[e], [x1, y1] = P[(e + 1) % 4]; cut.push([-XB + (x0 + f * (x1 - x0)) * dx, -YB + (y0 + f * (y1 - y0)) * dy]); }
      }
      if (cut.length >= 2) segs.push([cut[0], cut[1], L]);
      if (cut.length === 4) segs.push([cut[2], cut[3], L]);
    }
  }
  return segs;
}

export default function (host) {
  const potMode = host.dataset.mode === 'potential';
  const cv = canvas(host, { aspect: 0.77, max: 440, min: 260, label: 'Field lines of point charges with a Gaussian surface and equipotentials' });
  let key = potMode ? 'dipole' : 'single', show = potMode ? 'equi' : 'gauss', gx = 0, gy = 0, gr = 0.6, px = 0.4, py = 0.9;
  let lines = [], segs = [];
  const rebuild = () => { const Q = SETS[key].q; lines = traceLines(Q); segs = contours(Q, [-3, -1.6, -1, -0.6, -0.35, 0, 0.35, 0.6, 1, 1.6, 3]); };
  const ctl = row(host);
  choice(ctl, 'Charges', Object.entries(SETS).map(([k, v]) => [k, v.name]), key, (v) => { key = v; rebuild(); cv.redraw(); say(); });
  choice(ctl, 'Show', [['gauss', 'Gaussian surface'], ['equi', 'Equipotentials'], ['both', 'Both']], show, (v) => { show = v; cv.redraw(); say(); });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Surface radius', min: 0.2, max: 1.8, step: 0.05, value: gr, fmt: (v) => fmt(v, 2) + ' d', oninput: (v) => { gr = v; cv.redraw(); say(); } });
  const out = readout(host);
  const say = () => {
    const Q = SETS[key].q;
    const parts = [];
    if (show !== 'equi') {
      const inside = Q.filter(([a, b]) => Math.hypot(a - gx, b - gy) < gr);
      const qin = inside.reduce((s, c) => s + c[2], 0);
      const list = inside.length ? inside.map((c) => (c[2] > 0 ? '+' : '−') + (Math.abs(c[2]) === 1 ? '' : Math.abs(c[2])) + 'q').join(' and ') : 'no charge';
      parts.push(`Inside the surface: ${list}. Flux out = Q<sub>enc</sub>/ε<sub>0</sub> = <b>${qin === 0 ? '0' : (qin > 0 ? '+' : '−') + (Math.abs(qin) === 1 ? '' : Math.abs(qin)) + 'q/ε<sub>0</sub>'}</b>, whatever the radius or position${qin === 0 && Q.some(([a, b]) => Math.hypot(a - gx, b - gy) < gr + 0.6) ? ' (lines that enter also leave)' : ''}.`);
    }
    if (show !== 'gauss') {
      const [ex, ey] = field(Q, px, py);
      parts.push(`Probe (ring): V = <b>${fmt(pot(Q, px, py), 3)}</b>, |E| = <b>${fmt(Math.hypot(ex, ey), 3)}</b> (units kq/d and kq/d²). The field crosses every equipotential at right angles.`);
    }
    out.innerHTML = parts.join(' ') + ' Tap the picture to move the ' + (show === 'equi' ? 'probe.' : show === 'gauss' ? 'surface.' : 'surface and probe.');
  };
  let S = 1, W = 1, H = 1;
  const toWorld = (cx, cy) => [(cx - W / 2) / S, -(cy - H / 2) / S];
  cv.c.addEventListener('pointerdown', (e) => {
    const r = cv.c.getBoundingClientRect();
    const [x, y] = toWorld((e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height));
    if (show !== 'equi') { gx = x; gy = y; }
    if (show !== 'gauss') { px = x; py = y; }
    cv.redraw(); say();
  });
  cv.draw = (ctx, w, h, col) => {
    W = w; H = h; S = Math.min(w / (2 * XB), h / (2 * YB));
    const X = (x) => w / 2 + x * S, Y = (y) => h / 2 - y * S;
    const Q = SETS[key].q;
    if (show !== 'gauss') {
      ctx.save(); ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]);
      for (const [[x0, y0], [x1, y1], L] of segs) {
        ctx.strokeStyle = L > 0 ? col.s[3] : L < 0 ? col.s[0] : col.muted;
        ctx.beginPath(); ctx.moveTo(X(x0), Y(y0)); ctx.lineTo(X(x1), Y(y1)); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.75;
    for (const pts of lines) {
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke();
      const m = Math.min(pts.length - 2, 45);
      if (m > 2) arrow(ctx, X(pts[m - 2][0]), Y(pts[m - 2][1]), X(pts[m][0]), Y(pts[m][1]), col.ink, 1.3, 7);
    }
    ctx.restore();
    if (show !== 'equi') {
      ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.setLineDash([7, 5]);
      ctx.beginPath(); ctx.arc(X(gx), Y(gy), gr * S, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
    }
    for (const [a, b, q] of Q) {
      dot(ctx, X(a), Y(b), 9 + 2 * Math.abs(q), q > 0 ? col.s[3] : col.s[0], col.panel);
      text(ctx, q > 0 ? '+' : '−', X(a), Y(b) + 1, { color: '#fff', size: 15, weight: 700, align: 'center', fit: false });
    }
    if (show !== 'gauss') { ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(px), Y(py), 6, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
    text(ctx, show === 'gauss' ? 'dashed circle = slice of a Gaussian sphere' : 'dotted = equipotentials (warm +V, cool −V)', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  rebuild(); cv.redraw(); say();
}
