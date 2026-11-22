// Linking words sorter: each card is a linking word; tap the job it does (add an idea, contrast, cause, result or example).
// Wrong taps tell you why. Use it after the lesson on cohesive devices; shuffle and repeat until you have no wrong taps.
import { tapSort } from './_lang.js';

const B = ['Adding', 'Contrast', 'Cause (because)', 'Result (so)', 'Example'];
const I = [
  ['Moreover', 0, 'It adds another point in the same direction.'], ['In addition', 0, 'It adds a point.'], ['Furthermore', 0, 'It adds a point.'],
  ['However', 1, 'It turns the sentence against the one before.'], ['Whereas', 1, 'It sets two things side by side as different.'], ['Nevertheless', 1, 'It means "in spite of that".'],
  ['Because of', 2, 'It is followed by the reason.'], ['Owing to', 2, 'It gives the reason.'], ['Since (reason)', 2, '"Since it rained, we stayed in": it gives the reason.'],
  ['Therefore', 3, 'It gives the result of what you just said.'], ['As a result', 3, 'It introduces the result.'], ['Consequently', 3, 'It introduces the result.'],
  ['For instance', 4, 'It introduces an example.'], ['Such as', 4, 'It lists examples inside a sentence.'], ['To illustrate', 4, 'It introduces an example.'],
];
export default function (host) { tapSort(host, { buckets: B, items: I.map(([t, a, why]) => ({ t, a, why })), intro: 'Tap what job this linking word does.' }); }
