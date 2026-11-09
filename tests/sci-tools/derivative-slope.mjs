// #1181 derivative as a slope. Exact derivatives, second derivatives and antiderivatives of the ready-made
// functions checked against sympy 1.14 (diff, integrate) at x = 0.7, 1.3, 2.2; the first-principles
// expansions against sympy.expand((x + h)^n); numerical derivatives of a typed function against sympy.diff.
import * as SC from '../../src/lib/sci/school-calculus.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const P = [0.7, 1.3, 2.2];
  const sym = {
    x2: [[1.4, 2.6, 4.4], [2, 2, 2]], x3: [[-1.53, 2.07, 11.52], [4.2, 7.8, 13.2]],
    sin: [[0.7648421872844885, 0.26749882862458735, -0.5885011172553458], [-0.644217687237691, -0.963558185417193, -0.8084964038195901]],
    cos: [[-0.644217687237691, -0.963558185417193, -0.8084964038195901], [-0.7648421872844885, -0.26749882862458735, 0.5885011172553458]],
    exp: [[2.013752707470476, 3.6692966676192444, 9.025013499434122], [2.013752707470476, 3.6692966676192444, 9.025013499434122]],
    ln: [[1.4285714285714286, 0.7692307692307692, 0.45454545454545453], [-2.0408163265306123, -0.5917159763313609, -0.20661157024793386]],
    sqrt: [[0.5976143046671969, 0.4385290096535146, 0.337099931231621], [-0.4268673604765692, -0.16866500371289023, -0.07661362073445932]],
    inv: [[-2.0408163265306123, -0.5917159763313609, -0.20661157024793386], [5.830903790087465, 0.9103322712790167, 0.18782870022539438]],
  };
  for (const [id, [d1, d2]] of Object.entries(sym)) {
    const p = SC.preset(id);
    check(`derivative: ${id} f′ and f″ match sympy at 0.7, 1.3, 2.2`, P.every((x, i) => near(p.d(x), d1[i]) && near(p.d2(x), d2[i])));
    check(`derivative: ${id} numerical derivative agrees with the exact one`, P.every((x, i) => near(SC.deriv(p.f, x), d1[i], 1e-6)));
    if (p.F) check(`derivative: ${id} antiderivative F′ = f (sympy integrate)`, P.every((x) => near(SC.deriv(p.F, x), p.f(x), 1e-6)));
  }
  check('derivative: secant slope of x³ − 3x from 1.5 to 1.75 = 4.9375 (sympy)', near(SC.secant(SC.preset('x3').f, 1.5, 0.25), 4.9375, 1e-12));
  check('derivative: secant of x² is 2a + h', near(SC.secant((x) => x * x, 1, 0.1), 2.1, 1e-12) && near(SC.secant((x) => x * x, 1, -0.01), 1.99, 1e-10));
  check('derivative: |x| has no derivative at 0 but left −1 and right 1', Number.isNaN(SC.deriv(Math.abs, 0)) && near(SC.sideSlopes(Math.abs, 0).left, -1) && near(SC.sideSlopes(Math.abs, 0).right, 1));
  const own = SC.readFn('x^3/3 - x + sin(2x)');
  check('derivative: typed x³/3 − x + sin 2x, f′(0.4) = 0.553413 (sympy)', near(SC.deriv(own, 0.4), 0.5534134186943308, 1e-7));
  check('derivative: typed e^x and |x| read', near(SC.readFn('e^x')(1), Math.E) && SC.readFn('y = |x - 2|')(0) === 2);
  let msg = ''; try { SC.readFn('x + t'); } catch (e) { msg = e.message; }
  check('derivative: a stray letter gives a friendly message', msg.includes('Use only x'));
  check('derivative: binomial coefficients C(6, k)', [0, 1, 2, 3, 4, 5, 6].map((k) => SC.nCr(6, k)).join() === '1,6,15,20,15,6,1');
  const s3 = SC.firstPrinciplesPower(3), s6 = SC.firstPrinciplesPower(6);
  check('derivative: first principles for x³ expands as sympy (x³ + 3x²h + 3xh² + h³)', s3[1].endsWith('x³ + 3x²h + 3xh² + h³') && s3[2].endsWith('3x² + 3xh + h²') && s3[4].endsWith('3x²'));
  check('derivative: first principles for x⁶ (6x⁵ + 15x⁴h + 20x³h² + …)', s6[2].endsWith('6x⁵ + 15x⁴h + 20x³h² + 15x²h³ + 6xh⁴ + h⁵') && s6[4].endsWith('6x⁵'));
  check('derivative: first principles for x¹ and sin x', SC.firstPrinciplesPower(1)[4].endsWith('= 1') && SC.firstPrinciplesSin()[4].endsWith('cos x'));
};
