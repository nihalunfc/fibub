// Exam patterns for the entrance courses, as published for the 2025-26 cycle (checked 2026-11-22; see the
// sources in lesson 1.1 of each course). Patterns change: the lessons tell students to check the official site.
// q: questions per subject; plus/minus: marks for a right and a wrong answer; min: minutes for the whole paper.
export const PATTERNS = {
  'jee-main': { name: 'JEE Main', q: { Physics: 25, Chemistry: 25, Maths: 25 }, plus: 4, minus: 1, min: 180, note: 'Per subject: 20 single-answer MCQs and 5 numerical answers, all compulsory; numerical answers also lose 1 mark when wrong.' },
  'jee-adv': { name: 'JEE Advanced', q: { Physics: 32, Chemistry: 32, Maths: 32 }, plus: 4, minus: 1, min: 360, note: 'Two compulsory 3-hour papers; the number of questions, the formats and the marks change every year (single answer, one-or-more correct with partial marks, integer, decimal, matching). The counts shown are a typical year across both papers.' },
  keam: { name: 'KEAM', q: { Physics: 45, Chemistry: 30, Maths: 75 }, plus: 4, minus: 1, min: 180, note: 'One computer-based paper of 150 MCQs; Maths carries half the marks.' },
  cusat: { name: 'CUSAT CAT', q: { Physics: 75, Chemistry: 60, Maths: 90 }, plus: 3, minus: 1, min: 180, note: '225 MCQs in 3 hours: under a minute per question, so speed matters most.' },
  comedk: { name: 'COMEDK UGET', q: { Physics: 60, Chemistry: 60, Maths: 60 }, plus: 1, minus: 0, min: 180, note: '180 MCQs, one mark each and no negative marks: never leave a question blank.' },
  neet: { name: 'NEET UG', q: { Physics: 45, Chemistry: 45, Botany: 45, Zoology: 45 }, plus: 4, minus: 1, min: 180, note: '180 compulsory MCQs; Biology (Botany + Zoology) is half the paper.' },
};
/** Net score: right answers, wrong answers, with a pattern's marking. */
export const score = (p, right, wrong) => right * p.plus - wrong * p.minus;
/** Expected marks from a blind guess among `left` options that remain after crossing some out. */
export const guessValue = (p, left) => p.plus / left - p.minus * (left - 1) / left;
