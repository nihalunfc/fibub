// 8.2 Plan in five minutes: pick a prompt and a side, choose reasons and examples, and watch the outline fill in.
import { row, choice, readout } from '../../kit.js';
import { stack, card, down, clear } from '../../gmat/figs/_verbal.js';
const P = {
  a: { prompt: 'Governments should spend more on science research than on the arts.', task: 'Explain how far you agree, and consider ways the claim could be true and false.',
    sides: { agree: ['Mostly agree', [['Research pays back in health and jobs', 'Vaccines developed with public funding saved millions of lives.'], ['Science problems need costly equipment', 'A particle collider or a space telescope cannot be funded by sales.'], ['Arts already have other sources', 'Concerts and museums sell tickets and attract donors.']], 'Yet a country with no public art loses shared culture, so “more” should not mean “all”.'],
      disagree: ['Mostly disagree', [['The arts reach every citizen', 'A free public library or festival serves people who never enter a lab.'], ['Arts budgets are tiny already', 'Cutting them frees little money for science.'], ['Culture builds the trust science needs', 'Films and books explain science to the public.']], 'Still, some research, such as on disease, is urgent in a way most art is not.'] } },
  b: { prompt: 'Students learn more from their mistakes than from their successes.', task: 'Discuss the extent to which you agree, and the most compelling reasons someone might disagree.',
    sides: { agree: ['Mostly agree', [['A mistake shows exactly what to fix', 'An error log in exam practice points to the weak topic.'], ['Mistakes are remembered', 'A chemistry student who once mixed up units rarely does it again.'], ['Success can hide luck', 'A guessed right answer teaches nothing.']], 'But a run of failures with no feedback can make a student give up, so mistakes teach only when someone explains them.'],
      disagree: ['Mostly disagree', [['Success builds the confidence to keep going', 'Beginners who win early keep practising.'], ['Copying good work teaches fast', 'Apprentices learn by watching a master do it right.'], ['Mistakes without feedback teach nothing', 'Getting a sum wrong with no solution leaves the error in place.']], 'Even so, a student who never fails is rarely being stretched.'] } },
};
export default function (host) {
  let p = 'a', side = 'agree';
  const c1 = row(host); choice(c1, 'Prompt', [['a', 'Science vs arts'], ['b', 'Mistakes']], p, (v) => { p = v; go(); });
  const c2 = row(host); choice(c2, 'Your side', [['agree', 'Mostly agree'], ['disagree', 'Mostly disagree']], side, (v) => { side = v; go(); });
  const box = stack(host), out = readout(host);
  const go = () => {
    clear(box); const q = P[p], [lab, rs, other] = q.sides[side];
    card(box, 'Prompt', q.prompt); card(box, 'Task (follow it exactly)', q.task, 'gap'); down(box);
    card(box, 'Position (intro)', `${lab}: ${q.prompt.replace(/\.$/, '').toLowerCase()} in most cases, with one limit.`, 'good');
    rs.forEach(([r, e], i) => card(box, `Body ${i + 1}: reason and example`, `<b>${r}.</b> ${e}`));
    card(box, 'Other side and limit', other, 'gap'); card(box, 'Conclusion', 'Restate the position and the limit in two sentences.');
    out.textContent = 'That is the whole plan: one position, three reasons with examples, the other side, a short conclusion. About five minutes on scrap paper.';
  };
  go();
}
