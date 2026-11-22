// 4.3 Method of images. A charge +q at height d above a grounded conducting plane. Field lines are traced from the
// charge using the field of q and its image −q; they all end on the plane, meeting it at right angles. A switch
// shows the (fictitious) image and the lines continuing to it. The lower panel plots the induced surface charge
// density σ(x) = −q d / 2π(x² + d²)^{3/2}. Lengths in units of a fixed scale a; σ in units of q/a².
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 330, label: 'A point charge above a grounded plane with its field lines, its image charge and the induced surface charge' });
  let d = 1.5, show = 'no';
  const ctl = row(host);
  slider(ctl, { label: 'Height d', min: 0.5, max: 3, step: 0.05, value: d, fmt: (v) => fmt(v, 3) + ' a', oninput: (v) => { d = v; cv.redraw(); say(); } });
  choice(ctl, 'Image', [['no', 'Hide'], ['yes', 'Show']], show, (v) => { show = v; cv.redraw(); });
  const out = readout(host);
  const say = () => {
    out.innerHTML = `Force on q: <b>kq²/(2d)² = ${fmt(1 / (4 * d * d), 3)}</b> kq²/a², towards the plane. Peak induced density under the charge: <b>−q/2πd² = ${fmt(-1 / (2 * Math.PI * d * d), 3)}</b> q/a². Half of the induced charge lies within r = √3 d = ${fmt(Math.sqrt(3) * d, 3)} a; all of it adds up to exactly −q.`;
  };

  // field of +q at (0,d) and -q at (0,-d)
  const field = (x, y) => {
    const dx = x, y1 = y - d, y2 = y + d, r1 = Math.pow(dx * dx + y1 * y1, 1.5), r2 = Math.pow(dx * dx + y2 * y2, 1.5);
    return [dx / r1 - dx / r2, y1 / r1 - y2 / r2];
  };
  function trace(a0, full) {
    const pts = []; let x = 0.08 * Math.cos(a0), y = d + 0.08 * Math.sin(a0);
    for (let i = 0; i < 1500; i++) {
      pts.push([x, y]);
      const [ex, ey] = field(x, y), m = Math.hypot(ex, ey) || 1;
      x += 0.025 * ex / m; y += 0.025 * ey / m;
      if (Math.abs(x) > 5 || y > 5.5) break;
      if (!full && y <= 0) { pts.push([x, 0]); break; }
      if (full && Math.hypot(x, y + d) < 0.08) break;
    }
    return pts;
  }

  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.62;
    const sx = (x) => w / 2 + x * (w / 9), sy = (y) => top * 0.62 - y * (top * 0.55 / 4.2);
    const yPlane = sy(0);
    // conductor
    ctx.save(); ctx.fillStyle = col.soft; ctx.fillRect(0, yPlane, w, top - yPlane); ctx.restore();
    line(ctx, [[0, yPlane], [w, yPlane]], col.ink, 2.5);
    text(ctx, 'grounded metal, V = 0', 8, yPlane + 12, { color: col.muted, size: 11 });
    // field lines
    const N = 20;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, show === 'yes' ? top : yPlane); ctx.clip();
    for (let i = 0; i < N; i++) {
      const a = (i + 0.5) * 2 * Math.PI / N;
      const real = trace(a, false);
      line(ctx, real.map(([x, y]) => [sx(x), sy(y)]), col.s[0], 1.5);
      if (show === 'yes') {
        const full = trace(a, true).filter(([, y]) => y < 0);
        line(ctx, full.map(([x, y]) => [sx(x), sy(y)]), col.s[0], 1, [4, 4]);
      }
    }
    ctx.restore();
    // induced charge marks along the plane: density of minus signs ~ sigma
    for (let x = -4.4; x <= 4.4; x += 0.2) {
      const s = d / Math.pow(x * x + d * d, 1.5);
      if (s * d * d > 0.12) text(ctx, '−', sx(x), yPlane + 3, { color: col.s[3], size: 9 + 6 * Math.min(1, s * d * d), weight: 700, align: 'center', fit: false });
    }
    dot(ctx, sx(0), sy(d), 8, col.s[1]);
    text(ctx, '+q', sx(0) + 12, sy(d) - 10, { color: col.ink, size: 13, weight: 700 });
    if (show === 'yes') {
      dot(ctx, sx(0), sy(-d), 8, col.panel, col.s[3]);
      text(ctx, '−q (image)', sx(0) + 12, sy(-d) + 10, { color: col.s[3], size: 12, weight: 700 });
    }
    // sigma panel
    const g = axes(ctx, w, h, col, { x: [-4.5, 4.5], y: [-0.7, 0], t: top + 14, b: 38, xlabel: 'distance along the plane (a)', ylabel: 'σ (q/a²)', yt: [-0.6, -0.3, 0] });
    const pts = [];
    for (let x = -4.5; x <= 4.5; x += 0.03) pts.push([g.X(x), g.Y(-d / (2 * Math.PI * Math.pow(x * x + d * d, 1.5)))]);
    line(ctx, pts, col.s[3], 2.5);
    const r50 = Math.sqrt(3) * d;
    if (r50 < 4.5) { line(ctx, [[g.X(-r50), g.T], [g.X(-r50), g.B]], col.muted, 1, [3, 4]); line(ctx, [[g.X(r50), g.T], [g.X(r50), g.B]], col.muted, 1, [3, 4]); }
  };
  cv.redraw(); say();
}
