// 6.4 Flaw sorter: read a short argument, name its flaw, then see the same flaw in a business setting.
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from './_verbal.js';
const F = { cause: 'Cause from correlation', sample: 'Biased sample', reverse: 'Reversed condition', person: 'Attacking the person', circle: 'Circular reasoning', choice: 'False choice', rate: 'Rate vs total', part: 'Part to whole' };
const A = [
  { a: 'Students who eat breakfast get higher marks. So eating breakfast raises marks.', f: 'cause', why: 'Two things go together, but families who make breakfast may also help with homework. A link is not proof of a cause.', biz: 'Stores with more staff sell more, so hiring staff raises sales (busy stores may simply hire more).' },
  { a: 'Of the readers who answered our travel magazine’s online poll, 90% fly at least once a year. So most people fly every year.', f: 'sample', why: 'Travel-magazine readers who chose to answer are not typical of everyone.', biz: 'Judging all customers’ views from the ones who wrote to complain.' },
  { a: 'Every licensed pilot has passed a medical exam. Lee has passed a medical exam, so Lee is a licensed pilot.', f: 'reverse', why: '“All pilots passed” does not mean “all who passed are pilots”. The condition is turned around.', biz: '“All our best sellers have a red label, so a red label will make this a best seller.”' },
  { a: 'Dr Rao says the new bridge is unsafe, but Dr Rao once lost a building contract to the bridge’s builder. So the bridge is safe.', f: 'person', why: 'A motive to criticise does not make the criticism wrong. The claim about the bridge was never answered.', biz: 'Dismissing a rival’s cost report because the rival wrote it.' },
  { a: 'This is the most trusted brand, because more people trust it than any other brand.', f: 'circle', why: 'The evidence just repeats the conclusion in other words.', biz: '“Our plan will succeed because it is a winning plan.”' },
  { a: 'Either we close the factory or the company goes bankrupt. We must not go bankrupt, so the factory must close.', f: 'choice', why: 'Only two options are offered; cutting costs or selling a division might also work.', biz: '“Either we cut prices or lose all our customers.”' },
  { a: 'The share of accidents involving trucks fell from 20% to 15%. So fewer truck accidents happened.', f: 'rate', why: 'If total accidents grew, 15% of a bigger total can be more truck accidents.', biz: 'Market share fell, so sales fell (the whole market may have grown).' },
  { a: 'Each player on the team is excellent, so the team will be excellent.', f: 'part', why: 'What is true of each part need not be true of the whole: the players may not work well together.', biz: 'Every product line is profitable, so the merged company will be profitable (merger costs can sink it).' },
];
export default function (host) {
  let i = 0; const box = stack(host); const ctl = row(host); const out = readout(host);
  const keys = Object.keys(F); const btns = {};
  const show = () => { clear(box); card(box, `Argument ${i + 1} of ${A.length}`, A[i].a); out.innerHTML = 'Which flaw is this?'; keys.forEach((k) => btns[k].setAttribute('aria-pressed', 'false')); };
  keys.forEach((k) => { btns[k] = button(ctl, F[k], () => {
    const x = A[i], ok = k === x.f; keys.forEach((j) => btns[j].setAttribute('aria-pressed', String(j === k)));
    out.innerHTML = ok ? `<b>Right: ${F[x.f]}.</b> ${x.why}<br><b>Same flaw at work:</b> ${x.biz}` : `<b>Not quite.</b> “${F[k]}” does not fit. Ask: what does the conclusion take for granted? Try again.`;
  }); });
  button(row(host), 'Next argument', () => { i = (i + 1) % A.length; show(); });
  show();
}
