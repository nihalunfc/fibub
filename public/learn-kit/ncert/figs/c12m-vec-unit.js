// Class 12 Maths, Vector Algebra (step player): the vector between two points and a unit vector along it, for A(2, -1, 3) and B(4, 1, 2).
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Vector from A to B and its unit vector', [
  ['Position vectors: OA = 2i − j + 3k and OB = 4i + j + 2k.'],
  ['The vector AB = head − tail = OB − OA.', 'AB = (4 − 2)i + (1 + 1)j + (2 − 3)k = 2i + 2j − k'],
  ['Its magnitude.', '|AB| = √(4 + 4 + 1) = 3'],
  ['Divide by the magnitude: the unit vector (length 1).', 'AB^ = (2i + 2j − k)/3 = (2/3)i + (2/3)j − (1/3)k'],
  ['A vector of length 6 in the same direction: scale the unit vector.', '6 × AB^ = 4i + 4j − 2k, and check |4i + 4j − 2k| = √36 = 6'],
], 'Finding the vector between two points and a unit vector, one step at a time');
