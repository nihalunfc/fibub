// The Ewald construction in 2D. The reciprocal lattice (dots) has its origin O at the tip of the incident wave vector k
// (length 1/λ in units of a*). The circle through O, centred at the base of k, is the Ewald circle: a reflection happens
// only when a reciprocal-lattice point lies on it, and the diffracted beam k' goes from the centre to that point.
// Turn the crystal (or press Play to rotate it) and make the circle sweep through points; raise 1/λ to reach more of them.
import { canvas, line, dot, arrow, text, row, slider, choice, readout, loop, title } from '../kit.js';

export default function (host) {
  let ang = 0.3, kind = 'sq';
  const cv = canvas(host, { aspect: 0.88, max: 380, min: 290, label: 'Ewald circle and a reciprocal lattice' });
  const ctl = row(host);
  choice(ctl, 'Lattice', [['sq', 'Square'], ['rect', 'Rectangular'], ['hex', 'Hexagonal']], kind, () => cv.redraw());
  const sk = slider(ctl, { label: 'Radius 1/λ (units of a*)', min: 0.6, max: 3.2, step: 0.05, value: 1.8, fmt: (v) => v.toFixed(2), oninput: () => cv.redraw() });
  const sa = slider(ctl, { label: 'Crystal angle', min: 0, max: 360, step: 1, value: 17, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { ang = (v * Math.PI) / 180; cv.redraw(); } });
  const ctl2 = row(host);
  const anim = loop(host, (dt) => { ang = (ang + 0.35 * dt) % (2 * Math.PI); sa.set((ang * 180) / Math.PI); cv.redraw(); }, { autoplay: false });
  anim.button(ctl2);
  const out = readout(host);
  const basis = () => (kind === 'sq' ? [[1, 0], [0, 1]] : kind === 'rect' ? [[1, 0], [0, 0.65]] : [[1, 0], [0.5, Math.sqrt(3) / 2]]);
  const lit = (tol = 0.05) => {
    const k = sk.value, [b1, b2] = basis(), c = Math.cos(ang), s = Math.sin(ang), res = [];
    for (let i = -7; i <= 7; i++) for (let j = -7; j <= 7; j++) {
      if (!i && !j) continue;
      const x0 = i * b1[0] + j * b2[0], y0 = i * b1[1] + j * b2[1], x = x0 * c - y0 * s, y = x0 * s + y0 * c;
      res.push({ i, j, x, y, on: Math.abs(Math.hypot(x + k, y) - k) < tol });
    }
    return res;
  };
  cv.draw = (ctx, w, h, col) => {
    const k = sk.value, sc = w / 10.5, ox = w * 0.74, oy = h / 2 + 8, X = (x) => ox + x * sc, Y = (y) => oy - y * sc;
    // limiting circle radius 2k and Ewald circle
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
    ctx.setLineDash([4, 5]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X(0), Y(0), 2 * k * sc, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(-k), Y(0), k * sc, 0, 7); ctx.stroke();
    const pts = lit(); const on = pts.filter((p) => p.on);
    pts.forEach((p) => { const x = X(p.x), y = Y(p.y); if (x > -4 && x < w + 4 && y > 20 && y < h + 4) dot(ctx, x, y, p.on ? 5.5 : 3, p.on ? col.s[1] : col.muted, p.on ? col.ink : null); });
    dot(ctx, X(0), Y(0), 5, col.ink);
    on.forEach((p) => arrow(ctx, X(-k), Y(0), X(p.x), Y(p.y), col.s[1], 2, 8));
    arrow(ctx, X(-k) - 0 , Y(0), X(0) - 3, Y(0), col.s[2], 2.5, 9);
    dot(ctx, X(-k), Y(0), 3.5, col.s[0]);
    ctx.restore();
    text(ctx, 'k (incident)', X(-k / 2), Y(0) + 14, { color: col.s[2], size: 11, weight: 600, align: 'center' });
    text(ctx, 'O', X(0) + 6, Y(0) - 9, { color: col.ink, size: 11, weight: 700 });
    title(ctx, 'Ewald circle (blue); reflections lit orange', col);
    text(ctx, 'dashed: |G| = 2k limit', 10, h - 10, { color: col.muted, size: 10.5 });
  };
  const outFn = () => {
    const k = sk.value, on = lit().filter((p) => p.on);
    out.innerHTML = on.length ? `<b>${on.length} reflection${on.length > 1 ? 's' : ''} now:</b> ${on.slice(0, 3).map((p) => { const G = Math.hypot(p.x, p.y), th = Math.asin(Math.min(1, G / (2 * k))) * 180 / Math.PI; return `(${p.i} ${p.j}) with |G| = ${G.toFixed(2)}: θ = ${th.toFixed(1)}°, 2θ = ${(2 * th).toFixed(1)}°`; }).join('; ')}. Check: |G| = 2k sinθ is Bragg's law, since |G| = 1/d and k = 1/λ.` : `<b>No reflection at this angle.</b> No reciprocal-lattice point is on the circle. Turn the crystal, or raise 1/λ so the circle reaches more points. Points farther than 2/λ from O can never reflect.`;
  };
  const rd = cv.redraw; cv.redraw = () => { rd(); outFn(); }; cv.redraw();
}
