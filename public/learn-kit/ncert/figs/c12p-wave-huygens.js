// Class 12 Wave Optics: Huygens' principle. Every point on a wavefront is a source of tiny secondary wavelets; after a time t each
// wavelet has radius R = v t, and the new wavefront is the common tangent (the envelope) of the forward halves of all the wavelets.
// Plane fronts stay plane; spherical fronts stay spherical, with a radius that has grown by R. Choose the shape and slide the time.
import { canvas, text, title, row, slider, choice, readout, line, dot, loop } from '../../kit.js';

export default function (host) {
  let shape = 'plane', t = 0.5;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Huygens wavelets building a plane or a spherical wavefront' });
  const ctl = row(host);
  choice(ctl, 'Wavefront', [['plane', 'Plane'], ['sphere', 'Spherical']], shape, (v) => { shape = v; cv.redraw(); });
  const sl = slider(ctl, { label: 'Time t', min: 0, max: 1, step: 0.01, value: t, fmt: (v) => `${(v * 100).toFixed(0)} %`, oninput: (v) => { t = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.25) % 1.001; sl.set(t); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Wavelets from every point; the envelope is the new front', col) + 6;
    ctx.save(); ctx.beginPath(); ctx.rect(0, top - 2, w, h - top + 2); ctx.clip();
    if (shape === 'plane') {
      const x0 = w * 0.16, Rm = w * 0.62, R = Rm * t, y0 = top + 6, y1 = h - 8, n = 9;
      line(ctx, [[x0, y0], [x0, y1]], col.s[0], 3);
      for (let k = 0; k < n; k++) {
        const y = y0 + ((y1 - y0) * (k + 0.5)) / n;
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x0, y, R, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        dot(ctx, x0, y, 3, col.s[0]);
      }
      line(ctx, [[x0 + R, y0 + (y1 - y0) / n / 2 - 4], [x0 + R, y1 - (y1 - y0) / n / 2 + 4]], col.s[2], 3.5);
      text(ctx, 'old front', x0 - 4, y1 - 4, { color: col.s[0], size: 11, weight: 700 });
      if (R > 40) text(ctx, 'new front', x0 + R + 4, y0 + 8, { color: col.s[2], size: 11, weight: 700 });
      out.innerHTML = `The wavelets move at the wave speed, so after time t each has radius R = vt. The common tangent is a <b>straight front a distance vt ahead</b>: a plane wave stays plane.`;
    } else {
      const cx = w * 0.06, cy = top + (h - top) / 2, r0 = w * 0.3, Rm = w * 0.46, R = Rm * t, n = 9, span = 1.0;
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r0, -span - 0.12, span + 0.12); ctx.stroke();
      dot(ctx, cx, cy, 4, col.ink);
      for (let k = 0; k < n; k++) {
        const a = -span + (2 * span * k) / (n - 1), px = cx + r0 * Math.cos(a), py = cy + r0 * Math.sin(a);
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, R, a - Math.PI / 2, a + Math.PI / 2); ctx.stroke();
        dot(ctx, px, py, 3, col.s[0]);
      }
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(cx, cy, r0 + R, -span - 0.1, span + 0.1); ctx.stroke();
      text(ctx, 'source', cx + 6, cy + 14, { color: col.ink, size: 11 });
      out.innerHTML = `Each wavelet has radius R = vt. The envelope is an arc of radius <b>r₀ + vt</b>: a spherical wave stays spherical, and its radius grows at the wave speed. Only the forward halves of the wavelets count; there is no backward wave.`;
    }
    ctx.restore();
  };
  cv.redraw();
}
