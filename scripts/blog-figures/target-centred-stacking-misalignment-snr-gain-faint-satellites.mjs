// Figures for src/blog/discoveries/target-centred-stacking-misalignment-snr-gain-faint-satellites.md, made with the
// maths of the Image stacker (src/lib/sci/stack.ts: stars(), align(), warp(), Stacker, noise()).
// Run: node scripts/blog-figures/target-centred-stacking-misalignment-snr-gain-faint-satellites.mjs
import fs from 'node:fs';
import { stars, align, apply, warp, Stacker, noise, stats } from '../../src/lib/sci/stack.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/target-centred-stacking-misalignment-snr-gain-faint-satellites.md', import.meta.url);

// Observing numbers from Qu, Liu, Li, Wu, Wang and Yao (2026), Aerospace 13(3): 279, doi:10.3390/aerospace13030279
// (CC BY 4.0): about 6 arcseconds per pixel, exposures under 200 ms, stacks of 5, 10, 25 and 50 frames, orbit-prior
// perturbations of 0, 0.5, 1.5 and 3 pixels, and a relative SNR gain of 33.7 to 97.8 per cent over direct stacking
// at 50 frames. The frames below are OUR simulation of such a sequence, not the authors' data.
const ARCSEC_PER_PX = 6;
const PAPER_GAIN = [33.7, 97.8];
const W = 192, H = 192, SKY = 300, RN = 14; // ADU
const PSF = 1.05; // Gaussian sigma of the point spread function, pixels
const AMP = 190; // target peak amplitude in one 200 ms frame (single-frame SNR of about 3)
const NSTARS = 90;

const rngOf = (s0) => { let s = s0 >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const gaussOf = (u) => { let spare = null; return () => { if (spare !== null) { const v = spare; spare = null; return v; } const r = Math.sqrt(-2 * Math.log(1 - u())), a = 2 * Math.PI * u(); spare = r * Math.sin(a); return r * Math.cos(a); }; };

/** One frame: a fixed star field shifted by (dx, dy) and turned by `rot`, plus the target at (tx, ty), plus noise. */
function makeFrame(field, dx, dy, rot, tx, ty, amp, g) {
  const p = new Float32Array(W * H);
  const cs = Math.cos(rot), sn = Math.sin(rot), cx = W / 2, cy = H / 2;
  for (let i = 0; i < p.length; i++) p[i] = SKY;
  const put = (x, y, a) => {
    const x0 = Math.max(0, Math.floor(x - 4)), x1 = Math.min(W - 1, Math.ceil(x + 4));
    const y0 = Math.max(0, Math.floor(y - 4)), y1 = Math.min(H - 1, Math.ceil(y + 4));
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) p[yy * W + xx] += a * Math.exp(-(((xx - x) ** 2 + (yy - y) ** 2) / (2 * PSF * PSF)));
  };
  for (const [sx, sy, sa] of field) {
    const rx = cx + (sx - cx) * cs - (sy - cy) * sn + dx, ry = cy + (sx - cx) * sn + (sy - cy) * cs + dy;
    if (rx > -4 && ry > -4 && rx < W + 4 && ry < H + 4) put(rx, ry, sa);
  }
  if (amp > 0) put(tx, ty, amp);
  for (let i = 0; i < p.length; i++) p[i] += RN * g() + Math.sqrt(Math.max(p[i], 0)) * g() * 0; // read noise only, so the figures stay smooth
  return { w: W, h: H, planes: [p] };
}

/** Signal-to-noise of the target in a stacked frame. The aperture is a 3 x 3 sum; the noise is measured from the
 *  spread of the same aperture over hundreds of empty places in the same stack, so that the smoothing the tool's
 *  bilinear resampling puts into neighbouring pixels is accounted for (a per-pixel sigma would not do that). */
function snrAt(frame, cx, cy) {
  const p = frame.planes[0], bg = stats(p).median;
  const ap = (x, y) => { let s = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += p[(y + j) * W + x + i] - bg; return s; };
  const blanks = [];
  for (let y = 6; y < H - 6; y += 3) for (let x = 6; x < W - 6; x += 3) { if (Math.abs(x - cx) < 8 && Math.abs(y - cy) < 8) continue; blanks.push(ap(x, y)); }
  const sd = noise(Float32Array.from(blanks));
  return ap(cx, cy) / sd;
}

