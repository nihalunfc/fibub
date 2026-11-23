// Class 11 Maths, Limits and Derivatives (step player): the derivative of x² from the definition f'(x) = lim (f(x + h) - f(x))/h.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Derivative of x² from first principles', [
  ['Definition: f′(x) = lim (h → 0) [f(x + h) − f(x)] / h. Here f(x) = x².'],
  ['Write the difference quotient (the slope of the secant from x to x + h).', '[(x + h)² − x²] / h'],
  ['Expand the bracket.', '(x² + 2xh + h² − x²) / h'],
  ['The x² terms cancel. Factor h from the top.', 'h(2x + h) / h'],
  ['Cancel h (allowed: h is close to 0 but not equal to it).', '2x + h'],
  ['Now let h → 0.', 'f′(x) = 2x'],
  ['Check: at x = 3 the tangent slope is 6. A secant from x = 3 to 3.001 has slope 6.001, already very close.'],
], 'Differentiating x squared from the limit definition of the derivative', 0.95);
