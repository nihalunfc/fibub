// CUET Economics: national income and related aggregates. Original questions for fibub.
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
const cr = (v) => `₹${fmt(v, 0)} crore`;

export default {
  topic: 'national-income',
  items: [
    mcq('ni-001', 1, 'stock and flow', 'Which of these is a flow variable?', 'Investment made during a year', ['Capital stock of an economy on 31 March', 'Wealth of households on 1 April', 'Money supply on 31 March'],
      'A flow is measured <b>over a period</b> (per year, per month). Investment during a year is a flow; capital stock, wealth and money supply on a given date are stocks.'),
    mcq('ni-002', 1, 'stock and flow', 'Which of these is a stock variable?', 'Number of machines in a factory on 1 April', ['Wages paid in a month', 'Exports during a year', 'Savings made during a quarter'],
      'A stock is measured <b>at a point of time</b>. Machines on 1 April is a stock; wages, exports and savings over a period are flows.'),
    mcq('ni-003', 1, 'final goods', 'Which of the following is a final good?', 'Bread bought by a household for its breakfast', ['Wheat bought by a flour mill', 'Cotton bought by a textile mill', 'Steel bought by a car maker to build cars'],
      'A final good is bought for consumption or investment and is not processed further this year. The other three are <b>intermediate goods</b> used up in making other goods.',
      'The same item can be intermediate or final depending on who buys it and why.'),
    mcq('ni-004', 2, 'value added', 'A farmer sells wheat worth ₹50 to a mill (using no purchased inputs). The mill sells flour worth ₹80 to a bakery, which sells bread worth ₹130 to households. The total value added in this chain is', '₹130', ['₹260', '₹80', '₹50'],
      'Value added = value of output − intermediate consumption. Farmer 50 − 0 = 50, mill 80 − 50 = 30, bakery 130 − 80 = 50. Total = 50 + 30 + 50 = <b>₹130</b>, the value of the final bread.',
      'Adding 50 + 80 + 130 = 260 counts the wheat and flour more than once (double counting).'),
    mcq('ni-005', 2, 'value added', 'In the chain of wheat (₹50), flour (₹80) and bread (₹130), the value added by the bakery is', '₹50', ['₹130', '₹80', '₹30'],
      'Bakery output ₹130 minus flour bought (intermediate) ₹80 = <b>₹50</b>.'),
    mcq('ni-006', 1, 'aggregates', 'GDP at market price is ₹1,000 crore and depreciation is ₹100 crore. NDP at market price is', '₹900 crore', ['₹1,100 crore', '₹1,000 crore', '₹100 crore'],
      'NDP = GDP − depreciation = 1,000 − 100 = <b>₹900 crore</b>.'),
    mcq('ni-007', 2, 'aggregates', 'GDP at market price = ₹5,000 crore, depreciation = ₹400 crore, net indirect taxes = ₹300 crore, net factor income from abroad = ₹100 crore. NNP at factor cost is', '₹4,400 crore', ['₹4,300 crore', '₹4,200 crore', '₹5,000 crore'],
      'NNP<sub>FC</sub> = GDP<sub>MP</sub> − depreciation − net indirect taxes + NFIA = 5,000 − 400 − 300 + 100 = <b>₹4,400 crore</b>.',
      'Forgetting NFIA gives 4,300; subtracting it gives 4,200.'),
    mcq('ni-008', 2, 'aggregates', 'GDP at market price is ₹1,150 crore. Indirect taxes are ₹200 crore and subsidies ₹50 crore. GDP at factor cost is', '₹1,000 crore', ['₹900 crore', '₹1,100 crore', '₹1,350 crore'],
      'Net indirect taxes = 200 − 50 = 150. GDP<sub>FC</sub> = GDP<sub>MP</sub> − NIT = 1,150 − 150 = <b>₹1,000 crore</b>.',
      'Subtracting the whole 200 and then the 50 again (giving 900) treats subsidies the wrong way.'),
    mcq('ni-009', 2, 'expenditure method', 'In an economy, consumption = ₹600, investment = ₹200, government spending = ₹150, exports = ₹100 and imports = ₹120 (all in crore). GDP at market price by the expenditure method is', '₹930 crore', ['₹1,050 crore', '₹1,170 crore', '₹830 crore'],
      'GDP = C + I + G + (X − M) = 600 + 200 + 150 + (100 − 120) = <b>₹930 crore</b>.',
      'Imports are subtracted because they are spending on foreign output; leaving M out gives 1,050.'),
    mcq('ni-010', 2, 'what is counted', 'Which of the following is NOT counted in this year\'s GDP?', 'The price of a house built ten years ago when it is resold', ['Fees paid to a doctor', 'Imputed rent of an owner-occupied house', 'Salary paid to a teacher'],
      'GDP counts only <b>current production</b>. Resale of an old asset is just a transfer of ownership (only the broker\'s commission is a current service).',
      'Imputed rent of an owner-occupied house IS included; it surprises many learners.'),
    mcq('ni-011', 1, 'what is counted', 'Which of these is a transfer payment and is therefore not part of national income?', 'Old-age pension paid by the government', ['Salary of a government clerk', 'Rent paid for a shop', 'Interest paid by a firm on a bank loan'],
      'A transfer payment is made without any good or service in return. A pension for no current work is one. Salary, rent and interest pay for factor services.'),
    mcq('ni-012', 2, 'real and nominal', 'Nominal GDP is ₹2,400 crore and the GDP deflator is 120. Real GDP is', '₹2,000 crore', ['₹2,880 crore', '₹2,520 crore', '₹2,200 crore'],
      'Real GDP = nominal GDP ÷ deflator × 100 = 2,400 ÷ 120 × 100 = <b>₹2,000 crore</b>.',
      'Multiplying 2,400 by 1.2 moves the wrong way: a deflator above 100 means prices rose, so real GDP is smaller.'),
    mcq('ni-013', 2, 'real and nominal', 'Nominal GDP is ₹3,300 crore and real GDP is ₹3,000 crore. The GDP deflator is', '110', ['90.9', '100', '120'],
      'Deflator = nominal ÷ real × 100 = 3,300 ÷ 3,000 × 100 = <b>110</b>. Prices are 10% above the base year.'),
    asr('ni-014', 2, 'real and nominal', 'Nominal GDP can rise even when real GDP falls.', 'Nominal GDP is measured at current prices, so a large rise in prices can raise it.', 0,
      'Both true. Nominal GDP = price × quantity. If prices rise faster than quantity falls, nominal GDP rises. R explains A.'),
    asr('ni-015', 2, 'final goods', 'A machine bought by a firm is counted as a final good (investment).', 'A machine is used up completely within the year in which it is bought.', 2,
      'A is true: capital goods are final goods. R is false: machines last several years and only wear out gradually (depreciation).'),
    asr('ni-016', 2, 'domestic and national', 'GDP includes the factor income earned by residents of a country from abroad.', 'GDP is measured within the domestic territory of a country.', 3,
      'A is false: income earned abroad by residents is added only when moving from GDP to GNP (through NFIA). R is true.'),
    asr('ni-017', 2, 'domestic and national', 'Net factor income from abroad can be negative.', 'GDP is measured within the domestic territory of a country.', 1,
      'NFIA = income earned by residents abroad − income earned by non-residents at home, so it can be negative (A true). R is true but does not explain why NFIA is negative.'),
    asr('ni-018', 2, 'welfare', 'GDP is an exact measure of the welfare of the people.', 'GDP ignores how income is distributed and the external costs of production.', 3,
      'A is false: GDP is only a rough guide to welfare. R is true and is one reason why.'),
    asr('ni-019', 2, 'aggregates', 'Market price equals factor cost plus net indirect taxes.', 'Net indirect taxes are subsidies minus indirect taxes.', 2,
      'A is true. R is false: net indirect taxes = indirect taxes <b>minus</b> subsidies.'),
    mat('ni-020', 1, 'factor incomes', ['A. Wages', 'B. Rent', 'C. Interest', 'D. Profit'], ['1. Payment for the use of land', '2. Return to the entrepreneur', '3. Payment for labour', '4. Payment for the use of capital'],
      'A-3, B-1, C-4, D-2', ['A-1, B-3, C-4, D-2', 'A-3, B-4, C-1, D-2', 'A-2, B-1, C-4, D-3'],
      'Labour earns wages, land earns rent, capital earns interest, the entrepreneur earns profit.'),
    mat('ni-021', 2, 'methods', ['A. Product (value added) method', 'B. Income method', 'C. Expenditure method', 'D. Net factor income from abroad'], ['1. Adds up C + I + G + (X − M)', '2. Adds up factor incomes of the domestic territory', '3. Moves from domestic to national product', '4. Adds the value added by every producing unit'],
      'A-4, B-2, C-1, D-3', ['A-2, B-4, C-1, D-3', 'A-4, B-1, C-2, D-3', 'A-4, B-2, C-3, D-1'],
      'Product method sums value added; income method sums factor incomes; expenditure method sums spending; NFIA links GDP to GNP.'),
    mcq('ni-022', 2, 'domestic and national', 'Indian residents earned ₹80 crore abroad, while foreigners earned ₹50 crore in India. Net factor income from abroad is', '₹30 crore', ['−₹30 crore', '₹130 crore', '₹80 crore'],
      'NFIA = earned abroad by residents − earned at home by non-residents = 80 − 50 = <b>+₹30 crore</b>.'),
    mcq('ni-023', 2, 'domestic and national', 'GDP at market price is ₹2,000 crore and net factor income from abroad is −₹60 crore. GNP at market price is', '₹1,940 crore', ['₹2,060 crore', '₹2,000 crore', '₹1,880 crore'],
      'GNP = GDP + NFIA = 2,000 + (−60) = <b>₹1,940 crore</b>.'),
    mcq('ni-024', 1, 'aggregates', 'Personal disposable income is', 'personal income minus personal tax payments', ['national income minus depreciation', 'GDP minus net indirect taxes', 'private income plus savings of firms'],
      'Disposable income is what households can actually spend or save after paying direct taxes: PDI = personal income − personal tax payments.'),
    mcq('ni-025', 2, 'income method', 'Which items are added in the income method?', 'Compensation of employees, operating surplus and mixed income', ['Consumption, investment, government spending and net exports', 'Value of output minus intermediate consumption of every firm', 'Exports minus imports'],
      'The income method adds the factor incomes: compensation of employees, operating surplus (rent, interest, profit) and mixed income of the self-employed.'),
    mcq('ni-026', 2, 'income method', 'Compensation of employees = ₹700 crore, operating surplus = ₹250 crore, mixed income = ₹150 crore. NDP at factor cost is', '₹1,100 crore', ['₹950 crore', '₹850 crore', '₹1,000 crore'],
      'NDP<sub>FC</sub> = 700 + 250 + 150 = <b>₹1,100 crore</b>.'),
    mcq('ni-027', 1, 'investment', 'Gross investment is ₹500 crore and depreciation is ₹120 crore. Net investment is', '₹380 crore', ['₹620 crore', '₹500 crore', '₹120 crore'],
      'Net investment = gross investment − depreciation = 500 − 120 = <b>₹380 crore</b>.'),
    mcq('ni-028', 2, 'investment', 'A firm\'s unsold stock of goods rises by ₹40 lakh during the year. In national income accounts this change is counted as', 'investment (change in stock)', ['consumption', 'government spending', 'an intermediate good'],
      'Goods produced but unsold are treated as if the firm bought them itself: a change in inventories is part of <b>investment</b>.',
      'Leaving them out would understate production.'),
    mcq('ni-029', 2, 'welfare', 'A factory pollutes a river and fishermen lose income. In GDP accounting, this damage is', 'not subtracted from GDP', ['subtracted as depreciation', 'added as a transfer payment', 'subtracted as an indirect tax'],
      'This is an external cost (a negative externality). GDP does not deduct such costs, which is one reason it is an imperfect welfare measure.'),
    mcq('ni-030', 1, 'what is counted', 'Why is a homemaker\'s unpaid housework not included in GDP?', 'It is not exchanged in the market and has no price', ['It is an intermediate good', 'It is a transfer payment', 'It is production for the next year'],
      'GDP counts goods and services that are <b>sold in the market</b> (plus a few imputed items). Unpaid household work has no market price.'),
    mcq('ni-031', 2, 'real and nominal', 'Real GDP rises from ₹2,000 crore to ₹2,100 crore. The growth rate of real GDP is', '5%', ['10%', '4.76%', '0.5%'],
      'Growth = (2,100 − 2,000) ÷ 2,000 × 100 = <b>5%</b>.',
      'Dividing by the new value gives 4.76%.'),
    mcq('ni-032', 1, 'real and nominal', 'The GDP deflator rises from 100 to 110. This shows that the average level of prices has', 'risen by 10%', ['fallen by 10%', 'risen by 110%', 'not changed'],
      'The deflator is a price index with the base year at 100. A rise to 110 means prices are 10% higher.'),
    mcq('ni-033', 1, 'circular flow', 'In the circular flow of income, households supply factor services to firms and receive', 'factor payments (wages, rent, interest, profit)', ['intermediate goods', 'indirect taxes', 'depreciation allowances'],
      'Firms pay households for the use of land, labour, capital and enterprise: these are factor payments, which households spend on firms\' goods.'),
    mcq('ni-034', 1, 'aggregates', 'Per capita GDP is obtained by', 'dividing GDP by the population', ['multiplying GDP by the population', 'dividing GDP by the number of firms', 'subtracting depreciation from GDP'],
      'Per capita GDP = GDP ÷ population, the average output per person. It hides how the output is shared.'),
    mcq('ni-035', 1, 'aggregates', 'Net indirect taxes are', 'indirect taxes minus subsidies', ['indirect taxes plus subsidies', 'direct taxes minus subsidies', 'subsidies minus indirect taxes'],
      'NIT = indirect taxes − subsidies. It is the gap between market price and factor cost.'),
    mcq('ni-036', 1, 'aggregates', 'Another name for depreciation in national income accounts is', 'consumption of fixed capital', ['net investment', 'indirect tax', 'operating surplus'],
      'Depreciation is the wear and tear of fixed capital, also called consumption of fixed capital.'),
  ],
  gens: [
    { id: 'ni-g01', type: 'mcq', level: 2, sub: 'expenditure method', ...T,
      make(rng) {
        const C = pick(rng, 400, 900, 50), I = pick(rng, 100, 300, 20), G = pick(rng, 100, 250, 10), X = pick(rng, 50, 200, 10), M = pick(rng, 60, 220, 10);
        const gdp = C + I + G + X - M;
        const { options, answer } = shuffleOpts(rng, gdp, [C + I + G + X, C + I + G + X + M, C + I + G], cr);
        return { q: `In an economy (in ₹ crore): consumption ${C}, investment ${I}, government spending ${G}, exports ${X}, imports ${M}. GDP at market price by the expenditure method is`, options, answer, C, I, G, X, M,
          sol: steps('GDP = C + I + G + (X − M).', `Net exports = ${X} − ${M} = ${X - M}.`, `GDP = ${C} + ${I} + ${G} + (${X - M}) = <b>${cr(gdp)}</b>.`), trap: 'Imports must be subtracted; adding or ignoring them gives a wrong total.' };
      },
      verify: (p) => (cr(p.C + p.I + p.G + (p.X - p.M)) === p.options[p.answer] ? p.answer : -1) },
    { id: 'ni-g02', type: 'mcq', level: 2, sub: 'aggregates', ...T,
      make(rng) {
        const g = pick(rng, 3000, 9000, 500), d = pick(rng, 200, 600, 50), nit = pick(rng, 100, 500, 50), nf = pick(rng, -100, 150, 10);
        const a = g - d - nit + nf;
        const { options, answer } = shuffleOpts(rng, a, [g - d - nit, g - d - nit - nf, g - d + nit + nf], cr);
        return { q: `GDP at market price = ₹${fmt(g, 0)} crore, depreciation = ₹${d} crore, net indirect taxes = ₹${nit} crore, net factor income from abroad = ₹${nf} crore. NNP at factor cost is`, options, answer, g, d, nit, nf,
          sol: steps('NNP at FC = GDP at MP − depreciation − net indirect taxes + NFIA.', `= ${fmt(g, 0)} − ${d} − ${nit} + (${nf}) = <b>${cr(a)}</b>.`), trap: 'NFIA is added (or subtracted if negative); net indirect taxes are subtracted to reach factor cost.' };
      },
      verify: (p) => (cr(p.g - p.nit - p.d + p.nf) === p.options[p.answer] ? p.answer : -1) },
    { id: 'ni-g03', type: 'mcq', level: 2, sub: 'real and nominal', ...T,
      make(rng) {
        const dfl = choose(rng, [110, 120, 125, 150, 160, 200]), real = pick(rng, 500, 2000, 100), nom = (real * dfl) / 100;
        const { options, answer } = shuffleOpts(rng, real, [(nom * dfl) / 100, nom - (dfl - 100), nom + (dfl - 100) * 10], cr);
        return { q: `Nominal GDP is ₹${fmt(nom, 0)} crore and the GDP deflator is ${dfl}. Real GDP is`, options, answer, nom, dfl, real,
          sol: steps('Real GDP = nominal GDP ÷ deflator × 100.', `= ${fmt(nom, 0)} ÷ ${dfl} × 100 = <b>${cr(real)}</b>.`), trap: 'A deflator above 100 means prices have risen, so real GDP is smaller than nominal GDP.' };
      },
      verify: (p) => (cr((p.nom / p.dfl) * 100) === p.options[p.answer] ? p.answer : -1) },
    { id: 'ni-g04', type: 'mcq', level: 3, sub: 'income method', ...T,
      make(rng) {
        const ce = pick(rng, 400, 900, 50), os = pick(rng, 100, 400, 25), mi = pick(rng, 50, 250, 25), nf = pick(rng, -60, 80, 10);
        const ndp = ce + os + mi, a = ndp + nf;
        const { options, answer } = shuffleOpts(rng, a, [ndp, ndp - nf, ce + os + nf], cr);
        return { q: `Compensation of employees ₹${ce} crore, operating surplus ₹${os} crore, mixed income ₹${mi} crore, net factor income from abroad ₹${nf} crore. NNP at factor cost (national income) is`, options, answer, ce, os, mi, nf,
          sol: steps(`NDP at FC = ${ce} + ${os} + ${mi} = ${ndp}.`, `NNP at FC = NDP at FC + NFIA = ${ndp} + (${nf}) = <b>${cr(a)}</b>.`), trap: 'The income method gives a domestic figure first; NFIA turns it into a national figure.' };
      },
      verify: (p) => (cr(p.ce + p.os + p.mi + p.nf) === p.options[p.answer] ? p.answer : -1) },
    { id: 'ni-g05', type: 'mcq', level: 2, sub: 'value added', ...T,
      make(rng) {
        const a = pick(rng, 20, 80, 10), b = a + pick(rng, 20, 60, 10), c = b + pick(rng, 20, 80, 10);
        const { options, answer } = shuffleOpts(rng, b - a, [b, c - a, c - b], (v) => `₹${v}`);
        return { q: `A farmer sells cotton worth ₹${a} to a mill (no purchased inputs). The mill sells yarn worth ₹${b} to a weaver, who sells cloth worth ₹${c} to households. The value added by the mill is`, options, answer, a, b, c,
          sol: steps('Value added = value of output − intermediate consumption.', `Mill: ${b} − ${a} = <b>₹${b - a}</b>.`), trap: 'Value added by a firm uses only the inputs that firm bought, not the final price.' };
      },
      verify: (p) => (`₹${p.b - p.a}` === p.options[p.answer] ? p.answer : -1) },
    { id: 'ni-g06', type: 'mcq', level: 2, sub: 'domestic and national', ...T,
      make(rng) {
        const gdp = pick(rng, 2000, 6000, 250), e = pick(rng, 100, 300, 20), f = pick(rng, 40, 340, 20);
        const a = gdp + e - f;
        const { options, answer } = shuffleOpts(rng, a, [gdp - e + f, gdp + e + f, gdp], cr);
        return { q: `GDP at market price is ₹${fmt(gdp, 0)} crore. Residents earned ₹${e} crore abroad, and non-residents earned ₹${f} crore within the country. GNP at market price is`, options, answer, gdp, e, f,
          sol: steps(`NFIA = ${e} − ${f} = ${e - f}.`, `GNP = GDP + NFIA = ${fmt(gdp, 0)} + (${e - f}) = <b>${cr(a)}</b>.`), trap: 'Add what residents earn abroad and subtract what non-residents earn at home.' };
      },
      verify: (p) => (cr(p.gdp - p.f + p.e) === p.options[p.answer] ? p.answer : -1) },
  ],
};
