// CUET Economics: government budget and the economy. Original questions for fibub.
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
const C = (v) => `₹${fmt(v, 0)} crore`;

export default {
  topic: 'budget',
  items: [
    mcq('bu-001', 1, 'budget', 'The Union Budget is formally called the', 'Annual Financial Statement', ['Economic Survey', 'Finance Commission Report', 'Monetary Policy Statement'],
      'Article 112 of the Constitution requires the government to place an Annual Financial Statement of estimated receipts and expenditure before Parliament each year. The Economic Survey is a separate document.'),
    mcq('bu-002', 1, 'taxes', 'Which of the following is an indirect tax?', 'Goods and services tax (GST)', ['Income tax', 'Corporation tax', 'Tax on capital gains'],
      'An indirect tax is levied on goods and services, and its burden can be shifted to the buyer. Income, corporation and capital gains taxes are direct taxes on persons or firms.'),
    mcq('bu-003', 2, 'receipts', 'Revenue receipts are receipts that', 'neither create a liability nor reduce the assets of the government', ['create a liability for repayment', 'come only from borrowing', 'arise only from the sale of assets'],
      'Taxes and non-tax revenue are revenue receipts. Borrowing (liability) and asset sales are capital receipts.'),
    mcq('bu-004', 2, 'receipts', 'Which of the following is a capital receipt of the government?', 'Recovery of loans given earlier', ['Income tax collections', 'Dividends from public sector enterprises', 'Fees and fines'],
      'Recovery of loans reduces an asset (the loans receivable), so it is a capital receipt. Taxes, dividends and fees are revenue receipts.'),
    mcq('bu-005', 1, 'receipts', 'Which of these is a non-tax revenue receipt?', 'Interest and dividends received by the government', ['GST', 'Income tax', 'Customs duties'],
      'Non-tax revenue includes interest, dividends and profits from public enterprises, fees and fines.'),
    mcq('bu-006', 2, 'deficits', 'Revenue expenditure is ₹800 crore and revenue receipts are ₹600 crore. The revenue deficit is', '₹200 crore', ['₹1,400 crore', '₹600 crore', '₹800 crore'],
      'Revenue deficit = revenue expenditure − revenue receipts = 800 − 600 = <b>₹200 crore</b>.'),
    mcq('bu-007', 3, 'deficits', 'Revenue expenditure ₹800 crore, capital expenditure ₹300 crore, revenue receipts ₹600 crore, non-debt capital receipts ₹50 crore. The fiscal deficit is', '₹450 crore', ['₹500 crore', '₹200 crore', '₹1,100 crore'],
      'Fiscal deficit = total expenditure − total receipts excluding borrowing = (800 + 300) − (600 + 50) = <b>₹450 crore</b>.',
      '500 forgets the non-debt capital receipts.'),
    mcq('bu-008', 2, 'deficits', 'The fiscal deficit is ₹450 crore and interest payments are ₹150 crore. The primary deficit is', '₹300 crore', ['₹600 crore', '₹450 crore', '₹150 crore'],
      'Primary deficit = fiscal deficit − interest payments = 450 − 150 = <b>₹300 crore</b>.'),
    mcq('bu-009', 2, 'deficits', 'The fiscal deficit of a government shows', 'its total borrowing requirement for the year', ['the surplus of revenue over spending', 'the amount of taxes it will collect', 'its total debt accumulated over years'],
      'It equals expenditure minus receipts other than borrowing, so it is what has to be borrowed. Accumulated borrowing is the public debt.'),
    mcq('bu-010', 2, 'expenditure', 'Which of the following is capital expenditure?', 'Building a bridge', ['Paying salaries of government employees', 'Paying interest on earlier borrowing', 'Giving a food subsidy'],
      'Capital expenditure creates assets or reduces liabilities. The other three are regular, non-asset-creating revenue expenditure.'),
    mcq('bu-011', 2, 'expenditure', 'Which of the following is revenue expenditure?', 'Interest payments on past borrowing', ['Building a highway', 'Buying land for a new airport', 'Setting up a power plant'],
      'Revenue expenditure neither creates an asset nor reduces a liability. Interest payments are such an expense.'),
    mcq('bu-012', 1, 'taxes', 'In a progressive tax system', 'the tax rate rises as income rises', ['everyone pays the same amount', 'the tax rate falls as income rises', 'only the rich are exempt'],
      'Higher incomes are taxed at higher rates, so the rich pay a larger share of their income.'),
    mcq('bu-013', 2, 'public goods', 'Which of these is closest to a pure public good?', 'Street lighting', ['A packet of biscuits', 'A private car', 'A cinema ticket'],
      'A public good is non-rival (one person\'s use does not reduce another\'s) and non-excludable (people cannot be kept out), like street lighting.'),
    mcq('bu-014', 2, 'public goods', 'Merit goods such as primary education and basic health care are provided or supported by the government because', 'they raise welfare and the market may supply too little of them', ['they cannot be priced at all', 'only the rich want them', 'they are free of cost to produce'],
      'Merit goods are valuable for society, but people may under-buy them, so government provides or subsidises them.'),
    mat('bu-015', 2, 'functions', ['A. Allocation function', 'B. Distribution function', 'C. Stabilisation function', 'D. Merit goods'], ['1. Providing public goods that markets would not', '2. Reducing inequality through taxes and transfers', '3. Keeping inflation and unemployment low over the cycle', '4. Education and health supported for social welfare'],
      'A-1, B-2, C-3, D-4', ['A-2, B-1, C-3, D-4', 'A-1, B-2, C-4, D-3', 'A-3, B-2, C-1, D-4'],
      'The three functions of the government budget are allocation, distribution and stabilisation; merit goods are part of allocation.'),
    asr('bu-016', 2, 'deficits', 'The fiscal deficit shows the total borrowing requirement of the government.', 'Fiscal deficit is total expenditure minus total receipts other than borrowing.', 0,
      'Both true and R explains A: whatever receipts do not cover has to be borrowed.'),
    asr('bu-017', 3, 'deficits', 'A revenue deficit means that the government is dissaving.', 'Revenue expenditure exceeds revenue receipts, so borrowing is used for current consumption.', 0,
      'Both true; the gap shows that the government spends more on current needs than it earns, and borrows to fill it.'),
    asr('bu-018', 2, 'receipts', 'Disinvestment is a capital receipt.', 'Fiscal deficit is usually expressed as a percentage of GDP.', 1,
      'Both are true. Disinvestment is the sale of government assets, so it is a capital receipt. R is unrelated to A.'),
    asr('bu-019', 2, 'taxes', 'The burden of a direct tax can easily be shifted to someone else.', 'Direct taxes are levied on the income and wealth of persons and firms.', 3,
      'A is false: the person on whom a direct tax is levied bears it. R is true. Indirect taxes can be shifted.'),
    asr('bu-020', 2, 'expenditure', 'Subsidies are a form of revenue expenditure.', 'Subsidies create assets for the government.', 2,
      'A is true. R is false: subsidies are spent and create no asset, which is why they are revenue expenditure.'),
    mcq('bu-021', 2, 'deficits', 'If a government finances its deficit by borrowing from the central bank (creating new money), the most likely result is', 'inflation', ['deflation', 'a fall in the money supply', 'lower prices of imports'],
      'New money adds to high-powered money and to demand, so it tends to push prices up.'),
    mcq('bu-022', 1, 'deficits', 'The total of the government\'s accumulated borrowing over the years is called', 'public debt', ['fiscal deficit', 'revenue deficit', 'primary surplus'],
      'A deficit is a yearly flow; debt is the accumulated stock of past borrowing.'),
    mcq('bu-023', 1, 'taxes', 'Corporation tax is', 'a direct tax', ['an indirect tax', 'a non-tax revenue', 'a capital receipt'],
      'It is levied on the profits of companies and cannot be passed on, so it is direct.'),
    mcq('bu-024', 2, 'functions', 'During a recession, the government\'s stabilisation function suggests that it should', 'raise spending or cut taxes', ['cut spending and raise taxes', 'raise the CRR', 'ban imports'],
      'More government spending or lower taxes raises aggregate demand and output.'),
    mcq('bu-025', 2, 'functions', 'Which pair serves the redistribution objective of the budget?', 'Progressive income tax and welfare spending', ['Uniform sales tax and defence spending', 'Customs duty and interest payments', 'Dividends and disinvestment'],
      'Taking more from the better-off and spending on the poor narrows inequality.'),
    mcq('bu-026', 2, 'deficits', 'Fiscal deficit is ₹4,500 crore and GDP is ₹1,50,000 crore. The fiscal deficit is what percent of GDP?', '3%', ['30%', '0.3%', '33%'],
      '4,500 ÷ 1,50,000 × 100 = <b>3%</b>.'),
    mcq('bu-027', 2, 'deficits', 'Revenue receipts are ₹500 crore and revenue expenditure is ₹700 crore. Which is true?', 'There is a revenue deficit of ₹200 crore', ['There is a revenue surplus of ₹200 crore', 'There is a fiscal surplus', 'The primary deficit is ₹200 crore'],
      'Revenue expenditure exceeds revenue receipts by 700 − 500 = 200, so a revenue deficit of ₹200 crore.'),
    mcq('bu-028', 3, 'deficits', 'Fiscal deficit is ₹100 crore and interest payments are ₹120 crore. This means', 'a primary surplus of ₹20 crore', ['a primary deficit of ₹20 crore', 'a primary deficit of ₹220 crore', 'a revenue surplus'],
      'Primary deficit = 100 − 120 = −20, i.e. a <b>primary surplus of ₹20 crore</b>: without interest the government would not have needed to borrow.'),
    mcq('bu-029', 3, 'multiplier', 'Government spending and taxes (lump-sum) both rise by ₹100 crore. By the balanced budget multiplier, income rises by', '₹100 crore', ['₹500 crore', '₹0', '₹400 crore'],
      'The balanced budget multiplier equals 1: the spending effect (+100 × multiplier) and the tax effect (−100 × MPC/(1 − MPC)) differ by exactly ΔG, so ΔY = <b>₹100 crore</b>.'),
    mcq('bu-030', 3, 'multiplier', 'MPC = 0.8. Lump-sum taxes rise by ₹50 crore. Equilibrium income', 'falls by ₹200 crore', ['falls by ₹250 crore', 'falls by ₹40 crore', 'rises by ₹200 crore'],
      'Tax multiplier = −MPC ÷ (1 − MPC) = −0.8 ÷ 0.2 = −4. ΔY = −4 × 50 = <b>−₹200 crore</b>.',
      'The tax multiplier is smaller in size than the spending multiplier (5), because part of the tax cuts saving.'),
    mat('bu-031', 2, 'receipts', ['A. Income tax', 'B. Recovery of loans', 'C. Dividend from a public enterprise', 'D. Customs duty'], ['1. Capital receipt', '2. Non-tax revenue', '3. Indirect tax', '4. Direct tax'],
      'A-4, B-1, C-2, D-3', ['A-3, B-1, C-2, D-4', 'A-4, B-2, C-1, D-3', 'A-4, B-1, C-3, D-2'],
      'Income tax is direct; recovery of loans is capital; dividends are non-tax revenue; customs duty is an indirect tax.'),
    mcq('bu-032', 2, 'deficits', 'Which step would help to reduce the fiscal deficit?', 'Raising tax revenue or cutting wasteful spending', ['Increasing subsidies sharply', 'Giving more tax holidays', 'Raising interest-bearing borrowing'],
      'The deficit narrows when receipts (other than borrowing) rise or expenditure falls.'),
    mcq('bu-033', 1, 'taxes', 'Goods and Services Tax (GST) was introduced in India in', '2017', ['2005', '2010', '2020'],
      'GST began on 1 July 2017, replacing many central and state indirect taxes.'),
    mcq('bu-034', 2, 'deficits', 'The Fiscal Responsibility and Budget Management (FRBM) Act, 2003 aims at', 'fiscal discipline by setting limits on deficits', ['abolishing all taxes', 'fixing the repo rate', 'removing the Budget'],
      'The Act asks the government to reduce deficits and be transparent about its finances.'),
    mcq('bu-035', 2, 'expenditure', 'Which of these would NOT be called capital expenditure?', 'Salaries of government teachers', ['Building a school', 'Buying a machine for a hospital', 'Repaying a loan principal'],
      'Salaries are regular expenses (revenue expenditure). Building and equipment create assets; repaying principal reduces a liability.'),
  ],
  gens: [
    { id: 'bu-g01', type: 'mcq', level: 1, sub: 'deficits', ...T,
      make(rng) {
        const re = pick(rng, 500, 1000, 50), rr = pick(rng, 300, 800, 50), rd = re - rr;
        const { options, answer } = shuffleOpts(rng, rd, [re + rr, rr - re, re], C);
        return { q: `Revenue expenditure is ₹${re} crore and revenue receipts are ₹${rr} crore. The revenue deficit (negative if it is a surplus) is`, options, answer, re, rr, rd,
          sol: steps('Revenue deficit = revenue expenditure − revenue receipts.', `= ${re} − ${rr} = <b>${C(rd)}</b>.`), trap: 'A negative result would be a revenue surplus.' };
      },
      verify: (p) => (C(p.re - p.rr) === p.options[p.answer] ? p.answer : -1) },
    { id: 'bu-g02', type: 'mcq', level: 3, sub: 'deficits', ...T,
      make(rng) {
        const re = pick(rng, 600, 1000, 50), ce = pick(rng, 200, 400, 25), rr = pick(rng, 400, 700, 50), nd = pick(rng, 20, 100, 10), fd = re + ce - rr - nd;
        const { options, answer } = shuffleOpts(rng, fd, [fd + nd, re - rr, re + ce - rr + nd], C);
        return { q: `Revenue expenditure ₹${re} crore, capital expenditure ₹${ce} crore, revenue receipts ₹${rr} crore and non-debt capital receipts ₹${nd} crore. The fiscal deficit is`, options, answer, re, ce, rr, nd, fd,
          sol: steps('Fiscal deficit = total expenditure − total receipts other than borrowing.', `Total expenditure = ${re} + ${ce} = ${re + ce}; receipts without borrowing = ${rr} + ${nd} = ${rr + nd}.`, `Fiscal deficit = ${re + ce} − ${rr + nd} = <b>${C(fd)}</b>.`), trap: 'Do not forget non-debt capital receipts (such as recovery of loans, disinvestment).' };
      },
      verify: (p) => (C(p.re + p.ce - (p.rr + p.nd)) === p.options[p.answer] ? p.answer : -1) },
    { id: 'bu-g03', type: 'mcq', level: 2, sub: 'deficits', ...T,
      make(rng) {
        const fd = pick(rng, 300, 900, 50), ip = pick(rng, 50, 250, 25), pd = fd - ip;
        const { options, answer } = shuffleOpts(rng, pd, [fd + ip, fd, ip], C);
        return { q: `The fiscal deficit is ₹${fd} crore and interest payments are ₹${ip} crore. The primary deficit is`, options, answer, fd, ip, pd,
          sol: steps('Primary deficit = fiscal deficit − interest payments.', `= ${fd} − ${ip} = <b>${C(pd)}</b>.`), trap: 'Primary deficit leaves interest out, so it is smaller than the fiscal deficit.' };
      },
      verify: (p) => (C(p.fd - p.ip) === p.options[p.answer] ? p.answer : -1) },
    { id: 'bu-g04', type: 'mcq', level: 3, sub: 'multiplier', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.6, 0.75, 0.8, 0.9]), dg = pick(rng, 20, 200, 10), dy = dg / (1 - b);
        const { options, answer } = shuffleOpts(rng, dy, [dg * b, dg, (dg * b) / (1 - b)], (v) => `₹${fmt(v, 1)} crore`);
        return { q: `Government spending rises by ₹${dg} crore, taxes are unchanged and MPC = ${b}. The rise in equilibrium income is`, options, answer, b, dg, dy,
          sol: steps(`Government expenditure multiplier = 1 ÷ (1 − ${b}) = ${n(1 / (1 - b))}.`, `ΔY = ${dg} × ${n(1 / (1 - b))} = <b>₹${fmt(dy, 1)} crore</b>.`), trap: `${fmt((dg * b) / (1 - b), 1)} is the size of the tax multiplier effect, a different formula.` };
      },
      verify: (p) => (`₹${fmt(p.dg * (1 / (1 - p.b)), 1)} crore` === p.options[p.answer] ? p.answer : -1) },
    { id: 'bu-g05', type: 'mcq', level: 3, sub: 'multiplier', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.6, 0.75, 0.8, 0.9]), dt = pick(rng, 20, 100, 10), dy = (-b * dt) / (1 - b);
        const { options, answer } = shuffleOpts(rng, dy, [-dt / (1 - b), dt * b, (b * dt) / (1 - b)], (v) => `${v < 0 ? 'falls' : 'rises'} by ₹${fmt(Math.abs(v), 1)} crore`);
        return { q: `MPC = ${b}. Lump-sum taxes rise by ₹${dt} crore. Equilibrium income`, options, answer, b, dt, dy,
          sol: steps(`Tax multiplier = −MPC ÷ (1 − MPC) = −${b} ÷ ${n(1 - b)} = ${n(-b / (1 - b))}.`, `ΔY = ${n(-b / (1 - b))} × ${dt} = <b>falls by ₹${fmt(Math.abs(dy), 1)} crore</b>.`), trap: 'A tax rise reduces income only through the part of it that would have been spent (the MPC).' };
      },
      verify: (p) => (((v) => `${v < 0 ? 'falls' : 'rises'} by ₹${fmt(Math.abs(v), 1)} crore`)((-p.b / (1 - p.b)) * p.dt) === p.options[p.answer] ? p.answer : -1) },
    { id: 'bu-g06', type: 'mcq', level: 2, sub: 'deficits', ...T,
      make(rng) {
        const pc = choose(rng, [2, 3, 4, 5, 6]), gdp = pick(rng, 50000, 200000, 25000), fd = (gdp * pc) / 100;
        const { options, answer } = shuffleOpts(rng, pc, [pc * 10, pc / 10, pc + 1], (v) => `${fmt(v, 1)}%`);
        return { q: `The fiscal deficit is ₹${fmt(fd, 0)} crore and GDP is ₹${fmt(gdp, 0)} crore. The fiscal deficit as a percentage of GDP is`, options, answer, fd, gdp, pc,
          sol: steps('Fiscal deficit as % of GDP = fiscal deficit ÷ GDP × 100.', `= ${fmt(fd, 0)} ÷ ${fmt(gdp, 0)} × 100 = <b>${pc}%</b>.`), trap: 'Check the decimal place: 4,500 out of 1,50,000 is 3%, not 30%.' };
      },
      verify: (p) => (`${fmt((p.fd / p.gdp) * 100, 1)}%` === p.options[p.answer] ? p.answer : -1) },
  ],
};
