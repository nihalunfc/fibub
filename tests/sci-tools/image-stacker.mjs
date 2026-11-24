// #76 Image stacker: star finding, star-pattern alignment, resampling and the two-pass kappa-sigma average.
// The example frame set and the stack's noise ratio are already pinned in tests/sci.mjs; this file pins the
// alignment step against a shift and rotation put in on purpose, as used in
// /blog/discoveries/target-centred-stacking-misalignment-snr-gain-faint-satellites/.
import { stars, align, apply } from '../../src/lib/sci/stack.ts';

export default async (check) => {
  const W = 192, H = 192, SKY = 300, RN = 14, PSF = 1.05, NSTARS = 90;
  let s = 4242 >>> 0;
  const u = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let spare = null;
  const g = () => { if (spare !== null) { const v = spare; spare = null; return v; } const r = Math.sqrt(-2 * Math.log(1 - u())), a = 2 * Math.PI * u(); spare = r * Math.sin(a); return r * Math.cos(a); };
  const field = Array.from({ length: NSTARS }, () => [u() * (W + 40) - 20, u() * (H + 40) - 20, 120 + 2600 * u() ** 3]);
  const makeFrame = (dx, dy, rot) => {
    const p = new Float32Array(W * H).fill(SKY), cs = Math.cos(rot), sn = Math.sin(rot), cx = W / 2, cy = H / 2;
    for (const [sx, sy, sa] of field) {
      const x = cx + (sx - cx) * cs - (sy - cy) * sn + dx, y = cy + (sx - cx) * sn + (sy - cy) * cs + dy;
      if (!(x > -4 && y > -4 && x < W + 4 && y < H + 4)) continue;
      const x0 = Math.max(0, Math.floor(x - 4)), x1 = Math.min(W - 1, Math.ceil(x + 4));
      const y0 = Math.max(0, Math.floor(y - 4)), y1 = Math.min(H - 1, Math.ceil(y + 4));
      for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) p[yy * W + xx] += sa * Math.exp(-(((xx - x) ** 2 + (yy - y) ** 2) / (2 * PSF * PSF)));
    }
    for (let i = 0; i < p.length; i++) p[i] += RN * g() + Math.sqrt(Math.max(p[i], 0)) * g() * 0; // two draws per pixel, as the article script uses
    return p;
  };
  const DX = 4.3, DY = -2.7, ROT = (0.35 * Math.PI) / 180;
  const ref = makeFrame(0, 0, 0), cur = makeFrame(DX, DY, ROT);
  const a = stars(ref, W, H, 40, 6), b = stars(cur, W, H, 40, 6);
  const t = align(a, b, 2.5);
  const [x, y] = apply(t, W / 2, H / 2);
  const rotDeg = (Math.atan2(t.b, t.a) * 180) / Math.PI;
  check('stack: align recovers a 4.300, −2.700 px shift and a 0.350° rotation from a 90-star field as 4.292, −2.694 px and 0.346°',
    a.length === 40 && b.length === 40 && t !== null && t.matched === 36 && Math.abs(t.rms - 0.071) < 5e-4
    && Math.abs(x - W / 2 - 4.292) < 5e-4 && Math.abs(y - H / 2 + 2.694) < 5e-4 && Math.abs(rotDeg - 0.346) < 5e-4);
  check('stack: align stays within a tenth of a pixel and a hundredth of a degree of the truth',
    Math.abs(x - W / 2 - DX) < 0.1 && Math.abs(y - H / 2 - DY) < 0.1 && Math.abs(rotDeg - 0.35) < 0.01);
};
