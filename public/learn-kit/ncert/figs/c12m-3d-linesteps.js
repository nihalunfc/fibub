// Class 12 Maths, Three Dimensional Geometry (step player): the line through A(1, -2, 3) and B(3, 0, 7) in vector and Cartesian form.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Equation of a line through two points', [
  ['A line is fixed by one point on it and a direction. We have two points: A(1, −2, 3) and B(3, 0, 7).'],
  ['Direction = B − A (any multiple will do).', 'b = (3 − 1, 0 + 2, 7 − 3) = (2, 2, 4), or simply (1, 1, 2)'],
  ['Vector form: r = a + λb with a = the position vector of A.', 'r = (i − 2j + 3k) + λ(i + j + 2k)'],
  ['Cartesian form: read the three coordinates and eliminate λ.', '(x − 1)/1 = (y + 2)/1 = (z − 3)/2   (= λ)'],
  ['Check B: put λ = 2.', 'x = 1 + 2 = 3, y = −2 + 2 = 0, z = 3 + 4 = 7. That is B, so the line passes through both points.'],
], 'Writing the equation of a line through two points in vector and Cartesian form');
