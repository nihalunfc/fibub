---
title: 'Break-even: when local becomes cheaper'
summary: Work out how many months it takes for a local machine to cost less than the plan or API spend it replaces, for light, medium and heavy users, with a calculator in your own currency.
minutes: 20
updated: 2026-11-22
sources:
  - 'Hardware prices: prices.ts, checked 18 November 2026 (Lessons 5.1 to 5.4)'
  - 'Plan prices: prices.ts, checked 19 November 2026 (Lesson 16.1 sources)'
  - 'Home electricity prices: Lesson 6.2 sources'
  - 'Brealey, R. A., Myers, S. C. and Allen, F., Principles of Corporate Finance, McGraw-Hill (the payback period, in the chapter on investment decision rules)'
  - 'U.S. Energy Information Administration, Electric Power Monthly (average retail electricity prices, official page), https://www.eia.gov/electricity/monthly/'
quiz:
  - q: When does local never become cheaper on money alone?
    choices: ['When the electricity each month costs as much as the plan it replaces', 'When the hardware is cheap', 'When you use it a lot']
    ans: 0
    why: If running costs match the plan, the hardware is never paid back.
  - q: A heavy user cancels a US$200 plan and buys a US$4,000 box. Roughly when does it pay back, ignoring power and resale?
    choices: ['About 20 months', 'About 2 years and 9 months', 'Never']
    ans: 0
    why: 4,000 ÷ 200 = 20 months. Power adds a little; resale takes some off.
  - q: Why might the break-even answer mislead you even if the maths is right?
    choices: ['A local model may not do the job as well as the cloud model you dropped', 'Calculators are always wrong', 'Months have different lengths']
    ans: 0
    why: Money is only half the comparison. Lesson 17.1 covers quality.
---

**Module 16 · about 20 minutes · read first: 16.1 and 16.3.** You'll be able to work out, in your currency, when a local machine pays for itself.

<div class="bigidea">A local machine pays for itself when the money you stop spending each month has added up to what the machine really cost you.</div>

## 1. Why this matters

Everyone asks the same question: "Will it pay for itself?" The answer depends on three numbers: what you spend on cloud AI now, what the hardware really costs you (Lesson 16.3), and what it costs to run. This lesson turns them into a number of months, called the **break-even** or **payback period**.

## 2. The calculator

Pick your country; the plan, hardware and electricity price fill in from this course's price file, and you can type your own.

<!--fig:break-even-->

The solid line is local: it starts at the hardware price (after resale) and climbs slowly with electricity. The dashed line is the plan: it starts at zero and climbs every month. Where they cross is the break-even.

<div class="steps">
<div class="step"><p><b>What they spend now.</b> A 6-person team in Toronto pays for six US$20 plans: about <b>CA$190 a month</b> with HST and exchange fees.</p></div>
<div class="step"><p><b>What they buy.</b> A 64 GB Mac mini for the office at about CA$3,800. They expect to sell it for 40% later, so its real cost is 3,800 × 0.6 = <b>CA$2,280</b>.</p></div>
<div class="step"><p><b>What they still pay.</b> They keep two plans for the hardest jobs (about CA$63) and the machine adds about CA$3 of power. Monthly saving: 190 − 63 − 3 = <b>CA$124</b>.</p></div>
<div class="step"><p><b>Divide.</b> 2,280 ÷ 124 ≈ <b>18 months</b>. After that, every month saves CA$124, and client files stay in the office from day one.</p></div>
</div>

```math
\text{months} = \frac{H - S}{C - R}
```

<div class="meaning">

<dl>
<dt>H − S</dt><dd>what the machine really costs: price minus what you expect to sell it for</dd>
<dt>C</dt><dd>the cloud spend you stop each month (plans cancelled or API bill avoided)</dd>
<dt>R</dt><dd>what running locally costs each month: power, plus any plans you keep</dd>
<dt>C − R</dt><dd>the saving each month; if it is zero or less, the machine never pays back</dd>
<dt>Physical meaning</dt><dd>It is a race between a head start and a speed. The cloud starts at zero but climbs fast; local starts high but climbs slowly. Break-even is the month the slow climber is caught, and after it every month is money kept.</dd>
</dl>

