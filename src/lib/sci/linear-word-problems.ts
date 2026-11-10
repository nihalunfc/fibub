// Word problems that lead to a pair of linear equations (Class 10): ages, tickets, a boat in a stream, a rectangle
// and banknotes. Each story is made from a hidden answer so the numbers come out whole, and comes with its
// unknowns, the two equations, why each equation holds, and a check in words. No DOM.
import type { Line } from './linpair-school.ts';

export type StoryId = 'ages' | 'tickets' | 'boat' | 'rectangle' | 'notes';
export type Story = {
  id: StoryId;
  text: string;
  x: string; y: string;           // what x and y stand for
  ux: string; uy: string;         // units, e.g. "years", "₹"
  l1: Line; l2: Line;
  why1: string; why2: string;     // how each equation comes from the story
  ans: [number, number];
  check: string;                  // the answer checked against the story
};

export const STORIES: { id: StoryId; name: string }[] = [
  { id: 'ages', name: 'Ages' },
  { id: 'tickets', name: 'Tickets' },
  { id: 'boat', name: 'Boat in a stream' },
  { id: 'rectangle', name: 'Rectangle' },
  { id: 'notes', name: 'Banknotes' },
];

type Rnd = () => number;
const ri = (lo: number, hi: number, rnd: Rnd) => lo + Math.floor(rnd() * (hi - lo + 1));
const pick = <T>(xs: T[], rnd: Rnd) => xs[Math.floor(rnd() * xs.length)];

export function makeStory(id: StoryId, rnd: Rnd = Math.random): Story {
  switch (id) {
    case 'ages': {
      const y = ri(6, 15, rnd), n = ri(2, 10, rnd), k = pick([2, 3], rnd), x = k * (y + n) - n, S = x + y;
      const name = pick([['Asha', 'her son'], ['Ravi', 'his daughter'], ['Meera', 'her daughter'], ['Arjun', 'his son']], rnd);
      return {
        id, text: `${name[0]} and ${name[1]} have ages that add up to ${S} years. In ${n} years, ${name[0]} will be ${k} times as old as ${name[1]}. How old is each now?`,
        x: `${name[0]}'s age now`, y: `the age of ${name[1]} now`, ux: 'years', uy: 'years',
        l1: { a: 1, b: 1, c: S }, l2: { a: 1, b: -k, c: (k - 1) * n },
        why1: `The ages add up to ${S}: x + y = ${S}.`,
        why2: `In ${n} years they are x + ${n} and y + ${n}, and x + ${n} = ${k}(y + ${n}). Open the bracket and tidy up: x − ${k}y = ${(k - 1) * n}.`,
        ans: [x, y], check: `${x} + ${y} = ${S}, and in ${n} years ${x + n} = ${k} × ${y + n}. ✓`,
      };
    }
    case 'tickets': {
      let x: number, y: number, a1: number, c1: number, a2: number, c2: number;
      do { x = ri(8, 30, rnd) * 10; y = ri(3, x / 10 - 2, rnd) * 10; a1 = ri(1, 4, rnd); c1 = ri(1, 5, rnd); a2 = ri(1, 4, rnd); c2 = ri(1, 5, rnd); } while (a1 * c2 === a2 * c1);
      const T1 = a1 * x + c1 * y, T2 = a2 * x + c2 * y;
      return {
        id, text: `At a museum, ${a1} adult${a1 > 1 ? 's' : ''} and ${c1} child${c1 > 1 ? 'ren' : ''} pay ₹${T1} for tickets. Another group of ${a2} adult${a2 > 1 ? 's' : ''} and ${c2} child${c2 > 1 ? 'ren' : ''} pays ₹${T2}. What does one adult ticket cost, and one child ticket?`,
        x: 'the price of an adult ticket', y: 'the price of a child ticket', ux: '₹', uy: '₹',
        l1: { a: a1, b: c1, c: T1 }, l2: { a: a2, b: c2, c: T2 },
        why1: `First group: ${a1} adult tickets cost ${a1}x and ${c1} child tickets cost ${c1}y, so ${a1}x + ${c1}y = ${T1}.`.replace(/ 1x/g, ' x').replace(/ 1y/g, ' y'),
        why2: `Second group: ${a2}x + ${c2}y = ${T2}.`.replace(/ 1x/g, ' x').replace(/ 1y/g, ' y'),
        ans: [x, y], check: `${a1} × ${x} + ${c1} × ${y} = ${T1} and ${a2} × ${x} + ${c2} × ${y} = ${T2}. ✓`,
      };
    }
    case 'boat': {
      const y = ri(1, 5, rnd), x = y + ri(3, 15, rnd), t1 = ri(1, 4, rnd), t2 = ri(1, 4, rnd), d1 = (x + y) * t1, d2 = (x - y) * t2;
      return {
        id, text: `A boat goes ${d1} km downstream in ${t1} hour${t1 > 1 ? 's' : ''} and ${d2} km upstream in ${t2} hour${t2 > 1 ? 's' : ''}. Find the speed of the boat in still water and the speed of the stream.`,
        x: 'the speed of the boat in still water', y: 'the speed of the stream', ux: 'km/h', uy: 'km/h',
        l1: { a: 1, b: 1, c: x + y }, l2: { a: 1, b: -1, c: x - y },
        why1: `Downstream the stream helps, so the speed is x + y = ${d1} ÷ ${t1} = ${x + y}.`,
        why2: `Upstream the stream holds it back, so the speed is x − y = ${d2} ÷ ${t2} = ${x - y}.`,
        ans: [x, y], check: `Downstream ${x} + ${y} = ${x + y} km/h, and ${x + y} × ${t1} = ${d1} km; upstream ${x} − ${y} = ${x - y} km/h, and ${x - y} × ${t2} = ${d2} km. ✓`,
      };
    }
    case 'rectangle': {
      const y = ri(3, 20, rnd), k = pick([2, 3], rnd), m = ri(1, 8, rnd), x = k * y + m, P = 2 * (x + y);
      return {
        id, text: `A garden is a rectangle. Its length is ${m} m more than ${k} times its width, and the fence all round it is ${P} m long. Find the length and the width.`,
        x: 'the length', y: 'the width', ux: 'm', uy: 'm',
        l1: { a: 1, b: -k, c: m }, l2: { a: 2, b: 2, c: P },
        why1: `Length = ${k} × width + ${m}: x = ${k}y + ${m}, or x − ${k}y = ${m}.`,
        why2: `The perimeter is 2(length + width): 2x + 2y = ${P}.`,
        ans: [x, y], check: `${x} = ${k} × ${y} + ${m}, and 2 × (${x} + ${y}) = ${P}. ✓`,
      };
    }
    case 'notes': {
      const [v1, v2] = pick([[50, 100], [100, 200], [10, 50], [20, 100], [100, 500]], rnd), x = ri(3, 25, rnd), y = ri(3, 25, rnd), N = x + y, T = v1 * x + v2 * y;
      return {
        id, text: `A cash box has ${N} notes, all ₹${v1} or ₹${v2} notes, worth ₹${T} altogether. How many of each are there?`,
        x: `the number of ₹${v1} notes`, y: `the number of ₹${v2} notes`, ux: 'notes', uy: 'notes',
        l1: { a: 1, b: 1, c: N }, l2: { a: v1, b: v2, c: T },
        why1: `There are ${N} notes: x + y = ${N}.`,
        why2: `Their value is ₹${T}: ${v1}x + ${v2}y = ${T}.`,
        ans: [x, y], check: `${x} + ${y} = ${N} notes, and ${v1} × ${x} + ${v2} × ${y} = ₹${T}. ✓`,
      };
    }
  }
}
