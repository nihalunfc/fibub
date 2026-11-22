// LSAT · Logical Reasoning · quantifier drills: all, most, some, none. Templated with everyday groups (original, fibub).
import { sample, choose, shuffle5 } from './_util.js';
const F = { section: 'lr', qtype: 'must-be-true' };
const G = ['students in the art class', 'people who play chess', 'residents of Elm Street', 'people who own bicycles', 'employees of the bakery', 'people who speak French',
  'members of the book club', 'volunteers at the animal shelter', 'runners in the marathon', 'people who grow tomatoes', 'guests at the reunion', 'people who drink coffee',
  'nurses at the clinic', 'people who sing in a choir', 'engineers at the firm', 'people who swim every week', 'players on the soccer team', 'people who collect stamps'];
const all = (a, b) => `All ${a} are ${b}.`, some = (a, b) => `Some ${a} are ${b}.`, most = (a, b) => `Most ${a} are ${b}.`, none = (a, b) => `No ${a} are ${b}.`;

const PAT = [
  { p: (A, B, C) => [all(A, B), all(B, C)], c: (A, B, C) => all(A, C), w: (A, B, C) => [all(C, A), all(B, A), none(A, C), all(C, B), most(C, A)],
    why: 'All A are B and all B are C link into a chain, A → B → C, so all A are C. The chain only runs forward: nothing says every C is an A.' },
  { p: (A, B) => [some(A, B)], c: (A, B) => some(B, A), w: (A, B, C) => [all(A, B), all(B, A), most(B, A), most(A, B), none(A, C)],
    why: '"Some" works both ways: if some A are B, there is at least one thing that is both, so some B are A. It says nothing about all or most.' },
  { p: (A, B, C) => [all(A, B), some(C, A)], c: (A, B, C) => some(C, B), w: (A, B, C) => [all(C, B), most(C, B), all(B, C), all(B, A), none(C, B)],
    why: 'The C that are A are also B (every A is a B), so at least some C are B. We cannot say all or most, because the "some" may be only a few.' },
  { p: (A, B, C) => [most(A, B), most(A, C)], c: (A, B, C) => some(B, C), w: (A, B, C) => [most(B, C), all(B, C), most(C, B), all(A, C), none(B, C)],
    why: 'Two "mosts" about the same group must overlap: more than half of the A are B and more than half are C, so at least one A is both, and some B are C. This is the one way two "mosts" give a conclusion.' },
  { p: (A, B, C) => [all(A, B), none(B, C)], c: (A, B, C) => none(A, C), w: (A, B, C) => [none(A, B), some(A, C), all(C, A), most(C, A), all(C, B)],
    why: 'Every A is inside the B group, and no B is a C, so no A can be a C.' },
  { p: (A, B, C) => [most(A, B), all(B, C)], c: (A, B, C) => most(A, C), w: (A, B, C) => [all(A, C), most(C, A), most(C, B), all(C, B), all(A, B)],
    why: 'The A that are B (more than half of them) are all C, so more than half of the A are C: most A are C.' },
];

export default {
  topic: 'quantifiers',
  gens: [
    { id: 'lsat-qt-g01', type: 'mcq', marks: 1, level: 3, exams: ['lsat'], sub: 'all, most, some, none', facets: F, format: 'single',
      make(r) {
        const [A, B, C] = sample(r, G, 3), pat = choose(r, PAT);
        const prem = pat.p(A, B, C), right = pat.c(A, B, C);
        const o = shuffle5(r, right, pat.w(A, B, C));
        return { q: `<p>${prem.join(' ')}</p><p>If the statements above are true, which one of the following must also be true?</p>`, ...o,
          sol: `<p>${pat.why}</p><p>Answer: <b>${right}</b> Each other option could be false while the statements are true.</p>`,
          trap: 'Treating "some" or "most" as if it were "all", or reversing an "all" statement.' };
      } },
  ],
  items: [
    { id: 'lsat-qt-001', type: 'mcq', marks: 1, level: 2, exams: ['lsat'], sub: 'some and some', facets: F,
      q: '<p>Some architects are painters. Some painters are sculptors.</p><p>If the statements above are true, which one of the following must also be true?</p>',
      options: ['None of these must be true: some architects might or might not be sculptors.', 'Some architects are sculptors.', 'Some sculptors are architects.', 'No architects are sculptors.', 'Most painters are architects.'], answer: 0,
      sol: '<p>Two "some" statements never combine. The architects who paint might be completely different painters from the ones who sculpt. So nothing follows about architects and sculptors.</p>' },
  ],
};