</div>

<div class="problem" data-problem="break-even-months"></div>

## 3. Three typical users

*Made-up usage, US list prices.*

| User | Cloud spend now | Local choice | Break-even |
|---|---|---|---|
| **Light:** a few chats a day | Free tier, or Google AI Plus at US$4.99 | Existing laptop, small model | Nothing to buy: free from day one, but the plan was cheap too |
| **Medium:** daily writing and coding | One US$20 plan | Mac mini 32 GB, counting only the US$400 extra | About 20 months on the full US$400, about 12 counting 40% resale; power is pennies |
| **Heavy:** agents and long jobs all day | US$200 plan or API spend | 128 GB AI box at US$3,999 to US$4,699 | 20 to 26 months; faster if the API bill was higher |

Two lessons from the table. Medium users rarely save much money by replacing one US$20 plan; they go local for privacy, offline use or no limits. Heavy users and teams are where local pays back clearly, especially when one machine replaces several seats (Lesson 5.5).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** break-even is when the money saved each month has paid back the money spent up front.

**Equation:** months to break even = (hardware − resale) ÷ (cloud spend per month − local running cost per month). If the bottom is zero or less, it never breaks even.

**Analogy:** solar panels. They cost a lot up front and save a little each month; the question is how many months until the savings catch up.

**Try it:** a ₹1,50,000 machine, 30% resale, replacing ₹10,699 a month, ₹500 a month electricity? ((1,50,000 × 0.7) ÷ (10,699 − 500) = 1,05,000 ÷ 10,199 ≈ 10 months.)
</details>

<div class="myth">

**"If it pays back on paper, going local is the right call."** Money is only half the comparison. If the local model does the job worse than the cloud model you dropped, the extra checking and fixing can eat the saving. Run the quality test in Lesson 17.1 before you trust the break-even.

</div>

## 4. Worked example

*Made-up team, real list prices.* A 6-person team in Toronto pays for six US$20 plans (US$120 a month, plus HST and exchange fees, about CA$190). They buy a 64 GB Mac mini for the office at about CA$3,800 and keep two plans for the hardest jobs (about CA$63 a month). Saving: about CA$127 a month, minus about CA$3 of electricity. Break-even: 3,800 × 0.6 (after 40% resale) ÷ 124 ≈ 18 months. They also gain one place where client files stay in the office.

## 5. Practice

1. Run the calculator with your own plan and the machine you would buy.
2. What happens to break-even if you keep one cloud plan instead of cancelling all?
3. Find the electricity price at which the RTX 5090 option never breaks even against a US$20 plan, at 3 hours a day.

<details>
<summary>Answers</summary>

1. Your answer; note the date and source of each price.
2. The monthly saving shrinks, so break-even comes later, but you keep the best cloud model for hard jobs.
3. 750 W × 3 h × 30 days = 67.5 kWh a month; 20 ÷ 67.5 ≈ US$0.30 per kWh. Above that, it never pays back on money alone.
</details>

Try question 3 with other machines and hours:

<div class="problem" data-problem="break-even-never-price"></div>

**New words:** *break-even*, *payback period*, *seat* (one person's plan).

<div class="keypoints">

- Break-even months = (hardware − resale) ÷ (cloud spend stopped − local running cost each month).
- If running costs match or beat the cloud spend, the machine never pays back on money alone.
- One US$20 plan rarely pays back fast; heavy users and teams replacing several seats pay back in one to two years.
- Keeping one cloud plan for hard jobs slows break-even but keeps the strongest model on hand.
- Check quality too: a cheaper answer that needs fixing is not cheaper.

</div>
