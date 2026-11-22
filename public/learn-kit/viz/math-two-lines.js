// Two lines y = m₁x + c₁ and y = m₂x + c₂. Slide the slopes and intercepts: the angle between them follows
// tan θ = |(m₁ − m₂)/(1 + m₁m₂)|. Make the slopes equal (parallel) or with product −1 (perpendicular), and see the
// point where they meet. The faint dashed line is the angle bisector.
import { canvas, axes, row, slider, button, readout, dot, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

export default function (host) {
  let m1 = 1, c1 = -1, m2 = -0.5, c2 = 2;
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 260, label: 'Two straight lines, their intersection and the angle between them' });
  const r1 = row(host), r2 = row(host), r3 = row(host);
  const S = [];
  const mk = (p, label, key, lo, hi, v) => S.push(slider(p, { label, min: lo, max: hi, step: 0.1, value: v, fmt: (q) => f2(q, 1), oninput: (q) => { set(key, q); re(); } }));
  const set = (k, q) => { if (k === 'm1') m1 = q; if (k === 'c1') c1 = q; if (k === 'm2') m2 = q; if (k === 'c2') c2 = q; };
  mk(r1, 'm₁', 'm1', -4, 4, m1); mk(r1, 'c₁', 'c1', -4, 4, c1); mk(r2, 'm₂', 'm2', -4, 4, m2); mk(r2, 'c₂', 'c2', -4, 4, c2);
  button(r3, 'Make parallel', () => { m2 = m1; S[2].set(m1); re(); }); button(r3, 'Make perpendicular', () => { m2 = m1 ? -1 / m1 : 0; m2 = Math.max(-4, Math.min(4, m2)); S[2].set(m2); re(); });
  const out = readout(host);
  const re = () => { cv.redraw();
    const th = Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2 || 1e-12))) * 180 / Math.PI, d = (Math.atan(m1) - Math.atan(m2)) * 180 / Math.PI;
    const ang = Math.abs(1 + m1 * m2) < 1e-6 ? 90 : th;
    const meet = Math.abs(m1 - m2) < 1e-9 ? null : [(c2 - c1) / (m1 - m2), (m1 * c2 - m2 * c1) / (m1 - m2)];
    out.innerHTML = `Line 1 slope ${f2(m1, 1)} (${f2(Math.atan(m1) * 180 / Math.PI, 1)}° from the x-axis), line 2 slope ${f2(m2, 1)} (${f2(Math.atan(m2) * 180 / Math.PI, 1)}°). Acute angle between them: tan θ = |(m₁−m₂)/(1+m₁m₂)| → <b>θ = ${f2(ang, 1)}°</b>. ${meet ? `They meet at <b>(${f2(meet[0])}, ${f2(meet[1])})</b>.` : '<b>Parallel: they never meet</b> (distance between them = |c₁ − c₂|/√(1+m²) = ' + f2(Math.abs(c1 - c2) / Math.sqrt(1 + m1 * m1)) + ').'} ${Math.abs(m1 * m2 + 1) < 0.02 ? 'm₁m₂ = −1: perpendicular.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 26, b: 22, t: 22, r: 10, xt: [-4, 0, 4], yt: [-4, 0, 4] });
    curve(ctx, A, (x) => m1 * x + c1, -6, 6, col.s[0], 3, { n: 2 }); curve(ctx, A, (x) => m2 * x + c2, -6, 6, col.s[1], 3, { n: 2 });
    if (Math.abs(m1 - m2) > 1e-9) {
      const px = (c2 - c1) / (m1 - m2), py = m1 * px + c1;
      const a1 = Math.atan(m1), a2 = Math.atan(m2), bis = (a1 + a2) / 2;
      curve(ctx, A, (x) => py + Math.tan(bis) * (x - px), -6, 6, col.muted, 1.5, { n: 2, dash: [5, 4] });
      if (Math.abs(px) < 6 && Math.abs(py) < 6) { dot(ctx, A.X(px), A.Y(py), 5, col.ink); const lo = Math.min(a1, a2), hi = Math.max(a1, a2); ctx.beginPath(); ctx.arc(A.X(px), A.Y(py), 24, -hi, -lo); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke(); }
    }
    text(ctx, `y = ${f2(m1, 1)}x ${c1 < 0 ? '−' : '+'} ${f2(Math.abs(c1), 1)}`, A.L + 6, A.T + 10, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, `y = ${f2(m2, 1)}x ${c2 < 0 ? '−' : '+'} ${f2(Math.abs(c2), 1)}`, A.L + 6, A.T + 25, { color: col.s[1], size: 11, weight: 700 });
  };
  re();
}
