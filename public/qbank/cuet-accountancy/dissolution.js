// CUET Accountancy: dissolution of a partnership firm. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'dissolution',
  items: [
    mcq('ds-001', 1, 'meaning', 'Dissolution of a partnership firm means:', 'the partnership between all the partners comes to an end', ['one partner leaves and the others continue', 'only the profit-sharing ratio changes', 'a new partner is admitted'],
      'In dissolution of the <b>firm</b> the business stops, assets are sold and liabilities paid. If one partner leaves, only the partnership is dissolved, not the firm.', 'Dissolution of partnership and dissolution of the firm are different.'),
    mcq('ds-002', 1, 'meaning', 'The Realisation Account is prepared to:', 'find the profit or loss on selling assets and settling liabilities', ['find the net profit of the year', 'find the closing capital of each partner', 'distribute the reserves'],
      'It records the sale of assets and payment of liabilities and shows the gain or loss on realisation.'),
    mcq('ds-003', 2, 'modes', 'Which is a mode of dissolution of a firm?', 'By agreement of all the partners', ['By transfer of shares', 'By a new partner\'s admission', 'By change in profit-sharing ratio'],
      'A firm may be dissolved by agreement, by notice in a partnership at will, compulsorily, on contingencies, or by the court.'),
    mcq('ds-004', 2, 'modes', 'A firm is dissolved compulsorily when:', 'its business becomes unlawful', ['partners disagree over profit', 'a partner is on leave', 'its sales fall'],
      'Compulsory dissolution happens when all partners (or all but one) become insolvent, or the business becomes <b>unlawful</b>.'),
    mcq('ds-005', 2, 'entries', 'On dissolution, assets (other than cash, bank and fictitious assets) are transferred to the Realisation Account by:', 'debiting Realisation A/c at book value', ['crediting Realisation A/c at market value', 'debiting Capital A/cs', 'crediting Cash A/c'],
      'Realisation A/c Dr (book values); to Assets A/cs. Cash and fictitious assets are not transferred.'),
    mcq('ds-006', 2, 'entries', 'Which item appears on the debit side of the Realisation Account?', 'Assets (other than cash and fictitious assets) at book value', ['Outside liabilities at book value', 'Cash received from the sale of assets', 'Assets taken over by a partner'],
      'Debit side: assets at book value, realisation expenses and payment of liabilities. Credit side: outside liabilities, sale proceeds and assets taken over by partners.', 'Mixing up the two sides of the realisation account.'),
    mcq('ds-007', 2, 'entries', 'Goodwill appearing in the books at the time of dissolution is:', 'transferred to the debit of Realisation A/c', ['written off to partners in the old ratio', 'ignored', 'transferred to Capital A/cs'],
      'Goodwill in the books is an asset, so it is transferred to the debit of Realisation A/c and any sale proceeds are credited.'),
    mcq('ds-008', 2, 'entries', 'Fictitious assets such as the debit balance of P&L A/c and preliminary expenses are:', 'transferred to partners\' capital accounts in the profit-sharing ratio', ['transferred to the Realisation A/c', 'sold for cash', 'ignored'],
      'They cannot be realised, so they are written off against the partners\' capital accounts: Capital A/cs Dr; to Fictitious asset A/c.'),
    mcq('ds-009', 2, 'entries', 'The general reserve on dissolution is transferred to:', 'partners\' capital accounts in the profit-sharing ratio', ['Realisation A/c', 'the new partner', 'Cash A/c'],
      'Accumulated profits and reserves belong to the partners: General Reserve A/c Dr; to Partners\' Capital A/cs (profit-sharing ratio).'),
    mcq('ds-010', 2, 'order', 'On dissolution, the correct order of settlement of the firm\'s dues is:', 'outside liabilities, partner\'s loan, partners\' capital', ['partners\' capital, partner\'s loan, outside liabilities', 'partners\' loan, outside liabilities, capital', 'capital, outside liabilities, partner\'s loan'],
      'The Partnership Act (and the books) settle <b>outsiders first</b>, then loans from partners, then partners\' capital, and any balance is shared in the profit ratio.'),
    mcq('ds-011', 2, 'computation', 'Assets of book value ₹5,00,000 are sold for ₹4,60,000. Liabilities of ₹1,00,000 are paid for ₹98,000. Realisation expenses are ₹6,000. The loss on realisation is:', '₹44,000', ['₹40,000', '₹46,000', '₹36,000'],
      'Loss on assets = 40,000. Gain on liabilities = 2,000. Expenses = 6,000. Net loss = 40,000 − 2,000 + 6,000 = <b>₹44,000</b>.'),
    mcq('ds-012', 2, 'entries', 'The loss on realisation is transferred to partners\' capital accounts:', 'in the profit-sharing ratio', ['in the capital ratio', 'equally always', 'in the sacrificing ratio'],
      'Loss: Partners\' Capital A/cs Dr (profit-sharing ratio); to Realisation A/c.'),
    mcq('ds-013', 2, 'entries', 'A partner takes over stock of book value ₹40,000 at ₹35,000. The entry is:', 'Partner\'s Capital A/c Dr ₹35,000; to Realisation A/c ₹35,000', ['Realisation A/c Dr ₹35,000; to Partner\'s Capital A/c', 'Partner\'s Capital A/c Dr ₹40,000; to Realisation A/c', 'Cash A/c Dr ₹35,000; to Realisation A/c'],
      'The partner owes the agreed price, so his capital is debited and Realisation is credited at the agreed value <b>₹35,000</b>.', 'The book value (40,000) is not used for the take-over.'),
    mcq('ds-014', 2, 'entries', 'Realisation expenses of ₹6,000 paid by the firm are:', 'debited to Realisation A/c and credited to Cash A/c', ['credited to Realisation A/c', 'debited to Capital A/cs', 'ignored'],
      'Realisation A/c Dr ₹6,000; to Cash/Bank A/c.'),
    mcq('ds-015', 2, 'entries', 'A partner agreed to pay realisation expenses of ₹6,000 in return for a fixed remuneration of ₹10,000 and he pays them himself. The firm\'s entry for the remuneration is:', 'Realisation A/c Dr ₹10,000; to Partner\'s Capital A/c', ['Realisation A/c Dr ₹6,000; to Cash A/c', 'No entry at all', 'Partner\'s Capital A/c Dr ₹10,000; to Realisation A/c'],
      'The remuneration is an expense of realisation: Realisation A/c Dr; to Partner\'s Capital A/c ₹10,000. His own payment of ₹6,000 is not recorded.'),
    mcq('ds-016', 2, 'entries', 'The partner\'s loan on dissolution is:', 'paid after outside liabilities and before capital', ['paid with partners\' capital in the profit ratio', 'transferred to Realisation A/c', 'written off against reserves'],
      'It is a liability to a partner but not an outside liability. It is not transferred to Realisation; it is paid separately.', 'Wrongly transferring it to realisation.'),
    mcq('ds-017', 2, 'computation', 'Debtors of ₹80,000 realise 90% of their book value. The amount realised is:', '₹72,000', ['₹8,000', '₹80,000', '₹88,000'],
      '90% × 80,000 = <b>₹72,000</b>, a loss of 8,000 to Realisation.'),
    mcq('ds-018', 3, 'final', 'Capitals before closing: A ₹80,000, B ₹60,000, profit ratio 2 : 1. Loss on realisation is ₹45,000. The amount finally payable to B (no other items) is:', '₹45,000', ['₹60,000', '₹15,000', '₹30,000'],
      'B\'s share of loss = 1/3 × 45,000 = 15,000. B gets 60,000 − 15,000 = <b>₹45,000</b>. (A gets 80,000 − 30,000 = 50,000.)'),
    mcq('ds-019', 3, 'final', 'After realisation, a partner\'s capital account shows a debit balance. He must:', 'bring in cash to cover the deficiency', ['be paid by the others', 'be ignored', 'convert it into a loan'],
      'A debit balance means he owes the firm. Cash A/c Dr; to Partner\'s Capital A/c. Cash from him is used to pay the other partners.'),
    mcq('ds-020', 2, 'entries', 'Partner A agrees to take over an unrecorded asset worth ₹10,000. The firm records:', 'Partner\'s Capital A/c Dr; to Realisation A/c ₹10,000', ['Realisation A/c Dr; to Partner\'s Capital A/c', 'Asset A/c Dr; to Realisation A/c', 'Nothing'],
      'The unrecorded asset is treated as realised: it is credited to Realisation, and the taking partner\'s capital is debited.'),
    mcq('ds-021', 2, 'entries', 'An unrecorded asset is sold for ₹5,000 in cash. The entry is:', 'Cash A/c Dr; to Realisation A/c', ['Realisation A/c Dr; to Cash A/c', 'Asset A/c Dr; to Cash A/c', 'Capital A/c Dr; to Realisation A/c'],
      'Cash comes in: <b>Cash A/c Dr; to Realisation A/c</b>. Nothing is transferred first because it is not in the books.'),
    mcq('ds-022', 2, 'order', 'Which account is closed last when a firm is dissolved?', 'Cash or Bank A/c', ['Realisation A/c', 'Creditors A/c', 'General Reserve A/c'],
      'Cash is used to settle everything, so the <b>cash/bank account closes last</b> (at nil) after the final payments to the partners.'),
    mcq('ds-023', 3, 'computation', 'Book values: stock ₹60,000, debtors ₹40,000, machinery ₹1,00,000. They realise 80%, 90% and ₹95,000. The total realised is:', '₹1,79,000', ['₹2,00,000', '₹1,95,000', '₹1,70,000'],
      'Stock 48,000 + debtors 36,000 + machinery 95,000 = <b>₹1,79,000</b> (book 2,00,000, a loss of 21,000).'),
    mcq('ds-024', 2, 'entries', 'Cash received on settling a liability at a discount (liability ₹50,000 paid ₹48,000) results in:', 'a credit of ₹2,000 in Realisation A/c (gain)', ['a debit of ₹2,000 in Realisation A/c', 'no effect', 'a loss of ₹48,000'],
      'Liability credited at 50,000; payment debited at 48,000. The difference is a <b>gain of ₹2,000</b>.'),
    mcq('ds-025', 2, 'meaning', 'In a partnership at will, the firm can be dissolved by:', 'any partner giving notice of dissolution', ['order of the Registrar', 'sale of shares', 'resolution of directors'],
      'In a partnership at will, any partner can dissolve the firm by <b>giving notice</b> in writing to all other partners.'),
    mcq('ds-026', 2, 'final', 'Realisation profit of ₹30,000 is shared by A, B and C equally. A\'s capital before is ₹50,000. After transfer of profit A\'s capital is:', '₹60,000', ['₹80,000', '₹50,000', '₹40,000'],
      '30,000 ÷ 3 = 10,000. A = 50,000 + 10,000 = <b>₹60,000</b>.'),
    mcq('ds-027', 2, 'meaning', 'Dissolution of the partnership differs from dissolution of the firm because in the former:', 'the business may continue under a new agreement', ['the business always ends', 'assets are always sold', 'the books are closed'],
      'When the partnership alone is dissolved (for example by a retirement), a new agreement can continue the business.'),
    mcq('ds-028', 3, 'computation', 'Stock of ₹30,000 is taken by partner B at 10% less than book value. The agreed value is:', '₹27,000', ['₹3,000', '₹33,000', '₹30,000'],
      '30,000 − 10% = <b>₹27,000</b>.'),
    mcq('ds-029', 2, 'entries', 'The cash received from sale of assets is debited to Cash A/c and credited to:', 'Realisation A/c', ['Capital A/cs', 'Assets A/cs', 'Bank loan A/c'],
      'The assets were first moved to Realisation at book value, so the proceeds are credited to <b>Realisation A/c</b>.'),
    mcq('ds-030', 3, 'final', 'On final settlement, total cash is ₹1,20,000. Dues: creditors ₹30,000, partner\'s loan ₹20,000, capitals A ₹40,000 and B ₹30,000. Cash left after settlement is:', 'nil, since 30,000 + 20,000 + 70,000 = 1,20,000', ['₹20,000', '₹30,000', '₹10,000'],
      'Payments: creditors 30,000, loan 20,000, capitals 70,000. Total = <b>1,20,000</b>, so the cash account closes at nil.'),
  ],
  gens: [
    { id: 'ds-g01', type: 'mcq', level: 2, sub: 'computation', ...T,
      make(rng) {
        const ba = int(rng, 4, 20) * 50000, pct = choose(rng, [80, 90, 85, 75]), real = (ba * pct) / 100, lb = int(rng, 1, 5) * 20000, pay = lb - int(rng, 0, 2) * 1000, ex = int(rng, 1, 5) * 2000;
        const loss = ba - real - (lb - pay) + ex;
        const { options, answer } = shuffleOpts(rng, loss, [ba - real, ba - real + ex, ba - real + (lb - pay) + ex], (v) => rs(v, 0));
        return { q: `Assets of book value ${rs(ba, 0)} realise ${pct}% of it. Liabilities of ${rs(lb, 0)} are paid for ${rs(pay, 0)}. Realisation expenses are ${rs(ex, 0)}. The loss on realisation is:`, options, answer, ba, real, lb, pay, ex,
          sol: steps(`Loss on assets = ${fmt(ba, 0)} − ${fmt(real, 0)} = ${fmt(ba - real, 0)}.`, `Gain on liabilities = ${fmt(lb, 0)} − ${fmt(pay, 0)} = ${fmt(lb - pay, 0)}.`, `Expenses = ${fmt(ex, 0)}.`, `Net loss = ${fmt(ba - real, 0)} − ${fmt(lb - pay, 0)} + ${fmt(ex, 0)} = <b>${rs(loss, 0)}</b>.`), trap: 'A gain on liabilities reduces the loss; expenses add to it.' };
      },
      verify: (p) => rs(p.ba - p.real - (p.lb - p.pay) + p.ex, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'ds-g02', type: 'mcq', level: 3, sub: 'final', ...T,
      make(rng) {
        const r = choose(rng, [[2, 1], [3, 2], [1, 1], [3, 1]]), t = r[0] + r[1], loss = t * int(rng, 3, 20) * 3000, cap = int(rng, 4, 12) * 40000;
        const b = cap - (loss * r[1]) / t;
        const { options, answer } = shuffleOpts(rng, b, [cap - (loss * r[0]) / t, cap - loss / 2, cap + (loss * r[1]) / t], (v) => rs(v, 0));
        return { q: `A and B share profits ${r[0]} : ${r[1]}. B's capital is ${rs(cap, 0)}. The loss on realisation is ${rs(loss, 0)}. The final payment to B (no other items) is:`, options, answer, cap, loss, r,
          sol: steps(`B's share of loss = ${r[1]}/${t} × ${fmt(loss, 0)} = ${fmt((loss * r[1]) / t, 0)}.`, `B gets ${fmt(cap, 0)} − ${fmt((loss * r[1]) / t, 0)} = <b>${rs(b, 0)}</b>.`), trap: 'Use B\'s own fraction of the loss.' };
      } },
    { id: 'ds-g03', type: 'mcq', level: 2, sub: 'computation', ...T,
      make(rng) {
        const bv = int(rng, 3, 20) * 10000, d = choose(rng, [5, 10, 20, 25]);
        const v = bv * (1 - d / 100);
        const { options, answer } = shuffleOpts(rng, v, [bv * (d / 100), bv * (1 + d / 100), bv], (x) => rs(x, 0));
        return { q: `A partner takes over stock of book value ${rs(bv, 0)} at ${d}% less than book value. The amount credited to Realisation A/c is:`, options, answer, bv, d,
          sol: steps(`Agreed value = ${fmt(bv, 0)} − ${d}% = <b>${rs(v, 0)}</b>.`, `Entry: Partner's Capital A/c Dr ${rs(v, 0)}; to Realisation A/c.`), trap: 'The discount is deducted, not the whole book value.' };
      } },
    { id: 'ds-g04', type: 'mcq', level: 2, sub: 'final', ...T,
      make(rng) {
        const pr = int(rng, 2, 10) * 30000, n3 = 3, cap = int(rng, 3, 10) * 50000;
        const c = cap + pr / n3;
        const { options, answer } = shuffleOpts(rng, c, [cap - pr / n3, cap + pr, cap + pr / 2], (v) => rs(v, 0));
        return { q: `The realisation profit of ${rs(pr, 0)} is shared equally by three partners. One partner's capital before the profit is ${rs(cap, 0)}. His capital after the profit is:`, options, answer, pr, cap,
          sol: steps(`His share = ${fmt(pr, 0)} ÷ 3 = ${fmt(pr / 3, 0)}.`, `Capital = ${fmt(cap, 0)} + ${fmt(pr / 3, 0)} = <b>${rs(c, 0)}</b>.`), trap: 'Profit is credited; a loss would be debited.' };
      } },
    { id: 'ds-g05', type: 'mcq', level: 2, sub: 'computation', ...T,
      make(rng) {
        const items = [int(rng, 2, 8) * 10000, int(rng, 2, 8) * 10000, int(rng, 2, 8) * 10000], p = [80, 90, 100];
        const tot = items.reduce((s, x, i) => s + (x * p[i]) / 100, 0);
        const { options, answer } = shuffleOpts(rng, tot, [items.reduce((s, x) => s + x, 0), tot + items[0] / 10, tot - items[1] / 10], (v) => rs(v, 0));
        return { q: `Stock of ${rs(items[0], 0)}, debtors of ${rs(items[1], 0)} and furniture of ${rs(items[2], 0)} (book values) realise 80%, 90% and 100% respectively. The total cash realised is:`, options, answer, items,
          sol: steps(`Stock = ${fmt(items[0] * 0.8, 0)}, debtors = ${fmt(items[1] * 0.9, 0)}, furniture = ${fmt(items[2], 0)}.`, `Total = <b>${rs(tot, 0)}</b>.`), trap: 'Apply each percentage to its own item.' };
      },
      verify: (p) => rs(p.items[0] * 0.8 + p.items[1] * 0.9 + p.items[2], 0) === p.options[p.answer] ? p.answer : -1 },
  ],
};
