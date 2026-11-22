// CUET General Test: coding and decoding. Original questions for fibub.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
const mc = (id, level, sub, q, opts, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
const L = (v) => String.fromCharCode(65 + (((v % 26) + 26) % 26));
const shift = (w, k) => [...w].map((c) => L(c.charCodeAt(0) - 65 + k)).join('');
const mirror = (w) => [...w].map((c) => L(25 - (c.charCodeAt(0) - 65))).join('');

export default {
  topic: 'coding-decoding',
  items: [
    mc('cd-001', 1, 'letter shift', 'In a code, MANGO is written as NBOHP. How is APPLE written in that code?', ['BQQMF', 'BQQLF', 'ZOOKD', 'BPQMF'], 'Each letter moves one step forward: M→N, A→B, N→O, G→H, O→P. So A→B, P→Q, P→Q, L→M, E→F: <b>BQQMF</b>.'),
    mc('cd-002', 1, 'positions', 'If BAD is coded as 7 (the sum of letter positions 2 + 1 + 4), what is the code for FACE?', ['15', '14', '16', '13'], 'F = 6, A = 1, C = 3, E = 5. Sum = 6 + 1 + 3 + 5 = <b>15</b>.'),
    mc('cd-003', 1, 'letter shift', 'In a code, ROSE is written as TQUG. How is LILY written?', ['NKNA', 'NKMA', 'MJMX', 'NKNZ'], 'Each letter moves 2 forward: R→T, O→Q, S→U, E→G. So L→N, I→K, L→N, Y→A (Z comes after Y, then it wraps to A): <b>NKNA</b>.', 'At the end of the alphabet remember to wrap round: Y + 2 = A.'),
    mc('cd-004', 1, 'reversal', 'If DELHI is coded as IHLED, how is AGRA coded?', ['ARGA', 'AGRA', 'ARAG', 'GARA'], 'The code writes the word backwards. AGRA backwards is A-R-G-A = <b>ARGA</b>.'),
    mc('cd-005', 2, 'opposite letters', 'In a code, CAT is written as XZG. How is DOG written?', ['WLT', 'EPH', 'WLS', 'VMT'], 'C(3)→X(24), A(1)→Z(26), T(20)→G(7): each letter is replaced by its mirror in the alphabet (the two positions add up to 27). D(4)→W(23), O(15)→L(12), G(7)→T(20): <b>WLT</b>.'),
    mc('cd-006', 2, 'word code', 'In a code, "red rose bloom" is written "pa lu ni", "rose garden" is "lu ze" and "bloom now" is "ni ho". What is the code for "red"?', ['pa', 'lu', 'ni', 'ze'], '"rose" is common to sentences 1 and 2, and "lu" is common to their codes, so rose = lu. "bloom" is common to 1 and 3, and "ni" is common, so bloom = ni. What is left in sentence 1 is red = <b>pa</b>.'),
    mc('cd-007', 3, 'symbol swap', 'If + means −, − means ×, × means ÷ and ÷ means +, find the value of 12 × 4 − 3 + 2 ÷ 1.', ['8', '6', '10', '12'], 'Swap the signs first: 12 ÷ 4 × 3 − 2 + 1. Then work left to right: 12 ÷ 4 = 3; 3 × 3 = 9; 9 − 2 = 7; 7 + 1 = <b>8</b>.', 'Calculating with the printed signs first gives a different number. Always swap before you calculate.'),
    mc('cd-008', 1, 'positions', 'If each letter is coded as double its position in the alphabet, how is BED written?', ['4 10 8', '2 5 4', '4 10 6', '3 10 8'], 'B = 2 → 4, E = 5 → 10, D = 4 → 8. So BED is <b>4 10 8</b>.'),
    mc('cd-009', 2, 'alternate shift', 'In a code, one letter is moved forward and the next backward by one step in turn, starting with forward. How is PLAN written?', ['QKBM', 'QMBK', 'OKBM', 'QLBN'], 'P+1 = Q, L−1 = K, A+1 = B, N−1 = M. So PLAN is <b>QKBM</b>.'),
    mc('cd-010', 1, 'decoding', 'If DOCTOR is coded as 4 15 3 20 15 18, what does 6 1 18 13 stand for?', ['FARM', 'FAIR', 'FIRM', 'FORM'], 'The numbers are positions in the alphabet: 6 = F, 1 = A, 18 = R, 13 = M. The word is <b>FARM</b>.'),
    mc('cd-011', 3, 'alternate shift', 'In a code, SCHOOL is written as TBINPK. How is STUDY written in that code?', ['TSVCZ', 'TUVEZ', 'RUTEX', 'TSVEZ'], 'Compare SCHOOL and TBINPK: S+1, C−1, H+1, O−1, O+1, L−1. The shifts alternate +1, −1. For STUDY: S+1 = T, T−1 = S, U+1 = V, D−1 = C, Y+1 = Z. The code is <b>TSVCZ</b>.', 'Using +1 for every letter (TUVEZ) ignores the alternation you can see in SCHOOL.'),
    mc('cd-012', 1, 'word swap', 'In a certain code, apple is called orange, orange is called banana, banana is called grape and grape is called mango. Which fruit will a monkey like best, as named in this code?', ['Grape', 'Banana', 'Orange', 'Mango'], 'A monkey likes bananas. In the code, "banana" is called <b>grape</b>.'),
    mc('cd-013', 2, 'operation rule', 'If 2 # 3 = 13 and 3 # 4 = 25, then 4 # 5 = ?', ['41', '29', '40', '45'], '2² + 3² = 4 + 9 = 13 and 3² + 4² = 9 + 16 = 25, so a # b = a² + b². Then 4 # 5 = 16 + 25 = <b>41</b>.'),
    mc('cd-014', 2, 'operation rule', 'If a ★ b means (a + b)² − ab, find 4 ★ 3.', ['37', '49', '25', '35'], '(4 + 3)² − 4 × 3 = 49 − 12 = <b>37</b>.', 'Stopping at (a + b)² = 49 forgets the − ab part.'),
    mc('cd-015', 2, 'decoding', 'In a code each letter is moved two places forward. The code for a word is EJCKT. What is the word?', ['CHAIR', 'CHAIN', 'CHAMP', 'CHAIL'], 'To decode, move each letter two places back: E→C, J→H, C→A, K→I, T→R. The word is <b>CHAIR</b>.', 'Decode in the opposite direction to the one used for coding.'),
    mc('cd-016', 2, 'alphabet', 'In the English alphabet, which letter is 8th to the left of the 10th letter from the right?', ['I', 'J', 'H', 'G'], 'The 10th from the right is the (27 − 10) = 17th letter from the left, Q. Eight places to its left is the 17 − 8 = 9th letter, <b>I</b>.', 'Counting the 10th letter from the left (J) is the usual slip.'),
    mc('cd-017', 3, 'symbol swap', 'If P means +, Q means −, R means × and S means ÷, find the value of 24 S 6 R 2 P 5 Q 3.', ['10', '8', '14', '12'], 'Translate: 24 ÷ 6 × 2 + 5 − 3. Left to right for × and ÷: 24 ÷ 6 = 4, 4 × 2 = 8. Then 8 + 5 − 3 = <b>10</b>.'),
    mc('cd-018', 2, 'positions', 'Using A = 1, B = 2, ..., Z = 26, what is the value of DOG − CAT, where each word means the sum of its letter values?', ['2', '3', '1', '4'], 'DOG = 4 + 15 + 7 = 26. CAT = 3 + 1 + 20 = 24. 26 − 24 = <b>2</b>.'),
    mc('cd-019', 2, 'word code', 'In a code, "dog barks loud" is "ma ke po", "loud music" is "po ti" and "dog music" is "ma ti". What is the code for "barks"?', ['ke', 'ma', 'po', 'ti'], '"loud" is in sentences 1 and 2, and "po" is in both codes, so loud = po. "dog" is in 1 and 3, and "ma" is common, so dog = ma. Then music = ti and what remains of sentence 1 is barks = <b>ke</b>.'),
    mc('cd-020', 2, 'word code', 'In a code, "sweet red apple" is "ra lo si", "red hot tea" is "lo di vu" and "hot sweet" is "di ra". What is the code for "apple"?', ['si', 'ra', 'lo', 'di'], 'Common words give common codes. sweet appears in sentences 1 and 3: ra. red appears in 1 and 2: lo. So in sentence 1 the remaining word apple has the remaining code <b>si</b>.'),
    mc('cd-021', 2, 'letter shift', 'In a code, RAM is written as QZL. How is SITA written?', ['RHSZ', 'TJUB', 'RHSB', 'QGRZ'], 'Each letter moves one step back: R→Q, A→Z, M→L. So S→R, I→H, T→S, A→Z: <b>RHSZ</b>.'),
    mc('cd-022', 2, 'positions', 'If A = 26, B = 25, C = 24 and so on until Z = 1, what is the sum of the values of the letters in CAB?', ['75', '6', '72', '78'], 'C = 24, A = 26, B = 25. Sum = 24 + 26 + 25 = <b>75</b>.', 'Using normal positions (3 + 1 + 2 = 6) ignores the reversed values.'),
    mc('cd-023', 2, 'letter shift', 'In a code, FRIEND is written as GSJFOE. How is STREAM written?', ['TUSFBN', 'RSQDZL', 'TUSFBM', 'UVTGCO'], 'F→G, R→S, I→J, E→F, N→O, D→E: every letter moves one step forward. S→T, T→U, R→S, E→F, A→B, M→N: <b>TUSFBN</b>.'),
    mc('cd-024', 3, 'opposite letters', 'In a code, BLUE is written as YOFV. How is PINK written?', ['KRMP', 'QJOL', 'KRNP', 'LRMP'], 'B(2)→Y(25), L(12)→O(15), U(21)→F(6), E(5)→V(22): each letter is replaced by the letter that is its mirror in the alphabet (positions add to 27). P(16)→K(11), I(9)→R(18), N(14)→M(13), K(11)→P(16): <b>KRMP</b>.'),
    mc('cd-025', 3, 'vowel rule', 'In a code, KITE is written as KJTF. How is PIANO written?', ['PJBNP', 'QJBOP', 'PJBNO', 'PHZNN'], 'In KITE only the vowels change: I→J and E→F, each one step forward. Consonants stay as they are. In PIANO the vowels I, A, O become J, B, P: <b>PJBNP</b>.'),
    mc('cd-026', 3, 'positions', 'Each letter has a fixed value, and a word\'s code is the total of its letters\' values. If EAT is coded as 26, how is TEA coded?', ['26', '62', '52', '20'], 'TEA has the same letters as EAT, only in a different order. A total does not depend on order, so the code is again <b>26</b>.', 'Do not look for a new rule when the letters are the same: a sum ignores order.'),
    mc('cd-027', 2, 'letter shift', 'In a code, DAY is written as EBZ. How is NIGHT written?', ['OJHIU', 'MHFGS', 'OJHIT', 'OKHIU'], 'Each letter moves one step forward. N→O, I→J, G→H, H→I, T→U: <b>OJHIU</b>.'),
    mc('cd-028', 2, 'letter shift', 'In a code, JAIPUR is written as MDLSXU. How is AGRA written?', ['DJUD', 'XDOX', 'EKVE', 'DJTD'], 'J→M, A→D, I→L, P→S, U→X, R→U: each letter moves 3 forward. A→D, G→J, R→U, A→D: <b>DJUD</b>.'),
    mc('cd-029', 3, 'symbol swap', 'If ÷ means +, + means −, − means × and × means ÷, find the value of 18 × 3 − 4 + 6 ÷ 2.', ['20', '18', '22', '14'], 'Swap signs: 18 ÷ 3 × 4 − 6 + 2. 18 ÷ 3 = 6; 6 × 4 = 24; 24 − 6 = 18; 18 + 2 = <b>20</b>.'),
    mc('cd-030', 3, 'operation rule', 'If a ∗ b means 2a + b, what is 4 ∗ (3 ∗ 2)?', ['16', '14', '18', '20'], 'Work out the bracket first: 3 ∗ 2 = 2×3 + 2 = 8. Then 4 ∗ 8 = 2×4 + 8 = <b>16</b>.'),
    mc('cd-031', 1, 'alphabet', 'Which letter is 6th to the right of the 12th letter from the left in the English alphabet?', ['R', 'Q', 'S', 'P'], 'The 12th letter is L. Six places to the right is the 12 + 6 = 18th letter, <b>R</b>.'),
  ],
  gens: [
    { id: 'cd-g01', type: 'mcq', level: 2, sub: 'letter shift', ...T,
      make(rng) {
        const words = ['PLANT', 'RIVER', 'TIGER', 'LOTUS', 'MANGO', 'CLOCK', 'TABLE', 'BRAIN', 'SMILE', 'TRAIN', 'WATER', 'HOUSE'];
        const w1 = choose(rng, words); let w2 = choose(rng, words); if (w2 === w1) w2 = words[(words.indexOf(w1) + 1) % words.length];
        const k = int(rng, 1, 4), dir = rng() < 0.5 ? 1 : -1, s = dir * k;
        const { options, answer } = shuffleOpts(rng, shift(w2, s), [shift(w2, s + 1), shift(w2, s - 1), shift(w2, -s)]);
        return { q: `In a code, ${w1} is written as ${shift(w1, s)}. How is ${w2} written in that code?`, options, answer, w2, s,
          sol: steps(`Compare ${w1[0]} with ${shift(w1, s)[0]}: the letter moves ${k} place${k > 1 ? 's' : ''} ${dir > 0 ? 'forward' : 'backward'}. Check the other letters: same shift.`, `Apply it to ${w2}: <b>${shift(w2, s)}</b>.`),
          trap: 'Going the opposite way, or by one place more or less, gives the other options.' };
      },
      verify: (p) => p.options.indexOf([...p.w2].map((c) => String.fromCharCode(65 + (((c.charCodeAt(0) - 65 + p.s) % 26) + 26) % 26)).join('')) },
    { id: 'cd-g02', type: 'mcq', level: 1, sub: 'positions', ...T,
      make(rng) {
        const words = ['BAG', 'CAB', 'HEN', 'FAN', 'JUG', 'KEY', 'MAP', 'OWL', 'RAT', 'SUN', 'TEA', 'ZOO', 'BOX', 'DOG', 'FOX'];
        const w = choose(rng, words), val = [...w].reduce((t, c) => t + c.charCodeAt(0) - 64, 0);
        const { options, answer } = shuffleOpts(rng, val, [val + 1, val - 1, val + 10]);
        return { q: `If A = 1, B = 2, ..., Z = 26, what is the sum of the letter values in the word ${w}?`, options, answer, w,
          sol: steps([...w].map((c) => `${c} = ${c.charCodeAt(0) - 64}`).join(', ') + '.', `Add them: <b>${val}</b>.`),
          trap: 'Count the position of each letter carefully: J, K, L, M, N are 10 to 14; the second half of the alphabet is easy to miscount.' };
      },
      verify: (p) => p.options.indexOf(String([...p.w].reduce((t, c) => t + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) + 1, 0))) },
    { id: 'cd-g03', type: 'mcq', level: 2, sub: 'alphabet', ...T,
      make(rng) {
        const p = int(rng, 3, 12), c = 27 - p;
        const { options, answer } = shuffleOpts(rng, c, [p, c + 1, c - 1], (v) => L(v - 1));
        const ord = (n) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;
        return { q: `Which letter is the ${ord(p)} from the right end of the English alphabet?`, options, answer, p,
          sol: steps(`From the right, the ${ord(p)} letter is number 27 − ${p} = ${c} from the left.`, `Letter ${c} is <b>${L(c - 1)}</b>.`),
          trap: `Counting from the left end (letter ${p}, ${L(p - 1)}) is the usual slip.` };
      },
      verify: (p) => p.options.indexOf('ZYXWVUTSRQPONMLKJIHGFEDCBA'[p.p - 1]) },
    { id: 'cd-g04', type: 'mcq', level: 3, sub: 'symbol swap', ...T,
      make(rng) {
        const a = int(rng, 4, 12), b = int(rng, 2, 9), c = int(rng, 2, 9);
        const forms = [
          { say: 'If + means × and × means −', expr: `${a} + ${b} × ${c}`, sw: `${a} × ${b} − ${c}`, val: a * b - c, face: a + b * c },
          { say: 'If + means − and − means +', expr: `${a} + ${b} − ${c}`, sw: `${a} − ${b} + ${c}`, val: a - b + c, face: a + b - c },
          { say: 'If × means − and − means ×', expr: `${a * 5} × ${b} − ${c}`, sw: `${a * 5} − ${b} × ${c}`, val: a * 5 - b * c, face: a * 5 * b - c },
        ];
        const f = choose(rng, forms);
        const { options, answer } = shuffleOpts(rng, f.val, [f.face, f.val + 2, f.val - 2]);
        return { q: `${f.say}, find the value of ${f.expr}.`, options, answer, val: f.val, nums: [a, b, c], f: forms.indexOf(f),
          sol: steps('Swap the signs as the question says, then calculate.', `${f.expr} becomes ${f.sw}, which is <b>${f.val}</b> (multiply before you add or subtract).`),
          trap: `Using the printed signs gives ${f.face}.` };
      },
      verify: (p) => { const [a, b, c] = p.nums; const v = [a * b - c, a - b + c, a * 5 - b * c][p.f]; return p.options.indexOf(String(v)); } },
    { id: 'cd-g05', type: 'mcq', level: 3, sub: 'opposite letters', ...T,
      make(rng) {
        const ws = ['DOG', 'CAT', 'SUN', 'MOON', 'BOOK', 'LAMP', 'FISH', 'RAIN', 'TREE', 'BIRD'];
        let w1 = choose(rng, ws), w2 = choose(rng, ws); if (w1 === w2) w2 = ws[(ws.indexOf(w1) + 1) % ws.length];
        const m = mirror(w2), bump = (s, i, d) => s.slice(0, i) + L(s.charCodeAt(i) - 65 + d) + s.slice(i + 1);
        const { options, answer } = shuffleOpts(rng, m, [bump(m, 0, 1), bump(m, m.length - 1, -1), [...m].reverse().join('')]);
        return { q: `In a code, ${w1} is written as ${mirror(w1)}. How is ${w2} written?`, options, answer, w2,
          sol: steps(`${w1[0]} (${w1.charCodeAt(0) - 64}) becomes ${mirror(w1)[0]} (${mirror(w1).charCodeAt(0) - 64}): the two positions add up to 27, so every letter is swapped with its mirror letter (A↔Z, B↔Y, C↔X ...).`, `For ${w2}: <b>${m}</b>.`) };
      },
      verify: (p) => p.options.indexOf([...p.w2].map((c) => 'ZYXWVUTSRQPONMLKJIHGFEDCBA'['ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c)]).join('')) },
  ],
};
