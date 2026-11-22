// Class 10 Areas Related to Circles: segment of a circle. A chord AB cuts the circle into a minor segment and a major segment.
// Minor segment = sector OAB − triangle OAB = (θ/360)πr² − ½r² sin θ. Major segment = whole circle − minor segment.
// The board syllabus uses central angles 60°, 90° and 120° only. Pick one, slide r and read the three areas.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let th = 90, r = 14, major = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A circle with a chord, showing the sector, the triangle and the segment with their areas' });
  const ctl = row(host);
  choice(ctl, 'Angle θ', [[60, '60°'], [90, '90°'], [120, '120°']], 90, (v) => { th = v; say(); });
  slider(ctl, { label: 'Radius r', min: 7, max: 21, step: 7, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  choice(ctl, 'Show', [[false, 'Minor segment'], [true, 'Major segment']], false, (v) => { major = v; say(); });
  const out = readout(host);
  function say() {
    const P = 22 / 7, sec = (th / 360) * P * r * r, tri = 0.5 * r * r * Math.sin((th * Math.PI) / 180), seg = sec - tri;
    out.innerHTML = major ? `Major segment = circle − minor segment = ${(P * r * r).toFixed(1)} − ${seg.toFixed(1)} = <b>${(P * r * r - seg).toFixed(1)} cm²</b>.` : `Sector = ${sec.toFixed(1)} cm². Triangle OAB = ½r² sin θ = ${tri.toFixed(1)} cm². Minor segment = ${sec.toFixed(1)} − ${tri.toFixed(1)} = <b>${seg.toFixed(1)} cm²</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Segment = sector − triangle', col);
    const R = Math.min(w * 0.3, (h - 70) * 0.4), cx = w / 2, cy = h / 2 + 12, t = (th * Math.PI) / 180, a0 = -Math.PI / 2 - t / 2, a1 = -Math.PI / 2 + t / 2;
    const A = [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], B = [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); if (major) { ctx.arc(cx, cy, R, a1, a0 + 2 * Math.PI); ctx.closePath(); ctx.fillStyle = col.s[1]; } else { ctx.moveTo(A[0], A[1]); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fillStyle = col.s[1]; }
    ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = major ? 0.2 : 0.3; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [[cx, cy], A], col.ink, 2); line(ctx, [[cx, cy], B], col.ink, 2); line(ctx, [A, B], col.s[3], 3);
    dot(ctx, cx, cy, 4, col.ink); dot(ctx, A[0], A[1], 5, col.s[3], col.panel); dot(ctx, B[0], B[1], 5, col.s[3], col.panel);
    text(ctx, 'O', cx, cy + 15, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'A', A[0] - 11, A[1] - 6, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'B', B[0] + 11, B[1] - 6, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, th + '°', cx, cy - R * 0.28, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, major ? 'major segment' : 'minor segment', cx, major ? cy + R * 0.55 : cy - R * 0.92 + 4 + (th === 120 ? 0 : 0), { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
  };
  say();
}
