// Class 11 Maths, Conic Sections (step player): deriving y² = 4ax from the definition "distance to the focus = distance to the directrix".
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Equation of a parabola from its definition', [
  ['Put the focus at F(a, 0) and the directrix at x = −a. P(x, y) is on the parabola when PF = PD.'],
  ['Distance to the focus and to the directrix (P is to the right of the line).', 'PF = √((x − a)² + y²)     PD = x + a'],
  ['Set PF = PD and square both sides.', '(x − a)² + y² = (x + a)²'],
  ['Expand both brackets.', 'x² − 2ax + a² + y² = x² + 2ax + a²'],
  ['Cancel x² and a² on both sides and collect the x terms.', 'y² = 4ax'],
  ['That is the standard equation. The latus rectum is the chord through F: put x = a, then y² = 4a², so its length is 4a.'],
], 'Deriving the equation y squared equals 4ax of a parabola from the focus and directrix', 0.95);
