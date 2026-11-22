// LSAT · Logical Reasoning · conditional logic drills: if, only if, unless, contrapositives and chains.
// Templated so every seed gives a new pair of everyday statements (all original, fibub).
import { int, choose, sample, shuffle5, cap } from './_util.js';
const F = { section: 'lr' };

// Each statement with its natural negation.
const S = [
  ['the library is open', 'the library is not open'], ['Priya joins the debate team', 'Priya does not join the debate team'],
  ['the bridge is repaired', 'the bridge is not repaired'], ['the council approves the park', 'the council does not approve the park'],
  ['the shipment arrives on Monday', 'the shipment does not arrive on Monday'], ['Omar takes the train', 'Omar does not take the train'],
  ['the orchestra performs the symphony', 'the orchestra does not perform the symphony'], ['the store offers a discount', 'the store does not offer a discount'],
  ['the river floods', 'the river does not flood'], ['the senator votes for the bill', 'the senator does not vote for the bill'],
  ['the lab receives funding', 'the lab does not receive funding'], ['the festival is held outdoors', 'the festival is not held outdoors'],
  ['Lena is promoted', 'Lena is not promoted'], ['the museum extends its hours', 'the museum does not extend its hours'],
  ['the contract is signed', 'the contract is not signed'], ['the school adds a robotics class', 'the school does not add a robotics class'],
  ['the trial is delayed', 'the trial is not delayed'], ['the farm grows barley', 'the farm does not grow barley'],
  ['the mayor attends the opening', 'the mayor does not attend the opening'], ['the software update is released', 'the software update is not released'],
  ['the restaurant hires a new chef', 'the restaurant does not hire a new chef'], ['the witness testifies', 'the witness does not testify'],
  ['the hospital opens a new wing', 'the hospital does not open a new wing'], ['the team wins the semifinal', 'the team does not win the semifinal'],
  ['the tenants renew the lease', 'the tenants do not renew the lease'], ['the airport adds a night flight', 'the airport does not add a night flight'],
  ['the novel is translated', 'the novel is not translated'], ['the factory reduces its emissions', 'the factory does not reduce its emissions'],
  ['Kofi studies law', 'Kofi does not study law'], ['the garden is watered', 'the garden is not watered'],
];
const IF = (a, b) => `If ${a}, then ${b}.`;

// Ways to say "P → Q" in English.
const FORMS = [
  (P, Q) => `If ${P[0]}, then ${Q[0]}.`,
  (P, Q) => `${cap(P[0])} only if ${Q[0]}.`,
  (P, Q) => `${cap(Q[0])} if ${P[0]}.`,
  (P, Q) => `Unless ${Q[0]}, ${P[1]}.`,
  (P, Q) => `Whenever ${P[0]}, ${Q[0]}.`,
  (P, Q) => `Only if ${Q[0]} will it be the case that ${P[0]}.`,
];
const FORM_NOTE = [
  '"If P, then Q" is already in standard form.',
  '"P only if Q" means Q is necessary for P: if P, then Q. "Only if" introduces the necessary condition.',
  '"Q if P" means if P, then Q. Plain "if" introduces the sufficient condition, wherever it sits in the sentence.',
  '"Unless Q, not P" means: if not Q, then not P, which is the same as if P, then Q. A quick rule: "unless" means "if not".',
  '"Whenever P, Q" means every time P happens, Q happens: if P, then Q.',
  '"Only if Q, P" puts the necessary condition first: Q must happen for P to happen, so if P, then Q.',
];

