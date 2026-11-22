// Class 10 Circles: a line sliding towards a circle. The line is at distance d from the centre O (radius r = 1 unit).
// d < r: the line cuts the circle at two points (a secant). d = r: it touches at exactly one point (a tangent).
// d > r: it misses the circle (non-intersecting). The tangent is the in-between case, the moment the two points meet.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let d = 1.8, dir = -1;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 270, label: 'A vertical line sliding towards a circle: no point, one point (tangent), two points (secant)' });
  const ctl = row(host);
  const s = slider(ctl, { label: 'Distance d from centre', min: 0, max: 2, step: 0.05, value: d, fmt: (v) => v.toFixed(2) + ' r', oninput: (v) => { d = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { d += dir * dt * 0.35; if (d < 0.05) dir = 1; if (d > 1.95) dir = -1; s.set(d); say(); });
  anim.button(ctl);
  const out = readout(host);
  const kind = () => (Math.abs(d - 1) < 0.025 ? 1 : d < 1 ? 0 : 2);
  function say() {
    const k = kind();
    out.innerHTML = k === 0 ? `d = ${d.toFixed(2)} r is <b>less than</b> r: the line meets the circle at <b>2 points</b>. It is a <b>secant</b>.` : k === 1 ? `d = r: the line meets the circle at <b>exactly 1 point</b>. It is a <b>tangent</b>, and the radius to that point is perpendicular to it.` : `d = ${d.toFixed(2)} r is <b>more than</b> r: the line meets the circle at <b>no point</b>. It is non-intersecting.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Secant, tangent or neither?', col);
    const R = Math.min(w * 0.3, (h - 60) * 0.42), cx = w * 0.36, cy = h / 2 + 14, lx = cx + (kind() === 1 ? 1 : d) * R;
    const k = kind(), c = [col.s[1], col.s[2], col.s[3]][k];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[lx, 34], [lx, h - 8]], c, 3);
    line(ctx, [[cx, cy], [lx, cy]], col.muted, 1.5, [5, 4]);
    dot(ctx, cx, cy, 4, col.ink); text(ctx, 'O', cx - 12, cy + 4, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'd', (cx + lx) / 2, cy - 10, { color: col.ink, size: 12, weight: 700, halo: col.panel, align: 'center' });
    line(ctx, [[cx, cy], [cx + R * 0.7, cy - R * 0.7]], col.s[0], 1.5); text(ctx, 'r', cx + R * 0.38, cy - R * 0.5, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    if (d < 1 - 0.001 && k === 0) { const y = Math.sqrt(1 - d * d) * R; dot(ctx, lx, cy - y, 6, c, col.panel); dot(ctx, lx, cy + y, 6, c, col.panel); }
    if (k === 1) dot(ctx, lx, cy, 7, c, col.panel);
    const names = ['secant: 2 points', 'tangent: 1 point', 'no common point'];
    text(ctx, names[k], w - 12, h - 18, { color: c, size: 13, weight: 700, align: 'right', halo: col.panel });
  };
  say();
}
