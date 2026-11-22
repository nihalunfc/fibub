// 7.1 Passage map: tap a paragraph to see its job, its signal words and how it feeds the main point.
import { readout } from '../../kit.js';
import { stack, card } from './_verbal.js';
const P = [
  { t: 'Planners hope to rebuild destroyed cities with wide avenues. <u>Yet</u> rebuilt cities follow their old street plans, as London did after 1666.', job: 'The puzzle', sig: '“Yet” turns from what planners hope to what actually happens.', feed: 'Sets up the question the passage will answer: why do old plans survive?' },
  { t: '<u>The usual explanation</u> is money or political will. <u>A closer look suggests</u> a deeper cause: property rights, and the slow fight to swap land between owners.', job: 'Rejected view, then the author’s explanation', sig: '“The usual explanation” flags a view the author will move past; “a closer look suggests” brings in the author’s own answer.', feed: 'This is the heart of the main point: property claims, not money, keep the plans.' },
  { t: 'Street plans, <u>then</u>, are like contracts among thousands of parties. <u>This helps explain why</u> redesign works where land is held by a few owners or a government can take land.', job: 'Wider point and support', sig: '“Then” marks a conclusion; “this helps explain why” adds supporting cases.', feed: 'Generalises the explanation and shows it predicts where redesign succeeds.' },
];
const MAIN = 'Old street plans survive mainly because changing them means overriding many owners’ property claims.';
export default function (host) {
  const box = stack(host); const out = readout(host);
  const cards = P.map((p, k) => card(box, 'Paragraph ' + (k + 1), p.t, '', () => {
    cards.forEach((c, j) => c.setAttribute('aria-pressed', String(j === k)));
    out.innerHTML = `<b>Job: ${p.job}.</b> ${p.sig} <br><b>How it feeds the main point:</b> ${p.feed}`;
  }));
  card(box, 'Main point', MAIN, 'good');
  out.textContent = 'Tap a paragraph. Signal words are underlined.';
}
