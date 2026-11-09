// #547 Fractal explorer. Escape counts and smooth values from a plain Python loop over complex numbers
// (z → z² + c, Python 3 complex abs, /home/user/pyenv); Moran dimensions from scipy.optimize.brentq;
// log 3 / log 2 and log 8 / log 3 exact. Mandelbrot area 1.50659177 (published pixel-counting value,
// a general maths fact) checked loosely by pixel count.
import { escapeCount, smooth, inBulbs, renderRows, pixel, minSpan, autoIter, colour, IFS, chaos, moranDim, boxDim, bounds } from '../../src/lib/sci/fractal.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const pts = [[0, 0], [1, 0], [-2, 0], [-2.0001, 0], [0.25, 0], [0.26, 0], [-0.75, 0.1], [-0.1, 0.65], [0.3, 0.5], [-1.25, 0.02], [0.2, -0.55], [-0.7435, 0.1314]];
  const want = [-1, 3, -1, 1, -1, 30, 33, 75, -1, 889, 652, 62];
  check('fractal: Mandelbrot escape counts match Python for 12 points', pts.map(([x, y]) => escapeCount(0, 0, x, y, 1000)).join() === want.join());
  check('fractal: Julia escape counts (c = -0.8 + 0.156i) match Python', [[0, 0], [0.5, 0.5], [1, 0], [-0.3, 0.2], [1.5, 1.5]].map(([x, y]) => escapeCount(x, y, -0.8, 0.156, 500)).join() === '252,4,135,21,0');
  check('fractal: smooth escape values match Python', near(smooth(0, 0, 1, 0, 100), 3.2956434102584176, 1e-12) && near(smooth(0, 0, -0.75, 0.1, 1000), 33.95333423350741, 1e-9) && smooth(0, 0, 0.3, 0.5, 1000) === -1);
  { // The bulb test never claims a point that escapes.
    let bad = 0; for (let i = 0; i < 20000; i++) { const x = -2 + (2.6 * (i % 200)) / 200, y = -1.2 + (2.4 * Math.floor(i / 200)) / 100; if (inBulbs(x, y) && escapeCount(0, 0, x, y, 3000) >= 0) bad++; }
    check('fractal: cardioid and bulb shortcut is safe on a 200 × 100 grid', bad === 0 && inBulbs(0, 0) && inBulbs(-1, 0) && !inBulbs(0.3, 0.5)); }
  { const job = { kind: 'mandelbrot', cx: -0.75, cy: 0, span: 2.7, w: 540, h: 480, max: 2000, jr: 0, ji: 0 }, out = new Float32Array(job.w * job.h);
    renderRows(job, 0, job.h, out); const k = job.span / job.w; let inside = 0; for (const v of out) if (v < 0) inside++;
    check(`fractal: Mandelbrot area by pixel count ≈ 1.5066 (${(inside * k * k).toFixed(4)})`, near(inside * k * k, 1.50659, 0.015)); }
  { const job = { kind: 'mandelbrot', cx: 1, cy: 2, span: 4, w: 4, h: 2, max: 10 }, p = pixel(job, 0, 0); check('fractal: pixel centres', p[0] === -0.5 && p[1] === 2.5); }
  check('fractal: deep zoom limit is a view about 3e-12 wide (16 doubles per pixel)', minSpan(-0.75, 0.1, 800) > 1e-12 && minSpan(-0.75, 0.1, 800) < 1e-11 && autoIter(3.6) === 200 && autoIter(3.6 / 1024) === 1400);
  check('fractal: colours', colour(-1, 'ocean').join() === '0,0,0' && colour(5, 'fire').every((c) => c >= 0 && c <= 255));
  // IFS.
  check('fractal: Moran dimension of the Sierpinski triangle = log 3 / log 2', near(moranDim(IFS.sierpinski.ratios), Math.log(3) / Math.log(2), 1e-13));
  check('fractal: Moran dimension of the carpet = log 8 / log 3', near(moranDim(IFS.carpet.ratios), Math.log(8) / Math.log(3), 1e-13));
  check('fractal: Moran dimension of the dragon = 2', near(moranDim(IFS.dragon.ratios), 2, 1e-13) && near(moranDim([0.5, 0.25, 0.25, 0.25]), 1.2033738544223431, 1e-12));
  check('fractal: map probabilities add to 1', Object.values(IFS).every((d) => near(d.maps.reduce((s, m) => s + m.p, 0), 1, 1e-12)));
  { const p = chaos(IFS.fern.maps, 100000), [x0, x1, y0, y1] = bounds(p); check(`fractal: Barnsley fern fits its known box (x ${x0.toFixed(2)}..${x1.toFixed(2)}, y ${y0.toFixed(2)}..${y1.toFixed(2)})`, x0 > -2.25 && x0 < -2.1 && x1 > 2.6 && x1 < 2.75 && y0 >= 0 && y1 > 9.9 && y1 < 10.01); }
  { const p = chaos(IFS.sierpinski.maps, 200000), b = boxDim(p); check(`fractal: box-counting of the triangle ≈ 1.585 (${b.dim.toFixed(3)})`, near(b.dim, 1.585, 0.05) && b.levels.length >= 5); }
  { const p = chaos(IFS.carpet.maps, 300000), b = boxDim(p); check(`fractal: box-counting of the carpet ≈ 1.893 (${b.dim.toFixed(3)})`, near(b.dim, 1.893, 0.06)); }
  { const a = chaos(IFS.dragon.maps, 1000, 7), b = chaos(IFS.dragon.maps, 1000, 7); check('fractal: the chaos game is repeatable', a.every((v, i) => v === b[i])); }
};
