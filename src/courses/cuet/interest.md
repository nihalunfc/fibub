---
title: 'Simple and compound interest'
seoTitle: 'Simple and compound interest for CUET: formulas and tricks'
summary: 'Simple interest grows in a straight line, compound interest on interest. The two formulas with what every symbol means, the 2-year and 3-year difference shortcuts, half-yearly compounding and the rule of 72.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: What is the simple interest on ₹8,000 at 5% a year for 3 years?
    choices: ['₹1,200', '₹1,261', '₹400']
    ans: 0
    why: SI = P × R × T ÷ 100 = 8,000 × 5 × 3 ÷ 100 = ₹1,200.
  - q: What is CI − SI on ₹10,000 at 10% for 2 years?
    choices: ['₹100', '₹200', '₹1,000']
    ans: 0
    why: For 2 years the difference is P(R/100)² = 10,000 × 0.01 = ₹100.
  - q: Roughly how long does money take to double at 8% compound interest a year?
    choices: ['About 9 years', 'About 12.5 years', 'About 6 years']
    ans: 0
    why: Rule of 72, 72 ÷ 8 = 9 years. (At simple interest it would take 100 ÷ 8 = 12.5 years.)
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (numerical ability) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Reserve Bank of India, financial education material on interest https://www.rbi.org.in/financialeducation/'
---

**Module 3 · about 16 minutes.** By the end you will use both interest formulas, the shortcuts for their difference, and know when interest is compounded more than once a year.

<div class="bigidea">Simple interest is paid only on the money you put in; compound interest is also paid on the interest already earned, so it grows faster and faster.</div>

## 1. Two formulas

```math
SI = \frac{P \times R \times T}{100} \qquad A = P\left(1 + \frac{R}{100}\right)^{T}
```

<div class="meaning">

<dl>
<dt>P</dt><dd>principal: the money you start with</dd>
<dt>R</dt><dd>rate of interest per year, in percent</dd>
<dt>T</dt><dd>time in years</dd>
<dt>A</dt><dd>amount: principal plus interest. Compound interest CI = A − P.</dd>
<dt>Physical meaning</dt><dd>simple interest adds the same rupees every year (a straight line); compound interest multiplies by the same factor every year (a curve that bends upward).</dd>
</dl>

</div>

<figure class="fig" data-fig="si-ci"><figcaption>₹10,000 at simple and compound interest. Push the rate and years up and watch the gap grow.</figcaption></figure>

## 2. Shortcuts for the difference

<div class="steps" data-title="Why CI − SI = P(R/100)² for 2 years">
<div class="step">Year 1: both give the same interest, P × R/100.</div>
<div class="step">Year 2: simple interest again gives P × R/100.</div>
<div class="step">Compound interest gives that <em>plus</em> interest on year 1's interest: (P × R/100) × R/100.</div>
<div class="step">So the difference after 2 years is <b>P(R/100)²</b>. For 3 years it is P(R/100)²(3 + R/100).</div>
</div>

<div class="problem" data-problem="ci-minus-si"></div>

## 3. Half-yearly and quarterly

Compounded half-yearly: halve the rate and double the number of periods. ₹10,000 at 10% a year compounded half-yearly for 1 year is 10,000 × 1.05² = ₹11,025, more than ₹11,000 with yearly compounding.

**Rule of 72:** money doubles in about 72 ÷ R years at compound interest. At simple interest, it doubles in exactly 100 ÷ R years.

<div class="myth">

**"10% for 2 years compound is 20%."** It is 1.1² − 1 = 21%. The extra 1% is the interest on the first year's interest. The longer the time, the bigger the gap.

</div>

## 4. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="interest" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- SI = PRT/100 grows in a straight line; A = P(1 + R/100)^T grows faster each year.
- CI − SI for 2 years = P(R/100)²; for 3 years = P(R/100)²(3 + R/100).
- Half-yearly: rate ÷ 2, periods × 2.
- Doubling time: 100/R years simple, about 72/R years compound.

</div>
