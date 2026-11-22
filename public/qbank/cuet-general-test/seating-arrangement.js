// CUET General Test: seating and order. Original questions for fibub.
// Every puzzle was checked by trying all possible arrangements: each has exactly one solution.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
const mc = (id, level, sub, q, opts, sol, trap, extra) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return { ...mcq(id, level, sub, q, o, k, sol, trap), ...(extra || {}) };
};
const G = (key) => ({ group: key, format: 'passage' });
const SOL = (t) => `<p><b>Solve it first:</b> ${t}</p>`;

export default {
  topic: 'seating-arrangement',
  groups: {
    g1: { title: 'Five friends in a row', passage: '<p>Anil, Bina, Chetan, Divya and Eshan sit in a row of five seats numbered 1 to 5 from left to right.</p><ol><li>Eshan sits in the middle seat.</li><li>Anil sits immediately to the left of Eshan.</li><li>Chetan sits at one of the two ends.</li><li>Bina sits somewhere to the right of Eshan.</li><li>Divya and Bina do not sit next to each other.</li></ol>' },
    g2: { title: 'Six people round a table', passage: '<p>Six people sit round a table. "Clockwise" means the way a clock\'s hands move when you look down on the table.</p><ol><li>Gita sits immediately clockwise of Farhan.</li><li>Indu sits exactly opposite Farhan.</li><li>Harsh sits directly between Gita and Indu (next to both).</li><li>Karan sits next to Farhan.</li><li>Jaya is the sixth person.</li></ol>' },
    g3: { title: 'Heights of five friends', passage: '<p>Lata, Mohan, Neha, Omkar and Pooja all have different heights. Lata is taller than Mohan but shorter than Neha. Omkar is shorter than Mohan. Pooja is taller than Neha.</p>' },
    g4: { title: 'Six exams in a week', passage: '<p>Six exams (Maths, English, Physics, Chemistry, History and Biology) are held one per day from Monday to Saturday.</p><ol><li>Maths is on the day right after Physics.</li><li>Chemistry is on Wednesday.</li><li>English is on the day right after Chemistry.</li><li>History is on Saturday.</li></ol>' },
    g5: { title: 'Offices in a building', passage: '<p>A building has six floors, numbered 1 (lowest) to 6 (top). Six offices, a Bank, Clinic, Library, Shop, School and Gym, are on one floor each.</p><ol><li>The Gym is on the top floor.</li><li>The Bank is on floor 1.</li><li>The Library is exactly two floors above the Bank.</li><li>The Clinic is between the Bank and the Library.</li><li>The School is immediately above the Shop.</li></ol>' },
    g6: { title: 'Two rows facing each other', passage: '<p>Eight people sit in two rows of four seats. Row 1 faces south and row 2 faces north, so each person in row 1 faces someone in row 2. Seats in each row are numbered 1 to 4 from west to east, and seat n of row 1 is opposite seat n of row 2. Row 1 has Arjun, Bhavna, Chirag and Dolly; row 2 has Eklavya, Farida, Gopal and Hema.</p><ol><li>Arjun sits at the west end of row 1 and Dolly at the east end.</li><li>Bhavna sits next to Arjun.</li><li>Hema sits opposite Arjun.</li><li>Eklavya sits opposite Dolly.</li><li>Gopal sits next to Hema.</li></ol>' },
    g7: { title: 'Eight people round a table', passage: '<p>Eight people sit round a table. "Clockwise" is the way a clock\'s hands move when you look down on the table.</p><ol><li>Tara sits immediately clockwise of Sanjay.</li><li>Waseem sits opposite Sanjay.</li><li>Uday sits directly between Tara and Vimala (next to both).</li><li>Yash sits immediately clockwise of Waseem.</li><li>Zoya sits next to Yash.</li><li>Anita is the eighth person.</li></ol>' },
    g8: { title: 'Books on a shelf', passage: '<p>Five books (History, English, Maths, Science and Hindi) stand in a row on a shelf in positions 1 to 5 from the left.</p><ol><li>History is at the left end.</li><li>Maths is in the middle.</li><li>English is immediately left of Maths.</li><li>Hindi is somewhere to the right of Science.</li></ol>' },
    g9: { title: 'Ages of five siblings', passage: '<p>Ravi, Seema, Tarun, Uma and Vijay are siblings of different ages. Seema is older than Ravi. Tarun is younger than Ravi. Uma is older than Seema but younger than Vijay.</p>' },
  },
  items: [
    mc('sa-001', 1, 'row position', 'Sita is 15th from the left end of a row and 18th from the right end. How many people are in the row?', ['32', '33', '34', '31'], 'Total = (position from left) + (position from right) − 1 = 15 + 18 − 1 = <b>32</b>.', 'Sita is counted in both numbers, so subtract 1 once.'),
    mc('sa-002', 1, 'row position', 'There are 40 students in a row. Mohan is 14th from the left. What is his position from the right end?', ['27th', '26th', '25th', '28th'], 'From the right = 40 − 14 + 1 = <b>27th</b>.', 'Without the +1 you get 26, which is the number of people to his right.'),
    mc('sa-003', 1, 'rank', 'Anil ranks 8th from the top in a class of 40. What is his rank from the bottom?', ['33rd', '32nd', '34th', '31st'], 'From the bottom = 40 − 8 + 1 = <b>33rd</b>.'),
    mc('sa-004', 2, 'between', 'In a row of 25 students, Vikram is 7th from the left and Rohit is 9th from the right. How many students are between them?', ['9', '8', '10', '7'], 'Rohit is 25 − 9 + 1 = 17th from the left. Students between positions 7 and 17: 17 − 7 − 1 = <b>9</b>.'),
    mc('sa-005', 3, 'exchange', 'In a row, A is 10th from the left and B is 15th from the right. When they exchange places, A becomes 20th from the left. How many people are in the row?', ['34', '35', '33', '45'], 'A now stands where B was, so B was 20th from the left and 15th from the right. Total = 20 + 15 − 1 = <b>34</b>.', 'Only the new position of A matters; the 10th from the left is a distraction.'),
    mc('sa-006', 1, 'between', 'In a row Ram is 9th from the left and Shyam is 14th from the left. How many people stand between them?', ['4', '5', '3', '6'], 'Between positions 9 and 14: 14 − 9 − 1 = <b>4</b>.'),
    mc('sa-007', 2, 'circle', 'Ten people are numbered 1 to 10 and sit at equal gaps round a circular table. Who sits opposite person 3?', ['Person 8', 'Person 7', 'Person 9', 'Person 5'], 'Opposite means halfway round: 10 ÷ 2 = 5 seats away. 3 + 5 = <b>8</b>.'),
    mc('sa-008', 3, 'queue', 'Ravi is 7th from the front of a queue. Kiran stands behind Ravi with 6 people between them, and Kiran is 12th from the back. How many people are in the queue?', ['25', '24', '26', '27'], 'Kiran\'s place from the front = 7 + 6 + 1 = 14. Total = 14 + 12 − 1 = <b>25</b>.'),
    mc('sa-009', 3, 'row position', 'In a row of girls, Mina is 12th from the left. Tina is to Mina\'s right, 5 girls are between them, and Tina is 18th from the right. How many girls are in the row?', ['35', '34', '36', '30'], 'Tina\'s place from the left = 12 + 5 + 1 = 18. She is also 18th from the right, so total = 18 + 18 − 1 = <b>35</b>.'),
    mc('sa-010', 2, 'ordering', 'A is taller than B and B is taller than C. D is shorter than C but taller than E. Who is the second shortest?', ['D', 'E', 'C', 'B'], 'The order, tallest to shortest, is A > B > C > D > E. The shortest is E, so the second shortest is <b>D</b>.'),
    mc('sa-011', 3, 'ordering', 'Five boxes are stacked. The red box is above the blue box. The white box is between the red and blue boxes. The green box is below the blue box and the yellow box is below the green box. Which box is in the middle?', ['Blue', 'White', 'Green', 'Red'], 'Top to bottom: red, white, blue, green, yellow. The middle (third) box is <b>blue</b>.'),
    mc('sa-012', 2, 'rank', 'In a class of 45, Ajay is 17th from the top. Kunal is 5 places below Ajay. What is Kunal\'s rank from the bottom?', ['24th', '23rd', '25th', '22nd'], 'Kunal is 17 + 5 = 22nd from the top. From the bottom = 45 − 22 + 1 = <b>24th</b>.'),
    mc('sa-013', 1, 'queue', 'Riya is 11th from the front in a queue of 30 people. How many people stand behind her?', ['19', '20', '18', '21'], 'People in front: 10, Riya: 1, so behind her: 30 − 11 = <b>19</b>.'),
    mc('sa-014', 1, 'ordering', 'Who sits in seat 1 (the left end)?', ['Divya', 'Anil', 'Chetan', 'Eshan'], SOL('Eshan is in seat 3 and Anil in seat 2. Chetan must be at an end, and Bina is right of Eshan (seat 4 or 5). If Chetan took seat 1, Divya and Bina would take seats 4 and 5 and sit together, which is not allowed. So Chetan is in seat 5, Bina in 4 and Divya in 1.') + 'Seat 1 is <b>Divya</b>.', null, G('g1')),
    mc('sa-015', 2, 'ordering', 'Who sits between Anil and Bina?', ['Eshan', 'Divya', 'Chetan', 'Nobody'], SOL('Divya, Anil, Eshan, Bina, Chetan (seats 1 to 5).') + 'Between Anil (2) and Bina (4) is seat 3: <b>Eshan</b>.', null, G('g1')),
    mc('sa-016', 2, 'ordering', 'How many people sit to the right of Anil?', ['3', '2', '4', '1'], SOL('Divya, Anil, Eshan, Bina, Chetan (seats 1 to 5).') + 'To the right of seat 2: seats 3, 4, 5, that is <b>3</b> people.', null, G('g1')),
    mc('sa-017', 2, 'ordering', 'Who sits second from the right end?', ['Bina', 'Eshan', 'Chetan', 'Anil'], SOL('Divya, Anil, Eshan, Bina, Chetan (seats 1 to 5).') + 'Second from the right is seat 4: <b>Bina</b>.', null, G('g1')),
    mc('sa-018', 2, 'circle', 'Who sits opposite Gita?', ['Jaya', 'Karan', 'Harsh', 'Indu'], SOL('Number the seats clockwise from Farhan: Farhan 0, Gita 1 (immediately clockwise). Indu is opposite Farhan: seat 3. Harsh is between Gita and Indu: seat 2. Karan is next to Farhan: seat 5 (seat 1 is taken). Jaya takes seat 4.') + 'Opposite Gita (seat 1) is seat 4: <b>Jaya</b>.', null, G('g2')),
    mc('sa-019', 2, 'circle', 'Who sits immediately clockwise of Indu?', ['Jaya', 'Harsh', 'Karan', 'Farhan'], SOL('Clockwise from Farhan the order is Farhan, Gita, Harsh, Indu, Jaya, Karan.') + 'After Indu comes <b>Jaya</b>.', null, G('g2')),
    mc('sa-020', 3, 'circle', 'Who sits directly between Jaya and Farhan?', ['Karan', 'Indu', 'Gita', 'Harsh'], SOL('Clockwise from Farhan the order is Farhan, Gita, Harsh, Indu, Jaya, Karan.') + 'Going on from Jaya to Farhan we pass <b>Karan</b>.', null, G('g2')),
    mc('sa-021', 3, 'circle', 'Who sits opposite Karan?', ['Harsh', 'Gita', 'Indu', 'Jaya'], SOL('Clockwise from Farhan the order is Farhan (0), Gita (1), Harsh (2), Indu (3), Jaya (4), Karan (5).') + 'Opposite seat 5 is seat 2: <b>Harsh</b>.', null, G('g2')),
    mc('sa-022', 1, 'ordering', 'Who is the tallest?', ['Pooja', 'Neha', 'Lata', 'Omkar'], SOL('Pooja > Neha > Lata > Mohan > Omkar.') + 'The tallest is <b>Pooja</b>.', null, G('g3')),
    mc('sa-023', 1, 'ordering', 'Who is the shortest?', ['Omkar', 'Mohan', 'Lata', 'Neha'], SOL('Pooja > Neha > Lata > Mohan > Omkar.') + 'The shortest is <b>Omkar</b>.', null, G('g3')),
    mc('sa-024', 2, 'ordering', 'Who is the third tallest?', ['Lata', 'Neha', 'Mohan', 'Pooja'], SOL('Pooja > Neha > Lata > Mohan > Omkar.') + 'Third from the top is <b>Lata</b>.', null, G('g3')),
    mc('sa-025', 2, 'ordering', 'How many of the five friends are shorter than Lata?', ['2', '1', '3', '4'], SOL('Pooja > Neha > Lata > Mohan > Omkar.') + 'Shorter than Lata: Mohan and Omkar, so <b>2</b>.', null, G('g3')),
    mc('sa-026', 2, 'schedule', 'Which exam is held on Friday?', ['Biology', 'English', 'Maths', 'Physics'], SOL('Chemistry is on Wednesday, so English is on Thursday. History is on Saturday. Maths must come right after Physics, and only Monday-Tuesday fit (Friday would force Saturday). So Physics Monday, Maths Tuesday, Biology fills Friday.') + 'Friday is <b>Biology</b>.', null, G('g4')),
    mc('sa-027', 2, 'schedule', 'Which exam is held exactly two days before English?', ['Maths', 'Physics', 'Chemistry', 'Biology'], SOL('Mon Physics, Tue Maths, Wed Chemistry, Thu English, Fri Biology, Sat History.') + 'Two days before Thursday is Tuesday: <b>Maths</b>.', null, G('g4')),
    mc('sa-028', 2, 'schedule', 'Biology is held on the day right after which exam?', ['English', 'Chemistry', 'History', 'Maths'], SOL('Mon Physics, Tue Maths, Wed Chemistry, Thu English, Fri Biology, Sat History.') + 'The day before Friday is Thursday: <b>English</b>.', null, G('g4')),
    mc('sa-029', 1, 'schedule', 'How many exams are held before Chemistry?', ['2', '3', '1', '4'], SOL('Mon Physics, Tue Maths, Wed Chemistry, Thu English, Fri Biology, Sat History.') + 'Before Wednesday: Monday and Tuesday, so <b>2</b>.', null, G('g4')),
    mc('sa-030', 2, 'floors', 'Which office is on floor 4?', ['Shop', 'School', 'Library', 'Clinic'], SOL('Gym 6, Bank 1, Library 3 (two above the Bank), Clinic 2 (between Bank and Library). Floors 4 and 5 are left for the Shop and School, and the School is immediately above the Shop.') + 'Floor 4 is the <b>Shop</b>.', null, G('g5')),
    mc('sa-031', 3, 'floors', 'How many floors are between the Clinic and the School?', ['2', '1', '3', '4'], SOL('Bank 1, Clinic 2, Library 3, Shop 4, School 5, Gym 6.') + 'Between floor 2 and floor 5 are floors 3 and 4: <b>2</b> floors.', null, G('g5')),
    mc('sa-032', 2, 'floors', 'Which office is directly above the Library?', ['Shop', 'School', 'Clinic', 'Gym'], SOL('Bank 1, Clinic 2, Library 3, Shop 4, School 5, Gym 6.') + 'Directly above floor 3 is floor 4: <b>Shop</b>.', null, G('g5')),
    mc('sa-033', 2, 'two rows', 'Who sits opposite Chirag?', ['Farida', 'Gopal', 'Hema', 'Eklavya'], SOL('Row 1: Arjun 1, Bhavna 2, Chirag 3, Dolly 4. In row 2, Hema is seat 1 (opposite Arjun) and Eklavya seat 4 (opposite Dolly). Gopal is next to Hema: seat 2. Farida takes seat 3.') + 'Chirag (seat 3) faces <b>Farida</b>.', null, G('g6')),
    mc('sa-034', 2, 'two rows', 'Who sits opposite Bhavna?', ['Gopal', 'Farida', 'Hema', 'Eklavya'], SOL('Row 1: Arjun, Bhavna, Chirag, Dolly. Row 2: Hema, Gopal, Farida, Eklavya.') + 'Bhavna is in seat 2, opposite <b>Gopal</b>.', null, G('g6')),
    mc('sa-035', 3, 'two rows', 'Who sits between Gopal and Eklavya in row 2?', ['Farida', 'Hema', 'Nobody', 'Chirag'], SOL('Row 2 from west to east: Hema, Gopal, Farida, Eklavya.') + 'Between Gopal (2) and Eklavya (4) is <b>Farida</b>.', null, G('g6')),
    mc('sa-036', 3, 'circle', 'Who sits opposite Tara?', ['Yash', 'Zoya', 'Anita', 'Uday'], SOL('Number the seats clockwise from Sanjay (0). Tara 1, Waseem 4 (opposite Sanjay), Uday 2 (next to Tara; seat 0 is taken) and Vimala 3, Yash 5, Zoya 6 (next to Yash; seat 4 is taken), Anita 7.') + 'Opposite seat 1 is seat 5: <b>Yash</b>.', null, G('g7')),
    mc('sa-037', 2, 'circle', 'Who sits immediately anticlockwise of Sanjay?', ['Anita', 'Tara', 'Zoya', 'Uday'], SOL('Clockwise from Sanjay: Sanjay, Tara, Uday, Vimala, Waseem, Yash, Zoya, Anita.') + 'Anticlockwise of Sanjay is the last person in that list: <b>Anita</b>.', null, G('g7')),
    mc('sa-038', 3, 'circle', 'Who sits directly between Zoya and Sanjay?', ['Anita', 'Yash', 'Tara', 'Waseem'], SOL('Clockwise from Sanjay: Sanjay (0), Tara (1), Uday (2), Vimala (3), Waseem (4), Yash (5), Zoya (6), Anita (7).') + 'Going from Zoya (6) to Sanjay (0) we pass seat 7: <b>Anita</b>.', null, G('g7')),
    mc('sa-039', 3, 'circle', 'Who sits opposite Uday?', ['Zoya', 'Anita', 'Yash', 'Vimala'], SOL('Seats clockwise from Sanjay (0): Tara 1, Uday 2, Vimala 3, Waseem 4, Yash 5, Zoya 6, Anita 7.') + 'Opposite seat 2 is seat 6: <b>Zoya</b>.', null, G('g7')),
    mc('sa-040', 1, 'row', 'Which book is at the right end?', ['Hindi', 'Science', 'Maths', 'English'], SOL('History 1, Maths 3, English 2 (immediately left of Maths). Seats 4 and 5 are left for Science and Hindi, and Hindi is to the right of Science.') + 'The right end is <b>Hindi</b>.', null, G('g8')),
    mc('sa-041', 2, 'row', 'How many books are between History and Science?', ['2', '1', '3', '0'], SOL('History, English, Maths, Science, Hindi.') + 'History is 1 and Science is 4, so the books between are English and Maths: <b>2</b>.', null, G('g8')),
    mc('sa-042', 1, 'row', 'Which book is immediately to the right of Maths?', ['Science', 'Hindi', 'English', 'History'], SOL('History, English, Maths, Science, Hindi.') + 'Right of Maths is <b>Science</b>.', null, G('g8')),
    mc('sa-043', 1, 'ordering', 'Who is the oldest?', ['Vijay', 'Uma', 'Seema', 'Ravi'], SOL('Vijay > Uma > Seema > Ravi > Tarun.') + 'The oldest is <b>Vijay</b>.', null, G('g9')),
    mc('sa-044', 1, 'ordering', 'Who is the youngest?', ['Tarun', 'Ravi', 'Seema', 'Uma'], SOL('Vijay > Uma > Seema > Ravi > Tarun.') + 'The youngest is <b>Tarun</b>.', null, G('g9')),
    mc('sa-045', 2, 'ordering', 'Who is exactly in the middle by age?', ['Seema', 'Uma', 'Ravi', 'Vijay'], SOL('Vijay > Uma > Seema > Ravi > Tarun.') + 'The middle (third) one is <b>Seema</b>.', null, G('g9')),
  ],
  gens: [
    { id: 'sa-g01', type: 'mcq', level: 1, sub: 'row position', ...T,
      make(rng) {
        const m = int(rng, 5, 20), n = int(rng, 5, 20), tot = m + n - 1;
        const { options, answer } = shuffleOpts(rng, tot, [tot + 1, tot - 1, tot + 2]);
        return { q: `Deepa is ${m}th from the left end of a row and ${n}th from the right end. How many people are in the row?`, options, answer, m, n,
          sol: steps(`Deepa is counted in both numbers.`, `Total = ${m} + ${n} − 1 = <b>${tot}</b>.`), trap: 'Adding without subtracting 1 counts Deepa twice.' };
      },
      verify: (p) => p.options.indexOf(String(p.m + p.n - 1)) },
    { id: 'sa-g02', type: 'mcq', level: 2, sub: 'between', ...T,
      make(rng) {
        const N = int(rng, 30, 50), p = int(rng, 5, 15), q = int(rng, 5, 15), b = N - p - q;
        const { options, answer } = shuffleOpts(rng, b, [b + 1, b - 1, b + 2]);
        return { q: `In a row of ${N} people, Ajay is ${p}th from the left and Binu is ${q}th from the right (Ajay is to the left of Binu). How many people stand between them?`, options, answer, N, p, qq: q,
          sol: steps(`Binu is ${N} − ${q} + 1 = ${N - q + 1}th from the left.`, `Between positions ${p} and ${N - q + 1}: ${N - q + 1} − ${p} − 1 = <b>${b}</b>.`), trap: 'Remember that neither Ajay nor Binu is counted among the people between them.' };
      },
      verify: (p) => p.options.indexOf(String(p.N - p.p - p.qq)) },
    { id: 'sa-g03', type: 'mcq', level: 1, sub: 'rank', ...T,
      make(rng) {
        const N = int(rng, 30, 80), r = int(rng, 3, 25), bot = N - r + 1;
        const { options, answer } = shuffleOpts(rng, bot, [bot - 1, bot + 1, N - r - 1], (v) => `${v}`);
        return { q: `Karan ranks ${r}th from the top in a class of ${N}. What is his rank from the bottom?`, options, answer, N, r,
          sol: steps(`${r - 1} students are above him.`, `Rank from the bottom = ${N} − ${r} + 1 = <b>${bot}</b>.`), trap: `${N - r} is the number of students below him, not his rank.` };
      },
      verify: (p) => p.options.indexOf(String(p.N - p.r + 1)) },
    { id: 'sa-g04', type: 'mcq', level: 2, sub: 'circle', ...T,
      make(rng) {
        const n = choose(rng, [8, 10, 12, 14, 16]), s = int(rng, 1, n), opp = ((s - 1 + n / 2) % n) + 1;
        const { options, answer } = shuffleOpts(rng, opp, [opp + 1 > n ? 1 : opp + 1, opp - 1 < 1 ? n : opp - 1, s + 1 > n ? 1 : s + 1], (v) => `Person ${v}`);
        return { q: `${n} people are numbered 1 to ${n} and sit at equal gaps round a circular table, in order. Who sits opposite person ${s}?`, options, answer, n, s,
          sol: steps(`Opposite is halfway round: ${n} ÷ 2 = ${n / 2} places away.`, `${s} + ${n / 2}${s + n / 2 > n ? ` = ${s + n / 2}, and ${s + n / 2} − ${n} = ` : ' = '}<b>${opp}</b>.`), trap: 'If the sum goes past the last number, subtract the total number of people.' };
      },
      verify: (p) => p.options.indexOf(`Person ${((p.s + p.n / 2 - 1) % p.n) + 1}`) },
    { id: 'sa-g05', type: 'mcq', level: 3, sub: 'exchange', ...T,
      make(rng) {
        const a = int(rng, 3, 15), c = int(rng, 18, 30), b = int(rng, 8, 20), tot = c + b - 1;
        const { options, answer } = shuffleOpts(rng, tot, [a + b - 1, c + b, tot + 1]);
        return { q: `In a row, A is ${a}th from the left and B is ${b}th from the right. When they exchange places, A becomes ${c}th from the left. How many people are in the row?`, options, answer, c, b,
          sol: steps(`After the exchange A stands where B was, so B was ${c}th from the left.`, `B was also ${b}th from the right: total = ${c} + ${b} − 1 = <b>${tot}</b>.`), trap: `The first position of A (${a}th) is not needed.` };
      },
      verify: (p) => p.options.indexOf(String(p.c + p.b - 1)) },
  ],
};
