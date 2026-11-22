// 7.7 How the CMB gets polarised (step player). Light scattering off a free electron (Thomson scattering)
// makes the electron shake across the light's direction of travel; light it sends on towards us (out of the
// screen) is polarised along that shake. Light from the left and right shakes it up and down; light from above
// and below shakes it side to side. Equal light from all sides: no net polarisation. A quadrupole (hotter from
// left and right, cooler from above and below): more up-and-down shaking, a net polarisation. On the sky the
// pattern around a spot is ring-like or radial (E-modes; which one depends on the spot's size and sign); a curl pattern (B-modes) comes from
// gravitational lensing and maybe from primordial gravitational waves.
import { canvas, text, title, arrow, dot, line, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 320, label: 'How scattering off an electron polarises the CMB' });
  let step = 0, t = 0;
  const titles = ['Light from one side: polarised', 'Equal light from all sides: no polarisation', 'Hotter left and right: a little polarisation', 'E-modes: rings or spokes, never a slant', 'B-modes: a swirl'];
  const bar = (ctx, x, y, len, ang, color, wdt = 2.5) => {
    const dx = Math.cos(ang) * len / 2, dy = Math.sin(ang) * len / 2;
    line(ctx, [[x - dx, y - dy], [x + dx, y + dy]], color, wdt);
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, titles[step], col) + 6;
    const cx = w / 2, cy = top + (h - top) * 0.47, R = Math.min(w * 0.36, (h - top) * 0.4);
    if (step <= 2) {
      // incoming light: [direction angle it comes from, strength]
      const lr = step === 0 ? 1 : step === 1 ? 1 : 1.35, ud = step === 0 ? 0 : step === 1 ? 1 : 0.6;
      const rays = [[Math.PI, step === 0 ? 1 : lr, col.s[1]], [0, step === 0 ? 0 : lr, col.s[1]], [-Math.PI / 2, ud, step === 1 ? col.s[1] : col.s[0]], [Math.PI / 2, ud, step === 1 ? col.s[1] : col.s[0]]];
      rays.forEach(([a, s, c]) => {
        if (!s) return;
        const x0 = cx + Math.cos(a) * R, y0 = cy + Math.sin(a) * R, x1 = cx + Math.cos(a) * R * 0.32, y1 = cy + Math.sin(a) * R * 0.32;
        arrow(ctx, x0, y0, x1, y1, c, 1.5 + 3 * s, 8 + 4 * s);
      });
      // the electron shakes: up-down amount from left/right light, side-side from up/down light
      const vy = (step === 0 ? 1 : lr) * 9, vx = ud * 9, wob = Math.sin(t * 14);
      dot(ctx, cx + vx * Math.sin(t * 11) * 0.8, cy + vy * wob * 0.8, 7, col.ink, col.panel);
      text(ctx, 'electron', cx + 14, cy + 18, { color: col.muted, size: 11 });
      if (step === 0) text(ctx, 'light in', cx - R * 0.66, cy - 16, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel });
      if (step === 2) { text(ctx, 'hotter', cx - R * 0.66, cy - 18, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'cooler', cx + 30, cy - R * 0.75, { color: col.s[0], size: 11, weight: 700, halo: col.panel }); }
      // the light sent towards us: its polarisation
      const px = Math.min(w - 50, cx + R + 40), py = top + 34, net = step === 0 ? 1 : step === 1 ? 0 : (lr - ud) / (lr + ud);
      ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(px - 28, py - 22, 56, 50); ctx.restore();
      if (net > 0.01) bar(ctx, px, py + 3, 36 * Math.min(1, net * 1.4), Math.PI / 2, col.ink, 3);
      else dot(ctx, px, py + 3, 3, col.muted);
      text(ctx, 'to us', px, py + 38, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, net > 0.01 ? (step === 0 ? 'fully polarised' : 'slightly polarised') : 'unpolarised', cx, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
      return;
    }
    // sky patterns around a hot spot (left) and a cold spot (right)
    const r0 = Math.min(w * 0.2, (h - top) * 0.33), spots = [[w * 0.27, 'rings', col.s[1]], [w * 0.73, 'spokes', col.s[0]]];
    spots.forEach(([x, name, c], i) => {
      if (step === 3) {
        ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, cy, r0 * 0.45, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        text(ctx, name, x, cy, { color: col.ink, size: 11, weight: 700, align: 'center' });
      } else text(ctx, i ? 'swirls right' : 'swirls left', x, cy, { color: col.muted, size: 11, weight: 700, align: 'center' });
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2, rr = r0 * 0.85, bx = x + Math.cos(a) * rr, by = cy + Math.sin(a) * rr;
        // E: rings (tangential) or spokes (radial) around a spot, never slanted; B: tilted 45° (handed swirl)
        const ang = step === 3 ? (i === 0 ? a + Math.PI / 2 : a) : a + (i === 0 ? Math.PI / 4 : -Math.PI / 4);
        bar(ctx, bx, by, r0 * 0.32, ang, col.ink, 2.5);
      }
    });
    text(ctx, step === 3 ? 'E-modes: from sound waves (seen 2002)' : 'B-modes: from lensing (seen 2013), maybe gravitational waves', w / 2, h - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  loop(host, (dt) => { t += dt; if (step <= 2) cv.redraw(); });
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
