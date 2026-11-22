// Class 10 Light: refraction through a rectangular glass slab. The ray bends towards the normal on entering
// (air to glass) and away from it on leaving (glass to air) by the same amount, so the emergent ray is PARALLEL to the
// incident ray (angle e = angle i) but shifted sideways: the lateral displacement d = t sin(i - r) / cos r, where t is
// the slab thickness and r the angle of refraction inside (sin i = n sin r).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let ang = 45, thick = 4, n = 1.5, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A ray passing through a glass slab and coming out parallel but shifted sideways' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle of incidence', min: 0, max: 80, step: 1, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; update(); } });
  slider(ctl, { label: 'Slab thickness', min: 1, max: 7, step: 0.5, value: thick, fmt: (v) => `${v} cm`, oninput: (v) => { thick = v; update(); } });
  choice(ctl, 'Material', [[1.33, 'Water 1.33'], [1.5, 'Glass 1.5'], [2.42, 'Diamond 2.42']], n, (v) => { n = v; update(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  const rad = Math.PI / 180, geo = () => { const i = ang * rad, r = Math.asin(Math.sin(i) / n); return { i, r, d: (thick * Math.sin(i - r)) / Math.cos(r) }; };
  function update() { const { r, d } = geo(); out.innerHTML = `i = ${ang}°, r = <b>${(r / rad).toFixed(1)}°</b>, emergent angle e = <b>${ang}°</b> (equal to i). Lateral shift d = ${thick} × sin(${ang}° − ${(r / rad).toFixed(1)}°) / cos ${(r / rad).toFixed(1)}° = <b>${d.toFixed(2)} cm</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Glass slab: the ray comes out parallel, but shifted', col);
    const { i, r, d } = geo(), cx = w / 2, tp = thick * 16, cy = h * 0.52, y1 = cy - tp / 2, y2 = cy + tp / 2, wd = Math.min(w - 40, 260);
    ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = col.s[0]; ctx.fillRect(cx - wd / 2, y1, wd, tp); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - wd / 2, y1, wd, tp);
    const xa = cx - 0.5 * tp * Math.tan(r), xb = xa + tp * Math.tan(r), L = Math.min(110, y1 - 30);
    const S = [xa - L * Math.sin(i), y1 - L * Math.cos(i)], E = [xb + L * Math.sin(i), y2 + L * Math.cos(i)];
    line(ctx, [[xa, y1 - L - 4], [xa, y1 + L * 0.35]], col.muted, 1.2, [4, 4]); line(ctx, [[xb, y2 - L * 0.35], [xb, y2 + L + 4]], col.muted, 1.2, [4, 4]);
    // straight-on path (dashed) to show the shift
    const xs = xa + (y2 - y1) * Math.tan(i); line(ctx, [[xa, y1], [xs + (L) * Math.sin(i), y2 + L * Math.cos(i)]], col.s[0], 1.4, [5, 5]);
    arrow(ctx, S[0], S[1], xa, y1, col.s[0], 2.4, 9); line(ctx, [[xa, y1], [xb, y2]], col.s[2], 2.4); arrow(ctx, xb, y2, E[0], E[1], col.s[1], 2.4, 9);
    text(ctx, 'air', 8, 40 + 14, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'glass slab', cx - wd / 2 + 6, y1 + 14, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    text(ctx, 'i', xa - 22 * Math.max(0.3, Math.sin(i)) - 12, y1 - 26, { color: col.s[0], size: 12.5, weight: 700, halo: col.panel }); text(ctx, 'r', xa + 6, y1 + 30, { color: col.s[2], size: 12.5, weight: 700, halo: col.panel });
    text(ctx, 'e', xb + 6, y2 + 30, { color: col.s[1], size: 12.5, weight: 700, halo: col.panel });
    // lateral shift marker: horizontal gap at y2 between the dashed line and the emergent ray, drawn perpendicular
    if (ang > 2) { const gx = xs, ex = xb; line(ctx, [[Math.min(gx, ex), y2 + 24], [Math.max(gx, ex), y2 + 24]], col.s[3], 2); text(ctx, `shift d = ${d.toFixed(2)} cm`, (gx + ex) / 2, y2 + 40, { color: col.s[3], size: 11.5, weight: 700, align: 'center', halo: col.panel }); }
    const pts = [S, [xa, y1], [xb, y2], E], seg = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1])), tot = seg.reduce((a, b) => a + b, 0); let dd = ((t * 0.3) % 1) * tot;
    for (let k = 0; k < seg.length; k++) { if (dd <= seg[k]) { const f = dd / seg[k]; dot(ctx, pts[k][0] + f * (pts[k + 1][0] - pts[k][0]), pts[k][1] + f * (pts[k + 1][1] - pts[k][1]), 4.5, col.s[3]); break; } dd -= seg[k]; }
  };
  update();
}
