// #882 seismic refraction: forward travel times against first arrivals found by Fermat's principle (SciPy minimize over
// the ray's crossing points, refr.py) for flat and dipping planar layers; recovering speeds, thicknesses, dip and depths
// from noise-free picks; intercept and crossover formulas; automatic and manual layer breaks.
import { fitSeg, segment, crossover, interceptDepths, crossoverDepths, dippingLayer, forwardTimes, sortPicks } from '../../src/lib/sci/refraction.ts';

const EXP = {"flat": [0.01, 0.026481436858480516, 0.035797047366105186, 0.04079704736610518, 0.04829704736610517, 0.055797047366105204], "flatx": [5.0, 20.0, 40.0, 60.0, 90.0, 120.0], "dipF": [0.03516436615916979, 0.051010987551182, 0.0668576089431942, 0.08270423033520641], "dipR": [0.05655248099634434, 0.06564496086082774, 0.07473744072531113, 0.08382992058979455], "dipx": [30.0, 60.0, 90.0, 120.0]};
const near = (a, b, tol) => Math.abs(a - b) <= tol;

export default async (check) => {
  const V = [500, 1800, 4000], H = [4, 10];
  check('refraction: flat 3-layer first arrivals match Fermat ray paths (1e-9 s)', forwardTimes(V, H, EXP.flatx).first.every((t, i) => near(t, EXP.flat[i], 1e-9)));
  // Dipping two-layer case: lines through the Fermat times, then the dipping solution.
  const lf = fitSeg(EXP.dipx, EXP.dipF), lr = fitSeg(EXP.dipx, EXP.dipR), d = dippingLayer(600, lf, lr);
  check('refraction: Fermat head waves over a dipping plane are straight lines', lf.rms < 1e-9 && lr.rms < 1e-9);
  check('refraction: dipping solution gives V2 2400 m/s and dip 4°', near(d.v2, 2400, 1e-6) && near(d.dip, 4, 1e-8));
  check('refraction: vertical depths 6 m and 6 + 125 tan 4° under the shots', near(d.hVertF, 6, 1e-6) && near(d.hVertR, 6 + 125 * Math.tan((4 * Math.PI) / 180), 1e-6) && near(d.hPerpF, 6 * Math.cos((4 * Math.PI) / 180), 1e-6));
  { const s = dippingLayer(600, lr, lf); check('refraction: swapping shots flips the dip', near(s.dip, -4, 1e-8) && near(s.hVertF, d.hVertR, 1e-9)); }
  // Noise-free flat picks every 2 m: automatic breaks and both depth methods recover the model.
  const x = Array.from({ length: 60 }, (_, i) => 2 + 2 * i), t = forwardTimes(V, H, x).first;
  const seg = segment(x, t, 3, { origin: true });
  check('refraction: automatic breaks find the three branches', seg.lines.every((l, k) => near(l.v, V[k], 1e-6)) && seg.lines.every((l) => l.rms < 1e-12));
  const h = interceptDepths(seg.lines.map((l) => l.v), seg.lines.map((l) => l.ti));
  check('refraction: intercept-time thicknesses 4 m and 10 m', near(h[0], 4, 1e-9) && near(h[1], 10, 1e-8));
  const xc = [crossover(seg.lines[0], seg.lines[1]), crossover(seg.lines[1], seg.lines[2])];
  const hx = crossoverDepths(seg.lines.map((l) => l.v), xc);
  check('refraction: crossover thicknesses match', near(hx[0], 4, 1e-9) && near(hx[1], 10, 1e-8));
  check('refraction: two-layer crossover formula h = (xc/2)√((V2−V1)/(V2+V1))', near(crossoverDepths([500, 1800], [xc[0]])[0], (xc[0] / 2) * Math.sqrt(1300 / 2300), 1e-12));
  { const hd = forwardTimes(V, H, [0]).heads; check('refraction: crossover offsets equal where branches meet', near(hd[1].ti + xc[0] / 1800, xc[0] / 500, 1e-12)); }
  { const m = segment(x, t, 3, { breaks: [xc[1], xc[0]], origin: true }); check('refraction: manual breaks (any order) give the same lines', m.lines.every((l, k) => near(l.v, V[k], 1e-6))); }
  { let e = ''; try { segment(x, t, 3, { breaks: [10] }); } catch (er) { e = er.message; } check('refraction: wrong number of breaks refused', e.includes('Give 2 break offsets')); }
  { let e = ''; try { segment([1, 2, 3], [1, 2, 3], 2); } catch (er) { e = er.message; } check('refraction: too few picks refused', e.includes('at least 4 picks')); }
  check('refraction: critical distance and hidden (slower) layer', near(forwardTimes([500, 1800], [4], [0]).heads[1].xcrit, 2 * 4 * Math.tan(Math.asin(500 / 1800)), 1e-12) && !forwardTimes([1000, 800, 3000], [3, 3], [50]).heads[1].ok);
  // Blog article ahad-rafidah-seismic-refraction-spread-length-crossover: 530/1890/2630 m/s with 4 m of alluvium over
  // basement at 30 m. On the paper's 115 m spread (24 geophones at 5 m) the third branch is never a first arrival.
  { const v = [530, 1890, 2630], h = [4, 26], xs = Array.from({ length: 24 }, (_, i) => i * 5);
    const F = forwardTimes(v, h, xs), hd = F.heads;
    const xcs = [1, 2].map((n) => (hd[n].ti - hd[n - 1].ti) / (1 / v[n - 1] - 1 / v[n]));
    check('refraction: Ahad Rafidah article, intercepts 14.49 and 33.92 ms and critical distance 55.4 m',
      near(hd[1].ti * 1000, 14.49, 0.005) && near(hd[2].ti * 1000, 33.92, 0.005) && near(hd[2].xcrit, 55.4, 0.05));
    check('refraction: Ahad Rafidah article, crossovers 10.7 m and 130.5 m', near(xcs[0], 10.7, 0.05) && near(xcs[1], 130.5, 0.05));
    check('refraction: Ahad Rafidah article, only two branches arrive first inside the 115 m spread', new Set(F.layer).size === 2 && !F.layer.includes(2));
    const hx = crossoverDepths(v, xcs.map((x) => +x.toFixed(1)));
    check('refraction: Ahad Rafidah article, crossover depths give back 4.01 m and 26.00 m', near(hx[0], 4.01, 0.01) && near(hx[1], 26.0, 0.02));
    const { lines } = segment(xs, F.first.map((t) => +(t * 1000).toFixed(2) / 1000), 2);
    check('refraction: Ahad Rafidah article, two-layer fit of the rounded picks gives 530 and 1890 m/s and 4.00 m',
      near(lines[0].v, 529.9, 0.5) && near(lines[1].v, 1890, 1) && near(interceptDepths(lines.map((l) => l.v), lines.map((l) => l.ti))[0], 4.0, 0.01)); }
  { const p = sortPicks([30, -10, 20, NaN], [3, 1, 2, 5]); check('refraction: picks sorted by offset, ms to s, gaps dropped', p.x.join() === '10,20,30' && p.t.join() === '0.001,0.002,0.003'); }
};
