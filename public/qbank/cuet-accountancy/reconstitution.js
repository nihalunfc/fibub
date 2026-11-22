// CUET Accountancy: change in profit-sharing ratio and admission. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'reconstitution',
  items: [
    mcq('rc-001', 1, 'ratios', 'Sacrificing ratio is:', 'old share − new share of the partners who give up a part of their share', ['new share − old share of the partners who gain', 'the ratio of the old capitals', 'the ratio of new partner\'s capital to old capitals'],
      'Sacrificing ratio = <b>old ratio − new ratio</b> for those who lose share. Gaining ratio = new − old.'),
    mcq('rc-002', 1, 'ratios', 'Gaining ratio is calculated as:', 'new ratio − old ratio', ['old ratio − new ratio', 'old ratio ÷ new ratio', 'new ratio × old ratio'],
      'A partner gains when his new share is bigger: <b>new − old</b>.'),
    mcq('rc-003', 1, 'meaning', 'Which of the following is a reconstitution of a firm?', 'Admission of a new partner', ['Sale of old machinery', 'Payment of rent', 'Purchase of stock'],
      'Reconstitution means a change in the existing agreement: admission, retirement, death, or a change in the profit-sharing ratio.'),
    mcq('rc-004', 2, 'ratios', 'A and B share profits 3 : 2 and decide to share equally. Which statement is correct?', 'A sacrifices 1/10 and B gains 1/10', ['A gains 1/10 and B sacrifices 1/10', 'A sacrifices 1/5 and B gains 1/5', 'Neither gains nor sacrifices'],
      'Old: A = 3/5, B = 2/5. New: 1/2 each. A: 3/5 − 1/2 = 1/10 sacrificed. B: 1/2 − 2/5 = 1/10 gained. So <b>A sacrifices 1/10 to B</b>.'),
    mcq('rc-005', 2, 'ratios', 'A and B share profits equally. They admit C for 1/3 share, which he takes equally from A and B. The new ratio is:', '1 : 1 : 1', ['2 : 2 : 1', '3 : 3 : 2', '1 : 1 : 2'],
      'C takes 1/6 from each: A = 1/2 − 1/6 = 1/3, B = 1/3, C = 1/3. New ratio <b>1 : 1 : 1</b>.'),
    mcq('rc-006', 2, 'ratios', 'A and B share profits 2 : 1. C is admitted for a 1/4 share, taking 1/8 from A and 1/8 from B. The new ratio is:', '13 : 5 : 6', ['2 : 1 : 1', '8 : 4 : 3', '5 : 13 : 6'],
      'A = 2/3 − 1/8 = 13/24; B = 1/3 − 1/8 = 5/24; C = 1/4 = 6/24. Ratio = <b>13 : 5 : 6</b>.'),
    mcq('rc-007', 2, 'ratios', 'A and B share profits 3 : 2. C is admitted for a 1/5 share, which he takes in the old ratio. The new ratio of A : B : C is:', '12 : 8 : 5', ['3 : 2 : 1', '3 : 2 : 5', '9 : 6 : 5'],
      'Remaining 4/5 is shared 3 : 2: A = 12/25, B = 8/25; C = 5/25. Ratio <b>12 : 8 : 5</b>.'),
    mcq('rc-008', 2, 'ratios', 'A and B are partners in the ratio 3 : 2. C is admitted and gets 1/4 share from A alone. The new ratio of A : B : C is:', '7 : 8 : 5', ['3 : 2 : 1', '1 : 2 : 1', '9 : 8 : 3'],
      'A = 3/5 − 1/4 = 7/20; B = 2/5 = 8/20; C = 5/20. Ratio <b>7 : 8 : 5</b>.', 'The 1/4 comes from A only; B\'s share stays at 2/5.'),
    mcq('rc-009', 2, 'ratios', 'A, B and C share 1/2, 1/3 and 1/6. They decide to share equally. Who sacrifices and who gains?', 'A sacrifices 1/6, C gains 1/6, B no change', ['A gains 1/6, C sacrifices 1/6', 'B sacrifices 1/6, C gains 1/6', 'All three gain'],
      'New: 1/3 each. A: 1/2 − 1/3 = 1/6 sacrificed. B: 1/3 − 1/3 = 0. C: 1/3 − 1/6 = 1/6 gained.'),
    mcq('rc-010', 2, 'revaluation', 'At the time of admission, the Revaluation Account is credited with:', 'increase in the value of an asset', ['decrease in the value of an asset', 'increase in a liability', 'goodwill brought in by the new partner'],
      'Gains go to the credit side: increase in assets and decrease in liabilities. Decrease in assets and increase in liabilities are debited.', 'Writing the sides of the revaluation account the wrong way round.'),
    mcq('rc-011', 2, 'revaluation', 'Building is appreciated by ₹20,000, stock is reduced by ₹8,000 and a provision for doubtful debts of ₹3,000 is created. The profit on revaluation is:', '₹9,000', ['₹31,000', '₹15,000', '₹11,000'],
      '20,000 − 8,000 − 3,000 = <b>₹9,000</b>.'),
    mcq('rc-012', 2, 'revaluation', 'The profit on revaluation of ₹9,000 is shared by A and B (3 : 2) before admission of C. A receives:', '₹5,400', ['₹3,600', '₹4,500', '₹9,000'],
      'Revaluation profit goes to the old partners in the <b>old ratio</b>: 3/5 × 9,000 = ₹5,400 (B gets 3,600).'),
    mcq('rc-013', 2, 'revaluation', 'The revaluation account is a:', 'nominal account', ['real account', 'personal account', 'memorandum account'],
      'It records gain or loss from revaluation, so it is a <b>nominal account</b>. Its balance is transferred to the old partners\' capital accounts.'),
    mcq('rc-014', 2, 'revaluation', 'Machinery of ₹2,00,000 is depreciated by 10% on revaluation. The effect is:', 'Revaluation A/c Dr ₹20,000; to Machinery A/c', ['Machinery A/c Dr ₹20,000; to Revaluation A/c', 'Revaluation A/c Dr ₹2,00,000', 'Capital A/c Dr ₹20,000; to Machinery A/c'],
      'Loss in value = 10% × 2,00,000 = 20,000. Revaluation A/c is debited, and the asset account credited.'),
    mcq('rc-015', 2, 'revaluation', 'An unrecorded investment of ₹10,000 is found at the time of admission. The entry is:', 'Investment A/c Dr; to Revaluation A/c', ['Revaluation A/c Dr; to Investment A/c', 'Investment A/c Dr; to New Partner\'s Capital A/c', 'No entry is made'],
      'A new asset raises profit: <b>Investment Dr, Revaluation Cr</b>.'),
    mcq('rc-016', 2, 'revaluation', 'An unrecorded liability of ₹6,000 is found. The entry is:', 'Revaluation A/c Dr; to Liability A/c', ['Liability A/c Dr; to Revaluation A/c', 'Capital A/c Dr; to Liability A/c', 'Revaluation A/c Cr; to Cash A/c'],
      'A liability is a loss to the old partners: <b>Revaluation A/c Dr, to Liability Cr</b>.'),
    mcq('rc-017', 2, 'reserves', 'At admission, the General Reserve of ₹60,000 is:', 'credited to the old partners\' capital accounts in the old ratio', ['credited to the new partner', 'shared in the new ratio', 'left untouched and shown as it is'],
      'Reserves and accumulated profits belong to the old partners, and are shared in the <b>old ratio</b>: General Reserve Dr, to old partners\' Capital A/cs.', 'If the reserve stays in the books, the new partner shares in it later without paying.'),
    mcq('rc-018', 2, 'reserves', 'A debit balance of the Profit and Loss Account is treated at admission as:', 'a loss, debited to the old partners in the old ratio', ['a loss, debited to the new partner only', 'a profit', 'an asset to be left'],
      'Accumulated losses are borne by the old partners in the old ratio: Old partners\' Capital A/cs Dr, to P&L A/c.'),
    mcq('rc-019', 3, 'capital', 'A and B have capitals of ₹6,00,000 and ₹4,00,000 (after all adjustments). C is admitted for 1/5 share, with no goodwill. C must bring capital of:', '₹2,50,000', ['₹2,00,000', '₹3,00,000', '₹1,00,000'],
      'Old partners hold 4/5 of the firm = 10,00,000, so the firm\'s total capital = 10,00,000 × 5/4 = 12,50,000. C\'s capital = 1/5 × 12,50,000 = <b>₹2,50,000</b>.', 'Taking 1/5 of 10,00,000 (₹2,00,000).'),
    mcq('rc-020', 2, 'goodwill', 'C brings ₹30,000 as goodwill. A and B sacrifice 3 : 2. A\'s capital account is credited with:', '₹18,000', ['₹12,000', '₹15,000', '₹30,000'],
      '30,000 × 3/5 = <b>₹18,000</b> (sacrificing ratio).'),
    mcq('rc-021', 3, 'goodwill', 'A and B share 3 : 2. C is admitted for 1/5 and pays his goodwill share in cash through the firm. A and B then withdraw their share of the goodwill. The entry for the withdrawal is:', 'A\'s and B\'s Capital A/cs Dr; to Bank A/c', ['Bank A/c Dr; to A\'s and B\'s Capital A/cs', 'Goodwill A/c Dr; to Bank A/c', 'No entry'],
      'The partners take the cash out, so their capital accounts are debited: <b>Capital A/cs Dr, to Bank A/c</b>.'),
    mcq('rc-022', 2, 'rules', 'A new partner can be admitted to the firm only with:', 'the consent of all existing partners, unless the deed says otherwise', ['the consent of the majority only', 'the consent of the Registrar of Firms', 'the order of a court'],
      'Under the Partnership Act a new person can be introduced into the firm only with the <b>consent of all partners</b>, unless there is an agreement otherwise.'),
    mcq('rc-023', 2, 'capital', 'A new partner\'s capital is adjusted so that the old partners\' capitals are in the new profit-sharing ratio. This is called:', 'capital adjustment', ['revaluation', 'dissolution', 'realisation'],
      'Adjusting capitals to match the new ratio is a <b>capital adjustment</b>; any excess is withdrawn and any shortage brought in.'),
    mcq('rc-024', 3, 'capital', 'A and B (3 : 2) have capitals of ₹3,00,000 and ₹2,00,000. C is admitted for 1/5 and the new capitals are made proportionate to the new ratio 12 : 8 : 5, based on C bringing ₹1,25,000. Total capital of the firm is:', '₹6,25,000', ['₹5,00,000', '₹6,00,000', '₹7,50,000'],
      'C has 5/25 share, i.e. 1/5, for ₹1,25,000. Total = 1,25,000 × 5 = <b>₹6,25,000</b>. Then A = 3,00,000 and B = 2,00,000, matching 12 : 8 in capital.'),
    mcq('rc-025', 2, 'ratios', 'A and B share profits equally. C is admitted for 1/5 share, which he takes equally from A and B. The new ratio of A : B : C is:', '2 : 2 : 1', ['1 : 1 : 1', '4 : 4 : 1', '3 : 3 : 2'],
      'C takes 1/10 from each: A = 1/2 − 1/10 = 4/10, B = 4/10, C = 2/10. Ratio 4 : 4 : 2 = <b>2 : 2 : 1</b>.'),
    mcq('rc-026', 1, 'ratios', 'When a new partner is admitted, the old partners generally:', 'sacrifice a part of their share of profit', ['gain additional share', 'keep the same shares and the new partner gets no share', 'leave the firm'],
      'The new partner\'s share has to come from the old partners, who therefore <b>sacrifice</b>.'),
    mcq('rc-027', 2, 'revaluation', 'Revaluation loss of ₹15,000 is shared by A, B and C (old ratio 3 : 2 : 1) before D\'s admission. A\'s share of the loss is:', '₹7,500', ['₹5,000', '₹2,500', '₹15,000'],
      'A = 3/6 × 15,000 = <b>₹7,500</b>.'),
    mcq('rc-028', 3, 'goodwill', 'A and B share 3 : 2. They admit C for a 1/4 share; A gives 1/10 and B gives 3/20. The sacrificing ratio of A and B is:', '2 : 3', ['3 : 2', '1 : 1', '3 : 1'],
      'A : B = 1/10 : 3/20 = 2/20 : 3/20 = <b>2 : 3</b>. Check: 2/20 + 3/20 = 5/20 = 1/4.', 'The sacrifice is not always in the old ratio.'),
    mcq('rc-029', 2, 'goodwill', 'Goodwill of ₹90,000 is raised and written off after the admission. Existing partners A and B are equal, C has 1/3 share. The entry to raise goodwill (before admission) credits:', 'A\'s and B\'s Capital A/cs in the old ratio', ['C\'s Capital A/c', 'A\'s and B\'s Capital A/cs in the new ratio', 'Revaluation A/c'],
      'Goodwill is raised for the old partners: Goodwill A/c Dr, to <b>old partners\' Capital A/cs (old ratio)</b>.'),
    mcq('rc-030', 2, 'adjustment', 'A and B (equal) now decide to share profits 3 : 2. Goodwill is ₹50,000. Which adjustment is correct?', 'A\'s Capital A/c Dr ₹5,000; to B\'s Capital A/c', ['B\'s Capital A/c Dr ₹5,000; to A\'s Capital A/c', 'A\'s Capital A/c Dr ₹10,000; to B\'s Capital A/c', 'No adjustment is needed'],
      'A\'s share rises from 1/2 to 3/5, so A gains 1/10 and B sacrifices 1/10. A compensates B: 1/10 × 50,000 = ₹5,000. <b>A\'s Capital A/c Dr, to B\'s Capital A/c.</b>', 'The gainer pays, the sacrificer receives.'),
  ],
  gens: [
    { id: 'rc-g01', type: 'mcq', level: 2, sub: 'ratios', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[3, 2], [2, 1], [3, 1], [4, 1], [5, 3], [3, 5]]), t = a + b;
        const x = choose(rng, [[1, 5], [1, 4], [1, 3], [1, 6]]);
        const gc = (p, q) => (q ? gc(q, p % q) : p);
        const g = (u, v, w) => { const k = gc(gc(u, v), w); return `${u / k} : ${v / k} : ${w / k}`; };
        const ra = a * (x[1] - x[0]), rb = b * (x[1] - x[0]), rc = x[0] * t;
        const correct = g(ra, rb, rc);
        const { options, answer } = shuffleOpts(rng, correct, [`${a} : ${b} : ${x[0]}`, g(rb, ra, rc), g(a, b, rc)], (v) => v);
        return { q: `A and B share profits ${a} : ${b}. They admit C for a ${x[0]}/${x[1]} share, which he takes from A and B in the old ratio. The new ratio of A : B : C is:`, options, answer, correct,
          sol: steps(`Old partners keep ${x[1] - x[0]}/${x[1]} of the firm, shared ${a} : ${b}.`, `A = ${a}/${t} × ${x[1] - x[0]}/${x[1]}, B = ${b}/${t} × ${x[1] - x[0]}/${x[1]}, C = ${x[0]}/${x[1]}.`, `New ratio = <b>${correct}</b>.`), trap: 'Do not just add C\'s share to the old ratio.' };
      } },
    { id: 'rc-g02', type: 'mcq', level: 2, sub: 'revaluation', ...T,
      make(rng) {
        const up = int(rng, 2, 10) * 5000, dn = int(rng, 1, 5) * 2000, pr = int(rng, 1, 4) * 1000;
        const net = up - dn - pr, r = choose(rng, [[3, 2], [2, 1], [1, 1], [3, 1]]);
        const a = (net * r[0]) / (r[0] + r[1]);
        const { options, answer } = shuffleOpts(rng, a, [(net * r[1]) / (r[0] + r[1]), net, up - dn], (v) => rs(v, 0));
        return { q: `On admission of C, the land is appreciated by ${rs(up, 0)}, stock is written down by ${rs(dn, 0)} and a provision for doubtful debts of ${rs(pr, 0)} is created. A and B share profits ${r[0]} : ${r[1]}. A's share of the revaluation profit is:`, options, answer, net, r,
          sol: steps(`Net revaluation profit = ${fmt(up, 0)} − ${fmt(dn, 0)} − ${fmt(pr, 0)} = ${fmt(net, 0)}.`, `A's share (old ratio) = ${r[0]}/${r[0] + r[1]} × ${fmt(net, 0)} = <b>${rs(a, 0)}</b>.`), trap: 'Revaluation is shared in the old ratio, not the new ratio.' };
      } },
    { id: 'rc-g03', type: 'mcq', level: 3, sub: 'capital', ...T,
      make(rng) {
        const u = choose(rng, [[1, 5], [1, 4], [1, 3]]), A = int(rng, 4, 12) * 50000, B = int(rng, 2, 8) * 50000;
        const tot = ((A + B) * u[1]) / (u[1] - u[0]), c = (tot * u[0]) / u[1];
        const { options, answer } = shuffleOpts(rng, c, [((A + B) * u[0]) / u[1], c + 50000, (A + B) / 2], (v) => rs(v, 0));
        return { q: `A and B have capitals of ${rs(A, 0)} and ${rs(B, 0)} (no goodwill). C is admitted for a ${u[0]}/${u[1]} share. The capital he must bring in is:`, options, answer, A, B, u,
          sol: steps(`Old partners hold ${u[1] - u[0]}/${u[1]} of the firm = ${fmt(A + B, 0)}.`, `Total capital = ${fmt(A + B, 0)} × ${u[1]}/${u[1] - u[0]} = ${fmt(tot, 0)}.`, `C's capital = ${u[0]}/${u[1]} × ${fmt(tot, 0)} = <b>${rs(c, 0)}</b>.`), trap: `Taking ${u[0]}/${u[1]} of the old total undercounts.` };
      },
      verify: (p) => rs(((p.A + p.B) * p.u[0]) / (p.u[1] - p.u[0]), 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'rc-g04', type: 'mcq', level: 2, sub: 'ratios', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[3, 2], [2, 1], [3, 1], [4, 1], [5, 3], [7, 3]]), t = a + b;
        const gc = (p, q) => (q ? gc(q, p % q) : p);
        const fr = (n, d) => { const k = gc(n, d); return `${n / k}/${d / k}`; };
        const x = fr(2 * a - t, 2 * t);
        const correct = `A sacrifices ${x} and B gains ${x}`;
        const { options, answer } = shuffleOpts(rng, correct, [`B sacrifices ${x} and A gains ${x}`, `A sacrifices ${fr(2 * a - t, t)} and B gains ${fr(2 * a - t, t)}`, 'Nobody gains or sacrifices'], (v) => v);
        return { q: `A and B share profits ${a} : ${b} and decide to share equally in future. Which is correct?`, options, answer,
          sol: steps(`Old: A = ${a}/${t}, B = ${b}/${t}. New: 1/2 each.`, `A: ${a}/${t} − 1/2 = ${x} (more than 1/2 before, so sacrificed).`, `<b>${correct}</b>.`), trap: 'A partner whose new share is smaller is the one who sacrifices.' };
      } },
    { id: 'rc-g05', type: 'mcq', level: 2, sub: 'goodwill', ...T,
      make(rng) {
        const sacr = choose(rng, [[3, 2], [2, 1], [3, 1], [1, 1], [4, 1]]), prem = int(rng, 2, 20) * 10000, t = sacr[0] + sacr[1];
        const b = (prem * sacr[1]) / t;
        const { options, answer } = shuffleOpts(rng, b, [(prem * sacr[0]) / t, prem, prem / 2 + 1], (v) => rs(v, 0));
        return { q: `C is admitted and pays ${rs(prem, 0)} as goodwill premium through the firm. A and B sacrifice in the ratio ${sacr[0]} : ${sacr[1]}. The amount credited to B's capital account is:`, options, answer, prem, sacr,
          sol: steps(`Premium is shared in the sacrificing ratio.`, `B = ${sacr[1]}/${t} × ${fmt(prem, 0)} = <b>${rs(b, 0)}</b>.`), trap: 'The new partner is not credited.' };
      } },
  ],
};
