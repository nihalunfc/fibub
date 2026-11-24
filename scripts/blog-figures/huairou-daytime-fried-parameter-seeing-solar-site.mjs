// Figures for src/blog/discoveries/huairou-daytime-fried-parameter-seeing-solar-site.md, made with the maths of
// the Star FWHM checker (src/lib/sci/starfwhm.ts: Moffat profiles, star measuring, field summary, plate scale).
// Run: node scripts/blog-figures/huairou-daytime-fried-parameter-seeing-solar-site.mjs
import fs from 'node:fs';
import { moffatFwhm, measureStar, findStars, fieldSummary, plateScale } from '../../src/lib/sci/starfwhm.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/huairou-daytime-fried-parameter-seeing-solar-site.md', import.meta.url);

// --- From the paper (Shikhovtsev 2026, Universe 12(1): 11, doi:10.3390/universe12010011, CC BY 4.0) ---
const R0 = { any: 3.13, clear: 4.18 };      // median Fried parameter, cm (total cloud cover <= 0.5 and <= 0.2)
const D_LSVT = 600;                          // Large Solar Vacuum Telescope aperture, mm
const CN2_DROP = { jan: 0.20, jul: 0.40 };   // fall in surface-layer Cn2, 2000-2025 against 1940-1969
const SEASONAL = 0.12;                       // peak-to-valley seasonal change in simulated r0
// --- Our assumptions ---
const LAM = 500e-9;                          // wavelength for the seeing figure, m (green light)
const BETA = 3.5;                            // Moffat power for a seeing-limited star
const SCALES = [0.5, 1.5];                   // arcsec per pixel for the two simulated cameras

const ARCSEC = 206264.806;
const seeing = (r0cm, lam = LAM) => (0.98 * lam * ARCSEC) / (r0cm / 100);   // FWHM in arcsec from r0
const r0For = (eps, lam = LAM) => (0.98 * lam * ARCSEC * 100) / eps;        // r0 in cm from FWHM
const r2 = (v, n = 2) => +v.toFixed(n);

// A field of identical Moffat stars at a chosen FWHM (pixels), with sky and noise, measured by the tool.
function field(fwhmPx, w = 420, h = 300, seed = 7) {
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  const d = new Float32Array(w * h), sky = 800, alpha = fwhmPx / (2 * Math.sqrt(2 ** (1 / BETA) - 1));
  for (let i = 0; i < d.length; i++) d[i] = sky;
  const pos = [];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) pos.push([40 + i * 68 + 8 * rnd(), 36 + j * 72 + 8 * rnd()]);
  for (const [cx, cy] of pos) {
    const amp = 4000 * (0.6 + rnd());
    const R = Math.ceil(6 * alpha + 4);
    for (let y = Math.max(0, Math.round(cy) - R); y <= Math.min(h - 1, Math.round(cy) + R); y++)
      for (let x = Math.max(0, Math.round(cx) - R); x <= Math.min(w - 1, Math.round(cx) + R); x++) {
        const rr = Math.hypot(x - cx, y - cy);
        d[y * w + x] += amp * (1 + (rr / alpha) ** 2) ** -BETA;
      }
  }
  for (let i = 0; i < d.length; i++) d[i] += Math.sqrt(Math.max(1, d[i])) * gauss() * 0.6;
  const found = findStars(d, w, h, { k: 8, R: Math.max(12, Math.ceil(3 * fwhmPx)) });
  return { ...fieldSummary(found.stars, w, h), n: found.stars.length };
}

// 1. The two medians in arcseconds, and what a 600 mm telescope sees.
const base = {
  anySee: r2(seeing(R0.any)), clearSee: r2(seeing(R0.clear)),
  anyRatio: r2(D_LSVT / 10 / R0.any, 1), clearRatio: r2(D_LSVT / 10 / R0.clear, 1),
  diffLimit: r2((1.22 * LAM * ARCSEC) / (D_LSVT / 1000), 3),
};
// 2. A fall in the turbulence integral: r0 goes as (integral Cn2)^(-3/5), so the FWHM goes as its 3/5 power.
const better = (drop) => ({ drop, r0: r2(R0.any * (1 - drop) ** -0.6), see: r2(seeing(R0.any * (1 - drop) ** -0.6)), pct: r2(100 * (1 - (1 - drop) ** 0.6), 1) });
const drops = [0.1, 0.2, 0.3, 0.4, 0.5].map(better);

