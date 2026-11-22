// CUET Economics: balance of payments and exchange rates. Original questions for fibub.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from '../cuet-general-test/_cuet.js';
const T = { exams: ['cuet'], format: 'single' };
const P = [2, 0, 3, 1, 1, 3, 0, 2];
let k = 0;
const put = (c, w) => { const i = P[k++ % 8], o = [...w]; o.splice(i, 0, c); return { options: o, answer: i }; };
const mcq = (id, level, sub, q, c, w, sol, trap) => ({ id, type: 'mcq', level, sub, q, ...put(c, w), sol, ...(trap ? { trap } : {}), ...T });
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const asr = (id, level, sub, A, R, code, sol, trap) => ({ id, type: 'mcq', level, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: code, sol, ...(trap ? { trap } : {}), exams: ['cuet'], format: 'assertion' });
const mat = (id, level, sub, L, R, c, w, sol) => ({ id, type: 'mcq', level, sub,
  q: `Match List I with List II.<b>List I</b><ul>${L.map((x) => `<li>${x}</li>`).join('')}</ul><b>List II</b><ul>${R.map((x) => `<li>${x}</li>`).join('')}</ul>`,
  ...put(c, w), sol, exams: ['cuet'], format: 'match' });
const n = (v) => fmt(v, 2);
const C = (v) => `${v < 0 ? 'a deficit' : v > 0 ? 'a surplus' : 'a balance'} of ₹${fmt(Math.abs(v), 0)} crore`;

