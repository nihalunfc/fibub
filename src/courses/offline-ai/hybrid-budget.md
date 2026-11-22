---
title: The hybrid budget most people should use
summary: Four sample budgets (student, professional, small team, heavy builder) that mix free local AI with just enough cloud, in India, Canada, the USA and the UK, and how to review them every few months.
minutes: 20
updated: 2026-11-22
sources:
  - 'Plan prices: prices.ts, checked 19 November 2026 (Lesson 16.1 sources)'
  - 'Hardware prices: prices.ts, checked 18 November 2026 (Lessons 5.1 to 5.4)'
  - 'Anthropic Claude API pricing (official page), https://platform.claude.com/docs/en/about-claude/pricing'
  - 'OpenAI API pricing (official page), https://openai.com/api/pricing/'
quiz:
  - q: For most single professionals, what is usually the best value?
    choices: ['A local model for routine and private work, plus one standard plan for the hardest jobs', 'Three heavy plans', 'No AI at all']
    ans: 0
    why: Local takes the volume and private work; one plan covers what local cannot do well. That also stretches the plan's usage window.
  - q: Why review the budget every three to six months?
    choices: ['Prices, plans and open models change fast', 'The law requires it', 'Machines expire']
    ans: 0
    why: A new open model can make a plan unnecessary; a price change can flip a break-even.
  - q: What should a team set on every API key?
    choices: ['A monthly spending cap', 'A funny name', 'Nothing']
    ans: 0
    why: A cap stops a runaway script or agent from creating a large bill.
---

**Module 16 · about 20 minutes · read first: 16.5.** You'll be able to set an AI budget that mixes local and cloud, and know when to change it.

<div class="bigidea">For most people the best value is a local model for the daily, private and high-volume work plus one modest cloud plan for what local cannot do, reviewed every few months.</div>

## 1. Why this matters

For most people the cheapest and best answer is not "all cloud" or "all local", but a mix. A local model does the daily, private and high-volume work for the cost of electricity, and a modest cloud plan covers what local cannot do. This lesson turns that into numbers.

It is like a household food budget: cook at home most days, and eat out on purpose.

## 2. Four sample budgets

*Prices from Lesson 16.1, checked 19 November 2026. Usage is made up.*

| Who | Local part | Cloud part | Monthly (USA / India) |
|---|---|---|---|
| **Student** | Existing laptop with Gemma 4 E4B or 12B (Module 9) | Free tiers; one month of a standard plan in exam season | about US$0 to 2 / ₹0 to 170 a month on average |
| **Professional** | 32 GB Mac mini or 16 GB graphics card, 12B to 27B model | One standard plan (Claude Pro or ChatGPT Plus) | about US$20 + power / ₹2,000 + power |
| **Small team of 8** | One 64 to 128 GB office server (Lesson 5.5) | Two standard plans for the hardest work, an API key with a cap for scripts | about US$40 to 60 + power, after the server |
| **Heavy builder** | 128 GB box or a big graphics card for agents and batch jobs | One heavy plan or API with a cap | about US$100 to 200 + power |

In Canada and the UK, use the same structure: most plans are charged in US$ plus tax (Lesson 16.1).

<div class="steps">
<div class="step"><p><b>Before.</b> Priya, a data analyst in Pune, pays ₹1,999 for ChatGPT Plus and ₹1,950 for Google AI Pro: <b>₹3,949 a month</b>.</p></div>
<div class="step"><p><b>Move the routine work.</b> SQL help and report drafts go to a local 12B model on her 16 GB laptop. Her work data now stays on the laptop.</p></div>
<div class="step"><p><b>Cancel one plan.</b> With the routine work gone, she does not need two plans. She cancels Google AI Pro and keeps Plus for hard problems: <b>₹1,999</b> plus a few rupees of power.</p></div>
<div class="step"><p><b>The saving.</b> ₹1,950 a month × 12 = about <b>₹23,000 a year</b>, and her Plus allowance now lasts longer, because it only gets the hard jobs.</p></div>
</div>

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

## 3. Rules that keep it under control

1. **Local by default.** Every new job tries local first (Lesson 15.6).
2. **One cloud plan, not three.** Pick the one whose strengths you use most.
3. **Caps on every API key** in the provider's dashboard, so a runaway script cannot run up a big bill.
4. **Track it:** a one-line monthly note of plan costs, API spend and power.
5. **Review every 3 to 6 months:** new open models (Lesson 7.3) and new prices may change the answer.

```math
\text{monthly AI cost} = \text{hardware share} + \text{power} + \text{plans kept} + \text{API spend}
```

<div class="meaning">

<dl>
<dt>hardware share</dt><dd>the machine's real cost spread over the months you keep it (Lesson 16.3)</dd>
<dt>power</dt><dd>the electricity it uses each month</dd>
<dt>plans kept</dt><dd>the cloud plans you still pay for, ideally one</dd>
<dt>API spend</dt><dd>pay-per-token use by scripts, with a cap set on each key</dd>
<dt>Physical meaning</dt><dd>Two pipes fill the same bucket. The local pipe is fixed and cheap however much flows through it; the cloud pipe is charged by the litre. A good budget sends the steady flow through the local pipe and opens the cloud pipe only for what the local one cannot carry.</dd>
</dl>

</div>

<div class="problem" data-problem="hybrid-budget-saving"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** spend cloud money only where it buys something local cannot.

**Equation:** monthly AI cost = local hardware share + power + plans kept + API spend; aim to keep the cloud part for jobs that fail the local quality test.

**Analogy:** a household food budget: cook at home most days, eat out on purpose.

**Try it:** a team with 8 plans at US$20 drops to 2 plans and an office machine costing US$60 a month over its life. What is the saving? (160 − (40 + 60) = US$60 a month, plus the privacy.)
</details>

<div class="myth">

**"More plans means better coverage."** Two or three overlapping plans mostly buy the same thing twice. Once routine work runs locally, one plan for the hardest jobs usually covers the rest, and its usage window lasts longer because it only gets the hard jobs.

</div>

## 4. Worked example

*Made-up person, real list prices.* Priya, a data analyst in Pune, paid ₹1,999 for ChatGPT Plus and ₹1,950 for Google AI Pro (₹3,949 a month). She moves routine SQL help and report drafts to a local 12B model on her 16 GB laptop, cancels Google AI Pro, and keeps Plus for hard problems. New spend: ₹1,999 plus a few rupees of power, saving about ₹23,000 a year, and her work data stays on her laptop.

## 5. Practice

1. Write your own budget in the table's format.
2. Which plan would you keep if you could keep only one, and why?
3. Put a date in your calendar for your first review.

<details>
<summary>Answers</summary>

1. Your answer; include the date you checked the prices.
2. The one you use for the work local fails at most often.
3. Three months from today is a good start.
</details>

**New words:** *hybrid budget*, *spending cap*, *review cycle*.

<div class="keypoints">

- The usual best value: local for routine, private and high-volume work, plus one standard plan for the hardest jobs.
- Monthly AI cost = hardware share + power + plans kept + API spend.
- Put a monthly spending cap on every API key.
- Keep a one-line monthly note of what you spend, and review the mix every 3 to 6 months.

</div>