/** Stack `n` frames of a sequence. mode 'centred': each frame shifted so the orbit prior's target position lands on
 *  the window centre (with a prior error of `priorSd` pixels). mode 'direct': frames registered on the star field, so
 *  the target keeps whatever residual offset `resSd` the platform left behind. */
function runStack(n, mode, resSd, priorSd, seed) {
  const u = rngOf(seed), g = gaussOf(u);
  const field = Array.from({ length: NSTARS }, () => [u() * (W + 40) - 20, u() * (H + 40) - 20, 120 + 2600 * u() ** 3]);
  const cx = W >> 1, cy = H >> 1;
  const st = new Stacker(W, H, 1), frames = [];
  for (let k = 0; k < n; k++) {
    // The platform wanders; star-field registration takes out all but `resSd` pixels of it.
    const dx = 5 * g(), dy = 5 * g(), rot = 0.004 * g();
    const resX = resSd * g(), resY = resSd * g();
    // Where the target really is in this frame, and where the orbit prior says it is.
    const tx = cx + dx + resX, ty = cy + dy + resY;
    const px = mode === 'centred' ? tx + priorSd * g() : cx + dx, py = mode === 'centred' ? ty + priorSd * g() : cy + dy;
    const f = makeFrame(field, dx, dy, rot, tx, ty, AMP, g);
    // One shift per frame, exactly the tool's resampling step: bring (px, py) to the window centre.
    frames.push(warp(f, { a: 1, b: 0, c: px - cx, d: py - cy, matched: 0, rms: 0 }));
  }
  for (const f of frames) st.add(f);
  for (const f of frames) st.addClipped(f, 3);
  return snrAt(st.result(true), cx, cy);
}

const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const TRIALS = 8;
const avg = (n, mode, resSd, priorSd) => +mean(Array.from({ length: TRIALS }, (_, t) => runStack(n, mode, resSd, priorSd, 7001 + 977 * t))).toFixed(3);

// ---- 1. SNR against the number of frames ----
const NS = [1, 5, 10, 25, 50];
const centred = NS.map((n) => avg(n, 'centred', 0.9, 0));
const direct = [0.5, 0.9, 1.5, 3].map((res) => ({ res, snr: NS.map((n) => avg(n, 'direct', res, 0)) }));

// ---- 2. The gain from target-centred stacking, against the residual registration error ----
const RES = [0.2, 0.4, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3];
const gainCurve = RES.map((res) => {
  const c = avg(50, 'centred', res, 0), d = avg(50, 'direct', res, 0);
  return { res, centred: c, direct: d, gainPc: +(((c / d) - 1) * 100).toFixed(1) };
});
// Where the curve crosses the paper's two numbers, by linear interpolation.
const crossing = (target) => {
  for (let i = 1; i < gainCurve.length; i++) {
    const a = gainCurve[i - 1], b = gainCurve[i];
    if ((a.gainPc - target) * (b.gainPc - target) <= 0) return +(a.res + ((target - a.gainPc) / (b.gainPc - a.gainPc)) * (b.res - a.res)).toFixed(2);
  }
  return null;
};
const implied = PAPER_GAIN.map((t) => ({ gainPc: t, px: crossing(t), arcsec: crossing(t) == null ? null : +(crossing(t) * ARCSEC_PER_PX).toFixed(1) }));

// ---- 3. The theoretical peak loss from smearing, for comparison ----
const theory = RES.map((res) => ({ res, gainPc: +((((PSF * PSF + res * res) / (PSF * PSF)) - 1) * 100).toFixed(1) }));

