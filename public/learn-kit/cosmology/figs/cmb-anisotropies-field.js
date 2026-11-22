// Shared helpers for the Module 7 sky maps (7.3, 7.4, 7.6): a blue-panel-orange colour scale built from the
// page's own colours (so dark and red modes work), and a random CMB-like patch of sky made by adding up many
// waves whose strengths follow the simplified power spectrum of acoustic-peaks-model.js. Flat-sky picture:
// a wave with multipole ℓ has a wavelength of 360°/ℓ on the sky.
import { rng } from '../../kit.js';
import { Dl, geometry, BASE } from './acoustic-peaks-model.js';

/** Turn any CSS colour into [r, g, b]. */
export function rgbOf(c) {
  const x = document.createElement('canvas').getContext('2d');
  x.fillStyle = '#000'; x.fillStyle = c || '#000';
  const s = x.fillStyle;
  if (s[0] === '#') return [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  return s.match(/[\d.]+/g).slice(0, 3).map(Number);
}

/** A diverging colour scale: v = −1 → cold (series 1, blue), 0 → panel, +1 → hot (series 2, orange). */
export function diverge(col) {
  const cold = rgbOf(col.s[0]), hot = rgbOf(col.s[1]), mid = rgbOf(col.panel);
  return (v) => {
    const t = Math.max(-1, Math.min(1, v)), e = Math.abs(t) ** 0.8, end = t < 0 ? cold : hot;
    return [0, 1, 2].map((i) => Math.round(mid[i] + (end[i] - mid[i]) * e));
  };
}

/** Waves for a random sky: [{ kx, ky, ph, amp, l }] with amplitudes in µK, spread evenly in log ℓ. */
export function makeWaves(seed = 3, n = 360, lmin = 4, lmax = 3000) {
  const r = rng(seed), g = geometry(BASE), out = [];
  const dlnl = Math.log(lmax / lmin) / n;
  for (let i = 0; i < n; i++) {
    const l = lmin * Math.exp((i + r()) * dlnl), th = r() * Math.PI * 2;
    // variance per ln ℓ is D_ℓ (flat sky), so each wave carries √(2 D_ℓ dlnℓ) of amplitude
    const amp = Math.sqrt(2 * Dl(l, BASE, g) * dlnl);
    const k = l * Math.PI / 180; // radians per degree of sky
    out.push({ kx: k * Math.cos(th), ky: k * Math.sin(th), ph: r() * Math.PI * 2, amp, l });
  }
  return out;
}

/**
 * Paint a patch of sky into a small offscreen canvas and return it. fov = width in degrees, (cx, cy) = centre
 * in degrees, beam = blur in degrees (FWHM, like a telescope's resolution), scale = µK that maps to full colour.
 */
export function paintPatch(waves, { px = 140, aspect = 1, fov = 20, cx = 0, cy = 0, beam = 0, scale = 250, col, flat = false }) {
  const W = px, H = Math.max(2, Math.round(px * aspect)), c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d'), img = x.createImageData(W, H), map = diverge(col);
  const pix = fov / W, sig = Math.max(beam / 2.3548, pix * 0.6) * Math.PI / 180;
  const live = waves.map((w) => ({ ...w, a: w.amp * Math.exp(-0.5 * (w.l * sig) ** 2) })).filter((w) => w.a > 0.05);
  let sum2 = 0;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const X = cx + (i - W / 2) * pix, Y = cy + (j - H / 2) * pix;
    let v = 0;
    for (const w of live) v += w.a * Math.cos(w.kx * X + w.ky * Y + w.ph);
    sum2 += v * v;
    const [r, g, b] = map(flat ? v / 2.7255e6 : v / scale);
    const k = 4 * (j * W + i);
    img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = b; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  c.rms = Math.sqrt(sum2 / (W * H));
  return c;
}
