// Class 10 Light: the laws of reflection. (1) Smooth mirror: the angle of incidence i equals the angle of reflection r,
// both measured from the normal, and the incident ray, the normal and the reflected ray lie in one plane.
// (2) Rough surface: every little facet obeys the same law, but the facets face different ways, so light scatters
// (diffuse reflection), which is why you can read a page from any side. (3) Image in a plane mirror: the image is as
// far behind the mirror as the object is in front, virtual, erect, same size, and laterally inverted.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'smooth', ang = 40, dist = 60, t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Light reflecting from a smooth mirror, a rough surface, and the image in a plane mirror' });
  cv.c.style.touchAction = 'pan-y';
  const ctl = row(host);
  choice(ctl, 'Surface', [['smooth', 'Smooth mirror'], ['rough', 'Rough paper'], ['image', 'Image in mirror']], mode, (m) => { mode = m; show(); update(); });
  const sa = slider(ctl, { label: 'Angle of incidence', min: 0, max: 80, step: 1, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; update(); } });
  const sd = slider(ctl, { label: 'Distance from mirror', min: 30, max: 110, step: 1, value: dist, fmt: (v) => `${v} px`, oninput: (v) => { dist = v; update(); } });
  const wa = ctl.children[ctl.children.length - 2], wd = ctl.lastElementChild;
  const out = readout(host);
  const show = () => { wa.style.display = mode === 'image' ? 'none' : ''; wd.style.display = mode === 'image' ? '' : 'none'; };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  function update() {
    out.innerHTML = mode === 'smooth' ? `Angle of incidence i = <b>${ang}°</b>, angle of reflection r = <b>${ang}°</b>. They are always equal, whatever you set.`
      : mode === 'rough' ? `Each tiny facet still has i = r, but the normals point in different directions, so the reflected rays leave in different directions: <b>diffuse reflection</b>.`
      : `Object is ${dist} px in front, the image is <b>${dist} px</b> behind: same distance, same size, virtual, erect, left and right swapped.`;
    cv.redraw();
  }
  const rad = Math.PI / 180;
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'smooth' ? 'Smooth mirror: angle i = angle r' : mode === 'rough' ? 'Rough surface: law holds at every facet' : 'Image in a plane mirror', col);
    const my = Math.round(h * 0.72), px = w / 2;
    const pulse = (pts, c) => { // a dot travelling along a polyline
      const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = seg.reduce((a, b) => a + b, 0); let d = ((t * 0.35) % 1) * tot;
      for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; dot(ctx, pts[i][0] + f * (pts[i + 1][0] - pts[i][0]), pts[i][1] + f * (pts[i + 1][1] - pts[i][1]), 4.5, c); return; } d -= seg[i]; }
    };
    if (mode === 'smooth') {
      line(ctx, [[18, my], [w - 18, my]], col.ink, 4);
      for (let x = 22; x < w - 18; x += 9) line(ctx, [[x, my + 2], [x - 6, my + 9]], col.muted, 1);
      const L = Math.min(w * 0.42, h * 0.55), a = ang * rad, S = [px - L * Math.sin(a), my - L * Math.cos(a)], E = [px + L * Math.sin(a), my - L * Math.cos(a)];
      line(ctx, [[px, my - L - 6], [px, my]], col.muted, 1.5, [5, 4]); text(ctx, 'normal', px + 5, my - L + 2, { color: col.muted, size: 11 });
      arrow(ctx, S[0], S[1], px - 2 * Math.sin(a), my - 2 * Math.cos(a), col.s[0], 2.5, 9); arrow(ctx, px, my, E[0], E[1], col.s[1], 2.5, 9);
      const r0 = 44; ctx.lineWidth = 1.5;
      ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(px, my, r0, -Math.PI / 2 - a, -Math.PI / 2); ctx.stroke();
      ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(px, my, r0 + 8, -Math.PI / 2, -Math.PI / 2 + a); ctx.stroke();
      text(ctx, 'i', px - (r0 + 12) * Math.sin(a / 2) - 8, my - (r0 + 12) * Math.cos(a / 2) - 2, { color: col.s[0], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'r', px + (r0 + 20) * Math.sin(a / 2) + 2, my - (r0 + 20) * Math.cos(a / 2) - 2, { color: col.s[1], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'incident ray', S[0] - 4, S[1] - 10, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'reflected ray', E[0] + 4, E[1] - 10, { color: col.s[1], size: 11, weight: 700, align: 'right' });
      pulse([S, [px, my], E], col.s[3]);
      text(ctx, 'plane mirror', px, my + 24, { color: col.muted, size: 11, align: 'center' });
    } else if (mode === 'rough') {
      const a = ang * rad, facets = [-32, 18, -8, 35, 0, -22, 26, -14], n = 6, y0 = my - 8;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); const x0 = 24, wd = (w - 48) / 8; ctx.moveTo(x0, y0);
      facets.forEach((f, i) => ctx.lineTo(x0 + (i + 1) * wd, y0 + Math.tan(f * rad) * wd * 0.25 * (i % 2 ? 1 : -1))); ctx.stroke();
      const d = [Math.sin(a), Math.cos(a)];
      for (let k = 0; k < n; k++) {
        const fi = k + 1, cx = x0 + (fi + 0.5) * wd * 0.95, f = facets[fi] * rad, nrm = [Math.sin(f), -Math.cos(f)], dd = d[0] * nrm[0] + d[1] * nrm[1], r = [d[0] - 2 * dd * nrm[0], d[1] - 2 * dd * nrm[1]], hy = my - 8, L = 74;
        const S = [cx - d[0] * L, hy - d[1] * L], E = [cx + r[0] * L * 0.9, hy + r[1] * L * 0.9];
        arrow(ctx, S[0], S[1], cx, hy, col.s[0], 1.8, 7); arrow(ctx, cx, hy, E[0], E[1], col.s[1], 1.8, 7);
        line(ctx, [[cx - nrm[0] * 14, hy - nrm[1] * 14], [cx + nrm[0] * 18, hy + nrm[1] * 18]], col.muted, 1, [3, 3]);
      }
      text(ctx, 'tiny facets face different ways, so rays scatter', w / 2, my + 28, { color: col.muted, size: 11, align: 'center' });
    } else {
      line(ctx, [[px + 0, 36], [px, h - 18]], col.ink, 4); text(ctx, 'mirror', px + 10, 46, { color: col.muted, size: 11 });
      for (let y = 40; y < h - 18; y += 9) line(ctx, [[px + 2, y], [px + 8, y + 6]], col.muted, 1);
      const sx = px - dist, sy = h * 0.45, ix = px + dist, hh = 22;
      // object (flag shape, so left-right swap is visible) and image
      const flag = (x, dir, c, dash) => { ctx.save(); if (dash) ctx.setLineDash([4, 3]); line(ctx, [[x, sy + hh], [x, sy - hh], [x + dir * 22, sy - hh + 8], [x, sy - hh + 16]], c, 2.5); ctx.restore(); text(ctx, dash ? 'image' : 'object', x, sy + hh + 14, { color: c, size: 11, weight: 700, align: 'center' }); };
      flag(sx, 1, col.ink, false); flag(ix, -1, col.s[3], true);
      const tip = [sx, sy - hh], tipI = [ix, sy - hh];
      // two rays from the tip: reflected at the mirror, then dashed back behind it to the image tip
      for (const yh of [sy + 4, sy + 40]) {
        const hit = [px, yh], dx = hit[0] - tipI[0], dy = hit[1] - tipI[1], k = Math.min(0.55 * sx / Math.abs(dx), 1.2);
        const E = [hit[0] + dx * k, hit[1] + dy * k];
        arrow(ctx, tip[0], tip[1], hit[0], hit[1], col.s[0], 1.8, 7); arrow(ctx, hit[0], hit[1], E[0], E[1], col.s[1], 1.8, 7);
        line(ctx, [hit, tipI], col.s[1], 1.3, [4, 4]);
      }
      line(ctx, [[sx, sy + hh + 24], [ix, sy + hh + 24]], col.muted, 1); text(ctx, `${dist} px = ${dist} px`, px, sy + hh + 36, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'reflected rays seem to come from the image', 10, h - 8, { color: col.s[1], size: 11, weight: 700 });
    }
  };
  show(); update();
}
