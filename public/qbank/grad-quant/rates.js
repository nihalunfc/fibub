import { int, choose, fmt, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'rates',
  items: [
    { id: 'rt-001', type: 'mcq', level: 2, exams: E, sub: 'average speed',
      q: '<p>A driver goes 60 km to a town at 30 km/h and comes back the same way at 60 km/h. What is the average speed for the whole trip?</p>', options: ['40 km/h', '42 km/h', '45 km/h', '48 km/h', '50 km/h'], answer: 0,
      sol: '<p>Average speed = total distance ÷ total time. Going takes 60 ÷ 30 = 2 h, returning 60 ÷ 60 = 1 h. 120 km in 3 h = 40 km/h.</p>', trap: 'The plain average of 30 and 60 is 45, but more time is spent at the slower speed.' },
    { id: 'rt-002', type: 'mcq', level: 2, exams: E, sub: 'work',
      q: '<p>Pipe A fills a tank in 6 hours and pipe B in 3 hours. How long do both together take?</p>', options: ['1.5 h', '2 h', '2.5 h', '4.5 h', '9 h'], answer: 1,
      sol: '<p>Add rates, not times: A fills 1/6 of the tank per hour and B fills 1/3 = 2/6. Together 3/6 = 1/2 per hour, so 2 hours.</p>' },
    { id: 'rt-003', type: 'mcq', level: 3, exams: E, sub: 'relative speed',
      q: '<p>Two trains 300 km apart travel toward each other at 70 km/h and 80 km/h. How long until they meet?</p>', options: ['1.5 h', '2 h', '2.5 h', '3 h', '4 h'], answer: 1,
      sol: '<p>Moving toward each other, the gap closes at 70 + 80 = 150 km/h. 300 ÷ 150 = 2 hours.</p>' },
  ],
  gens: [
    { id: 'rt-g01', type: 'mcq', level: 1, exams: E, sub: 'd = rt', title: 'distance, rate and time',
      make(r) {
        const v = choose(r, [36, 45, 48, 54, 60, 72, 75, 80, 90]), mins = choose(r, [20, 25, 40, 45, 50, 75, 80, 90, 100, 140]), value = (v * mins) / 60;
        return { q: `<p>A bus travels at a steady ${v} km/h. How many kilometres does it cover in ${mins} minutes?</p>`, ...numOpts(r, value, [v * mins / 100, v * mins, (v / mins) * 60].map((x) => +x.toFixed(2))), value, v, mins, unit: 'km',
          hint: 'Turn minutes into hours (divide by 60) before multiplying by the speed.',
          sol: steps(`${mins} minutes = ${mins} ÷ 60 = ${fmt(mins / 60)} h.`, `Distance = rate × time = ${v} × ${fmt(mins / 60)}.`, `= <b>${fmt(value)} km</b>.`), trap: 'Treating 90 minutes as 0.9 hours.' };
      }, check: (p) => (p.v * p.mins) / 60 },
    { id: 'rt-g02', type: 'mcq', level: 2, exams: E, sub: 'average speed', title: 'average speed for a round trip',
      make(r) {
        const pairs = [[30, 60], [40, 60], [20, 30], [45, 90], [60, 90], [48, 80], [50, 75], [24, 40]];
        const [a, b] = choose(r, pairs), d = choose(r, [60, 120, 180, 240, 360]), value = (2 * a * b) / (a + b);
        return { q: `<p>A cyclist rides ${d} km at ${a} km/h and returns the same ${d} km at ${b} km/h. What is the average speed for the whole trip, in km/h?</p>`, ...numOpts(r, value, [(a + b) / 2, (a + b) / 2 + 2, Math.sqrt(a * b)].map((x) => +x.toFixed(2))), value, a, b, d, unit: 'km/h',
          hint: 'Average speed = total distance ÷ total time. Never average the two speeds.',
          sol: steps(`Times: ${d} ÷ ${a} = ${fmt(d / a)} h out, ${d} ÷ ${b} = ${fmt(d / b)} h back.`, `Total: ${2 * d} km in ${fmt(d / a + d / b)} h.`, `${2 * d} ÷ ${fmt(d / a + d / b)} = <b>${fmt(value)} km/h</b>.`), trap: `The plain average ${fmt((a + b) / 2)} ignores that more time is spent at the slower speed.` };
      }, check: (p) => (2 * p.d) / (p.d / p.a + p.d / p.b) },
    { id: 'rt-g03', type: 'mcq', level: 2, exams: E, sub: 'work', title: 'two workers together',
      make(r) {
        const pairs = [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [6, 3], [5, 20], [9, 18], [8, 24], [20, 30]];
        const [a, b] = choose(r, pairs), value = (a * b) / (a + b);
        return { q: `<p>Ana can paint a fence in ${a} hours and Ben can paint it in ${b} hours. Working together at these rates, how many hours do they take?</p>`, ...numOpts(r, value, [(a + b) / 2, a + b, Math.abs(a - b)].filter((x) => x > 0)), value, a, b, unit: 'h',
          hint: 'Add the rates: each does 1/time of the job per hour.',
          sol: steps(`Rates: 1/${a} and 1/${b} of the fence per hour.`, `Together: 1/${a} + 1/${b} = ${a + b}/${a * b} per hour.`, `Time = ${a * b}/${a + b} = <b>${fmt(value)} h</b>.`), trap: 'Averaging the times; together they must be faster than either alone.' };
      }, check: (p) => 1 / (1 / p.a + 1 / p.b) },
    { id: 'rt-g04', type: 'mcq', level: 3, exams: E, sub: 'relative speed', title: 'catch up',
      make(r) {
        const v1 = choose(r, [40, 50, 60]), v2 = v1 + choose(r, [10, 15, 20, 30]), head = choose(r, [0.5, 1, 1.5, 2]), value = (v1 * head) / (v2 - v1);
        return { q: `<p>A truck leaves a depot at ${v1} km/h. ${fmt(head)} hour${head === 1 ? '' : 's'} later a car leaves the same depot on the same road at ${v2} km/h. How many hours after the car leaves does it catch the truck?</p>`, ...numOpts(r, value, [value + head, (v1 * head) / v2, head * 2]), value, v1, v2, head, unit: 'h',
          hint: 'Find the truck\'s head start in km, then divide by how fast the car closes the gap.',
          sol: steps(`Head start: ${v1} × ${fmt(head)} = ${fmt(v1 * head)} km.`, `The car gains ${v2} − ${v1} = ${v2 - v1} km every hour.`, `${fmt(v1 * head)} ÷ ${v2 - v1} = <b>${fmt(value)} h</b>.`), trap: 'Adding the head start time to the answer; the question counts from when the car leaves.' };
      }, check: (p) => (p.v1 * p.head) / (p.v2 - p.v1) },
  ],
};
