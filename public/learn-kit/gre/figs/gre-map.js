// 1.1 The GRE at a glance: tap a section for its question types, time per question and lessons.
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from '../../gmat/figs/_verbal.js';
const S = [
  { n: 'Analytical Writing', q: 1, m: 30, types: 'One Issue essay: take a position on a claim and support it.', les: 'Module 8 (lessons 8.1 to 8.3)' },
  { n: 'Verbal section 1', q: 12, m: 18, types: 'Reading Comprehension, Text Completion, Sentence Equivalence.', les: 'Modules 6 and 7' },
  { n: 'Verbal section 2', q: 15, m: 23, types: 'The same types; easier or harder depending on section 1.', les: 'Modules 6 and 7' },
  { n: 'Quant section 1', q: 12, m: 21, types: 'Quantitative Comparison, one answer, select-all, Numeric Entry, data sets.', les: 'Modules 2 to 5' },
  { n: 'Quant section 2', q: 15, m: 26, types: 'The same types; easier or harder depending on section 1.', les: 'Modules 2 to 5' },
];
export default function (host) {
  let k = 0; const ctl = row(host), box = stack(host), out = readout(host);
  const go = () => { clear(ctl); clear(box);
    S.forEach((s, i) => { const b = button(ctl, s.n, () => { k = i; go(); }); b.setAttribute('aria-pressed', String(i === k)); });
    const s = S[k]; card(box, s.n, `${s.types}<br><b>${s.q} question${s.q > 1 ? 's' : ''} in ${s.m} minutes</b>${s.q > 1 ? `: about ${Math.round((s.m * 60) / s.q)} seconds each` : ''}.`, 'good');
    const tot = S.reduce((a, x) => a + x.m, 0); out.innerHTML = `Learn it in: ${s.les}. Whole test: ${tot} minutes of sections, just under 2 hours.`; };
  go();
}
