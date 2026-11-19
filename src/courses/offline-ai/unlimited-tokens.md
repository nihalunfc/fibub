---
title: 'Why your own machine makes tokens "unlimited"'
seoTitle: 'Unlimited AI tokens on your own machine | Offline AI'
summary: Subscriptions cap use per few hours or per week, and APIs charge per token. On your own machine the only limits are speed, memory and electricity. Work out your own numbers.
minutes: 20
updated: 2026-11-19
sources:
  - 'Codex usage on ChatGPT plans is metered per 5-hour window and varies by model (official), checked 18 November 2026, https://learn.chatgpt.com/docs/pricing'
quiz:
  - q: What limits how many tokens you can use on your own machine?
    choices: ['A monthly quota from the model maker', 'Its writing speed, memory, and the electricity you pay for', 'Your internet plan']
    ans: 1
    why: Nobody meters local use. The ceiling is how many tokens per second the machine produces, all day if you like.
  - q: Your machine writes 20 tokens per second. Running all day, how many output tokens is that?
    choices: ['About 17,000', 'About 1.7 million', 'About 170 million']
    ans: 1
    why: 20 × 86,400 seconds ≈ 1.73 million tokens a day.
  - q: When is unlimited local use most valuable?
    choices: ['Occasional short questions', 'Large batch jobs, long agent runs and heavy daily use that would hit plan limits', 'Never']
    ans: 1
    why: Light users rarely hit limits; heavy and automated use is where caps and per-token prices bite.
---

**Module 3 · about 20 minutes · read first: 3.4 and 3.5.** You'll be able to compare your monthly token use with plan limits, API prices and the cost of running it yourself.

## 1. Why this matters

"Unlimited" is one of the strongest reasons to run AI yourself, but it is not "free" and not "infinite". Putting real numbers on it shows whether it matters for you.

## 2. Three ways to pay for tokens

- **Subscriptions** (Claude, ChatGPT, Google plans): a flat monthly price with usage limits per few hours or per week. For example, Codex use on ChatGPT plans is metered per 5-hour window, and the allowance varies by model.
- **APIs:** pay per million input and output tokens, no flat fee.
- **Your machine:** pay once for hardware, then electricity. No meter, no window, no throttling. The ceiling is tokens per second × seconds in the day.

## 3. Your numbers

Enter your own use and prices. The example numbers are made up; real cloud prices are on each provider's pricing page, and your electricity price is on your bill.

<!--fig:token-budget-->

## 4. What "unlimited" really means

- **Volume:** a machine writing 20 tokens per second can produce about 1.7 million output tokens a day running flat out.
- **Freedom:** run a 6-hour batch job, retry 50 times, let an agent loop all night (Module 13), without watching a quota.
- **Still bounded:** by speed (one big job at a time on one machine), memory (model size) and electricity (Module 6).
- **Not counted here:** the price of the hardware. Module 16 adds it and works out break-even.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** local cost per token is energy per token times electricity price.

**Equation:** cost per million output tokens = (watts ÷ tokens per second) × (10⁶ ÷ 3.6 × 10⁶) × price per kWh = watts ÷ (3.6 × tokens per second) × price per kWh.

**Analogy:** a home bread maker: after you buy it, each loaf costs only flour and power, and you can bake as many as the hours allow.

**Try it:** 150 W at 20 tokens per second and 0.20 per kWh? (150 ÷ 72 ≈ 2.08 kWh per million tokens, about 0.42 per million.)
</details>

## 5. Worked example

*Made-up numbers.* A researcher tags 40,000 abstracts a month, about 8 million output tokens. Her desktop writes 40 tokens per second at 300 W: about 56 hours and 17 kWh a month, so about 3.40 of electricity at 0.20 per kWh. The same job on a plan would hit limits within days; on an API it would cost whatever 8 million output tokens cost there.

## 6. Practice

1. Put your own daily use into the calculator.
2. At 10 tokens per second and 60 W, what is the electricity per million tokens at your price?
3. Name one job you would run locally only because there is no limit.

<details>
<summary>Answers</summary>

1. Most light users find the running cost tiny; the question becomes hardware cost (Module 16).
2. 60 ÷ 36 ≈ 1.67 kWh per million tokens, times your price per kWh.
3. Examples: re-tagging an archive, trying 20 prompt versions on 500 items, an agent that retries until tests pass.
</details>

**New words:** *quota* or *usage limit*, *per-token pricing*, *kWh* (kilowatt-hour, the unit on your electricity bill).
