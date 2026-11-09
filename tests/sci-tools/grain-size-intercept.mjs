// #853 grain size by line intercept: maths checks. The fixture is a 240 × 200 Voronoi grain image made with NumPy,
// SciPy (cKDTree) and scikit-image 0.26 (find_boundaries, inner boundaries at grey 45, grains 175 to 225); the
// expected counts come from an independent Python count (nearest pixels along the same lines, runs found with
// numpy). Otsu is scikit-image's threshold_otsu.
import { inflateSync } from 'node:zlib';
import { testLines, profile, crossings, interceptStats, astmG, lFromG, nearestLine, toggleMark, pointAt, exampleGrains } from '../../src/lib/sci/grainsize.ts';
import { hist256, otsu, greyFromRgba, tiffToImg, boxDown, umPerPx, fmtLen } from '../../src/lib/sci/micro.ts';
const REF = {"w":240,"h":200,"img":"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","otsu":45,"cases":[{"pat":"h","n":5,"t":120,"gap":3,"P":[7.5,6.0,8.0,8.0,7.0],"len":[229,229,229,229,229]},{"pat":"v","n":7,"t":120,"gap":3,"P":[6.0,7.0,7.0,8.0,9.0,6.0,5.5],"len":[191,191,191,191,191,191,191]},{"pat":"hv","n":4,"t":100,"gap":0,"P":[7.5,6.0,9.0,7.0,6.0,7.0,8.5,6.0],"len":[229,229,229,229,191,191,191,191]},{"pat":"circles","n":0,"t":120,"gap":3,"P":[17.0,11.0,7.0],"len":[578.053048,385.368699,192.684349]}]};
const close = (a, b, t) => Math.abs(a - b) <= t;
export default async (check) => {
  const img = new Float32Array(inflateSync(Buffer.from(REF.img, 'base64'))), { w, h } = REF;
  check('grain: fixture decodes to 240 × 200', img.length === w * h);
  check(`grain: Otsu threshold = scikit-image (${REF.otsu})`, otsu(hist256(img, w)) === REF.otsu);
  for (const c of REF.cases) {
    const L = testLines({ x0: 0, y0: 0, x1: w, y1: h }, c.pat, c.n);
    const P = L.map((l) => crossings(profile(img, w, h, l), l.circle, { mode: 'dark', t: c.t, gap: c.gap }).reduce((s, m) => s + m.w, 0));
    check(`grain: ${c.pat} lines, crossings per line = Python ${JSON.stringify(c.P)}`, JSON.stringify(P) === JSON.stringify(c.P) && L.every((l, i) => close(l.len, c.len[i], 1e-6)));
  }
  // Light boundaries: the same image turned round gives the same counts in light mode.
  { const inv = img.map((v) => 255 - v), c = REF.cases[0], L = testLines({ x0: 0, y0: 0, x1: w, y1: h }, 'h', 5);
    const P = L.map((l) => crossings(profile(inv, w, h, l), false, { mode: 'light', t: 255 - c.t - 1, gap: c.gap }).reduce((s, m) => s + m.w, 0));
    check('grain: light-boundary mode on the inverted image', JSON.stringify(P) === JSON.stringify(c.P)); }
  // Edge mode on a made-up step profile: grains of 100, 160, 100, 200 with steps at 20, 45 and 70.
  { const p = Array.from({ length: 100 }, (_, i) => (i < 20 ? 100 : i < 45 ? 160 : i < 70 ? 100 : 200));
    const m = crossings(p, false, { mode: 'edge', t: 10, gap: 2 });
    check('grain: edge mode finds the three steps at their steepest point', m.length === 3 && m.every((k, i) => Math.abs(k.s - [19.5, 44.5, 69.5][i]) <= 0.5)); }
  // Line ends: a boundary cut by the line's end counts a half; circles wrap round.
  { const p = [40, 40, 200, 200, 200, 40, 200, 200, 200, 40]; const m = crossings(p, false, { mode: 'dark', t: 100, gap: 1 });
    check('grain: half counts at both line ends', m.length === 3 && m[0].w === 0.5 && m[1].w === 1 && m[2].w === 0.5);
    const c = crossings(p, true, { mode: 'dark', t: 100, gap: 1 });
    check('grain: a circle joins the boundary across its start', c.length === 2 && c.every((k) => k.w === 1)); }
  { const p = [40, 200, 200, 40, 200, 60, 200, 200, 200, 200]; check('grain: boundaries closer than the gap are merged', crossings(p, false, { mode: 'dark', t: 100, gap: 2 }).length === 2 && crossings(p, false, { mode: 'dark', t: 100, gap: 1 }).length === 3); }
  // ASTM E112 relation: G = −6.6457 log10(ℓ mm) − 3.298, and its inverse.
  check('grain: G at ℓ = 1 mm is −3.298', close(astmG(1), -3.298, 1e-12));
  check('grain: G at ℓ = 0.1 mm is 3.3477', close(astmG(0.1), 3.3477, 1e-12));
  check('grain: ℓ for G = 7 is 28.21 µm (formula)', close(lFromG(7) * 1000, 28.21, 0.01) && close(astmG(lFromG(5.3)), 5.3, 1e-12));
  // Statistics: worked by hand. Four 1 mm lines with 20, 24, 18, 22 crossings: ℓ = 4/84 mm, P_L mean 21, s = 2.582,
  // t(0.975, 3) = 3.1824, CI = ±4.109, %RA = 19.6.
  { const s = interceptStats([20, 24, 18, 22].map((P) => ({ len: 1, P })), 0.95, 1);
    check('grain: intercept statistics by hand', close(s.lbar, 4 / 84, 1e-12) && close(s.sdPL, Math.sqrt(20 / 3), 1e-12) && close(s.ciPL, 3.182446305 * Math.sqrt(20 / 3) / 2, 1e-8) && close(s.ra, 19.566, 0.01) && close(s.G, astmG(4 / 84), 1e-12) && s.GLo < s.G && s.G < s.GHi && close(s.lLo, 1 / (21 + s.ciPL), 1e-12)); }
  { const s = interceptStats([{ len: 2, P: 0 }], 0.95, 1); check('grain: no crossings gives no ℓ, one line no CI', !Number.isFinite(s.lbar) && !Number.isFinite(s.ciPL)); }
  // Tapping: nearest line and add/remove marks.
  { const L = testLines({ x0: 0, y0: 0, x1: 200, y1: 100 }, 'h', 2); const n = nearestLine(L, 50, 27);
    check('grain: tap finds the nearest line', n.i === 0 && close(n.d, 2, 1e-9) && close(n.s, 46, 1e-9));
    let m = toggleMark([{ s: 10, w: 1 }], 46, 5, L[0]); check('grain: tap adds a mark', m.length === 2 && m[1].manual);
    m = toggleMark(m, 12, 5, L[0]); check('grain: tap near a mark removes it', m.length === 1 && m[0].s === 46); }
  { const C = testLines({ x0: 0, y0: 0, x1: 100, y1: 100 }, 'circles', 0); const [x, y] = pointAt(C[0], C[0].len / 4);
    check('grain: circles 3:2:1, centred, 46 % of the side', C.length === 3 && close(C[0].r, 46, 1e-9) && close(C[2].r * 3, 46, 1e-9) && close(x, 50, 1e-9) && close(y, 96, 1e-9));
    const n = nearestLine(C, 50, 95); check('grain: tap near a circle', n.i === 0 && close(n.d, 1, 1e-9)); }
  // Random Voronoi grains: ℓ is close to π / (4 √density) for a Poisson–Voronoi pattern. Close boundaries near grain
  // corners merge, so the measured value reads a few per cent high (the Python check on its own images gave +3 to +6 %).
  { const e = exampleGrains(640, 640, 340, 5), g = greyFromRgba(e.px, e.w, e.h), t = otsu(hist256(g, e.w)), L = testLines({ x0: 0, y0: 0, x1: e.w, y1: e.h }, 'hv', 20);
    const P = L.map((l) => crossings(profile(g, e.w, e.h, l), false, { mode: 'dark', t, gap: 1 }).reduce((s, m) => s + m.w, 0));
    const s = interceptStats(L.map((l, i) => ({ len: l.len, P: P[i] }))), exp = Math.PI / (4 * Math.sqrt(e.density));
    check(`grain: Voronoi example ℓ ${s.lbar.toFixed(2)} px vs π/(4√λ) ${exp.toFixed(2)} px (within 8 %)`, Math.abs(s.lbar / exp - 1) < 0.08 && s.lbar >= exp * 0.99); }
  // Shared image helpers (src/lib/sci/micro.ts).
  { const g = greyFromRgba([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255], 3, 1); check('micro: grey weights 0.2125, 0.7154, 0.0721 (scikit-image rgb2gray)', close(g[0], 54.1875, 1e-4) && close(g[1], 182.427, 1e-3) && close(g[2], 18.3855, 1e-4)); }
  { const d = boxDown({ rgba: new Uint8ClampedArray([0, 0, 0, 255, 100, 100, 100, 255, 200, 200, 200, 255, 60, 60, 60, 255]), w: 2, h: 2 }, 2); check('micro: 2 × 2 box average', d.w === 1 && d.rgba[0] === 90); }
  check('micro: scale from a bar, 200 px = 50 µm → 0.25 µm/px; 100 px = 500 nm → 5 nm/px', close(umPerPx(200, 50, 'µm'), 0.25, 1e-15) && close(umPerPx(100, 500, 'nm'), 0.005, 1e-15) && fmtLen(0.005) === '5 nm' && fmtLen(2500) === '2.5 mm');
  // A hand-made 16-bit TIFF, normal and WhiteIsZero.
  const tif = (photo) => { const w = 3, h = 2, n = 9, data = 8 + 2 + n * 12 + 4, b = Buffer.alloc(data + 12);
    b.write('II', 0); b.writeUInt16LE(42, 2); b.writeUInt32LE(8, 4); b.writeUInt16LE(n, 8);
    [[256, 3, w], [257, 3, h], [258, 3, 16], [259, 3, 1], [262, 3, photo], [273, 4, data], [277, 3, 1], [278, 3, h], [279, 4, 12]].forEach(([t, ty, v], i) => { const e = 10 + i * 12; b.writeUInt16LE(t, e); b.writeUInt16LE(ty, e + 2); b.writeUInt32LE(1, e + 4); if (ty === 3) b.writeUInt16LE(v, e + 8); else b.writeUInt32LE(v, e + 8); });
    [1000, 2000, 3000, 4000, 5000, 6000].forEach((v, i) => b.writeUInt16LE(v, data + 2 * i)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.length); };
  { const t = tiffToImg(tif(1)); check('micro: 16-bit TIFF stretched 1000 → 0, 6000 → 255', t.w === 3 && t.h === 2 && t.rgba[0] === 0 && t.rgba[20] === 255 && t.rgba[8] === 102 && t.note.includes('16-bit')); }
  { const t = tiffToImg(tif(0)); check('micro: WhiteIsZero TIFF turned round', t.rgba[0] === 255 && t.rgba[20] === 0); }
};
