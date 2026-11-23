// Class 11 Maths, Probability (step player): the addition rule worked on one throw of a die.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Addition rule on a die', [
  ['A die is thrown once. A = "an even number", B = "a number more than 3". Find P(A or B). S has 6 equally likely outcomes.'],
  ['List the events.', 'A = {2, 4, 6}, B = {4, 5, 6}'],
  ['Find each probability as favourable ÷ total.', 'P(A) = 3/6,  P(B) = 3/6'],
  ['The overlap A ∩ B (even and more than 3).', 'A ∩ B = {4, 6}, so P(A ∩ B) = 2/6'],
  ['Adding P(A) and P(B) counts the outcomes 4 and 6 twice, so subtract the overlap once.', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 3/6 + 3/6 − 2/6'],
  ['Answer.', 'P(A ∪ B) = 4/6 = 2/3'],
  ['Check by listing: A ∪ B = {2, 4, 5, 6}, which is 4 outcomes out of 6. ✓'],
], 'Using the addition rule for two events on a die', 0.95);