export default {
  topic: 'conditional-logic',
  gens: [
    { id: 'lsat-cl-g01', type: 'mcq', marks: 1, level: 2, exams: ['lsat'], sub: 'contrapositive', facets: { ...F, qtype: 'must-be-true' }, format: 'single',
      make(r) {
        const [P, Q] = sample(r, S, 2), k = int(r, 0, FORMS.length - 1);
        const right = IF(Q[1], P[1]);
        const o = shuffle5(r, right, [IF(Q[0], P[0]), IF(P[1], Q[1]), IF(P[1], Q[0]), IF(Q[1], P[0]), IF(P[0], Q[1])]);
        return { q: `<p>${FORMS[k](P, Q)}</p><p>If the statement above is true, which one of the following must also be true?</p>`, ...o,
          sol: `<p>${FORM_NOTE[k]} So the rule is: ${P[0]} → ${Q[0]}.</p><p>The only statement that always follows is the <b>contrapositive</b>: reverse the order and negate both parts. ${cap(Q[1])} → ${P[1]}.</p><p>The <i>converse</i> (if ${Q[0]}, then ${P[0]}) and the <i>inverse</i> (if ${P[1]}, then ${Q[1]}) are the two classic traps: neither has to be true.</p>`,
          trap: 'Choosing the converse (just reversing) or the inverse (just negating).' };
      } },
    { id: 'lsat-cl-g02', type: 'mcq', marks: 1, level: 2, exams: ['lsat'], sub: 'what follows from a fact', facets: { ...F, qtype: 'must-be-true' }, format: 'single',
      make(r) {
        const [P, Q] = sample(r, S, 2), k = int(r, 0, FORMS.length - 1), fact = choose(r, ['P', 'notQ', 'Q', 'notP']);
        const given = { P: P[0], notQ: Q[1], Q: Q[0], notP: P[1] }[fact];
        const nothing = 'Nothing more can be concluded about either statement.';
        const right = fact === 'P' ? cap(Q[0]) + '.' : fact === 'notQ' ? cap(P[1]) + '.' : nothing;
        const o = shuffle5(r, right, [cap(Q[0]) + '.', cap(P[1]) + '.', cap(P[0]) + '.', cap(Q[1]) + '.', nothing]);
        return { q: `<p>${FORMS[k](P, Q)} In fact, ${given}.</p><p>Which one of the following must be true?</p>`, ...o,
          sol: `<p>${FORM_NOTE[k]} The rule is ${P[0]} → ${Q[0]}.</p><p>${fact === 'P' ? `The sufficient condition happened, so the necessary one must too: <b>${Q[0]}</b>.`
            : fact === 'notQ' ? `The necessary condition failed, so the sufficient one cannot have happened (the contrapositive): <b>${P[1]}</b>.`
              : fact === 'Q' ? `Knowing the necessary condition happened tells us nothing about the sufficient one. Concluding "${P[0]}" would be the converse error. <b>Nothing follows.</b>`
                : `Knowing the sufficient condition did not happen tells us nothing about the necessary one. Concluding "${Q[1]}" would be the inverse error. <b>Nothing follows.</b>`}</p>`,
          trap: 'Affirming the necessary condition or denying the sufficient one, and thinking something follows.' };
      } },
    { id: 'lsat-cl-g03', type: 'mcq', marks: 1, level: 3, exams: ['lsat'], sub: 'chains', facets: { ...F, qtype: 'must-be-true' }, format: 'single',
      make(r) {
        const [A, B, C] = sample(r, S, 3), fact = choose(r, ['A', 'notC']);
        const right = fact === 'A' ? cap(C[0]) + '.' : cap(A[1]) + '.';
        const o = shuffle5(r, right, [cap(C[0]) + '.', cap(A[1]) + '.', cap(A[0]) + '.', cap(C[1]) + '.', cap(B[1]) + '.', cap(B[0]) + '.']);
        return { q: `<p>If ${A[0]}, then ${B[0]}. Also, ${B[0]} only if ${C[0]}. As it turns out, ${fact === 'A' ? A[0] : C[1]}.</p><p>Which one of the following must be true?</p>`, ...o,
          sol: `<p>Link the rules into a chain: ${A[0]} → ${B[0]} → ${C[0]}.</p><p>${fact === 'A' ? `Starting at the front, every link fires: ${A[0]}, so ${B[0]}, so <b>${C[0]}</b>.` : `Starting from the end with a "no": ${C[1]}, so ${B[1]}, so <b>${A[1]}</b> (the contrapositive of the whole chain).`}</p>`,
          trap: 'Running the chain backwards from a "yes" at the end.' };
      } },
    { id: 'lsat-cl-g04', type: 'mcq', marks: 1, level: 3, exams: ['lsat'], sub: 'translate', facets: { ...F, qtype: 'conditional' }, format: 'single',
      make(r) {
        const [P, Q] = sample(r, S, 2), k = int(r, 1, FORMS.length - 1);
        const right = IF(P[0], Q[0]);
        const o = shuffle5(r, right, [IF(Q[0], P[0]), IF(P[1], Q[1]), IF(Q[1], P[0]), IF(P[0], Q[1]), IF(P[1], Q[0])]);
        return { q: `<p>${FORMS[k](P, Q)}</p><p>Which one of the following expresses the same rule?</p>`, ...o,
          sol: `<p>${FORM_NOTE[k]}</p><p>So the rule is <b>${right}</b> (Its contrapositive, "${IF(Q[1], P[1])}", says the same thing, but it is not among the options in that form.)</p>` };
      } },
  ],
  items: [],
};