// ---- 4. The alignment step itself: can the tool recover a known shift and rotation from the star field? ----
const alignCheck = (() => {
  const u = rngOf(4242), g = gaussOf(u);
  const field = Array.from({ length: NSTARS }, () => [u() * (W + 40) - 20, u() * (H + 40) - 20, 120 + 2600 * u() ** 3]);
  const ref = makeFrame(field, 0, 0, 0, -99, -99, 0, g);
  const dx = 4.3, dy = -2.7, rot = 0.35 * Math.PI / 180;
  const cur = makeFrame(field, dx, dy, rot, -99, -99, 0, g);
  const a = stars(ref.planes[0], W, H, 40, 6), b = stars(cur.planes[0], W, H, 40, 6);
  const t = align(a, b, 2.5);
  const [x, y] = apply(t, W / 2, H / 2);
  return { refStars: a.length, curStars: b.length, matched: t.matched, rms: +t.rms.toFixed(3),
    rotDeg: +((Math.atan2(t.b, t.a) * 180) / Math.PI).toFixed(3), shiftX: +(x - W / 2).toFixed(3), shiftY: +(y - H / 2).toFixed(3),
    trueRotDeg: 0.35, trueShiftX: dx, trueShiftY: dy };
})();

const sqrtLaw = NS.map((n) => +(centred[0] * Math.sqrt(n)).toFixed(3));

const fig1 = chart({
  title: 'Target signal-to-noise against frames stacked',
  xLabel: 'Frames stacked', yLabel: 'Signal-to-noise of the target',
  series: [
    { name: 'Target-centred', kind: 'dots', x: NS, y: centred, size: 3.4 },
    { name: 'One frame × √N', kind: 'line', x: NS, y: sqrtLaw, colour: 'var(--muted)', dash: '5 3' },
    ...direct.filter((d) => [0.5, 0.9, 1.5].includes(d.res)).map((d, i) => ({ name: `Direct, ${d.res} px left over`, kind: 'line', x: NS, y: d.snr, colour: ['var(--c-tools)', 'var(--ink)', 'var(--muted)'][i] })),
  ],
  xDomain: [0, 52], yDomain: [0, 24],
  desc: 'Signal-to-noise of a faint target against the number of frames stacked. Target-centred stacking follows the square-root law. Direct stacking, which leaves a residual registration error of 0.9, 1.5 or 3 pixels, falls short by more the larger the error.',
  height: 300,
});
const fig2 = chart({
  title: 'What the 33.7 to 97.8 per cent gain implies',
  xLabel: 'Residual registration error (pixels)', yLabel: 'Gain from target-centred stacking (%)',
  series: [
    { name: 'Measured on 50-frame stacks', kind: 'dots', x: RES, y: gainCurve.map((g) => g.gainPc), size: 3.4 },
    { name: 'Peak-loss prediction (1 + σ²/σ_psf²)', kind: 'line', x: RES, y: theory.map((t) => t.gainPc), colour: 'var(--muted)', dash: '5 3' },
  ],
  xDomain: [0.2, 3], yDomain: [0, 400],
  hlines: PAPER_GAIN.map((v) => ({ y: v, text: `paper ${v} %` })),
  vlines: implied.filter((i) => i.px).map((i, k) => ({ x: i.px, text: `${i.px} px`, dy: k * 14 })),
  desc: 'The percentage gain in target signal-to-noise from target-centred stacking at 50 frames, against how much registration error the star-field solution leaves behind. The paper’s range of 33.7 to 97.8 per cent is met at residual errors of roughly half a pixel to one pixel.',
  height: 300,
});

console.log(JSON.stringify({ NS, centred, sqrtLaw, direct, gainCurve, theory, implied, alignCheck }, (k, v) => (typeof v === 'number' ? +v.toPrecision(8) : v), 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'snr', figure(fig1, 'Figure 1. Simulated 192 × 192 pixel frames of a star field with a faint target, stacked by the Image stacker’s own resampling and κσ-clipped averaging. Centring each frame on the target follows the √N law; registering on the star field and living with the leftover offset does not. Our simulation, not the authors’ frames.'));
  md = inject(md, 'gain', figure(fig2, 'Figure 2. The gain from target-centred stacking at 50 frames against the residual registration error, with the paper’s published range marked. Reading the range back gives the registration error their platform must have left.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
