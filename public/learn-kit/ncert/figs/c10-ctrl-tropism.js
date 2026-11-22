// Class 10 Control and Coordination: plant growth movements (tropisms). Auxin, made at the shoot tip, moves away from
// light and toward gravity, so it collects on the shaded side (phototropism) or the lower side (geotropism). In a SHOOT
// auxin makes cells on that side grow longer, so the shoot bends toward the light and upward. In a ROOT the same
// high auxin slows growth, so the root bends downward. Drag the time slider; pink dots are auxin.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, clamp, rng } from '../../kit.js';

const M = {
  photo: { n: 'Phototropism (light from the right)', note: 'Light from the right pushes auxin to the shaded left side. The left cells grow longer than the right ones, so the shoot bends <b>toward the light</b>: positive phototropism.' },
  geo: { n: 'Geotropism (a seedling on its side)', note: 'Gravity gathers auxin on the lower side. In the shoot, more auxin means faster growth below, so it bends <b>up</b> (negative geotropism). In the root, more auxin slows growth below, so it bends <b>down</b> (positive geotropism).' },
  hydro: { n: 'Hydrotropism (water on the right)', note: 'Roots grow toward moist soil, which is positive hydrotropism. A root growing toward a leaking pipe or a damp patch is common in Indian cities.' },
  thigmo: { n: 'Thigmotropism (a tendril and a support)', note: 'On the side that touches the support the cells grow less, and the cells on the far side grow more, so the tendril wraps round the support: pea, beans and gourd plants climb this way.' },
};
export default function (host) {
  let k = 'photo', p = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'A shoot or root bending toward light, gravity or water because of auxin' });
  const ctl = row(host);
  choice(ctl, 'Response', Object.entries(M).map(([v, o]) => [v, o.n.split(' (')[0]]), k, (v) => { k = v; say(); });
  const sl = slider(ctl, { label: 'Time', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.05 ? 'start' : Math.round(v * 3) + ' days'), oninput: (v) => { p = v; cv.redraw(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${M[k].n}.</b> ${M[k].note}`; cv.redraw(); }
  const Rn = rng(2), A = Array.from({ length: 14 }, () => [Rn(), Rn()]);
  // draws a bending stalk from (x,y) pointing at angle a0, curving by total bend, returns pts
  const stalk = (x, y, a0, bend, len, n = 24) => { const pts = [[x, y]]; let a = a0; for (let i = 0; i < n; i++) { a += bend / n; x += Math.cos(a) * len / n; y += Math.sin(a) * len / n; pts.push([x, y]); } return pts; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, M[k].n, col) + 6, e = p * 1;
    const bandY = top + (h - top) * 0.78;
    if (k === 'photo') {
      const pts = stalk(w * 0.42, bandY, -Math.PI / 2, 0.9 * e, (h - top) * 0.55);
      line(ctx, pts, col.s[3], 12); line(ctx, pts, col.s[3], 6);
      const tip = pts[pts.length - 1]; dot(ctx, tip[0], tip[1], 8, col.s[3], col.ink);
      for (let i = 0; i < 4; i++) { const y = top + 24 + i * 40; for (let j = 0; j < 3; j++) { ctx.save(); ctx.globalAlpha = 0.6; text(ctx, '→', w - 24 - j * 24 + Math.sin(t * 2 + i) * 3, y, { color: col.s[1], size: 16, weight: 700, align: 'center', fit: false }); ctx.restore(); } }
      text(ctx, '☀ light', w - 36, top + 12, { color: col.s[1], size: 11, weight: 700, align: 'center' });
      A.forEach(([a, b], i) => { const q = pts[Math.round(4 + b * 18)]; dot(ctx, q[0] - 7 - 3 * (a) - 3 * e, q[1], 2.8, col.s[5]); if (i < 3) dot(ctx, q[0] + 5 + a * 2 * (1 - e), q[1], 2.4, col.s[5]); });
      text(ctx, 'shaded side: more auxin, longer cells', w * 0.07, bandY - 40, { color: col.s[5], size: 10, weight: 700 });
    } else if (k === 'geo') {
      const y0 = top + (h - top) * 0.36;
      const sh = stalk(w * 0.5, y0, 0, -1.2 * e, w * 0.36), rt = stalk(w * 0.5, y0, Math.PI, 1.2 * e * -1, w * 0.36);
      // right side is shoot (angle 0 bends up = negative), left is root (angle pi bends down)
      const rootPts = stalk(w * 0.5, y0, Math.PI, -1.2 * e, w * 0.36);
      line(ctx, sh, col.s[3], 10); line(ctx, rootPts, col.s[6], 8);
      dot(ctx, w * 0.5, y0, 11, col.s[1], col.ink); text(ctx, 'seed', w * 0.5, y0 + 20, { color: col.muted, size: 10, align: 'center' });
      text(ctx, 'shoot bends up', w * 0.82, y0 - 50 * e - 6, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'root bends down', w * 0.2, y0 + 60 * e + 24, { color: col.s[6], size: 10.5, weight: 700, align: 'center' });
      arrowDown(ctx, w * 0.5, top + 14, col); text(ctx, 'gravity', w * 0.5 + 22, top + 24, { color: col.muted, size: 10 });
      A.forEach(([a, b]) => { const q = sh[Math.round(2 + b * 18)]; dot(ctx, q[0], q[1] + 3 + 2 * e, 2.6, col.s[5]); const q2 = rootPts[Math.round(2 + b * 18)]; dot(ctx, q2[0], q2[1] + 3 + 2 * e, 2.6, col.s[5]); });
    } else if (k === 'hydro') {
      const y0 = top + 30;
      ctx.fillStyle = col.s[6]; ctx.globalAlpha = 0.2; ctx.fillRect(0, y0, w, h - y0); ctx.globalAlpha = 1; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(w * 0.7, y0, w * 0.3, h - y0); ctx.globalAlpha = 1;
      text(ctx, 'wet soil', w * 0.85, y0 + 16, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'dry soil', w * 0.3, y0 + 16, { color: col.muted, size: 11, weight: 700, align: 'center' });
      const pts = stalk(w * 0.3, y0 + 4, Math.PI / 2, -1.0 * e, (h - y0) * 0.9); line(ctx, pts, col.s[6], 7);
    } else {
      const bx = w * 0.7, yc = h * 0.42; ctx.fillStyle = col.s[6]; ctx.fillRect(bx - 8, top + 14, 16, h - top - 64); text(ctx, 'support', bx, h - 38, { color: col.muted, size: 10, align: 'center' });
      line(ctx, [[w * 0.18, h * 0.8], [w * 0.18, yc + 10], [bx - 10, yc]], col.s[3], 5);
      const wr = e * 3 * 2 * Math.PI; const pts = [[bx - 10, yc]]; for (let a = 0.3; a <= wr; a += 0.15) pts.push([bx - 14 * Math.cos(a) + (a > Math.PI ? 0 : 0), yc + a * 3.2]);
      if (pts.length > 1) line(ctx, pts, col.s[3], 4);
      text(ctx, 'side touching: grows less', bx - 18, yc - 14, { color: col.s[5], size: 10, weight: 700, align: 'right' });
    }
    text(ctx, 'pink dots: auxin', 10, h - 12, { color: col.s[5], size: 10.5, weight: 700 }); text(ctx, `growth ${Math.round(p * 100)}%`, w - 10, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  function arrowDown(ctx, x, y, col) { line(ctx, [[x, y], [x, y + 22]], col.muted, 2); line(ctx, [[x - 4, y + 16], [x, y + 22], [x + 4, y + 16]], col.muted, 2); }
  say();
}
