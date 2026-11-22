// CUET Accountancy: company financial statements and their analysis. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'financial-statements',
  items: [
    mcq('fs-001', 1, 'format', 'Under Schedule III of the Companies Act, 2013, the balance sheet shows Equity and Liabilities and Assets in:', 'vertical (statement) form', ['T-form with debit and credit sides', 'a horizontal columnar form only', 'no fixed form'],
      'Schedule III gives a <b>vertical</b> format with main heads and sub-heads.'),
    mcq('fs-002', 1, 'format', 'Which is NOT a main head of Equity and Liabilities in the balance sheet?', 'Fixed assets', ['Shareholders\' funds', 'Non-current liabilities', 'Current liabilities'],
      'The main heads are Shareholders\' funds, Non-current liabilities and Current liabilities. Fixed assets sit on the assets side.'),
    mcq('fs-003', 2, 'classification', 'Securities premium is shown under:', 'Reserves and Surplus', ['Share Capital', 'Current liabilities', 'Non-current assets'],
      'Securities premium, general reserve, capital reserve and the balance of the P&L statement are all under <b>Reserves and Surplus</b> in Shareholders\' funds.'),
    mcq('fs-004', 2, 'classification', 'Trade receivables are shown under:', 'Current assets', ['Non-current assets', 'Shareholders\' funds', 'Current liabilities'],
      'Debtors and bills receivable are expected to be realised within the operating cycle, so they are <b>current assets</b>.'),
    mcq('fs-005', 2, 'classification', 'Goodwill of a company is shown under:', 'Non-current assets (intangible assets)', ['Current assets', 'Reserves and surplus', 'Non-current liabilities'],
      'Goodwill, patents and trademarks are <b>intangible assets</b>, a part of Non-current assets.'),
    mcq('fs-006', 2, 'classification', 'Long-term borrowings are shown under:', 'Non-current liabilities', ['Current liabilities', 'Shareholders\' funds', 'Current assets'],
      'Debentures and term loans repayable after more than 12 months are <b>non-current liabilities</b>.'),
    mcq('fs-007', 2, 'classification', 'Outstanding expenses are shown under:', 'Current liabilities (other current liabilities)', ['Non-current liabilities', 'Current assets', 'Reserves and surplus'],
      'Expenses due but not paid are a short-term obligation: <b>other current liabilities</b>.'),
    mcq('fs-008', 2, 'classification', 'Prepaid expenses are shown under:', 'Current assets (other current assets)', ['Current liabilities', 'Non-current assets', 'Shareholders\' funds'],
      'Prepaid expenses are amounts paid in advance, which will give a benefit within a year.', 'The word "outstanding" is a liability and "prepaid" is an asset.'),
    mcq('fs-009', 2, 'classification', 'Cash and cash equivalents includes:', 'cash, bank balances and deposits maturing within three months', ['all bank deposits', 'only cash in hand', 'investments for 5 years'],
      'The heading covers cash, balances with banks and short-term, highly liquid investments with a <b>maturity of three months or less</b>.'),
    mcq('fs-010', 2, 'classification', 'Calls in arrears are shown:', 'as a deduction from called-up share capital', ['as an asset', 'under Reserves and surplus', 'as a liability'],
      'The share capital note shows subscribed capital, minus calls unpaid, giving the paid-up capital.'),
    mcq('fs-011', 2, 'classification', 'A debit balance in the Statement of Profit and Loss is shown:', 'as a negative figure under Reserves and Surplus', ['as an asset under Current assets', 'as a liability', 'under Non-current assets'],
      'Accumulated losses reduce Reserves and Surplus; they are shown with a minus sign.'),
    mcq('fs-012', 2, 'classification', 'Which of these is shown under inventories?', 'Finished goods', ['Trade receivables', 'Cash in hand', 'Prepaid rent'],
      'Inventories include raw materials, work in progress, finished goods, stock in trade, and stores and spares.'),
    mcq('fs-013', 2, 'classification', 'Bank overdraft is shown under:', 'Current liabilities (short-term borrowings)', ['Cash and cash equivalents', 'Non-current liabilities', 'Reserves and surplus'],
      'It is a short-term borrowing, so a current liability.', 'Do not net it against bank balances.'),
    mcq('fs-014', 2, 'p&l', 'Interest received on investments is shown in the Statement of Profit and Loss under:', 'Other income', ['Revenue from operations', 'Finance costs', 'Other expenses'],
      'Income not from the main activity (interest, dividend, profit on sale of assets) is <b>other income</b>.'),
    mcq('fs-015', 2, 'p&l', 'Interest paid on debentures is shown under:', 'Finance costs', ['Employee benefit expense', 'Other income', 'Other expenses'],
      'Interest on borrowings is a <b>finance cost</b>.'),
    mcq('fs-016', 2, 'p&l', 'Salaries and wages are shown under:', 'Employee benefit expense', ['Other expenses', 'Finance costs', 'Cost of materials consumed'],
      'Salaries, wages, bonus, contribution to provident fund and staff welfare appear under <b>employee benefit expense</b>.'),
    mcq('fs-017', 3, 'p&l', 'Revenue from operations ₹12,00,000; other income ₹1,00,000; total expenses ₹11,00,000. Profit before tax is:', '₹2,00,000', ['₹1,00,000', '₹3,00,000', '₹13,00,000'],
      'Total revenue = 12,00,000 + 1,00,000 = 13,00,000. PBT = 13,00,000 − 11,00,000 = <b>₹2,00,000</b>.', 'Leaving out the other income.'),
    mcq('fs-018', 2, 'analysis', 'Comparing the figures of two or more years in a statement is called:', 'comparative analysis (horizontal analysis)', ['common-size analysis', 'ratio analysis only', 'cash flow analysis'],
      'Comparative statements show each item for different years with the change in amount and percentage.'),
    mcq('fs-019', 2, 'analysis', 'In common-size statements of profit and loss, each item is expressed as a percentage of:', 'Revenue from operations', ['Total assets', 'Total expenses', 'Net profit'],
      'The base for the statement of profit and loss is <b>revenue from operations</b>; for the balance sheet it is the total of equity and liabilities (or total assets).'),
    mcq('fs-020', 2, 'analysis', 'Revenue from operations rises from ₹8,00,000 to ₹10,00,000. The percentage increase is:', '25%', ['20%', '2%', '125%'],
      '(10,00,000 − 8,00,000) ÷ 8,00,000 = <b>25%</b>.', 'Dividing the change by the current year.'),
    mcq('fs-021', 3, 'analysis', 'Cost of materials consumed ₹3,00,000 and revenue from operations ₹10,00,000. In a common-size statement the cost is:', '30%', ['3%', '70%', '33.3%'],
      '3,00,000 ÷ 10,00,000 × 100 = <b>30%</b>.'),
    mcq('fs-022', 2, 'analysis', 'A tool of financial analysis that studies the relationship between two items is:', 'ratio analysis', ['journal', 'ledger', 'trial balance'],
      'Accounting ratios express the relationship between two financial figures.'),
    mcq('fs-023', 2, 'analysis', 'Which is a limitation of financial statement analysis?', 'It is based on historical cost and ignores price level changes', ['It uses audited figures', 'It tells exactly the future', 'It always includes non-financial factors'],
      'Statements rely on past records, so the effect of inflation and qualitative factors is not shown.'),
    mcq('fs-024', 2, 'classification', 'Which of the following is a current liability?', 'Trade payables', ['Debentures due in 5 years', 'Long-term bank loan', 'Securities premium'],
      'Creditors and bills payable are due within the operating cycle.'),
    mcq('fs-025', 2, 'classification', 'Investments held by a company for earning interest and to be sold within a year are:', 'current investments', ['non-current investments', 'fixed assets', 'cash equivalents always'],
      'Investments meant to be realised within 12 months are current investments.'),
    mcq('fs-026', 2, 'classification', 'Land and buildings used in the business are shown under:', 'Non-current assets (property, plant and equipment)', ['Current assets', 'Inventories', 'Other income'],
      'Tangible assets held for use over a long period are <b>property, plant and equipment</b>.'),
    mcq('fs-027', 2, 'classification', 'Patents and copyrights are shown under:', 'Non-current assets (intangible assets)', ['Property, plant and equipment', 'Current assets', 'Non-current investments'],
      'They have no physical form, so are <b>intangible assets</b>.'),
    mcq('fs-028', 2, 'classification', 'Advance received from customers is shown under:', 'Other current liabilities', ['Current assets', 'Shareholders\' funds', 'Reserves and surplus'],
      'The company owes goods or services to the customers, so it is a current liability.'),
    mcq('fs-029', 2, 'format', 'The Statement of Profit and Loss under Schedule III is prepared:', 'in vertical form, with revenue, expenses and profit before tax', ['in T-form with debit and credit sides', 'only for the shareholders', 'without comparing earlier years'],
      'The statement is vertical, and shows current year and previous year figures for comparison.'),
    mcq('fs-030', 3, 'analysis', 'Current liabilities were ₹4,00,000 in 2024 and ₹5,00,000 in 2025. The absolute and percentage change are:', '₹1,00,000 and 25%', ['₹1,00,000 and 20%', '₹9,00,000 and 25%', '₹1,00,000 and 125%'],
      'Change = 1,00,000. Percentage = 1,00,000 ÷ 4,00,000 = <b>25%</b> of the earlier year.'),
  ],
  gens: [
    { id: 'fs-g01', type: 'mcq', level: 2, sub: 'analysis', ...T,
      make(rng) {
        const a = int(rng, 4, 20) * 50000, p = choose(rng, [5, 10, 12, 15, 20, 25, 30, 40]), b = a * (1 + p / 100);
        const { options, answer } = shuffleOpts(rng, p, [+(((b - a) / b) * 100).toFixed(2), p + 5, Math.max(1, p - 5)], (v) => `${fmt(v)}%`);
        return { q: `Revenue from operations is ${rs(a, 0)} in 2024 and ${rs(b, 0)} in 2025. The percentage increase in revenue is:`, options, answer, a, b, p,
          sol: steps(`Increase = ${fmt(b, 0)} − ${fmt(a, 0)} = ${fmt(b - a, 0)}.`, `Percentage = ${fmt(b - a, 0)} ÷ ${fmt(a, 0)} × 100 = <b>${p}%</b>.`), trap: 'Divide by the earlier year (the base).' };
      },
      verify: (p) => `${fmt(((p.b - p.a) / p.a) * 100)}%` === p.options[p.answer] ? p.answer : -1 },
    { id: 'fs-g02', type: 'mcq', level: 2, sub: 'analysis', ...T,
      make(rng) {
        const rev = int(rng, 4, 20) * 100000, pc = choose(rng, [10, 20, 25, 30, 40, 50]), item = (rev * pc) / 100;
        const { options, answer } = shuffleOpts(rng, pc, [100 - pc, pc / 2, pc + 10], (v) => `${fmt(v)}%`);
        return { q: `In a common-size statement of profit and loss, an expense of ${rs(item, 0)} appears against revenue from operations of ${rs(rev, 0)}. The expense is:`, options, answer, item, rev,
          sol: steps(`Common-size % = item ÷ revenue × 100.`, `${fmt(item, 0)} ÷ ${fmt(rev, 0)} × 100 = <b>${pc}%</b>.`), trap: 'The base is revenue from operations.' };
      },
      verify: (p) => `${fmt((p.item / p.rev) * 100)}%` === p.options[p.answer] ? p.answer : -1 },
    { id: 'fs-g03', type: 'mcq', level: 2, sub: 'p&l', ...T,
      make(rng) {
        const rev = int(rng, 4, 20) * 100000, oi = int(rng, 1, 5) * 10000, ex = rev - int(rng, 1, 4) * 50000;
        const pbt = rev + oi - ex;
        const { options, answer } = shuffleOpts(rng, pbt, [rev - ex, rev + oi + ex, ex - rev - oi + 20000], (v) => rs(v, 0));
        return { q: `Revenue from operations is ${rs(rev, 0)}, other income ${rs(oi, 0)} and total expenses ${rs(ex, 0)}. Profit before tax is:`, options, answer, rev, oi, ex,
          sol: steps(`Total revenue = ${fmt(rev, 0)} + ${fmt(oi, 0)} = ${fmt(rev + oi, 0)}.`, `PBT = ${fmt(rev + oi, 0)} − ${fmt(ex, 0)} = <b>${rs(pbt, 0)}</b>.`), trap: 'Other income is added before deducting expenses.' };
      },
      verify: (p) => rs(p.rev + p.oi - p.ex, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'fs-g04', type: 'mcq', level: 2, sub: 'classification', ...T,
      make(rng) {
        const cap = int(rng, 4, 20) * 100000, sp = int(rng, 1, 5) * 20000, gr = int(rng, 1, 5) * 10000, pl = int(rng, 1, 4) * 10000;
        const sf = cap + sp + gr + pl;
        const { options, answer } = shuffleOpts(rng, sf, [cap + sp + gr, cap + sp + gr - pl, sf + 50000], (v) => rs(v, 0));
        return { q: `A company has share capital ${rs(cap, 0)}, securities premium ${rs(sp, 0)}, general reserve ${rs(gr, 0)} and a surplus (balance in the statement of profit and loss) of ${rs(pl, 0)}. Shareholders' funds are:`, options, answer, sf,
          sol: steps(`Shareholders' funds = share capital + reserves and surplus.`, `${fmt(cap, 0)} + ${fmt(sp, 0)} + ${fmt(gr, 0)} + ${fmt(pl, 0)} = <b>${rs(sf, 0)}</b>.`), trap: 'A credit surplus is added; a deficit would be deducted.' };
      },
      verify: (p) => rs(p.sf, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'fs-g05', type: 'mcq', level: 2, sub: 'analysis', ...T,
      make(rng) {
        const a = int(rng, 4, 20) * 40000, p = choose(rng, [10, 20, 25, 50]), b = a * (1 - p / 100);
        const { options, answer } = shuffleOpts(rng, p, [+(((a - b) / b) * 100).toFixed(2), p / 2, p + 10], (v) => `${fmt(v)}%`);
        return { q: `Net profit fell from ${rs(a, 0)} in 2024 to ${rs(b, 0)} in 2025. The percentage decrease is:`, options, answer, a, b, p,
          sol: steps(`Decrease = ${fmt(a, 0)} − ${fmt(b, 0)} = ${fmt(a - b, 0)}.`, `Percentage = ${fmt(a - b, 0)} ÷ ${fmt(a, 0)} × 100 = <b>${p}%</b>.`), trap: 'The base is the earlier year, not the later year.' };
      },
      verify: (p) => `${fmt(((p.a - p.b) / p.a) * 100)}%` === p.options[p.answer] ? p.answer : -1 },
  ],
};
