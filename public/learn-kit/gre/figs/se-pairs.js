// 6.3 Sentence Equivalence: the two right words make the same sentence; a pair of synonyms that does not fit is a trap.
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from '../../gmat/figs/_verbal.js';
const Q = { s: 'The scientist was careful to ______ her claims, stressing that the results came from one small study.', w: [['qualify', 'fit'], ['limit', 'fit'], ['exaggerate', 'opposite'], ['overstate', 'opposite'], ['publish', 'off'], ['abandon', 'off']] };
export default function (host) {
  const pick = new Set(); const box = stack(host); card(box, 'Sentence', Q.s);
  const ctl = row(host), out = readout(host);
  Q.w.forEach(([w], i) => { const b = button(ctl, w, () => { pick.has(i) ? pick.delete(i) : pick.size < 2 && pick.add(i); b.setAttribute('aria-pressed', String(pick.has(i))); go(); }); b.setAttribute('aria-pressed', 'false'); });
  const go = () => { if (pick.size < 2) { out.textContent = `Pick two words (${pick.size} of 2).`; return; }
    const [a, b] = [...pick].map((i) => Q.w[i]);
    out.innerHTML = a[1] === 'fit' && b[1] === 'fit' ? '<b>Right.</b> Both words limit the claims and give the same meaning.' : a[1] === b[1] && a[1] === 'opposite' ? '<b>A trap pair:</b> exaggerate and overstate mean the same, but the sentence (stressing a small study) needs the opposite.' : '<b>Not a match.</b> The two words must each fit the sentence and give it the same meaning.'; };
  go();
}
