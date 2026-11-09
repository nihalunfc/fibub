// #1151 Quadratic explorer. Roots, discriminant and vertex checked against numpy.roots and hand-worked examples
// (x² − 5x + 6, 2x² + x − 6, x² − 4x + 4, x² + 2x + 5); factor pairs checked by expanding them back.
import { quad, quadText, completeSquare, splitMiddle, factorText, practice } from '../../src/lib/sci/quadratic-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  let q = quad(1, -5, 6);
  check('quad: x²−5x+6 has roots 2 and 3, D = 1', q.kind === 'two' && q.D === 1 && near(q.roots[0], 2) && near(q.roots[1], 3));
  check('quad: vertex of x²−5x+6 is (2.5, −0.25)', near(q.h, 2.5) && near(q.k, -0.25) && near(q.sum, 5) && near(q.product, 6));
  q = quad(2, 1, -6);
  check('quad: 2x²+x−6 roots −2 and 1.5, D = 49', q.D === 49 && near(q.roots[0], -2) && near(q.roots[1], 1.5));
  q = quad(1, -4, 4);
  check('quad: x²−4x+4 equal roots 2', q.kind === 'one' && near(q.roots[0], 2) && near(q.k, 0));
  q = quad(1, 2, 5);
  check('quad: x²+2x+5 no real roots, −1 ± 2i', q.kind === 'none' && q.roots.length === 0 && near(q.re, -1) && near(q.im, 2) && q.D === -16);
  q = quad(-1, 0, 4);
  check('quad: −x²+4 roots ±2, vertex (0, 4)', near(q.roots[0], -2) && near(q.roots[1], 2) && near(q.h, 0) && near(q.k, 4));
  q = quad(1, 1e8, 1);
  check('quad: stable small root of x²+1e8x+1 (numpy: −1e-8)', near(q.roots[1], -1e-8, 1e-15) && near(q.roots[0], -1e8, 1e-4));
  // numpy.roots([3, -7, 1]) = [2.18046042, 0.15287291]
  q = quad(3, -7, 1);
  check('quad: 3x²−7x+1 matches numpy.roots', near(q.roots[0], 0.15287291, 1e-8) && near(q.roots[1], 2.18046042, 1e-8));
  check('text: x² − 5x + 6', quadText(1, -5, 6) === 'x² − 5x + 6' && quadText(-1, 1, 0) === '−x² + x' && quadText(2, 0, -3) === '2x² − 3');
  const cs = completeSquare(1, -6, 5);
  check('complete square: x²−6x+5 → (x − 3)² = 4 → 1 or 5', cs.some((s) => s.includes('(x − 3)² = 4')) && cs.at(-1).includes('x = 1 or x = 5'));
  check('complete square: no real roots message', completeSquare(1, 2, 5).at(-1).includes('no real roots'));
  let s = splitMiddle(6, -1, -2);
  check('split: 6x²−x−2 = (2x+1)(3x−2), −4 and 3', s && s.p === -4 && s.q === 3 && factorText(s.f1) + factorText(s.f2) === '(2x + 1)(3x − 2)');
  check('split: x²+x+1 has no whole-number split', splitMiddle(1, 1, 1) === null && splitMiddle(1, 0.5, 1) === null);
  // Every split expands back to the quadratic; every practice quadratic has its stated roots.
  let ok = true, okp = true;
  for (let a = -4; a <= 4; a++) for (let b = -9; b <= 9; b++) for (let c = -9; c <= 9; c++) {
    if (!a) continue;
    const r = splitMiddle(a, b, c);
    if (r) { const [m, n] = r.f1, [u, v] = r.f2; if (m * u !== a || m * v + n * u !== b || n * v !== c) ok = false; }
    else { const D = b * b - 4 * a * c; if (D >= 0 && Number.isInteger(Math.sqrt(D))) ok = false; }   // rational roots must split
  }
  for (let i = 0; i < 200; i++) { const p = practice(); const r = quad(p.a, p.b, p.c).roots; if (!near(r[0], p.roots[0], 1e-9) || !near(r[1], p.roots[1], 1e-9)) okp = false; }
  check('split: every whole-number quadratic (a −4..4, b, c −9..9) factors back, and splits exactly when √D is whole', ok);
  check('practice: 200 random quadratics have the stated roots', okp);
};
