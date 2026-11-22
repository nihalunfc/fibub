// Class 10 Circles: two concentric circles (radii R = 5 and r). A chord of the big circle that touches the small circle is
// perpendicular to the radius at the touching point, and a perpendicular from the centre bisects a chord. So half the chord
// is √(R² − r²) and the whole chord is 2√(R² − r²).
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Two concentric circles with a chord of the bigger circle touching the smaller one' });
  const ctl = row(host);
  slider(ctl, { label: 'Small radius r', min: 0.5, max: 4.9, step: 0.1, value: r, fmt: (v) => v.toFixed(1) + ' cm', oninput: (v) => { r = v; say(); } });
  const out = readout(host);
  function say() { const hc = Math.sqrt(25 - r * r); out.innerHTML = `Half-chord = √(5² − ${r.toFixed(1)}²) = <b>${hc.toFixed(2)} cm</b>, so the chord is <b>${(2 * hc).toFixed(2)} cm</b>. The tangent point M is the midpoint of the chord.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Chord touching the inner circle (R = 5 cm)', col);
    const R = Math.min(w * 0.32, (h - 60) * 0.42), cx = w / 2, cy = h / 2 + 12, ri = (r / 5) * R, hc = Math.sqrt(R * R - ri * ri);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, ri, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.stroke();
    const yy = cy - ri; line(ctx, [[cx - hc, yy], [cx + hc, yy]], col.s[2], 3.5);
    line(ctx, [[cx, cy], [cx, yy]], col.s[0], 2.5); line(ctx, [[cx, cy], [cx + hc, yy]], col.s[3], 2, [5, 4]);
    line(ctx, [[cx - 10, yy + 10], [cx, yy + 10], [cx, yy]].map((p, i) => (i === 0 ? [cx - 10, yy] : i === 1 ? [cx - 10, yy + 10] : [cx, yy + 10])), col.ink, 1.4);
    dot(ctx, cx, cy, 3.5, col.ink); dot(ctx, cx, yy, 5, col.s[0], col.panel); dot(ctx, cx - hc, yy, 5, col.s[2], col.panel); dot(ctx, cx + hc, yy, 5, col.s[2], col.panel);
    text(ctx, 'O', cx - 12, cy + 4, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'M', cx + 10, yy + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, 'r = ' + r.toFixed(1), cx - 8, (cy + yy) / 2, { color: col.s[0], size: 11, weight: 700, halo: col.panel, align: 'right' });
    text(ctx, 'R = 5', cx + hc * 0.55 + 12, (cy + yy) / 2 - 3, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'chord = ' + (2 * hc / R * 5).toFixed(2) + ' cm', cx, yy - 14, { color: col.s[2], size: 12, weight: 700, halo: col.panel, align: 'center' });
  };
  say();
}
