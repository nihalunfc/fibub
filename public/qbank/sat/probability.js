// SAT Math · Problem-solving and data analysis · probability and conditional probability. Original (fibub).
import { int, choose, frac, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'data' };

export default {
  topic: 'probability',
  gens: [
    { id: 'sat-pb-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'simple', facets: F, format: 'numeric',
      make(r) {
        const red = int(r, 2, 12), blue = int(r, 2, 12), green = int(r, 1, 10), c = choose(r, ['red', 'blue', 'green']);
        const k = { red, blue, green }[c], t = red + blue + green;
        return { q: `<p>A bag holds ${red} red, ${blue} blue and ${green} green marbles. One marble is picked at random. What is the probability that it is ${c}? Give your answer as a decimal or fraction.</p>`, answer: k / t, tol: 0.002, k, t,
          sol: steps(`Total marbles: ${t}. ${c[0].toUpperCase() + c.slice(1)} marbles: ${k}.`, `Probability = ${k}/${t} = <b>${frac(k, t)}</b> ≈ ${fmt(k / t, 3)}.`) };
      },
      verify: (p) => p.k / p.t },
    { id: 'sat-pb-g02', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'conditional from a table', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 5, 30), b = int(r, 5, 30), c = int(r, 5, 30), d = int(r, 5, 30);
        return { q: `<table class="qb-table"><tr><th></th><th>Likes the new menu</th><th>Does not</th></tr><tr><th>Adults</th><td>${a}</td><td>${b}</td></tr><tr><th>Teens</th><td>${c}</td><td>${d}</td></tr></table><p>A person is chosen at random from those who like the new menu. What is the probability that the person is a teen? Give a decimal or fraction.</p>`, answer: c / (a + c), tol: 0.002, a, c,
          sol: steps(`"From those who like the new menu" means the whole group is that column: ${a} + ${c} = ${a + c}.`, `Teens in it: ${c}. Probability = ${c}/${a + c} = <b>${frac(c, a + c)}</b>.`), trap: `Dividing by all ${a + b + c + d} people.` };
      },
      verify: (p) => p.c / (p.a + p.c) },
    { id: 'sat-pb-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'expected count', facets: F, format: 'numeric',
      make(r) {
        const p = choose(r, [0.02, 0.04, 0.05, 0.1, 0.15, 0.2, 0.25]), n = int(r, 4, 40) * 100;
        return { q: `<p>A factory finds that the probability a light bulb is faulty is ${p}. In a shipment of ${n.toLocaleString('en-US')} bulbs, how many would you expect to be faulty?</p>`, answer: p * n, tol: 0.001, p, n,
          sol: steps(`Expected number = probability × number of bulbs = ${p} × ${n} = <b>${fmt(p * n)}</b>.`) };
      },
      verify: (p) => p.p * p.n },
    { id: 'sat-pb-g04', type: 'nat', marks: 1, level: 4, exams: ['sat'], sub: 'two events', facets: F, format: 'numeric',
      make(r) {
        const s = choose(r, [6, 8, 10, 12]), k = int(r, 1, s / 2);
        return { q: `<p>A fair spinner has ${s} equal sections numbered 1 to ${s}. It is spun twice. What is the probability that both spins land on a number ${k === 1 ? 'equal to 1' : `less than or equal to ${k}`}? Give a decimal or fraction.</p>`, answer: (k / s) ** 2, tol: 0.0005, k, s,
          sol: steps(`One spin: ${k}/${s} = ${frac(k, s)}.`, `The spins are independent, so multiply: (${frac(k, s)})<sup>2</sup> = <b>${frac(k * k, s * s)}</b>.`) };
      },
      verify: (p) => (p.k / p.s) ** 2 },
  ],
  items: [
    { id: 'sat-pb-001', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'complement', facets: F,
      q: '<p>The probability that it rains on a given day is 0.35. What is the probability that it does not rain that day?</p>',
      options: ['0.65', '0.35', '0.5', '1.35'], answer: 0,
      sol: '<p>"Rains" and "does not rain" cover every case, so their probabilities add to 1: 1 − 0.35 = <b>0.65</b>.</p>' },
  ],
};
