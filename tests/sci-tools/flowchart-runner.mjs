// #1293 Flowchart runner. Every chart's output is checked against Python: n(n+1)/2, math.gcd (sum over all pairs up to
// 60 = 10160), calendar.isleap (970 leap years in 1..4000), max() and the Collatz step counts (sum for 1..1000 =
// 59542; n = 27 takes 111 steps). Also checks that every arrow points at a real box.
import { CHARTS, run } from '../../src/lib/sci/flow-l2.ts';

export default async (check) => {
  const C = Object.fromEntries(CHARTS.map((c) => [c.id, c]));
  const out = (id, inp) => { const r = run(C[id], inp); return r.finished ? r.steps.at(-1).out[0] : null; };
  check('flow: every arrow points at a box; every chart has Start and Stop', CHARTS.every((c) => { const ids = new Set(c.boxes.map((b) => b.id)); return ids.has('s') && c.boxes.some((b) => b.kind === 'end') && c.boxes.every((b) => [b.next, b.yes, b.no].filter(Boolean).every((e) => ids.has(e.to))); }));
  check('flow: boxes fit inside the 340 px picture', CHARTS.every((c) => c.boxes.every((b) => { const w = b.w ?? (b.kind === 'decision' ? 160 : b.kind === 'start' || b.kind === 'end' ? 110 : 150); return b.x - w / 2 >= 0 && b.x + w / 2 <= 340 && b.y + (b.kind === 'decision' ? 27 : 17) <= c.height; })));
  check('flow: even or odd for −5..5', [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].every((n) => out('even', { n }) === (n % 2 === 0 ? 'even' : 'odd')));
  let ok = true;
  for (let n = 0; n <= 200; n++) if (Number(out('sum', { n })) !== (n * (n + 1)) / 2) ok = false;
  check('flow: add 1 to n equals n(n+1)/2 for n = 0..200', ok);
  const s5 = run(C.sum, { n: 5 }).steps;
  check('flow: n = 5 visits the diamond 6 times; the trace ends at Stop', s5.filter((s) => s.box === 'd').length === 6 && s5.at(-1).box === 'e' && s5.at(-1).out[0] === '15');
  let g = 0; for (let a = 1; a <= 60; a++) for (let b = 1; b <= 60; b++) g += Number(out('hcf', { a, b }));
  check('flow: Euclid HCF summed over all pairs up to 60 matches math.gcd (10160)', g === 10160);
  let leap = 0; for (let y = 1; y <= 4000; y++) if (out('leap', { y }) === 'leap year') leap++;
  check('flow: leap years 1..4000 match calendar.isleap (970); 1900 no, 2000 yes, 2024 yes', leap === 970 && out('leap', { y: 1900 }) === 'not a leap year' && out('leap', { y: 2000 }) === 'leap year' && out('leap', { y: 2024 }) === 'leap year');
  const trip = [[12, 31, 25], [7, 7, 7], [-3, -9, -1], [5, 2, 5], [1, 8, 8], [9, 4, 1]];
  check('flow: largest of three matches max()', trip.every(([a, b, c]) => Number(out('largest', { a, b, c })) === Math.max(a, b, c)));
  let cs = 0; for (let n = 1; n <= 1000; n++) cs += Number(out('collatz', { n }));
  check('flow: steps to 1, summed for 1..1000, match Python (59542); 27 → 111', cs === 59542 && out('collatz', { n: 27 }) === '111');
  check('flow: a very long run stops at the limit', run(C.sum, { n: 200 }, 50).finished === false);
  check('flow: notes say what happened', s5[1].note === 'Read n = 5.' && s5[2].note === 'Now s = 0, i = 1.' && s5[3].note === 'i ≤ n: yes.');
};
