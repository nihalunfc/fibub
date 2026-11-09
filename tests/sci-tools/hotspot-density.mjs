// #768 Hot spot density: kernel density, bandwidth rules and Clark–Evans, checked against scikit-learn
// (KernelDensity, Gaussian), NumPy (quartic kernel, bandwidth rules) and SciPy (cKDTree nearest neighbours, normal
// p-value) on the made-up incidents in tests/fixtures/hotspot-density.csv.
import { readFileSync } from 'node:fs';
import { kernel, kdeAt, kdeGrid, scott, spatialRule, clarkEvans, nearestDistances, topCells, localPeaks, contour, toLocal, fromLocal } from '../../src/lib/sci/kde2d.ts';

export default async (check) => {
  const P = readFileSync(new URL('../fixtures/hotspot-density.csv', import.meta.url), 'utf8').trim().split('\n').slice(1).map((l) => { const [x, y] = l.split(',').map(Number); return { x, y }; });
  const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.abs(b) + 1e-300;
  const Q = [[600, 1400], [1450, 700], [1000, 1000], [200, 1800]];
  check('kde2d: fixture has 120 points', P.length === 120);
  check('kde2d: Scott bandwidth matches NumPy', rel(scott(P), 210.64314635357948));
  check('kde2d: spatial (Silverman-type) bandwidth matches NumPy', rel(spatialRule(P), 227.6049256887282));
  const g1 = [0.00016045311025624255, 0.0001066796190237014, 1.7867669555195565e-05, 1.134640872612028e-05], g2 = [0.0002789803085124621, 0.0001619877604447987, 5.2076286228545925e-06, 5.603636953801073e-06], q = [0.0005291702861825641, 0.00024334341847691282, 0.0, 3.0131017197228257e-06];
  check('kde2d: Gaussian intensity at 4 places, h = Scott, matches scikit-learn × n', Q.every(([x, y], i) => rel(kdeAt(P, 'gaussian', scott(P), x, y), g1[i], 1e-8)));
  check('kde2d: Gaussian intensity, h = 150, matches scikit-learn × n', Q.every(([x, y], i) => rel(kdeAt(P, 'gaussian', 150, x, y), g2[i], 1e-8)));
  check('kde2d: quartic intensity, h = 250, matches NumPy', Q.every(([x, y], i) => (q[i] === 0 ? kdeAt(P, 'quartic', 250, x, y) === 0 : rel(kdeAt(P, 'quartic', 250, x, y), q[i], 1e-9))));
  // The grid at a cell centre equals the direct sum; the grid adds up to n events.
  const g = kdeGrid(P, 'quartic', 250, 20, { x0: -300, y0: -300, x1: 2300, y1: 2300 });
  const c = g.cols * Math.floor((1400 + 300) / 20) + Math.floor((600 + 300) / 20), cx = -300 + (Math.floor(900 / 20) + 0.5) * 20, cy = -300 + (Math.floor(1700 / 20) + 0.5) * 20;
  check('kde2d: grid cell equals the direct sum at its centre', rel(g.z[c], kdeAt(P, 'quartic', 250, cx, cy), 1e-12));
  const total = g.z.reduce((s, v) => s + v, 0) * 400;
  check(`kde2d: quartic grid integrates to n (${total.toFixed(2)})`, Math.abs(total - P.length) < 0.5);
  const gg = kdeGrid(P, 'gaussian', 150, 20, { x0: -800, y0: -800, x1: 2800, y1: 2800 }), tg = gg.z.reduce((s, v) => s + v, 0) * 400;
  check(`kde2d: Gaussian grid integrates to n (${tg.toFixed(2)})`, Math.abs(tg - P.length) < 0.5);
  check('kde2d: kernels integrate to 1 and quartic is 0 beyond h', Math.abs(kernel('quartic', 0, 2) - 3 / (4 * Math.PI)) < 1e-15 && kernel('quartic', 4, 2) === 0 && Math.abs(kernel('gaussian', 0, 1) - 1 / (2 * Math.PI)) < 1e-15);
  const top = topCells(g, 3);
  check('kde2d: top cell is in the first made-up cluster', Math.hypot(top[0].x - 600, top[0].y - 1400) < 200 && top[0].z >= top[1].z && top[1].z >= top[2].z);
  const pk = localPeaks(g, 5);
  check('kde2d: separate peaks find both made-up clusters, highest first', pk.length >= 2 && Math.hypot(pk[0].x - 600, pk[0].y - 1400) < 200 && pk.slice(0, 3).some((c) => Math.hypot(c.x - 1450, c.y - 700) < 250) && pk[0].z === top[0].z && pk.every((c, i) => i === 0 || c.z <= pk[i - 1].z));
  const two = { x0: 0, y0: 0, cell: 1, cols: 5, rows: 1, z: new Float64Array([1, 3, 1, 2, 1]) };
  check('kde2d: local peaks of a 1-row grid', localPeaks(two, 9).map((c) => c.col).join() === '1,3');
  const ce = clarkEvans(P, (Math.max(...P.map((p) => p.x)) - Math.min(...P.map((p) => p.x))) * (Math.max(...P.map((p) => p.y)) - Math.min(...P.map((p) => p.y))));
  const W = {"area": 3647565.0, "ro": 65.08444394085858, "re": 87.17278101563583, "R": 0.7466142892605966, "z": -5.310111322369538, "p": 1.0955829448105429e-07};
  check('kde2d: Clark–Evans (box area) R, z and p match SciPy', rel(ce.area, W.area) && rel(ce.ro, W.ro, 1e-12) && rel(ce.R, W.R, 1e-12) && rel(ce.z, W.z, 1e-12) && rel(ce.p, W.p, 1e-6));
  const c4 = clarkEvans(P, 4e6), W4 = {"R": 0.7129643617817735, "z": -6.01530049969447, "p": 1.7955330781992327e-09};
  check('kde2d: Clark–Evans with a given area (4 km²) matches SciPy', rel(c4.R, W4.R, 1e-12) && rel(c4.z, W4.z, 1e-12) && rel(c4.p, W4.p, 1e-5));
  const brute = P.map((a, i) => Math.min(...P.map((b, j) => (i === j ? Infinity : Math.hypot(a.x - b.x, a.y - b.y)))));
  check('kde2d: sweep nearest neighbours equal brute force', nearestDistances(P).every((v, i) => v === brute[i]));
  const grid = [0, 1, 2, 3].flatMap((i) => [0, 1, 2, 3].map((j) => ({ x: i * 10, y: j * 10 })));
  check('kde2d: a regular grid of points is dispersed (R > 1)', clarkEvans(grid, 40 * 40).R > 1);
  // Contour of a cone z = 10 − r crosses level 5 at r ≈ 5.
  const cone = { x0: -10, y0: -10, cell: 1, cols: 20, rows: 20, z: new Float64Array(400) };
  for (let r = 0; r < 20; r++) for (let k = 0; k < 20; k++) cone.z[r * 20 + k] = 10 - Math.hypot(-9.5 + k, -9.5 + r);
  const segs = contour(cone, 5);
  check(`kde2d: marching squares contour of a cone lies near r = 5 (${segs.length} segments)`, segs.length > 20 && segs.every(([a, b, e, f]) => Math.abs(Math.hypot(a, b) - 5) < 0.05 && Math.abs(Math.hypot(e, f) - 5) < 0.05));
  const [lx, ly] = toLocal(51.51, -0.12, 51.5, -0.1), [la, lo] = fromLocal(lx, ly, 51.5, -0.1);
  const hav = 2 * 6371008.8 * Math.asin(Math.sqrt(Math.sin((0.01 * Math.PI / 180) / 2) ** 2 + Math.cos(51.5 * Math.PI / 180) * Math.cos(51.51 * Math.PI / 180) * Math.sin((-0.02 * Math.PI / 180) / 2) ** 2));
  check('kde2d: local metres agree with haversine within 0.1 % over 2 km, and convert back', Math.abs(Math.hypot(lx, ly) - hav) / hav < 1e-3 && Math.abs(la - 51.51) < 1e-12 && Math.abs(lo + 0.12) < 1e-12);
};
