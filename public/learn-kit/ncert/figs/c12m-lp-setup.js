// Class 12 Maths, Linear Programming (step player): turning a word problem into a linear programme (variables, objective, constraints), for a tiffin-service example.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'From words to a linear programme', [
  ['A tiffin service makes veg thalis and non-veg thalis. A veg thali earns ₹30 and a non-veg thali ₹50. Cooking takes 20 and 30 minutes; there are 12 hours of cooking and at most 30 thalis can be packed.'],
  ['Decide what you control: these are the variables.', 'x = number of veg thalis,  y = number of non-veg thalis'],
  ['What do you want most (or least)? The objective function.', 'Maximise Z = 30x + 50y  (rupees of profit)'],
  ['Turn each limit into an inequality, using the same units (minutes).', 'Cooking: 20x + 30y ≤ 720 (12 hours = 720 min).   Packing: x + y ≤ 30'],
  ['You cannot make a negative number of thalis: the non-negativity constraints.', 'x ≥ 0,  y ≥ 0'],
  ['Done: this is a linear programme. Now draw the lines, find the corner points and compare Z.', 'Corners: (0, 0), (30, 0), (0, 24) and (18, 12) (where 20x + 30y = 720 meets x + y = 30). Z = 0, 900, 1200, 1140, so the best plan is 0 veg and 24 non-veg thalis.'],
], 'Turning a word problem into variables, an objective function and constraints');
