// CUET Accountancy: goodwill. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'goodwill',
  items: [
    mcq('gw-001', 1, 'nature', 'Goodwill of a firm is best described as:', 'an intangible asset, the value of its reputation and customer connection', ['a tangible fixed asset', 'a current liability', 'a fictitious asset'],
      'Goodwill cannot be touched or seen. It is an <b>intangible asset</b>: the extra earning power from name, location, customers and good management.'),
    mcq('gw-002', 1, 'nature', 'Which of these does NOT help the goodwill of a firm?', 'A poor reputation among customers', ['A good location', 'High quality products', 'Skilled management'],
      'Location, quality and management raise goodwill. A <b>poor reputation</b> lowers it.'),
    mcq('gw-003', 1, 'nature', 'Under AS 26, which goodwill may be shown in the balance sheet?', 'Purchased goodwill only', ['Self-generated goodwill', 'Both purchased and self-generated', 'Neither'],
      'Internally generated goodwill is not recognised in the books. Only goodwill that was <b>paid for</b> (purchased) is recorded.', 'Valuing goodwill at admission does not mean recording it in the books.'),
    mcq('gw-004', 1, 'when', 'Goodwill of a partnership firm is valued at all of these EXCEPT:', 'purchase of stock on credit', ['admission of a partner', 'retirement of a partner', 'change in profit-sharing ratio'],
      'Goodwill is valued on admission, retirement, death, change in ratio, sale and dissolution. A routine credit purchase of stock has nothing to do with it.'),
    mcq('gw-005', 2, 'average', 'A firm earned profits of ₹60,000, ₹75,000 and ₹90,000 in the last three years. Goodwill at 3 years\' purchase of the average profit is:', '₹2,25,000', ['₹75,000', '₹1,50,000', '₹6,75,000'],
      'Average = (60,000 + 75,000 + 90,000) ÷ 3 = 75,000. Goodwill = 75,000 × 3 = <b>₹2,25,000</b>.', 'Using the total of three years instead of the average.'),
    mcq('gw-006', 2, 'weighted', 'Profits of the last three years are ₹30,000, ₹45,000 and ₹60,000, with weights 1, 2 and 3. Goodwill at 3 years\' purchase of weighted average profit is:', '₹1,50,000', ['₹1,35,000', '₹1,80,000', '₹50,000'],
      'Weighted total = 30,000 × 1 + 45,000 × 2 + 60,000 × 3 = 3,00,000. Divide by 6 = 50,000. Goodwill = 50,000 × 3 = <b>₹1,50,000</b>.', 'Dividing by 3 (number of years) instead of 6 (sum of weights).'),
    mcq('gw-007', 2, 'average', 'Profits of three years are ₹50,000, a loss of ₹10,000, and ₹80,000. Average profit is:', '₹40,000', ['₹60,000', '₹46,667', '₹43,333'],
      'Losses are deducted: 50,000 − 10,000 + 80,000 = 1,20,000. ÷ 3 = <b>₹40,000</b>.', 'Ignoring the loss year.'),
    mcq('gw-008', 2, 'super profit', 'Average profit is ₹80,000. Capital employed is ₹5,00,000 and the normal rate of return is 10%. Super profit is:', '₹30,000', ['₹50,000', '₹80,000', '₹40,000'],
      'Normal profit = 10% × 5,00,000 = 50,000. Super profit = 80,000 − 50,000 = <b>₹30,000</b>.'),
    mcq('gw-009', 2, 'super profit', 'Using the facts of the previous question (super profit ₹30,000), goodwill at 4 years\' purchase of super profit is:', '₹1,20,000', ['₹3,20,000', '₹2,00,000', '₹30,000'],
      '30,000 × 4 = <b>₹1,20,000</b>.', 'Multiplying the average profit instead of the super profit.'),
    mcq('gw-010', 2, 'capitalisation', 'Average profit is ₹60,000, the normal rate of return is 12%, and net assets are ₹4,20,000. Goodwill by the capitalisation of average profit method is:', '₹80,000', ['₹5,00,000', '₹1,40,000', '₹60,000'],
      'Capitalised value = 60,000 × 100/12 = 5,00,000. Goodwill = capitalised value − net assets = 5,00,000 − 4,20,000 = <b>₹80,000</b>.', 'Stopping at 5,00,000, which is the value of the firm, not its goodwill.'),
    mcq('gw-011', 2, 'capitalisation', 'Super profit is ₹24,000 and the normal rate of return is 10%. Goodwill by capitalisation of super profit is:', '₹2,40,000', ['₹4,00,000', '₹24,000', '₹1,20,000'],
      'Goodwill = super profit × 100/10 = 24,000 × 10 = <b>₹2,40,000</b>.'),
    mcq('gw-012', 2, 'capital employed', 'Assets of a firm (excluding goodwill) are ₹8,00,000 and outside liabilities are ₹2,00,000. Capital employed is:', '₹6,00,000', ['₹10,00,000', '₹8,00,000', '₹2,00,000'],
      'Capital employed = assets − outside liabilities = 8,00,000 − 2,00,000 = <b>₹6,00,000</b>, which equals the partners\' capitals and reserves.'),
    mcq('gw-013', 2, 'adjusted profit', 'Profit of a year is ₹1,00,000 after crediting an abnormal gain of ₹10,000. The profit to be used for valuing goodwill is:', '₹90,000', ['₹1,10,000', '₹1,00,000', '₹10,000'],
      'Abnormal gains do not repeat and are removed: 1,00,000 − 10,000 = <b>₹90,000</b>.'),
    mcq('gw-014', 2, 'adjusted profit', 'Profit of a year is ₹50,000 after charging an abnormal loss of ₹10,000 caused by a fire. The profit to be used for valuing goodwill is:', '₹60,000', ['₹40,000', '₹50,000', '₹10,000'],
      'An abnormal loss will not repeat, so it is added back: 50,000 + 10,000 = <b>₹60,000</b>.', 'Subtracting the abnormal loss again.'),
    mcq('gw-015', 2, 'years purchase', 'Average profit is ₹60,000. Goodwill is valued at 2½ years\' purchase. Goodwill is:', '₹1,50,000', ['₹1,20,000', '₹1,80,000', '₹2,40,000'],
      '60,000 × 2.5 = <b>₹1,50,000</b>.'),
    mcq('gw-016', 2, 'super profit', 'Average profit ₹90,000; normal profit ₹60,000. Goodwill at 3 years\' purchase of super profit is:', '₹90,000', ['₹2,70,000', '₹1,80,000', '₹30,000'],
      'Super profit = 90,000 − 60,000 = 30,000. × 3 = <b>₹90,000</b>.'),
    mcq('gw-017', 2, 'admission', 'A and B share profits 3 : 2. They admit C for a 1/5 share. C takes his share from A and B in the old ratio. The sacrificing ratio of A and B is:', '3 : 2', ['1 : 1', '2 : 3', '5 : 3'],
      'New: A = 3/5 × 4/5 = 12/25, B = 8/25. Sacrifice: A = 15/25 − 12/25 = 3/25; B = 10/25 − 8/25 = 2/25. Ratio = <b>3 : 2</b>, the same as the old ratio when C takes in the old ratio.'),
    mcq('gw-018', 2, 'admission', 'C pays ₹30,000 as his share of goodwill on admission. A and B sacrifice in the ratio 3 : 2. The amount credited to A\'s capital account is:', '₹18,000', ['₹15,000', '₹12,000', '₹30,000'],
      'The premium is shared by the sacrificing partners in the sacrificing ratio: 3/5 × 30,000 = <b>₹18,000</b> to A and 12,000 to B.'),
    mcq('gw-019', 2, 'admission', 'A new partner pays his share of goodwill in cash to the old partners privately. The firm records:', 'no entry in the firm\'s books', ['Cash A/c Dr; Goodwill A/c Cr', 'Capital A/c Dr; Cash A/c Cr', 'Goodwill A/c Dr; Cash A/c Cr'],
      'When the premium is paid directly and privately to the old partners, it does not pass through the firm\'s cash, so <b>no entry</b> is made.'),
    mcq('gw-020', 2, 'admission', 'When the premium for goodwill is brought in by the new partner through the firm, the journal entry is:', 'Bank A/c Dr; to sacrificing partners\' Capital A/cs', ['Bank A/c Dr; to New partner\'s Capital A/c', 'Goodwill A/c Dr; to Bank A/c', 'Capital A/cs Dr; to Goodwill A/c'],
      'The cash comes into the firm and is <b>credited to the sacrificing partners\' capital accounts</b> in the sacrificing ratio.', 'Crediting the new partner who paid it.'),
    mcq('gw-021', 3, 'hidden', 'A and B have capitals of ₹3,00,000 and ₹2,00,000. C is admitted for a 1/4 share and brings ₹2,00,000 as capital, with no separate goodwill payment. Goodwill of the firm is:', '₹1,00,000', ['₹3,00,000', '₹2,00,000', 'nil'],
      'If C\'s ₹2,00,000 buys 1/4 share, total capital of the firm = 2,00,000 × 4 = 8,00,000. Actual capital = 3,00,000 + 2,00,000 + 2,00,000 = 7,00,000. Goodwill = <b>₹1,00,000</b>.'),
    mcq('gw-022', 3, 'ratio change', 'A, B and C share profits 5 : 3 : 2 and change to 2 : 2 : 1. Goodwill of the firm is ₹1,00,000. What happens to compensate the loss of share?', 'B pays ₹10,000 to A', ['A pays ₹10,000 to B', 'C pays ₹10,000 to A', 'No adjustment is needed'],
      'New shares: 2/5, 2/5, 1/5 = 0.4, 0.4, 0.2. Old: 0.5, 0.3, 0.2. A sacrifices 0.1, B gains 0.1, C unchanged. B pays 0.1 × 1,00,000 = <b>₹10,000</b> to A.', 'Mixing up the gainer and the sacrificer.'),
    mcq('gw-023', 3, 'existing goodwill', 'Goodwill appears in the books at ₹40,000 when a new partner is admitted. It is:', 'written off by debiting the old partners\' capital accounts in the old ratio', ['written off in the new ratio', 'credited to the new partner', 'left in the books and increased'],
      'Existing goodwill is first written off: Old partners\' Capital A/cs Dr (<b>old ratio</b>); to Goodwill A/c.'),
    mcq('gw-024', 2, 'meaning', 'Normal rate of return is:', 'the rate of profit earned by most firms in similar business with similar risk', ['the rate fixed by the Government', 'the highest rate earned by the firm', 'the rate of interest on bank deposits'],
      'It is the usual return on capital in the same kind of business, used to calculate normal profit.'),
    mcq('gw-025', 2, 'meaning', 'Super profit is:', 'the excess of average profit over normal profit', ['the total profit of the best year', 'the excess of normal profit over average profit', 'the profit after tax'],
      'Super profit = average (actual) profit − normal profit.', 'Reversing the two.'),
    mcq('gw-026', 2, 'average', 'The profits of a firm for 4 years are ₹40,000, ₹50,000, ₹60,000 and ₹70,000. Goodwill at 2 years\' purchase of average profit is:', '₹1,10,000', ['₹55,000', '₹2,20,000', '₹4,40,000'],
      'Average = 2,20,000 ÷ 4 = 55,000. × 2 = <b>₹1,10,000</b>.'),
    mcq('gw-027', 3, 'capitalisation', 'Average profit is ₹90,000, normal rate 15%. Assets (excluding goodwill) are ₹7,50,000 and outside liabilities ₹2,00,000. Goodwill by capitalisation of average profit is:', '₹50,000', ['₹6,00,000', '₹5,50,000', '₹1,50,000'],
      'Capitalised value = 90,000 × 100/15 = 6,00,000. Net assets = 7,50,000 − 2,00,000 = 5,50,000. Goodwill = <b>₹50,000</b>.'),
    mcq('gw-028', 3, 'super profit', 'Capital employed ₹8,00,000; normal rate 10%; average profit ₹1,10,000. Goodwill at 3 years\' purchase of super profit is:', '₹90,000', ['₹3,30,000', '₹2,40,000', '₹30,000'],
      'Normal profit = 80,000. Super profit = 1,10,000 − 80,000 = 30,000. × 3 = <b>₹90,000</b>.'),
    mcq('gw-029', 2, 'admission', 'C is admitted for 1/5 share and A and B (equal) sacrifice equally. C pays ₹50,000 as goodwill premium. A\'s capital account is credited with:', '₹25,000', ['₹50,000', '₹10,000', '₹20,000'],
      'Equal sacrifice, so each gets half of 50,000 = <b>₹25,000</b>.'),
    mcq('gw-030', 2, 'meaning', 'Which method values goodwill as the capitalised average profit minus actual net assets?', 'Capitalisation of average profit', ['Capitalisation of super profit', 'Weighted average profit', 'Simple average profit'],
      'This is exactly the capitalisation of average profit method. Super-profit capitalisation uses the super profit alone.'),
  ],
  gens: [
    { id: 'gw-g01', type: 'mcq', level: 2, sub: 'average', ...T,
      make(rng) {
        const a = int(rng, 4, 12) * 10000, d = int(rng, 1, 4) * 5000, yrs = choose(rng, [2, 3, 4]);
        const ps = [a - d, a, a + d], avg = a, g = avg * yrs;
        const { options, answer } = shuffleOpts(rng, g, [ps[0] + ps[1] + ps[2], avg, g + avg], (v) => rs(v, 0));
        return { q: `A firm's profits for the last three years are ${ps.map((x) => rs(x, 0)).join(', ')}. Goodwill is valued at ${yrs} years' purchase of the average profit. Goodwill is:`, options, answer, ps, yrs,
          sol: steps(`Average = ${ps.map((x) => fmt(x, 0)).join(' + ')} ÷ 3 = ${fmt(avg, 0)}.`, `Goodwill = ${fmt(avg, 0)} × ${yrs} = <b>${rs(g, 0)}</b>.`), trap: 'Use the average, not the three-year total.' };
      },
      verify: (p) => rs((p.ps[0] + p.ps[1] + p.ps[2]) / 3 * p.yrs, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'gw-g02', type: 'mcq', level: 2, sub: 'super profit', ...T,
      make(rng) {
        const ce = int(rng, 4, 20) * 100000, r = choose(rng, [8, 10, 12, 15]), norm = (ce * r) / 100, sp = int(rng, 1, 6) * 10000, avg = norm + sp, y = choose(rng, [2, 3, 4, 5]);
        const g = sp * y;
        const { options, answer } = shuffleOpts(rng, g, [avg * y, norm * y, sp], (v) => rs(v, 0));
        return { q: `Capital employed is ${rs(ce, 0)}, the normal rate of return is ${r}% and the average profit is ${rs(avg, 0)}. Goodwill at ${y} years' purchase of super profit is:`, options, answer, ce, r, avg, y,
          sol: steps(`Normal profit = ${r}% of ${fmt(ce, 0)} = ${fmt(norm, 0)}.`, `Super profit = ${fmt(avg, 0)} − ${fmt(norm, 0)} = ${fmt(sp, 0)}.`, `Goodwill = ${fmt(sp, 0)} × ${y} = <b>${rs(g, 0)}</b>.`), trap: 'Multiply the super profit, not the average profit.' };
      },
      verify: (p) => rs((p.avg - (p.ce * p.r) / 100) * p.y, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'gw-g03', type: 'mcq', level: 3, sub: 'capitalisation', ...T,
      make(rng) {
        const r = choose(rng, [10, 12.5, 20, 25]), avg = int(rng, 2, 10) * 10000, cap = (avg * 100) / r, na = cap - int(rng, 1, 4) * 20000;
        const g = cap - na;
        const { options, answer } = shuffleOpts(rng, g, [cap, na, cap + na], (v) => rs(v, 0));
        return { q: `Average profit is ${rs(avg, 0)}, the normal rate of return is ${r}% and the net assets (excluding goodwill) are ${rs(na, 0)}. Goodwill by capitalisation of average profit is:`, options, answer, avg, r, na,
          sol: steps(`Capitalised value = ${fmt(avg, 0)} × 100 ÷ ${r} = ${fmt(cap, 0)}.`, `Goodwill = ${fmt(cap, 0)} − ${fmt(na, 0)} = <b>${rs(g, 0)}</b>.`), trap: 'The capitalised value is the value of the firm, not goodwill.' };
      },
      verify: (p) => rs((p.avg * 100) / p.r - p.na, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'gw-g04', type: 'mcq', level: 2, sub: 'weighted', ...T,
      make(rng) {
        const b = int(rng, 2, 8) * 10000, ps = [b, b + 10000, b + 20000], w = [1, 2, 3];
        const wa = (ps[0] + 2 * ps[1] + 3 * ps[2]) / 6, y = choose(rng, [2, 3]), g = wa * y;
        const { options, answer } = shuffleOpts(rng, g, [((ps[0] + ps[1] + ps[2]) / 3) * y, (ps[0] + 2 * ps[1] + 3 * ps[2]) / 3 * y, wa], (v) => rs(v, 0));
        return { q: `Profits of the last three years are ${ps.map((x) => rs(x, 0)).join(', ')} with weights 1, 2 and 3. Goodwill at ${y} years' purchase of weighted average profit is:`, options, answer, ps, y,
          sol: steps(`Weighted total = ${fmt(ps[0], 0)}×1 + ${fmt(ps[1], 0)}×2 + ${fmt(ps[2], 0)}×3 = ${fmt(ps[0] + 2 * ps[1] + 3 * ps[2], 0)}.`, `Divide by the sum of weights 6 = ${fmt(wa, 0)}.`, `Goodwill = ${fmt(wa, 0)} × ${y} = <b>${rs(g, 0)}</b>.`), trap: 'Divide by the sum of the weights (6), not by 3.' };
      } },
    { id: 'gw-g05', type: 'mcq', level: 2, sub: 'admission', ...T,
      make(rng) {
        const sacr = choose(rng, [[3, 2], [2, 1], [3, 1], [1, 1], [4, 1]]), prem = int(rng, 2, 20) * 10000, t = sacr[0] + sacr[1];
        const a = (prem * sacr[0]) / t;
        const { options, answer } = shuffleOpts(rng, a, [(prem * sacr[1]) / t, prem, prem / 2 + 1], (v) => rs(v, 0));
        return { q: `On admission, the new partner pays ${rs(prem, 0)} as premium for goodwill through the firm. A and B sacrifice in the ratio ${sacr[0]} : ${sacr[1]}. The amount credited to A's capital account is:`, options, answer, prem, sacr,
          sol: steps(`Premium is shared by the sacrificing partners in the sacrificing ratio.`, `A = ${sacr[0]}/${t} × ${fmt(prem, 0)} = <b>${rs(a, 0)}</b>.`), trap: 'Check which partner is asked for.' };
      } },
  ],
};
