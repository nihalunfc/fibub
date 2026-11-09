// #829 Calibration frames: master bias, dark and flat (mean, median, sigma-clipped mean) and light calibration.
// Reference numbers from ccdproc 2.5.1 (Combiner.average_combine / median_combine, subtract_bias, subtract_dark
// with and without exposure scaling, flat_correct) and astropy 8.0 sigma_clip (cenfunc median, stdfunc mad_std
// or std, maxiters) along the stack, run on the same made-up 60 × 40 frames. Tolerances allow for the 32-bit
// floats the page keeps its images in.
import * as C from '../../src/lib/sci/calframes.ts';

export default async (check) => {
  const d = C.demoSet(60, 40, 7, { bias: 9, darks: 7, flats: 7, lights: 1 });
  const idx = [0, 1162, 2399], near = (a, b) => Math.abs(a - b) <= 2e-7 * Math.abs(b) + 1e-6;
  const mean = (p) => { let s = 0; for (const v of p) s += v; return s / p.length; };
  const ref = {
    mean: { o: { method: 'mean' }, bias: [999.9434620977331, [1014.7004123263889, 995.7166815863716, 1011.9433525933159]], dark: [1028.1665181041901, [1015.1914847237723, 1002.6099243164062, 1012.7022356305804]], flat: [17862.73509637742, [13275.52455357143, 20868.323660714286, 13705.861886160714]] },
    median: { o: { method: 'median' }, bias: [999.8821995798746, [1013.5623779296875, 993.5758666992188, 1010.629638671875]], dark: [1025.9825004323322, [1012.2318115234375, 1003.1857299804688, 1011.5206298828125]], flat: [17834.10526936849, [13240.638671875, 20945.091796875, 13770.0927734375]] },
    sig3: { o: { method: 'sigma', kappa: 3, iters: 1 }, bias: [999.9120925063683, [1014.7004123263889, 995.7166815863716, 1011.9433525933159], 756], dark: [1026.0061630881173, [1012.1703186035156, 1003.996327718099, 1012.099755859375], 762], flat: [17833.568399271648, [13275.52455357143, 20939.034375, 13741.801106770834], 823] },
    sig25x5: { o: { method: 'sigma', kappa: 2.5, iters: 5 }, bias: [999.9070211723167, [1013.3458709716797, 995.7166815863716, 1011.9433525933159], 1798], dark: [1025.9929394151595, [1012.1703186035156, 1002.6099243164062, 1011.0095062255859], 1721], flat: [17833.542747917054, [13275.52455357143, 20970.5830078125, 13777.77392578125], 1790] },
    std2: { o: { method: 'sigma', kappa: 2, iters: 1, dev: 'std' }, bias: [999.916996854449, [1013.3458709716797, 995.7166815863716, 1009.9009323120117], 1208], dark: [1026.0223733601645, [1012.1703186035156, 1003.996327718099, 1010.7081095377604], 974], flat: [17833.495791308207, [13248.656575520834, 20899.239583333332, 13741.801106770834], 1067] },
  };
  const names = { mean: 'mean (ccdproc average_combine)', median: 'median (median_combine)', sig3: '3σ MAD clip, 1 pass', sig25x5: '2.5σ MAD clip, up to 5 passes', std2: '2σ standard-deviation clip' };
  for (const [k, r] of Object.entries(ref)) {
    const ok = ['bias', 'dark', 'flat'].every((kind) => {
      const c = C.combine(kind === 'bias' ? d.bias : kind === 'dark' ? d.darks : d.flats, r.o), p = c.frame.planes[0];
      return Math.abs(mean(p) - r[kind][0]) < 1e-3 && idx.every((i, j) => near(p[i], r[kind][1][j])) && (r[kind][2] == null || c.rejected === r[kind][2]);
    });
    check(`calframes: masters by ${names[k]} match ccdproc/astropy (mean, 3 pixels, clipped count)`, ok);
  }
  const mb = C.combine(d.bias, { method: 'sigma' }).frame, md = C.combine(d.darks, { method: 'sigma' }).frame, mf = C.combine(d.flats, { method: 'sigma' }).frame;
  const c1 = C.calibrate(d.lights[0], { bias: mb, dark: md, flat: mf }, { scaleDark: false, tLight: 120, tDark: 120, flatNorm: 'mean', minFlat: 0.05 }).frame.planes[0];
  check('calframes: (L − D) / mean-normalised (F − B) matches ccdproc subtract_dark + flat_correct', idx.every((i, j) => near(c1[i], [267.30591916163627, 1702.1839588589849, 371.3877784883433][j])) && Math.abs(mean(c1) - 406.1726814019455) < 1e-3);
  const c2 = C.calibrate(d.lights[0], { bias: mb, dark: md, flat: mf }, { scaleDark: true, tLight: 120, tDark: 300, flatNorm: 'median', minFlat: 0.05 });
  check('calframes: bias, dark scaled by 120/300 s, median-normalised flat match ccdproc subtract_bias + subtract_dark(scale=True)', idx.every((i, j) => near(c2.frame.planes[0][i], [265.15634471639646, 1705.957077973187, 371.42038953936054][j])) && Math.abs(mean(c2.frame.planes[0]) - 422.2130749444443) < 1e-3 && c2.darkScale === 0.4);
  const s = C.exactStats(c1);
  check('calframes: exact stats match NumPy (mean, median, std ddof 0) and astropy mad_std', Math.abs(s.mean - 406.1726819610596) < 1e-9 && s.median === 272.4190216064453 && Math.abs(s.std - 399.6569009643457) < 1e-9 && Math.abs(s.madSigma - 44.247077328604774) < 1e-9 && s.min === 185.75106811523438 && s.max === 3411.341796875 && s.n === 2400);
  check('calframes: sigma clip removes the cosmic ray the mean keeps (dark pixel hit by +3000 ADU)', (() => { const i = Math.floor(40 * 0.3) * 60 + Math.floor(60 * 0.2); const raw = d.darks.map((f) => f.planes[0][i]); const mn = C.combine(d.darks, { method: 'mean' }).frame.planes[0][i], sg = C.combine(d.darks, { method: 'sigma' }).frame.planes[0][i]; return Math.max(...raw) - Math.min(...raw) > 2500 && mn - sg > 300; })());
  check('calframes: σ clip with the standard deviation cannot reject 1 outlier of 7 at κ = 3 (max z = 6/√7)', (() => { const fr = [0, 0, 0, 0, 0, 0, 1000].map((v) => ({ w: 1, h: 1, planes: [new Float32Array([v])] })); return C.combine(fr, { method: 'sigma', dev: 'std' }).rejected === 0 && C.combine(fr, { method: 'sigma', dev: 'std', kappa: 2 }).rejected === 1; })());
  check('calframes: median of an even count is the mean of the middle two; histogram counts every pixel', (() => { const fr = [1, 2, 3, 10].map((v) => ({ w: 1, h: 1, planes: [new Float32Array([v])] })); const h = C.histogram(c1, 0, 1000, 50); return C.combine(fr, { method: 'median' }).frame.planes[0][0] === 2.5 && h.counts.reduce((a, b) => a + b, 0) === 2400 && h.width === 20; })());
  { const big = C.demoSet(); const mb2 = C.combine(big.bias, { method: 'sigma' }).frame, md2 = C.combine(big.darks, { method: 'sigma' }).frame, mf2 = C.combine(big.flats, { method: 'sigma' }).frame; const cal = C.calibrate(big.lights[0], { bias: mb2, dark: md2, flat: mf2 }, { scaleDark: false, tLight: 120, tDark: 120, flatNorm: 'mean', minFlat: 0.05 }).frame.planes[0]; const r1 = C.flatness(cal, big.lights[0].w, big.lights[0].h).ratio; const r0 = C.flatness(C.calibrate(big.lights[0], { dark: md2 }, { scaleDark: false, tLight: 120, tDark: 120, flatNorm: 'mean', minFlat: 0.05 }).frame.planes[0], big.lights[0].w, big.lights[0].h).ratio;
    check(`calframes: demo light minus dark: vignetting centre/corner ratio ${r0.toFixed(3)} falls to ${r1.toFixed(3)} after calibration`, r0 > 1.15 && Math.abs(r1 - 1) < 0.03); }
  check('calframes: errors for mismatched sizes and for dark scaling without a bias', (() => { try { C.calibrate(d.lights[0], { dark: { w: 2, h: 2, planes: [new Float32Array(4)] } }, { scaleDark: false, tLight: 1, tDark: 1, flatNorm: 'mean', minFlat: 0.05 }); return false; } catch (e) { if (!/must match/.test(e.message)) return false; } try { C.calibrate(d.lights[0], { dark: md }, { scaleDark: true, tLight: 1, tDark: 1, flatNorm: 'mean', minFlat: 0.05 }); return false; } catch (e) { return /needs a master bias/.test(e.message); } })());
};
