// #961 PIV lite: correlation matches an independent NumPy FFT implementation window by window; known made-up shifts recovered.
import { synthPair, piv, medianTest, fieldAt, xcorr } from '../../src/lib/sci/phpiv.ts';
export default async (check) => {
  { const n = 8, a = new Float64Array(n * n), b = new Float64Array(n * n); a[2 * n + 3] = 1; b[4 * n + 6] = 1; const R = xcorr(a, b, n); let p = 0; for (let k = 1; k < n * n; k++) if (R[k] > R[p]) p = k;
    check('piv: cross-correlation peak of a single moved dot is at (+3, +2)', p === 2 * n + 3 && Math.abs(R[p] - 1) < 1e-12); }
  const { A, B } = synthPair(256, 192, 'shift', 3.3);
  const r1 = piv(A, B, 32, 16, 1);
  const want = [[16, 16, 3.013782, -1.62368], [48, 32, 3.087149, -1.603642], [176, 48, 3.281118, -1.606752], [176, 112, 3.228045, -1.634954], [176, 176, 3.339518, -1.60175]];
  check('piv: single-pass vectors equal NumPy FFT correlation with Gaussian sub-pixel fit (5 windows, 1e-5 px)', [0, 17, 40, 100, 160].every((k, i) => r1.vecs[k].x === want[i][0] && r1.vecs[k].y === want[i][1] && Math.abs(r1.vecs[k].u - want[i][2]) < 1e-5 && Math.abs(r1.vecs[k].v - want[i][3]) < 1e-5));
  check('piv: grid of 15 × 11 windows (32 px, 50 % overlap) on 256 × 192', r1.nx === 15 && r1.ny === 11 && r1.vecs.length === 165);
  const inner = (r) => r.vecs.filter((v) => v.x >= 32 && v.y >= 32 && v.x <= 224 && v.y <= 160);
  { const m = inner(piv(A, B, 32, 16, 2)), mu = m.reduce((a, v) => a + v.u, 0) / m.length, mv = m.reduce((a, v) => a + v.v, 0) / m.length;
    check(`piv: two passes recover a made-up shift of (3.3, −1.65) px within 0.05 px (${mu.toFixed(3)}, ${mv.toFixed(3)})`, Math.abs(mu - 3.3) < 0.05 && Math.abs(mv + 1.65) < 0.05); }
  for (const [f, mag, tol] of [['vortex', 2.5, 0.25], ['shear', 3.3, 0.15]]) {
    const p = synthPair(256, 192, f, mag), r = piv(p.A, p.B, 32, 16, 2); let e = 0; const m = inner(r); for (const v of m) { const [u, w] = fieldAt(f, v.x, v.y, 256, 192, mag); e += (v.u - u) ** 2 + (v.v - w) ** 2; }
    check(`piv: made-up ${f} recovered, rms error below ${tol} px`, Math.sqrt(e / m.length) < tol);
  }
  { const p = synthPair(256, 192, 'shift', 3.3), r = piv(p.A, p.B, 32, 16, 2); r.vecs[60].u = 12; r.vecs[60].v = -9; const c = medianTest(r.vecs, r.nx, r.ny);
    check('piv: median test catches a planted outlier and replaces it', c >= 1 && !r.vecs[60].valid && r.vecs[60].replaced && Math.abs(r.vecs[60].u - 3.3) < 0.3); }
  let t = ''; try { piv({ w: 10, h: 10, d: new Float32Array(100) }, { w: 12, h: 10, d: new Float32Array(120) }, 8, 4); } catch (e) { t = e.message; }
  check('piv: images of different sizes are refused', t.includes('same size'));
};
