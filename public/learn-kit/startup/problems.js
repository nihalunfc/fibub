// Live problems for "Start a startup" (India, Canada, USA). Each make(rand) returns { q, answer, unit, tol, abs?, hint,
// solution } as small HTML; verify(p) recomputes the answer another way for tests/startup-kit.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Rates as of November 2026.
import { pick, steps, m, inTax } from './util.js';

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
};
