// Class 11 Maths, Conic Sections (step player): deriving x²/a² + y²/b² = 1 from "PF1 + PF2 = 2a".
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Equation of an ellipse from the two-pin definition', [
  ['Foci F₁(−c, 0) and F₂(c, 0). P(x, y) is on the ellipse when PF₁ + PF₂ = 2a, with a > c.'],
  ['Write the distances and isolate one root.', '√((x + c)² + y²) = 2a − √((x − c)² + y²)'],
  ['Square both sides, expand, and the x² and y² terms cancel.', '4cx = 4a² − 4a√((x − c)² + y²)'],
  ['Divide by 4 and square again.', 'a²((x − c)² + y²) = (a² − cx)²'],
  ['Expand and collect.', '(a² − c²)x² + a²y² = a²(a² − c²)'],
  ['Write b² = a² − c² and divide by a²b².', 'x²/a² + y²/b² = 1'],
  ['So c² = a² − b² and e = c/a < 1. The semi-major axis is a, the semi-minor axis is b.'],
], 'Deriving the standard equation of an ellipse from the sum of distances to two foci', 1.05);
