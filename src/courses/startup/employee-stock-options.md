---
title: 'Employee stock options (ESOPs)'
seoTitle: 'Employee stock options for startups: India, Canada, USA'
summary: 'How startups give employees a stake: setting up an option pool and plan, grants, strike price and valuation (409A in the USA), vesting and exercise windows, and when employees pay tax in India (perquisite and the startup deferral), Canada (CCPC deferral and 50 % deduction) and the USA (ISO and NSO).'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What is the "strike price" of an option?'
    choices: ['The share price at exit', 'The fixed price the employee pays to buy each share', 'The tax rate']
    ans: 1
    why: 'The gain is the value of the share above the strike price.'
  - q: 'An employee of a Canadian-controlled private corporation exercises options. When is the option benefit taxed?'
    choices: ['At grant', 'When they exercise', 'When they sell the shares']
    ans: 2
    why: 'For CCPC employees, the benefit is deferred until the shares are sold.'
  - q: 'Why do US startups get a 409A valuation before granting options?'
    choices: ['It is needed for a trademark', 'So the strike price is at fair market value and the options avoid harsh section 409A penalties', 'To file sales tax']
    ans: 1
    why: 'Options priced below fair market value can trigger immediate tax plus a 20 % penalty for the employee.'
sources:
  - 'Ministry of Corporate Affairs, Companies Act section 62 and ESOP rules: https://www.mca.gov.in'
  - 'Income Tax Department, ESOP perquisite and startup deferral: https://www.incometax.gov.in'
  - 'CRA, Security options deduction: https://www.canada.ca/en/revenue-agency.html'
  - 'IRS, Topic 427 Stock options: https://www.irs.gov/taxtopics/tc427'
---

<!--fig:country-->

**Module 10 · about 15 minutes.** You'll set up a fair option plan and explain to an employee exactly when they will pay tax.

<div class="bigidea">Options let employees buy shares later at today’s price; they share in growth, and the tax comes at exercise or sale depending on the country.</div>

## 1. How options work

An **option** is the right to buy a share later at a fixed **strike price**, usually the share's value on the grant date. Options **vest** like founder shares (4 years, 1-year cliff). Once vested, the employee can **exercise** (pay the strike price and get shares), and later **sell** them, usually only when the company is sold or lists.

```math
\text{gain} = (\text{sale price} - \text{strike price}) \times \text{number of shares}
```

Set up an **option pool** (10 % to 20 % of the company) and a written **plan** approved by the board and shareholders before you promise options to anyone.

## 2. When the tax comes

<!--fig:esop-tax-->

### Watch it happen

<div class="steps">
<div class="step"><p><b>Grant:</b> 10,000 options at a strike of 10, the share value today. No tax.</p></div>
<div class="step"><p><b>Vest:</b> over 4 years, the options become exercisable. No tax.</p></div>
<div class="step"><p><b>Exercise:</b> pay 100,000 for 10,000 shares now worth 40 each. The 300,000 spread is taxed as pay in India (unless deferred), deferred to sale for a Canadian CCPC, and not taxed for a US ISO (AMT aside).</p></div>
<div class="step"><p><b>Sale:</b> the company is bought at 100 a share. The gain above the exercise value (or above the strike, for a US ISO) is taxed as capital gain.</p></div>
</div>


<div class="cc" data-cc="in">

ESOPs are issued under section 62 of the Companies Act and the share capital rules (special resolution, minimum 1-year vesting). At **exercise**, the difference between the share's fair value and the price paid is a **perquisite**, taxed as salary and deducted through payroll. Employees of startups certified under 80-IAC can **defer** that tax until the earliest of 48 months from the end of the year, sale of the shares, or leaving the company. At **sale**, the gain over the exercise-date value is capital gain: 12.5 % for unlisted shares held over 24 months. Founders of DPIIT startups can hold ESOPs for 10 years from incorporation.

</div>

<div class="cc" data-cc="ca">

