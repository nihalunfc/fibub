---
title: 'USA: LLC, C corporation or S corporation'
seoTitle: 'LLC vs C corp vs S corp: which is best for a startup?'
summary: 'In the USA the legal entity (LLC or corporation) and its tax treatment (disregarded, partnership, S corp or C corp) are separate choices. How each is taxed, an estimator that compares the federal tax on the same profit, and who should pick which.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: 'How is a single-member LLC taxed federally by default?'
    choices: ['As a C corporation', 'As a disregarded entity: profit goes on the owner''s Schedule C', 'It pays no tax']
    ans: 1
    why: 'The IRS ignores a single-member LLC for income tax unless it elects otherwise; the owner reports profit on Schedule C.'
  - q: 'Which is a rule for S corporations?'
    choices: ['Any number of foreign shareholders', 'At most 100 shareholders, generally US citizens or residents, and one class of stock', 'Only in Delaware']
    ans: 1
    why: 'S corps are limited to 100 eligible shareholders (no non-resident aliens, generally no companies) and one class of stock.'
  - q: 'Why do venture-backed startups usually choose a Delaware C corp?'
    choices: ['It pays the least tax', 'Investors need preferred stock and options, and expect Delaware law; S corps and LLCs don''t fit their funds', 'It is required by law']
    ans: 1
    why: 'Preferred stock and many investor types are not allowed in an S corp, and LLCs create tax problems for many funds. Delaware law is familiar to investors.'
sources:
  - 'IRS, Limited liability company (LLC): https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc'
  - 'IRS, S corporations and Form 2553: https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations'
  - 'IRS, Self-employment tax: https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes'
  - 'SSA, Contribution and benefit base (Social Security wage base): https://www.ssa.gov/oact/cola/cbb.html'
  - 'IRS, Qualified business income deduction: https://www.irs.gov/newsroom/qualified-business-income-deduction'
---

<!--fig:country-->

**Module 3 · about 16 minutes · USA focus.** You'll understand the difference between a legal entity and a tax election, and compare LLC, S corp and C corp taxes on your own numbers. (India and Canada readers: the ideas of "pass-through" and "double tax" come back in Module 8.)

## 1. Two separate choices

In the USA you choose:

1. **The legal entity** under state law: LLC or corporation. This decides liability protection and paperwork.
2. **The tax treatment** with the IRS. An LLC is taxed by default as a sole proprietorship (one member, "disregarded entity") or partnership (two or more), but can elect to be taxed as a corporation (Form 8832) and then as an S corp (Form 2553). A corporation is a C corp unless it elects S status.

So "an LLC taxed as an S corp" is a real and common thing.

## 2. The three tax treatments

- **Pass-through (sole prop / LLC / partnership).** Profit is taxed once, on the owners' personal returns, plus **self-employment tax** of 15.3 % (Social Security 12.4 % up to the wage base of **$184,500 for 2026**, Medicare 2.9 % on everything) on about 92.35 % of net earnings. Owners may deduct up to 20 % of qualified business income (QBI), now permanent.
- **S corporation.** Still pass-through for income tax, but owners who work in the business must take a **reasonable salary** through payroll. Payroll tax applies to the salary; the rest of the profit passes through without self-employment tax. That is the saving.
- **C corporation.** The company pays **21 %** on its profit. When it pays dividends, shareholders pay tax again (qualified dividends at 0, 15 or 20 %). Profit kept in the company is taxed only once, for now.

<!--fig:us-entity-tax-->

> **Key idea:** The S corp saving is roughly 15.3 % of the profit above your reasonable salary, minus the extra cost of payroll and a separate return. It rarely pays below about $40,000 to $60,000 of profit.

## 3. Who picks what

| Situation | Usual choice |
|---|---|
| Solo freelancer or small business, modest profit | Single-member LLC (Schedule C) |
| Partners in a service or local business | Multi-member LLC (Form 1065) |
| Profitable owner-operator, profit well above a fair salary | LLC or corporation with an S election |
| Raising venture capital, stock options for staff | Delaware C corporation |
| Founder hoping for a big tax-free exit | C corp for **QSBS**: gains on qualified small business stock held long enough can be excluded (for stock issued after 4 July 2025: 50 % after 3 years, 75 % after 4, 100 % after 5, up to $15 million or 10 times basis) |

S corps cannot have more than 100 shareholders, non-resident alien shareholders or more than one class of stock, so they don't work with most investors. Founders who are not US citizens or green card holders and don't live in the USA cannot own S corp shares.

## 4. Worked example

*Made-up numbers, using the estimator's simple method (one 22 % rate on all income, no state tax).* Carla's design LLC makes $120,000 profit.

- **Single-member LLC:** self-employment tax ≈ $16,950; income tax on the rest after the half-SE deduction and the QBI deduction ≈ $19,630. Total ≈ **$36,600**.
- **S corp with a $60,000 salary:** payroll tax $9,180; income tax on salary plus pass-through profit after QBI ≈ $22,950. Total ≈ **$32,100**, before about $1,500 to $3,000 a year for payroll and the 1120-S return.
- **C corp, same salary, the rest paid out as dividends:** payroll $9,180, income tax on salary $13,200, corporate tax ≈ $11,640, dividend tax ≈ $6,570. Total ≈ **$40,600**.

The S election saves Carla about $4,500 before its extra costs, so roughly $1,500 to $3,000 a year net. At $200,000 profit the saving grows a lot. Real brackets are progressive and state taxes differ, so check with a CPA.

## 5. Practice

1. What form does an LLC file to be taxed as an S corp?
2. Why must an S corp owner take a salary?
3. A Delaware C corp with $50,000 profit pays how much federal corporate tax?

<details>
<summary>Answers</summary>

1. Form 2553 (an LLC electing S status is treated as also electing corporate classification, so Form 8832 isn't usually needed).
2. The IRS requires reasonable pay for work done, so owners can't avoid payroll tax by taking everything as distributions.
3. 21 % × $50,000 = $10,500.
</details>

**Next:** [Choosing your structure](/learn/courses/startup/structure-chooser/). Estimate your take-home with [[us-paycheck]].

**New words:** *disregarded entity*, *pass-through*, *self-employment tax*, *reasonable salary*, *double taxation*, *QSBS*, *Form 2553*.

<p class="su-asof">Federal rules for tax year 2026, as of November 2026. Not tax advice.</p>
