import { int, choose, fmt, gcd, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'ratios',
  items: [
    { id: 'ra-001', type: 'mcq', level: 2, exams: E, sub: 'combine ratios',
      q: '<p>The ratio of <i>a</i> to <i>b</i> is 2 : 3 and the ratio of <i>b</i> to <i>c</i> is 4 : 5. What is the ratio of <i>a</i> to <i>c</i>?</p>', options: ['2 : 5', '8 : 15', '3 : 5', '6 : 5', '8 : 5'], answer: 1,
      sol: '<p>Make <i>b</i> the same in both: <i>a</i> : <i>b</i> = 8 : 12 and <i>b</i> : <i>c</i> = 12 : 15. So <i>a</i> : <i>c</i> = 8 : 15.</p>', trap: 'Joining 2 : 3 and 4 : 5 directly gives 2 : 5, but the b values (3 and 4) are not the same.' },
    { id: 'ra-002', type: 'mcq', level: 2, exams: E, sub: 'parts',
      q: '<p>A class has boys and girls in the ratio 4 : 5. Which of the following could be the number of students in the class?</p>', options: ['24', '32', '40', '45', '50'], answer: 3,
      sol: '<p>Students come in groups of 4 + 5 = 9, so the total must be a multiple of 9. Only 45 is.</p>' },
    { id: 'ra-003', type: 'mcq', level: 3, exams: E, sub: 'changing ratio',
      q: '<p>A jar holds red and blue marbles in the ratio 3 : 5. After 9 red marbles are added, the ratio of red to blue is 3 : 2. How many blue marbles are in the jar?</p>', options: ['6', '8', '10', '12', '15'], answer: 2,
      sol: '<p>Let red = 3<i>k</i> and blue = 5<i>k</i>. After adding: (3<i>k</i> + 9) : 5<i>k</i> = 3 : 2. Cross-multiply: 2(3<i>k</i> + 9) = 3 × 5<i>k</i>, so 6<i>k</i> + 18 = 15<i>k</i> and <i>k</i> = 2. Blue = 5 × 2 = 10. Check: red 6 + 9 = 15, and 15 : 10 = 3 : 2.</p>', trap: 'Treating the ratio numbers 3 and 5 as the actual counts.' },
  ],
  gens: [
    { id: 'ra-g01', type: 'mcq', level: 1, exams: E, sub: 'parts', title: 'share in a ratio',
      make(r) {
        const a = int(r, 1, 7), b = int(r, 2, 9); if (gcd(a, b) !== 1 || a === b) return this.make(r);
        const k = int(r, 3, 40) * 5, total = (a + b) * k, value = b * k;
        return { q: `<p>Two partners split a profit of &#36;${fmt(total)} in the ratio ${a} : ${b}. How many dollars does the partner with the larger share get?</p>`.replace('larger', a > b ? 'smaller' : 'larger'), ...numOpts(r, a > b ? b * k : value, [a * k, total / 2, Math.round(total / b)]), value: a > b ? b * k : value, a, b, total,
          hint: `Add the parts: ${a} + ${b} = ${a + b}. One part is worth total ÷ ${a + b}.`,
          sol: steps(`Total parts: ${a + b}. One part = ${fmt(total)} ÷ ${a + b} = ${fmt(k)}.`, `The share asked about has ${b} parts.`, `${b} × ${fmt(k)} = <b>&#36;${fmt(b * k)}</b>.`), trap: 'Dividing the total by one of the ratio numbers instead of by their sum.' };
      }, check: (p) => (p.total * p.b) / (p.a + p.b) },
    { id: 'ra-g02', type: 'mcq', level: 2, exams: E, sub: 'mixtures', title: 'mix two solutions',
      make(r) {
        const c1 = choose(r, [10, 15, 20, 25, 30]), c2 = choose(r, [40, 50, 60, 70, 80]), v1 = int(r, 2, 12) * 5, v2 = int(r, 2, 12) * 5;
        const value = (c1 * v1 + c2 * v2) / (v1 + v2);
        return { q: `<p>${v1} litres of a ${c1}% salt solution are mixed with ${v2} litres of a ${c2}% salt solution. What is the percent of salt in the mixture?</p>`, ...numOpts(r, value, [(c1 + c2) / 2, c1 + c2, (c1 * v2 + c2 * v1) / (v1 + v2)].map((x) => +x.toFixed(2))), value, c1, c2, v1, v2, unit: '%',
          hint: 'Find the litres of salt in each, add them, and divide by the total litres.',
          sol: steps(`Salt: ${c1}% of ${v1} = ${fmt((c1 * v1) / 100)} L, and ${c2}% of ${v2} = ${fmt((c2 * v2) / 100)} L.`, `Total salt ${fmt((c1 * v1 + c2 * v2) / 100)} L in ${v1 + v2} L.`, `${fmt((c1 * v1 + c2 * v2) / 100)} ÷ ${v1 + v2} = <b>${fmt(value, 2)}%</b>.`), trap: v1 === v2 ? 'Here the volumes are equal, so the plain average happens to work; it usually does not.' : 'Taking the plain average of the two percents ignores that the volumes differ.' };
      }, check: (p) => (p.c1 * p.v1 + p.c2 * p.v2) / (p.v1 + p.v2) },
    { id: 'ra-g03', type: 'mcq', level: 2, exams: E, sub: 'proportion', title: 'scale a recipe or map',
      make(r) {
        const cm = choose(r, [1, 2, 4, 5]), km = choose(r, [3, 5, 8, 12, 15, 25]), d = int(r, 3, 30) / 2, value = (d / cm) * km;
        return { q: `<p>On a map, ${cm} cm stands for ${km} km. Two towns are ${fmt(d)} cm apart on the map. How far apart are they in real life, in km?</p>`, ...numOpts(r, value, [d * km, (d * cm) / km, d + km].map((x) => +x.toFixed(2))), value, d, cm, km, unit: 'km',
          hint: `Find how many km one centimetre stands for, then multiply.`,
          sol: steps(`1 cm stands for ${km} ÷ ${cm} = ${fmt(km / cm)} km.`, `${fmt(d)} cm × ${fmt(km / cm)} km per cm.`, `= <b>${fmt(value)} km</b>.`) };
      }, check: (p) => (p.d * p.km) / p.cm },
    { id: 'ra-g04', type: 'mcq', level: 3, exams: E, sub: 'changing ratio', title: 'ratio after adding some',
      make(r) {
        const a = int(r, 1, 5), b = int(r, a + 1, 8), k = int(r, 2, 9), add = int(r, 1, 6) * (b - a > 0 ? 1 : 1);
        // red a k, blue b k, add x red so that ratio becomes (a k + x) : b k = c : d with small c, d
        const red = a * k, blue = b * k, x = add * gcd(red, blue) || add, nr = red + x, g = gcd(nr, blue);
        const value = blue;
        return { q: `<p>A shelf holds novels and textbooks in the ratio ${a} : ${b}. After ${x} novels are added, the ratio becomes ${nr / g} : ${blue / g}. How many textbooks are on the shelf?</p>`, ...numOpts(r, value, [red, nr, blue / g * 2 === value ? blue + 1 : (blue / g) * 2]), value, a, b, x, c: nr / g, d: blue / g,
          hint: `Call the novels ${a}k and the textbooks ${b}k, then write the new ratio as an equation.`,
          sol: steps(`Novels ${a}k, textbooks ${b}k. After adding: (${a}k + ${x}) : ${b}k = ${nr / g} : ${blue / g}.`, `Cross-multiply: ${blue / g}(${a}k + ${x}) = ${nr / g} × ${b}k, so ${(nr / g) * b - (blue / g) * a}k = ${(blue / g) * x} and k = ${k}.`, `Textbooks = ${b} × ${k} = <b>${value}</b>.`), trap: `Answering the number of novels (${red} before, ${nr} after).` };
      }, check: (p) => (p.b * p.d * p.x) / (p.c * p.b - p.d * p.a) },
  ],
};
