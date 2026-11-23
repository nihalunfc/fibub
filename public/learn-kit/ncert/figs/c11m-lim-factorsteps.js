// Class 11 Maths, Limits and Derivatives (step player): handling a 0/0 limit by factorising, then the rationalising trick.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'When substituting gives 0/0', [
  ['Find the limit as x → 3 of (x² − 9)/(x − 3). Substituting x = 3 gives 0/0: no answer yet, so rewrite the fraction.'],
  ['Factorise the top.', '(x − 3)(x + 3) / (x − 3)'],
  ['For x near 3 but not equal to 3, cancel (x − 3).', 'x + 3'],
  ['Now substitute x = 3.', 'limit = 6'],
  ['A second trick. Find the limit as x → 0 of (√(1 + x) − 1)/x, again 0/0. Multiply top and bottom by the conjugate √(1 + x) + 1.', '[(1 + x) − 1] / [x(√(1 + x) + 1)]'],
  ['Simplify: the top is x, so x cancels.', '1 / (√(1 + x) + 1)'],
  ['Substitute x = 0.', 'limit = 1/(1 + 1) = 1/2'],
], 'Evaluating limits of the form zero over zero by factorising and rationalising', 1.0);
