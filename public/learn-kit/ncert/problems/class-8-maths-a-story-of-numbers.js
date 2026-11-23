// Class 8 Maths, A Story of Numbers: live problems (original fibub questions). Ids start with c8m-num-.
import { pick, choose, n, steps } from './_util.js';

const ROMAN = [['XLVII', 47], ['CXIV', 114], ['LXXXIX', 89], ['CCXCIV', 294], ['XCIX', 99], ['CDXLIV', 444]];
const rv = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
export default {
  'c8m-num-roman': {
    title: 'Roman numeral to number',
    make(r) {
      const [s, v] = choose(r, ROMAN);
      return { s, v, q: `<p>The year of a fort inscription is written <b>${s}</b> in Roman numerals. What number is this?</p>`, answer: v, unit: '', tol: 0.002,
        hint: 'A smaller letter in front of a bigger one is subtracted (IV = 4); otherwise add.',
        solution: steps(`Read ${s} from left to right.`, 'Add the letters, but subtract a letter that stands before a bigger one.', `The value is <b>${v}</b>.`) };
    },
    verify(x) { const c = [...x.s].map((l) => rv[l]); return c.reduce((t, v, i) => t + (c[i + 1] > v ? -v : v), 0); },
  },
  'c8m-num-bin': {
    title: 'binary to decimal',
    make(r) {
      const v = pick(r, 20, 63), s = v.toString(2);
      return { v, s, q: `<p>A computer stores a number as <b>${s}</b> in base 2. What is the number in our usual base 10?</p>`, answer: v, unit: '', tol: 0.002,
        hint: 'From the right the places are worth 1, 2, 4, 8, 16, 32. Add the places that hold a 1.',
        solution: steps(`The digits of ${s} from the right have values 1, 2, 4, 8, 16, 32.`, `Add the places with 1: ${[...s].reverse().map((d, i) => (d === '1' ? 2 ** i : null)).filter((x) => x !== null).join(' + ')}.`, `The number is <b>${v}</b>.`) };
    },
    verify(x) { return parseInt(x.s, 2); },
  },
  'c8m-num-tobin': {
    title: 'decimal to binary',
    make(r) {
      const v = pick(r, 9, 60);
      return { v, q: `<p>Write <b>${v}</b> in base 2. Type the digits as one number (for example 1011).</p>`, answer: +v.toString(2), unit: '', tol: 0.00001,
        hint: 'Divide by 2 again and again, noting each remainder. Read the remainders from the last to the first.',
        solution: steps(`Divide ${v} by 2 repeatedly, noting the remainders.`, 'Read the remainders from bottom to top.', `${v} = <b>${v.toString(2)}</b> in base 2.`) };
    },
    verify(x) { let m = x.v, o = ''; while (m > 0) { o = (m % 2) + o; m = Math.floor(m / 2); } return +o; },
  },
  'c8m-num-mayan': {
    title: 'Mayan numeral',
    make(r) {
      const a = pick(r, 1, 17), b = pick(r, 0, 19);
      return { a, b, q: `<p>A Mayan number has two levels. The upper level shows <b>${a}</b> (worth 20 each). The lower level shows <b>${b}</b> (worth 1 each). What number is it?</p>`, answer: 20 * a + b, unit: '', tol: 0.002,
        hint: 'Mayan numbers use base 20: the upper level is multiplied by 20.',
        solution: steps(`Upper level: ${a} × 20 = ${20 * a}.`, `Lower level: ${b}.`, `Total: ${20 * a} + ${b} = <b>${20 * a + b}</b>.`) };
    },
    verify(x) { return x.b + 20 * x.a; },
  },
  'c8m-num-base5': {
    title: 'base 5 to base 10',
    make(r) {
      const a = pick(r, 1, 4), b = pick(r, 0, 4), c = pick(r, 0, 4), s = `${a}${b}${c}`;
      return { s, q: `<p>In base 5 the number <b>${s}</b> uses the digits 0 to 4. What is it in base 10?</p>`, answer: 25 * a + 5 * b + c, unit: '', tol: 0.002,
        hint: 'The places are worth 25, 5 and 1 (powers of 5).',
        solution: steps(`${a} × 25 = ${25 * a}.`, `${b} × 5 = ${5 * b}.`, `${c} × 1 = ${c}. The total is <b>${25 * a + 5 * b + c}</b>.`) };
    },
    verify(x) { return parseInt(x.s, 5); },
  },
  'c8m-num-place': {
    title: 'place value and expanded form',
    make(r) {
      const t = pick(r, 1, 9), h = pick(r, 1, 9), o = pick(r, 1, 9), v = 1000 * t + 100 * h + 10 * 0 + o;
      return { t, h, o, v, q: `<p>The number ${n(v, 6)} has the digit ${h} in the hundreds place. What is the <b>value</b> of that digit?</p>`, answer: h * 100, unit: '', tol: 0.002,
        hint: 'Value of a digit = the digit × the value of its place.',
        solution: steps(`The hundreds place is worth 100.`, `${h} × 100 = <b>${h * 100}</b>.`) };
    },
    verify(x) { return Math.floor((x.v % 1000) / 100) * 100; },
  },
};
