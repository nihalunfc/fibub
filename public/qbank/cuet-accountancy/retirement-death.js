// CUET Accountancy: retirement and death of a partner. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from '../cuet-general-test/_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
let n = 0;
const POS = [0, 2, 1, 3, 1, 0, 3, 2];
// c = the right option, w = three wrong ones; the right one is slotted in at a varying place.
const mcq = (id, level, sub, q, c, w, sol, trap) => {
  const p = POS[n++ % 8]; const options = w.slice(); options.splice(p, 0, c);
  return { id, type: 'mcq', level, sub, q, options, answer: p, sol, ...(trap ? { trap } : {}), ...T };
};

export default {
  topic: 'retirement-death',
  items: [
    mcq('rt-001', 1, 'ratios', 'Gaining ratio on retirement of a partner is:', 'new ratio − old ratio of the continuing partners', ['old ratio − new ratio', 'the ratio of the capitals', 'the ratio of the retiring partner to the others'],
      'The continuing partners gain the retiring partner\'s share, so gaining ratio = <b>new − old</b>.'),
    mcq('rt-002', 2, 'ratios', 'A, B and C share profits 5 : 3 : 2. C retires and the new ratio of A and B is 3 : 2. The gaining ratio of A and B is:', '1 : 1', ['3 : 2', '5 : 3', '2 : 1'],
      'New: A = 3/5 = 0.6, B = 0.4. Old: 0.5, 0.3. A gains 0.1, B gains 0.1. Ratio <b>1 : 1</b>.', 'The gaining ratio is not the new ratio.'),
    mcq('rt-003', 2, 'ratios', 'A, B and C share profits 5 : 3 : 2. C retires. No new ratio is mentioned. The new ratio of A and B is:', '5 : 3', ['1 : 1', '3 : 2', '5 : 2'],
      'If no new ratio is given, the continuing partners share in their old ratio: <b>5 : 3</b>. Gaining ratio is also 5 : 3.'),
    mcq('rt-004', 2, 'goodwill', 'A, B and C share profits 5 : 3 : 2. C retires and goodwill is valued at ₹1,50,000. A and B continue in the old ratio. Total amount A must pay (debited to A\'s capital) is:', '₹18,750', ['₹30,000', '₹15,000', '₹11,250'],
      'C\'s share of goodwill = 2/10 × 1,50,000 = 30,000. A and B bear it in the gaining ratio 5 : 3: A = 30,000 × 5/8 = <b>₹18,750</b>, B = 11,250.'),
    mcq('rt-005', 2, 'goodwill', 'On retirement, goodwill is adjusted by debiting the:', 'continuing partners in the gaining ratio and crediting the retiring partner', ['continuing partners in the old ratio', 'all partners in the new ratio', 'the retiring partner'],
      'Entry: Gaining partners\' Capital A/cs Dr (gaining ratio); to Retiring Partner\'s Capital A/c.', 'The sacrificing ratio is for admission; here it is the gaining ratio.'),
    mcq('rt-006', 2, 'amount due', 'C retires. Capital ₹2,00,000, share of reserve ₹10,000, share of goodwill ₹30,000, share of revaluation profit ₹5,000, drawings ₹15,000. Amount due to C is:', '₹2,30,000', ['₹2,45,000', '₹2,60,000', '₹2,15,000'],
      '2,00,000 + 10,000 + 30,000 + 5,000 − 15,000 = <b>₹2,30,000</b>.', 'Drawings are deducted.'),
    mcq('rt-007', 2, 'payment', 'The amount due to a retiring partner, unpaid at once, is transferred to:', 'Retiring Partner\'s Loan Account', ['Capital Account of the continuing partners', 'Realisation Account', 'Bank Account'],
      'It becomes a liability of the firm: Retiring Partner\'s Capital A/c Dr; to <b>Retiring Partner\'s Loan A/c</b>.'),
    mcq('rt-008', 2, 'payment', 'In which case does the retiring partner receive the amount as soon as he retires?', 'The balance is paid in cash and bank', ['The amount is left as a loan', 'The amount is paid in instalments', 'The amount is converted into capital of continuing partners'],
      'Payment in full means Retiring Partner\'s Capital A/c Dr; to Bank A/c. Other options leave a loan or a balance.'),
    mcq('rt-009', 2, 'instalments', '₹3,00,000 due to a retiring partner is paid in 3 equal annual instalments with 10% interest on the unpaid balance. Interest for the second year is:', '₹20,000', ['₹30,000', '₹10,000', '₹15,000'],
      'Instalment = 1,00,000. After year 1 the balance is 2,00,000, so interest for year 2 = 2,00,000 × 10% = <b>₹20,000</b> (year 1: ₹30,000).', 'Interest is on the balance outstanding, which falls each year.'),
    mcq('rt-010', 2, 'reserve', 'On retirement of a partner, accumulated profits and reserves are credited to:', 'all partners in the old ratio', ['continuing partners in the new ratio', 'the retiring partner only', 'continuing partners in the gaining ratio'],
      'Reserves belong to all partners, including the one retiring, and are shared in the <b>old ratio</b>.'),
    mcq('rt-011', 2, 'revaluation', 'On retirement, the profit or loss on revaluation is shared by:', 'all partners in the old ratio', ['continuing partners only', 'the retiring partner only', 'all partners in the new ratio'],
      'Revaluation is for the period when all were partners, so it is shared in the <b>old ratio</b>.'),
    mcq('rt-012', 2, 'death', 'When a partner dies, the amount due to him is paid to his:', 'executors or legal heirs', ['the other partners personally', 'the Registrar of Firms', 'the court'],
      'The deceased partner\'s capital account is debited and the <b>executors\' account</b> is credited.'),
    mcq('rt-013', 2, 'death', 'The journal entry to transfer the amount due to a deceased partner is:', 'Deceased Partner\'s Capital A/c Dr; to Executors\' A/c', ['Executors\' A/c Dr; to Deceased Partner\'s Capital A/c', 'Capital A/c Dr; to Cash A/c', 'Realisation A/c Dr; to Executors\' A/c'],
      'The firm now owes the executors, so <b>Executors\' A/c is credited</b>.'),
    mcq('rt-014', 2, 'death', 'Last year profit was ₹2,40,000. A partner with a 1/4 share died after 3 months. His share of profit till death (on a time basis) is:', '₹15,000', ['₹60,000', '₹30,000', '₹10,000'],
      '2,40,000 × 3/12 = 60,000. His 1/4 = <b>₹15,000</b>.'),
    mcq('rt-015', 3, 'death', 'A partner with a 1/5 share died on 31 July. Sales till then were ₹2,00,000. Last year sales were ₹8,00,000 and profit ₹1,60,000. His share of profit on a sales basis is:', '₹8,000', ['₹32,000', '₹40,000', '₹16,000'],
      'Profit rate = 1,60,000 ÷ 8,00,000 = 20%. Profit till death = 20% × 2,00,000 = 40,000. 1/5 of 40,000 = <b>₹8,000</b>.', 'Multiplying by the sales without the share.'),
    mcq('rt-016', 3, 'insurance', 'A joint life policy for ₹2,00,000 matures on a partner\'s death. The insurance company pays the firm. The amount is credited to:', 'all partners, including the deceased, in the old ratio', ['only the surviving partners', 'only the deceased partner', 'the Realisation A/c'],
      'The policy belongs to the firm, so the proceeds are shared by <b>all partners in the old ratio</b> through their capital accounts.', 'Giving it all to the deceased\'s estate.'),
    mcq('rt-017', 2, 'goodwill', 'Goodwill already appears in the books at ₹50,000 on the retirement of a partner. It is:', 'written off to all partners in the old ratio', ['written off in the gaining ratio', 'written off to the retiring partner', 'carried forward'],
      'The old goodwill is written off in the old ratio (Capital A/cs Dr; Goodwill A/c Cr), then fresh goodwill is adjusted.'),
    mcq('rt-018', 2, 'interest', 'Interest on the retiring partner\'s loan, if not agreed, is paid at:', '6% per annum', ['10% per annum', '12% per annum', 'nil'],
      'Under the Partnership Act, a retiring partner whose dues are left in the firm can ask for 6% interest or a share of subsequent profit.'),
    mcq('rt-019', 3, 'adjustment', 'The remaining partners A and B (new ratio 3 : 1) must hold total capital of ₹4,00,000 after C retires. A\'s new capital should be:', '₹3,00,000', ['₹2,00,000', '₹1,00,000', '₹4,00,000'],
      'A = 3/4 × 4,00,000 = <b>₹3,00,000</b>, B = 1,00,000.'),
    mcq('rt-020', 2, 'ratios', 'A, B and C share profits 1/2, 1/3 and 1/6. C retires and A and B continue in the ratio 2 : 1. What does A gain?', '1/6', ['1/3', '2/3', 'nothing'],
      'New: A = 2/3, B = 1/3. A: 2/3 − 1/2 = <b>1/6</b>. B: 1/3 − 1/3 = 0. A takes C\'s whole 1/6.', 'B gains nothing, so only A pays for goodwill.'),
    mcq('rt-021', 2, 'ratios', 'A, B and C share profits 4 : 3 : 2. C retires and A and B share 5 : 4. Their gaining ratio is:', '1 : 1', ['5 : 4', '4 : 3', '2 : 1'],
      'New A = 5/9, B = 4/9. Old A = 4/9, B = 3/9. A gains 1/9, B gains 1/9. Gaining ratio <b>1 : 1</b>.'),
    mcq('rt-022', 2, 'death', 'Share of profit up to the date of a partner\'s death is credited to his capital account and debited to:', 'Profit and Loss Suspense A/c', ['Profit and Loss Appropriation A/c', 'Executors\' A/c', 'Goodwill A/c'],
      'The year\'s books are not closed at death, so the estimate is: <b>P&L Suspense A/c Dr; to Deceased Partner\'s Capital A/c</b>.'),
    mcq('rt-023', 2, 'death', 'Which item is debited, not credited, to a deceased partner\'s capital account?', 'Interest on drawings up to the date of death', ['Share of reserve', 'Share of goodwill', 'Share of profit till death'],
      'Interest on drawings is a charge on the partner and reduces the amount due. The other three are credited.'),
    mcq('rt-024', 3, 'insurance', 'A, B and C (3 : 2 : 1) hold a joint life policy for ₹1,00,000, shown in the books at ₹40,000. C dies. Net amount credited to C\'s capital for the policy is:', '₹10,000', ['₹60,000', '₹16,667', '₹40,000'],
      'Share of policy = 1/6 × 1,00,000 = 16,667 and of the policy balance written off = 1/6 × 40,000 = 6,667. Net = 60,000 × 1/6 = <b>₹10,000</b>.', 'Forgetting that the book value of the policy is written off.'),
    mcq('rt-025', 2, 'revaluation', 'On C\'s retirement, revaluation profit is ₹12,000. A, B and C share 3 : 2 : 1. C\'s share is:', '₹2,000', ['₹4,000', '₹6,000', '₹12,000'],
      '1/6 × 12,000 = <b>₹2,000</b>, credited to C\'s capital.'),
    mcq('rt-026', 2, 'payment', '₹2,30,000 is due to C who retires. ₹1,00,000 is paid in cash and the rest is left as a loan. The loan account shows:', '₹1,30,000', ['₹1,00,000', '₹2,30,000', '₹3,30,000'],
      '2,30,000 − 1,00,000 = <b>₹1,30,000</b>.'),
    mcq('rt-027', 3, 'goodwill', 'A, B and C share 3 : 2 : 1. Goodwill is ₹90,000. C retires; A and B continue 3 : 2. B\'s capital account is debited with:', '₹6,000', ['₹15,000', '₹9,000', '₹36,000'],
      'C\'s share = 1/6 × 90,000 = 15,000. A and B gain 3 : 2, so B = 15,000 × 2/5 = <b>₹6,000</b>.'),
    mcq('rt-028', 2, 'rules', 'A retiring partner remains liable to third parties for the firm\'s debts incurred before retirement, and for those after retirement until:', 'public notice of retirement is given', ['the next balance sheet', 'one year has passed', 'the firm is registered'],
      'Under the Partnership Act a retired partner is liable for old debts; for later dealings he stays liable to those who deal with the firm without knowing of the retirement, until <b>public notice</b>.'),
    mcq('rt-029', 2, 'revaluation', 'A revaluation loss of ₹24,000 is borne by A, B and C (3 : 2 : 1) on the retirement of C. C\'s capital account is debited with:', '₹4,000', ['₹8,000', '₹12,000', '₹24,000'],
      '1/6 × 24,000 = <b>₹4,000</b>.', 'The retiring partner also bears his share of the revaluation loss.'),
    mcq('rt-030', 2, 'death', 'Which amount is NOT due to the executors of a deceased partner?', 'The share of the surviving partners\' goodwill', ['Capital balance at the date of death', 'Share of accumulated profits', 'Share of profit up to the date of death'],
      'The executors get the partner\'s own capital, reserves, profit share and goodwill. The survivors\' goodwill is their own.'),
    mcq('rt-031', 2, 'instalments', '₹1,20,000 due to a retiring partner is paid in 2 equal instalments of ₹60,000 a year apart, with 6% interest on the unpaid balance. Interest for the first year is:', '₹7,200', ['₹3,600', '₹6,000', '₹14,400'],
      '1,20,000 × 6% = <b>₹7,200</b> for year 1 (year 2: 60,000 × 6% = ₹3,600).'),
  ],
  gens: [
    { id: 'rt-g01', type: 'mcq', level: 2, sub: 'goodwill', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[3, 2], [5, 3], [2, 1], [4, 1]]), t = a + b, c = choose(rng, [1, 2, 3]), tot = a + b + c;
        const gw = int(rng, 2, 10) * tot * t * 1000;
        const cs = (gw * c) / (tot + 0 * c);
        const A = (cs * a) / t;
        const { options, answer } = shuffleOpts(rng, A, [cs, (cs * b) / t, gw * a / tot], (v) => rs(v, 0));
        return { q: `A, B and C share profits ${a} : ${b} : ${c}. C retires and A and B continue in their old ratio. Goodwill of the firm is ${rs(gw, 0)}. The amount debited to A's capital account for goodwill is:`, options, answer, gw, a, b, c,
          sol: steps(`C's share of goodwill = ${c}/${tot} × ${fmt(gw, 0)} = ${fmt(cs)}.`, `A and B bear it in the gaining ratio ${a} : ${b}.`, `A = ${a}/${t} × ${fmt(cs)} = <b>${rs(A, 0)}</b>.`), trap: 'A pays only a part of C\'s share, not all of it.' };
      },
      verify: (p) => rs(((p.gw * p.c) / (p.a + p.b + p.c) * p.a) / (p.a + p.b), 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'rt-g02', type: 'mcq', level: 2, sub: 'amount due', ...T,
      make(rng) {
        const cap = int(rng, 3, 12) * 50000, res = int(rng, 1, 5) * 5000, gw = int(rng, 1, 6) * 10000, rv = int(rng, 1, 4) * 2000, dr = int(rng, 1, 4) * 5000;
        const due = cap + res + gw + rv - dr;
        const { options, answer } = shuffleOpts(rng, due, [cap + res + gw + rv + dr, cap + res + gw - rv - dr, cap + res - dr], (v) => rs(v, 0));
        return { q: `A partner retires. His capital is ${rs(cap, 0)}, share of reserve ${rs(res, 0)}, share of goodwill ${rs(gw, 0)}, share of revaluation profit ${rs(rv, 0)} and drawings ${rs(dr, 0)}. The amount due to him is:`, options, answer,
          sol: steps(`Due = capital + reserve + goodwill + revaluation profit − drawings.`, `${fmt(cap, 0)} + ${fmt(res, 0)} + ${fmt(gw, 0)} + ${fmt(rv, 0)} − ${fmt(dr, 0)} = <b>${rs(due, 0)}</b>.`), trap: 'Drawings reduce the amount due.' };
      } },
    { id: 'rt-g03', type: 'mcq', level: 2, sub: 'instalments', ...T,
      make(rng) {
        const inst = int(rng, 2, 10) * 10000, k = choose(rng, [3, 4]), r = choose(rng, [6, 8, 10, 12]);
        const bal = inst * k, int2 = ((bal - inst) * r) / 100;
        const { options, answer } = shuffleOpts(rng, int2, [(bal * r) / 100, ((bal - 2 * inst) * r) / 100, (inst * r) / 100], (v) => rs(v, 0));
        return { q: `${rs(bal, 0)} is due to a retiring partner and is paid in ${k} equal yearly instalments of ${rs(inst, 0)}, with ${r}% interest on the unpaid balance. Interest for the second year is:`, options, answer, bal, inst, r,
          sol: steps(`After the first instalment the balance is ${fmt(bal, 0)} − ${fmt(inst, 0)} = ${fmt(bal - inst, 0)}.`, `Interest = ${fmt(bal - inst, 0)} × ${r}% = <b>${rs(int2, 0)}</b>.`), trap: 'Interest is on the balance still unpaid.' };
      },
      verify: (p) => rs(((p.bal - p.inst) * p.r) / 100, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'rt-g04', type: 'mcq', level: 3, sub: 'ratios', ...T,
      make(rng) {
        const [[o1, o2, o3], [n1, n2]] = choose(rng, [[[5, 3, 2], [3, 2]], [[4, 3, 2], [5, 4]], [[3, 2, 1], [3, 2]], [[4, 3, 2], [4, 3]], [[5, 3, 2], [5, 3]]]);
        const to = o1 + o2 + o3, tn = n1 + n2, gc = (p, q) => (q ? gc(q, p % q) : p);
        const ga = n1 * to - o1 * tn, gb = n2 * to - o2 * tn, k = gc(ga, gb), c = `${ga / k} : ${gb / k}`;
        // Distractors must differ from the answer and from each other: when A and B keep their old ratio, the gaining ratio equals it.
        const wrong = [`${n1} : ${n2}`, `${o1} : ${o2}`, `${gb / k} : ${ga / k}`, '1 : 1', `${o1} : ${o3}`, `${o2} : ${o3}`, `${n2} : ${n1}`].filter((v, i, a) => v !== c && a.indexOf(v) === i).slice(0, 3);
        const { options, answer } = shuffleOpts(rng, c, wrong, (v) => v);
        return { q: `A, B and C share profits ${o1} : ${o2} : ${o3}. C retires and A and B decide to share ${n1} : ${n2}. Their gaining ratio is:`, options, answer, c,
          sol: steps(`A's gain = ${n1}/${tn} − ${o1}/${to}; B's gain = ${n2}/${tn} − ${o2}/${to}.`, `Gains in the same denominator: ${ga} : ${gb} (over ${tn * to}).`, `Gaining ratio = <b>${c}</b>.`), trap: 'The gaining ratio is new − old, not the new ratio.' };
      } },
    { id: 'rt-g05', type: 'mcq', level: 2, sub: 'death', ...T,
      make(rng) {
        const p = int(rng, 2, 12) * 120000, m = choose(rng, [2, 3, 4, 6]), d = choose(rng, [2, 4, 5]);
        const v = (p * m) / 12 / d;
        const { options, answer } = shuffleOpts(rng, v, [(p * m) / 12, p / d, (p * m * 2) / 12 / d], (x) => rs(x, 0));
        return { q: `Last year's profit was ${rs(p, 0)}. A partner with a 1/${d} share dies ${m} months after the year began. His share of profit up to the date of death (time basis) is:`, options, answer, p, m, d,
          sol: steps(`Profit for ${m} months = ${fmt(p, 0)} × ${m}/12 = ${fmt((p * m) / 12, 0)}.`, `His 1/${d} share = <b>${rs(v, 0)}</b>.`), trap: 'Do not forget his fraction of the profit.' };
      } },
  ],
};
