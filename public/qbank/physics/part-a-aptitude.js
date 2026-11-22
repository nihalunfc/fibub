// General aptitude for CSIR NET Part A: number series, ratios and percentages, data described in words, simple
// geometry, logical puzzles, graph reading and estimation. Original questions written for fibub (none copied from a
// past paper). Single-answer MCQs only, as in the real Part A. Levels 1 warm-up ... 4 hard.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './part-a-aptitude.more.gen.js';
import r4 from './part-a-aptitude.r4.gen.js';

// Place the correct option at a position that cycles through A-D, so answers are spread evenly.
const POS = [1, 3, 0, 2, 2, 0, 3, 1];
let k = 0;
const M = (id, level, sub, q, correct, wrongs, sol, trap) => {
  const p = POS[k++ % POS.length];
  const options = wrongs.slice(0, 3);
  options.splice(p, 0, correct);
  const it = { id, type: 'mcq', level, exams: ['net'], sub, format: 'single', q, options, answer: p, sol };
  if (trap) it.trap = trap;
  return it;
};

const items = [
  // ---------- number series ----------
  M('apt-001', 1, 'number series', 'Find the next term: 3, 7, 15, 31, 63, ?', '127', ['125', '126', '129'],
    'Each term is twice the previous one plus 1: $3\\to7\\to15\\to31\\to63\\to2(63)+1 = 127$. Equivalently the terms are $2^n - 1$ for $n = 2, 3, \\dots$',
    'Looking only at the differences (4, 8, 16, 32) also works: the next difference is 64, so 63 + 64 = 127.'),
  M('apt-002', 1, 'number series', 'Find the next term: 2, 6, 12, 20, 30, ?', '42', ['40', '44', '36'],
    'The differences are 4, 6, 8, 10, so the next is 12: $30 + 12 = 42$. The terms are $n(n+1)$: $1\\cdot2, 2\\cdot3, \\dots, 6\\cdot7 = 42$.'),
  M('apt-003', 2, 'number series', 'Find the next term: 1, 4, 27, 256, ?', '3125', ['625', '1024', '4096'],
    'The terms are $n^n$: $1^1, 2^2, 3^3, 4^4$. Next is $5^5 = 3125$.',
    '625 is $5^4$ and 1024 is $4^5$: right digits, wrong pattern.'),
  M('apt-004', 2, 'number series', 'Find the next term: 2, 5, 11, 20, 32, ?', '47', ['44', '45', '48'],
    'Differences: 3, 6, 9, 12, so the next difference is 15 and the next term is $32 + 15 = 47$.'),
  M('apt-005', 2, 'number series', 'One term of the series 1, 8, 27, 64, 124, 216 is wrong. Which one?', '124', ['8', '27', '64'],
    'The series is the cubes $1^3, 2^3, \\dots, 6^3$. The fifth cube is $125$, not 124.'),
  M('apt-006', 1, 'number series', 'Find the next term: 2, 3, 5, 8, 13, 21, ?', '34', ['29', '32', '35'],
    'Each term is the sum of the two before it (a Fibonacci-type series): $13 + 21 = 34$.'),
  M('apt-007', 2, 'number series', 'Find the next term: 1, 10, 3, 9, 5, 8, 7, ?', '7', ['6', '9', '8'],
    'Two series are interleaved. Odd places: 1, 3, 5, 7 (up by 2). Even places: 10, 9, 8, ... (down by 1). The 8th term is in the even series: 7.',
    'Treating it as one series gives no clean pattern; when differences jump up and down, split odd and even places.'),
  M('apt-008', 3, 'number series', 'Find the next term: 3, 8, 24, 48, 120, ?', '168', ['143', '156', '169'],
    'Add 1 to each term: 4, 9, 25, 49, 121 = $2^2, 3^2, 5^2, 7^2, 11^2$, squares of the primes. The next prime is 13, so the next term is $13^2 - 1 = 168$.',
    '143 comes from assuming the next prime is 12 (not prime). 169 forgets to subtract 1.'),
  M('apt-009', 2, 'number series', 'Find the next letter: A, C, F, J, O, ?', 'U', ['T', 'V', 'S'],
    'Positions in the alphabet: 1, 3, 6, 10, 15 (gaps 2, 3, 4, 5). The next gap is 6, giving position 21 = U.'),
  M('apt-010', 2, 'number series', 'Find the next term: 0, 7, 26, 63, 124, ?', '215', ['216', '217', '210'],
    'The terms are $n^3 - 1$ for $n = 1, 2, \\dots$: $6^3 - 1 = 215$.', '216 is $6^3$ itself.'),
  M('apt-011', 1, 'number series', 'Find the next term: 1, 2, 6, 24, 120, ?', '720', ['600', '840', '620'],
    'Multiply by 2, 3, 4, 5, then 6: $120\\times6 = 720$. These are the factorials $n!$.'),
  M('apt-012', 4, 'number series', 'Find the next term: 2, 3, 10, 15, 26, 35, ?', '50', ['48', '49', '51'],
    'Compare with the squares 1, 4, 9, 16, 25, 36, 49: the terms are $n^2 + 1$ for odd $n$ and $n^2 - 1$ for even $n$. The 7th term is $49 + 1 = 50$.',
    'The differences (1, 7, 5, 11, 9) zig-zag, a hint that the rule depends on whether $n$ is odd or even.'),

  // ---------- ratios, percentages, rates ----------
  M('apt-013', 1, 'percentages', 'The price of an item is raised by 20% and the new price is then reduced by 20%. Compared with the original price, the final price is', '4% lower', ['unchanged', '4% higher', '2% lower'],
    'Final $= 1.2\\times0.8 = 0.96$ of the original, so it is 4% lower.',
    'The two 20%s are taken of different amounts, so they do not cancel.'),
  M('apt-014', 2, 'percentages', 'Two successive increases of 10% and 20% are together equal to a single increase of', '32%', ['30%', '31%', '33%'],
    '$1.1\\times1.2 = 1.32$: an increase of 32%. In general $a\\%$ then $b\\%$ gives $a + b + ab/100$ percent.'),
  M('apt-015', 2, 'ratios', 'If $A:B = 2:3$ and $B:C = 4:5$, then $A:B:C$ is', '8 : 12 : 15', ['2 : 3 : 5', '4 : 6 : 5', '8 : 12 : 10'],
    'Make B the same in both: $A:B = 8:12$ and $B:C = 12:15$. So $A:B:C = 8:12:15$.'),
  M('apt-016', 2, 'percentages', 'A person earns 30 000 rupees a month, spends 40% on rent and then 25% of what is left on food. How much is left after rent and food?', '13 500 rupees', ['10 500 rupees', '12 000 rupees', '15 000 rupees'],
    'After rent: $0.6\\times30000 = 18000$. Food takes 25% of 18 000 = 4500. Left: 13 500.',
    'Taking 25% of the full 30 000 for food gives 10 500.'),
  M('apt-017', 2, 'percentages', 'If $x$ is 25% more than $y$, then $y$ is less than $x$ by', '20%', ['25%', '22.5%', '80%'],
    '$x = 1.25y$, so $y = 0.8x$: $y$ is 20% less than $x$. The base of the percentage changes from $y$ to $x$.',
    '25% is the tempting answer; percentages are not symmetric.'),
  M('apt-018', 3, 'ratios', 'A 40-litre mixture has milk and water in the ratio 3 : 1. How much water must be added to make the ratio 3 : 2?', '10 litres', ['5 litres', '15 litres', '20 litres'],
    'Milk 30 L, water 10 L. For 3 : 2 with 30 L of milk, water must be 20 L. Add 10 L.'),
  M('apt-019', 1, 'percentages', 'Each side of a square is increased by 10%. Its area increases by', '21%', ['10%', '20%', '11%'],
    'Area scales as side squared: $1.1^2 = 1.21$, an increase of 21%.'),
  M('apt-020', 2, 'percentages', 'A town of 10 000 people grows by 10% every year. Its population after 3 years is', '13 310', ['13 000', '13 300', '13 100'],
    '$10000\\times1.1^3 = 10000\\times1.331 = 13310$. Growth is compounded on the new total each year.',
    '13 000 adds 10% of the original 10 000 three times (simple growth).'),
  M('apt-021', 3, 'ratios', 'Two numbers are in the ratio 5 : 7. If 6 is added to each, the ratio becomes 7 : 9. The numbers are', '15 and 21', ['10 and 14', '20 and 28', '25 and 35'],
    'Let them be $5k$ and $7k$. $(5k+6)/(7k+6) = 7/9$ gives $45k + 54 = 49k + 42$, so $k = 3$: 15 and 21. Check: 21/27 = 7/9.'),
  M('apt-022', 2, 'rates', 'A car goes 60 km at 30 km/h and comes back the same 60 km at 60 km/h. Its average speed for the round trip is', '40 km/h', ['45 km/h', '42 km/h', '50 km/h'],
    'Time out = 2 h, back = 1 h. Average = total distance / total time = 120/3 = 40 km/h (the harmonic mean $2uv/(u+v)$).',
    '45 km/h is the plain average of the two speeds; the car spends longer at the slower speed.'),
  M('apt-023', 2, 'rates', 'A can finish a job in 10 days and B in 15 days. Working together they finish it in', '6 days', ['12.5 days', '5 days', '8 days'],
    'Rates add: $1/10 + 1/15 = 5/30 = 1/6$ of the job per day, so 6 days.',
    '12.5 days averages the times; times never add or average, rates do.'),
  M('apt-024', 2, 'rates', 'A pipe fills a tank in 4 hours. A leak alone would empty the full tank in 12 hours. With both, the empty tank fills in', '6 hours', ['8 hours', '3 hours', '5 hours'],
    'Net rate $= 1/4 - 1/12 = 2/12 = 1/6$ tank per hour: 6 hours.'),
  M('apt-025', 3, 'clocks', 'The angle between the hour and minute hands of a clock at 3:40 is', '130°', ['120°', '140°', '125°'],
    'Minute hand: $40\\times6° = 240°$. Hour hand: $3\\times30° + 40\\times0.5° = 110°$. Difference: 130°.',
    'Forgetting that the hour hand moves 0.5° per minute gives 150° or 120°.'),
  M('apt-026', 4, 'rates', 'Pipe A fills a tank in 6 h and pipe B in 8 h; pipe C empties the full tank in 12 h. All three are opened together on an empty tank, and C is closed after 2 hours. How long does the tank take to fill, counted from the start?', '4 hours', ['4.8 hours', '3.5 hours', '5 hours'],
    'All three: $1/6 + 1/8 - 1/12 = (4 + 3 - 2)/24 = 5/24$ per hour; in 2 h, $10/24$. Left: $14/24$. A and B: $7/24$ per hour, so 2 more hours. Total 4 hours.'),
  M('apt-027', 4, 'percentages', 'In an election 10% of the voters on the list did not vote. The winner got 60% of the votes cast and won by 3600 votes. How many voters were on the list? (Only two candidates, no invalid votes.)', '20 000', ['18 000', '30 000', '36 000'],
    'Votes cast $= 0.9N$. Winner $0.54N$, loser $0.36N$, margin $0.18N = 3600$, so $N = 20000$.',
    '18 000 forgets the 10% who did not vote (margin $0.2N$).'),
  M('apt-028', 2, 'ages', 'A father is now four times as old as his son. In 5 years he will be three times as old. The son is now', '10 years old', ['5 years old', '15 years old', '8 years old'],
    'Let the son be $s$: $4s + 5 = 3(s + 5)$, so $s = 10$ (father 40; in 5 years 45 = 3 × 15).'),

  // ---------- data described in words ----------
  M('apt-029', 1, 'data interpretation', 'A shop sold 120, 150, 90 and 140 units in the four quarters of a year. What share of the year\'s sales came in the second quarter?', '30%', ['25%', '28%', '35%'],
    'Total $= 500$. Second quarter: $150/500 = 30\\%$.'),
  M('apt-030', 2, 'data interpretation', 'A shop sold 120, 150, 90 and 140 units in the four quarters of a year. By what percentage did sales fall from the second quarter to the third?', '40%', ['60%', '33.3%', '30%'],
    'The fall is $150 - 90 = 60$ units, taken as a fraction of the earlier value 150: $60/150 = 40\\%$.',
    '60% is the fall in units, not a percentage of anything; always divide the change by the starting value.'),
  M('apt-031', 1, 'data interpretation', 'A shop sold 120, 150, 90 and 140 units in the four quarters of a year. The average sale per quarter was', '125 units', ['120 units', '130 units', '135 units'],
    '$(120 + 150 + 90 + 140)/4 = 500/4 = 125$.'),
  M('apt-032', 2, 'sets', 'In a class of 40, 24 passed physics, 18 passed mathematics and 10 passed both. How many failed both?', '8', ['0', '10', '2'],
    'Passed at least one $= 24 + 18 - 10 = 32$. Failed both $= 40 - 32 = 8$.',
    'Adding 24 + 18 = 42 counts the 10 who passed both twice.'),
  M('apt-033', 2, 'data interpretation', 'A monthly budget is split as food 25%, rent 30%, transport 10%, and savings take the rest. On a pie chart, the savings sector has an angle of', '126°', ['108°', '135°', '90°'],
    'Savings $= 100 - 65 = 35\\%$; angle $= 0.35\\times360° = 126°$.'),
  M('apt-034', 3, 'data interpretation', 'In one year 1200 candidates sat a test and 15% qualified. The next year 1500 sat and 12% qualified. The number who qualified', 'stayed the same', ['rose by 20%', 'fell by 3%', 'fell by 20%'],
    'First year $0.15\\times1200 = 180$; next year $0.12\\times1500 = 180$. The same number.',
    'The pass rate fell by 3 percentage points, but the number of candidates rose; numbers and rates are different questions.'),
  M('apt-035', 2, 'data interpretation', 'A factory made 40, 50, 45, 60 and 66 thousand tonnes in five successive years. In which year was the percentage rise over the previous year largest?', 'the fourth year', ['the second year', 'the fifth year', 'the third year'],
    'Rises: year 2: 10/40 = 25%; year 3: a fall; year 4: 15/45 = 33.3%; year 5: 6/60 = 10%. Largest in year 4.',
    'Divide each rise by the previous year\'s value: a rise from a large base can be a small percentage, as in year 5.'),
  M('apt-036', 2, 'averages', 'One section of 30 students averaged 60 marks and another of 20 students averaged 70. The average over all 50 students is', '64', ['65', '66', '62'],
    'Weighted average: $(30\\times60 + 20\\times70)/50 = (1800 + 1400)/50 = 64$.',
    '65 is the plain average of 60 and 70, ignoring that the sections differ in size.'),
  M('apt-037', 2, 'averages', 'The average of 10 numbers was found to be 20, but one number, 38, had been copied as 83. The correct average is', '15.5', ['16.5', '24.5', '20'],
    'Wrong sum $= 200$. Correct sum $= 200 - 83 + 38 = 155$. Average $= 15.5$.'),
  M('apt-038', 3, 'averages', 'For the data 3, 7, 7, 9, 12, 15, which is true?', 'mean > median > mode', ['mode > median > mean', 'median > mean > mode', 'all three are equal'],
    'Mode = 7 (appears twice). Median = average of 7 and 9 = 8. Mean = 53/6 ≈ 8.83. So mean > median > mode, as for data with a long upper tail.'),
  M('apt-039', 4, 'data interpretation', 'A firm\'s sales rose 20% in one year and fell 20% the next. Over the same two years its profit, as a fraction of sales, went from 10% to 12%. Compared with the start, profit at the end is', 'up 15.2%', ['up 20%', 'down 4%', 'up 2%'],
    'Sales end at $1.2\\times0.8 = 0.96$ of the start. Profit: $0.10S \\to 0.12\\times0.96S = 0.1152S$, up 15.2%.',
    '"Up 2%" subtracts the margins (12% − 10%) instead of comparing profits.'),

  // ---------- geometry ----------
  M('apt-040', 1, 'geometry', 'A triangle has sides 6 cm, 8 cm and 10 cm. Its area is', '24 cm²', ['48 cm²', '30 cm²', '40 cm²'],
    '$6^2 + 8^2 = 10^2$, so it is right-angled with legs 6 and 8. Area $= \\tfrac12\\times6\\times8 = 24$ cm².'),
  M('apt-041', 2, 'geometry', 'A circle is drawn inside a square of side 10 cm, touching all four sides. The area inside the square but outside the circle is', '$100 - 25\\pi$ cm²', ['$100 - 50\\pi$ cm²', '$25\\pi$ cm²', '$100 - 10\\pi$ cm²'],
    'The circle has radius 5, area $25\\pi$. Square area 100. Difference $100 - 25\\pi \\approx 21.5$ cm².'),
  M('apt-042', 2, 'geometry', 'How many diagonals does a regular ten-sided polygon have?', '35', ['45', '40', '30'],
    'Each vertex joins to $10 - 3 = 7$ others by a diagonal; each diagonal is counted from both ends: $10\\times7/2 = 35$. (45 is the number of all pairs of vertices, which includes the 10 sides.)'),
  M('apt-043', 1, 'geometry', 'Each interior angle of a regular hexagon is', '120°', ['108°', '135°', '144°'],
    'Sum of interior angles $= (6 - 2)\\times180° = 720°$; each is $720/6 = 120°$.'),
  M('apt-044', 3, 'geometry', 'A 13 m ladder leans on a wall with its foot 5 m from the wall. If the foot slides 2 m further out, the top slides down by about', '1.05 m', ['2 m', '1.5 m', '0.5 m'],
    'At first the top is at $\\sqrt{169 - 25} = 12$ m. Then the foot is 7 m out and the top at $\\sqrt{169 - 49} = \\sqrt{120} \\approx 10.95$ m. Drop $\\approx 1.05$ m.',
    'The top does not move by the same 2 m as the foot.'),
  M('apt-045', 1, 'geometry', 'The edge of a cube is doubled. Its new surface area is how many times the old?', '4', ['2', '8', '6'],
    'Areas scale as length squared: $2^2 = 4$. (The volume goes up $2^3 = 8$ times.)'),
  M('apt-046', 3, 'geometry', 'A sphere just fits inside a cylinder whose height equals its diameter. The ratio of the sphere\'s volume to the cylinder\'s is', '2/3', ['1/2', '3/4', '4/3'],
    'Sphere $\\tfrac43\\pi r^3$, cylinder $\\pi r^2(2r) = 2\\pi r^3$. Ratio $= (4/3)/2 = 2/3$ (Archimedes\' result).'),
  M('apt-047', 1, 'geometry', 'The distance between the points (1, 2) and (4, 6) is', '5', ['7', '$\\sqrt7$', '25'],
    '$\\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = 5$.'),
  M('apt-048', 2, 'geometry', 'The midpoints of the sides of a triangle of area 48 cm² are joined to form a smaller triangle. Its area is', '12 cm²', ['24 cm²', '16 cm²', '6 cm²'],
    'The midpoint triangle has sides half as long, so its area is $(1/2)^2 = 1/4$ of the original: 12 cm².'),
  M('apt-049', 1, 'geometry', 'A rectangular field is 40 m by 30 m. How much shorter is walking along the diagonal than along two adjacent sides?', '20 m', ['10 m', '30 m', '25 m'],
    'Two sides: 70 m. Diagonal: $\\sqrt{40^2 + 30^2} = 50$ m. Saving: 20 m.'),
  M('apt-050', 3, 'geometry', 'The area of a regular hexagon of side 2 cm is', '$6\\sqrt3$ cm²', ['$3\\sqrt3$ cm²', '$12\\sqrt3$ cm²', '$4\\sqrt3$ cm²'],
    'A regular hexagon is six equilateral triangles of side 2, each of area $\\tfrac{\\sqrt3}{4}\\times4 = \\sqrt3$. Total $6\\sqrt3 \\approx 10.4$ cm².'),

  // ---------- logical puzzles ----------
  M('apt-051', 2, 'logical reasoning', 'Five friends P, Q, R, S and T sit in a row facing north. R is in the middle. P is at the left end. S sits immediately to the right of R. Q does not sit next to P. Who sits second from the left?', 'T', ['Q', 'S', 'R'],
    'Seats 1 to 5 from the left: P = 1, R = 3, S = 4. Q and T take seats 2 and 5. Q cannot be next to P, so Q = 5 and T = 2.'),
  M('apt-052', 3, 'logical reasoning', 'Each of A, B and C either always tells the truth or always lies. A says "B is a liar." B says "C is a liar." C says "A and B are both liars." Who tells the truth?', 'only B', ['only A', 'only C', 'A and C'],
    'If C were truthful, A and B would both lie; but A lying means B is truthful, a contradiction. So C lies. Then B\'s statement "C is a liar" is true: B is truthful. A\'s statement "B is a liar" is false: A lies. Check: C\'s claim "both A and B lie" is false, consistent.',
    'Start from the statement that makes the strongest claim (C\'s) and test it.'),
  M('apt-053', 1, 'calendar', '1 January of a non-leap year is a Monday. What day is 1 January of the next year?', 'Tuesday', ['Monday', 'Wednesday', 'Sunday'],
    '365 days $= 52$ weeks + 1 day, so the day moves on by one: Tuesday.'),
  M('apt-054', 2, 'calendar', '15 August of a year is a Friday. What day is 15 October of the same year?', 'Wednesday', ['Thursday', 'Tuesday', 'Friday'],
    'From 15 Aug to 15 Sep: 31 days (August has 31). To 15 Oct: 30 more. Total 61 = 8 weeks + 5 days. Friday + 5 = Wednesday.'),
  M('apt-055', 1, 'logical reasoning', 'A is B\'s sister. C is B\'s mother. D is C\'s father. How is A related to D?', 'granddaughter', ['daughter', 'grandmother', 'niece'],
    'A is a child of C (B\'s mother), and C is D\'s child. So A is D\'s grandchild, and as a sister she is a granddaughter.'),
  M('apt-056', 1, 'coding', 'In a code, PHYSICS is written QIZTJDT. How is MATTER written in the same code?', 'NBUUFS', ['NBUUES', 'LZSSDQ', 'NBTUFS'],
    'Each letter moves one place forward: P→Q, H→I, ... So M→N, A→B, T→U, T→U, E→F, R→S: NBUUFS.',
    'LZSSDQ shifts backwards.'),
  { id: 'apt-057', type: 'mcq', level: 2, exams: ['net'], sub: 'logical reasoning', format: 'single',
    q: 'Statements: "All bosons are particles. Some particles are charged." Which conclusion follows for certain?',
    options: ['Some bosons are charged', 'No boson is charged', 'All charged things are bosons', 'None of these three follows'], answer: 3,
    sol: 'The charged particles may or may not include any bosons: the statements allow both. So neither "some bosons are charged" nor "no boson is charged" is certain, and nothing says all charged things are bosons. Draw two circles (bosons inside particles) and place "charged" so it overlaps particles but misses bosons: every conclusion can be broken.',
    trap: 'Physics knowledge (some bosons, like W bosons, are charged) does not count: judge only from the statements.' },
  M('apt-058', 2, 'counting', 'How many squares of all sizes are there on a 4 × 4 grid of unit squares?', '30', ['16', '20', '25'],
    '1 × 1: 16; 2 × 2: 9; 3 × 3: 4; 4 × 4: 1. Total 30 (the sum of the squares $1 + 4 + 9 + 16$).'),
  M('apt-059', 1, 'counting', 'At a meeting each of 10 people shakes hands once with every other person. How many handshakes are there?', '45', ['90', '100', '50'],
    'Each handshake is a pair: $\\binom{10}{2} = 10\\times9/2 = 45$.', '90 counts each handshake twice.'),
  M('apt-060', 2, 'logical reasoning', 'Nine coins look alike; one is slightly heavier. With a two-pan balance, the smallest number of weighings that always finds it is', '2', ['3', '4', '1'],
    'Split into three groups of 3 and weigh two groups: the heavier pan holds it, or if they balance it is in the third group. Then weigh 1 against 1 from that group the same way. Each weighing has 3 outcomes, and $3^2 = 9$.'),
  M('apt-061', 3, 'counting', 'In how many ways can 5 different books stand in a row if two particular books must be next to each other?', '48', ['120', '24', '96'],
    'Tie the two books into one block: 4 items, $4! = 24$ orders. The two books can be in either order inside the block: $24\\times2 = 48$.'),
  M('apt-062', 2, 'probability', 'Two fair dice are thrown. The probability that the total is 7 is', '1/6', ['1/12', '7/36', '5/36'],
    'Six of the 36 equally likely outcomes give 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). $6/36 = 1/6$.'),
  M('apt-063', 2, 'logical reasoning', 'Which number does not belong: 121, 169, 225, 289, 323?', '323', ['121', '225', '289'],
    '121, 169, 225, 289 are $11^2, 13^2, 15^2, 17^2$. 323 $= 17\\times19$ is not a square.'),
  M('apt-064', 1, 'directions', 'A person walks 3 km north, then 4 km east, then 3 km south. How far is the person from the starting point?', '4 km', ['10 km', '5 km', '7 km'],
    'The north and south walks cancel. The person ends 4 km east of the start.'),
  M('apt-065', 3, 'clocks', 'How many times do the hour and minute hands of a clock point the same way in one full day (24 hours)?', '22', ['24', '23', '48'],
    'The minute hand gains one full turn on the hour hand every 12/11 hours, so they meet 11 times in 12 hours and 22 times in 24 hours.',
    '24 assumes they meet once every hour; around 11 o\'clock and 12 o\'clock the meetings merge.'),
  M('apt-066', 4, 'probability', 'Three fair coins are tossed. Given that at least one shows heads, the probability that all three show heads is', '1/7', ['1/8', '1/3', '3/7'],
    'Of the 8 outcomes, 7 have at least one head; one of these is HHH. Probability $= 1/7$.',
    '1/8 ignores the condition.'),

  // ---------- graph reading ----------
  M('apt-067', 1, 'graph reading', 'A position–time graph is a straight line from 2 m at $t = 0$ to 10 m at $t = 4$ s. The velocity is', '2 m/s', ['2.5 m/s', '0.5 m/s', '8 m/s'],
    'Velocity = slope $= (10 - 2)/(4 - 0) = 2$ m/s.', '2.5 m/s divides the final position 10 by 4, ignoring the starting 2 m.'),
  M('apt-068', 2, 'graph reading', 'A velocity–time graph rises in a straight line from 0 to 20 m/s in 4 s, stays at 20 m/s for 6 s, then falls in a straight line to 0 in 2 s. The distance travelled is', '180 m', ['240 m', '200 m', '160 m'],
    'Distance = area under the graph: $\\tfrac12(4)(20) + 6(20) + \\tfrac12(2)(20) = 40 + 120 + 20 = 180$ m.'),
  M('apt-069', 3, 'graph reading', 'On log–log axes (base 10), a straight line passes through $(x, y) = (1, 3)$ and $(10, 300)$. The relation is', '$y = 3x^2$', ['$y = 3x$', '$y = 3e^{2x}$', '$y = 3x^3$'],
    'A straight line on log–log axes means a power law $y = Ax^n$. Slope $n = \\log(300/3)/\\log(10/1) = 2$; at $x = 1$, $A = 3$.'),
  M('apt-070', 3, 'graph reading', 'A graph of $\\ln N$ against time $t$ is a straight line falling from 5 at $t = 0$ to 3 at $t = 4$ h. The half-life of $N$ is about', '1.4 h', ['2 h', '0.5 h', '4 h'],
    'Slope $= -2/4 = -0.5$ per hour, so $N \\propto e^{-0.5t}$. Half-life $= \\ln2/0.5 \\approx 1.39$ h.',
    '2 h reads the time for $\\ln N$ to drop by 1, which is the mean life, not the half-life.'),
  M('apt-071', 2, 'graph reading', 'A curve rises from zero at $x = 0$ to a single maximum at $x = 2$ and falls back to zero at $x = 4$. Which function has this shape?', '$y = x(4 - x)$', ['$y = x(x - 4)$', '$y = (x - 2)^2$', '$y = 4x - x^3$'],
    '$x(4 - x)$ is zero at 0 and 4 and is a downward parabola with its top at $x = 2$. $x(x - 4)$ has a minimum there, $(x-2)^2$ touches zero at 2, and $4x - x^3$ is zero at $x = 2$.'),
  M('apt-072', 2, 'graph reading', 'A force–displacement graph rises in a straight line from 0 to 10 N over the first 2 m, then stays at 10 N for 3 more metres. The work done is', '40 J', ['50 J', '30 J', '20 J'],
    'Work = area: triangle $\\tfrac12(2)(10) = 10$ J plus rectangle $3\\times10 = 30$ J, total 40 J.'),
  M('apt-073', 3, 'graph reading', 'A supply line is $Q = 2P - 10$ and a demand line is $Q = 50 - P$, with $P$ the price and $Q$ the quantity. Where do they cross?', '$P = 20$, $Q = 30$', ['$P = 30$, $Q = 20$', '$P = 15$, $Q = 35$', '$P = 20$, $Q = 40$'],
    'Set $2P - 10 = 50 - P$: $3P = 60$, $P = 20$, then $Q = 30$.'),

  // ---------- estimation and approximation ----------
  M('apt-074', 1, 'estimation', 'Roughly how many seconds are there in a year?', '$3.2\\times10^7$', ['$3.2\\times10^5$', '$8.6\\times10^4$', '$3.2\\times10^9$'],
    '$365\\times24\\times3600 \\approx 3.15\\times10^7$ s. ($8.6\\times10^4$ is one day.) A handy memory aid: a year is about $\\pi\\times10^7$ s.'),
  M('apt-075', 2, 'estimation', 'About how many times does a human heart beat in a 70-year life?', '$\\sim 10^9$', ['$\\sim 10^7$', '$\\sim 10^{11}$', '$\\sim 10^6$'],
    'About 70 beats a minute: $70\\times60\\times24\\times365 \\approx 3.7\\times10^7$ a year, times 70 years $\\approx 2.6\\times10^9$, of order $10^9$.'),
  M('apt-076', 1, 'approximation', '$\\sqrt{0.0009\\times400}$ equals', '0.6', ['6', '0.06', '0.36'],
    '$0.0009\\times400 = 0.36$ and $\\sqrt{0.36} = 0.6$.'),
  M('apt-077', 2, 'approximation', 'Using $2^{10} \\approx 10^3$, $2^{40}$ is closest to', '$1.1\\times10^{12}$', ['$1.1\\times10^{10}$', '$4\\times10^{13}$', '$8\\times10^{9}$'],
    '$2^{40} = (2^{10})^4 \\approx (1.024\\times10^3)^4 \\approx 1.1\\times10^{12}$.'),
  M('apt-078', 2, 'estimation', 'A city of 10 million people uses about 150 litres of water per person per day. The daily use is of order', '$10^9$ litres', ['$10^7$ litres', '$10^{11}$ litres', '$10^8$ litres'],
    '$10^7\\times150 = 1.5\\times10^9$ litres, of order $10^9$.'),
  M('apt-079', 3, 'estimation', 'Roughly how many water molecules are in a 250 mL glass of water? (Water: 18 g per mole.)', '$\\sim 10^{25}$', ['$\\sim 10^{22}$', '$\\sim 10^{28}$', '$\\sim 10^{20}$'],
    '250 g / 18 g mol⁻¹ $\\approx 14$ mol; $14\\times6\\times10^{23} \\approx 8\\times10^{24}$, of order $10^{25}$.'),
  M('apt-080', 3, 'approximation', '$(1.01)^{100}$ is closest to', '2.7', ['2.0', '1.1', '101'],
    '$(1 + 1/n)^n \\to e$ for large $n$; with $n = 100$ it is $\\approx 2.705$.',
    '2.0 comes from $1 + 100\\times0.01$, the first-order approximation, which fails when $nx$ is not small.'),
  M('apt-081', 4, 'estimation', 'A sheet of paper 0.1 mm thick is (in imagination) folded in half 30 times. The stack would be about', '100 km thick', ['3 mm thick', '1 m thick', '$10^5$ km thick'],
    'Each fold doubles the thickness: $0.1\\text{ mm}\\times2^{30} \\approx 0.1\\times1.07\\times10^9$ mm $\\approx 1.07\\times10^8$ mm $\\approx 107$ km.',
    '3 mm adds 0.1 mm per fold instead of doubling.'),
];

