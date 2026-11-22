// 1.5 Divergence and curl you can see. Pick a 2-D vector field: arrows show it, a small square probe shows the
// net flow out of the square (divergence) and a paddle wheel shows the spin (curl). Drag the probe or tap to move it.
import { canvas, text, arrow, row, choice, readout, fmt, loop } from '../../kit.js';

const FIELDS = {
  source: { name: 'Source: F = (x, y)', f: (x, y) => [x, y], div: () => 2, curl: () => 0 },
  rotation: { name: 'Rotation: F = (−y, x)', f: (x, y) => [-y, x], div: () => 0, curl: () => 2 },
  shear: { name: 'Shear flow: F = (y, 0)', f: (x, y) => [y, 0], div: () => 0, curl: () => -1 },
  saddle: { name: 'Saddle: F = (x, −y)', f: (x, y) => [x, -y], div: () => 0, curl: () => 0 },
  mixed: { name: 'F = (x², xy)', f: (x, y) => [x * x, x * y], div: (x) => 3 * x, curl: (x, y) => y },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 260, label: 'A vector field with a probe square and a paddle wheel' });
  let key = 'source', px = 0.8, py = 0.5, ang = 0;
  const ctl = row(host);
  choice(ctl, 'Field', Object.entries(FIELDS).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); show(); });
  const out = readout(host);
  const L = 2; // the plot spans -L..L
  const show = () => {
    const F = FIELDS[key], d = F.div(px, py), c = F.curl(px, py);
    out.innerHTML = `At (${fmt(px, 2)}, ${fmt(py, 2)}): divergence <b>${fmt(d, 3)}</b> (${d > 1e-9 ? 'more flows out than in: a source' : d < -1e-9 ? 'more flows in than out: a sink' : 'what flows in flows out'}), curl <b>${fmt(c, 3)}</b> (${c > 1e-9 ? 'the wheel turns anticlockwise' : c < -1e-9 ? 'the wheel turns clockwise' : 'the wheel does not turn'}). Tap the picture to move the probe.`;
  };
  cv.c.addEventListener('pointerdown', (e) => {
    const r = cv.c.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width * 2 - 1) * L;
    py = -((e.clientY - r.top) / r.height * 2 - 1) * L;
    cv.redraw(); show();
  });
  cv.draw = (ctx, w, h, col) => {
    const F = FIELDS[key];
    const sx = (x) => (x / L + 1) / 2 * w, sy = (y) => (1 - y / L) / 2 * h;
    let max = 0;
    const n = 13;
    const g = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = -L + (2 * L * (i + 0.5)) / n, y = -L + (2 * L * (j + 0.5)) / n;
      const v = F.f(x, y); g.push([x, y, v]); max = Math.max(max, Math.hypot(...v));
    }
    const cell = Math.min(w, h) / n * 0.8;
    for (const [x, y, [u, v]] of g) {
      const m = Math.hypot(u, v); if (m < 1e-9) continue;
      const s = cell * Math.sqrt(m / max);
      arrow(ctx, sx(x) - (u / m) * s / 2, sy(y) + (v / m) * s / 2, sx(x) + (u / m) * s / 2, sy(y) - (v / m) * s / 2, col.muted, 1.3, 5);
    }
    // probe square
    const a = 0.35, X = sx(px), Y = sy(py), A = (a / (2 * L)) * w;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(X - A, Y - A, 2 * A, 2 * A);
    // paddle wheel
    ctx.save(); ctx.translate(X, Y); ctx.rotate(-ang);
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5;
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(A * 0.85 * Math.cos(k * Math.PI / 2), A * 0.85 * Math.sin(k * Math.PI / 2)); ctx.stroke(); }
    ctx.restore();
    text(ctx, 'square = flux out (divergence) · wheel = spin (curl)', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  loop(host, (dt) => { const c = FIELDS[key].curl(px, py); if (Math.abs(c) > 1e-9) { ang += c * 0.6 * (dt ?? 0.016); cv.redraw(); } });
  cv.redraw(); show();
}
