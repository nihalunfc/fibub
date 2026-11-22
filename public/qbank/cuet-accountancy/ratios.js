// CUET Accountancy: accounting ratios. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'ratios',
  items: [
    mcq('ra-001', 1, 'liquidity', 'Current ratio is calculated as:', 'current assets ÷ current liabilities', ['current liabilities ÷ current assets', 'liquid assets ÷ total assets', 'current assets ÷ total liabilities'],
      'Current ratio = <b>Current assets / Current liabilities</b>. A ratio of about 2 : 1 is commonly regarded as satisfactory.'),
    mcq('ra-002', 1, 'liquidity', 'Which pair are the liquidity ratios?', 'Current ratio and quick ratio', ['Debt-equity ratio and proprietary ratio', 'Gross profit ratio and net profit ratio', 'Inventory turnover and debtors turnover'],
      'Liquidity ratios test short-term paying power: current ratio and quick (liquid) ratio.'),
    mcq('ra-003', 2, 'liquidity', 'Current assets ₹4,00,000 and current liabilities ₹2,00,000. Current ratio is:', '2 : 1', ['1 : 2', '4 : 1', '1 : 1'],
      '4,00,000 ÷ 2,00,000 = <b>2 : 1</b>.'),
    mcq('ra-004', 2, 'liquidity', 'Current assets ₹5,00,000 include inventory ₹1,50,000 and prepaid expenses ₹50,000. Current liabilities ₹2,00,000. Quick ratio is:', '1.5 : 1', ['2.5 : 1', '1.25 : 1', '2 : 1'],
      'Quick assets = 5,00,000 − 1,50,000 − 50,000 = 3,00,000. 3,00,000 ÷ 2,00,000 = <b>1.5 : 1</b>.', 'Remember to deduct prepaid expenses as well as inventory.'),
    mcq('ra-005', 2, 'liquidity', 'Current ratio is 2 : 1 and working capital is ₹3,00,000. Current assets are:', '₹6,00,000', ['₹3,00,000', '₹9,00,000', '₹4,50,000'],
      'CA = 2 CL and CA − CL = 3,00,000, so CL = 3,00,000 and CA = <b>₹6,00,000</b>.'),
    mcq('ra-006', 2, 'liquidity', 'Working capital is calculated as:', 'current assets − current liabilities', ['total assets − total liabilities', 'current assets + current liabilities', 'fixed assets − current liabilities'],
      'Working capital = CA − CL.'),
    mcq('ra-007', 3, 'liquidity', 'Current ratio is 3 : 1 and working capital is ₹4,00,000. Current liabilities are:', '₹2,00,000', ['₹4,00,000', '₹6,00,000', '₹1,33,333'],
      '3 CL − CL = 4,00,000, so CL = <b>₹2,00,000</b> and CA = ₹6,00,000.'),
    mcq('ra-008', 3, 'effect', 'Current assets ₹4,00,000 and current liabilities ₹2,00,000. Creditors of ₹50,000 are paid in cash. The new current ratio is:', '2.33 : 1', ['2 : 1', '1.8 : 1', '2.5 : 1'],
      'CA = 3,50,000 and CL = 1,50,000. 3,50,000 ÷ 1,50,000 = <b>2.33</b>. It rises, as both fall by the same amount and the ratio is above 1.', 'Both sides fall, so the ratio does not stay the same.'),
    mcq('ra-009', 3, 'effect', 'Current ratio is 2 : 1 (CA ₹4,00,000, CL ₹2,00,000). Goods of ₹50,000 are bought on credit. The new current ratio is:', '1.8 : 1', ['2 : 1', '2.33 : 1', '1.5 : 1'],
      'CA = 4,50,000 and CL = 2,50,000. 4,50,000 ÷ 2,50,000 = <b>1.8</b>. It falls.'),
    mcq('ra-010', 2, 'solvency', 'Debt-equity ratio is:', 'long-term debt ÷ shareholders\' funds', ['shareholders\' funds ÷ long-term debt', 'total debts ÷ total assets', 'current liabilities ÷ shareholders\' funds'],
      'Debt-equity ratio = <b>Long-term debts / Shareholders\' funds</b>.'),
    mcq('ra-011', 2, 'solvency', 'Long-term debt ₹6,00,000 and shareholders\' funds ₹12,00,000. Debt-equity ratio is:', '0.5 : 1', ['2 : 1', '0.6 : 1', '1 : 1'],
      '6,00,000 ÷ 12,00,000 = <b>0.5 : 1</b>.'),
    mcq('ra-012', 2, 'solvency', 'A high debt-equity ratio means:', 'greater use of borrowed funds, so greater risk', ['more safety to lenders', 'higher liquidity', 'higher profitability always'],
      'More debt means fixed interest burden and more risk to lenders.'),
    mcq('ra-013', 2, 'solvency', 'Proprietary ratio is:', 'shareholders\' funds ÷ total assets', ['total assets ÷ shareholders\' funds', 'long-term debt ÷ total assets', 'current assets ÷ shareholders\' funds'],
      'Proprietary ratio = <b>Shareholders\' funds / Total assets</b>, showing how much of the assets the owners finance.'),
    mcq('ra-014', 2, 'solvency', 'Shareholders\' funds ₹8,00,000 and total assets ₹12,00,000. Proprietary ratio is:', '66.67%', ['150%', '50%', '33.33%'],
      '8,00,000 ÷ 12,00,000 = 0.6667, i.e. <b>66.67%</b>.'),
    mcq('ra-015', 3, 'solvency', 'Profit before interest and tax is ₹3,00,000 and interest on long-term debt is ₹50,000. Interest coverage ratio is:', '6 times', ['5 times', '0.17 times', '7 times'],
      '3,00,000 ÷ 50,000 = <b>6 times</b>.', 'Using profit after interest (2,50,000) gives 5 times.'),
    mcq('ra-016', 2, 'activity', 'Inventory turnover ratio is:', 'cost of revenue from operations ÷ average inventory', ['revenue from operations ÷ closing inventory', 'average inventory ÷ cost of goods sold', 'net purchases ÷ average inventory'],
      'It is <b>Cost of goods sold / Average inventory</b>. The cost of goods sold is used, not sales.'),
    mcq('ra-017', 2, 'activity', 'Cost of goods sold ₹6,00,000; opening inventory ₹90,000; closing ₹1,10,000. Inventory turnover is:', '6 times', ['5.45 times', '6.67 times', '10 times'],
      'Average = (90,000 + 1,10,000) ÷ 2 = 1,00,000. 6,00,000 ÷ 1,00,000 = <b>6 times</b>.'),
    mcq('ra-018', 2, 'activity', 'Revenue from operations ₹10,00,000, gross profit 25% on revenue. Cost of goods sold is:', '₹7,50,000', ['₹2,50,000', '₹12,50,000', '₹10,00,000'],
      'GP = 2,50,000. COGS = 10,00,000 − 2,50,000 = <b>₹7,50,000</b>.'),
    mcq('ra-019', 2, 'activity', 'Net credit revenue ₹8,00,000; trade receivables ₹70,000 at the start and ₹90,000 at the end. Trade receivables turnover is:', '10 times', ['8.9 times', '11.4 times', '8 times'],
      'Average = 80,000. 8,00,000 ÷ 80,000 = <b>10 times</b>. Collection period = 365 ÷ 10 = 36.5 days.'),
    mcq('ra-020', 2, 'activity', 'Net credit purchases ₹9,00,000; average trade payables ₹1,50,000. Trade payables turnover is:', '6 times', ['0.17 times', '7 times', '10 times'],
      '9,00,000 ÷ 1,50,000 = <b>6 times</b>, i.e. payment is made every 2 months.'),
    mcq('ra-021', 2, 'activity', 'Revenue from operations ₹12,00,000; working capital ₹3,00,000. Working capital turnover ratio is:', '4 times', ['0.25 times', '36 times', '9 times'],
      '12,00,000 ÷ 3,00,000 = <b>4 times</b>.'),
    mcq('ra-022', 2, 'profitability', 'Gross profit ratio is:', 'gross profit ÷ revenue from operations × 100', ['gross profit ÷ cost of sales × 100', 'net profit ÷ revenue × 100', 'gross profit ÷ capital × 100'],
      'It is calculated on <b>revenue (sales)</b>, not on cost.', 'A mark-up is on cost; a gross profit ratio is on sales.'),
    mcq('ra-023', 2, 'profitability', 'Revenue ₹20,00,000; net profit ₹2,00,000. Net profit ratio is:', '10%', ['1%', '90%', '20%'],
      '2,00,000 ÷ 20,00,000 × 100 = <b>10%</b>.'),
    mcq('ra-024', 2, 'profitability', 'Cost of revenue from operations ₹6,00,000, operating expenses ₹1,00,000, revenue ₹10,00,000. Operating ratio is:', '70%', ['30%', '60%', '110%'],
      'Operating ratio = (6,00,000 + 1,00,000) ÷ 10,00,000 × 100 = <b>70%</b>. Operating profit ratio = 30%.'),
    mcq('ra-025', 2, 'profitability', 'If the operating ratio is 70%, the operating profit ratio is:', '30%', ['70%', '100%', '170%'],
      'Operating ratio + operating profit ratio = 100%, so <b>30%</b>.'),
    mcq('ra-026', 2, 'profitability', 'Return on investment is calculated as:', 'profit before interest and tax ÷ capital employed × 100', ['net profit ÷ sales × 100', 'sales ÷ capital employed', 'profit after tax ÷ total liabilities'],
      'ROI = <b>PBIT / Capital employed × 100</b>.'),
    mcq('ra-027', 3, 'profitability', 'PBIT is ₹1,20,000 and capital employed is ₹8,00,000. ROI is:', '15%', ['6.67%', '10%', '66.7%'],
      '1,20,000 ÷ 8,00,000 × 100 = <b>15%</b>.'),
    mcq('ra-028', 2, 'profitability', 'Capital employed is the sum of:', 'shareholders\' funds and non-current liabilities', ['current assets and current liabilities', 'fixed assets and investments only', 'share capital only'],
      'Capital employed = Shareholders\' funds + Long-term (non-current) liabilities, also equal to non-current assets + working capital.'),
    mcq('ra-029', 2, 'types', 'Which is an activity (turnover) ratio?', 'Trade receivables turnover', ['Debt-equity ratio', 'Current ratio', 'Net profit ratio'],
      'Turnover ratios show how well assets are used: inventory, receivables, payables, working capital turnover.'),
    mcq('ra-030', 2, 'types', 'Debt-equity ratio and interest coverage ratio are examples of:', 'solvency ratios', ['liquidity ratios', 'activity ratios', 'profitability ratios'],
      'Solvency ratios test long-term financial strength.'),
    mcq('ra-031', 3, 'effect', 'Current ratio is 2 : 1. A fixed asset is sold for cash at book value. The current ratio will:', 'increase', ['decrease', 'stay the same', 'become zero'],
      'Cash (a current asset) increases while current liabilities do not change, so current assets rise and the ratio <b>increases</b>.'),
    mcq('ra-032', 2, 'activity', 'Trade receivables turnover is 10 times. The average collection period (365 days) is:', '36.5 days', ['3.65 days', '10 days', '365 days'],
      '365 ÷ 10 = <b>36.5 days</b>.'),
  ],
  gens: [
    { id: 'ra-g01', type: 'mcq', level: 2, sub: 'liquidity', ...T,
      make(rng) {
        const cl = int(rng, 2, 10) * 50000, k = choose(rng, [1.5, 2, 2.5, 3]), ca = cl * k;
        const { options, answer } = shuffleOpts(rng, k, [1 / k, k + 1, k - 0.5], (v) => `${fmt(v)} : 1`);
        return { q: `Current assets are ${rs(ca, 0)} and current liabilities are ${rs(cl, 0)}. The current ratio is:`, options, answer, ca, cl,
          sol: steps(`Current ratio = current assets ÷ current liabilities.`, `${fmt(ca, 0)} ÷ ${fmt(cl, 0)} = <b>${fmt(k)} : 1</b>.`), trap: 'Assets go on top, liabilities below.' };
      },
      verify: (p) => `${fmt(p.ca / p.cl)} : 1` === p.options[p.answer] ? p.answer : -1 },
    { id: 'ra-g02', type: 'mcq', level: 2, sub: 'liquidity', ...T,
      make(rng) {
        const cl = int(rng, 2, 8) * 50000, inv = int(rng, 1, 3) * 50000, pp = choose(rng, [0, 10000, 20000]), q = int(rng, 1, 3) * cl / 2 + cl / 2 * 0;
        const quick = q, ca = quick + inv + pp, ratio = quick / cl;
        const { options, answer } = shuffleOpts(rng, ratio, [ca / cl, (ca - inv) / cl + 0.2, cl / quick], (v) => `${fmt(v)} : 1`);
        return { q: `Current assets are ${rs(ca, 0)}, of which inventory is ${rs(inv, 0)} and prepaid expenses ${rs(pp, 0)}. Current liabilities are ${rs(cl, 0)}. The quick ratio is:`, options, answer, quick, cl,
          sol: steps(`Quick assets = ${fmt(ca, 0)} − ${fmt(inv, 0)} − ${fmt(pp, 0)} = ${fmt(quick, 0)}.`, `Quick ratio = ${fmt(quick, 0)} ÷ ${fmt(cl, 0)} = <b>${fmt(ratio)} : 1</b>.`), trap: 'Deduct inventory and prepaid expenses.' };
      },
      verify: (p) => `${fmt(p.quick / p.cl)} : 1` === p.options[p.answer] ? p.answer : -1 },
    { id: 'ra-g03', type: 'mcq', level: 2, sub: 'solvency', ...T,
      make(rng) {
        const sf = int(rng, 4, 20) * 100000, k = choose(rng, [0.25, 0.5, 0.75, 1, 1.5, 2]), d = sf * k;
        const { options, answer } = shuffleOpts(rng, k, [1 / k, k + 0.5, k / 2], (v) => `${fmt(v)} : 1`);
        return { q: `Long-term borrowings are ${rs(d, 0)} and shareholders' funds are ${rs(sf, 0)}. The debt-equity ratio is:`, options, answer, d, sf,
          sol: steps(`Debt-equity ratio = long-term debt ÷ shareholders' funds.`, `${fmt(d, 0)} ÷ ${fmt(sf, 0)} = <b>${fmt(k)} : 1</b>.`), trap: 'Debt on top, equity below.' };
      },
      verify: (p) => `${fmt(p.d / p.sf)} : 1` === p.options[p.answer] ? p.answer : -1 },
    { id: 'ra-g04', type: 'mcq', level: 2, sub: 'activity', ...T,
      make(rng) {
        const avg = int(rng, 2, 10) * 50000, t = choose(rng, [3, 4, 5, 6, 8, 10]), cogs = avg * t, d = int(rng, 1, 4) * 10000;
        const op = avg - d, cl = avg + d;
        const { options, answer } = shuffleOpts(rng, t, [cogs / cl, cogs / op, t + 1], (v) => `${fmt(v)} times`);
        return { q: `Cost of goods sold is ${rs(cogs, 0)}. Opening inventory is ${rs(op, 0)} and closing inventory is ${rs(cl, 0)}. The inventory turnover ratio is:`, options, answer, cogs, op, cl,
          sol: steps(`Average inventory = (${fmt(op, 0)} + ${fmt(cl, 0)}) ÷ 2 = ${fmt(avg, 0)}.`, `Turnover = ${fmt(cogs, 0)} ÷ ${fmt(avg, 0)} = <b>${fmt(t)} times</b>.`), trap: 'Use average inventory, not just the closing figure.' };
      },
      verify: (p) => `${fmt(p.cogs / ((p.op + p.cl) / 2))} times` === p.options[p.answer] ? p.answer : -1 },
    { id: 'ra-g05', type: 'mcq', level: 2, sub: 'profitability', ...T,
      make(rng) {
        const rev = int(rng, 4, 20) * 100000, pc = choose(rng, [5, 8, 10, 12, 15, 20, 25]), np = (rev * pc) / 100;
        const { options, answer } = shuffleOpts(rng, pc, [100 - pc, pc * 2, pc + 5], (v) => `${fmt(v)}%`);
        return { q: `Revenue from operations is ${rs(rev, 0)} and net profit is ${rs(np, 0)}. The net profit ratio is:`, options, answer, rev, np,
          sol: steps(`Net profit ratio = net profit ÷ revenue × 100.`, `${fmt(np, 0)} ÷ ${fmt(rev, 0)} × 100 = <b>${pc}%</b>.`), trap: 'The base is revenue, not capital.' };
      },
      verify: (p) => `${fmt((p.np / p.rev) * 100)}%` === p.options[p.answer] ? p.answer : -1 },
    { id: 'ra-g06', type: 'mcq', level: 3, sub: 'profitability', ...T,
      make(rng) {
        const ce = int(rng, 4, 20) * 100000, pc = choose(rng, [8, 10, 12, 15, 20]), pbit = (ce * pc) / 100;
        const { options, answer } = shuffleOpts(rng, pc, [pc / 2, pc + 4, 100 - pc], (v) => `${fmt(v)}%`);
        return { q: `Profit before interest and tax is ${rs(pbit, 0)} and capital employed is ${rs(ce, 0)}. Return on investment is:`, options, answer, pbit, ce,
          sol: steps(`ROI = PBIT ÷ capital employed × 100.`, `${fmt(pbit, 0)} ÷ ${fmt(ce, 0)} × 100 = <b>${pc}%</b>.`), trap: 'PBIT is used, not the profit after interest.' };
      },
      verify: (p) => `${fmt((p.pbit / p.ce) * 100)}%` === p.options[p.answer] ? p.answer : -1 },
  ],
};