export default {
  topic: 'open-economy',
  items: [
    mcq('oe-001', 1, 'balance of payments', 'The balance of payments is a record of', 'all economic transactions between residents of a country and the rest of the world in a year', ['the government revenue and spending in a year', 'exports and imports of goods only', 'the money supply held abroad'],
      'BoP covers trade in goods and services, income, transfers and capital flows. The record of goods alone is the balance of trade.'),
    mcq('oe-002', 1, 'balance of payments', 'Which of the following is recorded in the current account?', 'Export of software services', ['Foreign direct investment into India', 'Borrowing by an Indian firm from abroad', 'Purchase of foreign shares by Indian residents'],
      'The current account records trade in goods and services, income and transfers. Investment and borrowing are in the capital account.'),
    mcq('oe-003', 1, 'balance of payments', 'Which of the following belongs to the capital account?', 'Foreign direct investment', ['Export of tea', 'Import of crude oil', 'Interest paid on a loan'],
      'The capital account records changes in assets and liabilities: FDI, portfolio investment, external borrowing and changes in reserves.'),
    mcq('oe-004', 2, 'balance of payments', 'Exports of goods are ₹300 crore and imports of goods are ₹380 crore. The balance of trade shows', 'a deficit of ₹80 crore', ['a surplus of ₹80 crore', 'a deficit of ₹680 crore', 'a balance of zero'],
      'Balance of trade = exports − imports = 300 − 380 = −80, a <b>deficit of ₹80 crore</b>.'),
    mcq('oe-005', 2, 'balance of payments', 'In the current account: goods −₹50 crore, services +₹40 crore, income −₹10 crore, transfers +₹30 crore. The current account balance is', 'a surplus of ₹10 crore', ['a deficit of ₹10 crore', 'a surplus of ₹30 crore', 'a surplus of ₹110 crore'],
      'Sum = −50 + 40 − 10 + 30 = <b>+10</b>, a surplus of ₹10 crore.'),
    mcq('oe-006', 1, 'balance of payments', 'The balance of trade records', 'only exports and imports of goods (visible items)', ['all current and capital account items', 'services and transfers only', 'only foreign investment'],
      'Balance of trade is narrower than the current account: it leaves out services, income and transfers.'),
    mcq('oe-007', 2, 'balance of payments', 'Autonomous items in the balance of payments are', 'transactions undertaken independently of whether the BoP is in balance', ['transactions made only to cover a deficit', 'only government transactions', 'only illegal transactions'],
      'Exports, imports and investment happen for their own reasons. Transactions made to settle a gap are accommodating.'),
    mcq('oe-008', 2, 'balance of payments', 'Accommodating items in the BoP are', 'transactions made to cover a surplus or a deficit, such as changes in official reserves', ['all exports of goods', 'private gifts', 'foreign direct investment by firms'],
      'They are induced by the BoP position: a deficit is met by drawing down reserves or borrowing from abroad.'),
    mcq('oe-009', 1, 'balance of payments', 'Money sent home by Indians working abroad is recorded as', 'a transfer in the current account', ['an import of goods', 'a capital account outflow', 'foreign direct investment'],
      'Remittances are unilateral transfers (no good or service in return), recorded in the current account.'),
    mcq('oe-010', 1, 'exchange rate', 'Under a fixed exchange rate system the exchange rate is', 'set and maintained by the government or central bank', ['set by demand and supply alone', 'always equal to one', 'set by the IMF every day'],
      'The authorities announce the rate and buy or sell foreign currency to keep it there.'),
    mcq('oe-011', 1, 'exchange rate', 'Under a flexible exchange rate system the exchange rate is determined by', 'demand for and supply of foreign exchange in the market', ['the finance minister', 'the price of gold only', 'the central bank by order'],
      'The rate moves up and down with market forces.'),
    mcq('oe-012', 2, 'exchange rate', 'Under a managed floating system', 'the market sets the rate, but the central bank sometimes intervenes', ['the rate is fixed by law for ever', 'there is no foreign exchange market', 'the government buys all foreign currency'],
      'It is a mix: mostly market-determined, with intervention to avoid sharp swings.'),
    mcq('oe-013', 2, 'exchange rate', 'The exchange rate moves from ₹60 to ₹75 per US dollar. The rupee has', 'depreciated', ['appreciated', 'been devalued under a fixed rate', 'stayed unchanged in value'],
      'More rupees are needed to buy one dollar, so the rupee has lost value against the dollar: depreciation (market-driven).',
      'A higher number of rupees per dollar means a weaker rupee.'),
    mcq('oe-014', 2, 'exchange rate', 'A depreciation of the rupee tends to', 'make Indian exports cheaper for foreign buyers', ['make imports cheaper for Indians', 'make foreign travel cheaper for Indians', 'reduce the price of imported oil'],
      'A weaker rupee lowers the foreign-currency price of Indian goods (exports rise) and raises the rupee price of imports.'),
    mcq('oe-015', 2, 'exchange rate', 'The exchange rate moves from ₹80 to ₹75 per US dollar. The rupee has', 'appreciated', ['depreciated', 'been devalued', 'become worthless'],
      'Fewer rupees are needed to buy one dollar, so the rupee is stronger: appreciation.'),
    mcq('oe-016', 2, 'exchange rate', 'Devaluation means', 'a deliberate cut in the official value of a currency under a fixed exchange rate system', ['a fall in the rate due to market forces', 'a rise in the value of the currency', 'a ban on imports'],
      'Depreciation is market-driven; devaluation is an official decision.'),
    mcq('oe-017', 2, 'foreign exchange market', 'The demand curve for foreign exchange slopes downward because', 'a higher rupee price of foreign currency makes imports costlier, so fewer are bought', ['more exports are made at a high rate', 'foreign currency is free', 'the government fixes demand'],
      'When the exchange rate rises (more rupees per dollar), foreign goods cost more in rupees, so less foreign exchange is demanded.'),
    mcq('oe-018', 2, 'foreign exchange market', 'Supply of foreign exchange to India comes mainly from', 'exports and foreign investment inflows', ['imports of goods', 'payment of interest abroad', 'foreign travel by Indians'],
      'Foreigners need rupees to buy Indian goods or assets, so they sell foreign exchange.'),
    mcq('oe-019', 2, 'foreign exchange market', 'In a flexible exchange rate system, the equilibrium exchange rate is where', 'demand for foreign exchange equals its supply', ['exports equal zero', 'the central bank has no reserves', 'imports are banned'],
      'At that rate the market for foreign exchange clears.'),
    mcq('oe-020', 1, 'exchange rate', 'One US dollar is ₹80. A book costs 50 US dollars. Its price in rupees is', '₹4,000', ['₹130', '₹1.6', '₹400'],
      '50 × 80 = <b>₹4,000</b>.'),
    mcq('oe-021', 1, 'exchange rate', 'At ₹75 per US dollar, ₹15,000 buys', '200 US dollars', ['20 US dollars', '2,000 US dollars', '1,125,000 US dollars'],
      '15,000 ÷ 75 = <b>200</b> US dollars.'),
    mcq('oe-022', 3, 'exchange rate', 'The real exchange rate = (nominal rate × foreign price level) ÷ domestic price level. With a nominal rate of 60, foreign prices of 100 and domestic prices of 120, the real exchange rate is', '50', ['72', '60', '200'],
      '60 × 100 ÷ 120 = <b>50</b>.',
      'Putting the domestic price on top (60 × 120 ÷ 100 = 72) inverts the ratio.'),
    mcq('oe-023', 2, 'exchange rate', 'Which of the following would tend to depreciate the rupee?', 'A sharp rise in India\'s demand for imports', ['A rise in India\'s exports', 'More foreign investment coming into India', 'Higher remittances to India'],
      'More imports mean more demand for foreign currency, which pushes up its rupee price. The other three increase supply of foreign exchange.'),
    mcq('oe-024', 2, 'balance of payments', 'Foreign portfolio investment means', 'buying shares and bonds in another country without controlling the firm', ['building a factory abroad', 'exporting goods', 'paying a tax abroad'],
      'FPI is financial investment; FDI gives control of a business. Both are capital account items.'),
    asr('oe-025', 2, 'balance of payments', 'Exports of goods are a credit item in the balance of payments.', 'Exports bring foreign exchange into the country.', 0,
      'Both true: transactions that bring in foreign exchange are credits, and R explains why.'),
    asr('oe-026', 2, 'exchange rate', 'When the rupee price of a US dollar rises, the rupee appreciates.', 'More rupees are needed to buy one US dollar, so the rupee has lost value.', 3,
      'A is false: the rupee depreciates. R is true.'),
    asr('oe-027', 2, 'exchange rate', 'The exchange rate is the price of one currency in terms of another.', 'The real exchange rate adjusts the nominal rate for differences in price levels.', 1,
      'Both are true, but R does not explain why the exchange rate is a price.'),
    asr('oe-028', 2, 'balance of payments', 'Imports of goods are a debit item in the balance of payments.', 'Imports earn foreign exchange for the country.', 2,
      'A is true. R is false: imports use up foreign exchange, which is why they are debits.'),
    mat('oe-029', 2, 'balance of payments', ['A. Export of tea', 'B. Foreign direct investment', 'C. Gifts from relatives abroad', 'D. Net errors and omissions'], ['1. Capital account', '2. Current account: trade in goods', '3. Current account: transfers', '4. Balancing item'],
      'A-2, B-1, C-3, D-4', ['A-1, B-2, C-3, D-4', 'A-2, B-1, C-4, D-3', 'A-3, B-1, C-2, D-4'],
      'Tea is a good (visible trade); FDI is capital; gifts are transfers; errors and omissions are a statistical balancing item.'),
    mcq('oe-030', 2, 'balance of payments', 'If a country has an overall balance of payments surplus, its official foreign exchange reserves tend to', 'rise', ['fall', 'become zero', 'stay the same by law'],
      'A surplus means more foreign exchange comes in than goes out, and the extra adds to reserves.'),
    mcq('oe-031', 2, 'exchange rate', 'A fall in the value of the rupee against the dollar makes imported crude oil', 'costlier in rupees', ['cheaper in rupees', 'free of tax', 'unchanged in rupee price for sure'],
      'Oil is priced in dollars; each dollar now costs more rupees.'),
    mcq('oe-032', 2, 'exchange rate', 'The Bretton Woods system after the Second World War was a system of', 'fixed (adjustable peg) exchange rates', ['freely floating exchange rates', 'barter exchange', 'a single world currency'],
      'Currencies were pegged to the US dollar, which was linked to gold, with rates adjustable only under certain conditions.'),
    mcq('oe-033', 2, 'exchange rate', 'The spot exchange rate is the rate', 'at which foreign exchange is exchanged for immediate delivery', ['agreed today for delivery after a year', 'set by the IMF', 'paid on gold'],
      'A forward rate fixes today the price of a future exchange; the spot rate is for immediate settlement.'),
    mcq('oe-034', 3, 'balance of payments', 'The current account balance is −₹60 crore and the capital account balance is +₹45 crore. The overall balance (ignoring errors) is', 'a deficit of ₹15 crore', ['a surplus of ₹15 crore', 'a deficit of ₹105 crore', 'a balance of zero'],
      '−60 + 45 = <b>−15</b>. The gap must be met from reserves or other accommodating items.'),
    mcq('oe-035', 2, 'balance of payments', 'A country\'s trade deficit can be financed by', 'capital inflows or by running down foreign exchange reserves', ['printing its own currency only', 'increasing its imports', 'cutting its exports'],
      'The foreign exchange needed to pay for the extra imports must come from somewhere: borrowing, investment inflows or reserves.'),
  ],
  gens: [
    { id: 'oe-g01', type: 'mcq', level: 1, sub: 'balance of payments', ...T,
      make(rng) {
        const x = pick(rng, 200, 600, 20), m = pick(rng, 200, 600, 20), tb = x - m;
        const { options, answer } = shuffleOpts(rng, tb, [-tb, x + m, x], (v) => (v === 0 ? 'balance of zero' : `${v < 0 ? 'deficit' : 'surplus'} of ₹${fmt(Math.abs(v), 0)} crore`));
        return { q: `Exports of goods are ₹${x} crore and imports of goods are ₹${m} crore. The balance of trade shows (a deficit, surplus or balance)`, options, answer, x, m, tb,
          sol: steps('Balance of trade = exports − imports.', `= ${x} − ${m} = <b>${tb}</b>.`), trap: 'A negative balance is a deficit: imports are larger than exports.' };
      },
      verify: (p) => (((v) => (v === 0 ? 'balance of zero' : `${v < 0 ? 'deficit' : 'surplus'} of ₹${fmt(Math.abs(v), 0)} crore`))(p.x - p.m) === p.options[p.answer] ? p.answer : -1) },
    { id: 'oe-g02', type: 'mcq', level: 2, sub: 'balance of payments', ...T,
      make(rng) {
        const g = pick(rng, -80, 40, 10), s = pick(rng, 10, 70, 10), i = pick(rng, -30, 20, 10), t = pick(rng, 10, 60, 10), ca = g + s + i + t;
        const { options, answer } = shuffleOpts(rng, ca, [g, g + s, g + s + i - t], (v) => (v === 0 ? '₹0 crore' : `${v < 0 ? '−' : '+'}₹${fmt(Math.abs(v), 0)} crore`));
        return { q: `Current account items (₹ crore): goods ${g}, services ${s}, factor income ${i}, transfers ${t}. The current account balance is`, options, answer, g, s, i, t, ca,
          sol: steps('Current account = goods + services + income + transfers.', `= ${g} + ${s} + (${i}) + ${t} = <b>${ca} crore</b>.`), trap: 'The current account is wider than the balance of trade: include services, income and transfers.' };
      },
      verify: (p) => (((v) => (v === 0 ? '₹0 crore' : `${v < 0 ? '−' : '+'}₹${fmt(Math.abs(v), 0)} crore`))(p.g + p.s + p.i + p.t) === p.options[p.answer] ? p.answer : -1) },
    { id: 'oe-g03', type: 'mcq', level: 2, sub: 'balance of payments', ...T,
      make(rng) {
        const ca = pick(rng, -100, 60, 10), ka = pick(rng, -20, 90, 10), b = ca + ka;
        const sh = (v) => (v === 0 ? 'zero' : `${v < 0 ? 'deficit' : 'surplus'} of ₹${fmt(Math.abs(v), 0)} crore`);
        const { options, answer } = shuffleOpts(rng, b, [ca - ka, ca, ka], sh);
        return { q: `The current account balance is ₹${ca} crore and the capital account balance is ₹${ka} crore (negative = deficit). The overall balance of payments (before errors and omissions) shows`, options, answer, ca, ka, b,
          sol: steps('Overall balance = current account + capital account.', `= ${ca} + (${ka}) = <b>${b}</b>, i.e. ${sh(b)}.`), trap: 'A current account deficit can be offset by a capital account surplus.' };
      },
      verify: (p) => (((v) => (v === 0 ? 'zero' : `${v < 0 ? 'deficit' : 'surplus'} of ₹${fmt(Math.abs(v), 0)} crore`))(p.ca + p.ka) === p.options[p.answer] ? p.answer : -1) },
    { id: 'oe-g04', type: 'mcq', level: 1, sub: 'exchange rate', ...T,
      make(rng) {
        const e = choose(rng, [50, 60, 75, 80, 100]), u = pick(rng, 10, 200, 10), r = e * u;
        const { options, answer } = shuffleOpts(rng, r, [u / e, e + u, r * 10], (v) => `₹${fmt(v, 0)}`);
        return { q: `The exchange rate is ₹${e} per US dollar. A product costs ${u} US dollars. Its price in rupees is`, options, answer, e, u, r,
          sol: steps('Price in rupees = price in dollars × rupees per dollar.', `= ${u} × ${e} = <b>₹${fmt(r, 0)}</b>.`), trap: 'Dividing instead of multiplying converts in the wrong direction.' };
      },
      verify: (p) => (`₹${fmt(p.u * p.e, 0)}` === p.options[p.answer] ? p.answer : -1) },
    { id: 'oe-g05', type: 'mcq', level: 3, sub: 'exchange rate', ...T,
      make(rng) {
        const e = choose(rng, [40, 50, 60, 75, 80]), pf = choose(rng, [100, 120, 150, 200]), pd = choose(rng, [100, 125, 160, 250]), r = (e * pf) / pd;
        const { options, answer } = shuffleOpts(rng, r, [(e * pd) / pf, e, (pf * pd) / e], (v) => fmt(v, 1));
        return { q: `The nominal exchange rate is ${e} rupees per US dollar, the foreign price level is ${pf} and the domestic price level is ${pd}. The real exchange rate (nominal rate × foreign prices ÷ domestic prices) is`, options, answer, e, pf, pd, r,
          sol: steps('Real exchange rate = e × P(foreign) ÷ P(domestic).', `= ${e} × ${pf} ÷ ${pd} = <b>${fmt(r, 1)}</b>.`), trap: 'Foreign prices go in the numerator, domestic prices in the denominator.' };
      },
      verify: (p) => (fmt((p.e * p.pf) / p.pd, 1) === p.options[p.answer] ? p.answer : -1) },
    { id: 'oe-g06', type: 'mcq', level: 2, sub: 'exchange rate', ...T,
      make(rng) {
        const e0 = choose(rng, [40, 50, 60, 80]), pc = choose(rng, [10, 20, 25, 50]), e1 = e0 * (1 + pc / 100);
        const { options, answer } = shuffleOpts(rng, pc, [(pc * 100) / (100 + pc), pc / 2, pc + 10], (v) => `${fmt(v, 1)}%`);
        return { q: `The rupee price of one US dollar rises from ₹${e0} to ₹${fmt(e1, 0)}. The rupee cost of buying a dollar has increased by`, options, answer, e0, e1, pc,
          sol: steps(`Rise = ${fmt(e1, 0)} − ${e0} = ${fmt(e1 - e0, 0)}.`, `Percentage rise = ${fmt(e1 - e0, 0)} ÷ ${e0} × 100 = <b>${pc}%</b>.`), trap: 'Divide by the old rate, not the new one.' };
      },
      verify: (p) => (`${fmt(((p.e1 - p.e0) / p.e0) * 100, 1)}%` === p.options[p.answer] ? p.answer : -1) },
  ],
};