// ---------- templates ----------
const opts = (rng, correct, wrongs, show) => mcqOptions(rng, correct, wrongs, show);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const gens = [
  { id: 'apt-g01', type: 'mcq', level: 1, exams: ['net'], sub: 'number series',
    make(rng) {
      const a = int(rng, 1, 6), m = int(rng, 2, 3), d = choose(rng, [1, 2, 3, -1]);
      const t = [a]; for (let i = 0; i < 4; i++) t.push(t[i] * m + d);
      const ans = t[4] * m + d;
      const o = opts(rng, ans, [ans + m, t[4] * m, ans - 1, ans + 2 * Math.abs(d) + 1]);
      return { q: `Find the next term: ${t.join(', ')}, ?`, ...o, a, m, d, ans,
        sol: `Each term is ${m} times the previous one ${d >= 0 ? 'plus' : 'minus'} ${Math.abs(d)}: $${t[4]}\\times${m} ${d >= 0 ? '+' : '-'} ${Math.abs(d)} = ${ans}$.` };
    },
    verify(p) { let x = p.a; for (let i = 0; i < 5; i++) x = x * p.m + p.d; return x; } },
  { id: 'apt-g02', type: 'mcq', level: 2, exams: ['net'], sub: 'number series',
    make(rng) {
      const a = int(rng, 1, 9), b = int(rng, 1, 5), c = int(rng, 1, 3);
      const f = (n) => a + b * n + c * n * n, t = [0, 1, 2, 3, 4].map(f), ans = f(5);
      const d = [1, 2, 3, 4].map((i) => t[i] - t[i - 1]);
      const o = opts(rng, ans, [ans - 2 * c, ans + 2 * c, t[4] + d[3], ans + 1]);
      return { q: `Find the next term: ${t.join(', ')}, ?`, ...o, a, b, c,
        sol: `The differences are ${d.join(', ')}, which go up by ${2 * c} each time. The next difference is ${d[3] + 2 * c}, so the next term is $${t[4]} + ${d[3] + 2 * c} = ${ans}$.`,
        trap: `${t[4] + d[3]} repeats the last difference instead of letting it grow.` };
    },
    verify(p) { return p.a + 5 * p.b + 25 * p.c; } },
  { id: 'apt-g03', type: 'mcq', level: 2, exams: ['net'], sub: 'percentages',
    make(rng) {
      const x = int(rng, 2, 8) * 5, y = int(rng, 2, 8) * 5;
      const net = round(((1 + x / 100) * (1 - y / 100) - 1) * 100, 2);
      const show = (v) => (v > 0 ? `a rise of ${Math.abs(v)}%` : v < 0 ? `a fall of ${Math.abs(v)}%` : 'no change');
      const o = opts(rng, net, [x - y, -net, round(x - y + (x * y) / 100, 2), round(net - 1, 2)], show);
      return { q: `A quantity is first increased by ${x}% and then the result is decreased by ${y}%. The overall change is`, ...o, x, y,
        sol: `Multiply the factors: $${1 + x / 100}\\times${1 - y / 100} = ${round(1 + net / 100, 4)}$, which is ${show(net)}.`,
        trap: `Simply subtracting gives ${x - y}%, but the ${y}% is taken of the larger amount.` };
    },
    verify(p) { return ((1 + p.x / 100) * (1 - p.y / 100) - 1) * 100; } },
  { id: 'apt-g04', type: 'mcq', level: 2, exams: ['net'], sub: 'percentages',
    make(rng) {
      const pct = choose(rng, [10, 20, 25, 40, 50, 60, 75, 100]);
      const ans = round((100 * pct) / (100 + pct), 2);
      const o = opts(rng, ans, [pct, round(100 - pct / 2, 2), round(pct / 2, 2), round(ans + 5, 2)], (v) => `${v}%`);
      return { q: `$A$ is ${pct}% more than $B$. By what percentage is $B$ less than $A$ (to two decimals where needed)?`, ...o, pct,
        sol: `$A = ${1 + pct / 100}B$, so $B = A/${1 + pct / 100}$ and $B$ is less than $A$ by $\\frac{${pct}}{${100 + pct}}\\times100\\% = ${ans}\\%$.`,
        trap: `${pct}% is wrong: the second percentage is taken of $A$, which is larger.` };
    },
    verify(p) { return (100 * p.pct) / (100 + p.pct); } },
  { id: 'apt-g05', type: 'mcq', level: 2, exams: ['net'], sub: 'rates',
    make(rng) {
      const [u, v] = choose(rng, [[30, 60], [40, 60], [20, 30], [60, 90], [12, 24], [45, 90], [30, 70], [40, 120]]);
      const ans = round((2 * u * v) / (u + v), 2);
      const o = opts(rng, ans, [(u + v) / 2, round(Math.sqrt(u * v), 2), v - u, round(ans - 4, 2)], (x) => `${x} km/h`);
      return { q: `A cyclist rides from one town to another at ${u} km/h and returns along the same road at ${v} km/h. The average speed for the whole trip is`, ...o, u, v,
        sol: `For a distance $d$ each way, the time is $d/${u} + d/${v}$, so the average speed is $\\frac{2d}{d/${u} + d/${v}} = \\frac{2\\times${u}\\times${v}}{${u} + ${v}} = ${ans}$ km/h.`,
        trap: `${(u + v) / 2} km/h is the plain average, but more time is spent at the slower speed.` };
    },
    verify(p) { return (2 * p.u * p.v) / (p.u + p.v); } },
  { id: 'apt-g06', type: 'mcq', level: 2, exams: ['net'], sub: 'rates',
    make(rng) {
      const [a, b] = choose(rng, [[10, 15], [12, 24], [6, 12], [20, 30], [8, 24], [9, 18], [15, 30], [12, 36], [4, 12], [10, 40]]);
      const ans = round((a * b) / (a + b), 2);
      const o = opts(rng, ans, [(a + b) / 2, a + b, round(ans + 2, 2), Math.abs(b - a)], (x) => `${x} days`);
      return { q: `One machine finishes a batch in ${a} days and another in ${b} days. Working together, they finish it in`, ...o, a, b,
        sol: `Rates add: $\\frac1{${a}} + \\frac1{${b}} = \\frac{${a + b}}{${a * b}}$ of the batch per day, so the time is $\\frac{${a * b}}{${a + b}} = ${ans}$ days.`,
        trap: 'Times do not add or average; rates (work per day) do.' };
    },
    verify(p) { return (p.a * p.b) / (p.a + p.b); } },
  { id: 'apt-g07', type: 'mcq', level: 2, exams: ['net'], sub: 'sets',
    make(rng) {
      const n = int(rng, 6, 12) * 10, x = int(rng, Math.round(n * 0.4), Math.round(n * 0.6)), y = int(rng, Math.round(n * 0.3), Math.round(n * 0.5));
      const both = int(rng, Math.max(1, x + y - n + 1), Math.min(x, y) - 1), ans = n - (x + y - both);
      const o = opts(rng, ans, [n - x - y + 2 * both, Math.abs(n - x - y), both, ans + both]);
      return { q: `Of ${n} students, ${x} read physics journals, ${y} read chemistry journals and ${both} read both. How many read neither?`, ...o, n, x, y, both,
        sol: `At least one: $${x} + ${y} - ${both} = ${x + y - both}$. Neither: $${n} - ${x + y - both} = ${ans}$.`,
        trap: 'Adding the two groups counts those who read both twice; subtract them once.' };
    },
    verify(p) { return p.n - p.x - p.y + p.both; } },
  { id: 'apt-g08', type: 'mcq', level: 3, exams: ['net'], sub: 'clocks',
    make(rng) {
      const h = int(rng, 1, 11), m = int(rng, 1, 11) * 5;
      let ang = Math.abs(30 * h - 5.5 * m); if (ang > 180) ang = 360 - ang;
      const o = opts(rng, ang, [Math.abs(30 * h - 6 * m) % 360 > 180 ? 360 - (Math.abs(30 * h - 6 * m) % 360) : Math.abs(30 * h - 6 * m) % 360, ang + 15, Math.abs(ang - 10), 360 - ang], (v) => `${v}°`);
      return { q: `What is the smaller angle between the hands of a clock at ${h}:${String(m).padStart(2, '0')}?`, ...o, h, m,
        sol: `Minute hand: $${m}\\times6° = ${6 * m}°$ from 12. Hour hand: $${h}\\times30° + ${m}\\times0.5° = ${30 * h + 0.5 * m}°$. Difference: $${Math.abs(30 * h - 5.5 * m)}°$${Math.abs(30 * h - 5.5 * m) > 180 ? `, and the smaller angle is $360° - ${Math.abs(30 * h - 5.5 * m)}° = ${ang}°$` : ''}.`,
        trap: 'The hour hand is not fixed on the hour: it moves 0.5° every minute.' };
    },
    verify(p) { const a = Math.abs(30 * p.h - 5.5 * p.m); return a > 180 ? 360 - a : a; } },
  { id: 'apt-g09', type: 'mcq', level: 2, exams: ['net'], sub: 'calendar',
    make(rng) {
      const d0 = int(rng, 0, 6), n = int(rng, 20, 400), d1 = (d0 + n) % 7;
      const o = opts(rng, DAYS[d1], [DAYS[(d1 + 1) % 7], DAYS[(d1 + 6) % 7], DAYS[(d1 + 2) % 7]]);
      return { q: `Today is a ${DAYS[d0]}. What day of the week will it be ${n} days from today?`, ...o, d0, n,
        sol: `Only the remainder after whole weeks matters: $${n} = 7\\times${Math.floor(n / 7)} + ${n % 7}$. ${DAYS[d0]} plus ${n % 7} day${n % 7 === 1 ? '' : 's'} is ${DAYS[d1]}.` };
    },
    verify(p) { return (p.d0 + p.n) % 7; } },
  { id: 'apt-g10', type: 'mcq', level: 3, exams: ['net'], sub: 'geometry',
    make(rng) {
      const [L, x] = choose(rng, [[13, 5], [10, 6], [25, 7], [17, 8], [15, 9], [20, 12], [26, 10]]), s = int(rng, 1, 3);
      const h1 = Math.sqrt(L * L - x * x), h2 = Math.sqrt(L * L - (x + s) ** 2), ans = round(h1 - h2, 2);
      const o = opts(rng, ans, [s, round(ans / 2, 2), round(ans + 1, 2), round(2 * ans, 2)], (v) => `${v} m`);
      return { q: `A ${L} m ladder leans against a vertical wall with its foot ${x} m from the wall. The foot slides ${s} m further from the wall. How far does the top slide down (to the nearest centimetre)?`, ...o, L, x, s,
        sol: `Before: top at $\\sqrt{${L}^2 - ${x}^2} = ${round(h1, 3)}$ m. After: $\\sqrt{${L}^2 - ${x + s}^2} = ${round(h2, 3)}$ m. Drop $= ${ans}$ m.`,
        trap: 'The top does not move by the same distance as the foot.' };
    },
    verify(p) { return Math.sqrt(p.L ** 2 - p.x ** 2) - Math.sqrt(p.L ** 2 - (p.x + p.s) ** 2); } },
  { id: 'apt-g11', type: 'mcq', level: 2, exams: ['net'], sub: 'averages',
    make(rng) {
      const n1 = int(rng, 2, 8) * 5, n2 = int(rng, 2, 8) * 5, a1 = int(rng, 40, 70), a2 = a1 + int(rng, 5, 20);
      const ans = round((n1 * a1 + n2 * a2) / (n1 + n2), 2);
      const o = opts(rng, ans, [(a1 + a2) / 2, round(ans + 2, 2), round(ans - 3, 2), a2 - a1]);
      return { q: `A batch of ${n1} students averaged ${a1} marks and another batch of ${n2} students averaged ${a2}. What is the average of all ${n1 + n2} students?`, ...o, n1, n2, a1, a2,
        sol: `Total marks $= ${n1}\\times${a1} + ${n2}\\times${a2} = ${n1 * a1 + n2 * a2}$. Average $= ${n1 * a1 + n2 * a2}/${n1 + n2} = ${ans}$.`,
        trap: `${(a1 + a2) / 2} averages the two averages, which is right only when the batches are the same size.` };
    },
    verify(p) { return (p.n1 * p.a1 + p.n2 * p.a2) / (p.n1 + p.n2); } },
  { id: 'apt-g12', type: 'mcq', level: 2, exams: ['net'], sub: 'graph reading',
    make(rng) {
      const v = int(rng, 2, 9) * 5, a = int(rng, 2, 8), b = int(rng, 2, 10), c = int(rng, 1, 6);
      const ans = v * (a / 2 + b + c / 2);
      const o = opts(rng, ans, [v * (a + b + c), v * b, v * (a + b + c / 2), ans + v], (x) => `${x} m`);
      return { q: `A velocity–time graph rises in a straight line from 0 to ${v} m/s in ${a} s, stays flat for ${b} s, then falls in a straight line to 0 in ${c} s. What distance does it describe?`, ...o, v, a, b, c,
        sol: `Distance = area under the graph: $\\tfrac12(${a})(${v}) + ${b}(${v}) + \\tfrac12(${c})(${v}) = ${v * a / 2} + ${v * b} + ${v * c / 2} = ${ans}$ m.`,
        trap: 'The sloping parts are triangles: take half of base times height.' };
    },
    verify(p) { return p.v * (p.a / 2 + p.b + p.c / 2); } },
  { id: 'apt-g13', type: 'mcq', level: 3, exams: ['net'], sub: 'graph reading',
    make(rng) {
      const A = int(rng, 2, 9), n = choose(rng, [-2, -1, 1, 2, 3, 0.5]), x2 = choose(rng, [10, 100]);
      const y2 = round(A * x2 ** n, 6);
      const show = (k) => (k === 1 ? `$y = ${A}x$` : `$y = ${A}x^{${k}}$`);
      const o = opts(rng, n, [n + 1, n === -1 ? 2 : -n, n * 2 === n + 1 ? 4 : n * 2], show);
      return { q: `On log–log axes (base 10), a straight line passes through $(1, ${A})$ and $(${x2}, ${y2})$. The relation between $y$ and $x$ is`, ...o, A, n, x2, y2,
        sol: `A straight line on log–log axes is a power law $y = Ax^n$. At $x = 1$, $y = A = ${A}$. Slope $n = \\frac{\\log(${y2}/${A})}{\\log ${x2}} = ${n}$. So ${show(n)}.` };
    },
    verify(p) { return Math.log10(p.y2 / p.A) / Math.log10(p.x2); } },
];

export default { topic: 'part-a-aptitude', items: [...items, ...r4.items], gens: [...gens, ...more, ...r4.gens] };
