// Class 11 Work, Energy and Power (step player): derive the result for an elastic collision. m1 = 2 kg at u1 = 5 m/s hits m2 = 3 kg at rest.
// Momentum: m1(u1 - v1) = m2(v2 - u2). Energy: m1(u1^2 - v1^2) = m2(v2^2 - u2^2). Dividing: u1 + v1 = u2 + v2, so speed of approach = speed of separation. Then v1 = -1, v2 = 4 m/s.
import { canvas, text, title, arrow, line } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Steps of the elastic collision derivation with two blocks before and after' });
  const T = ['Before and after', 'Momentum is conserved', 'Kinetic energy is conserved', 'Divide the two equations', 'Solve for the final speeds', 'Check with numbers'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col);
    const row = (y, lab, a, b, va, vb, show) => {
      line(ctx, [[10, y + 18], [w - 10, y + 18]], col.line, 2);
      text(ctx, lab, 10, y - 22, { color: col.muted, size: 11, weight: 700 });
      ctx.fillStyle = col.s[0]; ctx.fillRect(a - 16, y - 14, 32, 32); ctx.fillStyle = col.s[2]; ctx.fillRect(b - 20, y - 18, 40, 36);
      text(ctx, '2 kg', a, y + 2, { color: col.panel, size: 10, weight: 700, align: 'center', fit: false }); text(ctx, '3 kg', b, y, { color: col.panel, size: 10, weight: 700, align: 'center', fit: false });
      if (show) { if (va) { arrow(ctx, a, y - 26, a + va * 7, y - 26, col.s[0], 2.5); text(ctx, (va > 0 ? '' : '') + (va === 5 ? 'u₁ = 5' : 'v₁ = ' + va.toString().replace('-', '−')), a + va * 3.5, y - 38, { color: col.s[0], size: 11, weight: 700, align: 'center' }); } if (vb) { arrow(ctx, b, y - 26, b + vb * 7, y - 26, col.s[2], 2.5); text(ctx, 'v₂ = ' + vb, b + vb * 3.5, y - 38, { color: col.s[2], size: 11, weight: 700, align: 'center' }); } if (!vb && lab === 'before') text(ctx, 'u₂ = 0', b, y - 38, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    };
    row(top + 40, 'before', w * 0.25, w * 0.62, 5, 0, true);
    row(top + 110, 'after', w * 0.25, w * 0.62, s >= 5 ? -1 : 0, s >= 5 ? 4 : 0, s >= 5);
    if (s < 5) { text(ctx, 'v₁ = ?', w * 0.25, top + 96, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'v₂ = ?', w * 0.62, top + 96, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    const L = [];
    if (s === 1) L.push(['m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂', col.s[0]], ['m₁(u₁ − v₁) = m₂(v₂ − u₂)   … (1)', col.ink]);
    if (s === 2) L.push(['½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂²', col.s[0]], ['m₁(u₁² − v₁²) = m₂(v₂² − u₂²)   … (2)', col.ink]);
    if (s === 3) L.push(['(2) ÷ (1), using a² − b² = (a−b)(a+b):', col.muted], ['u₁ + v₁ = v₂ + u₂', col.s[0]], ['u₁ − u₂ = v₂ − v₁', col.s[2]], ['speed of approach = speed of separation', col.ink]);
    if (s === 4) L.push(['Put v₂ = u₁ + v₁ − u₂ into (1):', col.muted], ['v₁ = [(m₁−m₂)u₁ + 2m₂u₂] / (m₁+m₂)', col.s[0]], ['v₂ = [(m₂−m₁)u₂ + 2m₁u₁] / (m₁+m₂)', col.s[2]]);
    if (s === 5) L.push(['v₁ = (2−3)×5/5 = −1 m/s (bounces back)', col.s[0]], ['v₂ = 2×2×5/5 = 4 m/s', col.s[2]], ['momentum: 10 = −2 + 12   ✓', col.ink], ['energy: 25 J = 1 J + 24 J   ✓', col.ink]);
    L.forEach(([t, c], i) => text(ctx, t, 14, top + 176 + i * 25, { color: c, size: 13.5, weight: 700 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
