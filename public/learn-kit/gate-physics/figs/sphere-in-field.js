// 3.1 / 3.4 A sphere in a uniform field, solved by separation of variables in spherical coordinates (only l = 1).
// Outside V = -E0 r cos(theta) + K E0 R^3 cos(theta) / r^2, inside V = -E_in r cos(theta), with K = (er - 1)/(er + 2)
// and E_in = 3 E0/(er + 2); a conductor is the limit er -> infinity (K = 1, E_in = 0). Field lines are traced from
// the left edge through the sphere; the + and - marks on the surface show sigma = 3 eps0 E0 K cos(theta).
// A switch shows the two Legendre pieces separately: the uniform field alone, or the induced dipole alone.
import { canvas, line, text, row, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Field lines around a dielectric or conducting sphere in a uniform field, with the induced surface charge' });
  let er = 4, show = 'all';
  const ctl = row(host);
  choice(ctl, 'Sphere', [['1', 'ε = 1'], ['2', 'ε = 2'], ['4', 'ε = 4'], ['20', 'ε = 20'], ['cond', 'Metal']], '4', (v) => { er = v === 'cond' ? Infinity : +v; cv.redraw(); say(); });
  choice(ctl, 'Show', [['all', 'Total'], ['l1', 'Dipole part']], show, (v) => { show = v; cv.redraw(); });
  const out = readout(host);
  const Kf = () => (er === Infinity ? 1 : (er - 1) / (er + 2));
  const Ein = () => (er === Infinity ? 0 : 3 / (er + 2));
  const say = () => {
    const K = Kf();
    out.innerHTML = `Inside: uniform field <b>${fmt(Ein(), 3)} E₀</b>. Induced dipole p = 4πε₀R³E₀ × <b>${fmt(K, 3)}</b>. Surface charge σ = 3ε₀E₀ × ${fmt(K, 3)} cos θ${er === Infinity ? ' (free charge on the metal)' : ' (bound charge)'}. Field just outside at the poles: <b>${fmt(1 + 2 * K, 3)} E₀</b>.`;
  };
  // field in units of E0, R = 1; uniform field along +x on screen (the z axis of the maths)
  const field = (x, y) => {
    const r2 = x * x + y * y, K = Kf(), uni = show === 'all' ? 1 : 0;
    if (r2 < 1) return show === 'all' ? [Ein(), 0] : [Ein() - 1, 0];
    const r5 = Math.pow(r2, 2.5);
    // dipole p along x: E = K (3 (p.r) r - r^2 p)/r^5 with p = 1
    return [uni + K * (3 * x * x - r2) / r5, K * (3 * x * y) / r5];
  };
  cv.draw = (ctx, w, h, col) => {
    const S = Math.min(w / 7.2, h / 5.2), cx = w / 2, cy = h / 2;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    // sphere
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, S, 0, 2 * Math.PI); ctx.fillStyle = er === Infinity ? col.line : col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    // field lines
    const N = 15, ext = 3.4;
    for (let i = 0; i < N; i++) {
      const y0 = -2.3 + (4.6 * i) / (N - 1);
      let x = -ext, y = y0;
      const pts = [];
      if (show === 'l1') { // dipole lines: start on a small circle around the sphere's right pole region
        const a = (i + 0.5) * Math.PI / N - Math.PI / 2; x = 1.02 * Math.cos(a); y = 1.02 * Math.sin(a);
      }
      for (let k = 0; k < 2200; k++) {
        pts.push([X(x), Y(y)]);
        const [ex, ey] = field(x, y), m = Math.hypot(ex, ey);
        if (m < 1e-6) break;
        x += 0.02 * ex / m; y += 0.02 * ey / m;
        if (x > ext || Math.abs(y) > 2.7 || x < -ext - 0.01) break;
        if (er === Infinity && show === 'all' && x * x + y * y < 1) { pts.push([X(x), Y(y)]); break; }
        if (show === 'l1' && k > 5 && x * x + y * y < 1) break;
      }
      line(ctx, pts, col.s[0], 1.5);
      if (er === Infinity && show === 'all') { // lines leave the right side of the metal
        let xx = -x, yy = y; const p2 = [];
        for (let k = 0; k < 2200; k++) { p2.push([X(xx), Y(yy)]); const [ex, ey] = field(xx, yy), m = Math.hypot(ex, ey); if (m < 1e-6) break; xx += 0.02 * ex / m; yy += 0.02 * ey / m; if (xx > ext || Math.abs(yy) > 2.7) break; }
        if (pts.length && Math.hypot(pts[pts.length - 1][0] - cx, pts[pts.length - 1][1] - cy) <= S * 1.05) line(ctx, p2, col.s[0], 1.5);
      }
    }
    // surface charge marks
    const K = Kf();
    if (K > 0.01) for (let a = 0; a < 2 * Math.PI; a += Math.PI / 12) {
      const c = Math.cos(a); if (Math.abs(c) < 0.2) continue;
      const sz = 9 + 6 * Math.abs(c) * K;
      text(ctx, c > 0 ? '+' : '−', X(1.13 * Math.cos(a)), Y(1.13 * Math.sin(a)), { color: c > 0 ? col.s[1] : col.s[3], size: sz, weight: 700, align: 'center', fit: false });
    }
    text(ctx, show === 'all' ? 'E₀ →' : 'induced dipole only (l = 1, r⁻² term)', 10, h - 14, { color: col.muted, size: 12, weight: 600 });
  };
  cv.redraw(); say();
}
