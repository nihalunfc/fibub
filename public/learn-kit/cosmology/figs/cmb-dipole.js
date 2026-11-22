// 7.3 The CMB dipole. A whole-sky map (Mollweide projection, galactic coordinates, the Milky Way's plane across
// the middle) of the CMB temperature seen by an observer moving at speed v towards l = 264°, b = 48° (the
// measured direction, in the constellation Crater near Leo). Each direction is Doppler shifted:
// T(θ) = T0 / (γ (1 − β cos θ)), which to first order is T0 (1 + β cos θ): a hot half ahead and a cold half
// behind, ±T0 v/c. At the Sun's 370 km/s that is ±3.36 mK. Slide the speed, or pick a preset.
import { canvas, text, title, dot, row, slider, choice, readout } from '../../kit.js';
import { diverge } from './cmb-anisotropies-field.js';
import { T_CMB, C, DEG } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 240, label: 'Sky map of the CMB dipole: hot ahead, cold behind' });
  let v = 370, lA = 264 * DEG, bA = 48 * DEG;
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Your speed through the CMB', min: 0, max: 1000, step: 10, value: v, fmt: (x) => `${x} km/s`, oninput: (x) => { v = x; show(); cv.redraw(); } });
  choice(ctl, 'Who is moving', [['sun', 'The Sun'], ['lg', 'Local Group'], ['rest', 'At rest']], 'sun', (k) => {
    if (k === 'sun') { v = 370; lA = 264 * DEG; bA = 48 * DEG; }
    if (k === 'lg') { v = 620; lA = 276 * DEG; bA = 30 * DEG; }
    if (k === 'rest') v = 0;
    sl.set(v); show(); cv.redraw();
  });
  const out = readout(host);
  const show = () => {
    const d = T_CMB * (v * 1000 / C) * 1000;
    out.innerHTML = v === 0
      ? 'At rest relative to the CMB, the sky is the same 2.7255 K in every direction (apart from the tiny ripples of Lesson 7.4, far too faint to show here).'
      : `Moving at <b>${v} km/s</b> (${(v * 1000 / C * 100).toFixed(3)}% of light speed): the sky ahead is <b>${d.toFixed(2)} mK hotter</b> and behind <b>${d.toFixed(2)} mK colder</b> than 2.7255 K, about 1 part in ${Math.round(T_CMB * 1000 / d).toLocaleString('en-CA')}. Colour scale ±5 mK.`;
  };
  let img = null, key = '';
  const paint = (W, H, col) => {
    const k = [W, H, v, lA, bA, col.s[0], col.s[1], col.panel].join();
    if (k === key) return img; key = k;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'), im = x.createImageData(W, H), map = diverge(col);
    const beta = v * 1000 / C, g = 1 / Math.sqrt(1 - beta * beta);
    const ax = [Math.cos(bA) * Math.cos(lA), Math.cos(bA) * Math.sin(lA), Math.sin(bA)];
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const X = ((i + 0.5) / W * 2 - 1) * 2 * Math.SQRT2, Y = (1 - (j + 0.5) / H * 2) * Math.SQRT2;
      if ((X * X) / 8 + (Y * Y) / 2 > 1) continue;
      const th = Math.asin(Y / Math.SQRT2), lat = Math.asin((2 * th + Math.sin(2 * th)) / Math.PI);
      const lon = -(Math.PI * X) / (2 * Math.SQRT2 * Math.cos(th)); // galactic longitude grows to the left
      const n = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
      const cos = n[0] * ax[0] + n[1] * ax[1] + n[2] * ax[2];
      const dT = T_CMB / (g * (1 - beta * cos)) - T_CMB; // K
      const [r, gg, b] = map(dT / 5e-3), q = 4 * (j * W + i);
      im.data[q] = r; im.data[q + 1] = gg; im.data[q + 2] = b; im.data[q + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    return (img = c);
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The sky is hotter ahead of us', col) + 6;
    const mw = Math.min(w - 20, (h - top - 34) * 2), mh = mw / 2, x0 = (w - mw) / 2, y0 = top + 4;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(paint(Math.round(mw / 2.5), Math.round(mh / 2.5), col), x0, y0, mw, mh);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x0 + mw / 2, y0 + mh / 2, mw / 2, mh / 2, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0, y0 + mh / 2); ctx.lineTo(x0 + mw, y0 + mh / 2); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'plane of the Milky Way', x0 + mw / 2, y0 + mh / 2 + 10, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    // apex and antapex markers (forward projection)
    const proj = (l, b) => {
      let lon = ((l + Math.PI) % (2 * Math.PI)) - Math.PI; lon = -lon;
      let th = b; for (let k = 0; k < 20; k++) th -= (2 * th + Math.sin(2 * th) - Math.PI * Math.sin(b)) / (2 + 2 * Math.cos(2 * th));
      const X = (2 * Math.SQRT2 / Math.PI) * lon * Math.cos(th), Y = Math.SQRT2 * Math.sin(th);
      return [x0 + (X / (2 * Math.SQRT2) + 1) / 2 * mw, y0 + (1 - Y / Math.SQRT2) / 2 * mh];
    };
    if (v > 0) {
      const [ax, ay] = proj(lA, bA), [bx, by] = proj(lA + Math.PI, -bA);
      dot(ctx, ax, ay, 4, col.ink, col.panel); dot(ctx, bx, by, 4, col.ink, col.panel);
      text(ctx, 'ahead', ax, ay - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'behind', bx, by + 13, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    }
    const ly = y0 + mh + 16, d = T_CMB * (v * 1000 / C) * 1000;
    text(ctx, v ? `cold: −${d.toFixed(2)} mK` : '2.7255 K everywhere', x0 + 4, ly, { color: col.s[0], size: 11.5, weight: 700 });
    if (v) text(ctx, `hot: +${d.toFixed(2)} mK`, x0 + mw - 4, ly, { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
  };
  show(); cv.redraw();
}
