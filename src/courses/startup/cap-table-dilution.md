---
title: 'The cap table and dilution'
seoTitle: 'Cap table and dilution explained (with a simulator)'
summary: 'The cap table lists who owns what in your company. How shares, options and investor rounds change it, why the option pool usually comes out of the founders'' share, how dilution works across seed and Series A, and why a smaller slice can be worth more.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: 'Founders own 100 %. They raise money for 20 % of the company. What do they own now?'
    choices: ['100 %', '80 %', '120 %']
    ans: 1
    why: 'New shares are issued to the investor, so the founders'' share falls to 80 %.'
  - q: 'Investors ask for the option pool "in the pre-money". Who pays for it?'
    choices: ['The investors', 'The existing shareholders, mostly the founders', 'The employees']
    ans: 1
    why: 'A pool created before the investment dilutes only the shareholders who were there before the round.'
  - q: 'Can dilution make founders richer?'
    choices: ['No, never', 'Yes, if the price per share rises: a smaller percentage of a more valuable company', 'Only in India']
    ans: 1
    why: 'Raising at a higher valuation raises the value of every existing share even as the percentage falls.'
sources:
  - 'SEC, Investor bulletins on private company stock: https://www.investor.gov'
  - 'MCA, register of members (Companies Act section 88): https://www.mca.gov.in'
  - 'Corporations Canada, securities register: https://ised-isde.canada.ca/site/corporations-canada/en'
---

<!--fig:country-->

**Module 6 · about 14 minutes · school maths.** You'll read a cap table and predict how each round changes everyone's share.

<div class="bigidea">A cap table shows who owns what. Each round adds new shares, so everyone’s percentage falls; what matters is whether the value of your stake rises.</div>

## 1. What a cap table is

A **capitalisation table** lists every holder of shares, options, SAFEs and notes, and their percentage on a **fully diluted** basis (as if all options and convertibles became shares). It is the company's legal share register plus a model of the future. Keep it exact: mistakes surface painfully at due diligence.

<div class="cc" data-cc="in">

The legal record is the **register of members** (Companies Act section 88) and filings such as PAS-3 and the annual return; ESOPs come under the company's scheme approved by special resolution.

</div>

<div class="cc" data-cc="ca">

The legal record is the **securities register** in the minute book, alongside the ISC register (Lesson 4.4).

</div>

<div class="cc" data-cc="us">

The legal record is the **stock ledger** kept by the corporation (often in cap table software), with board consents for every issuance.

</div>

## 2. Dilution, round by round

<!--fig:cap-table-->

Every new share issued shrinks everyone else's percentage. The questions that matter: **how much** are you selling, at **what price**, and **who pays** for the option pool?

> **Key idea:** Watch two numbers: percentage and value. Founders typically own 50 to 70 % after a seed round and less after Series A, and that can still be a great outcome if the price per share keeps rising.

### Watch it happen

<div class="steps">
<div class="step"><p><b>Start:</b> two founders own 60 % and 40 % of 10 million shares.</p></div>
<div class="step"><p><b>Option pool:</b> 10 % is added for employees: founders become 54 % and 36 %.</p></div>
<div class="step"><p><b>Seed:</b> investors buy 20 % of the company after the round: founders now 43.2 % and 28.8 %.</p></div>
<div class="step"><p><b>Value:</b> the price per share rose from almost nothing to $1, so each founder’s stake is worth millions on paper.</p></div>
</div>

<div class="meaning">

<dl>
<dt>Cap table</dt><dd>the list of shareholders, shares and percentages</dd>
<dt>Fully diluted</dt><dd>counting all options, SAFEs and convertibles as if converted</dd>
<dt>Dilution</dt><dd>your percentage falling as new shares are issued</dd>
<dt>Pre-money / post-money</dt><dd>company value before / after the new investment</dd>
<dt>Option pool</dt><dd>shares reserved for employee options</dd>
<dt>What it means for you</dt><dd>Keep a fully diluted cap table from day one, model every round before signing, and watch both your percentage and the price per share.</dd>
</dl>

</div>

<div class="problem" data-problem="cap-table-dilution-after"></div>

Watch the founders' share fall round by round, then compare it with what the stake is worth.

<div class="steps" data-fig="@biz-dilution-steps">

<div class="step">Two founders hold the shares, 60% and 40%.</div>

<div class="step">An option pool of 10% is created before the investor arrives. Only the existing holders are diluted.</div>

<div class="step">Seed round: $1M buys 20% of the company, and the price per share is set.</div>

<div class="step">Series A: $5M for 25%. Founder A holds less than a third, but the stake is worth much more.</div>

</div>

## 3. Worked example

Default numbers in the simulator: 8,000,000 founder shares; 10 % pool; seed of 1,000,000 at 4,000,000 pre-money; Series A of 5,000,000 at 20,000,000 pre-money.

- After seed: seed investors 20 %, pool 10 %, founders 70 %; price per share 0.4375.
- After Series A: Series A 20 %, founders 56 %; price per share 1.75.
- Founders' stake grows from 3.5 million to 14 million in value while their percentage falls from 100 % to 56 %.

<div class="myth">

**"Dilution is always bad."** A smaller share of a much more valuable company can be worth far more. Dilution is bad only when the money raised does not grow the value enough.

</div>

## 4. Practice

1. You own 60 % and the company sells new shares equal to 25 % of the post-money. Your new share?
2. Why do investors want the option pool in the pre-money?
3. What does "fully diluted" include?

<details>
<summary>Answers</summary>

1. 60 % × 0.75 = 45 %.
2. So the pool's dilution falls on existing shareholders, not on the new investor.
3. All issued shares plus all options (granted and in the pool), warrants, SAFEs and convertible notes as if converted.
</details>

<div class="keypoints">

- A cap table lists every holder, class and percentage, fully diluted.
- New shares dilute everyone in proportion: new % = old % × (1 − new investors’ %).
- Option pools are often created before a round, diluting founders only.
- Founders often own 50 to 70 % after seed.
- Watch percentage and price per share together.

</div>

**Next:** Module 7 starts with [How GST and sales taxes work](/learn/courses/startup/how-gst-works/).

**New words:** *cap table*, *fully diluted*, *dilution*, *option pool*, *stock ledger*, *register of members*.

<p class="su-asof">Updated November 2026. Not legal or investment advice.</p>
