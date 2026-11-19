---
title: The full cost of owning the hardware
summary: Price is only the start. Add electricity, your time, extras and upkeep, then subtract what you can sell it for, to get the real monthly cost of a local AI machine.
minutes: 20
updated: 2026-11-19
sources:
  - 'Hardware prices: Lessons 5.1 to 5.4 and their sources (prices.ts, checked 18 November 2026)'
  - 'Home electricity prices: Lesson 6.2 and its sources (Ofgem, Ontario Energy Board, EIA)'
  - 'Compute Market, "GPU Market 2026" (third-party, on used card prices and the memory shortage), updated 1 November 2026, https://www.compute-market.com/blog/gpu-market-trends-pricing-2026'
quiz:
  - q: Which cost do people most often leave out when comparing a local machine with a plan?
    choices: ['Their own time for setting up and looking after it', 'The price on the box', 'The plan price']
    ans: 0
    why: Setup, updates and fixing problems take hours. Count them, even at a modest hourly value.
  - q: Why does resale value matter so much for graphics cards in 2026?
    choices: ['Memory shortages have kept used card prices high, so you get a good share back', 'Used cards are worthless', 'You cannot sell them']
    ans: 0
    why: Strong resale lowers the real cost. It can fall quickly when new generations arrive, so do not count on it too much.
  - q: You would buy a new laptop anyway, and pay extra for more memory to run models. What should you count as the AI cost?
    choices: ['Only the extra for the memory upgrade', 'The full laptop price', 'Nothing']
    ans: 0
    why: Count only what you pay because of AI. The rest you would have spent regardless.
---

**Module 16 · about 20 minutes · read first: 5.6 and 6.2.** You'll be able to work out what a local AI machine really costs you each month.

## 1. Why this matters

"A US$1,300 Mac mini against a US$20 plan" sounds like 65 months to pay off. The real answer can be much shorter (you sell the machine later, you use it for other work) or much longer (electricity, your time, a second machine). This lesson lists every piece, so the break-even in Lesson 16.4 is honest.

## 2. The pieces

| Piece | What to count | Typical size |
|---|---|---|
| **Hardware** | Only what you pay because of AI: a whole box, a graphics card, or the extra for more memory | Biggest single item |
| **Extras** | Bigger power supply, more storage for models, a UPS, a fan or vent, a plug-in power meter | 5 to 20% of the hardware |
| **Electricity** | Watts × hours × price (calculator below) | Small for Macs and boxes; noticeable for big graphics cards used many hours |
| **Your time** | Setup, updates, fixing things, trying new models | A weekend to start, then an hour or two a month |
| **Resale** | What you can sell it for after 2 to 4 years | Often 30 to 60% for graphics cards and Macs |
| **What it replaces** | Plans or API spend you cancel | The saving |

## 3. Electricity

<!--fig:power-bill-->

## 4. Putting it together

Spread the hardware over the years you will keep it, take off the resale value, then add the monthly running costs. That gives a monthly cost of owning, which you can compare straight with a plan's monthly price.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total cost of ownership counts every cost over the life of the machine, minus what you get back at the end.

**Equation:** monthly cost = (hardware + extras − resale) ÷ months kept + electricity per month + upkeep hours × your hourly value.

**Analogy:** owning a car is not just the sticker price: fuel, insurance and servicing, minus what you sell it for.

**Try it:** 1,300 machine, 100 extras, 500 resale after 36 months, 2 a month electricity, 1 hour a month at 15 an hour? ((1,400 − 500) ÷ 36 = 25; + 2 + 15 = 42 a month.)
</details>

## 5. Worked example

*Made-up usage, prices from Lesson 5.2 (USA).* Marcus buys a Mac mini M6 with 32 GB (US$1,299) instead of the 16 GB model he would have bought anyway (US$899), so the AI cost is US$400. He expects to sell it for 40% of its price after three years, so he gets back about US$160 of the extra. Electricity: 25 W × 3 h × 30 days × US$0.182 per kWh ≈ US$0.41 a month. His time he counts as zero because he enjoys it. Monthly cost of owning: (400 − 160) ÷ 36 + 0.41 ≈ US$7. Against a US$20 plan he would cancel, local is cheaper from day one. If he had counted the full US$1,299 and no resale, it would have looked like US$36 a month.

## 6. Practice

1. List every piece for the machine you would buy, with your own numbers.
2. Why is "only the extra" the right way to count when you would buy a computer anyway?
3. What happens to the monthly cost if you keep the machine five years instead of three?

<details>
<summary>Answers</summary>

1. Use the table in section 2 and the calculator in section 3.
2. Because the rest would be spent with or without AI; counting it makes local look more expensive than it is.
3. The hardware share falls (more months), but resale is usually lower and the machine feels slower against new models. Often it still comes out cheaper per month.
</details>

**New words:** *total cost of ownership*, *resale value*, *upkeep*, *UPS* (a battery that keeps the machine running through short power cuts).
