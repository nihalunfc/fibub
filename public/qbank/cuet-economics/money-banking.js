// CUET Economics: money and banking. Original questions for fibub.
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
const R = (v) => `₹${fmt(v, 0)}`;

export default {
  topic: 'money-banking',
  items: [
    mcq('mb-001', 1, 'money', 'The main difficulty of a barter system is', 'the need for a double coincidence of wants', ['too much currency in circulation', 'a legal ban on exchange', 'a shortage of banks'],
      'In barter, two people can trade only if each has what the other wants. Money removes this need: it is accepted by everyone as payment.'),
    mcq('mb-002', 1, 'money', 'Quoting the price of every good in rupees shows money acting as', 'a unit of account', ['a store of value', 'a medium of exchange', 'a source of credit'],
      'Prices expressed in one common unit (rupees) let us compare values: that is the <b>unit of account</b> function.'),
    mcq('mb-003', 1, 'money', 'Keeping some money aside to buy a scooter next year uses money as', 'a store of value', ['a unit of account', 'a medium of exchange', 'a barter good'],
      'Money keeps its purchasing power over time, so it can carry value from today to the future.'),
    mcq('mb-004', 2, 'money supply', 'Demand deposits with banks are counted as money because', 'they can be withdrawn on demand and are accepted by cheque as payment', ['they earn the highest interest', 'they are issued by the central bank as notes', 'they cannot be withdrawn for a year'],
      'Money is anything generally accepted as a means of payment. Cheques drawn on demand deposits are accepted, so they are part of the money supply.'),
    mcq('mb-005', 2, 'money supply', 'Currency held by the public is ₹500 crore and demand deposits with banks are ₹700 crore. Taking M1 as currency with the public plus demand deposits, M1 is', '₹1,200 crore', ['₹700 crore', '₹500 crore', '₹350 crore'],
      'M1 = 500 + 700 = <b>₹1,200 crore</b>.'),
    mcq('mb-006', 1, 'credit creation', 'If the legal reserve ratio is 20%, the money multiplier is', '5', ['4', '20', '0.2'],
      'Money multiplier = 1 ÷ LRR = 1 ÷ 0.20 = <b>5</b>.',
      'Do not confuse 1/LRR with LRR itself.'),
    mcq('mb-007', 2, 'credit creation', 'A bank receives a fresh deposit of ₹1,000. With a legal reserve ratio of 25%, the maximum total increase in deposits in the banking system is', '₹4,000', ['₹2,500', '₹1,250', '₹25,000'],
      'Multiplier = 1 ÷ 0.25 = 4. Total deposits = 1,000 × 4 = <b>₹4,000</b>.'),
    mcq('mb-008', 2, 'credit creation', 'A bank receives a fresh deposit of ₹500. With a legal reserve ratio of 10%, the maximum total increase in deposits in the banking system is', '₹5,000', ['₹4,500', '₹500', '₹50,000'],
      'Multiplier = 1 ÷ 0.10 = 10. Total deposits = 500 × 10 = <b>₹5,000</b>.'),
    mcq('mb-009', 3, 'credit creation', 'A fresh deposit of ₹500 leads to a total increase in deposits of ₹5,000 (LRR 10%). The total fresh loans made by the banking system are', '₹4,500', ['₹5,000', '₹500', '₹450'],
      'Total deposits created ₹5,000 include the original ₹500, so new loans = 5,000 − 500 = <b>₹4,500</b>. Reserves held at the end = 10% of 5,000 = ₹500.',
      'The original deposit is not a loan.'),
    mcq('mb-010', 2, 'central bank', 'Which of the following is part of high-powered money?', 'Currency held by the public and cash reserves of commercial banks', ['Demand deposits of the public', 'Time deposits of the public', 'Shares held by households'],
      'High-powered (reserve) money = currency held by the public + reserves of banks. It is the base on which banks create deposits.'),
    mcq('mb-011', 2, 'instruments', 'The cash reserve ratio (CRR) is', 'the share of deposits that banks must keep as cash with the RBI', ['the share of deposits banks must keep in liquid assets such as gold and approved securities', 'the rate at which the RBI lends to banks', 'the share of loans that are not repaid'],
      'CRR is a cash reserve held with the central bank. The share held in liquid assets such as approved securities is the SLR.'),
    mcq('mb-012', 2, 'instruments', 'The statutory liquidity ratio (SLR) is', 'the share of deposits banks must hold in liquid assets such as cash, gold or approved securities', ['the share of deposits kept with the RBI only', 'the share of profits paid as tax', 'the rate at which banks lend to the public'],
      'SLR makes banks keep a part of their deposits in safe, liquid form in addition to CRR.'),
    mcq('mb-013', 2, 'instruments', 'The repo rate is the rate at which', 'the RBI lends short-term funds to commercial banks against securities', ['commercial banks lend to the public', 'the RBI borrows from commercial banks', 'banks pay interest on savings accounts'],
      'Repo (repurchase) rate: banks sell securities to the RBI and agree to buy them back, borrowing money at the repo rate.'),
    mcq('mb-014', 2, 'instruments', 'The reverse repo rate is the rate at which', 'the RBI borrows money from commercial banks', ['the RBI lends to the government', 'banks lend to each other', 'households borrow from banks'],
      'Reverse repo is the opposite of repo: banks park surplus funds with the RBI and earn this rate.'),
    mcq('mb-015', 2, 'instruments', 'If the RBI raises the repo rate, the likely effect is that', 'borrowing becomes costlier and the money supply tends to fall', ['borrowing becomes cheaper and the money supply rises', 'banks must reduce their SLR', 'exports rise immediately'],
      'A higher repo rate raises banks\' cost of funds, so loans become dearer and credit creation slows.'),
    mcq('mb-016', 2, 'instruments', 'When the RBI sells government securities in the open market, the money supply', 'falls, as money is drawn out of banks and the public', ['rises, as new notes are printed', 'stays the same because only prices change', 'rises because banks lend more'],
      'Buyers pay the RBI with money, reducing bank reserves. Open market sales contract the money supply; purchases expand it.'),
    mcq('mb-017', 1, 'instruments', 'The bank rate is the rate of interest at which', 'the central bank lends to commercial banks', ['commercial banks lend to the public', 'banks pay depositors', 'the government borrows from the public'],
      'It is a policy rate of the central bank on its lending to banks.'),
    mat('mb-018', 2, 'instruments', ['A. CRR', 'B. Repo rate', 'C. Open market operations', 'D. Reverse repo'], ['1. Buying and selling government securities by the RBI', '2. Rate at which the RBI borrows from banks', '3. Share of deposits kept as cash with the RBI', '4. Rate at which the RBI lends short-term to banks'],
      'A-3, B-4, C-1, D-2', ['A-4, B-3, C-1, D-2', 'A-3, B-2, C-1, D-4', 'A-1, B-4, C-3, D-2'],
      'CRR is a reserve share; repo is the RBI lending rate; OMO is trading in securities; reverse repo is the RBI borrowing rate.'),
    asr('mb-019', 2, 'instruments', 'Raising the CRR reduces the lending capacity of commercial banks.', 'A higher CRR leaves banks with less cash to lend out.', 0,
      'Both true; R is exactly why A holds.'),
    asr('mb-020', 2, 'credit creation', 'A commercial bank can lend out the whole of its deposits.', 'Banks are required to keep a part of deposits as reserves.', 3,
      'A is false: a part must be kept as reserves. R is true.'),
    asr('mb-021', 3, 'money demand', 'The speculative demand for money falls as the interest rate rises.', 'At a high interest rate bond prices are low, so people expect them to rise and buy bonds instead of holding money.', 0,
      'Both true. Bond price and interest rate move in opposite directions; at a high rate people expect bond prices to rise and so hold less idle money. R explains A.'),
    asr('mb-022', 3, 'money demand', 'The transactions demand for money rises when income rises.', 'The price of a bond and the market interest rate are inversely related.', 1,
      'Both statements are true, but R has nothing to do with the transactions motive. R does not explain A.'),
    mcq('mb-023', 3, 'money demand', 'A bond pays ₹100 every year for ever. If the market interest rate is 5%, the price of the bond is', '₹2,000', ['₹500', '₹100', '₹20,000'],
      'Price = annual payment ÷ interest rate = 100 ÷ 0.05 = <b>₹2,000</b>.',
      'If the rate doubled to 10%, the price would halve to ₹1,000.'),
    mcq('mb-024', 2, 'money demand', 'When the market rate of interest rises, the price of an existing bond', 'falls', ['rises', 'does not change', 'becomes zero'],
      'The bond\'s fixed payment is worth a smaller multiple of the higher interest rate, so its price falls.'),
    mcq('mb-025', 2, 'central bank', 'Which of the following is NOT a function of the RBI?', 'Accepting deposits from the public and giving housing loans for profit', ['Issuing currency notes', 'Acting as banker to the government', 'Controlling credit and the money supply'],
      'The RBI is the central bank: it issues currency, is banker to the government and to banks, and regulates credit. Retail deposits and housing loans are done by commercial banks.'),
    mcq('mb-026', 1, 'central bank', 'The Reserve Bank of India started working in', '1935', ['1947', '1950', '1969'],
      'The RBI was set up in 1935 (nationalised after independence).'),
    mcq('mb-027', 2, 'central bank', 'The central bank is called the "lender of last resort" because it', 'lends to commercial banks in times of financial trouble', ['lends to households at low rates', 'lends only to foreign banks', 'lends only against gold'],
      'When a bank cannot get funds anywhere else, the central bank steps in to prevent a banking crisis.'),
    mcq('mb-028', 1, 'money', 'Paper currency is called fiat money because', 'its value comes from the government order that it is legal tender', ['it is backed by gold in every note', 'it is made of precious metal', 'it earns interest'],
      'Fiat money has little value as paper; people accept it because the government declares it acceptable for payment.'),
    mcq('mb-029', 1, 'money', 'Which of the following is the most liquid?', 'Currency notes in the pocket', ['A fixed deposit', 'A government bond', 'A plot of land'],
      'Liquidity means how easily and cheaply something is turned into spendable money. Cash is already spendable.'),
    mcq('mb-030', 1, 'money demand', 'Money held to buy day-to-day goods and services is called the', 'transactions demand for money', ['speculative demand for money', 'supply of money', 'high-powered money'],
      'People need cash to bridge the gap between receiving income and spending it: the transactions motive.'),
    mcq('mb-031', 1, 'money demand', 'Money held for unexpected expenses such as a medical emergency is held for the', 'precautionary motive', ['speculative motive', 'investment motive', 'public motive'],
      'Cash kept for uncertain needs is a precautionary balance.'),
    mcq('mb-032', 2, 'money demand', 'If the money supply increases while the demand for money stays the same, the interest rate', 'falls', ['rises', 'stays the same', 'becomes zero for ever'],
      'Equilibrium interest rate is where money supply equals money demand. A larger supply pushes the rate down.'),
    mcq('mb-033', 2, 'credit creation', 'A banking system holds ₹400 crore of reserves against ₹2,000 crore of deposits. Its money multiplier is', '5', ['4', '0.2', '20'],
      'Reserve ratio = 400 ÷ 2,000 = 0.2. Multiplier = 1 ÷ 0.2 = <b>5</b>.'),
    mcq('mb-034', 2, 'credit creation', 'A bank receives a deposit of ₹1,000 and must keep 15% as reserve. The most it can lend out is', '₹850', ['₹150', '₹1,000', '₹8,500'],
      'Reserve = 0.15 × 1,000 = 150. Lendable = 1,000 − 150 = <b>₹850</b>.'),
    mcq('mb-035', 3, 'credit creation', 'The RBI adds ₹200 crore to the reserves of banks. If the money multiplier is 5, the maximum increase in the money supply is', '₹1,000 crore', ['₹40 crore', '₹200 crore', '₹1,200 crore'],
      'Change in money supply = high-powered money × multiplier = 200 × 5 = <b>₹1,000 crore</b>.'),
    mcq('mb-036', 2, 'credit creation', 'Commercial banks create money mainly by', 'granting loans, which create new deposits', ['printing currency notes', 'selling gold', 'fixing the repo rate'],
      'A loan is credited to the borrower\'s account as a new deposit. Only the central bank issues notes.'),
    mcq('mb-037', 2, 'instruments', 'Moral suasion by the central bank means', 'persuading banks through advice and requests to follow its policy', ['changing the CRR by law', 'printing more currency', 'buying securities in the open market'],
      'It is a qualitative tool: the RBI asks banks to restrict or expand credit without using compulsory rules.'),
  ],
  gens: [
    { id: 'mb-g01', type: 'mcq', level: 1, sub: 'credit creation', ...T,
      make(rng) {
        const l = choose(rng, [5, 10, 20, 25, 40, 50]), m = 100 / l;
        const { options, answer } = shuffleOpts(rng, m, [l, l / 100, m + 1], (v) => fmt(v, 2));
        return { q: `If the legal reserve ratio is ${l}%, the money multiplier is`, options, answer, l, m,
          sol: steps('Money multiplier = 1 ÷ LRR.', `= 1 ÷ ${fmt(l / 100, 2)} = <b>${fmt(m, 2)}</b>.`), trap: 'The multiplier is the inverse of the ratio, not the ratio itself.' };
      },
      verify: (p) => (fmt(1 / (p.l / 100), 2) === p.options[p.answer] ? p.answer : -1) },
    { id: 'mb-g02', type: 'mcq', level: 2, sub: 'credit creation', ...T,
      make(rng) {
        const l = choose(rng, [10, 20, 25, 40, 50]), d = pick(rng, 100, 2000, 100), t = (d * 100) / l;
        const { options, answer } = shuffleOpts(rng, t, [d * l, d / l, t - d], R);
        return { q: `A fresh deposit of ${R(d)} enters the banking system. With a legal reserve ratio of ${l}%, the maximum total increase in deposits is`, options, answer, l, d, t,
          sol: steps(`Multiplier = 100 ÷ ${l} = ${100 / l}.`, `Total deposits = ${fmt(d, 0)} × ${100 / l} = <b>${R(t)}</b>.`), trap: `${R(t - d)} is the extra deposits after the first one, i.e. the new loans.` };
      },
      verify: (p) => (R(p.d / (p.l / 100)) === p.options[p.answer] ? p.answer : -1) },
    { id: 'mb-g03', type: 'mcq', level: 3, sub: 'credit creation', ...T,
      make(rng) {
        const l = choose(rng, [10, 20, 25, 50]), d = pick(rng, 100, 2000, 100), t = (d * 100) / l, loans = t - d;
        const { options, answer } = shuffleOpts(rng, loans, [t, d, t - 2 * d], R);
        return { q: `A fresh deposit of ${R(d)} is made. If the legal reserve ratio is ${l}% and banks lend out all they can, the total new loans made by the banking system are`, options, answer, l, d, t, loans,
          sol: steps(`Total deposits = ${fmt(d, 0)} × ${100 / l} = ${fmt(t, 0)}.`, `New loans = total deposits − original deposit = ${fmt(t, 0)} − ${fmt(d, 0)} = <b>${R(loans)}</b>.`), trap: 'The first deposit was not a loan, so it is not counted.' };
      },
      verify: (p) => (R(p.d * (1 / (p.l / 100) - 1)) === p.options[p.answer] ? p.answer : -1) },
    { id: 'mb-g04', type: 'mcq', level: 3, sub: 'money demand', ...T,
      make(rng) {
        const c = choose(rng, [20, 40, 60, 80, 100, 120]), r = choose(rng, [2, 4, 5, 10]), pr = (c * 100) / r;
        const { options, answer } = shuffleOpts(rng, pr, [c * r, c / r, pr * 2], R);
        return { q: `A bond pays ${R(c)} every year for ever. If the market interest rate is ${r}%, the price of the bond is`, options, answer, c, r, pr,
          sol: steps('Price of a perpetual bond = yearly payment ÷ interest rate.', `= ${c} ÷ ${fmt(r / 100, 2)} = <b>${R(pr)}</b>.`), trap: 'A higher interest rate lowers the price; the price and rate move in opposite directions.' };
      },
      verify: (p) => (R(p.c / (p.r / 100)) === p.options[p.answer] ? p.answer : -1) },
    { id: 'mb-g05', type: 'mcq', level: 3, sub: 'credit creation', ...T,
      make(rng) {
        const l = choose(rng, [10, 20, 25, 50]), h = pick(rng, 50, 400, 50), ds = (h * 100) / l;
        const { options, answer } = shuffleOpts(rng, ds, [h, h * l, ds + h], (v) => `₹${fmt(v, 0)} crore`);
        return { q: `The RBI adds ₹${h} crore to the reserves of banks. If the legal reserve ratio is ${l}%, the maximum increase in the money supply is`, options, answer, l, h, ds,
          sol: steps(`Money multiplier = 100 ÷ ${l} = ${100 / l}.`, `Increase = ${h} × ${100 / l} = <b>₹${fmt(ds, 0)} crore</b>.`), trap: 'The extra reserves are multiplied by 1/LRR, not just added.' };
      },
      verify: (p) => (`₹${fmt(p.h / (p.l / 100), 0)} crore` === p.options[p.answer] ? p.answer : -1) },
    { id: 'mb-g06', type: 'mcq', level: 2, sub: 'credit creation', ...T,
      make(rng) {
        const l = choose(rng, [5, 10, 12, 15, 20, 25]), d = pick(rng, 200, 2000, 100), a = (d * (100 - l)) / 100;
        const { options, answer } = shuffleOpts(rng, a, [(d * l) / 100, d, d - l], R);
        return { q: `A bank receives a deposit of ${R(d)} and must keep ${l}% as reserve. The most it can lend out is`, options, answer, l, d, a,
          sol: steps(`Reserve = ${l}% of ${fmt(d, 0)} = ${fmt((d * l) / 100)}.`, `Lendable = ${fmt(d, 0)} − ${fmt((d * l) / 100)} = <b>${R(a)}</b>.`), trap: 'The reserve is what must be kept back; the rest can be lent.' };
      },
      verify: (p) => (R(p.d - (p.d * p.l) / 100) === p.options[p.answer] ? p.answer : -1) },
  ],
};
