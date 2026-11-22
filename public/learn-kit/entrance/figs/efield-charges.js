// Electric charges and fields: field lines of two point charges. Set each charge with a slider; lines start on
// positive charges and end on negative ones (or at infinity), crowd where the field is strong and never cross.
// The null point (E = 0) on the line joining the charges is marked when it exists.
import { canvas, row, slider, readout, dot, text, line, arrow } from '../../kit.js';

export default function (host) {
  let q1 = 2, q2 = -1;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 240, label: 'Electric field lines of two point charges' });
  const ctl = row(host);
  const f = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + ' µC';
  slider(ctl, { label: 'Left charge', min: -4, max: 4, step: 1, value: q1, fmt: f, oninput: (v) => { q1 = v; upd(); } });
  slider(ctl, { label: 'Right charge', min: -4, max: 4, step: 1, value: q2, fmt: f, oninput: (v) => { q2 = v; upd(); } });
  const out = readout(host);
  const Q = () => [[-1, 0, q1], [1, 0, q2]].filter((c) => c[2] !== 0);
  const E = (x, y) => {
    let ex = 0, ey = 0;
    for (const [cx, cy, q] of Q()) { const dx = x - cx, dy = y - cy, r2 = dx * dx + dy * dy, r3 = r2 * Math.sqrt(r2); ex += (q * dx) / r3; ey += (q * dy) / r3; }
    return [ex, ey];
  };
  // null point on the x axis (charges at x = −1 and +1, separation 2 units)
  const nullPoint = () => {
    if (Q().length < 2) return null;
    let px = -12, pe = E(px, 0)[0];
    for (let x = -12 + 0.002; x < 12; x += 0.002) {
      const e = E(x, 0)[0];
      const nearQ = Math.abs(x + 1) < 0.01 || Math.abs(x - 1) < 0.01 || (px < -1 && x > -1) || (px < 1 && x > 1);
      if (!nearQ && Math.sign(e) !== Math.sign(pe)) return x;
      px = x; pe = e;
    }
    return null;
  };
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const x = nullPoint();
    if (!q1 && !q2) { out.textContent = 'No charges, no field.'; return; }
    if (x === null) { out.innerHTML = Q().length < 2 ? 'One charge: the lines spread out evenly in all directions (radially).' : 'Equal and opposite charges (a dipole): no point on the line where the field is zero.'; return; }
    const d1 = Math.abs(x + 1) / 2;
    out.innerHTML = `Null point (E = 0) at <b>${d1.toFixed(2)} × separation</b> from the left charge, ${x > -1 && x < 1 ? 'between the charges' : 'outside them, beyond the smaller charge'}${Math.abs(x) > 3.2 ? ' (off the picture)' : ''}. Lines leaving: ${Math.max(0, q1) * 6 + Math.max(0, q2) * 6}, ending: ${Math.max(0, -q1) * 6 + Math.max(0, -q2) * 6}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const S = w / 6.4, X0 = w / 2, Y0 = h / 2, HX = 3.4, HY = h / 2 / S + 0.2;
    const P = (x, y) => [X0 + x * S, Y0 - y * S];
    const qs = Q();
    const trace = (x, y, sgn) => {
      const pts = [P(x, y)];
      let end = null;
      for (let i = 0; i < 1600; i++) {
        const [ex, ey] = E(x, y), m = Math.hypot(ex, ey) || 1;
        x += (sgn * 0.02 * ex) / m; y += (sgn * 0.02 * ey) / m;
        pts.push(P(x, y));
        if (Math.abs(x) > HX || Math.abs(y) > HY) break;
        const hit = qs.find(([cx, cy]) => Math.hypot(x - cx, y - cy) < 0.07);
        if (hit && i > 5) { end = hit; break; }
      }
      return { pts, end };
    };
    const drawLine = (pts, sgn) => {
      line(ctx, pts, col.muted, 1.3);
      const k = Math.floor(pts.length * 0.35);
      if (pts.length > 12) { const [a, b] = sgn > 0 ? [pts[k], pts[k + 3]] : [pts[k + 3], pts[k]]; arrow(ctx, a[0], a[1], b[0], b[1], col.muted, 1.3, 6); }
    };
    for (const [cx, cy, q] of qs) {
      const nl = Math.abs(q) * 6, sgn = Math.sign(q);
      for (let i = 0; i < nl; i++) {
        const a = (2 * Math.PI * (i + 0.5)) / nl, t = trace(cx + 0.1 * Math.cos(a), cy + 0.1 * Math.sin(a), sgn);
        if (sgn < 0 && t.end && t.end[2] > 0) continue; // already drawn from the positive charge
        drawLine(t.pts, sgn);
      }
    }
    const xn = nullPoint();
    if (xn !== null && Math.abs(xn) < 3.2) { const [px, py] = P(xn, 0); dot(ctx, px, py, 5, col.panel, col.good); text(ctx, 'E = 0', px, py - 14, { color: col.good, size: 11, weight: 600, align: 'center', halo: col.panel }); }
    for (const [cx, cy, q] of qs) {
      const [px, py] = P(cx, cy), c = q > 0 ? col.s[3] : col.s[0];
      dot(ctx, px, py, 8 + Math.abs(q) * 1.5, c);
      text(ctx, q > 0 ? '+' : '−', px, py + 1, { color: '#fff', size: 15, weight: 700, align: 'center' });
    }
    text(ctx, 'Lines start on + and end on −; closer lines = stronger field', 10, h - 12, { color: col.muted, size: 11 });
  };
  upd();
}
