// GRE answer formats: Numeric Entry (type the number) and select-all multiple-answer questions.
import { int, choose, shuffle, fmt, steps } from '../grad-quant/_q.js';
const E = ['gre'];
const neg = (v) => String(v).replace('-', '−');
export default {
  topic: 'formats',
  gens: [
    { id: 'ne-g01', type: 'nat', level: 2, exams: E, format: 'numeric', sub: 'numeric entry',
      make(r) {
        const k = int(r, 0, 2);
        if (k === 0) { const w = int(r, 3, 12), l = w + int(r, 2, 9), P = 2 * (w + l);
          return { q: `<p>A rectangle has a perimeter of ${P} cm and a length ${l - w} cm longer than its width. What is its area, in square centimetres?</p>`, answer: w * l, tol: 0, k, w, l,
            sol: steps(`Width w, length w + ${l - w}. Perimeter: 2(w + w + ${l - w}) = ${P}, so 2w + ${l - w} = ${P / 2} and w = ${w}.`, `Length = ${l}. Area = ${w} × ${l} = <b>${w * l}</b>.`), trap: 'Typing the perimeter or a side instead of the area. Re-read what is asked before you type.' }; }
        if (k === 1) { const n = choose(r, [20, 25, 40, 50]), p = choose(r, [10, 15, 20, 30, 35]), part = (n * p) / 100;
          return { q: `<p>In a class of ${n} students, ${part} walk to school. What percent of the class walks to school?</p><p>Give your answer as a number of percent, without the % sign.</p>`, answer: p, tol: 0, k, n, part,
            sol: steps(`Percent = part ÷ whole × 100 = ${part} ÷ ${n} × 100 = <b>${p}</b>.`), trap: 'Typing 0.' + String(p).padStart(2, '0') + ' (the decimal) when the box asks for percent.' }; }
        const a = int(r, 2, 9), b = int(r, 1, 20), x = int(r, -6, 12), c = a * x + b;
        return { q: `<p>If ${a}x + ${b} = ${neg(c)}, what is the value of x?</p>`, answer: x, tol: 0, k, a, b, c,
          sol: steps(`Subtract ${b}: ${a}x = ${neg(c - b)}.`, `Divide by ${a}: x = <b>${neg(x)}</b>.`), trap: 'Sign slips when the answer is negative: type the minus sign.' };
      },
      verify: (p) => (p.k === 0 ? p.w * p.l : p.k === 1 ? (p.part / p.n) * 100 : (p.c - p.b) / p.a) },
    { id: 'ma-g01', type: 'msq', level: 3, exams: E, format: 'multi', sub: 'select all',
      make(r) {
        const a = int(r, 2, 4), lo = int(r, -4, 3), hi = lo + int(r, 3, 6), c = int(r, -3, 3);
        // lo < a x + c < hi  → (lo − c)/a < x < (hi − c)/a
        const L = (lo - c) / a, H = (hi - c) / a, start = Math.floor(L) - 1, xs = Array.from({ length: 7 }, (_, i) => start + i);
        const answer = xs.map((x, i) => (x > L && x < H ? i : -1)).filter((i) => i >= 0);
        if (!answer.length) return this.make(r);
        return { q: `<p>Which of the following integers x satisfy ${neg(lo)} &lt; ${a}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} &lt; ${neg(hi)}?</p><p>Select <b>all</b> that apply.</p>`, options: xs.map(neg), answer,
          sol: steps(`Subtract ${neg(c)} from every part: ${neg(lo - c)} &lt; ${a}x &lt; ${neg(hi - c)}.`, `Divide by ${a}: ${fmt(L, 3).replace('-', '−')} &lt; x &lt; ${fmt(H, 3).replace('-', '−')}.`, `The integers in that range: <b>${answer.map((i) => neg(xs[i])).join(', ')}</b>.`),
          trap: 'Including the end values: the signs are strict (&lt;), so a value that makes the expression equal to an end is not allowed.' };
      } },
    { id: 'ma-g02', type: 'msq', level: 3, exams: E, format: 'multi', sub: 'select all',
      make(r) {
        const N = choose(r, [24, 36, 48, 60, 72, 90]), m = choose(r, [2, 3]), divs = []; for (let d = 1; d <= N; d++) if (N % d === 0) divs.push(d);
        const right = divs.filter((d) => d % m === 0), wrongs = [...divs.filter((d) => d % m !== 0), ...[N + m, 2 * m * 7, m * 11].filter((d) => N % d !== 0)];
        const opts = shuffle(r, [...shuffle(r, right).slice(0, int(r, 2, 4)), ...shuffle(r, wrongs).slice(0, 3)]).sort((a, b) => a - b);
        const answer = opts.map((d, i) => (N % d === 0 && d % m === 0 ? i : -1)).filter((i) => i >= 0);
        return { q: `<p>n is a positive divisor of ${N} and n is a multiple of ${m}. Which of the following could be n?</p><p>Select <b>all</b> that apply.</p>`, options: opts.map(String), answer,
          sol: `<p>Check each choice twice: does it divide ${N}, and is it a multiple of ${m}?</p><ul>${opts.map((d) => `<li>${d}: ${N % d === 0 ? 'divides ' + N : 'does not divide ' + N}; ${d % m === 0 ? 'a multiple of ' + m : 'not a multiple of ' + m} → ${N % d === 0 && d % m === 0 ? '<b>yes</b>' : 'no'}</li>`).join('')}</ul>`,
          trap: 'Stopping after the first right choice. Select-all questions need every right choice and no wrong one.' };
      } },
    { id: 'ne-g02', type: 'nat', level: 3, exams: E, format: 'numeric', sub: 'numeric entry',
      make(r) {
        const k = int(r, 0, 1);
        if (k === 0) { const n = choose(r, [4, 5, 6]), m = int(r, 12, 40), xs = Array.from({ length: n - 1 }, () => int(r, m - 10, m + 10)), last = n * m - xs.reduce((a, b) => a + b, 0);
          return { q: `<p>The average (arithmetic mean) of ${n} numbers is ${m}. ${['Three', 'Four', 'Five'][n - 4]} of them are ${xs.join(', ')}. What is the remaining number?</p>`, answer: last, tol: 0, k, n, m, xs,
            sol: steps(`The total of all ${n} numbers is ${n} × ${m} = ${n * m}.`, `The known numbers add to ${xs.reduce((a, b) => a + b, 0)}.`, `The remaining number is ${n * m} − ${xs.reduce((a, b) => a + b, 0)} = <b>${neg(last)}</b>.`), trap: 'Averaging the known numbers instead of working with the total.' }; }
        const a = choose(r, [40, 50, 60, 80, 120, 150, 200, 250]), p = choose(r, [-40, -25, -20, -10, 10, 20, 25, 30, 50, 75]), b = (a * (100 + p)) / 100;
        return { q: `<p>A price changed from ${a} dollars to ${b} dollars. By what percent did it change? Give a negative number for a fall.</p>`, answer: p, tol: 0, k, a, b,
          sol: steps(`Percent change = (new − old) ÷ old × 100.`, `(${b} − ${a}) ÷ ${a} × 100 = <b>${neg(p)}</b>.`), trap: 'Dividing by the new price instead of the old one.' };
      },
      verify: (p) => (p.k === 0 ? p.n * p.m - p.xs.reduce((a, b) => a + b, 0) : ((p.b - p.a) / p.a) * 100) },
    { id: 'ma-g03', type: 'msq', level: 3, exams: E, format: 'multi', sub: 'select all',
      make(r) {
        const k = choose(r, [4, 9, 16, 25]), s = Math.sqrt(k), cand = [-s - 1, -s, -s + 0.5, -1, 0, 0.5, s - 0.5, s, s + 1], opts = shuffle(r, cand).slice(0, 6).sort((a, b) => a - b);
        const answer = opts.map((x, i) => (x * x < k ? i : -1)).filter((i) => i >= 0);
        if (!answer.length || answer.length === opts.length) return this.make(r);
        return { q: `<p>Which of the following values of x satisfy x² &lt; ${k}?</p><p>Select <b>all</b> that apply.</p>`, options: opts.map((x) => neg(fmt(x, 3))), answer,
          sol: steps(`x² &lt; ${k} means −${s} &lt; x &lt; ${s}: x lies strictly between −${s} and ${s}.`, `So the values are <b>${answer.map((i) => neg(fmt(opts[i], 3))).join(', ')}</b>.`),
          trap: `Forgetting negative values (−${s - 0.5} works too), or including ±${s}, where x² equals ${k} exactly.` };
      } },
  ],
};
