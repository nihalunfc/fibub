// Spotting the paraphrase: the question says one thing and the passage says it in different words. Tap a phrase from the
// question, then the passage phrase that means the same. Right pairs join up with a line. Switch sets for different topics.
import { choice, row } from '../kit.js';
import { box, pairMatch } from './_lang.js';

const SETS = {
  a: { name: 'Study', left: ['increased', 'a large number of', 'prefer', 'as a result of', 'a few years ago'], right: ['rose', 'many', 'would rather', 'because of', 'in the recent past'], why: ['Increased and rose: same direction.', 'A large number of means many.', 'Prefer and would rather: same idea.', 'Both show cause.', 'Both point to a short time before now.'] },
  b: { name: 'Environment', left: ['harmful', 'reduce', 'important', 'the main cause', 'solve'], right: ['damaging', 'cut down', 'essential', 'the chief reason', 'deal with'], why: ['Harmful, damaging.', 'Reduce, cut down.', 'Important, essential.', 'Main cause, chief reason.', 'Solve, deal with.'] },
  c: { name: 'Work', left: ['employees', 'salary', 'work from home', 'unemployed', 'career'], right: ['staff', 'pay', 'telework', 'out of a job', 'working life'], why: ['Employees and staff.', 'Salary is pay.', 'Work from home is telework.', 'Unemployed means out of a job.', 'Career and working life.'] },
};
export default function (host) {
  let k = 'a'; const ctl = row(host); const slot = box(host);
  const mount = () => { slot.innerHTML = ''; pairMatch(slot, { ...SETS[k], heading: 'Question words and passage words: ' + SETS[k].name, seed: 5 }); };
  choice(ctl, 'Topic', Object.keys(SETS).map((x) => [x, SETS[x].name]), k, (v) => { k = v; mount(); });
  mount();
}
