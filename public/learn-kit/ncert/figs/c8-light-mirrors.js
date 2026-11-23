// Class 8 Light: parallel rays meeting a plane, concave or convex mirror. A concave mirror brings parallel rays together at the
// focus F, half way between the mirror (pole P) and the centre of curvature C. A convex mirror spreads them out: they seem to
// come from a focus F behind the mirror. A plane mirror just turns them back. Rays are reflected using the exact law of reflection.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'concave', R = 100, nr = 5;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Parallel rays reflecting from a plane, concave or convex mirror' });
  const ctl = row(host);
  choice(ctl, 'Mirror', [['plane', 'Plane'], ['concave', 'Concave'], ['convex', 'Convex']], kind, (v) => { kind = v; say(); });
  slider(ctl, { label: 'Curve radius R', min: 70, max: 160, step: 10, value: R, fmt: (v) => `${v}`, oninput: (v) => { R = v; say(); } });
  slider(ctl, { label: 'Rays', min: 3, max: 9, step: 2, value: nr, fmt: (v) => v, oninput: (v) => { nr = v; say(); } });
  const out = readout(host);
  const say = () => { out.innerHTML = kind === 'concave' ? `<b>Concave:</b> the rays meet at the focus F, half way to C: f = R ÷ 2 = <b>${R / 2}</b> units. Doctors, torches and shaving mirrors use this.` : kind === 'convex' ? `<b>Convex:</b> the rays spread out. Traced backwards (dotted) they seem to come from F, ${R / 2} units behind. It gives a wide view: shop and car side mirrors.` : '<b>Plane:</b> parallel rays stay parallel after reflection. There is no focus.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${kind[0].toUpperCase() + kind.slice(1)} mirror and parallel rays`, col);
    const cy = h * 0.55, mx = w * 0.62, s = Math.min(1, (w * 0.6) / 170), r = R * s, spread = Math.min(h * 0.26, r * 0.62);
    line(ctx, [[10, cy], [w - 10, cy]], col.muted, 1, [4, 4]);
    const sgn = kind === 'concave' ? -1 : 1; // centre of curvature side
    const cxm = mx + sgn * r;
    if (kind === 'plane') { line(ctx, [[mx, cy - h * 0.34], [mx, cy + h * 0.34]], col.ink, 4); }
    else { ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); const th = Math.asin(Math.min(0.95, h * 0.34 / r)); ctx.arc(cxm, cy, r, sgn < 0 ? -th : Math.PI - th, sgn < 0 ? th : Math.PI + th); ctx.stroke(); ctx.restore(); }
    for (let i = 0; i < nr; i++) {
      const y = (i - (nr - 1) / 2) * (2 * spread / (nr - 1 || 1)); if (Math.abs(y) < 0.5) { /* axial ray */ }
      let hx = mx, dx = -1, dy = 0;
      if (kind !== 'plane') { const sq = Math.sqrt(Math.max(0, r * r - y * y)); hx = cxm - sgn * sq; const nx = (cxm - hx) / r, ny = -y / r; const dd = 1 * nx; dx = 1 - 2 * dd * nx; dy = -2 * dd * ny; /* reflect d=(1,0) */ }
      else { dx = -1; dy = 0; }
      const hy = cy + y, ex = w - 14;
      arrow(ctx, 10, hy, hx - 1, hy, col.s[1], 1.6, 7);
      const L = (kind === 'convex' ? 1 : 1) * (w * 0.55);
      const x2 = hx + dx * L, y2 = hy + dy * L;
      line(ctx, [[hx, hy], [x2, y2]], col.s[1], 1.6);
      if (kind === 'convex') { const k = (hx - (mx - r / 2)) / (-dx || 1); line(ctx, [[hx, hy], [hx - dx * Math.min(w * 0.4, 130), hy - dy * Math.min(w * 0.4, 130)]], col.s[2], 1, [3, 4]); }
    }
    const f = r / 2;
    const fx = mx + sgn * f; dot(ctx, mx, cy, 3.5, col.ink); text(ctx, 'P', mx + 6, cy + 13, { color: col.ink, size: 10.5, weight: 700 });
    if (kind !== 'plane') { dot(ctx, fx, cy, 4.5, col.s[3], col.ink); text(ctx, 'F', fx, cy + 15, { color: col.s[3], size: 11, weight: 700, align: 'center' }); dot(ctx, cxm, cy, 3, col.muted); text(ctx, 'C', cxm, cy + 15, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
  };
  say();
}
