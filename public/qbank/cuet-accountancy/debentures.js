// CUET Accountancy: issue of debentures. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'debentures',
  items: [
    mcq('db-001', 1, 'meaning', 'A debenture is:', 'a certificate acknowledging a debt of the company, usually with a fixed rate of interest', ['a share in the ownership of the company', 'a bank guarantee', 'a type of reserve'],
      'Debenture holders are <b>creditors</b> of the company, not owners.'),
    mcq('db-002', 1, 'meaning', 'Debenture holders are the company\'s:', 'creditors', ['owners', 'directors', 'partners'],
      'They lend money and get interest, so they are creditors. Shareholders are the owners.'),
    mcq('db-003', 2, 'interest', 'Interest on debentures is:', 'a charge against profit, payable even if there is a loss', ['an appropriation of profit, paid only from profit', 'paid only when dividend is declared', 'a part of capital'],
      'It is a finance cost in the Statement of Profit and Loss, due whether or not the company earns a profit.', 'Dividends on shares are appropriations; interest on debentures is not.'),
    mcq('db-004', 2, 'interest', 'The company has ₹10,00,000, 9% debentures. Interest for six months is:', '₹45,000', ['₹90,000', '₹9,000', '₹4,500'],
      '10,00,000 × 9% × 6/12 = <b>₹45,000</b>.'),
    mcq('db-005', 2, 'at par', 'Debentures of ₹1,00,000 are issued at par and the money is received. The entry is:', 'Bank A/c Dr ₹1,00,000; to Debentures A/c ₹1,00,000', ['Debentures A/c Dr; to Bank A/c', 'Bank A/c Dr; to Securities Premium', 'Bank A/c Dr; to Share Capital A/c'],
      'The company receives cash and creates a liability: <b>Bank Dr; Debentures Cr</b>.'),
    mcq('db-006', 2, 'premium', '4,000 debentures of ₹100 each are issued at 10% premium. Total cash received is:', '₹4,40,000', ['₹4,00,000', '₹3,60,000', '₹44,000'],
      'Issue price = 110. 4,000 × 110 = <b>₹4,40,000</b>. Premium ₹40,000 is credited to Securities Premium A/c.'),
    mcq('db-007', 2, 'premium', 'Premium received on issue of debentures is credited to:', 'Securities Premium A/c', ['Debentures A/c', 'Profit and Loss A/c', 'Capital Reserve'],
      'It is a capital receipt: Bank Dr; to Debentures A/c and to <b>Securities Premium A/c</b>.'),
    mcq('db-008', 2, 'discount', '5,000 debentures of ₹100 are issued at 6% discount. The discount on issue is:', '₹30,000', ['₹5,000', '₹6,000', '₹3,000'],
      '6% × 100 = ₹6 per debenture × 5,000 = <b>₹30,000</b>. Cash received = ₹4,70,000.'),
    mcq('db-009', 2, 'discount', 'The entry for debentures of ₹5,00,000 issued at 6% discount is:', 'Bank Dr ₹4,70,000; Discount on Issue of Debentures Dr ₹30,000; to Debentures ₹5,00,000', ['Bank Dr ₹5,00,000; to Debentures ₹4,70,000; to Discount ₹30,000', 'Bank Dr ₹4,70,000; to Debentures ₹4,70,000', 'Bank Dr ₹5,30,000; to Debentures ₹5,00,000'],
      'Debentures are recorded at <b>face value</b>; the discount is debited as a loss (to be written off).', 'Recording debentures at the amount received.'),
    mcq('db-010', 2, 'discount', 'Unlike shares, debentures may be issued at a discount because:', 'there is no legal prohibition on issuing debentures at a discount', ['debenture holders are owners', 'the Act allows discount on shares', 'it is compulsory'],
      'Section 53 bans discount on <b>shares</b>, not on debentures. The discount is a capital loss written off over time or from Securities Premium.'),
    mcq('db-011', 2, 'discount', 'Discount on issue of debentures can be written off against:', 'Securities Premium Account or Profit and Loss', ['Capital Reserve only', 'General Reserve only', 'Share capital'],
      'It is a capital loss and may be written off out of securities premium (Section 52) or charged to the P&L.'),
    mcq('db-012', 3, 'redeemable at premium', 'Debentures of ₹1,00,000 are issued at par and are redeemable at a 5% premium. The loss on issue of debentures is:', '₹5,000', ['₹1,00,000', '₹10,000', 'nil'],
      'The company must pay 1,05,000 on redemption but receives only 1,00,000. Loss on issue = <b>₹5,000</b>.', 'The loss exists even when issued at par.'),
    mcq('db-013', 3, 'redeemable at premium', 'Debentures of ₹1,00,000 are issued at par and are redeemable at 5% premium. The entry on issue is:', 'Bank Dr 1,00,000; Loss on Issue Dr 5,000; to Debentures 1,00,000; to Premium on Redemption 5,000', ['Bank Dr 1,05,000; to Debentures 1,00,000; to Securities Premium 5,000', 'Bank Dr 1,00,000; to Debentures 1,00,000', 'Loss on Issue Dr 5,000; to Bank 5,000'],
      'A liability for the premium on redemption is created: <b>Loss on issue Dr; to Premium on Redemption of Debentures A/c</b>.'),
    mcq('db-014', 3, 'redeemable at premium', '2,000 debentures of ₹100 are issued at ₹95 and redeemable at ₹105. The total loss on issue is:', '₹20,000', ['₹10,000', '₹30,000', '₹2,000'],
      'Per debenture: discount 5 + premium on redemption 5 = 10. × 2,000 = <b>₹20,000</b>.'),
    mcq('db-015', 2, 'other than cash', 'Machinery of ₹5,50,000 is bought by issuing 10% debentures of ₹100 each at a 10% premium. The face value of debentures issued is:', '₹5,00,000', ['₹5,50,000', '₹4,95,000', '₹6,05,000'],
      'Issue price is 110. Number = 5,50,000 ÷ 110 = 5,000. Face value = 5,000 × 100 = <b>₹5,00,000</b> and premium ₹50,000.', 'Dividing the price by 100 gives 5,500 debentures.'),
    mcq('db-016', 2, 'other than cash', 'On purchase of machinery by issue of debentures, the entry to record the purchase first is:', 'Machinery A/c Dr; to Vendor A/c', ['Vendor A/c Dr; to Debentures A/c', 'Debentures Dr; to Bank', 'Bank Dr; to Machinery'],
      'First the asset and liability to the vendor are booked; then <b>Vendor Dr; to Debentures (and Securities Premium)</b>.'),
    mcq('db-017', 2, 'collateral', 'Debentures issued as collateral security are:', 'a secondary security for a loan, not an actual issue for cash', ['sold to the public for cash', 'redeemed immediately', 'treated as a share capital'],
      'They are only additional security. The company does not receive money for them, and interest is not payable on them unless the loan fails.', 'Treating them as an ordinary issue.'),
    mcq('db-018', 3, 'collateral', 'A company takes a bank loan of ₹5,00,000 and gives ₹6,00,000 debentures as collateral security. Under the usual treatment, the debentures are:', 'disclosed by a note, with no liability recorded for them separately', ['shown as an additional liability of ₹6,00,000', 'treated as capital', 'ignored without disclosure'],
      'The loan is the liability. Debentures given as collateral are only <b>disclosed in a note</b> (or entered through Debenture Suspense, which is also taught).', 'Adding them to the loan liability.'),
    mcq('db-019', 2, 'types', 'Debentures that can be exchanged for equity shares are called:', 'convertible debentures', ['secured debentures', 'bearer debentures', 'irredeemable debentures'],
      'Convertible debentures can be changed into shares after a stated time.'),
    mcq('db-020', 2, 'types', 'Debentures which are secured by a charge on the assets of the company are:', 'secured debentures', ['unsecured debentures', 'bearer debentures', 'perpetual shares'],
      'Secured debentures carry a charge on the company\'s assets.'),
    mcq('db-021', 2, 'balance sheet', 'Long-term debentures are shown in the balance sheet under:', 'Non-current liabilities (long-term borrowings)', ['Shareholders\' funds', 'Current assets', 'Reserves and surplus'],
      'They are borrowings of the company, so <b>long-term borrowings</b> under non-current liabilities.'),
    mcq('db-022', 2, 'application', 'Debentures of ₹100 are issued payable ₹30 on application, ₹40 on allotment and the balance on the first call. The call per debenture is:', '₹30', ['₹40', '₹70', '₹100'],
      '100 − 30 − 40 = <b>₹30</b>.'),
    mcq('db-023', 2, 'interest', 'Interest on 8% debentures of ₹5,00,000 for a full year is ₹40,000. When it is paid, the entry is:', 'Debenture Interest A/c Dr; to Bank A/c', ['Debentures A/c Dr; to Bank A/c', 'Bank A/c Dr; to Debenture Interest A/c', 'Profit and Loss A/c Cr'],
      'Interest paid is an expense: <b>Debenture Interest Dr; to Bank</b>, then the interest account is transferred to P&L.'),
    mcq('db-024', 3, 'writing off', 'Loss on issue of debentures of ₹20,000 is shown in the balance sheet as:', 'an asset (unamortised loss) until written off', ['a liability', 'a reserve', 'part of shareholders\' funds'],
      'It is a deferred expense, an asset, until written off from profit or from securities premium.'),
    mcq('db-025', 2, 'issue price', 'Debentures of ₹100 are issued at 105. This is an issue at a:', 'premium of 5%', ['discount of 5%', 'par', 'discount of 105%'],
      'Issue price above face value = premium. 105 − 100 = 5, so <b>5% premium</b>.'),
    mcq('db-026', 2, 'discount', '8,000 debentures of ₹100 are issued at ₹92. Total cash received is:', '₹7,36,000', ['₹8,00,000', '₹64,000', '₹8,64,000'],
      '8,000 × 92 = <b>₹7,36,000</b>. Discount = 8,000 × 8 = ₹64,000.'),
    mcq('db-027', 2, 'over-subscription', 'Applications for debentures are for 12,000 and 10,000 are issued. The excess application money is:', 'adjusted against allotment or refunded', ['credited to Securities Premium', 'forfeited by the company', 'credited to General Reserve'],
      'Money of rejected or excess applications is <b>refunded or adjusted</b> against the allotment due.'),
    mcq('db-028', 2, 'meaning', 'Which is a feature of debentures but not of equity shares?', 'A fixed rate of interest', ['Voting rights', 'Ownership of the company', 'A share in residual profit'],
      'Debenture holders receive a <b>fixed rate of interest</b> and no vote.'),
    mcq('db-029', 3, 'redeemable at premium', '5,000 debentures of ₹100 are issued at 4% discount and are redeemable at 10% premium. The total loss on issue is:', '₹70,000', ['₹20,000', '₹50,000', '₹30,000'],
      'Discount = 4 × 5,000 = 20,000. Premium on redemption = 10 × 5,000 = 50,000. Total = <b>₹70,000</b>.'),
    mcq('db-030', 3, 'redeemable at premium', 'Debentures worth ₹2,00,000 are issued at a 2% premium and are redeemable at a 5% premium. The loss on issue is:', '₹10,000', ['₹6,000', '₹14,000', '₹4,000'],
      'The premium on redemption (₹10,000) is a loss. The premium received on issue (₹4,000) goes to Securities Premium and does not reduce it. Loss = <b>₹10,000</b>.', 'Netting the premium on issue against it.'),
  ],
  gens: [
    { id: 'db-g01', type: 'mcq', level: 2, sub: 'premium', ...T,
      make(rng) {
        const num = int(rng, 2, 20) * 500, p = choose(rng, [2, 4, 5, 10, 20]), tot = (num * (100 + p)) / 1;
        const { options, answer } = shuffleOpts(rng, tot, [num * 100, num * p, num * (100 - p)], (v) => rs(v, 0));
        return { q: `${fmt(num, 0)} debentures of ₹100 each are issued at ${p}% premium. The total cash received is:`, options, answer, num, p,
          sol: steps(`Issue price = 100 + ${p} = ${100 + p}.`, `Cash = ${fmt(num, 0)} × ${100 + p} = <b>${rs(tot, 0)}</b>.`), trap: 'Premium is received over and above the face value.' };
      },
      verify: (p) => rs(p.num * (100 + p.p), 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'db-g02', type: 'mcq', level: 2, sub: 'discount', ...T,
      make(rng) {
        const num = int(rng, 2, 20) * 500, d = choose(rng, [2, 4, 5, 6, 8, 10]), disc = num * d;
        const { options, answer } = shuffleOpts(rng, disc, [num * (100 - d), num * 100, disc / 2], (v) => rs(v, 0));
        return { q: `${fmt(num, 0)} debentures of ₹100 each are issued at ${d}% discount. The amount of discount on issue is:`, options, answer, num, d,
          sol: steps(`Discount per debenture = ${d}% of 100 = ${d}.`, `Total = ${fmt(num, 0)} × ${d} = <b>${rs(disc, 0)}</b>.`), trap: 'Do not confuse the discount with the cash received.' };
      },
      verify: (p) => rs(p.num * p.d, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'db-g03', type: 'mcq', level: 3, sub: 'redeemable at premium', ...T,
      make(rng) {
        const num = int(rng, 2, 20) * 500, d = choose(rng, [0, 2, 4, 5]), r = choose(rng, [5, 10]);
        const loss = num * (d + r);
        const { options, answer } = shuffleOpts(rng, loss, [num * r, num * d + 1000, num * Math.abs(r - d) + 2000], (v) => rs(v, 0));
        return { q: `${fmt(num, 0)} debentures of ₹100 are issued at ${d === 0 ? 'par' : `a ${d}% discount`} and are redeemable at a ${r}% premium. The total loss on issue of debentures is:`, options, answer, num, d, r,
          sol: steps(`Loss per debenture = discount ${d} + premium on redemption ${r} = ${d + r}.`, `Total = ${fmt(num, 0)} × ${d + r} = <b>${rs(loss, 0)}</b>.`), trap: 'Both the discount and the redemption premium are losses.' };
      },
      verify: (p) => rs(p.num * (p.d + p.r), 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'db-g04', type: 'mcq', level: 2, sub: 'interest', ...T,
      make(rng) {
        const fv = int(rng, 2, 20) * 100000, r = choose(rng, [8, 9, 10, 12]), m = choose(rng, [3, 6, 9, 12]);
        const i = (fv * r * m) / 1200;
        const { options, answer } = shuffleOpts(rng, i, [(fv * r) / 100, (fv * r * (12 - m)) / 1200 + 500, i / 2], (v) => rs(v, 0));
        return { q: `A company has ${r}% debentures of ${rs(fv, 0)}. Interest for ${m} months is:`, options, answer, fv, r, m,
          sol: steps(`Interest = face value × rate × time.`, `${fmt(fv, 0)} × ${r}% × ${m}/12 = <b>${rs(i, 0)}</b>.`), trap: 'Interest is on the face value of the debentures.' };
      },
      verify: (p) => rs((p.fv * p.r * p.m) / 1200, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'db-g05', type: 'mcq', level: 2, sub: 'other than cash', ...T,
      make(rng) {
        const pm = choose(rng, [10, 20, 25]), num = int(rng, 2, 20) * 500, cons = num * (100 + pm);
        const { options, answer } = shuffleOpts(rng, num * 100, [cons, cons / 100 * 100 - num * pm - 1000, num * 100 + 10000], (v) => rs(v, 0));
        return { q: `A company buys a building for ${rs(cons, 0)} and pays by issuing debentures of ₹100 each at a ${pm}% premium. The face value of the debentures issued is:`, options, answer, cons, pm,
          sol: steps(`Issue price = ${100 + pm}.`, `Number = ${fmt(cons, 0)} ÷ ${100 + pm} = ${fmt(num, 0)}.`, `Face value = ${fmt(num, 0)} × 100 = <b>${rs(num * 100, 0)}</b>.`), trap: 'The price paid includes the premium.' };
      },
      verify: (p) => rs((p.cons / (100 + p.pm)) * 100, 0) === p.options[p.answer] ? p.answer : -1 },
  ],
};
