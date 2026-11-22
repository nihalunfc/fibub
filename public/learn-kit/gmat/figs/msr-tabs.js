// 8.6 Multi-Source Reasoning: three tabs, and questions that light up the tabs they need.
import { row, button, readout } from '../../kit.js';
import { stack, card, clear } from './_verbal.js';
const TABS = [
  ['Policy', 'Standard delivery: within 5 working days. Express: within 2 working days, 12 dollars extra. Late parcels: the delivery charge is refunded.'],
  ['Email, 3 March', 'The northern depot is closed until 30 April. Standard parcels to the North now take about 7 working days. Express to the North is not affected.'],
  ['February table', 'North 4,000 parcels (15% express) · South 6,000 (10%) · East 5,000 (20%) · West 5,000 (25%)'],
];
const QS = [
  { q: 'A North customer orders standard delivery on 10 March. Will it arrive as the policy promises?', use: [0, 1], a: 'No. The policy promises 5 days (tab 1) but North standard parcels take about 7 (tab 2), so the customer can claim the charge back.' },
  { q: 'Which region sent the most express parcels in February?', use: [2], a: 'West: 25% of 5,000 = 1,250. Only the table is needed.' },
  { q: 'How much more would February’s North standard customers have paid had they all chosen express?', use: [0, 2], a: '85% of 4,000 = 3,400 parcels × 12 dollars (tab 1) = 40,800 dollars.' },
];
export default function (host) {
  let t = 0, q = -1;
  const box = stack(host), ctl = row(host), out = readout(host);
  const go = () => {
    clear(box); clear(ctl);
    TABS.forEach(([n], i) => { const b = button(ctl, `Tab ${i + 1}: ${n}`, () => { t = i; go(); }); b.setAttribute('aria-pressed', String(i === t)); if (q >= 0 && QS[q].use.includes(i)) b.style.borderColor = 'var(--good)'; });
    card(box, `Tab ${t + 1}: ${TABS[t][0]}`, TABS[t][1], q >= 0 && QS[q].use.includes(t) ? 'good' : '');
    QS.forEach((x, i) => { const c = card(box, `Question ${i + 1}`, x.q, '', () => { q = i; go(); }); c.setAttribute('aria-pressed', String(i === q)); });
    out.innerHTML = q < 0 ? 'Read the tabs, then tap a question to see which tabs it needs.' : `<b>Needs tab${QS[q].use.length > 1 ? 's' : ''} ${QS[q].use.map((i) => i + 1).join(' and ')}.</b> ${QS[q].a}`;
  };
  go();
}
