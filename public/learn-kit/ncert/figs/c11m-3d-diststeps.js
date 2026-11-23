// Class 11 Maths, Three-dimensional Geometry (step player): proving the distance formula with two right triangles.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Distance between two points in space', [
  ['Find AB for A(x₁, y₁, z₁) and B(x₂, y₂, z₂). Draw the box with AB as its long diagonal and all faces parallel to the planes.'],
  ['The edges of the box are the differences of the coordinates.', 'p = |x₂ − x₁|,  q = |y₂ − y₁|,  r = |z₂ − z₁|'],
  ['Let C be the point on the floor directly below B. AC is the floor diagonal of a p by q rectangle (Pythagoras).', 'AC² = p² + q²'],
  ['Triangle ACB has a right angle at C, because BC is vertical and AC lies on the floor. Pythagoras again.', 'AB² = AC² + BC² = p² + q² + r²'],
  ['Take the square root.', 'AB = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²)'],
  ['Example: A(1, 2, 3) and B(4, 6, 15).', 'AB = √(9 + 16 + 144) = √169 = 13. From the origin: OP = √(x² + y² + z²).'],
], 'Proving the distance formula between two points in three dimensions', 0.95);
