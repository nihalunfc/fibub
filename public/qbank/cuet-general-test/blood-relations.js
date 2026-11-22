// CUET General Test: blood relations. Original questions for fibub.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
const mc = (id, level, sub, q, opts, sol, trap, extra) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return { ...mcq(id, level, sub, q, o, k, sol, trap), ...(extra || {}) };
};
const G = (key) => ({ group: key, format: 'passage' });

export default {
  topic: 'blood-relations',
  groups: {
    g1: { title: 'A family of six', passage: '<p>Mohan is the husband of Sarla. Rajesh is the only son of Mohan and Sarla. Anita is the wife of Rajesh. Vikram is the son of Anita and Rajesh. Pooja is the daughter of Rajesh and Anita.</p>' },
    g2: { title: 'Two families joined by marriage', passage: '<p>Meera is the wife of Rohan. Rohan\'s only sister is Sana. Sana\'s husband is Imran. Imran\'s mother is Zainab.</p>' },
    g3: { title: 'Mother\'s side', passage: '<p>Kamal\'s mother is Latha. Latha\'s only brother is Mahesh. Mahesh\'s daughter is Neeta.</p>' },
  },
  items: [
    mc('br-001', 1, 'direct', 'Pointing to a man, Rahul says, "He is the son of my mother\'s only brother." How is the man related to Rahul?', ['Cousin', 'Brother', 'Nephew', 'Uncle'], 'Rahul\'s mother\'s brother is his maternal uncle. That uncle\'s son is Rahul\'s <b>cousin</b>.'),
    mc('br-002', 1, 'direct', 'How is the only son of Priya\'s mother\'s mother related to Priya?', ['Maternal uncle', 'Father', 'Brother', 'Grandfather'], 'Priya\'s mother\'s mother is her maternal grandmother. Her son is Priya\'s mother\'s brother, so he is Priya\'s <b>maternal uncle</b>.', 'The son of the grandmother is not the father: the father is on the other side of the family.'),
    mc('br-003', 2, 'chain', 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is E related to A?', ['Great-grandmother', 'Grandmother', 'Aunt', 'Mother'], 'A and B are siblings, so C is also A\'s mother. D is C\'s father, so D is A\'s grandfather. E is D\'s mother, so E is A\'s <b>great-grandmother</b> (one generation above the grandfather).'),
    mc('br-004', 2, 'direct', 'Pointing to a woman, Arun says, "She is the wife of my mother\'s only son." How is the woman related to Arun?', ['His wife', 'His sister-in-law', 'His sister', 'His mother'], 'Arun\'s mother\'s only son is Arun himself. The woman is Arun\'s <b>wife</b>.', 'Reading "mother\'s only son" as a brother is the usual slip; with only one son it has to be Arun.'),
    mc('br-005', 3, 'symbols', 'A × B means A is the mother of B; A + B means A is the brother of B; A − B means A is the father of B. In A × B + C − D, how is A related to D?', ['Grandmother', 'Mother', 'Aunt', 'Sister'], 'A is the mother of B. B is the brother of C, so A is also C\'s mother. C is the father of D, so A is D\'s father\'s mother: <b>grandmother</b>.'),
    mc('br-006', 2, 'chain', 'A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?', ['Uncle', 'Father', 'Brother', 'Grandfather'], 'A, B and C are brothers and sisters. C is D\'s father, so A is the brother of D\'s father: D\'s <b>uncle</b>.'),
    mc('br-007', 2, 'direct', 'Kiran, a man, points to a boy and says, "His mother is the only daughter of my mother." How is the boy related to Kiran?', ['Nephew', 'Son', 'Brother', 'Cousin'], 'Kiran\'s mother\'s only daughter is Kiran\'s sister (Kiran is a man, so it is not himself). The boy is her son: Kiran\'s <b>nephew</b>.'),
    mc('br-008', 2, 'direct', 'Pointing to a man, a woman says, "His mother is the only daughter of my mother." How is the man related to the woman?', ['Son', 'Brother', 'Nephew', 'Husband'], 'The woman\'s mother\'s only daughter is the woman herself. So the man\'s mother is the woman and he is her <b>son</b>.', 'Here the speaker is a woman, so "only daughter of my mother" points back to her.'),
    mc('br-009', 1, 'chain', 'Ravi\'s father is Suresh\'s son. How is Suresh related to Ravi?', ['Grandfather', 'Father', 'Uncle', 'Brother'], 'Suresh\'s son is Ravi\'s father, so Suresh is the father of Ravi\'s father: Ravi\'s <b>grandfather</b>.'),
    mc('br-010', 2, 'family', 'How is Sarla related to Vikram?', ['Grandmother', 'Mother', 'Aunt', 'Mother-in-law'], 'Sarla\'s only son is Rajesh. Vikram is Rajesh\'s son. So Sarla is Vikram\'s <b>grandmother</b>.', null, G('g1')),
    mc('br-011', 1, 'family', 'How is Pooja related to Anita?', ['Daughter', 'Sister', 'Niece', 'Daughter-in-law'], 'Pooja is the daughter of Rajesh and Anita, so Pooja is Anita\'s <b>daughter</b>.', null, G('g1')),
    mc('br-012', 1, 'family', 'How is Vikram related to Pooja?', ['Brother', 'Cousin', 'Husband', 'Uncle'], 'Both are children of Rajesh and Anita. Vikram is a son, so he is Pooja\'s <b>brother</b>.', null, G('g1')),
    mc('br-013', 2, 'family', 'How is Mohan related to Anita?', ['Father-in-law', 'Father', 'Uncle', 'Brother-in-law'], 'Anita is the wife of Rajesh, Mohan\'s son. A wife\'s husband\'s father is her <b>father-in-law</b>.', null, G('g1')),
    mc('br-014', 2, 'in-laws', 'How is Meera related to Sana?', ['Sister-in-law', 'Sister', 'Cousin', 'Daughter-in-law'], 'Meera is the wife of Sana\'s brother Rohan. A brother\'s wife is a <b>sister-in-law</b>.', null, G('g2')),
    mc('br-015', 2, 'in-laws', 'How is Imran related to Rohan?', ['Brother-in-law', 'Brother', 'Cousin', 'Father-in-law'], 'Imran is the husband of Rohan\'s sister Sana. A sister\'s husband is a <b>brother-in-law</b>.', null, G('g2')),
    mc('br-016', 2, 'in-laws', 'How is Zainab related to Sana?', ['Mother-in-law', 'Mother', 'Aunt', 'Grandmother'], 'Imran is Sana\'s husband and Zainab is Imran\'s mother, so Zainab is Sana\'s husband\'s mother: <b>mother-in-law</b>.', null, G('g2')),
    mc('br-017', 2, 'maternal side', 'How is Neeta related to Kamal?', ['Cousin', 'Sister', 'Niece', 'Aunt'], 'Mahesh is Kamal\'s mother\'s brother (maternal uncle). His daughter Neeta is Kamal\'s <b>cousin</b>.', null, G('g3')),
    mc('br-018', 1, 'maternal side', 'How is Mahesh related to Kamal?', ['Maternal uncle', 'Father', 'Brother', 'Grandfather'], 'Mahesh is the brother of Kamal\'s mother, so he is Kamal\'s <b>maternal uncle</b>.', null, G('g3')),
    mc('br-019', 3, 'maternal side', 'How is Latha related to Neeta?', ['Paternal aunt', 'Mother', 'Maternal aunt', 'Grandmother'], 'Latha is the sister of Mahesh, who is Neeta\'s father. A father\'s sister is a <b>paternal aunt</b>.', 'Maternal aunt is the mother\'s sister; here Latha is on Neeta\'s father\'s side.', G('g3')),
    mc('br-020', 2, 'direct', 'Rina\'s mother\'s brother\'s daughter is Tina. How is Tina related to Rina?', ['Cousin', 'Sister', 'Niece', 'Aunt'], 'Rina\'s mother\'s brother is her maternal uncle; his daughter is Rina\'s <b>cousin</b>.'),
    mc('br-021', 1, 'direct', 'How is your father\'s father\'s wife related to you?', ['Grandmother', 'Aunt', 'Mother', 'Great-grandmother'], 'Your father\'s father is your grandfather; his wife is your <b>grandmother</b>.'),
    mc('br-022', 1, 'direct', 'How is your mother\'s sister\'s husband related to you?', ['Uncle', 'Cousin', 'Brother-in-law', 'Grandfather'], 'Your mother\'s sister is your maternal aunt; her husband is your <b>uncle</b>.'),
    mc('br-023', 2, 'chain', 'A is B\'s brother. C is A\'s father. D is C\'s brother. E is D\'s son. How is E related to B?', ['Cousin', 'Brother', 'Nephew', 'Uncle'], 'C is the father of A and B. D is C\'s brother, so D is their uncle and his son E is their <b>cousin</b>.'),
    mc('br-024', 2, 'chain', 'X is the maternal uncle of Y. Y is the sister of Z. W is the mother of Z. How is X related to W?', ['Brother', 'Husband', 'Cousin', 'Father'], 'W is the mother of Z and so also of Y. X is Y\'s maternal uncle, that is, the brother of Y\'s mother W. So X is W\'s <b>brother</b>.'),
    mc('br-025', 3, 'symbols', 'P \\$ Q means P is the father of Q; P # Q means P is the sister of Q; P @ Q means P is the wife of Q. In A # B \\$ C @ D, how is A related to C?', ['Aunt', 'Mother', 'Sister', 'Grandmother'], 'A is the sister of B. B is the father of C. So A is the father\'s sister of C: <b>aunt</b> (paternal).'),
    mc('br-026', 3, 'symbols', 'A × B means A is the son of B; A ÷ B means A is the wife of B; A + B means B is the brother of A. In P × Q ÷ R + S, how is S related to P?', ['Uncle', 'Father', 'Brother', 'Grandfather'], 'P is the son of Q. Q is the wife of R, so R is P\'s father. In R + S, S is the brother of R. So S is P\'s father\'s brother: <b>uncle</b>.'),
    mc('br-027', 3, 'chain', 'A is the husband of B. C is B\'s brother. D is C\'s son. How is B related to D?', ['Aunt', 'Mother', 'Grandmother', 'Sister'], 'C is B\'s brother and D is C\'s son. So B is D\'s father\'s sister: <b>aunt</b>.'),
    mc('br-028', 3, 'direct', 'A\'s mother is the only daughter of B\'s mother, and B is a man. How is B related to A?', ['Maternal uncle', 'Father', 'Brother', 'Cousin'], 'B\'s mother\'s only daughter is B\'s sister (B is a man). She is A\'s mother. So B is A\'s mother\'s brother: <b>maternal uncle</b>.'),
    mc('br-029', 2, 'only', 'Who is your father\'s father\'s only son?', ['Your father', 'Your uncle', 'Your brother', 'Your grandfather'], 'Your father\'s father has just one son, and your father is a son of your grandfather. So he is your <b>father</b>.', 'Many pick "uncle", but "only son" leaves no room for an uncle on the father\'s side.'),
    mc('br-030', 2, 'direct', 'How is the sister of your father\'s brother\'s son related to you?', ['Cousin', 'Sister', 'Niece', 'Aunt'], 'Your father\'s brother\'s son is your cousin; his sister is also your father\'s brother\'s child, so your <b>cousin</b>.'),
    mc('br-031', 2, 'only', 'How is the husband of your mother\'s mother\'s only daughter related to you?', ['Father', 'Uncle', 'Maternal uncle', 'Grandfather'], 'Your mother\'s mother\'s only daughter is your mother. Her husband is your <b>father</b>.'),
    mc('br-032', 3, 'only', 'Naina is Hari\'s granddaughter. Hari has only one child, a son named Vijay. How is Vijay related to Naina?', ['Father', 'Uncle', 'Brother', 'Grandfather'], 'Hari\'s only child is Vijay, so any grandchild of Hari has to come through Vijay. Naina is therefore Vijay\'s child, and he is her <b>father</b>.'),
  ],
  gens: [
    { id: 'br-g01', type: 'mcq', level: 2, sub: 'counting', ...T,
      make(rng) {
        const s = int(rng, 2, 4), c = int(rng, 1, 3), total = 2 + 2 * s + s * c;
        const { options, answer } = shuffleOpts(rng, total, [total - 1, total - s, total + s]);
        return { q: `A man has ${s} sons. Each son is married and has ${c} child${c > 1 ? 'ren' : ''}. Counting the man, his wife, his sons, his daughters-in-law and his grandchildren, how many people are there in this family?`, options, answer, s, c,
          sol: steps(`The man and his wife: 2.`, `Sons: ${s}, and their wives: ${s}.`, `Grandchildren: ${s} × ${c} = ${s * c}.`, `Total: 2 + ${s} + ${s} + ${s * c} = <b>${total}</b>.`),
          trap: 'The usual slips are leaving out the man\'s wife or the daughters-in-law.' };
      },
      verify: (p) => p.options.indexOf(String(2 + p.s + p.s + p.s * p.c)) },
    { id: 'br-g02', type: 'mcq', level: 2, sub: 'counting', ...T,
      make(rng) {
        const name = choose(rng, ['Meena', 'Kavita', 'Sunita', 'Rekha', 'Divya', 'Nisha']), b = int(rng, 2, 5), s = int(rng, 1, 4);
        const ans = s + 1;
        const { options, answer } = shuffleOpts(rng, ans, [s, s + 2, b + 1]);
        return { q: `${name} has ${b} brothers and ${s} sister${s > 1 ? 's' : ''}. How many sisters does each of her brothers have?`, options, answer, s,
          sol: steps(`${name} and her ${s} sister${s > 1 ? 's' : ''} are all girls in the family: ${s} + 1 = <b>${ans}</b> girls.`, `Each brother has all of them as sisters.`),
          trap: `Forgetting ${name} herself gives ${s}.` };
      },
      verify: (p) => p.options.indexOf(String(p.s + 1)) },
    { id: 'br-g03', type: 'mcq', level: 2, sub: 'chain', ...T,
      make(rng) {
        const fem = ['Lata', 'Sunita', 'Radha', 'Kamla', 'Geeta', 'Usha'], mal = ['Arun', 'Vikas', 'Manoj', 'Raju', 'Deepak', 'Sanjay', 'Imran', 'Harish'];
        const f = choose(rng, fem), m1 = choose(rng, mal); let m2 = choose(rng, mal); if (m2 === m1) m2 = mal[(mal.indexOf(m1) + 1) % mal.length];
        let m3 = choose(rng, mal); while (m3 === m1 || m3 === m2) m3 = mal[(mal.indexOf(m3) + 1) % mal.length];
        const t = int(rng, 0, 1);
        const q = t === 0
          ? `${f} is the mother of ${m1}. ${m1} is the brother of ${m2}. ${m2} is the father of ${m3}. How is ${f} related to ${m3}?`
          : `${f} is the sister of ${m1}. ${m1} is the son of ${m2}. ${m2} is the husband of ${choose(rng, fem.filter((x) => x !== f))}. How is ${m2} related to ${f}?`;
        const right = t === 0 ? 'Grandmother' : 'Father';
        const { options, answer } = shuffleOpts(rng, right, t === 0 ? ['Mother', 'Aunt', 'Sister'] : ['Brother', 'Uncle', 'Grandfather'], (v) => v);
        return { q, options, answer, t,
          sol: t === 0
            ? steps(`${f} is the mother of ${m1}. As ${m1} and ${m2} are brothers, ${f} is also ${m2}'s mother.`, `${m2} is ${m3}'s father, so ${f} is ${m3}'s father's mother: <b>grandmother</b>.`)
            : steps(`${f} and ${m1} are brother and sister.`, `${m1} is the son of ${m2}, whose wife is the mother; so ${m2} is the father of ${m1} and of ${f}.`, `${m2} is ${f}'s <b>father</b>.`) };
      },
      verify: (p) => p.options.indexOf(p.t === 0 ? 'Grandmother' : 'Father') },
    { id: 'br-g04', type: 'mcq', level: 3, sub: 'direct', ...T,
      make(rng) {
        const mal = ['Arun', 'Vikas', 'Manoj', 'Raju', 'Deepak', 'Sanjay', 'Imran', 'Harish'], nm = choose(rng, mal), t = int(rng, 0, 3);
        const forms = [
          ['She is the daughter of my father\'s father\'s only son', 'Sister', ['Cousin', 'Aunt', 'Mother'], 'My father\'s father\'s only son is my father himself. His daughter is my sister (I am a man, so she is not me).'],
          ['She is the mother of my father\'s only son', 'Mother', ['Sister', 'Aunt', 'Wife'], 'My father\'s only son is me. So she is my mother.'],
          ['He is the only son of my mother\'s father', 'Maternal uncle', ['Father', 'Brother', 'Cousin'], 'My mother\'s father\'s only son is my mother\'s brother, my maternal uncle.'],
          ['He is the husband of my mother\'s only daughter', 'Brother-in-law', ['Brother', 'Uncle', 'Cousin'], 'My mother\'s only daughter is my sister (I am a man). Her husband is my brother-in-law.'],
        ];
        const [stmt, right, wrongs, why] = forms[t];
        const { options, answer } = shuffleOpts(rng, right, wrongs, (v) => v);
        return { q: `${nm}, a man, points to a ${t < 2 ? 'woman' : 'man'} and says, "${stmt}." How is the ${t < 2 ? 'woman' : 'man'} related to ${nm}?`, options, answer, t,
          sol: steps(why, `Answer: <b>${right}</b>.`), trap: 'Solve it one link at a time, from the last word back to the first.' };
      },
      verify: (p) => p.options.indexOf(['Sister', 'Mother', 'Maternal uncle', 'Brother-in-law'][p.t]) },
  ],
};
