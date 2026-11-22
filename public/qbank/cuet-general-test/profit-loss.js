// CUET General Test: profit, loss and discount. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'profit-loss',
  items: [
    mk('pl-001', 1, 'basics', 'A shopkeeper buys a school bag for ₹400 and sells it for ₹460. What is his profit percent?', '15%', ['13%', '12%', '60%'],
      'Profit = 460 − 400 = ₹60. Profit % is always on the <b>cost price</b>: 60 ÷ 400 × 100 = <b>15%</b>.',
      'Dividing by the selling price (60 ÷ 460 ≈ 13%) is the classic slip.'),
    mk('pl-002', 2, 'cost price', 'A watch sold for ₹360 gives a loss of 10%. What was its cost price?', '₹400', ['₹396', '₹324', '₹380'],
      'SP = 90% of CP, so CP = 360 ÷ 0.9 = <b>₹400</b>. Quick check: 10% of 400 is 40 and 400 − 40 = 360.',
      '₹396 comes from adding 10% of the SP, which is the wrong base.'),
    mk('pl-003', 1, 'discount', 'The marked price of a shirt is ₹500 and the shop gives a 20% discount. What do you pay?', '₹400', ['₹480', '₹420', '₹100'],
      'Discount = 20% of 500 = ₹100. Price = 500 − 100 = <b>₹400</b>. Or directly: 80% of 500 = 400.',
      '₹100 is the discount, not the price paid.'),
    mk('pl-004', 2, 'successive', 'A ₹2,000 pair of shoes gets two successive discounts of 10% each. What is the final price?', '₹1,620', ['₹1,600', '₹1,800', '₹1,640'],
      'Multiply: 2,000 × 0.9 × 0.9 = 2,000 × 0.81 = <b>₹1,620</b>. The second 10% is on ₹1,800, not on ₹2,000.',
      'Two 10% discounts are not a 20% discount (that would give ₹1,600).'),
    mk('pl-005', 2, 'articles', 'The cost price of 12 articles equals the selling price of 10 articles. What is the gain percent?', '20%', ['16⅔%', '25%', '10%'],
      'Let the cost of each article be ₹1. Then SP of 10 = ₹12, so SP of one = ₹1.2. Gain = 0.2 ÷ 1 = <b>20%</b>. Shortcut: (12 − 10) ÷ 10 × 100.',
      '16⅔% comes from dividing the gain by 12 instead of by 10.'),
    mk('pl-006', 2, 'cost price', 'A fan sold for ₹1,260 gives a 5% profit. What did it cost?', '₹1,200', ['₹1,197', '₹1,323', '₹1,250'],
      'SP = 105% of CP, so CP = 1,260 ÷ 1.05 = <b>₹1,200</b>.'),
    mk('pl-007', 3, 'markup', 'A trader marks his goods 25% above cost and then gives a 20% discount. What is his gain or loss?', 'no profit, no loss', ['5% profit', '5% loss', '2% loss'],
      'Let CP = 100. Marked price = 125. After 20% off: 125 × 0.8 = 100. SP = CP, so there is <b>no profit and no loss</b>.',
      'Cancelling +25% and −20% as if they were 5% is wrong; 20% is taken on the bigger marked price.'),
    mk('pl-008', 2, 'cost price', 'A bicycle is sold for ₹550 at a 10% profit. At what price should it be sold to get a 20% profit?', '₹600', ['₹660', '₹575', '₹610'],
      'CP = 550 ÷ 1.1 = ₹500. For 20% profit: SP = 500 × 1.2 = <b>₹600</b>.',
      'Adding 10% more to ₹550 gives ₹605-ish, not the answer; always go back to the cost price.'),
    mk('pl-009', 1, 'basics', 'A grocer buys 50 kg of rice at ₹40 per kg and sells it at ₹46 per kg. What is his total profit?', '₹300', ['₹200', '₹360', '₹2,300'],
      'Profit per kg = 46 − 40 = ₹6. For 50 kg: 6 × 50 = <b>₹300</b>.'),
    mk('pl-010', 1, 'loss', 'A mobile phone cover bought for ₹800 is sold for ₹680. What is the loss percent?', '15%', ['120%', '17.6%', '12%'],
      'Loss = 800 − 680 = ₹120. Loss % = 120 ÷ 800 × 100 = <b>15%</b>.',
      '17.6% comes from dividing by the selling price (120 ÷ 680).'),
    mk('pl-011', 1, 'discount', 'A school bag has a marked price of ₹1,500 and is sold for ₹1,275. What is the discount percent?', '15%', ['17%', '12.5%', '20%'],
      'Discount = 1,500 − 1,275 = ₹225. Discount % is on the <b>marked price</b>: 225 ÷ 1,500 × 100 = <b>15%</b>.'),
    mk('pl-012', 3, 'two items', 'Two pressure cookers are each sold for ₹1,200. One is sold at a 20% profit and the other at a 20% loss. What is the overall loss?', '₹100', ['no loss', '₹200', '₹240'],
      'First: CP = 1,200 ÷ 1.2 = ₹1,000. Second: CP = 1,200 ÷ 0.8 = ₹1,500. Total CP = 2,500 and total SP = 2,400. Loss = <b>₹100</b>, which is 4% of 2,500. (Shortcut: loss % = 20²/100 = 4%.)',
      'Same percent profit and loss on the same SP never cancels; the loss item had the higher cost.'),
    mk('pl-013', 3, 'conversion', 'A profit of 25% on the cost price is what percent of the selling price?', '20%', ['25%', '30%', '16⅔%'],
      'Let CP = 100. Then profit = 25 and SP = 125. Profit as a % of SP = 25 ÷ 125 × 100 = <b>20%</b>.'),
    mk('pl-014', 2, 'discount', 'A dealer buys a ₹600 (list price) item at a 20% discount and sells it at the list price. What is his profit percent?', '25%', ['20%', '30%', '15%'],
      'He pays 600 × 0.8 = ₹480 and sells for ₹600. Profit = 120, and 120 ÷ 480 = <b>25%</b>.',
      'The 20% discount was on 600, but profit is measured on his cost of 480.'),
    mk('pl-015', 3, 'dishonest', 'A shopkeeper uses a 900 g weight instead of 1 kg but charges for 1 kg. What is his gain percent?', '11⅑%', ['10%', '9%', '12.5%'],
      'He gives 900 g and is paid for 1,000 g. Gain = 100 g on a cost of 900 g: 100 ÷ 900 × 100 = 11.11% = <b>11⅑%</b>.',
      '10% divides by 1,000 g; the base must be what he actually gives, 900 g.'),
    mk('pl-016', 2, 'successive', 'Two successive discounts of 25% and 20% are equal to a single discount of:', '40%', ['45%', '35%', '5%'],
      '0.75 × 0.80 = 0.60, so you pay 60% and the single discount is <b>40%</b>. Formula: 25 + 20 − (25 × 20)/100 = 40.'),
    mk('pl-017', 1, 'basics', 'A cricket bat bought for ₹750 is sold at a 12% gain. What is the selling price?', '₹840', ['₹762', '₹850', '₹900'],
      'Gain = 12% of 750 = 90. SP = 750 + 90 = <b>₹840</b>.'),
    mk('pl-018', 1, 'basics', 'An article costing ₹250 is sold for ₹290. What is the profit percent?', '16%', ['40%', '13.8%', '14%'],
      'Profit = ₹40. 40 ÷ 250 × 100 = <b>16%</b>. (250 × 4 = 1,000, so 40 is 16 in every 100.)'),
    mk('pl-019', 2, 'loss', 'A trader loses ₹150 on an item that cost him ₹1,200. What is his loss percent?', '12.5%', ['15%', '12%', '10%'],
      '150 ÷ 1,200 = 1/8 = <b>12.5%</b>. Remember 1/8 = 12.5%.'),
    mk('pl-020', 1, 'tax', 'A TV remote costs ₹2,000 before 5% GST. How much do you pay in total?', '₹2,100', ['₹2,005', '₹2,050', '₹2,200'],
      'GST = 5% of 2,000 = ₹100. Total = 2,000 + 100 = <b>₹2,100</b>.'),
    mk('pl-021', 3, 'markup', 'A jacket marked ₹600 is sold after a 10% discount at a 20% profit. What was its cost price?', '₹450', ['₹480', '₹500', '₹432'],
      'SP = 600 × 0.9 = ₹540. CP = 540 ÷ 1.2 = <b>₹450</b>.',
      'Treating ₹600 as the cost price gives the wrong base.'),
    mk('pl-022', 3, 'chain', 'A sells an article to B at a 10% profit and B sells it to C at a 20% profit. C pays ₹6,600. What did A pay for it?', '₹5,000', ['₹4,620', '₹5,500', '₹4,800'],
      'C pays 1.1 × 1.2 = 1.32 times A\'s cost. A\'s cost = 6,600 ÷ 1.32 = <b>₹5,000</b>. Check: 5,000 → 5,500 → 6,600.',
      '30% is not the total profit; successive percentages multiply (1.1 × 1.2 = 1.32, a 32% rise).'),
    mk('pl-023', 3, 'articles', 'A vendor sells 20 pencils for the same money that he paid for 15 pencils. What is his loss percent?', '25%', ['20%', '33⅓%', '15%'],
      'Let the cost of 1 pencil be ₹1. He paid ₹15 and received ₹15 for 20 pencils, so SP of one = ₹0.75. Loss = 0.25 ÷ 1 = <b>25%</b>. Shortcut: (20 − 15) ÷ 20 × 100.'),
    mk('pl-024', 2, 'offers', 'A shop offers "Buy 3, get 1 free" on notebooks. What discount percent is this?', '25%', ['33⅓%', '20%', '30%'],
      'You pay for 3 and get 4, so the free part is 1 out of 4 = <b>25%</b> off.',
      '33⅓% would be "buy 2, get 1 free".'),
    mk('pl-025', 2, 'cost price', 'A trader sells a table for ₹912 and loses 4%. What was the cost price?', '₹950', ['₹948', '₹960', '₹880'],
      'SP = 96% of CP, so CP = 912 ÷ 0.96 = <b>₹950</b>. Check: 4% of 950 = 38 and 950 − 38 = 912.'),
    mk('pl-026', 3, 'equations', 'If an article is sold at a 20% profit instead of a 10% loss, the selling price is ₹360 more. What is the cost price?', '₹1,200', ['₹1,080', '₹1,800', '₹1,000'],
      'The two selling prices are 120% and 90% of CP, which differ by 30% of CP. 30% of CP = 360, so CP = 360 ÷ 0.3 = <b>₹1,200</b>.',
      'The gap is 30% (20 + 10), because a loss moves the price down on the other side of the cost.'),
    mk('pl-027', 2, 'successive', 'A cricket kit priced ₹3,000 gets a 20% sale discount and then a further 10% off at the counter. What do you pay?', '₹2,160', ['₹2,100', '₹2,400', '₹2,200'],
      '3,000 × 0.8 = 2,400; then 2,400 × 0.9 = <b>₹2,160</b>. As one step: 3,000 × 0.72.',
      '₹2,100 comes from adding the discounts to 30%.'),
    mk('pl-028', 3, 'wastage', 'A fruit seller buys 100 oranges at ₹10 each. 10 of them rot, and he sells the rest at ₹14 each. What is his profit?', '₹260', ['₹400', '₹360', '₹160'],
      'Cost = 100 × 10 = ₹1,000. He sells 90 oranges: 90 × 14 = ₹1,260. Profit = <b>₹260</b>.',
      '₹400 forgets that only 90 oranges were sold.'),
    mk('pl-029', 3, 'markup', 'A trader marks goods 50% above cost and sells at a 20% profit. What discount percent does he give?', '20%', ['30%', '25%', '15%'],
      'Let CP = 100. Marked = 150 and SP = 120. Discount = 30 on a marked price of 150: 30 ÷ 150 × 100 = <b>20%</b>.',
      'Discount is on the marked price (150), not on the cost (100), which would give 30%.'),
    mk('pl-030', 2, 'cost price', 'Six apples are sold for ₹90 at a 25% profit. What was the cost of the six apples?', '₹72', ['₹67.50', '₹65', '₹112.50'],
      'SP = 125% of CP, so CP = 90 ÷ 1.25 = <b>₹72</b> (₹12 an apple).'),
    mk('pl-031', 3, 'equations', 'Raj sold a camera at an 8% loss. Had he sold it for ₹360 more, he would have gained 4%. What was its cost price?', '₹3,000', ['₹2,400', '₹4,500', '₹3,600'],
      'The two selling prices differ by 8% + 4% = 12% of CP. 12% of CP = 360, so CP = 360 ÷ 0.12 = <b>₹3,000</b>.'),
    mk('pl-032', 3, 'expenses', 'A dealer buys a phone for ₹12,000, spends ₹500 on repairs, and sells it for ₹14,375. What is his profit percent (to the nearest 0.1%)?', '15%', ['15.6%', '19.8%', '12%'],
      'Total cost = 12,000 + 500 = ₹12,500. Profit = 14,375 − 12,500 = ₹1,875. 1,875 ÷ 12,500 = <b>15%</b>.',
      '15.6% leaves out the repair cost (1,875 ÷ 12,000).'),
  ],
  gens: [
    { id: 'pl-g01', type: 'mcq', level: 1, sub: 'basics', ...T,
      make(rng) {
        const cp = pick(rng, 200, 2000, 100), p = choose(rng, [10, 20, 25, 30, 40, 50]), sp = cp * (1 + p / 100);
        const { options, answer } = shuffleOpts(rng, sp, [cp + p, cp * (1 - p / 100), sp + cp / 10], (v) => rs(v, 0));
        return { q: `A shopkeeper buys a ceiling fan for ${rs(cp, 0)} and wants a ${p}% profit. At what price should he sell it?`, options, answer,
          sol: steps(`Profit = ${p}% of ${fmt(cp, 0)} = ${rs(cp * p / 100, 0)}.`, `SP = ${fmt(cp, 0)} + ${fmt(cp * p / 100, 0)} = <b>${rs(sp, 0)}</b>.`),
          trap: `Adding ${p} (the percent number) to the cost treats the percent as rupees.` };
      } },
    { id: 'pl-g02', type: 'mcq', level: 2, sub: 'cost price', ...T,
      make(rng) {
        const cp = pick(rng, 400, 4000, 200), p = choose(rng, [5, 10, 20, 25]), sp = cp * (1 + p / 100);
        const { options, answer } = shuffleOpts(rng, cp, [sp * (1 - p / 100), sp - p, cp + cp / 10], (v) => rs(v, 0));
        return { q: `An article sold for ${rs(sp, 0)} gives a profit of ${p}%. What was its cost price?`, options, answer,
          sol: steps(`SP = ${100 + p}% of CP = ${1 + p / 100} × CP.`, `CP = ${fmt(sp, 0)} ÷ ${1 + p / 100} = <b>${rs(cp, 0)}</b>.`),
          trap: `Taking ${p}% off the selling price (${rs(sp * (1 - p / 100), 0)}) uses the wrong base.` };
      } },
    { id: 'pl-g03', type: 'mcq', level: 2, sub: 'successive', ...T,
      make(rng) {
        const M = int(rng, 2, 12) * 400, d1 = choose(rng, [10, 20, 25, 50]), d2 = choose(rng, [10, 20, 25]), f = M * (1 - d1 / 100) * (1 - d2 / 100);
        const { options, answer } = shuffleOpts(rng, f, [M * (1 - (d1 + d2) / 100), M * (1 - d1 / 100), f + M / 100 * 2], (v) => rs(v, 0));
        return { q: `A school bag is marked ${rs(M, 0)}. A shop gives successive discounts of ${d1}% and ${d2}%. What is the final price?`, options, answer,
          sol: steps(`After ${d1}% off: ${fmt(M, 0)} × ${1 - d1 / 100} = ${fmt(M * (1 - d1 / 100), 2)}.`, `After ${d2}% off: ${fmt(M * (1 - d1 / 100), 2)} × ${1 - d2 / 100} = <b>${rs(f, 0)}</b>.`),
          trap: `Adding the discounts (${d1 + d2}%) gives ${rs(M * (1 - (d1 + d2) / 100), 0)}, which is wrong.` };
      } },
    { id: 'pl-g04', type: 'mcq', level: 1, sub: 'basics', ...T,
      make(rng) {
        const cp = pick(rng, 200, 1600, 200), p = choose(rng, [10, 15, 20, 25, 30, 40]), sp = cp * (1 + p / 100), gain = sp - cp;
        const { options, answer } = shuffleOpts(rng, p, [+(gain / sp * 100).toFixed(2), p + 5, p - 5], (v) => `${fmt(v, 2)}%`);
        return { q: `A seller buys an item for ${rs(cp, 0)} and sells it for ${rs(sp, 0)}. What is the profit percent?`, options, answer,
          sol: steps(`Profit = ${fmt(sp, 0)} − ${fmt(cp, 0)} = ${rs(gain, 0)}.`, `Profit % = ${fmt(gain, 0)} ÷ ${fmt(cp, 0)} × 100 = <b>${p}%</b>.`),
          trap: `Dividing by the selling price gives ${fmt(gain / sp * 100, 2)}%.` };
      } },
    { id: 'pl-g05', type: 'mcq', level: 3, sub: 'markup', ...T,
      make(rng) {
        const m = choose(rng, [20, 25, 30, 40, 50]), d = choose(rng, [10, 20, 25]), net = +(((1 + m / 100) * (1 - d / 100) - 1) * 100).toFixed(2);
        const show = (v) => (v === 0 ? 'no profit, no loss' : `${fmt(Math.abs(v), 2)}% ${v > 0 ? 'profit' : 'loss'}`);
        const { options, answer } = shuffleOpts(rng, net, [m - d, net === 0 ? 3 : -net, (m - d) / 2 + 1], show);
        return { q: `A trader marks his goods ${m}% above cost and then allows a ${d}% discount. What is his gain or loss?`, options, answer,
          sol: steps(`Let CP = 100. Marked price = ${100 + m}.`, `SP = ${100 + m} × ${1 - d / 100} = ${fmt((100 + m) * (1 - d / 100), 2)}.`, `Result: <b>${show(net)}</b>.`),
          trap: `${m} − ${d} = ${m - d}% ignores that the discount is on the marked price.` };
      } },
    { id: 'pl-g06', type: 'mcq', level: 2, sub: 'articles', ...T,
      make(rng) {
        const [x, y] = choose(rng, [[12, 10], [15, 12], [20, 16], [9, 6], [15, 10], [24, 20], [18, 15]]), g = +(((x - y) / y) * 100).toFixed(2);
        const { options, answer } = shuffleOpts(rng, g, [+(((x - y) / x) * 100).toFixed(2), g + 5, x - y], (v) => `${fmt(v, 2)}%`);
        return { q: `The cost price of ${x} articles equals the selling price of ${y} articles. What is the gain percent?`, options, answer,
          sol: steps(`Gain = (${x} − ${y}) ÷ ${y} × 100.`, `= ${x - y} ÷ ${y} × 100 = <b>${fmt(g, 2)}%</b>.`),
          trap: `Dividing by ${x} instead of ${y} gives ${fmt(((x - y) / x) * 100, 2)}%.` };
      } },
    { id: 'pl-g07', type: 'mcq', level: 3, sub: 'two items', ...T,
      make(rng) {
        const [x, u] = choose(rng, [[20, 600], [25, 300]]), k = int(rng, 1, 4), S = u * k;
        const c1 = S / (1 + x / 100), c2 = S / (1 - x / 100), loss = c1 + c2 - 2 * S;
        const { options, answer } = shuffleOpts(rng, loss, [0, loss * 2, loss + S / 10], (v) => (v === 0 ? 'no loss' : rs(v, 0)));
        return { q: `Two helmets are each sold for ${rs(S, 0)}, one at a ${x}% profit and the other at a ${x}% loss. What is the overall loss?`, options, answer,
          sol: steps(`CP of the first = ${fmt(S, 0)} ÷ ${1 + x / 100} = ${fmt(c1, 0)}; CP of the second = ${fmt(S, 0)} ÷ ${1 - x / 100} = ${fmt(c2, 0)}.`, `Total CP = ${fmt(c1 + c2, 0)} and total SP = ${fmt(2 * S, 0)}.`, `Loss = <b>${rs(loss, 0)}</b> (always ${x * x / 100}% of the total cost).`),
          trap: 'Equal percent profit and loss on the same selling price never cancel out.' };
      } },
  ],
};
