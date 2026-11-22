// CUET Accountancy: issue and forfeiture of shares. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'share-capital',
  items: [
    mcq('sc-001', 1, 'terms', 'Authorised capital of a company is:', 'the maximum capital it can issue, as stated in its Memorandum', ['the capital actually issued to the public', 'the capital called up from shareholders', 'the capital actually paid by shareholders'],
      'Authorised (registered or nominal) capital is the ceiling stated in the Memorandum of Association.'),
    mcq('sc-002', 1, 'terms', 'Which part of the issued capital has been actually asked for from shareholders?', 'Called-up capital', ['Authorised capital', 'Reserve capital', 'Uncalled capital'],
      'Called-up capital is the part of the face value the company has demanded. The rest is uncalled.'),
    mcq('sc-003', 1, 'terms', 'Calls in arrears are:', 'the amount called but not paid by shareholders', ['the amount paid before it is called', 'the amount of premium', 'the discount allowed on issue'],
      'Calls in arrears = called-up amount that the shareholders <b>failed to pay</b>. Paid in advance is "calls in advance".', 'Mixing up arrears (unpaid) and advance (early).'),
    mcq('sc-004', 1, 'entries', 'Application money received is recorded as:', 'Bank A/c Dr; to Share Application A/c', ['Share Capital A/c Dr; to Bank A/c', 'Share Application A/c Dr; to Bank A/c', 'Bank A/c Dr; to Share Capital A/c'],
      'The money is first kept in <b>Share Application A/c</b> until the shares are allotted.'),
    mcq('sc-005', 2, 'entries', 'On allotment of shares, the application money of the accepted applications is:', 'transferred from Share Application A/c to Share Capital A/c', ['credited to Securities Premium A/c', 'refunded to all applicants', 'debited to Bank A/c'],
      'Entry: Share Application A/c Dr; to Share Capital A/c (and Securities Premium, if premium was called with application). Money of rejected applicants is refunded.'),
    mcq('sc-006', 2, 'law', 'Under the Companies Act, 2013, a company cannot generally issue shares at:', 'a discount (except sweat equity shares)', ['a premium', 'par', 'a price decided by its board'],
      'Section 53 prohibits issuing shares at a discount (sweat equity is an exception). Issue at par or premium is allowed.'),
    mcq('sc-007', 2, 'premium', 'A company issues 10,000 shares of ₹10 each at ₹12. The Securities Premium Account is credited with:', '₹20,000', ['₹1,20,000', '₹2,000', '₹10,000'],
      'Premium = (12 − 10) × 10,000 = <b>₹20,000</b>.', 'Giving the premium per share, not the total.'),
    mcq('sc-008', 2, 'premium', 'Under Section 52 of the Companies Act, 2013, the balance in the Securities Premium Account may NOT be used for:', 'payment of dividend', ['issue of fully paid bonus shares', 'writing off preliminary expenses', 'writing off the discount on issue of debentures'],
      'Allowed uses include bonus shares, preliminary expenses, issue expenses, discount or commission on issue, premium on redemption, and buy-back. <b>Dividend</b> is not allowed.'),
    mcq('sc-009', 2, 'premium', 'Where is the Securities Premium shown in the balance sheet?', 'Under Reserves and Surplus in Shareholders\' funds', ['Under Share capital as paid-up capital', 'Under Non-current liabilities', 'Under Current assets'],
      'It is a capital reserve in nature and appears under <b>Reserves and Surplus</b>, not under paid-up capital.'),
    mcq('sc-010', 2, 'allotment', 'Applications were received for 60,000 shares and 48,000 shares were allotted pro rata. An applicant for 500 shares gets:', '400 shares', ['480 shares', '300 shares', '250 shares'],
      'Ratio = 48,000 : 60,000 = 4 : 5. 500 × 4/5 = <b>400 shares</b>.'),
    mcq('sc-011', 2, 'allotment', 'An applicant applies for 1,000 shares at ₹3 per share application money and is allotted 800 shares. The excess application money is:', '₹600', ['₹200', '₹3,000', '₹2,400'],
      'Excess = 200 shares × ₹3 = <b>₹600</b>, adjusted against the allotment money due.', 'Excess shares times the application rate.'),
    mcq('sc-012', 3, 'allotment', 'An applicant for 300 shares gets 200 shares. Application money was ₹4 per share and allotment is ₹5 per share. The cash to be paid on allotment is:', '₹600', ['₹1,000', '₹1,500', '₹400'],
      'Allotment due = 200 × 5 = 1,000. Excess application money = 100 × 4 = 400. Cash payable = 1,000 − 400 = <b>₹600</b>.'),
    mcq('sc-013', 2, 'forfeiture', '100 shares of ₹10 each (₹8 called up) were forfeited after ₹5 per share was paid. The amount credited to Forfeited Shares A/c is:', '₹500', ['₹800', '₹1,000', '₹300'],
      'Forfeited Shares A/c is credited with the amount <b>actually received</b>: 100 × 5 = ₹500.', 'Using the called-up amount (₹800).'),
    mcq('sc-014', 2, 'forfeiture', 'The forfeiture entry for 100 shares (₹10 each, ₹8 called, ₹5 paid) is:', 'Share Capital Dr ₹800; to Forfeited Shares ₹500; to Calls in Arrears ₹300', ['Share Capital Dr ₹1,000; to Forfeited Shares ₹500; to Calls in Arrears ₹500', 'Share Capital Dr ₹500; to Forfeited Shares ₹500', 'Forfeited Shares Dr ₹500; to Share Capital ₹500'],
      'Share Capital is debited with the <b>called-up</b> amount (800). Credits: forfeited (received 500) and calls in arrears (unpaid 300).'),
    mcq('sc-015', 3, 'forfeiture', 'Shares of ₹10 are issued at a premium of ₹2. Application ₹3, allotment ₹5 (including premium). A holder of 50 shares pays only the application money and the shares are forfeited. Securities Premium A/c is:', 'debited by ₹100', ['credited by ₹100', 'debited by ₹250', 'not affected'],
      'The holder never paid the premium (2 × 50 = 100), so on forfeiture the premium recorded as due is <b>debited</b> to Securities Premium A/c. Forfeited Shares gets 3 × 50 = ₹150.', 'If the premium had been received, it is not touched on forfeiture.'),
    mcq('sc-016', 3, 'forfeiture', 'If the premium has been received on shares before they are forfeited, the Securities Premium A/c on forfeiture is:', 'not debited', ['debited with the premium', 'credited again', 'transferred to Forfeited Shares A/c'],
      'Premium already received is the company\'s gain and <b>stays</b> in Securities Premium; only unpaid premium is cancelled.'),
    mcq('sc-017', 3, 'reissue', '100 shares of ₹10 each, fully called and ₹6 paid, are forfeited and reissued at ₹8 per share as fully paid. The Capital Reserve is:', '₹400', ['₹600', '₹200', '₹800'],
      'Forfeited balance = 6 × 100 = 600. Discount on reissue = (10 − 8) × 100 = 200. Capital reserve = 600 − 200 = <b>₹400</b>.'),
    mcq('sc-018', 2, 'reissue', 'The maximum discount at which forfeited shares can be reissued is limited to:', 'the amount received on the forfeited shares', ['the face value of the shares', 'the premium originally charged', 'nothing; any discount is allowed'],
      'The loss on reissue is met from the Forfeited Shares A/c, so the discount cannot exceed the <b>amount forfeited</b>.'),
    mcq('sc-019', 2, 'reissue', 'The profit on reissue of forfeited shares is transferred to:', 'Capital Reserve', ['Securities Premium A/c', 'Profit and Loss A/c', 'General Reserve'],
      'The balance left in Forfeited Shares A/c after the discount is a capital profit: Forfeited Shares A/c Dr; to <b>Capital Reserve</b>.'),
    mcq('sc-020', 2, 'reissue', 'On reissue of forfeited shares at a discount, the discount is:', 'debited to Forfeited Shares A/c', ['debited to Securities Premium A/c', 'debited to Profit and Loss A/c', 'credited to Capital Reserve'],
      'Entry: Bank A/c Dr; Forfeited Shares A/c Dr (discount); to Share Capital A/c.'),
    mcq('sc-021', 2, 'other than cash', 'A company buys machinery of ₹5,00,000 and pays by issuing ₹100 shares at a 25% premium. The number of shares issued is:', '4,000', ['5,000', '6,250', '3,200'],
      'Each share is issued at 125. 5,00,000 ÷ 125 = <b>4,000</b> shares (capital ₹4,00,000, premium ₹1,00,000).', 'Dividing by 100 gives 5,000, ignoring the premium.'),
    mcq('sc-022', 2, 'terms', 'Reserve capital is:', 'the part of uncalled capital that is to be called only on winding up', ['profit kept aside as a reserve', 'capital earned from forfeited shares', 'premium on shares'],
      'Reserve capital is uncalled capital reserved for winding up. It is different from <b>capital reserve</b>, which is profit of a capital nature.'),
    mcq('sc-023', 2, 'terms', 'Preference shareholders differ from equity shareholders because they:', 'get a fixed dividend and are paid before equity shareholders', ['have more voting rights', 'always get higher dividends', 'cannot be redeemed'],
      'Preference shares carry a fixed rate of dividend and priority both for dividend and for repayment of capital.'),
    mcq('sc-024', 2, 'issued amount', '5,000 shares of ₹10 each are issued at ₹2 premium. Application ₹3, allotment ₹5 (including premium) and the first and final call ₹4. Total amount received on all calls (with premium) is:', '₹60,000', ['₹50,000', '₹45,000', '₹70,000'],
      '3 + 5 + 4 = 12 per share × 5,000 = <b>₹60,000</b> (share capital 50,000 and premium 10,000).'),
    mcq('sc-025', 2, 'terms', 'The amount received from a shareholder before a call is due is credited to:', 'Calls in Advance A/c', ['Calls in Arrears A/c', 'Share Capital A/c', 'Securities Premium A/c'],
      'It is not capital yet, but a liability: Bank Dr; to <b>Calls in Advance A/c</b>.'),
    mcq('sc-026', 3, 'terms', '1,00,000 shares of ₹10 are issued and 90,000 subscribed. ₹8 per share is called up and ₹20,000 is in arrears. Paid-up capital is:', '₹7,00,000', ['₹7,20,000', '₹9,00,000', '₹8,00,000'],
      'Called-up = 90,000 × 8 = 7,20,000. Paid-up = 7,20,000 − 20,000 = <b>₹7,00,000</b>.', 'Subscribed capital is based on shares applied for and allotted, not those issued.'),
    mcq('sc-027', 2, 'forfeiture', 'Shares may be forfeited when a shareholder:', 'fails to pay a call after notice, as the Articles provide', ['sells his shares', 'votes against the board', 'pays early'],
      'Forfeiture is the cancellation of shares for <b>non-payment of calls</b>, after proper notice, as the Articles of Association allow.'),
    mcq('sc-028', 2, 'balance sheet', 'Calls in arrears are shown in the notes to the balance sheet as:', 'a deduction from subscribed capital called up', ['an asset', 'an addition to reserves', 'a current liability'],
      'They are shown as a <b>deduction from called-up capital</b>, giving the paid-up amount.'),
    mcq('sc-029', 3, 'forfeiture', 'Shares ₹10 each, fully called, are forfeited when ₹7 per share has been paid. Total forfeited shares 200. They are reissued at ₹9 fully paid. The Capital Reserve on the reissue is:', '₹1,200', ['₹1,400', '₹1,000', '₹200'],
      'Forfeited balance = 7 × 200 = 1,400. Discount = (10 − 9) × 200 = 200. Capital reserve = <b>₹1,200</b>.'),
    mcq('sc-030', 2, 'entries', 'The call money received on a share is credited to:', 'Share Capital A/c (and Securities Premium for the premium part)', ['Bank A/c', 'Calls in Arrears A/c', 'Forfeited Shares A/c'],
      'First, Share Allotment/Call A/c Dr; to Share Capital A/c (and Premium). Then Bank Dr; to Call A/c as money comes in.'),
  ],
  gens: [
    { id: 'sc-g01', type: 'mcq', level: 2, sub: 'premium', ...T,
      make(rng) {
        const num = int(rng, 2, 20) * 1000, f = choose(rng, [10, 100]), pr = choose(rng, [2, 5, 10, 20, 25]), p = f === 10 ? choose(rng, [1, 2, 3, 4]) : pr;
        const tot = num * p;
        const { options, answer } = shuffleOpts(rng, tot, [num * (f + p), p, num * f], (v) => rs(v, 0));
        return { q: `A company issues ${fmt(num, 0)} shares of ${rs(f, 0)} each at ${rs(f + p, 0)} per share. The amount credited to Securities Premium A/c is:`, options, answer, num, f, p,
          sol: steps(`Premium per share = ${f + p} − ${f} = ${p}.`, `Total = ${fmt(num, 0)} × ${p} = <b>${rs(tot, 0)}</b>.`), trap: 'Premium is the issue price minus face value, for all the shares.' };
      },
      verify: (p) => rs(p.num * p.p, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'sc-g02', type: 'mcq', level: 2, sub: 'forfeiture', ...T,
      make(rng) {
        const num = int(rng, 2, 20) * 50, f = 10, cl = choose(rng, [8, 9, 10]), paid = int(rng, 3, cl - 1);
        const cr = num * paid;
        const { options, answer } = shuffleOpts(rng, cr, [num * cl, num * f, num * (cl - paid)], (v) => rs(v, 0));
        return { q: `${fmt(num, 0)} shares of ₹10 each (₹${cl} called up) are forfeited after the holder has paid ₹${paid} per share. The amount credited to Forfeited Shares A/c is:`, options, answer, num, paid,
          sol: steps(`Forfeited Shares A/c is credited with the amount received.`, `${fmt(num, 0)} × ${paid} = <b>${rs(cr, 0)}</b>.`), trap: 'Not the called-up amount and not the face value.' };
      },
      verify: (p) => rs(p.num * p.paid, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'sc-g03', type: 'mcq', level: 3, sub: 'reissue', ...T,
      make(rng) {
        const num = int(rng, 2, 20) * 50, paid = int(rng, 5, 8), r = int(rng, 10 - paid + 1, 9), disc = 10 - r;
        const cr = num * (paid - disc);
        const { options, answer } = shuffleOpts(rng, cr, [num * paid, num * disc, num * (paid + disc)], (v) => rs(v, 0));
        return { q: `${fmt(num, 0)} shares of ₹10 each, fully called and ₹${paid} paid, were forfeited. All are reissued at ₹${r} per share as fully paid. The amount transferred to Capital Reserve is:`, options, answer, num, paid, disc,
          sol: steps(`Forfeited balance = ${fmt(num, 0)} × ${paid} = ${fmt(num * paid, 0)}.`, `Discount on reissue = ${fmt(num, 0)} × (10 − ${r}) = ${fmt(num * disc, 0)}.`, `Capital reserve = ${fmt(num * paid, 0)} − ${fmt(num * disc, 0)} = <b>${rs(cr, 0)}</b>.`), trap: 'Only what remains after the discount goes to Capital Reserve.' };
      },
      verify: (p) => rs(p.num * (p.paid - p.disc), 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'sc-g04', type: 'mcq', level: 2, sub: 'allotment', ...T,
      make(rng) {
        const ap = int(rng, 3, 10) * 100, al = ap * int(rng, 5, 9) / 10, am = choose(rng, [2, 3, 4, 5]);
        const ex = (ap - al) * am;
        const { options, answer } = shuffleOpts(rng, ex, [ap * am, al * am, ex + am * 100], (v) => rs(v, 0));
        return { q: `An applicant applied for ${fmt(ap, 0)} shares and was allotted ${fmt(al, 0)} shares. Application money was ${rs(am, 0)} per share. The excess application money to be adjusted or refunded is:`, options, answer, ap, al, am,
          sol: steps(`Shares not allotted = ${fmt(ap, 0)} − ${fmt(al, 0)} = ${fmt(ap - al, 0)}.`, `Excess money = ${fmt(ap - al, 0)} × ${am} = <b>${rs(ex, 0)}</b>.`), trap: 'Excess applies to the shares not allotted.' };
      },
      verify: (p) => rs((p.ap - p.al) * p.am, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'sc-g05', type: 'mcq', level: 2, sub: 'other than cash', ...T,
      make(rng) {
        const pm = choose(rng, [10, 20, 25, 50]), cons = int(rng, 2, 10) * 100000 * (100 + pm) / 100 / 100 * 100;
        const issuePrice = 100 + pm, num = cons / issuePrice;
        const { options, answer } = shuffleOpts(rng, num, [cons / 100, cons / (100 - pm), num + 100], (v) => fmt(v, 0));
        return { q: `A company buys land for ${rs(cons, 0)} and pays by issuing ₹100 shares at a ${pm}% premium. The number of shares issued is:`, options, answer, cons, pm,
          sol: steps(`Issue price = 100 + ${pm} = ${issuePrice}.`, `Shares = ${fmt(cons, 0)} ÷ ${issuePrice} = <b>${fmt(num, 0)}</b>.`), trap: 'Divide by the issue price, not by the face value.' };
      },
      verify: (p) => fmt(p.cons / (100 + p.pm), 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'sc-g06', type: 'mcq', level: 3, sub: 'allotment', ...T,
      make(rng) {
        const ap = int(rng, 3, 10) * 100, al = ap * int(rng, 5, 9) / 10, am = choose(rng, [2, 3, 4]), at = choose(rng, [3, 4, 5, 6]);
        const cash = al * at - (ap - al) * am;
        const { options, answer } = shuffleOpts(rng, cash, [al * at, al * at + (ap - al) * am, ap * at], (v) => rs(v, 0));
        return { q: `An applicant applied for ${fmt(ap, 0)} shares and got ${fmt(al, 0)}. Application money was ${rs(am, 0)} and allotment money is ${rs(at, 0)} per share. The cash he must pay on allotment is:`, options, answer, ap, al, am, at,
          sol: steps(`Allotment due = ${fmt(al, 0)} × ${at} = ${fmt(al * at, 0)}.`, `Excess application money = ${fmt(ap - al, 0)} × ${am} = ${fmt((ap - al) * am, 0)}.`, `Cash to pay = <b>${rs(cash, 0)}</b>.`), trap: 'Subtract the excess application money from the amount due.' };
      },
      verify: (p) => rs(p.al * p.at - (p.ap - p.al) * p.am, 0) === p.options[p.answer] ? p.answer : -1 },
  ],
};
