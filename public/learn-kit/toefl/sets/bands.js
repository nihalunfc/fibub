// Band practice (lesson 1.3): answers worked out with the ETS rule in ../../english/scores.js. Original by fibub.
import { toeflOverall, toeflCefr } from '../../english/scores.js';

const cases = [[5, 5, 4.5, 5.5], [4, 4.5, 4, 4], [5.5, 6, 5, 5.5], [3.5, 4, 3, 4], [4.5, 4.5, 5, 4], [6, 5.5, 5.5, 5], [3, 3.5, 3, 2.5], [5, 4, 4.5, 4], [4.5, 5, 5.5, 5.5], [2.5, 3, 3.5, 3]];
const f = (x) => x.toFixed(1).replace(/\.0$/, '');
const items = [];
cases.forEach((c, i) => {
  const o = toeflOverall(c), avg = c.reduce((a, b) => a + b, 0) / 4;
  const opts = [o, o + 0.5, o - 0.5, Math.round(avg), o + 1, o - 1].filter((x, k, a) => x >= 1 && x <= 6 && a.indexOf(x) === k).slice(0, 4);
  items.push({ id: `bd-o${i}`, type: 'mcq', q: `Section bands: Reading ${f(c[0])}, Listening ${f(c[1])}, Writing ${f(c[2])}, Speaking ${f(c[3])}. What is the overall band?`, options: opts.map(f), answer: 0,
    sol: `Average = (${c.map(f).join(' + ')}) ÷ 4 = ${avg}. Rounded to the nearest half band: <b>${f(o)}</b> (about CEFR ${toeflCefr(o)}).` });
});
[[4.125, 4], [4.25, 4.5], [4.375, 4.5], [5.125, 5], [3.875, 4], [5.625, 5.5]].forEach(([a, o], i) => {
  const ok = toeflOverall([a, a, a, a]) === o; // sanity: same rule
  items.push({ id: `bd-r${i}`, type: 'text', q: `An average of ${a} rounds to which overall band? Type it, for example 4.5.`, answer: [String(o), o.toFixed(1)], sol: a * 4 % 1 === 0 && a * 2 % 1 !== 0 ? `${a} is exactly halfway between two half bands; ETS rounds it up, to ${f(o)} (ETS's own example: an average of 5.25 gives 5.5).` : `${a} is nearest to ${f(o)} on the half-band scale${ok ? '' : ''}.` });
});
const reqs = [
  [{ o: 5, s: 4.5 }, [5, 5, 5, 4.5], true], [{ o: 5, s: 4.5 }, [5.5, 5.5, 5, 4], false], [{ o: 4.5, s: 4 }, [4.5, 4, 4.5, 4.5], true], [{ o: 5.5, s: 5 }, [6, 5.5, 5, 5], false],
];
reqs.forEach(([r, c, _], i) => {
  const o = toeflOverall(c), meets = o >= r.o && c.every((x) => x >= r.s);
  items.push({ id: `bd-q${i}`, type: 'mcq', q: `A university needs overall ${f(r.o)} with no section below ${f(r.s)}. Your bands: ${c.map(f).join(', ')}. Do you meet it?`, options: ['Yes', 'No'], answer: meets ? 0 : 1,
    sol: `Overall = ${f(o)}${o >= r.o ? ' (enough)' : ' (too low)'}; lowest section = ${f(Math.min(...c))}${Math.min(...c) >= r.s ? ' (enough)' : ' (too low)'}. So ${meets ? 'yes' : 'no'}.` });
});
export default { title: 'TOEFL bands', items };
