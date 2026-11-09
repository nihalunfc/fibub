// #191 fluorescence image analyser. Expected values come from an independent Python check (NumPy, SciPy 1.18,
// scikit-image 0.26): the rolling-ball opening against a brute-force NumPy paraboloid opening and SciPy's non-flat
// grey_erosion/grey_dilation, distances against scipy.ndimage.distance_transform_edt, holes against
// binary_fill_holes, thresholds against skimage.filters.threshold_otsu and threshold_triangle, and the whole recipe on
// the example image against skimage label/regionprops and skimage.segmentation.watershed seeded from the h-maxima
// (h = 0.5) of the distance map.
import { channel, rollingBall, modeLevel, subtract, histogram, otsu, triangle, threshold, fillHoles, label, distance, peaks, watershed, measure, analyse, outlines, exampleImage, exampleNuclei, EXAMPLE } from '../../src/lib/sci/fluorescence.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);

  // A small test image both sides make from the same formula.
  const w = 37, h = 29, v = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) v[y * w + x] = (x * 37 + y * 101 + x * y * 13) % 97 + 40 * Math.sin(x / 5);
  const img = { w, h, v };
  const sum = (a) => { let s = 0; for (const x of a) s += x; return s; };
  [[3, -11050.476411819458], [10, -26274.05514907837], [50, -38680.466327667236]].forEach(([r, want]) => near(`fluorescence: rolling ball r = ${r} vs brute-force paraboloid opening`, sum(rollingBall(img, r)), want, 0.02));
  { const b = rollingBall(img, 10); check('fluorescence: the background never rises above the image', b.every((x, i) => x <= v[i] + 1e-4)); }
  { const flat = { w: 20, h: 10, v: new Float32Array(200).fill(42) }; check('fluorescence: a flat image is its own background', rollingBall(flat, 5).every((x) => Math.abs(x - 42) < 1e-4)); }
  { // A narrow bright spot on a slope is removed, the slope is kept.
    const s = { w: 60, h: 40, v: new Float32Array(2400) };
    for (let y = 0; y < 40; y++) for (let x = 0; x < 60; x++) s.v[y * 60 + x] = 10 + 0.5 * x + (Math.hypot(x - 30, y - 20) < 4 ? 100 : 0);
    const b = rollingBall(s, 30), d = subtract(s, b);
    check(`fluorescence: rolling ball keeps a slope and removes a spot (spot ${d.v[20 * 60 + 30].toFixed(2)}, slope ${d.v[5 * 60 + 5].toFixed(4)})`, Math.abs(d.v[20 * 60 + 30] - 100) < 0.5 && Math.abs(d.v[5 * 60 + 5]) < 1e-4);
  }
  const mask = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) mask[i] = v[i] > 45 ? 1 : 0;
  near('fluorescence: distance map vs SciPy distance_transform_edt', sum(distance(mask, w, h)), 810.3365305159716, 1e-3);
  check('fluorescence: 599 mask pixels, 676 after filling holes (SciPy binary_fill_holes)', sum(mask) === 599 && sum(fillHoles(mask, w, h)) === 676);
  check('fluorescence: 29 objects, 8-connected (skimage label)', label(mask, w, h).n === 29);

  // Hand-made thresholds.
  { const hs = new Float64Array(256); hs[10] = 100; hs[200] = 100; check('fluorescence: Otsu on two spikes splits them', otsu(hs) === 10); }
  { const hs = new Float64Array(256); for (let i = 0; i < 256; i++) hs[i] = Math.round(1000 * Math.exp(-0.5 * ((i - 30) / 5) ** 2) + 200 * Math.exp(-0.5 * ((i - 150) / 15) ** 2)); const t = otsu(hs); check(`fluorescence: Otsu between two humps, skimage gives 49 (${t})`, t === 49); }
  { const hs = new Float64Array(256); for (let i = 0; i <= 100; i++) hs[i] = i <= 20 ? 1000 - 45 * i : Math.max(1, 100 - i); const t = triangle(hs); check(`fluorescence: triangle at the knee of a long tail, skimage gives 21 (${t})`, t === 21); }
  { const hs = new Float64Array(256); hs[7] = 50; check('fluorescence: one-level histogram gives no objects', otsu(hs) === 0 && triangle(hs) === 7 && threshold({ w: 1, h: 1, v: new Float32Array([7]) }, triangle(hs))[0] === 0); }

  // The example image.
  const e = exampleImage();
  const blue = channel(e.px, e.w, e.h, 'b'), green = channel(e.px, e.w, e.h, 'g'), grey = channel(e.px, e.w, e.h, 'grey');
  check('fluorescence: Otsu and triangle on the blue channel (skimage 107, 75)', otsu(histogram(blue.v)) === 107 && triangle(histogram(blue.v)) === 75);
  check('fluorescence: Otsu and triangle on the green channel (skimage 73, 18)', otsu(histogram(green.v)) === 73 && triangle(histogram(green.v)) === 18);
  check('fluorescence: Otsu and triangle on grey (skimage 56, 18)', otsu(histogram(grey.v)) === 56 && triangle(histogram(grey.v)) === 18);
  { const s = subtract(blue, rollingBall(blue, 50)); check('fluorescence: Otsu and triangle after the rolling ball (skimage 67, 14)', otsu(histogram(s.v)) === 67 && triangle(histogram(s.v)) === 14); }
  check('fluorescence: most common blue level is 38', modeLevel(blue) === 38);

  const base = { channel: 'b', background: 'ball', radius: 50, method: 'otsu', fill: true, split: true, minArea: 50 };
  const run = (o) => analyse(e.px, e.w, e.h, { ...base, ...o });
  const totA = (r) => r.objects.reduce((s, b) => s + b.area, 0), totI = (r) => r.objects.reduce((s, b) => s + b.integrated, 0);
  { const r = run({}); check(`fluorescence: the example has ${EXAMPLE.count} nuclei (got ${r.count}), 3 dust specks removed`, r.count === 30 && r.removed === 3 && r.t === 67 && totA(r) === 8453); }
  { const r = run({ split: false }); check(`fluorescence: without splitting the 3 touching pairs count once (got ${r.count})`, r.count === EXAMPLE.unsplit && totA(r) === 8453); }
  { const r = run({ background: 'none', split: false }); check('fluorescence: no background, skimage label/regionprops (27, 8352 px, 1406365)', r.t === 107 && r.count === 27 && totA(r) === 8352 && totI(r) === 1406365); }
  { const r = run({ background: 'none' }); check('fluorescence: no background, skimage watershed gives 30', r.count === 30 && totA(r) === 8352); }
  { const r = run({ background: 'constant', constant: null, split: false }); const o = r.objects[0];
    check('fluorescence: constant background at the most common level (38), skimage gives Otsu 70, 27 objects, 8292 px', r.bgLevel === 38 && r.t === 70 && r.count === 27 && totA(r) === 8292 && totI(r) === 1084791);
    check(`fluorescence: object 1 vs skimage regionprops (area ${o.area}, mean ${o.mean})`, o.area === 151 && Math.abs(o.mean - 77.70860927152317) < 1e-9 && Math.abs(o.x - 20.28476821192053) < 1e-9 && Math.abs(o.y - 22.543046357615893) < 1e-9 && o.integrated === 11734); }
  { const r = run({ background: 'constant', constant: null }); check('fluorescence: watershed object areas equal skimage, object by object', r.count === 30 && r.objects.slice(0, 8).map((b) => b.area).join() === '151,311,356,340,363,336,254,198'); }
  { const r = run({ background: 'constant', constant: 30 }); check('fluorescence: a typed constant background', r.bgLevel === 30 && r.count === 30); }
  { const r = run({ method: 'triangle' }); check(`fluorescence: triangle threshold still finds 30, with bigger outlines (${r.t}, mean area ${r.meanArea.toFixed(1)})`, r.count === 30 && r.t === 14 && r.meanArea > 380); }
  { const r = run({ method: 'manual', manual: 40 }); check('fluorescence: manual threshold 40', r.t === 40 && r.count === 30); }
  { const r = run({ minArea: 0 }); check('fluorescence: with no minimum size the 3 specks count', r.count === 33 && r.removed === 0); }
  { const r = run({ maxArea: 300 }); check(`fluorescence: maximum size 300 px leaves out the big ones (${r.count})`, r.count > 0 && r.count < 30 && r.objects.every((b) => b.area <= 300)); }
  { const a = totA(run({})), b = totA(run({ fill: false })); check(`fluorescence: filling the nucleolus hole adds about 30 px (${a - b})`, a - b >= 20 && a - b <= 40); }
  { const r = run({ channel: 'g' }); check(`fluorescence: green channel shows the ${EXAMPLE.green} green nuclei (got ${r.count})`, r.count === EXAMPLE.green); }
  { const r = run({ channel: 'r' }); check('fluorescence: the empty red channel finds nothing', r.count === 0 && Number.isNaN(r.meanArea)); }
  { const r = run({ channel: 'b', invert: true, background: 'none' }); check('fluorescence: inverted, the background becomes the object', r.count === 1); }
  { const { nuclei, specks } = exampleNuclei(); check('fluorescence: the example is drawn from 30 nuclei, 8 green, 1 with a nucleolus, 3 specks', nuclei.length === 30 && nuclei.filter((n) => n.green).length === 8 && nuclei.filter((n) => n.hole).length === 1 && specks.length === 3); }
  { const r = run({}); const sumI = r.objects.reduce((s, b) => s + b.integrated, 0), sumA2 = r.objects.reduce((s, b) => s + b.area, 0);
    check('fluorescence: summary numbers add up', Math.abs(r.meanArea - sumA2 / 30) < 1e-9 && Math.abs(r.meanIntensity - sumI / sumA2) < 1e-9 && Math.abs(r.areaFraction - sumA2 / (400 * 300)) < 1e-12 && r.objects.every((b, i) => b.id === i + 1));
    check('fluorescence: numbered in reading order', r.objects.every((b, i) => i === 0 || b.y0 >= r.objects[i - 1].y0));
    const o = outlines(r.labels, r.w, r.h); check('fluorescence: every object has an outline', r.objects.every((b) => { for (let i = 0; i < o.length; i++) if (o[i] && r.labels[i] === b.id) return true; return false; })); }

  // Two overlapping disks by hand: one blob, two after the watershed, split near the middle.
  { const W = 60, H = 40, m = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (Math.hypot(x - 20, y - 20) <= 10 || Math.hypot(x - 37, y - 20) <= 10) m[y * W + x] = 1;
    const ws = watershed(m, W, H), l = label(m, W, H), g = { w: W, h: H, v: new Float32Array(W * H).fill(1) }, ob = measure(ws.labels, ws.n, g).objects;
    check(`fluorescence: two overlapping disks split in two (${ob.map((b) => b.area).join(', ')})`, l.n === 1 && ws.n === 2 && Math.abs(ob[0].area - ob[1].area) <= 12 && Math.abs(ob[0].x - 20) < 1.5 && Math.abs(ob[1].x - 37) < 1.5);
    const d = distance(m, W, H), p = peaks(d, m, W, H); let n = 0; for (const s of p) n = Math.max(n, s); check('fluorescence: two peaks in the distance map', n === 2); }
  { const W = 40, H = 40, m = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x - 20) / 14) ** 2 + ((y - 20) / 6) ** 2 <= 1) m[y * W + x] = 1;
    check('fluorescence: a long ellipse stays one object', watershed(m, W, H).n === 1); }
  { const W = 30, H = 20, m = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (x < 6 && y > 5 && y < 12) m[y * W + x] = 1; if (Math.hypot(x - 20, y - 10) < 5) m[y * W + x] = 1; }
    const L = label(m, W, H), g = { w: W, h: H, v: new Float32Array(W * H).fill(2) };
    check('fluorescence: leave out objects that touch the edge', measure(L.labels, L.n, g).objects.length === 2 && measure(L.labels, L.n, g, { dropEdge: true }).objects.length === 1 && measure(L.labels, L.n, g).objects[0].edge && measure(L.labels, L.n, g).objects[1].integrated === 2 * measure(L.labels, L.n, g).objects[1].area); }
  { const W = 21, H = 21, m = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const r = Math.hypot(x - 10, y - 10); if (r <= 8 && r > 3) m[y * W + x] = 1; }
    const f = fillHoles(m, W, H); check('fluorescence: a ring fills to a disk', f[10 * W + 10] === 1 && sum(f) > sum(m) && label(f, W, H).n === 1); }
};
