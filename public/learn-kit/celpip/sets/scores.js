// CELPIP score practice (lesson 1.3): items made from score rules in ../../english/scores.js, so every answer is
// worked out, not typed by hand. Original by fibub.
import { celpipToClb, crsFirstLanguage } from '../../english/scores.js';

const SK = ['listening', 'reading', 'writing', 'speaking'];
const cases = [
  [9, 8, 7, 7], [10, 9, 8, 6], [7, 7, 7, 7], [12, 11, 10, 9], [8, 6, 7, 9], [5, 5, 4, 6], [9, 9, 9, 9], [11, 7, 8, 8], [6, 7, 6, 5], [10, 10, 9, 8],
];
const clbTxt = (c) => (c >= 10 ? '10+' : c < 4 ? 'below 4' : String(c));
const items = [];
cases.forEach((lv, i) => {
  const clb = lv.map(celpipToClb);
  const pts = clb.reduce((a, c) => a + crsFirstLanguage(c), 0);
  const scoreTxt = SK.map((s, k) => `${s} ${lv[k]}`).join(', ');
  // 1. points
  const wrong = [pts + 6, pts - 8, pts + 14].filter((x) => x > 0 && x !== pts);
  items.push({ id: `sc-p${i}`, type: 'mcq', q: `A single applicant's CELPIP levels are ${scoreTxt}. How many Express Entry first-language points is that?`, options: [String(pts), ...wrong.map(String)], answer: 0,
    sol: `CLB ${clb.map(clbTxt).join(', ')} gives ${clb.map((c) => crsFirstLanguage(c)).join(' + ')} = <b>${pts}</b> points.` });
  // 2. CLB 7 minimum
  const ok7 = clb.every((c) => c >= 7);
  const low = SK.filter((_, k) => clb[k] < 7);
  items.push({ id: `sc-m${i}`, type: 'mcq', q: `Levels: ${scoreTxt}. Does this meet a CLB 7 minimum in every ability?`, options: ['Yes', 'No'], answer: ok7 ? 0 : 1,
    sol: ok7 ? 'Every ability is at CLB 7 or higher, so yes.' : `No: ${low.join(' and ')} ${low.length > 1 ? 'are' : 'is'} under 7. Each ability must reach the minimum on its own.` });
});
[[11, '10'], [12, '10'], [10, '10'], [8, '8'], [4, '4'], [6, '6']].forEach(([lv, c], i) =>
  items.push({ id: `sc-c${i}`, type: 'text', q: `A CELPIP level ${lv} counts as which CLB level for immigration? Type a number.`, answer: [c, c + '+'], sol: lv >= 10 ? 'Levels 10, 11 and 12 all count as CLB 10 (shown as 10+).' : `CELPIP ${lv} = CLB ${lv}: the scales match from 4 to 9.` }));
items.push({ id: 'sc-x1', type: 'mcq', q: 'Which change gives the most Express Entry points for one ability (single applicant)?', options: ['CLB 8 → 9', 'CLB 9 → 10', 'CLB 4 → 5', 'CLB 10 → 12'], answer: 0, sol: 'CLB 8 → 9 is +8 (23 → 31). CLB 9 → 10 is +3, CLB 4 → 5 is 0, and 10 → 12 is 0 because both count as CLB 10.' });
items.push({ id: 'sc-x2', type: 'mcq', q: 'For citizenship, which abilities need CLB 4?', options: ['Listening and speaking', 'All four', 'Reading and writing', 'Speaking only'], answer: 0, sol: 'Citizenship looks only at listening and speaking (CLB 4 or higher), which is why CELPIP-General LS exists.' });

export default { title: 'CELPIP scores, CLB and points', items };
