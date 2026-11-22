// CUET Economics: determination of income and employment. Original questions for fibub.
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

export default {
  topic: 'income-determination',
  items: [
    mcq('id-001', 1, 'aggregate demand', 'In a simple economy with no government and no foreign trade, aggregate demand equals', 'C + I', ['C + S', 'S + I', 'C − I'],
      'Households and firms are the only spenders: AD = consumption + investment.'),
    mcq('id-002', 1, 'consumption', 'The marginal propensity to consume (MPC) is', 'the change in consumption per unit change in income', ['consumption divided by income', 'the share of income that is saved', 'the level of consumption at zero income'],
      'MPC = ΔC ÷ ΔY. Consumption ÷ income is the <i>average</i> propensity (APC).',
      'Learners mix up marginal (change) and average (level).'),
    mcq('id-003', 1, 'multiplier', 'If MPC = 0.8, the investment multiplier is', '5', ['4', '0.8', '1.25'],
      'Multiplier = 1 ÷ (1 − MPC) = 1 ÷ 0.2 = <b>5</b>.'),
    mcq('id-004', 1, 'multiplier', 'If MPS = 0.25, the multiplier is', '4', ['0.25', '2.5', '1.33'],
      'Multiplier = 1 ÷ MPS = 1 ÷ 0.25 = <b>4</b>.'),
    mcq('id-005', 2, 'multiplier', 'Investment rises by ₹100 crore and MPC = 0.75. The rise in equilibrium income is', '₹400 crore', ['₹75 crore', '₹133 crore', '₹300 crore'],
      'Multiplier = 1 ÷ 0.25 = 4. ΔY = 100 × 4 = <b>₹400 crore</b>.'),
    mcq('id-006', 2, 'equilibrium', 'C = 100 + 0.5Y and investment I = 50 (in ₹ crore). Equilibrium income is', '₹300 crore', ['₹150 crore', '₹200 crore', '₹450 crore'],
      'At equilibrium Y = C + I = 100 + 0.5Y + 50. So 0.5Y = 150 and Y = <b>300</b>.',
      '150 is the autonomous spending, not income; it still has to be multiplied by 2.'),
    mcq('id-007', 2, 'equilibrium', 'C = 200 + 0.8Y and I = 100. Equilibrium income is', '1,500', ['300', '1,000', '1,200'],
      'Y = 200 + 0.8Y + 100, so 0.2Y = 300 and Y = <b>1,500</b>.'),
    mcq('id-008', 1, 'consumption', 'The consumption function is C = 100 + 0.6Y. When Y = 1,000, consumption is', '700', ['600', '160', '1,000'],
      'C = 100 + 0.6 × 1,000 = 100 + 600 = <b>700</b>.'),
    mcq('id-009', 2, 'saving', 'With C = 100 + 0.6Y, saving when Y = 500 is', '100', ['400', '300', '200'],
      'C = 100 + 300 = 400. S = Y − C = 500 − 400 = <b>100</b>.'),
    mcq('id-010', 2, 'consumption', 'With C = 100 + 0.6Y, the break-even level of income (where C = Y) is', '250', ['100', '400', '167'],
      '100 + 0.6Y = Y, so 0.4Y = 100 and Y = <b>250</b>. At this income saving is zero.'),
    mcq('id-011', 1, 'consumption', 'At an income of 500, consumption is 400. The average propensity to consume is', '0.8', ['0.4', '1.25', '0.2'],
      'APC = C ÷ Y = 400 ÷ 500 = <b>0.8</b>. APS = 0.2.'),
    mcq('id-012', 2, 'equilibrium', 'Ex-ante (planned) investment differs from ex-post (actual) investment because of', 'unplanned changes in inventories', ['indirect taxes', 'depreciation of the machines', 'government subsidies'],
      'Ex-post investment includes unplanned stock changes when firms\' sales differ from expectations.'),
    mcq('id-013', 2, 'equilibrium', 'In the simple two-sector model, equilibrium income is reached when', 'planned saving equals planned investment', ['consumption is zero', 'saving exceeds investment', 'investment exceeds output'],
      'AD = AS means C + I = C + S, i.e. planned I = planned S.'),
    mcq('id-014', 2, 'equilibrium', 'If aggregate demand is greater than aggregate supply, then', 'stocks fall unexpectedly and firms raise output', ['unsold stocks pile up', 'firms cut output', 'income stays the same'],
      'Buyers want more than firms planned to produce, so inventories fall below plan and output expands until AD = AS.'),
    mcq('id-015', 2, 'equilibrium', 'If planned saving exceeds planned investment, income', 'falls', ['rises', 'stays the same', 'becomes full-employment income at once'],
      'Planned S > planned I means AD < AS. Unsold goods accumulate and firms cut output, so income falls.'),
    mcq('id-016', 1, 'employment', 'Involuntary unemployment means that', 'people willing to work at the going wage cannot find jobs', ['people choose not to work', 'workers are changing jobs', 'workers are on holiday'],
      'Keynes stressed that unemployment can exist even though people are willing to work at the existing wage.'),
    mcq('id-017', 1, 'employment', 'Full employment is the situation in which', 'there is no involuntary unemployment', ['nobody is unemployed at all', 'everyone works 24 hours', 'the government employs all workers'],
      'Frictional and voluntary unemployment may exist even at full employment.',
      'Full employment does not mean zero unemployment.'),
    mcq('id-018', 2, 'gaps', 'A deflationary gap is the amount by which', 'aggregate demand falls short of the level needed for full employment', ['aggregate demand exceeds full-employment output', 'saving exceeds consumption', 'imports exceed exports'],
      'With a deflationary gap the economy settles below full employment and there is involuntary unemployment.'),
    mcq('id-019', 2, 'gaps', 'An inflationary gap is the amount by which', 'aggregate demand exceeds the level needed for full-employment output', ['aggregate demand falls short of full employment', 'exports exceed imports', 'investment equals saving'],
      'When AD is above what full-employment output can supply, there is pressure on prices.'),
    mcq('id-020', 2, 'gaps', 'Which step helps to remove a deflationary gap?', 'Raising government spending or cutting taxes', ['Raising the CRR', 'Selling securities in the open market', 'Raising the repo rate'],
      'The gap needs more demand. Higher government spending and lower taxes raise AD; the other steps (higher CRR, open market sales, higher repo) reduce it.'),
    asr('id-021', 2, 'multiplier', 'The larger the MPC, the larger the multiplier.', 'With a higher MPC, a bigger part of every extra rupee of income is spent again.', 0,
      'Multiplier = 1/(1 − MPC). A bigger MPC means more rounds of spending, and R explains this.'),
    asr('id-022', 3, 'equilibrium', 'Equilibrium output can be below the full-employment output.', 'Aggregate demand may be insufficient to buy all that the economy could produce.', 0,
      'Both true. Keynes argued that at equilibrium AD can be less than full-employment output, leaving involuntary unemployment.'),
    asr('id-023', 2, 'consumption', 'The marginal propensity to consume can be greater than 1.', 'MPC + MPS = 1 and MPS is positive.', 3,
      'A is false: because MPS is positive, MPC is less than 1. R is true.'),
    asr('id-024', 2, 'multiplier', 'A rise in investment raises income by a multiple of the rise.', 'Wages in India are mostly paid in cash.', 1,
      'A is true (multiplier). R may be true but is unrelated: it does not explain A.'),
    asr('id-025', 2, 'equilibrium', 'In the simple model, planned investment is treated as autonomous.', 'In that model investment depends strongly on the level of income.', 2,
      'A is true: investment is taken as given. R is false: autonomous means it does not depend on income.'),
    mat('id-026', 2, 'consumption', ['A. MPC', 'B. APS', 'C. Multiplier', 'D. Autonomous consumption'], ['1. S ÷ Y', '2. Consumption at zero income', '3. ΔC ÷ ΔY', '4. 1 ÷ (1 − MPC)'],
      'A-3, B-1, C-4, D-2', ['A-3, B-4, C-1, D-2', 'A-1, B-3, C-4, D-2', 'A-3, B-1, C-2, D-4'],
      'MPC = ΔC/ΔY, APS = S/Y, multiplier = 1/(1 − MPC), and the constant term of the consumption function is autonomous consumption.'),
    mcq('id-027', 1, 'multiplier', 'If MPC = 0.9, the multiplier is', '10', ['9', '0.9', '1.1'],
      '1 ÷ (1 − 0.9) = 1 ÷ 0.1 = <b>10</b>.'),
    mcq('id-028', 2, 'multiplier', 'The government wants income to rise by ₹600 crore through higher investment. If MPC = 0.5, the required rise in investment is', '₹300 crore', ['₹1,200 crore', '₹600 crore', '₹120 crore'],
      'Multiplier = 2, so ΔI = ΔY ÷ 2 = <b>₹300 crore</b>.'),
    mcq('id-029', 2, 'consumption', 'When income rises from 1,000 to 1,200, consumption rises from 800 to 920. MPC is', '0.6', ['0.4', '0.77', '0.8'],
      'ΔC = 120 and ΔY = 200, so MPC = 120 ÷ 200 = <b>0.6</b>.',
      '920 ÷ 1,200 = 0.77 is the average propensity, not the marginal.'),
    mcq('id-030', 1, 'consumption', 'Income is 1,000 and consumption is 900. The average propensity to save is', '0.1', ['0.9', '0.01', '1.1'],
      'S = 100, so APS = 100 ÷ 1,000 = <b>0.1</b>. (APC + APS = 1.)'),
    mcq('id-031', 3, 'multiplier', 'Investment falls by ₹50 crore and MPC = 0.8. Equilibrium income', 'falls by ₹250 crore', ['falls by ₹50 crore', 'falls by ₹40 crore', 'rises by ₹250 crore'],
      'The multiplier works both ways: ΔY = −50 × 5 = <b>−₹250 crore</b>.'),
    mcq('id-032', 2, 'aggregate demand', 'In the Keynesian short-run model (prices fixed), output is mainly determined by', 'aggregate demand', ['the money wage', 'the size of the labour force', 'the exchange rate only'],
      'This is the principle of effective demand: firms produce what they expect to sell.'),
    mcq('id-033', 3, 'multiplier', 'Government spending rises by ₹50 crore and MPC = 0.8. Ignoring taxes, income rises by', '₹250 crore', ['₹50 crore', '₹200 crore', '₹40 crore'],
      'Government expenditure multiplier = 1 ÷ (1 − 0.8) = 5. ΔY = 50 × 5 = <b>₹250 crore</b>.'),
    mcq('id-034', 2, 'equilibrium', 'If AD is less than AS at some output level, then', 'unsold stocks pile up beyond plan and firms cut output', ['firms increase output', 'inventories run out', 'the economy is at equilibrium'],
      'Production exceeds what buyers want, so unplanned inventories build up.'),
    mcq('id-035', 3, 'saving', 'For C = 100 + 0.6Y, the saving function is', 'S = −100 + 0.4Y', ['S = 100 + 0.4Y', 'S = −100 + 0.6Y', 'S = 0.4Y'],
      'S = Y − C = Y − 100 − 0.6Y = <b>−100 + 0.4Y</b>. At zero income there is dissaving of 100.'),
    mcq('id-036', 1, 'consumption', 'For any level of income, APC + APS equals', '1', ['0', 'MPC', '100'],
      'Income is either consumed or saved: C/Y + S/Y = 1.'),
  ],
  gens: [
    { id: 'id-g01', type: 'mcq', level: 1, sub: 'multiplier', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.6, 0.75, 0.8, 0.9]), m = 1 / (1 - b);
        const { options, answer } = shuffleOpts(rng, m, [b, 1 / b, m + 1], n);
        return { q: `If MPC = ${b}, the investment multiplier is`, options, answer, b, m,
          sol: steps('Multiplier = 1 ÷ (1 − MPC).', `= 1 ÷ ${n(1 - b)} = <b>${n(m)}</b>.`), trap: 'It is 1 ÷ MPS, not 1 ÷ MPC.' };
      },
      verify: (p) => (n(1 / (1 - p.b)) === p.options[p.answer] ? p.answer : -1) },
    { id: 'id-g02', type: 'mcq', level: 2, sub: 'multiplier', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.6, 0.75, 0.8, 0.9]), di = pick(rng, 20, 200, 10), dy = di / (1 - b);
        const { options, answer } = shuffleOpts(rng, dy, [di * b, di / b, di * (1 + b)], (v) => `₹${fmt(v, 1)} crore`);
        return { q: `Investment rises by ₹${di} crore and MPC = ${b}. The rise in equilibrium income is`, options, answer, b, di, dy,
          sol: steps(`Multiplier = 1 ÷ (1 − ${b}) = ${n(1 / (1 - b))}.`, `ΔY = ${di} × ${n(1 / (1 - b))} = <b>₹${fmt(dy, 1)} crore</b>.`), trap: 'Income changes by the multiplier times the investment change, not by the investment change alone.' };
      },
      verify: (p) => (`₹${fmt(p.di * (1 / (1 - p.b)), 1)} crore` === p.options[p.answer] ? p.answer : -1) },
    { id: 'id-g03', type: 'mcq', level: 3, sub: 'equilibrium', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.75, 0.8]), a = pick(rng, 40, 200, 20), i = pick(rng, 20, 100, 20), y = (a + i) / (1 - b);
        const { options, answer } = shuffleOpts(rng, y, [a + i, (a + i) / b, a / (1 - b)], (v) => fmt(v, 0));
        return { q: `The consumption function is C = ${a} + ${b}Y and investment is ${i}. Equilibrium income is`, options, answer, a, b, i, y,
          sol: steps(`Y = C + I = ${a} + ${b}Y + ${i}.`, `(1 − ${b})Y = ${a + i}, so Y = ${a + i} ÷ ${n(1 - b)} = <b>${fmt(y, 0)}</b>.`), trap: 'Do not stop at autonomous spending a + I; it must be multiplied by 1/(1 − b).' };
      },
      verify: (p) => (fmt((p.a + p.i) * (1 / (1 - p.b)), 0) === p.options[p.answer] ? p.answer : -1) },
    { id: 'id-g04', type: 'mcq', level: 2, sub: 'consumption', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.6, 0.75, 0.8]), dy = pick(rng, 100, 500, 100), dc = b * dy, mps = 1 - b;
        const { options, answer } = shuffleOpts(rng, mps, [b, 1 / mps, dc / 100], n);
        return { q: `When income rises by ${dy}, consumption rises by ${n(dc)}. The marginal propensity to save is`, options, answer, dy, dc, mps,
          sol: steps(`MPC = ΔC ÷ ΔY = ${n(dc)} ÷ ${dy} = ${n(b)}.`, `MPS = 1 − MPC = <b>${n(mps)}</b>.`), trap: 'The change in saving is ΔY − ΔC, so MPS = 1 − MPC.' };
      },
      verify: (p) => (n(1 - p.dc / p.dy) === p.options[p.answer] ? p.answer : -1) },
    { id: 'id-g05', type: 'mcq', level: 3, sub: 'consumption', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.6, 0.75, 0.8]), a = pick(rng, 40, 200, 20), y = a / (1 - b);
        const { options, answer } = shuffleOpts(rng, y, [a, a / b, a * (1 - b)], (v) => fmt(v, 0));
        return { q: `The consumption function is C = ${a} + ${b}Y. The break-even level of income (where consumption equals income) is`, options, answer, a, b, y,
          sol: steps(`Set C = Y: ${a} + ${b}Y = Y.`, `${a} = ${n(1 - b)}Y, so Y = <b>${fmt(y, 0)}</b>.`), trap: 'At break-even, saving is zero.' };
      },
      verify: (p) => (fmt(p.a / (1 - p.b), 0) === p.options[p.answer] ? p.answer : -1) },
    { id: 'id-g06', type: 'mcq', level: 2, sub: 'multiplier', ...T,
      make(rng) {
        const b = choose(rng, [0.5, 0.75, 0.8, 0.9]), dy = pick(rng, 200, 1000, 100), di = dy * (1 - b);
        const { options, answer } = shuffleOpts(rng, di, [dy * b, dy / (1 - b), dy], (v) => `₹${fmt(v, 0)} crore`);
        return { q: `The government wants equilibrium income to rise by ₹${dy} crore through higher investment. If MPC = ${b}, the rise in investment needed is`, options, answer, b, dy, di,
          sol: steps(`Multiplier = 1 ÷ (1 − ${b}) = ${n(1 / (1 - b))}.`, `ΔI = ΔY ÷ multiplier = ${dy} × ${n(1 - b)} = <b>₹${fmt(di, 0)} crore</b>.`), trap: 'A large multiplier means a small investment is enough.' };
      },
      verify: (p) => (`₹${fmt(p.dy / (1 / (1 - p.b)), 0)} crore` === p.options[p.answer] ? p.answer : -1) },
  ],
};
