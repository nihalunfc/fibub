// Live problems for "Start a startup" (India, Canada, USA). Each make(rand) returns { q, answer, unit, tol, abs?, hint,
// solution } as small HTML; verify(p) recomputes the answer another way for tests/startup-kit.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Rates as of November 2026.
import { pick, n, steps, m, inTax } from './util.js';

export default {
  // ---------- Module 7: sales tax ----------
  'how-gst-works-net': {
    title: 'work out the GST a business pays',
    make(r) {
      const sales = pick(r, 200000, 900000, 10000), buys = pick(r, 40000, 150000, 5000), rate = 0.18;
      const out = sales * rate, cred = buys * rate, answer = out - cred;
      return {
        q: `<p>A registered Indian studio bills clients ${m('in', sales)} plus 18 % GST in a month. It bought software and equipment for ${m('in', buys)} plus 18 % GST. How much GST does it pay the government for the month?</p>`,
        answer, unit: '₹', tol: 0.001,
        hint: 'Tax you pay = output tax (on your sales) − input tax credit (tax you paid on business purchases).',
        solution: steps(`Output tax: 18 % × ${m('in', sales)} = ${m('in', out)}.`, `Input credit: 18 % × ${m('in', buys)} = ${m('in', cred)}.`, `Pay ${m('in', out)} − ${m('in', cred)} = <b>${m('in', answer)}</b>.`),
        sales, buys,
      };
    },
    verify: (p) => 0.18 * (p.sales - p.buys),
  },
  'india-gst-igst': {
    title: 'pay IGST using CGST and SGST credit',
    make(r) {
      const v = pick(r, 50000, 400000, 5000), lap = pick(r, 20000, 120000, 5000);
      const igst = v * 0.18, cred = lap * 0.18, answer = Math.max(0, igst - cred);
      return {
        q: `<p>A Kochi startup sells a ${m('in', v)} service to a registered client in Chennai. In the same month it bought a ${m('in', lap)} laptop from a Kochi shop with 9 % CGST + 9 % SGST. How much tax does it pay in cash with GSTR-3B?</p>`,
        answer, unit: '₹', tol: 0.001,
        hint: 'Client in another state: charge IGST 18 %. CGST and SGST credit can be set against IGST.',
        solution: steps(`Inter-state sale: IGST 18 % × ${m('in', v)} = ${m('in', igst)}.`, `Credit: CGST + SGST on the laptop = 18 % × ${m('in', lap)} = ${m('in', cred)}.`, `Cash to pay: <b>${m('in', answer)}</b>.`),
        v, lap,
      };
    },
    verify: (p) => Math.max(0, 0.18 * (p.v - p.lap)),
  },
  'canada-gst-hst-mix': {
    title: 'charge the right rate to clients in different provinces',
    make(r) {
      const on = pick(r, 2000, 12000, 500), ab = pick(r, 1000, 8000, 500), ns = pick(r, 1000, 6000, 500), itc = pick(r, 100, 900, 10);
      const answer = on * 0.13 + ab * 0.05 + ns * 0.14 - itc;
      return {
        q: `<p>A registered Toronto designer bills ${m('ca', on)} to an Ontario client, ${m('ca', ab)} to an Alberta client and ${m('ca', ns)} to a Nova Scotia client this quarter (all before tax). She paid ${m('ca', itc)} of HST on business costs. What net tax does she remit?</p>`,
        answer, unit: '$', tol: 0.001,
        hint: 'Services are taxed at the customer’s province rate: Ontario HST 13 %, Alberta GST 5 %, Nova Scotia HST 14 %. Then subtract input tax credits.',
        solution: steps(`Ontario: 13 % × ${m('ca', on)} = ${m('ca', on * 0.13, 2)}.`, `Alberta: 5 % × ${m('ca', ab)} = ${m('ca', ab * 0.05, 2)}.`, `Nova Scotia: 14 % × ${m('ca', ns)} = ${m('ca', ns * 0.14, 2)}.`, `Total collected minus ${m('ca', itc)} credits = <b>${m('ca', answer, 2)}</b>.`),
        on, ab, ns, itc,
      };
    },
    verify: (p) => 0.13 * p.on + 0.05 * p.ab + 0.14 * p.ns - p.itc,
  },
  'usa-sales-tax-nexus-count': {
    title: 'count the states where you must collect',
    make(r) {
      const ca = pick(r, 200, 700, 50) * 1000, ny = pick(r, 300, 700, 50) * 1000, nyo = pick(r, 50, 200, 10), ga = pick(r, 60, 140, 10) * 1000, wa = pick(r, 60, 140, 10) * 1000;
      const list = [['California', ca, ca > 500000], ['New York', ny, ny > 500000 && nyo > 100], ['Georgia', ga, ga >= 100000], ['Washington', wa, wa >= 100000]];
      const answer = 1 + list.filter((x) => x[2]).length;
      return {
        q: `<p>A seller based in Colorado, with no staff or stock anywhere else, sold this much last year: California ${m('us', ca)}; New York ${m('us', ny)} in ${nyo} orders; Georgia ${m('us', ga)}; Washington ${m('us', wa)}. In how many states (home included) must it collect sales tax? Use thresholds: California over $500,000; New York over $500,000 and over 100 sales; Georgia and Washington $100,000.</p>`,
        answer, unit: 'states', tol: 0, abs: 0.01,
        hint: 'Count the home state first, then test each other state against its own threshold.',
        solution: steps('Colorado: home state, so yes (1).', ...list.map(([n, v, y]) => `${n}: ${m('us', v)} → ${y ? 'nexus' : 'below the threshold'}.`), `Total: <b>${answer}</b> states.`),
        ca, ny, nyo, ga, wa,
      };
    },
    verify: (p) => 1 + (p.ca > 500000) + (p.ny > 500000 && p.nyo > 100) + (p.ga >= 100000) + (p.wa >= 100000),
  },
  'selling-across-borders-ddp': {
    title: 'price a delivered-duty-paid order',
    make(r) {
      const v = pick(r, 200, 2000, 50), duty = pick(r, 2, 12, 1) / 100, vat = 0.2;
      const d = v * duty, t = (v + d) * vat, answer = v + d + t;
      return {
        q: `<p>A Canadian maker sells a ${m('ca', v)} order to a UK business on DDP terms (the seller pays the import costs). UK duty is ${duty * 100} % of the value and import VAT is 20 % of value plus duty. Shipping is already in the price. What do the goods cost the seller in total, landed in the UK?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Duty = rate × value. Import VAT = 20 % × (value + duty). Add all three.',
        solution: steps(`Duty: ${duty * 100} % × ${m('ca', v)} = ${m('ca', d, 2)}.`, `VAT: 20 % × (${m('ca', v)} + ${m('ca', d, 2)}) = ${m('ca', t, 2)}.`, `Landed: <b>${m('ca', answer, 2)}</b>. (A VAT-registered seller can usually reclaim that import VAT.)`),
        v, duty,
      };
    },
    verify: (p) => p.v * (1 + p.duty) * 1.2,
  },
  'invoices-tax-included': {
    title: 'find the tax inside a tax-included price',
    make(r) {
      const tot = pick(r, 100, 3000, 10) + 0.0, rate = [5, 13, 15][Math.floor(r() * 2.999)];
      const answer = (tot * rate) / (100 + rate);
      return {
        q: `<p>A receipt says "${m('ca', tot, 2)}, ${rate === 5 ? 'GST' : 'HST'} ${rate} % included". How much of it is tax?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: `The price before tax is the total ÷ (1 + ${rate / 100}). The tax is the rest, or total × ${rate} ÷ ${100 + rate}.`,
        solution: steps(`Before tax: ${m('ca', tot, 2)} ÷ ${1 + rate / 100} = ${m('ca', tot / (1 + rate / 100), 2)}.`, `Tax: ${m('ca', tot, 2)} − ${m('ca', tot / (1 + rate / 100), 2)} = <b>${m('ca', answer, 2)}</b>.`, `Not ${rate} % of the total: that would be ${m('ca', tot * rate / 100, 2)}, too much.`),
        tot, rate,
      };
    },
    verify: (p) => p.tot - p.tot / (1 + p.rate / 100),
  },
  // ---------- Module 8: income tax ----------
  'business-income-tax-profit': {
    title: 'find the taxable profit',
    make(r) {
      const fees = pick(r, 60, 200, 5) * 1000, costs = pick(r, 10, 50, 1) * 1000, eq = pick(r, 2, 6, 1) * 1000, dep = 0.5;
      const answer = fees - costs - eq * dep;
      return {
        q: `<p>A Canadian consultant invoiced ${m('ca', fees)} plus 13 % HST in her first year. Running costs (software, desk rent, phone) were ${m('ca', costs)} before HST. She also bought a ${m('ca', eq)} computer and may claim ${dep * 100} % of it as capital cost allowance this year. What is her taxable business profit?</p>`,
        answer, unit: '$', tol: 0.001,
        hint: 'HST collected is not income. Profit = fees − running costs − this year’s share of the computer.',
        solution: steps(`Revenue without HST: ${m('ca', fees)}.`, `Minus running costs ${m('ca', costs)} and CCA ${m('ca', eq * dep)}.`, `Profit: <b>${m('ca', answer)}</b>.`),
        fees, costs, eq,
      };
    },
    verify: (p) => p.fees - p.costs - p.eq / 2,
  },
  'india-income-tax-business-44ada': {
    title: 'tax under 44ADA (new regime)',
    make(r) {
      const rec = pick(r, 20, 70, 1) * 100000, prof = rec / 2, answer = inTax(prof);
      return {
        q: `<p>An Indian freelance developer with no other income receives ${m('in', rec)} in FY 2025-26, all by bank transfer, and opts for section 44ADA. Under the new regime (nil to ₹4 lakh, then 5 %, 10 %, 15 %, 20 %, 25 % per ₹4 lakh, 30 % over ₹24 lakh; no tax up to ₹12 lakh; 4 % cess), what is the tax?</p>`,
        answer, unit: '₹', tol: 0.002,
        hint: '44ADA: profit = 50 % of receipts. Then apply the slabs (the rebate removes the tax only if income is ₹12 lakh or less), and add 4 % cess.',
        solution: steps(`Presumed profit: 50 % × ${m('in', rec)} = ${m('in', prof)}.`, prof <= 1200000 ? 'At ₹12 lakh or less, the 87A rebate makes the tax nil.' : `Slab tax on ${m('in', prof)} = ${m('in', answer / 1.04)} (with marginal relief near ₹12 lakh).`, `With 4 % cess: <b>${m('in', answer)}</b>.`),
        rec,
      };
    },
    verify: (p) => inTax(p.rec * 0.5),
  },
  'canada-income-tax-business-ccpc': {
    title: 'corporate tax for a small Ontario corporation',
    make(r) {
      const p = pick(r, 80, 900, 10) * 1000, small = Math.min(p, 500000), answer = small * 0.122 + Math.max(0, p - 500000) * 0.265;
      return {
        q: `<p>An Ontario CCPC earns ${m('ca', p)} of active business income. It pays 12.2 % (federal 9 % + Ontario 3.2 %) on the first $500,000 and 26.5 % above. What is its corporate income tax?</p>`,
        answer, unit: '$', tol: 0.001,
        hint: 'Split the profit at $500,000 and apply each rate to its part.',
        solution: steps(`First part: 12.2 % × ${m('ca', small)} = ${m('ca', small * 0.122)}.`, `Above $500,000: 26.5 % × ${m('ca', Math.max(0, p - 500000))} = ${m('ca', Math.max(0, p - 500000) * 0.265)}.`, `Total: <b>${m('ca', answer)}</b>.`),
        p,
      };
    },
    verify: (q) => Math.min(q.p, 500000) * 0.122 + Math.max(0, q.p - 500000) * 0.265,
  },
  'usa-income-tax-business-se': {
    title: 'self-employment tax on Schedule C profit',
    make(r) {
      const p = pick(r, 30, 150, 5) * 1000, base = p * 0.9235, answer = base * 0.153;
      return {
        q: `<p>A single-member LLC owner has ${m('us', p)} of net profit on Schedule C (no wages elsewhere). Self-employment tax is 15.3 % of 92.35 % of profit (below the $184,500 wage base). How much self-employment tax is due?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'First multiply the profit by 0.9235, then by 0.153.',
        solution: steps(`Earnings subject to SE tax: 92.35 % × ${m('us', p)} = ${m('us', base, 2)}.`, `SE tax: 15.3 % × ${m('us', base, 2)} = <b>${m('us', answer, 2)}</b>.`, `Half of it (${m('us', answer / 2, 2)}) is deductible on Form 1040.`),
        p,
      };
    },
    verify: (q) => q.p * 0.141295,
  },
  'paying-yourself-dividend': {
    title: 'what dividend can an Indian company pay?',
    make(r) {
      const p = pick(r, 10, 80, 1) * 100000, tax = p * 0.25168, answer = p - tax;
      return {
        q: `<p>A private limited company under section 115BAA (25.168 % in all) has a profit of ${m('in', p)} and pays its founder no salary. What is the most it can pay out as dividend this year?</p>`,
        answer, unit: '₹', tol: 0.002,
        hint: 'Dividends come from profit after company tax.',
        solution: steps(`Company tax: 25.168 % × ${m('in', p)} = ${m('in', tax)}.`, `Left to distribute: <b>${m('in', answer)}</b>.`, 'The founder then pays tax on the dividend at slab rates (the company deducts 10 % TDS on dividends over ₹10,000).'),
        p,
      };
    },
    verify: (q) => q.p * 0.74832,
  },
  'expenses-records-home-office': {
    title: 'the business share of a home',
    make(r) {
      const rent = pick(r, 1400, 3200, 50), util = pick(r, 120, 300, 10), area = pick(r, 80, 160, 10), home = pick(r, 700, 1400, 50);
      const answer = (rent + util) * 12 * (area / home);
      return {
        q: `<p>A founder works from a ${area} sq ft room used only for the business in a ${home} sq ft rented flat. Rent is ${m('ca', rent)} and utilities ${m('ca', util)} a month. What yearly home office expense can she claim, using the area method?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Business share = office area ÷ whole home area. Apply it to a year of rent and utilities.',
        solution: steps(`Share: ${area} ÷ ${home} = ${(area / home * 100).toFixed(1)} %.`, `Yearly costs: 12 × (${m('ca', rent)} + ${m('ca', util)}) = ${m('ca', 12 * (rent + util))}.`, `Claim: <b>${m('ca', answer)}</b>.`),
        rent, util, area, home,
      };
    },
    verify: (q) => 12 * (q.rent + q.util) * q.area / q.home,
  },
  'tax-calendar-advance-tax': {
    title: 'India advance tax due by 15 September',
    make(r) {
      const t = pick(r, 1, 12, 0.5) * 100000, paid = t * 0.15, answer = t * 0.45 - paid;
      return {
        q: `<p>An Indian proprietor (not on presumptive tax) expects tax of ${m('in', t)} for the year and paid 15 % on 15 June. How much more must be paid by 15 September?</p>`,
        answer, unit: '₹', tol: 0.002,
        hint: 'Advance tax is cumulative: 15 % by 15 June, 45 % by 15 September, 75 % by 15 December, 100 % by 15 March.',
        solution: steps(`By 15 September in total: 45 % × ${m('in', t)} = ${m('in', t * 0.45)}.`, `Already paid: ${m('in', paid)}.`, `Pay now: <b>${m('in', answer)}</b>. Short payments attract 1 % a month interest.`),
        t,
      };
    },
    verify: (q) => q.t * 0.3,
  },
  // ---------- Module 9: hiring and payroll ----------
  'employee-or-contractor-dayrate': {
    title: 'the day rate that matches an employee’s cost',
    make(r) {
      const sal = pick(r, 50, 110, 5) * 1000, on = pick(r, 10, 25, 1) / 100, days = pick(r, 210, 230, 5);
      const cost = sal * (1 + on), answer = cost / days;
      return {
        q: `<p>An employee would earn ${m('us', sal)} a year and cost you ${on * 100} % more in payroll taxes and benefits. They would work ${days} days a year. What contractor day rate costs you the same over a year?</p>`,
        answer, unit: '$ a day', tol: 0.002,
        hint: 'Yearly cost = salary × (1 + on-cost share). Divide by working days.',
        solution: steps(`Yearly cost: ${m('us', sal)} × ${(1 + on).toFixed(2)} = ${m('us', cost)}.`, `Per day: ${m('us', cost)} ÷ ${days} = <b>${m('us', answer, 2)}</b>.`, 'A contractor charging more than this for steady full-time work costs you more; one charging less may really be an employee in disguise, or not covering their own costs.'),
        sal, on, days,
      };
    },
    verify: (q) => q.sal * (1 + q.on) / q.days,
  },
  'india-payroll-pf': {
    title: 'PF under the labour codes’ 50 % wage rule',
    make(r) {
      const g = pick(r, 20, 90, 1) * 1000, basic = 0.4 * g, wages = Math.max(basic, g / 2), pfw = Math.min(wages, 15000), answer = 0.12 * pfw;
      return {
        q: `<p>An Indian employee earns ${m('in', g)} a month: basic ${m('in', basic)} (40 %) and the rest in allowances. Under the labour codes, "wages" must be at least 50 % of total pay. The company pays PF on wages up to ₹15,000. What is the employee’s monthly PF deduction (12 %)?</p>`,
        answer, unit: '₹', tol: 0.002,
        hint: 'Wages = the larger of basic and 50 % of pay. PF wages = the smaller of that and ₹15,000. Then 12 %.',
        solution: steps(`50 % of pay = ${m('in', g / 2)}, more than basic ${m('in', basic)}, so wages = ${m('in', wages)}.`, `PF wages: the smaller of ${m('in', wages)} and ₹15,000 = ${m('in', pfw)}.`, `Employee PF: 12 % × ${m('in', pfw)} = <b>${m('in', answer)}</b>. The employer pays the same again.`),
        g,
      };
    },
    verify: (q) => 0.12 * Math.min(q.g / 2, 15000),
  },
  'canada-payroll-cpp-ei': {
    title: 'an employee’s CPP and EI for the year',
    make(r) {
      const s = pick(r, 30, 68, 1) * 1000, cpp = (s - 3500) * 0.0595, ei = s * 0.0163, answer = cpp + ei;
      return {
        q: `<p>An Ontario employee earns ${m('ca', s)} in 2026. CPP is 5.95 % of earnings above the $3,500 basic exemption (up to $74,600), and EI is 1.63 % (up to $68,900). How much CPP and EI is deducted from their pay over the year?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'CPP = 5.95 % × (salary − 3,500). EI = 1.63 % × salary. Both salaries here are under the maximums.',
        solution: steps(`CPP: 5.95 % × (${m('ca', s)} − $3,500) = ${m('ca', cpp, 2)}.`, `EI: 1.63 % × ${m('ca', s)} = ${m('ca', ei, 2)}.`, `Total: <b>${m('ca', answer, 2)}</b>. The employer adds the same CPP and 1.4 × the EI (${m('ca', ei * 1.4, 2)}).`),
        s,
      };
    },
    verify: (q) => (q.s - 3500) * 0.0595 + q.s * 0.0163,
  },
  'usa-payroll-employer': {
    title: 'what the employer adds on top of salary',
    make(r) {
      const s = pick(r, 40, 150, 5) * 1000, su = pick(r, 20, 40, 1) / 1000, wb = pick(r, 7, 15, 1) * 1000;
      const fica = s * 0.0765, futa = 42, suta = su * wb, answer = fica + futa + suta;
      return {
        q: `<p>A US startup pays an employee ${m('us', s)} a year. Employer payroll taxes: Social Security 6.2 % and Medicare 1.45 % of wages, FUTA 0.6 % of the first $7,000, and state unemployment ${(su * 100).toFixed(1)} % of the first ${m('us', wb)}. What are the employer’s payroll taxes for the year?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'FICA = 7.65 % of salary (below $184,500). FUTA = 0.6 % × 7,000 = $42. SUTA = rate × wage base.',
        solution: steps(`FICA: 7.65 % × ${m('us', s)} = ${m('us', fica, 2)}.`, 'FUTA: 0.6 % × $7,000 = $42.', `SUTA: ${(su * 100).toFixed(1)} % × ${m('us', wb)} = ${m('us', suta, 2)}.`, `Total: <b>${m('us', answer, 2)}</b>, before workers’ compensation insurance and benefits.`),
        s, su, wb,
      };
    },
    verify: (q) => q.s * 0.0765 + 42 + q.su * q.wb,
  },
  'true-cost-of-hire-total': {
    title: 'the full yearly cost of one hire',
    make(r) {
      const s = pick(r, 50, 120, 5) * 1000, pay = pick(r, 8, 14, 1) / 100, ben = pick(r, 2, 10, 1) * 1000, tools = pick(r, 2, 5, 0.5) * 1000, rec = pick(r, 4, 12, 1) * 1000;
      const answer = s * (1 + pay) + ben + tools + rec / 2;
      return {
        q: `<p>A Canadian startup hires at ${m('ca', s)}. Payroll costs (CPP, EI, vacation pay) add ${pay * 100} %, benefits cost ${m('ca', ben)} a year, tools ${m('ca', tools)} a year, and the recruiter’s one-off ${m('ca', rec)} fee is spread over 2 years. What is the yearly cost?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Salary × (1 + payroll share) + benefits + tools + half the recruiting fee.',
        solution: steps(`Salary and payroll: ${m('ca', s)} × ${(1 + pay).toFixed(2)} = ${m('ca', s * (1 + pay))}.`, `Benefits and tools: ${m('ca', ben + tools)}.`, `Recruiting per year: ${m('ca', rec / 2)}.`, `Total: <b>${m('ca', answer)}</b>, which is ${(answer / s).toFixed(2)} times the salary.`),
        s, pay, ben, tools, rec,
      };
    },
    verify: (q) => q.s * (1 + q.pay) + q.ben + q.tools + q.rec / 2,
  },
  'employment-contracts-safety-vacation': {
    title: 'vacation pay owed in Ontario',
    make(r) {
      const w = pick(r, 20, 90, 1) * 1000, yrs = pick(r, 1, 8, 1), rate = yrs >= 5 ? 0.06 : 0.04, answer = w * rate;
      return {
        q: `<p>An Ontario employee has worked for you for ${yrs} year${yrs > 1 ? 's' : ''} and earned ${m('ca', w)} in wages this vacation entitlement year. Ontario’s minimum vacation pay is 4 % of wages (6 % once employment reaches 5 years). How much vacation pay is owed at least?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Pick the rate from the years of service, then apply it to the wages earned.',
        solution: steps(`${yrs} year${yrs > 1 ? 's' : ''} of service: rate ${rate * 100} %.`, `${rate * 100} % × ${m('ca', w)} = <b>${m('ca', answer)}</b>.`, 'It is paid when the vacation is taken (or on each pay if the employee agrees in writing), and any unpaid amount is due when employment ends.'),
        w, yrs,
      };
    },
    verify: (q) => q.w * (q.yrs >= 5 ? 0.06 : 0.04),
  },
  // ---------- Module 10: co-founders and equity ----------
  'co-founder-agreement-cash': {
    title: 'shares for a founder who puts in cash',
    make(r) {
      const cash = pick(r, 5, 50, 5) * 1000, price = pick(r, 1, 20, 1) / 100, answer = cash / price;
      return {
        q: `<p>The founders agree that any cash a founder puts in buys shares at ${m('us', price, 2)} each, the price the founders paid. One founder invests ${m('us', cash)}. How many shares does that buy?</p>`,
        answer, unit: 'shares', tol: 0.001,
        hint: 'Shares = cash ÷ price per share.',
        solution: steps(`${m('us', cash)} ÷ ${m('us', price, 2)} = <b>${answer.toLocaleString('en')}</b> shares.`, 'Writing the price into the agreement in advance avoids an argument later about what the cash was worth.'),
        cash, price,
      };
    },
    verify: (q) => q.cash / q.price,
  },
  'splitting-equity-weighted': {
    title: 'a weighted starting split',
    make(r) {
      const a1 = pick(r, 5, 10), a2 = pick(r, 3, 10), b1 = pick(r, 3, 10), b2 = pick(r, 3, 10), w1 = 3, w2 = 2;
      const A = w1 * a1 + w2 * a2, B = w1 * b1 + w2 * b2, answer = (A / (A + B)) * 100;
      return {
        q: `<p>Two founders score themselves on two lines. "Full-time from the start" (weight 3): Asha ${a1}, Ben ${b1}. "Skills the product needs" (weight 2): Asha ${a2}, Ben ${b2}. What percentage does Asha get in the weighted starting split?</p>`,
        answer, unit: '%', tol: 0.002,
        hint: 'Points = weight × score, added over the lines. Asha’s share = her points ÷ both founders’ points.',
        solution: steps(`Asha: 3 × ${a1} + 2 × ${a2} = ${A} points.`, `Ben: 3 × ${b1} + 2 × ${b2} = ${B} points.`, `Asha: ${A} ÷ ${A + B} = <b>${answer.toFixed(1)} %</b>.`),
        A, B,
      };
    },
    verify: (q) => 100 * q.A / (q.A + q.B),
  },
  'vesting-cliffs-vested': {
    title: 'shares vested on the day someone leaves',
    make(r) {
      const n = pick(r, 2, 20, 1) * 100000, mo = pick(r, 6, 47, 1), answer = mo < 12 ? 0 : (n * mo) / 48;
      return {
        q: `<p>A co-founder has ${n.toLocaleString('en')} shares vesting over 48 months with a 12-month cliff, then monthly. They leave after ${mo} full months. How many shares have vested?</p>`,
        answer, unit: 'shares', tol: 0.001, abs: 0.5,
        hint: 'Before the cliff nothing vests. From the cliff on, vested = shares × months ÷ 48.',
        solution: mo < 12 ? steps(`${mo} months is before the 12-month cliff.`, 'Vested: <b>0</b> shares.') : steps(`${mo} months is past the cliff.`, `${n.toLocaleString('en')} × ${mo} ÷ 48 = <b>${Math.round(answer).toLocaleString('en')}</b> shares.`),
        n, mo,
      };
    },
    verify: (q) => (q.mo < 12 ? 0 : q.n * q.mo / 48),
  },
  'employee-stock-options-perquisite': {
    title: 'tax on exercising options in India',
    make(r) {
      const n = pick(r, 1, 20, 1) * 1000, k = pick(r, 10, 100, 10), v = k + pick(r, 50, 500, 10), rate = 0.312;
      const per = (v - k) * n, answer = per * rate;
      return {
        q: `<p>An employee of an Indian startup exercises ${n.toLocaleString('en')} options at ${m('in', k)} each when the shares are valued at ${m('in', v)}. Their top rate is 30 % plus 4 % cess (31.2 %), and the startup cannot offer the deferral. How much tax is due on exercise?</p>`,
        answer, unit: '₹', tol: 0.002,
        hint: 'Perquisite = (value − exercise price) × number of options. Tax = perquisite × 31.2 %.',
        solution: steps(`Perquisite: (${m('in', v)} − ${m('in', k)}) × ${n.toLocaleString('en')} = ${m('in', per)}.`, `Tax: 31.2 % × ${m('in', per)} = <b>${m('in', answer)}</b>, deducted through payroll, although no shares have been sold.`),
        n, k, v,
      };
    },
    verify: (q) => (q.v - q.k) * q.n * 0.312,
  },
  'disputes-exits-buyback': {
    title: 'what the company pays a good leaver',
    make(r) {
      const n = pick(r, 2, 10, 1) * 100000, mo = pick(r, 12, 40, 1), par = 0.001;
      const vested = Math.floor((n * mo) / 48), unv = n - vested, answer = unv * par;
      return {
        q: `<p>A good leaver holds ${n.toLocaleString('en')} shares (bought at $0.001 each) on 4-year monthly vesting with a 1-year cliff, and leaves after ${mo} months. The company buys back the unvested shares at the price paid. How much does it pay?</p>`,
        answer, unit: '$', tol: 0.002, abs: 0.01,
        hint: 'Vested = shares × months ÷ 48 (rounded down). Unvested = the rest. Payment = unvested × $0.001.',
        solution: steps(`Vested: ${n.toLocaleString('en')} × ${mo} ÷ 48 = ${vested.toLocaleString('en')}.`, `Unvested: ${unv.toLocaleString('en')}.`, `Payment: ${unv.toLocaleString('en')} × $0.001 = <b>${m('us', answer, 2)}</b>. They keep ${vested.toLocaleString('en')} vested shares.`),
        n, mo,
      };
    },
    verify: (q) => (q.n - Math.floor(q.n * q.mo / 48)) * 0.001,
  },
  // Module 11
  'ip-basics-copyright': {
    title: 'when a work enters the public domain',
    make(r) {
      const cc = ['in', 'ca', 'us'][pick(r, 0, 2)], d = pick(r, 1940, 1990), life = cc === 'in' ? 60 : 70;
      const name = { in: 'India', ca: 'Canada', us: 'the USA' }[cc], answer = d + life + 1;
      return {
        q: `<p>A writer died in ${d}. Their book is protected in ${name} for the author’s life plus ${life} years, ending on 31 December of the last year. In which year can anyone first use it freely?</p>`,
        answer, unit: '', tol: 0, abs: 0.5,
        hint: 'Add the years to the death year; protection runs to the end of that calendar year, and the work is free from 1 January of the next year.',
        solution: steps(`Life plus ${life}: ${d} + ${life} = ${d + life}.`, `Protection runs to 31 December ${d + life}.`, `Free from 1 January <b>${answer}</b>.`),
        d, life,
      };
    },
    verify: (q) => q.d + q.life + 1,
  },
  'trademarks-fee': {
    title: 'the government fee for an Indian trademark',
    make(r) {
      const k = pick(r, 1, 5), small = r() < 0.5, fee = small ? 4500 : 9000, answer = k * fee;
      return {
        q: `<p>${small ? 'A DPIIT-recognised startup' : 'A company that is not a startup or small enterprise'} files one Indian trademark online in ${k} class${k > 1 ? 'es' : ''}. The e-filing fee is ₹4,500 a class for individuals, startups and small enterprises and ₹9,000 a class for others. What is the government fee?</p>`,
        answer, unit: '₹', tol: 0, abs: 0.5,
        hint: 'Fee per class times the number of classes.',
        solution: steps(`Fee per class: ${m('in', fee)}.`, `${k} × ${m('in', fee)} = <b>${m('in', answer)}</b>.`, small ? 'A startup pays half what other companies pay.' : 'Getting DPIIT startup recognition first would halve this.'),
        k, fee,
      };
    },
    verify: (q) => q.k * q.fee,
  },
  'contracts-nda-ip-assignment-cap': {
    title: 'a liability cap in customer terms',
    make(r) {
      const fee = pick(r, 20, 400, 10), mo = pick(r, 3, 30), answer = fee * Math.min(mo, 12);
      return {
        q: `<p>Your terms say: “Our total liability is limited to the fees you paid us in the 12 months before the claim.” A customer has paid $${fee} a month for ${mo} months when something goes wrong. What is the most you owe under the cap?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'Only the last 12 months count, or fewer if they have been a customer for less time.',
        solution: steps(`Months that count: the smaller of ${mo} and 12 = ${Math.min(mo, 12)}.`, `$${fee} × ${Math.min(mo, 12)} = <b>${m('us', answer)}</b>.`, 'Consumer law can override a cap (for example for personal injury or gross negligence), so it is a limit, not a guarantee.'),
        fee, mo,
      };
    },
    verify: (q) => q.fee * Math.min(q.mo, 12),
  },
  'privacy-email-laws-casl': {
    title: 'months of implied consent left under CASL',
    make(r) {
      const buy = r() < 0.5, ago = buy ? pick(r, 1, 23) : pick(r, 1, 5), limit = buy ? 24 : 6, answer = limit - ago;
      return {
        q: `<p>A Canadian ${buy ? 'bought from you' : 'asked you a question about your product'} ${ago} month${ago > 1 ? 's' : ''} ago and never ticked a box for marketing. Under CASL, implied consent lasts 2 years after a purchase and 6 months after an inquiry. For how many more months may you email them marketing?</p>`,
        answer, unit: 'months', tol: 0, abs: 0.5,
        hint: buy ? 'Purchase: 24 months in total.' : 'Inquiry: 6 months in total.',
        solution: steps(`Implied consent lasts ${limit} months.`, `${limit} − ${ago} = <b>${answer} months</b> left.`, 'Use them to ask for express consent, which does not expire.'),
        ago, limit,
      };
    },
    verify: (q) => q.limit - q.ago,
  },
  'website-legal-pages-gdpr': {
    title: 'the highest GDPR fine',
    make(r) {
      const t = pick(r, 50, 2000, 50), answer = Math.max(20, 0.04 * t);
      return {
        q: `<p>A company with worldwide yearly turnover of €${t} million breaks a core GDPR rule (such as using data with no lawful basis). The top fine is €20 million or 4 % of worldwide turnover, whichever is higher. What is the most it can be fined, in € million?</p>`,
        answer, unit: '€ million', tol: 0.001, abs: 0.01,
        hint: 'Work out 4 % of turnover, then take the larger of that and €20 million.',
        solution: steps(`4 % of €${t} million = €${n(0.04 * t)} million.`, `Larger of €20 million and €${n(0.04 * t)} million: <b>€${n(answer)} million</b>.`, 'Regulators rarely fine a small startup anything like the maximum, but the scale is why EU-facing sites need a proper notice.'),
        t,
      };
    },
    verify: (q) => Math.max(20, 0.04 * q.t),
  },
  // Module 12
  'annual-filings-late-fee': {
    title: 'late fees on Indian company filings',
    make(r) {
      const a = pick(r, 5, 120), b = pick(r, 0, 90), answer = 100 * (a + b);
      return {
        q: `<p>An Indian private company files its financial statements (AOC-4) ${a} days late and its annual return (MGT-7A) ${b ? `${b} days late` : 'on time'}. The late fee is ₹100 a day for each form, with no cap. What is the total late fee?</p>`,
        answer, unit: '₹', tol: 0, abs: 0.5,
        hint: 'Work out each form separately (₹100 × days late), then add them.',
        solution: steps(`AOC-4: ₹100 × ${a} = ${m('in', 100 * a)}.`, `MGT-7A: ₹100 × ${b} = ${m('in', 100 * b)}.`, `Total: <b>${m('in', answer)}</b>, and it keeps growing every day.`),
        a, b,
      };
    },
    verify: (q) => 100 * q.a + 100 * q.b,
  },
  'compliance-calendar-gst-returns': {
    title: 'how many GST/HST returns a year',
    make(r) {
      const rev = pick(r, 2, 80) * 100000, answer = rev > 6000000 ? 12 : rev > 1500000 ? 4 : 1;
      return {
        q: `<p>A Canadian corporation has C$${rev.toLocaleString('en')} of taxable sales a year. CRA assigns annual GST/HST returns up to C$1.5 million, quarterly above C$1.5 million up to C$6 million, and monthly above C$6 million. How many GST/HST returns does it file each year?</p>`,
        answer, unit: 'returns', tol: 0, abs: 0.5,
        hint: 'Find which band the sales fall in.',
        solution: steps(`Sales: C$${rev.toLocaleString('en')}.`, `Band: ${answer === 1 ? 'up to C$1.5 million, annual' : answer === 4 ? 'C$1.5 million to C$6 million, quarterly' : 'over C$6 million, monthly'}.`, `<b>${answer} return${answer > 1 ? 's' : ''}</b> a year. Smaller businesses can choose to file more often to get input tax credits back sooner.`),
        rev,
      };
    },
    verify: (q) => (q.rev <= 1500000 ? 1 : q.rev <= 6000000 ? 4 : 12),
  },
  'business-insurance-expected-loss': {
    title: 'the expected yearly loss from a risk',
    make(r) {
      const p = pick(r, 1, 10), loss = pick(r, 20, 300, 10) * 1000, prem = pick(r, 5, 40) * 100, answer = (p / 100) * loss;
      return {
        q: `<p>A small studio estimates a ${p} % chance each year of a client claim for a design error, costing about $${loss.toLocaleString('en')} if it happens. Professional liability cover costs $${prem.toLocaleString('en')} a year. What is the expected yearly loss without insurance?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Expected loss = chance × cost of the loss.',
        solution: steps(`${p} % × $${loss.toLocaleString('en')} = <b>${m('us', answer)}</b> a year on average.`, `Premium: $${prem.toLocaleString('en')}.`, `The premium is ${prem > answer ? 'higher than the average loss, as it usually is: you pay for removing a loss that could close the business' : 'lower than the average loss: insuring is clearly worth it'}.`),
        p, loss,
      };
    },
    verify: (q) => q.p * q.loss / 100,
  },
  'expanding-across-borders-eor': {
    title: 'the yearly cost of a hire through an employer of record',
    make(r) {
      const s = pick(r, 40, 120, 5) * 100, c = pick(r, 8, 25), fee = pick(r, 4, 8) * 100, answer = 12 * (s * (1 + c / 100) + fee);
      return {
        q: `<p>A startup hires its first person in another country through an employer of record (EOR). Salary: $${s.toLocaleString('en')} a month. Employer taxes and benefits there: ${c} % of salary. EOR fee: $${fee} a month. What is the cost for a year?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Monthly cost = salary × (1 + employer %) + fee; then times 12.',
        solution: steps(`Salary plus employer costs: $${s.toLocaleString('en')} × ${1 + c / 100} = ${m('us', s * (1 + c / 100))}.`, `Plus fee: ${m('us', s * (1 + c / 100) + fee)} a month.`, `× 12 = <b>${m('us', answer)}</b> a year.`),
        s, c, fee,
      };
    },
    verify: (q) => 12 * q.s + 12 * q.s * q.c / 100 + 12 * q.fee,
  },
  'closing-a-business-distribution': {
    title: 'what a shareholder gets when a company closes',
    make(r) {
      const cash = pick(r, 50, 400, 5) * 1000, debt = pick(r, 5, 40) * 1000, cost = pick(r, 2, 10) * 500, own = pick(r, 10, 60, 5), answer = (own / 100) * (cash - debt - cost);
      return {
        q: `<p>A solvent corporation is closing. It has $${cash.toLocaleString('en')} after selling its assets, owes $${debt.toLocaleString('en')} to suppliers and tax, and expects $${cost.toLocaleString('en')} of closing costs. A founder owns ${own} % of the shares. How much is distributed to that founder?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Creditors and closing costs are paid first; shareholders share what is left by their percentage.',
        solution: steps(`Left for shareholders: $${cash.toLocaleString('en')} − $${debt.toLocaleString('en')} − $${cost.toLocaleString('en')} = ${m('us', cash - debt - cost)}.`, `${own} % of that = <b>${m('us', answer)}</b>.`, 'In Canada, get a CRA clearance certificate before paying it out.'),
        cash, debt, cost, own,
      };
    },
    verify: (q) => q.own * (q.cash - q.debt - q.cost) / 100,
  },
  'launch-plan-runway': {
    title: 'months of runway',
    make(r) {
      const cash = pick(r, 10, 200, 5) * 1000, cost = pick(r, 3, 20) * 1000, rev = pick(r, 0, 2) * 1000, answer = cash / (cost - rev);
      return {
        q: `<p>Your launch plan starts with $${cash.toLocaleString('en')} in the bank. Monthly costs are $${cost.toLocaleString('en')} and monthly revenue is $${rev.toLocaleString('en')}. How many months of runway do you have? (One decimal place.)</p>`,
        answer, unit: 'months', tol: 0.01, abs: 0.05,
        hint: 'Runway = cash ÷ (costs − revenue).',
        solution: steps(`Net burn: $${cost.toLocaleString('en')} − $${rev.toLocaleString('en')} = ${m('us', cost - rev)} a month.`, `$${cash.toLocaleString('en')} ÷ ${m('us', cost - rev)} = <b>${answer.toFixed(1)} months</b>.`, 'Plan to raise money or reach break-even with at least 6 months left.'),
        cash, cost, rev,
      };
    },
    verify: (q) => q.cash / (q.cost - q.rev),
  },
  // Module 1
  'what-is-a-startup-scale': {
    title: 'cost per customer as a business grows',
    make(r) {
      const f = pick(r, 20, 80, 5) * 1000, v = pick(r, 2, 15), a = pick(r, 50, 200, 10), b = a * 10, ca = (f + v * a) / a, answer = (f + v * b) / b;
      return {
        q: `<p>A software startup has fixed monthly costs of $${f.toLocaleString('en')} (team, servers, tools) and $${v} of extra cost for each customer. With ${a} customers it costs $${ca.toFixed(2)} per customer a month. What does it cost per customer when it grows to ${b} customers?</p>`,
        answer, unit: '$', tol: 0.002, abs: 0.01,
        hint: 'Cost per customer = (fixed costs + cost per customer × customers) ÷ customers.',
        solution: steps(`Total cost: $${f.toLocaleString('en')} + $${v} × ${b} = ${m('us', f + v * b)}.`, `Per customer: ${m('us', f + v * b)} ÷ ${b} = <b>${m('us', answer, 2)}</b>.`, `Ten times the customers, but the cost per customer fell from $${ca.toFixed(2)}: that is what “scalable” means.`),
        f, v, b,
      };
    },
    verify: (q) => q.f / q.b + q.v,
  },
  'online-vs-offline-small-supplier': {
    title: 'four quarters of sales for Canada’s small supplier test',
    make(r) {
      const qs = [0, 0, 0, 0].map(() => pick(r, 3, 12, 0.5) * 1000), answer = qs.reduce((a, b) => a + b, 0);
      return {
        q: `<p>A Canadian online seller made C$${qs.map((x) => x.toLocaleString('en')).join(', C$')} in its last four calendar quarters. A small supplier can stay unregistered for GST/HST while sales over four consecutive quarters are C$30,000 or less. What are its four-quarter sales?</p>`,
        answer, unit: 'C$', tol: 0, abs: 0.5,
        hint: 'Add the four quarters, then compare with C$30,000.',
        solution: steps(`${qs.map((x) => 'C$' + x.toLocaleString('en')).join(' + ')} = <b>C$${answer.toLocaleString('en')}</b>.`, answer > 30000 ? 'Over C$30,000: it must register for GST/HST and start charging it.' : 'Not over C$30,000: it can stay a small supplier for now (or register voluntarily to claim input tax credits).'),
        qs,
      };
    },
    verify: (q) => q.qs[0] + q.qs[1] + q.qs[2] + q.qs[3],
  },
  'solo-or-team-stake': {
    title: 'what a co-founder’s share is worth',
    make(r) {
      const p = pick(r, 5, 40, 5), v = pick(r, 2, 40) * 100000, answer = (p / 100) * v;
      return {
        q: `<p>You give a co-founder ${p} % of your company. A year later an investor values the whole company at $${v.toLocaleString('en')}. What is the co-founder’s stake worth on paper?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Stake value = share × company value.',
        solution: steps(`${p} % × $${v.toLocaleString('en')} = <b>${m('us', answer)}</b>.`, 'That is why a co-founder is the most expensive way to fill a gap: shares are forever, and they grow with the company.'),
        p, v,
      };
    },
    verify: (q) => q.p * q.v / 100,
  },
  'a-to-z-map-fees': {
    title: 'the government fees to become official',
    make(r) {
      const llc = pick(r, 50, 500, 10), permit = pick(r, 0, 100, 10), city = pick(r, 25, 300, 25), answer = llc + permit + city;
      return {
        q: `<p>A US founder forms an LLC (state filing fee $${llc}), gets an EIN from the IRS (free), a state sales tax permit ($${permit}) and a city business licence ($${city}). What do the government fees add up to?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'Add each fee; the EIN costs nothing.',
        solution: steps(`$${llc} + $0 + $${permit} + $${city} = <b>${m('us', answer)}</b>.`, 'Sites that charge for an EIN are agents: the IRS gives it free at irs.gov.'),
        llc, permit, city,
      };
    },
    verify: (q) => q.llc + q.permit + q.city,
  },
  'official-sources-old-rate': {
    title: 'the cost of an out-of-date rate',
    make(r) {
      const s = pick(r, 20, 200, 10) * 1000, a = pick(r, 5, 12), b = a + pick(r, 1, 6), answer = (s * (b - a)) / 100;
      return {
        q: `<p>A seller copies a ${a} % tax rate from an old blog post. The official page, updated this year, says ${b} %. Over the year the seller invoices ${s.toLocaleString('en')} of taxable sales at the old rate. How much tax did they under-collect, which they now owe out of their own pocket?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.5,
        hint: 'Under-collected tax = sales × (correct rate − rate used).',
        solution: steps(`Rate gap: ${b} % − ${a} % = ${b - a} %.`, `${s.toLocaleString('en')} × ${b - a} % = <b>${answer.toLocaleString('en')}</b>, plus any interest.`, 'Checking the official page and its date would have cost five minutes.'),
        s, a, b,
      };
    },
    verify: (q) => q.s * (q.b - q.a) / 100,
  },
  // Module 2
  'problem-worth-solving-score': {
    title: 'a problem score out of 100',
    make(r) {
      const v = [0, 0, 0, 0, 0].map(() => pick(r, 1, 5)), [pain, freq, pay, reach, access] = v, w = pain + freq + 2 * pay + reach + access, answer = Math.round((100 * w) / 30);
      return {
        q: `<p>You score a problem from 1 to 5 on five signals: pain ${pain}, frequency ${freq}, already paying ${pay}, how many have it ${reach}, can you reach them ${access}. “Already paying” counts double, so the best total is 30. What is the score out of 100 (rounded)?</p>`,
        answer, unit: '/ 100', tol: 0, abs: 0.5,
        hint: 'Add the scores with “already paying” twice, divide by 30, times 100.',
        solution: steps(`Weighted total: ${pain} + ${freq} + 2 × ${pay} + ${reach} + ${access} = ${w}.`, `${w} ÷ 30 × 100 = <b>${answer}</b>.`, `The weakest signal is what to test next.`),
        w,
      };
    },
    verify: (q) => Math.round(q.w * 100 / 30),
  },
  'customer-interviews-commitments': {
    title: 'commitment rate from interviews',
    make(r) {
      const n = pick(r, 10, 25), k = pick(r, 1, Math.floor(n / 3)), answer = (100 * k) / n;
      return {
        q: `<p>You interviewed ${n} people who have the problem. ${k} of them agreed to a real commitment (a pilot, a pre-order or an introduction to their boss). What percentage made a commitment?</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.05,
        hint: 'Commitment rate = commitments ÷ interviews × 100.',
        solution: steps(`${k} ÷ ${n} × 100 = <b>${answer.toFixed(1)} %</b>.`, 'Commitments are facts; “I would use it” is a guess. Track this number, not compliments.'),
        n, k,
      };
    },
    verify: (q) => 100 * q.k / q.n,
  },
  'mvp-conversion': {
    title: 'landing page conversion',
    make(r) {
      const v = pick(r, 200, 2000, 50), s = pick(r, 2, 80), answer = (100 * s) / v;
      return {
        q: `<p>Your landing page MVP had ${v.toLocaleString('en')} visitors and ${s} of them joined the waitlist. What is the conversion rate?</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.01,
        hint: 'Conversion = sign-ups ÷ visitors × 100.',
        solution: steps(`${s} ÷ ${v.toLocaleString('en')} × 100 = <b>${answer.toFixed(2)} %</b>.`, answer < 2 ? 'Weak: change one thing (headline, audience or price) and test again.' : 'Promising: next, test willingness to pay with a pre-sale.'),
        v, s,
      };
    },
    verify: (q) => q.s / q.v * 100,
  },
  'pricing-unit-economics-ltv': {
    title: 'customer lifetime value',
    make(r) {
      const p = pick(r, 20, 200, 5), c = pick(r, 2, 40, 1), fee = 0.03, churn = pick(r, 2, 8), mg = p - c - p * fee, answer = mg / (churn / 100);
      return {
        q: `<p>A subscription costs $${p} a month. Serving each customer costs $${c} a month, and card fees take 3 % of the price. ${churn} % of customers cancel each month. What is the lifetime value (LTV) of a customer?</p>`,
        answer, unit: '$', tol: 0.005, abs: 0.5,
        hint: 'Monthly margin = price − cost to serve − fees. LTV = margin ÷ monthly churn (as a decimal).',
        solution: steps(`Margin: $${p} − $${c} − $${(p * fee).toFixed(2)} = ${m('us', mg, 2)} a month.`, `Lifetime: 1 ÷ ${churn / 100} = ${(100 / churn).toFixed(1)} months.`, `LTV: ${m('us', mg, 2)} × ${(100 / churn).toFixed(1)} = <b>${m('us', answer)}</b>. Compare with what it costs to win a customer (CAC): aim for LTV at least 3 × CAC.`),
        p, c, churn,
      };
    },
    verify: (q) => (q.p * 0.97 - q.c) * 100 / q.churn,
  },
  'break-even-runway-customers': {
    title: 'break-even customers',
    make(r) {
      const f = pick(r, 3, 60) * 1000, p = pick(r, 20, 150, 5), v = pick(r, 2, Math.floor(p / 2)), answer = Math.ceil(f / (p - v));
      return {
        q: `<p>Fixed costs are $${f.toLocaleString('en')} a month. Each customer pays $${p} a month and costs $${v} a month to serve. How many customers do you need to break even? (Round up to a whole customer.)</p>`,
        answer, unit: 'customers', tol: 0, abs: 0.5,
        hint: 'Break-even = fixed costs ÷ (price − variable cost), rounded up.',
        solution: steps(`Contribution: $${p} − $${v} = $${p - v}.`, `$${f.toLocaleString('en')} ÷ $${p - v} = ${(f / (p - v)).toFixed(1)}.`, `Round up: <b>${answer} customers</b>.`),
        f, p, v,
      };
    },
    verify: (q) => Math.ceil(q.f / (q.p - q.v)),
  },
  'one-page-plan-retention': {
    title: 'the key number: customers kept',
    make(r) {
      const n = pick(r, 10, 60), k = pick(r, Math.ceil(n / 3), n), answer = (100 * k) / n;
      return {
        q: `<p>Your one-page plan’s key number is “paying clinics still with us after 3 months”. ${n} clinics started paying in January; ${k} are still paying in April. What is the 3-month retention?</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.05,
        hint: 'Retention = customers kept ÷ customers at the start × 100.',
        solution: steps(`${k} ÷ ${n} × 100 = <b>${answer.toFixed(1)} %</b>.`, 'One number the whole team watches each month tells you whether the plan is working.'),
        n, k,
      };
    },
    verify: (q) => 100 * q.k / q.n,
  },
  // Module 3
  'sole-proprietor-loss': {
    title: 'a sole proprietor’s loss against a salary',
    make(r) {
      const s = pick(r, 40, 120) * 1000, l = pick(r, 2, 30) * 1000, answer = s - l;
      return {
        q: `<p>Alex has a day job paying $${s.toLocaleString('en')} a year and runs a side business as a sole proprietor that lost $${l.toLocaleString('en')} in its first year (a real business, not a hobby). In general, what is Alex’s total income for tax after the loss?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'A sole proprietor’s business result is part of their own income, so a loss reduces other income.',
        solution: steps(`$${s.toLocaleString('en')} − $${l.toLocaleString('en')} = <b>${m('us', answer)}</b>.`, 'In a company the loss would stay inside the company and be carried forward against its own future profit instead.'),
        s, l,
      };
    },
    verify: (q) => q.s - q.l,
  },
  'partnership-llp-share': {
    title: 'a partner’s share of profit',
    make(r) {
      const a = pick(r, 1, 5), b = pick(r, 1, 5), c = pick(r, 1, 5), p = pick(r, 6, 60) * 10000, answer = (p * a) / (a + b + c);
      return {
        q: `<p>An LLP’s agreement splits profit ${a} : ${b} : ${c} between partners A, B and C. This year’s profit is ₹${p.toLocaleString('en-IN')}. What is partner A’s share?</p>`,
        answer, unit: '₹', tol: 0.001, abs: 0.5,
        hint: 'A’s share = profit × A’s part ÷ total parts.',
        solution: steps(`Total parts: ${a} + ${b} + ${c} = ${a + b + c}.`, `₹${p.toLocaleString('en-IN')} × ${a} ÷ ${a + b + c} = <b>${m('in', answer)}</b>.`, 'In India the LLP pays tax on its profit first; a partner’s share of profit is then exempt in their hands.'),
        a, b, c, p,
      };
    },
    verify: (q) => q.p * q.a / (q.a + q.b + q.c),
  },
  'company-corporation-india-tax': {
    title: 'Indian company tax under the 22 % regime',
    make(r) {
      const p = pick(r, 5, 200) * 100000, answer = p * 0.22 * 1.1 * 1.04;
      return {
        q: `<p>An Indian private company that chose the 22 % regime (section 115BAA) makes a taxable profit of ₹${p.toLocaleString('en-IN')}. The 22 % rate has a 10 % surcharge and a 4 % cess on top (25.168 % in all). What is its income tax?</p>`,
        answer, unit: '₹', tol: 0.001, abs: 1,
        hint: 'Tax = profit × 22 % × 1.10 × 1.04.',
        solution: steps(`22 % × ₹${p.toLocaleString('en-IN')} = ${m('in', p * 0.22)}.`, `Surcharge 10 %: ${m('in', p * 0.242)}.`, `Cess 4 %: <b>${m('in', answer)}</b>.`),
        p,
      };
    },
    verify: (q) => q.p * 0.25168,
  },
  'llc-c-corp-s-corp-saving': {
    title: 'the rough S corp payroll tax saving',
    make(r) {
      const p = pick(r, 60, 180, 5) * 1000, s = pick(r, 30, Math.floor(p / 2000), 1) * 1000, answer = 0.153 * (p - s);
      return {
        q: `<p>An LLC owner makes $${p.toLocaleString('en')} profit. With an S corp election they pay themselves a reasonable salary of $${s.toLocaleString('en')}, and the rest passes through without payroll tax. Using the rule of thumb, roughly how much self-employment tax do they save (15.3 % of the profit above the salary), before payroll and filing costs?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Saving ≈ 15.3 % × (profit − salary).',
        solution: steps(`Profit above salary: $${p.toLocaleString('en')} − $${s.toLocaleString('en')} = ${m('us', p - s)}.`, `15.3 % × ${m('us', p - s)} = <b>${m('us', answer)}</b>.`, 'Take off $1,500 to $3,000 a year for payroll and the 1120-S return; the real figure also depends on the wage base and the QBI deduction.'),
        p, s,
      };
    },
    verify: (q) => (q.p - q.s) * 0.153,
  },
  'structure-chooser-deferral': {
    title: 'tax deferred by keeping profit in a Canadian corporation',
    make(r) {
      const k = pick(r, 20, 150, 5) * 1000, mr = pick(r, 30, 46), answer = k * (mr / 100 - 0.122);
      return {
        q: `<p>An Ontario owner is in a ${mr} % personal tax bracket. Profit kept in their small Canadian-controlled corporation is taxed at about 12.2 % (federal plus Ontario small business rate). If they leave $${k.toLocaleString('en')} of profit in the corporation instead of taking it as salary, about how much tax is deferred until they take it out?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Deferral ≈ profit kept × (personal rate − corporate rate).',
        solution: steps(`Rate gap: ${mr} % − 12.2 % = ${(mr - 12.2).toFixed(1)} %.`, `$${k.toLocaleString('en')} × ${(mr - 12.2).toFixed(1)} % = <b>${m('us', answer)}</b>.`, 'Deferred, not saved: dividends taken out later are taxed personally. It helps when you reinvest in the business.'),
        k, mr,
      };
    },
    verify: (q) => q.k * q.mr / 100 - q.k * 0.122,
  },
  'where-to-register-delaware': {
    title: 'the yearly cost of a Delaware company run from home',
    make(r) {
      const agent = pick(r, 50, 300, 25), home = pick(r, 25, 300, 25), answer = 400 + 50 + agent + home;
      return {
        q: `<p>A founder in another state runs a Delaware C corporation. Each year it pays Delaware’s $400 minimum franchise tax (assumed par value method) and $50 report fee, a registered agent in Delaware ($${agent}), and the home state’s annual fee as a foreign corporation ($${home}). What is the yearly total, before any income tax?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'Add the four yearly costs.',
        solution: steps(`$400 + $50 + $${agent} + $${home} = <b>${m('us', answer)}</b>.`, 'Worth it if you are raising venture money; otherwise your home state alone is usually cheaper and simpler.'),
        agent, home,
      };
    },
    verify: (q) => 450 + q.agent + q.home,
  },
  'changing-structure-rollover': {
    title: 'the gain deferred by a section 85 rollover',
    make(r) {
      const v = pick(r, 20, 200, 5) * 1000, c = pick(r, 2, Math.floor(v / 2000)) * 1000, answer = v - c;
      return {
        q: `<p>A Canadian sole proprietor moves equipment and client goodwill worth C$${v.toLocaleString('en')} into a new corporation for shares. Their tax cost in those assets is C$${c.toLocaleString('en')}. With a section 85 election at the tax cost, how much gain is deferred instead of taxed now?</p>`,
        answer, unit: 'C$', tol: 0, abs: 0.5,
        hint: 'Deferred gain = fair market value − elected amount (here, the tax cost).',
        solution: steps(`C$${v.toLocaleString('en')} − C$${c.toLocaleString('en')} = <b>C$${answer.toLocaleString('en')}</b> deferred.`, 'Without the election the transfer would be a sale at market value, taxed this year. The election is made on form T2057.'),
        v, c,
      };
    },
    verify: (q) => q.v - q.c,
  },
  // Module 4
  'business-name-run-fees': {
    title: 'the cost of name rejections',
    make(r) {
      const k = pick(r, 0, 4), answer = 1000 * (k + 1);
      return {
        q: `<p>An Indian founder applies to reserve a company name (₹1,000 per application on the MCA portal) without searching first. The name is rejected ${k} time${k === 1 ? '' : 's'} for being too close to existing companies or trademarks before one is approved. What did the founder pay in name fees?</p>`,
        answer, unit: '₹', tol: 0, abs: 0.5,
        hint: 'Rejected applications plus the one that was approved, each ₹1,000.',
        solution: steps(`Applications: ${k} rejected + 1 approved = ${k + 1}.`, `${k + 1} × ₹1,000 = <b>${m('in', answer)}</b>, plus the weeks lost.`, 'A free search of the MCA company list and the trademark register first usually gets it right the first time.'),
        k,
      };
    },
    verify: (q) => (q.k + 1) * 1000,
  },
  'india-company-llp-shares': {
    title: 'founder shares in a new Indian company',
    make(r) {
      const cap = pick(r, 1, 10) * 100000, a = pick(r, 50, 80, 5), answer = (cap / 10) * (a / 100);
      return {
        q: `<p>A new private limited company has ₹${cap.toLocaleString('en-IN')} of paid-up capital in shares of ₹10 each. The founders split the shares ${a} : ${100 - a}. How many shares does the first founder subscribe for?</p>`,
        answer, unit: 'shares', tol: 0, abs: 0.5,
        hint: 'Total shares = capital ÷ ₹10; then take the founder’s percentage.',
        solution: steps(`Total shares: ₹${cap.toLocaleString('en-IN')} ÷ ₹10 = ${(cap / 10).toLocaleString('en-IN')}.`, `${a} % of that = <b>${answer.toLocaleString('en-IN')} shares</b>, costing ${m('in', answer * 10)}.`),
        cap, a,
      };
    },
    verify: (q) => q.cap * q.a / 1000,
  },
  'india-udyam-startup-india-45-days': {
    title: 'days beyond the MSME 45-day payment limit',
    make(r) {
      const d = pick(r, 46, 150), answer = d - 45;
      return {
        q: `<p>Your Udyam-registered micro enterprise supplied a large company under a written agreement allowing 45 days to pay. The buyer pays ${d} days after accepting the goods. By how many days is the payment late under the MSMED Act?</p>`,
        answer, unit: 'days', tol: 0, abs: 0.5,
        hint: 'Late days = days taken − 45.',
        solution: steps(`${d} − 45 = <b>${answer} days</b> late.`, 'The buyer owes compound interest at three times the RBI bank rate for those days, and under section 43B(h) cannot deduct the unpaid amount until it pays.'),
        d,
      };
    },
    verify: (q) => q.d - 45,
  },
  'canada-incorporation-isc': {
    title: 'is this shareholder an individual with significant control?',
    make(r) {
      const t = pick(r, 4, 20) * 1000, h = pick(r, 1, Math.floor(t / 1000) - 1) * 1000, answer = (100 * h) / t;
      return {
        q: `<p>A federal corporation has ${t.toLocaleString('en')} voting shares. One person holds ${h.toLocaleString('en')} of them. What percentage do they hold? (Holding 25 % or more makes them an individual with significant control, who must be in the corporation’s register.)</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.05,
        hint: 'Percentage = shares held ÷ total shares × 100.',
        solution: steps(`${h.toLocaleString('en')} ÷ ${t.toLocaleString('en')} × 100 = <b>${answer.toFixed(1)} %</b>.`, answer >= 25 ? 'At least 25 %: they go in the register of individuals with significant control, filed with Corporations Canada.' : 'Under 25 %: not significant control by shareholding alone (control by other means can still count).'),
        t, h,
      };
    },
    verify: (q) => q.h / q.t * 100,
  },
  'canada-business-number-hst': {
    title: 'net HST to remit',
    make(r) {
      const s = pick(r, 10, 120) * 1000, p = pick(r, 2, Math.floor(s / 2000)) * 1000, answer = 0.13 * (s - p);
      return {
        q: `<p>An Ontario corporation registered for HST (13 %) sold C$${s.toLocaleString('en')} of services this quarter (before tax) and bought C$${p.toLocaleString('en')} of supplies with HST. How much HST does it send to the CRA after input tax credits?</p>`,
        answer, unit: 'C$', tol: 0.001, abs: 0.5,
        hint: 'HST collected − HST paid on purchases.',
        solution: steps(`Collected: 13 % × C$${s.toLocaleString('en')} = C$${(0.13 * s).toLocaleString('en')}.`, `Input tax credits: 13 % × C$${p.toLocaleString('en')} = C$${(0.13 * p).toLocaleString('en')}.`, `Net: <b>C$${answer.toLocaleString('en', { maximumFractionDigits: 2 })}</b>, from the RT account.`),
        s, p,
      };
    },
    verify: (q) => q.s * 0.13 - q.p * 0.13,
  },
  'usa-forming-llc-corp-83b': {
    title: 'the tax bill an 83(b) election avoids',
    make(r) {
      const n = pick(r, 2, 8) * 1000000, px = pick(r, 2, 50) / 100, answer = (n / 4) * px;
      return {
        q: `<p>A founder buys ${n.toLocaleString('en')} shares at a tiny par price, vesting 25 % after the first year. She does <i>not</i> file an 83(b) election. At the one-year cliff the shares are worth $${px.toFixed(2)} each after a seed round. About how much ordinary income must she report when the first quarter vests (ignoring the tiny price paid)?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Income at vesting = shares vesting × value per share.',
        solution: steps(`Shares vesting: ${n.toLocaleString('en')} ÷ 4 = ${(n / 4).toLocaleString('en')}.`, `× $${px.toFixed(2)} = <b>${m('us', answer)}</b> of income, with no cash to pay the tax.`, 'An 83(b) filed within 30 days of buying the shares would have taxed only their near-zero value at purchase.'),
        n, px,
      };
    },
    verify: (q) => q.n * q.px / 4,
  },
  'usa-ein-registered-agent-agents': {
    title: 'registered agent fees across states',
    make(r) {
      const k = pick(r, 1, 6), fee = pick(r, 50, 300, 25), answer = k * fee;
      return {
        q: `<p>A company formed in Delaware is also registered as a foreign company in ${k - 1 === 0 ? 'no other states' : `${k - 1} other state${k - 1 > 1 ? 's' : ''}`} where it has staff. It uses a registered agent service at $${fee} a year per state. What does it pay a year for registered agents?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'One agent in every state where the company is registered, including Delaware.',
        solution: steps(`States: Delaware + ${k - 1} = ${k}.`, `${k} × $${fee} = <b>${m('us', answer)}</b>.`, 'You can be your own agent in a state where you have an address and are there in business hours.'),
        k, fee,
      };
    },
    verify: (q) => q.k * q.fee,
  },
  'address-domain-records-keep': {
    title: 'how long to keep the records',
    make(r) {
      const cc = ['in', 'ca'][pick(r, 0, 1)], y = pick(r, 2024, 2030), keep = cc === 'in' ? 8 : 6, answer = y + keep;
      const name = cc === 'in' ? 'an Indian company (books for 8 financial years under the Companies Act)' : 'a Canadian business (records for 6 years from the end of the tax year)';
      return {
        q: `<p>For ${name}, the tax year ends in ${y}${cc === 'in' ? ' (counting the financial year by the calendar year it ends in)' : ' on 31 December'}. Until the end of which year must its records for that year be kept?</p>`,
        answer, unit: '', tol: 0, abs: 0.5,
        hint: cc === 'in' ? 'Year it ends + 8.' : 'Year it ends + 6.',
        solution: steps(`${y} + ${keep} = <b>${answer}</b>.`, 'Keep them longer if a return is under review or appeal; scanned copies are fine if they are complete and readable.'),
        y, keep,
      };
    },
    verify: (q) => q.y + q.keep,
  },
  // Module 5
  'licence-finder-fine': {
    title: 'the cost of trading without a licence',
    make(r) {
      const f = pick(r, 50, 500, 50), d = pick(r, 5, 60), lic = pick(r, 50, 400, 25), answer = f * d;
      return {
        q: `<p>A shop trades for ${d} days before getting its city business licence (cost $${lic}). The city charges $${f} for each day of unlicensed trading. What is the fine?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'Fine = daily amount × days traded without the licence.',
        solution: steps(`$${f} × ${d} = <b>${m('us', answer)}</b>.`, `The licence itself cost $${lic}: checking BizPaL, your city or your state’s finder first is far cheaper. Insurers may also refuse claims for unlicensed activity.`),
        f, d,
      };
    },
    verify: (q) => q.f * q.d,
  },
  'food-health-alcohol-label': {
    title: 'energy per serving on a food label',
    make(r) {
      const k = pick(r, 80, 550, 10), g = pick(r, 20, 60, 5), answer = (k * g) / 100;
      return {
        q: `<p>Your granola has ${k} kcal per 100 g. The label must also show energy per serving, and one serving is ${g} g. How many kcal are in a serving?</p>`,
        answer, unit: 'kcal', tol: 0.002, abs: 0.5,
        hint: 'Per serving = per 100 g × serving size ÷ 100.',
        solution: steps(`${k} × ${g} ÷ 100 = <b>${n(answer)} kcal</b>.`, 'Labels follow strict national rules (FSSAI, Health Canada, FDA): check rounding and format before printing.'),
        k, g,
      };
    },
    verify: (q) => q.k / 100 * q.g,
  },
  'home-based-zoning-office': {
    title: 'the business share of home costs',
    make(r) {
      const room = pick(r, 80, 250, 10), home = pick(r, 800, 2500, 50), cost = pick(r, 6, 30) * 1000, answer = (cost * room) / home;
      return {
        q: `<p>You run your business from a ${room} sq ft room used only for work, in a ${home.toLocaleString('en')} sq ft home. Rent, utilities and home insurance cost $${cost.toLocaleString('en')} a year. Using the area method, what share of those costs is for the business?</p>`,
        answer, unit: '$', tol: 0.002, abs: 0.5,
        hint: 'Business share = costs × room area ÷ home area.',
        solution: steps(`Share: ${room} ÷ ${home.toLocaleString('en')} = ${(100 * room / home).toFixed(1)} %.`, `$${cost.toLocaleString('en')} × ${(100 * room / home).toFixed(1)} % = <b>${m('us', answer)}</b>.`, 'Canada and the USA allow this with conditions (a space used regularly and only for work); keep a floor plan and bills.'),
        room, home, cost,
      };
    },
    verify: (q) => q.cost / q.home * q.room,
  },
  'online-selling-rules-price': {
    title: 'the all-in price to show',
    make(r) {
      const p = pick(r, 10, 200), f = pick(r, 1, 15), t = [5, 13, 15][pick(r, 0, 2)], answer = (p + f) * (1 + t / 100);
      return {
        q: `<p>An online store lists a product at $${p} and adds a mandatory $${f} “service fee” at checkout. Sales tax is ${t} %. Drip-pricing rules expect mandatory fees in the advertised price. What is the total the customer pays?</p>`,
        answer, unit: '$', tol: 0.002, abs: 0.01,
        hint: 'Add the mandatory fee to the price, then add tax.',
        solution: steps(`Price with fee: $${p} + $${f} = $${p + f}.`, `Tax: × ${1 + t / 100} = <b>${m('us', answer, 2)}</b>.`, `So the advertised price should be $${p + f} (plus tax where prices are shown before tax), not $${p}.`),
        p, f, t,
      };
    },
    verify: (q) => (q.p + q.f) + (q.p + q.f) * q.t / 100,
  },
  'import-export-landed': {
    title: 'landed cost of an import',
    make(r) {
      const v = pick(r, 1, 20) * 1000, fr = pick(r, 100, 1500, 50), d = pick(r, 0, 18, 0.5), answer = v + fr + (v * d) / 100;
      return {
        q: `<p>A Canadian business imports goods worth C$${v.toLocaleString('en')}, pays C$${fr.toLocaleString('en')} international freight, and owes ${d} % duty on the goods’ value (Canada charges duty on the value without international freight). It is GST-registered, so the import GST comes back as an input tax credit. What is the landed cost?</p>`,
        answer, unit: 'C$', tol: 0.001, abs: 0.5,
        hint: 'Landed cost = value + freight + duty. Recoverable GST is not a cost.',
        solution: steps(`Duty: ${d} % × C$${v.toLocaleString('en')} = C$${(v * d / 100).toLocaleString('en')}.`, `Landed: C$${v.toLocaleString('en')} + C$${fr.toLocaleString('en')} + C$${(v * d / 100).toLocaleString('en')} = <b>C$${answer.toLocaleString('en', { maximumFractionDigits: 2 })}</b>.`, 'Price your product from this, not from the supplier’s price.'),
        v, fr, d,
      };
    },
    verify: (q) => q.v * (1 + q.d / 100) + q.fr,
  },
  // Module 6
  'business-bank-account-fees': {
    title: 'the yearly cost of a business account',
    make(r) {
      const fee = pick(r, 0, 40, 5), free = pick(r, 10, 50, 5), tx = pick(r, 20, 120, 5), c = pick(r, 50, 150, 25) / 100, answer = 12 * (fee + c * Math.max(0, tx - free));
      return {
        q: `<p>A business account costs $${fee} a month with ${free} free transactions, then $${c.toFixed(2)} for each extra one. You make about ${tx} transactions a month. What does the account cost a year?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.5,
        hint: 'Monthly cost = fee + extra transactions × price; then × 12.',
        solution: steps(`Extra transactions: max(0, ${tx} − ${free}) = ${Math.max(0, tx - free)}.`, `Monthly: $${fee} + ${Math.max(0, tx - free)} × $${c.toFixed(2)} = ${m('us', fee + c * Math.max(0, tx - free), 2)}.`, `Yearly: <b>${m('us', answer, 2)}</b>. Compare two or three banks on your real volume.`),
        fee, free, tx, c,
      };
    },
    verify: (q) => q.fee * 12 + 12 * q.c * Math.max(0, q.tx - q.free),
  },
  'taking-payments-fees': {
    title: 'card processing fees for a month',
    make(r) {
      const k = pick(r, 20, 400, 10), a = pick(r, 10, 300, 5), p = pick(r, 25, 35) / 10, fx = 0.3, answer = k * (a * p / 100 + fx);
      return {
        q: `<p>You take ${k} card payments of $${a} each this month. The processor charges ${p.toFixed(1)} % plus $0.30 per payment. What are the month’s fees?</p>`,
        answer, unit: '$', tol: 0.001, abs: 0.01,
        hint: 'Fee per payment = amount × rate + $0.30; then × number of payments.',
        solution: steps(`Per payment: $${a} × ${p.toFixed(1)} % + $0.30 = ${m('us', a * p / 100 + fx, 2)}.`, `× ${k} = <b>${m('us', answer, 2)}</b> (${(100 * answer / (k * a)).toFixed(2)} % of sales).`),
        k, a, p,
      };
    },
    verify: (q) => q.k * q.a * q.p / 100 + q.k * 0.3,
  },
  'bookkeeping-accrual': {
    title: 'accrual profit versus cash in the bank',
    make(r) {
      const inv = pick(r, 20, 100) * 1000, paid = pick(r, 5, Math.floor(inv / 1000)) * 1000, ex = pick(r, 5, Math.floor(inv / 1000) - 1) * 1000, answer = inv - ex;
      return {
        q: `<p>This month a business invoiced $${inv.toLocaleString('en')} (customers have paid $${paid.toLocaleString('en')} of it so far) and incurred and paid $${ex.toLocaleString('en')} of expenses. Using accrual accounting, what is the month’s profit?</p>`,
        answer, unit: '$', tol: 0, abs: 0.5,
        hint: 'Accrual: revenue counts when invoiced, not when paid.',
        solution: steps(`Revenue (invoiced): $${inv.toLocaleString('en')}.`, `Profit: $${inv.toLocaleString('en')} − $${ex.toLocaleString('en')} = <b>${m('us', answer)}</b>.`, `On a cash basis it would be $${paid.toLocaleString('en')} − $${ex.toLocaleString('en')} = ${m('us', paid - ex)}: profit and cash move separately.`),
        inv, ex,
      };
    },
    verify: (q) => q.inv - q.ex,
  },
  'loans-grants-emi': {
    title: 'the monthly payment on a loan',
    make(r) {
      const p = pick(r, 2, 20) * 100000, y = pick(r, 9, 14, 0.5), nYrs = pick(r, 2, 7), i = y / 1200, k = nYrs * 12, answer = (p * i) / (1 - (1 + i) ** -k);
      return {
        q: `<p>A business borrows ₹${p.toLocaleString('en-IN')} at ${y} % a year, repaid in equal monthly instalments (EMI) over ${nYrs} years. What is the EMI?</p>`,
        answer, unit: '₹', tol: 0.002, abs: 1,
        hint: 'EMI = P × i ÷ (1 − (1 + i)<sup>−n</sup>), with i = yearly rate ÷ 12 and n = months.',
        solution: steps(`i = ${y} % ÷ 12 = ${(i * 100).toFixed(4)} % a month; n = ${k} months.`, `EMI = ${p.toLocaleString('en-IN')} × ${i.toFixed(6)} ÷ (1 − ${(1 + i).toFixed(6)}<sup>−${k}</sup>) = <b>${m('in', answer)}</b>.`, `Total repaid: ${m('in', answer * k)}, of which ${m('in', answer * k - p)} is interest. Check it fits your monthly cash flow.`),
        p, y, k,
      };
    },
    verify: (q) => { const i = q.y / 1200; let b = q.p, lo = 0, hi = q.p; for (let t = 0; t < 80; t++) { const e = (lo + hi) / 2; b = q.p; for (let j = 0; j < q.k; j++) b = b * (1 + i) - e; if (b > 0) lo = e; else hi = e; } return (lo + hi) / 2; },
  },
  'raising-investment-safe': {
    title: 'what a post-money SAFE buys',
    make(r) {
      const inv = pick(r, 50, 1000, 25) * 1000, cap = pick(r, 3, 20) * 1000000, answer = (100 * inv) / cap;
      return {
        q: `<p>An investor puts $${inv.toLocaleString('en')} into a post-money SAFE with a $${cap.toLocaleString('en')} valuation cap. If it converts at the cap, what percentage of the company does the investor own just after conversion (before the new round’s money)?</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.005,
        hint: 'Post-money SAFE ownership = investment ÷ post-money cap.',
        solution: steps(`$${inv.toLocaleString('en')} ÷ $${cap.toLocaleString('en')} = <b>${answer.toFixed(2)} %</b>.`, 'Every SAFE you sign adds to this. Add them up before signing the next one: it is dilution already sold.'),
        inv, cap,
      };
    },
    verify: (q) => q.inv / q.cap * 100,
  },
  'cap-table-dilution-after': {
    title: 'a founder’s stake after a round',
    make(r) {
      const f = pick(r, 30, 70, 5), s = pick(r, 10, 30, 5), answer = f * (1 - s / 100);
      return {
        q: `<p>A founder owns ${f} % of the company. In a priced round, new investors buy new shares equal to ${s} % of the company after the round. What does the founder own after the round?</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.05,
        hint: 'Everyone’s percentage is multiplied by (1 − new investors’ share).',
        solution: steps(`${f} % × (1 − ${s} %) = <b>${answer.toFixed(1)} %</b>.`, 'The percentage falls, but if the price per share rose, the stake is worth more.'),
        f, s,
      };
    },
    verify: (q) => q.f - q.f * q.s / 100,
  },
};
