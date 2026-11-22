// Class 10 Areas Related to Circles: a sector with angle θ is the fraction θ/360 of the whole circle, so
// arc length = θ/360 × 2πr and area = θ/360 × πr². Drag the sector's edge (or use the slider) and watch both numbers grow
// in proportion. Toggle the minor and major sector: they are the two pieces the radii cut the circle into.
import { canvas, text, title, line, dot, row, slider, choice, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let th = 90, r = 7, major = false, G = {};
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A circle sector whose angle you can change, with its arc length and area' });
  const ctl = row(host);
  const st = slider(ctl, { label: 'Angle θ', min: 10, max: 350, step: 5, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; say(); } });
  slider(ctl, { label: 'Radius r', min: 3.5, max: 14, step: 3.5, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  choice(ctl, 'Shaded', [[false, 'Sector of θ'], [true, 'Other sector']], false, (v) => { major = v; say(); });
  const out = readout(host);
  function say() {
    const f = (major ? 360 - th : th) / 360, P = 22 / 7;
    out.innerHTML = `Fraction = ${major ? 360 - th : th}/360 = <b>${+f.toFixed(3)}</b>. Arc length = ${+f.toFixed(3)} × 2πr = <b>${(f * 2 * P * r).toFixed(2)} cm</b>. Area = ${+f.toFixed(3)} × πr² = <b>${(f * P * r * r).toFixed(2)} cm²</b> (π = 22/7).`;
    cv.redraw();
  }
  let on = false; touchGuard(cv.c, (x, y) => Math.hypot(x - G.hx, y - G.hy) < 24);
  const mv = (e) => { const b = cv.c.getBoundingClientRect(); let a = (Math.atan2(-(e.clientY - b.top - G.cy), e.clientX - b.left - G.cx) * 180) / Math.PI; if (a < 0) a += 360; th = Math.max(10, Math.min(350, Math.round(a / 5) * 5)); st.set(th); say(); };
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(); if (Math.hypot(e.clientX - b.left - G.hx, e.clientY - b.top - G.hy) < 30) { on = true; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => on && mv(e)); cv.c.addEventListener('pointerup', () => (on = false)); cv.c.addEventListener('pointercancel', () => (on = false));
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sector: a slice of the circle (drag the dot)', col);
    const R = Math.min(w * 0.32, (h - 70) * 0.42), cx = w / 2, cy = h / 2 + 14, t = (th * Math.PI) / 180;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); if (major) ctx.arc(cx, cy, R, -2 * Math.PI, -t); else ctx.arc(cx, cy, R, -t, 0); ctx.closePath();
    ctx.fillStyle = major ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); if (major) ctx.arc(cx, cy, R, -2 * Math.PI, -t); else ctx.arc(cx, cy, R, -t, 0); ctx.strokeStyle = major ? col.s[1] : col.s[0]; ctx.lineWidth = 5; ctx.stroke();
    line(ctx, [[cx, cy], [cx + R, cy]], col.ink, 2.2); const hx = cx + Math.cos(t) * R, hy = cy - Math.sin(t) * R; line(ctx, [[cx, cy], [hx, hy]], col.ink, 2.2);
    G = { cx, cy, hx, hy }; dot(ctx, hx, hy, 8, col.s[3], col.ink); dot(ctx, cx, cy, 4, col.ink);
    const ar = Math.min(R * 0.3, 34); ctx.beginPath(); ctx.arc(cx, cy, ar, -t, 0); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
    const mid = t / 2; text(ctx, th + '°', cx + Math.cos(mid) * (ar + 17), cy - Math.sin(mid) * (ar + 17), { color: col.s[3], size: 12.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'O', cx - 4, cy + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, 'r', cx + R / 2, cy + 12, { color: col.ink, size: 12, weight: 700, halo: col.panel, align: 'center' });
  };
  say();
}
