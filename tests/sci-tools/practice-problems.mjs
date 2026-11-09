// #825 Practice problems. Every topic's answer formula and rounding were checked against an independent Python
// script (plain formulas, numpy mean/std(ddof=1), decimal.Decimal half-up rounding to significant figures or
// decimal places) on 10,400 generated problems (400 seeds × 26 problems over all 13 topics), which also checked that
// every given value appears in the question text: 0 differences. Molar masses were checked against standard atomic
// weights. These tests pin the rules, the seed and the answer reader.
import { makeSet, setCode, parseCode, readAnswer, checkAnswer, fmtSF, fmtDP, roundSF, roundDP, sfOfFixed, pdfPlain, TOPICS, TOPIC_IDS, mulberry32 } from '../../src/lib/sci/practice.ts';

export default async (check) => {
  // Seeded and repeatable
  const spec = { seed: 48213, count: 12, topics: ['ohm', 'gas', 'ph'] };
  const a = makeSet(spec), b = makeSet(spec);
  check('practice: same seed, same set', JSON.stringify(a) === JSON.stringify(b) && a.length === 12);
  check('practice: different seed, different set', JSON.stringify(makeSet({ ...spec, seed: 48214 })) !== JSON.stringify(a));
  check('practice: topics share the set evenly', ['ohm', 'gas', 'ph'].every((t) => a.filter((p) => p.topic === t).length === 4));
  check('practice: mulberry32 known first value', Math.abs(mulberry32(1)() - 0.6270739405881613) < 1e-15);
  check('practice: set code round trip', setCode(spec) === '48213-12-ohm.gas.ph' && JSON.stringify(parseCode(' 48213-12-ohm.gas.ph ')) === JSON.stringify(spec));
  check('practice: bad set codes refused', parseCode('48213-0-ohm') === null && parseCode('x-3-ohm') === null && parseCode('1-3-nothing') === null && parseCode('1-41-ohm') === null);
  check('practice: 13 topics', TOPICS.length === 13 && new Set(TOPIC_IDS).size === 13);

  // Every topic: finite answers, the last step ends with the rounded answer, and the answer text follows its rule
  let bad = 0;
  for (const t of TOPIC_IDS) for (const p of makeSet({ seed: 7, count: 60, topics: [t] })) {
    const A = p.answer, last = p.steps[p.steps.length - 1];
    if (!Number.isFinite(A.value) || !last.includes(A.text) || !p.question.trim() || p.steps.length < 2) bad++;
    if (checkAnswer(A.text, A).status !== 'right') bad++;
  }
  check('practice: 780 problems, each checks its own answer as right', bad === 0);

  // Rounding
  check('round: significant figures keep trailing zeros', fmtSF(0.025, 3) === '0.0250' && fmtSF(20, 3) === '20.0' && fmtSF(296, 3) === '296');
  check('round: large and small go to scientific notation', fmtSF(1234, 3) === '1.23 × 10³' && fmtSF(0.000123, 2) === '1.2 × 10⁻⁴' && fmtSF(5.17e14, 3) === '5.17 × 10¹⁴');
  check('round: unclear trailing zeros go to scientific notation', fmtSF(99.96, 3) === '1.00 × 10²' && fmtSF(120, 3) === '1.20 × 10²');
  check('round: halves go up on the decimal value (8.075, 2.675, 0.1225)', fmtSF(8.075, 3) === '8.08' && roundSF(2.675, 3) === 2.68 && fmtSF(0.1225, 3) === '0.123' && fmtDP(1.005, 2) === '1.01' && roundDP(-2.5, 0) === -3);
  check('round: negative numbers use a real minus', fmtSF(-0.5, 1) === '−0.5' && fmtDP(-12, 0) === '−12');
  check('round: significant figures of a difference', sfOfFixed(13, 1) === 3 && sfOfFixed(4.5, 1) === 2 && sfOfFixed(0.7, 1) === 1);

  // Reading answers
  const r = (s) => { const x = readAnswer(s); return x && [x.value, x.sfMin, x.sfMax]; };
  const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);
  check('read: plain decimals and significant figures', eq(r('0.0250'), [0.025, 3, 3]) && eq(r('20.0 m/s'), [20, 3, 3]) && eq(r('-3.4'), [-3.4, 2, 2]) && eq(r('−3.4'), [-3.4, 2, 2]));
  check('read: whole numbers with trailing zeros are a range', eq(r('1200'), [1200, 2, 4]) && eq(r('1110 J'), [1110, 3, 4]) && eq(r('296'), [296, 3, 3]));
  check('read: e notation and × 10 forms', eq(r('2.5e-3'), [0.0025, 2, 2]) && eq(r('2.5 × 10^-3'), [0.0025, 2, 2]) && eq(r('2.50x10^(-3)'), [0.0025, 3, 3]) && eq(r('5.17 × 10¹⁴ Hz'), [5.17e14, 3, 3]) && eq(r('1.2*10⁻⁴'), [0.00012, 2, 2]) && eq(r('3E8'), [3e8, 1, 1]));
  check('read: thousands commas and a decimal comma', eq(r('1,250'), [1250, 3, 4]) && eq(r('2,5'), [2.5, 2, 2]));
  check('read: not a number', readAnswer('abc') === null && readAnswer('') === null && readAnswer('2.5 x 10') === null && readAnswer('1.2.3') === null);

  // Checking answers
  const A = { value: 20.0, rounded: 20.0, text: '20.0', unit: 'm/s', rule: { sf: 3 }, what: 'speed' };
  check('check: right', checkAnswer('20.0', A).status === 'right' && checkAnswer('20.0 m/s', A).status === 'right' && checkAnswer('20.1', A).status === 'right');
  check('check: right value, wrong significant figures', checkAnswer('20', A).status === 'right-rounding' && checkAnswer('20.000', A).message.includes('3 significant figures'));
  check('check: tolerance', checkAnswer('20.3', A).status === 'wrong' && checkAnswer('20.3', A, 0.02).status === 'right');
  check('check: off by a power of ten', checkAnswer('0.0200', A).status === 'units' && checkAnswer('0.0200', A).message.includes('1,000 times too small') && checkAnswer('2.00e4', A).message.includes('1,000 times too big'));
  check('check: sign', checkAnswer('-20.0', A).message.includes('sign'));
  check('check: unreadable', checkAnswer('twenty', A).status === 'unread');
  const P = { value: 2.3979, rounded: 2.4, text: '2.40', unit: '', rule: { dp: 2 }, abs: 0.02, what: 'pH' };
  check('check: pH uses decimal places and an absolute tolerance', checkAnswer('2.40', P).status === 'right' && checkAnswer('2.4', P).status === 'right-rounding' && checkAnswer('2.42', P).status === 'right' && checkAnswer('2.43', P).status === 'wrong' && checkAnswer('24.0', P).status === 'wrong');
  const S = { value: 7.83e-5, rounded: 7.8e-5, text: '7.8 × 10⁻⁵', unit: 'mol/L', rule: { sf: 2 }, what: '[H⁺]' };
  check('check: rounded answer accepted within tolerance of the rounded value', checkAnswer('7.8e-5', S).status === 'right' && checkAnswer('7.83e-5', S).status === 'right-rounding');

  // Known worked examples, computed by hand
  const find = (topic, variant, pred) => { for (let s = 1; s < 4000; s++) { const p = makeSet({ seed: s, count: 1, topics: [topic] })[0]; if (p.variant === variant && pred(p)) return p; } return null; };
  const ph = find('ph', 'acid', (p) => p.vars.c === 0.0025);
  check('example: 0.0025 mol/L HCl has pH 2.60', ph && ph.answer.text === '2.60');
  const sp = find('units', 'temperature', (p) => p.vars.x === 25);
  check('example: 25 °C is 298 K', sp && sp.answer.text === '298');

  check('pdf text: superscripts, subscripts and Greek letters', pdfPlain('7.8 × 10⁻⁵ mol/L; C₆H₁₂O₆; ρ = m/V; 3.00 × 10⁸; ½at²; [H⁺]; Ω') === '7.8 x 10^-5 mol/L; C6H12O6; rho = m/V; 3.00 x 10^8; 1/2at²; [H^+]; ohm');
};