// 3. The tool measuring simulated stars at each seeing, for two cameras.
const seeings = [1.5, 2, 2.42, 3, 3.23, 4, 5];
const rows = SCALES.map((sc) => ({
  scale: sc,
  pts: seeings.map((eps) => {
    const f = field(eps / sc);
    return { eps, fwhmPx: r2(f.fwhm, 3), fwhmArc: r2(f.fwhm * sc, 3), hfrArc: r2(f.hfr * sc, 3), beta: r2(f.beta, 2), n: f.n, err: r2(100 * (f.fwhm * sc - eps) / eps, 1) };
  }),
}));

// 4. Moffat profiles at the two medians, in arcseconds (the shape the tool fits).
const prof = (eps) => {
  const alpha = eps / (2 * Math.sqrt(2 ** (1 / BETA) - 1));
  const rr = Array.from({ length: 121 }, (_, i) => i * 0.05);
  return { x: rr, y: rr.map((r) => r2((1 + (r / alpha) ** 2) ** -BETA, 4)), alpha: r2(alpha, 3), check: r2(moffatFwhm(alpha, BETA), 3) };
};
const pAny = prof(seeing(R0.any)), pClear = prof(seeing(R0.clear));

const fig1 = chart({
  title: 'What the checker gives back from simulated stars', xLabel: 'True seeing FWHM (″)', yLabel: 'Measured FWHM (″)',
  series: [
    ...rows.map((r) => ({ name: `${r.scale}″ per pixel`, kind: 'dots', x: r.pts.map((p) => p.eps), y: r.pts.map((p) => p.fwhmArc), size: 3.4 })),
    { name: '', noLegend: true, kind: 'line', x: [1, 5.5], y: [1, 5.5], colour: 'var(--muted)', dash: '5 4' },
  ],
  xDomain: [1, 5.5], yDomain: [1, 5.5],
  vlines: [{ x: 3.23, text: '3.23″' }, { x: 2.42, text: '2.42″', left: true, dy: 14 }],
  desc: 'Measured against true seeing for simulated Moffat star fields at 0.5 and 1.5 arcsec per pixel. The fine sampling recovers the input within about one per cent; the coarse one reads a little wide.', height: 280,
});
const fig2 = chart({
  title: "Huairou's two median nights, as a star would look", xLabel: 'Radius from the star centre (″)', yLabel: 'Relative brightness',
  series: [
    { name: `r₀ 3.13 cm: ${base.anySee}″`, kind: 'line', x: pAny.x, y: pAny.y },
    { name: `r₀ 4.18 cm: ${base.clearSee}″`, kind: 'line', x: pClear.x, y: pClear.y },
  ],
  xDomain: [0, 5], yDomain: [0, 1.05], hlines: [{ y: 0.5, text: 'half maximum' }],
  desc: `Moffat profiles (beta 3.5) for the paper's two median Fried parameters, converted to seeing at 500 nm: ${base.anySee} and ${base.clearSee} arcsec full width at half maximum.`, height: 260,
});

console.log(JSON.stringify({
  base,
  // Seeing at another wavelength, with r0 itself scaled as lambda^(6/5): the FWHM goes as lambda^(-1/5).
  seeingAt: { g500: { any: r2(seeing(R0.any)), clear: r2(seeing(R0.clear)) }, ir1200: { any: r2(seeing(R0.any) * (1200 / 500) ** -0.2), clear: r2(seeing(R0.clear) * (1200 / 500) ** -0.2) } },
  r0ForOne: r2(r0For(1)), r0ForTwo: r2(r0For(2)),
  seasonalArc: r2(seeing(R0.any) - seeing(R0.any * (1 + SEASONAL))),
  drops, rows, moffat: { any: pAny.alpha, anyCheck: pAny.check, clear: pClear.alpha, clearCheck: pClear.check },
  plate: { p9at3712: r2(plateScale(9, 3712), 3), p15at6188: r2(plateScale(15, 6188), 3), need05: r2((206.265 * 9) / 0.5, 0) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'recover', figure(fig1, 'Figure 2. Simulated fields of Moffat stars, measured by the Star FWHM checker\'s own maths. Dots on the dashed line mean the measurement returns the seeing it was given. Simulated stars, not the paper\'s images.'));
  md = inject(md, 'profiles', figure(fig2, 'Figure 1. The star shape behind each of the paper\'s two median Fried parameters, at 500 nm. The clear-sky median (r₀ = 4.18 cm) is a quarter narrower than the all-sky one.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
