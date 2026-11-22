// CUET Accountancy: cash flow statement. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'cash-flow',
  items: [
    mcq('cf-001', 1, 'basics', 'A cash flow statement reports:', 'the inflows and outflows of cash and cash equivalents during a period', ['profit earned by the company', 'the assets and liabilities on a date', 'the dividends proposed'],
      'It shows how cash came in and went out, classified under operating, investing and financing activities.'),
    mcq('cf-002', 1, 'basics', 'The three activities in a cash flow statement are:', 'operating, investing and financing', ['buying, selling and lending', 'revenue, capital and reserve', 'current, fixed and fictitious'],
      'Cash flows are divided into <b>operating, investing and financing</b> activities.'),
    mcq('cf-003', 2, 'basics', 'Cash equivalents are:', 'short-term, highly liquid investments with maturity of three months or less', ['all investments of the company', 'debtors due in a month', 'bank loans'],
      'They can be converted into cash readily and carry little risk of change in value.'),
    mcq('cf-004', 2, 'classification', 'Cash received from customers for goods sold is an:', 'operating activity', ['investing activity', 'financing activity', 'non-cash item'],
      'The main revenue-producing activity of the firm is <b>operating</b>.'),
    mcq('cf-005', 2, 'classification', 'Purchase of machinery for cash is a/an:', 'investing activity', ['operating activity', 'financing activity', 'cash equivalent'],
      'Buying and selling long-term assets and investments are <b>investing</b> activities.'),
    mcq('cf-006', 2, 'classification', 'Issue of equity shares for cash is a/an:', 'financing activity', ['operating activity', 'investing activity', 'non-cash item'],
      'Raising or repaying owner\'s funds and borrowings is <b>financing</b>.'),
    mcq('cf-007', 2, 'classification', 'Interest and dividend received on investments are classified as:', 'investing activities', ['financing activities', 'operating activities', 'not shown'],
      'In the usual NCERT treatment of a non-financial company, interest and dividend received are <b>investing</b> inflows.'),
    mcq('cf-008', 2, 'classification', 'Interest paid on debentures and dividend paid are classified as:', 'financing activities', ['operating activities', 'investing activities', 'not shown'],
      'Payments to those who provide funds (lenders and owners) are <b>financing</b> outflows.'),
    mcq('cf-009', 2, 'classification', 'Income tax paid is shown under:', 'operating activities', ['financing activities', 'investing activities', 'cash equivalents'],
      'Taxes on income are normally classified as an <b>operating</b> outflow unless tied to investing or financing.'),
    mcq('cf-010', 2, 'classification', 'Which of the following does NOT result in a cash flow?', 'Issue of shares to the vendor for machinery', ['Purchase of machinery for cash', 'Sale of investments for cash', 'Payment of dividend'],
      'No cash changes hands when shares are issued for an asset, so it is a <b>non-cash transaction</b> and is not shown.'),
    mcq('cf-011', 2, 'classification', 'Purchase of marketable securities with maturity of 2 months results in:', 'no change in cash flows, as it is a cash equivalent', ['an investing outflow', 'an operating outflow', 'a financing outflow'],
      'It is moving cash into a cash equivalent, so the total of cash and cash equivalents is unchanged.', 'The three-month test decides this.'),
    mcq('cf-012', 2, 'classification', 'Depositing cash from the cash box into the bank account causes:', 'no flow, as both are cash', ['an operating inflow', 'an investing outflow', 'a financing inflow'],
      'Cash in hand and bank balances are both part of cash and cash equivalents. Moving between them changes nothing.'),
    mcq('cf-013', 2, 'classification', 'Repayment of a long-term loan is:', 'a financing outflow', ['an operating outflow', 'an investing outflow', 'a non-cash item'],
      'Repaying borrowings changes the capital structure, so it is financing.'),
    mcq('cf-014', 2, 'classification', 'Proceeds from sale of old machinery are shown under:', 'investing activities', ['operating activities', 'financing activities', 'adjustments to profit'],
      'The cash from the sale (not the profit) is an <b>investing inflow</b>.'),
    mcq('cf-015', 2, 'classification', 'Bonus shares issued to shareholders appear in the cash flow statement as:', 'not shown, as there is no cash flow', ['financing inflow', 'investing inflow', 'operating inflow'],
      'Bonus shares are a transfer from reserves to capital and involve no cash.'),
    mcq('cf-016', 3, 'operating', 'Net profit before tax ₹2,00,000; depreciation ₹30,000; interest expense ₹10,000; profit on sale of asset ₹5,000. Operating profit before working capital changes is:', '₹2,35,000', ['₹2,45,000', '₹2,25,000', '₹2,75,000'],
      '2,00,000 + 30,000 + 10,000 − 5,000 = <b>₹2,35,000</b>. Non-cash and non-operating items are adjusted: depreciation and interest expense are added back, the profit on sale is deducted.'),
    mcq('cf-017', 3, 'operating', 'Operating profit before working capital changes ₹2,35,000. Trade receivables increased by ₹20,000, inventory decreased by ₹15,000 and trade payables increased by ₹10,000. Cash generated from operations is:', '₹2,40,000', ['₹2,10,000', '₹2,30,000', '₹2,60,000'],
      '2,35,000 − 20,000 + 15,000 + 10,000 = <b>₹2,40,000</b>.', 'An increase in current assets is a use of cash.'),
    mcq('cf-018', 3, 'operating', 'Cash generated from operations is ₹2,40,000 and tax paid is ₹50,000. Net cash from operating activities is:', '₹1,90,000', ['₹2,90,000', '₹2,40,000', '₹1,40,000'],
      '2,40,000 − 50,000 = <b>₹1,90,000</b>.'),
    mcq('cf-019', 2, 'operating', 'In a cash flow statement prepared from net profit before tax, loss on sale of machinery is:', 'added back and the sale proceeds shown in investing activities', ['deducted in operating activities', 'shown in financing activities', 'ignored fully'],
      'It is a non-operating item, so it is added back, and the <b>cash received</b> is shown as an investing inflow.'),
    mcq('cf-020', 2, 'operating', 'Machinery of book value ₹80,000 is sold at a loss of ₹10,000. The cash proceeds are:', '₹70,000', ['₹90,000', '₹10,000', '₹80,000'],
      '80,000 − 10,000 = <b>₹70,000</b>.'),
    mcq('cf-021', 2, 'operating', 'Which is added back to net profit before tax to find cash from operations?', 'Depreciation', ['Profit on sale of investments', 'Interest received', 'Dividend received'],
      'Depreciation is a non-cash charge. Items like profit on sale, interest and dividend received are <b>deducted</b>, as they belong to investing.'),
    mcq('cf-022', 2, 'operating', 'A decrease in trade payables during the year:', 'reduces cash from operating activities', ['increases cash from operating activities', 'is shown in investing activities', 'has no effect'],
      'Paying more to creditors than the credit purchases means cash left, so it is a <b>deduction</b>.'),
    mcq('cf-023', 3, 'financing', 'Issue of shares ₹5,00,000; repayment of loan ₹1,50,000; interest paid ₹20,000; dividend paid ₹40,000. Net cash from financing activities is:', '₹2,90,000', ['₹3,50,000', '₹3,10,000', '₹2,50,000'],
      '5,00,000 − 1,50,000 − 20,000 − 40,000 = <b>₹2,90,000</b>.'),
    mcq('cf-024', 3, 'investing', 'Purchase of fixed assets ₹3,00,000; sale of investments ₹1,20,000; interest received ₹8,000; dividend received ₹12,000. Net cash used in investing activities is:', '₹1,60,000', ['₹1,80,000', '₹2,60,000', '₹1,40,000'],
      '−3,00,000 + 1,20,000 + 8,000 + 12,000 = <b>−₹1,60,000</b> (a net outflow).'),
    mcq('cf-025', 3, 'closing cash', 'Operating activities ₹1,50,000; investing activities −₹90,000; financing activities +₹20,000. Opening cash and cash equivalents ₹30,000. Closing balance is:', '₹1,10,000', ['₹80,000', '₹1,40,000', '₹1,70,000'],
      'Net increase = 1,50,000 − 90,000 + 20,000 = 80,000. Closing = 30,000 + 80,000 = <b>₹1,10,000</b>.', 'Forgetting to add the opening balance.'),
    mcq('cf-026', 2, 'purpose', 'Which statement about the cash flow statement is correct?', 'It does not replace the profit and loss statement', ['It shows profit for the year', 'It is prepared on the accrual basis', 'It includes non-cash items'],
      'It reports cash movements only, and so complements but does not replace the P&L and balance sheet.'),
    mcq('cf-027', 2, 'classification', 'Proceeds from issue of debentures are:', 'financing inflows', ['operating inflows', 'investing inflows', 'non-cash'],
      'Raising borrowed money is a financing inflow, at the cash actually received.'),
    mcq('cf-028', 2, 'classification', 'Loan advanced to another company is a:', 'investing outflow', ['financing outflow', 'operating outflow', 'non-cash item'],
      'Advances and loans made to others are investing.'),
    mcq('cf-029', 3, 'operating', 'Net profit before tax ₹1,00,000; interest received ₹6,000; dividend received ₹4,000; depreciation ₹20,000; increase in inventory ₹10,000. Cash from operations is:', '₹1,00,000', ['₹1,10,000', '₹1,20,000', '₹90,000'],
      '1,00,000 − 6,000 − 4,000 + 20,000 = 1,10,000. Less increase in inventory 10,000 = <b>₹1,00,000</b>.'),
    mcq('cf-030', 3, 'closing cash', 'Closing cash and cash equivalents are ₹90,000 and the net decrease during the year is ₹20,000. The opening balance was:', '₹1,10,000', ['₹70,000', '₹90,000', '₹20,000'],
      'Opening − 20,000 = 90,000, so opening = <b>₹1,10,000</b>.'),
  ],
  gens: [
    { id: 'cf-g01', type: 'mcq', level: 3, sub: 'operating', ...T,
      make(rng) {
        const np = int(rng, 4, 20) * 50000, dep = int(rng, 1, 5) * 10000, ie = int(rng, 1, 4) * 5000, gain = int(rng, 1, 3) * 5000;
        const r = np + dep + ie - gain;
        const { options, answer } = shuffleOpts(rng, r, [np + dep + ie + gain, np + dep - ie - gain, np - dep + ie + gain], (v) => rs(v, 0));
        return { q: `Net profit before tax is ${rs(np, 0)}. It is after charging depreciation ${rs(dep, 0)} and interest expense ${rs(ie, 0)}, and after crediting a profit on sale of an asset of ${rs(gain, 0)}. Operating profit before working capital changes is:`, options, answer, np, dep, ie, gain,
          sol: steps(`Add back depreciation and interest expense; deduct the profit on sale.`, `${fmt(np, 0)} + ${fmt(dep, 0)} + ${fmt(ie, 0)} − ${fmt(gain, 0)} = <b>${rs(r, 0)}</b>.`), trap: 'Profit on sale belongs to investing, so deduct it.' };
      },
      verify: (p) => rs(p.np + p.dep + p.ie - p.gain, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'cf-g02', type: 'mcq', level: 3, sub: 'operating', ...T,
      make(rng) {
        const op = int(rng, 4, 20) * 50000, dr = int(rng, 1, 4) * 10000, di = int(rng, 1, 3) * 10000, cp = int(rng, 1, 4) * 5000, tax = int(rng, 1, 4) * 10000;
        const net = op - dr + di + cp - tax;
        const { options, answer } = shuffleOpts(rng, net, [op + dr - di - cp - tax, op - dr + di + cp, op - dr - di + cp - tax], (v) => rs(v, 0));
        return { q: `Operating profit before working capital changes is ${rs(op, 0)}. Trade receivables increased by ${rs(dr, 0)}, inventory decreased by ${rs(di, 0)} and trade payables increased by ${rs(cp, 0)}. Tax paid is ${rs(tax, 0)}. Net cash from operating activities is:`, options, answer, op, dr, di, cp, tax,
          sol: steps(`Increase in current assets is deducted; decrease is added. Increase in current liabilities is added.`, `${fmt(op, 0)} − ${fmt(dr, 0)} + ${fmt(di, 0)} + ${fmt(cp, 0)} = ${fmt(op - dr + di + cp, 0)}.`, `Less tax ${fmt(tax, 0)} = <b>${rs(net, 0)}</b>.`), trap: 'Do not forget the tax paid.' };
      },
      verify: (p) => rs(p.op - p.dr + p.di + p.cp - p.tax, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'cf-g03', type: 'mcq', level: 3, sub: 'financing', ...T,
      make(rng) {
        const sh = int(rng, 4, 20) * 50000, rl = int(rng, 1, 4) * 25000, ip = int(rng, 1, 4) * 5000, dv = int(rng, 1, 4) * 10000;
        const net = sh - rl - ip - dv;
        const { options, answer } = shuffleOpts(rng, net, [sh - rl, sh + rl - ip - dv, sh - rl - ip + dv], (v) => rs(v, 0));
        return { q: `A company issues shares for ${rs(sh, 0)}, repays a loan of ${rs(rl, 0)}, pays interest ${rs(ip, 0)} and dividend ${rs(dv, 0)}. Net cash from financing activities is:`, options, answer, sh, rl, ip, dv,
          sol: steps(`Inflow: shares ${fmt(sh, 0)}. Outflows: loan ${fmt(rl, 0)}, interest ${fmt(ip, 0)}, dividend ${fmt(dv, 0)}.`, `Net = <b>${rs(net, 0)}</b>.`), trap: 'Interest paid and dividend paid are financing outflows.' };
      },
      verify: (p) => rs(p.sh - p.rl - p.ip - p.dv, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'cf-g04', type: 'mcq', level: 3, sub: 'closing cash', ...T,
      make(rng) {
        const o = int(rng, 4, 20) * 20000, i = int(rng, 1, 5) * -20000, f = int(rng, 1, 5) * 10000, op0 = int(rng, 1, 5) * 10000;
        const net = o + i + f, close = op0 + net;
        const { options, answer } = shuffleOpts(rng, close, [net, op0 + o + f - i, close + op0], (v) => rs(v, 0));
        return { q: `Net cash from operating activities is ${rs(o, 0)}, from investing activities −${rs(-i, 0)} and from financing activities ${rs(f, 0)}. Opening cash and cash equivalents are ${rs(op0, 0)}. The closing balance is:`, options, answer, o, i, f, op0,
          sol: steps(`Net change = ${fmt(o, 0)} − ${fmt(-i, 0)} + ${fmt(f, 0)} = ${fmt(net, 0)}.`, `Closing = ${fmt(op0, 0)} + ${fmt(net, 0)} = <b>${rs(close, 0)}</b>.`), trap: 'Add the opening balance to the net change.' };
      },
      verify: (p) => rs(p.op0 + p.o + p.i + p.f, 0) === p.options[p.answer] ? p.answer : -1 },
    { id: 'cf-g05', type: 'mcq', level: 2, sub: 'investing', ...T,
      make(rng) {
        const bv = int(rng, 4, 20) * 10000, loss = int(rng, 1, 3) * 5000, pr = bv - loss;
        const { options, answer } = shuffleOpts(rng, pr, [bv + loss, bv, loss], (v) => rs(v, 0));
        return { q: `Machinery with a book value of ${rs(bv, 0)} is sold at a loss of ${rs(loss, 0)}. The cash inflow shown under investing activities is:`, options, answer, bv, loss,
          sol: steps(`Proceeds = book value − loss.`, `${fmt(bv, 0)} − ${fmt(loss, 0)} = <b>${rs(pr, 0)}</b>.`), trap: 'The loss is added back in operating activities; the proceeds go in investing.' };
      },
      verify: (p) => rs(p.bv - p.loss, 0) === p.options[p.answer] ? p.answer : -1 },
  ],
};
