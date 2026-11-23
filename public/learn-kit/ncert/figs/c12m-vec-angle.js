// Class 12 Maths, Vector Algebra (step player): the angle between two vectors from cos(theta) = a.b / (|a||b|), for a = 2i + j + 2k and b = i - 2j + 2k.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Angle between two vectors', [
  ['Take a = 2i + j + 2k and b = i − 2j + 2k.'],
  ['Dot product: multiply matching parts and add.', 'a·b = 2×1 + 1×(−2) + 2×2 = 2 − 2 + 4 = 4'],
  ['Lengths of both vectors.', '|a| = √(4 + 1 + 4) = 3,   |b| = √(1 + 4 + 4) = 3'],
  ['Put them in cos θ = a·b / (|a||b|).', 'cos θ = 4 / (3 × 3) = 4/9 ≈ 0.444'],
  ['Read the angle from the cosine.', 'θ = cos⁻¹(4/9) ≈ 63.6°. Positive dot product, so the angle is acute, as it should be.'],
], 'The angle between two vectors worked one step at a time');
