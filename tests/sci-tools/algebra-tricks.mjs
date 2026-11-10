// #1249 Number trick decoder. Expressions a·n + b checked against Python fractions.Fraction for the built-in tricks
// (Always 5 → 5, Always 3 → 3, Always 7 → 7, Mind reader → 100n + 165, Back to you → n) and, here, against direct
// evaluation of the steps for 500 random tricks.
import { TRICKS, trace, at, linText, verdict, reveal, apply, F, fval } from '../../src/lib/sci/algebra-tricks.ts';

export default async (check) => {
  const end = (id) => trace(TRICKS.find((t) => t.id === id).steps).at(-1);
  check('always 5', linText(end('five')) === '5' && verdict(end('five')).kind === 'constant');
  check('always 3 and 7', linText(end('three')) === '3' && linText(end('seven')) === '7');
  check('mind reader is 100n + 165', linText(end('mind')) === '100n + 165' && reveal(end('mind'), 1365) === 12);
  check('back to you is n', linText(end('back')) === 'n');
  check('text forms', linText({ a: F(3, 2), b: F(-1) }) === '3n/2 − 1' && linText({ a: F(-1), b: F(0) }) === '−n' && linText({ a: F(0), b: F(0) }) === '0' && linText({ a: F(2), b: F(1, 3) }) === '2n + 1/3');
  check('halving 2n + 10 is n + 5', linText(apply({ a: F(2), b: F(10) }, { op: 'div', k: 2 })) === 'n + 5');
  let ok = true;
  const ops = ['add', 'sub', 'mul', 'div', 'addn', 'subn'];
  for (let i = 0; i < 500; i++) {
    const steps = Array.from({ length: 1 + Math.floor(Math.random() * 7) }, () => { const op = ops[Math.floor(Math.random() * 6)]; return { op, k: op === 'div' || op === 'mul' ? 1 + Math.floor(Math.random() * 6) : Math.floor(Math.random() * 20) }; });
    const n = Math.round((Math.random() * 200 - 100) * 4) / 4;
    let v = n;
    for (const s of steps) v = s.op === 'add' ? v + s.k : s.op === 'sub' ? v - s.k : s.op === 'mul' ? v * s.k : s.op === 'div' ? v / s.k : s.op === 'addn' ? v + n : v - n;
    const e = trace(steps).at(-1);
    if (Math.abs(at(e, n) - v) > 1e-9 * Math.max(1, Math.abs(v))) ok = false;
    if (fval(e.a) !== 0 && Math.abs(reveal(e, v) - n) > 1e-7) ok = false;
  }
  check('500 random tricks: algebra = direct arithmetic, and decoding gets n back', ok);
  let threw = false; try { apply({ a: F(1), b: F(0) }, { op: 'div', k: 0 }); } catch { threw = true; }
  check('divide by 0 refused', threw);
};
