// Matching headings practice: each card is a one-line summary of a paragraph (made-up); tap the heading that fits its main
// idea, not just a word it shares. Wrong taps explain the trap. This is how the Reading "match the heading" task thinks.
import { tapSort } from './_lang.js';

const H = ['A: A problem solved', 'B: A surprising cause', 'C: Money matters', 'D: A warning for the future'];
const items = [
  ['Many towns lost their wells; a new pipe network now reaches every house.', 0, 'The main idea is a fix that worked.'],
  ['Scientists thought heat was the cause, but the real reason was a change in farming.', 1, 'A cause nobody expected.'],
  ['The scheme cost half the budget, yet saved more in doctors\' bills within five years.', 2, 'The paragraph is about costs and savings.'],
  ['If the groundwater keeps falling, today\'s success may not last another generation.', 3, 'It looks ahead at a risk.'],
  ['Villagers who once walked six kilometres now have taps at home.', 0, 'This is about the problem being solved. "Walked six kilometres" is the old problem, not the main idea.'],
  ['Prices rose by a fifth after the dam opened, and farmers paid for it.', 2, 'The paragraph is about money, even though "dam" is mentioned.'],
];
export default function (host) { tapSort(host, { buckets: H, items: items.map(([t, a, why]) => ({ t, a, why })), intro: 'Which heading gives the main idea of this paragraph?' }); }
