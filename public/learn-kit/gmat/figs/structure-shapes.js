// 7.4 Passage shapes: choose a shape to see how its paragraphs connect and which signal words reveal it.
import { row, choice, readout } from '../../kit.js';
import { stack, card, down, clear } from './_verbal.js';
const S = {
  puzzle: { name: 'Puzzle', parts: [['Puzzle', 'Something surprising: farmers under-use a profitable input.'], ['Explanation 1', 'A common answer, often rejected: lack of information.'], ['Preferred explanation', 'The author’s answer with support: timing of cash.'], ['Implication', 'What follows: policies should let farmers commit early.']], sig: '“Why, then…?”, “the usual explanation”, “a more convincing explanation”', q: 'Primary purpose: “to explain a puzzling behaviour”.' },
  oldnew: { name: 'Old → new', parts: [['Old view', 'What people used to believe: dinosaurs were slow and cold-blooded.'], ['New evidence', 'Findings that do not fit: fast growth rings in bones.'], ['New view', 'The updated picture, and how sure the author is.']], sig: '“traditionally”, “long assumed”, “recent research shows”, “however”', q: 'Primary purpose: “to describe how a view has changed”.' },
  claim: { name: 'Claim → limits', parts: [['Claim', 'A general claim: open-plan offices boost teamwork.'], ['Evidence', 'Studies or examples for it.'], ['Limits', 'Where it fails or needs care: deep-focus work suffers.']], sig: '“for example”, “studies show”, “however, this applies only”, “not always”', q: 'Primary purpose: “to present a claim and qualify it”.' },
  compare: { name: 'Compare', parts: [['Thing A', 'How one approach works: wind power.'], ['Thing B', 'How the other works: solar power.'], ['Comparison', 'Where they differ, and maybe which suits a case better.']], sig: '“by contrast”, “similarly”, “whereas”, “unlike”', q: 'Primary purpose: “to compare two approaches”.' },
};
export default function (host) {
  const ctl = row(host); const box = stack(host); const out = readout(host);
  const go = (k) => {
    const s = S[k]; clear(box);
    s.parts.forEach(([tag, body], i) => { if (i) down(box); card(box, `Paragraph ${i + 1}: ${tag}`, body, i === s.parts.length - 1 ? 'good' : ''); });
    out.innerHTML = `<b>Signal words:</b> ${s.sig}<br><b>Typical right answer:</b> ${s.q}`;
  };
  choice(ctl, 'Shape', Object.entries(S).map(([k, v]) => [k, v.name]), 'puzzle', go);
  go('puzzle');
}
