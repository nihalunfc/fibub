// "Solve my numbers" for permutations and combinations (Class 11): nPr, nCr, arrangements with repeated letters,
// a circular table, people who must sit together, and committees chosen from two groups. Exact (BigInt). No DOM.
import { type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { fact, nPr, nCr, big } from './counting-machine.ts';

const MAXN = 100;
const whole = (x: SIn | undefined) => !!x && Number.isInteger(x.v);
const prod = (n: number, r: number) => (r === 0 ? '1' : r <= 6 ? Array.from({ length: r }, (_, i) => n - i).join(' × ') : `${n} × ${n - 1} × … × ${n - r + 1}`);
const fl = (k: number) => (k <= 1 ? '1' : k <= 6 ? Array.from({ length: k }, (_, i) => k - i).join(' × ') : `${k} × ${k - 1} × … × 1`);

function chk(n: SIn | undefined, what: string, min = 1): string | null {
  if (!n || !whole(n)) return `${what} must be a whole number (no decimals).`;
  if (n.v < min) return `${what} must be ${min} or more.`;
  if (n.v > MAXN) return `Keep ${what.toLowerCase()} at ${MAXN} or less.`;
  return null;
}

export function solveCounting(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  if (f === 'perm' || f === 'comb') {
    const e = chk(i.n, 'n (how many different things)') ?? chk(i.r, 'r (how many are used)', 0); if (e) return { error: e };
    const n = i.n.v, r = i.r.v;
    if (r > n) return { error: `r = ${r} is more than n = ${n}. You cannot pick more things than you have, so check which number is which.` };
    const P = nPr(n, r), C = nCr(n, r);
    if (f === 'perm') {
      return { answer: `${n}P${r} = ${big(P)} arrangement${P === 1n ? '' : 's'}.`, lines: [`Order matters, so use nPr = n! ÷ (n − r)!`, `${n}P${r} = ${n}! ÷ ${n - r}! = ${prod(n, r)} = ${big(P)}`, `Check: ${n}C${r} × ${r}! = ${big(C)} × ${big(fact(r))} = ${big(P)}`], tip: 'Common mistake: using nCr when the order matters (a race finish, a password, seats in a row). If swapping two of them gives something new, use nPr.' };
    }
    const small = Math.min(r, n - r);
    return { answer: `${n}C${r} = ${big(C)} selection${C === 1n ? '' : 's'}.`, lines: [`Order does not matter, so use nCr = n! ÷ (r! × (n − r)!)`, `${n}C${r} = ${n}! ÷ (${r}! × ${n - r}!) = ${big(P)} ÷ ${big(fact(r))} = ${big(C)}`, small < r ? `Shortcut: ${n}C${r} = ${n}C${n - r} = ${n}C${small}, which is quicker by hand.` : `Check: ${n}C${r} = ${n}C${n - r}, the same number.`], tip: 'Common mistake: forgetting to divide by r!. Choosing a team of 3 from 10 is 10C3 = 120, not 10P3 = 720: each team was counted 3! = 6 times.' };
  }
  if (f === 'rep') {
    const e = chk(i.n, 'The number of letters'); if (e) return { error: e };
    const n = i.n.v, reps = i.reps.list;
    if (!reps.length) return { error: 'Type how many times each repeated letter appears, for example 4 4 2 for MISSISSIPPI.' };
    if (reps.some((x) => !Number.isInteger(x) || x < 2)) return { error: 'Each repeat count is a whole number, 2 or more. Leave out letters that appear once.' };
    const tot = reps.reduce((a, b) => a + b, 0);
    if (tot > n) return { error: `The repeats add up to ${tot}, which is more than the ${n} letters. Check the numbers.` };
    const den = reps.reduce((a, b) => a * fact(b), 1n), v = fact(n) / den;
    return { answer: `There are ${big(v)} different arrangements.`, lines: [`${n} letters, with repeats of ${reps.join(', ')}. Swapping identical letters gives nothing new, so divide.`, `Arrangements = n! ÷ (p! × q! × …) = ${n}! ÷ (${reps.map((p) => `${p}!`).join(' × ')})`, `= ${big(fact(n))} ÷ ${big(den)} = ${big(v)}`], tip: 'Common mistake: using n! and forgetting to divide by the factorial of every repeat count. Letters that appear once need no division.' };
  }
  if (f === 'circ') {
    const e = chk(i.n, 'The number of people'); if (e) return { error: e };
    const n = i.n.v;
    if (n < 3) return { answer: `With ${n} ${n === 1 ? 'person' : 'people'} there is only 1 way round a table.`, lines: ['Circular arrangements: (n − 1)! ways. Here (n − 1)! = 1.'] };
    const v = fact(n - 1);
    return { answer: `There are ${big(v)} ways to seat ${n} people round a table.`, lines: ['On a round table only the order relative to each other matters, so fix one person and arrange the other n − 1.', `Circular arrangements = (n − 1)! = ${n - 1}! = ${fl(n - 1)} = ${big(v)}`, `If the ring can be turned over too (beads on a necklace), halve it: ${big(v)} ÷ 2 = ${big(v / 2n)}`], tip: 'Common mistake: using n! for a circle. Rotating everyone one place gives the same seating, so n! counts each seating n times.' };
  }
  if (f === 'together') {
    const e = chk(i.n, 'The number of people') ?? chk(i.k, 'The group that sits together'); if (e) return { error: e };
    const n = i.n.v, k = i.k.v;
    if (k > n) return { error: `The group (${k}) cannot be bigger than all the people (${n}).` };
    const v = fact(n - k + 1) * fact(k), all = fact(n);
    return { answer: `There are ${big(v)} arrangements with those ${k} together.`, lines: [`Glue the ${k} together as one block. Then there are ${n} − ${k} + 1 = ${n - k + 1} items to arrange: ${n - k + 1}! = ${big(fact(n - k + 1))}.`, `Inside the block the ${k} can swap among themselves: ${k}! = ${big(fact(k))}.`, `Total = ${n - k + 1}! × ${k}! = ${big(fact(n - k + 1))} × ${big(fact(k))} = ${big(v)}`, `Not all together: ${n}! − ${big(v)} = ${big(all)} − ${big(v)} = ${big(all - v)}`], tip: 'Common mistake: forgetting the arrangements inside the block (the k! factor).' };
  }
  if (f === 'committee') {
    const e = chk(i.a, 'The first group size') ?? chk(i.ka, 'The number from the first group', 0) ?? chk(i.b, 'The second group size') ?? chk(i.kb, 'The number from the second group', 0); if (e) return { error: e };
    const a = i.a.v, ka = i.ka.v, b = i.b.v, kb = i.kb.v;
    if (ka > a) return { error: `You cannot pick ${ka} from a group of ${a}.` };
    if (kb > b) return { error: `You cannot pick ${kb} from a group of ${b}.` };
    const x = nCr(a, ka), y = nCr(b, kb);
    return { answer: `There are ${big(x * y)} possible committees.`, lines: [`Choose from each group separately (order does not matter), then multiply: the fundamental principle of counting.`, `${a}C${ka} = ${big(x)} and ${b}C${kb} = ${big(y)}`, `Committees = ${a}C${ka} × ${b}C${kb} = ${big(x)} × ${big(y)} = ${big(x * y)}`], tip: 'Common mistake: adding the two counts. Both choices happen together ("and"), so multiply. Add only when the cases are alternatives ("or").' };
  }
  return { error: 'Choose what to find.' };
}

export const COUNTING_SPEC: SSpec = {
  id: 'counting',
  finds: [['perm', 'Arrangements nPr (order matters)'], ['comb', 'Selections nCr (order does not matter)'], ['rep', 'Letters with repeats'], ['circ', 'People round a table'], ['together', 'Some people must sit together'], ['committee', 'Committee from two groups']],
  fields: [
    { k: 'n', label: 'n (different things)', ph: 'e.g. 10', show: (c) => c.find === 'perm' || c.find === 'comb' || c.find === 'rep' || c.find === 'circ' || c.find === 'together' },
    { k: 'r', label: 'r (how many are used)', ph: 'e.g. 4', show: (c) => c.find === 'perm' || c.find === 'comb' },
    { k: 'reps', label: 'Repeat counts of letters (2 or more)', kind: 'list', ph: 'e.g. 4 4 2', show: (c) => c.find === 'rep' },
    { k: 'k', label: 'How many sit together', ph: 'e.g. 3', show: (c) => c.find === 'together' },
    { k: 'a', label: 'First group size', ph: 'e.g. 6', show: (c) => c.find === 'committee' },
    { k: 'ka', label: 'Pick from first group', ph: 'e.g. 3', show: (c) => c.find === 'committee' },
    { k: 'b', label: 'Second group size', ph: 'e.g. 5', show: (c) => c.find === 'committee' },
    { k: 'kb', label: 'Pick from second group', ph: 'e.g. 2', show: (c) => c.find === 'committee' },
  ],
  presets: [
    { name: '10P5: first five places in a race of 10', find: 'perm', vals: { n: '10', r: '5' } },
    { name: '12C4: a team of 4 from 12', find: 'comb', vals: { n: '12', r: '4' } },
    { name: 'Letters of MISSISSIPPI', find: 'rep', vals: { n: '11', reps: '4 4 2' } },
    { name: '8 people round a table', find: 'circ', vals: { n: '8' } },
    { name: '7 people, 3 must sit together', find: 'together', vals: { n: '7', k: '3' } },
    { name: '3 of 6 boys and 2 of 5 girls', find: 'committee', vals: { a: '6', ka: '3', b: '5', kb: '2' } },
  ],
  solve: (i, c) => solveCounting(i, c),
};