At **exercise**, the **stock option benefit** (value minus strike) is employment income, with a **50 % deduction** if the strike was at least the share value at grant. For a **CCPC**, the benefit is taxed only when you **sell**, and the deduction applies if you held the shares 2 years. Any later rise is a capital gain, half taxable. For non-CCPC employers, the deduction is limited on $200,000 of options vesting each year.

</div>

<div class="cc" data-cc="us">

**ISOs** (incentive stock options, employees only): no regular tax at exercise, though the spread counts for the **alternative minimum tax**; if you sell at least 2 years after grant and 1 year after exercise, the whole gain is long-term capital gain. **NSOs** (anyone, including advisers): the spread at exercise is wages, with withholding; later gain is capital gain. A **409A valuation** sets a defensible strike price. After leaving, employees usually have 90 days to exercise ISOs.

</div>

> **Key idea:** Exercising can create a tax bill before any shares can be sold. Explain this to every employee, and consider longer exercise windows or the startup deferral where available.

## 3. Making options mean something

- Give each employee a short **grant letter**: number of options, strike price, vesting, how long they have to exercise after leaving.
- Show the **percentage** of the company, not just the number of options.
- Refresh grants for long-serving staff, and update the cap table with every grant (Lesson 6.6).

<div class="meaning">

<dl>
<dt>Option</dt><dd>the right to buy a share at a fixed price later</dd>
<dt>Strike price</dt><dd>the fixed price, usually the share value at grant</dd>
<dt>Exercise</dt><dd>paying the strike price to get the shares</dd>
<dt>Perquisite / option benefit</dt><dd>India / Canada: the value above the strike at exercise, taxed as pay</dd>
<dt>ISO / NSO</dt><dd>USA: tax-favoured employee options / ordinary options</dd>
<dt>What it means for you</dt><dd>Set up the pool and plan before promising options, give every grant in writing with the percentage it represents, and explain when the tax comes.</dd>
</dl>

</div>

<div class="problem" data-problem="employee-stock-options-perquisite"></div>

## 4. Worked example

*Made-up employee.* Priya, an engineer at a Bengaluru startup, exercises 10,000 options at ₹10 when shares are valued at ₹40: a perquisite of ₹3 lakh, about ₹93,600 tax at her 31.2 % rate. Her startup has the 80-IAC certificate, so the tax is deferred. Three years later the company is bought at ₹100 a share: she pays the deferred tax, plus 12.5 % (and cess) on the ₹6 lakh capital gain.

<div class="myth">

**"Options are free money with no risk."** Exercising costs the strike price and can trigger tax before any shares can be sold, and most startup shares end up worth nothing. Options are a fair bet on the company, not a sure payment.

</div>

## 5. Practice

1. Why is a strike price set at the share's value on the grant date?
2. A US adviser is offered options. ISO or NSO?
3. What can make exercising options risky?

<details>
<summary>Answers</summary>

1. So the employee is rewarded only for growth after they join, and (in the USA and Canada) to keep the favourable tax treatment.
2. NSO: ISOs are only for employees.
3. Paying the strike price and possibly tax before the shares can be sold, with no guarantee they will ever be worth more.
</details>

<div class="keypoints">

- Options vest like founder shares; once vested they can be exercised at the strike price.
- India: perquisite taxed as salary at exercise (deferral for certified startups); later gain is capital gain.
- Canada: benefit with a 50 % deduction; CCPC employees are taxed only when they sell.
- USA: ISOs avoid regular tax at exercise (AMT may apply); NSO spread is wages; a 409A valuation sets the strike.
- Grant letters should state the number, strike, vesting, exercise window and percentage.

</div>

**Next:** [When a co-founder leaves](/learn/courses/startup/disputes-exits/).

**New words:** *option*, *strike price*, *exercise*, *option pool*, *perquisite*, *stock option benefit*, *ISO / NSO*, *409A valuation*, *AMT*.

<p class="su-asof">Rules as of November 2026. Not legal or tax advice.</p>
