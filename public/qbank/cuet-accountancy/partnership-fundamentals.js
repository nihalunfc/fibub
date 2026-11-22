// CUET Accountancy: partnership fundamentals. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'partnership-fundamentals',
  items: [
    mcq('pf-001', 1, 'definition', 'Under the Indian Partnership Act, 1932, a partnership is a relation between persons who have agreed to:', 'share the profits of a business carried on by all or any of them acting for all', ['share only the capital of a business', 'carry on a business as a registered company', 'share the losses but not the profits'],
      'Section 4 defines partnership as the relation between persons who have agreed to <b>share the profits of a business carried on by all or any of them acting for all</b>.', 'Registration is not part of the definition.'),
    mcq('pf-002', 1, 'rules', 'Ravi and Sunita are partners. Their deed is silent about profit sharing. Ravi invested ₹3,00,000 and Sunita ₹1,00,000. How are the profits shared?', 'Equally', ['3 : 1', '1 : 3', 'In proportion to time spent'],
      'The Partnership Act 1932 says that, if the deed is silent, partners share profits <b>equally</b>, whatever their capitals.', 'Many students share in the capital ratio.'),
    mcq('pf-003', 1, 'rules', 'If the partnership deed is silent, interest on a partner\'s capital is:', 'not allowed', ['allowed at 6% p.a.', 'allowed at 12% p.a.', 'allowed at the bank rate'],
      'Without an agreement a partner gets <b>no interest on capital</b>. Interest on capital needs a clause in the deed.', 'Confusing it with the 6% rate on a partner\'s loan.'),
    mcq('pf-004', 1, 'rules', 'If the deed is silent, interest on a partner\'s loan to the firm is paid at:', '6% per annum', ['5% per annum', '12% per annum', 'nothing, a loan earns no interest'],
      'A partner who lends to the firm beyond his capital is entitled to <b>6% p.a.</b> interest, even without an agreement.', 'The loan interest is allowed whether or not the firm has made profit.'),
    mcq('pf-005', 1, 'rules', 'If the deed is silent, a partner who works full time in the firm is entitled to:', 'no salary', ['a salary of ₹10,000 per month', 'a salary equal to 5% of profit', 'a salary equal to the highest salary paid to an employee'],
      'Partners work for a share of profit. With no clause, <b>no salary or commission</b> is paid to any partner.'),
    mcq('pf-006', 1, 'definition', 'The written agreement between partners that sets out how the firm is run is called the:', 'partnership deed', ['memorandum of association', 'articles of association', 'prospectus'],
      'A <b>partnership deed</b> records the terms: capitals, profit-sharing ratio, interest, salary and so on. Memorandum and articles belong to companies.'),
    mcq('pf-007', 1, 'liability', 'The liability of the partners of an ordinary firm is:', 'unlimited, and joint and several', ['limited to their capital', 'limited to the unpaid amount of shares', 'limited to the profit share'],
      'Each partner is liable for all the debts of the firm, jointly and severally, even from personal assets.'),
    mcq('pf-008', 2, 'capital', 'In a firm with fixed capitals, the partner\'s capital account:', 'stays unchanged except for new capital introduced or withdrawn by agreement', ['is credited with profits and debited with drawings', 'always has a debit balance', 'is not maintained'],
      'With fixed capital, profit share, interest, salary and drawings go to a separate <b>current account</b>. The capital account moves only when the agreed capital changes.', 'Under fluctuating capital, all items pass through the capital account.'),
    mcq('pf-009', 2, 'capital', 'Which statement is true when capitals are fluctuating?', 'Only one account, the capital account, is kept for each partner', ['Each partner has a capital and a current account', 'Drawings are debited to the current account', 'The capital balance never changes'],
      'With <b>fluctuating capital</b> there is just the capital account; salary, interest and profit are credited and drawings are debited to it.'),
    mcq('pf-010', 2, 'capital', 'You see each partner has a capital account and a current account. The capitals are:', 'fixed', ['fluctuating', 'neither; they are loans', 'zero'],
      'A separate current account is kept only when capitals are <b>fixed</b>.'),
    mcq('pf-011', 2, 'interest on capital', 'Asha\'s capital is ₹2,00,000. The deed allows 9% p.a. interest on capital. She also brought in ₹40,000 more on 1 October. The year ends on 31 March. Interest on capital for the year is:', '₹19,800', ['₹21,600', '₹18,000', '₹18,900'],
      '2,00,000 × 9% = 18,000; the extra 40,000 × 9% × 6/12 = 1,800 (1 October to 31 March is 6 months). Total = <b>₹19,800</b>.', 'Check the number of months carefully.'),
    mcq('pf-012', 2, 'interest on loan', 'Vikram lent ₹50,000 to the firm on 1 October. The firm\'s year ends on 31 March. Interest at the Act\'s default rate for the year is:', '₹1,500', ['₹3,000', '₹2,500', '₹250'],
      '50,000 × 6% × 6/12 = <b>₹1,500</b> (1 October to 31 March is 6 months).', 'Using a full year gives 3,000.'),
    mcq('pf-013', 2, 'interest on drawings', 'Meena withdrew ₹20,000 on 1 July. The firm charges 12% p.a. on drawings and the year ends 31 March. Interest on drawings is:', '₹1,800', ['₹2,400', '₹600', '₹1,200'],
      'From 1 July to 31 March is 9 months. 20,000 × 12% × 9/12 = <b>₹1,800</b>.'),
    mcq('pf-014', 2, 'interest on drawings', 'A partner draws ₹60,000 evenly through the year. Interest on drawings at 10% p.a. is calculated for an average of:', '6 months, giving ₹3,000', ['12 months, giving ₹6,000', '3 months, giving ₹1,500', '9 months, giving ₹4,500'],
      'When the dates are not given and the drawings are even through the year, the average period is <b>6 months</b>. 60,000 × 10% × 6/12 = ₹3,000.'),
    mcq('pf-015', 2, 'interest on drawings', 'A partner draws ₹10,000 at the start of every quarter. Interest at 12% p.a. for the year is:', '₹3,000', ['₹2,400', '₹4,800', '₹1,200'],
      'Total drawn = 40,000. The average period is (12 + 9 + 6 + 3) ÷ 4 = 7.5 months. 40,000 × 12% × 7.5/12 = <b>₹3,000</b>.', 'Beginning-of-quarter drawings use 7.5 months; end of quarter would use 4.5.'),
    mcq('pf-016', 2, 'interest on drawings', 'Interest charged on a partner\'s drawings is, for the firm:', 'an income, credited to the Profit and Loss Appropriation Account', ['an expense, debited to the Profit and Loss Account', 'a loss on capital', 'not recorded at all'],
      'The partner owes it to the firm. Entry: Partner\'s Capital/Current A/c Dr; to Interest on Drawings A/c; then to <b>P&L Appropriation A/c</b>.'),
    mcq('pf-017', 2, 'appropriation', 'Which item is debited to the Profit and Loss Account and not to the Profit and Loss Appropriation Account?', 'Interest on partner\'s loan', ['Interest on partner\'s capital', 'Partner\'s salary', 'Transfer to general reserve'],
      'Interest on a partner\'s <b>loan</b> is a charge against profit (an expense). Interest on capital, salary, commission and reserve are appropriations of profit.', 'The words "interest on partner" make students think they are all the same.'),
    mcq('pf-018', 2, 'appropriation', 'The Profit and Loss Appropriation Account is prepared to:', 'show how the net profit is distributed among the partners', ['find the gross profit', 'find the closing stock', 'find the cash balance'],
      'It is a continuation of the P&L account that shows the <b>division of profit</b> among partners after interest, salary and reserves.'),
    mcq('pf-019', 2, 'appropriation', 'Net profit is ₹2,40,000. The deed allows A a salary of ₹36,000 and 10% interest on capitals of ₹2,40,000 in total. The balance is shared 2 : 1 between A and B. B\'s share of the balance is:', '₹60,000', ['₹80,000', '₹1,20,000', '₹40,000'],
      'Interest on capital = 24,000. Balance = 2,40,000 − 36,000 − 24,000 = 1,80,000. B gets 1/3 × 1,80,000 = <b>₹60,000</b>.'),
    mcq('pf-020', 3, 'commission', 'Profit before partner\'s commission is ₹1,10,000. A is allowed a commission of 10% on net profit after charging such commission. The commission is:', '₹10,000', ['₹11,000', '₹9,091', '₹12,000'],
      'Commission = 10/110 × 1,10,000 = <b>₹10,000</b>. Check: profit after it is 1,00,000, and 10% of that is 10,000.', '"After charging such commission" means divide by 110, not multiply by 10%.'),
    mcq('pf-021', 3, 'guarantee', 'Profit of ₹90,000 is shared by A, B and C in the ratio 3 : 2 : 1. C is guaranteed a minimum of ₹25,000, and any shortfall is borne by A and B in their ratio. A\'s final share is:', '₹39,000', ['₹45,000', '₹35,000', '₹40,000'],
      'Shares: A 45,000, B 30,000, C 15,000. Shortfall of C = 10,000, borne by A and B 3 : 2, so A 6,000 and B 4,000. A = 45,000 − 6,000 = <b>₹39,000</b>.', 'Charging the whole shortfall to the partners as equal sharers.'),
    mcq('pf-022', 3, 'past adjustment', 'A and B (capitals ₹1,00,000 and ₹50,000) share profits equally. The deed allows 6% interest on capital but it was omitted in one year. The rectifying entry:', 'B\'s Capital A/c Dr ₹1,500; to A\'s Capital A/c ₹1,500', ['A\'s Capital A/c Dr ₹1,500; to B\'s Capital A/c ₹1,500', 'B\'s Capital A/c Dr ₹4,500; to A\'s Capital A/c ₹4,500', 'No entry is needed'],
      'Interest: A 6,000, B 3,000. Each should bear half of the total 9,000, i.e. 4,500. A net: 6,000 − 4,500 = +1,500; B net: 3,000 − 4,500 = −1,500. So <b>B pays A ₹1,500</b>.'),
    mcq('pf-023', 3, 'capital account', 'Under fluctuating capital, a partner\'s opening capital is ₹5,00,000. During the year he brings in ₹50,000, gets profit share ₹80,000, interest on capital ₹20,000, salary ₹30,000, and draws ₹60,000 with interest on drawings ₹3,000. His closing capital is:', '₹6,17,000', ['₹6,20,000', '₹6,80,000', '₹6,14,000'],
      '5,00,000 + 50,000 + 80,000 + 20,000 + 30,000 − 60,000 − 3,000 = <b>₹6,17,000</b>.', 'Forgetting to deduct the interest on drawings.'),
    mcq('pf-024', 1, 'definition', 'The minimum number of partners needed to form a partnership is:', 'two', ['one', 'three', 'seven'],
      'A partnership is a relation between <b>two or more</b> persons. One person alone cannot form a partnership.'),
    mcq('pf-025', 1, 'definition', 'Which feature distinguishes partnership from a company?', 'Each partner is an agent of the firm and of the other partners', ['Perpetual succession', 'Limited liability of every member', 'Shares are freely transferable'],
      'Mutual agency is a feature of partnership. The other three are features of a company.'),
    mcq('pf-026', 2, 'definition', 'Registration of a partnership firm under the Indian Partnership Act is:', 'optional, though an unregistered firm cannot sue third parties for its contracts', ['compulsory before starting business', 'compulsory only above ₹1 lakh capital', 'possible only through a court'],
      'Registration is <b>not compulsory</b>, but an unregistered firm cannot file a suit against a third party to enforce a contract.'),
    mcq('pf-027', 2, 'drawings', 'A partner\'s drawings of cash for personal use are debited to:', 'the partner\'s capital account (fluctuating) or current account (fixed)', ['the Profit and Loss Account', 'the Cash Account only', 'the firm\'s bank loan account'],
      'Drawings reduce the partner\'s claim on the firm, so they are debited to the capital or current account, not to profit and loss.', 'Treating drawings as a business expense.'),
    mcq('pf-028', 2, 'appropriation', 'Which of the following is an appropriation of profit?', 'Transfer to general reserve', ['Rent paid', 'Interest on a bank loan', 'Salary of a manager who is not a partner'],
      'A transfer to reserve is a division of profit. Rent, bank interest and an employee\'s salary are business expenses charged before arriving at net profit.'),
    mcq('pf-029', 2, 'capital', 'Partners A and B put in capitals of ₹4,00,000 and ₹1,00,000 and agree to share profits in proportion to capital. The ratio is:', '4 : 1', ['1 : 1', '1 : 4', '5 : 1'],
      'Agreed in proportion to capital: 4,00,000 : 1,00,000 = <b>4 : 1</b>. This is an agreement, not the default rule.'),
    mcq('pf-030', 2, 'interest on capital', 'Interest on capital is ₹12,000 for a firm whose net profit is only ₹9,000 and the deed says interest is payable "out of profits". The interest paid is:', '₹9,000', ['₹12,000', '₹3,000', 'nil'],
      'Interest on capital is paid only <b>out of profit</b>, so it is limited to ₹9,000 and shared by the partners in proportion to their capitals.', 'Do not create a loss by paying interest in a loss year.'),
    mcq('pf-031', 2, 'interest on drawings', 'A partner draws ₹5,000 at the end of every month. Interest at 12% p.a. on drawings for the year is:', '₹3,300', ['₹3,600', '₹3,900', '₹6,000'],
      'Total = 60,000. Average period for end-of-month drawings = 5.5 months. 60,000 × 12% × 5.5/12 = 7,200 × 5.5/12 = <b>₹3,300</b>.', 'Start of month would be 6.5 months.'),
  ],
  gens: [
    { id: 'pf-g01', type: 'mcq', level: 2, sub: 'interest on capital', ...T,
      make(rng) {
        const cap = int(rng, 2, 20) * 50000, r = choose(rng, [5, 6, 8, 10, 12]);
        const a = (cap * r) / 100;
        const { options, answer } = shuffleOpts(rng, a, [a / 2, a * 2, a + cap / 100], (v) => rs(v, 0));
        return { q: `A partner's capital is ${rs(cap, 0)} throughout the year. The deed allows ${r}% p.a. interest on capital. Interest for the year is:`, options, answer, cap, r,
          sol: steps(`Interest = capital × rate × time.`, `${fmt(cap, 0)} × ${r}% × 1 = <b>${rs(a, 0)}</b>.`), trap: 'Interest is on capital, not on profit.' };
      },
      verify: (p) => rs((p.cap * p.r) / 100, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'pf-g02', type: 'mcq', level: 2, sub: 'interest on drawings', ...T,
      make(rng) {
        const d = int(rng, 2, 20) * 2000, r = choose(rng, [6, 8, 10, 12]);
        const a = (d * 4 * r * 7.5) / 1200;
        const { options, answer } = shuffleOpts(rng, a, [(d * 4 * r * 4.5) / 1200, (d * 4 * r) / 100, (d * 4 * r * 6) / 1200], (v) => rs(v));
        return { q: `A partner draws ${rs(d, 0)} at the beginning of every quarter. Interest on drawings is ${r}% p.a. Interest for the year is:`, options, answer, d, r,
          sol: steps(`Total drawings = 4 × ${fmt(d, 0)} = ${fmt(4 * d, 0)}.`, `Average period = (12 + 9 + 6 + 3) ÷ 4 = 7.5 months.`, `${fmt(4 * d, 0)} × ${r}% × 7.5/12 = <b>${rs(a)}</b>.`),
          trap: 'End-of-quarter drawings would use 4.5 months, not 7.5.' };
      } },
    { id: 'pf-g03', type: 'mcq', level: 2, sub: 'appropriation', ...T,
      make(rng) {
        const np = int(rng, 4, 20) * 30000, sal = int(rng, 1, 3) * 12000, ic = int(rng, 1, 3) * 6000;
        const bal = np - sal - ic, a = choose(rng, [[3, 2], [2, 1], [3, 1], [1, 1]]);
        const share = (bal * a[1]) / (a[0] + a[1]);
        const { options, answer } = shuffleOpts(rng, share, [(bal * a[0]) / (a[0] + a[1]), bal / 2 + 1000, np / 3], (v) => rs(v, 0));
        return { q: `Net profit is ${rs(np, 0)}. A is allowed a salary of ${rs(sal, 0)} and the firm pays ${rs(ic, 0)} as interest on capital. The balance is shared ${a[0]} : ${a[1]} between A and B. B's share of the balance is:`, options, answer, bal, a,
          sol: steps(`Balance = ${fmt(np, 0)} − ${fmt(sal, 0)} − ${fmt(ic, 0)} = ${fmt(bal, 0)}.`, `B's share = ${a[1]}/${a[0] + a[1]} × ${fmt(bal, 0)} = <b>${rs(share, 0)}</b>.`),
          trap: 'Salary and interest are paid before the balance is shared.' };
      } },
    { id: 'pf-g04', type: 'mcq', level: 3, sub: 'guarantee', ...T,
      make(rng) {
        const k = int(rng, 3, 15) * 6000, p = k * 1; // profit
        const ratio = [3, 2, 1], tot = 6;
        const shares = ratio.map((x) => (p * x) / tot), g = shares[2] + int(rng, 1, 4) * 1000;
        const short = g - shares[2], a = shares[0] - (short * 3) / 5;
        const { options, answer } = shuffleOpts(rng, a, [shares[0], shares[0] - short / 2, shares[0] - short], (v) => rs(v, 0));
        return { q: `Profit of ${rs(p, 0)} is shared by A, B and C in the ratio 3 : 2 : 1. C is guaranteed ${rs(g, 0)}; any shortfall is borne by A and B in their ratio. A's final share is:`, options, answer, p, g, a,
          sol: steps(`A ${fmt(shares[0], 0)}, B ${fmt(shares[1], 0)}, C ${fmt(shares[2], 0)}.`, `C's shortfall = ${fmt(g, 0)} − ${fmt(shares[2], 0)} = ${fmt(short, 0)}, shared 3 : 2.`, `A bears ${fmt((short * 3) / 5, 0)}, so A = <b>${rs(a, 0)}</b>.`),
          trap: 'The shortfall is borne only by A and B, in 3 : 2.' };
      } },
    { id: 'pf-g05', type: 'mcq', level: 2, sub: 'capital account', ...T,
      make(rng) {
        const open = int(rng, 4, 12) * 50000, add = int(rng, 1, 4) * 10000, pr = int(rng, 2, 8) * 10000, dr = int(rng, 1, 4) * 10000, ic = int(rng, 1, 4) * 5000;
        const c = open + add + pr + ic - dr;
        const { options, answer } = shuffleOpts(rng, c, [c + 2 * dr, c - ic, open + pr - dr], (v) => rs(v, 0));
        return { q: `Under fluctuating capital a partner's opening capital is ${rs(open, 0)}. During the year he brings in ${rs(add, 0)}, earns ${rs(pr, 0)} as profit share and ${rs(ic, 0)} as interest on capital, and draws ${rs(dr, 0)}. His closing capital is:`, options, answer,
          sol: steps(`Closing = opening + additions + profit share + interest − drawings.`, `${fmt(open, 0)} + ${fmt(add, 0)} + ${fmt(pr, 0)} + ${fmt(ic, 0)} − ${fmt(dr, 0)} = <b>${rs(c, 0)}</b>.`),
          trap: 'Drawings are deducted, everything else is added.' };
      } },
    { id: 'pf-g06', type: 'mcq', level: 2, sub: 'interest on loan', ...T,
      make(rng) {
        const L = int(rng, 1, 10) * 20000, m = choose(rng, [3, 6, 9]);
        const a = (L * 6 * m) / 1200;
        const { options, answer } = shuffleOpts(rng, a, [(L * 6) / 100, (L * 12 * m) / 1200, a * 2], (v) => rs(v, 0));
        return { q: `A partner lends ${rs(L, 0)} to the firm ${m} months before the year end. The deed is silent about interest on loans. Interest for the year is:`, options, answer, L, m,
          sol: steps(`Without an agreement the Act allows 6% p.a. on a partner's loan.`, `${fmt(L, 0)} × 6% × ${m}/12 = <b>${rs(a, 0)}</b>.`), trap: 'Use the number of months the loan was with the firm.' };
      } },
  ],
};
