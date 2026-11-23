// Class 11 Maths, Three-dimensional Geometry (step player): the section formula by similar triangles, then the midpoint and centroid.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'The section formula, step by step', [
  ['P divides AB internally in the ratio m : n, meaning AP : PB = m : n. Drop perpendiculars from A, P and B to the XY-plane, then to the x-axis.'],
  ['Parallel lines cut every transversal in the same ratio, so on the x-axis the feet cut it as m : n.', '(x − x₁) : (x₂ − x) = m : n'],
  ['Cross-multiply and solve for x.', 'n(x − x₁) = m(x₂ − x)  so  x(m + n) = mx₂ + nx₁'],
  ['The same argument works for y and z.', 'P = ((mx₂ + nx₁)/(m + n), (my₂ + ny₁)/(m + n), (mz₂ + nz₁)/(m + n))'],
  ['Special cases. m = n gives the midpoint; three points give the centroid of a triangle.', 'Midpoint ((x₁ + x₂)/2, …)   Centroid ((x₁ + x₂ + x₃)/3, …)'],
  ['Example: A(2, −1, 4), B(8, 5, −2), ratio 1 : 2.', 'P = ((8 + 4)/3, (5 − 2)/3, (−2 + 8)/3) = (4, 1, 2)'],
  ['External division (P on the line AB but outside the segment, m ≠ n): replace n by −n.', 'P = ((mx₂ − nx₁)/(m − n), …)'],
], 'Deriving the section formula in three dimensions with similar triangles', 1.0);
