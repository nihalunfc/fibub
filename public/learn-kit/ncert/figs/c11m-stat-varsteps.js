// Class 11 Maths, Statistics (step player): mean deviation, variance and standard deviation of 3, 5, 8, 9, 10, 13, 14, 18 done in order.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Spread of 3, 5, 8, 9, 10, 13, 14, 18', [
  ['Step 1: the mean.', 'Σx = 80 and n = 8, so mean = 10'],
  ['Step 2: the deviations x − mean, one for each value.', '−7, −5, −2, −1, 0, 3, 4, 8  (they add to 0, always)'],
  ['Step 3: mean deviation, ignoring signs.', '(7 + 5 + 2 + 1 + 0 + 3 + 4 + 8) ÷ 8 = 30 ÷ 8 = 3.75'],
  ['Step 4: square the deviations (this removes the signs another way).', '49, 25, 4, 1, 0, 9, 16, 64  (sum = 168)'],
  ['Step 5: the variance is their average.', 'σ² = 168 ÷ 8 = 21'],
  ['Step 6: the standard deviation is the square root (back in the units of the data).', 'σ = √21 ≈ 4.58'],
  ['Shortcut check: σ² = (Σx²)/n − mean². Here Σx² = 9 + 25 + 64 + 81 + 100 + 169 + 196 + 324 = 968.', '968 ÷ 8 − 100 = 121 − 100 = 21 ✓'],
], 'Computing mean deviation, variance and standard deviation for eight numbers in order', 1.0);
