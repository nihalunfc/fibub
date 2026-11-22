---
title: 'Profit, loss and discount'
seoTitle: 'Profit, loss and discount tricks for CUET'
summary: 'Cost price, marked price and selling price in one picture: profit and loss percent, mark-up and discount, successive discounts and dishonest-weight questions, solved with multipliers.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: An article bought for ₹500 is sold for ₹575. What is the profit percent?
    choices: ['15%', '13%', '75%']
    ans: 0
    why: Profit = ₹75 and profit percent is always on cost price, 75 ÷ 500 = 15%.
  - q: 'Goods are marked 25% above cost and sold at 20% off. The result is:'
    choices: ['No profit, no loss', '5% profit', '5% loss']
    ans: 0
    why: 1.25 × 0.80 = 1.00.
  - q: 'A shopkeeper sells two items at ₹1,200 each, one at 20% profit and one at 20% loss. Overall he:'
    choices: ['Loses 4%', 'Breaks even', 'Gains 4%']
    ans: 0
    why: Same selling price, same percentage gain and loss always gives a loss of (r/10)² % = 4%.
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (numerical ability) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 3 · about 15 minutes.** By the end you will move between cost, marked and selling prices with multipliers and know the three classic traps.

<div class="bigidea">Profit and loss are percentages of the <em>cost</em> price; discount is a percentage of the <em>marked</em> price. Mixing up the base is the number one mistake.</div>

## 1. Three prices

<figure class="fig" data-fig="price-chain"><figcaption>Mark goods up from cost, then give a discount. The selling price ends above the dashed cost line (profit) or below it (loss).</figcaption></figure>

```math
\text{SP} = \text{CP} \times \left(1 + \frac{\text{markup}}{100}\right)\left(1 - \frac{\text{discount}}{100}\right)
```

<div class="meaning">

<dl>
<dt>CP</dt><dd>cost price: what the seller paid. Profit % and loss % are measured on it.</dd>
<dt>MP</dt><dd>marked price (list price): what the tag says. Discount % is measured on it.</dd>
<dt>SP</dt><dd>selling price: what the buyer actually pays</dd>
<dt>Physical meaning</dt><dd>a mark-up and a discount of the same size never cancel: a 20% mark-up and 20% discount leave a 4% loss.</dd>
</dl>

</div>

<div class="problem" data-problem="markup-discount"></div>

## 2. Three classic traps

<div class="steps" data-title="The traps examiners love">
<div class="step"><b>Same selling price, same % gain and loss.</b> Two items sold at the same price, one at r% profit and one at r% loss: always an overall <b>loss of r²/100 %</b>. At 20%, that is a 4% loss.</div>
<div class="step"><b>Dishonest weights.</b> A grocer sells at cost price but uses a 900 g "kilogram". He gives 900 g and is paid for 1,000 g, so gain = 100 ÷ 900 = <b>11.1%</b> (divide by what he actually gives).</div>
<div class="step"><b>Successive discounts.</b> 20% then 10% is not 30%: 0.8 × 0.9 = 0.72, a single discount of <b>28%</b>.</div>
<div class="step"><b>"Profit on selling price".</b> If a question says the profit is 20% of the selling price, then CP = 80% of SP and profit on cost is 20 ÷ 80 = <b>25%</b>. Read which base it uses.</div>
</div>

<div class="myth">

**"Profit percent is profit ÷ selling price."** Unless the question says otherwise, it is profit ÷ cost price. ₹75 profit on a ₹500 item sold for ₹575 is 15%, not 13%.

</div>

**Try it:** Set three percent changes in a row and compare the result with the sum of the percents.

<figure class="fig" data-fig="@tp-percent-chain"><figcaption>The result is a product of multipliers, which is why +20% then −20% is not zero.</figcaption></figure>

## 3. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="profit-loss" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Profit and loss % are on cost price; discount % is on marked price.
- SP = CP × (1 + mark-up) × (1 − discount), with the percentages as decimals.
- Same SP with r% gain and r% loss: loss of r²/100 %.
- False weight gain = (true − false) ÷ false × 100.
- Successive discounts multiply.

</div>
